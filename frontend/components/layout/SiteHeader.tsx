"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Zap, LogOut, Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "About", href: "/about" },
    { name: "Blogs", href: "/blogs" },
  ];

  return (
    <header className="w-full shrink-0 relative z-50">
      <nav className="h-24 flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 z-50">
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

        {/* Auth-aware nav actions (Desktop) */}
        {isInitialized && (
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 mr-2">
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
                  href="/auth/login"
                  className="text-sm font-bold text-slate-600 hover:text-[#FF4500] transition-colors px-4"
                >
                  Sign In
                </Link>
                <Link href="/auth/login">
                  <Button className="bg-[#FF4500] hover:bg-[#E63E00] text-white rounded-full px-7 font-bold h-11 shadow-lg shadow-orange-200">
                    Start for free
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-[100dvh] bg-white/95 backdrop-blur-xl z-40 flex flex-col pt-24 px-6 pb-6 overflow-y-auto">
          <div className="flex flex-col gap-3 mb-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "px-6 py-4 text-xl font-black rounded-2xl transition-all text-center",
                  pathname === link.href
                    ? "bg-[#FF4500] text-white shadow-lg shadow-orange-200"
                    : "bg-slate-50 text-slate-900"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-4">
            {isInitialized && (
              <>
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-2">
                      <Avatar className="h-12 w-12 border-2 border-orange-100 shrink-0">
                        <AvatarFallback className="bg-orange-50 text-[#FF4500] text-lg font-bold">
                          {getInitials(user.name, user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-base font-bold text-slate-900 leading-tight truncate">
                          {user.name ?? user.email}
                        </span>
                        <span className="text-sm font-medium text-slate-500">Logged in</span>
                      </div>
                    </div>
                    <Link href="/workflows" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-6 font-black h-14 text-lg">
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full border-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl font-black h-14 text-lg"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full border-2 border-slate-200 text-slate-900 hover:bg-slate-50 rounded-2xl font-black h-14 text-lg">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <Button className="w-full bg-[#FF4500] hover:bg-[#E63E00] text-white rounded-2xl px-7 font-black h-14 text-lg shadow-xl shadow-orange-200">
                        Start for free
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
