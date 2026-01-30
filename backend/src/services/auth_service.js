const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user_repository');
const { requestVerification, verifyCode } = require('./email_verification_service');

const blacklistedTokens = new Set();
const activeSessions = new Map();

function generateTokens(payload, rememberMe = false) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: rememberMe ? '30d' : '7d',
    });
    return { accessToken, refreshToken };
}

async function signupRequest({ email, password }) {
    const exists = await userRepository.findByEmail(email);
    if (exists) throw new Error('Email already registered');

    await requestVerification({ email, password });
    return { message: 'Verification code sent' };
}

async function signupVerify({ email, code, rememberMe }) {
    const password = verifyCode({ email, code });
    if (!password) throw new Error('Invalid or expired code');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ email, password: hashedPassword });

    const payload = { id: user.id, email: user.email };
    const tokens = generateTokens(payload, rememberMe);

    activeSessions.set(user.id, tokens.accessToken);

    return { message: 'Signup successful', user, ...tokens };
}

async function login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    if (activeSessions.has(user.id)) {
        throw new Error('This account is already logged in from another device/session');
    }

    const payload = { id: user.id, email: user.email };
    const tokens = generateTokens(payload);

    activeSessions.set(user.id, tokens.accessToken);

    return { message: 'Login successful', user, ...tokens };
}

async function refreshToken(oldToken) {
    if (!oldToken) throw new Error('Refresh token missing');
    if (blacklistedTokens.has(oldToken)) throw new Error('Token invalidated');

    let payload;
    try { payload = jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET); }
    catch { throw new Error('Invalid or expired refresh token'); }

    blacklistedTokens.add(oldToken);

    const newTokens = generateTokens({ id: payload.id, email: payload.email });
    activeSessions.set(payload.id, newTokens.accessToken);

    return newTokens;
}

async function logout(user) {
    if (user && activeSessions.has(user.id)) {
        activeSessions.delete(user.id);
    }
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
    login,
    refreshToken,
    logout,
    forgotPasswordRequest,
    forgotPasswordVerify,
    forgotPasswordReset,
    blacklistedTokens
};
