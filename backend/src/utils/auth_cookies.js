function getCookieOptions(maxAge) {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
    };
}

module.exports = { getCookieOptions };
