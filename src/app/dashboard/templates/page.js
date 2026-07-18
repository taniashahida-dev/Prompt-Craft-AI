"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Sparkles, Plus, Search, Filter, Edit2, Trash2, Eye, ArrowLeft, 
  AlertCircle, CheckCircle2, Loader2, ChevronLeft, ChevronRight, 
  Copy, Check, X, Layers, FileCode2, Tag, FileText, Image as ImageIcon
} from "lucide-react";

export default function ManageTemplatesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  // Search, Filter & Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [viewTemplate, setViewTemplate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [deleteTemplateId, setDeleteTemplateId] = useState(null);
  const [deleteTemplateTitle, setDeleteTemplateTitle] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editTemplate, setEditTemplate] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", category: "", description: "", fullPrompt: "", tags: "", imageUrl: "" });
  const [editFormError, setEditFormError] = useState("");

  // Toasts
  const [successToast, setSuccessToast] = useState("");
  const [errorToast, setErrorToast] = useState("");
  const [copiedTemplateId, setCopiedTemplateId] = useState(null);

  // Route protection redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch templates via TanStack Query
  const { data: templatesData, isLoading: fetchingTemplates } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await api.get("/templates");
      return res.data;
    },
    enabled: isAuthenticated === true
  });

  const templates = templatesData?.success ? templatesData.data : [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/templates/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setIsDeleteModalOpen(false);
      setDeleteTemplateId(null);
      setSuccessToast("Template blueprint deleted successfully.");
      setTimeout(() => setSuccessToast(""), 3000);
    },
    onError: (err) => {
      setIsDeleteModalOpen(false);
      setErrorToast(err.response?.data?.message || "Failed to delete template blueprint.");
      setTimeout(() => setErrorToast(""), 3000);
    }
  });

  // Edit mutation
  const editMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await api.patch(`/templates/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setIsEditModalOpen(false);
      setEditTemplate(null);
      setSuccessToast("Template blueprint updated successfully.");
      setTimeout(() => setSuccessToast(""), 3000);
    },
    onError: (err) => {
      setEditFormError(err.response?.data?.message || "Failed to update template blueprint.");
    }
  });

  // Filter templates: Only show templates created by the logged-in user
  const userTemplates = templates.filter(t => {
    if (!user) return false;
    const isOwner = t.createdBy?._id === user._id || t.createdBy === user._id;
    if (!isOwner) return false;

    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || t.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories from user templates
  const categories = ["All", ...new Set(templates.filter(t => {
    if (!user) return false;
    return t.createdBy?._id === user._id || t.createdBy === user._id;
  }).map(t => t.category))];

  // Pagination calculation
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(userTemplates.length / itemsPerPage));
  const paginatedTemplates = userTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page on search or category filter change
  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [searchQuery, categoryFilter]);

  // Modal Handlers
  const handleOpenViewModal = (template) => {
    setViewTemplate(template);
    setIsViewModalOpen(true);
  };

  const handleOpenDeleteModal = (template) => {
    setDeleteTemplateId(template._id);
    setDeleteTemplateTitle(template.title);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTemplateId) {
      deleteMutation.mutate(deleteTemplateId);
    }
  };

  const handleOpenEditModal = (template) => {
    setEditTemplate(template);
    setEditForm({
      title: template.title,
      category: template.category,
      description: template.description,
      fullPrompt: template.fullPrompt || "",
      tags: Array.isArray(template.tags) ? template.tags.join(", ") : (template.tags || ""),
      imageUrl: template.imageUrl || ""
    });
    setEditFormError("");
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEditFormError("");

    const { title, category, description, fullPrompt, tags, imageUrl } = editForm;
    if (!title.trim() || !category.trim() || !description.trim() || !fullPrompt.trim()) {
      setEditFormError("Please fill out all required fields.");
      return;
    }

    if (imageUrl.trim()) {
      try {
        new URL(imageUrl);
      } catch (_) {
        setEditFormError("Please enter a valid Image URL.");
        return;
      }
    }

    const processedTags = tags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    editMutation.mutate({
      id: editTemplate._id,
      payload: {
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        fullPrompt: fullPrompt.trim(),
        tags: processedTags,
        imageUrl: imageUrl.trim()
      }
    });
  };

  const handleCopyPrompt = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateId(id);
    setTimeout(() => setCopiedTemplateId(null), 2000);
  };

  if (authLoading || !user) {
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
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">Loading Manage Templates...</span>
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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-28 relative z-10">
        
        {/* Toast Notifications */}
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

        {/* Back Link */}
        <button 
          onClick={() => router.push("/dashboard?tab=templates")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Header Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow shadow-purple-500/25">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">Manage Prompt Blueprints</h2>
              <p className="text-xs text-slate-400 mt-0.5">Control, customize, and edit your personal prompt template generators.</p>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard/templates/add")}
            className="flex items-center justify-center gap-1.5 px-4.5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 text-white text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Create Blueprint</span>
          </button>
        </div>

        {/* Filters and Search Bar Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search prompt blueprints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 focus:border-purple-500/50 focus:outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 transition-colors"
            />
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
          </div>

          <div className="flex items-center gap-2 bg-white/2 border border-white/5 rounded-xl px-3.5 py-2.5 max-w-[200px] w-full self-start sm:self-auto">
            <Filter className="h-4 w-4 text-slate-500" />
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
        </div>

        {/* Dynamic State Container */}
        {fetchingTemplates ? (
          <div className="glass-panel border border-white/15 rounded-3xl p-8 space-y-4">
            {/* Desktop Table Skeleton */}
            <div className="hidden sm:block space-y-4">
              <div className="h-10 w-full bg-white/5 rounded-xl animate-pulse" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 w-full bg-white/2 rounded-xl animate-pulse" />
              ))}
            </div>
            {/* Mobile Cards Skeleton */}
            <div className="sm:hidden space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 w-full bg-white/2 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : userTemplates.length > 0 ? (
          <div className="space-y-6">
            
            {/* A. TABLE LAYOUT (Desktop View) */}
            <div className="hidden sm:block glass-panel border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="px-6 py-4.5">Template</th>
                    <th className="px-6 py-4.5">Category</th>
                    <th className="px-6 py-4.5">Created Date</th>
                    <th className="px-6 py-4.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedTemplates.map((template) => (
                    <tr key={template._id} className="hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3.5 max-w-sm">
                        {template.imageUrl ? (
                          <img src={template.imageUrl} alt={template.title} className="h-10 w-10 rounded-xl object-cover border border-white/10" />
                        ) : (
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-purple-400">
                            <Sparkles className="h-5 w-5" />
                          </div>
                        )}
                        <div className="truncate">
                          <p className="font-bold text-white truncate">{template.title}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{template.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-purple-400 uppercase tracking-wider">
                          {template.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(template.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenViewModal(template)}
                            className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="View Blueprint"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(template)}
                            className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit Blueprint"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(template)}
                            className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/10 hover:border-pink-500/20 text-pink-400 hover:bg-pink-500/20 transition-colors cursor-pointer"
                            title="Delete Blueprint"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* B. CARDS LAYOUT (Mobile View) */}
            <div className="sm:hidden space-y-4">
              {paginatedTemplates.map((template) => (
                <div key={template._id} className="glass-panel border border-white/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    {template.imageUrl ? (
                      <img src={template.imageUrl} alt={template.title} className="h-12 w-12 rounded-xl object-cover border border-white/10" />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-purple-400">
                        <Sparkles className="h-6 w-6" />
                      </div>
                    )}
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-white truncate">{template.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[8px] font-bold text-purple-400 uppercase tracking-wider">
                          {template.category}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 line-clamp-2">{template.description}</p>
                  
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleOpenViewModal(template)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 text-[10px] font-bold text-slate-300 hover:text-white"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(template)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 text-[10px] font-bold text-slate-300 hover:text-white"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(template)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-pink-500/10 text-[10px] font-bold text-pink-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* C. PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs">
                <span className="text-slate-400">
                  Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({userTemplates.length} blueprints total)
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
          <div className="p-16 text-center border border-dashed border-white/10 rounded-3xl space-y-4 bg-black/25">
            <Sparkles className="h-10 w-10 text-slate-600 mx-auto animate-pulse" />
            <h3 className="text-sm font-bold text-white">No Blueprints Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery || categoryFilter !== "All"
                ? "No prompt blueprints match your active search and filter keywords."
                : "You haven't constructed any custom template blueprints yet. Create one to get started!"}
            </p>
            {(!searchQuery && categoryFilter === "All") && (
              <button
                onClick={() => router.push("/dashboard/templates/add")}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold hover:shadow-lg cursor-pointer"
              >
                Create First Blueprint
              </button>
            )}
          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* 1. VIEW BLUEPRINT MODAL */}
      {/* ======================================================== */}
      {isViewModalOpen && viewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0c0824] border border-white/10 p-6 sm:p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{viewTemplate.title}</h3>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-purple-400 uppercase tracking-wider">
                  {viewTemplate.category}
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
              
              {/* Image context */}
              {viewTemplate.imageUrl && (
                <div>
                  <img 
                    src={viewTemplate.imageUrl} 
                    alt={viewTemplate.title} 
                    className="w-full h-40 object-cover rounded-2xl border border-white/5 shadow-inner" 
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Short Description</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-white/2 p-3.5 rounded-xl border border-white/5">
                  {viewTemplate.description}
                </p>
              </div>

              {/* Prompt Blueprint Code Box */}
              <div className="space-y-1 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Full Prompt Blueprint</span>
                  <button
                    onClick={() => handleCopyPrompt(viewTemplate._id, viewTemplate.fullPrompt)}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedTemplateId === viewTemplate._id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedTemplateId === viewTemplate._id ? "Copied Blueprint" : "Copy Blueprint"}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap select-text max-h-60 overflow-y-auto custom-scrollbar">
                  {viewTemplate.fullPrompt}
                </div>
              </div>

              {/* Tags Pills list */}
              {viewTemplate.tags && viewTemplate.tags.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {viewTemplate.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] font-medium text-purple-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="pt-4.5 border-t border-white/5 mt-5 flex justify-end flex-shrink-0">
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

      {/* ======================================================== */}
      {/* 2. EDIT BLUEPRINT MODAL */}
      {/* ======================================================== */}
      {isEditModalOpen && editTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#0c0824] border border-white/10 p-6 sm:p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5 flex-shrink-0">
              <h3 className="text-base font-bold text-white">Edit Template Blueprint</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              
              {editFormError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold animate-pulse-slow">
                  <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                  <span>{editFormError}</span>
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Template Title *</label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      required
                      placeholder="e.g. welcome email"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors"
                    />
                    <FileCode2 className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Category *</label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Email, Coding"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors"
                    />
                    <Layers className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Short Description *</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    required
                    placeholder="Describe what the blueprint generates..."
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors"
                  />
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                </div>
              </div>

              {/* Full Prompt Blueprint */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Full Prompt Blueprint *</label>
                <textarea
                  required
                  rows="4"
                  placeholder="e.g. Write a copy about [topic] for {{audience}}..."
                  value={editForm.fullPrompt}
                  onChange={(e) => setEditForm({ ...editForm, fullPrompt: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors font-mono resize-none"
                />
              </div>

              {/* Tags & Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tags (comma-separated)</label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      placeholder="e.g. copy, email"
                      value={editForm.tags}
                      onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors"
                    />
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Image URL (Optional)</label>
                  <div className="relative mt-1">
                    <input
                      type="url"
                      placeholder="https://domain.com/img.png"
                      value={editForm.imageUrl}
                      onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors"
                    />
                    <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Submit trigger button */}
              <div className="pt-4 border-t border-white/5 flex gap-3 justify-end flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={editMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editMutation.isPending}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold hover:shadow-lg disabled:opacity-40 cursor-pointer"
                >
                  {editMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Save Updates</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#0c0824] border border-white/10 p-6 sm:p-7 relative z-10 shadow-2xl text-center space-y-4">
            
            <div className="h-12 w-12 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">Delete Template Blueprint?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to permanently delete the blueprint for <strong className="text-slate-200">&quot;{deleteTemplateTitle}&quot;</strong>? This action is irreversible.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3 justify-center">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteMutation.isPending}
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold hover:shadow-lg disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {deleteMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
