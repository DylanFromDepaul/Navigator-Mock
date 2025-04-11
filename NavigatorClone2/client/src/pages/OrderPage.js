import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  MenuItem,
  Select,
  InputBase,
  Paper,
  FormControl,
  Popover
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { KeyboardArrowDown } from '@material-ui/icons';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  Calendar
} from '@material-ui/pickers';
import { format } from 'date-fns';
import { mockOrders, mockSalesManagers } from '../services/mockData';
import NavigatorLogo from '../assets/navigator-logo.png';
import { getOrderById, getJobsByOrderId, saveOrder } from '../services/dataService';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ccc',
  },
  logo: {
    height: 34,
    marginRight: theme.spacing(2),
  },
  headerSpacer: {
    flexGrow: 1,
  },
  headerButtons: {
    display: 'flex',
    gap: '8px',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    textTransform: 'none',
    padding: '6px 16px',
    '&:hover': {
      backgroundColor: '#388e3c',
    }
  },
  navButton: {
    color: '#000',
    backgroundColor: '#f0f0f0',
    textTransform: 'none',
    padding: '6px 16px',
    border: '1px solid #ddd',
  },
  content: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    width: '244px',
    backgroundColor: '#e0e0e0',
    padding: '16px',
  },
  mainContent: {
    flex: 1,
    padding: '8px',
  },
  orderSection: {
    backgroundColor: '#e0e0e0',
    marginBottom: '8px',
  },
  sectionHeader: {
    padding: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  orderDetails: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    columnGap: '8px',
    rowGap: '8px',
    alignItems: 'center',
    padding: '8px',
  },
  rightColumn: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    columnGap: '8px',
    rowGap: '8px',
    alignItems: 'center',
    padding: '8px',
  },
  orderRightSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  orderGrid: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    gap: '8px',
  },
  label: {
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  inputField: {
    backgroundColor: 'white',
    border: '1px solid #ccc',
    padding: '6px 10px',
    '&:focus': {
      outline: 'none',
      border: '1px solid #888',
    }
  },
  dropdownSelect: {
    backgroundColor: 'white',
    padding: '4px 8px',
    border: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  calendar: {
    backgroundColor: 'white',
    padding: '6px 10px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
  },
  calendarError: {
    border: '1px solid #f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: '0.75rem',
    marginTop: '3px',
    marginLeft: '2px',
  },
  sidebarLabel: {
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  sidebarValue: {
    marginBottom: '16px',
  },
  sidebarLinks: {
    marginTop: '20px',
  },
  sidebarLink: {
    color: '#0000cc',
    marginBottom: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    padding: '8px 4px',
    '&.active': {
      color: '#000',
      fontWeight: 'bold',
      backgroundColor: '#d0d0d0',
    },
    '&:hover': {
      backgroundColor: '#d8d8d8',
    }
  },
  accountsSection: {
    backgroundColor: '#d5d5d5',
    marginBottom: '8px',
  },
  accountsContent: {
    backgroundColor: '#f5f5f5',
    padding: '16px',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '16px',
  },
  accountDetails: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
    gap: '8px',
    alignItems: 'center',
  },
  salesManagerContainer: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
    gap: '8px',
    alignItems: 'center',
  },
  salesManagerDropdown: {
    backgroundColor: 'white',
    width: '100%',
    border: '1px solid #ccc',
    '& .MuiSelect-select': {
      padding: '6px 10px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  },
  selectIcon: {
    right: '8px'
  },
  calendarPopover: {
    padding: theme.spacing(2),
  },
}));

const OrderPage = () => {
  const classes = useStyles();
  const { orderId } = useParams();
  const history = useHistory();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accounts');
  const [orderType, setOrderType] = useState('Dropdown');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [orderName, setOrderName] = useState('');
  const [salesManagers, setSalesManagers] = useState([]);
  const [selectedSalesManager, setSelectedSalesManager] = useState('');
  
  // Calendar state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startCalendarAnchorEl, setStartCalendarAnchorEl] = useState(null);
  const [endCalendarAnchorEl, setEndCalendarAnchorEl] = useState(null);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    // Fetch order data based on orderId
    const fetchOrder = () => {
      setLoading(true);
      const foundOrder = getOrderById(orderId);
      
      if (foundOrder) {
        setOrder(foundOrder);
        // Initialize form fields with order data
        setOrderName(foundOrder.name);
        setSelectedSalesManager(foundOrder.sales_manager);
        
        // Initialize dates from event_date (for demo purposes)
        // In a real app, you'd have separate start/end date fields
        if (foundOrder.event_date) {
          const eventDate = new Date(foundOrder.event_date);
          setStartDate(eventDate);
          
          // Set end date to event date + 1 day for demo
          const nextDay = new Date(eventDate);
          nextDay.setDate(nextDay.getDate() + 1);
          setEndDate(nextDay);
        }
      }
      
      setLoading(false);
    };

    // Load sales managers
    setSalesManagers(mockSalesManagers);

    fetchOrder();
  }, [orderId]);

  // Calendar handlers
  const handleStartCalendarOpen = (event) => {
    setStartCalendarAnchorEl(event.currentTarget);
  };

  const handleStartCalendarClose = () => {
    setStartCalendarAnchorEl(null);
  };

  const handleEndCalendarOpen = (event) => {
    setEndCalendarAnchorEl(event.currentTarget);
  };

  const handleEndCalendarClose = () => {
    setEndCalendarAnchorEl(null);
  };

  const handleStartDateChange = (date) => {
    // Check if the start date is after the end date
    if (endDate && date > endDate) {
      setDateError('Start date cannot be after end date');
    } else {
      setDateError('');
    }
    
    setStartDate(date);
    handleStartCalendarClose();
  };

  const handleEndDateChange = (date) => {
    // Check if the end date is before the start date
    if (startDate && date < startDate) {
      setDateError('End date cannot be before start date');
    } else {
      setDateError('');
    }
    
    setEndDate(date);
    handleEndCalendarClose();
  };

  const startCalendarOpen = Boolean(startCalendarAnchorEl);
  const endCalendarOpen = Boolean(endCalendarAnchorEl);

  const handleSave = () => {
    if (!validateBeforeSave()) {
      alert('Please fix validation errors before saving');
      return;
    }

    const updatedOrder = {
      ...order,
      name: orderName,
      sales_manager: selectedSalesManager,
      event_date: startDate ? format(startDate, 'yyyy-MM-dd') : null,
      end_date: endDate ? format(endDate, 'yyyy-MM-dd') : null,
      notes: order.notes || ''
    };
    
    // Update the order in our data service
    const savedOrder = saveOrder(updatedOrder);
    setOrder(savedOrder);
    
    alert('Changes saved successfully!');
  };

  const handleSalesManagerChange = (event) => {
    setSelectedSalesManager(event.target.value);
  };

  const navigateToJobs = () => {
    // Navigate to the jobs list for this order
    history.push(`/orders/${orderId}/jobs`);
  };

  const handleNavigateHome = () => {
    history.push('/');
  };

  const validateBeforeSave = () => {
    if (startDate && endDate && startDate > endDate) {
      setDateError('Start date cannot be after end date');
      return false;
    }
    return true;
  };

  if (loading || !order) {
    return <div>Loading order details...</div>;
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className={classes.root}>
        {/* Header */}
        <div className={classes.header}>
          <div 
            onClick={handleNavigateHome} 
            style={{ cursor: 'pointer' }}
          >
            <img src={NavigatorLogo} alt="Navigator Logo" className={classes.logo} />
          </div>
          <div className={classes.headerSpacer}></div>
          <div className={classes.headerButtons}>
            <Button 
              variant="contained" 
              className={classes.saveButton}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button 
              variant="contained" 
              className={classes.navButton}
            >
              Order
            </Button>
            <Button 
              variant="contained" 
              className={classes.navButton}
              onClick={navigateToJobs}
            >
              Jobs
            </Button>
          </div>
        </div>

        {/* Content Area with Sidebar and Main Content */}
        <div className={classes.content}>
          {/* Sidebar */}
          <div className={classes.sidebar}>
            <div>
              <div className={classes.sidebarLabel}>Order Name:</div>
              <div className={classes.sidebarValue}>
                {order.name}
              </div>
            </div>
            
            <div>
              <div className={classes.sidebarLabel}>Order Number:</div>
              <div className={classes.sidebarValue}>
                {order.id}
              </div>
            </div>
            
            <div>
              <div className={classes.sidebarLabel}>Net Total:</div>
              <div className={classes.sidebarValue}>
                ${order.total.toLocaleString()}
              </div>
            </div>

            <div className={classes.sidebarLinks}>
              <div 
                className={`${classes.sidebarLink} ${activeTab === 'accounts' ? 'active' : ''}`}
                onClick={() => setActiveTab('accounts')}
              >
                Accounts & Contacts
              </div>
              <div 
                className={`${classes.sidebarLink} ${activeTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                Notes
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={classes.mainContent}>
            {/* Order Section */}
            <Paper className={classes.orderSection} elevation={0}>
              <div className={classes.sectionHeader}>Order</div>
              
              <div className={classes.orderGrid}>
                <div className={classes.orderDetails}>
                  <div className={classes.label}>Name</div>
                  <InputBase 
                    className={classes.inputField}
                    placeholder="Typable Section"
                    value={orderName}
                    onChange={(e) => setOrderName(e.target.value)}
                    fullWidth
                  />

                  <div className={classes.label}>Type</div>
                  <div 
                    className={classes.dropdownSelect}
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  >
                    <span>{orderType}</span>
                    <span>▼</span>
                    {showTypeDropdown && (
                      <Paper style={{
                        position: 'absolute',
                        zIndex: 1,
                        marginTop: '30px',
                        width: '200px',
                      }}>
                        <MenuItem onClick={() => {
                          setOrderType('Internal');
                          setShowTypeDropdown(false);
                        }}>
                          Internal
                        </MenuItem>
                        <MenuItem onClick={() => {
                          setOrderType('Event');
                          setShowTypeDropdown(false);
                        }}>
                          Event
                        </MenuItem>
                      </Paper>
                    )}
                  </div>

                  <div className={classes.label}>Start</div>
                  <div>
                    <div 
                      className={`${classes.calendar} ${dateError && dateError.includes('Start') ? classes.calendarError : ''}`}
                      onClick={handleStartCalendarOpen}
                    >
                      <span>{startDate ? format(startDate, 'MM/dd/yyyy') : 'Calendar'}</span>
                      <span>▼</span>
                    </div>
                    {dateError && dateError.includes('Start') && (
                      <div className={classes.errorText}>{dateError}</div>
                    )}
                  </div>
                  <Popover
                    open={startCalendarOpen}
                    anchorEl={startCalendarAnchorEl}
                    onClose={handleStartCalendarClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
                    <div className={classes.calendarPopover}>
                      <Calendar 
                        date={startDate || new Date()}
                        onChange={handleStartDateChange}
                      />
                    </div>
                  </Popover>

                  <div className={classes.label}>End</div>
                  <div>
                    <div 
                      className={`${classes.calendar} ${dateError && dateError.includes('End') ? classes.calendarError : ''}`}
                      onClick={handleEndCalendarOpen}
                    >
                      <span>{endDate ? format(endDate, 'MM/dd/yyyy') : 'Calendar'}</span>
                      <span>▼</span>
                    </div>
                    {dateError && dateError.includes('End') && (
                      <div className={classes.errorText}>{dateError}</div>
                    )}
                  </div>
                  <Popover
                    open={endCalendarOpen}
                    anchorEl={endCalendarAnchorEl}
                    onClose={handleEndCalendarClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
                    <div className={classes.calendarPopover}>
                      <Calendar 
                        date={endDate || new Date()}
                        onChange={handleEndDateChange}
                      />
                    </div>
                  </Popover>
                </div>

                <div className={classes.orderRightSection}>
                  <div className={classes.rightColumn}>
                    <div className={classes.label}>Status</div>
                    <div>{order.status}</div>
                  </div>
                  <div className={classes.rightColumn}>
                    <div className={classes.label}>Quote</div>
                    <div></div>
                  </div>
                </div>
              </div>
            </Paper>

            {/* Accounts & Contacts Section */}
            {activeTab === 'accounts' && (
              <Paper className={classes.accountsSection} elevation={0}>
                <div className={classes.sectionHeader}>Accounts & Contacts</div>
                
                <div className={classes.accountsContent}>
                  <div className={classes.accountDetails}>
                    <div className={classes.label}>Account Name:</div>
                    <div>{order.client_name}</div>

                    <div className={classes.label}>Primary Contact:</div>
                    <div>{order.primary_contact || 'Contact information not available'}</div>
                  </div>

                  <div className={classes.salesManagerContainer}>
                    <div className={classes.label}>Sales Manager</div>
                    <FormControl variant="outlined" fullWidth size="small">
                      <Select
                        value={selectedSalesManager}
                        onChange={handleSalesManagerChange}
                        className={classes.salesManagerDropdown}
                        IconComponent={() => <span style={{marginRight: '8px'}}>▼</span>}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                          },
                          getContentAnchorEl: null,
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {salesManagers.map((manager) => (
                          <MenuItem key={manager.id} value={manager.name}>
                            {manager.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </Paper>
            )}

            {/* Notes Section */}
            {activeTab === 'notes' && (
              <Paper className={classes.accountsSection} elevation={0}>
                <div className={classes.sectionHeader}>Notes</div>
                
                <div className={classes.accountsContent}>
                  <TextField
                    multiline
                    rows={6}
                    fullWidth
                    variant="outlined"
                    placeholder="Add notes here..."
                    value={order.notes || ''}
                    onChange={(e) => {
                      setOrder({...order, notes: e.target.value});
                    }}
                  />
                </div>
              </Paper>
            )}
          </div>
        </div>
      </div>
    </MuiPickersUtilsProvider>
  );
};

console.error('USING OrderPage.js - THIS FILE SHOULD BE DELETED'); 

// In case this is the one being used, redirect to the .jsx version
import OrderPageJSX from './OrderPage.jsx';
export default OrderPageJSX; 