// services/criterion_service.js
const sequelize = require("../database/models").sequelize;
const criterionRepo = require("../repositories/criterion_repository");
const categoryRepo = require("../repositories/category_repository");

async function createOrUpdateCriteria({ categoryId, criteria }) {
  const total = criteria.reduce((sum, c) => sum + c.percentage, 0);
  if (total !== 100) {
    throw new Error("Total of all percentages must be exactly 100");
  }

  return sequelize.transaction(async (t) => {
    const category = await categoryRepo.findById(categoryId);
    if (!category) throw new Error("Category not found");

    const existing = await criterionRepo.findAllIncludingSoftDeleted(
      categoryId,
      t
    );

    const usedIds = new Set();
    const results = [];

    for (const input of criteria) {
      let criterion =
        existing.find(c => !c.deleted_at && !usedIds.has(c.id)) ||
        existing.find(c => c.deleted_at && !usedIds.has(c.id));

      if (criterion?.deleted_at) {
        await criterion.restore({ transaction: t });
      }

      if (!criterion) {
        criterion = await criterionRepo.create(
          { category_id: categoryId, ...input },
          t
        );
      } else {
        criterion.set(input);
        await criterion.save({ transaction: t });
      }

      usedIds.add(criterion.id);
      results.push(criterion);
    }

    for (const c of existing.filter(c => !c.deleted_at)) {
      if (!usedIds.has(c.id)) {
        await c.destroy({ transaction: t });
      }
    }

    return results;
  });
}

async function getCriteriaByCategory(categoryId) {
  const category = await categoryRepo.findById(categoryId);
  if (!category) throw new Error("Category not found");

  return criterionRepo.findByCategory(categoryId);
}

module.exports = {
  createOrUpdateCriteria,
  getCriteriaByCategory,
};
