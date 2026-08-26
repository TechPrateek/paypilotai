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
  ChevronRight,
  Zap,
  Globe,
  Smartphone,
  CreditCard,
  Building,
  Info,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/sentinel/severity-badge";

export default function OverviewPage() {
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
  const criticalRingsCount = rings.filter((r) => r.severity === "CRITICAL").length;
  const activeRingsCount = rings.length;

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* 🌟 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border/40 shadow-xs relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-foreground font-mono">
              OVERVIEW
            </h1>
            <Badge variant="outline" className="font-mono text-[10px] text-red-500 border-red-500/30">
              ● DETECTION ENGINE ACTIVE
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl font-medium leading-relaxed">
            Monitor coordinated payment abuse and emerging fraud rings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10">
          <Link href="/investigations/RING-0042">
            <Button size="sm" className="h-9 px-4 text-xs font-bold font-mono bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs gap-1.5 cursor-pointer">
              <Share2 className="h-3.5 w-3.5" />
              <span>INVESTIGATE RING-0042</span>
            </Button>
          </Link>
          <Link href="/evaluation">
            <Button variant="outline" size="sm" className="h-9 px-3 text-xs font-bold font-mono rounded-xl border-border/60 gap-1.5 cursor-pointer">
              <Activity className="h-3.5 w-3.5 text-muted-foreground" />
              <span>MODEL EVALUATION</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 🌟 2. Top 4 Actual Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1: Active Rings */}
        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              ACTIVE RINGS
            </span>
            <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
              {loading ? "..." : activeRingsCount}
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">Detected clusters</p>
          </CardContent>
        </Card>

        {/* Metric 2: Critical Rings */}
        <Card className="rounded-2xl border border-red-500/30 bg-red-500/5 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-wider">
              CRITICAL RINGS
            </span>
            <div className="text-2xl sm:text-3xl font-black text-red-500 font-mono">
              {loading ? "..." : criticalRingsCount}
            </div>
            <p className="text-[11px] text-red-500 font-mono">Risk score &gt; 80 / 100</p>
          </CardContent>
        </Card>

        {/* Metric 3: Affected Entities */}
        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              AFFECTED ENTITIES
            </span>
            <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
              {loading ? "..." : `${totalAccounts} Accounts`}
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">Shared infrastructure</p>
          </CardContent>
        </Card>

        {/* Metric 4: Estimated Exposure */}
        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              ESTIMATED EXPOSURE
            </span>
            <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
              {loading ? "..." : `₹${(totalExposure / 100000).toFixed(1)}L`}
            </div>
            <p className="text-[11px] text-emerald-500 font-mono">Total correlated volume</p>
          </CardContent>
        </Card>
      </div>

      {/* 🌟 3. Ring Activity Timeline */}
      <Card className="rounded-3xl border border-border/60 shadow-xs bg-card overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-bold font-mono tracking-tight flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-500" />
              <span>RING ACTIVITY</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Temporal distribution of detected coordinated abuse clusters
            </CardDescription>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">Aug 18 – Aug 20, 2026</span>
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
                <div className="p-2 rounded-full bg-red-500/20 border-2 border-red-500 group-hover:scale-125 transition-transform shadow-lg">
                  <div className="h-3 w-3 rounded-full bg-red-500 animate-ping" />
                </div>
                <span className="text-[10px] font-mono font-bold text-red-400 mt-1.5 bg-slate-900 px-2 py-0.5 rounded border border-red-500/30">
                  RING-0042 (84 txs)
                </span>
              </Link>

              {/* Cluster 2: RING-7092 */}
              <Link
                href="/investigations/RING-7092"
                className="relative z-10 group flex flex-col items-center cursor-pointer ml-[30%]"
              >
                <div className="p-2 rounded-full bg-red-500/20 border-2 border-red-500 group-hover:scale-125 transition-transform shadow-lg">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                </div>
                <span className="text-[10px] font-mono font-bold text-red-400 mt-1.5 bg-slate-900 px-2 py-0.5 rounded border border-red-500/30">
                  RING-7092 ($145k)
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

      {/* 🌟 4. Critical Rings & Risk Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Critical Rings List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="rounded-3xl border border-border/60 shadow-xs bg-card overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold font-mono tracking-tight">
                  CRITICAL RINGS
                </CardTitle>
                <CardDescription className="text-xs">
                  Syndicates prioritized for immediate forensic investigation
                </CardDescription>
              </div>
              <Link href="/rings">
                <Button variant="ghost" size="sm" className="h-7 text-xs font-mono font-bold gap-1 text-primary">
                  <span>VIEW ALL RINGS</span>
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
                      <span className="font-bold text-sm text-foreground font-mono">{ring.id}</span>
                      <SeverityBadge severity={ring.severity} />
                      <Badge variant="outline" className="font-mono text-[10px]">
                        Risk {ring.risk_score} / 100
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{ring.name}</p>
                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                      <span>👤 {ring.accounts_count} entities</span>
                      <span>💳 {ring.transactions_count} txs</span>
                      <span className="text-foreground font-bold">
                        ₹{ring.exposure >= 100000 ? `${(ring.exposure / 100000).toFixed(1)}L` : ring.exposure} exposure
                      </span>
                    </div>
                  </div>

                  <Link href={`/investigations/${ring.id}`}>
                    <Button size="sm" className="w-full sm:w-auto h-8 text-xs font-bold font-mono bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs gap-1.5 cursor-pointer">
                      <span>[INVESTIGATE]</span>
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Risk Distribution & Model Performance (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Risk Distribution */}
          <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-sm font-bold font-mono tracking-tight">
                RISK DISTRIBUTION
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-red-500 font-bold">CRITICAL (80–100)</span>
                  <span className="font-bold text-foreground">2 Rings (66.7%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-red-500 w-2/3" />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-orange-500 font-bold">HIGH (60–79)</span>
                  <span className="font-bold text-foreground">1 Ring (33.3%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-orange-500 w-1/3" />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-yellow-500 font-bold">MEDIUM (30–59)</span>
                  <span className="font-bold text-muted-foreground">0 Rings (0%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-yellow-500 w-0" />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-emerald-500 font-bold">LOW (0–29)</span>
                  <span className="font-bold text-muted-foreground">0 Rings (0%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 w-0" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Model Performance */}
          <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex items-center justify-between">
              <CardTitle className="text-sm font-bold font-mono tracking-tight flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span>MODEL PERFORMANCE</span>
              </CardTitle>
              <Link href="/evaluation">
                <span className="text-[10px] font-mono text-primary hover:underline cursor-pointer">
                  View Full Report →
                </span>
              </Link>
            </CardHeader>
            <CardContent className="p-5">
              {evalMetrics?.sentinel_metrics ? (
                <div className="grid grid-cols-2 gap-3 text-center font-mono">
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      PRECISION
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-foreground">
                      {evalMetrics.sentinel_metrics.precision}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      RECALL
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-500">
                      {evalMetrics.sentinel_metrics.recall}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      F1 SCORE
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-foreground">
                      {evalMetrics.sentinel_metrics.f1}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      FPR
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-500">
                      {evalMetrics.sentinel_metrics.fpr}%
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-mono">EVALUATION NOT AVAILABLE</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
