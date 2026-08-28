const express = require('express');
const router = express.Router();
const actsController = require('../controllers/actsController');

router.get('/', actsController.getActs);
router.get('/search/sections', actsController.searchSections);
router.get('/:actId', actsController.getActById);
router.get('/sections/:sectionId', actsController.getSectionById);

module.exports = router;
