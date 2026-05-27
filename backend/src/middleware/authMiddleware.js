/**
 * ═══════════════════════════════════════════════════════
 * JWT Authentication Middleware
 * Topic #18: Аутентифікація та валідація в Node.js
 * ═══════════════════════════════════════════════════════
 */

import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { ApiError } from './errorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'supersecretjwtkey_lms_2024';

/**
 * Generate JWT token for a user
 */
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  });
};

/**
 * Middleware: Protect routes — require valid JWT
 */
export const protect = async (req, _res, next) => {
  try {
    let token = null;

    // ── Extract token from Authorization header ──
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Для доступу потрібна авторизація. Надайте JWT токен.');
    }

    // ── Verify token ──
    const decoded = jwt.verify(token, JWT_SECRET);

    // ── Find user in database ──
    const user = await User.findByPk(decoded.id);

    if (!user || !user.is_active) {
      throw new ApiError(401, 'Користувача не знайдено або акаунт деактивовано.');
    }

    // ── Attach user to request ──
    req.user = user.toSafeJSON();
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(new ApiError(401, 'Невалідний або прострочений токен'));
  }
};

/**
 * Middleware: Restrict access to specific roles
 */
export const restrictTo = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new ApiError(403, `Доступ заборонено. Потрібна роль: ${roles.join(' або ')}`)
      );
    }
    next();
  };
};

/**
 * Middleware: Optional auth — attach user if token exists, but don't block
 */
export const optionalAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (user?.is_active) {
        req.user = user.toSafeJSON();
      }
    }
  } catch {
    // Silently ignore — user remains unauthenticated
  }
  next();
};
