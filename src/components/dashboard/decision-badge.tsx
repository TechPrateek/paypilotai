import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Decision = "APPROVE" | "APPROVE_WITH_MONITORING" | "REVIEW" | "BLOCK";

interface DecisionBadgeProps {
  decision: Decision | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function DecisionBadge({ decision, size = "md", className }: DecisionBadgeProps) {
  const normalizedDecision = decision?.toUpperCase() as Decision;
  
  const variants: Record<Decision, string> = {
    APPROVE: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20",
    APPROVE_WITH_MONITORING: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/25 border-yellow-500/20",
    REVIEW: "bg-orange-500/15 text-orange-700 dark:text-orange-400 hover:bg-orange-500/25 border-orange-500/20",
    BLOCK: "bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/25 border-red-500/20",
  };

  const labels: Record<Decision, string> = {
    APPROVE: "Approve",
    APPROVE_WITH_MONITORING: "Monitor",
    REVIEW: "Review",
    BLOCK: "Block",
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
        "font-semibold tracking-wider",
        variants[normalizedDecision] || variants.REVIEW,
        sizes[size],
        className
      )}
    >
      {labels[normalizedDecision] || decision}
    </Badge>
  );
}
