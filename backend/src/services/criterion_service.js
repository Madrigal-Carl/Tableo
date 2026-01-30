const sequelize = require("../database/models").sequelize;
const criterionRepo = require("../repositories/criterion_repository");
const categoryRepo = require("../repositories/category_repository");

// CREATE CRITERION (single or multiple)
async function createCriterion({ category_id, criteria }) {
  /**
   * criteria: an array of objects like:
   * [{ label: "Creativity", percentage: 40 }, { label: "Originality", percentage: 60 }]
   */

  if (!Array.isArray(criteria) || criteria.length === 0) {
    throw new Error("At least one criterion must be provided");
  }

  return sequelize.transaction(async (t) => {
    // Fetch category to ensure it exists
    const category = await categoryRepo.findById(category_id);
    if (!category) throw new Error("Category not found");

    // Create all criteria in the transaction
    const createdCriteria = [];
    for (const crit of criteria) {
      const created = await criterionRepo.create(
        {
          category_id,
          label: crit.label,
          percentage: crit.percentage ?? 0, // default to 0 if not provided
        },
        t
      );
      createdCriteria.push(created);
    }

    return createdCriteria;
  });
}

module.exports = { createCriterion };
