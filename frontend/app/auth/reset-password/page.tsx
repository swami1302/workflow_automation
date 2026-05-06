'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, XCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuthApi, type ResetPasswordPayload } from '@/lib/api/auth';
import { useMutationEvents } from '@/hooks/useMutationEvents';
import { ResetPasswordSchema, type ResetPasswordFormValues } from '@/lib/validations';
import { RESET_PASSWORD_QUERY_KEY } from '@/lib/constants/queryKeys';

// ─── Inner component (uses useSearchParams — must be inside Suspense) ─────────

function ResetPasswordContent() {
  const authApi = useAuthApi();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const mutation = useMutation<{ message: string }, Error, ResetPasswordPayload>({
    mutationKey: [RESET_PASSWORD_QUERY_KEY],
    mutationFn: authApi.resetPassword,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  useMutationEvents(mutation, {
    onSuccess(data) {
      toast.success(data.message);
      // setTimeout(() => router.push('/login'), 2000);
    },
    onError(error) {
      toast.error(error.message ?? 'Reset failed. The link may have expired.');
    },
  });

  if (!token) {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="h-7 w-7 text-red-500" />
          </div>
          <CardTitle className="text-xl">Invalid link</CardTitle>
          <CardDescription>
            No reset token found. Please use the link from your email.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            className="w-full bg-slate-900 hover:bg-slate-800"
            onClick={() => router.push('/auth/forgot-password')}
          >
            Request a new link
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (mutation.isSuccess) {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl">Password reset!</CardTitle>
          <CardDescription>
            Your password has been updated. Redirecting you to login…
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate({ token, password: values.password }))}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>Enter a new password for your account.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="rp-password">New password</Label>
            <Input id="rp-password" type="password" {...register('password')} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rp-confirm">Confirm password</Label>
            <Input id="rp-confirm" type="password" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting…</>
              : 'Reset password'}
          </Button>
          <Link
            href="/login"
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="h-3 w-3" /> Back to login
          </Link>
        </CardFooter>
      </Card>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-[400px] flex flex-col gap-6">
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
                <Loader2 className="h-7 w-7 animate-spin text-slate-400" />
                <CardTitle className="text-xl">Loading…</CardTitle>
              </CardHeader>
            </Card>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
