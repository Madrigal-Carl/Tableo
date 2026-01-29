const crypto = require('crypto');
const { sendVerificationEmail } = require('./mail_service');

const verificationStore = new Map();

function generateVerificationCode() {
    return crypto.randomInt(100000, 999999);
}

async function requestVerification({ email, password }) {
    const code = generateVerificationCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    verificationStore.set(email, { code, password, expiresAt });

    await sendVerificationEmail(email, code);

    return { message: 'Verification code sent to email' };
}

function verifyCode({ email, code }) {
    const data = verificationStore.get(email);
    if (!data) return false;
    if (Date.now() > data.expiresAt) {
        verificationStore.delete(email);
        return false;
    }
    if (parseInt(code) !== data.code) return false;

    verificationStore.delete(email);
    return data.password;
}

module.exports = { requestVerification, verifyCode };
