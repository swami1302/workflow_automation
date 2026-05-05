import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthApi } from '@/lib/api/auth';
import { ME_QUERY_KEY } from '@/lib/constants/queryKeys';
import { useAuth } from '@/context/AuthContext';
import type { AuthResponse } from '@/lib/types/auth';

export function usePostAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { login, updateUser } = useAuth();
  const authApi = useAuthApi();

  const handlePostAuth = useCallback(
    async (response: AuthResponse) => {
      login(response);

      try {
        const me = await authApi.me();
        updateUser(me);
        queryClient.setQueryData([ME_QUERY_KEY], me);
        router.push(me.isEmailVerified ? '/workflows' : '/verify-email');
      } catch {
        router.push(response.user.isEmailVerified ? '/workflows' : '/verify-email');
      }
    },
    [login, updateUser, queryClient, router, authApi],
  );

  return handlePostAuth;
}
