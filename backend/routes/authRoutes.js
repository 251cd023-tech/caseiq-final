const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authenticateOptional } = require('../middleware/auth');

// Auth endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);
router.post('/forgot-password', authController.forgotPassword);
router.post('/bookmark', authenticateOptional, authController.toggleBookmark);

module.exports = router;
