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
} = require('../validators/auth_validator');

// Signup
router.post('/signup', validateSignup, authController.signupRequest);
router.post('/signup/verify', validateVerification, authController.signupVerify);
router.post('/signup/resend', validateForgotPasswordRequest, authController.signupResend);

// Login
router.post('/login', validateLogin, authController.login);

// Forgot Password
router.post('/password/forgot', validateForgotPasswordRequest, authController.forgotPasswordRequest);
router.post('/password/verify', validateForgotPasswordVerify, authController.forgotPasswordVerify);
router.post('/password/reset', validateForgotPasswordReset, authController.forgotPasswordReset);

// Logout
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
