const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const authMiddleware = require('../middlewares/auth');
const {
    validateSignup,
    validateVerification,
    validateLogin,
    validateForgotPasswordRequest,
    validateForgotPasswordVerify,
    validateForgotPasswordReset,
    validateRefreshToken
} = require('../validators/auth_validator');

// Signup
router.post('/signup', validateSignup, authController.signupRequest);
router.post('/signup/verify', validateVerification, authController.signupVerify);

// Login
router.post('/login', validateLogin, authController.login);

// Refresh access token
router.post('/refresh', validateRefreshToken, authController.refreshToken);

// Forgot Password
router.post('/forgot-password', validateForgotPasswordRequest, authController.forgotPasswordRequest);
router.post('/forgot-password/verify', validateForgotPasswordVerify, authController.forgotPasswordVerify);
router.post('/forgot-password/reset', validateForgotPasswordReset, authController.forgotPasswordReset);

// Logout
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
