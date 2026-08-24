"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Info, Database } from "lucide-react";

interface ConfidenceGaugeProps {
  confidence: number; // 0.0 - 1.0
  dataAvailability?: {
    historyAvailable?: boolean;
    identityAvailable?: boolean;
    graphAvailable?: boolean;
    behavioralFeaturesAvailable?: boolean;
  };
  size?: "sm" | "md" | "lg";
}

export function ConfidenceGauge({ confidence, dataAvailability, size = "md" }: ConfidenceGaugeProps) {
  const percentage = Math.round((confidence || 0.5) * 100);
  const isHigh = percentage >= 75;
  const isMedium = percentage >= 50 && percentage < 75;

  const colorClass = isHigh
    ? "text-emerald-500"
    : isMedium
    ? "text-amber-500"
    : "text-blue-500";

  const label = isHigh ? "High (Known Customer)" : isMedium ? "Medium History" : "New Customer (Low History)";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className={`h-4 w-4 ${colorClass}`} />
          <span className="text-xs font-semibold text-foreground">AI Confidence (Based on Customer History)</span>
        </div>
        <Badge
          variant="outline"
          className={`text-xs font-mono font-bold ${
            isHigh ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : isMedium ? "border-amber-500/40 text-amber-400 bg-amber-500/10" : "border-blue-500/40 text-blue-400 bg-blue-500/10"
          }`}
        >
          {percentage}% — {label}
        </Badge>
      </div>

      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isHigh ? "bg-emerald-500" : isMedium ? "bg-amber-500" : "bg-blue-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {dataAvailability && (
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            {dataAvailability.historyAvailable ? (
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Info className="h-3.5 w-3.5 text-blue-400" />
            )}
            <span>{dataAvailability.historyAvailable ? "Customer Has Past Orders" : "First-Time Buyer (No Past Orders)"}</span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            {dataAvailability.graphAvailable ? (
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
            )}
            <span>{dataAvailability.graphAvailable ? "Phone & Connection Verified" : "Unseen Connection"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
