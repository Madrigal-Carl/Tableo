const { Criterion } = require("../database/models");
const sequelize = require("../database/models").sequelize;
const criterionRepo = require("../repositories/criterion_repository");
const categoryRepo = require("../repositories/category_repository");

// CREATE OR UPDATE CRITERIA (reuses soft-deleted rows if available)
async function createOrUpdateCriteria({ category_id, criteria }) {
  if (!Array.isArray(criteria) || criteria.length === 0) {
    throw new Error("At least one criterion must be provided");
  }

  // Validate total percentage = 100
  const total = criteria.reduce((sum, c) => sum + (c.percentage ?? 0), 0);
  if (total !== 100) {
    throw new Error("Total of all percentages must be exactly 100");
  }

  return sequelize.transaction(async (t) => {
    const category = await categoryRepo.findById(category_id);
    if (!category) throw new Error("Category not found");

    // Fetch all criteria including soft-deleted
    const allCriteria = await criterionRepo.findByCategoryIncludingSoftDeleted(category_id, t);
    const usedIds = new Set();
    const updatedCriteria = [];

    for (const crit of criteria) {
      // 1️⃣ Try to find an active criterion not used yet
      let criterion = allCriteria.find(c => !c.deleted_at && !usedIds.has(c.id));

      // 2️⃣ If none, try to reuse a soft-deleted criterion
      if (!criterion) {
        criterion = allCriteria.find(c => c.deleted_at && !usedIds.has(c.id));
        if (criterion) {
          // Restore soft-deleted row (clears deleted_at automatically)
          await criterion.restore({ transaction: t });
        }
      }

      // 3️⃣ If still none, create new
      if (!criterion) {
        criterion = await criterionRepo.create(
          { category_id, label: crit.label, percentage: crit.percentage ?? 0 },
          t
        );
      } else {
        // Update active/restored criterion
        criterion.label = crit.label;
        criterion.percentage = crit.percentage;
        await criterion.save({ transaction: t });
      }

      usedIds.add(criterion.id);
      updatedCriteria.push(criterion);
    }

    // Soft-delete any active criteria not included in the new input
    for (const c of allCriteria.filter(c => !c.deleted_at)) {
      if (!usedIds.has(c.id)) {
        await c.destroy({ transaction: t });
      }
    }

    return updatedCriteria;
  });
}

// READ CRITERIA by category
async function getCriteriaByCategory(category_id) {
  const category = await categoryRepo.findById(category_id);
  if (!category) throw new Error("Category not found");

  return criterionRepo.findByCategory(category_id);
}

module.exports = { createOrUpdateCriteria, getCriteriaByCategory };
