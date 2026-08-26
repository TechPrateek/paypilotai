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
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const ACTIVE_RINGS = [
  {
    id: "RING-7092",
    title: "Gang #1: Tor Proxy Syndicate",
    deviceCount: "1 Laptop",
    accountsCount: "4 Fake People",
    cardsCount: "4 Cards",
    riskScore: 94,
    status: "BLOCKED",
    lossPrevented: "$145,000",
    description: "4 fake customer accounts created from a hidden internet IP address using the exact same laptop.",
  },
  {
    id: "RING-4108",
    title: "Gang #2: Fast Card-Testing Bot",
    deviceCount: "2 Phones",
    accountsCount: "6 Fake Accounts",
    cardsCount: "12 Cards",
    riskScore: 88,
    status: "MONITORED",
    lossPrevented: "$42,500",
    description: "Swapped 12 stolen credit cards in 5 minutes with rapid micro-purchases.",
  },
  {
    id: "RING-1923",
    title: "Gang #3: International Fake Account Ring",
    deviceCount: "1 PC",
    accountsCount: "3 Accounts",
    cardsCount: "3 Cards",
    riskScore: 82,
    status: "UNDER_REVIEW",
    lossPrevented: "$28,000",
    description: "Orders placed from fake temporary emails using international cards.",
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
              Connection Map Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
            Finds and blocks fraud gangs using multiple fake accounts on the same phone or computer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20 text-xs font-bold shadow-xs">
            <Users className="h-3.5 w-3.5" />
            <span>Multi-Account Protection</span>
          </div>
        </div>
      </div>

      {/* Top 4 Plain-English Threat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                FRAUD GANGS CAUGHT
              </span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">3 Gangs</div>
              <p className="text-xs font-semibold text-rose-500 mt-1">13 Fake Accounts Blocked</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                SHARED PHONES & PCS
              </span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <Smartphone className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">4 Devices</div>
              <p className="text-xs font-semibold text-muted-foreground mt-1">Used by 4+ accounts each</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                HIDDEN INTERNET LOCATIONS
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Globe className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">2 Proxies</div>
              <p className="text-xs font-semibold text-emerald-500 mt-1">100% Traffic Filtered</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                MONEY SAVED FROM SCAMS
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">$145,000</div>
              <p className="text-xs font-semibold text-emerald-500 mt-1">Direct Loss Prevented</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Visual Graph Canvas */}
      <AbuseRingGraphExplorer />

      {/* Detected Scammer Groups List */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
          <CardTitle className="text-base font-bold text-foreground">
            Recent Scammer Groups Caught & Blocked
          </CardTitle>
          <CardDescription className="text-xs">
            These groups were trying to place fraudulent orders using shared phones and rotated stolen cards.
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
                    variant={ring.status === "BLOCKED" ? "destructive" : "secondary"}
                    className="text-[10px] uppercase font-bold"
                  >
                    {ring.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {ring.description}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                  <span>📱 {ring.deviceCount}</span>
                  <span>👤 {ring.accountsCount}</span>
                  <span>💳 {ring.cardsCount}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">Risk Level</span>
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
