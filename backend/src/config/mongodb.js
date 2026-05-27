/**
 * ═══════════════════════════════════════════════════════
 * Topic #17: Робота з NoSQL — MongoDB + Mongoose
 * ═══════════════════════════════════════════════════════
 * Конфігурація Mongoose ODM для підключення до MongoDB.
 * Використовується для зберігання Courses, ActivityLogs,
 * ChatMessages.
 * ═══════════════════════════════════════════════════════
 */

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/lms_mongo';

/**
 * Connect to MongoDB via Mongoose
 */
export const connectMongoDB = async () => {
  try {
    mongoose.set('strictQuery', false);

    await mongoose.connect(MONGO_URI, {
      // Mongoose 6+ handles these automatically, but explicit for clarity
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('🍃 MongoDB connection established');

    // Connection event listeners (Topic #11: Node.js event-driven)
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB runtime error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

export default mongoose;
