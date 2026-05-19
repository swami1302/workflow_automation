'use client';

import { Mail, Loader2, RefreshCw, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthHttp } from '@/app/auth/action/http';
import { useAuth } from '@/context/AuthContext';
import { useMutationEvents } from '@/hooks/useMutationEvents';

export default function VerifyEmailPage() {
  const authApi = useAuthHttp();
  const { user, logout } = useAuth();

  const resendMutation = useMutation<{ message: string }>({
    mutationFn: authApi.resendVerification,
  });

  useMutationEvents(resendMutation, {
    onSuccess(data) {
      toast.success(data.message ?? 'Verification email sent!');
    },
    onError(error) {
      toast.error(error.message ?? 'Failed to resend. Please try again.');
    },
  });

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

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
              <Mail className="h-7 w-7 text-orange-600" />
            </div>
            <CardTitle className="text-xl">Check your email</CardTitle>
            <CardDescription>
              We sent a verification link to{' '}
              <span className="font-medium text-slate-700">{user?.email}</span>.
              Click the link in the email to activate your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-sm text-slate-500">
              Didn&apos;t receive it? Check your spam folder, or request a new link below.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700"
              onClick={() => resendMutation.mutate()}
              disabled={resendMutation.isPending}
            >
              {resendMutation.isPending
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>
                : <><RefreshCw className="mr-2 h-4 w-4" /> Resend verification email</>}
            </Button>

            <Button
              variant="ghost"
              className="w-full text-slate-500 hover:text-slate-900"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
