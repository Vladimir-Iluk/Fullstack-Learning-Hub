/**
 * ═══════════════════════════════════════════════════════
 * Controller: Chat (MVC)
 * Topic #21: WebSockets & Socket.io
 * Topic #17: MongoDB (ChatMessage persistence)
 * ═══════════════════════════════════════════════════════
 */

import { ChatMessage } from '../models/index.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * GET /api/chat/history/:roomId
 * Get chat message history for a specific room
 */
export const getChatHistory = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const messages = await ChatMessage.find({ room_id: roomId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await ChatMessage.countDocuments({ room_id: roomId });

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalCount / Number(limit)),
          totalCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/chat/message
 * Save a chat message to MongoDB
 */
export const saveMessage = async (req, res, next) => {
  try {
    const { room_id, message } = req.body;

    if (!room_id || !message) {
      throw new ApiError(400, 'room_id та message обов\'язкові');
    }

    const chatMessage = await ChatMessage.create({
      room_id,
      sender_id: req.user.id,
      sender_name: req.user.username,
      sender_role: req.user.role === 'admin' ? 'admin' : 'student',
      message,
    });

    res.status(201).json({
      success: true,
      data: { message: chatMessage },
    });
  } catch (error) {
    next(error);
  }
};
