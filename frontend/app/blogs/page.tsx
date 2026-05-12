"use client";

import React from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  {
    title: "How to automate your lead generation in 2026",
    excerpt: "Discover the latest strategies and tools to build a highly effective lead generation machine using visual automation.",
    author: "Sarah Johnson",
    date: "May 10, 2026",
    category: "Guides"
  },
  {
    title: "Introducing FlowBuilder v2.0: What's new?",
    excerpt: "We've rebuilt our engine from the ground up to be faster, more reliable, and packed with new features requested by our community.",
    author: "David Chen",
    date: "May 5, 2026",
    category: "Updates"
  },
  {
    title: "Security best practices for API integrations",
    excerpt: "Learn how to keep your data safe while connecting multiple services and building complex workflows.",
    author: "Alex Rivera",
    date: "April 28, 2026",
    category: "Security"
  },
  {
    title: "Top 10 automation templates for SaaS founders",
    excerpt: "Save hours of manual work with these pre-built templates designed specifically for early-stage SaaS companies.",
    author: "Emma Wilson",
    date: "April 20, 2026",
    category: "Productivity"
  }
];

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black text-[#1A1A1A] tracking-tighter mb-6">
              Insights on <br />
              <span className="text-[#FF4500]">automation & scale</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Stories, guides, and updates from the FlowBuilder team and our community of automation experts.
            </p>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {posts.map((post, i) => (
              <div key={i} className="group flex flex-col gap-6 p-10 rounded-[50px] bg-white border border-slate-100 hover:border-[#FF4500]/20 transition-all hover:shadow-2xl hover:shadow-orange-100/50 relative overflow-hidden">
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 rounded-full bg-orange-50 text-[#FF4500] text-xs font-black uppercase tracking-widest border border-orange-100">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                </div>

                <h3 className="text-3xl font-black text-slate-900 leading-tight group-hover:text-[#FF4500] transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold overflow-hidden border-2 border-white shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt={post.author} />
                    </div>
                    <span className="text-sm font-bold text-slate-900">{post.author}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 group/dots cursor-pointer">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF4500]/40 group-hover/dots:bg-[#FF4500] transition-colors" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF4500]/40 group-hover/dots:bg-[#FF4500] transition-colors delay-75" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF4500]/40 group-hover/dots:bg-[#FF4500] transition-colors delay-150" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto rounded-[60px] bg-[#FF4500] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-orange-200">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
                 style={{ 
                   backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                   backgroundSize: '24px 24px'
                 }} 
            />
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8 relative z-10">
              Subscribe to our newsletter
            </h2>
            <p className="text-white/80 font-bold mb-10 text-lg relative z-10">
              Get the latest automation tips and FlowBuilder updates delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 h-14 rounded-full px-8 font-bold border-none focus:ring-4 focus:ring-white/20 outline-none shadow-xl"
              />
              <button className="bg-[#1A1A1B] hover:bg-black text-white px-10 h-14 rounded-full font-black shadow-xl transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
