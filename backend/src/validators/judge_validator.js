
const Joi = require('joi');

function validateJudge(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Judge name is required',
            'any.required': 'Judge name is required',
        }),
        suffix: Joi.string()
            .valid('mr', 'ms', 'mrs')
            .optional()
            .messages({
                'any.only': 'Suffix must be one of: mr, ms, mrs',
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

function validateInvitationCode(req, res, next) {
    const schema = Joi.object({
        invitationCode: Joi.string()
            .pattern(/^JDG-[A-Z0-9]{6}$/)
            .required()
            .messages({
                'string.pattern.base': 'Invalid invitation code',
                'string.empty': 'Invitation code is required',
                'any.required': 'Invitation code is required',
            }),
    });

    const { error } = schema.validate(req.params);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
}

module.exports = { validateJudge, validateJudgeCount, validateInvitationCode };
