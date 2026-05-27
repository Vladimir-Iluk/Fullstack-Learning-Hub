import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [photoUrl, setPhotoUrl] = useState(user?.avatar_url || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Mock validation
    if (password && password !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    // Since backend endpoints don't exist yet, mock success
    setTimeout(() => {
      setMessage('Профіль успішно оновлено!');
      setPassword('');
      setConfirmPassword('');
    }, 500);
  };

  return (
    <motion.div
      className="profile-page container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="profile-header">
        <h1>Профіль користувача</h1>
        <p>Керуйте своїми налаштуваннями та даними</p>
      </div>

      <div className="profile-content">
        <div className="profile-card glass-card">
          <div className="profile-avatar-section">
            <div className="avatar-preview">
              {photoUrl ? (
                <img src={photoUrl} alt="User avatar" />
              ) : (
                <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="user-info">
              <h3>{user?.username || 'Гість'}</h3>
              <p>{user?.email || 'guest@example.com'}</p>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleUpdateProfile}>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="photoUrl">Посилання на фото (URL)</label>
              <input
                type="text"
                id="photoUrl"
                className="input"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Новий пароль</label>
              <input
                type="password"
                id="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Залиште порожнім, якщо не хочете змінювати"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Підтвердження пароля</label>
              <input
                type="password"
                id="confirmPassword"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Підтвердіть новий пароль"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Зберегти зміни
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
