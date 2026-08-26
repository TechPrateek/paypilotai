"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "MERCHANT" | "ANALYST" | "ADMIN" | string;
  merchantId?: string;
  image?: string | null;
}

export interface SessionContextType {
  data: { user: SessionUser } | null;
  status: "loading" | "authenticated" | "unauthenticated";
  setUser: (user: SessionUser | null) => void;
  switchRole: (role: "MERCHANT" | "ANALYST") => void;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  data: null,
  status: "loading",
  setUser: () => {},
  switchRole: () => {},
  logout: async () => {},
});

export function AppSessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<SessionUser | null>({
    id: "default-merchant",
    name: "Raj Patel",
    email: "merchant@paypilot.ai",
    role: "MERCHANT",
  });
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("authenticated");

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUserState(data.user);
            setStatus("authenticated");
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load session:", err);
      }
    }
    loadUser();
  }, []);

  const switchRole = (role: "MERCHANT" | "ANALYST") => {
    if (role === "MERCHANT") {
      setUserState({
        id: "merchant-01",
        name: "Raj Patel (Store Owner)",
        email: "merchant@paypilot.ai",
        role: "MERCHANT",
      });
    } else {
      setUserState({
        id: "analyst-01",
        name: "Priya Sharma (Risk Analyst)",
        email: "analyst@paypilot.ai",
        role: "ANALYST",
      });
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUserState(null);
    setStatus("unauthenticated");
    window.location.href = "/login";
  };

  const setUser = (u: SessionUser | null) => {
    setUserState(u);
    setStatus(u ? "authenticated" : "unauthenticated");
  };

  return (
    <SessionContext.Provider
      value={{
        data: user ? { user } : null,
        status,
        setUser,
        switchRole,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  return {
    data: ctx.data,
    status: ctx.status,
    update: ctx.setUser,
  };
}

export function useAuth() {
  return useContext(SessionContext);
}
