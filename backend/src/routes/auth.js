/**
 * ═══════════════════════════════════════════════════════
 * Routes: Auth
 * Topic #12: Express.js routing
 * Topic #18: Аутентифікація та валідація
 * ═══════════════════════════════════════════════════════
 */

import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { registerValidators, loginValidators } from '../middleware/validators.js';

const router = Router();

router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);
router.get('/me', protect, getProfile);

export default router;
