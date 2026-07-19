"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Sparkles, Terminal, History, Layers, User, Settings, LogOut, Menu, X, 
  ChevronRight, ArrowLeft, Loader2, Copy, Check, Trash2, Search, 
  ChevronLeft, AlertCircle, CheckCircle2, Calendar, FileText
} from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data states
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Success/Error toast states
  const [copiedId, setCopiedId] = useState(null);
  const [successToast, setSuccessToast] = useState("");
  const [errorToast, setErrorToast] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Sidebar navigation options
  const navigationItems = [
    { id: "overview", label: "Overview", icon: Terminal, route: "/dashboard?tab=overview" },
    { id: "workspace", label: "AI Content Generator", icon: Sparkles, route: "/dashboard/workspace" },
    { id: "improver", label: "AI Prompt Improver", icon: RefreshCwSymbol, route: "/dashboard/prompt-improver" },
    { id: "history", label: "My History", icon: History, route: "/dashboard/history" },
    { id: "templates", label: "Manage Templates", icon: Layers, route: "/dashboard/templates" },
    { id: "profile", label: "Profile", icon: User, route: "/dashboard?tab=profile" },
    { id: "settings", label: "Settings", icon: Settings, route: "/dashboard?tab=settings" }
  ];

  // RefreshCw Symbol placeholder mapping
  function RefreshCwSymbol(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
      </svg>
    );
  }

  // Load history data
  const loadHistory = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await api.get("/prompts");
      if (res.data && res.data.success) {
        setHistoryItems(res.data.data);
      }
    } catch (err) {
      console.error("Error loading history logs:", err);
      setErrorToast("Failed to load prompt history logs.");
      setTimeout(() => setErrorToast(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        loadHistory();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Copy handler
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete initiation handler
  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Delete confirmation handler
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/prompts/${itemToDelete._id}`);
      if (res.data && res.data.success) {
        setSuccessToast("History log removed successfully.");
        setTimeout(() => setSuccessToast(""), 3000);
        // Remove item from state
        setHistoryItems(historyItems.filter(item => item._id !== itemToDelete._id));
      }
    } catch (err) {
      console.error("Error deleting history item:", err);
      setErrorToast(err.response?.data?.message || "Failed to remove history log.");
      setTimeout(() => setErrorToast(""), 3000);
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // Filter items based on search query
  const filteredHistory = historyItems.filter(item => {
    const promptMatch = item.prompt?.toLowerCase().includes(searchQuery.toLowerCase());
    const outputMatch = item.output?.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return promptMatch || outputMatch || catMatch;
  });

  // Pagination indexing
  const totalPages = Math.max(Math.ceil(filteredHistory.length / itemsPerPage), 1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  // Sync page index if query decreases total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setTimeout(() => {
        setCurrentPage(totalPages);
      }, 0);
    }
  }, [filteredHistory, currentPage, totalPages]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col items-center justify-center relative px-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 animate-pulse shadow-lg shadow-purple-500/20 flex items-center justify-center">
              <History className="h-6 w-6 text-white animate-spin-slow" />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 blur opacity-30 animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">Loading History logs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col font-sans relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-7xl bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 flex-1 w-full flex flex-col relative z-10">
        
        {/* Mobile Sidebar Navigation Bar */}
        {/* Mobile Sidebar Navigation Bar */}
        <div className="flex items-center justify-between md:hidden bg-white/2 border border-white/5 p-4 rounded-2xl mb-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            {user.profilePhoto || user.avatar ? (
              <img 
                src={user.profilePhoto || user.avatar} 
                alt={user.name} 
                className="h-8 w-8 rounded-lg object-cover border border-white/10" 
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs font-bold text-white truncate max-w-[150px]">{user.name}</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Success and Error Toasts */}
        {successToast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-2xl animate-fade-in">
            <CheckCircle2 className="h-4.5 w-4.5" />
            <span>{successToast}</span>
          </div>
        )}
        {errorToast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 p-4 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs font-semibold shadow-2xl animate-fade-in">
            <AlertCircle className="h-4.5 w-4.5" />
            <span>{errorToast}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 items-start flex-grow">
          
          {/* A. SIDEBAR NAVIGATION */}
          <aside className={`
            fixed md:sticky top-24 left-0 md:left-auto right-0 md:right-auto z-40
            md:block h-[calc(100vh-8rem)] w-full md:w-64 flex-shrink-0 
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            ${isSidebarOpen ? "px-4" : ""}
          `}>
            <div className="h-full bg-gradient-to-b from-[#0c0824] to-[#030014] border border-white/10 md:bg-white/5 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Profile overview card */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  {user.profilePhoto || user.avatar ? (
                    <img 
                      src={user.profilePhoto || user.avatar} 
                      alt={user.name} 
                      className="h-10 w-10 rounded-xl object-cover border border-white/10 shadow shadow-purple-500/25" 
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-extrabold shadow shadow-purple-500/25">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  {isSidebarOpen && (
                    <button 
                      onClick={() => setIsSidebarOpen(false)}
                      className="ml-auto p-1 text-slate-400 hover:text-white"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>

                {/* Sidebar Navigation Items */}
                <nav className="space-y-1.5">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === "history";
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          router.push(item.route);
                          setIsSidebarOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer
                          ${isActive 
                            ? "bg-gradient-to-r from-blue-600/25 to-purple-600/25 text-white border border-purple-500/30" 
                            : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"}
                        `}
                      >
                        <Icon className={`h-4.5 w-4.5 ${isActive ? "text-purple-400" : "text-slate-400"}`} />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Logout button */}
              <div>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 transition-all cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* B. MAIN HISTORY CONTENT */}
          <main className="flex-1 min-w-0 w-full">
            <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 min-h-[calc(100vh-12rem)] backdrop-blur-md flex flex-col justify-between">
              
              <div className="space-y-6">
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">AI Generation History</h2>
                    <p className="text-xs text-slate-400 mt-1">Review, copy, or delete previous AI content and improved prompt logs.</p>
                  </div>

                  {/* Search input field */}
                  <div className="relative max-w-xs w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search history..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  </div>
                </div>

                {/* History cards grid content */}
                {loading ? (
                  /* Loading skeletons */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(idx => (
                      <div key={idx} className="p-5 rounded-2xl border border-white/5 bg-white/2 animate-pulse space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="h-4 w-20 bg-white/10 rounded-md" />
                          <div className="h-3 w-16 bg-white/10 rounded-md" />
                        </div>
                        <div className="h-10 bg-white/10 rounded-xl" />
                        <div className="h-20 bg-white/5 rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : currentItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentItems.map((item) => (
                      <div 
                        key={item._id} 
                        className="p-5 rounded-2xl border border-white/5 bg-gradient-to-tr from-white/2 to-white/0 hover:border-white/10 transition-all flex flex-col justify-between h-full group"
                      >
                        <div className="space-y-4">
                          
                          {/* Date and Category bar */}
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase tracking-wider">
                              {item.category || "General"}
                            </span>
                            <span className="text-slate-500 flex items-center gap-1 font-semibold">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Original Prompt */}
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Original Query</span>
                            <p className="text-[11px] text-slate-300 font-medium line-clamp-3 bg-black/20 px-3 py-2 rounded-lg border border-white/2">
                              {item.prompt}
                            </p>
                          </div>

                          {/* Generated Response */}
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Generated Output</span>
                            <div className="bg-black/40 border border-white/5 p-3 rounded-xl max-h-[140px] overflow-y-auto font-mono text-[10px] text-slate-400 leading-relaxed scrollbar-thin">
                              <p className="whitespace-pre-wrap">{item.output}</p>
                            </div>
                          </div>

                        </div>

                        {/* Actions footer bar */}
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                          <span className="text-[10px] text-slate-500 font-semibold">{item.words || 0} words generated</span>
                          
                          <div className="flex items-center gap-2">
                            {/* Copy button */}
                            <button
                              onClick={() => handleCopy(item._id, item.output)}
                              className="p-2 rounded-lg bg-white/2 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                              title="Copy Output"
                            >
                              {copiedId === item._id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => openDeleteModal(item)}
                              className="p-2 rounded-lg bg-white/2 border border-white/5 hover:border-pink-500/20 hover:text-pink-400 text-slate-400 transition-all cursor-pointer flex items-center justify-center"
                              title="Delete Item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty state */
                  <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl space-y-4 bg-black/20">
                    <History className="h-10 w-10 text-slate-600 mx-auto animate-pulse" />
                    <h3 className="text-sm font-bold text-white">No History Logs Found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {searchQuery ? "No logs match your current search query criteria." : "You haven't generated any AI content yet. Head over to the generator workspace to get started!"}
                    </p>
                  </div>
                )}

              </div>

              {/* C. PAGINATION FOOTER */}
              {filteredHistory.length > itemsPerPage && (
                <div className="flex items-center justify-between pt-8 border-t border-white/5 mt-8">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredHistory.length)} of {filteredHistory.length} items
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:text-white text-slate-400 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    <span className="text-xs font-bold text-white px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:text-white text-slate-400 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </main>

        </div>

      </div>

      {/* Delete Confirmation Modal Overlay */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030014]/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass-panel border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden bg-gradient-to-tr from-purple-950/10 to-indigo-950/10">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center flex-shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Remove Generation Log?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This action is permanent and cannot be undone. The selected content generated item will be deleted from your history forever.
                </p>
              </div>
            </div>

            {itemToDelete && (
              <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl text-[10px] font-mono text-slate-400 leading-relaxed max-h-[100px] overflow-y-auto truncate">
                &quot;{itemToDelete.prompt}&quot;
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-red-600 hover:shadow-lg hover:shadow-pink-500/10 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
