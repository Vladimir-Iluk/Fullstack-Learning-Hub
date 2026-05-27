/**
 * ═══════════════════════════════════════════════════════
 * Sequelize Model: Order
 * Topic #16: SQL + Sequelize (One-to-Many relationships)
 * ═══════════════════════════════════════════════════════
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  course_ids: {
    // Store MongoDB course ObjectId references as JSON array
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'UAH',
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  payment_method: {
    type: DataTypes.STRING(50),
    defaultValue: 'stripe',
  },
  stripe_session_id: {
    type: DataTypes.STRING(255),
    defaultValue: null,
  },
}, {
  tableName: 'orders',
});

export default Order;
