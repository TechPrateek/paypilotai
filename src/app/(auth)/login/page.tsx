"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/session-provider";

export default function LoginPage() {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("merchant@paypilot.ai");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        toast.success(`Welcome back, ${data.user?.name || "Merchant"}!`);
        window.location.href = "/overview";
      } else {
        setError(data.error || "Invalid email or password. Please try again.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const selectDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo123");
    setError("");
    toast.info(`Filled credentials for ${demoEmail}. Click 'Sign In' to continue.`);
  };

  const quickInstantLogin = (role: "ANALYST" | "MERCHANT") => {
    if (role === "ANALYST") {
      setUser({
        id: "analyst-01",
        name: "Priya Sharma",
        email: "analyst@paypilot.ai",
        role: "ANALYST",
      });
      toast.success("Signed in as Priya Sharma (Fraud Analyst)!");
    } else {
      setUser({
        id: "merchant-01",
        name: "Raj Patel",
        email: "merchant@paypilot.ai",
        role: "MERCHANT",
      });
      toast.success("Signed in as Raj Patel (Merchant)!");
    }
    window.location.href = "/overview";
  };

  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap">
          <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10 text-primary shrink-0" />
          <span className="font-bold text-2xl sm:text-3xl tracking-tight">PayPilot AI</span>
        </Link>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 text-center">
          Payment Fraud & Abuse-Ring Risk Manager
        </p>
      </div>

      <Card className="w-full shadow-md border border-border/60">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="text-xl sm:text-2xl">Sign In to Dashboard</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Enter your email and password, or click a demo account below to fill.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 text-sm font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
                <span className="text-[11px] text-muted-foreground">
                  Default: demo123
                </span>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 text-sm"
              />
            </div>
            
            {error && (
              <div className="p-3 text-xs sm:text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-10 font-semibold cursor-pointer" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In →"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-3">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/40" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-background px-2 text-muted-foreground font-semibold rounded">
              Click to Auto-Fill Credentials
            </span>
          </div>
        </div>

        <div className="grid gap-2">
          <button 
            type="button"
            onClick={() => quickInstantLogin("ANALYST")}
            className="flex items-center justify-between p-2.5 sm:p-3 border border-rose-500/40 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 transition-all text-left cursor-pointer shadow-xs"
          >
            <div className="min-w-0 pr-2">
              <p className="font-bold text-xs sm:text-sm text-foreground">1. Risk Analyst Account (Recommended)</p>
              <p className="text-[11px] text-muted-foreground font-mono">Priya Sharma • analyst@paypilot.ai</p>
            </div>
            <span className="text-[11px] bg-rose-500 text-white font-bold px-2.5 py-1 rounded-lg shrink-0">
              1-Click Login →
            </span>
          </button>
          
          <button 
            type="button"
            onClick={() => quickInstantLogin("MERCHANT")}
            className="flex items-center justify-between p-2.5 sm:p-3 border border-border/60 rounded-xl bg-card hover:bg-muted/40 transition-all text-left cursor-pointer"
          >
            <div className="min-w-0 pr-2">
              <p className="font-bold text-xs sm:text-sm text-foreground">2. Merchant Store Owner</p>
              <p className="text-[11px] text-muted-foreground font-mono">Raj Patel • merchant@paypilot.ai</p>
            </div>
            <span className="text-[11px] bg-muted text-foreground font-semibold px-2.5 py-1 rounded-lg shrink-0">
              1-Click Login →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
