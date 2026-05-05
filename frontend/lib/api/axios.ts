import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { TokenStorage } from './tokens';
import type { TokenPair } from '@/lib/types/auth';

// ─── Auth error callback ──────────────────────────────────────────────────────
// AppContext registers this so the interceptor can drive React state on auth failure.
// Default falls back to a hard redirect so requests that fire before the context
// mounts don't leave the user stuck.
let onAuthError: (() => void) | null = null;

export function setAuthErrorCallback(fn: () => void): void {
  onAuthError = fn;
}

function handleAuthError(): void {
  TokenStorage.clearAll();
  if (onAuthError) {
    onAuthError();
  } else {
    // Fallback before AppContext mounts
    window.location.href = '/login';
  }
}

// ─── Refresh queue ────────────────────────────────────────────────────────────
// Queues requests that arrive while a token refresh is in flight, then replays
// them with the new access token (or rejects them if refresh fails).
interface QueueEntry {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueEntry[] = [];

function processQueue(error: unknown, newToken: string | null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(newToken!);
    }
  });
  failedQueue = [];
}

// ─── Axios instance ───────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// ─── Request interceptor: attach access token ────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = TokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: transparent token refresh on 401 ─────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only attempt a refresh for 401 errors on non-retry, non-refresh requests
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
      handleAuthError();
      return Promise.reject(error);
    }

    // If a refresh is already in flight, queue this request to replay after
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      // Use a plain axios call to avoid interceptor loops on the refresh endpoint
      const { data } = await axios.post<TokenPair>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      );

      TokenStorage.setTokens(data.accessToken, data.refreshToken);
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

      processQueue(null, data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      handleAuthError();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
