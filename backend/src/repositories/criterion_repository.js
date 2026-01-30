const { Criterion } = require("../database/models");

class CriterionRepository {
  // Create a single criterion
  async create(data, transaction) {
    return Criterion.create(data, { transaction });
  }

  // Find criteria by category
  async findByCategory(categoryId) {
    return Criterion.findAll({
      where: { category_id: categoryId },
      order: [["id", "ASC"]],
    });
  }

  // Optional: find by id
  async findById(id) {
    return Criterion.findOne({ where: { id } });
  }

  // Soft delete using paranoid destroy
  async softDelete(id, transaction) {
    const criterion = await this.findById(id);
    if (!criterion) throw new Error("Criterion not found");

    // ✅ Use destroy() to trigger paranoid soft delete
    return criterion.destroy({ transaction });
  }
}

module.exports = new CriterionRepository();
