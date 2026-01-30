const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { validateCreateCategory } = require('../validators/category_validator');
const { createCategory } = require('../controllers/category_controller');

router.post('/', auth, validateCreateCategory, createCategory);

module.exports = router;
