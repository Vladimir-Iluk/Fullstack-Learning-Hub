/**
 * ═══════════════════════════════════════════════════════
 * Component: Layout
 * Uses React Router v6 <Outlet> for nested routing
 * Topic #4: React Router v6
 * ═══════════════════════════════════════════════════════
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ErrorBoundary from './ErrorBoundary';

const Layout: React.FC = () => {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-icon">🎓</span>
              <span className="logo-text">Dev<span className="logo-accent">Hub</span> LMS</span>
              <p className="footer-description">
                Освітня платформа для розробників. Вивчайте сучасні технології від найкращих інструкторів.
              </p>
            </div>
            <div className="footer-info">
              <p className="footer-tech">
                React 18 • React Router v6 • Express.js • PostgreSQL • MongoDB • Deno • Socket.io
              </p>
              <p className="footer-copy">
                © {new Date().getFullYear()} DevHub LMS. Демонстрація 21 інженерної теми.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
