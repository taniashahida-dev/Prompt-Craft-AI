"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { 
  Sparkles, ArrowLeft, Copy, Check, Share2, 
  Layers, Clock, User, Tag, Terminal, ExternalLink, Calendar
} from "lucide-react";

export default function TemplateDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const { isAuthenticated } = useAuth();

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch the template details by ID
  const { data: templateData, isLoading: loadingTemplate, error: templateError } = useQuery({
    queryKey: ["template", id],
    queryFn: async () => {
      const res = await api.get(`/templates/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  const template = templateData?.success ? templateData.data : null;

  // Fetch related templates in the same category
  const { data: allTemplatesData, isLoading: loadingRelated } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await api.get("/templates");
      return res.data;
    },
    enabled: !!template?.category
  });

  const allTemplates = allTemplatesData?.success ? allTemplatesData.data : [];

  // Filter out the current template and filter by the same category
  const relatedTemplates = allTemplates
    .filter(t => t._id !== id && t.category.toLowerCase() === template?.category?.toLowerCase())
    .slice(0, 3); // Display top 3 related blueprints

  const handleCopyPrompt = () => {
    if (template?.fullPrompt) {
      navigator.clipboard.writeText(template.fullPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loadingTemplate) {
    return (
      <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col font-sans relative">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-28 space-y-8 animate-pulse">
          <div className="h-6 w-32 bg-white/5 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-64 w-full bg-white/5 rounded-3xl" />
              <div className="h-10 w-2/3 bg-white/5 rounded-xl" />
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-5/6 bg-white/5 rounded" />
              <div className="h-40 w-full bg-white/5 rounded-2xl" />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="h-48 w-full bg-white/5 rounded-2xl" />
              <div className="h-32 w-full bg-white/5 rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (templateError || !template) {
    return (
      <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col font-sans relative px-4">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto relative z-10">
          <div className="h-12 w-12 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white">Blueprint Not Found</h3>
          <p className="text-xs text-slate-400">
            The template blueprint you are trying to view does not exist or may have been deleted by its creator.
          </p>
          <button
            onClick={() => router.push("/explore")}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            Back to Explore Catalog
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col font-sans relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[550px] w-full max-w-7xl bg-gradient-to-b from-purple-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-28 relative z-10">
        
        {/* Back Link */}
        <button 
          onClick={() => router.push("/explore")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore Catalog
        </button>

        {/* Detail Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Template Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Banner cover image wrapper */}
            <div className="h-64 sm:h-80 w-full rounded-3xl overflow-hidden border border-white/10 relative bg-black/40">
              {template.imageUrl ? (
                <img 
                  src={template.imageUrl} 
                  alt={template.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-blue-600/10 via-indigo-600/10 to-purple-600/10 flex items-center justify-center text-purple-400/80">
                  <Sparkles className="h-16 w-16 animate-pulse" />
                </div>
              )}
              <span className="absolute top-4 right-4 px-3 py-1 rounded bg-black/70 border border-white/10 text-[10px] font-bold text-purple-400 uppercase tracking-wider shadow-lg">
                {template.category}
              </span>
            </div>

            {/* Metadata Info Row */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{template.title}</h2>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-slate-500" />
                  <span>
                    Created by: <strong className="text-slate-200">{template.createdBy?.name || "Community"}</strong>
                  </span>
                </div>
                <span className="hidden sm:inline text-slate-700">•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>
                    {new Date(template.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Short Description</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-white/2 p-5 rounded-2xl border border-white/5">
                {template.description}
              </p>
            </div>

            {/* Monospace Code Editor View */}
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Full Prompt Blueprint Guidelines</h4>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedPrompt ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedPrompt ? "Copied Blueprint" : "Copy Blueprint"}</span>
                </button>
              </div>
              <div className="p-5 rounded-2xl bg-black/60 border border-white/5 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap select-text max-h-[450px] overflow-y-auto custom-scrollbar shadow-inner">
                {template.fullPrompt}
              </div>
            </div>

            {/* Tags section */}
            {template.tags && template.tags.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-medium text-purple-300">
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Actions Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Action Box widget */}
            <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Execute Blueprint</h4>
              
              <button
                onClick={handleCopyPrompt}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedPrompt ? <Check className="h-4.5 w-4.5 text-emerald-400" /> : <Copy className="h-4.5 w-4.5 text-slate-400" />}
                <span>{copiedPrompt ? "Blueprint Copied!" : "Copy Instructions"}</span>
              </button>

              <button
                onClick={handleShareLink}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? <Check className="h-4.5 w-4.5 text-emerald-400" /> : <Share2 className="h-4.5 w-4.5 text-slate-400" />}
                <span>{copiedLink ? "Link Copied!" : "Share Template"}</span>
              </button>

              {isAuthenticated ? (
                <button
                  onClick={() => router.push(`/dashboard?tab=workspace`)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Terminal className="h-4.5 w-4.5" />
                  <span>Run in AI Workspace</span>
                </button>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Sign In to Run</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Author Information Widget */}
            <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-3.5 shadow-xl">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Creator Profile</h4>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow">
                  {(template.createdBy?.name || "C").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">{template.createdBy?.name || "Community Member"}</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">{template.createdBy?.email || "community@promptcraft.ai"}</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Related Templates Section */}
        {relatedTemplates.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Related Templates</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTemplates.map((rel) => (
                <div 
                  key={rel._id}
                  onClick={() => router.push(`/templates/${rel._id}`)}
                  className="glass-panel border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full hover:scale-[1.01] group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[8px] font-bold text-purple-400 uppercase tracking-wider">
                        {rel.category}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {new Date(rel.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">{rel.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{rel.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[10px] font-bold text-purple-400 group-hover:text-purple-300 transition-colors pt-4 mt-auto">
                    <span>Inspect Blueprint</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
