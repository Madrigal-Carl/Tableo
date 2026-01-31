const Joi = require('joi');

// Signup Validation
function validateSignup(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
            .messages({ 'any.only': 'Password and confirm password must match' }),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

// Verify signup code
function validateVerification(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        code: Joi.string().length(6).required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

// Login Validation
function validateLogin(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        rememberMe: Joi.boolean().optional(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

// Refresh token validation
function validateRefreshToken(req, res, next) {
    const schema = Joi.object({
        refreshToken: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

// Forgot password steps
function validateForgotPasswordRequest(req, res, next) {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

function validateForgotPasswordVerify(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        code: Joi.string().length(6).required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

function validateForgotPasswordReset(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
            .messages({ 'any.only': 'Password and confirm password must match' }),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

module.exports = {
    validateSignup,
    validateVerification,
    validateLogin,
    validateRefreshToken,
    validateForgotPasswordRequest,
    validateForgotPasswordVerify,
    validateForgotPasswordReset
};
