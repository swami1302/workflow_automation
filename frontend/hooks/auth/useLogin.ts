import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import type { AuthResponse } from '@/lib/types/auth';

interface LoginPayload {
  email: string;
  password: string;
}

async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
}

export function useLogin() {
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: loginRequest,
  });
}
