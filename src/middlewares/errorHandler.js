import config from "../config/config.js";
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID";
    }
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {})[0];
        message = field
            ? `${field} already exists`
            : "Duplicate value";
    }
        if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((error) => error.message)
            .join(", ");
    }
    if (config.NODE_ENV === "development") {
        console.error(err);
    }
    const response = {
        success: false,
        message
    };
    if (config.NODE_ENV === "development") {
        response.stack = err.stack;
    }
    res.status(statusCode).json(response);
};
export default errorHandler;
