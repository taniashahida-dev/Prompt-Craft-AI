"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth persistence on mount
  useEffect(() => {
    const checkAuthPersistence = async () => {
      const token = localStorage.getItem("promptcraft_jwt");
      if (token) {
        try {
          const res = await api.get("/auth/profile");
          if (res.data && res.data.success) {
            setUser(res.data.data);
          } else {
            localStorage.removeItem("promptcraft_jwt");
          }
        } catch (err) {
          console.error("Auth verification failed:", err.message);
          localStorage.removeItem("promptcraft_jwt");
        }
      }
      setLoading(false);
    };

    checkAuthPersistence();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data && res.data.success) {
        const userData = res.data.data;
        localStorage.setItem("promptcraft_jwt", userData.token);
        
        // Fetch full profile to get mongoose attributes
        try {
          const profileRes = await api.get("/auth/profile");
          if (profileRes.data && profileRes.data.success) {
            setUser(profileRes.data.data);
          } else {
            setUser({
              _id: userData._id,
              name: userData.name,
              email: userData.email
            });
          }
        } catch (profileErr) {
          console.error("Profile fetch after login failed:", profileErr);
          setUser({
            _id: userData._id,
            name: userData.name,
            email: userData.email
          });
        }
        
        setLoading(false);
        router.push("/");
        return { success: true };
      }
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || "Invalid credentials.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // Google Auth handler
  const googleAuth = async (credential) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/google", { credential });
      if (res.data && res.data.success) {
        const userData = res.data.data;
        localStorage.setItem("promptcraft_jwt", userData.token);
        
        try {
          const profileRes = await api.get("/auth/profile");
          if (profileRes.data && profileRes.data.success) {
            setUser(profileRes.data.data);
          } else {
            setUser({
              _id: userData._id,
              name: userData.name,
              email: userData.email
            });
          }
        } catch (profileErr) {
          console.error("Profile fetch after Google login failed:", profileErr);
          setUser({
            _id: userData._id,
            name: userData.name,
            email: userData.email
          });
        }
        
        setLoading(false);
        router.push("/");
        return { success: true };
      }
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || "Google authentication failed.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("promptcraft_jwt");
    setUser(null);
    setError(null);
    router.push("/");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    googleAuth,
    logout,
    setUser,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
