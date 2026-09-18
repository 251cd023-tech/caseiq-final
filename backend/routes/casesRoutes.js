const express = require('express');
const router = express.Router();
const casesController = require('../controllers/casesController');

// Cases & Precedents endpoints
router.get('/', casesController.getCases);
router.get('/relationships', casesController.getCaseRelationships);
router.get('/:id/precedents', casesController.getCasePrecedents);
router.get('/:id/relationships', casesController.getCaseRelationships);
router.get('/:id', casesController.getCaseById);

module.exports = router;
