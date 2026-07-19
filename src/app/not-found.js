"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Compass, Home } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col items-center justify-center relative px-4 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background ambient grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6 relative z-10 animate-fade-in">
        
        {/* Error icon circle */}
        <div className="h-16 w-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/5">
          <Compass className="h-8 w-8 animate-spin-slow" />
        </div>

        {/* Text descriptions */}
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold text-white">404</h2>
          <h3 className="text-lg font-bold text-slate-200 mt-1">Blueprint Not Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            The requested prompt route or template item does not exist or has been removed from our template registry index.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/10 text-white text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </button>
          
          <button
            onClick={() => router.push("/explore")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Browse Catalog</span>
          </button>
        </div>

      </div>
    </div>
  );
}
