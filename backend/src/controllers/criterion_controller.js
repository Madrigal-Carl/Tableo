// controllers/criterion_controller.js
const criterionService = require("../services/criterion_service");

async function upsertCriteria(req, res, next) {
  try {
    const categoryId = Number(req.params.categoryId);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const data = await criterionService.createOrUpdateCriteria({
      categoryId,
      criteria: req.validatedBody.criteria,
    });

    res.status(200).json({
      message: "Criteria created/updated successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

async function getCriteria(req, res, next) {
  try {
    const categoryId = Number(req.params.categoryId);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const data = await criterionService.getCriteriaByCategory(categoryId);

    res.status(200).json({
      message: "Criteria fetched successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  upsertCriteria,
  getCriteria,
};
