import React from "react";
import { AbuseRingGraphExplorer } from "@/components/transactions/abuse-ring-graph-explorer";
import {
  Share2,
  ShieldAlert,
  Smartphone,
  Globe,
  DollarSign,
  AlertTriangle,
  Lock,
  Layers,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const ACTIVE_RINGS = [
  {
    id: "RING-7092",
    title: "Tor Exit Botnet Syndicate #7092",
    deviceCount: 1,
    accountsCount: 4,
    cardsCount: 4,
    riskScore: 94,
    status: "ISOLATED",
    lossPrevented: "$145,000",
    description: "4 new customer accounts created on single Tor exit node (185.220.101.5) sharing hardware device 'a1b2c3d4e5f6g7'.",
  },
  {
    id: "RING-4108",
    title: "Card-Testing Velocity Ring #4108",
    deviceCount: 2,
    accountsCount: 6,
    cardsCount: 12,
    riskScore: 88,
    status: "MONITORED",
    lossPrevented: "$42,500",
    description: "Rotated 12 stolen credit card BINs across 2 emulator devices with rapid 10-attempt bursts.",
  },
  {
    id: "RING-1923",
    title: "International Wire Anomaly Ring #1923",
    deviceCount: 1,
    accountsCount: 3,
    cardsCount: 3,
    riskScore: 82,
    status: "UNDER_REVIEW",
    lossPrevented: "$28,000",
    description: "Cross-border payment attempts originating from high-risk IP subnet with disposable email inboxes.",
  },
];

export default function TransactionsPage() {
  return (
    <div className="space-y-6 p-3 sm:p-5 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Abuse-Ring Sentinel
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-emerald-500 border-emerald-500/30">
              Graph GNN Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
            Multi-hop relational entity graph detecting coordinated fraud syndicates and shared device botnets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold shadow-xs">
            <Share2 className="h-3.5 w-3.5" />
            <span>7 Node Types • 7 Relations</span>
          </div>
        </div>
      </div>

      {/* Top 4 Syndicate Threat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                DETECTED ABUSE RINGS
              </span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">3</div>
              <p className="text-xs font-semibold text-rose-500 mt-1">13 Fake Accounts Linked</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                SHARED DEVICE CLUSTERS
              </span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <Smartphone className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">4</div>
              <p className="text-xs font-semibold text-muted-foreground mt-1">Avg 4.2 Accounts / Device</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                MASKED TOR / PROXY NODES
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Globe className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">2</div>
              <p className="text-xs font-semibold text-emerald-500 mt-1">100% Traffic Isolated</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                SYNDICATE LOSS PREVENTED
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">$145,000</div>
              <p className="text-xs font-semibold text-emerald-500 mt-1">Direct Chargeback Saved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Visual Graph Canvas Component */}
      <AbuseRingGraphExplorer />

      {/* Detected Syndicate Rings Case Files */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
          <CardTitle className="text-base font-bold text-foreground">
            Active Syndicate Ring Case Files
          </CardTitle>
          <CardDescription className="text-xs">
            Correlated multi-account clusters identified by Heterogeneous GNN message-passing
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 space-y-3">
          {ACTIVE_RINGS.map((ring) => (
            <div
              key={ring.id}
              className="p-4 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-bold text-sm text-foreground">{ring.title}</span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {ring.id}
                  </Badge>
                  <Badge
                    variant={ring.status === "ISOLATED" ? "destructive" : "secondary"}
                    className="text-[10px] uppercase font-bold"
                  >
                    {ring.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ring.description}
                </p>
                <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground pt-1">
                  <span>📱 {ring.deviceCount} Device</span>
                  <span>👤 {ring.accountsCount} Accounts</span>
                  <span>💳 {ring.cardsCount} Cards</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">Ring Risk</span>
                  <span className="text-xl font-black text-rose-500 font-mono">{ring.riskScore}%</span>
                </div>
                <span className="text-xs font-bold text-emerald-500 font-mono">
                  +{ring.lossPrevented} Saved
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
