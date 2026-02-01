const Joi = require('joi');

// Signup Validation
function validateSignup(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be valid',
            'any.required': 'Email is required'
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Password and confirm password must match',
            'string.empty': 'Confirm password is required',
            'any.required': 'Confirm password is required'
        }),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

// Verify signup code
function validateVerification(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be valid',
            'any.required': 'Email is required'
        }),
        code: Joi.string().length(6).required().messages({
            'string.empty': 'Verification code is required',
            'string.length': 'Verification code must be 6 characters',
            'any.required': 'Verification code is required'
        })
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

// Login Validation
function validateLogin(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be valid',
            'any.required': 'Email is required'
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        }),
        rememberMe: Joi.boolean().optional()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

// Refresh token validation
function validateRefreshToken(req, res, next) {
    const schema = Joi.object({
        refreshToken: Joi.string().required().messages({
            'string.empty': 'Refresh token is required',
            'any.required': 'Refresh token is required'
        })
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

// Forgot password steps
function validateForgotPasswordRequest(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be valid',
            'any.required': 'Email is required'
        })
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

function validateForgotPasswordVerify(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be valid',
            'any.required': 'Email is required'
        }),
        code: Joi.string().length(6).required().messages({
            'string.empty': 'Verification code is required',
            'string.length': 'Verification code must be 6 characters',
            'any.required': 'Verification code is required'
        })
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

function validateForgotPasswordReset(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be valid',
            'any.required': 'Email is required'
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Password and confirm password must match',
            'string.empty': 'Confirm password is required',
            'any.required': 'Confirm password is required'
        }),
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
