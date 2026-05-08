'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuthApi, type ForgotPasswordPayload } from '@/lib/api/auth';
import { useMutationEvents } from '@/hooks/useMutationEvents';
import { ForgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validations';
import { FORGOT_PASSWORD_QUERY_KEY } from '@/lib/constants/queryKeys';

export default function ForgotPasswordPage() {
  const authApi = useAuthApi();

  const mutation = useMutation<{ message: string }, Error, ForgotPasswordPayload>({
    mutationKey: [FORGOT_PASSWORD_QUERY_KEY],
    mutationFn: authApi.forgotPassword,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  useMutationEvents(mutation, {
    onSuccess(data) {
      toast.success(data.message);
    },
    onError(error) {
      toast.error(error.message ?? 'Something went wrong. Please try again.');
    },
  });

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

        <form onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Forgot password?</CardTitle>
              <CardDescription>
                Enter your email and we&apos;ll send you a link to reset your password.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
              {mutation.isSuccess ? (
                <p className="text-sm text-slate-600 bg-slate-100 rounded-md p-3">
                  Check your inbox — if an account exists for that email, a reset link is on its way.
                </p>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="fp-email">Email</Label>
                  <Input id="fp-email" type="email" placeholder="m@example.com" {...register('email')} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              {!mutation.isSuccess && (
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>
                    : 'Send reset link'}
                </Button>
              )}
              <Link
                href="/login"
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="h-3 w-3" /> Back to login
              </Link>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
