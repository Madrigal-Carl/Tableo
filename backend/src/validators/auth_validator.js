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

// Login Validation
function validateLogin(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required",
        }),

        password: Joi.string().min(6).required().messages({
            "string.min": "Password must be at least 6 characters long",
            "any.required": "Password is required",
        }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }

    next();
}

//forget password request validation
function validateForgotPasswordRequest(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required",
        }),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

// Step 2: Verify code
function validateForgotPasswordVerify(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required",
        }),
        code: Joi.string().length(6).required().messages({
            "string.length": "Verification code must be 6 digits",
            "any.required": "Verification code is required",
        }),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

// Step 3: Reset password
function validateForgotPasswordReset(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required",
        }),
        password: Joi.string().min(6).required().messages({
            "string.min": "Password must be at least 6 characters long",
            "any.required": "Password is required",
        }),
        confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
            "any.only": "Password and confirm password must match",
            "any.required": "Confirm password is required",
        }),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

module.exports = { validateSignup, validateVerification, validateLogin, validateForgotPasswordRequest, validateForgotPasswordVerify,validateForgotPasswordReset };