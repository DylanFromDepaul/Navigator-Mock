import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Select,
  MenuItem,
  Popover,
  IconButton,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  FormHelperText,
  InputAdornment,
  Chip
} from '@material-ui/core';
import NavigatorLogo from '../assets/navigator-logo.png';
import { 
  getOrderById, 
  getJobsByOrderId, 
  updateJob,
  saveOrder,
  saveJob,
  getEquipmentItemsByJobId,
  saveEquipmentItems
} from '../services/dataService';
import AIAssistant from '../components/AIAssistant';
import { Edit, Save, Cancel, ArrowUpward, ArrowDownward, Delete, Search, Clear } from '@material-ui/icons';
import { MuiPickersUtilsProvider, Calendar } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import { mockOrders, mockJobs, mockEquipment, equipmentCatalog } from '../services/mockData';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
  },
  logo: {
    height: 34,
    cursor: 'pointer',
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
    '&:hover': {
      backgroundColor: '#388e3c',
    }
  },
  navButton: {
    backgroundColor: '#f0f0f0',
    textTransform: 'none',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  orderInfoSection: {
    display: 'flex',
    padding: '16px',
    backgroundColor: '#e0e0e0',
    borderBottom: '1px solid #ccc',
  },
  orderInfoItem: {
    marginRight: theme.spacing(5),
  },
  orderInfoLabel: {
    fontWeight: 'bold',
    fontSize: '14px',
  },
  orderInfoValue: {
    fontSize: '14px',
  },
  jobsTable: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    '& th, & td': {
      border: '1px solid #ccc',
      padding: '8px',
      textAlign: 'left',
    },
    '& th': {
      backgroundColor: '#e0e0e0',
      fontWeight: 'bold',
    },
    '& tr:nth-of-type(even)': {
      backgroundColor: '#f9f9f9',
    }
  },
  tabsContainer: {
    backgroundColor: '#e0e0e0',
    marginTop: theme.spacing(2),
  },
  tabButton: {
    color: '#0000ff',
    textTransform: 'none',
  },
  activeTabButton: {
    color: '#000',
    fontWeight: 'bold',
  },
  mainContent: {
    display: 'flex',
    padding: theme.spacing(2),
    position: 'relative',
  },
  equipmentSection: {
    display: 'flex',
    flex: 1,
  },
  equipmentListContainer: {
    width: '300px',
    backgroundColor: '#f8f8f8',
    marginRight: theme.spacing(2),
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  equipmentHeader: {
    padding: theme.spacing(2),
    fontWeight: 'bold',
    backgroundColor: '#e7eef6',
    color: '#3f51b5',
    borderBottom: '1px solid #d0d0d0',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '8px',
  },
  equipmentListScroll: {
    height: '450px',
    overflow: 'auto',
  },
  equipmentTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: theme.spacing(1),
  },
  equipmentTableRow: {
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#e8f4fc',
      cursor: 'grab',
    },
    '&:nth-of-type(odd)': {
      backgroundColor: '#f5f5f5',
    }
  },
  equipmentTableCell: {
    padding: theme.spacing(1, 1.5),
    borderBottom: '1px solid #e0e0e0',
    fontSize: '14px',
  },
  priceCell: {
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#1e88e5',
  },
  searchField: {
    margin: theme.spacing(0, 0, 1.5, 0),
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
      backgroundColor: '#ffffff',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#3f51b5',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#3f51b5',
      }
    },
  },
  categoryChip: {
    margin: theme.spacing(0, 0.5, 0.5, 0),
    fontSize: '11px',
    height: '22px',
  },
  categoryFilter: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(0, 1, 1, 1),
    borderBottom: '1px solid #e0e0e0',
  },
  itemsContainer: {
    flex: 1,
    marginRight: theme.spacing(2),
  },
  equipmentListHeader: {
    padding: theme.spacing(1),
    fontWeight: 'bold',
    backgroundColor: '#d0d0d0',
  },
  searchInput: {
    width: '100%',
    padding: theme.spacing(1),
    border: '1px solid #ccc',
    marginBottom: theme.spacing(1),
  },
  equipmentList: {
    height: '500px',
    overflow: 'auto',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
  },
  aiToggleButton: {
    position: 'fixed',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1000,
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '4px 0 0 4px',
    padding: theme.spacing(1),
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  },
  aiAssistantPanel: {
    position: 'fixed',
    right: '-320px',
    top: 0,
    width: '320px',
    height: '100vh',
    backgroundColor: '#fff',
    boxShadow: '-2px 0 5px rgba(0,0,0,0.2)',
    transition: 'right 0.3s ease',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
  },
  aiAssistantPanelOpen: {
    right: 0,
  },
  aiHeader: {
    backgroundColor: '#f0f0f0',
    padding: theme.spacing(1),
    fontWeight: 'bold',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiContent: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  aiCloseButton: {
    cursor: 'pointer',
    color: '#666',
    '&:hover': {
      color: '#000',
    },
  },
  calendarPopover: {
    padding: theme.spacing(2),
  },
  timeInput: {
    width: '80px',
  },
  actionIcons: {
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  clickableCell: {
    color: '#2196f3',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  activeRow: {
    backgroundColor: '#e3f2fd',
    '& td': {
      fontWeight: 'bold',
    },
  },
  dropZone: {
    minHeight: '200px',
    width: '100%',
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: theme.spacing(2),
    backgroundColor: '#f9f9f9',
    transition: 'all 0.3s ease',
  },
  dropZoneActive: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1890ff',
  },
  dropPreview: {
    backgroundColor: '#e6f7ff',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  gridTableRow: {
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  quantityCell: {
    display: 'flex',
    alignItems: 'center',
  },
  smallInput: {
    width: '60px',
  },
  actionCell: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  topSection: {
    display: 'flex',
    margin: theme.spacing(2),
  },
  orderInfoPanel: {
    width: '350px',
    backgroundColor: '#e0e0e0',
    border: '1px solid #ccc',
    marginRight: theme.spacing(2),
    padding: theme.spacing(1),
  },
  jobsMatrixContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    border: '1px solid #ccc',
  },
  selectedJobInfo: {
    backgroundColor: '#e3f2fd',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    borderRadius: '4px',
  },
  insertJobButton: {
    backgroundColor: '#2196f3',
    color: 'white',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#1976d2',
    },
  },
  equipmentDropTarget: {
    padding: '16px',
    border: '1px solid #ccc',
    height: '500px',
    overflow: 'auto',
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>{children}</Box>
      )}
    </div>
  );
}

// Item types for drag and drop
const ItemTypes = {
  EQUIPMENT_ITEM: 'equipmentItem',
  LIST_ITEM: 'listItem'
};

const JobsPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [equipmentItems, setEquipmentItems] = useState([
    { id: 1, quantity: 1, name: 'Meeting Room Projector Package', rate: 74.54, days: 2, total: 149.08 },
    { id: 2, quantity: 1, name: 'Spandex Cover', rate: 0, days: 2, total: 0 },
    { id: 3, quantity: 1, name: 'Tripod Screen 8\'', rate: 57.5, days: 2, total: 115 },
    { id: 4, quantity: 1, name: 'Projector', rate: 17.04, days: 2, total: 34.08 },
    { id: 5, quantity: 1, name: 'HDMI Cable', rate: 0, days: 2, total: 0 },
    { id: 6, quantity: 1, name: 'Flipchart Package', rate: 141.75, days: 2, total: 283.5 },
    { id: 7, quantity: 1, name: 'Pad Flipchart Paper Plain', rate: 18, days: 2, total: 36 },
    { id: 8, quantity: 1, name: 'Marker Flipchart 4 Color', rate: 3, days: 2, total: 6 },
    { id: 9, quantity: 1, name: 'DaLite A Frame Folding Flipchart', rate: 120, days: 2, total: 240 },
    { id: 10, quantity: 25, name: 'Wi-Fi Connections 3 Mbps', rate: 25, days: 2, total: 1250 },
  ]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editedStartDate, setEditedStartDate] = useState(null);
  const [editedEndDate, setEditedEndDate] = useState(null);
  const [editedStartTime, setEditedStartTime] = useState('');
  const [editedEndTime, setEditedEndTime] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const [editedRoom, setEditedRoom] = useState('');
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [jobEquipmentItems, setJobEquipmentItems] = useState({});
  const [activeJobId, setActiveJobId] = useState(null);
  const [availableEquipment, setAvailableEquipment] = useState(equipmentCatalog || []);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [insertJobDialogOpen, setInsertJobDialogOpen] = useState(false);
  const [newJobData, setNewJobData] = useState({
    room: '',
    startDate: new Date(),
    endDate: new Date(),
    startTime: '09:00',
    endTime: '17:00',
    status: 'Tentative'
  });
  const [insertJobErrors, setInsertJobErrors] = useState({});
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const searchInputRef = useRef(null);

  const mockRooms = [
    "Grand Ballroom",
    "Boardroom 1",
    "Boardroom 2",
    "Conference Room A",
    "Conference Room B",
    "Executive Suite",
    "Meeting Room 101",
    "Meeting Room 102",
    "Meeting Room 103",
    "Auditorium"
  ];

  const statusOptions = ["Quote", "Tentative", "Confirmed", "Canceled"];

  // Get unique categories from equipment
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(availableEquipment.map(item => item.category || 'Uncategorized'))];
    return cats.sort();
  }, [availableEquipment]);

  // Fix filtered equipment function to handle categories and search correctly
  const filteredEquipment = useMemo(() => {
    // Start with all equipment
    let filtered = [...availableEquipment];
    
    // Apply category filter first
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => 
        item.category === selectedCategory
      );
    }
    
    // Then apply search filter to the already category-filtered items
    if (equipmentSearchTerm.trim()) {
      const searchTermLower = equipmentSearchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTermLower) || 
        (item.category && item.category.toLowerCase().includes(searchTermLower))
      );
    }
    
    return filtered;
  }, [availableEquipment, equipmentSearchTerm, selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check for saved state in localStorage first
        const savedState = loadStateFromLocalStorage(orderId);
        
        if (savedState) {
          console.log('Loaded saved state from localStorage');
          // Restore state from localStorage
          setOrder(savedState.order);
          setJobs(savedState.jobs);
          setJobEquipmentItems(savedState.jobEquipmentItems);
          
          // Calculate totals
          const orderTotal = calculateOrderTotal(savedState.jobEquipmentItems);
          setOrder(prev => ({
            ...prev,
            total: orderTotal
          }));
        } else {
          // Load from API/mock data as before
          console.log('Loading fresh data');
          const orderResponse = await getOrderById(orderId);
          setOrder(orderResponse);
          
          const jobsResponse = await getJobsByOrderId(orderId);
          setJobs(jobsResponse);
          
          // Load equipment items for each job
          const equipmentData = {};
          for (const job of jobsResponse) {
            const jobId = job.job_id;
            const equipmentItems = await getEquipmentItemsByJobId(jobId);
            equipmentData[jobId] = equipmentItems;
          }
          setJobEquipmentItems(equipmentData);
        }
        
        // Set available equipment
        setAvailableEquipment(equipmentCatalog);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (orderId) {
      fetchData();
    }
  }, [orderId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNavigateHome = () => {
    history.push('/');
  };

  const handleNavigateToOrder = () => {
    history.push(`/orders/${orderId}`);
  };

  const handleInsertJobClick = () => {
    // Reset form data and errors
    setNewJobData({
      room: mockRooms[0],
      startDate: new Date(),
      endDate: new Date(),
      startTime: '09:00',
      endTime: '17:00',
      status: 'Tentative'
    });
    setInsertJobErrors({});
    setInsertJobDialogOpen(true);
  };

  const handleCloseInsertJobDialog = () => {
    setInsertJobDialogOpen(false);
  };

  const handleNewJobInputChange = (field, value) => {
    setNewJobData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (insertJobErrors[field]) {
      setInsertJobErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateNewJob = () => {
    const errors = {};
    
    if (!newJobData.room) {
      errors.room = 'Room is required';
    }
    
    if (!newJobData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!newJobData.endDate) {
      errors.endDate = 'End date is required';
    }
    
    if (newJobData.endDate < newJobData.startDate) {
      errors.endDate = 'End date cannot be before start date';
    }
    
    return errors;
  };

  const handleCreateNewJob = () => {
    // Validate required fields
    const errors = {};
    if (!newJobData.room) errors.room = 'Room is required';
    if (!newJobData.startDate) errors.startDate = 'Start date is required';
    if (!newJobData.endDate) errors.endDate = 'End date is required';
    
    if (Object.keys(errors).length > 0) {
      setInsertJobErrors(errors);
      return;
    }
    
    // Format date and time
    const startDateTime = formatDateTime(newJobData.startDate, newJobData.startTime);
    const endDateTime = formatDateTime(newJobData.endDate, newJobData.endTime);
    
    // Generate a 5-digit job ID
    const newJobId = Math.floor(10000 + Math.random() * 90000);
    
    // Create new job object
    const newJob = {
      job_id: newJobId,
      order_id: order.id,
      name: `Job ${newJobId}`,
      room: newJobData.room,
      start_time: startDateTime,
      end_time: endDateTime,
      account_name: order.client_name,
      sales_manager: order.sales_manager,
      job_total: 0,
      status: newJobData.status || 'Confirmed'
    };
    
    // Add new job to jobs list
    const updatedJobsList = [...jobs, newJob];
    setJobs(updatedJobsList);
    
    // Initialize empty equipment items for the new job
    setJobEquipmentItems(prev => ({
      ...prev,
      [newJobId]: []
    }));
    
    // Update order if needed
    if (order) {
      const updatedOrder = {
        ...order,
        // Update any order properties if needed
      };
      setOrder(updatedOrder);
    }
    
    // After job is created, save state to localStorage
    setTimeout(() => {
      saveStateToLocalStorage(orderId, {
        jobs: updatedJobsList, // Use updatedJobsList instead of updatedJobs
        jobEquipmentItems,
        order
      });
    }, 0);
    
    // Close dialog and reset form
    handleCloseInsertJobDialog();
  };

  const handleCellClick = (jobId, field, value) => {
    setEditingJobId(jobId);
    setEditingField(field);
    
    if (field === 'startDate' || field === 'endDate') {
      if (field === 'startDate') {
        setEditedStartDate(new Date(value));
      } else {
        setEditedEndDate(new Date(value));
      }
    } else if (field === 'startTime') {
      setEditedStartTime(value);
    } else if (field === 'endTime') {
      setEditedEndTime(value);
    } else if (field === 'status') {
      setEditedStatus(value);
    } else if (field === 'room') {
      setEditedRoom(value);
    }
  };

  const handleCalendarClick = (event, jobId, field, date) => {
    // Prevent default behavior (navigation)
    event.preventDefault();
    // Stop event from bubbling up to parent elements
    event.stopPropagation();
    
    setEditingJobId(jobId);
    setEditingField(field);
    
    if (field === 'startDate') {
      setEditedStartDate(date);
    } else {
      setEditedEndDate(date);
    }
    setCalendarAnchorEl(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setCalendarAnchorEl(null);
  };

  const handleCalendarChange = (date) => {
    console.log("Calendar date selected:", date);
    
    try {
      // Store the selected date and job ID before closing the calendar
      const selectedDate = date;
      const jobId = editingJobId;
      const field = editingField;
      
      // First close the calendar to prevent UI issues
      handleCalendarClose();
      
      // Then update the state
      if (field === 'startDate') {
        setEditedStartDate(selectedDate);
      } else {
        setEditedEndDate(selectedDate);
      }
      
      // Update the job in a safer way
      if (jobId && field) {
        const jobToUpdate = jobs.find(job => job.job_id === jobId);
        if (jobToUpdate) {
          let updatedJob = { ...jobToUpdate };
          
          if (field === 'startDate') {
            const currentDate = new Date(jobToUpdate.start_time);
            const updatedDate = new Date(selectedDate);
            updatedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
            updatedJob.start_time = updatedDate.toISOString();
          } else if (field === 'endDate') {
            const currentDate = new Date(jobToUpdate.end_time);
            const updatedDate = new Date(selectedDate);
            updatedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
            updatedJob.end_time = updatedDate.toISOString();
          }
          
          // Update the job in the database
          updateJob(updatedJob);
          
          // Update the local state in a safe way
          setJobs(prevJobs => {
            return prevJobs.map(job => 
              job.job_id === jobId ? updatedJob : job
            );
          });
        }
      }
    } catch (error) {
      console.error("Error updating date:", error);
      // Reset state to prevent UI issues
      handleCalendarClose();
      setEditingJobId(null);
      setEditingField(null);
    }
  };

  const handleTimeChange = (e) => {
    if (editingField === 'startTime') {
      setEditedStartTime(e.target.value);
    } else {
      setEditedEndTime(e.target.value);
    }
  };

  const handleStatusChange = (e) => {
    setEditedStatus(e.target.value);
  };

  const handleRoomChange = (e) => {
    setEditedRoom(e.target.value);
  };

  const cancelEdit = () => {
    setEditingJobId(null);
    setEditingField(null);
  };

  const calculateJobTotal = (equipmentItems) => {
    if (!equipmentItems || !Array.isArray(equipmentItems)) return 0;
    
    return equipmentItems.reduce((sum, item) => {
      if (!item) return sum;
      const quantity = item.quantity || 0;
      const rate = item.rate || 0;
      const days = item.days || 1;
      return sum + (quantity * rate * days);
    }, 0);
  };

  const calculateOrderTotal = (itemsMap = jobEquipmentItems) => {
    let total = 0;
    
    // Iterate through all jobs and their equipment items
    Object.values(itemsMap).forEach(items => {
      items.forEach(item => {
        total += item.total || 0;
      });
    });
    
    return total;
  };

  const saveChanges = (directDate) => {
    try {
      console.log("Saving changes with directDate:", directDate);
      if (!editingJobId || !editingField) {
        console.log("Missing editingJobId or editingField, cannot save");
        return;
      }
      
      const jobToUpdate = jobs.find(job => job.job_id === editingJobId);
      if (!jobToUpdate) {
        console.log("Job not found for ID:", editingJobId);
        return;
      }
      
      let updatedJob = { ...jobToUpdate };
      
      if (editingField === 'startDate' && directDate) {
        const currentDate = new Date(jobToUpdate.start_time);
        const updatedDate = new Date(directDate);
        updatedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
        updatedJob.start_time = updatedDate.toISOString();
      } else if (editingField === 'endDate' && directDate) {
        const currentDate = new Date(jobToUpdate.end_time);
        const updatedDate = new Date(directDate);
        updatedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
        updatedJob.end_time = updatedDate.toISOString();
      }
      
      // Update the job in the database
      updateJob(updatedJob);
      
      // Update the jobs list in a safe way
      setJobs(prevJobs => prevJobs.map(job => 
        job.job_id === editingJobId ? updatedJob : job
      ));
      
      // After updating the job, recalculate the total
      const newTotal = calculateJobTotal(jobEquipmentItems[editingJobId] || []);
      updatedJob.job_total = newTotal;
      
      // Reset the editing state
      setEditingJobId(null);
      setEditingField(null);
    } catch (error) {
      console.error("Error saving changes:", error);
      // Reset editing state to prevent UI issues
      setEditingJobId(null);
      setEditingField(null);
    }
  };

  const handleJobClick = (jobId) => {
    console.log(`Job ${jobId} selected`);
    
    // Set this job as the active job
    setActiveJobId(jobId);
    
    // If we're on the Notes tab, switch to the Items tab
    if (tabValue !== 0) {
      setTabValue(0);
    }
    
    // If we don't have equipment items for this job yet, initialize with empty array
    if (!jobEquipmentItems[jobId]) {
      setJobEquipmentItems(prev => ({
        ...prev,
        [jobId]: []
      }));
    }
    
    // Scroll to the items section
    const itemsSection = document.getElementById('items-section');
    if (itemsSection) {
      itemsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getEquipmentItemsByJobId = (jobId) => {
    // This would come from your data service in a real app
    // For now, we'll create mock data based on job ID
    return equipmentItems.filter(item => item.job_id === jobId);
  };

  const addEquipmentToJob = (jobId, equipment) => {
    // Create a new equipment item
    const newItem = {
      id: Date.now(), // Generate a unique ID
      job_id: jobId,
      quantity: 1,
      name: equipment.name,
      rate: equipment.price,
      days: 2, // Default to 2 days
      total: equipment.price * 2 // Calculate total
    };
    
    // Add the item to the job's equipment
    setEquipmentItems(prev => [...prev, newItem]);
    
    // Update the job's total
    setJobs(prev => prev.map(job => {
      if (job.job_id === jobId) {
        const updatedTotal = job.job_total + newItem.total;
        return {
          ...job,
          job_total: updatedTotal
        };
      }
      return job;
    }));
    
    // Update job equipment items
    setJobEquipmentItems(prev => ({
      ...prev,
      [jobId]: [...(prev[jobId] || []), newItem]
    }));
  };

  const handleEquipmentClick = (equipment) => {
    // Add the equipment to the active job
    if (activeJobId) {
      addEquipmentToJob(activeJobId, equipment);
    } else {
      alert("Please select a job first to add equipment");
    }
  };

  // Add this function at the top level of your component
  const focusTextFieldHack = () => {
    // Pure DOM approach to ensure we maintain focus
    setTimeout(() => {
      const searchField = document.querySelector('input[placeholder="Search equipment..."]');
      if (searchField && document.activeElement !== searchField) {
        searchField.focus();
        
        // Position cursor at the end
        const len = searchField.value.length;
        searchField.setSelectionRange(len, len);
      }
    }, 10);
  };

  // Create a class-based component for the search field to better manage focus
  class SearchInputWithFocus extends React.Component {
    constructor(props) {
      super(props);
      this.inputRef = React.createRef();
    }
    
    componentDidMount() {
      if (this.inputRef.current) {
        this.inputRef.current.focus();
      }
    }
    
    componentDidUpdate() {
      if (this.inputRef.current) {
        this.inputRef.current.focus();
        // Position cursor at the end
        const len = this.props.value.length;
        this.inputRef.current.setSelectionRange(len, len);
      }
    }
    
    render() {
      return (
        <TextField
          placeholder="Search equipment..."
          variant="outlined"
          size="small"
          fullWidth
          value={this.props.value}
          onChange={this.props.onChange}
          className={this.props.className}
          inputRef={this.inputRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: this.props.value ? (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={this.props.onClear}
                  aria-label="clear search"
                  onMouseDown={(e) => e.preventDefault()} 
                >
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
        />
      );
    }
  }

  // Use the class component in your EquipmentList function
  const EquipmentList = () => {
    const classes = useStyles();
    
    // Updated handlers
    const handleSearchChange = (e) => {
      setEquipmentSearchTerm(e.target.value);
      focusTextFieldHack();
    };
    
    const clearSearch = () => {
      setEquipmentSearchTerm('');
      focusTextFieldHack();
    };
    
    const handleCategoryChange = (category) => {
      setSelectedCategory(category);
      focusTextFieldHack();
    };
    
    return (
      <div className={classes.equipmentListContainer}>
        <div className={classes.equipmentHeader}>
          <Typography variant="subtitle1" className={classes.sectionTitle}>
            Available Equipment
          </Typography>
          <SearchInputWithFocus
            value={equipmentSearchTerm}
            onChange={handleSearchChange}
            onClear={clearSearch}
            className={classes.searchField}
          />
        </div>
        
        <div className={classes.categoryFilter}>
          {categories.map(category => (
            <Chip
              key={category}
              label={category}
              size="small"
              className={classes.categoryChip}
              onClick={() => handleCategoryChange(category)}
              color={selectedCategory === category ? "primary" : "default"}
              variant={selectedCategory === category ? "default" : "outlined"}
              onMouseDown={(e) => e.preventDefault()}
            />
          ))}
        </div>
        
        <div className={classes.equipmentListScroll}>
          <table className={classes.equipmentTable}>
            <thead>
              <tr>
                <th style={{paddingLeft: '12px'}}>Item Name</th>
                <th style={{textAlign: 'right', paddingRight: '12px'}}>Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center', padding: '24px 16px' }}>
                    <Typography variant="body2" color="textSecondary">
                      No equipment found matching "{equipmentSearchTerm}"
                      {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                    </Typography>
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((item, index) => (
                  <DraggableEquipmentItem key={item.id} item={item} index={index} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Update the DraggableEquipmentItem component
  const DraggableEquipmentItem = ({ item, index }) => {
    const classes = useStyles();
    
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.EQUIPMENT_ITEM,
      item: () => ({ ...item, index }),
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
    
    return (
      <tr 
        ref={drag}
        style={{ 
          opacity: isDragging ? 0.5 : 1, 
          cursor: 'grab',
          backgroundColor: isDragging ? '#e3f2fd' : undefined 
        }}
        className={classes.equipmentTableRow}
      >
        <td className={classes.equipmentTableCell}>
          {item.name}
          {item.category && (
            <Typography variant="caption" display="block" color="textSecondary">
              {item.category}
            </Typography>
          )}
        </td>
        <td className={`${classes.equipmentTableCell} ${classes.priceCell}`}>
          ${(item.price || item.rate || 0).toFixed(2)}
        </td>
      </tr>
    );
  };

  // Next, let's make sure the handleDeleteItem function is accessible
  // This should be defined at the EquipmentDropTarget level, not inside the DraggableJobItem
  const EquipmentDropTarget = () => {
    const classes = useStyles();
    
    const [{ isOver }, drop] = useDrop(() => ({
      accept: ItemTypes.EQUIPMENT_ITEM,
      drop: (item) => handleDrop(item),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));
    
    // Get equipment items for the active job
    const items = activeJobId ? jobEquipmentItems[activeJobId] || [] : [];
    
    // Handle deleting an item - Define the function here
    const handleDeleteItem = (itemId) => {
      if (!activeJobId) return;
      
      setJobEquipmentItems(prev => {
        const updatedItems = {
          ...prev,
          [activeJobId]: prev[activeJobId].filter(item => item.id !== itemId)
        };
        
        // Update order total after removing the item
        setTimeout(() => {
          const newTotal = calculateOrderTotal();
          setOrder(prev => ({
            ...prev,
            total: newTotal
          }));
        }, 0);
        
        return updatedItems;
      });
    };
    
    return (
      <div 
        ref={drop} 
        className={classes.dropZone}
        style={{ 
          backgroundColor: isOver ? '#e3f2fd' : '#fff',
          padding: '16px',
          border: '1px solid #ccc',
          height: '500px',
          overflow: 'auto'
        }}
      >
        <div className={classes.selectedJobInfo}>
          {activeJobId ? (
            <Typography variant="subtitle1">
              Items for Job #{activeJobId}
            </Typography>
          ) : (
            <Typography variant="subtitle1" color="textSecondary">
              Select a job to view or add items
            </Typography>
          )}
        </div>
        
        <table className={classes.gridTable}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Std Rate</th>
              <th>Days</th>
              <th>Line Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!activeJobId && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  Select a job to view items
                </td>
              </tr>
            )}
            
            {activeJobId && items.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  Drag equipment items here
                </td>
              </tr>
            )}
            
            {activeJobId && items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)}
                    style={{ width: '50px' }}
                  />
                </td>
                <td>${parseFloat(item.rate).toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    value={item.days}
                    min="1"
                    onChange={(e) => handleDaysChange(item.id, parseInt(e.target.value, 10) || 1)}
                    style={{ width: '50px' }}
                  />
                </td>
                <td>${(item.quantity * item.rate * item.days).toFixed(2)}</td>
                <td>
                  <IconButton size="small" onClick={() => handleDeleteItem(item.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
          {activeJobId && items.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  Total:
                </td>
                <td colSpan="2" style={{ fontWeight: 'bold' }}>
                  ${items.reduce((sum, item) => sum + (item.quantity * item.rate * item.days), 0).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    );
  };

  // Define missing handler functions
  const handleDrop = (item) => {
    if (!activeJobId) {
      alert('Please select a job first');
      return;
    }
    
    // Find the active job to get its start and end dates
    const activeJob = jobs.find(job => job.job_id.toString() === activeJobId.toString());
    if (!activeJob) return;
    
    // Calculate days automatically based on job dates
    const days = calculateDaysBetweenDates(activeJob.start_time, activeJob.end_time);
    
    // Ensure rate is properly set from the original equipment item
    const rate = parseFloat(item.price || item.rate || 0);
    const quantity = 1;
    const lineTotal = quantity * rate * days;
    
    // Create a new equipment item with proper values
    const newItem = {
      id: uuidv4(),
      job_id: activeJobId,
      name: item.name,
      quantity: quantity,
      rate: rate,
      days: days,
      total: lineTotal
    };
    
    console.log(`Adding equipment item with rate: $${rate}, days: ${days}, and line total: $${lineTotal}`);
    
    // Add the item to the job's equipment items
    setJobEquipmentItems(prev => {
      const updatedItems = {
        ...prev,
        [activeJobId]: [...(prev[activeJobId] || []), newItem]
      };
      
      // Update order total after changing items
      setTimeout(() => {
        const newTotal = calculateOrderTotal();
        setOrder(prev => ({
          ...prev,
          total: newTotal
        }));
      }, 0);
      
      // Save state to localStorage
      setTimeout(() => {
        saveStateToLocalStorage(orderId, {
          jobs,
          jobEquipmentItems: updatedItems,
          order
        });
      }, 0);
      
      return updatedItems;
    });
  };

  const moveEquipmentItem = (fromIndex, toIndex) => {
    if (!activeJobId) return;
    
    setJobEquipmentItems(prev => {
      const jobItems = [...(prev[activeJobId] || [])];
      const item = jobItems[fromIndex];
      jobItems.splice(fromIndex, 1);
      jobItems.splice(toIndex, 0, item);
      return { ...prev, [activeJobId]: jobItems };
    });
  };

  const handleItemEdit = (index, field, value) => {
    if (!activeJobId) return;
    
    setJobEquipmentItems(prev => {
      const jobItems = [...(prev[activeJobId] || [])];
      const updatedItem = { ...jobItems[index], [field]: value };
      
      // Recalculate total when quantity or days change
      if (field === 'quantity' || field === 'days') {
        updatedItem.total = updatedItem.quantity * updatedItem.rate * updatedItem.days;
      }
      
      jobItems[index] = updatedItem;
      
      // Update the job total
      const newTotal = jobItems.reduce((sum, item) => sum + item.total, 0);
      setJobs(prev => prev.map(job => 
        job.job_id === activeJobId ? { ...job, job_total: newTotal } : job
      ));
      
      // Save state to localStorage
      setTimeout(() => {
        saveStateToLocalStorage(orderId, {
          jobs,
          jobEquipmentItems: jobItems,
          order
        });
      }, 0);
      
      return { ...prev, [activeJobId]: jobItems };
    });
  };

  const handleItemDelete = (index) => {
    if (!activeJobId) return;
    
    setJobEquipmentItems(prev => {
      const jobItems = [...(prev[activeJobId] || [])];
      jobItems.splice(index, 1);
      
      // Update the job total
      const newTotal = jobItems.reduce((sum, item) => sum + item.total, 0);
      setJobs(prev => prev.map(job => 
        job.job_id === activeJobId ? { ...job, job_total: newTotal } : job
      ));
      
      // Save state to localStorage
      setTimeout(() => {
        saveStateToLocalStorage(orderId, {
          jobs,
          jobEquipmentItems: jobItems,
          order
        });
      }, 0);
      
      return { ...prev, [activeJobId]: jobItems };
    });
  };

  const toggleAiAssistant = () => {
    setAiAssistantOpen(!aiAssistantOpen);
  };

  // Update the handleSaveOrder function with better error handling and validation
  const handleSaveOrder = async () => {
    try {
      setLoading(true);
      
      console.log('Saving order data...');
      
      // Validate order data
      if (!order || !order.id) {
        console.error('Invalid order data:', order);
        throw new Error('Cannot save: Order data is invalid');
      }
      
      // Calculate the total from all jobs with validation
      const orderTotal = calculateOrderTotal();
      
      console.log(`Calculated order total: $${orderTotal}`);
      
      // Update the order with the new total
      const updatedOrder = {
        ...order,
        total: orderTotal
      };
      
      // Save the order using the data service
      console.log('Saving order:', updatedOrder);
      const savedOrder = saveOrder(updatedOrder);
      setOrder(savedOrder);
      
      // Save each job with validation
      for (const job of jobs) {
        if (!job || !job.job_id) {
          console.warn('Skipping invalid job:', job);
          continue;
        }
        
        console.log(`Saving job ${job.job_id}...`);
        
        // Make sure job has an order_id reference
        const jobToSave = {
          ...job,
          order_id: job.order_id || order.id // Ensure order_id is set
        };
        
        saveJob(jobToSave);
      }
      
      // Save equipment items for each job with validation
      for (const [jobId, items] of Object.entries(jobEquipmentItems)) {
        if (!jobId || jobId === 'undefined' || jobId === 'null') {
          console.warn('Skipping equipment items with invalid job ID');
          continue;
        }
        
        if (!items || !Array.isArray(items) || items.length === 0) {
          console.log(`No equipment items to save for job ${jobId}`);
          continue;
        }
        
        console.log(`Saving ${items.length} equipment items for job ${jobId}...`);
        
        // Filter out invalid items and ensure job_id is set
        const validItems = items
          .filter(item => item !== null && item !== undefined)
          .map(item => ({
            ...item,
            job_id: jobId
          }));
        
        if (validItems.length > 0) {
          saveEquipmentItems(jobId, validItems);
        }
      }
      
      // After successful save, clear localStorage
      clearSavedState(orderId);
      
      setLoading(false);
      alert('Order saved successfully!');
    } catch (error) {
      console.error('Error saving order:', error);
      setLoading(false);
      alert('Error saving order.');
    }
  };

  // Add these handler functions to update quantity and days
  const handleQuantityChange = (itemId, newQuantity) => {
    if (!activeJobId) return;
    
    setJobEquipmentItems(prev => {
      const items = [...(prev[activeJobId] || [])];
      const itemIndex = items.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        // Update quantity and recalculate total
        const updatedItem = {
          ...items[itemIndex],
          quantity: newQuantity,
          total: newQuantity * items[itemIndex].rate * items[itemIndex].days
        };
        items[itemIndex] = updatedItem;
        
        // Update state and recalculate order total
        const updatedItems = {
          ...prev,
          [activeJobId]: items
        };
        
        // Save state to localStorage
        setTimeout(() => {
          saveStateToLocalStorage(orderId, {
            jobs,
            jobEquipmentItems: updatedItems,
            order
          });
        }, 0);
        
        return updatedItems;
      }
      
      return prev;
    });
  };

  const handleDaysChange = (itemId, newDays) => {
    if (!activeJobId) return;
    
    setJobEquipmentItems(prev => {
      const items = [...(prev[activeJobId] || [])];
      const itemIndex = items.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        // Update days and recalculate total
        const updatedItem = {
          ...items[itemIndex],
          days: newDays,
          total: items[itemIndex].quantity * items[itemIndex].rate * newDays
        };
        items[itemIndex] = updatedItem;
        
        // Update state and recalculate order total
        const updatedItems = {
          ...prev,
          [activeJobId]: items
        };
        
        // Save state to localStorage
        setTimeout(() => {
          saveStateToLocalStorage(orderId, {
            jobs,
            jobEquipmentItems: updatedItems,
            order
          });
        }, 0);
        
        return updatedItems;
      }
      
      return prev;
    });
  };

  // Add this function to calculate the number of days between two dates (inclusive)
  const calculateDaysBetweenDates = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    
    // Parse the dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Check for valid dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
    
    // Calculate difference in days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Return at least 1 day
    return Math.max(1, diffDays + 1); // +1 to include both start and end dates
  };

  // Update this function to recalculate days for all items when job dates change
  const handleUpdateJob = (jobId, field, value) => {
    const jobIndex = jobs.findIndex(job => job.job_id === jobId);
    if (jobIndex === -1) return;
    
    const updatedJobs = [...jobs];
    updatedJobs[jobIndex] = { ...updatedJobs[jobIndex], [field]: value };
    
    setJobs(updatedJobs);
    
    // Save state to localStorage
    setTimeout(() => {
      saveStateToLocalStorage(orderId, {
        jobs: updatedJobs,
        jobEquipmentItems,
        order
      });
    }, 0);
  };

  // Enhanced save state function with better error handling
  const saveStateToLocalStorage = (orderIdToSave, stateToSave) => {
    const key = `orderState_${orderIdToSave}`;
    try {
      // Create a deep copy to avoid reference issues
      const stateCopy = {
        jobs: JSON.parse(JSON.stringify(stateToSave.jobs || [])),
        jobEquipmentItems: JSON.parse(JSON.stringify(stateToSave.jobEquipmentItems || {})),
        order: JSON.parse(JSON.stringify(stateToSave.order || {})),
        lastSaved: new Date().toISOString()
      };
      
      localStorage.setItem(key, JSON.stringify(stateCopy));
      
      // Also save to sessionStorage as a backup
      sessionStorage.setItem(key, JSON.stringify(stateCopy));
      
      // Save a list of all orders that have unsaved changes
      const pendingOrdersStr = localStorage.getItem('pendingOrders') || '[]';
      const pendingOrders = JSON.parse(pendingOrdersStr);
      if (!pendingOrders.includes(orderIdToSave)) {
        pendingOrders.push(orderIdToSave);
        localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
      }
      
      console.log('Successfully saved state to storage:', key);
    } catch (error) {
      console.error('Error saving state to storage:', error);
      // Try a more minimal save approach if the full save fails
      try {
        const minimalState = {
          orderId: orderIdToSave,
          lastSaved: new Date().toISOString(),
          hasUnsavedChanges: true
        };
        localStorage.setItem(`orderMinimal_${orderIdToSave}`, JSON.stringify(minimalState));
      } catch (fallbackError) {
        console.error('Even minimal state save failed:', fallbackError);
      }
    }
  };

  // Enhanced load state function with better error handling and fallbacks
  const loadStateFromLocalStorage = (orderIdToLoad) => {
    const key = `orderState_${orderIdToLoad}`;
    try {
      // First try localStorage
      let savedState = localStorage.getItem(key);
      
      // If not in localStorage, try sessionStorage
      if (!savedState) {
        savedState = sessionStorage.getItem(key);
        if (savedState) {
          console.log('Recovered state from sessionStorage fallback');
        }
      }
      
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Validate the parsed state has the expected structure
        if (!parsedState.jobs || !parsedState.order || !parsedState.jobEquipmentItems) {
          console.warn('Loaded state has invalid structure, using default data instead');
          return null;
        }
        
        return parsedState;
      }
    } catch (error) {
      console.error('Error loading state from storage:', error);
      // Check if we have a minimal record of unsaved changes
      try {
        const minimalState = localStorage.getItem(`orderMinimal_${orderIdToLoad}`);
        if (minimalState) {
          const parsed = JSON.parse(minimalState);
          if (parsed.hasUnsavedChanges) {
            console.warn('Detected unsaved changes, but full state recovery failed');
            // We could potentially show a warning to the user here
          }
        }
      } catch (minimalError) {
        console.error('Error checking minimal state:', minimalError);
      }
    }
    return null;
  };

  // Add automatic state saving on component unmount
  useEffect(() => {
    // Save state when component unmounts or when leaving the page
    return () => {
      console.log('JobsPage unmounting, saving state');
      if (order && order.id) {
        saveStateToLocalStorage(order.id, {
          jobs,
          jobEquipmentItems,
          order
        });
      }
    };
  }, [order, jobs, jobEquipmentItems]);

  // Add periodic auto-save 
  useEffect(() => {
    if (!order || !order.id) return;
    
    // Set up auto-save interval (every 30 seconds)
    const autoSaveInterval = setInterval(() => {
      console.log('Auto-saving state...');
      saveStateToLocalStorage(order.id, {
        jobs,
        jobEquipmentItems,
        order
      });
    }, 30000); // 30 seconds
    
    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [order, jobs, jobEquipmentItems]);

  // Save state on window unload/navigation away
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('Window unloading, saving state');
      if (order && order.id) {
        saveStateToLocalStorage(order.id, {
          jobs,
          jobEquipmentItems,
          order
        });
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [order, jobs, jobEquipmentItems]);

  // Add this formatDateTime function to combine date and time values
  const formatDateTime = (date, timeString) => {
    if (!date || !timeString) return '';
    
    const dateObj = new Date(date);
    const [hours, minutes] = timeString.split(':').map(Number);
    
    dateObj.setHours(hours, minutes, 0, 0);
    return dateObj.toISOString();
  };

  // Add the missing clearSavedState function
  const clearSavedState = (orderIdToRemove) => {
    try {
      // Clear state data from localStorage and sessionStorage
      const key = `orderState_${orderIdToRemove}`;
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      
      // Remove from minimal state if it exists
      localStorage.removeItem(`orderMinimal_${orderIdToRemove}`);
      
      // Remove from pending orders list
      const pendingOrdersStr = localStorage.getItem('pendingOrders') || '[]';
      const pendingOrders = JSON.parse(pendingOrdersStr);
      const updatedPendingOrders = pendingOrders.filter(id => id !== orderIdToRemove);
      localStorage.setItem('pendingOrders', JSON.stringify(updatedPendingOrders));
      
      console.log('Cleared saved state from storage:', key);
    } catch (error) {
      console.error('Error clearing saved state:', error);
    }
  };

  const handleAddAIRecommendation = (item) => {
    // Add the recommended equipment to the job equipment list
    if (!activeJobId) {
      alert('Please select a job first');
      return;
    }
    
    const newEquipment = {
      id: Date.now(),
      job_id: activeJobId, // Use activeJobId instead of jobId
      equipment_id: item.id,
      name: item.name,
      quantity: item.quantity,
      rate: item.rate,
      days: 1, // Default to 1 day
      total: item.quantity * item.rate, // Calculate total
    };
    
    // Add to the job equipment items
    setJobEquipmentItems(prev => ({
      ...prev,
      [activeJobId]: [...(prev[activeJobId] || []), newEquipment]
    }));
    
    // Create a simple alert instead of using undefined setSnackbar
    alert(`Added ${item.quantity}x ${item.name} to the equipment list`);
  };

  if (loading || !order) {
    return <div>Loading order and jobs data...</div>;
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DndProvider backend={HTML5Backend}>
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
                Save Order
              </Button>
              <Button 
                className={classes.navButton}
                onClick={() => {
                  // Use proper check without directly referencing global location
                  if (orderId) {
                    history.push(`/orders/${orderId}`);
                  }
                }}
              >
                Order
              </Button>
              <Button 
                className={classes.navButton}
                onClick={(e) => {
                  // Do nothing if we're already on the jobs page
                  e.preventDefault();
                  return false;
                }}
                style={{ fontWeight: 'bold' }} // Bold to show it's the current page
              >
                Jobs
              </Button>
              <Button 
                className={classes.navButton}
                color="primary"
                onClick={handleInsertJobClick}
              >
                Insert Job
              </Button>
            </div>
          </div>

          {/* Main Content Container */}
          <div className={classes.contentContainer}>
            {/* Top Section with Order Info and Job Matrix side by side */}
            <div className={classes.topSection}>
              {/* Order Info Panel - Left Side */}
              <div className={classes.orderInfoPanel}>
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
                  <div className={classes.orderInfoValue}>${order.total ? order.total.toLocaleString() : '0'}</div>
                </div>
              </div>

              {/* Jobs Matrix - Right Side */}
              <div className={classes.jobsMatrixContainer}>
                <Table className={classes.jobsTable}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Job Number</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>End Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Room</TableCell>
                      <TableCell>Net Due</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jobs.map((job) => {
                      const startDate = new Date(job.start_time);
                      const endDate = new Date(job.end_time);
                      return (
                        <TableRow 
                          key={job.job_id}
                          className={activeJobId === job.job_id ? classes.activeRow : ''}
                          onClick={() => handleJobClick(job.job_id)}
                        >
                          <TableCell>
                            <span 
                              className={classes.clickableCell}
                              onClick={() => handleJobClick(job.job_id)}
                            >
                              {job.job_id}
                            </span>
                          </TableCell>
                          <TableCell className={classes.editableCell}>
                            <div 
                              onClick={(e) => handleCalendarClick(e, job.job_id, 'startDate', startDate)}
                              style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                            >
                              {startDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
                            </div>
                          </TableCell>
                          <TableCell className={classes.editableCell}>
                            {editingJobId === job.job_id && editingField === 'startTime' ? (
                              <div className={classes.actionIcons}>
                                <TextField
                                  type="time"
                                  defaultValue={format(startDate, 'HH:mm')}
                                  className={classes.timeInput}
                                  inputProps={{ step: 300 }}
                                  onChange={handleTimeChange}
                                  autoFocus
                                />
                                <IconButton size="small" onClick={() => saveChanges(startDate)}>
                                  <Save fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={cancelEdit}>
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </div>
                            ) : (
                              <div onClick={() => handleCellClick(job.job_id, 'startTime', format(startDate, 'HH:mm'))}>
                                {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className={classes.editableCell}>
                            <div 
                              onClick={(e) => handleCalendarClick(e, job.job_id, 'endDate', endDate)}
                              style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                            >
                              {endDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
                            </div>
                          </TableCell>
                          <TableCell className={classes.editableCell}>
                            {editingJobId === job.job_id && editingField === 'endTime' ? (
                              <div className={classes.actionIcons}>
                                <TextField
                                  type="time"
                                  defaultValue={format(endDate, 'HH:mm')}
                                  className={classes.timeInput}
                                  inputProps={{ step: 300 }}
                                  onChange={handleTimeChange}
                                  autoFocus
                                />
                                <IconButton size="small" onClick={() => saveChanges(endDate)}>
                                  <Save fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={cancelEdit}>
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </div>
                            ) : (
                              <div onClick={() => handleCellClick(job.job_id, 'endTime', format(endDate, 'HH:mm'))}>
                                {endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className={classes.editableCell}>
                            {editingJobId === job.job_id && editingField === 'status' ? (
                              <div className={classes.actionIcons}>
                                <Select
                                  value={editedStatus}
                                  onChange={handleStatusChange}
                                  autoWidth
                                  style={{ minWidth: 120 }}
                                  autoFocus
                                >
                                  {statusOptions.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                  ))}
                                </Select>
                                <IconButton size="small" onClick={() => saveChanges(null)}>
                                  <Save fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={cancelEdit}>
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </div>
                            ) : (
                              <div onClick={() => handleCellClick(job.job_id, 'status', job.status || 'Confirmed')}>
                                {job.status || 'Confirmed'}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className={classes.editableCell}>
                            {editingJobId === job.job_id && editingField === 'room' ? (
                              <div className={classes.actionIcons}>
                                <Select
                                  value={editedRoom}
                                  onChange={handleRoomChange}
                                  autoWidth
                                  style={{ minWidth: 150 }}
                                  autoFocus
                                >
                                  {mockRooms.map(room => (
                                    <MenuItem key={room} value={room}>{room}</MenuItem>
                                  ))}
                                </Select>
                                <IconButton size="small" onClick={() => saveChanges(null)}>
                                  <Save fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={cancelEdit}>
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </div>
                            ) : (
                              <div onClick={() => handleCellClick(job.job_id, 'room', job.room)}>
                                {job.room}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>${calculateJobTotal(jobEquipmentItems[job.job_id] || []).toLocaleString()}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Tabs Section */}
            <div className={classes.tabsSection}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Items" className={classes.tabButton} />
                <Tab label="Notes" className={classes.tabButton} />
              </Tabs>
              
              {/* Items Tab Content - Reorganized */}
              <TabPanel value={tabValue} index={0} id="items-section">
                <div className={classes.mainContent}>
                  {/* Equipment Section with two parts */}
                  <div className={classes.equipmentSection}>
                    {/* Equipment List */}
                    <EquipmentList />
                    
                    {/* Items List (Equipment Drop Target) */}
                    <div className={classes.itemsContainer}>
                      <EquipmentDropTarget />
                    </div>
                  </div>
                  
                  {/* AI Assistant Toggle Button */}
                  <div 
                    className={classes.aiToggleButton}
                    onClick={toggleAiAssistant}
                  >
                    <span>AI</span>
                  </div>
                </div>
              </TabPanel>
              
              {/* Notes Tab Content */}
              <TabPanel value={tabValue} index={1}>
                <div style={{ padding: '16px' }}>
                  <TextField
                    label="Notes"
                    multiline
                    rows={8}
                    variant="outlined"
                    fullWidth
                    placeholder="Add notes here..."
                  />
                </div>
              </TabPanel>
            </div>
          </div>

          {/* Calendar Popover */}
          <Popover
            open={Boolean(calendarAnchorEl)}
            anchorEl={calendarAnchorEl}
            onClose={() => {
              console.log("Calendar popover closing");
              try {
                handleCalendarClose();
                setEditingJobId(null);
                setEditingField(null);
              } catch (error) {
                console.error("Error closing calendar:", error);
              }
            }}
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
                date={editingField === 'startDate' ? editedStartDate : editedEndDate}
                onChange={(date) => {
                  try {
                    console.log("Calendar onChange, date selected:", date);
                    handleCalendarChange(date);
                  } catch (error) {
                    console.error("Error in calendar change:", error);
                    handleCalendarClose();
                  }
                }}
              />
            </div>
          </Popover>

          {/* Collapsible AI Assistant Panel */}
          <div className={`${classes.aiAssistantPanel} ${aiAssistantOpen ? classes.aiAssistantPanelOpen : ''}`}>
            <div className={classes.aiHeader}>
              <span>AI Assistant</span>
              <span 
                className={classes.aiCloseButton}
                onClick={() => setAiAssistantOpen(false)}
              >
                ✕
              </span>
            </div>
            <div className={classes.aiContent}>
              <AIAssistant 
                jobId={activeJobId}
                orderId={orderId}
                equipmentCatalog={equipmentCatalog}
                onAddEquipment={handleAddAIRecommendation}
              />
            </div>
          </div>

          {/* Insert Job Dialog */}
          <Dialog open={insertJobDialogOpen} onClose={handleCloseInsertJobDialog} maxWidth="md">
            <DialogTitle>Insert New Job</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!insertJobErrors.room}>
                    <InputLabel>Room</InputLabel>
                    <Select
                      value={newJobData.room}
                      onChange={(e) => handleNewJobInputChange('room', e.target.value)}
                    >
                      {mockRooms.map(room => (
                        <MenuItem key={room} value={room}>{room}</MenuItem>
                      ))}
                    </Select>
                    {insertJobErrors.room && <FormHelperText>{insertJobErrors.room}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!insertJobErrors.status}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={newJobData.status}
                      onChange={(e) => handleNewJobInputChange('status', e.target.value)}
                    >
                      {statusOptions.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 2 }}>
                        <TextField
                          label="Start Date"
                          type="date"
                          value={format(newJobData.startDate, 'yyyy-MM-dd')}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            handleNewJobInputChange('startDate', date);
                          }}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          error={!!insertJobErrors.startDate}
                          helperText={insertJobErrors.startDate}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <TextField
                          label="Time"
                          type="time"
                          value={newJobData.startTime}
                          onChange={(e) => handleNewJobInputChange('startTime', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ step: 300 }}
                          fullWidth
                        />
                      </div>
                    </div>
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 2 }}>
                        <TextField
                          label="End Date"
                          type="date"
                          value={format(newJobData.endDate, 'yyyy-MM-dd')}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            handleNewJobInputChange('endDate', date);
                          }}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          error={!!insertJobErrors.endDate}
                          helperText={insertJobErrors.endDate}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <TextField
                          label="Time"
                          type="time"
                          value={newJobData.endTime}
                          onChange={(e) => handleNewJobInputChange('endTime', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ step: 300 }}
                          fullWidth
                        />
                      </div>
                    </div>
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseInsertJobDialog} color="default">
                Cancel
              </Button>
              <Button onClick={handleCreateNewJob} color="primary" variant="contained">
                Create Job
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </DndProvider>
    </MuiPickersUtilsProvider>
  );
};

export default JobsPage; 