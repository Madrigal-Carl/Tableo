const authService = require('../services/auth_service');
const { requestVerification, verifyCode } = require('../services/email_verification_service');
const userRepository = require('../repositories/user_repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function signupRequest(req, res, next) {
    try {
        const { email, password, confirmPassword } = req.body;

        if (password !== confirmPassword)
            return res.status(400).json({ message: 'Passwords do not match' });

        const exists = await userRepository.findByEmail(email);
        if (exists) return res.status(400).json({ message: 'Email already registered' });

        await requestVerification({ email, password });

        res.json({ message: 'Verification code sent to your email' });
    } catch (err) {
        next(err);
    }
}

async function signupVerify(req, res, next) {
    try {
        const { email, code } = req.body;

        const password = verifyCode({ email, code });
        if (!password) return res.status(400).json({ message: 'Invalid verification code' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userRepository.create({ email, password: hashedPassword });

        // Generate JWT tokens
        const payload = { id: user.id, email: user.email };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'Signup successful',
            user: { id: user.id, email: user.email },
            accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await userRepository.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const payload = { id: user.id, email: user.email };

        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET,
            {  expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
            },
            accessToken,
            refreshToken
        });

    } catch (err) {
        next(err);
    }
}

module.exports = { signupRequest, signupVerify, login };
