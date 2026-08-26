"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Share2,
  Search,
  Activity,
  CreditCard,
  Settings,
  ShieldAlert,
  Radio,
  Network,
  Cpu,
} from "lucide-react";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/overview", icon: LayoutDashboard },
    { name: "Abuse Rings", href: "/rings", icon: Share2, badge: "3 Active" },
    { name: "Investigations", href: "/investigations/RING-0042", icon: Search, badge: "Flagship" },
    { name: "Graph Explorer", href: "/graph", icon: Network },
    { name: "Transactions", href: "/transactions", icon: CreditCard },
    { name: "Model Evaluation", href: "/evaluation", icon: Activity, badge: "Holdout" },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 border-r border-border/40 bg-card/95 backdrop-blur-sm h-full shadow-sm">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-border/40">
        <Link 
          href="/overview" 
          onClick={onNavigate}
          className="flex items-center gap-3 group"
        >
          {/* Minimal Connected Ring Logo */}
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-all duration-200">
            <Share2 className="h-5 w-5 shrink-0" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-foreground leading-tight flex items-center gap-1.5">
              <span>PAYPILOT</span>
              <span className="text-rose-500 font-mono">AI</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium leading-none mt-0.5 tracking-tight">
              Abuse-Ring Sentinel
            </p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <span className="text-[10px] font-bold text-muted-foreground/80 tracking-wider uppercase px-3 block mb-2 font-mono">
            Navigation
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/overview" && pathname.startsWith(`${item.href}`));
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150",
                    isActive
                      ? "bg-rose-500/10 text-rose-500 font-bold border border-rose-500/20 shadow-xs"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-rose-500" : "text-muted-foreground")} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={cn(
                      "text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold uppercase",
                      isActive
                        ? "bg-rose-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-3.5 border-t border-border/40 bg-muted/15 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-muted-foreground">Detection Engine:</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-500 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ONLINE
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/80">
          <span>Environment:</span>
          <span className="font-bold text-foreground/80 uppercase">Synthetic Eval</span>
        </div>
      </div>
    </div>
  );
}
