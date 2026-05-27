/**
 * Routes: Orders & Payments
 * Topic #12: Express.js | Topic #20: Stripe
 */
import { Router } from 'express';
import { createOrder, confirmPayment, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { orderValidators } from '../middleware/validators.js';

const router = Router();

router.post('/', protect, orderValidators, createOrder);
router.post('/confirm', protect, confirmPayment);
router.get('/my', protect, getMyOrders);

export default router;
