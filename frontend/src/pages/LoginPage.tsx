/**
 * ═══════════════════════════════════════════════════════
 * Page: Login
 * Topic #9: React State та робота з подіями
 * Topic #18: Аутентифікація (JWT)
 * ═══════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      // Error handled by context
    }
  };

  return (
    <motion.div
      className="container section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}
    >
      <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '8px' }}>🔐</span>
          <h2>Вхід до DevHub</h2>
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: '14px', marginTop: '8px' }}>
            Увійдіть, щоб отримати доступ до курсів
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            marginBottom: '20px',
            fontSize: '13px',
            color: 'var(--color-accent-rose)',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); }}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-password">Пароль</label>
            <input
              id="login-password"
              type="password"
              className="input"
              placeholder="Ваш пароль"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError(); }}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isLoading}
            id="login-submit"
            style={{ width: '100%', marginTop: '8px' }}
          >
            {isLoading ? 'Завантаження...' : 'Увійти →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
          Немає акаунту?{' '}
          <Link to="/register" style={{ color: 'var(--color-accent-tertiary)', fontWeight: 600 }}>
            Зареєструватися
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
