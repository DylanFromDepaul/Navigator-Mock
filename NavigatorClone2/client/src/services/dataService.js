// Update the dataService to persist data in localStorage
import { mockOrders, mockJobs, mockEquipment } from './mockData';

// Add a check for localStorage availability and a fallback mechanism
const isLocalStorageAvailable = () => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.warn('localStorage is not available:', e);
    return false;
  }
};

// Create an in-memory fallback store
const memoryStore = {
  orders: [...mockOrders],
  jobs: [...mockJobs],
  equipment: [...mockEquipment]
};

// Add improved logging to track data flow
const logData = (message, data) => {
  console.log(`[DataService] ${message}`, data);
};

// Update the initializeData function to better initialize relationships
const initializeData = () => {
  if (!isLocalStorageAvailable()) {
    console.log('Using in-memory storage instead of localStorage');
    
    // Ensure job references are correct in mockData
    mockJobs.forEach(job => {
      // Make sure job has a valid order_id reference
      if (!job.order_id) {
        console.warn(`Job ${job.job_id} has no order_id, setting to default`);
        job.order_id = mockOrders[0].id;
      }
    });
    
    return {
      orders: [...mockOrders],
      jobs: [...mockJobs],
      equipment: [...mockEquipment]
    };
  }
  
  try {
    // Load data from storage or use mock data
    let orders = JSON.parse(localStorage.getItem('orders')) || mockOrders;
    let jobs = JSON.parse(localStorage.getItem('jobs')) || mockJobs;
    let equipment = JSON.parse(localStorage.getItem('equipment')) || mockEquipment;
    
    // Validate relationships
    jobs.forEach(job => {
      // Ensure job has a valid order_id
      if (!orders.some(order => order.id.toString() === job.order_id.toString())) {
        console.warn(`Job ${job.job_id} has invalid order_id ${job.order_id}`);
      }
    });
    
    equipment.forEach(item => {
      // Ensure equipment item has a valid job_id
      if (!jobs.some(job => job.job_id.toString() === item.job_id?.toString())) {
        console.warn(`Equipment item has invalid job_id ${item.job_id}`);
      }
    });
    
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('jobs', JSON.stringify(jobs));
    localStorage.setItem('equipment', JSON.stringify(equipment));
    
    return { orders, jobs, equipment };
  } catch (error) {
    console.error('Error initializing from localStorage:', error);
    return {
      orders: [...mockOrders],
      jobs: [...mockJobs],
      equipment: [...mockEquipment]
    };
  }
};

// Initialize data on service import
const { orders, jobs, equipment } = initializeData();

// CRUD operations for orders
export const getOrders = () => {
  if (isLocalStorageAvailable()) {
    try {
      return JSON.parse(localStorage.getItem('orders')) || [];
    } catch (e) {
      console.error('Error getting orders:', e);
      return memoryStore.orders;
    }
  }
  return memoryStore.orders;
};

export const getOrderById = (orderId) => {
  const orders = getOrders();
  return orders.find(order => order.id.toString() === orderId.toString());
};

export const saveOrder = (orderData) => {
  try {
    // Validate input
    if (!orderData || !orderData.id) {
      console.error('Invalid order data provided:', orderData);
      throw new Error('Invalid order data');
    }
    
    const orderId = String(orderData.id); // Convert to string safely
    
    if (isLocalStorageAvailable()) {
      const orders = getOrders();
      const existingOrderIndex = orders.findIndex(o => String(o.id) === orderId);
      
      if (existingOrderIndex >= 0) {
        orders[existingOrderIndex] = { ...orders[existingOrderIndex], ...orderData };
      } else {
        orders.push(orderData);
      }
      
      localStorage.setItem('orders', JSON.stringify(orders));
    } else {
      const existingOrderIndex = memoryStore.orders.findIndex(o => String(o.id) === orderId);
      
      if (existingOrderIndex >= 0) {
        memoryStore.orders[existingOrderIndex] = { ...memoryStore.orders[existingOrderIndex], ...orderData };
      } else {
        memoryStore.orders.push(orderData);
      }
    }
    
    return orderData;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

// CRUD operations for jobs
export const getJobs = () => {
  if (isLocalStorageAvailable()) {
    try {
      return JSON.parse(localStorage.getItem('jobs')) || [];
    } catch (e) {
      console.error('Error getting jobs:', e);
      return memoryStore.jobs;
    }
  }
  return memoryStore.jobs;
};

export const getJobsByOrderId = (orderId) => {
  const jobs = getJobs();
  return jobs.filter(job => job.order_id.toString() === orderId.toString());
};

export const getJobById = (jobId) => {
  const jobs = getJobs();
  return jobs.find(job => job.job_id.toString() === jobId.toString());
};

export const saveJob = (jobData) => {
  try {
    // Validate input
    if (!jobData || !jobData.job_id) {
      console.error('Invalid job data provided:', jobData);
      throw new Error('Invalid job data');
    }
    
    const jobId = String(jobData.job_id); // Convert to string safely
    
    if (isLocalStorageAvailable()) {
      const jobs = getJobs();
      const existingJobIndex = jobs.findIndex(j => String(j.job_id) === jobId);
      
      if (existingJobIndex >= 0) {
        jobs[existingJobIndex] = { ...jobs[existingJobIndex], ...jobData };
      } else {
        jobs.push(jobData);
      }
      
      localStorage.setItem('jobs', JSON.stringify(jobs));
    } else {
      const existingJobIndex = memoryStore.jobs.findIndex(j => String(j.job_id) === jobId);
      
      if (existingJobIndex >= 0) {
        memoryStore.jobs[existingJobIndex] = { ...memoryStore.jobs[existingJobIndex], ...jobData };
      } else {
        memoryStore.jobs.push(jobData);
      }
    }
    return jobData;
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
};

// CRUD operations for equipment items
export const getEquipmentItems = () => {
  if (isLocalStorageAvailable()) {
    try {
      return JSON.parse(localStorage.getItem('equipment')) || [];
    } catch (e) {
      console.error('Error getting equipment items:', e);
      return memoryStore.equipment;
    }
  }
  return memoryStore.equipment;
};

export const getEquipmentItemsByJobId = (jobId) => {
  const equipment = getEquipmentItems();
  return equipment.filter(item => item.job_id.toString() === jobId.toString());
};

export const saveEquipmentItems = (jobId, items) => {
  try {
    // Validate input
    if (!jobId) {
      console.error('Invalid job ID for equipment items:', jobId);
      throw new Error('Invalid job ID');
    }
    
    if (!items || !Array.isArray(items)) {
      console.error('Invalid equipment items:', items);
      throw new Error('Invalid equipment items');
    }
    
    const safeJobId = String(jobId); // Convert to string safely
    
    if (isLocalStorageAvailable()) {
      const allEquipment = getEquipmentItems();
      
      // Remove existing items for this job
      const filteredEquipment = allEquipment.filter(item => 
        item && item.job_id && String(item.job_id) !== safeJobId
      );
      
      // Add the new items with validation
      const validItems = items.filter(item => item !== null && item !== undefined);
      const updatedEquipment = [...filteredEquipment, ...validItems];
      
      localStorage.setItem('equipment', JSON.stringify(updatedEquipment));
    } else {
      // Update in-memory equipment with validation
      memoryStore.equipment = [
        ...memoryStore.equipment.filter(item => 
          item && item.job_id && String(item.job_id) !== safeJobId
        ),
        ...items.filter(item => item !== null && item !== undefined)
      ];
    }
    return items;
  } catch (error) {
    console.error('Error saving equipment items:', error);
    throw error;
  }
};

// Legacy methods for compatibility
export const updateJob = saveJob;
export const updateOrder = async (order) => {
  console.log('Updating existing order:', order);
  
  // Create a shallow copy to avoid mutating the original
  const updatedOrder = { ...order };
  
  // Make sure we're working with the existing order ID
  if (!updatedOrder.id) {
    throw new Error('Cannot update order without an ID');
  }
  
  // Find the index of the existing order in the mockOrders array
  const orderIndex = mockOrders.findIndex(o => o.id === updatedOrder.id);
  
  if (orderIndex === -1) {
    console.error(`Order with ID ${updatedOrder.id} not found`);
    throw new Error(`Order with ID ${updatedOrder.id} not found`);
  }
  
  // Replace the existing order with the updated one
  mockOrders[orderIndex] = updatedOrder;
  
  // Return the updated order
  return updatedOrder;
};

// For debugging
export const logDataState = () => {
  console.log('Current orders:', orders);
  console.log('Current jobs:', jobs);
};

// Add this function to your dataService.js file
export const addOrder = async (order) => {
  console.log('Adding new order:', order);
  
  // Create a deep copy to avoid mutating the original
  const newOrder = JSON.parse(JSON.stringify(order));
  
  // Generate a new ID if none provided
  if (!newOrder.id) {
    // Find highest current ID and add 1
    newOrder.id = Math.max(...mockOrders.map(o => Number(o.id)), 0) + 1;
    console.log(`Generated new order ID: ${newOrder.id}`);
  }
  
  // Ensure the order has all required fields
  if (!newOrder.total) newOrder.total = 0;
  if (!newOrder.status) newOrder.status = 'Quote';
  if (!newOrder.name) newOrder.name = 'New Internal Order';
  
  console.log('Final new order to add:', newOrder);
  
  // Add the new order to both memory store and mockOrders array
  memoryStore.orders.push(newOrder);
  mockOrders.push(newOrder);
  
  // Update localStorage if available
  if (isLocalStorageAvailable()) {
    localStorage.setItem('orders', JSON.stringify(memoryStore.orders));
  }
  
  return newOrder;
};

// Update the deleteOrder function to also delete associated jobs
export const deleteOrder = async (orderId) => {
  console.log('Attempting to delete order with ID:', orderId);
  
  if (!orderId) {
    throw new Error('Cannot delete order without an ID');
  }
  
  // Convert to string for comparison to avoid type issues
  const orderIdString = String(orderId);
  console.log('Looking for order with string ID:', orderIdString);
  
  // Get orders and jobs directly from the source to ensure we're working with fresh data
  const currentOrders = getOrders();
  const currentJobs = getJobs();
  
  console.log('Current orders before deletion:', currentOrders);
  
  // Find the index of the order to delete
  const orderIndex = currentOrders.findIndex(o => String(o.id) === orderIdString);
  
  console.log('Found order at index:', orderIndex);
  
  if (orderIndex === -1) {
    console.error(`Order with ID ${orderId} not found for deletion`);
    throw new Error(`Order with ID ${orderId} not found`);
  }
  
  // Remove the order from the array
  const updatedOrders = [...currentOrders];
  updatedOrders.splice(orderIndex, 1);
  
  // Find and remove any jobs associated with this order
  const updatedJobs = currentJobs.filter(job => String(job.order_id) !== orderIdString);
  console.log(`Removed ${currentJobs.length - updatedJobs.length} jobs associated with order ${orderIdString}`);
  
  // Update both our memory stores
  memoryStore.orders = updatedOrders;
  memoryStore.jobs = updatedJobs;
  
  // Update the mockOrders reference (which might be used elsewhere)
  while (mockOrders.length > 0) {
    mockOrders.pop();
  }
  updatedOrders.forEach(order => mockOrders.push(order));
  
  // Update the mockJobs reference
  while (mockJobs.length > 0) {
    mockJobs.pop();
  }
  updatedJobs.forEach(job => mockJobs.push(job));
  
  // Update localStorage if available
  if (isLocalStorageAvailable()) {
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
  }
  
  return {
    deletedOrder: orderId,
    deletedJobsCount: currentJobs.length - updatedJobs.length
  };
}; 