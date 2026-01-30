const { createCriterionValidator } = require("../validators/criterion_validator");
const { createCriterion } = require("../services/criterion_service"); // service function

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

module.exports = { createCriterionController };
