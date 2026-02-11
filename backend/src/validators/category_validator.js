const Joi = require("joi");

/**
 * Schema for a single category item
 */
const singleCategorySchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters",
    "any.required": "Category name is required",
  }),
  percentage: Joi.number().min(0).max(100).required().messages({
    "number.base": "Percentage must be a number",
    "number.min": "Percentage cannot be less than 0",
    "number.max": "Percentage cannot be more than 100",
    "any.required": "Percentage is required",
  }),
  maxScore: Joi.number().greater(0).required().messages({
    "number.base": "Max score must be a number",
    "number.greater": "Max score must be greater than 0",
    "any.required": "Max score is required",
  }),
});

/**
 * Main validator
 */
function validateCategory(req, res, next) {
  /**
   * BULK CREATE
   */
  if (Array.isArray(req.body.categories)) {
    const bulkSchema = Joi.object({
      stage_id: Joi.number().integer().required().messages({
        "number.base": "Stage ID must be a number",
        "number.integer": "Stage ID must be an integer",
        "any.required": "Stage ID is required",
      }),
      categories: Joi.array()
        .items(singleCategorySchema)
        .min(1)
        .required()
        .custom((categories, helper) => {
          const total = categories.reduce(
            (sum, cat) => sum + Number(cat.percentage || 0),
            0
          );
          if (total !== 100) {
            return helper.message(
              `Total percentage of all categories must equal 100%. Currently: ${total}%`
            );
          }
          return categories;
        })
        .messages({
          "array.base": "Categories must be an array",
          "array.min": "At least one category is required",
          "any.required": "Categories are required",
        }),
    });

    const { error } = bulkSchema.validate(req.body, { abortEarly: true });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    return next();
  }

  /**
   * SINGLE CREATE
   */
  const singleSchema = singleCategorySchema.keys({
    stage_id: Joi.number().integer().required().messages({
      "number.base": "Stage ID must be a number",
      "number.integer": "Stage ID must be an integer",
      "any.required": "Stage ID is required",
    }),
  });

  const { error } = singleSchema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
}

module.exports = { validateCategory };
