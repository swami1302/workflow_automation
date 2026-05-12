import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Toaster } from "@/components/ui/sonner"
import { MouseTrail } from "@/components/ui/MouseTrail";
import { GridBackground } from "@/components/ui/GridBackground";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowBuilder - Visual Automation Platform",
  description: "Automate your workflow without writing code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-orange-100 selection:text-orange-900`}
      >
        <AppProviders>
          <Analytics />
          <GridBackground />
          <MouseTrail />
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}

