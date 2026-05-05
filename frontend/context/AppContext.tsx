'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { setAuthErrorCallback } from '@/lib/api/axios';
import { TokenStorage } from '@/lib/api/tokens';
import type { AuthResponse, User } from '@/lib/types/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppContextValue {
  /** Authenticated user, or null when logged out. */
  user: User | null;
  /** True once the context has finished reading localStorage. */
  isInitialized: boolean;
  isAuthenticated: boolean;
  /** Call after a successful login or signup response. */
  login: (response: AuthResponse) => void;
  /** Clears tokens, user state and redirects to /login. */
  logout: () => void;
  /** Update the in-memory user (e.g. after a profile edit). */
  updateUser: (partial: Partial<User>) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = TokenStorage.getUser();
    const accessToken = TokenStorage.getAccessToken();
    return storedUser && accessToken ? storedUser : null;
  });
  const isInitialized = true;

  // Register the auth-error callback so the axios interceptor can drive logout
  // without needing access to React state directly.
  useEffect(() => {
    setAuthErrorCallback(() => {
      TokenStorage.clearAll();
      setUser(null);
      router.push('/login');
    });
  }, [router]);

  const login = useCallback((response: AuthResponse) => {
    TokenStorage.setTokens(response.accessToken, response.refreshToken);
    TokenStorage.setUser(response.user);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    TokenStorage.clearAll();
    setUser(null);
    router.push('/login');
  }, [router]);

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      TokenStorage.setUser(updated);
      return updated;
    });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      isInitialized,
      isAuthenticated: !!user,
      login,
      logout,
      updateUser,
    }),
    [user, isInitialized, login, logout, updateUser],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside <AppContextProvider>');
  }
  return ctx;
}
