"use client";

import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface CircularMetricGaugeProps {
  percentage: number;
  label: string;
  trend?: string;
  trendDirection?: "up" | "down";
  color?: string; // hex or tailwind class
  trackColor?: string;
  size?: number;
  strokeWidth?: number;
}

export function CircularMetricGauge({
  percentage,
  label,
  trend,
  trendDirection = "down",
  color = "#10B981", // default green
  trackColor = "#E2E8F0",
  size = 110,
  strokeWidth = 7,
}: CircularMetricGaugeProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-3 text-center">
      {/* SVG Donut Ring */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            className="dark:stroke-slate-800"
          />
          {/* Active Fill Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Percentage & Trend */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            {percentage.toFixed(percentage < 1 ? 2 : 2)}%
          </span>
          {trend && (
            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-0.5 mt-0.5">
              {trendDirection === "down" ? (
                <ArrowDown className="h-2.5 w-2.5 text-muted-foreground inline" />
              ) : (
                <ArrowUp className="h-2.5 w-2.5 text-emerald-500 inline" />
              )}
              {trend}
            </span>
          )}
        </div>
      </div>

      {/* Metric Label */}
      <span className="mt-2.5 text-xs sm:text-sm font-semibold text-foreground/90 max-w-[110px] leading-tight">
        {label}
      </span>
    </div>
  );
}
