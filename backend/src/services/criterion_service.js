const sequelize = require('../database/models').sequelize;
const categoryRepo = require('../repositories/category_repository');
const criterionRepo = require('../repositories/criterion_repository');

/**
 * Create a new criterion
 */
async function createCriterion({ category_id, label, percentage }) {
  return sequelize.transaction(async (t) => {
    // Check if category exists
    const category = await categoryRepo.findById(category_id);
    if (!category) throw new Error('Category not found');

    // Create criterion
    const criterion = await criterionRepo.create({ category_id, label, percentage }, t);
    return criterion;
  });
}

/**
 * Get all criteria for a specific category
 */
async function getCriteriaByCategory(categoryId) {
  const criteria = await criterionRepo.findByCategory(categoryId);
  return criteria;
}

/**
 * Update an existing criterion
 */
async function updateCriterion({ id, label, percentage }) {
  return sequelize.transaction(async (t) => {
    const criterion = await criterionRepo.findById(id);
    if (!criterion) throw new Error('Criterion not found');

    // Update fields only if provided
    if (label !== undefined) criterion.label = label;
    if (percentage !== undefined) criterion.percentage = percentage;

    await criterion.save({ transaction: t });
    return criterion;
  });
}

/**
 * Soft delete a criterion
 */
async function deleteCriterion(id) {
  return sequelize.transaction(async (t) => {
    const criterion = await criterionRepo.findById(id);
    if (!criterion) throw new Error('Criterion not found');

    await criterion.destroy({ transaction: t });
    return { message: 'Criterion deleted successfully' };
  });
}

module.exports = {
  createCriterion,
  getCriteriaByCategory,
  updateCriterion,
  deleteCriterion,
};
