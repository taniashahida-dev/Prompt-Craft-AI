"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedCompanies from "@/components/TrustedCompanies";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Categories from "@/components/Categories";
import Statistics from "@/components/Statistics";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

// Additional Lucide icons for dashboard layouts
import { 
  Key, ShieldCheck, Mail, CreditCard, Sparkles, 
  Layers, Copy, Check, Play, RefreshCw, Send, 
  Trash2, ExternalLink
} from "lucide-react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [historyItems, setHistoryItems] = useState([
    { id: 1, prompt: "Create a welcome email for PromptCraft", time: "10m ago", category: "Email", words: 120 },
    { id: 2, prompt: "Write FastAPI custom router with JWT token auth", time: "1h ago", category: "Coding", words: 240 },
    { id: 3, prompt: "Write engaging LinkedIn announcement post", time: "1d ago", category: "Social", words: 85 }
  ]);

  // Check if simulated JWT exists on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("promptcraft_jwt");
      if (token) {
        setTimeout(() => {
          setIsAuthenticated(true);
        }, 0);
      }
    }
  }, []);

  const handleLogin = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("promptcraft_jwt", "mock-jwt-header-token-12345");
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("promptcraft_jwt");
      setIsAuthenticated(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText("pc_live_51Ny93KjUu8B3a7Fh4oPq92Jz");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleDeleteHistory = (id) => {
    setHistoryItems(historyItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col font-sans select-none scroll-smooth relative">
      {/* Background grid lines pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />
      
      {/* Dynamic ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-7xl bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      {/* Dynamic navbar (Sticky, active highlighting scroll-spy) */}
      <Navbar 
        isAuthenticated={isAuthenticated} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />
      
      {/* Main Content Layout */}
      <main className="flex-1 relative z-10 pt-16">
        
        {/* LOGGED OUT VIEWPORT PANELS */}
        {!isAuthenticated ? (
          <>
            <div id="home">
              <Hero isAuthenticated={isAuthenticated} onLogin={handleLogin} />
            </div>
            <TrustedCompanies />
            <div id="about">
              <Features />
              <HowItWorks />
            </div>
            <div id="explore">
              <Categories />
            </div>
            <Statistics />
            <Pricing />
            <Testimonials />
            <FAQ />
            <div id="contact">
              <CTA onLogin={handleLogin} />
            </div>
          </>
        ) : (
          /* LOGGED IN WORKSPACE DASHBOARD PANELS */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
            
            {/* 1. HOME PANEL (Logged-in welcome & stats summary) */}
            <section id="home" className="scroll-mt-20">
              <div className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/30 via-[#0c0824] to-[#030014] relative overflow-hidden">
                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <span className="px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-semibold text-purple-300">
                      Pro Workspace Unlocked
                    </span>
                    <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">
                      Welcome back, <span className="text-gradient">Alex Morgan</span>
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 max-w-xl">
                      Select templates below, configure custom routing, or copy active API credentials to initiate workspace generation tools.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" })}
                      className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
                    >
                      Open AI Playground
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. EXPLORE PANEL (Preset templates catalog) */}
            <div id="explore" className="scroll-mt-20">
              <Categories />
            </div>

            {/* 3. DASHBOARD PANEL (Usage metrics, circular charts) */}
            <section id="dashboard" className="scroll-mt-20 space-y-8">
              <div className="max-w-3xl">
                <h3 className="text-2xl font-extrabold text-white tracking-tight">Workspace Usage Dashboard</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Track dynamic token depletion metrics, billing metrics, and resource credits.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Chart 1: Words Counter */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-white/15 transition-all">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                    <span>Monthly Word Allowance</span>
                    <span className="text-purple-400">24,500 / 100,000 words</span>
                  </div>
                  <div className="mt-6 flex items-center justify-center">
                    {/* SVG Radial ring */}
                    <div className="relative h-24 w-24 flex items-center justify-center">
                      <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                        <path className="text-slate-800" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-purple-500" strokeDasharray="24.5, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="text-sm font-bold text-white">24.5%</span>
                    </div>
                  </div>
                  <div className="mt-6 text-xs text-slate-500 text-center font-medium">
                    Resetting in 14 days (August 1st)
                  </div>
                </div>

                {/* Chart 2: Active Keys */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-white/15 transition-all">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                    <span>Multi-Model Balance</span>
                    <span className="text-blue-400">Optimal Routing</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300">Claude 3.5 (Logic)</span>
                      <span className="font-semibold text-white">45% shares</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full w-[45%]" />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300">GPT-4o (Copywriting)</span>
                      <span className="font-semibold text-white">55% shares</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-[55%]" />
                    </div>
                  </div>
                  <div className="mt-6 text-xs text-slate-500 text-center font-medium">
                    Adjust share ratios in settings
                  </div>
                </div>

                {/* Chart 3: Speed index */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-white/15 transition-all">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                    <span>Performance Speed Metrics</span>
                    <span className="text-emerald-400">Excellent</span>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-3xl font-extrabold text-white">3.12s</span>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold mt-1">Average Model Response Latency</span>
                  </div>
                  <div className="mt-6 text-xs text-slate-500 text-center font-medium">
                    10x speed boost compared to manual writing
                  </div>
                </div>
              </div>
            </section>

            {/* 4. AI WORKSPACE PANEL (Prompt-to-code simulator playground) */}
            <section id="workspace" className="scroll-mt-20 space-y-6">
              <div className="max-w-3xl">
                <h3 className="text-2xl font-extrabold text-white tracking-tight">AI Playground Workspace</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Select predefined tabs or type complex prompt queries to stream AI content immediately.
                </p>
              </div>
              <Hero isAuthenticated={isAuthenticated} onLogin={handleLogin} />
            </section>

            {/* 5. HISTORY PANEL (List of past prompts with delete / copy metrics) */}
            <section id="history" className="scroll-mt-20 space-y-6">
              <div className="max-w-3xl">
                <h3 className="text-2xl font-extrabold text-white tracking-tight">My Generation History</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Manage recently generated snippets, copy logs, or clear storage history.
                </p>
              </div>

              <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
                {historyItems.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {historyItems.map((item) => (
                      <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/2 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white truncate max-w-md">
                              &quot;{item.prompt}&quot;
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              {item.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                            <span>{item.time}</span>
                            <span>•</span>
                            <span>{item.words} words generated</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(item.prompt);
                            }}
                            className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Copy Prompt"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteHistory(item.id)}
                            className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/10 hover:border-pink-500/20 text-pink-400 hover:bg-pink-500/20 transition-colors cursor-pointer"
                            title="Delete Log"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-500 italic">
                    No history items found. Run prompts in the AI playground to populate your history.
                  </div>
                )}
              </div>
            </section>

            {/* 6. PROFILE PANEL (User detail configurations, API settings keys) */}
            <section id="profile" className="scroll-mt-20 space-y-6">
              <div className="max-w-3xl">
                <h3 className="text-2xl font-extrabold text-white tracking-tight">Account Profile & Settings</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Manage active API credentials, secret tokens, and organization billing limits.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-5 glass-panel rounded-2xl p-6 space-y-6 hover:border-white/15 transition-all">
                  <div className="flex items-center gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
                      alt="User avatar" 
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-purple-500"
                    />
                    <div>
                      <h4 className="font-bold text-white">Alex Morgan</h4>
                      <span className="text-xs text-purple-400 font-semibold block">Pro Creator Member</span>
                    </div>
                  </div>

                  <div className="space-y-3.5 border-t border-white/5 pt-6 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email Address</span>
                      <span className="font-semibold text-white">alex.morgan@promptcraft.ai</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Plan</span>
                      <span className="font-semibold text-white">Pro Creator ($29/mo)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment Status</span>
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Active Billing
                      </span>
                    </div>
                  </div>
                </div>

                {/* API Key Panel */}
                <div className="lg:col-span-7 glass-panel rounded-2xl p-6 space-y-6 hover:border-white/15 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                      <Key className="h-4.5 w-4.5" />
                      <span>Developer API Access Credentials</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Use active workspace keys to run PromptCraft generation routines directly inside custom backend servers. Keep this token secret.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 mt-4">
                    <code className="text-xs text-slate-300 font-mono select-all">
                      pc_live_51Ny93KjUu8B3a7Fh4oPq92...
                    </code>
                    <button 
                      onClick={handleCopyKey}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedKey ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Key</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/5">
                    <button className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer">
                      <span>View API Documentation</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* Brand Footer */}
      <Footer />
    </div>
  );
}
