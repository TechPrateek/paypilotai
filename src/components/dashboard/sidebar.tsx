"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Share2,
  Search,
  Network,
  CreditCard,
  Activity,
  Sliders,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { name: "OVERVIEW", href: "/overview", icon: LayoutDashboard },
    { name: "ABUSE RINGS", href: "/rings", icon: Share2, badge: "3" },
    { name: "INVESTIGATIONS", href: "/investigations/RING-0042", icon: Search },
    { name: "GRAPH EXPLORER", href: "/graph", icon: Network },
    { name: "TRANSACTIONS", href: "/transactions", icon: CreditCard },
    { name: "MODEL EVALUATION", href: "/evaluation", icon: Activity, badge: "96.6%" },
  ];

  const systemItems = [
    { name: "CONFIGURATION", href: "/settings", icon: Sliders },
  ];

  return (
    <div className="flex flex-col w-64 border-r border-border/40 bg-card/95 backdrop-blur-sm h-full select-none shadow-sm">
      {/* Brand Header */}
      <div className="p-5 border-b border-border/40">
        <Link 
          href="/overview" 
          onClick={onNavigate}
          className="flex items-center gap-3 group"
        >
          {/* Minimal connected-ring logo */}
          <div className="p-2 rounded-xl bg-red-600/10 text-red-500 border border-red-600/25 group-hover:bg-red-600 group-hover:text-white transition-all duration-200 shadow-xs">
            <Share2 className="h-5 w-5 shrink-0" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-foreground leading-tight font-mono">
              ABUSE-RING<br />
              <span className="text-red-500">SENTINEL</span>
            </h1>
            <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5 font-mono">
              Graph Risk Intelligence
            </p>
          </div>
        </Link>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <span className="text-[9px] font-bold text-muted-foreground/70 tracking-widest uppercase px-3 block mb-2 font-mono">
            MONITOR & INVESTIGATE
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/overview" && pathname.startsWith(`${item.href}`));
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name + item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-150",
                    isActive
                      ? "bg-red-500/10 text-red-500 border border-red-500/25 shadow-xs dark:bg-red-500/15"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-red-500" : "text-muted-foreground")} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={cn(
                      "text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase",
                      isActive
                        ? "bg-red-500 text-white"
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

        {/* System Section */}
        <div className="pt-2 border-t border-border/40">
          <span className="text-[9px] font-bold text-muted-foreground/70 tracking-widest uppercase px-3 block mb-2 font-mono">
            SYSTEM
          </span>
          <nav className="space-y-1">
            {systemItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name + item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-150",
                    isActive
                      ? "bg-red-500/10 text-red-500 border border-red-500/25 shadow-xs dark:bg-red-500/15"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-red-500" : "text-muted-foreground")} />
                    <span className="truncate">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-border/40 bg-muted/15 space-y-1 font-mono">
        <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">
          SYSTEM STATUS
        </span>
        <div className="flex items-center justify-between text-xs pt-0.5">
          <span className="text-foreground font-bold">Detection Engine</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-500 font-bold text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
        </div>
      </div>
    </div>
  );
}
