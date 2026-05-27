/**
 * ═══════════════════════════════════════════════════════
 * Sequelize Model: Transaction
 * Topic #16: SQL + Sequelize (Financial transactions)
 * Topic #20: Підключення платіжних систем
 * ═══════════════════════════════════════════════════════
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'UAH',
  },
  status: {
    type: DataTypes.ENUM('pending', 'succeeded', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  stripe_payment_intent_id: {
    type: DataTypes.STRING(255),
    defaultValue: null,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'transactions',
});

export default Transaction;
