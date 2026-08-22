"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useTheme } from "next-themes";

const defaultData = [
  { date: "Aug 01", count: 18 },
  { date: "Aug 05", count: 32 },
  { date: "Aug 10", count: 45 },
  { date: "Aug 15", count: 38 },
  { date: "Aug 20", count: 62 },
  { date: "Aug 25", count: 54 },
  { date: "Aug 30", count: 78 },
];

export function TransactionVolumeChart({ data = defaultData }: { data?: any[] }) {
  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === "dark" ? "#6366f1" : "#4f46e5";
  const displayData = (data && data.length > 0) ? data : defaultData;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`}
          />
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <Tooltip
            contentStyle={{ 
              borderRadius: "0.5rem",
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
