"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface EnterpriseUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  company?: string;
  role: string;
  savedReports: string[];
}

interface AuthContextType {
  user: EnterpriseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (customEmail?: string) => Promise<void>;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ENTERPRISE_USER: EnterpriseUser = {
  id: "usr_google_8829104",
  name: "Dr. Vikram Sethi",
  email: "vikram.sethi@apexretail.in",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
  company: "Apex Commercial Retail Ventures",
  role: "Franchise Development Lead",
  savedReports: ["SAMPLE-MADHAPUR-COFFEE", "LS-HYD-500081"],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<EnterpriseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Check local storage for persisted Google session
    try {
      const stored = localStorage.getItem("lokalscout_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to restore session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = async (customEmail?: string) => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth flow
      await new Promise((r) => setTimeout(r, 600));
      const newUser: EnterpriseUser = {
        ...DEMO_ENTERPRISE_USER,
        email: customEmail || DEMO_ENTERPRISE_USER.email,
        name: customEmail ? customEmail.split("@")[0].replace(".", " ").toUpperCase() : DEMO_ENTERPRISE_USER.name,
      };
      setUser(newUser);
      localStorage.setItem("lokalscout_user", JSON.stringify(newUser));
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lokalscout_user");
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginWithGoogle,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
