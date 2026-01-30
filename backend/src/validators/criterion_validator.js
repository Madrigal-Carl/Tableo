const Joi = require('joi');

function validateCriterion(isUpdate = false) {
  return (req, res, next) => {
    const schema = Joi.object({
      category_id: Joi.number().integer()
        .when('$isUpdate', { is: false, then: Joi.required() })
        .messages({
          'any.required': 'Category ID is required',
          'number.base': 'Category ID must be a number',
        }),
      label: Joi.string().min(1).required().messages({
        'any.required': 'Label is required',
        'string.empty': 'Label cannot be empty',
      }),
      percentage: Joi.number().min(0).max(100).required().messages({
        'any.required': 'Percentage is required',
        'number.base': 'Percentage must be a number',
        'number.min': 'Percentage cannot be less than 0',
        'number.max': 'Percentage cannot be more than 100',
      }),
    });

    const { error } = schema.validate(req.body, { context: { isUpdate } });
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
  };
}

module.exports = { validateCriterion };
