"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Zap, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

function getInitials(name?: string | null, email?: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return (email?.[0] ?? "U").toUpperCase();
}

export function SiteHeader() {
  const { user, isAuthenticated, isInitialized, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "About", href: "/about" },
    { name: "Blogs", href: "/blogs" },
  ];

  return (
    <nav className="h-24 flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto w-full shrink-0 relative z-50">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-[#FF4500] flex items-center justify-center shadow-lg shadow-orange-200">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <span className="text-2xl font-black text-slate-900 tracking-tighter">FlowBuilder</span>
      </Link>

      {/* Pill Menu (Desktop) */}
      <div className="hidden md:flex items-center bg-white border border-slate-100 rounded-full px-2 py-1.5 shadow-sm">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-5 py-2 text-sm font-semibold transition-all rounded-full",
              pathname === link.href
                ? "text-[#FF4500] bg-orange-50"
                : "text-slate-600 hover:text-[#FF4500]"
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Auth-aware nav actions */}
      {isInitialized && (
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <div className="hidden sm:flex items-center gap-3 mr-2">
                <Avatar className="h-9 w-9 border-2 border-orange-100">
                  <AvatarFallback className="bg-orange-50 text-[#FF4500] text-sm font-bold">
                    {getInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 leading-tight">
                    {user.name ?? user.email}
                  </span>
                </div>
              </div>
              <Link href="/workflows">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 font-bold h-11">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-slate-400 hover:text-[#FF4500] hover:bg-orange-50 rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:block text-sm font-bold text-slate-600 hover:text-[#FF4500] transition-colors px-4"
              >
                Sign In
              </Link>
              <Link href="/login">
                <Button className="bg-[#FF4500] hover:bg-[#E63E00] text-white rounded-full px-7 font-bold h-11 shadow-lg shadow-orange-200">
                  Start for free
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
