const { Criterion } = require('../database/models');

// Create a criterion
function create(data, transaction) {
  return Criterion.create(data, { transaction });
}

// Get all criteria for a category
function findByCategory(categoryId) {
  return Criterion.findAll({
    where: { category_id: categoryId },
    order: [['id', 'ASC']],
  });
}

// Find by ID
function findById(id) {
  return Criterion.findByPk(id);
}

module.exports = { create, findByCategory, findById };
