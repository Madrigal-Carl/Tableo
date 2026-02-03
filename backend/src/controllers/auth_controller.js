const authService = require('../services/auth_service');
const { requestVerification, verifyCode } = require('../services/email_verification_service');
const userRepository = require('../repositories/user_repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function signupRequest(req, res, next) {
    try {
        const result = await authService.signupRequest(req.body);
        res.status(200).json(result);
    } catch (err) { next(err); }
}

async function signupVerify(req, res, next) {
    try {
        const result = await authService.signupVerify(req.body, res);
        res.status(201).json(result);
    } catch (err) { next(err); }
}

async function login(req, res, next) {
    try {
        const result = await authService.login(req.body, res);
        res.status(200).json(result);
    } catch (err) { next(err); }
}

async function logout(req, res, next) {
    try {
        await authService.logout(res);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) { next(err); }
}

// Forgot password
async function forgotPasswordRequest(req, res, next) {
    try { await authService.forgotPasswordRequest(req.body); res.json({ message: 'Code sent' }); }
    catch (err) { next(err); }
}
async function forgotPasswordVerify(req, res, next) {
    try { await authService.forgotPasswordVerify(req.body); res.json({ message: 'Verified' }); }
    catch (err) { next(err); }
}
async function forgotPasswordReset(req, res, next) {
    try { await authService.forgotPasswordReset(req.body); res.json({ message: 'Password reset' }); }
    catch (err) { next(err); }
}

module.exports = {
    signupRequest,
    signupVerify,
    login,
    logout,
    forgotPasswordRequest,
    forgotPasswordVerify,
    forgotPasswordReset
};
