exports.notFound = (req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Centralized error handler - guarantees every request gets a JSON response
// instead of hanging, even when MongoDB is unreachable or a query fails.
exports.errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error(err);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: err.message });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    if (err.code === 11000) {
        return res.status(409).json({ success: false, message: 'Duplicate value not allowed' });
    }
    if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoNetworkError') {
        return res.status(503).json({ success: false, message: 'Database unavailable, please try again later' });
    }

    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message || 'Internal server error' });
};
