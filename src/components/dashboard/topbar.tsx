"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Sun,
  Moon,
  Menu,
  Share2,
  UserCheck,
  LogOut,
  Sliders,
  ChevronDown,
  ShieldAlert,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { CommandPalette } from "@/components/search/command-palette";
import { useAuth } from "@/providers/session-provider";
import { toast } from "sonner";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, setUser, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const currentUser = session?.user || {
    id: "analyst-01",
    name: "Priya Sharma",
    email: "analyst@sentinel.ai",
    role: "ANALYST",
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchPersona = (role: "ANALYST" | "ADMIN") => {
    const newUser =
      role === "ADMIN"
        ? {
            id: "admin-01",
            name: "Vikram Singh",
            email: "admin@sentinel.ai",
            role: "ADMIN",
          }
        : {
            id: "analyst-01",
            name: "Priya Sharma",
            email: "analyst@sentinel.ai",
            role: "ANALYST",
          };

    setUser(newUser);
    try {
      localStorage.setItem("paypilot_user", JSON.stringify(newUser));
    } catch {}
    setProfileOpen(false);
    toast.success(`Switched persona to ${newUser.name} (${role})`);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    try {
      localStorage.removeItem("paypilot_user");
    } catch {}
    logout();
    toast.info("Signed out successfully.");
    window.location.href = "/login";
  };

  const getPageInfo = () => {
    if (pathname.includes("/investigations")) {
      return { title: "INVESTIGATIONS", desc: "Flagship relationship graph & syndicate forensics" };
    }
    if (pathname.includes("/rings")) {
      return { title: "ABUSE RINGS", desc: "Detected groups exhibiting coordinated payment-abuse behavior" };
    }
    if (pathname.includes("/graph")) {
      return { title: "GRAPH EXPLORER", desc: "Full-screen heterogeneous entity network inspection" };
    }
    if (pathname.includes("/transactions")) {
      return { title: "TRANSACTIONS", desc: "Correlated payment records linked to detected abuse patterns" };
    }
    if (pathname.includes("/evaluation")) {
      return { title: "MODEL EVALUATION", desc: "Empirical performance measured on temporal held-out test set" };
    }
    if (pathname.includes("/settings")) {
      return { title: "CONFIGURATION", desc: "Detection policy, business cost assumptions and model pipeline" };
    }
    return { title: "OVERVIEW", desc: "Monitor coordinated payment abuse and emerging fraud rings" };
  };

  const { title, desc } = getPageInfo();

  return (
    <>
      <header className="h-14 border-b border-border/40 bg-card/90 backdrop-blur-md flex items-center justify-between px-3 sm:px-4 lg:px-6 shrink-0 sticky top-0 z-30 shadow-xs">
        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger className="inline-flex items-center justify-center rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-1.5 font-bold text-sm text-foreground font-mono">
            <Share2 className="h-4 w-4 text-red-500" />
            <span>SENTINEL</span>
          </div>
        </div>

        {/* Page Title & Context Description */}
        <div className="hidden md:flex flex-col min-w-0">
          <span className="text-xs font-black tracking-wider uppercase text-foreground font-mono">
            {title}
          </span>
          <span className="text-[11px] text-muted-foreground font-medium truncate">
            {desc}
          </span>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchOpen(true)}
            className="h-8 px-2.5 sm:px-3 text-xs text-muted-foreground rounded-xl border-border/60 hover:border-red-500/30 cursor-pointer font-mono"
          >
            <Search className="h-3.5 w-3.5 sm:mr-2" />
            <span className="hidden sm:inline">Search ring, customer, device, IP...</span>
            <kbd className="pointer-events-none ml-2 hidden lg:inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[9px] font-medium text-muted-foreground opacity-100">
              Ctrl+K
            </kbd>
          </Button>

          {/* Environment Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/25 text-[10px] font-mono font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>SYNTHETIC EVALUATION</span>
          </div>

          {/* Dark / Light Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 rounded-xl cursor-pointer"
            title="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
          </Button>

          {/* Interactive Profile Dropdown Menu */}
          <div className="relative pl-2 border-l border-border/40" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer text-left"
            >
              <div className="h-7 w-7 rounded-xl bg-red-500/15 text-red-500 font-mono font-bold text-xs flex items-center justify-center border border-red-500/30 shadow-xs">
                <UserCheck className="h-3.5 w-3.5" />
              </div>
              <div className="hidden xl:flex flex-col text-left leading-tight">
                <span className="font-bold text-xs text-foreground font-mono">{currentUser.name}</span>
                <span className="text-[9px] font-mono text-muted-foreground uppercase">{currentUser.role}</span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground hidden xl:block" />
            </button>

            {/* Dropdown Menu Popup */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border/60 bg-card/98 backdrop-blur-xl shadow-xl z-50 p-2 font-mono text-xs animate-in fade-in zoom-in-95 duration-100">
                {/* User Info Header */}
                <div className="p-2.5 border-b border-border/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{currentUser.name}</span>
                    <Badge variant="outline" className="text-[9px] font-mono uppercase text-red-500 border-red-500/30">
                      {currentUser.role}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{currentUser.email}</p>
                </div>

                {/* Persona Switcher Section */}
                <div className="py-2 px-1 space-y-1 border-b border-border/40">
                  <span className="text-[9px] font-bold text-muted-foreground/70 uppercase px-2 block">
                    Switch Evaluation Persona
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => handleSwitchPersona("ANALYST")}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      currentUser.role === "ANALYST"
                        ? "bg-red-500/10 text-red-500 font-bold"
                        : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-3.5 w-3.5 text-red-500" />
                      <span>Priya Sharma (Analyst)</span>
                    </div>
                    {currentUser.role === "ANALYST" && <span className="text-[9px]">✓ Active</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchPersona("ADMIN")}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      currentUser.role === "ADMIN"
                        ? "bg-purple-500/10 text-purple-500 font-bold"
                        : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-3.5 w-3.5 text-purple-500" />
                      <span>Vikram Singh (Admin)</span>
                    </div>
                    {currentUser.role === "ADMIN" && <span className="text-[9px]">✓ Active</span>}
                  </button>
                </div>

                {/* Settings & Logout Links */}
                <div className="pt-1 space-y-0.5">
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Configuration</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer text-left font-bold"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
