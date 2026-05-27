/**
 * Routes: Chat
 * Topic #12: Express.js | Topic #21: Socket.io
 */
import { Router } from 'express';
import { getChatHistory, saveMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/history/:roomId', protect, getChatHistory);
router.post('/message', protect, saveMessage);

export default router;
