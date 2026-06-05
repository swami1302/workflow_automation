'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useAuthHttp } from '@/app/auth/action/http';
import { ME_QUERY_KEY } from '@/lib/constants/queryKeys';

// ─── Route definitions ────────────────────────────────────────────────────────

// Public routes that bypass all auth checks (must be checked before PROTECTED_ROUTES)
const PUBLIC_OVERRIDE_ROUTES = ['/workflows/demo'];

// Requires authenticated + email verified
const PROTECTED_ROUTES = ['/workflows'];

// Requires authenticated + email NOT yet verified (the "check your inbox" page)
const VERIFICATION_PENDING_ROUTES = ['/auth/verify-email-pending'];

// Requires NOT authenticated (login/signup)
const GUEST_ONLY_ROUTES = ['/auth/login'];

// ─── Route type resolution ────────────────────────────────────────────────────

type RouteType = 'protected' | 'verification-pending' | 'guest-only' | 'public';

function resolveRouteType(pathname: string): RouteType {
  if (PUBLIC_OVERRIDE_ROUTES.some((r) => pathname.startsWith(r))) return 'public';
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) return 'protected';
  if (VERIFICATION_PENDING_ROUTES.some((r) => pathname.startsWith(r))) return 'verification-pending';
  if (GUEST_ONLY_ROUTES.some((r) => pathname.startsWith(r))) return 'guest-only';
  return 'public';
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isInitialized, isAuthenticated, user, updateUser } = useAuth();
  const authApi = useAuthHttp();

  // Derived as a primitive so routing effect doesn't re-fire on unrelated user updates
  const isVerified = !!user?.isEmailVerified;

  // Keeps user state in sync with the server on mount and window focus.
  const { data: meData } = useQuery({
    queryKey: [ME_QUERY_KEY],
    queryFn: authApi.me,
    enabled: isInitialized && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: false,
  });

  useEffect(() => {
    if (meData) updateUser(meData);
  }, [meData, updateUser]);

  useEffect(() => {
    if (!isInitialized) return;

    const routeType = resolveRouteType(pathname);

    switch (routeType) {
      case 'protected':
        if (!isAuthenticated) { router.replace('/auth/login'); return; }
        if (!isVerified) { router.replace('/auth/verify-email-pending'); return; }
        break;

      case 'verification-pending':
        if (!isAuthenticated) { router.replace('/auth/login'); return; }
        if (isVerified) { router.replace('/workflows'); return; }
        break;

      case 'guest-only':
        if (isAuthenticated) {
          router.replace(isVerified ? '/workflows' : '/auth/verify-email-pending');
        }
        break;

      case 'public':
        break;
    }
  }, [isInitialized, isAuthenticated, isVerified, pathname, router]);

  return <>{children}</>;
}
