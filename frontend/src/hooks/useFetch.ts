/**
 * ═══════════════════════════════════════════════════════
 * Custom Hook: useFetch
 * Topic #10: Хуки — створення власних хуків
 * Topic #3:  Javascript ES6+ (async/await, generics)
 * ═══════════════════════════════════════════════════════
 * Universal async data fetching hook with loading/error states.
 */

import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export function useFetch<T = unknown>(
  endpoint: string,
  options?: {
    immediate?: boolean;
    token?: string | null;
    method?: string;
    body?: unknown;
  }
): FetchState<T> {
  const {
    immediate = true,
    token = null,
    method = 'GET',
  } = options ?? {};

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const fetchOptions: RequestInit = {
        method,
        headers,
      };

      if (options?.body && method !== 'GET') {
        fetchOptions.body = JSON.stringify(options.body);
      }

      const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_URL}${endpoint}`;

      const response = await fetch(url, fetchOptions);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? `HTTP Error: ${response.status}`);
      }

      setData(result.data ?? result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Невідома помилка';
      setError(message);
      console.error(`useFetch error [${endpoint}]:`, message);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, token, method, options?.body]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
