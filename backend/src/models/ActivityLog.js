/**
 * ═══════════════════════════════════════════════════════
 * Mongoose Model: ActivityLog
 * Topic #17: NoSQL + MongoDB + Mongoose
 * ═══════════════════════════════════════════════════════
 * Логування дій студентів у системі.
 * ═══════════════════════════════════════════════════════
 */

import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user_id: {
    type: String, // References PostgreSQL UUID
    required: true,
    index: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'course_view',
      'course_purchase',
      'lecture_start',
      'lecture_complete',
      'quiz_attempt',
      'quiz_complete',
      'certificate_generated',
      'chat_message',
      'profile_update',
    ],
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ip_address: {
    type: String,
    default: null,
  },
  user_agent: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
  collection: 'activity_logs',
});

// ── TTL Index: auto-delete logs older than 90 days ──
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
