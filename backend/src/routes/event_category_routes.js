const express = require('express');
const router = express.Router({ mergeParams: true });

const requireAuth = require('../middlewares/auth');
const { validateBulkCategoryCreate } = require('../validators/category_validator');
const categoryController = require('../controllers/category_controller');

// POST for bulk create
router.post('/:eventId/categories', requireAuth, validateBulkCategoryCreate, categoryController.createCategory);

// GET categories
router.get('/:eventId/categories', requireAuth, categoryController.getCategoriesByEvent);

module.exports = router;
