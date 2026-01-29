const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const { validateSignup } = require('../validators/auth_validator');

router.post('/signup', validateSignup, authController.signup);

module.exports = router;
