import React from "react";
import { TrendingUp, Users, Zap, Award } from "lucide-react";

export default function Statistics() {
  const stats = [
    {
      label: "Total Words Generated",
      value: "15.4M+",
      trend: "+2.3M this week",
      icon: TrendingUp,
      accent: "text-blue-400",
      bgGlow: "bg-blue-600/10",
      visual: (
        <div className="flex items-end gap-1.5 h-12 mt-4">
          <div className="w-full bg-blue-600/20 hover:bg-blue-600/40 rounded-t h-[40%] transition-all" />
          <div className="w-full bg-blue-600/20 hover:bg-blue-600/40 rounded-t h-[60%] transition-all" />
          <div className="w-full bg-blue-600/20 hover:bg-blue-600/40 rounded-t h-[50%] transition-all" />
          <div className="w-full bg-blue-600/20 hover:bg-blue-600/40 rounded-t h-[75%] transition-all" />
          <div className="w-full bg-blue-600/40 hover:bg-blue-600/60 rounded-t h-[90%] transition-all" />
        </div>
      )
    },
    {
      label: "Generation Speed",
      value: "10x Faster",
      trend: "Avg. 3.2s load time",
      icon: Zap,
      accent: "text-purple-400",
      bgGlow: "bg-purple-600/10",
      visual: (
        <div className="mt-4 space-y-2">
          <div>
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold mb-1">
              <span>LEGACY WRITING</span>
              <span>120 Min</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-slate-600 rounded-full w-full" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-purple-400 font-semibold mb-1">
              <span>PROMPTCRAFT ENGINE</span>
              <span>12 Min</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-[10%]" />
            </div>
          </div>
        </div>
      )
    },
    {
      label: "User Satisfaction",
      value: "99.8%",
      trend: "Based on 4,000+ reviews",
      icon: Award,
      accent: "text-pink-400",
      bgGlow: "bg-pink-600/10",
      visual: (
        <div className="flex items-center gap-4 mt-3">
          {/* Radial progress ring */}
          <div className="relative h-12 w-12 flex items-center justify-center">
            <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
              <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-pink-500" strokeDasharray="99.8, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="text-[10px] font-bold text-white">99.8%</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">9.9/10 average G2 Crowd rating</span>
        </div>
      )
    },
    {
      label: "Active Creators Base",
      value: "45,000+",
      trend: "Across 140+ countries",
      icon: Users,
      accent: "text-indigo-400",
      bgGlow: "bg-indigo-600/10",
      visual: (
        <div className="flex -space-x-2 mt-4 justify-start items-center">
          {["https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=64", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=64"].map((src, i) => (
            <img key={i} src={src} alt="User Avatar" className="h-8 w-8 rounded-full object-cover ring-2 ring-[#030014]" />
          ))}
          <div className="h-8 w-8 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-[10px] font-bold text-indigo-200 ring-2 ring-[#030014]">
            +2k
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="relative py-20 bg-[#030014]/60 border-y border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[600px] rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="relative group overflow-hidden rounded-2xl glass-panel p-6 hover:border-white/15 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
                  <div className={`p-2 rounded-lg ${stat.bgGlow} ${stat.accent}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</span>
                  <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">{stat.trend}</span>
                </div>

                {stat.visual}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
