"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Sparkles, ArrowLeft, CheckCircle2, AlertCircle, 
  Loader2, Tag, Layers, FileText, Image as ImageIcon, FileCode2,
  Plus
} from "lucide-react";

export default function AddTemplatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Form Fields State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullPrompt, setFullPrompt] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Client Validation & Notification states
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Route protection redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // TanStack Query Mutation for Template Submission
  const mutation = useMutation({
    mutationFn: async (templatePayload) => {
      const res = await api.post("/templates", templatePayload);
      return res.data;
    },
    onSuccess: () => {
      setSuccessMessage("Template blueprint created successfully! Redirecting...");
      setErrorMessage("");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setTimeout(() => {
        router.push("/dashboard?tab=templates");
      }, 1500);
    },
    onError: (err) => {
      setErrorMessage(err.response?.data?.message || "Failed to connect to template database. Please try again.");
      setSuccessMessage("");
    }
  });

  const validateForm = () => {
    if (!title.trim()) {
      setValidationError("Template Title is required.");
      return false;
    }
    if (!category.trim()) {
      setValidationError("Category is required.");
      return false;
    }
    if (!shortDesc.trim()) {
      setValidationError("Short Description is required.");
      return false;
    }
    if (!fullPrompt.trim()) {
      setValidationError("Full Prompt blueprint is required.");
      return false;
    }
    if (imageUrl.trim()) {
      try {
        new URL(imageUrl);
      } catch (_) {
        setValidationError("Please enter a valid Image URL.");
        return false;
      }
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) return;

    // Split tags string by commas and sanitize
    const processedTags = tags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    mutation.mutate({
      title: title.trim(),
      category: category.trim(),
      description: shortDesc.trim(),
      fullPrompt: fullPrompt.trim(),
      tags: processedTags,
      imageUrl: imageUrl.trim()
    });
  };

  if (authLoading) {
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
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">Loading add templates panel...</span>
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

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-28 relative z-10">
        
        {/* Back navigation link button */}
        <button 
          onClick={() => router.push("/dashboard?tab=templates")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Manage Templates
        </button>

        {/* Branded Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow shadow-purple-500/25">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Add Prompt Template</h2>
            <p className="text-xs text-slate-400 mt-0.5">Design a new prompt blueprint structure for your workspace content generator.</p>
          </div>
        </div>

        {/* Branded Form panel */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-purple-950/15">
          
          {/* Form Error Banner */}
          {validationError && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold animate-pulse-slow">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Submission Error Banner */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-6 flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Title & Category inputs row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Template Title *</label>
                <div className="mt-1.5 relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Welcome Email Generator"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={mutation.isPending}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors disabled:opacity-50"
                  />
                  <FileCode2 className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Category *</label>
                <div className="mt-1.5 relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Email, Coding, Social"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={mutation.isPending}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors disabled:opacity-50"
                  />
                  <Layers className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Short Description *</label>
              <div className="mt-1.5 relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Design structured intro copy to engage platform signups."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  disabled={mutation.isPending}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors disabled:opacity-50"
                />
                <FileText className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
              </div>
            </div>

            {/* Full Prompt Description */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Full Prompt Blueprint *</label>
              <textarea
                required
                rows="5"
                placeholder="Write the complex instruction guidelines for the AI..."
                value={fullPrompt}
                onChange={(e) => setFullPrompt(e.target.value)}
                disabled={mutation.isPending}
                className="w-full mt-1.5 p-4 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors font-mono resize-none disabled:opacity-50"
              />
            </div>

            {/* Tags & Image URL row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tags (comma-separated)</label>
                <div className="mt-1.5 relative">
                  <input
                    type="text"
                    placeholder="e.g. copywriting, email, onboarding"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    disabled={mutation.isPending}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors disabled:opacity-50"
                  />
                  <Tag className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Image URL (Optional)</label>
                <div className="mt-1.5 relative">
                  <input
                    type="url"
                    placeholder="https://example.com/image.png"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    disabled={mutation.isPending}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors disabled:opacity-50"
                  />
                  <ImageIcon className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Form actions submit button */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 text-white text-xs font-bold transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Submitting Blueprint...</span>
                </>
              ) : (
                <span>Save Template Blueprint</span>
              )}
            </button>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
