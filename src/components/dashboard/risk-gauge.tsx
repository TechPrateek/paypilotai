"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  score: number; // 0 to 100
  size?: number;
  className?: string;
}

export function RiskGauge({ score, size = 200, className }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = size / 2.5;
  const strokeWidth = size / 12;
  const circumference = 2 * Math.PI * radius;
  
  // Create an arc for the top 180 degrees (half circle)
  const arcLength = circumference / 2;
  const dashOffset = arcLength - (animatedScore / 100) * arcLength;

  // Determine color based on score
  let colorClass = "text-emerald-500";
  let label = "LOW RISK";
  
  if (score >= 30 && score < 60) {
    colorClass = "text-amber-500";
    label = "MEDIUM RISK";
  } else if (score >= 60 && score < 80) {
    colorClass = "text-orange-500";
    label = "HIGH RISK";
  } else if (score >= 80) {
    colorClass = "text-destructive";
    label = "CRITICAL RISK";
  }

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)} style={{ width: size, height: size * 0.75 }}>
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`} className="overflow-visible">
        {/* Background Arc */}
        <path
          d={`M ${size * 0.1} ${size * 0.55} A ${radius} ${radius} 0 0 1 ${size * 0.9} ${size * 0.55}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-muted/30"
        />
        
        {/* Foreground Arc */}
        <path
          d={`M ${size * 0.1} ${size * 0.55} A ${radius} ${radius} 0 0 1 ${size * 0.9} ${size * 0.55}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={dashOffset}
          className={cn("transition-all duration-1000 ease-out", colorClass)}
        />
      </svg>
      
      <div className="absolute flex flex-col items-center bottom-0 translate-y-1/4">
        <span className="text-4xl font-bold tracking-tighter tabular-nums">{Math.round(animatedScore)}</span>
        <span className={cn("text-xs font-bold tracking-widest mt-1", colorClass)}>{label}</span>
      </div>
    </div>
  );
}
