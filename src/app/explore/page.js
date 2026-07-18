"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { 
  Sparkles, Search, Filter, Eye, ArrowLeft, 
  ChevronLeft, ChevronRight, Copy, Check, X, 
  Layers, Clock, ArrowUpDown, User
} from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // Search, Filter, Sort & Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"
  const [currentPage, setCurrentPage] = useState(1);

  // View details modal state
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [copiedTemplateId, setCopiedTemplateId] = useState(null);

  // Fetch all templates via TanStack Query
  const { data: templatesData, isLoading: fetchingTemplates } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await api.get("/templates");
      return res.data;
    }
  });

  const templates = templatesData?.success ? templatesData.data : [];

  // Filter templates based on Search and Category
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || t.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Sort templates based on sortOrder
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Extract unique categories from all templates
  const categories = ["All", ...new Set(templates.map(t => t.category))];

  // Pagination settings (6 items per page for a balanced grid)
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(sortedTemplates.length / itemsPerPage));
  const paginatedTemplates = sortedTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when search, category filter, or sort order changes
  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [searchQuery, categoryFilter, sortOrder]);

  const handleOpenViewModal = (template) => {
    setSelectedTemplate(template);
    setIsViewModalOpen(true);
  };

  const handleCopyPrompt = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateId(id);
    setTimeout(() => setCopiedTemplateId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col font-sans relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[550px] w-full max-w-7xl bg-gradient-to-b from-purple-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-28 relative z-10">
        
        {/* Breadcrumb / Back Navigation */}
        <button 
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        {/* Hero Section Header */}
        <div className="space-y-3 mb-10 pb-6 border-b border-white/5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Discover prompt blueprints</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Prompt Templates
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
            Browse and configure community-designed prompt templates. Run them in your Workspace or copy the instructions directly.
          </p>
        </div>

        {/* Search, Category Filter, and Sorting Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-8">
          <div className="relative sm:col-span-6 md:col-span-7">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 focus:border-purple-500/50 focus:outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 transition-colors"
            />
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
          </div>

          <div className="flex items-center gap-2 bg-white/2 border border-white/5 rounded-xl px-3.5 py-2.5 sm:col-span-3">
            <Filter className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none text-slate-300 text-xs focus:outline-none w-full cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-[#0c0824] text-slate-300">{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/2 border border-white/5 rounded-xl px-3.5 py-2.5 sm:col-span-3">
            <ArrowUpDown className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent border-none text-slate-300 text-xs focus:outline-none w-full cursor-pointer"
            >
              <option value="newest" className="bg-[#0c0824] text-slate-300 font-sans">Newest First</option>
              <option value="oldest" className="bg-[#0c0824] text-slate-300 font-sans">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Dynamic Content Grid State */}
        {fetchingTemplates ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-panel border border-white/10 rounded-2xl p-5 space-y-4 animate-pulse h-80">
                <div className="h-40 w-full bg-white/5 rounded-xl" />
                <div className="h-4 w-3/4 bg-white/5 rounded" />
                <div className="h-3 w-1/2 bg-white/5 rounded" />
                <div className="h-8 w-full bg-white/5 rounded-xl" />
              </div>
            ))}
          </div>
        ) : paginatedTemplates.length > 0 ? (
          <div className="space-y-8 animate-fade-in">
            {/* Equal Height Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedTemplates.map((template) => (
                <div 
                  key={template._id} 
                  className="glass-panel border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 flex flex-col h-full hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-950/5 group"
                >
                  {/* Image header with fallback option */}
                  <div className="relative h-44 w-full overflow-hidden border-b border-white/5 flex-shrink-0 bg-black/40">
                    {template.imageUrl ? (
                      <img 
                        src={template.imageUrl} 
                        alt={template.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-blue-600/10 via-indigo-600/10 to-purple-600/10 flex items-center justify-center text-purple-400/80">
                        <Sparkles className="h-10 w-10 animate-pulse" />
                      </div>
                    )}
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-bold text-purple-400 uppercase tracking-wider">
                      {template.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">{template.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{template.description}</p>
                    </div>

                    <button
                      onClick={() => handleOpenViewModal(template)}
                      className="w-full py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-white/5 text-xs">
                <span className="text-slate-400">
                  Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredTemplates.length} templates)
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="p-16 text-center border border-dashed border-white/10 rounded-2xl space-y-4 bg-black/25">
            <Sparkles className="h-10 w-10 text-slate-600 mx-auto animate-pulse" />
            <h3 className="text-sm font-bold text-white">No Templates Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No prompt blueprints match your active search terms or selected category filter.
            </p>
          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* VIEW DETAILS MODAL */}
      {/* ======================================================== */}
      {isViewModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0c0824] border border-white/10 p-6 sm:p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{selectedTemplate.title}</h3>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-purple-400 uppercase tracking-wider">
                  {selectedTemplate.category}
                </span>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4.5 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              
              {/* Image Banner */}
              {selectedTemplate.imageUrl && (
                <div>
                  <img 
                    src={selectedTemplate.imageUrl} 
                    alt={selectedTemplate.title} 
                    className="w-full h-44 object-cover rounded-2xl border border-white/5 shadow-inner" 
                  />
                </div>
              )}

              {/* Creator details */}
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/2 border border-white/5 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  <span>
                    Created by: <strong className="text-slate-200">{selectedTemplate.createdBy?.name || "Community"}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>
                    {new Date(selectedTemplate.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Short Description</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-white/2 p-3.5 rounded-xl border border-white/5">
                  {selectedTemplate.description}
                </p>
              </div>

              {/* Full Blueprint Instructions */}
              <div className="space-y-1 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Full Prompt Blueprint</span>
                  <button
                    onClick={() => handleCopyPrompt(selectedTemplate._id, selectedTemplate.fullPrompt)}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedTemplateId === selectedTemplate._id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedTemplateId === selectedTemplate._id ? "Copied Blueprint" : "Copy Blueprint"}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap select-text max-h-60 overflow-y-auto custom-scrollbar">
                  {selectedTemplate.fullPrompt}
                </div>
              </div>

              {/* Tags Pills */}
              {selectedTemplate.tags && selectedTemplate.tags.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTemplate.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] font-medium text-purple-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="pt-4.5 border-t border-white/5 mt-5 flex gap-2 justify-end flex-shrink-0">
              {isAuthenticated && (
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    router.push(`/dashboard?tab=workspace`);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Run in AI Workspace
                </button>
              )}
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
