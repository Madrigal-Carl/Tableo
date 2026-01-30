const Joi = require('joi');

function validateEvent(req, res, next) {
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
    if (error)
        return res.status(400).json({ message: error.details[0].message });

    next();
}

module.exports = { validateEvent };
