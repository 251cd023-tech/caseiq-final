const express = require('express');
const router = express.Router();
const lawComparisonController = require('../controllers/lawComparisonController');

// POST /api/law-comparison
router.post('/', lawComparisonController.compareLaw);

module.exports = router;
