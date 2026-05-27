/**
 * Page: Checkout Success
 * Topic #20: Stripe payment confirmation
 */

import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

const CheckoutSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { token } = useAuth();
  const { clearCart } = useCart();
  const [certificateSvg, setCertificateSvg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

  // Clear cart on successful payment
  useEffect(() => {
    clearCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Confirm payment and generate certificate
  const handleGenerateCertificate = async () => {
    if (!token) return;
    setIsGenerating(true);

    try {
      // Confirm payment
      await fetch(`${API_URL}/api/orders/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      // Generate certificate via Deno service
      const certRes = await fetch(`${API_URL}/api/certificates/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_name: 'React Advanced Patterns',
          completion_date: new Date().toISOString(),
        }),
      });

      if (certRes.ok) {
        const data = await certRes.json();
        setCertificateSvg(data.data?.svg_data_uri ?? null);
      }
    } catch (err) {
      console.error('Certificate generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      className="container section"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}
    >
      <div className="glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <span style={{ fontSize: '72px', display: 'block', marginBottom: '16px' }}>🎉</span>
        </motion.div>

        <h1 style={{ marginBottom: '12px', color: 'var(--color-accent-emerald)' }}>
          Оплата успішна!
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
          Вітаємо! Ви отримали доступ до курсу.
          Тепер ви можете переглядати всі лекції та матеріали.
        </p>

        {sessionId && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            marginBottom: '24px',
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-mono)',
          }}>
            Session: {sessionId.slice(0, 30)}...
          </div>
        )}

        {/* Certificate Preview */}
        {certificateSvg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '24px' }}
          >
            <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>📜 Ваш сертифікат</h3>
            <img
              src={certificateSvg}
              alt="Сертифікат"
              style={{
                width: '100%',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
              }}
            />
          </motion.div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          {!certificateSvg && (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleGenerateCertificate}
              disabled={isGenerating}
              id="generate-cert-btn"
            >
              {isGenerating ? 'Генерація...' : '📜 Згенерувати сертифікат'}
            </button>
          )}
          <Link to="/" className="btn btn-secondary">
            ← Повернутися до каталогу
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutSuccessPage;
