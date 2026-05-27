/**
 * ═══════════════════════════════════════════════════════
 * Page: Cart — Shopping Cart with Context State
 * Topic #5: Заміна Redux хуками (useReducer display)
 * ═══════════════════════════════════════════════════════
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';

const CartPage: React.FC = () => {
  const { state, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // In real app, this would call the orders API
    alert('💳 Перенаправлення до Stripe Checkout...');
  };

  if (totalItems === 0) {
    return (
      <motion.div
        className="container section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Ваш кошик порожній</h3>
          <p style={{ color: 'var(--color-text-tertiary)', marginBottom: '24px' }}>
            Додайте курси з каталогу, щоб почати навчання
          </p>
          <Link to="/" className="btn btn-primary">
            Переглянути каталог
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 style={{ marginBottom: '32px' }}>🛒 Кошик навчання</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {state.items.map((item, index) => (
            <motion.div
              key={item.id}
              className="glass-card"
              style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <img
                src={item.thumbnail_url}
                alt={item.title}
                style={{
                  width: '120px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop';
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                  {item.instructor_name}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="price" style={{ display: 'block', marginBottom: '8px' }}>
                  {item.price} ₴
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => removeItem(item.id)}
                  style={{ color: 'var(--color-accent-rose)' }}
                  id={`remove-${item.id}`}
                >
                  🗑️ Видалити
                </button>
              </div>
            </motion.div>
          ))}

          <button
            className="btn btn-ghost"
            onClick={clearCart}
            style={{ alignSelf: 'flex-start', color: 'var(--color-text-tertiary)' }}
            id="clear-cart-btn"
          >
            Очистити кошик
          </button>
        </div>

        {/* Order Summary */}
        <motion.div
          className="glass-card"
          style={{ padding: '24px', alignSelf: 'flex-start', position: 'sticky', top: '96px' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 style={{ marginBottom: '20px' }}>📋 Підсумок замовлення</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Курсів:</span>
              <span>{totalItems}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Знижка:</span>
              <span style={{ color: 'var(--color-accent-emerald)' }}>
                -{state.items.reduce((sum, item) =>
                  sum + ((item.original_price ?? item.price) - item.price), 0
                )} ₴
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid var(--color-border)',
              fontSize: '18px',
              fontWeight: 700,
            }}>
              <span>Разом:</span>
              <span className="price">{totalPrice} ₴</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={handleCheckout}
            id="checkout-btn"
          >
            💳 Оплатити
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: '11px',
            color: 'var(--color-text-tertiary)',
            marginTop: '12px',
          }}>
            🔒 Безпечна оплата через Stripe
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CartPage;
