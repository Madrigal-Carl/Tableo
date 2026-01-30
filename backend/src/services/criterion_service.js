const { Criterion } = require("../database/models"); 
const sequelize = require("../database/models").sequelize;
const criterionRepo = require("../repositories/criterion_repository");
const categoryRepo = require("../repositories/category_repository");

// CREATE CRITERION (single or multiple)
async function createCriterion({ category_id, criteria }) {
  if (!Array.isArray(criteria) || criteria.length === 0) {
    throw new Error("At least one criterion must be provided");
  }

  const total = criteria.reduce((sum, c) => sum + (c.percentage ?? 0), 0);
  if (total !== 100) {
    throw new Error("Total of all percentages must be exactly 100");
  }

  return sequelize.transaction(async (t) => {
    const category = await categoryRepo.findById(category_id);
    if (!category) throw new Error("Category not found");

    const createdCriteria = [];
    for (const crit of criteria) {
      const created = await criterionRepo.create(
        { category_id, label: crit.label, percentage: crit.percentage ?? 0 },
        t
      );
      createdCriteria.push(created);
    }

    return createdCriteria;
  });
}

// READ CRITERIA by category
async function getCriteriaByCategory(category_id) {
  const category = await categoryRepo.findById(category_id);
  if (!category) throw new Error("Category not found");

  return await criterionRepo.findByCategory(category_id);
}

// UPDATE MULTIPLE CRITERIA (add/update/remove with soft delete)
async function updateCriteria({ category_id, criteria }) {
  if (!Array.isArray(criteria)) {
    throw new Error("Criteria array is required");
  }

  // Check total percentages
  const total = criteria.reduce((sum, c) => sum + (c.percentage ?? 0), 0);
  if (total !== 100) {
    throw new Error("Total of all percentages must be exactly 100");
  }

  return sequelize.transaction(async (t) => {
    const category = await categoryRepo.findById(category_id);
    if (!category) throw new Error("Category not found");

    // Fetch **all existing criteria including soft-deleted** for proper soft delete handling
    const existingCriteria = await Criterion.findAll({
      where: { category_id },
      paranoid: false, // fetch soft-deleted too
    });
    const existingMap = new Map(existingCriteria.map((c) => [c.id, c]));

    const updatedCriteria = [];

    for (const crit of criteria) {
      if (crit.id) {
        const existing = existingMap.get(crit.id);
        if (!existing) throw new Error(`Criterion with ID ${crit.id} not found`);
        
        // If it was soft-deleted, restore it
        if (existing.deleted_at) {
          await existing.restore({ transaction: t });
        }

        existing.label = crit.label;
        existing.percentage = crit.percentage;
        await existing.save({ transaction: t });
        updatedCriteria.push(existing);
      } else {
        // Add new criterion
        const created = await criterionRepo.create(
          { category_id, label: crit.label, percentage: crit.percentage ?? 0 },
          t
        );
        updatedCriteria.push(created);
      }
    }

    // Soft-delete any existing criteria not included in request
    for (const existing of existingCriteria) {
      if (!criteria.some((c) => c.id === existing.id) && !existing.deleted_at) {
        await existing.destroy({ transaction: t }); // triggers paranoid soft delete
      }
    }

    return updatedCriteria;
  });
}

module.exports = { createCriterion, getCriteriaByCategory, updateCriteria };
