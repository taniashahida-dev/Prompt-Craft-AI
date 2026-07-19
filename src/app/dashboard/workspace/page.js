"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Sparkles, Terminal, History, Layers, User, Settings, LogOut, Menu, X, 
  ChevronRight, ArrowLeft, Send, Loader2, Copy, Check, RefreshCw, 
  AlertCircle, CheckCircle2, FileText, Compass
} from "lucide-react";

export default function GeminiWorkspacePage() {
  const router = useRouter();
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form inputs state
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("Article");
  const [tone, setTone] = useState("Professional");
  const [outputLength, setOutputLength] = useState("medium");

  // Output states
  const [generatedOutput, setGeneratedOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [copiedText, setCopiedText] = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const [errorToast, setErrorToast] = useState("");

  // Route protection redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Sidebar navigation options
  const navigationItems = [
    { id: "overview", label: "Overview", icon: Terminal, route: "/dashboard?tab=overview" },
    { id: "workspace", label: "AI Content Generator", icon: Sparkles, route: "/dashboard/workspace" },
    { id: "improver", label: "AI Prompt Improver", icon: RefreshCw, route: "/dashboard/prompt-improver" },
    { id: "history", label: "My History", icon: History, route: "/dashboard/history" },
    { id: "templates", label: "Manage Templates", icon: Layers, route: "/dashboard/templates" },
    { id: "profile", label: "Profile", icon: User, route: "/dashboard?tab=profile" },
    { id: "settings", label: "Settings", icon: Settings, route: "/dashboard?tab=settings" }
  ];

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setErrorToast("Please enter a topic.");
      setTimeout(() => setErrorToast(""), 3000);
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedOutput("");
    setCopiedText(false);
    setErrorToast("");
    setSuccessToast("");

    // Start progress simulation loader
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 5;
      setGenerationProgress(Math.min(currentProgress, 95));
    }, 100);

    try {
      const res = await api.post("/prompts/generate", {
        topic: topic.trim(),
        contentType,
        tone,
        outputLength
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (res.data && res.data.success) {
        const fullOutputText = res.data.data.output;

        // Streaming typing effect: output words sequentially to make it feel alive!
        let index = 0;
        const words = fullOutputText.split(" ");
        let currentText = "";
        
        const streamInterval = setInterval(() => {
          if (index < words.length) {
            currentText += (index === 0 ? "" : " ") + words[index];
            setGeneratedOutput(currentText);
            index++;
          } else {
            clearInterval(streamInterval);
            setIsGenerating(false);
            setSuccessToast("AI Content generated and saved to history successfully!");
            setTimeout(() => setSuccessToast(""), 3500);
          }
        }, 25);
      } else {
        clearInterval(progressInterval);
        setIsGenerating(false);
        setErrorToast("Failed to generate content: Invalid response structure.");
      }
    } catch (err) {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setErrorToast(err.response?.data?.message || "Failed to establish server connection. Please try again.");
    }
  };

  const handleCopy = () => {
    if (generatedOutput) {
      navigator.clipboard.writeText(generatedOutput);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col items-center justify-center relative px-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 animate-pulse shadow-lg shadow-purple-500/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white animate-spin-slow" />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 blur opacity-30 animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">Loading AI Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col font-sans relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-7xl bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 flex-1 w-full flex flex-col relative z-10">
        
        {/* Mobile Sidebar Menu Button */}
        <div className="flex items-center justify-between md:hidden bg-white/2 border border-white/5 p-4 rounded-2xl mb-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            {user.profilePhoto || user.avatar ? (
              <img 
                src={user.profilePhoto || user.avatar} 
                alt={user.name} 
                className="h-8 w-8 rounded-lg object-cover border border-white/10" 
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs font-bold text-white truncate max-w-[150px]">{user.name}</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Success and Error Toasts */}
        {successToast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-2xl animate-fade-in">
            <CheckCircle2 className="h-4.5 w-4.5" />
            <span>{successToast}</span>
          </div>
        )}
        {errorToast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 p-4 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs font-semibold shadow-2xl animate-fade-in">
            <AlertCircle className="h-4.5 w-4.5" />
            <span>{errorToast}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 items-start flex-grow">
          
          {/* A. SIDEBAR NAVIGATION */}
          <aside className={`
            fixed md:sticky top-24 left-0 md:left-auto right-0 md:right-auto z-40
            md:block h-[calc(100vh-8rem)] w-full md:w-64 flex-shrink-0 
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            ${isSidebarOpen ? "px-4" : ""}
          `}>
            <div className="h-full bg-gradient-to-b from-[#0c0824] to-[#030014] border border-white/10 md:bg-white/5 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Profile Overview Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  {user.profilePhoto || user.avatar ? (
                    <img 
                      src={user.profilePhoto || user.avatar} 
                      alt={user.name} 
                      className="h-10 w-10 rounded-xl object-cover border border-white/10 shadow shadow-purple-500/25" 
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-extrabold shadow shadow-purple-500/25">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  {isSidebarOpen && (
                    <button 
                      onClick={() => setIsSidebarOpen(false)}
                      className="ml-auto p-1 text-slate-400 hover:text-white"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>

                {/* Sidebar Navigation Items */}
                <nav className="space-y-1.5">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === "workspace";
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          router.push(item.route);
                          setIsSidebarOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer
                          ${isActive 
                            ? "bg-gradient-to-r from-blue-600/25 to-purple-600/25 text-white border border-purple-500/30" 
                            : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"}
                        `}
                      >
                        <Icon className={`h-4.5 w-4.5 ${isActive ? "text-purple-400" : "text-slate-400"}`} />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Logout button */}
              <div>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 transition-all cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* B. MAIN WORKSPACE CONTENT */}
          <main className="flex-1 min-w-0 w-full">
            <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 min-h-[calc(100vh-12rem)] backdrop-blur-md space-y-6">
              
              <div>
                <h2 className="text-2xl font-extrabold text-white">Gemini AI Workspace</h2>
                <p className="text-xs text-slate-400 mt-1">Harness Google&apos;s Gemini models directly to generate and auto-save high-quality AI content blueprints.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Form Inputs (Left side) */}
                <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-4">
                  
                  {/* Topic input */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Generate Content Topic *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Benefits of microservices architecture in Node.js"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      disabled={isGenerating}
                      className="w-full mt-1 px-3 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors disabled:opacity-50"
                    />
                  </div>

                  {/* Content Type dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Content Type</label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      disabled={isGenerating}
                      className="w-full mt-1 px-3 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <option value="Article" className="bg-[#0c0824]">Blog Article</option>
                      <option value="Email" className="bg-[#0c0824]">Cold Email Outreach</option>
                      <option value="Social Post" className="bg-[#0c0824]">Social Media Post</option>
                      <option value="Ad Copy" className="bg-[#0c0824]">SaaS Landing Ad Copy</option>
                      <option value="Blog Post" className="bg-[#0c0824]">Brief Blog Outline</option>
                    </select>
                  </div>

                  {/* Tone dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Style Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      disabled={isGenerating}
                      className="w-full mt-1 px-3 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <option value="Professional" className="bg-[#0c0824]">Professional & Direct</option>
                      <option value="Casual" className="bg-[#0c0824]">Casual & Friendly</option>
                      <option value="Persuasive" className="bg-[#0c0824]">Persuasive & Sales-driven</option>
                      <option value="Witty" className="bg-[#0c0824]">Witty & Humorous</option>
                      <option value="Creative" className="bg-[#0c0824]">Creative & Expressive</option>
                    </select>
                  </div>

                  {/* Output Length selectors */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Output Length</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["short", "medium", "long"].map((len) => (
                        <button
                          key={len}
                          type="button"
                          onClick={() => setOutputLength(len)}
                          disabled={isGenerating}
                          className={`py-2 rounded-xl border text-[10px] font-bold uppercase transition-all cursor-pointer ${
                            outputLength === len 
                              ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-purple-500/40 text-white" 
                              : "bg-white/2 border-white/5 hover:border-white/10 text-slate-400 hover:text-white"
                          } disabled:opacity-50`}
                        >
                          {len}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isGenerating || !topic.trim()}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20 text-white text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Contacting Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Generate AI Content</span>
                      </>
                    )}
                  </button>

                </form>

                {/* Output View (Right side) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="relative space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gemini Output Blueprint</label>
                    
                    <div className="min-h-[300px] p-5 rounded-2xl bg-black/60 border border-white/5 font-mono text-xs leading-relaxed text-slate-300 relative overflow-hidden select-text shadow-inner">
                      
                      {/* Loading status progress bar */}
                      {isGenerating && generationProgress < 100 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-[1px] space-y-3">
                          <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase animate-pulse">Running Gemini content pipeline...</span>
                          <div className="h-1.5 w-44 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150"
                              style={{ width: `${generationProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {generatedOutput ? (
                        <p className="whitespace-pre-line">{generatedOutput}</p>
                      ) : (
                        !isGenerating && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-2">
                            <FileText className="h-8 w-8 text-slate-700 animate-pulse" />
                            <p className="text-slate-500 italic text-[11px] max-w-xs">
                              Configure the parameters on the left and trigger generation to run Gemini AI content models.
                            </p>
                          </div>
                        )
                      )}

                      {isGenerating && generationProgress >= 100 && (
                        <span className="inline-block w-1.5 h-4 ml-1 bg-purple-400 animate-pulse" />
                      )}
                    </div>

                    {/* Output action buttons */}
                    {generatedOutput && !isGenerating && (
                      <div className="absolute right-4 bottom-4 flex items-center gap-2">
                        <button 
                          onClick={handleCopy}
                          className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold"
                          title="Copy Output"
                        >
                          {copiedText ? (
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

                        <button 
                          onClick={() => handleGenerate()}
                          className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold"
                          title="Regenerate Output"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Regenerate</span>
                        </button>
                      </div>
                    )}

                  </div>
                </div>

              </div>

            </div>
          </main>

        </div>

      </div>

      <Footer />
    </div>
  );
}
