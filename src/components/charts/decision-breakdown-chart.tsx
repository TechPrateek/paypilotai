"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const defaultData = [
  { name: "Approve", value: 410, color: "#10b981" },
  { name: "Review", value: 75, color: "#f97316" },
  { name: "Block", value: 35, color: "#ef4444" },
];

export function DecisionBreakdownChart({ data = defaultData }: { data?: any[] }) {
  const colors = ["#10b981", "#f97316", "#ef4444", "#eab308"];
  const displayData = (data && data.length > 0) ? data : defaultData;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={displayData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ 
              borderRadius: "0.5rem",
            }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
