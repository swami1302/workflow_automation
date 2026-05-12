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
    <form onSubmit={handleSubmit((values) => loginMutation.mutate(values))} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="login-email" className="font-bold text-slate-700 ml-1">Email</Label>
          <Input 
            id="login-email" 
            type="email" 
            placeholder="name@company.com" 
            className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#FF4500] font-medium"
            {...register('email')} 
          />
          {errors.email && <p className="text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between ml-1">
            <Label htmlFor="login-password" title="Password" className="font-bold text-slate-700">Password</Label>
            <Link href="/auth/forgot-password" title="Forgot password" className="text-xs font-bold text-[#FF4500] hover:underline">Forgot password?</Link>
          </div>
          <Input 
            id="login-password" 
            type="password" 
            className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#FF4500]"
            {...register('password')} 
          />
          {errors.password && <p className="text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#FF4500] hover:bg-[#E63E00] text-white h-12 rounded-xl font-black shadow-lg shadow-orange-100 transition-all hover:scale-[1.02] active:scale-[0.98]" 
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</>
          : 'Sign In'}
      </Button>
    </form>
  );
}
