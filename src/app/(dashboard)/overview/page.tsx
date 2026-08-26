"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Share2,
  ShieldAlert,
  Users,
  Activity,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight,
  Zap,
  Globe,
  Smartphone,
  ExternalLink,
  Store,
  CreditCard,
  Sliders,
  TrendingUp,
  ShieldCheck,
  Building,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/session-provider";

export default function OverviewPage() {
  const { data: session } = useAuth();
  const user = session?.user;
  const role = user?.role || "ANALYST";

  const [rings, setRings] = useState<any[]>([]);
  const [evalMetrics, setEvalMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ringsRes, evalRes] = await Promise.all([
          fetch("/api/rings"),
          fetch("/api/evaluation/metrics"),
        ]);
        if (ringsRes.ok) {
          const ringsData = await ringsRes.json();
          setRings(ringsData.rings || []);
        }
        if (evalRes.ok) {
          const evalData = await evalRes.json();
          setEvalMetrics(evalData);
        }
      } catch (err) {
        console.error("Failed to load overview data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalExposure = rings.reduce((sum, r) => sum + (r.exposure || 0), 0);
  const totalAccounts = rings.reduce((sum, r) => sum + (r.accounts_count || 0), 0);
  const totalTransactions = rings.reduce((sum, r) => sum + (r.transactions_count || 0), 0);

  // =========================================================================
  // 🏬 VIEW 1: MERCHANT STORE DASHBOARD (Raj Patel — Store Owner)
  // =========================================================================
  if (role === "MERCHANT") {
    return (
      <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
        {/* Merchant Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border/40 shadow-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <Store className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
                TechMart India <span className="text-muted-foreground text-sm font-normal">| Store Protection</span>
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-emerald-500 border-emerald-500/30">
                ● SHIELD ACTIVE
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl font-medium leading-relaxed">
              Safe checkout for your online store. Real customers shop smoothly, while fake buyers and automated card thieves are stopped before you lose money.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/transactions">
              <Button size="sm" className="h-9 px-4 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs gap-1.5">
                <CreditCard className="h-3.5 w-3.5" />
                <span>View Store Orders</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Merchant Store KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                MONEY SAVED FROM FRAUD
              </span>
              <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                ₹8,40,000
              </div>
              <p className="text-[11px] text-emerald-500 font-semibold">100% Fake Chargebacks Stopped</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                SUCCESSFUL CHECKOUTS
              </span>
              <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                98.4%
              </div>
              <p className="text-[11px] text-emerald-500 font-semibold">Good buyers checkout instantly</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                ACTIVE REAL CUSTOMERS
              </span>
              <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                112 Buyers
              </div>
              <p className="text-[11px] text-muted-foreground font-semibold">Home & office shoppers verified</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-rose-500/30 bg-rose-500/5 shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
              <span className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-wider">
                FAKE ORDERS STOPPED
              </span>
              <div className="text-2xl sm:text-3xl font-black text-rose-500 font-mono">
                84 Orders
              </div>
              <p className="text-[11px] text-rose-500 font-semibold">Bot gang RING-0042 blocked</p>
            </CardContent>
          </Card>
        </div>

        {/* Merchant Threat Protection Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <Card className="rounded-3xl border border-border/60 shadow-xs bg-card overflow-hidden">
              <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
                <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Recent Threats Blocked from Your Store</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Simple explanation of what happened and how your money was saved
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-3">
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-xs sm:text-sm text-foreground block">
                      ⚠️ 18 Rapid Bot Orders Stopped in 2 Minutes
                    </span>
                    <p className="text-xs text-muted-foreground">
                      An automated bot tried testing 11 stolen cards on ₹10,000 electronics. All 18 payments were blocked before you shipped any items.
                    </p>
                  </div>
                  <Badge variant="destructive" className="font-mono text-xs font-bold shrink-0">
                    SAVED ₹8.4L
                  </Badge>
                </div>

                <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-xs sm:text-sm text-foreground block">
                      ✓ 15 Coworkers from Same Office Approved
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Multiple coworkers ordered lunch/items from the same office Wi-Fi. We correctly recognized they were real people on separate laptops.
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs text-emerald-500 border-emerald-500/30 font-bold shrink-0">
                    APPROVED
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
              <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
                <CardTitle className="text-sm font-bold tracking-tight">
                  Store Safety Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">Protection Status</span>
                  <span className="font-bold text-emerald-500">Connected & Safe</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">Speed Limit</span>
                  <span className="font-bold text-foreground">Max 5 Orders/min per Card</span>
                </div>
                <Link href="/settings">
                  <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-xl mt-2">
                    Manage Safety Rules →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ⚡ VIEW 2: ADMIN GOVERNANCE DASHBOARD (Vikram Singh — Security Admin)
  // =========================================================================
  if (role === "ADMIN") {
    return (
      <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
        {/* Admin Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border/40 shadow-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
                PAYPILOT AI <span className="text-purple-500 text-sm font-normal">| Platform Governance</span>
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-purple-500 border-purple-500/30">
                ● ADMIN CONTROL
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl font-medium leading-relaxed">
              Global system rules, cost settings, and model accuracy reports across all 5 connected online stores.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/evaluation">
              <Button size="sm" className="h-9 px-4 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                <span>Accuracy & Test Report</span>
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" size="sm" className="h-9 px-3 text-xs font-bold rounded-xl border-border/60 gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Edit Cost Settings</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Admin Governance KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="rounded-2xl border border-purple-500/30 bg-purple-500/5 shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
              <span className="text-[10px] font-mono font-bold text-purple-500 uppercase tracking-wider">
                ACTIVE AI MODEL
              </span>
              <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                Sentinel v1.0
              </div>
              <p className="text-[11px] text-purple-500 font-semibold">Graph Network Protection</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                BEST SENSITIVITY LEVEL
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-500 font-mono">
                0.70
              </div>
              <p className="text-[11px] text-muted-foreground font-semibold">Lowest Business Loss (₹450)</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                OVERALL ACCURACY SCORE
              </span>
              <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                96.6% F1
              </div>
              <p className="text-[11px] text-emerald-500 font-semibold">Tested on unseen payments</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                PROTECTED MERCHANTS
              </span>
              <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                5 Stores
              </div>
              <p className="text-[11px] text-muted-foreground font-semibold">TechMart, QuickPay, Casino...</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Evaluation Table Summary */}
        <Card className="rounded-3xl border border-border/60 shadow-xs bg-card overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold tracking-tight">
                Model Performance Across Sensitivity Settings
              </CardTitle>
              <CardDescription className="text-xs">
                How sensitivity changes the number of caught frauds vs false alarms
              </CardDescription>
            </div>
            <Link href="/evaluation">
              <Button variant="ghost" size="sm" className="h-7 text-xs font-bold gap-1 text-primary">
                <span>View Full Test Report</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase bg-muted/20">
                  <th className="py-3 px-4">Sensitivity</th>
                  <th className="py-3 px-3">Accuracy (Precision)</th>
                  <th className="py-3 px-3">Frauds Caught (Recall)</th>
                  <th className="py-3 px-3">False Alarms</th>
                  <th className="py-3 px-4 text-right">Estimated Money Lost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr className="bg-emerald-500/10 font-bold">
                  <td className="py-3 px-4 text-emerald-500">0.70 (RECOMMENDED)</td>
                  <td className="py-3 px-3">93.3%</td>
                  <td className="py-3 px-3 text-emerald-500">100.0%</td>
                  <td className="py-3 px-3 text-emerald-500">3.1%</td>
                  <td className="py-3 px-4 text-right text-emerald-500">₹450 (Lowest)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">0.60</td>
                  <td className="py-3 px-3">97.1%</td>
                  <td className="py-3 px-3">100.0%</td>
                  <td className="py-3 px-3 text-rose-500">8.3%</td>
                  <td className="py-3 px-4 text-right">₹900</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // =========================================================================
  // 🛡️ VIEW 3: FRAUD ANALYST WORKSPACE (Priya Sharma — Default SOC Mode)
  // =========================================================================
  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Analyst Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border/40 shadow-xs relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-foreground font-mono">
              PAYPILOT AI <span className="text-rose-500 text-lg sm:text-xl font-normal">| Fraud Ring Defense</span>
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-emerald-500 border-emerald-500/30">
              ● SHIELD ONLINE
            </Badge>
            <Badge variant="destructive" className="font-mono text-[9px] uppercase font-bold">
              INVESTIGATOR VIEW
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl font-medium leading-relaxed">
            Uncover organized fraud gangs sharing laptops, stolen cards, and fake IPs before they steal money from online stores.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10">
          <Link href="/investigations/RING-0042">
            <Button size="sm" className="h-9 px-4 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs gap-1.5">
              <Share2 className="h-3.5 w-3.5" />
              <span>Inspect Gang #0042</span>
            </Button>
          </Link>
          <Link href="/evaluation">
            <Button variant="outline" size="sm" className="h-9 px-3 text-xs font-bold rounded-xl border-border/60 gap-1.5">
              <Activity className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Accuracy Report</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 5 Key Threat Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="rounded-2xl border border-rose-500/30 bg-rose-500/5 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-wider">
              ACTIVE FRAUD GANGS
            </span>
            <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
              {rings.length || 3} Rings
            </div>
            <p className="text-[11px] text-rose-500 font-semibold">2 Urgent Threats</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              HIGH DANGER LEVEL
            </span>
            <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
              2 Rings
            </div>
            <p className="text-[11px] text-muted-foreground font-semibold">Score &gt; 90 / 100</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              LINKED ACCOUNTS
            </span>
            <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
              {totalAccounts || 27} Accounts
            </div>
            <p className="text-[11px] text-muted-foreground font-semibold">Same Laptop/IP</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              BLOCKED ORDERS
            </span>
            <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
              {totalTransactions || 98} Payments
            </div>
            <p className="text-[11px] text-muted-foreground font-semibold">Coordinated bot rush</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-xs col-span-2 sm:col-span-1">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-wider">
              MONEY SAVED
            </span>
            <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
              ₹8.4 Lakhs
            </div>
            <p className="text-[11px] text-emerald-500 font-semibold">Saved from fraud theft</p>
          </CardContent>
        </Card>
      </div>

      {/* Primary Visual: Ring Activity Cluster Timeline */}
      <Card className="rounded-3xl border border-border/60 shadow-sm bg-card overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
              <Clock className="h-4 w-4 text-rose-500" />
              <span>Attack Timeline — When Did Fraud Groups Attack?</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Shows the exact time groups of bots tried to rush the checkout
            </CardDescription>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">Aug 18 - Aug 20, 2026</span>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
              <span>08:00</span>
              <span>10:00</span>
              <span>12:00</span>
              <span>14:00</span>
              <span>16:00</span>
              <span>18:00</span>
              <span>20:00</span>
            </div>

            {/* Timeline Visual Nodes */}
            <div className="relative h-16 flex items-center justify-between px-4">
              <div className="absolute left-0 right-0 h-0.5 bg-slate-800" />

              {/* Cluster 1: RING-0042 */}
              <Link
                href="/investigations/RING-0042"
                className="relative z-10 group flex flex-col items-center cursor-pointer ml-[25%]"
              >
                <div className="p-2 rounded-full bg-rose-500/20 border-2 border-rose-500 group-hover:scale-125 transition-transform shadow-lg">
                  <div className="h-3 w-3 rounded-full bg-rose-500 animate-ping" />
                </div>
                <span className="text-[10px] font-mono font-bold text-rose-400 mt-1.5 bg-slate-900 px-2 py-0.5 rounded border border-rose-500/30">
                  RING-0042 (84 orders)
                </span>
              </Link>

              {/* Cluster 2: RING-7092 */}
              <Link
                href="/investigations/RING-7092"
                className="relative z-10 group flex flex-col items-center cursor-pointer ml-[30%]"
              >
                <div className="p-2 rounded-full bg-rose-500/20 border-2 border-rose-500 group-hover:scale-125 transition-transform shadow-lg">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                </div>
                <span className="text-[10px] font-mono font-bold text-rose-400 mt-1.5 bg-slate-900 px-2 py-0.5 rounded border border-rose-500/30">
                  RING-7092 ($145k attack)
                </span>
              </Link>

              {/* Cluster 3: RING-4108 */}
              <Link
                href="/investigations/RING-4108"
                className="relative z-10 group flex flex-col items-center cursor-pointer mr-[10%]"
              >
                <div className="p-2 rounded-full bg-amber-500/20 border-2 border-amber-500 group-hover:scale-125 transition-transform shadow-lg">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 mt-1.5 bg-slate-900 px-2 py-0.5 rounded border border-amber-500/30">
                  RING-4108 (Card Testing)
                </span>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Rings Panel & False-Positive Guard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <Card className="rounded-3xl border border-border/60 shadow-xs bg-card overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold tracking-tight">
                  Dangerous Fraud Rings (Needs Attention)
                </CardTitle>
                <CardDescription className="text-xs">
                  Active gangs caught stealing across multiple customer accounts
                </CardDescription>
              </div>
              <Link href="/rings">
                <Button variant="ghost" size="sm" className="h-7 text-xs font-bold gap-1 text-primary">
                  <span>View All</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-3">
              {rings.map((ring) => (
                <div
                  key={ring.id}
                  className="p-4 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-foreground">{ring.name}</span>
                      <Badge variant="destructive" className="font-mono text-[10px] uppercase font-bold">
                        {ring.severity}
                      </Badge>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        Risk {ring.risk_score}/100
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                      <span>👤 {ring.accounts_count} Accounts</span>
                      <span>💳 {ring.transactions_count} Orders</span>
                      <span className="text-emerald-500 font-bold">
                        ₹{ring.exposure >= 100000 ? `${(ring.exposure / 100000).toFixed(1)}L` : ring.exposure} Saved
                      </span>
                    </div>
                  </div>

                  <Link href={`/investigations/${ring.id}`}>
                    <Button size="sm" className="w-full sm:w-auto h-8 text-xs font-bold rounded-xl shadow-xs gap-1.5">
                      <span>Inspect Connections</span>
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span>Model Accuracy Score</span>
                </CardTitle>
                <span className="text-[10px] font-mono text-muted-foreground">Tested on new data</span>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {evalMetrics?.sentinel_metrics ? (
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold block">
                      Accuracy (Precision)
                    </span>
                    <span className="text-2xl font-black text-foreground font-mono">
                      {evalMetrics.sentinel_metrics.precision}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold block">
                      Frauds Caught (Recall)
                    </span>
                    <span className="text-2xl font-black text-emerald-500 font-mono">
                      {evalMetrics.sentinel_metrics.recall}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold block">
                      Overall Score (F1)
                    </span>
                    <span className="text-2xl font-black text-foreground font-mono">
                      {evalMetrics.sentinel_metrics.f1}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold block">
                      False Alarms (FPR)
                    </span>
                    <span className="text-2xl font-black text-rose-500 font-mono">
                      {evalMetrics.sentinel_metrics.fpr}%
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Evaluation loading...</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Smart Protection (No False Alarms)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                  ✓ Real Office Coworkers (15 Shoppers on 1 Wi-Fi)
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Recognized separate personal laptops and normal timing $\rightarrow$ <strong>APPROVED (NOT BLOCKED)</strong>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                <span className="font-bold text-rose-600 dark:text-rose-400 block">
                  ⚠️ Real Fraud Syndicate (4 Accounts on 1 Laptop)
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Same laptop hardware ID and stolen cards $\rightarrow$ <strong>BLOCKED & BLACKLISTED</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
