const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const { validateSignup, validateVerification, validateLogin } = require('../validators/auth_validator');

// signup and verification routes
router.post('/signup', validateSignup, authController.signupRequest);
router.post('/signup/verify', validateVerification, authController.signupVerify);

// Login route
router.post('/login', validateLogin, authController.login);


module.exports = router;
