"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Chrome } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-[400px] flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-200">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Workflow Builder</h1>
          <p className="text-sm text-slate-500">Automate your tasks with ease.</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Welcome back</CardTitle>
                <CardDescription>
                  Enter your email to sign in to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="bg-white">
                    <Github className="mr-2 h-4 w-4" />
                    Github
                  </Button>
                  <Button variant="outline" className="bg-white">
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
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
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs text-orange-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/workflows" className="w-full">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800">Login</Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Create an account</CardTitle>
                <CardDescription>
                  Enter your details to create your workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" placeholder="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="m@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/workflows" className="w-full">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">Create Account</Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <p className="px-8 text-center text-sm text-slate-500">
          By clicking continue, you agree to our{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-orange-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-orange-600">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
