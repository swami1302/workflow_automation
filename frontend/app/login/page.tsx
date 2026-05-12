'use client';

import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { Zap } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-[440px] flex flex-col gap-8 relative z-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <Link href="/" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4500] flex items-center justify-center shadow-2xl shadow-orange-200 transition-transform group-hover:scale-110">
              <Zap className="w-7 h-7 text-white fill-white" />
            </div>
            <h1 className="text-3xl font-[900] tracking-tighter text-slate-900 mt-2">FlowBuilder</h1>
          </Link>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Welcome back to the future of automation</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 p-8 rounded-[40px] shadow-2xl shadow-slate-200/50">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-50 p-1.5 rounded-2xl h-14">
              <TabsTrigger 
                value="login" 
                className="rounded-xl font-black text-sm data-[state=active]:bg-white data-[state=active]:text-[#FF4500] data-[state=active]:shadow-sm transition-all"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="rounded-xl font-black text-sm data-[state=active]:bg-white data-[state=active]:text-[#FF4500] data-[state=active]:shadow-sm transition-all"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-0 focus-visible:outline-none">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="mt-0 focus-visible:outline-none">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </div>

        <p className="px-8 text-center text-xs text-slate-400 font-bold leading-relaxed">
          By continuing, you agree to our{' '}
          <Link href="#" className="text-slate-900 hover:text-[#FF4500] transition-colors">Terms</Link>
          {' '}and{' '}
          <Link href="#" className="text-slate-900 hover:text-[#FF4500] transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
