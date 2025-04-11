import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { mockJobs } from '../services/mockData';
import NavigatorLogo from '../assets/navigator-logo.png';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ccc',
  },
  logo: {
    height: 36,
    marginRight: theme.spacing(2),
  },
  navigationButtons: {
    display: 'flex',
    '& > *': {
      marginRight: '4px',
    }
  },
  navButton: {
    textTransform: 'none',
    borderRadius: '2px',
    padding: '6px 16px',
    backgroundColor: '#e0e0e0',
    color: 'rgba(0, 0, 0, 0.87)',
    '&:hover': {
      backgroundColor: '#d5d5d5',
    }
  },
  saveButton: {
    backgroundColor: '#8BC34A',
    color: 'white',
    '&:hover': {
      backgroundColor: '#7CB342',
    }
  }
}));

const OrderJobHeader = ({ orderId, jobId, showInsertJob = false }) => {
  const classes = useStyles();
  const history = useHistory();
  
  const handleSave = () => {
    alert('Changes saved successfully!');
  };
  
  const handleGoToOrder = () => {
    if (orderId) {
      history.push(`/orders/${orderId}`);
    }
  };
  
  const handleGoToJobs = () => {
    if (orderId) {
      history.push(`/orders/${orderId}/jobs`);
    } else if (jobId) {
      const job = mockJobs.find(j => j.job_id === parseInt(jobId));
      if (job) {
        history.push(`/orders/${job.order_id}/jobs`);
      }
    }
  };
  
  const handleInsertJob = () => {
    alert('Creating new job...');
  };
  
  return (
    <Box className={classes.header}>
      <Link to="/">
        <img src={NavigatorLogo} alt="Navigator Logo" className={classes.logo} />
      </Link>
      
      <div className={classes.navigationButtons}>
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
          onClick={handleGoToOrder}
        >
          Order
        </Button>
        
        <Button 
          variant="contained" 
          className={classes.navButton}
          onClick={handleGoToJobs}
        >
          Jobs
        </Button>
        
        {showInsertJob && (
          <Button 
            variant="contained" 
            className={classes.navButton}
            onClick={handleInsertJob}
          >
            Insert Job
          </Button>
        )}
      </div>
    </Box>
  );
};

export default OrderJobHeader; 