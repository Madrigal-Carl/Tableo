const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { validateCreateCategory } = require('../validators/category_validator');
const {
  createCategory,
  getCategoriesByEvent,
} = require('../controllers/category_controller');

// Create a category
router.post('/', auth, validateCreateCategory, createCategory);

// Get all categories for a specific event
router.get('/event/:eventId', auth, getCategoriesByEvent);

module.exports = router;
