const express = require('express');
const router = express.Router({ mergeParams: true });

const requireAuth = require('../middlewares/auth');
const { validateCategory } = require('../validators/category_validator');
const categoryController = require('../controllers/category_controller');

// Create Category for an Event
router.post('/:eventId/categories', requireAuth, validateCategory, categoryController.createCategory);

// Get Categories for an Event
router.get('/:eventId/categories', requireAuth, categoryController.getCategoriesByEvent);

module.exports = router;
