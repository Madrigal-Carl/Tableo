const Joi = require("joi");

const singleCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    "string.empty": "Category name is required",
    "any.required": "Category name is required",
  }),
  percentage: Joi.number().positive().required().messages({
    "number.base": "Percentage must be a number",
    "any.required": "Percentage is required",
  }),
  maxScore: Joi.number().positive().required().messages({
    "number.base": "Max score must be a number",
    "any.required": "Max score is required",
  }),
});

function validateCategory(req, res, next) {
  if (!req.body) {
    return res.status(400).json({
      message: "Request body is required",
    });
  }

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

  return next();
}

function validateStageCategoriesQuery(req, res, next) {
  const schema = Joi.object({
    eventId: Joi.number().integer().required(),
    stageId: Joi.number().integer().required(),
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
}

module.exports = { validateCategory, validateStageCategoriesQuery }