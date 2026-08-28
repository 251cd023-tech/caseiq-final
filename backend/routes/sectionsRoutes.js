const express = require('express');
const router = express.Router();
const actsController = require('../controllers/actsController');

router.get('/search', actsController.searchSections);
router.get('/:sectionId', actsController.getSectionById);

module.exports = router;
