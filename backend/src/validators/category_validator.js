const Joi = require('joi');

function validateCategory(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(2).required().messages({
      'string.empty': 'Category name is required',
      'string.min': 'Category name must be at least 2 characters',
      'any.required': 'Category name is required',
    }),
    percentage: Joi.number().min(0).max(100).required().messages({
      'number.base': 'Percentage must be a number',
      'number.min': 'Percentage cannot be less than 0',
      'number.max': 'Percentage cannot be more than 100',
      'any.required': 'Percentage is required',
    }),
    maxScore: Joi.number().greater(0).required().messages({
      'number.base': 'Max score must be a number',
      'number.greater': 'Max score must be greater than 0',
      'any.required': 'Max score is required',
    }),
    stage_id: Joi.number().integer().required().messages({
      'number.base': 'Stage ID must be a number',
      'number.integer': 'Stage ID must be an integer',
      'any.required': 'Stage ID is required',
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
}

module.exports = { validateCategory };
