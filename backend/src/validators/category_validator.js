const Joi = require('joi');

function validateCreateCategory(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    percentage: Joi.number().min(0).max(100).required(),
    maxScore: Joi.number().greater(0).required(),
    stage_id: Joi.number().integer().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
}

function validateUpdateCategory(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    percentage: Joi.number().min(0).max(100).required(),
    maxScore: Joi.number().greater(0).required(),
    stage_id: Joi.number().integer().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
}

module.exports = {
  validateCreateCategory,
  validateUpdateCategory,
};
