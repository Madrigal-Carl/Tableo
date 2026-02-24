const Joi = require("joi");

function validateStage(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Stage name is required",
      "any.required": "Stage name is required",
    }),

    // ✅ Allow sequence updates
    sequence: Joi.number().integer().min(1).optional().messages({
      "number.base": "Sequence must be a number",
      "number.integer": "Sequence must be an integer",
      "number.min": "Sequence must be at least 1",
    }),
  }).unknown(false); // ❗ Prevent unexpected fields

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
}

function validateStageCount(req, res, next) {
  const schema = Joi.object({
    count: Joi.number().integer().min(1).required().messages({
      "number.base": "Count must be a number",
      "number.integer": "Count must be an integer",
      "number.min": "Count must be at least 1",
      "any.required": "Count is required",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
}

function validateStageIdParam(req, res, next) {
  const schema = Joi.object({
    id: Joi.number().integer().required().messages({
      "number.base": "Stage id must be a number",
      "any.required": "Stage id is required",
    }),
  });

  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
}

module.exports = {
  validateStage,
  validateStageCount,
  validateStageIdParam,
};
