const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user_repository');
const crypto = require('crypto'); // for verification code

async function signup({ email, password }) {
    // Check if user exists
    const exists = await userRepository.findByEmail(email);
    if (exists) throw new Error('User already exists');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification code (6 digits)
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Create user with rememberToken as verification code
    const user = await userRepository.create({
        email,
        password: hashedPassword,
        rememberToken: verificationCode,
    });

    // Here you would send email with verificationCode
    console.log(`Send verification code ${verificationCode} to ${email}`);

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

module.exports = { signup };
