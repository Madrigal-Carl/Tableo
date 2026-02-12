const express = require('express');
const router = express.Router({ mergeParams: true });

const requireAuth = require('../middlewares/auth');
const { validateCategory, validateStageCategoriesQuery } = require('../validators/category_validator');
const categoryController = require('../controllers/category_controller');

// POST create and update
router.post('/:eventId/categories', requireAuth, validateCategory, categoryController.createOrUpdateCategories);

// GET categories
router.get('/:eventId/categories', requireAuth, categoryController.getCategoriesByEvent);

// GET categories by stage
router.get("/:eventId/stages/:stageId/categories", requireAuth, validateStageCategoriesQuery, categoryController.getCategoriesByStage);

module.exports = router;
