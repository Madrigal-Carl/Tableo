const crypto = require('crypto');
const { sendVerificationEmail } = require('./mail_service');

const verificationStore = new Map();

function generateVerificationCode() {
    return crypto.randomInt(100000, 999999);
}

async function requestVerification({ email, password }) {
    const code = generateVerificationCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; 

    verificationStore.set(email, { code, password: password || null, expiresAt });

    await sendVerificationEmail(email, code);
}

function verifyCode({ email, code }) {
    const data = verificationStore.get(email);
    if (!data) return null;

    if (Date.now() > data.expiresAt) {
        verificationStore.delete(email);
        return null;
    }

    if (parseInt(code) !== data.code) return null;

    verificationStore.delete(email);

    return data.password || true;
}

module.exports = { requestVerification, verifyCode };
