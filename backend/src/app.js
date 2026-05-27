/**
 * ═══════════════════════════════════════════════════════
 * LMS Backend — Express Application Setup
 * ═══════════════════════════════════════════════════════
 * Topic #12: Робота з Express.js
 * Topic #14: Паттерни проектування (MVC)
 * Topic #3:  Javascript ES6+ (сучасний синтаксис)
 * Topic #7:  Робота з помилками (Express error middleware)
 * Topic #13: Робота з шаблонізаторами (EJS)
 * ═══════════════════════════════════════════════════════
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// ── Route Imports (MVC — Routes Layer) ──
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import orderRoutes from './routes/orders.js';
import chatRoutes from './routes/chat.js';
import certificateRoutes from './routes/certificates.js';

// ── Middleware Imports ──
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.js';

// ── ES Module __dirname polyfill (Topic #3: ES6+) ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ═══════════════════════════════════════════════════════
// Middleware Stack
// ═══════════════════════════════════════════════════════

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

// Request logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Topic #13: EJS Template Engine ──
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// ═══════════════════════════════════════════════════════
// API Routes (MVC — Routes → Controllers → Models)
// ═══════════════════════════════════════════════════════

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: ['express', 'postgres', 'mongodb', 'socket.io'],
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/certificates', certificateRoutes);

// ── Topic #13: EJS render demo route ──
app.get('/admin/email-preview', async (_req, res) => {
  res.render('email-invoice', {
    studentName: 'Іван Тестовий',
    courseName: 'React Advanced Patterns',
    amount: 1299,
    currency: 'UAH',
    orderId: 'ORD-2024-DEMO',
    date: new Date().toLocaleDateString('uk-UA'),
  });
});

// ═══════════════════════════════════════════════════════
// Error Handling (Topic #7)
// ═══════════════════════════════════════════════════════

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
