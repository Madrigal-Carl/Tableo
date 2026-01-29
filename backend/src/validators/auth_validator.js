const Joi = require('joi');

function validateSignup(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    }).messages({ 'any.only': 'Password and confirm password must match' });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

function validateVerification(req, res, next) {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'Email and code are required' });
    next();
}

module.exports = { validateSignup, validateVerification };
