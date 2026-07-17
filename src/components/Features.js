import React from "react";
import { 
  PenTool, Code, BarChart2, Cpu, Users, 
  Calendar, CheckCircle, ArrowUpRight, Globe2
} from "lucide-react";

export default function Features() {
  const coreFeatures = [
    {
      title: "Smart Article & Blog Architect",
      desc: "Produce structured, high-quality, long-form content optimized for SEO in one click. Features auto-linking and outline builders.",
      icon: PenTool,
      badge: "Popular",
      accent: "from-blue-500/20 to-indigo-500/20",
      className: "md:col-span-2",
      visual: (
        <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5 font-sans text-xs space-y-2">
          <div className="flex items-center gap-2 text-purple-400">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            <span>Keyword Focus: &quot;AI Coding Assistant&quot;</span>
          </div>
          <div className="h-2 w-3/4 bg-white/20 rounded" />
          <div className="h-2 w-full bg-white/10 rounded" />
          <div className="h-2 w-5/6 bg-white/10 rounded" />
          <div className="flex gap-2 pt-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">SEO Score: 98/100</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">1,240 Words</span>
          </div>
        </div>
      )
    },
    {
      title: "Universal Code Synthesizer",
      desc: "Write, debug, and translate code across 20+ programming languages. Instantly generate setup boilerplates.",
      icon: Code,
      accent: "from-indigo-500/20 to-purple-500/20",
      className: "md:col-span-1",
      visual: (
        <div className="mt-6 p-3 rounded-xl bg-[#090616] border border-white/5 font-mono text-[10px] text-slate-400 space-y-1">
          <div className="text-purple-400">const generate = async () =&gt; &#123;</div>
          <div className="pl-3">{"const res = await fetch(\"/api/v1\");"}</div>
          <div className="pl-3 text-blue-400">return res.json();</div>
          <div className="text-purple-400">&#125;;</div>
        </div>
      )
    },
    {
      title: "Multi-Model Cognitive Engine",
      desc: "Access GPT-4o, Claude 3.5 Sonnet, and Gemini Pro within a unified workspace. Automatically selects the optimal model.",
      icon: Cpu,
      badge: "Updated",
      accent: "from-purple-500/20 to-pink-500/20",
      className: "md:col-span-1",
      visual: (
        <div className="mt-6 flex flex-col gap-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300 font-medium">
            <span>Claude 3.5 Sonnet</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300 font-medium">
            <span>GPT-4o Engine</span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          </div>
        </div>
      )
    },
    {
      title: "Predictive Marketing Analytics",
      desc: "Analyze content conversions before you publish. Maximize click-through rates on newsletters, headlines, and social copy.",
      icon: BarChart2,
      accent: "from-pink-500/20 to-blue-500/20",
      className: "md:col-span-2",
      visual: (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">CTR Boost</span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">+27.4%</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Read Time</span>
            <span className="text-lg font-bold text-blue-400 mt-1 block">3.5 Min</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Ad Performance</span>
            <span className="text-lg font-bold text-purple-400 mt-1 block">Excellent</span>
          </div>
        </div>
      )
    },
    {
      title: "Collaborative Team Workspaces",
      desc: "Create shared prompt libraries, review AI outputs together, and manage roles and permissions across your organization.",
      icon: Users,
      accent: "from-purple-500/20 to-indigo-500/20",
      className: "md:col-span-1",
      visual: (
        <div className="mt-6 flex -space-x-2 justify-center items-center py-2">
          {["https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=64", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64"].map((src, i) => (
            <img key={i} src={src} alt="Team Member" className="h-8 w-8 rounded-full object-cover ring-2 ring-[#0c0824]" />
          ))}
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-[#0c0824]">
            +12
          </div>
        </div>
      )
    },
    {
      title: "Content Publishing Scheduler",
      desc: "Integrate with Webflow, WordPress, HubSpot, and social platforms. Queue your AI content for automated publishing.",
      icon: Calendar,
      accent: "from-blue-500/20 to-pink-500/20",
      className: "md:col-span-1",
      visual: (
        <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 space-y-2">
          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>SCHEDULED EXPORT</span>
            <span>TOMORROW 09:00 AM</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <Globe2 className="h-4 w-4 text-purple-400" />
            <span>Publish to WordPress</span>
          </div>
        </div>
      )
    },
    {
      title: "Built-in Plagiarism & Fact Checker",
      desc: "Rest easy knowing every sentence is factually verified and completely original. Checks citations and search index sources in real time.",
      icon: CheckCircle,
      accent: "from-emerald-500/20 to-indigo-500/20",
      className: "md:col-span-1",
      visual: (
        <div className="mt-6 flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>No plagiarism detected. 100% Unique.</span>
        </div>
      )
    }
  ];

  return (
    <section id="features" className="relative py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-300">
            Feature Capabilities
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            An Elite Suite for Professional <span className="text-gradient">Content Creators</span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Ditch multiple subscription plans. PromptCraft AI gives you enterprise-grade writing, SEO auditing, translation, and code generation models in one workspace.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreFeatures.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl glass-panel glass-panel-hover p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${feat.className || ""}`}
              >
                {/* Background colored hover glow */}
                <div className={`absolute -top-1/4 -right-1/4 h-48 w-48 rounded-full bg-gradient-to-tr ${feat.accent} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div>
                  {/* Top Header Card */}
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 group-hover:bg-purple-600 group-hover:border-purple-500 group-hover:text-white transition-all duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    {feat.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-pink-500/30 bg-pink-500/10 text-pink-300">
                        {feat.badge}
                      </span>
                    )}
                  </div>

                  {/* Title and Description */}
                  <h3 className="mt-6 text-lg sm:text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                {/* Render Custom Visual Mockup */}
                <div>
                  {feat.visual}
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors cursor-pointer">
                    <span>Learn more</span>
                    <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
