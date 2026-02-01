const Joi = require('joi');

function validateCreateEvent(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow('', null),
        date: Joi.date().required(),
        timeStart: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).required(),
        timeEnd: Joi.string().pattern(/^([01]\d|2[0-4]):[0-5]\d$/).required(),
        location: Joi.string().required(),
        rounds: Joi.number().integer().min(1).required(),
        judges: Joi.number().integer().min(1).required(),
        candidates: Joi.number().integer().min(1).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

function validateUpdateEvent(req, res, next) {
    const schema = Joi.object({
        title: Joi.string(),
        description: Joi.string().allow('', null),
        date: Joi.date(),
        timeStart: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/),
        timeEnd: Joi.string().pattern(/^([01]\d|2[0-4]):[0-5]\d$/),
        location: Joi.string(),
        rounds: Joi.number().integer().min(1),
        judges: Joi.number().integer().min(1),
        candidates: Joi.number().integer().min(1),
    }).min(1); // require at least one field

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

module.exports = { validateCreateEvent, validateUpdateEvent };
