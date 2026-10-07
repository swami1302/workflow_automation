import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthHttp } from '@/app/auth/action/http';
import { ME_QUERY_KEY } from '@/lib/constants/queryKeys';
import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/context/AuthContext';
import type { AuthResponse } from '@/lib/types/auth';

export function usePostAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { login, updateUser } = useAuth();
  const authApi = useAuthHttp();

  const handlePostAuth = useCallback(
    async (response: AuthResponse) => {
      login(response);

      try {
        const me = await authApi.me();
        updateUser(me);
        queryClient.setQueryData([ME_QUERY_KEY], me);
        router.push(me.isEmailVerified ? ROUTES.workflows : ROUTES.verifyEmailPending);
      } catch {
        router.push(response.user.isEmailVerified ? ROUTES.workflows : ROUTES.verifyEmailPending);
      }
    },
    [login, updateUser, queryClient, router, authApi],
  );

  return handlePostAuth;
}
