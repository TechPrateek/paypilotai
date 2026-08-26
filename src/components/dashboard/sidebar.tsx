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
  Store,
  Sliders,
  ShieldCheck,
  TrendingUp,
  Network,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/session-provider";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useAuth();
  const user = session?.user;
  const role = user?.role || "ANALYST";

  // 🌟 Distinct Navigation Items per Role
  const getNavItems = () => {
    if (role === "MERCHANT") {
      return [
        { name: "Store Dashboard", href: "/overview", icon: LayoutDashboard, badge: "Live" },
        { name: "Orders & Payments", href: "/transactions", icon: CreditCard },
        { name: "Blocked Threats", href: "/rings", icon: ShieldCheck, badge: "₹8.4L Saved" },
        { name: "Store Settings", href: "/settings", icon: Settings },
      ];
    }

    if (role === "ADMIN") {
      return [
        { name: "Executive Overview", href: "/overview", icon: LayoutDashboard },
        { name: "Model Evaluation", href: "/evaluation", icon: Activity, badge: "96.6% F1" },
        { name: "Abuse Syndicates", href: "/rings", icon: Share2, badge: "3 Active" },
        { name: "Global Graph", href: "/graph", icon: Network },
        { name: "All Transactions", href: "/transactions", icon: CreditCard },
        { name: "Cost & Rules Config", href: "/settings", icon: Sliders },
      ];
    }

    // Default: ANALYST (Flagship Investigation Mode)
    return [
      { name: "Threat Overview", href: "/overview", icon: LayoutDashboard },
      { name: "Abuse Rings", href: "/rings", icon: Share2, badge: "3 Active" },
      { name: "Flagship Investigation", href: "/investigations/RING-0042", icon: Search, badge: "Forensics" },
      { name: "Graph Explorer", href: "/graph", icon: Network },
      { name: "Transaction Ledger", href: "/transactions", icon: CreditCard },
      { name: "Model Evaluation", href: "/evaluation", icon: Activity, badge: "Holdout" },
      { name: "Settings", href: "/settings", icon: Settings },
    ];
  };

  const navItems = getNavItems();

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
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-all duration-200 shadow-xs">
            <Share2 className="h-5 w-5 shrink-0" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-foreground leading-tight flex items-center gap-1.5 font-mono">
              <span>PAYPILOT</span>
              <span className="text-rose-500">AI</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium leading-none mt-0.5 tracking-tight">
              Abuse-Ring Sentinel
            </p>
          </div>
        </Link>
      </div>

      {/* Active Role Indicator */}
      <div className="px-4 py-2.5 bg-muted/25 border-b border-border/30 flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground font-bold uppercase">
          Current View:
        </span>
        <Badge
          variant={role === "ANALYST" ? "destructive" : role === "MERCHANT" ? "default" : "secondary"}
          className="font-mono text-[9px] uppercase font-bold py-0 h-4"
        >
          {role === "MERCHANT" ? "🏬 Store Owner" : role === "ADMIN" ? "⚡ Security Admin" : "🛡️ Fraud Analyst"}
        </Badge>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <span className="text-[10px] font-bold text-muted-foreground/80 tracking-wider uppercase px-3 block mb-2 font-mono">
            {role === "MERCHANT" ? "Store Navigation" : role === "ADMIN" ? "Admin Controls" : "Investigation Workspaces"}
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
      <div className="p-3.5 border-t border-border/40 bg-muted/15 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-muted-foreground">Sentinel Engine:</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-500 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ONLINE
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/80">
          <span>Active Merchant:</span>
          <span className="font-bold text-foreground truncate max-w-[110px]">
            {role === "MERCHANT" ? "TechMart India" : "Global Gateway"}
          </span>
        </div>
      </div>
    </div>
  );
}
