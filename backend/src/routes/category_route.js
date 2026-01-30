const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { validateCategory } = require('../validators/category_validator');
const {
  createCategory,
  getCategoriesByEvent,
  updateCategory,
} = require('../controllers/category_controller');

// Create a category
router.post('/', auth, validateCategory(), createCategory);

// Get all categories for a specific event
router.get('/event/:eventId', auth, getCategoriesByEvent);

// Update a category (details + stage)
router.put('/:categoryId', auth, validateCategory(true), updateCategory);

module.exports = router;
