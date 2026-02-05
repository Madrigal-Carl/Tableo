const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const requireAuth = require('../middlewares/auth');
const requireGuest = require('../middlewares/guest');
const {
    validateRegister,
    validateVerification,
    validateLogin,
    validateForgotPasswordRequest,
    validateForgotPasswordVerify,
    validateForgotPasswordReset,
} = require('../validators/auth_validator');

// Signup
router.post('/register', requireGuest, validateRegister, authController.registerRequest);
router.post('/register/verify', requireGuest, validateVerification, authController.registerVerify);
router.post('/register/resend', requireGuest, validateForgotPasswordRequest, authController.registerResend);

// Login
router.post('/login', requireGuest, validateLogin, authController.login);

// Forgot Password
router.post('/password/forgot', requireGuest, validateForgotPasswordRequest, authController.forgotPasswordRequest);
router.post('/password/verify', requireGuest, validateForgotPasswordVerify, authController.forgotPasswordVerify);
router.post('/password/reset', requireGuest, validateForgotPasswordReset, authController.forgotPasswordReset);

// Logout
router.post('/logout', requireAuth, authController.logout);

// Get current authenticated user
router.get('/me', requireAuth, authController.me);

module.exports = router;
