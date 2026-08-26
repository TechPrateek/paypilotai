"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  TrendingUp,
  Download,
  CheckCircle2,
  Share2,
  Send,
  User,
  CreditCard,
  MapPin,
  Smartphone,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface TransactionRow {
  id: string;
  externalId: string;
  storeName: string;
  city: string;
  state?: string;
  country: string;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  amount: number;
  currency: string;
  status: "FLAGGED" | "UNDER_REVIEW" | "APPROVED";
  timeFormatted: string;
  customerName: string;
  customerPhone?: string;
  merchantCategory: string;
  paymentMethod: string;
  riskFactors: string[];
  deviceFingerprint: string;
  networkType: string;
  notes?: string;
}

const SAMPLE_TRANSACTIONS: TransactionRow[] = [
  {
    id: "tx-101",
    externalId: "TXN-2024-001",
    storeName: "Luxury Electronics Store",
    city: "Miami, FL",
    country: "US",
    riskScore: 87,
    riskLevel: "HIGH",
    amount: 15750.0,
    currency: "USD",
    status: "FLAGGED",
    timeFormatted: "Jan 15, 15:32",
    customerName: "Alex Rivera",
    customerPhone: "+1-305-555-0199",
    merchantCategory: "High-End Retail",
    paymentMethod: "Credit Card",
    riskFactors: ["Unusual Amount", "High Velocity", "New Device"],
    deviceFingerprint: "d9e8f7a6b5c43210",
    networkType: "Residential Broadband",
  },
  {
    id: "tx-102",
    externalId: "TXN-2024-002",
    storeName: "Casino Royal",
    city: "Las Vegas, NV",
    country: "US",
    riskScore: 92,
    riskLevel: "CRITICAL",
    amount: 500.0,
    currency: "USD",
    status: "FLAGGED",
    timeFormatted: "Jan 15, 04:45",
    customerName: "Michael Chen",
    customerPhone: "+1-555-0456",
    merchantCategory: "Gambling",
    paymentMethod: "Debit Card",
    riskFactors: ["Merchant Risk", "High Velocity", "Time Anomaly", "Tor Exit Node"],
    deviceFingerprint: "a1b2c3d4e5f6g7",
    networkType: "Tor Exit Node",
  },
  {
    id: "tx-103",
    externalId: "TXN-2024-003",
    storeName: "Global Coffee Chain",
    city: "New York, NY",
    country: "US",
    riskScore: 23,
    riskLevel: "LOW",
    amount: 89.99,
    currency: "USD",
    status: "APPROVED",
    timeFormatted: "Jan 15, 09:15",
    customerName: "Sarah Jenkins",
    customerPhone: "+1-212-555-8834",
    merchantCategory: "Food & Beverage",
    paymentMethod: "Apple Pay",
    riskFactors: ["Legitimate Customer", "Low Risk Category"],
    deviceFingerprint: "f0e1d2c3b4a56789",
    networkType: "Verizon Wireless",
  },
  {
    id: "tx-104",
    externalId: "TXN-2024-004",
    storeName: "Crypto Exchange Pro",
    city: "San Francisco, CA",
    country: "US",
    riskScore: 78,
    riskLevel: "HIGH",
    amount: 2500.0,
    currency: "USD",
    status: "UNDER_REVIEW",
    timeFormatted: "Jan 15, 12:20",
    customerName: "David Kumar",
    customerPhone: "+1-415-555-9120",
    merchantCategory: "Cryptocurrency",
    paymentMethod: "Wire Transfer",
    riskFactors: ["High Amount", "New IP Subnet", "Secondary Verification Req"],
    deviceFingerprint: "9876543210abcdef",
    networkType: "Cloudflare VPN",
  },
  {
    id: "tx-105",
    externalId: "TXN-2024-005",
    storeName: "Downtown Gas Station",
    city: "Chicago, IL",
    country: "US",
    riskScore: 15,
    riskLevel: "LOW",
    amount: 45.67,
    currency: "USD",
    status: "APPROVED",
    timeFormatted: "Jan 15, 17:45",
    customerName: "Emma Watson",
    customerPhone: "+1-312-555-4411",
    merchantCategory: "Automotive / Fuel",
    paymentMethod: "Debit Card",
    riskFactors: ["Known Card", "Recurring Pattern"],
    deviceFingerprint: "1234567890abcdef",
    networkType: "AT&T Mobility",
  },
  {
    id: "tx-106",
    externalId: "TXN-2024-006",
    storeName: "International Wire Service",
    city: "Los Angeles, CA",
    country: "US",
    riskScore: 95,
    riskLevel: "CRITICAL",
    amount: 8920.0,
    currency: "USD",
    status: "FLAGGED",
    timeFormatted: "Jan 15, 21:10",
    customerName: "Viktor Orlov",
    customerPhone: "+1-310-555-7799",
    merchantCategory: "Money Transfer",
    paymentMethod: "Credit Card",
    riskFactors: ["Coordinated Abuse Ring", "Shared Tor Device", "Velocity Attack"],
    deviceFingerprint: "a1b2c3d4e5f6g7",
    networkType: "Tor Exit Node",
  },
  {
    id: "tx-107",
    externalId: "TXN-2024-007",
    storeName: "Premium Restaurant",
    city: "Boston, MA",
    country: "US",
    riskScore: 35,
    riskLevel: "LOW",
    amount: 125.5,
    currency: "USD",
    status: "APPROVED",
    timeFormatted: "Jan 15, 20:30",
    customerName: "Rajesh Patel",
    customerPhone: "+1-617-555-3322",
    merchantCategory: "Dining",
    paymentMethod: "UPI / Card",
    riskFactors: ["Normal Range", "Domestic Card"],
    deviceFingerprint: "b2c3d4e5f6g7h8",
    networkType: "Comcast Cable",
  },
  {
    id: "tx-108",
    externalId: "TXN-2024-008",
    storeName: "Tech Hardware Store",
    city: "Seattle, WA",
    country: "US",
    riskScore: 69,
    riskLevel: "MEDIUM",
    amount: 3200.0,
    currency: "USD",
    status: "FLAGGED",
    timeFormatted: "Jan 15, 14:22",
    customerName: "Chloe Bennett",
    customerPhone: "+1-206-555-6677",
    merchantCategory: "Electronics",
    paymentMethod: "Credit Card",
    riskFactors: ["New Device", "First Time Purchase", "Needs 2FA"],
    deviceFingerprint: "c3d4e5f6g7h8i9",
    networkType: "T-Mobile USA",
  },
];

export default function OverviewPage() {
  const [selectedTx, setSelectedTx] = useState<TransactionRow>(SAMPLE_TRANSACTIONS[1]); // Default to Casino Royal TXN-2024-002
  const [filterTab, setFilterTab] = useState<"ALL" | "FLAGGED" | "UNDER_REVIEW" | "APPROVED">("ALL");
  const [analystNote, setAnalystNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = SAMPLE_TRANSACTIONS.filter((tx) => {
    const matchesTab =
      filterTab === "ALL"
        ? true
        : filterTab === "FLAGGED"
        ? tx.status === "FLAGGED"
        : filterTab === "UNDER_REVIEW"
        ? tx.status === "UNDER_REVIEW"
        : tx.status === "APPROVED";

    const matchesSearch =
      tx.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.externalId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleSaveNote = () => {
    if (!analystNote.trim()) return;
    toast.success(`Note saved for ${selectedTx.externalId}: "${analystNote}"`);
    setAnalystNote("");
  };

  return (
    <div className="space-y-6 p-3 sm:p-5 md:p-8 max-w-[1600px] mx-auto">
      {/* Top Header (Matching Image 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Fraud Detection Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
            Real-time transaction monitoring and risk analysis
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Exporting Fraud Audit Report (CSV)...")}
            className="h-9 gap-1.5 font-semibold text-xs rounded-xl shadow-xs border-slate-200 dark:border-slate-800"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
          </Button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Active</span>
          </div>
        </div>
      </div>

      {/* Top 4 Stat Cards (Matching Image 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Flagged Transactions */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                FLAGGED TRANSACTIONS
              </span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">4</div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mt-1">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>+12% from yesterday</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: High Risk Alerts */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                HIGH RISK ALERTS
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">4</div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mt-1">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>+5% from yesterday</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Under Review */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                UNDER REVIEW
              </span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">1</div>
              <div className="flex items-center gap-1 text-xs font-semibold text-rose-500 mt-1">
                <ArrowDownRight className="h-3.5 w-3.5" />
                <span>-8% from yesterday</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Avg Risk Score */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                AVG RISK SCORE
              </span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">62%</div>
              <div className="flex items-center gap-1 text-xs font-semibold text-purple-500 mt-1">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>+2% from yesterday</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Split Screen: Transactions Table (Left) + Transaction Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Flagged Transactions Table */}
        <div className="lg:col-span-7">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/10">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Flagged Transactions
                </CardTitle>
                <CardDescription className="text-xs">
                  Click any transaction to open live inspection on the right
                </CardDescription>
              </div>

              {/* Filter Tabs matching Image 1 */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFilterTab("ALL")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterTab === "ALL" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab("FLAGGED")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterTab === "FLAGGED" ? "bg-background text-rose-500 shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Flagged
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab("UNDER_REVIEW")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterTab === "UNDER_REVIEW" ? "bg-background text-blue-500 shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Under Review
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab("APPROVED")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterTab === "APPROVED" ? "bg-background text-emerald-500 shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Approved
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                      <th className="py-3 px-4">Transaction</th>
                      <th className="py-3 px-3">Risk Score</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-xs font-medium">
                    {filteredTransactions.map((tx) => {
                      const isSelected = selectedTx.id === tx.id;
                      return (
                        <tr
                          key={tx.id}
                          onClick={() => setSelectedTx(tx)}
                          className={`group cursor-pointer transition-all ${
                            isSelected
                              ? "bg-primary/10 border-l-4 border-primary font-semibold"
                              : "hover:bg-muted/40"
                          }`}
                        >
                          {/* Store Name & Location */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-lg bg-muted/80 text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                                <CreditCard className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-foreground block truncate">
                                  {tx.storeName}
                                </span>
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-2.5 w-2.5 inline" /> {tx.city}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Risk Score */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold font-mono text-xs">
                                {tx.riskScore}%
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  tx.riskScore >= 80
                                    ? "bg-rose-500/15 text-rose-500"
                                    : tx.riskScore >= 60
                                    ? "bg-amber-500/15 text-amber-500"
                                    : "bg-emerald-500/15 text-emerald-500"
                                }`}
                              >
                                {tx.riskLevel === "CRITICAL" || tx.riskScore >= 80
                                  ? "High Risk"
                                  : tx.riskScore >= 60
                                  ? "Medium Risk"
                                  : "Low Risk"}
                              </span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="py-3.5 px-3 font-mono font-bold text-foreground">
                            ${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-3">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider ${
                                tx.status === "FLAGGED"
                                  ? "bg-rose-500/15 text-rose-500 border border-rose-500/20"
                                  : tx.status === "UNDER_REVIEW"
                                  ? "bg-blue-500/15 text-blue-500 border border-blue-500/20"
                                  : "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>

                          {/* Time */}
                          <td className="py-3.5 px-4 text-right text-muted-foreground font-mono text-[11px]">
                            {tx.timeFormatted}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Transaction Analysis Panel (Matching Image 1) */}
        <div className="lg:col-span-5">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md sticky top-20 bg-card overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-sm font-bold tracking-tight">
                  Transaction Analysis
                </CardTitle>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {selectedTx.externalId}
              </Badge>
            </CardHeader>

            <CardContent className="p-5 space-y-5">
              {/* Risk Assessment Score Banner (Matching Image 1) */}
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Risk Assessment</span>
                  <span className="text-2xl font-black text-rose-500 font-mono">
                    {selectedTx.riskScore}%
                  </span>
                </div>
                {/* Horizontal Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-rose-500 transition-all duration-500"
                    style={{ width: `${selectedTx.riskScore}%` }}
                  />
                </div>
                <p className="text-[11px] font-semibold text-rose-500 mt-1">
                  {selectedTx.riskScore >= 80
                    ? "High risk - requires immediate attention"
                    : selectedTx.riskScore >= 60
                    ? "Medium risk - review customer context"
                    : "Low risk - transaction is clean and legitimate"}
                </p>
              </div>

              {/* Metadata Details Grid (Matching Image 1) */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    TRANSACTION ID
                  </span>
                  <span className="font-mono font-bold text-foreground mt-0.5 block">
                    {selectedTx.externalId}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    AMOUNT
                  </span>
                  <span className="font-mono font-bold text-foreground mt-0.5 block">
                    ${selectedTx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    CUSTOMER
                  </span>
                  <span className="font-semibold text-foreground mt-0.5 block">
                    {selectedTx.customerName}
                  </span>
                  <span className="text-[11px] text-muted-foreground block font-mono">
                    {selectedTx.customerPhone || "+1-555-0100"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    MERCHANT
                  </span>
                  <span className="font-semibold text-foreground mt-0.5 block">
                    {selectedTx.storeName}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    {selectedTx.merchantCategory}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    LOCATION & PAYMENT
                  </span>
                  <span className="font-semibold text-foreground mt-0.5 block">
                    {selectedTx.city}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    {selectedTx.paymentMethod}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    TRANSACTION TIME
                  </span>
                  <span className="font-semibold text-foreground mt-0.5 block">
                    {selectedTx.timeFormatted}, 2024
                  </span>
                </div>
              </div>

              {/* Risk Factors Pills (Matching Image 1) */}
              <div className="space-y-1.5 pt-2 border-t border-border/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Risk Factors
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTx.riskFactors.map((factor, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Device Fingerprint */}
              <div className="space-y-1 pt-2 border-t border-border/40 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Device Fingerprint
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {selectedTx.networkType}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-muted/40 font-mono text-[11px] text-foreground/90 border border-border/40 truncate">
                  {selectedTx.deviceFingerprint}
                </div>
              </div>

              {/* Abuse-Ring Graph Deep Link */}
              <div className="pt-1">
                <Link href={`/transactions`}>
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs font-bold gap-1.5 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10">
                    <Share2 className="h-3.5 w-3.5" /> View Multi-Hop Abuse-Ring Graph
                  </Button>
                </Link>
              </div>

              {/* Analyst Notes Section (Matching Image 1) */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Analyst Notes
                </span>
                <Textarea
                  value={analystNote}
                  onChange={(e) => setAnalystNote(e.target.value)}
                  placeholder="Add your analysis notes here..."
                  className="text-xs min-h-[60px] rounded-xl"
                />
                <Button
                  onClick={handleSaveNote}
                  size="sm"
                  className="w-full h-8 text-xs font-bold gap-1.5 rounded-xl shadow-xs"
                >
                  <Send className="h-3 w-3" /> Save Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
