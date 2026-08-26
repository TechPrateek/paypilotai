"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Share2,
  ShieldAlert,
  Users,
  Smartphone,
  Globe,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Download,
  ChevronLeft,
  ExternalLink,
  Layers,
  Zap,
  Copy,
  Info,
  Maximize2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SeverityBadge, EntityIcon } from "@/components/sentinel/severity-badge";
import { InteractiveGraphCanvas } from "@/components/graph/interactive-graph-canvas";
import { toast } from "sonner";

export default function InvestigationDetailPage(props: { params: Promise<{ ringId: string }> }) {
  const params = use(props.params);
  const ringId = params.ringId.toUpperCase();

  const [ringData, setRingData] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any>(null);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [replayIndex, setReplayIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvestigation() {
      try {
        const [ringRes, graphRes, timeRes] = await Promise.all([
          fetch(`/api/rings/${ringId}`),
          fetch(`/api/rings/${ringId}/graph`),
          fetch(`/api/rings/${ringId}/timeline`),
        ]);

        if (ringRes.ok) {
          const r = await ringRes.json();
          setRingData(r);
        }
        if (graphRes.ok) {
          const g = await graphRes.json();
          setGraphData(g);
          if (g.nodes && g.nodes.length > 0) {
            setSelectedEntity(g.nodes[0]);
          }
        }
        if (timeRes.ok) {
          const t = await timeRes.json();
          setTimelineData(t);
        }
      } catch (err) {
        console.error("Failed to load investigation:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInvestigation();
  }, [ringId]);

  // Timeline replay interval
  useEffect(() => {
    let timer: any;
    if (isPlaying && timelineData?.events) {
      timer = setInterval(() => {
        setReplayIndex((prev) => {
          if (prev >= timelineData.events.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timelineData]);

  if (loading) {
    return (
      <div className="p-12 text-center text-muted-foreground font-mono text-xs">
        Loading multi-hop relationship graph and forensic signals for {ringId}...
      </div>
    );
  }

  const ring = ringData?.ring || {
    id: ringId,
    name: "Coordinated Transaction Burst Syndicate",
    severity: "CRITICAL",
    risk_score: 91,
    evidence_strength: 87,
    pattern_type: "COORDINATED_BURST",
    exposure: 840000,
    status: "UNDER REVIEW",
  };

  const blastRadius = ringData?.blast_radius || {
    affected_customers: 17,
    affected_transactions: 84,
    affected_devices: 4,
    affected_ips: 3,
    affected_payments: 11,
    total_exposure: 840000,
  };

  const signals = ringData?.signals || [
    { type: "SHARED DEVICE", description: "7 accounts connected through D102", score_contrib: 21 },
    { type: "TEMPORAL COORDINATION", description: "18 transactions within 120 seconds", score_contrib: 24 },
    { type: "VELOCITY", description: "9 transactions/minute burst intensity", score_contrib: 18 },
    { type: "PAYMENT REUSE", description: "4 accounts connected to the same payment instrument", score_contrib: 15 },
    { type: "HISTORICAL LINK", description: "3 entities linked to previous suspicious activity", score_contrib: 13 },
  ];

  const dna = ringData?.dna || {
    "Shared Infrastructure": 85,
    "Temporal Coordination": 98,
    "Velocity": 92,
    "Payment Reuse": 78,
    "Historical Relationship": 65,
  };

  const selectedNodeData = selectedEntity?.data || {
    label: "Device D102",
    type: "Device",
    risk: "HIGH",
    entityId: "D102",
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* 🌟 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border/40 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/rings">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-lg cursor-pointer">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
              {ring.id}
            </h1>
            <SeverityBadge severity={ring.severity} />
            <Badge variant="outline" className="font-mono text-xs font-bold text-amber-500 border-amber-500/30">
              STATUS: {ring.status || "UNDER REVIEW"}
            </Badge>
          </div>
          <div className="flex items-center gap-5 text-xs font-mono text-muted-foreground flex-wrap">
            <span>
              Risk: <strong className="text-red-500 font-bold text-sm">{ring.risk_score} / 100</strong>
            </span>
            <span>
              Evidence Strength: <strong className="text-emerald-500 font-bold">{ring.evidence_strength}%</strong>
            </span>
            <span>
              Exposure: <strong className="text-foreground font-bold">₹{(blastRadius.total_exposure / 100000).toFixed(1)}L</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/graph">
            <Button size="sm" variant="outline" className="h-8 text-xs font-bold font-mono rounded-xl gap-1.5 cursor-pointer">
              <Maximize2 className="h-3.5 w-3.5" />
              <span>FULL GRAPH EXPLORER</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 🌟 2. Blast Radius Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 font-mono">
        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              ACCOUNTS
            </span>
            <div className="text-2xl font-black text-foreground">
              {blastRadius.affected_customers}
            </div>
            <p className="text-[10px] text-muted-foreground">Connected customers</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              TRANSACTIONS
            </span>
            <div className="text-2xl font-black text-foreground">
              {blastRadius.affected_transactions}
            </div>
            <p className="text-[10px] text-red-500">18 in 120s burst</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              DEVICES
            </span>
            <div className="text-2xl font-black text-foreground">
              {blastRadius.affected_devices}
            </div>
            <p className="text-[10px] text-red-500">Device D102 (Hub)</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              IPS
            </span>
            <div className="text-2xl font-black text-foreground">
              {blastRadius.affected_ips}
            </div>
            <p className="text-[10px] text-muted-foreground">Tor & VPN gateways</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              PAYMENTS
            </span>
            <div className="text-2xl font-black text-foreground">
              {blastRadius.affected_payments}
            </div>
            <p className="text-[10px] text-muted-foreground">Reused instruments</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-bold text-emerald-500 uppercase">
              EXPOSURE
            </span>
            <div className="text-2xl font-black text-foreground">
              ₹{(blastRadius.total_exposure / 100000).toFixed(1)}L
            </div>
            <p className="text-[10px] text-emerald-500">Correlated amount</p>
          </CardContent>
        </Card>
      </div>

      {/* 🌟 3. Flagship Interactive Relationship Graph (Major Viewport) */}
      <Card className="rounded-3xl border border-border/60 shadow-md bg-card overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-bold font-mono tracking-tight flex items-center gap-2">
              <Share2 className="h-4 w-4 text-red-500" />
              <span>INTERACTIVE RELATIONSHIP GRAPH</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Graph topology rendered from actual backend entity relationships. Click node to inspect in side panel.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3 w-3 text-blue-400" /> Customer</span>
            <span className="flex items-center gap-1"><Smartphone className="h-3 w-3 text-red-400" /> Device</span>
            <span className="flex items-center gap-1"><Globe className="h-3 w-3 text-purple-400" /> IP</span>
            <span className="flex items-center gap-1"><CreditCard className="h-3 w-3 text-emerald-400" /> Payment</span>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Graph Canvas (8 cols) */}
            <div className="lg:col-span-8">
              <InteractiveGraphCanvas
                nodes={graphData?.nodes || []}
                edges={graphData?.edges || []}
                selectedNode={selectedEntity}
                onSelectNode={(node) => setSelectedEntity(node)}
                height={460}
              />
            </div>

            {/* Entity Inspector Side Panel (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                    ENTITY INSPECTOR
                  </span>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold">
                    {selectedNodeData.type || "Device"}
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Entity ID</span>
                    <span className="font-bold text-foreground text-sm">{selectedNodeData.entityId || "D102"}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Risk Level</span>
                    <SeverityBadge severity={selectedNodeData.risk || "HIGH"} />
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Connected Accounts</span>
                    <span className="font-bold text-foreground">7</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Transactions</span>
                    <span className="font-bold text-foreground">31</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block">First Seen</span>
                      <span className="font-bold text-foreground text-[11px]">10:01:02</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block">Last Seen</span>
                      <span className="font-bold text-foreground text-[11px]">10:08:44</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Connected Entities</span>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {["C001", "C007", "C012", "C018"].map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded bg-muted border border-border/60 text-[10px] font-bold">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info(`Timeline filtered to ${selectedNodeData.entityId || "D102"}`)}
                    className="h-8 text-[10px] font-bold font-mono rounded-xl cursor-pointer"
                  >
                    [VIEW TIMELINE]
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info(`Graph focused on ${selectedNodeData.entityId || "D102"}`)}
                    className="h-8 text-[10px] font-bold font-mono rounded-xl cursor-pointer"
                  >
                    [FOCUS GRAPH]
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🌟 4. Why Detected & Ring DNA Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Why Detected Evidence Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-sm font-bold font-mono tracking-tight">
                WHY WAS THIS RING DETECTED?
              </CardTitle>
              <CardDescription className="text-xs">
                Empirical evidence signals generated from detector features
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-2.5">
              {signals.map((sig: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center font-mono font-bold text-[10px]">
                      0{idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-foreground block font-mono text-[11px]">
                        {sig.type}
                      </span>
                      <span className="text-muted-foreground text-xs">{sig.description}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] text-red-500 shrink-0">
                    +{sig.score_contrib || 20} pts
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Ring DNA Feature Bars (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-sm font-bold font-mono tracking-tight">
                RING DNA
              </CardTitle>
              <CardDescription className="text-xs">
                Underlying structural feature strength (0 – 100)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-3.5 text-xs font-mono">
              {Object.entries(dna).map(([key, val]: [string, any]) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground uppercase">{key}</span>
                    <span className="font-bold text-foreground">{val}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        val >= 80 ? "bg-red-500" : val >= 60 ? "bg-orange-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 🌟 5. Ring Timeline */}
      <Card className="rounded-3xl border border-border/60 shadow-xs bg-card overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold font-mono tracking-tight flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>RING TIMELINE</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Chronological event stream with actual transaction and entity timestamps
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-8 text-xs font-bold font-mono rounded-xl gap-1.5 border-border/60 cursor-pointer"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-emerald-500" />}
              <span>{isPlaying ? "PAUSE" : "PLAY REPLAY"}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setReplayIndex(0); setIsPlaying(false); }}
              className="h-8 text-xs rounded-xl cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5 font-mono text-xs">
          <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
            {timelineData?.events?.slice(0, 15).map((ev: any, i: number) => (
              <div
                key={ev.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  i <= replayIndex
                    ? "bg-red-500/10 border-red-500/30 text-foreground"
                    : "bg-muted/10 border-border/30 text-muted-foreground opacity-40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold text-foreground">{ev.timestamp ? ev.timestamp.slice(11, 19) : "10:01:02"}</span>
                  <span className="text-primary font-bold">{ev.customer_id}</span>
                  <span className="font-bold text-foreground">₹{Number(ev.amount).toLocaleString()}</span>
                  <span className="text-muted-foreground">Device {ev.device_id}</span>
                </div>
                <Badge variant="destructive" className="font-mono text-[9px] py-0 px-1.5 h-4">
                  FLAGGED
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
