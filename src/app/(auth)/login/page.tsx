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
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center mb-8">
        <Link href="/" className="flex items-center">
          <ShieldCheck className="h-10 w-10 text-primary mr-2" />
          <span className="font-bold text-3xl tracking-tight">PayPilot AI</span>
        </Link>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <span className="text-xs text-muted-foreground">
                  Default: demo123
                </span>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-100/50 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
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
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Demo Accounts (Click to Instant Login)
            </span>
          </div>
        </div>

        <div className="grid gap-3">
          <button 
            type="button"
            onClick={() => loginDemo("merchant@paypilot.ai")}
            className="flex items-center justify-between p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group cursor-pointer"
          >
            <div>
              <p className="font-medium text-sm group-hover:text-primary">Merchant Role</p>
              <p className="text-xs text-muted-foreground">merchant@paypilot.ai</p>
            </div>
            <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded">
              Instant Login →
            </span>
          </button>
          
          <button 
            type="button"
            onClick={() => loginDemo("analyst@paypilot.ai")}
            className="flex items-center justify-between p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group cursor-pointer"
          >
            <div>
              <p className="font-medium text-sm group-hover:text-primary">Analyst Role</p>
              <p className="text-xs text-muted-foreground">analyst@paypilot.ai</p>
            </div>
            <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded">
              Instant Login →
            </span>
          </button>
          
          <button 
            type="button"
            onClick={() => loginDemo("admin@paypilot.ai")}
            className="flex items-center justify-between p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group cursor-pointer"
          >
            <div>
              <p className="font-medium text-sm group-hover:text-primary">Admin Role</p>
              <p className="text-xs text-muted-foreground">admin@paypilot.ai</p>
            </div>
            <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded">
              Instant Login →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
