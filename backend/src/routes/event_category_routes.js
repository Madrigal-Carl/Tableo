const express = require('express');
const router = express.Router({ mergeParams: true });

const requireAuth = require('../middlewares/auth');
const { validateCategory } = require('../validators/category_validator');
const categoryController = require('../controllers/category_controller');

// POST for both single & bulk create
router.post('/:eventId/categories', requireAuth, validateCategory, categoryController.createCategory);

// GET categories
router.get('/:eventId/categories', requireAuth, categoryController.getCategoriesByEvent);

module.exports = router;
