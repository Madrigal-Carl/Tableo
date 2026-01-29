const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user_repository');
const crypto = require('crypto'); // for verification code



function generateVerificationCode() {
    return crypto.randomInt(100000, 999999); // 6-digit code
}

async function signup({ email, password }) {
    // Check if user exists
    const exists = await userRepository.findByEmail(email);
    if (exists) throw new Error('User already exists');

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Send email
    await sendVerificationEmail(email, verificationCode);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with rememberToken as verification code
    const user = await userRepository.create({
        email,
        password: hashedPassword,
        rememberToken: '',
    });

    // Automatically log in user after signup
    const payload = { id: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    });

    return { user, accessToken, refreshToken, verificationCode };
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

module.exports = { signup };
