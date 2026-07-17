"use client";

import React, { useState } from "react";
import { Sparkles, Send, Check } from "lucide-react";

export default function CTA({ onLogin }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background glow radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] sm:h-[800px] sm:w-[800px] rounded-full bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-pink-600/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-[#030014]/60 p-8 sm:p-12 md:p-16 text-center shadow-2xl shadow-purple-900/10">
          
          {/* Glowing gradient grid behind border */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

          {/* Icon Badge */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/20">
            <Sparkles className="h-5 w-5" />
          </div>

          <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Supercharge Your Workflow <br className="hidden sm:inline" />
            With <span className="text-gradient">PromptCraft AI</span>
          </h2>
          
          <p className="mt-4 max-w-xl mx-auto text-base text-slate-400">
            Join 45k+ copywriters, founders, and developers. Lock in your free monthly tokens and start generating clean, structured copy in seconds.
          </p>

          {!submitted ? (
            /* Email Submit Box */
            <form onSubmit={handleSubmit} className="mt-10 max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 p-1.5 rounded-2xl bg-black/60 border border-white/10 focus-within:border-purple-500/50 transition-all duration-300">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your professional email"
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none w-full border-none"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Start Free Trial</span>
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                No credit card required. Cancel anytime.
              </p>
            </form>
          ) : (
            /* Success State */
            <div className="mt-10 max-w-md mx-auto p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center animate-pulse-slow">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-3">
                <Check className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Welcome aboard!</h4>
              <p className="mt-1 text-xs text-emerald-400">
                Success! We&apos;ve sent 10,000 free starter tokens to your inbox. Let&apos;s make content creation look easy! 🚀
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
