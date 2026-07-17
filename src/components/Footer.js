import React from "react";
import { Sparkles, MessageSquare, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#030014]/80 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 border-b border-white/5 pb-12">
          
          {/* Logo & Status */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-white">PromptCraft AI</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premium, multi-model AI workspace designed for professional copywriters, SaaS founders, and developers to generate structured content at light speed.
            </p>

            {/* Platform Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Product</span>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">AI Features</a></li>
              <li><a href="#categories" className="text-slate-400 hover:text-white transition-colors">Preset Templates</a></li>
              <li><a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing Plans</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Resources</span>
            <ul className="space-y-2 text-xs">
              <li><a href="#docs" onClick={(e) => e.preventDefault()} className="text-slate-400 hover:text-white transition-colors">API Docs</a></li>
              <li><a href="#faq" className="text-slate-400 hover:text-white transition-colors">FAQ Support</a></li>
              <li><a href="#blog" onClick={(e) => e.preventDefault()} className="text-slate-400 hover:text-white transition-colors">Guides & Blog</a></li>
              <li><a href="#status" onClick={(e) => e.preventDefault()} className="text-slate-400 hover:text-white transition-colors">System Metrics</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Company</span>
            <ul className="space-y-2 text-xs">
              <li><a href="#about" onClick={(e) => e.preventDefault()} className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#careers" onClick={(e) => e.preventDefault()} className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#security" onClick={(e) => e.preventDefault()} className="text-slate-400 hover:text-white transition-colors">Security</a></li>
              <li><a href="#privacy" onClick={(e) => e.preventDefault()} className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contacts & Social */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Connect</span>
            <div className="flex gap-3 text-slate-400">
              <a href="#twitter" onClick={(e) => e.preventDefault()} className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 hover:text-white transition-colors" title="Twitter/X">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#github" onClick={(e) => e.preventDefault()} className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 hover:text-white transition-colors" title="GitHub">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a href="#linkedin" onClick={(e) => e.preventDefault()} className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 hover:text-white transition-colors" title="LinkedIn">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
            <p className="text-[10px] text-slate-500">
              Support email: <br />
              <span className="font-semibold text-slate-300">support@promptcraft.ai</span>
            </p>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PromptCraft AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Designed & Built with</span>
            <Heart className="h-3 w-3 text-pink-500 fill-current" />
            <span>for elite creators.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
