const criterionService = require('../services/criterion_service');

// Create a criterion
async function createCriterion(req, res, next) {
  try {
    const { category_id, label, percentage } = req.body;

    const criterion = await criterionService.createCriterion({ category_id, label, percentage });

    res.status(201).json({
      message: 'Criterion created successfully',
      criterion,
    });
  } catch (err) {
    next(err);
  }
}

// Get all criteria for a category
async function getCriteriaByCategory(req, res, next) {
  try {
    const { categoryId } = req.params;

    const criteria = await criterionService.getCriteriaByCategory(categoryId);

    res.status(200).json({
      message: 'Criteria fetched successfully',
      criteria,
    });
  } catch (err) {
    next(err);
  }
}

// Update a criterion
async function updateCriterion(req, res, next) {
  try {
    const { id } = req.params;
    const { label, percentage } = req.body;

    const updatedCriterion = await criterionService.updateCriterion({ id, label, percentage });

    res.status(200).json({
      message: 'Criterion updated successfully',
      criterion: updatedCriterion,
    });
  } catch (err) {
    next(err);
  }
}

// Delete a criterion
async function deleteCriterion(req, res, next) {
  try {
    const { id } = req.params;

    const result = await criterionService.deleteCriterion(id);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { createCriterion, getCriteriaByCategory, updateCriterion, deleteCriterion };
