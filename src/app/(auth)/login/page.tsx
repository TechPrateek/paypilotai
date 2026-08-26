"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Share2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Info,
  KeyRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/providers/session-provider";

export default function LoginPage() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("analyst@sentinel.ai");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setError(null);

    const isAdmin = loginEmail.includes("admin");
    const name = isAdmin ? "Vikram Singh" : "Priya Sharma";
    const role = isAdmin ? "ADMIN" : "ANALYST";

    const userObj = {
      id: isAdmin ? "admin-01" : "analyst-01",
      email: loginEmail,
      name,
      role,
    };

    try {
      // 1. Store in localStorage for instant client hydration
      localStorage.setItem("paypilot_user", JSON.stringify(userObj));
      setUser(userObj);

      // 2. Call API route to set cookie
      try {
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginEmail, password: loginPass }),
        });
      } catch (apiErr) {
        console.warn("Background API login sync note:", apiErr);
      }

      toast.success(`Welcome to Abuse-Ring Sentinel, ${name}!`);

      // 3. Direct browser navigation to /overview
      window.location.href = "/overview";
    } catch (err: any) {
      setError(err?.message || "Invalid credentials");
      toast.error("Failed to sign in");
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(email, password);
  };

  const handleSelectDemoUser = (userEmail: string, roleTitle: string, name: string) => {
    setEmail(userEmail);
    setPassword("demo123");
    toast.info(`Filled credentials for ${roleTitle} (${name}). Click 'Sign In' to enter.`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground selection:bg-red-500/20 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 rounded-2xl bg-red-600/10 text-red-500 border border-red-600/25 shadow-xs">
            <Share2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight font-mono">
            ABUSE-RING <span className="text-red-500">SENTINEL</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider font-bold">
            Coordinated Payment Abuse Detection Platform
          </p>
        </div>

        {/* Credentials Form */}
        <Card className="rounded-3xl border border-border/60 shadow-md bg-card">
          <CardHeader className="p-6 pb-4 border-b border-border/40 bg-muted/10">
            <CardTitle className="text-base font-bold font-mono tracking-tight">
              Investigator Sign In
            </CardTitle>
            <CardDescription className="text-xs">
              Access the SOC console, relationship graph, and held-out model evaluation
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4 font-mono text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold font-mono">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@sentinel.ai"
                    className="h-9 pl-9 text-xs rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold font-mono">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-9 pl-9 text-xs rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-xs font-bold font-mono bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md gap-2 cursor-pointer"
              >
                <span>{loading ? "Signing in..." : "Sign In to Console →"}</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Personas */}
        <div className="space-y-3 font-mono">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block text-center">
            Demo Evaluation Personas (Click to Auto-Fill)
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSelectDemoUser("analyst@sentinel.ai", "Risk Analyst", "Priya Sharma")}
              className="p-3 rounded-2xl border border-border/60 bg-card hover:bg-muted/40 transition-all text-left space-y-1 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground group-hover:text-red-500">Priya Sharma</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0 text-red-500 border-red-500/30">
                  ANALYST
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">analyst@sentinel.ai</p>
            </button>

            <button
              type="button"
              onClick={() => handleSelectDemoUser("admin@sentinel.ai", "Security Admin", "Vikram Singh")}
              className="p-3 rounded-2xl border border-border/60 bg-card hover:bg-muted/40 transition-all text-left space-y-1 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground group-hover:text-purple-500">Vikram Singh</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0 text-purple-500 border-purple-500/30">
                  ADMIN
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">admin@sentinel.ai</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
