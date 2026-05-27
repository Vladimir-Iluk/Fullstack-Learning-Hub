/**
 * ═══════════════════════════════════════════════════════
 * Sequelize Model: User
 * Topic #16: SQL + Sequelize
 * Topic #18: Аутентифікація (bcrypt password hashing)
 * ═══════════════════════════════════════════════════════
 */

import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('student', 'admin', 'instructor'),
    defaultValue: 'student',
  },
  avatar_url: {
    type: DataTypes.STRING(500),
    defaultValue: null,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'users',
  hooks: {
    // ── Hash password before create (Topic #18) ──
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// ── Instance method: verify password ──
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance method: safe JSON output (no password) ──
User.prototype.toSafeJSON = function () {
  const { password, ...safeUser } = this.toJSON();
  return safeUser;
};

export default User;
