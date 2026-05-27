/**
 * ═══════════════════════════════════════════════════════
 * Models Index — Sequelize Associations
 * Topic #16: SQL + Sequelize (relationships)
 * Topic #14: Паттерни проектування (MVC — Model Layer)
 * ═══════════════════════════════════════════════════════
 */

import User from './User.js';
import Order from './Order.js';
import Transaction from './Transaction.js';

// ── Sequelize Associations (One-to-Many) ──

// User has many Orders
User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders',
  onDelete: 'CASCADE',
});
Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Order has many Transactions
Order.hasMany(Transaction, {
  foreignKey: 'order_id',
  as: 'transactions',
  onDelete: 'CASCADE',
});
Transaction.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});

// User has many Transactions
User.hasMany(Transaction, {
  foreignKey: 'user_id',
  as: 'transactions',
  onDelete: 'CASCADE',
});
Transaction.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// ── Re-export all models ──
export { User, Order, Transaction };

// ── Mongoose models (imported separately) ──
export { default as Course } from './Course.js';
export { default as ActivityLog } from './ActivityLog.js';
export { default as ChatMessage } from './ChatMessage.js';
