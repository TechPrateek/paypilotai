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
  Copy,
  MessageSquare,
  Send,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InteractiveGraphCanvas } from "@/components/graph/interactive-graph-canvas";
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

  // 🌟 Real-time Case Notes
  const [notes, setNotes] = useState<Array<{ id: string; text: string; author: string; timestamp: string }>>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    // Load isolation status
    try {
      const storedIso = localStorage.getItem("paypilot_isolated_rings");
      if (storedIso) {
        const parsed = JSON.parse(storedIso);
        if (parsed[ringId]) setIsIsolated(true);
      }
    } catch {}

    // Load notes from localStorage
    try {
      const storedNotes = localStorage.getItem(`paypilot_notes_${ringId}`);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        setNotes([
          {
            id: "note-1",
            text: "Initial multi-account burst identified on Device D102 across 11 stolen cards. Velocity threshold exceeded 8.4 tx/min.",
            author: "Priya Sharma (Analyst)",
            timestamp: "Aug 20, 10:02",
          },
        ]);
      }
    } catch {}

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

  const handleIsolateToggle = () => {
    const nextState = !isIsolated;
    setIsIsolated(nextState);
    try {
      const storedIso = localStorage.getItem("paypilot_isolated_rings") || "{}";
      const parsed = JSON.parse(storedIso);
      parsed[ringId] = nextState;
      localStorage.setItem("paypilot_isolated_rings", JSON.stringify(parsed));
    } catch {}

    if (nextState) {
      toast.success(`Ring ${ringId} ISOLATED! All ${ringData?.blast_radius?.affected_customers || 17} accounts and connected hardware IDs blacklisted.`);
    } else {
      toast.info(`Ring ${ringId} isolation removed.`);
    }
  };

  const handleExportDossier = () => {
    const packet = {
      ring_id: ringId,
      exported_at: new Date().toISOString(),
      investigator: "Priya Sharma (Fraud Analyst)",
      ring_metadata: ringData?.ring || {},
      blast_radius: ringData?.blast_radius || {},
      signals: ringData?.signals || [],
      ring_dna: ringData?.dna || {},
      notes: notes,
      timeline_events: timelineData?.events || [],
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(packet, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `paypilot_forensic_packet_${ringId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(`Downloaded Forensic Audit Packet for ${ringId}!`);
  };

  const handleCopyDNA = () => {
    const hash = `RING_DNA_${ringId}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    navigator.clipboard.writeText(hash);
    toast.success(`Copied Ring DNA Fingerprint: ${hash}`);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const noteObj = {
      id: `note-${Date.now()}`,
      text: newNote.trim(),
      author: "Priya Sharma (Analyst)",
      timestamp: "Just now",
    };

    const updated = [noteObj, ...notes];
    setNotes(updated);
    setNewNote("");
    try {
      localStorage.setItem(`paypilot_notes_${ringId}`, JSON.stringify(updated));
    } catch {}
    toast.success("Case note added to investigation log.");
  };

  const handleDeleteNote = (noteId: string) => {
    const updated = notes.filter((n) => n.id !== noteId);
    setNotes(updated);
    try {
      localStorage.setItem(`paypilot_notes_${ringId}`, JSON.stringify(updated));
    } catch {}
    toast.info("Note removed.");
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
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-lg cursor-pointer">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
              {ring.id}
            </h1>
            <Badge
              variant={isIsolated ? "default" : ring.severity === "CRITICAL" ? "destructive" : "secondary"}
              className={`font-mono text-xs uppercase font-bold px-2.5 py-0.5 ${
                isIsolated ? "bg-emerald-600 text-white" : ""
              }`}
            >
              {isIsolated ? "ISOLATED & BLOCKED ✓" : ring.severity}
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
            onClick={handleIsolateToggle}
            className={`h-9 px-4 text-xs font-bold rounded-xl shadow-xs gap-1.5 cursor-pointer ${
              isIsolated ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-rose-600 hover:bg-rose-700 text-white"
            }`}
          >
            {isIsolated ? (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Ring Contained (Click to Unblock)</span>
              </>
            ) : (
              <>
                <Ban className="h-4 w-4" />
                <span>Isolate Syndicate</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportDossier}
            className="h-9 px-3 text-xs font-bold rounded-xl gap-1.5 border-border/60 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Export Audit Packet</span>
          </Button>
        </div>
      </div>

      {/* 🌟 2. Blast Radius Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
              AFFECTED ACCOUNTS
            </span>
            <div className="text-2xl font-black text-foreground font-mono">
              {blastRadius.affected_customers}
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">Shared Hardware/IP</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
              FLAGGED TXS
            </span>
            <div className="text-2xl font-black text-foreground font-mono">
              {blastRadius.affected_transactions}
            </div>
            <p className="text-[10px] text-rose-500 font-mono">18 in 120s burst</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
              HARDWARE DEVICES
            </span>
            <div className="text-2xl font-black text-foreground font-mono">
              {blastRadius.affected_devices}
            </div>
            <p className="text-[10px] text-rose-500 font-mono">D102 (High Hub)</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
              GATEWAY IPS
            </span>
            <div className="text-2xl font-black text-foreground font-mono">
              {blastRadius.affected_ips}
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">Tor & VPN detected</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
              STOLEN CARDS
            </span>
            <div className="text-2xl font-black text-foreground font-mono">
              {blastRadius.affected_payments}
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">Cross-account reuse</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase">
              PREVENTED LOSS
            </span>
            <div className="text-2xl font-black text-foreground font-mono">
              ₹{(blastRadius.total_exposure / 100000).toFixed(1)}L
            </div>
            <p className="text-[10px] text-emerald-500 font-mono">Direct Chargeback Saved</p>
          </CardContent>
        </Card>
      </div>

      {/* 🌟 3. Interactive Multi-Hop Graph Canvas */}
      <Card className="rounded-3xl border border-border/60 shadow-md bg-card overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
              <Share2 className="h-4 w-4 text-rose-500" />
              <span>Multi-Hop Relationship Graph</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Interactive SVG canvas — Mouse scroll to zoom, click & drag to pan, glowing nodes represent high-risk hub devices.
            </CardDescription>
          </div>
          <Link href="/graph">
            <Button variant="outline" size="sm" className="h-7 text-xs font-bold gap-1 rounded-xl">
              <span>Full Graph Explorer</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <InteractiveGraphCanvas
                nodes={graphData?.nodes || []}
                edges={graphData?.edges || []}
                onSelectNode={(node) => setSelectedEntity(node)}
              />
            </div>

            {/* Entity Inspector Side Panel (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="text-xs font-bold font-mono text-muted-foreground uppercase">
                    Entity Inspector
                  </span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {selectedEntity?.type || "DEVICE"}
                  </Badge>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Entity ID</span>
                    <span className="font-bold text-foreground text-sm">{selectedEntity?.id || "D102"}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block">Label / Descriptor</span>
                    <span className="font-bold text-foreground">{selectedEntity?.label || "Hardware Laptop (Windows 11)"}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block">Risk Status</span>
                    <Badge variant="destructive" className="font-mono text-[10px] uppercase font-bold mt-1">
                      HIGH RISK HUB
                    </Badge>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`Entity ${selectedEntity?.id || "D102"} added to platform hardware blacklist.`)}
                    className="w-full text-xs font-bold rounded-xl border-rose-500/30 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
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
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold tracking-tight">
                  Ring DNA Fingerprint
                </CardTitle>
                <CardDescription className="text-xs">
                  Normalized structural dimensions (0 - 100)
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyDNA}
                className="h-7 text-xs font-bold gap-1 rounded-xl cursor-pointer"
              >
                <Copy className="h-3 w-3" />
                <span>Copy DNA</span>
              </Button>
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

      {/* 🌟 5. Timeline Replay & Real-Time Case Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="rounded-3xl border border-border/60 shadow-xs bg-card overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Formation Replay ({replayIndex + 1} / {timelineData?.events?.length || 18})</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Chronological event replay showing sub-minute burst activation
                </CardDescription>
              </div>

              {/* Replay Controls */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-8 text-xs font-bold rounded-xl gap-1.5 border-border/60 cursor-pointer"
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-emerald-500" />}
                  <span>{isPlaying ? "Pause Replay" : "Play Formation Replay"}</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setReplayIndex(0); setIsPlaying(false); }}
                  className="h-8 text-xs rounded-xl cursor-pointer"
                  title="Reset Replay"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-5">
              <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
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

        {/* Real-time Case Notes (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>Investigator Case Notes</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time commentary saved with forensic record
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-3">
              <form onSubmit={handleAddNote} className="flex gap-2">
                <Input
                  placeholder="Type investigation note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="h-9 text-xs rounded-xl font-mono"
                />
                <Button type="submit" size="sm" className="h-9 px-3 rounded-xl cursor-pointer">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {notes.map((n) => (
                  <div key={n.id} className="p-3 rounded-2xl bg-muted/20 border border-border/40 space-y-1 text-xs font-mono relative group">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="font-bold text-foreground">{n.author}</span>
                      <div className="flex items-center gap-2">
                        <span>{n.timestamp}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(n.id)}
                          className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-600 transition-opacity cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-sans">{n.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
