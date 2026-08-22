"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const defaultData = [
  { name: "LOW", count: 410, color: "#10b981" },
  { name: "MEDIUM", count: 75, color: "#f59e0b" },
  { name: "HIGH", count: 25, color: "#f97316" },
  { name: "CRITICAL", count: 10, color: "#ef4444" },
];

export function RiskDistributionChart({ data = defaultData }: { data?: any[] }) {
  const colors = ["#10b981", "#f59e0b", "#f97316", "#ef4444"];
  const displayData = (data && data.length > 0) ? data : defaultData;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12 }}
          />
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <Tooltip
            contentStyle={{ 
              borderRadius: "0.5rem",
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50}>
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
