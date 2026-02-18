const Joi = require("joi");

function validateCompetitionScores(req, res, next) {
  const schema = Joi.array().items(
    Joi.object({
      candidate_id: Joi.number().integer().required().messages({
        "any.required": "Candidate ID is required",
        "number.base": "Candidate ID must be a number",
        "number.integer": "Candidate ID must be an integer",
      }),
      judge_id: Joi.number().integer().required().messages({
        "any.required": "Judge ID is required",
        "number.base": "Judge ID must be a number",
        "number.integer": "Judge ID must be an integer",
      }),
      criterion_id: Joi.number().integer().required().messages({
        "any.required": "Criterion ID is required",
        "number.base": "Criterion ID must be a number",
        "number.integer": "Criterion ID must be an integer",
      }),
      score: Joi.number().min(0).required().messages({
        "any.required": "Score is required",
        "number.base": "Score must be a number",
        "number.min": "Score cannot be negative",
      }),
    }),
  );

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
}

module.exports = { validateCompetitionScores };
