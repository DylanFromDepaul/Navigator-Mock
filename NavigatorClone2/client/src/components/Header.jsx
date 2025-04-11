import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import NavigatorLogo from '../assets/navigator-logo.png';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ccc',
  },
  logo: {
    height: 40,
    marginRight: theme.spacing(2),
  },
  navButton: {
    margin: theme.spacing(0, 0.5),
    textTransform: 'none',
    borderRadius: 4,
    fontWeight: 'normal',
  },
  saveButton: {
    backgroundColor: '#8BC34A',
    color: 'white',
    '&:hover': {
      backgroundColor: '#7CB342',
    }
  }
}));

const Header = ({ orderId, jobId }) => {
  const classes = useStyles();
  const history = useHistory();
  
  const handleSave = () => {
    // In a real app, this would save the current form
    alert('Changes saved successfully!');
  };
  
  const handleNavigateToOrder = () => {
    if (orderId) {
      history.push(`/orders/${orderId}`);
    } else {
      history.push('/');
    }
  };
  
  const handleNavigateToJobs = () => {
    if (orderId) {
      history.push(`/orders/${orderId}/jobs`);
    } else {
      history.push('/');
    }
  };
  
  const handleInsertJob = () => {
    if (orderId) {
      // In a real app, this would create a new job
      alert('Creating new job');
    }
  };
  
  return (
    <Box className={classes.header}>
      <Link to="/">
        <img src={NavigatorLogo} alt="Navigator Logo" className={classes.logo} />
      </Link>
      
      <Button 
        variant="contained" 
        className={`${classes.navButton} ${classes.saveButton}`}
        onClick={handleSave}
      >
        Save
      </Button>
      
      <Button 
        variant="contained" 
        className={classes.navButton}
        onClick={handleNavigateToOrder}
      >
        Order
      </Button>
      
      <Button 
        variant="contained" 
        className={classes.navButton}
        onClick={handleNavigateToJobs}
      >
        Jobs
      </Button>
      
      <Button 
        variant="contained" 
        className={classes.navButton}
        onClick={handleInsertJob}
      >
        Insert Job
      </Button>
    </Box>
  );
};

export default Header; 