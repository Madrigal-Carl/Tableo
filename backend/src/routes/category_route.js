const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { validateUpdateCategory } = require('../validators/category_validator');
const categoryController = require('../controllers/category_controller');

// Update Category
router.put('/:categoryId', auth, validateUpdateCategory, categoryController.updateCategory);

module.exports = router;
