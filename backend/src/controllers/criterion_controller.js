const { createOrUpdateCriteria, getCriteriaByCategory } = require("../services/criterion_service");
const { createOrUpdateCriterionValidator } = require("../validators/criterion_validator");

// CREATE OR UPDATE CRITERIA CONTROLLER
async function createOrUpdateCriteriaController(req, res) {
  try {
    const category_id = parseInt(req.params.categoryId, 10);
    if (isNaN(category_id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Validate input
    const { error, value } = createOrUpdateCriterionValidator.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    const updatedCriteria = await createOrUpdateCriteria({
      category_id,
      criteria: value.criteria,
    });

    return res.status(200).json({
      message: "Criteria created/updated successfully",
      data: updatedCriteria,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to create/update criteria",
      error: err.message,
    });
  }
}

// READ CRITERIA CONTROLLER
async function getCriteriaController(req, res) {
  try {
    const category_id = parseInt(req.params.categoryId, 10);
    if (isNaN(category_id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const criteria = await getCriteriaByCategory(category_id);

    return res.status(200).json({
      message: "Criteria fetched successfully",
      data: criteria,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch criteria",
      error: err.message,
    });
  }
}

module.exports = {
  createOrUpdateCriteriaController,
  getCriteriaController,
};
