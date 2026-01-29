const authService = require('../services/auth_service');
const { requestVerification, verifyCode } = require('../services/email_verification_service');
const userRepository = require('../repositories/user_repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function signupRequest(req, res, next) {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword)
        return res.status(400).json({ message: 'Passwords do not match' });

    const exists = await userRepository.findByEmail(email);
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    await requestVerification({ email, password });

    res.json({ message: 'Verification code sent' });
}


async function signupVerify(req, res, next) {
    const { email, code, rememberMe } = req.body;

    const password = verifyCode({ email, code });
    if (!password)
        return res.status(400).json({ message: 'Invalid or expired code' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ email, password: hashedPassword });

    const payload = { id: user.id, email: user.email };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });

    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: rememberMe ? '30d' : '7d',
        }
    );

    res.status(201).json({
        message: 'Signup successful',
        accessToken,
        refreshToken,
    });
}


module.exports = { signupRequest, signupVerify };
