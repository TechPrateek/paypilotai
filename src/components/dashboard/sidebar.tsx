"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Share2,
  FileCheck2,
  Zap,
  Activity,
  ShieldCheck,
} from "lucide-react";

const navigation = [
  { name: "Overview & Spike Monitor", href: "/overview", icon: LayoutDashboard },
  { name: "Abuse-Ring Sentinel", href: "/transactions", icon: Share2 },
  { name: "Fraud-Spike Simulator", href: "/simulator", icon: Zap },
  { name: "Chargeback Evidence & Cases", href: "/risk-cases", icon: FileCheck2 },
  { name: "Model & Test Metrics", href: "/settings", icon: Activity },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 border-r bg-card h-full">
      <div className="flex items-center h-14 px-6 border-b shrink-0">
        <Link 
          href="/overview" 
          onClick={onNavigate}
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary"
        >
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span>PayPilot AI</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/overview" && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/40 text-xs text-muted-foreground space-y-1.5">
        <div className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
          Active Defense Modules
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Abuse-Ring Sentinel (GNN)</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Fraud-Spike Detector</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Chargeback Evidence Responder</span>
        </div>
      </div>
    </div>
  );
}
