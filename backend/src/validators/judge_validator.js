
const Joi = require('joi');

function validateJudge(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Judge name is required',
            'any.required': 'Judge name is required',
        }),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
}

function validateJudgeCount(req, res, next) {
    const schema = Joi.object({
        count: Joi.number().integer().min(1).required().messages({
            'number.base': 'Count must be a number',
            'number.integer': 'Count must be an integer',
            'number.min': 'Count must be at least 1',
            'any.required': 'Count is required',
        }),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
}

module.exports = { validateJudge, validateJudgeCount };
