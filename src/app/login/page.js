"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { BACKEND_URL } from "../../utils/config";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  // Parse query parameters for Google OAuth callback redirect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const errorMsg = urlParams.get("error");
      
      if (token) {
        localStorage.setItem("promptcraft_jwt", token);
        // Clean URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        setTimeout(() => {
          setSuccess(true);
        }, 0);
        
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      } else if (errorMsg) {
        setTimeout(() => {
          setError(errorMsg);
        }, 0);
      }
    }
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col items-center justify-center relative px-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 animate-pulse shadow-lg shadow-purple-500/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white animate-spin-slow" />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 blur opacity-30 animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">Loading...</span>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    if (!email) {
      setError("Email address is required.");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setError("Password is required.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    try {
      await login(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Invalid credentials.");
      setLoading(false);
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login("demo@promptcraft.ai", "demopass123");
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Demo login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col items-center justify-center relative px-4 py-12">
      {/* Background radial lines pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

      {/* Back button */}
      <button 
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Logo header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/20 mb-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="mt-1.5 text-xs text-slate-400">Log in to manage your AI prompt workspaces</p>
        </div>

        {/* Glassmorphic Form Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-purple-950/15 animate-fade-in">
          
          {/* Error Message banner */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold animate-pulse-slow">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message banner */}
          {success && (
            <div className="mb-4 flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" />
              <span>Login successful! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
              <div className="mt-1.5 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  disabled={loading || success}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors disabled:opacity-50"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Password</label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[10px] text-purple-400 hover:underline">Forgot password?</a>
              </div>
              <div className="mt-1.5 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading || success}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors disabled:opacity-50"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Signin Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 text-white text-sm font-bold transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 cursor-pointer animate-pulse-glow"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>

          {/* Predefined Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading || success}
            className="w-full py-3.5 rounded-xl border border-dashed border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 text-purple-300 hover:text-purple-200 text-xs font-bold transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            <Sparkles className="h-4 w-4" />
            <span>Sign In with Demo Sandbox</span>
          </button>

          {/* Social Sign-In Divider */}
          <div className="relative my-5 flex items-center justify-center text-[10px]">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <span className="relative bg-[#090526] px-3.5 text-slate-500 font-bold uppercase tracking-wider">Or Sign In with</span>
          </div>

          {/* Google SSO Redirect Link */}
          <div className="flex justify-center">
            <a
              href={`${BACKEND_URL}/api/auth/google`}
              className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer mt-1"
            >
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </a>
          </div>

          {/* Redirection link to register */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <button 
              onClick={() => router.push("/register")}
              className="text-purple-400 font-semibold hover:underline bg-transparent border-none cursor-pointer"
            >
              Register free
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
