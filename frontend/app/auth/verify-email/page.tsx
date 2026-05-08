'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthApi } from '@/lib/api/auth';
import { useAuth } from '@/context/AuthContext';

// ─── Inner component (uses useSearchParams — must be inside Suspense) ─────────

function VerifyEmailContent() {
  const authApi = useAuthApi();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUser } = useAuth();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token found. Please use the link from your email.');
        return;
      }

      try {
        const result = await authApi.verifyEmail(token);
        updateUser({ isEmailVerified: true });
        setStatus('success');
        setMessage(result.message ?? 'Your email has been verified!');
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message ??
          'Verification failed. The link may have expired.';
        setStatus('error');
        setMessage(typeof msg === 'string' ? msg : msg[0]);
      }
    };

    void verify();
  }, [searchParams, updateUser, authApi]);

  if (status === 'loading') {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-slate-400" />
          </div>
          <CardTitle className="text-xl">Verifying your email…</CardTitle>
          <CardDescription>Please wait a moment.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (status === 'success') {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>
          <CardTitle className="text-xl">Email verified!</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            className="w-full bg-slate-900 hover:bg-slate-800"
            onClick={() => router.push('/workflows')}
          >
            Go to Workflows
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="items-center text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <XCircle className="h-7 w-7 text-red-500" />
        </div>
        <CardTitle className="text-xl">Verification failed</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-slate-500">
          If your link has expired, sign in and request a new verification email.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button
          className="w-full bg-slate-900 hover:bg-slate-800"
          onClick={() => router.push('/login')}
        >
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
}

// ─── Page (wraps inner component in Suspense for useSearchParams) ─────────────

export default function AuthVerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-[420px] flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Workflow Builder</h1>
        </div>

        <Suspense
          fallback={
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                  <Loader2 className="h-7 w-7 animate-spin text-slate-400" />
                </div>
                <CardTitle className="text-xl">Loading…</CardTitle>
              </CardHeader>
            </Card>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
