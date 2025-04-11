import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Button, TextField, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { mockJobs, mockOrders } from '../services/mockData';
import NavigatorLogo from '../assets/navigator-logo.png';
import { getOrders, getJobs, addOrder, deleteOrder } from '../services/dataService';
import { Delete as DeleteIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    borderBottom: '1px solid #ddd',
  },
  logo: {
    height: 34,
  },
  hotelName: {
    fontSize: '14px',
  },
  contentContainer: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    width: '258px',
    backgroundColor: '#e0e0e0',
    borderRight: '1px solid #ccc',
    flexShrink: 0,
  },
  sidebarTitle: {
    padding: '12px 16px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  searchField: {
    margin: '8px 12px',
    width: 'calc(100% - 24px)',
    backgroundColor: 'white',
    '& .MuiOutlinedInput-root': {
      height: '36px',
    },
  },
  searchButtonContainer: {
    margin: '12px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  searchButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
    width: '75px',
  },
  resetButton: {
    backgroundColor: '#ff9800',
    color: 'white',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#f57c00',
    },
    width: '75px',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  tabsContainer: {
    backgroundColor: '#2196f3',
    display: 'flex',
    flexDirection: 'column',
  },
  tabButtons: {
    display: 'flex',
    backgroundColor: '#e0e0e0',
  },
  tabButton: {
    padding: '10px 16px',
    backgroundColor: '#e0e0e0',
    cursor: 'pointer',
    textTransform: 'none',
    borderRadius: 0,
    margin: 0,
    fontWeight: 'normal',
    boxShadow: 'none',
    border: 'none',
  },
  activeTabButton: {
    backgroundColor: '#2196f3',
    color: 'white',
  },
  newOrderContainer: {
    backgroundColor: '#2196f3',
    padding: '5px 0',
  },
  newOrderButton: {
    backgroundColor: '#e0e0e0',
    color: '#000',
    textTransform: 'none',
    margin: '5px 16px',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#c0c0c0',
    },
  },
  tableContainer: {
    padding: '0 16px',
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#fff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '8px',
  },
  tableHead: {
    backgroundColor: '#f5f5f5',
    '& th': {
      padding: '8px',
      textAlign: 'left',
      borderBottom: '1px solid #ddd',
      fontWeight: 'normal',
    },
  },
  tableRow: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f9f9f9',
    },
    '& td': {
      padding: '8px',
      borderBottom: '1px solid #ddd',
    },
  },
  link: {
    color: '#2196f3',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('order');
  const [orders, setOrders] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderName, setOrderName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  useEffect(() => {
    // Load data from our data service instead of directly from mockData
    setOrders(getOrders());
    setJobs(getJobs());
  }, [location]);
  
  // Check for pending changes on component mount
  useEffect(() => {
    try {
      const pendingOrdersStr = localStorage.getItem('pendingOrders');
      if (pendingOrdersStr) {
        const pendingOrders = JSON.parse(pendingOrdersStr);
        if (pendingOrders.length > 0) {
          setHasPendingChanges(true);
          setPendingOrderId(pendingOrders[0]); // Get the first pending order
        }
      }
    } catch (error) {
      console.error('Error checking for pending changes:', error);
    }
  }, []);
  
  const navigateToOrder = (orderId) => {
    history.push(`/orders/${orderId}`);
  };
  
  const navigateToJob = (jobId) => {
    history.push(`/jobs/${jobId}`);
  };
  
  const handleNewOrder = () => {
    history.push('/orders/new');
  };
  
  const handleSearch = () => {
    console.log("Searching with:", { orderNumber, orderName, accountName });
    
    if (activeTab === 'order') {
      const allOrders = getOrders();
      const filteredOrders = allOrders.filter(order => {
        return (
          (orderNumber === '' || order.id.toString().includes(orderNumber)) &&
          (orderName === '' || order.name.toLowerCase().includes(orderName.toLowerCase())) &&
          (accountName === '' || order.client_name.toLowerCase().includes(accountName.toLowerCase()))
        );
      });
      setOrders(filteredOrders);
    } else {
      const allJobs = getJobs();
      const filteredJobs = allJobs.filter(job => {
        return (
          (orderNumber === '' || job.order_id.toString().includes(orderNumber)) &&
          (orderName === '' || job.name.toLowerCase().includes(orderName.toLowerCase())) &&
          (accountName === '' || job.account_name.toLowerCase().includes(accountName.toLowerCase()))
        );
      });
      setJobs(filteredJobs);
    }
  };
  
  const handleReset = () => {
    setOrderNumber('');
    setOrderName('');
    setAccountName('');
    setOrders(getOrders());
    setJobs(getJobs());
  };
  
  // Handle resuming the pending order
  const handleResumePendingOrder = () => {
    if (pendingOrderId) {
      history.push(`/jobs/${pendingOrderId}`);
    }
  };
  
  // Handle discarding changes
  const handleDiscardChanges = () => {
    try {
      const pendingOrdersStr = localStorage.getItem('pendingOrders');
      if (pendingOrdersStr) {
        const pendingOrders = JSON.parse(pendingOrdersStr);
        if (pendingOrders.length > 0) {
          // Remove the first pending order (the one we're showing)
          const updatedPendingOrders = pendingOrders.filter(id => id !== pendingOrderId);
          localStorage.setItem('pendingOrders', JSON.stringify(updatedPendingOrders));
          
          // Clear the state for this order
          localStorage.removeItem(`orderState_${pendingOrderId}`);
          sessionStorage.removeItem(`orderState_${pendingOrderId}`);
          localStorage.removeItem(`orderMinimal_${pendingOrderId}`);
        }
      }
      setHasPendingChanges(false);
      setPendingOrderId(null);
    } catch (error) {
      console.error('Error discarding changes:', error);
    }
  };
  
  const handleDeleteClick = (orderId, event) => {
    event.stopPropagation(); // Prevent row click from firing
    console.log('Delete clicked for order ID:', orderId);
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    try {
      console.log('Confirming deletion of order ID:', orderToDelete);
      
      await deleteOrder(orderToDelete);
      
      // Directly update the orders state to ensure UI reflects the change
      setOrders(prev => prev.filter(order => String(order.id) !== String(orderToDelete)));
      
      // Also refresh from the data service to be sure
      const updatedOrders = getOrders();
      setOrders(updatedOrders);
      
      setSnackbar({
        open: true,
        message: 'Order deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting order: ' + error.message,
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };
  
  return (
    <div className={classes.root}>
      {/* Header */}
      <div className={classes.header}>
        <Link to="/">
          <img src={NavigatorLogo} alt="Navigator Logo" className={classes.logo} />
        </Link>
        <span className={classes.hotelName}>2621 - Marriott Marquis Chicago</span>
      </div>
      
      {/* Main Container */}
      <div className={classes.contentContainer}>
        {/* Search Panel */}
        <div className={classes.sidebar}>
          <div className={classes.sidebarTitle}>Search Criteria</div>
          
          <TextField
            placeholder="Order Number"
            variant="outlined"
            className={classes.searchField}
            size="small"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          
          <TextField
            placeholder="Order Name"
            variant="outlined"
            className={classes.searchField}
            size="small"
            value={orderName}
            onChange={(e) => setOrderName(e.target.value)}
          />
          
          <TextField
            placeholder="Account Name"
            variant="outlined"
            className={classes.searchField}
            size="small"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
          
          <div className={classes.searchButtonContainer}>
            <Button 
              variant="contained" 
              className={classes.searchButton}
              onClick={handleSearch}
              disableElevation
            >
              Search
            </Button>
            
            <Button 
              variant="contained" 
              className={classes.resetButton}
              onClick={handleReset}
              disableElevation
            >
              Reset
            </Button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className={classes.mainContent}>
          {/* Tabs */}
          <div className={classes.tabsContainer}>
            <div className={classes.tabButtons}>
              <Button
                className={`${classes.tabButton} ${activeTab === 'order' ? classes.activeTabButton : ''}`}
                onClick={() => setActiveTab('order')}
                disableElevation
                disableRipple
              >
                Order Search
              </Button>
              <Button
                className={`${classes.tabButton} ${activeTab === 'job' ? classes.activeTabButton : ''}`}
                onClick={() => setActiveTab('job')}
                disableElevation
                disableRipple
              >
                Job Search
              </Button>
            </div>
            
            <div className={classes.newOrderContainer}>
              <Button
                className={classes.newOrderButton}
                onClick={handleNewOrder}
                disableElevation
              >
                New Internal Order
              </Button>
            </div>
          </div>
          
          {/* Table */}
          <div className={classes.tableContainer}>
            {activeTab === 'order' ? (
              <table className={classes.table}>
                <thead className={classes.tableHead}>
                  <tr>
                    <th>Order #</th>
                    <th>Order Name</th>
                    <th>Account Name</th>
                    <th>Event Date</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Sales Manager</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className={classes.tableRow}>
                      <td>
                        <span className={classes.link} onClick={() => navigateToOrder(order.id)}>
                          {order.id}
                        </span>
                      </td>
                      <td>
                        <span className={classes.link} onClick={() => navigateToOrder(order.id)}>
                          {order.name}
                        </span>
                      </td>
                      <td>{order.client_name}</td>
                      <td>{order.event_date}</td>
                      <td>{order.location}</td>
                      <td>{order.status}</td>
                      <td>{order.sales_manager}</td>
                      <td>${order.total.toLocaleString()}</td>
                      <td>
                        <IconButton 
                          size="small"
                          onClick={(e) => handleDeleteClick(order.id, e)}
                          aria-label="delete order"
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className={classes.table}>
                <thead className={classes.tableHead}>
                  <tr>
                    <th>Job #</th>
                    <th>Order #</th>
                    <th>Order Name</th>
                    <th>Room</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Account Name</th>
                    <th>Sales Manager</th>
                    <th>Job Total</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.job_id} className={classes.tableRow}>
                      <td>
                        <span className={classes.link} onClick={() => navigateToJob(job.job_id)}>
                          {job.job_id}
                        </span>
                      </td>
                      <td>
                        <span className={classes.link} onClick={() => navigateToOrder(job.order_id)}>
                          {job.order_id}
                        </span>
                      </td>
                      <td>{job.name}</td>
                      <td>{job.room}</td>
                      <td>{new Date(job.start_time).toLocaleDateString()}</td>
                      <td>{new Date(job.end_time).toLocaleDateString()}</td>
                      <td>{job.account_name}</td>
                      <td>{job.sales_manager}</td>
                      <td>${job.job_total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      
      {/* Add a notification for pending changes */}
      <Snackbar 
        open={hasPendingChanges} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="warning" 
          action={
            <>
              <Button color="inherit" size="small" onClick={handleDiscardChanges}>
                Discard
              </Button>
              <Button color="inherit" size="small" onClick={handleResumePendingOrder}>
                Resume
              </Button>
            </>
          }
        >
          You have unsaved changes in an order. Would you like to resume editing?
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HomePage; 
