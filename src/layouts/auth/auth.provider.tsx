"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/lib/navigation";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated after loading completes
    if (!loading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to login...");
      router.replace(appRoutes.auth.signIn);
    }
  }, [loading, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle size={40} color="#4649D6" className="animate-spin" />
          <p className="text-sm text-white/60">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle size={40} color="#4649D6" className="animate-spin" />
          <p className="text-sm text-white/60">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
