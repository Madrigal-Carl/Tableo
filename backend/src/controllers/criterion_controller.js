const { createCriterionValidator } = require("../validators/criterion_validator");
const { createCriterion, getCriteriaByCategory } = require("../services/criterion_service");

// CREATE CRITERIA CONTROLLER
async function createCriterionController(req, res) {
  try {
    // Validate input
    const { error, value } = createCriterionValidator.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    const { category_id, criteria } = value;

    // Call service
    const createdCriteria = await createCriterion({ category_id, criteria });

    return res.status(201).json({
      message: "Criteria created successfully",
      data: createdCriteria,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to create criteria",
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

module.exports = { createCriterionController, getCriteriaController };
