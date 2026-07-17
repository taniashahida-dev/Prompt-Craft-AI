"use client";

import React, { useState } from "react";
import { PenTool, Brain, ArrowUpRight, CloudLightning, Check, Globe } from "lucide-react";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Select Template & Enter Context",
      desc: "Pick from 100+ industry-focused prompts or type custom instructions. Feed files, URLs, or background context to guide the generation style.",
      icon: PenTool,
      preview: (
        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold">SEO Article</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 text-xs font-semibold">Social Hook</span>
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">PROMPT CONTEXT</span>
            <div className="p-3 rounded-xl bg-white/2 border border-white/5 text-xs text-slate-300 italic font-medium">
              &quot;Create a SaaS product page focusing on lightning-fast speed and dark-mode styling...&quot;
            </div>
          </div>
        </div>
      )
    },
    {
      title: "2. Real-Time Multi-Model Processing",
      desc: "PromptCraft AI routes your prompt to the best-suited model (Claude, GPT, or Gemini) based on speed, reasoning, and context limits. High-speed tokens process your request in seconds.",
      icon: Brain,
      preview: (
        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
            <span className="text-xs text-slate-400 font-semibold">Cognitive Routing</span>
            <span className="text-xs text-purple-400 font-bold">Engine active</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/2 border border-white/5">
              <span>Reasoning Depth</span>
              <span className="text-indigo-400 font-bold">99.8%</span>
            </div>
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/2 border border-white/5">
              <span>Token Flow Speed</span>
              <span className="text-purple-400 font-bold">120 tokens/sec</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "3. Optimize & Export Globally",
      desc: "Instantly check SEO scores, verify originality with the plagiarism checker, and publish directly to Webflow, HubSpot, or download clean markdown assets.",
      icon: CloudLightning,
      preview: (
        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
            <Check className="h-5 w-5 bg-emerald-500/10 p-0.5 rounded-full" />
            <span>SEO Score Optimized</span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors w-full justify-center">
              <Globe className="h-3.5 w-3.5" />
              <span>Sync to Webflow</span>
            </button>
            <button className="px-3 py-2 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-colors w-full text-center">
              Export MD
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="relative py-24 scroll-mt-16 bg-[#030014]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-semibold text-purple-300">
            Platform Workflow
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How It Works in <span className="text-gradient">Three Simple Steps</span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Follow the highly automated workflow that transforms rough draft ideas into enterprise-grade publication-ready copy.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Steps Left Selector */}
          <div className="lg:col-span-6 space-y-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`group p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-white/5 border-purple-500/50 shadow-xl shadow-purple-950/10 scale-[1.01]"
                      : "bg-transparent border-white/5 hover:bg-white/2 hover:border-white/10"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "bg-white/5 border-white/10 text-slate-400 group-hover:text-white"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`text-base sm:text-lg font-bold transition-colors ${
                        isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                      }`}>
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Steps Right Preview Window */}
          <div className="lg:col-span-6 w-full">
            <div className="relative p-1 rounded-3xl bg-gradient-to-r from-blue-500/25 to-purple-500/25 border border-white/10 shadow-2xl shadow-indigo-950/20 max-w-md mx-auto">
              <div className="p-6 rounded-[22px] bg-[#0c0824] space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-xs font-semibold text-slate-400">Interactive Preview Workspace</span>
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-700" />
                    <span className="h-2 w-2 rounded-full bg-slate-700" />
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                  </div>
                </div>

                <div className="transition-all duration-300">
                  {steps[activeStep].preview}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
