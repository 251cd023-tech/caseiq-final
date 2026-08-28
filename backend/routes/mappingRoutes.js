const express = require('express');
const router = express.Router();
const mappingController = require('../controllers/mappingController');

router.get('/', mappingController.getMappings);
router.get('/:mappingId', mappingController.getMappingById);

module.exports = router;
