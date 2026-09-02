
const express = require('express');
const router = express.Router();
const savedCasesController = require('../controllers/savedCasesController');
const { authenticate } = require('../middleware/auth');

// Saved cases endpoints
router.post('/', authenticate, savedCasesController.saveCase);
router.delete('/:caseId', authenticate, savedCasesController.removeSavedCase);
router.get('/', authenticate, savedCasesController.getSavedCases);

module.exports = router;
