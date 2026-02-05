const Joi = require("joi");

const scoreItemSchema = Joi.object({
  candidateId: Joi.number().integer().positive().required(),
  criterionId: Joi.number().integer().positive().required(),
  score: Joi.number().min(0).max(100).required(),
});

const bulkScoresSchema = Joi.object({
  scores: Joi.array().items(scoreItemSchema).min(1).required(),
});

function validateBulkScores(req, res, next) {
  const { error } = bulkScoresSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const categoryId = Number(req.params.categoryId);
  if (!categoryId || categoryId <= 0) {
    return res.status(400).json({ error: "Invalid categoryId in URL" });
  }

  req.body.categoryId = categoryId;
  next();
}

module.exports = { validateBulkScores };
