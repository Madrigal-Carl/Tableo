const { Criterion } = require("../database/models");

// Create a single criterion
function create(data, transaction) {
  return Criterion.create(data, { transaction });
}

// Find criteria by category (active only)
function findByCategory(categoryId) {
  return Criterion.findAll({
    where: { category_id: categoryId },
    order: [["id", "ASC"]],
  });
}

// Find criterion by ID
function findById(id) {
  return Criterion.findOne({ where: { id } });
}

// Soft delete using paranoid destroy
async function softDelete(id, transaction) {
  const criterion = await findById(id);
  if (!criterion) throw new Error("Criterion not found");
  return criterion.destroy({ transaction });
}

// Find all criteria including soft-deleted
function findAllIncludingSoftDeleted(categoryId, transaction) {
  return Criterion.findAll({
    where: { category_id: categoryId },
    paranoid: false, // include soft-deleted
    transaction,
    order: [["id", "ASC"]],
  });
}

module.exports = {
  create,
  findByCategory,
  findById,
  softDelete,
  findAllIncludingSoftDeleted,
};
