const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { optionalAuth } = require('../middleware/auth');

router.post('/legal', optionalAuth, searchController.searchLegal);
router.get('/history', optionalAuth, searchController.getSearchHistory);

module.exports = router;
