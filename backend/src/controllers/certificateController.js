/**
 * ═══════════════════════════════════════════════════════
 * Controller: Certificates
 * Topic #8: Deno (proxy to Deno microservice)
 * Topic #11: Node.js (HTTP requests, streams)
 * ═══════════════════════════════════════════════════════
 */

import { ApiError } from '../middleware/errorHandler.js';
import { ActivityLog } from '../models/index.js';

const DENO_SERVICE_URL = process.env.DENO_SERVICE_URL ?? 'http://localhost:8000';

/**
 * POST /api/certificates/generate
 * Request certificate generation from Deno microservice
 */
export const generateCertificate = async (req, res, next) => {
  try {
    const { course_name, completion_date } = req.body;
    const { username, id: userId } = req.user;

    if (!course_name) {
      throw new ApiError(400, 'Назва курсу обов\'язкова');
    }

    // ── Send request to Deno microservice (Topic #8) ──
    const response = await fetch(`${DENO_SERVICE_URL}/generate-cert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_name: username,
        course_name,
        completion_date: completion_date ?? new Date().toISOString(),
        certificate_id: `CERT-${Date.now()}-${userId.slice(0, 8)}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error ?? 'Помилка генерації сертифікату у Deno-сервісі'
      );
    }

    const certificateData = await response.json();

    // Log activity
    await ActivityLog.create({
      user_id: userId,
      action: 'certificate_generated',
      details: { course_name, certificateId: certificateData.certificate_id },
    });

    res.json({
      success: true,
      message: 'Сертифікат згенеровано!',
      data: certificateData,
    });
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return next(new ApiError(503, 'Deno-сервіс сертифікатів недоступний'));
    }
    next(error);
  }
};
