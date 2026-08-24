"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowLeftRight,
  ShieldAlert,
  Users,
  Settings2,
  BarChart3,
  FlaskConical,
  Bell,
  FileText,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Risk Cases", href: "/risk-cases", icon: ShieldAlert },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Risk Rules", href: "/risk-rules", icon: Settings2 },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Simulator", href: "/simulator", icon: FlaskConical },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Audit Logs", href: "/audit-logs", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
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
          <ShieldAlert className="h-6 w-6 text-primary" />
          <span>PayPilot AI</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t text-xs text-muted-foreground text-center shrink-0">
        &copy; {new Date().getFullYear()} PayPilot AI
      </div>
    </div>
  );
}
