'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useAuthApi } from '@/lib/api/auth';
import { ME_QUERY_KEY } from '@/lib/constants/queryKeys';

// ─── Route definitions ────────────────────────────────────────────────────────

// Public routes that bypass all auth checks (must be checked before PROTECTED_ROUTES)
const PUBLIC_OVERRIDE_ROUTES = ['/workflow/demo'];

// Requires authenticated + email verified
const PROTECTED_ROUTES = ['/workflows', '/workflow'];

// Requires authenticated + email NOT yet verified (the "check your inbox" page)
const VERIFICATION_PENDING_ROUTES = ['/verify-email'];

// Requires NOT authenticated (login/signup)
const GUEST_ONLY_ROUTES = ['/login'];

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
  const authApi = useAuthApi();

  // Fires on every mount (hard refresh) and after staleTime on window focus.
  // Keeps user state in sync with the server without a separate hook file.
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
    const isVerified = user?.isEmailVerified ?? false;

    switch (routeType) {
      case 'protected':
        if (!isAuthenticated) { router.replace('/login'); return; }
        if (!isVerified) { router.replace('/verify-email'); return; }
        break;

      case 'verification-pending':
        if (!isAuthenticated) { router.replace('/login'); return; }
        if (isVerified) { router.replace('/workflows'); return; }
        break;

      case 'guest-only':
        if (isAuthenticated) {
          router.replace(isVerified ? '/workflows' : '/verify-email');
        }
        break;

      case 'public':
        break;
    }
  }, [isInitialized, isAuthenticated, user, pathname, router]);

  return <>{children}</>;
}
