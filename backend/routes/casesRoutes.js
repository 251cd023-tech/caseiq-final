const express = require('express');
const router = express.Router();
const casesController = require('../controllers/casesController');

router.get('/', casesController.getCases);
router.get('/relationships', casesController.getCaseRelationships);
router.get('/:caseId', casesController.getCaseById);
router.get('/:caseId/relationships', casesController.getCaseRelationships);

module.exports = router;
