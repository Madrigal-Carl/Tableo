const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/auth');
const categoryController = require('../controllers/category_controller');
const {
  validateSingleCategory,
  validateBulkCategoryUpdate,
} = require('../validators/category_validator');

// ============================
// SINGLE CATEGORY UPDATE
// ============================
router.put(
  '/:categoryId',
  requireAuth,
  validateSingleCategory, // use the proper validator
  categoryController.updateCategory
);

// ============================
// BULK CATEGORY UPDATE
// ============================
router.put(
  '/bulk/:eventId',
  requireAuth,
  validateBulkCategoryUpdate, // use the proper validator for bulk updates
  categoryController.bulkUpdateCategories
);

module.exports = router;
