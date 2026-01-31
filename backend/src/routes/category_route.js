const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { validateCategory } = require('../validators/category_validator');
const categoryController = require('../controllers/category_controller');

// Create a category
router.post('/', auth, validateCategory(), categoryController.createCategory);

// Get all categories for a specific event
router.get('/event/:eventId', auth, categoryController.getCategoriesByEvent);

// Update a category by ID 
router.put('/:categoryId', auth, validateCategory(), categoryController.updateCategory);

module.exports = router;
