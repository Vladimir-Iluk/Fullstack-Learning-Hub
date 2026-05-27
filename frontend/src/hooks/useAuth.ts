/**
 * ═══════════════════════════════════════════════════════
 * Custom Hook: useAuth
 * Topic #10: Хуки — створення власних хуків
 * ═══════════════════════════════════════════════════════
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
