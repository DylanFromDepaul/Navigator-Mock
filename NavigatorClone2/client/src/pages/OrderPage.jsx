import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import NavigatorLogo from '../assets/navigator-logo.png';
import { getOrderById, updateOrder, addOrder } from '../services/dataService';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f7f8f9',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e3e6f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
  },
  logo: {
    height: 34,
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    }
  },
  headerSpacer: {
    flexGrow: 1,
  },
  headerButtons: {
    display: 'flex',
    gap: '12px',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '6px 20px',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#3d8b40',
    },
    textTransform: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '6px 20px',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
    textTransform: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  navButton: {
    backgroundColor: '#f0f0f0',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
    textTransform: 'none',
    fontWeight: 500,
    padding: '6px 20px',
  },
  mainContainer: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#f0f2f5',
    borderRight: '1px solid #e3e6f0',
    display: 'flex',
    flexDirection: 'column',
  },
  orderInfoPanel: {
    margin: '15px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  navPanel: {
    margin: '15px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  orderInfo: {
    padding: '20px',
    backgroundColor: 'white',
  },
  orderInfoHeader: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#333',
    marginBottom: '20px',
    borderBottom: '1px solid #eaedf3',
    paddingBottom: '10px',
  },
  orderInfoItem: {
    marginBottom: '15px',
  },
  orderInfoLabel: {
    fontWeight: 600,
    fontSize: '14px',
    color: '#5a6169',
    marginBottom: '5px',
  },
  orderInfoValue: {
    fontSize: '15px',
    color: '#333',
  },
  sidebarNav: {
    padding: '0',
  },
  sidebarNavItem: {
    padding: '14px 20px',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'all 0.2s ease',
    borderBottom: '1px solid #eaedf3',
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: '#f5f7fa',
    },
    '&.active': {
      backgroundColor: '#e9f0fd',
      color: '#4285f4',
      fontWeight: 600,
      borderLeft: '4px solid #4285f4',
    },
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
  },
  orderSection: {
    marginBottom: '20px',
  },
  orderPaper: {
    padding: '24px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    borderRadius: '8px',
  },
  orderSectionHeader: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '20px',
    color: '#333',
    borderBottom: '1px solid #eaedf3',
    paddingBottom: '10px',
  },
  orderGrid: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 100px 150px',
    columnGap: '20px',
    rowGap: '22px',
  },
  dateField: {
    maxWidth: '200px',
  },
  label: {
    fontWeight: 500,
    color: '#5a6169',
    fontSize: '14px',
  },
  accountsSection: {
    marginBottom: '20px',
  },
  accountPaper: {
    padding: '24px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    borderRadius: '8px',
  },
  accountsGrid: {
    display: 'grid',
    gridTemplateColumns: '150px 1fr',
    columnGap: '20px',
    rowGap: '22px',
    marginBottom: '10px',
  },
  salesManagerRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: '10px',
  },
  salesManagerLabel: {
    fontWeight: 500,
    marginRight: '15px',
    color: '#5a6169',
  },
  salesManagerSelect: {
    width: '250px',
  },
}));

const OrderPage = () => {
  const classes = useStyles();
  const { orderId } = useParams();
  const history = useHistory();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('accounts');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  const statusOptions = ["Quote", "Tentative", "Confirmed", "Canceled"];
  const typeOptions = ["Internal", "Event"];
  const salesManagerOptions = ["David Calvillo", "Darren Lins", "Sarah Brown", "Eder Castillo", "Dylan Neal"];
  
  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        
        // Check if this is a request to create a new order
        if (orderId === 'new') {
          // Create a new empty order template
          const newOrder = {
            id: 'new',
            name: '',
            status: 'Quote',
            type: 'Internal',
            total: 0,
            client_name: '',
            primary_contact: '',
            sales_manager: '',
            is_new: true // Flag to indicate this is a new order
          };
          
          setOrder(newOrder);
        } else {
          // Load existing order
          const orderData = await getOrderById(orderId);
          
          if (!orderData) {
            setOrder(null);
            throw new Error(`Order with ID ${orderId} not found`);
          }
          
          setOrder(orderData);
        }
      } catch (error) {
        console.error('Error loading order:', error);
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadOrder();
  }, [orderId]);
  
  const handleInputChange = (field, value) => {
    setOrder(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };
  
  const validateOrder = () => {
    const newErrors = {};
    
    if (!order.name) newErrors.name = 'Event name is required';
    if (!order.client_name) newErrors.client_name = 'Account name is required';
    if (!order.primary_contact) newErrors.primary_contact = 'Primary contact is required';
    if (!order.sales_manager) newErrors.sales_manager = 'Sales manager is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveOrder = async () => {
    if (!validateOrder()) {
      setSnackbar({
        open: true,
        message: 'Please fix the errors before saving',
        severity: 'error'
      });
      return;
    }
    
    try {
      // Create a copy of the order to avoid mutating the state directly
      const orderToSave = { ...order };
      
      console.log('Saving order:', orderToSave);
      
      // If this is a new order (id is 'new'), we need to generate a proper ID
      if (orderToSave.id === 'new' || orderToSave.is_new) {
        // Remove the 'new' id so a real one will be generated
        if (orderToSave.id === 'new') {
          delete orderToSave.id;
        }
        
        // Ensure it has the is_new flag
        orderToSave.is_new = true;
        
        // Generate current date for missing fields if needed
        if (!orderToSave.event_date) {
          const today = new Date();
          orderToSave.event_date = today.toISOString().split('T')[0];
        }
        
        // Set default values for any required fields that might be missing
        if (!orderToSave.total) orderToSave.total = 0;
        if (!orderToSave.status) orderToSave.status = 'Quote';
        
        // Use addOrder to create a new order with a generated ID
        const savedOrder = await addOrder(orderToSave);
        console.log('New order created:', savedOrder);
        
        // Update our local state with the newly saved order
        setOrder(savedOrder);
        
        setSnackbar({
          open: true,
          message: 'New order created successfully',
          severity: 'success'
        });
        
        // Navigate to the home page to see the updated list
        history.push('/');
      } else {
        // For existing orders, use updateOrder
        await updateOrder(orderToSave);
        
        setSnackbar({
          open: true,
          message: 'Order updated successfully',
          severity: 'success'
        });
        
        // Optionally navigate back to home page after successful save
        history.push('/');
      }
    } catch (error) {
      console.error('Error saving order:', error);
      setSnackbar({
        open: true,
        message: 'Error saving order: ' + error.message,
        severity: 'error'
      });
    }
  };
  
  const handleCancel = () => {
    history.goBack();
  };
  
  if (loading) {
    return <div>Loading order data...</div>;
  }
  
  if (!order) {
    return <div>Order not found</div>;
  }
  
  return (
    <div className={classes.root}>
      {/* Header */}
      <div className={classes.header}>
        <img
          src={NavigatorLogo}
          alt="Navigator Logo"
          className={classes.logo}
          onClick={() => history.push('/')}
        />
        <div className={classes.headerButtons} style={{ marginLeft: '16px' }}>
          <Button 
            variant="contained" 
            className={classes.saveButton}
            onClick={handleSaveOrder}
          >
            Save
          </Button>
          <Button 
            className={classes.navButton}
            onClick={() => {
              // Stay on current page
            }}
            style={{ fontWeight: 'bold' }}
          >
            Order
          </Button>
          <Button 
            className={classes.navButton}
            onClick={() => {
              if (orderId) {
                history.push(`/orders/${orderId}/jobs`);
              }
            }}
          >
            Jobs
          </Button>
        </div>
        <div className={classes.headerSpacer} />
        <Button 
          variant="contained" 
          className={classes.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
      
      {/* Main Container */}
      <div className={classes.mainContainer}>
        {/* Sidebar */}
        <div className={classes.sidebar}>
          {/* Order Info Panel */}
          <Paper className={classes.orderInfoPanel}>
            <div className={classes.orderInfo}>
              <Typography className={classes.orderInfoHeader}>
                Order Information
              </Typography>
              <div className={classes.orderInfoItem}>
                <div className={classes.orderInfoLabel}>Order Name:</div>
                <div className={classes.orderInfoValue}>{order.name}</div>
              </div>
              <div className={classes.orderInfoItem}>
                <div className={classes.orderInfoLabel}>Order Number:</div>
                <div className={classes.orderInfoValue}>{order.id}</div>
              </div>
              <div className={classes.orderInfoItem}>
                <div className={classes.orderInfoLabel}>Net Total:</div>
                <div className={classes.orderInfoValue}>${order.total || '0'}</div>
              </div>
            </div>
          </Paper>
          
          {/* Navigation Panel */}
          <Paper className={classes.navPanel}>
            <div className={classes.sidebarNav}>
              <div 
                className={`${classes.sidebarNavItem} ${activeTab === 'accounts' ? 'active' : ''}`}
                onClick={() => setActiveTab('accounts')}
              >
                Accounts & Contacts
              </div>
              <div 
                className={`${classes.sidebarNavItem} ${activeTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                Notes
              </div>
            </div>
          </Paper>
        </div>
        
        {/* Content Area */}
        <div className={classes.contentArea}>
          {/* Order Section */}
          <div className={classes.orderSection}>
            <Paper className={classes.orderPaper}>
              <Typography className={classes.orderSectionHeader}>
                Order
              </Typography>
              
              <div className={classes.orderGrid}>
                <div className={classes.label}>Name</div>
                <TextField
                  value={order.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{
                    style: { 
                      borderRadius: '6px',
                      backgroundColor: '#fff'
                    }
                  }}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                
                <div className={classes.label}>Status</div>
                <FormControl variant="outlined" size="small" fullWidth>
                  <Select
                    value={order.status || ''}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    displayEmpty
                  >
                    {statusOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <div className={classes.label}>Type</div>
                <FormControl variant="outlined" size="small" fullWidth>
                  <Select
                    value={order.type || 'Internal'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    displayEmpty
                  >
                    {typeOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <div className={classes.label}>Quote</div>
                <div>{order.quote_number || ''}</div>
                
                <div className={classes.label}>Start</div>
                <TextField
                  type="date"
                  value={order.start_date || ''}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  className={classes.dateField}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <div></div>
                <div></div>
                
                <div className={classes.label}>End</div>
                <TextField
                  type="date"
                  value={order.end_date || ''}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  className={classes.dateField}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <div></div>
                <div></div>
              </div>
            </Paper>
          </div>
          
          {/* Accounts Section (Only shown if accounts tab is active) */}
          {activeTab === 'accounts' && (
            <div className={classes.accountsSection}>
              <Paper className={classes.accountPaper}>
                <Typography className={classes.orderSectionHeader}>
                  Accounts & Contacts
                </Typography>
                
                <div className={classes.accountsGrid}>
                  <div className={classes.label}>Account Name:</div>
                  <TextField
                    value={order.client_name || ''}
                    onChange={(e) => handleInputChange('client_name', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{
                      style: { 
                        borderRadius: '6px',
                        backgroundColor: '#fff'
                      }
                    }}
                    error={!!errors.client_name}
                    helperText={errors.client_name}
                  />
                  
                  <div className={classes.label}>Primary Contact:</div>
                  <TextField
                    value={order.primary_contact || ''}
                    onChange={(e) => handleInputChange('primary_contact', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{
                      style: { 
                        borderRadius: '6px',
                        backgroundColor: '#fff'
                      }
                    }}
                    error={!!errors.primary_contact}
                    helperText={errors.primary_contact}
                  />
                  
                  <div className={classes.label}>Sales Manager:</div>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <Select
                      value={order.sales_manager || ''}
                      onChange={(e) => handleInputChange('sales_manager', e.target.value)}
                      displayEmpty
                    >
                      {salesManagerOptions.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Paper>
            </div>
          )}
          
          {/* Notes Section (Only shown if notes tab is active) */}
          {activeTab === 'notes' && (
            <div className={classes.accountsSection}>
              <Paper className={classes.accountPaper}>
                <Typography className={classes.orderSectionHeader}>
                  Notes
                </Typography>
                
                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  variant="outlined"
                  placeholder="Add notes here..."
                  value={order.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </Paper>
            </div>
          )}
        </div>
      </div>
      
      {/* Snackbar */}
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
    </div>
  );
};

export default OrderPage; 