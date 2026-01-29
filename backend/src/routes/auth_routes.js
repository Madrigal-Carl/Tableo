const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const { validateSignup, validateVerification } = require('../validators/auth_validator');

router.post('/signup', validateSignup, authController.signupRequest);
router.post('/signup/verify', validateVerification, authController.signupVerify);

module.exports = router;
