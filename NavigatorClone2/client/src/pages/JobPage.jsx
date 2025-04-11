import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  Box, Button, Typography, Paper, TextField, 
  Grid, makeStyles, Divider, Table, 
  TableCell, TableContainer, TableHead, TableRow, TableBody, Tabs, Tab
} from '@material-ui/core';
import Header from '../components/Header';
import EquipmentList from '../components/EquipmentList';
import AIAssistant from '../components/AIAssistant';
import { mockJobs, mockOrders, mockEquipment, mockJobEquipment } from '../services/mockData';
import OrderJobHeader from '../components/OrderJobHeader';
import { getJobById, getOrderById } from '../services/dataService';
import NavigatorLogo from '../assets/navigator-logo.png';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  orderInfo: {
    display: 'flex',
    backgroundColor: '#e0e0e0',
    padding: theme.spacing(2),
    borderBottom: '1px solid #ccc',
  },
  orderInfoItem: {
    marginRight: theme.spacing(5),
  },
  orderInfoLabel: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(0.5),
  },
  jobTable: {
    width: '100%',
    border: '1px solid #ccc',
    borderCollapse: 'collapse',
    '& th, & td': {
      border: '1px solid #ccc',
      padding: theme.spacing(1),
      textAlign: 'left',
    },
    '& th': {
      backgroundColor: '#e0e0e0',
      fontWeight: 'bold',
    },
  },
  tabsContainer: {
    backgroundColor: '#e0e0e0',
    padding: theme.spacing(0.5, 1),
    marginTop: theme.spacing(2),
  },
  tabButton: {
    padding: theme.spacing(0.5, 2),
    margin: theme.spacing(0, 0.5),
    textTransform: 'none',
    fontWeight: 'normal',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: 0,
    '&.active': {
      backgroundColor: '#1976d2',
      color: 'white',
    },
  },
  contentContainer: {
    display: 'flex',
    padding: theme.spacing(1),
    backgroundColor: '#e0e0e0',
  },
  equipmentListContainer: {
    width: '250px',
    backgroundColor: '#e0e0e0',
    marginRight: theme.spacing(1),
  },
  equipmentListHeader: {
    backgroundColor: '#d0d0d0',
    padding: theme.spacing(1),
    fontWeight: 'bold',
  },
  searchInput: {
    padding: theme.spacing(1),
    width: '100%',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  equipmentList: {
    height: '500px',
    overflow: 'auto',
    backgroundColor: '#ffffff',
    border: '1px solid #ccc',
  },
  equipmentTable: {
    flex: 1,
    marginRight: theme.spacing(1),
  },
  equipmentTableHeader: {
    backgroundColor: '#fff',
    '& th': {
      fontWeight: 'bold',
      padding: theme.spacing(0.5, 1),
      borderBottom: '1px solid #ccc',
      textAlign: 'left',
    },
  },
  aiAssistant: {
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
  },
  aiHeader: {
    padding: theme.spacing(1),
    backgroundColor: '#d0d0d0',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  aiTextarea: {
    height: '300px',
    padding: theme.spacing(1),
    border: '1px solid #ccc',
    resize: 'none',
    fontSize: '14px',
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#00BCD4',
    color: 'white',
    padding: theme.spacing(1),
    marginTop: 'auto',
    textTransform: 'none',
    fontWeight: 'bold',
    borderRadius: '0 0 4px 4px',
    '&:hover': {
      backgroundColor: '#00ACC1',
    }
  },
  content: {
    flex: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  jobTitle: {
    marginBottom: theme.spacing(3),
    fontWeight: 500,
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  tabPanel: {
    marginTop: theme.spacing(2),
  },
  section: {
    marginTop: theme.spacing(3),
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
    '& > button': {
      marginLeft: theme.spacing(1),
    },
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
  detailsRow: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  detailsLabel: {
    fontWeight: 'bold',
    minWidth: 180,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`job-tabpanel-${index}`}
      aria-labelledby={`job-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={props.className}>
          {children}
        </Box>
      )}
    </div>
  );
}

const JobPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [order, setOrder] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobData = async () => {
      setLoading(true);
      
      // Get job data
      const jobData = getJobById(jobId);
      
      if (jobData) {
        setJob(jobData);
        
        // Get related order
        const orderData = getOrderById(jobData.order_id);
        if (orderData) {
          setOrder(orderData);
        }
        
        // Get equipment for this job (in a real app, this would come from an API)
        // For now, use mock data based on job ID
        const mockEquipment = mockJobEquipment[jobId % 3 + 1] || [];
        setEquipment(mockEquipment);
      }
      
      setLoading(false);
    };

    fetchJobData();
  }, [jobId]);

  const handleNavigateHome = () => {
    history.push('/');
  };

  const handleNavigateToOrder = () => {
    if (job && job.order_id) {
      history.push(`/orders/${job.order_id}`);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading || !job) {
    return <div>Loading job details...</div>;
  }

  return (
    <div className={classes.root}>
      <Header />
      
      <div className={classes.mainContent}>
        <OrderJobHeader jobId={jobId} />
        
        <div className={classes.content}>
          <Typography variant="h4" className={classes.jobTitle}>
            Job: {job.name} (#{job.job_id})
          </Typography>
          
          <Paper className={classes.paper}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Equipment" />
              <Tab label="Labor" />
              <Tab label="Notes" />
              <Tab label="History" />
            </Tabs>
            
            <TabPanel value={tabValue} index={0} className={classes.tabPanel}>
              <Table className={classes.equipmentTable}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {equipment.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toLocaleString()}</TableCell>
                      <TableCell>${(item.quantity * item.price).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className={classes.buttonsContainer}>
                <Button variant="contained" color="primary">
                  Add Equipment
                </Button>
                <Button variant="outlined">
                  Remove Selected
                </Button>
              </div>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1} className={classes.tabPanel}>
              <Typography>
                Labor information would be displayed here.
              </Typography>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2} className={classes.tabPanel}>
              <TextField
                label="Notes"
                multiline
                rows={5}
                variant="outlined"
                fullWidth
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={3} className={classes.tabPanel}>
              <Typography>
                Job history information would be displayed here.
              </Typography>
            </TabPanel>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default JobPage; 