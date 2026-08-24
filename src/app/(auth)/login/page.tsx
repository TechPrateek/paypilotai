"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/session-provider";

export default function LoginPage() {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const loginDemo = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo123");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: demoEmail,
          password: "demo123",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        toast.success(`Signed in as ${data.user?.name}!`);
        window.location.href = "/overview";
      } else {
        setError(data.error || "Failed to sign in with demo account.");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap">
          <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10 text-primary shrink-0" />
          <span className="font-bold text-2xl sm:text-3xl tracking-tight">PayPilot AI</span>
        </Link>
      </div>

      <Card className="w-full shadow-sm">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="text-xl sm:text-2xl">Sign In</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 text-sm"
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
              <div className="p-3 text-xs sm:text-sm text-red-500 bg-red-100/50 dark:bg-red-900/20 rounded-md">
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
                "Sign In"
              )}
            </Button>
          </form>
          
          <div className="mt-5 text-center text-xs sm:text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-muted/50 sm:bg-background px-2 text-muted-foreground font-medium rounded">
              Demo Accounts (Instant Access)
            </span>
          </div>
        </div>

        <div className="grid gap-2 sm:gap-3">
          <button 
            type="button"
            onClick={() => loginDemo("merchant@paypilot.ai")}
            className="flex items-center justify-between p-2.5 sm:p-3 border rounded-lg bg-card hover:border-primary hover:bg-primary/5 transition-all text-left group cursor-pointer"
          >
            <div className="min-w-0 pr-2">
              <p className="font-medium text-xs sm:text-sm group-hover:text-primary leading-tight">Merchant Role</p>
              <p className="text-[11px] text-muted-foreground truncate">merchant@paypilot.ai</p>
            </div>
            <span className="text-[11px] sm:text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shrink-0">
              Login →
            </span>
          </button>
          
          <button 
            type="button"
            onClick={() => loginDemo("analyst@paypilot.ai")}
            className="flex items-center justify-between p-2.5 sm:p-3 border rounded-lg bg-card hover:border-primary hover:bg-primary/5 transition-all text-left group cursor-pointer"
          >
            <div className="min-w-0 pr-2">
              <p className="font-medium text-xs sm:text-sm group-hover:text-primary leading-tight">Analyst Role</p>
              <p className="text-[11px] text-muted-foreground truncate">analyst@paypilot.ai</p>
            </div>
            <span className="text-[11px] sm:text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shrink-0">
              Login →
            </span>
          </button>
          
          <button 
            type="button"
            onClick={() => loginDemo("admin@paypilot.ai")}
            className="flex items-center justify-between p-2.5 sm:p-3 border rounded-lg bg-card hover:border-primary hover:bg-primary/5 transition-all text-left group cursor-pointer"
          >
            <div className="min-w-0 pr-2">
              <p className="font-medium text-xs sm:text-sm group-hover:text-primary leading-tight">Admin Role</p>
              <p className="text-[11px] text-muted-foreground truncate">admin@paypilot.ai</p>
            </div>
            <span className="text-[11px] sm:text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shrink-0">
              Login →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
