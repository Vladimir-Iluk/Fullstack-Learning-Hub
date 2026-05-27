/**
 * ═══════════════════════════════════════════════════════
 * Topic #16: Робота з SQL — Sequelize (PostgreSQL)
 * ═══════════════════════════════════════════════════════
 * Конфігурація Sequelize ORM для підключення до PostgreSQL.
 * Використовується для зберігання Users, Orders, Transactions.
 * ═══════════════════════════════════════════════════════
 */

import { Sequelize } from 'sequelize';

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_NAME = 'lms_db',
  DB_USER = 'lms_user',
  DB_PASSWORD = 'lms_password',
} = process.env;

// ── Create Sequelize instance ──
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

/**
 * Connect to PostgreSQL and sync models
 */
export const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('🐘 PostgreSQL connection established');

    // Sync models (use { alter: true } in dev for schema changes)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('🔄 Sequelize models synced (alter mode)');
    } else {
      await sequelize.sync();
    }
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    throw error;
  }
};

export default sequelize;
