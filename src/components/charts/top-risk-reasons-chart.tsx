"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const defaultData = [
  { reason: "High Velocity", count: 32 },
  { reason: "Unusual Amount", count: 28 },
  { reason: "New Device", count: 25 },
  { reason: "Location Anomaly", count: 19 },
  { reason: "IP Risk", count: 14 },
  { reason: "Disposable Email", count: 11 },
];

export function TopRiskReasonsChart({ data = defaultData }: { data?: any[] }) {
  const displayData = (data && data.length > 0) ? data : defaultData;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={displayData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="reason" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11 }}
            width={130}
          />
          <Tooltip
            contentStyle={{ 
              borderRadius: "0.5rem",
            }}
          />
          <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
