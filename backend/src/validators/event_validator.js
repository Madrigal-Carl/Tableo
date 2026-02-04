const Joi = require('joi');

function validateEvent(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required().messages({
            'string.empty': 'Title is required',
            'any.required': 'Title is required'
        }),
        description: Joi.string().allow('', null),
        date: Joi.date().required().messages({
            'date.base': 'Date must be a valid date',
            'any.required': 'Date is required'
        }),
        timeStart: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).required().messages({
            'string.empty': 'Start time is required',
            'string.pattern.base': 'Start time must be in HH:MM 24-hour format',
            'any.required': 'Start time is required'
        }),
        timeEnd: Joi.string().pattern(/^([01]\d|2[0-4]):[0-5]\d$/).required().messages({
            'string.empty': 'End time is required',
            'string.pattern.base': 'End time must be in HH:MM 24-hour format',
            'any.required': 'End time is required'
        }),
        location: Joi.string().required().messages({
            'string.empty': 'Location is required',
            'any.required': 'Location is required'
        }),
        rounds: Joi.number().integer().min(1).required().messages({
            'number.base': 'Rounds must be a number',
            'number.integer': 'Rounds must be an integer',
            'number.min': 'Rounds must be at least 1',
            'any.required': 'Rounds is required'
        }),
        judges: Joi.number().integer().min(1).required().messages({
            'number.base': 'Judges must be a number',
            'number.integer': 'Judges must be an integer',
            'number.min': 'Judges must be at least 1',
            'any.required': 'Judges is required'
        }),
        candidates: Joi.number().integer().min(1).required().messages({
            'number.base': 'Candidates must be a number',
            'number.integer': 'Candidates must be an integer',
            'number.min': 'Candidates must be at least 1',
            'any.required': 'Candidates is required'
        }),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

module.exports = { validateEvent };
