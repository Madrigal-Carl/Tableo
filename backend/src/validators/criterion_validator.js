const Joi = require("joi");

// Validate criteria payload
function validateCriteria(req, res, next) {
  const schema = Joi.object({
    criteria: Joi.array()
      .items(
        Joi.object({
          label: Joi.string()
            .trim()
            .pattern(/[A-Za-z]/)
            .required()
            .messages({
              "string.empty": "Criterion label is required",
              "string.base": "Criterion label must be a string",
              "string.pattern.base":
                "Criterion label must contain letters and cannot be numbers only",
              "any.required": "Criterion label is required",
            }),
          percentage: Joi.number().min(0).max(100).positive().required().messages({
            "any.required": "Percentage is required",
            "number.base": "Percentage must be a number",
            "number.integer": "Max score must be a whole number",
            "number.min": "Percentage cannot be less than 0",
            "number.max": "Percentage cannot be more than 100",
          }),
        })
      )
      .min(1)
      .required()
      .messages({
        "any.required": "At least one criterion is required",
        "array.min": "At least one criterion must be provided",
      }),
  });

  const { error, value } = schema.validate(req.body, { abortEarly: true });

  if (error) {
    // Return only the first error message to frontend for toast
    return res.status(400).json({ message: error.details[0].message });
  }

  // ✅ Attach validated value so controller can use it
  req.validatedBody = value;
  next();
}

module.exports = { validateCriteria };
