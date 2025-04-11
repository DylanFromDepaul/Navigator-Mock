const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Add environment variables early in the application
require('dotenv').config();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API routes
app.get('/api/orders', (req, res) => {
  // Mock response for now
  res.json({ message: 'Orders API endpoint' });
});

app.get('/api/orders/:orderId/jobs', (req, res) => {
  // Mock response for now
  res.json({ message: `Jobs for order ${req.params.orderId}` });
});

// Add the AI routes - make it accessible at both /api/ai and /ai for flexibility
app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);

// Status check endpoint
app.get('/status', (req, res) => {
  res.json({ status: 'API is running', env: process.env.NODE_ENV });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`OpenAI API key length: ${process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 'not set'}`);
});

module.exports = app; 