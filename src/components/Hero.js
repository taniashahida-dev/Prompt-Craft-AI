"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Play, Terminal, FileText, Mail, Share2, Copy, Check, RefreshCw } from "lucide-react";

export default function Hero({ onLogin, isAuthenticated, onPromptGenerated }) {
  const templates = [
    {
      id: "blog",
      name: "Blog Intro",
      icon: FileText,
      prompt: "Write an engaging intro about the future of AI Agent coding.",
      output: "The era of manual boilerplate writing is coming to a close. As autonomous AI coding agents evolve from simple autocomplete tools into cooperative pair programmers, software development is undergoing a massive paradigm shift. PromptCraft AI stands at the forefront, bridging the gap between human intent and production-ready architectures.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      id: "email",
      name: "Launch Email",
      icon: Mail,
      prompt: "Create an email copy for launching our SaaS platform.",
      output: "Subject: Generate 10x Content Overnight 🚀\n\nHey there,\n\nAre you tired of staring at a blank page? Meet PromptCraft AI—the ultimate writing companion for modern teams. Start creating blogs, emails, and high-converting copy in seconds.\n\nClaim your free credits now!",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "code",
      name: "FastAPI Script",
      icon: Terminal,
      prompt: "Generate a fast FastAPI server with authentication.",
      output: "from fastapi import FastAPI, Depends, HTTPException\nfrom fastapi.security import OAuth2PasswordBearer\n\napp = FastAPI()\noauth2_scheme = OAuth2PasswordBearer(tokenUrl=\"token\")\n\n@app.get(\"/api/v1/generate\")\ndef generate_content(token: str = Depends(oauth2_scheme)):\n    return {\"status\": \"success\", \"data\": \"AI generated response\"}",
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: "social",
      name: "LinkedIn Post",
      icon: Share2,
      prompt: "Create an engaging LinkedIn post for launch day.",
      output: "🚀 Exciting news! Today we are officially launching PromptCraft AI v2.0.\n\n✨ 10x faster generation times\n✨ Deep-indigo multi-model context processing\n✨ Production-ready exports\n\nSay goodbye to writer's block. Try it out for free and let us know what you build! #AI #Copywriting #SaaS",
      color: "from-pink-500 to-blue-500"
    }
  ];

  const [activeTab, setActiveTab] = useState(templates[0]);
  const [displayText, setDisplayText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateGeneration = (template) => {
    setIsGenerating(true);
    setDisplayText("");
    setProgress(0);
    setCopied(false);

    // Simulate AI model latency/thinking
    let count = 0;
    const interval = setInterval(() => {
      count += 10;
      setProgress(count);
      if (count >= 100) {
        clearInterval(interval);
        
        // Start streaming text
        const text = template.output;
        let index = 0;
        const words = text.split(" ");
        let currentText = "";
        
        const streamInterval = setInterval(() => {
          if (index < words.length) {
            currentText += (index === 0 ? "" : " ") + words[index];
            setDisplayText(currentText);
            index++;
          } else {
            clearInterval(streamInterval);
            setIsGenerating(false);
            if (onPromptGenerated) {
              onPromptGenerated({
                prompt: template.prompt,
                output: template.output,
                category: template.name,
                words: template.output.split(" ").length
              });
            }
          }
        }, 60);
      }
    }, 150);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      simulateGeneration(activeTab);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-36">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] rounded-full bg-blue-600/10 blur-[80px] sm:blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 left-1/3 h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] rounded-full bg-purple-600/10 blur-[80px] sm:blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Version Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-semibold text-purple-300 mb-6 hover:border-purple-400/50 transition-colors">
              <Sparkles className="h-3 w-3 text-purple-400" />
              <span>Version 2.0: Multi-Model Playground is Live</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Craft Perfect Content at <span className="text-gradient">10x Speed</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-xl">
              PromptCraft AI brings advanced content writing, coding scripts, and marketing copy models under one premium glassmorphic dashboard. Zero boilerplate. Max conversions.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={onLogin}
                className="flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Generating Free"}
              </button>
              <a 
                href="#how-it-works"
                className="flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Watch Demo</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>10,000 Free Words</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Playground Scaffolding */}
          <div className="lg:col-span-7 w-full">
            <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl shadow-indigo-950/20 border border-white/10 max-w-2xl mx-auto">
              
              {/* Card Header (Mac-style buttons and prompt status) */}
              <div className="flex items-center justify-between px-4 py-3 bg-white/3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-pink-500/70" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/70" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-medium text-slate-400">PromptCraft-Engine-v2.0</span>
                </div>
              </div>

              {/* Playground Tabs */}
              <div className="grid grid-cols-4 border-b border-white/5">
                {templates.map((tpl) => {
                  const Icon = tpl.icon;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => !isGenerating && setActiveTab(tpl)}
                      disabled={isGenerating}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-1 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                        activeTab.id === tpl.id 
                          ? "border-purple-500 text-white bg-purple-500/5" 
                          : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/2"
                      } ${isGenerating ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tpl.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Playground Body */}
              <div className="p-5 flex flex-col gap-4">
                
                {/* Input Prompt Box */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Input Prompt</label>
                  <div className="mt-1 flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-sm font-medium text-slate-200 truncate pr-4">
                      &quot;{activeTab.prompt}&quot;
                    </span>
                    <button 
                      onClick={() => !isGenerating && simulateGeneration(activeTab)} 
                      disabled={isGenerating}
                      className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 transition-colors cursor-pointer disabled:opacity-50"
                      title="Regenerate"
                    >
                      <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Simulated AI Output Panel */}
                <div className="relative">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Generated Result</label>
                  
                  <div className="mt-1 min-h-[140px] p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-sm leading-relaxed text-slate-300 relative overflow-hidden select-text">
                    
                    {/* Running Loader or Bar */}
                    {isGenerating && progress < 100 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
                        <span className="text-xs font-semibold text-purple-400 mb-2">Analyzing Prompt Context...</span>
                        <div className="h-1.5 w-40 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Output display content */}
                    {displayText ? (
                      <p className="whitespace-pre-line">{displayText}</p>
                    ) : (
                      !isGenerating && <p className="text-slate-600 italic">Ready to generate...</p>
                    )}

                    {/* Cursor blinking */}
                    {isGenerating && progress >= 100 && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-purple-400 animate-pulse" />
                    )}
                  </div>

                  {/* Copy Button */}
                  {displayText && !isGenerating && (
                    <button 
                      onClick={handleCopy}
                      className="absolute right-3 bottom-3 p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
