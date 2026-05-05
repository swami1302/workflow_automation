import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import type { AuthResponse } from '@/lib/types/auth';

interface SignupPayload {
  email: string;
  password: string;
  name?: string;
}

async function signupRequest(payload: SignupPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/signup', payload);
  return data;
}

export function useSignup() {
  return useMutation<AuthResponse, Error, SignupPayload>({
    mutationFn: signupRequest,
  });
}
