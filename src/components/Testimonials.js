import React from "react";
import { Star, Sparkles, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Marcus Vance",
      role: "Growth Director at HyperLoop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128",
      text: "PromptCraft AI transformed our content operation overnight. We went from writing 3 blog posts a week to publishing daily high-quality newsletters and articles. Our SEO traffic is up 140% in just two months.",
      rating: 5,
      className: "md:col-span-1"
    },
    {
      name: "Sarah Chen",
      role: "Lead Copywriter & Freelancer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128",
      text: "I was skeptical about AI writing tools, but PromptCraft is in a different league. The FastAPI and Markdown exports integrate directly into my workflow. It generates actual structured layouts instead of unstructured paragraphs.",
      rating: 5,
      className: "md:col-span-1"
    },
    {
      name: "Elena Rostova",
      role: "Content Creator & Founder",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128",
      featured: true,
      text: "We replaced three separate writing assistants with PromptCraft AI and saved over $1,200 monthly. The multi-model routing automatically swaps to Claude 3.5 for deep thinking tasks and GPT-4o for marketing copies. It is truly the ultimate production dashboard for content creation.",
      rating: 5,
      className: "md:col-span-2 border-purple-500/40 bg-gradient-to-tr from-purple-950/20 via-indigo-950/20 to-pink-950/10 shadow-lg shadow-purple-500/5"
    },
    {
      name: "Devon Reynolds",
      role: "SaaS Developer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128",
      text: "The developer templates are incredibly accurate. The FastAPI boilerplates save me hours of searching for standard authentication syntax. It's clean, fast, and stays up-to-date.",
      rating: 5,
      className: "md:col-span-1"
    },
    {
      name: "Julia Vance",
      role: "Marketing Manager",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=128",
      text: "Our team collaborates directly inside the PromptLibrary. Sharing prompts across workspace accounts has made our marketing messaging completely uniform. Our click-through-rates have boosted by 27%!",
      rating: 5,
      className: "md:col-span-1"
    }
  ];

  return (
    <section id="testimonials" className="relative py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-xs font-semibold text-pink-300">
            User Success
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Loved by Modern <span className="text-gradient">Creators and Builders</span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Hear from SaaS founders, copywriters, and developers who have integrated PromptCraft AI into their daily production workflows.
          </p>
        </div>

        {/* Masonry-style grid layout */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, index) => (
            <div
              key={index}
              className={`relative rounded-2xl glass-panel p-6 sm:p-8 flex flex-col justify-between hover:border-white/15 transition-all duration-300 ${test.className}`}
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-white/3 pointer-events-none" />

              <div>
                {/* Rating stars */}
                <div className="flex gap-1 text-amber-400">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-full fill-current" />
                  ))}
                </div>

                {/* Text Content */}
                <p className={`mt-6 text-sm sm:text-base leading-relaxed ${test.featured ? "text-slate-200" : "text-slate-300"}`}>
                  &quot;{test.text}&quot;
                </p>
              </div>

              {/* Profile Card */}
              <div className="mt-8 flex items-center gap-3">
                <img src={test.avatar} alt={test.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{test.name}</span>
                    {test.featured && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold uppercase tracking-wider">
                        <Sparkles className="h-2 w-2" />
                        Featured
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold block">{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
