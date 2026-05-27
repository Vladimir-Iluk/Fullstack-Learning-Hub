/**
 * Page: Register
 * Topic #9: React State | Topic #18: Auth
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, error, isLoading, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch { /* handled by context */ }
  };

  return (
    <motion.div className="container section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '8px' }}>🎓</span>
          <h2>Реєстрація</h2>
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: '14px', marginTop: '8px' }}>Створіть акаунт DevHub</p>
        </div>
        {error && (
          <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '20px', fontSize: '13px', color: 'var(--color-accent-rose)' }}>{error}</div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <label htmlFor="reg-username">Ім'я користувача</label>
            <input id="reg-username" type="text" className="input" placeholder="dev_user" value={username} onChange={(e) => { setUsername(e.target.value); clearError(); }} required minLength={3} />
          </div>
          <div className="input-group">
            <label htmlFor="reg-email">Email</label>
            <input id="reg-email" type="email" className="input" placeholder="your@email.com" value={email} onChange={(e) => { setEmail(e.target.value); clearError(); }} required />
          </div>
          <div className="input-group">
            <label htmlFor="reg-password">Пароль</label>
            <input id="reg-password" type="password" className="input" placeholder="Мінімум 6 символів" value={password} onChange={(e) => { setPassword(e.target.value); clearError(); }} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading} id="register-submit" style={{ width: '100%', marginTop: '8px' }}>
            {isLoading ? 'Реєстрація...' : 'Створити акаунт →'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
          Вже є акаунт? <Link to="/login" style={{ color: 'var(--color-accent-tertiary)', fontWeight: 600 }}>Увійти</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
