"use client";

import React, { useState, useEffect } from "react";
import { 
  Menu, X, Bell, User, LogOut, Settings, 
  Sparkles, ChevronDown, Check, Home, Compass, 
  LayoutDashboard, Terminal, History, UserCheck
} from "lucide-react";

export default function Navbar({ isAuthenticated, onLogin, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Check scroll position for glassmorphic navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for scroll spy (Active Link Highlighting)
  useEffect(() => {
    const sections = isAuthenticated
      ? ["home", "explore", "dashboard", "workspace", "history", "profile"]
      : ["home", "explore", "about", "contact"];

    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px", // triggers when section is in the middle of viewport
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [isAuthenticated]);

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

  const mockNotifications = [
    { id: 1, text: "GPT-4o-mini generation completed", time: "2m ago", unread: true },
    { id: 2, text: "Weekly token allowance reset", time: "1h ago", unread: true },
    { id: 3, text: "Welcome to PromptCraft AI!", time: "1d ago", unread: false },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-[#030014]/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-purple-950/10" 
        : "bg-transparent border-b border-transparent"
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => handleLinkClick(e, "home")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              PromptCraft<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              // Logged Out links
              <>
                <a 
                  href="#home" 
                  onClick={(e) => handleLinkClick(e, "home")}
                  className={`text-sm font-semibold transition-colors ${
                    activeSection === "home" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Home
                </a>
                <a 
                  href="#explore" 
                  onClick={(e) => handleLinkClick(e, "explore")}
                  className={`text-sm font-semibold transition-colors ${
                    activeSection === "explore" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Explore
                </a>
                <a 
                  href="#about" 
                  onClick={(e) => handleLinkClick(e, "about")}
                  className={`text-sm font-semibold transition-colors ${
                    activeSection === "about" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  About
                </a>
                <a 
                  href="#contact" 
                  onClick={(e) => handleLinkClick(e, "contact")}
                  className={`text-sm font-semibold transition-colors ${
                    activeSection === "contact" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Contact
                </a>
              </>
            ) : (
              // Logged In links
              <>
                <a 
                  href="#home" 
                  onClick={(e) => handleLinkClick(e, "home")}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    activeSection === "home" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Home
                </a>
                <a 
                  href="#explore" 
                  onClick={(e) => handleLinkClick(e, "explore")}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    activeSection === "explore" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Compass className="h-4 w-4" />
                  Explore
                </a>
                <a 
                  href="#dashboard" 
                  onClick={(e) => handleLinkClick(e, "dashboard")}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    activeSection === "dashboard" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </a>
                <a 
                  href="#workspace" 
                  onClick={(e) => handleLinkClick(e, "workspace")}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    activeSection === "workspace" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Terminal className="h-4 w-4" />
                  AI Workspace
                </a>
                <a 
                  href="#history" 
                  onClick={(e) => handleLinkClick(e, "history")}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    activeSection === "history" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <History className="h-4 w-4" />
                  My History
                </a>
                <a 
                  href="#profile" 
                  onClick={(e) => handleLinkClick(e, "profile")}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    activeSection === "profile" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                  Profile
                </a>
              </>
            )}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={onLogin}
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                >
                  Login
                </button>
                <button 
                  onClick={onLogin}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-bold text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Register
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {/* Notifications Bell Dropdown */}
                <div className="relative">
                  <button 
                    onClick={toggleNotifications}
                    className="relative p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-pink-500 ring-2 ring-[#030014]" />
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl border border-white/10 bg-[#0c0824] p-4 text-slate-200 shadow-xl shadow-black/80 ring-1 ring-black/5 focus:outline-none">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                        <span className="font-semibold text-sm">Notifications</span>
                        <span className="text-xs text-blue-400 cursor-pointer hover:underline">Mark all read</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {mockNotifications.map((notif) => (
                          <div key={notif.id} className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex justify-between items-start">
                              <p className="text-xs font-medium text-slate-200">{notif.text}</p>
                              {notif.unread && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />}
                            </div>
                            <span className="text-[10px] text-slate-500 mt-1 block">{notif.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile User Avatar Dropdown */}
                <div className="relative">
                  <button 
                    onClick={toggleProfileDropdown}
                    className="flex items-center gap-2 p-1 rounded-full border border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
                      alt="User avatar" 
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <ChevronDown className="h-4 w-4 text-slate-400 mr-1 hidden sm:block" />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-white/10 bg-[#0c0824] p-2 text-slate-200 shadow-xl shadow-black/80 ring-1 ring-black/5 focus:outline-none">
                      <div className="px-3 py-2.5 border-b border-white/5 mb-1.5">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold truncate text-white">alex.morgan@promptcraft.ai</p>
                      </div>
                      <button 
                        onClick={(e) => { handleLinkClick(e, "profile"); setIsProfileDropdownOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </button>
                      <button 
                        onClick={(e) => { handleLinkClick(e, "profile"); setIsProfileDropdownOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>
                      <div className="h-px bg-white/5 my-1.5" />
                      <button 
                        onClick={() => {
                          onLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 rounded-lg transition-all cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburguer Menu Button */}
          <div className="flex md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 focus:outline-none transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#030014]/95 backdrop-blur-xl">
          <div className="space-y-1 px-4 py-4 sm:px-6">
            {!isAuthenticated ? (
              // Logged Out mobile menu links
              <>
                <a 
                  href="#home" 
                  onClick={(e) => handleLinkClick(e, "home")}
                  className={`block py-2 text-base font-semibold ${
                    activeSection === "home" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Home
                </a>
                <a 
                  href="#explore" 
                  onClick={(e) => handleLinkClick(e, "explore")}
                  className={`block py-2 text-base font-semibold ${
                    activeSection === "explore" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Explore
                </a>
                <a 
                  href="#about" 
                  onClick={(e) => handleLinkClick(e, "about")}
                  className={`block py-2 text-base font-semibold ${
                    activeSection === "about" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  About
                </a>
                <a 
                  href="#contact" 
                  onClick={(e) => handleLinkClick(e, "contact")}
                  className={`block py-2 text-base font-semibold ${
                    activeSection === "contact" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Contact
                </a>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex flex-col gap-2 pt-2">
                  <button 
                    onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
                    className="w-full py-2.5 text-center text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
                    className="w-full py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              </>
            ) : (
              // Logged In mobile menu links
              <>
                <a 
                  href="#home" 
                  onClick={(e) => handleLinkClick(e, "home")}
                  className={`flex items-center gap-3 py-2.5 text-base font-semibold ${
                    activeSection === "home" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Home className="h-5 w-5 text-indigo-400" />
                  Home
                </a>
                <a 
                  href="#explore" 
                  onClick={(e) => handleLinkClick(e, "explore")}
                  className={`flex items-center gap-3 py-2.5 text-base font-semibold ${
                    activeSection === "explore" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Compass className="h-5 w-5 text-indigo-400" />
                  Explore
                </a>
                <a 
                  href="#dashboard" 
                  onClick={(e) => handleLinkClick(e, "dashboard")}
                  className={`flex items-center gap-3 py-2.5 text-base font-semibold ${
                    activeSection === "dashboard" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5 text-indigo-400" />
                  Dashboard
                </a>
                <a 
                  href="#workspace" 
                  onClick={(e) => handleLinkClick(e, "workspace")}
                  className={`flex items-center gap-3 py-2.5 text-base font-semibold ${
                    activeSection === "workspace" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Terminal className="h-5 w-5 text-indigo-400" />
                  AI Workspace
                </a>
                <a 
                  href="#history" 
                  onClick={(e) => handleLinkClick(e, "history")}
                  className={`flex items-center gap-3 py-2.5 text-base font-semibold ${
                    activeSection === "history" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <History className="h-5 w-5 text-indigo-400" />
                  My History
                </a>
                <a 
                  href="#profile" 
                  onClick={(e) => handleLinkClick(e, "profile")}
                  className={`flex items-center gap-3 py-2.5 text-base font-semibold ${
                    activeSection === "profile" ? "text-purple-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <UserCheck className="h-5 w-5 text-indigo-400" />
                  Profile
                </a>
                <div className="h-px bg-white/10 my-4" />
                
                {/* Profile detail inside Mobile drawer */}
                <div className="flex items-center gap-3 py-2">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
                    alt="User avatar" 
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">Alex Morgan</p>
                    <p className="text-xs text-slate-400">alex.morgan@promptcraft.ai</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button 
                    onClick={(e) => handleLinkClick(e, "profile")}
                    className="flex items-center justify-center gap-2 py-2 text-sm text-slate-300 hover:text-white bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button 
                    onClick={(e) => handleLinkClick(e, "profile")}
                    className="flex items-center justify-center gap-2 py-2 text-sm text-slate-300 hover:text-white bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>
                <button 
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-pink-400 hover:text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
