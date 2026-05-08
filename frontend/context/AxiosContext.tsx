'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { TokenStorage } from '@/lib/api/tokens';
import { useAuth } from './AuthContext';
import type { TokenPair } from '@/lib/types/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface QueueEntry {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AxiosContext = createContext<AxiosInstance | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AxiosProvider({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();

  // Stable ref so interceptor closures always call the latest logout without
  // being part of the useMemo dependency array.
  const logoutRef = useRef(logout);
  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

   
  const axiosInstance = useMemo<AxiosInstance>(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 15_000,
    });

    // ─── Refresh queue ──────────────────────────────────────────────────────
    // Concurrent 401s wait here while one refresh is in flight, then replay.
    let isRefreshing = false;
    let failedQueue: QueueEntry[] = [];

    function processQueue(error: unknown, newToken: string | null): void {
      failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(newToken!);
      });
      failedQueue = [];
    }

    // ─── Request interceptor ────────────────────────────────────────────────
    instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = TokenStorage.getAccessToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    // ─── Response interceptor ───────────────────────────────────────────────
    instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (
          error.response?.status !== 401 ||
          original._retry ||
          original.url?.includes('/auth/refresh') ||
          original.url?.includes('/auth/login')
        ) {
          return Promise.reject(error);
        }

        const refreshToken = TokenStorage.getRefreshToken();
        if (!refreshToken) {
          logoutRef.current();
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((newToken) => {
            original.headers.Authorization = `Bearer ${newToken}`;
            return instance(original);
          });
        }

        original._retry = true;
        isRefreshing = true;

        try {
          // Use bare axios (not our instance) to avoid interceptor loop
          const { data } = await axios.post<TokenPair>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } },
          );

          TokenStorage.setTokens(data.accessToken, data.refreshToken);
          instance.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

          processQueue(null, data.accessToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return instance(original);
        } catch (refreshError) {
          processQueue(refreshError, null);
          logoutRef.current();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      },
    );

    return instance;
  }, []); // instance is intentionally created once; logout accessed via ref

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAxios(): AxiosInstance {
  const ctx = useContext(AxiosContext);
  if (!ctx) throw new Error('useAxios must be used inside <AxiosProvider>');
  return ctx;
}
