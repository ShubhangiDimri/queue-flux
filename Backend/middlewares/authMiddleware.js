const jwt = require('jsonwebtoken');

// ---- Protect Routes — Verify JWT Token ----
const protect = (req, res, next) => {
    try {
        // 1. Read the Authorization header
        const authHeader = req.headers.authorization;

        // 2. Check if header exists and starts with "Bearer"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized — no token provided'
            });
        }

        // 3. Extract the token (remove "Bearer " prefix)
        const token = authHeader.split(' ')[1];

        // 4. Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Attach decoded user info to the request object
        //    Now any route handler can access req.user.userId and req.user.role
        req.user = decoded;

        // 6. Move to the next middleware / route handler
        next();

    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Not authorized — invalid or expired token'
        });
    }
};

module.exports = { protect };
