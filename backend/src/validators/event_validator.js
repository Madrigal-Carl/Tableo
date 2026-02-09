const Joi = require('joi');

function validateEvent(req, res, next) {
    const schema = Joi.object({
        path: Joi.string().uri().optional().messages({
            'string.base': 'Image path must be a string',
            'string.uri': 'Image must be a valid URL',
        }),
        title: Joi.string().max(100).required().messages({
            'string.empty': 'Title is required',
            'string.max': 'Title cannot exceed 100 characters',
            'any.required': 'Title is required'
        }),
        description: Joi.string().max(500).allow('', null).messages({
            'string.max': 'Description cannot exceed 500 characters'
        }),
        date: Joi.date()
            .required()
            .custom((value, helpers) => {
                const inputDate = new Date(value);
                const today = new Date();
                inputDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);
                if (inputDate < today) {
                    return helpers.error('date.min');
                }
                return value;
            })
            .messages({
                'date.base': 'Date must be a valid date',
                'date.min': 'Event date must be today or later',
                'any.required': 'Date is required',
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
        location: Joi.string().max(200).required().messages({
            'string.empty': 'Location is required',
            'string.max': 'Location cannot exceed 200 characters',
            'any.required': 'Location is required'
        }),
        stages: Joi.number().integer().min(1).max(20).required().messages({
            'number.base': 'Stages must be a number',
            'number.integer': 'Stages must be an integer',
            'number.min': 'Stages must be at least 1',
            'number.max': 'Stages cannot exceed 20',
            'any.required': 'Stages is required',
        }),
        judges: Joi.number().integer().min(1).max(15).required().messages({
            'number.base': 'Judges must be a number',
            'number.integer': 'Judges must be an integer',
            'number.min': 'Judges must be at least 1',
            'number.max': 'Judges cannot exceed 15',
            'any.required': 'Judges is required',
        }),
        candidates: Joi.number().integer().min(1).max(500).required().messages({
            'number.base': 'Candidates must be a number',
            'number.integer': 'Candidates must be an integer',
            'number.min': 'Candidates must be at least 1',
            'number.max': 'Candidates cannot exceed 500',
            'any.required': 'Candidates is required',
        }),
    });

    const data = {
        ...req.body,
        stages: Number(req.body.stages),
        judges: Number(req.body.judges),
        candidates: Number(req.body.candidates),
    };

    const { error } = schema.validate(data);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

module.exports = { validateEvent };
