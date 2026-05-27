/**
 * ═══════════════════════════════════════════════════════
 * Express Validators (express-validator)
 * Topic #18: Аутентифікація та валідація в Node.js
 * ═══════════════════════════════════════════════════════
 */

import { body, param, query, validationResult } from 'express-validator';
import { ApiError } from './errorHandler.js';

/**
 * Middleware: Run validation and return errors if any
 */
export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(({ path, msg }) => ({
      field: path,
      message: msg,
    }));
    throw new ApiError(400, 'Помилка валідації вхідних даних', formattedErrors);
  }
  next();
};

// ═══════════════════════════════════════════════════════
// Registration Validators
// ═══════════════════════════════════════════════════════
export const registerValidators = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Ім\'я користувача має бути від 3 до 50 символів')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Ім\'я може містити лише літери, цифри та _'),

  body('email')
    .isEmail()
    .withMessage('Невалідна адреса електронної пошти')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль має бути не менше 6 символів')
    .matches(/\d/)
    .withMessage('Пароль має містити хоча б одну цифру'),

  validate,
];

// ═══════════════════════════════════════════════════════
// Login Validators
// ═══════════════════════════════════════════════════════
export const loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Невалідна адреса електронної пошти')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Пароль обов\'язковий'),

  validate,
];

// ═══════════════════════════════════════════════════════
// Course Query Validators (for pagination — Topic #19)
// ═══════════════════════════════════════════════════════
export const courseQueryValidators = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Номер сторінки повинен бути цілим числом ≥ 1')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Ліміт повинен бути від 1 до 50')
    .toInt(),

  query('category')
    .optional()
    .isIn(['frontend', 'backend', 'fullstack', 'devops', 'mobile', 'data-science', 'design'])
    .withMessage('Невалідна категорія'),

  query('sort')
    .optional()
    .isIn(['price_asc', 'price_desc', 'newest', 'popular', 'rating'])
    .withMessage('Невалідний параметр сортування'),

  validate,
];

// ═══════════════════════════════════════════════════════
// Order Validators
// ═══════════════════════════════════════════════════════
export const orderValidators = [
  body('course_ids')
    .isArray({ min: 1 })
    .withMessage('Потрібен хоча б один курс для замовлення'),

  body('course_ids.*')
    .isString()
    .withMessage('ID курсу має бути рядком'),

  validate,
];

// ═══════════════════════════════════════════════════════
// Param Validators
// ═══════════════════════════════════════════════════════
export const mongoIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Невалідний ідентифікатор MongoDB'),
  validate,
];
