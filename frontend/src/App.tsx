/**
 * ═══════════════════════════════════════════════════════
 * App — Main Application Router
 * Topic #4:  React Router v6 (Routes, Route, Outlet)
 * Topic #15: Lazy loading (React.lazy + Suspense)
 * Topic #2:  Page transition animations (AnimatePresence)
 * ═══════════════════════════════════════════════════════
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';

// ── Topic #15: Lazy Loading Pages (Code Splitting) ──
const HomePage = lazy(() => import('./pages/HomePage'));
const CourseDetailsPage = lazy(() => import('./pages/CourseDetailsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const RouterGuidePage = lazy(() => import('./pages/RouterGuidePage'));
const ArchivePage = lazy(() => import('./pages/ArchivePage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const CheckoutSuccessPage = lazy(() => import('./pages/CheckoutSuccessPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PlansPage = lazy(() => import('./pages/PlansPage'));

// ── Loading Fallback ──
const PageLoader: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    flexDirection: 'column',
    gap: '16px',
  }}>
    <div className="spinner" style={{
      width: '48px',
      height: '48px',
      border: '3px solid rgba(99, 102, 241, 0.2)',
      borderTopColor: '#6366f1',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
      Завантаження...
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const App: React.FC = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      {/* Topic #2: AnimatePresence for page transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Topic #4: React Router v6 — nested routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="courses/:id" element={<CourseDetailsPage />} />
            <Route path="courses/:id/quiz" element={<QuizPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="router-guide" element={<RouterGuidePage />} />
            <Route path="archive" element={<ArchivePage />} />
            <Route path="checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="plans" element={<PlansPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export default App;
