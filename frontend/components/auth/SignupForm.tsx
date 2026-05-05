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

import { useAuthApi, type SignupPayload } from '@/lib/api/auth';
import { usePostAuth } from '@/hooks/auth/usePostAuth';
import { useMutationEvents } from '@/hooks/useMutationEvents';
import { SignupSchema, type SignupFormValues } from '@/lib/validations';
import type { AuthResponse } from '@/lib/types/auth';
import { SIGNUP_QUERY_KEY } from '@/lib/constants/queryKeys';

export function SignupForm() {
  const authApi = useAuthApi();
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
    <form onSubmit={handleSubmit((values) => signupMutation.mutate(values))}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Enter your details to create your workspace</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="signup-name">Full Name</Label>
            <Input id="signup-name" placeholder="John Doe" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" type="email" placeholder="m@example.com" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input id="signup-password" type="password" {...register('password')} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={signupMutation.isPending}>
            {signupMutation.isPending
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…</>
              : 'Create Account'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
