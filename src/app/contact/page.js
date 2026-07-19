"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Sparkles, Mail, Phone, MapPin, Send, Loader2, 
  CheckCircle2, AlertCircle, ArrowLeft
} from "lucide-react";

export default function ContactPage() {
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Please enter a subject.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);
    // Simulate contact form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col font-sans relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[550px] w-full max-w-7xl bg-gradient-to-b from-blue-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-28 relative z-10">
        
        {/* Navigation back button */}
        <button 
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        {/* Hero Section Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Connect with us</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Get in Touch
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Have questions about our enterprise features, API configurations, or custom prompt development? Send us a message and our team will get back to you shortly.
          </p>
        </div>

        {/* Form and info split container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact details & Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl bg-gradient-to-br from-white/2 to-white/0">
              <h3 className="text-lg font-bold text-white mb-2 border-b border-white/5 pb-3">Contact Information</h3>
              
              <div className="space-y-5">
                {/* Email detail */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Email Address</h5>
                    <a href="mailto:support@promptcraft.ai" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors mt-0.5 block">
                      support@promptcraft.ai
                    </a>
                  </div>
                </div>

                {/* Phone detail */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Phone Support</h5>
                    <a href="tel:+15550192834" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors mt-0.5 block">
                      +1 (555) 019-2834
                    </a>
                  </div>
                </div>

                {/* Address detail */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Headquarters</h5>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      100 Innovation Way, Suite 400<br />San Francisco, CA 94107
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Channels list */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Follow Our Updates</h4>
                <div className="flex items-center gap-3">
                  <a href="#" className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:text-white text-slate-400 transition-colors" title="Twitter/X">
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a href="#" className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:text-white text-slate-400 transition-colors" title="GitHub">
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </a>
                  <a href="#" className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:text-white text-slate-400 transition-colors" title="LinkedIn">
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form box */}
          <div className="lg:col-span-7">
            <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
              
              {submitted ? (
                <div className="p-8 text-center space-y-4 animate-fade-in">
                  <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Message Transmitted!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you for contacting PromptCraft AI. Your message was processed successfully, and our support team will reply within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-2 border-b border-white/5 pb-3">Send a Message</h3>
                  
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Full Name *</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-black/40 border focus:outline-none text-xs text-white placeholder-slate-600 transition-colors ${
                          errors.name ? "border-pink-500/50 focus:border-pink-500" : "border-white/5 focus:border-purple-500/50"
                        }`}
                      />
                      {errors.name && (
                        <span className="flex items-center gap-1 text-[10px] text-pink-400 mt-1 font-semibold animate-pulse-slow">
                          <AlertCircle className="h-3 w-3" />
                          <span>{errors.name}</span>
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address *</label>
                      <input
                        type="email"
                        placeholder="john@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-black/40 border focus:outline-none text-xs text-white placeholder-slate-600 transition-colors ${
                          errors.email ? "border-pink-500/50 focus:border-pink-500" : "border-white/5 focus:border-purple-500/50"
                        }`}
                      />
                      {errors.email && (
                        <span className="flex items-center gap-1 text-[10px] text-pink-400 mt-1 font-semibold animate-pulse-slow">
                          <AlertCircle className="h-3 w-3" />
                          <span>{errors.email}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Subject *</label>
                    <input
                      type="text"
                      placeholder="e.g. Enterprise License Query"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-black/40 border focus:outline-none text-xs text-white placeholder-slate-600 transition-colors ${
                        errors.subject ? "border-pink-500/50 focus:border-pink-500" : "border-white/5 focus:border-purple-500/50"
                      }`}
                    />
                    {errors.subject && (
                      <span className="flex items-center gap-1 text-[10px] text-pink-400 mt-1 font-semibold animate-pulse-slow">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.subject}</span>
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Message Description *</label>
                    <textarea
                      rows="5"
                      placeholder="Write your request details here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full mt-1.5 p-3.5 rounded-xl bg-black/40 border focus:outline-none text-xs text-white placeholder-slate-600 transition-colors resize-none ${
                        errors.message ? "border-pink-500/50 focus:border-pink-500" : "border-white/5 focus:border-purple-500/50"
                      }`}
                    />
                    {errors.message && (
                      <span className="flex items-center gap-1 text-[10px] text-pink-400 mt-1 font-semibold animate-pulse-slow">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.message}</span>
                      </span>
                    )}
                  </div>

                  {/* Submit trigger button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20 text-white text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
