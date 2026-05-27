/**
 * ═══════════════════════════════════════════════════════
 * Controller: Auth (MVC — Controller Layer)
 * Topic #14: Паттерни проектування (MVC)
 * Topic #18: Аутентифікація та валідація
 * ═══════════════════════════════════════════════════════
 */

import { User, ActivityLog } from '../models/index.js';
import { generateToken } from '../middleware/authMiddleware.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * POST /api/auth/register
 * Register a new user
 */
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError(409, 'Користувач з такою поштою вже зареєстрований');
    }

    // Create new user
    const user = await User.create({ username, email, password });

    // Generate JWT token
    const token = generateToken(user);

    // Log activity (Topic #17: MongoDB logging)
    await ActivityLog.create({
      user_id: user.id,
      action: 'login',
      details: { method: 'register' },
      ip_address: req.ip,
      user_agent: req.get('user-agent'),
    });

    res.status(201).json({
      success: true,
      message: 'Реєстрація успішна!',
      data: {
        user: user.toSafeJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ApiError(401, 'Невірна електронна пошта або пароль');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Невірна електронна пошта або пароль');
    }

    // Check if account is active
    if (!user.is_active) {
      throw new ApiError(403, 'Акаунт деактивовано. Зверніться до підтримки.');
    }

    // Generate JWT token
    const token = generateToken(user);

    // Log activity
    await ActivityLog.create({
      user_id: user.id,
      action: 'login',
      details: { method: 'credentials' },
      ip_address: req.ip,
      user_agent: req.get('user-agent'),
    });

    res.json({
      success: true,
      message: 'Вхід успішний!',
      data: {
        user: user.toSafeJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ association: 'orders' }],
    });

    if (!user) {
      throw new ApiError(404, 'Користувача не знайдено');
    }

    res.json({
      success: true,
      data: { user: user.toSafeJSON() },
    });
  } catch (error) {
    next(error);
  }
};
