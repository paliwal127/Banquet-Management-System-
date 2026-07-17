const logger = require("../utils/logger");

const errorMiddleware = (err, req, res, _next) => {
  logger.error("Unhandled application error", {
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    path: req.originalUrl,
    method: req.method
  });

  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message
  });
};

module.exports = errorMiddleware;