function getCookieOptions(maxAge) {
    return {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge,
    };
}

module.exports = { getCookieOptions };
