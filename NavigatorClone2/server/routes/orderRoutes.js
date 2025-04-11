const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get all orders with optional filtering
router.get('/', orderController.getOrders);

// Create a new order
router.post('/', orderController.createOrder);

// Get a specific order by ID
router.get('/:orderId', orderController.getOrderById);

// Update an order
router.put('/:orderId', orderController.updateOrder);

// Delete an order
router.delete('/:orderId', orderController.deleteOrder);

// Get all jobs for an order
router.get('/:orderId/jobs', orderController.getOrderJobs);

// Create a new job for an order
router.post('/:orderId/jobs', orderController.createJob);

module.exports = router; 