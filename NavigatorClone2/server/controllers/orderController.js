const db = require('../db');

exports.getOrders = async (req, res) => {
  try {
    const { 
      order_number, order_name, account_name, 
      start_date, end_date, status 
    } = req.query;
    
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    
    if (order_number) {
      query += ' AND order_number = $' + (params.length + 1);
      params.push(order_number);
    }
    
    if (order_name) {
      query += ' AND order_name ILIKE $' + (params.length + 1);
      params.push(`%${order_name}%`);
    }
    
    if (account_name) {
      query += ' AND account_name ILIKE $' + (params.length + 1);
      params.push(`%${account_name}%`);
    }
    
    // Add more filters as needed
    
    query += ' ORDER BY start_date DESC';
    
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    // Generate a unique 4-digit order number
    const { rows } = await db.query('SELECT MAX(CAST(order_number AS INTEGER)) FROM orders');
    const maxOrderNum = rows[0].max || 0;
    const newOrderNum = (parseInt(maxOrderNum) + 1).toString().padStart(4, '0');
    
    const {
      order_name,
      account_name,
      start_date,
      end_date,
      status,
      type,
      bill_to_contact,
      sales_manager,
      probability
    } = req.body;
    
    const result = await db.query(
      `INSERT INTO orders (
        order_number, order_name, account_name, start_date, end_date,
        status, type, bill_to_contact, sales_manager, probability
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        newOrderNum, order_name, account_name, start_date, end_date,
        status, type, bill_to_contact, sales_manager, probability
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Implement other order controller methods... 