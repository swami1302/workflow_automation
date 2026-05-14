'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { TokenStorage } from '@/lib/api/tokens';
import type { AuthResponse, User } from '@/lib/types/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  /** True once the context has finished reading localStorage (safe to render auth-dependent UI). */
  isInitialized: boolean;
  isAuthenticated: boolean;
  /** Call after a successful login or signup response. */
  login: (response: AuthResponse) => void;
  /** Clears tokens, user state and redirects to /login. */
  logout: () => void;
  /** Update the in-memory user (e.g. after a profile edit or /me response). */
  updateUser: (partial: Partial<User>) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedUser = TokenStorage.getUser();
    const accessToken = TokenStorage.getAccessToken();
    
    // Wrap in setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      if (storedUser && accessToken) {
        setUser(storedUser);
      }
      setIsInitialized(true);
    }, 0);
  }, []);

  const login = useCallback((response: AuthResponse) => {
    TokenStorage.setTokens(response.accessToken, response.refreshToken);
    TokenStorage.setUser(response.user);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    TokenStorage.clearAll();
    setUser(null);
    queryClient.clear();
    // Removed automatic router.push('/login')
  }, [queryClient]);

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      TokenStorage.setUser(updated);
      return updated;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthContextProvider>');
  }
  return ctx;
}
