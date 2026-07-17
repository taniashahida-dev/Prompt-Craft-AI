"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      q: "How does the Multi-Model cognitive engine work?",
      a: "Our system analyzes your input prompt for intent, length constraints, and analytical complexity. Based on this, it routes the query to the best-suited model (such as Claude 3.5 Sonnet for logical depth, GPT-4o for marketing copy, or Gemini Pro for large documents). This guarantees you get the absolute best output without managing separate subscriptions."
    },
    {
      q: "Can I use the generated content for commercial purposes?",
      a: "Yes! All content generated through PromptCraft AI is 100% owned by you. You have full commercial exploitation rights to publish, monetize, sell, or distribute any copy or code snippets generated on our platform."
    },
    {
      q: "What is the difference between legacy tools and PromptCraft?",
      a: "Legacy tools usually wrap a single basic model and output unstructured plain paragraphs. PromptCraft AI integrates multi-model engines, fine-tuned templates, strict outline-builders, SEO checkers, and developer syntax parsers inside a single premium workspace, delivering production-ready structures instead of plain text."
    },
    {
      q: "Do you offer custom API endpoints or team licensing?",
      a: "Absolutely. Our Enterprise plan includes custom API endpoints, shared organization libraries, fine-tuned custom voice models, and priority high-speed tokens. Please contact our sales team to customize a package."
    },
    {
      q: "How can I manage my subscription or cancel?",
      a: "You can upgrade, downgrade, or cancel your subscription at any time directly through the Billing tab in your workspace dashboard. There are no long-term contracts or cancellation fees."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-24 scroll-mt-16 bg-[#030014]/60">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-300">
            Support Center
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Got questions about token allocations, copyrights, or model routing? We&apos;ve got answers.
          </p>
        </div>

        {/* FAQ Accordion list */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-panel border border-white/5 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-white hover:bg-white/2 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base font-bold">{faq.q}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                    isOpen ? "transform rotate-180 text-purple-400" : ""
                  }`} />
                </button>

                {/* Accordion Answer Content */}
                <div className={`transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[300px] border-t border-white/5 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                }`}>
                  <p className="p-5 text-sm text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
