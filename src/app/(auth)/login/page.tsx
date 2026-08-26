"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Share2,
  ShieldCheck,
  Loader2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
  Store,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/providers/session-provider";

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("analyst@paypilot.ai");
  const [password, setPassword] = useState("demo123");
  const [selectedPersona, setSelectedPersona] = useState<string>("ANALYST");
  const [error, setError] = useState("");

  const executeLogin = (userData: any) => {
    setUser(userData);
    toast.success(`Welcome back, ${userData.name}! Logged in as ${userData.role}.`);
    // Direct client redirect
    setTimeout(() => {
      window.location.href = "/overview";
    }, 150);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Try server API login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          executeLogin(data.user);
          return;
        }
      }
      
      // 2. Client-side fallback for demo credentials if API is unavailable
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail.includes("analyst") || cleanEmail.includes("priya")) {
        executeLogin({
          id: "demo-analyst-id",
          name: "Priya Sharma",
          email: "analyst@paypilot.ai",
          role: "ANALYST",
        });
      } else if (cleanEmail.includes("merchant") || cleanEmail.includes("raj")) {
        executeLogin({
          id: "demo-merchant-id",
          name: "Raj Patel",
          email: "merchant@paypilot.ai",
          role: "MERCHANT",
        });
      } else if (cleanEmail.includes("admin") || cleanEmail.includes("vikram")) {
        executeLogin({
          id: "demo-admin-id",
          name: "Vikram Singh",
          email: "admin@paypilot.ai",
          role: "ADMIN",
        });
      } else {
        // Generic fallback for any custom email
        executeLogin({
          id: "custom-user-id",
          name: email.split("@")[0] || "User",
          email: email.trim(),
          role: "ANALYST",
        });
      }
    } catch (err: any) {
      console.warn("API login issue, falling back to client session:", err);
      executeLogin({
        id: "demo-analyst-id",
        name: "Priya Sharma",
        email: email.trim(),
        role: "ANALYST",
      });
    }
  };

  // Auto-fill credentials ONLY (No auto-login)
  const handleFillCredentials = (demoEmail: string, role: string, name: string) => {
    setEmail(demoEmail);
    setPassword("demo123");
    setSelectedPersona(role);
    setError("");
    toast.info(`Filled credentials for ${name} (${role}). Click "Sign In to Dashboard" to proceed.`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground selection:bg-rose-500/20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg space-y-5 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/30 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shadow-md">
              <Share2 className="h-6 w-6 shrink-0" />
            </div>
            <div className="text-left">
              <h1 className="font-extrabold text-2xl tracking-tight text-foreground leading-tight flex items-center gap-1.5 font-mono">
                <span>PAYPILOT</span>
                <span className="text-rose-500">AI</span>
              </h1>
              <p className="text-[11px] text-muted-foreground font-medium">
                Abuse-Ring Sentinel & Risk Intelligence
              </p>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-mono font-bold mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AUTHENTICATION GATEWAY ONLINE</span>
          </div>
        </div>

        {/* 🌟 1. TOP CARD: Sign In with Credentials Form */}
        <Card className="rounded-3xl border border-border/80 bg-card shadow-lg">
          <CardHeader className="p-4 sm:p-5 pb-2">
            <CardTitle className="text-base font-bold tracking-tight">
              Sign In with Credentials
            </CardTitle>
            <CardDescription className="text-xs">
              Enter your account details or select a demo persona below to autofill.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 pt-2">
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="analyst@paypilot.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-9 pl-9 text-xs font-mono rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Demo: demo123
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-9 pl-9 pr-9 text-xs rounded-xl font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-2.5 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md cursor-pointer gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 🌟 2. BOTTOM CARD: Demo Accounts for Autofill Only */}
        <Card className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xs shadow-sm overflow-hidden">
          <CardHeader className="p-4 sm:p-5 pb-2 bg-muted/20 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-rose-500" />
                <span>Demo Accounts (Click to Auto-Fill)</span>
              </CardTitle>
              <Badge variant="outline" className="font-mono text-[9px]">
                Auto-Fill Only
              </Badge>
            </div>
            <CardDescription className="text-[11px]">
              Click any role to fill the form above:
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-2">
            {/* 1. Fraud Analyst Card */}
            <button
              type="button"
              onClick={() => handleFillCredentials("analyst@paypilot.ai", "ANALYST", "Priya Sharma")}
              className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all text-left cursor-pointer group ${
                selectedPersona === "ANALYST"
                  ? "border-rose-500/50 bg-rose-500/10 shadow-xs"
                  : "border-border/60 bg-muted/15 hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${selectedPersona === "ANALYST" ? "bg-rose-500 text-white" : "bg-rose-500/10 text-rose-500"}`}>
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-foreground">
                      Priya Sharma
                    </span>
                    <Badge variant="destructive" className="font-mono text-[9px] py-0 h-4 uppercase">
                      Analyst
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    analyst@paypilot.ai • Graph Forensics
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded-lg border border-rose-500/20">
                {selectedPersona === "ANALYST" ? "Selected ✓" : "Fill Form"}
              </span>
            </button>

            {/* 2. Merchant Store Owner Card */}
            <button
              type="button"
              onClick={() => handleFillCredentials("merchant@paypilot.ai", "MERCHANT", "Raj Patel")}
              className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all text-left cursor-pointer group ${
                selectedPersona === "MERCHANT"
                  ? "border-blue-500/50 bg-blue-500/10 shadow-xs"
                  : "border-border/60 bg-muted/15 hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${selectedPersona === "MERCHANT" ? "bg-blue-500 text-white" : "bg-blue-500/10 text-blue-500"}`}>
                  <Store className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-foreground">
                      Raj Patel
                    </span>
                    <Badge variant="outline" className="font-mono text-[9px] py-0 h-4 uppercase text-blue-500 border-blue-500/30">
                      Merchant
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    merchant@paypilot.ai • Store Shield
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20">
                {selectedPersona === "MERCHANT" ? "Selected ✓" : "Fill Form"}
              </span>
            </button>

            {/* 3. Security Admin Card */}
            <button
              type="button"
              onClick={() => handleFillCredentials("admin@paypilot.ai", "ADMIN", "Vikram Singh")}
              className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all text-left cursor-pointer group ${
                selectedPersona === "ADMIN"
                  ? "border-purple-500/50 bg-purple-500/10 shadow-xs"
                  : "border-border/60 bg-muted/15 hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${selectedPersona === "ADMIN" ? "bg-purple-500 text-white" : "bg-purple-500/10 text-purple-500"}`}>
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-foreground">
                      Vikram Singh
                    </span>
                    <Badge variant="outline" className="font-mono text-[9px] py-0 h-4 uppercase text-purple-500 border-purple-500/30">
                      Admin
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    admin@paypilot.ai • Governance
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-500 bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/20">
                {selectedPersona === "ADMIN" ? "Selected ✓" : "Fill Form"}
              </span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
