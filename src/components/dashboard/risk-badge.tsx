import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface RiskBadgeProps {
  level: RiskLevel | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RiskBadge({ level, size = "md", className }: RiskBadgeProps) {
  const normalizedLevel = level?.toUpperCase() as RiskLevel;
  
  const variants: Record<RiskLevel, string> = {
    LOW: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20",
    MEDIUM: "bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25 border-amber-500/20",
    HIGH: "bg-orange-500/15 text-orange-700 dark:text-orange-400 hover:bg-orange-500/25 border-orange-500/20",
    CRITICAL: "bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/25 border-red-500/20",
  };

  const sizes = {
    sm: "text-[10px] px-1.5 py-0 h-4",
    md: "text-xs px-2.5 py-0.5 h-5",
    lg: "text-sm px-3 py-1 h-6",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold uppercase tracking-wider",
        variants[normalizedLevel] || variants.MEDIUM,
        sizes[size],
        className
      )}
    >
      {level}
    </Badge>
  );
}
