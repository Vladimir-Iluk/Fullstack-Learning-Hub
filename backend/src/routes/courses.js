/**
 * ═══════════════════════════════════════════════════════
 * Routes: Courses
 * Topic #12: Express.js routing
 * Topic #19: Пагінація
 * ═══════════════════════════════════════════════════════
 */

import { Router } from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  getCategoryStats,
} from '../controllers/courseController.js';
import { protect, restrictTo, optionalAuth } from '../middleware/authMiddleware.js';
import { courseQueryValidators, mongoIdValidator } from '../middleware/validators.js';

const router = Router();

// Public routes
router.get('/', courseQueryValidators, getCourses);
router.get('/categories/stats', getCategoryStats);
router.get('/:id', optionalAuth, mongoIdValidator, getCourseById);

// Admin-only routes
router.post('/', protect, restrictTo('admin', 'instructor'), createCourse);

export default router;
