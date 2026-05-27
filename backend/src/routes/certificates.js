/**
 * Routes: Certificates
 * Topic #8: Deno microservice proxy
 */
import { Router } from 'express';
import { generateCertificate } from '../controllers/certificateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/generate', protect, generateCertificate);

export default router;
