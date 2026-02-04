const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user_repository');
const { requestVerification, verifyCode, hasActiveVerification } = require('./email_verification_service');
const { getCookieOptions } = require('../utils/auth_cookies');

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });
}

function setAuthCookies(res, payload, rememberMe) {
    const accessToken = generateAccessToken(payload);

    res.cookie(
        'access_token',
        accessToken,
        getCookieOptions(Number(process.env.JWT_COOKIE_MAX_AGE))
    );

    if (rememberMe) {
        const refreshToken = generateRefreshToken(payload);
        res.cookie(
            'refresh_token',
            refreshToken,
            getCookieOptions(Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE))
        );
    }
}

async function signupRequest({ email, password }) {
    const exists = await userRepository.findByEmail(email);
    if (exists) throw new Error('Email already registered');

    await requestVerification({ email, password });
    return { message: 'Verification code sent' };
}

async function signupVerify({ email, code }, res) {
    const password = verifyCode({ email, code });
    if (!password) throw new Error('Invalid or expired code');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
        email,
        password: hashedPassword,
    });

    const payload = { id: user.id, email: user.email };
    setAuthCookies(res, payload);

    return { message: 'Signup successful', user };
}

async function signupResend({ email }) {
    const data = hasActiveVerification(email);

    if (!data || !data.password) {
        throw new Error('Signup session expired. Please register again.');
    }

    await requestVerification({
        email,
        password: data.password,
    });

    return { message: 'Verification code resent' };
}

async function login({ email, password }) {

    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const payload = { id: user.id, email: user.email };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    });

    return {
        user,
        accessToken,
        refreshToken,
    };
}

async function login({ email, password, rememberMe }, res) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    if (rememberMe !== undefined) {
        await user.update({ rememberMe });
    }

    const payload = { id: user.id, email: user.email };
    setAuthCookies(res, payload, rememberMe);

    return { message: 'Login successful', user };
}

async function logout(res) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
}

async function forgotPasswordRequest({ email }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Email not found');
    await requestVerification({ email });
}

async function forgotPasswordVerify({ email, code }) {
    const validCode = verifyCode({ email, code });
    if (!validCode) throw new Error('Invalid or expired code');
}

async function forgotPasswordReset({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Email not found');
    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepository.updatePassword(user.id, hashedPassword);
}

module.exports = {
    signupRequest,
    signupVerify,
    signupResend,
    login,
    logout,
    forgotPasswordRequest,
    forgotPasswordVerify,
    forgotPasswordReset,
};
