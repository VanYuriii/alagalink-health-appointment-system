const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT (JSON Web Token) authentication.
 * 
 * This middleware extracts the JWT from the Authorization header,
 * verifies its validity using the JWT_SECRET, and attaches the
 * decoded user information to the request object for use in
 * subsequent middleware or route handlers.
 * 
 * @function verifyToken
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.authorization - Authorization header in format "Bearer <token>"
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void|Object} Calls next() on success, or returns JSON error response
 * 
 * @throws {401} When no token is provided in the Authorization header
 * @throws {401} When the token is invalid or expired
 * 
 * @requires jsonwebtoken - JWT verification library
 * @requires process.env.JWT_SECRET - Secret key for token verification (from environment variables)
 * 
 * @example
 * // In your routes file
 * const verifyToken = require('./middleware/verifyToken');
 * 
 * // Protect a route
 * app.get('/api/protected', verifyToken, (req, res) => {
 *   // Access decoded user data
 *   console.log(req.user); // { id: '123', email: 'user@example.com', ... }
 *   res.json({ message: 'Access granted' });
 * });
 * 
 * @example
 * // Client-side usage (fetch with token)
 * fetch('/api/protected', {
 *   headers: {
 *     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *   }
 * });
 * 
 * @sideEffect Attaches decoded token payload to req.user
 * 
 * @see {@link https://www.npmjs.com/package/jsonwebtoken|jsonwebtoken Documentation}
 */

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(401).json({ message: 'Token is invalid' });
    }
};

module.exports = verifyToken;