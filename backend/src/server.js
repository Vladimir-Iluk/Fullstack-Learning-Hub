/**
 * ═══════════════════════════════════════════════════════
 * LMS Backend — HTTP & WebSocket Server
 * ═══════════════════════════════════════════════════════
 * Topic #11: Основи Node.js
 * Topic #21: WebSockets & Socket.io
 * ═══════════════════════════════════════════════════════
 */

import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// ── Load environment variables ──
dotenv.config();

import app from './app.js';
import { connectPostgres } from './config/database.js';
import { connectMongoDB } from './config/mongodb.js';

const PORT = process.env.PORT ?? 5000;

// ── Create HTTP server (Topic #11: Node.js core modules) ──
const httpServer = createServer(app);

// ═══════════════════════════════════════════════════════
// Topic #21: Socket.io — Real-time Support Chat
// ═══════════════════════════════════════════════════════
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ── Chat namespace for support ──
const chatNamespace = io.of('/support');

chatNamespace.on('connection', (socket) => {
  console.log(`🟢 User connected to support: ${socket.id}`);

  // Join a room based on user ID
  socket.on('join_room', ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`📌 ${username} joined room: ${roomId}`);
    socket.to(roomId).emit('user_joined', {
      message: `${username} приєднався до чату`,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle incoming messages
  socket.on('send_message', ({ roomId, message, sender, senderRole }) => {
    const payload = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      message,
      sender,
      senderRole,
      timestamp: new Date().toISOString(),
    };

    chatNamespace.to(roomId).emit('receive_message', payload);
    console.log(`💬 [${roomId}] ${sender}: ${message}`);
  });

  // Typing indicator
  socket.on('typing', ({ roomId, username }) => {
    socket.to(roomId).emit('user_typing', { username });
  });

  socket.on('stop_typing', ({ roomId }) => {
    socket.to(roomId).emit('user_stop_typing');
  });

  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// ═══════════════════════════════════════════════════════
// Database Connections & Server Start
// ═══════════════════════════════════════════════════════
const startServer = async () => {
  try {
    // ── Connect PostgreSQL (Sequelize) ──
    await connectPostgres();
    console.log('✅ PostgreSQL connected via Sequelize');

    // ── Connect MongoDB (Mongoose) ──
    await connectMongoDB();
    console.log('✅ MongoDB connected via Mongoose');

    // ── Start HTTP + WebSocket server ──
    httpServer.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════╗
║  🎓 LMS Platform — Backend Server               ║
║  🌐 HTTP:      http://localhost:${PORT}            ║
║  🔌 Socket.io: ws://localhost:${PORT}/support      ║
║  📊 Health:    http://localhost:${PORT}/api/health  ║
╚══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { io, httpServer };
