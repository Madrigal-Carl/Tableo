const Joi = require("joi");

function validateCompetitionScores(req, res, next) {
  const schema = Joi.array().items(
    Joi.object({
      candidate_id: Joi.number().integer().required(),
      judge_id: Joi.number().integer().required(),
      criterion_id: Joi.number().integer().required(),
      score: Joi.number().min(0).required(),
    }),
  );

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
}

module.exports = { validateCompetitionScores };
