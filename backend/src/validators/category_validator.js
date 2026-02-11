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
 * Validator for single create
 */
function validateSingleCategory(req, res, next) {
  const schema = singleCategorySchema.keys({
    stage_id: Joi.number().integer().required().messages({
      "number.base": "Stage ID must be a number",
      "number.integer": "Stage ID must be an integer",
      "any.required": "Stage ID is required",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

/**
 * Validator for bulk create
 */
function validateBulkCategoryCreate(req, res, next) {
  const schema = Joi.object({
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
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

/**
 * Validator for bulk update
 * Each item must include categoryId
 */
function validateBulkCategoryUpdate(req, res, next) {
  const schema = Joi.object({
    eventId: Joi.number().integer().required().messages({
      "number.base": "Event ID must be a number",
      "number.integer": "Event ID must be an integer",
      "any.required": "Event ID is required",
    }),
    categories: Joi.array()
      .items(
        singleCategorySchema.keys({
          categoryId: Joi.number().integer().required().messages({
            "number.base": "Category ID must be a number",
            "number.integer": "Category ID must be an integer",
            "any.required": "Category ID is required",
          }),
          stage_id: Joi.number().integer().required().messages({
            "number.base": "Stage ID must be a number",
            "number.integer": "Stage ID must be an integer",
            "any.required": "Stage ID is required",
          }),
        })
      )
      .min(1)
      .required()
      .custom((categories, helper) => {
        const total = categories.reduce(
          (sum, cat) => sum + Number(cat.percentage || 0),
          0
        );
        if (total > 100) {
          return helper.message(
            `Total percentage of all categories cannot exceed 100%. Currently: ${total}%`
          );
        }
        return categories;
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

module.exports = {
  validateSingleCategory,
  validateBulkCategoryCreate,
  validateBulkCategoryUpdate,
};
