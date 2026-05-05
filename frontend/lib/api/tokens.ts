import type { User } from '@/lib/types/auth';

const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'auth_user',
} as const;

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage quota exceeded or private browsing — fail silently
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

export const TokenStorage = {
  getAccessToken(): string | null {
    return safeGet(KEYS.ACCESS_TOKEN);
  },

  getRefreshToken(): string | null {
    return safeGet(KEYS.REFRESH_TOKEN);
  },

  setTokens(accessToken: string, refreshToken: string): void {
    safeSet(KEYS.ACCESS_TOKEN, accessToken);
    safeSet(KEYS.REFRESH_TOKEN, refreshToken);
  },

  getUser(): User | null {
    const raw = safeGet(KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    safeSet(KEYS.USER, JSON.stringify(user));
  },

  clearAll(): void {
    safeRemove(KEYS.ACCESS_TOKEN);
    safeRemove(KEYS.REFRESH_TOKEN);
    safeRemove(KEYS.USER);
  },
};
