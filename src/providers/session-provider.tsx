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
  switchRole: (role: "MERCHANT" | "ANALYST" | "ADMIN") => void;
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
    id: "analyst-01",
    name: "Priya Sharma",
    email: "analyst@paypilot.ai",
    role: "ANALYST",
  });
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("authenticated");

  useEffect(() => {
    // Check localStorage first for instant client hydration
    try {
      const stored = localStorage.getItem("paypilot_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUserState(parsed);
          setStatus("authenticated");
        }
      }
    } catch {}

    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUserState(data.user);
            setStatus("authenticated");
            try {
              localStorage.setItem("paypilot_user", JSON.stringify(data.user));
            } catch {}
            return;
          }
        }
      } catch (err) {
        console.warn("Failed to fetch session from API, using client state:", err);
      }
    }
    loadUser();
  }, []);

  const switchRole = (role: "MERCHANT" | "ANALYST" | "ADMIN") => {
    let newUser: SessionUser;
    if (role === "MERCHANT") {
      newUser = {
        id: "merchant-01",
        name: "Raj Patel",
        email: "merchant@paypilot.ai",
        role: "MERCHANT",
      };
    } else if (role === "ADMIN") {
      newUser = {
        id: "admin-01",
        name: "Vikram Singh",
        email: "admin@paypilot.ai",
        role: "ADMIN",
      };
    } else {
      newUser = {
        id: "analyst-01",
        name: "Priya Sharma",
        email: "analyst@paypilot.ai",
        role: "ANALYST",
      };
    }
    setUserState(newUser);
    setStatus("authenticated");
    try {
      localStorage.setItem("paypilot_user", JSON.stringify(newUser));
    } catch {}
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUserState(null);
    setStatus("unauthenticated");
    try {
      localStorage.removeItem("paypilot_user");
    } catch {}
    window.location.href = "/login";
  };

  const setUser = (u: SessionUser | null) => {
    setUserState(u);
    setStatus(u ? "authenticated" : "unauthenticated");
    try {
      if (u) {
        localStorage.setItem("paypilot_user", JSON.stringify(u));
      } else {
        localStorage.removeItem("paypilot_user");
      }
    } catch {}
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
