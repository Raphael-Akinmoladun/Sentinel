const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware 1: Verify the user is logged in

const requireAuth = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token (Format: "Bearer eyJhbGciOiJIUz...")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your secret key from the .env file
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user in the database and attach them to the request object
            // .select('-password') ensures we never accidentally expose the hashed password
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user no longer exists' });
            }

            // Move to the next middleware or the controller
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// Middleware 2: Verify the user's role (Buyer vs. Supplier)
const requireRole = (requiredRole) => {
    return (req, res, next) => {
        // req.user is populated by requireAuth, which MUST run before this
        if (req.user && req.user.role === requiredRole) {
            next(); // Role matches, proceed to the controller
        } else {
            res.status(403).json({ 
                message: `Access denied. This action requires the '${requiredRole}' role.` 
            });
        }
    };
};

module.exports = { requireAuth, requireRole };