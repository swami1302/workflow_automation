'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Github, Chrome, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuthApi, type LoginPayload } from '@/lib/api/auth';
import { usePostAuth } from '@/hooks/auth/usePostAuth';
import { useMutationEvents } from '@/hooks/useMutationEvents';
import { LoginSchema, type LoginFormValues } from '@/lib/validations';
import type { AuthResponse } from '@/lib/types/auth';
import { LOGIN_QUERY_KEY } from '@/lib/constants/queryKeys';

export function LoginForm() {
  const authApi = useAuthApi();
  const handlePostAuth = usePostAuth();
  const loginMutation = useMutation<AuthResponse, Error, LoginPayload>({
    mutationKey: [LOGIN_QUERY_KEY],
    mutationFn: authApi.login,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  useMutationEvents(loginMutation, {
    onSuccess(data) {
      toast.success('Welcome back!');
      void handlePostAuth(data);
    },
    onError(error) {
      toast.error(error.message ?? 'Login failed. Please try again.');
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Enter your email to sign in to your account</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Button type="button" variant="outline" className="bg-white">
              <Github className="mr-2 h-4 w-4" /> Github
            </Button>
            <Button type="button" variant="outline" className="bg-white">
              <Chrome className="mr-2 h-4 w-4" /> Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" type="email" placeholder="m@example.com" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Password</Label>
              <Link href="#" className="text-xs text-orange-600 hover:underline">Forgot password?</Link>
            </div>
            <Input id="login-password" type="password" {...register('password')} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={loginMutation.isPending}>
            {loginMutation.isPending
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</>
              : 'Login'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
