/**
 * ═══════════════════════════════════════════════════════
 * Express Error Handling Middleware
 * Topic #7: Робота з помилками — Express error middleware
 * ═══════════════════════════════════════════════════════
 */

/**
 * Custom API Error class with status code
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, _res, next) => {
  const error = new ApiError(404, `Маршрут не знайдено: ${req.method} ${req.originalUrl}`);
  next(error);
};

/**
 * Global error handling middleware
 * Must have 4 parameters for Express to recognize it as error handler
 */
// eslint-disable-next-line no-unused-vars
export const globalErrorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? 'Внутрішня помилка сервера';

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('═══ ERROR ═══');
    console.error(`Status: ${statusCode}`);
    console.error(`Message: ${message}`);
    if (err.details) console.error('Details:', err.details);
    console.error('Stack:', err.stack);
    console.error('═════════════');
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors?.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      error: 'Помилка валідації даних',
      details: errors,
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors?.[0]?.path ?? 'unknown';
    return res.status(409).json({
      success: false,
      error: `Значення поля "${field}" вже існує в базі даних`,
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      error: 'Помилка валідації MongoDB',
      details: errors,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Невалідний токен авторизації',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Токен авторизації прострочений',
    });
  }

  // Default error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details,
    }),
  });
};
