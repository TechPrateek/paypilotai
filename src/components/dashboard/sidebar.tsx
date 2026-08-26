"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Share2,
  Zap,
  Activity,
  ShieldCheck,
  Bell,
  LogOut,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { useAuth } from "@/providers/session-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const { data: sessionData, logout } = useAuth();

  const currentUser = sessionData?.user || {
    name: "Senior Analyst",
    email: "analyst@paypilot.ai",
    role: "Risk Management Team",
  };

  const navItems = [
    { name: language === "hi" ? "डैशबोर्ड" : "Dashboard", href: "/overview", icon: LayoutDashboard },
    { name: language === "hi" ? "तेज़ अटैक डिटेक्टर" : "Fraud-Spike Detector", href: "/simulator", icon: Zap },
    { name: language === "hi" ? "अटैक रिंग जासूस" : "Abuse-Ring Sentinel", href: "/transactions", icon: Share2 },
    { name: language === "hi" ? "मॉडल और मेट्रिक्स" : "Risk Model Metrics", href: "/settings", icon: Activity },
  ];

  return (
    <div className="flex flex-col w-64 border-r bg-card/95 backdrop-blur-sm h-full shadow-sm">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-border/40">
        <Link 
          href="/overview" 
          onClick={onNavigate}
          className="flex items-center gap-3 group"
        >
          <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
            <ShieldCheck className="h-6 w-6 shrink-0" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-foreground leading-tight">PayPilot AI</h1>
            <p className="text-[11px] text-muted-foreground font-medium leading-none mt-0.5">
              Risk Management Platform
            </p>
          </div>
        </Link>
      </div>

      {/* Main Navigation: Analysis Tools */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wider uppercase px-3 block mb-2">
            Analysis Tools
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/overview" && pathname.startsWith(`${item.href}/`));
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150",
                    isActive
                      ? "bg-primary/10 text-primary font-bold shadow-xs border border-primary/20"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Alert Status Section (Matching Image 1) */}
        <div>
          <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wider uppercase px-3 block mb-2">
            Alert Status
          </span>
          <div className="space-y-1.5 px-1">
            <Link
              href="/transactions?filter=HIGH"
              onClick={onNavigate}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-foreground/90">High Risk</span>
              </div>
              <span className="text-[11px] font-mono font-bold bg-rose-500/15 text-rose-500 px-2 py-0.5 rounded-full">
                18
              </span>
            </Link>

            <Link
              href="/transactions?filter=MEDIUM"
              onClick={onNavigate}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-foreground/90">Medium Risk</span>
              </div>
              <span className="text-[11px] font-mono font-bold bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-full">
                28
              </span>
            </Link>

            <Link
              href="/transactions?filter=REVIEW"
              onClick={onNavigate}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-foreground/90">Under Review</span>
              </div>
              <span className="text-[11px] font-mono font-bold bg-blue-500/15 text-blue-500 px-2 py-0.5 rounded-full">
                42
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Profile Footer (Matching Image 1) */}
      <div className="p-3.5 border-t border-border/40 bg-muted/15 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar className="h-8 w-8 rounded-full border border-primary/20 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              SA
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-foreground truncate leading-tight">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-muted-foreground truncate leading-tight">
              Risk Management Team
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          title="Sign Out"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
