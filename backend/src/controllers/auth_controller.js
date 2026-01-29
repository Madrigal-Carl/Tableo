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

//forget password
async function forgotPasswordRequest(req, res, next) {
    try {
        const { email } = req.body;

        const user = await userRepository.findByEmail(email);
        if (!user) return res.status(400).json({ message: 'Email not found' });

        await requestVerification({ email });

        res.json({ message: 'Password reset code sent to your email' });
    } catch (err) {
        next(err);
    }
}

async function forgotPasswordVerify(req, res, next) {
    try {
        const { email, code } = req.body;

        const validCode = verifyCode({ email, code });
        if (!validCode) return res.status(400).json({ message: 'Invalid or expired code' });

        res.json({ message: 'Code verified, you can now reset your password' });
    } catch (err) {
        next(err);
    }
}

async function forgotPasswordReset(req, res, next) {
    try {
        const { email, password, confirmPassword } = req.body;

        if (password !== confirmPassword)
            return res.status(400).json({ message: 'Passwords do not match' });

        const user = await userRepository.findByEmail(email);
        if (!user) return res.status(400).json({ message: 'Email not found' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await userRepository.updatePassword(user.id, hashedPassword);

        res.json({ message: 'Password has been reset successfully' });
    } catch (err) {
        next(err);
    }
}

module.exports = {signupRequest,signupVerify,login,forgotPasswordRequest,forgotPasswordVerify,forgotPasswordReset,};
