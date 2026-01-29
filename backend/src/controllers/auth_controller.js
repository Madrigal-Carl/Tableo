const authService = require('../services/auth_service');

async function signup(req, res, next) {
    try {
        const { email, password } = req.body;
        const result = await authService.signup({ email, password });

        res.status(201).json({
            message: 'Signup successful. Verification code sent to email.',
            user: {
                id: result.user.id,
                email: result.user.email,
            },
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { signup };
