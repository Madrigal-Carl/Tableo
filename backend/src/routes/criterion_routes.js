const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createCriterion,
  getCriteriaByCategory,
  updateCriterion,
  deleteCriterion,
} = require('../controllers/criterion_controller');
const { validateCriterion } = require('../validators/criterion_validator');

// Create a criterion
router.post('/', auth, validateCriterion, createCriterion);

// Get criteria for a category
router.get('/category/:categoryId', auth, getCriteriaByCategory);

// Update a criterion
router.put('/:id', auth, validateCriterion(true), updateCriterion);

// Delete a criterion
router.delete('/:id', auth, deleteCriterion);

module.exports = router;