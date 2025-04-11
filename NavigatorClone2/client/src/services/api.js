import { mockOrders, mockJobs, mockJobEquipment } from './mockData';

// Sample data for mocking API responses
const mockEquipment = [
  { equipment_id: 1, name: 'HD Projector', std_rate: 425, is_package: false },
  { equipment_id: 2, name: '7.5\' Tripod Screen', std_rate: 95, is_package: false },
  { equipment_id: 3, name: 'HDMI Cable (6ft)', std_rate: 25, is_package: false },
  { equipment_id: 4, name: 'Wireless Handheld Microphone', std_rate: 75, is_package: false },
  { equipment_id: 5, name: 'Wireless Lavalier Microphone', std_rate: 75, is_package: false },
  { equipment_id: 6, name: 'Basic Audio Package', std_rate: 350, is_package: true },
  { equipment_id: 7, name: '- 4-Channel Mixer', std_rate: 150, is_package: false },
  { equipment_id: 8, name: '- 2 Speakers on Stands', std_rate: 200, is_package: false },
  { equipment_id: 9, name: '- Audio Technician (4 hours)', std_rate: 0, is_package: false },
  { equipment_id: 10, name: 'Presentation Package', std_rate: 650, is_package: true },
  { equipment_id: 11, name: '- HD Projector', std_rate: 425, is_package: false },
  { equipment_id: 12, name: '- 7.5\' Tripod Screen', std_rate: 95, is_package: false },
  { equipment_id: 13, name: '- Wireless Presenter Remote', std_rate: 35, is_package: false },
  { equipment_id: 14, name: '- HDMI Cable (6ft)', std_rate: 25, is_package: false },
  { equipment_id: 15, name: '- Projection Stand', std_rate: 45, is_package: false },
  { equipment_id: 16, name: '- Power Strip', std_rate: 25, is_package: false },
  { equipment_id: 17, name: 'Flipchart Package', std_rate: 75, is_package: true },
  { equipment_id: 18, name: '- Flipchart Stand', std_rate: 45, is_package: false },
  { equipment_id: 19, name: '- Flipchart Pad', std_rate: 20, is_package: false },
  { equipment_id: 20, name: '- Markers (Set of 4)', std_rate: 10, is_package: false },
  { equipment_id: 21, name: 'Wi-Fi Connection (per device)', std_rate: 25, is_package: false },
  { equipment_id: 22, name: 'LED TV - 55"', std_rate: 375, is_package: false },
  { equipment_id: 23, name: 'LED TV - 70"', std_rate: 525, is_package: false },
  { equipment_id: 24, name: 'LED Wall (per panel)', std_rate: 750, is_package: false },
];

// Make sure the API base URL is correctly configured
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// API mock functions
export const fetchOrders = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockOrders;
};

export const fetchJobs = async (filters = {}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Apply filters if provided
  let filteredJobs = [...mockJobs];
  
  if (filters) {
    if (filters.job_number) {
      filteredJobs = filteredJobs.filter(job => 
        job.job_number.includes(filters.job_number));
    }
    
    if (filters.order_number) {
      filteredJobs = filteredJobs.filter(job => 
        job.order_number.includes(filters.order_number));
    }
    
    if (filters.order_name) {
      filteredJobs = filteredJobs.filter(job => 
        job.order_name.toLowerCase().includes(filters.order_name.toLowerCase()));
    }
    
    if (filters.room) {
      filteredJobs = filteredJobs.filter(job => 
        job.room.toLowerCase().includes(filters.room.toLowerCase()));
    }
    
    if (filters.start_date) {
      filteredJobs = filteredJobs.filter(job => 
        new Date(job.start_date) >= new Date(filters.start_date));
    }
    
    if (filters.end_date) {
      filteredJobs = filteredJobs.filter(job => 
        new Date(job.end_date) <= new Date(filters.end_date));
    }
    
    if (filters.account_name) {
      filteredJobs = filteredJobs.filter(job => 
        job.account_name.toLowerCase().includes(filters.account_name.toLowerCase()));
    }
  }
  
  return filteredJobs;
};

export const fetchOrder = async (orderId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const order = mockOrders.find(o => o.id === parseInt(orderId));
  
  if (!order) {
    throw new Error(`Order with ID ${orderId} not found`);
  }
  
  return order;
};

export const fetchJob = async (orderId, jobId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const job = mockJobs.find(j => j.job_id === parseInt(jobId));
  
  if (!job) {
    throw new Error(`Job with ID ${jobId} not found`);
  }
  
  // Add equipment to job
  job.equipment = mockJobEquipment[job.job_id] || [];
  
  return job;
};

export const fetchEquipment = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockEquipment;
};

export const addEquipmentToJob = async (jobId, equipmentId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const equipment = mockEquipment.find(e => e.id === equipmentId);
  
  if (!equipment) {
    throw new Error(`Equipment with ID ${equipmentId} not found`);
  }
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    job_id: parseInt(jobId),
    equipment_id: equipmentId,
    quantity: 1,
    price: equipment.std_rate
  };
};

export const removeEquipmentFromJob = async (jobId, equipmentItemId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  jobId = parseInt(jobId);
  equipmentItemId = parseInt(equipmentItemId);
  
  // Check if job equipment exists
  if (!mockJobEquipment[jobId]) {
    throw new Error('Job equipment not found');
  }
  
  // Find equipment item index
  const itemIndex = mockJobEquipment[jobId].findIndex(item => item.id === equipmentItemId);
  
  if (itemIndex === -1) {
    throw new Error('Equipment item not found in job');
  }
  
  // Remove equipment item
  mockJobEquipment[jobId].splice(itemIndex, 1);
  
  // Update job total
  const job = mockJobs.find(job => job.job_id === jobId);
  if (job) {
    job.net_due = mockJobEquipment[jobId].reduce((total, item) => total + item.line_total, 0);
    
    // Update order total as well
    const order = mockOrders.find(order => order.order_id === job.order_id);
    if (order) {
      order.net_total = mockJobs
        .filter(j => j.order_id === order.order_id)
        .reduce((total, j) => total + j.net_due, 0);
    }
  }
  
  return { success: true };
};

export const updateJobEquipmentQuantity = async (jobId, equipmentItemId, quantity) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  jobId = parseInt(jobId);
  equipmentItemId = parseInt(equipmentItemId);
  quantity = parseInt(quantity);
  
  if (quantity < 1) {
    return removeEquipmentFromJob(jobId, equipmentItemId);
  }
  
  // Check if job equipment exists
  if (!mockJobEquipment[jobId]) {
    throw new Error('Job equipment not found');
  }
  
  // Find equipment item
  const item = mockJobEquipment[jobId].find(item => item.id === equipmentItemId);
  
  if (!item) {
    throw new Error('Equipment item not found in job');
  }
  
  // Update quantity and line total
  item.quantity = quantity;
  item.line_total = quantity * item.rate;
  
  // Update job total
  const job = mockJobs.find(job => job.job_id === jobId);
  if (job) {
    job.net_due = mockJobEquipment[jobId].reduce((total, item) => total + item.line_total, 0);
    
    // Update order total as well
    const order = mockOrders.find(order => order.order_id === job.order_id);
    if (order) {
      order.net_total = mockJobs
        .filter(j => j.order_id === order.order_id)
        .reduce((total, j) => total + j.net_due, 0);
    }
  }
  
  return { success: true };
};

export const createOrder = async (orderData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a new order ID
  const newOrderId = Math.max(...mockOrders.map(order => order.order_id)) + 1;
  
  // Generate a new order number (4 digits)
  const newOrderNumber = Math.floor(5000 + Math.random() * 2000).toString();
  
  // Create new order
  const newOrder = {
    order_id: newOrderId,
    order_number: newOrderNumber,
    ...orderData,
    net_total: 0
  };
  
  // Add to mock orders
  mockOrders.push(newOrder);
  
  return newOrder;
};

export const createJob = async (orderId, jobData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newJobId = Math.max(...mockJobs.map(job => job.job_id)) + 1;
  
  return {
    ...jobData,
    job_id: newJobId,
    order_id: parseInt(orderId),
    createdAt: new Date().toISOString()
  };
};

export const updateOrder = async (orderId, orderData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    ...orderData,
    id: orderId,
    updatedAt: new Date().toISOString()
  };
};

export const updateJob = async (jobId, jobData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  jobId = parseInt(jobId);
  
  // Find job index
  const jobIndex = mockJobs.findIndex(job => job.job_id === jobId);
  
  if (jobIndex === -1) {
    throw new Error('Job not found');
  }
  
  // Update job
  mockJobs[jobIndex] = {
    ...mockJobs[jobIndex],
    ...jobData
  };
  
  return mockJobs[jobIndex];
};

export const generateEquipmentSuggestions = async (jobId, clientEmail) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Parse client email for keywords to generate appropriate suggestions
  const emailLower = clientEmail.toLowerCase();
  let suggestedEquipment = [];
  
  // Basic presentation setup
  if (emailLower.includes('presentation') || emailLower.includes('slideshow') || emailLower.includes('projector')) {
    suggestedEquipment.push({ id: 1, name: 'Presentation Package', quantity: 1 });
  }
  
  // Audio needs
  if (emailLower.includes('microphone') || emailLower.includes('audio') || emailLower.includes('sound')) {
    suggestedEquipment.push({ id: 2, name: 'Basic Audio Package', quantity: 1 });
    
    // Additional microphones if many speakers mentioned
    if (emailLower.includes('panel') || emailLower.includes('multiple speakers') || emailLower.includes('speakers')) {
      suggestedEquipment.push({ id: 3, name: 'Wireless Handheld Microphone', quantity: 2 });
    }
  }
  
  // Video display needs
  if (emailLower.includes('video') || emailLower.includes('display') || emailLower.includes('screen')) {
    if (emailLower.includes('large') || emailLower.includes('big')) {
      suggestedEquipment.push({ id: 4, name: 'LED TV - 70"', quantity: 1 });
    } else {
      suggestedEquipment.push({ id: 5, name: 'LED TV - 55"', quantity: 1 });
    }
  }
  
  // Interactive elements
  if (emailLower.includes('brainstorm') || emailLower.includes('workshop') || emailLower.includes('collaboration')) {
    suggestedEquipment.push({ id: 6, name: 'Flipchart Package', quantity: 2 });
  }
  
  // Internet connectivity
  if (emailLower.includes('wifi') || emailLower.includes('internet') || emailLower.includes('connection')) {
    suggestedEquipment.push({ id: 7, name: 'Wi-Fi Connection (per device)', quantity: 5 });
  }
  
  // If nothing specific was mentioned, suggest a standard setup
  if (suggestedEquipment.length === 0) {
    suggestedEquipment = [
      { id: 1, name: 'Presentation Package', quantity: 1 },
      { id: 6, name: 'Flipchart Package', quantity: 1 },
      { id: 7, name: 'Wi-Fi Connection (per device)', quantity: 3 }
    ];
  }
  
  return {
    message: "Based on the client's requirements, I recommend the following equipment:",
    equipment: suggestedEquipment
  };
};

export const fetchOrderJobs = async (orderId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockJobs.filter(job => job.order_id === parseInt(orderId));
};

/**
 * Send request to AI for equipment recommendations
 * @param {string} prompt - User's equipment request
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @param {number} jobId - Current job ID
 * @param {number} orderId - Current order ID
 */
export const getAIRecommendations = async (prompt, conversationHistory = [], jobId, orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        conversationHistory,
        jobId,
        orderId
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return {
      message: "Sorry, I couldn't process your request. Please try again.",
      items: []
    };
  }
}; 