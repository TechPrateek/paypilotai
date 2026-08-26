import React from "react";
import { AbuseRingGraphExplorer } from "@/components/transactions/abuse-ring-graph-explorer";
import {
  Share2,
  ShieldAlert,
  Smartphone,
  Globe,
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

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
              Syndicate Shield Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
            Multi-Account Syndicate Detector — Identifies and isolates fraud rings sharing devices, IPs, and stolen cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>3 Active Rings Isolated</span>
          </div>
        </div>
      </div>

      {/* Top 3 High-Impact Syndicate Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-rose-500/30 bg-rose-500/5 shadow-xs">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">
                SYNDICATE GANGS ISOLATED
              </span>
              <div className="p-2 rounded-xl bg-rose-500/15 text-rose-500">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-foreground font-mono">3 Gangs</div>
              <p className="text-xs font-semibold text-rose-500 mt-1">13 Fake Accounts Blocked</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                SHARED DEVICE DETECTION
              </span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <Smartphone className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-foreground font-mono">4.2x Ratio</div>
              <p className="text-xs font-semibold text-muted-foreground mt-1">Avg 4.2 Accounts on Single Laptop</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-xs">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
                DIRECT MONEY SAVED
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-foreground font-mono">$199,900.00</div>
              <p className="text-xs font-semibold text-emerald-500 mt-1">Total chargeback & voucher loss saved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Multi-Case Visual Connection Graph */}
      <AbuseRingGraphExplorer />
    </div>
  );
}
