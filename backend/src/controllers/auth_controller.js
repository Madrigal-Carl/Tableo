const authService = require('../services/auth_service');

async function signupRequest(req, res, next) {
    try {
        const result = await authService.signupRequest(req.body);
        res.status(200).json(result);
    } catch (err) { next(err); }
}

async function signupVerify(req, res, next) {
    try {
        const result = await authService.signupVerify(req.body);
        res.status(201).json(result);
    } catch (err) { next(err); }
}

async function login(req, res, next) {
    try {
        const result = await authService.login(req.body);
        res.status(200).json(result);
    } catch (err) { next(err); }
}

async function refreshToken(req, res, next) {
    try {
        const result = await authService.refreshToken(req.body.refreshToken);
        res.status(200).json(result);
    } catch (err) { next(err); }
}

async function logout(req, res, next) {
    try {
        await authService.logout(req.user);
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
    refreshToken,
    logout,
    forgotPasswordRequest,
    forgotPasswordVerify,
    forgotPasswordReset
};
