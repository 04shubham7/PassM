const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../utils/authMiddleware');
const authMiddleware = require('../utils/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/send-otp', authMiddleware, authController.sendOtp);
router.post('/verify-otp', authMiddleware, authController.verifyOtp);
router.post('/send-email-change-otp', authMiddleware, authController.sendEmailChangeOtp);
router.post('/verify-email-change-otp', authMiddleware, authController.verifyEmailChangeOtp);
router.get('/check', authController.checkAuth);
router.post('/logout', authController.logout);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.put('/change-password', auth, authController.changePassword);

module.exports = router; 