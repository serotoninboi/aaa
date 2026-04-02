"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useUser, useSignOut } from "@clerk/nextjs";
import type { PublicUser } from "@/types";

interface AuthCtx {
  user: PublicUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useSignOut();
  const [token, setToken] = useState<string | null>(null);

  const publicUser: PublicUser | null = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        name: clerkUser.firstName || clerkUser.email || "",
        credits: 0, // Credits can be fetched from session storage or API as needed
      }
    : null;

  const logout = useCallback(async () => {
    await signOut({ redirectUrl: "/" });
    setToken(null);
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user: publicUser,
        token,
        isAuthenticated: !!clerkUser,
        isLoading: !isLoaded,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
