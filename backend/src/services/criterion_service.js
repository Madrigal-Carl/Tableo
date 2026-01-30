const sequelize = require('../database/models').sequelize;
const categoryRepo = require('../repositories/category_repository');
const criterionRepo = require('../repositories/criterion_repository');

// Create a criterion
async function createCriterion({ category_id, label, percentage }) {
  return sequelize.transaction(async (t) => {
    const category = await categoryRepo.findById(category_id);
    if (!category) throw new Error('Category not found');

    const criterion = await criterionRepo.create({ category_id, label, percentage }, t);
    return criterion;
  });
}

// Get all criteria for a category
async function getCriteriaByCategory(categoryId) {
  return criterionRepo.findByCategory(categoryId);
}

// Update a criterion
async function updateCriterion({ id, label, percentage }) {
  return sequelize.transaction(async (t) => {
    const criterion = await criterionRepo.findById(id);
    if (!criterion) throw new Error('Criterion not found');

    criterion.label = label ?? criterion.label;
    criterion.percentage = percentage ?? criterion.percentage;

    await criterion.save({ transaction: t });
    return criterion;
  });
}

// Soft delete a criterion
async function deleteCriterion(id) {
  return sequelize.transaction(async (t) => {
    const criterion = await criterionRepo.findById(id);
    if (!criterion) throw new Error('Criterion not found');

    await criterion.destroy({ transaction: t });
    return { message: 'Criterion deleted successfully' };
  });
}

module.exports = {createCriterion,getCriteriaByCategory,updateCriterion,deleteCriterion};