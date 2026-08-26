"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Sun,
  Moon,
  Menu,
  ShieldAlert,
  Share2,
  Radio,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { CommandPalette } from "@/components/search/command-palette";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            className="h-8 px-2.5 sm:px-3 text-xs text-muted-foreground rounded-xl border-slate-200/80 dark:border-slate-800"
          >
            <Search className="h-3.5 w-3.5 sm:mr-2" />
            <span className="hidden sm:inline">Search ring, customer, device, IP...</span>
            <kbd className="pointer-events-none ml-2 hidden lg:inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[9px] font-medium text-muted-foreground opacity-100">
              Ctrl+K
            </kbd>
          </Button>

          {/* Environment Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 text-[10px] font-mono font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>SYNTHETIC EVAL</span>
          </div>

          {/* Dark / Light Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 rounded-xl"
            title="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
          </Button>
        </div>
      </header>

      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
