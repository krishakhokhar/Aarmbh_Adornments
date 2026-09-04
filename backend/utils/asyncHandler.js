// Wraps an async route handler so rejected promises reach the central error
// handler instead of leaving the request hanging with no response.
module.exports = function asyncHandler(fn) {
    return function wrapped(req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
