/**
 * Mock database for when PostgreSQL is not available
 */

const mockEquipment = [
  { equipment_id: 1, name: 'Projector', std_rate: 200, is_package: false },
  { equipment_id: 2, name: 'Wireless Microphone', std_rate: 75, is_package: false },
  { equipment_id: 3, name: 'LED Screen 55"', std_rate: 150, is_package: false },
  { equipment_id: 4, name: 'Speaker System', std_rate: 200, is_package: false },
  { equipment_id: 5, name: 'Laptop', std_rate: 100, is_package: false },
  { equipment_id: 6, name: 'HDMI Cable', std_rate: 15, is_package: false },
  { equipment_id: 7, name: 'Flipchart', std_rate: 45, is_package: false },
  { equipment_id: 8, name: 'Wi-Fi Connection', std_rate: 25, is_package: false },
  { equipment_id: 9, name: 'Podium', std_rate: 75, is_package: false },
  { equipment_id: 10, name: 'Presentation Package', std_rate: 350, is_package: true },
];

const mockOrders = [
  { order_id: 1, order_number: '1001', order_name: 'Annual Conference', account_name: 'Acme Corp', start_date: '2023-05-01', end_date: '2023-05-03', status: 'Confirmed' },
  { order_id: 2, order_number: '1002', order_name: 'Product Launch', account_name: 'TechStart Inc', start_date: '2023-06-15', end_date: '2023-06-15', status: 'Tentative' },
];

const mockJobs = [
  { job_id: 1, job_number: '10001', order_id: 1, room: 'Grand Ballroom', start_date: '2023-05-01', end_date: '2023-05-03', net_due: 2500 },
  { job_id: 2, job_number: '10002', order_id: 1, room: 'Conference Room A', start_date: '2023-05-02', end_date: '2023-05-02', net_due: 1200 },
  { job_id: 3, job_number: '20001', order_id: 2, room: 'Auditorium', start_date: '2023-06-15', end_date: '2023-06-15', net_due: 3500 },
];

/**
 * Mock query function that returns mock data based on the query
 */
const query = async (text, params) => {
  console.log('MOCK DB QUERY:', text, params);
  
  // Match the query using simple string contains
  if (text.includes('FROM equipment')) {
    return { rows: mockEquipment };
  } else if (text.includes('FROM orders') && params && params[0]) {
    const orderId = params[0];
    const order = mockOrders.find(o => o.order_id === Number(orderId));
    return { rows: order ? [order] : [] };
  } else if (text.includes('FROM jobs') && params && params[0]) {
    const jobId = params[0];
    const job = mockJobs.find(j => j.job_id === Number(jobId));
    return { rows: job ? [job] : [] };
  } else if (text.includes('FROM jobs WHERE order_id') && params && params[0]) {
    const orderId = params[0];
    const jobs = mockJobs.filter(j => j.order_id === Number(orderId));
    return { rows: jobs };
  }
  
  // Default empty response
  return { rows: [] };
};

module.exports = {
  query
}; 