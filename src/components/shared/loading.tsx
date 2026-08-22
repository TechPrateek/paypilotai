import React from "react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  variant?: "card" | "table" | "page";
  className?: string;
}

export function Loading({ variant = "page", className }: LoadingProps) {
  if (variant === "card") {
    return (
      <div className={cn("rounded-xl border bg-card text-card-foreground shadow animate-pulse", className)}>
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-24 bg-muted rounded"></div>
          <div className="h-4 w-4 bg-muted rounded-full"></div>
        </div>
        <div className="p-6 pt-0">
          <div className="h-8 w-20 bg-muted rounded mb-2"></div>
          <div className="h-3 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("w-full space-y-4 animate-pulse", className)}>
        <div className="h-10 w-full bg-muted rounded"></div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 w-full bg-muted/50 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Page variant
  return (
    <div className={cn("w-full h-full flex flex-col space-y-6 animate-pulse p-4", className)}>
      <div className="h-8 w-48 bg-muted rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-xl"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-80 bg-muted rounded-xl"></div>
        <div className="h-80 bg-muted rounded-xl"></div>
      </div>
    </div>
  );
}
