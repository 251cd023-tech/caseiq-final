const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticateOptional } = require('../middleware/auth');

// Search endpoints
router.post('/legal', authenticateOptional, searchController.searchLegal);
router.get('/legal', authenticateOptional, searchController.searchGet);
router.get('/history', authenticateOptional, searchController.getSearchHistory);
router.get('/', authenticateOptional, searchController.searchGet);

module.exports = router;
