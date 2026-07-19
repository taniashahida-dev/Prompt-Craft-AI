"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Sparkles, Target, Eye, Shield, Users, Heart, Zap, ArrowLeft 
} from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  const values = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-400" />,
      title: "Velo-Precision",
      description: "We optimize execution latency and prompt structural precision to deliver maximum reliability."
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-400" />,
      title: "Enterprise Security",
      description: "Prompt keys, secrets, and customer interaction history logs are protected by bank-grade security."
    },
    {
      icon: <Users className="h-6 w-6 text-purple-400" />,
      title: "Community First",
      description: "We empower prompt creators to share, monetize, and showcase their templates to the world."
    },
    {
      icon: <Heart className="h-6 w-6 text-pink-400" />,
      title: "Passion for AI",
      description: "We continuously track prompt engineering advancements to keep you ahead of the LLM curve."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col font-sans relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Ambient background blur */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[550px] w-full max-w-7xl bg-gradient-to-b from-blue-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-28 relative z-10">
        
        {/* Navigation back button */}
        <button 
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        {/* Hero Section */}
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Behind the Blueprint</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Reimagining Prompt Engineering
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            PromptCraft AI is a unified prompt management catalog built to help developers, creators, and teams construct, share, and debug production-grade LLM prompt templates.
          </p>
        </div>

        {/* Company Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-20">
          <div className="lg:col-span-7 space-y-5">
            <h3 className="text-xl font-bold text-white">Our Story</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In 2024, our founders noticed a recurring challenge in LLM development: prompt management was chaotic. Developers stored prompts in code repositories, marketing teams wrote instructions in Google Docs, and debugging prompts in production meant manual copy-pasting.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              PromptCraft AI was born to solve this. We built a central repository that bridges the gap between raw natural language instructions and repeatable, database-driven templates. Today, we empower thousands of builders to design, validate, and invoke prompt templates dynamically.
            </p>
          </div>
          
          <div className="lg:col-span-5">
            <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 bg-gradient-to-tr from-purple-900/10 to-indigo-900/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 pointer-events-none" />
              
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">10k+</span>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Prompt Builders</p>
              </div>
              <div className="h-px bg-white/5" />
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">500k+</span>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Prompts Generated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {/* Mission Card */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-purple-500/30 transition-all duration-300">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              To democratize prompt engineering by providing teams with unified tooling to structure, test, and integrate prompts across various LLM orchestration frameworks.
            </p>
          </div>

          {/* Vision Card */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-purple-500/30 transition-all duration-300">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600/20 to-pink-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              A future where prompt instructions are managed as modular, type-safe APIs, enabling AI-driven systems to adapt dynamically without breaking production schemas.
            </p>
          </div>
        </div>

        {/* Team Values Section */}
        <div className="space-y-8">
          <div className="text-center sm:text-left space-y-2">
            <h3 className="text-xl font-bold text-white">Our Core Values</h3>
            <p className="text-xs text-slate-400">The core principles that guide our team and dictate our development lifecycle.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <div 
                key={idx} 
                className="glass-panel border border-white/10 rounded-2xl p-5 space-y-3 hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div className="space-y-2.5">
                  <div className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center">
                    {val.icon}
                  </div>
                  <h4 className="text-xs font-bold text-white">{val.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{val.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
