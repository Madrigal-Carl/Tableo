const Joi = require("joi");

function validateCreateCategory(req, res, next) {
  const schema = Joi.object({
    event_id: Joi.number().integer().required().messages({
      "any.required": "Event ID is required",
      "number.base": "Event ID must be a number",
    }),
    name: Joi.string().min(2).required().messages({
      "any.required": "Category name is required",
      "string.empty": "Category name cannot be empty",
    }),
    percentage: Joi.number().min(0).max(100).required().messages({
      "any.required": "Percentage is required",
      "number.base": "Percentage must be a number",
      "number.min": "Percentage cannot be less than 0",
      "number.max": "Percentage cannot be more than 100",
    }),
    maxScore: Joi.number().greater(0).required().messages({
      "any.required": "Max score is required",
      "number.base": "Max score must be a number",
      "number.greater": "Max score must be greater than 0",
    }),
    stage_id: Joi.number().integer().optional().messages({
      "number.base": "Stage ID must be a number",
      "number.integer": "Stage ID must be an integer",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
}

module.exports = { validateCreateCategory };
