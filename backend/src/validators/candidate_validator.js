const Joi = require('joi');

function validateCandidate(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        sex: Joi.string().valid('male', 'female').required(),
        event_id: Joi.number().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
}

function validateCandidateCount(req, res, next) {
    const schema = Joi.object({
        count: Joi.number().integer().min(1).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
}

module.exports = { validateCandidate, validateCandidateCount };
