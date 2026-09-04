const { isConnected } = require('../config/db');

// Short-circuits with an instant, clear error when MongoDB isn't connected,
// instead of letting the request sit in mongoose's query buffer until it
// times out. This is what actually prevents the frontend loader from
// hanging when the database is unreachable or unconfigured.
module.exports = function requireDb(req, res, next) {
    if (!isConnected()) {
        return res.status(503).json({
            success: false,
            message: 'Database is not connected. Please check the server configuration and try again shortly.',
        });
    }
    next();
};
