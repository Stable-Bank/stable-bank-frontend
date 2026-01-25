"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/config/axios";
import { clearToken, getToken, setToken } from "@/composables/token";
import { appRoutes } from "@/lib/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  bankTag?: string;
  kycStatus?: string;
  role?: string;
  walletAddress?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const { token } = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch user profile from backend
      const response = await apiClient.get<{ user: User }>("/auth/me");
      setUser(response.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", { email, password });

      const { user, accessToken, refreshToken } = response;
      setToken(accessToken, refreshToken);
      setUser(user);
      toast.success("Login successful!");
    } catch (error: any) {
      const message = error?.message || "Login failed. Please try again.";
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { refreshToken } = getToken();
      if (refreshToken) {
        await apiClient.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearToken();
      setUser(null);
      router.replace(appRoutes.auth.signIn);
      toast.info("Logged out successfully");
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();

    // Listen for auth:logout event from axios interceptor
    const handleLogout = () => {
      setUser(null);
      router.replace(appRoutes.auth.signIn);
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
