const Joi = require('joi');

function validateCandidate(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Candidate name is required',
            'any.required': 'Candidate name is required',
        }),
        sex: Joi.string().valid('male', 'female').required().messages({
            'any.only': 'Sex must be either "male" or "female"',
            'any.required': 'Sex is required',
        })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
}

function validateCandidateCount(req, res, next) {
    const schema = Joi.object({
        count: Joi.number().integer().min(1).required().messages({
            'number.base': 'Count must be a number',
            'number.integer': 'Count must be an integer',
            'number.min': 'Count must be at least 1',
            'any.required': 'Count is required',
        }),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
}

module.exports = { validateCandidate, validateCandidateCount };
