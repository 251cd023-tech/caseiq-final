const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateOptional } = require('../middleware/auth');

// Profile endpoints
router.get('/', authenticateOptional, authController.getProfile);
router.put('/', authenticateOptional, authController.updateProfile);

module.exports = router;
