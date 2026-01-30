const jwt = require('jsonwebtoken');
const { blacklistedTokens } = require('../services/auth_service');

function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Missing token' });

    const token = header.split(' ')[1];
    if (blacklistedTokens.has(token)) {
        return res.status(401).json({ message: 'Token has been invalidated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = authMiddleware;
