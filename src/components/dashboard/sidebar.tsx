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
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { language, t } = useLanguage();

  const navigation = [
    { name: t("overview"), href: "/overview", icon: LayoutDashboard },
    { name: t("fraudSpikeDetector"), href: "/simulator", icon: Zap },
    { name: t("abuseRingSentinel"), href: "/transactions", icon: Share2 },
    { name: t("metrics"), href: "/settings", icon: Activity },
  ];

  return (
    <div className="flex flex-col w-64 border-r bg-card h-full">
      <div className="flex items-center h-14 px-6 border-b shrink-0">
        <Link 
          href="/overview" 
          onClick={onNavigate}
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary"
        >
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span>{language === "hi" ? "PayPilot AI" : "PayPilot AI"}</span>
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

      {/* 2 Core Defense Pillars Indicator */}
      <div className="p-4 border-t border-border/40 text-xs text-muted-foreground space-y-2">
        <div className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
          {language === "hi" ? "2 सक्रिय सुरक्षा इंजन" : "2 Active Defense Pillars"}
        </div>
        <div className="flex items-center justify-between text-blue-400 text-[11px] bg-blue-500/10 p-2 rounded border border-blue-500/20">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-semibold">{t("fraudSpikeDetector")}</span>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold text-blue-400">{t("active")}</span>
        </div>
        <div className="flex items-center justify-between text-emerald-400 text-[11px] bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">{t("abuseRingSentinel")}</span>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold text-emerald-400">{t("active")}</span>
        </div>
      </div>
    </div>
  );
}
