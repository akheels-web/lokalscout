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
  authError: string | null;
  isGoogleConnected: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  clearAuthError: () => void;
}

// Global typing for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string; select_by?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
          revoke: (hint: string, done: () => void) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: { access_token?: string; error?: string; error_description?: string }) => void;
            error_callback?: (error: { message?: string; type?: string }) => void;
          }) => {
            requestAccessToken: (overrideConfig?: Record<string, unknown>) => void;
          };
        };
      };
    };
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<EnterpriseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const isGoogleConnected = Boolean(
    GOOGLE_CLIENT_ID &&
    GOOGLE_CLIENT_ID.trim() !== "" &&
    !GOOGLE_CLIENT_ID.includes("your_google_client_id") &&
    GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID"
  );

  useEffect(() => {
    // Check local storage for persisted Google session
    try {
      const stored = localStorage.getItem("lokalscout_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Clear out legacy simulated demo user if found
        if (parsed?.id === "usr_google_8829104" && !isGoogleConnected) {
          localStorage.removeItem("lokalscout_user");
          setUser(null);
        } else {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to restore session", e);
    } finally {
      setIsLoading(false);
    }
  }, [isGoogleConnected]);

  const clearAuthError = () => setAuthError(null);

  const loginWithGoogle = async (): Promise<void> => {
    setAuthError(null);
    setIsLoading(true);

    // Rule 1: If Google Auth is not configured/connected, throw an explicit error!
    if (!isGoogleConnected) {
      const errorMsg =
        "Google OAuth is not connected: NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing or not configured in environment variables. Please set a valid Google Cloud OAuth 2.0 Web Client ID in frontend/.env.local.";
      setAuthError(errorMsg);
      setIsLoading(false);
      throw new Error(errorMsg);
    }

    // Rule 2: Verify Google Identity Services library is loaded in window
    if (typeof window === "undefined" || !window.google?.accounts?.oauth2) {
      const errorMsg =
        "Google Identity Services script (accounts.google.com/gsi/client) is not loaded or blocked by browser extensions/firewall. Please disable ad-blockers and try again.";
      setAuthError(errorMsg);
      setIsLoading(false);
      throw new Error(errorMsg);
    }

    // Rule 3: Execute genuine Google OAuth 2.0 token client popup
    return new Promise<void>((resolve, reject) => {
      try {
        const tokenClient = window.google!.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "email profile openid",
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              const err = `Google OAuth Error: ${tokenResponse.error_description || tokenResponse.error}`;
              setAuthError(err);
              setIsLoading(false);
              reject(new Error(err));
              return;
            }

            if (!tokenResponse.access_token) {
              const err = "No access token returned from Google Identity Services.";
              setAuthError(err);
              setIsLoading(false);
              reject(new Error(err));
              return;
            }

            try {
              // Retrieve verified Google user profile
              const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });

              if (!res.ok) {
                throw new Error(`Profile endpoint error: ${res.statusText}`);
              }

              const profile = await res.json();
              const authenticatedUser: EnterpriseUser = {
                id: profile.sub || `usr_google_${Date.now()}`,
                name: profile.name || profile.given_name || "Google User",
                email: profile.email,
                avatarUrl: profile.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
                role: "Commercial Operator",
                savedReports: ["SAMPLE-MADHAPUR-COFFEE"],
              };

              setUser(authenticatedUser);
              localStorage.setItem("lokalscout_user", JSON.stringify(authenticatedUser));
              setAuthError(null);
              setIsAuthModalOpen(false);
              setIsLoading(false);
              resolve();
            } catch (fetchErr: any) {
              const err = `Failed to retrieve Google profile: ${fetchErr?.message || fetchErr}`;
              setAuthError(err);
              setIsLoading(false);
              reject(new Error(err));
            }
          },
          error_callback: (error) => {
            const errDesc = error?.message || "Google OAuth window was closed or access was denied.";
            setAuthError(errDesc);
            setIsLoading(false);
            reject(new Error(errDesc));
          },
        });

        tokenClient.requestAccessToken();
      } catch (err: any) {
        const errorDesc = `Failed to launch Google Sign-In: ${err?.message || err}`;
        setAuthError(errorDesc);
        setIsLoading(false);
        reject(new Error(errorDesc));
      }
    });
  };

  const logout = () => {
    setUser(null);
    setAuthError(null);
    localStorage.removeItem("lokalscout_user");
  };

  const openAuthModal = () => {
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthError(null);
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authError,
        isGoogleConnected,
        loginWithGoogle,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        clearAuthError,
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
