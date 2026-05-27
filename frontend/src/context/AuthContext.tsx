/**
 * ═══════════════════════════════════════════════════════
 * AuthContext — Authentication State Provider
 * Topic #10: Хуки — кастомний useAuth
 * ═══════════════════════════════════════════════════════
 */

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('lms_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch user profile on mount if token exists ──
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem('lms_token');
          setToken(null);
        }
      } catch {
        console.warn('Could not fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Помилка входу');
      }

      setUser(data.data.user);
      setToken(data.data.token);
      localStorage.setItem('lms_token', data.data.token);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Помилка реєстрації');
      }

      setUser(data.data.user);
      setToken(data.data.token);
      localStorage.setItem('lms_token', data.data.token);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lms_token');
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
    clearError,
  }), [user, token, isLoading, login, register, logout, error, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
