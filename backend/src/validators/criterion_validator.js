const Joi = require("joi");

// CREATE OR UPDATE CRITERIA VALIDATOR (single for both)
const createOrUpdateCriterionValidator = Joi.object({
  criteria: Joi.array()
    .items(
      Joi.object({
        label: Joi.string()
          .trim()
          .pattern(/[A-Za-z]/) // must contain at least one letter
          .required()
          .messages({
            "any.required": "Criterion label is required",
            "string.base": "Criterion label must be a string",
            "string.empty": "Criterion label cannot be empty",
            "string.pattern.base": "Criterion label must contain letters and cannot be numbers only",
          }),
        percentage: Joi.number().min(0).max(100).required().messages({
          "any.required": "Percentage is required",
          "number.base": "Percentage must be a number",
          "number.min": "Percentage cannot be less than 0",
          "number.max": "Percentage cannot be more than 100",
        }),
      })
    )
    .min(1)
    .required()
    .custom((value, helpers) => {
      const total = value.reduce((sum, c) => sum + (c.percentage ?? 0), 0);
      if (total !== 100) return helpers.error("array.totalPercentage");
      return value;
    })
    .messages({
      "any.required": "At least one criterion is required",
      "array.min": "At least one criterion must be provided",
      "array.totalPercentage": "Total of all percentages must be exactly 100",
    }),
});

module.exports = { createOrUpdateCriterionValidator };
