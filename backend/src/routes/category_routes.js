const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { validateCategory } = require('../validators/category_validator');
const categoryController = require('../controllers/category_controller');

// Update Category
router.put('/:categoryId', auth, validateCategory, categoryController.updateCategory);

module.exports = router;
