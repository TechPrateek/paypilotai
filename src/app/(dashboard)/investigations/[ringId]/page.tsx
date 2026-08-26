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
  Ban,
  ShieldCheck,
  ChevronLeft,
  ExternalLink,
  Layers,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function InvestigationDetailPage(props: { params: Promise<{ ringId: string }> }) {
  const params = use(props.params);
  const ringId = params.ringId.toUpperCase();

  const [ringData, setRingData] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any>(null);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [isIsolated, setIsIsolated] = useState(false);
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

  // Replay animation interval
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

  const handleIsolateRing = () => {
    setIsIsolated(true);
    toast.success(`Ring ${ringId} Isolated! All ${ringData?.blast_radius?.affected_customers || 17} accounts and connected hardware IDs blacklisted.`);
  };

  const handleExportDossier = () => {
    toast.success(`Downloaded Forensic Audit Packet (PDF) for ${ringId}`);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground font-mono text-xs">
        Building relationship graph & forensic features for {ringId}...
      </div>
    );
  }

  const ring = ringData?.ring || {
    id: ringId,
    name: "Coordinated Transaction Burst Syndicate",
    severity: "CRITICAL",
    risk_score: 91,
    evidence_strength: 87,
    pattern_type: "COORDINATED_TRANSACTION_BURST",
    exposure: 840000,
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
    { type: "SHARED_DEVICE", description: "7 accounts share Device D102", score_contrib: 21 },
    { type: "TEMPORAL_COORDINATION", description: "18 transactions occurred within 120 seconds", score_contrib: 24 },
    { type: "VELOCITY", description: "9 transactions/minute burst intensity", score_contrib: 18 },
    { type: "PAYMENT_REUSE", description: "4 payment instruments were reused across customer IDs", score_contrib: 15 },
    { type: "HISTORICAL_SUSPICION", description: "3 connected entities had previous suspicious chargebacks", score_contrib: 13 },
  ];

  const dna = ringData?.dna || {
    infrastructure_sharing: 85,
    temporal_coordination: 98,
    velocity: 92,
    payment_reuse: 78,
    account_creation_burst: 90,
    historical_suspicion: 65,
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* 🌟 1. Header with Ring ID, Severity, and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border/40 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/rings">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-lg">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
              {ring.id}
            </h1>
            <Badge
              variant={isIsolated ? "outline" : ring.severity === "CRITICAL" ? "destructive" : "secondary"}
              className="font-mono text-xs uppercase font-bold px-2.5 py-0.5"
            >
              {isIsolated ? "ISOLATED & BLOCKED" : ring.severity}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              {ring.pattern_type}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground flex-wrap">
            <span>
              Risk Score: <strong className="text-rose-500 font-bold">{ring.risk_score} / 100</strong>
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
          <Button
            size="sm"
            onClick={handleIsolateRing}
            disabled={isIsolated}
            className={`h-9 px-4 text-xs font-bold rounded-xl shadow-xs gap-1.5 ${
              isIsolated ? "bg-emerald-600 text-white" : "bg-rose-600 hover:bg-rose-700 text-white"
            }`}
          >
            {isIsolated ? (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Ring Blacklisted</span>
              </>
            ) : (
              <>
                <Ban className="h-4 w-4" />
                <span>Isolate Entire Ring</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportDossier}
            className="h-9 px-3 text-xs font-bold rounded-xl border-border/60 gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Case Dossier</span>
          </Button>
        </div>
      </div>

      {/* 🌟 2. Blast Radius Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs text-center">
          <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold block">
            ACCOUNTS
          </span>
          <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
            {blastRadius.affected_customers}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs text-center">
          <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold block">
            TRANSACTIONS
          </span>
          <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
            {blastRadius.affected_transactions}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs text-center">
          <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold block">
            DEVICES
          </span>
          <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
            {blastRadius.affected_devices}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs text-center">
          <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold block">
            IPS
          </span>
          <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
            {blastRadius.affected_ips}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs text-center">
          <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold block">
            PAYMENTS
          </span>
          <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
            {blastRadius.affected_payments}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-xs text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold block">
            EXPOSURE
          </span>
          <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
            ₹{(blastRadius.total_exposure / 100000).toFixed(1)}L
          </span>
        </div>
      </div>

      {/* 🌟 3. Flagship Interactive Relationship Graph (Split with Entity Inspector) */}
      <Card className="rounded-3xl border border-border/60 shadow-md bg-card overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Share2 className="h-4 w-4 text-emerald-500" />
              <span>Heterogeneous Relationship Graph</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Click any node (Customer, Device, IP, or Payment) to inspect multi-hop relational dependencies
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
            <span>{graphData?.total_nodes || 35} Nodes</span> • <span>{graphData?.total_edges || 48} Relationships</span>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SVG Visual Canvas (8 cols) */}
            <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-4 relative overflow-hidden border border-slate-800 min-h-[440px] flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              <svg viewBox="0 0 800 440" className="w-full h-full relative z-10 select-none">
                {/* Render Edges */}
                {graphData?.edges?.map((edge: any) => {
                  const sNode = graphData.nodes.find((n: any) => n.id === edge.source);
                  const tNode = graphData.nodes.find((n: any) => n.id === edge.target);
                  if (!sNode || !tNode) return null;

                  const isSel = selectedEntity?.id === sNode.id || selectedEntity?.id === tNode.id;

                  return (
                    <g key={edge.id}>
                      <line
                        x1={sNode.position.x}
                        y1={sNode.position.y}
                        x2={tNode.position.x}
                        y2={tNode.position.y}
                        stroke={isSel ? "#10B981" : "#475569"}
                        strokeWidth={isSel ? 2.5 : 1.2}
                        strokeDasharray={edge.animated ? "4 2" : "none"}
                        className="transition-all duration-300"
                      />
                    </g>
                  );
                })}

                {/* Render Nodes */}
                {graphData?.nodes?.map((node: any) => {
                  const isSel = selectedEntity?.id === node.id;
                  const isDev = node.type === "device";
                  const isIP = node.type === "ip";
                  const isCust = node.type === "customer";
                  const isPay = node.type === "payment";

                  let fill = "#1E293B";
                  let stroke = "#64748B";

                  if (isDev) {
                    fill = isSel ? "#DC2626" : "#7F1D1D";
                    stroke = "#EF4444";
                  } else if (isIP) {
                    fill = isSel ? "#7C3AED" : "#4C1D95";
                    stroke = "#A855F7";
                  } else if (isCust) {
                    fill = isSel ? "#2563EB" : "#1E3A8A";
                    stroke = "#3B82F6";
                  } else if (isPay) {
                    fill = isSel ? "#D97706" : "#78350F";
                    stroke = "#F59E0B";
                  }

                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedEntity(node)}
                      className="cursor-pointer transition-transform duration-200 hover:scale-110"
                    >
                      {isDev && (
                        <circle
                          cx={node.position.x}
                          cy={node.position.y}
                          r="28"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="1.5"
                          className="animate-ping opacity-20"
                        />
                      )}

                      <circle
                        cx={node.position.x}
                        cy={node.position.y}
                        r={isDev ? "22" : "18"}
                        fill={fill}
                        stroke={isSel ? "#10B981" : stroke}
                        strokeWidth={isSel ? 3 : 2}
                        className="shadow-lg"
                      />

                      <text
                        x={node.position.x}
                        y={node.position.y + 4}
                        fill="#FFFFFF"
                        fontSize={isDev ? "10" : "8"}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {isDev ? "📱" : isIP ? "🌐" : isCust ? "👤" : "💳"}
                      </text>

                      <text
                        x={node.position.x}
                        y={node.position.y + (isDev ? 34 : 28)}
                        fill={isSel ? "#10B981" : "#E2E8F0"}
                        fontSize="9"
                        fontWeight={isSel ? "bold" : "normal"}
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {node.data?.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-3">
                  <span>📱 Device</span>
                  <span>🌐 IP</span>
                  <span>👤 Customer</span>
                  <span>💳 Card</span>
                </div>
                <span>Click any node to inspect</span>
              </div>
            </div>

            {/* Right Entity Inspector (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="rounded-2xl border border-border/60 shadow-xs bg-muted/15 h-full flex flex-col justify-between p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <span className="text-xs font-bold text-foreground font-mono uppercase">
                      Entity Inspector
                    </span>
                    <Badge variant="destructive" className="font-mono text-[10px]">
                      {selectedEntity?.data?.type || "Device"}
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-sm font-bold text-foreground font-mono block">
                      {selectedEntity?.data?.label || "Device D102"}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed bg-background/90 p-3 rounded-xl border border-border/40 font-medium">
                      Shared hardware fingerprint linked to 7 distinct customer registrations within 45 minutes.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-background/90 border border-border/40">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                        Risk Level
                      </span>
                      <span className="text-base font-extrabold text-rose-500 font-mono">
                        CRITICAL
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-background/90 border border-border/40">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                        Connections
                      </span>
                      <span className="text-base font-extrabold text-foreground font-mono">
                        17 Entities
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40">
                  <Button
                    onClick={() => toast.success(`Flagged ${selectedEntity?.data?.label} in central registry`)}
                    variant="outline"
                    className="w-full h-8 text-xs font-bold border-rose-500/30 text-rose-500 hover:bg-rose-500/10 rounded-xl"
                  >
                    Blacklist Entity Hardware ID
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
              <CardTitle className="text-sm font-bold tracking-tight">
                Why Was This Ring Detected?
              </CardTitle>
              <CardDescription className="text-xs">
                Empirical feature contributions generated by the Graph-Enhanced Sentinel
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-2.5">
              {signals.map((sig: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center font-mono font-bold text-[10px]">
                      0{idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-foreground block font-mono text-[11px]">
                        {sig.type}
                      </span>
                      <span className="text-muted-foreground text-xs">{sig.description}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] text-rose-500 shrink-0">
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
              <CardTitle className="text-sm font-bold tracking-tight">
                Ring DNA Fingerprint
              </CardTitle>
              <CardDescription className="text-xs">
                Normalized structural and behavioral dimensions (0 - 100)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-3.5 text-xs">
              {Object.entries(dna).map(([key, val]: [string, any]) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground uppercase">{key.replace(/_/g, " ")}</span>
                    <span className="font-bold text-foreground">{val}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        val >= 80 ? "bg-rose-500" : val >= 60 ? "bg-amber-500" : "bg-emerald-500"
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

      {/* 🌟 5. Activity Timeline & Formation Replay */}
      <Card className="rounded-3xl border border-border/60 shadow-xs bg-card overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Chronological Event Timeline & Formation Replay</span>
            </CardTitle>
            <CardDescription className="text-xs">
              18 transactions occurred within 120 seconds — High temporal coordination
            </CardDescription>
          </div>

          {/* Replay Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-8 text-xs font-bold rounded-xl gap-1.5 border-border/60"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-emerald-500" />}
              <span>{isPlaying ? "Pause Replay" : "Play Formation Replay"}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setReplayIndex(0); setIsPlaying(false); }}
              className="h-8 text-xs rounded-xl"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {timelineData?.events?.slice(0, 15).map((ev: any, i: number) => (
              <div
                key={ev.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between text-xs font-mono ${
                  i <= replayIndex
                    ? "bg-rose-500/10 border-rose-500/30 text-foreground"
                    : "bg-muted/10 border-border/30 text-muted-foreground opacity-40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-rose-500">#{i + 1}</span>
                  <span className="font-bold text-foreground">{ev.timestamp.slice(11, 19)}</span>
                  <span>{ev.customer_id}</span>
                  <span className="text-muted-foreground">via {ev.device_id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-500">₹{ev.amount}</span>
                  <Badge variant="destructive" className="text-[9px] py-0 px-1.5 h-4">
                    FLAGGED
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
