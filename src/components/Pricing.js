"use client";

import React, { useState } from "react";
import { Check, Sparkles } from "lucide-react";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState("monthly"); // monthly or yearly

  const plans = [
    {
      name: "Starter",
      desc: "Perfect for exploring AI writing capabilities.",
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        "10,000 Free Starter Words",
        "Access to GPT-4o-mini model",
        "30+ writing template forms",
        "Standard generation speed",
        "1 User Seat"
      ],
      cta: "Start Free Trial",
      popular: false,
      accent: "border-white/5 bg-transparent"
    },
    {
      name: "Pro Creator",
      desc: "Ideal for marketers, writers, and developer teams.",
      priceMonthly: 29,
      priceYearly: 23, // ~20% off
      features: [
        "100,000 Words / Month",
        "Multi-Model Routing (Claude, GPT, Gemini)",
        "Advanced SEO scoring auditor",
        "Faster generation priority speeds",
        "3 User Seats & Share Libraries",
        "WordPress & Webflow direct publishing"
      ],
      cta: "Upgrade to Pro",
      popular: true,
      accent: "border-purple-500/50 bg-gradient-to-br from-[#0c0824] via-indigo-950/20 to-[#030014] shadow-lg shadow-purple-500/5"
    },
    {
      name: "Enterprise",
      desc: "Custom models and dedicated API access for scale.",
      priceMonthly: "Custom",
      priceYearly: "Custom",
      features: [
        "Unlimited Word Tokens",
        "Fine-tuned custom brand-voice models",
        "Dedicated API key endpoints",
        "Unlimited Team Workspace Seats",
        "24/7 dedicated account manager",
        "SLA and compliance logs"
      ],
      cta: "Contact Sales",
      popular: false,
      accent: "border-white/5 bg-transparent"
    }
  ];

  return (
    <section id="pricing" className="relative py-24 scroll-mt-16 bg-[#030014]/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-semibold text-purple-300">
            Flexible Pricing
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transparent Pricing for <span className="text-gradient">Any Scale</span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Choose a plan that fits your creation velocity. Save up to 20% by signing up for annual billing.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="mt-8 flex justify-center items-center gap-3">
            <span className={`text-sm font-semibold transition-colors ${billingPeriod === "monthly" ? "text-white" : "text-slate-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
              className="relative w-12 h-6 bg-white/10 rounded-full border border-white/5 cursor-pointer flex items-center p-0.5 focus:outline-none transition-all duration-300"
            >
              <div className={`h-4.5 w-4.5 bg-purple-500 rounded-full transition-transform duration-300 ${
                billingPeriod === "yearly" ? "transform translate-x-6" : ""
              }`} />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${billingPeriod === "yearly" ? "text-white" : "text-slate-500"}`}>
              <span>Yearly</span>
              <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 text-[10px] font-bold uppercase tracking-wider">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, idx) => {
            const isCustom = typeof plan.priceMonthly === "string";
            const price = billingPeriod === "monthly" ? plan.priceMonthly : plan.priceYearly;

            return (
              <div
                key={idx}
                className={`relative rounded-2xl border p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/15 ${
                  plan.popular ? "scale-100 lg:scale-[1.03] z-10" : ""
                } ${plan.accent}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full border border-purple-400 bg-purple-600 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-purple-500/25">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-2 text-xs text-slate-400">{plan.desc}</p>
                  
                  {/* Price */}
                  <div className="mt-6 flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {isCustom ? price : `$${price}`}
                    </span>
                    {!isCustom && (
                      <span className="ml-1 text-slate-500 text-sm font-semibold">
                        /{billingPeriod === "monthly" ? "mo" : "mo, billed annually"}
                      </span>
                    )}
                  </div>

                  <div className="h-px bg-white/5 my-6" />

                  {/* Features */}
                  <ul className="space-y-3.5">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0 bg-indigo-500/10 p-0.5 rounded-full" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  className={`mt-8 w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 text-white hover:scale-[1.01] active:scale-[0.99]"
                      : "bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
