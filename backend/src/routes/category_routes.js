const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/auth');
const { validateCategory } = require('../validators/category_validator');
const categoryController = require('../controllers/category_controller');

// Update Category
router.put('/:categoryId', requireAuth, validateCategory, categoryController.updateCategory);

module.exports = router;
