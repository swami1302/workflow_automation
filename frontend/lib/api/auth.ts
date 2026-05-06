'use client';

import { useMemo } from 'react';
import { useAxios } from '@/context/AxiosContext';
import type { AuthResponse, User } from '@/lib/types/auth';

// ─── Payload types ────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  name?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuthApi() {
  const axios = useAxios();

  return useMemo(
    () => ({
      login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const { data } = await axios.post<AuthResponse>('/auth/login', payload);
        return data;
      },

      signup: async (payload: SignupPayload): Promise<AuthResponse> => {
        const { data } = await axios.post<AuthResponse>('/auth/signup', payload);
        return data;
      },

      me: async (): Promise<User> => {
        const { data } = await axios.get<User>('/auth/me');
        return data;
      },

      resendVerification: async (): Promise<{ message: string }> => {
        const { data } = await axios.post<{ message: string }>('/auth/resend-verification');
        return data;
      },

      verifyEmail: async (token: string): Promise<{ message: string }> => {
        const { data } = await axios.get<{ message: string }>(`/auth/verify-email?token=${token}`);
        return data;
      },

      forgotPassword: async (payload: ForgotPasswordPayload): Promise<{ message: string }> => {
        const { data } = await axios.post<{ message: string }>('/auth/forgot-password', payload);
        return data;
      },

      resetPassword: async (payload: ResetPasswordPayload): Promise<{ message: string }> => {
        const { data } = await axios.post<{ message: string }>('/auth/reset-password', payload);
        return data;
      },
    }),
    [axios],
  );
}
