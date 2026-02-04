module.exports = (err, req, res, next) => {
    console.error(err);

    // Joi validation error
    if (err.isJoi) {
        return res.status(400).json({
            message: err.details[0].message,
        });
    }

    // Known application errors
    if (err.message) {
        return res.status(400).json({
            message: err.message,
        });
    }

    return res.status(500).json({
        message: 'Internal server error',
    });
};
