const { Criterion } = require("../database/models");

class CriterionRepository {
  // Create a single criterion
  async create(data, transaction) {
    return Criterion.create(data, { transaction });
  }

  // Find criteria by category
  async findByCategory(categoryId) {
    return Criterion.findAll({
      where: { category_id: categoryId, deleted_at: null },
      order: [["id", "ASC"]],
    });
  }

  // Optional: find by id
  async findById(id) {
    return Criterion.findOne({ where: { id, deleted_at: null } });
  }

  // Optional: soft delete
  async softDelete(id, transaction) {
    const criterion = await this.findById(id);
    if (!criterion) throw new Error("Criterion not found");

    criterion.deleted_at = new Date();
    return criterion.save({ transaction });
  }
}

module.exports = new CriterionRepository();
