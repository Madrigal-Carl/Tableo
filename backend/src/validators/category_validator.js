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

    max_score: Joi.number().min(0).required().messages({
      "any.required": "Max score is required",
      "number.base": "Max score must be a number",
      "number.min": "Max score cannot be negative",
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