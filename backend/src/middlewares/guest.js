const jwt = require('jsonwebtoken');

function requireGuest(req, res, next) {
    const token = req.cookies.access_token;

    if (!token) {
        return next();
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.status(403).json({
            message: 'Already authenticated'
        });
    } catch {
        return next();
    }
}

module.exports = requireGuest;
