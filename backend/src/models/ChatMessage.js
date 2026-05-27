/**
 * ═══════════════════════════════════════════════════════
 * Mongoose Model: ChatMessage
 * Topic #17: NoSQL + MongoDB
 * Topic #21: WebSockets & Socket.io (message persistence)
 * ═══════════════════════════════════════════════════════
 */

import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  room_id: {
    type: String,
    required: true,
    index: true,
  },
  sender_id: {
    type: String, // PostgreSQL user UUID
    required: true,
  },
  sender_name: {
    type: String,
    required: true,
  },
  sender_role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  collection: 'chat_messages',
});

// ── Index for querying chat history by room ──
chatMessageSchema.index({ room_id: 1, createdAt: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
