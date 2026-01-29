const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const { 
    validateSignup, 
    validateVerification, 
    validateLogin, 
    validateForgotPasswordRequest, 
    validateForgotPasswordVerify,
    validateForgotPasswordReset 
} = require('../validators/auth_validator');
const authMiddleware = require('../middlewares/auth');

//Signup route
router.post('/signup', validateSignup, authController.signupRequest);
router.post('/signup/verify', validateVerification, authController.signupVerify);

//Login route
router.post('/login', validateLogin, authController.login);

//Forget password route

router.post('/forgot-password', validateForgotPasswordRequest, authController.forgotPasswordRequest);

router.post('/forgot-password/verify', validateForgotPasswordVerify, authController.forgotPasswordVerify);

router.post('/forgot-password/reset', validateForgotPasswordReset, authController.forgotPasswordReset);

//logout route
router.post('/logout', authMiddleware   , authController.logout)
module.exports = router;
