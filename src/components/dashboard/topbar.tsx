"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Sun,
  Moon,
  Menu,
  ShieldAlert,
  Share2,
  LogOut,
  LogIn,
  UserCheck,
  ChevronDown,
  User,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "./sidebar";
import { CommandPalette } from "@/components/search/command-palette";
import { useAuth } from "@/providers/session-provider";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: session, switchRole, logout } = useAuth();
  const user = session?.user;

  // Handle outside click to close profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageInfo = () => {
    if (pathname.includes("/investigations")) {
      return { title: "INVESTIGATION CONSOLE", desc: "Multi-hop graph forensics & ring isolation" };
    }
    if (pathname.includes("/rings")) {
      return { title: "ABUSE RINGS", desc: "Detected coordinated payment networks" };
    }
    if (pathname.includes("/graph")) {
      return { title: "GRAPH EXPLORER", desc: "Full-screen heterogeneous entity network search" };
    }
    if (pathname.includes("/transactions")) {
      return { title: "TRANSACTION LEDGER", desc: "Connected payment records with graph context" };
    }
    if (pathname.includes("/evaluation")) {
      return { title: "MODEL EVALUATION", desc: "Empirical performance on unseen temporal holdout" };
    }
    if (pathname.includes("/settings")) {
      return { title: "SYSTEM SETTINGS", desc: "Cost parameters & risk score thresholds" };
    }
    return { title: "OVERVIEW", desc: "Real-time coordinated abuse posture" };
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

          <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
            <Share2 className="h-4 w-4 text-rose-500" />
            <span>PAYPILOT AI</span>
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
          {/* Quick Search */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchOpen(true)}
            className="h-8 px-2.5 sm:px-3 text-xs text-muted-foreground rounded-xl border-slate-200/80 dark:border-slate-800 cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 sm:mr-2" />
            <span className="hidden sm:inline">Search ring, customer, device, IP...</span>
            <kbd className="pointer-events-none ml-2 hidden lg:inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[9px] font-medium text-muted-foreground opacity-100">
              Ctrl+K
            </kbd>
          </Button>

          {/* Environment Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 text-[10px] font-mono font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>SYNTHETIC EVAL</span>
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

          {/* 🌟 100% Reliable Pure React Profile Dropdown */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-muted/80 transition-all border border-border/60 outline-none cursor-pointer bg-card shadow-xs"
              >
                <div className="h-6 w-6 rounded-lg bg-rose-500 text-white font-mono font-bold text-[11px] flex items-center justify-center shadow-xs">
                  {user.name?.slice(0, 2).toUpperCase() || "PS"}
                </div>
                <div className="hidden lg:flex flex-col text-left text-xs leading-tight">
                  <span className="font-bold text-foreground truncate max-w-[100px]">{user.name?.split(" ")[0]}</span>
                  <span className="text-[9px] font-mono text-muted-foreground uppercase">{user.role}</span>
                </div>
                <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Popup Menu */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-card border border-border/80 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 space-y-1">
                  {/* User Header */}
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                    <span className="text-xs font-bold text-foreground block">{user.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground block truncate">{user.email}</span>
                    <Badge variant="outline" className="font-mono text-[9px] mt-1 uppercase text-rose-500 border-rose-500/30">
                      Active Role: {user.role}
                    </Badge>
                  </div>

                  <div className="py-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground px-2 py-1 block">
                      Switch Role Mode
                    </span>

                    {/* Analyst Option */}
                    <button
                      type="button"
                      onClick={() => {
                        switchRole("ANALYST");
                        setProfileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors text-left ${
                        user.role === "ANALYST" ? "bg-rose-500/10 text-rose-500 font-bold" : "hover:bg-muted/60 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        <span>Fraud Analyst Mode</span>
                      </div>
                      {user.role === "ANALYST" && <span className="text-[10px] font-mono font-bold text-rose-500">ACTIVE</span>}
                    </button>

                    {/* Merchant Option */}
                    <button
                      type="button"
                      onClick={() => {
                        switchRole("MERCHANT");
                        setProfileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors text-left ${
                        user.role === "MERCHANT" ? "bg-blue-500/10 text-blue-500 font-bold" : "hover:bg-muted/60 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Store className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span>Merchant Store Mode</span>
                      </div>
                      {user.role === "MERCHANT" && <span className="text-[10px] font-mono font-bold text-blue-500">ACTIVE</span>}
                    </button>

                    {/* Admin Option */}
                    <button
                      type="button"
                      onClick={() => {
                        switchRole("ADMIN");
                        setProfileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors text-left ${
                        user.role === "ADMIN" ? "bg-purple-500/10 text-purple-500 font-bold" : "hover:bg-muted/60 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                        <span>Admin Governance</span>
                      </div>
                      {user.role === "ADMIN" && <span className="text-[10px] font-mono font-bold text-purple-500">ACTIVE</span>}
                    </button>
                  </div>

                  <div className="border-t border-border/40 pt-1">
                    {/* Logout Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors text-left"
                    >
                      <LogOut className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span>Sign Out / Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="h-8 px-3 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl gap-1.5 shadow-xs cursor-pointer">
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </header>

      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
