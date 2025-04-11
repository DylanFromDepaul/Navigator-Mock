const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Route to generate equipment recommendations
router.post('/recommendations', aiController.generateRecommendations);

module.exports = router; 