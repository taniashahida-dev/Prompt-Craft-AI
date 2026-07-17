"use client";

import React, { useState } from "react";
import { Sparkles, Terminal, Mail, FileText, Share2, Timer, Check, ArrowRight } from "lucide-react";

export default function Categories() {
  const categories = [
    {
      id: "blog",
      name: "Long-form Blog Posts",
      icon: FileText,
      tagline: "Engage your audience with SEO-optimized long-form content.",
      prompts: [
        "Write a detailed guide on how to integrate AI Agents into Next.js apps.",
        "Draft a comparative analysis of Webflow vs Custom Coding for SaaS startups.",
        "Explain the basics of quantum computing using simple analogies."
      ],
      time: "Instant (~4.2s)",
      limit: "Up to 5,000 Words",
      outputTitle: "Ultimate Guide: Next.js + AI Agents",
      outputBody: "Artificial Intelligence has shifted from a novelty API to the core architecture of modern web apps. By coupling Next.js App Router with server-side AI endpoints, we can stream structured markdown straight into responsive interfaces. Here's how to structure your backend context loops to prevent token depletion and minimize user-perceived latencies..."
    },
    {
      id: "social",
      name: "Social Media Campaigning",
      icon: Share2,
      tagline: "Generate viral threads, hooks, and captions for LinkedIn & Twitter/X.",
      prompts: [
        "Create a LinkedIn post discussing why we switched from Webpack to Vite.",
        "Generate a Twitter/X thread outlining 5 design tips for dark-themed UIs.",
        "Write an Instagram caption for launching our desktop app workspace."
      ],
      time: "Ultra-fast (~1.8s)",
      limit: "Up to 800 Words",
      outputTitle: "Why We Switched to Vite",
      outputBody: "🚀 We just shaved 42 seconds off our development reload times. Here's why we moved our entire PromptCraft workspace from legacy bundling systems to Vite:\n\n1. Instant dev server startup via native ES modules.\n2. Light-speed Hot Module Replacement (HMR).\n3. Out-of-the-box support for Tailwind CSS v4.\n\nRead the full migration timeline inside our blog! 👇"
    },
    {
      id: "email",
      name: "Email Newsletters",
      icon: Mail,
      tagline: "Create high-converting cold email pitches, onboarding flows, and newsletters.",
      prompts: [
        "Draft a cold email to product leads proposing an AI content audit tool.",
        "Write a welcome email for subscribers onboarding to PromptCraft Pro.",
        "Create a product feature newsletter showcasing our new multi-model routing."
      ],
      time: "Fast (~2.5s)",
      limit: "Up to 1,500 Words",
      outputTitle: "Welcome to PromptCraft Pro!",
      outputBody: "Hey Alex,\n\nWelcome to PromptCraft Pro! Your workspace is fully unlocked and ready to build.\n\nHere are 3 ways to start generating premium copy immediately:\n• Set up your brand voice inside settings.\n• Try out the FastAPI developer model.\n• Share your workspace link with your team.\n\nLet's build something epic,\nThe PromptCraft Team"
    },
    {
      id: "dev",
      name: "Developer Scripts & Snippets",
      icon: Terminal,
      tagline: "Generate production-ready algorithms, server route configs, and CSS modules.",
      prompts: [
        "Write a custom React hook for handling debounce on search inputs.",
        "Generate a Dockerfile for containerizing a Next.js application.",
        "Create a Postgres schema configuration for a user-billing application."
      ],
      time: "Instant (~3.1s)",
      limit: "No word limits",
      outputTitle: "useDebounce Hook (React + JS)",
      outputBody: "import { useState, useEffect } } from 'react';\n\nexport function useDebounce(value, delay) {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n\n  useEffect(() => {\n    const handler = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n\n  return debouncedValue;\n}"
    }
  ];

  const [activeCat, setActiveCat] = useState(categories[0]);

  return (
    <section id="categories" className="relative py-24 scroll-mt-16 bg-[#030014]/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-300">
            AI Content Categories
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tailored Templates for <span className="text-gradient">Every Output</span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Choose from hundreds of preset modules fine-tuned for marketing, blogging, social copywriting, and backend engineering.
          </p>
        </div>

        {/* Tab Selector Links */}
        <div className="mt-12 flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                  activeCat.id === cat.id
                    ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/10"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Side: Prompts and Details */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl glass-panel border border-white/10">
              <div>
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">{activeCat.name}</span>
                <p className="mt-3 text-base text-slate-300 font-medium">
                  {activeCat.tagline}
                </p>
                
                {/* Pre-made prompts */}
                <div className="mt-6 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Example Prompts</span>
                  {activeCat.prompts.map((prompt, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors">
                      <Check className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <span>{prompt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats badges */}
              <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Avg. Generation Time</span>
                  <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-white">
                    <Timer className="h-4 w-4 text-emerald-400" />
                    <span>{activeCat.time}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Capacity Limit</span>
                  <span className="mt-1 block text-sm font-semibold text-white">{activeCat.limit}</span>
                </div>
              </div>
            </div>

            {/* Right Side: Output Preview */}
            <div className="lg:col-span-7 flex flex-col rounded-2xl bg-black/60 border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-white/3 border-b border-white/5">
                <span className="text-xs font-semibold text-slate-400 font-mono">live_output_preview.log</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="p-6 flex-1 flex flex-col gap-3 justify-start font-mono text-xs sm:text-sm leading-relaxed text-slate-300">
                <h4 className="font-sans font-bold text-white text-base border-b border-white/5 pb-2">
                  {activeCat.outputTitle}
                </h4>
                <p className="whitespace-pre-line text-slate-400 mt-2">
                  {activeCat.outputBody}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
