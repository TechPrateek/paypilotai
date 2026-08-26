"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Share2,
  Users,
  Smartphone,
  Globe,
  CreditCard,
  Building,
} from "lucide-react";

export type SeverityType = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export function SeverityBadge({
  severity,
  className = "",
}: {
  severity: SeverityType | string;
  className?: string;
}) {
  const upper = (severity || "MEDIUM").toUpperCase();

  if (upper === "CRITICAL") {
    return (
      <Badge
        variant="destructive"
        className={`font-mono text-[10px] uppercase font-bold gap-1 bg-red-600/15 text-red-500 border border-red-600/30 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30 ${className}`}
      >
        <ShieldAlert className="h-3 w-3 text-red-500 shrink-0" />
        <span>CRITICAL</span>
      </Badge>
    );
  }

  if (upper === "HIGH") {
    return (
      <Badge
        variant="outline"
        className={`font-mono text-[10px] uppercase font-bold gap-1 bg-orange-500/15 text-orange-500 border border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30 ${className}`}
      >
        <AlertTriangle className="h-3 w-3 text-orange-500 shrink-0" />
        <span>HIGH</span>
      </Badge>
    );
  }

  if (upper === "MEDIUM") {
    return (
      <Badge
        variant="outline"
        className={`font-mono text-[10px] uppercase font-bold gap-1 bg-yellow-500/15 text-yellow-600 border border-yellow-500/30 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/30 ${className}`}
      >
        <Info className="h-3 w-3 text-yellow-500 shrink-0" />
        <span>MEDIUM</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`font-mono text-[10px] uppercase font-bold gap-1 bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 ${className}`}
    >
      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
      <span>LOW</span>
    </Badge>
  );
}

export function EntityIcon({ type, className = "h-3.5 w-3.5" }: { type: string; className?: string }) {
  const upper = (type || "").toUpperCase();
  if (upper.includes("DEVICE")) return <Smartphone className={className} />;
  if (upper.includes("IP")) return <Globe className={className} />;
  if (upper.includes("PAYMENT") || upper.includes("CARD")) return <CreditCard className={className} />;
  if (upper.includes("MERCHANT")) return <Building className={className} />;
  return <Users className={className} />;
}
