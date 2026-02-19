const Joi = require("joi");

function validateCandidate(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "string.empty": "Candidate name is required",
      "string.min": "Candidate name must be at least 2 characters",
      "string.max": "Candidate name must not exceed 50 characters",
      "any.required": "Candidate name is required",
    }),
    sex: Joi.string().valid("male", "female").required().messages({
      "any.only": 'Sex must be either "male" or "female"',
      "any.required": "Sex is required",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
}

function validateCandidateCount(req, res, next) {
  const schema = Joi.object({
    count: Joi.number().integer().min(1).required().messages({
      "number.base": "Count must be a number",
      "number.integer": "Count must be an integer",
      "number.min": "Count must be at least 1",
      "any.required": "Count is required",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
}

function validateCandidateId(req, res, next) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid candidate ID" });
  }

  next();
}

module.exports = {
  validateCandidate,
  validateCandidateCount,
  validateCandidateId,
};
