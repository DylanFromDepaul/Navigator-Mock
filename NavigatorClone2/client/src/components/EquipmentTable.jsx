import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton,
  TextField, makeStyles, Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { formatCurrency } from '../utils/formatters';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  tableContainer: {
    boxShadow: 'none',
    border: '1px solid #e0e0e0',
    marginTop: theme.spacing(2),
  },
  headerCell: {
    backgroundColor: '#f5f5f5',
    fontWeight: 600,
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  quantityField: {
    width: '60px',
    '& input': {
      textAlign: 'center',
    },
  },
  packageRow: {
    fontWeight: 600,
  },
  packageItemRow: {
    backgroundColor: '#f9f9f9',
    '& td': {
      paddingLeft: theme.spacing(4),
    },
  },
  totalRow: {
    backgroundColor: '#f5f5f5',
    '& td': {
      fontWeight: 600,
    },
  },
  emptyMessage: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const EquipmentTable = ({ equipment, onUpdateQuantity, onRemoveItem }) => {
  const classes = useStyles();
  
  const handleQuantityChange = (itemId, value) => {
    const quantity = parseInt(value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      onUpdateQuantity(itemId, quantity);
    }
  };
  
  const calculateTotal = () => {
    return equipment.reduce((total, item) => total + item.line_total, 0);
  };
  
  if (!equipment || equipment.length === 0) {
    return (
      <Paper className={classes.tableContainer}>
        <Typography className={classes.emptyMessage}>
          No equipment added to this job yet.
        </Typography>
      </Paper>
    );
  }
  
  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.headerCell}>Name</TableCell>
            <TableCell className={classes.headerCell} align="center">Quantity</TableCell>
            <TableCell className={classes.headerCell} align="right">Rate</TableCell>
            <TableCell className={classes.headerCell} align="right">Total</TableCell>
            <TableCell className={classes.headerCell} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {equipment.map((item) => (
            <TableRow 
              key={item.id}
              className={`${classes.tableRow} ${item.is_package ? classes.packageRow : ''} ${item.is_package_item ? classes.packageItemRow : ''}`}
            >
              <TableCell>{item.name}</TableCell>
              <TableCell align="center">
                <TextField
                  className={classes.quantityField}
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  size="small"
                  inputProps={{ min: 1 }}
                />
              </TableCell>
              <TableCell align="right">{formatCurrency(item.rate)}</TableCell>
              <TableCell align="right">{formatCurrency(item.line_total)}</TableCell>
              <TableCell align="center">
                <IconButton size="small" onClick={() => onRemoveItem(item.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          <TableRow className={classes.totalRow}>
            <TableCell colSpan={3} align="right">Total</TableCell>
            <TableCell align="right">{formatCurrency(calculateTotal())}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EquipmentTable; 