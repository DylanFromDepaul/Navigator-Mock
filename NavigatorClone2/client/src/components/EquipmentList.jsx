import React, { useState } from 'react';
import { 
  List, ListItem, ListItemText, ListItemSecondaryAction, 
  IconButton, TextField, makeStyles, Typography, Box,
  Collapse, ListItemIcon
} from '@material-ui/core';
import { Search, Add, ExpandMore, ExpandLess, Folder } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  searchContainer: {
    padding: theme.spacing(1, 2),
    backgroundColor: '#f5f5f5',
  },
  searchField: {
    marginBottom: theme.spacing(1),
  },
  categoryHeader: {
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
    padding: theme.spacing(1, 2),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  packageItem: {
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
  },
  price: {
    color: theme.palette.text.secondary,
  },
  listItem: {
    '&:hover': {
      backgroundColor: '#f0f9ff',
    },
  }
}));

const EquipmentList = ({ equipment, onAddEquipment, className }) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPackages, setExpandedPackages] = useState({});

  // Filter equipment based on search term
  const filteredEquipment = equipment.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePackage = (packageId) => {
    setExpandedPackages({
      ...expandedPackages,
      [packageId]: !expandedPackages[packageId]
    });
  };

  const handleAddEquipment = (item) => {
    onAddEquipment({
      ...item,
      quantity: 1
    });
  };

  const getItemsInPackage = (packageItem) => {
    if (!packageItem.isPackage) return [];
    return packageItem.items.map(itemId => 
      equipment.find(e => e.id === itemId)
    ).filter(Boolean);
  };

  return (
    <div className={`${classes.root} ${className}`}>
      <Box className={classes.searchContainer}>
        <TextField
          className={classes.searchField}
          placeholder="Search equipment..."
          fullWidth
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search color="action" />,
          }}
        />
        <Typography variant="subtitle2">
          {filteredEquipment.length} items found
        </Typography>
      </Box>
      
      <List component="nav" aria-label="equipment list">
        {filteredEquipment.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem 
              button 
              className={`${classes.listItem} ${item.isPackage ? classes.packageItem : ''}`}
              onClick={() => item.isPackage && togglePackage(item.id)}
            >
              {item.isPackage && (
                <ListItemIcon>
                  <Folder />
                </ListItemIcon>
              )}
              <ListItemText 
                primary={item.name} 
                secondary={
                  <span>
                    <span className={classes.price}>${item.price}</span>
                    {item.description && ` - ${item.description}`}
                  </span>
                }
              />
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  aria-label="add"
                  onClick={() => handleAddEquipment(item)}
                >
                  <Add />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            
            {item.isPackage && (
              <Collapse in={expandedPackages[item.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {getItemsInPackage(item).map(packageItem => (
                    <ListItem key={packageItem.id} className={classes.nested}>
                      <ListItemText
                        primary={packageItem.name}
                        secondary={`$${packageItem.price}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default EquipmentList; 