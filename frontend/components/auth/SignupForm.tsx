'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuthHttp, type SignupPayload } from '@/app/auth/action/http';
import { usePostAuth } from '@/hooks/auth/usePostAuth';
import { useMutationEvents } from '@/hooks/useMutationEvents';
import { SignupSchema, type SignupFormValues } from '@/lib/validations';
import type { AuthResponse } from '@/lib/types/auth';
import { SIGNUP_QUERY_KEY } from '@/lib/constants/queryKeys';

export function SignupForm() {
  const authApi = useAuthHttp();
  const handlePostAuth = usePostAuth();
  const signupMutation = useMutation<AuthResponse, Error, SignupPayload>({
    mutationKey: [SIGNUP_QUERY_KEY],
    mutationFn: authApi.signup,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
  });

  useMutationEvents(signupMutation, {
    onSuccess(data) {
      toast.success(data.message ?? 'Account created! Check your email to verify.');
      void handlePostAuth(data);
    },
    onError(error) {
      toast.error(error.message ?? 'Signup failed. Please try again.');
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => signupMutation.mutate(values))} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="signup-name" className="font-bold text-slate-700 ml-1">Full Name</Label>
          <Input 
            id="signup-name" 
            placeholder="John Doe" 
            className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#FF4500] font-medium"
            {...register('name')} 
          />
          {errors.name && <p className="text-xs text-red-500 font-bold ml-1">{errors.name.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="signup-email" className="font-bold text-slate-700 ml-1">Email</Label>
          <Input 
            id="signup-email" 
            type="email" 
            placeholder="name@company.com" 
            className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#FF4500] font-medium"
            {...register('email')} 
          />
          {errors.email && <p className="text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="signup-password" title="Password" className="font-bold text-slate-700 ml-1">Password</Label>
          <Input 
            id="signup-password" 
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
        disabled={signupMutation.isPending}
      >
        {signupMutation.isPending
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…</>
          : 'Create Account'}
      </Button>
    </form>
  );
}
