"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const trendData = [
  { name: "Mon", fraud: 4000, legitimate: 24000 },
  { name: "Tue", fraud: 3000, legitimate: 13980 },
  { name: "Wed", fraud: 2000, legitimate: 98000 },
  { name: "Thu", fraud: 2780, legitimate: 39080 },
  { name: "Fri", fraud: 1890, legitimate: 48000 },
  { name: "Sat", fraud: 2390, legitimate: 38000 },
  { name: "Sun", fraud: 3490, legitimate: 43000 },
];

const countryData = [
  { name: "US", risk: 40 },
  { name: "UK", risk: 30 },
  { name: "CA", risk: 20 },
  { name: "FR", risk: 27 },
  { name: "DE", risk: 18 },
  { name: "BR", risk: 23 },
];

const paymentData = [
  { name: "Credit Card", risk: 400 },
  { name: "PayPal", risk: 300 },
  { name: "Crypto", risk: 200 },
  { name: "Bank Transfer", risk: 278 },
  { name: "Apple Pay", risk: 189 },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  transactions: Math.floor(Math.random() * 5000) + 1000,
}));

// Simple heatmap component using table
const Heatmap = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const periods = ["Morning", "Afternoon", "Evening", "Night"];

  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <table className="w-full min-w-[300px] text-xs sm:text-sm text-left">
        <thead>
          <tr>
            <th className="p-1 sm:p-2"></th>
            {periods.map((p) => (
              <th key={p} className="p-1 sm:p-2 text-center text-muted-foreground font-medium text-[11px] sm:text-xs">
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td className="p-1 sm:p-2 font-medium text-muted-foreground text-[11px] sm:text-xs">{day}</td>
              {periods.map((period) => {
                const intensity = Math.random();
                return (
                  <td key={`${day}-${period}`} className="p-1">
                    <div
                      className="h-8 sm:h-10 rounded-md flex items-center justify-center text-[10px] sm:text-xs font-medium text-white transition-opacity hover:opacity-80 cursor-pointer"
                      style={{
                        backgroundColor: `rgba(220, 38, 38, ${0.15 + intensity * 0.85})`,
                      }}
                      title={`${day} ${period}: ${(intensity * 100).toFixed(0)}% Risk`}
                    >
                      {(intensity * 10).toFixed(1)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7d");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [dateRange]);

  return (
    <div className="flex-1 space-y-4 p-2 sm:p-4 md:p-8 pt-4 sm:pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Advanced Analytics</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">Payment risk velocity, approval rates, and anomaly patterns</p>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Select value={dateRange} onValueChange={(val) => val && setDateRange(val)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Fraud Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">1.24%</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">-0.05% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">False Positives</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">0.8%</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">-0.2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Approval Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">96.5%</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">+1.2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Review Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">2.1%</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">-0.5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Block Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">1.4%</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">+0.1% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Prevented Loss</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">$124.5k</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Fraud Trend vs Legitimate Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 pt-0 sm:pt-0">
              <div className="h-[260px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="legitimate"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="fraud"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Risk Heatmap</CardTitle>
              <CardDescription className="text-xs">Concentration of high-risk transactions</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <Heatmap />
            </CardContent>
          </Card>

          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Risk by Country</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 pt-0 sm:pt-0">
              <div className="h-[220px] sm:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryData} layout="vertical" margin={{ left: -20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                      }}
                    />
                    <Bar dataKey="risk" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Hourly Transaction Pattern</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 pt-0 sm:pt-0">
              <div className="h-[220px] sm:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData}>
                    <XAxis dataKey="hour" className="text-xs" tick={{ fontSize: 10 }} interval={3} />
                    <YAxis className="text-xs" hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                      }}
                    />
                    <Bar dataKey="transactions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Risk by Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 pt-0 sm:pt-0">
              <div className="h-[220px] sm:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentData} layout="vertical" margin={{ left: -20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} className="text-xs text-right pr-2 sm:pr-4" width={90} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                      }}
                    />
                    <Bar dataKey="risk" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
