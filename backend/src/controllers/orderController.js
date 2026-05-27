/**
 * ═══════════════════════════════════════════════════════
 * Controller: Orders & Payments (MVC)
 * Topic #14: Паттерни проектування (MVC)
 * Topic #16: SQL + Sequelize (transactions)
 * Topic #20: Підключення платіжних систем (Stripe)
 * ═══════════════════════════════════════════════════════
 */

import Stripe from 'stripe';
import sequelize from '../config/database.js';
import { Order, Transaction, User, Course, ActivityLog } from '../models/index.js';
import { ApiError } from '../middleware/errorHandler.js';

// ── Stripe initialization (Topic #20) ──
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_mock', {
  apiVersion: '2023-10-16',
});

/**
 * POST /api/orders
 * Create a new order and initiate Stripe payment session
 */
export const createOrder = async (req, res, next) => {
  // ── Sequelize Transaction for ACID compliance (Topic #16) ──
  const t = await sequelize.transaction();

  try {
    const { course_ids } = req.body;
    const userId = req.user.id;

    // Fetch courses from MongoDB to calculate total
    const courses = await Course.find({ _id: { $in: course_ids } });

    if (courses.length === 0) {
      throw new ApiError(404, 'Жодного курсу не знайдено');
    }

    // Calculate total amount
    const totalAmount = courses.reduce((sum, course) => sum + course.price, 0);

    // ── Create Order in PostgreSQL ──
    const order = await Order.create({
      user_id: userId,
      course_ids,
      total_amount: totalAmount,
      currency: 'UAH',
      status: 'pending',
    }, { transaction: t });

    // ── Create Stripe Checkout Session (Topic #20) ──
    let stripeSession = null;
    try {
      stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: courses.map((course) => ({
          price_data: {
            currency: 'uah',
            product_data: {
              name: course.title,
              description: course.short_description ?? course.description?.slice(0, 200),
            },
            unit_amount: Math.round(course.price * 100), // Stripe expects cents
          },
          quantity: 1,
        })),
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cart`,
        metadata: {
          order_id: order.id,
          user_id: userId,
        },
      });

      // Update order with Stripe session ID
      await order.update({
        stripe_session_id: stripeSession.id,
      }, { transaction: t });

    } catch (stripeError) {
      // If Stripe fails, create a mock payment for demo purposes
      console.warn('⚠️ Stripe unavailable, using mock payment:', stripeError.message);
      stripeSession = {
        id: `mock_session_${Date.now()}`,
        url: `${process.env.FRONTEND_URL}/checkout/success?session_id=mock_${order.id}`,
      };
      await order.update({
        stripe_session_id: stripeSession.id,
      }, { transaction: t });
    }

    // ── Create Transaction record ──
    await Transaction.create({
      order_id: order.id,
      user_id: userId,
      amount: totalAmount,
      currency: 'UAH',
      status: 'pending',
      stripe_payment_intent_id: stripeSession.id,
    }, { transaction: t });

    await t.commit();

    // Log activity
    await ActivityLog.create({
      user_id: userId,
      action: 'course_purchase',
      details: {
        orderId: order.id,
        courseIds: course_ids,
        totalAmount,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Замовлення створено',
      data: {
        order: order.toJSON(),
        checkoutUrl: stripeSession.url ?? stripeSession.id,
        sessionId: stripeSession.id,
      },
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * POST /api/orders/confirm
 * Confirm payment (webhook callback simulation)
 */
export const confirmPayment = async (req, res, next) => {
  try {
    const { session_id } = req.body;

    const order = await Order.findOne({
      where: { stripe_session_id: session_id },
    });

    if (!order) {
      throw new ApiError(404, 'Замовлення не знайдено');
    }

    // Update order status
    await order.update({ status: 'paid' });

    // Update transaction status
    await Transaction.update(
      { status: 'succeeded' },
      { where: { order_id: order.id } }
    );

    // Increment student count on courses
    await Course.updateMany(
      { _id: { $in: order.course_ids } },
      { $inc: { students_count: 1 } }
    );

    res.json({
      success: true,
      message: 'Оплата підтверджена!',
      data: { order: order.toJSON() },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/my
 * Get all orders for the authenticated user
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ association: 'transactions' }],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};
