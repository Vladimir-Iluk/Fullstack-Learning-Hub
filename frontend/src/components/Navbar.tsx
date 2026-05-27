/**
 * ═══════════════════════════════════════════════════════
 * Component: Navbar
 * Topic #4: React Router v6 (NavLink, useNavigate)
 * Topic #2: Анімація (hover effects, transitions)
 * ═══════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { totalItems, toggleCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="nav-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">
            Dev<span className="logo-accent">Hub</span>
          </span>
        </Link>

        {/* Navigation Links (React Router v6 NavLink) */}
        <div className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-home"
          >
            Каталог
          </NavLink>
          <NavLink
            to="/router-guide"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-router-guide"
          >
            Router Guide
          </NavLink>
          <NavLink
            to="/archive"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-archive"
          >
            Архів
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-support"
          >
            Підтримка
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="navbar-actions">
          {/* Plans Button */}
          <Link
            to="/plans"
            className="cart-btn"
            id="nav-plans-btn"
            aria-label="Підписки та тарифи"
            style={{ textDecoration: 'none' }}
          >
            💎
          </Link>

          {/* Cart Button */}
          <button
            className="cart-btn"
            onClick={toggleCart}
            id="nav-cart-btn"
            aria-label={`Кошик: ${totalItems} курсів`}
          >
            🛒
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-avatar" id="nav-user-avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
              <Link to="/profile" className="user-name" style={{ textDecoration: 'none', color: 'inherit' }}>
                {user?.username}
              </Link>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleLogout}
                id="nav-logout-btn"
              >
                Вийти
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" id="nav-login-btn">
              Увійти
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Меню"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
