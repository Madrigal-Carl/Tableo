const jwt = require('jsonwebtoken');
const { getCookieOptions } = require('../utils/auth_cookies');

function requireAuth(req, res, next) {
    const accessToken = req.cookies.access_token;

    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (err) {
            // expired token, continue to refresh
        }
    }

    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.status(401).json({ message: 'Session expired' });

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // generate new access token
        const newAccessToken = jwt.sign(
            { id: payload.id, email: payload.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.cookie('access_token', newAccessToken, getCookieOptions(Number(process.env.JWT_COOKIE_MAX_AGE)));

        req.user = payload; // payload from refresh token
        req.newAccessToken = newAccessToken; // optional if you want to send it back in response
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Session expired' });
    }
}


module.exports = requireAuth;
