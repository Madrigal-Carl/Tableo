const express = require('express');
const router = express.Router({ mergeParams: true });

const auth = require('../middlewares/auth');
const { validateCreateCategory } = require('../validators/category_validator');
const categoryController = require('../controllers/category_controller');

// Create Category for an Event
router.post('/:eventId/categories', auth, validateCreateCategory, categoryController.createCategory);

// Get Categories for an Event
router.get('/:eventId/categories', auth, categoryController.getCategoriesByEvent);

module.exports = router;
