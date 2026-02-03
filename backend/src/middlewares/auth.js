const jwt = require('jsonwebtoken');
const { getCookieOptions } = require('../utils/auth_cookies');

function authMiddleware(req, res, next) {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
        return res.status(401).json({ message: 'Unauthenticated' });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        // Try refresh token
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Session expired' });
        }

        try {
            const payload = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );

            const newAccessToken = jwt.sign(
                { id: payload.id, email: payload.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.cookie(
                'access_token',
                newAccessToken,
                getCookieOptions(Number(process.env.JWT_COOKIE_MAX_AGE))
            );

            req.user = payload;
            next();
        } catch {
            return res.status(401).json({ message: 'Session expired' });
        }
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET,  
            { expiresIn: "1h" }            
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}
module.exports = authMiddleware;
