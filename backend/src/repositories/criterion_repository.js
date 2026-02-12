const { Criterion } = require("../database/models");

class CriterionRepository {
  // Create a single criterion
  async create(data, transaction) {
    return Criterion.create(data, { transaction });
  }

  // Find criteria by category (active only)
  async findByCategory(categoryId) {
    return Criterion.findAll({
      where: { category_id: categoryId },
      order: [["id", "ASC"]],
    });
  }

  // Find criterion by ID
  async findById(id) {
    return Criterion.findOne({ where: { id } });
  }

  // Soft delete using paranoid destroy
  async softDelete(id, transaction) {
    const criterion = await this.findById(id);
    if (!criterion) throw new Error("Criterion not found");
    return criterion.destroy({ transaction });
  }

  // Fetch all criteria including soft-deleted
  async findByCategoryIncludingSoftDeleted(categoryId, transaction) {
    return Criterion.findAll({
      where: { category_id: categoryId },
      paranoid: false, // include soft-deleted
      transaction,
    });
  }
}

module.exports = new CriterionRepository();
