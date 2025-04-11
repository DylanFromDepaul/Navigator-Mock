const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// Get all jobs with optional filtering
router.get('/', jobController.getJobs);

// Get a specific job
router.get('/:jobId', jobController.getJobById);

// Update a job
router.put('/:jobId', jobController.updateJob);

// Delete a job
router.delete('/:jobId', jobController.deleteJob);

// Get equipment for a job
router.get('/:jobId/equipment', jobController.getJobEquipment);

// Add equipment to a job
router.post('/:jobId/equipment', jobController.addEquipment);

// Remove equipment from a job
router.delete('/:jobId/equipment/:equipmentId', jobController.removeEquipment);

// Generate AI suggestions for a job
router.post('/:jobId/ai-suggestions', jobController.generateAISuggestions);

module.exports = router; 