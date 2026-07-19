"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log error to server console
    console.error("Application Render Error boundary caught:", error);
  }, [error]);

  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col items-center justify-center relative px-4 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background ambient blurs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6 relative z-10 animate-fade-in">
        
        {/* Error icon circle */}
        <div className="h-16 w-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto shadow-lg shadow-pink-500/5">
          <AlertTriangle className="h-8 w-8" />
        </div>

        {/* Text descriptions */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Something Went Wrong</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            An unexpected client exception occurred during the execution pipeline. The rendering engine has isolated this error successfully.
          </p>
        </div>

        {/* Error message detail block */}
        {error && (
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] text-pink-400 leading-relaxed text-left max-h-[120px] overflow-y-auto truncate">
            {error.message || "Unknown execution rendering issue."}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/10 text-white text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
          
          <button
            onClick={() => router.push("/")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </button>
        </div>

      </div>
    </div>
  );
}
