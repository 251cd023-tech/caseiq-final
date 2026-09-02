const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateOptional } = require('../middleware/auth');

// Dashboard endpoints
router.get('/stats', authenticateOptional, dashboardController.getDashboardStats);
router.get('/recent-searches', authenticateOptional, dashboardController.getRecentSearches);
router.get('/research-history', authenticateOptional, dashboardController.getResearchHistory);

module.exports = router;
