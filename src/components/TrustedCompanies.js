import React from "react";

export default function TrustedCompanies() {
  const companies = [
    {
      name: "Stripe",
      logo: (
        <svg className="h-6 text-slate-500 hover:text-indigo-400 transition-colors" viewBox="0 0 60 25" fill="currentColor">
          <path d="M54.05 10.15c0-4.14-2.12-7-5.91-7-3.9 0-6.13 2.86-6.13 7.08 0 4.8 2.5 7.15 6.32 7.15 1.84 0 3.32-.42 4.41-1.07V14.1c-1 .47-2.22.75-3.51.75-1.92 0-3.08-.85-3.21-2.5h11.23c.06-.8.1-1.63.1-2.2zm-8.81-1.57c0-1.46.85-2.48 2.08-2.48s1.95 1 1.95 2.48H45.24zM32.88 5.75c-1.39 0-2.25.75-2.67 1.41V3.47h-4v19.78h4.15V11.23c0-2 .88-3.15 2.53-3.15.53 0 1 .1 1.34.25V4.2c-.63-.29-1.08-.45-1.35-.45zM22.09 3.47h-4.15v2.28c-.82-1.48-2.31-2.28-4.22-2.28-3.41 0-6.28 2.76-6.28 7.09 0 4.6 2.65 7.14 6.09 7.14 2 .05 3.32-.78 4.26-2.26v2h4.15V3.47zm-4.15 7.15c0 2.21-1.36 3.65-3.15 3.65-2 0-3.21-1.44-3.21-3.65 0-2.3 1.25-3.64 3.21-3.64 1.83.05 3.15 1.48 3.15 3.64zM2.87 9.87C2.87 8 4.29 7.18 7.1 7c2.32-.15 4.31.25 5.27.7V4.31c-1.3-.64-3.32-.98-5.26-.98-4.49 0-7.39 2.1-7.39 6.22 0 5.48 7.23 4.58 7.23 6.94 0 2-2 2.61-4.71 2.61a9.23 9.23 0 0 1-5.69-1.89v3.74c1.78.79 4.1 1.15 5.92 1.15 4.85 0 8.63-2 8.63-6.42.02-5.74-7.24-4.83-7.24-6.81zM58.33 3.47h-4.15v13.91h4.15V3.47zM58.33 0h-4.15v2.22h4.15V0z" />
        </svg>
      )
    },
    {
      name: "Vercel",
      logo: (
        <div className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors cursor-pointer font-bold tracking-wider">
          <svg className="h-5 w-5" viewBox="0 0 116 100" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M57.5 0L115 100H0L57.5 0Z" />
          </svg>
          <span className="text-sm font-sans tracking-widest uppercase">VERCEL</span>
        </div>
      )
    },
    {
      name: "HubSpot",
      logo: (
        <div className="flex items-center gap-1 text-slate-500 hover:text-amber-500 transition-colors cursor-pointer font-semibold">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span className="text-sm font-sans tracking-wide">HubSpot</span>
        </div>
      )
    },
    {
      name: "Framer",
      logo: (
        <div className="flex items-center gap-2 text-slate-500 hover:text-pink-400 transition-colors cursor-pointer font-semibold">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 2h14v6h-7l7 7H5v-6h7l-7-7z" />
          </svg>
          <span className="text-sm font-sans">Framer</span>
        </div>
      )
    },
    {
      name: "Figma",
      logo: (
        <div className="flex items-center gap-1 text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer font-semibold">
          <svg className="h-6 w-6" viewBox="0 0 100 150" fill="currentColor">
            <path d="M25 0h50c13.8 0 25 11.2 25 25s-11.2 25-25 25H25C11.2 50 0 38.8 0 25S11.2 0 25 0zm0 50h50c13.8 0 25 11.2 25 25s-11.2 25-25 25H25C11.2 100 0 88.8 0 75s11.2-25 25-25zm25 50h25c13.8 0 25 11.2 25 25s-11.2 25-25 25S50 138.8 50 125v-25zM25 100c13.8 0 25 11.2 25 25v25c0 13.8-11.2 25-25 25S0 163.8 0 150v-25c0-13.8 11.2-25 25-25z" />
          </svg>
          <span className="text-sm font-sans">Figma</span>
        </div>
      )
    },
    {
      name: "Shopify",
      logo: (
        <div className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-500 transition-colors cursor-pointer font-bold">
          <span className="text-sm font-sans tracking-wide">shopify</span>
        </div>
      )
    },
    {
      name: "Slack",
      logo: (
        <div className="flex items-center gap-2 text-slate-500 hover:text-purple-400 transition-colors cursor-pointer font-bold">
          <svg className="h-5 w-5" viewBox="0 0 100 100" fill="currentColor">
            <path d="M22 61.5c0-5.5-4.5-10-10-10S2 56 2 61.5 6.5 71.5 12 71.5h10v-10zM32 61.5c0 5.5-4.5 10-10 10s-10-4.5-10-10V12c0-5.5 4.5-10 10-10s10 4.5 10 10v49.5zM38.5 22c5.5 0 10-4.5 10-10S44 2 38.5 2 28.5 6.5 28.5 12v10h10zM38.5 32c-5.5 0-10 4.5-10 10v49.5c0 5.5 4.5 10 10 10s10-4.5 10-10V42c0-5.5-4.5-10-10-10z" />
          </svg>
          <span className="text-sm font-sans tracking-wide">slack</span>
        </div>
      )
    }
  ];

  return (
    <section className="relative py-12 border-y border-white/5 bg-[#030014]/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Trusted by innovators at modern creators and teams
        </p>
        
        {/* Infinite Scrolling Ticker container */}
        <div className="mt-8 relative w-full flex items-center overflow-x-hidden">
          {/* Fading side overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#030014] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#030014] to-transparent z-10 pointer-events-none" />
          
          {/* Moving Ticker */}
          <div className="flex w-max gap-16 items-center animate-marquee no-scrollbar">
            {/* First Set of Logos */}
            {companies.map((company, index) => (
              <div key={`company-1-${index}`} className="flex-shrink-0 flex items-center justify-center min-w-[120px] transition-transform hover:scale-105 duration-300">
                {company.logo}
              </div>
            ))}
            
            {/* Second Set of Logos (for infinite visual wrap-around) */}
            {companies.map((company, index) => (
              <div key={`company-2-${index}`} className="flex-shrink-0 flex items-center justify-center min-w-[120px] transition-transform hover:scale-105 duration-300">
                {company.logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
