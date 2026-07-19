"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "react-hot-toast";
import { 
  LayoutDashboard, Terminal, History, Sparkles, 
  User, Settings, LogOut, Menu, X, Plus, Edit2, 
  Trash2, Copy, Check, CheckCircle2, AlertCircle, 
  Loader2, Layers, Key, ShieldCheck, RefreshCw, Send,
  FileText, Image, Search, ChevronRight, Filter
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell
} from "recharts";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth();
  
  // Navigation & Tab state
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Stats & Dashboard data state
  const [historyItems, setHistoryItems] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const [fetchingTemplates, setFetchingTemplates] = useState(false);

  // Template CRUD state
  const [templateForm, setTemplateForm] = useState({ title: "", category: "", description: "", fullPrompt: "", tags: "", imageUrl: "" });
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateFormError, setTemplateFormError] = useState("");
  const [templateFormSuccess, setTemplateFormSuccess] = useState("");
  const [templateCrudLoading, setTemplateCrudLoading] = useState(false);

  // Playground states
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [playgroundInputs, setPlaygroundInputs] = useState({});
  const [playgroundOutput, setPlaygroundOutput] = useState("");
  const [playgroundProgress, setPlaygroundProgress] = useState(0);
  const [playgroundIsGenerating, setPlaygroundIsGenerating] = useState(false);
  const [playgroundCopied, setPlaygroundCopied] = useState(false);

  // Set default selected template once templates are loaded
  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setTimeout(() => {
        setSelectedTemplate(templates[0]);
      }, 0);
    }
  }, [templates, selectedTemplate]);

  // Helper to parse placeholders: [variable] or {{variable}}
  const parsePlaceholders = (text) => {
    if (!text) return [];
    const regex = /\[([^\]]+)\]|\{\{([^\}]+)\}\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      const placeholder = match[1] || match[2];
      if (!matches.includes(placeholder)) {
        matches.push(placeholder);
      }
    }
    return matches;
  };

  // Re-initialize playground input fields when template changes
  useEffect(() => {
    if (selectedTemplate) {
      const vars = parsePlaceholders(selectedTemplate.fullPrompt);
      const initialInputs = {};
      vars.forEach(v => {
        initialInputs[v] = "";
      });
      setTimeout(() => {
        setPlaygroundInputs(initialInputs);
        setPlaygroundOutput("");
        setPlaygroundProgress(0);
      }, 0);
    }
  }, [selectedTemplate]);

  // Merges inputs into template prompt text
  const generatePromptText = (blueprint, inputs) => {
    if (!blueprint) return "";
    let finalPrompt = blueprint;
    Object.keys(inputs).forEach(key => {
      const val = inputs[key] || "";
      finalPrompt = finalPrompt.replaceAll(`[${key}]`, val);
      finalPrompt = finalPrompt.replaceAll(`{{${key}}}`, val);
    });
    return finalPrompt;
  };

  // Generates simulated professional AI content response
  const generateSimulatedOutput = (template, inputs) => {
    const title = template.title || "Custom Prompt";
    const inputsSummary = Object.entries(inputs)
      .map(([key, val]) => `• ${key}: ${val}`)
      .join("\n");
      
    return `[PromptCraft AI - Generated Content]\n\n` + 
           `Template: ${title}\n` +
           `Inputs configured:\n${inputsSummary}\n\n` +
           `-----------------------------------------\n\n` +
           `Here is your generated content:\n\n` +
           `Based on your request, here is a highly optimized draft:\n\n` +
           `"PromptCraft AI has synthesized this production-grade resource. The custom configuration details are mapped successfully to provide maximum conversions and clarity. The template logic was successfully executed with dynamic variables."\n\n` +
           `Key Features of this Output:\n` +
           `1. Dynamic integration of variables completed successfully.\n` +
           `2. Formatted cleanly for immediate use.\n` +
           `3. Clean, precise vocabulary tailored for ${title}.\n\n` +
           `Thank you for using PromptCraft AI!`;
  };

  // Handles simulated prompt generation execution
  const handlePlaygroundGenerate = () => {
    if (!selectedTemplate) return;
    setPlaygroundIsGenerating(true);
    setPlaygroundProgress(0);
    setPlaygroundOutput("");
    setPlaygroundCopied(false);

    const finalPromptText = generatePromptText(selectedTemplate.fullPrompt, playgroundInputs);
    const finalOutputText = generateSimulatedOutput(selectedTemplate, playgroundInputs);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setPlaygroundProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        let index = 0;
        const words = finalOutputText.split(" ");
        let currentText = "";
        
        const streamInterval = setInterval(() => {
          if (index < words.length) {
            currentText += (index === 0 ? "" : " ") + words[index];
            setPlaygroundOutput(currentText);
            index++;
          } else {
            clearInterval(streamInterval);
            setPlaygroundIsGenerating(false);
            
            // Log output to history database
            handlePromptGenerated({
              prompt: finalPromptText,
              output: finalOutputText,
              category: selectedTemplate.category,
              words: finalOutputText.split(" ").length
            });
          }
        }, 30);
      }
    }, 100);
  };

  const handleCopyPlaygroundOutput = () => {
    navigator.clipboard.writeText(playgroundOutput);
    setPlaygroundCopied(true);
    setTimeout(() => setPlaygroundCopied(false), 2000);
  };
  
  // Search & Filter state
  const [historySearch, setHistorySearch] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState("All");

  // Local utility states
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedTemplateId, setCopiedTemplateId] = useState(null);
  const [playgroundSuccess, setPlaygroundSuccess] = useState("");

  // Sync tab with URL search parameter if present
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      const validTabs = ["overview", "workspace", "history", "templates", "profile", "settings"];
      if (validTabs.includes(tabParam)) {
        setTimeout(() => {
          setActiveTab(tabParam);
        }, 0);
      }
    }
  }, [searchParams]);

  // Auth Protection redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Load History Logs & Templates
  const loadDashboardData = async () => {
    if (!isAuthenticated) return;
    
    setFetchingHistory(true);
    setFetchingTemplates(true);
    
    try {
      // Fetch user generated history logs
      const historyRes = await api.get("/prompts");
      if (historyRes.data && historyRes.data.success) {
        setHistoryItems(historyRes.data.data);
      }

      // Fetch public templates (includes population of createdBy)
      const templatesRes = await api.get("/templates");
      if (templatesRes.data && templatesRes.data.success) {
        setTemplates(templatesRes.data.data);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err.message);
    } finally {
      setFetchingHistory(false);
      setFetchingTemplates(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        loadDashboardData();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // History delete handler
  const handleDeleteHistory = async (id) => {
    try {
      const res = await api.delete(`/prompts/${id}`);
      if (res.data && res.data.success) {
        setHistoryItems(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete log:", err.message);
    }
  };

  // Sync generations in AI Workspace playground with DB logs
  const handlePromptGenerated = async (promptData) => {
    try {
      const res = await api.post("/prompts", promptData);
      if (res.data && res.data.success) {
        setHistoryItems(prev => [res.data.data, ...prev]);
        setPlaygroundSuccess("Prompt output saved to History!");
        setTimeout(() => setPlaygroundSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Error logging completion:", err.message);
    }
  };

  // Template CRUD Handlers
  const handleOpenCreateModal = () => {
    router.push("/dashboard/templates/add");
  };

  const handleOpenEditModal = (template) => {
    setTemplateForm({
      title: template.title,
      category: template.category,
      description: template.description,
      fullPrompt: template.fullPrompt || "",
      tags: Array.isArray(template.tags) ? template.tags.join(", ") : (template.tags || ""),
      imageUrl: template.imageUrl || ""
    });
    setIsEditingTemplate(true);
    setEditingTemplateId(template._id);
    setTemplateFormError("");
    setTemplateFormSuccess("");
    setIsTemplateModalOpen(true);
  };

  const handleTemplateFormSubmit = async (e) => {
    e.preventDefault();
    setTemplateFormError("");
    setTemplateFormSuccess("");

    const { title, category, description, fullPrompt, tags, imageUrl } = templateForm;
    if (!title || !category || !description || !fullPrompt) {
      setTemplateFormError("Please fill out all required fields.");
      return;
    }

    setTemplateCrudLoading(true);
    try {
      const processedTags = typeof tags === "string" 
        ? tags.split(",").map(t => t.trim()).filter(t => t.length > 0)
        : (Array.isArray(tags) ? tags : []);

      const payload = {
        title,
        category,
        description,
        fullPrompt,
        tags: processedTags,
        imageUrl
      };

      if (isEditingTemplate) {
        // PATCH template endpoint
        const res = await api.patch(`/templates/${editingTemplateId}`, payload);
        if (res.data && res.data.success) {
          setTemplateFormSuccess("Template updated successfully!");
          // Reload templates list
          const updatedTemplates = templates.map(t => 
            t._id === editingTemplateId ? { ...t, ...res.data.data } : t
          );
          setTemplates(updatedTemplates);
          // If the currently selected workspace template was edited, update it too
          if (selectedTemplate && selectedTemplate._id === editingTemplateId) {
            setSelectedTemplate({ ...selectedTemplate, ...res.data.data });
          }
          setTimeout(() => setIsTemplateModalOpen(false), 1200);
        }
      } else {
        // POST new template endpoint
        const res = await api.post("/templates", payload);
        if (res.data && res.data.success) {
          setTemplateFormSuccess("Template created successfully!");
          const newTemplate = {
            ...res.data.data,
            createdBy: { _id: user._id, name: user.name, email: user.email }
          };
          setTemplates(prev => [newTemplate, ...prev]);
          setTimeout(() => setIsTemplateModalOpen(false), 1200);
        }
      }
    } catch (err) {
      setTemplateFormError(err.response?.data?.message || "Failed to process template request.");
    } finally {
      setTemplateCrudLoading(false);
    }
  };

  const handleDeleteTemplate = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-semibold text-slate-100">Are you sure you want to delete this template?</span>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] font-bold text-slate-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadId = toast.loading("Deleting template...");
              try {
                const res = await api.delete(`/templates/${id}`);
                if (res.data && res.data.success) {
                  setTemplates(prev => prev.filter(t => t._id !== id));
                  toast.success("Template deleted successfully!", { id: loadId });
                } else {
                  toast.error("Failed to delete template.", { id: loadId });
                }
              } catch (err) {
                toast.error(err.response?.data?.message || "Failed to delete template.", { id: loadId });
              }
            }}
            className="px-2.5 py-1 rounded bg-pink-600 hover:bg-pink-500 text-[10px] font-bold text-white transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 8000,
      position: "top-center"
    });
  };

  // Helper to copy API key
  const handleCopyKey = () => {
    navigator.clipboard.writeText("pc_live_51Ny93KjUu8B3a7Fh4oPq92Jz");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyTemplateDesc = (id, desc) => {
    navigator.clipboard.writeText(desc);
    setCopiedTemplateId(id);
    setTimeout(() => setCopiedTemplateId(null), 2000);
  };

  // Filter lists based on searches
  const filteredHistory = historyItems.filter(item => 
    item.prompt.toLowerCase().includes(historySearch.toLowerCase()) || 
    item.category.toLowerCase().includes(historySearch.toLowerCase())
  );

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(templateSearch.toLowerCase()) || 
                         t.description.toLowerCase().includes(templateSearch.toLowerCase());
    const matchesCategory = templateCategoryFilter === "All" || t.category.toLowerCase() === templateCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for template dropdown filter
  const templateCategories = ["All", ...new Set(templates.map(t => t.category))];

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 0);
  }, []);

  // Calculate metrics
  const totalGenerations = historyItems.length;
  const totalWords = historyItems.reduce((acc, curr) => acc + (curr.words || 0), 0);
  const totalTemplates = templates.length;
  const uniqueCategories = new Set([
    ...templates.map(t => t.category),
    ...historyItems.map(h => h.category)
  ]);
  const totalCategories = uniqueCategories.size;

  const getGenerationsOverTime = () => {
    const dateMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      dateMap[dateString] = 0;
    }

    historyItems.forEach(item => {
      const dateString = new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      if (dateMap[dateString] !== undefined) {
        dateMap[dateString] += 1;
      }
    });

    return Object.entries(dateMap).map(([date, count]) => ({
      date,
      Generations: count
    }));
  };

  const getTemplatesByCategory = () => {
    const categoryMap = {};
    templates.forEach(t => {
      const cat = t.category || "General";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    return Object.entries(categoryMap).map(([category, count]) => ({
      category,
      Templates: count
    }));
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
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  // Sidebar navigation array
  const navigationItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "workspace", label: "AI Workspace", icon: Terminal },
    { id: "improver", label: "AI Prompt Improver", icon: RefreshCw },
    { id: "history", label: "My History", icon: History },
    { id: "templates", label: "Manage Templates", icon: Sparkles },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col font-sans relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

      {/* Main Navbar */}
      <Navbar />

      {/* Layout wrapper */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 gap-6 relative z-10">
        
        {/* Mobile Sidebar Toggle bar */}
        <div className="md:hidden flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow shadow-purple-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold capitalize text-white">{activeTab.replace("-", " ")}</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-300 hover:text-white"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <aside className={`
          fixed md:sticky top-24 left-0 md:left-auto right-0 md:right-auto z-40
          md:block h-[calc(100vh-8rem)] w-full md:w-64 flex-shrink-0 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isSidebarOpen ? "px-4" : ""}
        `}>
          <div className="h-full bg-gradient-to-b from-[#0c0824] to-[#030014] border border-white/10 md:bg-white/5 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-6">
              {/* Profile Overview Header */}
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
              </div>

              {/* Sidebar Tabs */}
              <nav className="space-y-1.5">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === "workspace") {
                          router.push("/dashboard/workspace");
                        } else if (item.id === "improver") {
                          router.push("/dashboard/prompt-improver");
                        } else if (item.id === "history") {
                          router.push("/dashboard/history");
                        } else {
                          setActiveTab(item.id);
                        }
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

            {/* Logout button bottom */}
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

        {/* Content Pane */}
        <main className="flex-1 min-w-0">
          <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 min-h-[calc(100vh-12rem)] backdrop-blur-md">

            {/* 1. TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Dashboard Overview</h2>
                  <p className="text-xs text-slate-400 mt-1">Summary of your account metrics, status, and activity.</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[120px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Templates</span>
                      <Layers className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold text-white mt-4">{totalTemplates}</h3>
                      <p className="text-[10px] text-slate-500 mt-1">Predefined prompt layouts</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[120px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total AI Generations</span>
                      <Terminal className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold text-white mt-4">{totalGenerations}</h3>
                      <p className="text-[10px] text-slate-500 mt-1">Logged generation inputs</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[120px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Categories</span>
                      <Sparkles className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold text-white mt-4">{totalCategories}</h3>
                      <p className="text-[10px] text-slate-500 mt-1">Unique configuration domains</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[120px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Words Generated</span>
                      <FileText className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold text-white mt-4">{totalWords}</h3>
                      <p className="text-[10px] text-slate-500 mt-1">Generated content tokens</p>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                {isMounted && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Generations over time Area Chart */}
                    <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Content Generations Over Time</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={getGenerationsOverTime()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorGenerations" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: "#0c0824", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                              labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: "bold" }}
                              itemStyle={{ color: "#fff", fontSize: "11px" }}
                            />
                            <Area type="monotone" dataKey="Generations" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorGenerations)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Templates by Category Bar Chart */}
                    <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Templates by Category</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getTemplatesByCategory()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <XAxis dataKey="category" stroke="#64748b" fontSize={10} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: "#0c0824", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                              labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: "bold" }}
                              itemStyle={{ color: "#fff", fontSize: "11px" }}
                            />
                            <Bar dataKey="Templates" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                              {getTemplatesByCategory().map((entry, index) => {
                                const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];
                                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                              })}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {/* API Key Panel */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border border-white/5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-purple-400" />
                    <h3 className="text-base font-bold text-white">API Endpoint Configuration</h3>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Integrate PromptCraft AI directly into your codebase. Use the key below as your Bearer Token to access prompt templates.
                  </p>
                  <div className="flex items-center gap-2 max-w-md">
                    <input
                      type="text"
                      readOnly
                      value="pc_live_51Ny93KjUu8B3a7Fh4oPq92Jz"
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none"
                    />
                    <button
                      onClick={handleCopyKey}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                    >
                      {copiedKey ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      <span>{copiedKey ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* Recent activity log list */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white">Recent Activities</h3>
                  <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                    {fetchingHistory ? (
                      <div className="p-6 flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                        <span className="text-xs text-slate-400">Loading recent activities...</span>
                      </div>
                    ) : historyItems.length > 0 ? (
                      historyItems.slice(0, 3).map((item) => (
                        <div key={item._id} className="p-4 flex items-center justify-between text-xs hover:bg-white/2 transition-all">
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-200 truncate max-w-md">&quot;{item.prompt}&quot;</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                              <span className="uppercase text-purple-400">{item.category}</span>
                              <span>•</span>
                              <span>{item.words} tokens generated</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No recent generated prompts. Head over to the AI Workspace to stream prompts!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. TAB: AI WORKSPACE */}
            {activeTab === "workspace" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">AI Workspace Playground</h2>
                  <p className="text-xs text-slate-400 mt-1">Configure active template categories and stream prompt output models.</p>
                </div>
                
                {playgroundSuccess && (
                  <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" />
                    <span>{playgroundSuccess}</span>
                  </div>
                )}

                {templates.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl space-y-4 bg-black/20">
                    <Sparkles className="h-10 w-10 text-slate-600 mx-auto animate-pulse" />
                    <h3 className="text-sm font-bold text-white">No Prompt Templates Found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      You need templates to use the AI Workspace. Go to Manage Templates to create some prompt blueprints!
                    </p>
                    <button
                      onClick={() => setActiveTab("templates")}
                      className="px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white text-xs font-bold hover:shadow-lg cursor-pointer"
                    >
                      Go to Manage Templates
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/20 p-5 sm:p-6 rounded-2xl border border-white/5 animate-fade-in">
                    
                    {/* Left Column: Selector list */}
                    <div className="lg:col-span-4 space-y-3">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Prompt Template</label>
                      <div className="max-h-125 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {templates.map((tpl) => (
                          <button
                            key={tpl._id}
                            onClick={() => !playgroundIsGenerating && setSelectedTemplate(tpl)}
                            disabled={playgroundIsGenerating}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 cursor-pointer ${
                              selectedTemplate?._id === tpl._id
                                ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-purple-500/40 text-white"
                                : "bg-white/2 border-white/5 hover:border-white/10 text-slate-300 hover:text-white"
                            } ${playgroundIsGenerating ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <span className="text-xs font-bold line-clamp-1">{tpl.title}</span>
                            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider line-clamp-1">{tpl.category}</span>
                            <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{tpl.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Playground Inputs and Outputs */}
                    <div className="lg:col-span-8 space-y-5">
                      {selectedTemplate && (
                        <div className="space-y-4">
                          
                          {/* Selected template info header */}
                          <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white">{selectedTemplate.title}</h4>
                              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-purple-400 uppercase tracking-wider">
                                {selectedTemplate.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400">{selectedTemplate.description}</p>
                          </div>

                          {/* Dynamic Placeholders Input Fields */}
                          <div className="space-y-3">
                            <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Configure Prompt Variables</h5>
                            
                            {parsePlaceholders(selectedTemplate.fullPrompt).length === 0 ? (
                              <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 text-[11px] text-slate-500 italic">
                                No placeholders detected in this blueprint. Click generate to run the default prompt guidelines.
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {parsePlaceholders(selectedTemplate.fullPrompt).map((v) => (
                                  <div key={v} className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{v.replaceAll('_', ' ')}</label>
                                    <input
                                      type="text"
                                      placeholder={`Enter ${v}`}
                                      value={playgroundInputs[v] || ""}
                                      onChange={(e) => setPlaygroundInputs({ ...playgroundInputs, [v]: e.target.value })}
                                      disabled={playgroundIsGenerating}
                                      className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors disabled:opacity-50"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Generate Button */}
                          <button
                            onClick={handlePlaygroundGenerate}
                            disabled={playgroundIsGenerating || (parsePlaceholders(selectedTemplate.fullPrompt).some(v => !playgroundInputs[v]?.trim()))}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20 text-white text-xs font-bold transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {playgroundIsGenerating ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Generating Output...</span>
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                <span>Generate AI Content</span>
                              </>
                            )}
                          </button>

                          {/* Generation Result Display */}
                          <div className="relative space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">AI Output Result</label>
                            
                            <div className="min-h-[160px] p-4.5 rounded-2xl bg-black/60 border border-white/5 font-mono text-xs leading-relaxed text-slate-300 relative overflow-hidden select-text">
                              
                              {/* Generation Loader overlay */}
                              {playgroundIsGenerating && playgroundProgress < 100 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[1px]">
                                  <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase mb-2">Analyzing Prompt Context...</span>
                                  <div className="h-1.5 w-40 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150"
                                      style={{ width: `${playgroundProgress}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              {playgroundOutput ? (
                                <p className="whitespace-pre-line">{playgroundOutput}</p>
                              ) : (
                                !playgroundIsGenerating && <p className="text-slate-600 italic">Configure the variables above and click generate to stream content.</p>
                              )}

                              {playgroundIsGenerating && playgroundProgress >= 100 && (
                                <span className="inline-block w-1.5 h-4 ml-1 bg-purple-400 animate-pulse" />
                              )}
                            </div>

                            {/* Result copy controls */}
                            {playgroundOutput && !playgroundIsGenerating && (
                              <button 
                                onClick={handleCopyPlaygroundOutput}
                                className="absolute right-3.5 bottom-3.5 p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold"
                              >
                                {playgroundCopied ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>Copy Output</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* 3. TAB: MY HISTORY */}
            {activeTab === "history" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">Generation History</h2>
                    <p className="text-xs text-slate-400 mt-1">Review, copy, and delete past logged prompts.</p>
                  </div>
                  
                  {/* Search input filter */}
                  <div className="relative max-w-xs w-full">
                    <input
                      type="text"
                      placeholder="Search history..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 focus:border-purple-500/50 focus:outline-none rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 transition-colors"
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  </div>
                </div>

                {/* History Lists */}
                <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                  {fetchingHistory ? (
                    <div className="p-12 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                      <span className="text-xs text-slate-400">Fetching history logs...</span>
                    </div>
                  ) : filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                      <div key={item._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/2 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white truncate max-w-md">&quot;{item.prompt}&quot;</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              {item.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                            <span>{new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>•</span>
                            <span>{item.words} tokens generated</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(item.prompt);
                            }}
                            className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Copy Prompt"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteHistory(item._id)}
                            className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/10 hover:border-pink-500/20 text-pink-400 hover:bg-pink-500/20 transition-colors cursor-pointer"
                            title="Delete Log"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center space-y-3">
                      <History className="h-10 w-10 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-500">
                        {historySearch ? "No history logs matching search query." : "No logs found. Try executing prompts in the Workspace."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. TAB: MANAGE TEMPLATES */}
            {activeTab === "templates" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">Manage Prompt Templates</h2>
                    <p className="text-xs text-slate-400 mt-1">Create, update, and manage blueprint templates for prompt streaming.</p>
                  </div>
                  
                  {/* Create Template trigger button */}
                  <button 
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 text-white text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Template</span>
                  </button>
                </div>

                {/* Filter and Search controls */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={templateSearch}
                      onChange={(e) => setTemplateSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 focus:border-purple-500/50 focus:outline-none rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 transition-colors"
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-slate-500" />
                    <select
                      value={templateCategoryFilter}
                      onChange={(e) => setTemplateCategoryFilter(e.target.value)}
                      className="bg-[#030014] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500/50"
                    >
                      {templateCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Template Cards Grid */}
                {fetchingTemplates ? (
                  <div className="p-12 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    <span className="text-xs text-slate-400">Fetching templates database...</span>
                  </div>
                ) : filteredTemplates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTemplates.map((template) => {
                      const isOwner = template.createdBy?._id === user._id || template.createdBy === user._id;
                      return (
                        <div 
                          key={template._id} 
                          className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between gap-4"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-sm font-bold text-white">{template.title}</h3>
                                <p className="text-[10px] text-slate-400 font-medium">Category: <span className="text-purple-400 uppercase">{template.category}</span></p>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-slate-400">
                                {isOwner ? "Created by me" : `Creator: ${template.createdBy?.name || "System"}`}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 line-clamp-3 bg-black/20 p-2.5 rounded-xl border border-white/5 font-mono">
                              {template.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-white/5 pt-3.5">
                            <button
                              onClick={() => handleCopyTemplateDesc(template._id, template.description)}
                              className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                              {copiedTemplateId === template._id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                              <span>{copiedTemplateId === template._id ? "Copied" : "Copy Template"}</span>
                            </button>

                            {/* Show edit and delete buttons ONLY to the template owners */}
                            {isOwner && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleOpenEditModal(template)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/5"
                                  title="Edit Template"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTemplate(template._id)}
                                  className="p-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 transition-all cursor-pointer border border-pink-500/10"
                                  title="Delete Template"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl space-y-3">
                    <Sparkles className="h-10 w-10 text-slate-600 mx-auto animate-pulse" />
                    <p className="text-xs text-slate-500">
                      {templateSearch || templateCategoryFilter !== "All" 
                        ? "No prompt templates matching filter criteria." 
                        : "No templates found. Be the first to create one!"}
                    </p>
                  </div>
                )}

                {/* Template CREATE / EDIT Modal */}
                {isTemplateModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-3xl bg-[#0c0824] border border-white/10 p-6 sm:p-8 relative z-10 shadow-2xl shadow-purple-950/20">
                      
                      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                        <h3 className="text-lg font-bold text-white">
                          {isEditingTemplate ? "Edit Prompt Template" : "Create New Template"}
                        </h3>
                        <button 
                          onClick={() => setIsTemplateModalOpen(false)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      {templateFormError && (
                        <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold animate-pulse-slow">
                          <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                          <span>{templateFormError}</span>
                        </div>
                      )}

                      {templateFormSuccess && (
                        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                          <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" />
                          <span>{templateFormSuccess}</span>
                        </div>
                      )}

                      <form onSubmit={handleTemplateFormSubmit} className="space-y-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Template Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. FastAPI Custom Router Auth"
                            value={templateForm.title}
                            onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                            className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Category *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Coding, Email, Social, Writing"
                            value={templateForm.category}
                            onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                            className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Blueprint Prompt Description *</label>
                          <textarea
                            required
                            rows="4"
                            placeholder="e.g. Write a custom routing module inside FastAPI containing JSON web token validation..."
                            value={templateForm.description}
                            onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                            className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors font-mono resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Full Prompt Blueprint *</label>
                          <textarea
                            required
                            rows="4"
                            placeholder="Write the complex instruction guidelines for the AI..."
                            value={templateForm.fullPrompt}
                            onChange={(e) => setTemplateForm({ ...templateForm, fullPrompt: e.target.value })}
                            className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors font-mono resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tags (comma-separated)</label>
                          <input
                            type="text"
                            placeholder="e.g. copywriting, email, onboarding"
                            value={templateForm.tags}
                            onChange={(e) => setTemplateForm({ ...templateForm, tags: e.target.value })}
                            className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Image URL (Optional)</label>
                          <input
                            type="url"
                            placeholder="e.g. https://domain.com/image.png"
                            value={templateForm.imageUrl}
                            onChange={(e) => setTemplateForm({ ...templateForm, imageUrl: e.target.value })}
                            className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={templateCrudLoading}
                          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white text-xs font-bold transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {templateCrudLoading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                          <span>{isEditingTemplate ? "Update Template Blueprint" : "Save Template Blueprint"}</span>
                        </button>
                      </form>

                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. TAB: PROFILE */}
            {activeTab === "profile" && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">My Account Profile</h2>
                  <p className="text-xs text-slate-400 mt-1">Review Mongoose data credentials.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5">
                  {user.profilePhoto || user.avatar ? (
                    <img 
                      src={user.profilePhoto || user.avatar} 
                      alt={user.name} 
                      className="h-20 w-20 rounded-2xl object-cover border border-white/10 shadow" 
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow shadow-purple-500/20">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-white">{user.name}</h3>
                    <p className="text-xs text-purple-400 uppercase font-semibold">PromptCraft Creator</p>
                    <p className="text-[10px] text-slate-500 font-mono">User ID: {user._id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Email Address</span>
                    <p className="text-sm font-semibold text-white">{user.email}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Account Created At</span>
                    <p className="text-sm font-semibold text-white">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long" }) : "July 2026"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. TAB: SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Workspace Settings</h2>
                  <p className="text-xs text-slate-400 mt-1">Manage configuration parameters and tokens.</p>
                </div>

                {/* API Status panel */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">API Integration Status</h3>
                    <p className="text-xs text-slate-400">Backend connectivity status validation check.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Online
                  </span>
                </div>

                {/* Account Preferences */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white">Workspace Preferences</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs border-b border-white/5 pb-3">
                      <div>
                        <p className="font-semibold text-slate-200">High Token Precision</p>
                        <p className="text-[10px] text-slate-400">Allow deeper token parameters during parsing.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-700 bg-[#030014] text-purple-600 focus:ring-purple-500" />
                    </div>

                    <div className="flex items-center justify-between text-xs border-b border-white/5 pb-3">
                      <div>
                        <p className="font-semibold text-slate-200">Telemetry Analytics</p>
                        <p className="text-[10px] text-slate-400">Send generation performance logs anonymously.</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-[#030014] text-purple-600 focus:ring-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col items-center justify-center relative px-4">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">Loading Application...</span>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
