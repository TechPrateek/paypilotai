"use client";

import React, { useState } from "react";
import {
  Share2,
  Smartphone,
  Globe,
  User,
  CreditCard,
  ShieldAlert,
  AlertTriangle,
  Layers,
  Lock,
  Zap,
  Info,
  CheckCircle,
  Download,
  ShieldCheck,
  Ban,
  Radio,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface RingCase {
  id: string;
  name: string;
  threatType: string;
  riskScore: number;
  status: "ACTIVE_THREAT" | "ISOLATED" | "MONITORED";
  lossAtRisk: string;
  summary: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: "Device" | "Network" | "Customer" | "PaymentCard";
  riskScore: number;
  x: number;
  y: number;
  details: string;
  ipOrFingerprint?: string;
  flagged?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string;
}

export const SYNDICATE_CASES: RingCase[] = [
  {
    id: "RING-7092",
    name: "Case #1: Tor Proxy Botnet Gang",
    threatType: "Multi-Account Wire Fraud",
    riskScore: 94,
    status: "ACTIVE_THREAT",
    lossAtRisk: "$145,000",
    summary: "4 fake customer accounts created on 1 single Mac laptop using an anonymous Tor IP address to attempt $145,000 in wire transfers.",
    nodes: [
      {
        id: "dev-1",
        label: "MacBook Pro M2",
        type: "Device",
        riskScore: 94,
        x: 400,
        y: 210,
        details: "Shared Hardware ID: a1b2c3d4e5f6g7 • 4 distinct customer accounts logged in within 45 minutes.",
        ipOrFingerprint: "FP-88902-MAC",
        flagged: true,
      },
      {
        id: "net-1",
        label: "Tor Exit Node",
        type: "Network",
        riskScore: 96,
        x: 400,
        y: 80,
        details: "IP: 185.220.101.5 • Known anonymous proxy network masking geographic location.",
        ipOrFingerprint: "185.220.101.5",
        flagged: true,
      },
      {
        id: "cust-1",
        label: "Michael Chen",
        type: "Customer",
        riskScore: 92,
        x: 200,
        y: 150,
        details: "Account age: 1 day • 7 failed transactions • Attempted $500 Casino order.",
        flagged: true,
      },
      {
        id: "cust-2",
        label: "Viktor Orlov",
        type: "Customer",
        riskScore: 95,
        x: 600,
        y: 150,
        details: "Account age: 3 hours • Attempted $8,920 wire transfer on same laptop.",
        flagged: true,
      },
      {
        id: "cust-3",
        label: "Alex Rivera",
        type: "Customer",
        riskScore: 87,
        x: 200,
        y: 280,
        details: "Account age: 2 days • Attempted $15,750 luxury electronics order.",
        flagged: true,
      },
      {
        id: "cust-4",
        label: "David Kumar",
        type: "Customer",
        riskScore: 78,
        x: 600,
        y: 280,
        details: "Account age: 4 days • Purchased cryptocurrency vouchers.",
        flagged: true,
      },
      {
        id: "card-1",
        label: "Visa **** 4111",
        type: "PaymentCard",
        riskScore: 90,
        x: 80,
        y: 150,
        details: "Stolen Card BIN #411122 • Card testing pattern detected.",
        flagged: true,
      },
      {
        id: "card-2",
        label: "MC **** 5521",
        type: "PaymentCard",
        riskScore: 85,
        x: 720,
        y: 150,
        details: "Mastercard debit • Rapid payment retries.",
        flagged: true,
      },
      {
        id: "card-3",
        label: "RuPay **** 8890",
        type: "PaymentCard",
        riskScore: 75,
        x: 80,
        y: 280,
        details: "RuPay card • OTP failed 3 times.",
        flagged: true,
      },
      {
        id: "card-4",
        label: "Visa **** 1092",
        type: "PaymentCard",
        riskScore: 80,
        x: 720,
        y: 280,
        details: "International card • Declines exceeded velocity threshold.",
        flagged: true,
      },
    ],
    edges: [
      { source: "dev-1", target: "net-1", relation: "Connected Via" },
      { source: "cust-1", target: "dev-1", relation: "Shared Laptop" },
      { source: "cust-2", target: "dev-1", relation: "Shared Laptop" },
      { source: "cust-3", target: "dev-1", relation: "Shared Laptop" },
      { source: "cust-4", target: "dev-1", relation: "Shared Laptop" },
      { source: "cust-1", target: "card-1", relation: "Used Card 1" },
      { source: "cust-2", target: "card-2", relation: "Used Card 2" },
      { source: "cust-3", target: "card-3", relation: "Used Card 3" },
      { source: "cust-4", target: "card-4", relation: "Used Card 4" },
    ],
  },
  {
    id: "RING-4108",
    name: "Case #2: Android Emulator Card-Tester",
    threatType: "Automated Card Testing",
    riskScore: 88,
    status: "MONITORED",
    lossAtRisk: "$42,500",
    summary: "2 root Android emulators testing 12 stolen credit cards with rapid $1-2 transactions in under 5 minutes.",
    nodes: [
      {
        id: "dev-2a",
        label: "Android Emulator #1",
        type: "Device",
        riskScore: 88,
        x: 330,
        y: 190,
        details: "BlueStacks Android Virtual Machine • Rooted device profile detected.",
        ipOrFingerprint: "EMU-NOX-001",
        flagged: true,
      },
      {
        id: "dev-2b",
        label: "Android Emulator #2",
        type: "Device",
        riskScore: 85,
        x: 470,
        y: 190,
        details: "Genymotion Virtual Device • Rotating MAC address.",
        ipOrFingerprint: "EMU-GENY-002",
        flagged: true,
      },
      {
        id: "net-2",
        label: "Residential Proxy",
        type: "Network",
        riskScore: 82,
        x: 400,
        y: 70,
        details: "IP: 104.28.19.4 • Rotating proxy pool attempting card verification.",
        flagged: true,
      },
      {
        id: "cust-2a",
        label: "Bot Account A",
        type: "Customer",
        riskScore: 90,
        x: 180,
        y: 190,
        details: "Disposable email @tempmail.org • 12 attempts/min.",
        flagged: true,
      },
      {
        id: "cust-2b",
        label: "Bot Account B",
        type: "Customer",
        riskScore: 86,
        x: 620,
        y: 190,
        details: "Disposable email @10minutemail.com • Automated script pattern.",
        flagged: true,
      },
      {
        id: "card-2a",
        label: "6x Stolen BINs",
        type: "PaymentCard",
        riskScore: 92,
        x: 80,
        y: 190,
        details: "Batch of leaked credit card numbers.",
        flagged: true,
      },
      {
        id: "card-2b",
        label: "6x Stolen Cards",
        type: "PaymentCard",
        riskScore: 88,
        x: 720,
        y: 190,
        details: "Batch of international prepaid cards.",
        flagged: true,
      },
    ],
    edges: [
      { source: "dev-2a", target: "net-2", relation: "Proxy Pool" },
      { source: "dev-2b", target: "net-2", relation: "Proxy Pool" },
      { source: "cust-2a", target: "dev-2a", relation: "Runs on" },
      { source: "cust-2b", target: "dev-2b", relation: "Runs on" },
      { source: "cust-2a", target: "card-2a", relation: "Testing BINs" },
      { source: "cust-2b", target: "card-2b", relation: "Testing Cards" },
    ],
  },
  {
    id: "RING-1923",
    name: "Case #3: Promo Bonus Abuse Syndicate",
    threatType: "Multi-Account Voucher Farming",
    riskScore: 76,
    status: "MONITORED",
    lossAtRisk: "$12,400",
    summary: "5 fake user accounts created on 1 home iPad claiming 5x first-time buyer coupons.",
    nodes: [
      {
        id: "dev-3",
        label: "Shared Apple iPad",
        type: "Device",
        riskScore: 76,
        x: 400,
        y: 200,
        details: "iPad Air 5th Gen (iPadOS 17.2) • 5 different referral codes claimed from 1 device.",
        ipOrFingerprint: "IPAD-AIR-992",
        flagged: true,
      },
      {
        id: "net-3",
        label: "Home Wi-Fi (Airtel)",
        type: "Network",
        riskScore: 40,
        x: 400,
        y: 75,
        details: "IP: 122.161.44.12 • Normal residential broadband.",
        flagged: false,
      },
      {
        id: "cust-3a",
        label: "User #1 (Bonus Claimed)",
        type: "Customer",
        riskScore: 75,
        x: 200,
        y: 140,
        details: "Claimed $50 discount voucher.",
        flagged: true,
      },
      {
        id: "cust-3b",
        label: "User #2 (Bonus Claimed)",
        type: "Customer",
        riskScore: 78,
        x: 600,
        y: 140,
        details: "Claimed $50 discount voucher.",
        flagged: true,
      },
      {
        id: "cust-3c",
        label: "User #3 (Bonus Claimed)",
        type: "Customer",
        riskScore: 74,
        x: 200,
        y: 260,
        details: "Claimed $50 discount voucher.",
        flagged: true,
      },
      {
        id: "cust-3d",
        label: "User #4 (Bonus Claimed)",
        type: "Customer",
        riskScore: 77,
        x: 600,
        y: 260,
        details: "Claimed $50 discount voucher.",
        flagged: true,
      },
    ],
    edges: [
      { source: "dev-3", target: "net-3", relation: "Home Wi-Fi" },
      { source: "cust-3a", target: "dev-3", relation: "Same iPad" },
      { source: "cust-3b", target: "dev-3", relation: "Same iPad" },
      { source: "cust-3c", target: "dev-3", relation: "Same iPad" },
      { source: "cust-3d", target: "dev-3", relation: "Same iPad" },
    ],
  },
];

export function AbuseRingGraphExplorer() {
  const [selectedCase, setSelectedCase] = useState<RingCase>(SYNDICATE_CASES[0]);
  const [selectedNode, setSelectedNode] = useState<GraphNode>(SYNDICATE_CASES[0].nodes[0]);
  const [isBlocked, setIsBlocked] = useState(false);

  const handleSelectCase = (c: RingCase) => {
    setSelectedCase(c);
    setSelectedNode(c.nodes[0]);
    setIsBlocked(false);
  };

  const handleBlockSyndicate = () => {
    setIsBlocked(true);
    toast.success(`Blocked! All entities in "${selectedCase.name}" have been added to the merchant blacklist.`);
  };

  return (
    <div className="space-y-6">
      {/* 🌟 1. Interactive Case Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SYNDICATE_CASES.map((c) => {
          const isSelected = selectedCase.id === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelectCase(c)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
              }`}
            >
              <Radio className={`h-3.5 w-3.5 ${isSelected ? "text-primary-foreground animate-pulse" : "text-muted-foreground"}`} />
              <span>{c.name}</span>
              <Badge
                variant="outline"
                className={`text-[10px] py-0 px-1.5 h-4 ml-1 ${
                  isSelected ? "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30" : ""
                }`}
              >
                {c.riskScore}% Risk
              </Badge>
            </button>
          );
        })}
      </div>

      {/* 🌟 2. Main Visual Canvas Card */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md bg-card overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Share2 className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-base font-extrabold text-foreground">
                {selectedCase.name}
              </CardTitle>
              <Badge
                variant={isBlocked ? "outline" : selectedCase.riskScore >= 80 ? "destructive" : "secondary"}
                className="text-xs uppercase font-bold"
              >
                {isBlocked ? "BLOCKED & ISOLATED" : selectedCase.threatType}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              {selectedCase.summary}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleBlockSyndicate}
              disabled={isBlocked}
              className={`h-8 text-xs font-bold rounded-xl shadow-xs ${
                isBlocked
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }`}
            >
              {isBlocked ? (
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Syndicate Blacklisted</span>
              ) : (
                <span className="flex items-center gap-1.5"><Ban className="h-3.5 w-3.5" /> Block Entire Syndicate</span>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SVG Interactive Canvas (8 cols) */}
            <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-4 relative overflow-hidden border border-slate-800 min-h-[380px] sm:min-h-[420px] flex items-center justify-center">
              {/* Subtle Grid Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              <svg viewBox="0 0 800 380" className="w-full h-full relative z-10 select-none">
                {/* Render Edges */}
                {selectedCase.edges.map((edge, i) => {
                  const sourceNode = selectedCase.nodes.find((n) => n.id === edge.source);
                  const targetNode = selectedCase.nodes.find((n) => n.id === edge.target);
                  if (!sourceNode || !targetNode) return null;

                  const isHighlighted =
                    selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id;

                  return (
                    <g key={i}>
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={isHighlighted ? "#10B981" : "#475569"}
                        strokeWidth={isHighlighted ? 2.5 : 1.5}
                        strokeDasharray="4 2"
                        className="transition-all duration-300"
                      />
                      <text
                        x={(sourceNode.x + targetNode.x) / 2}
                        y={(sourceNode.y + targetNode.y) / 2 - 4}
                        fill="#94A3B8"
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                        fontWeight="bold"
                      >
                        {edge.relation}
                      </text>
                    </g>
                  );
                })}

                {/* Render Nodes */}
                {selectedCase.nodes.map((node) => {
                  const isSelected = selectedNode.id === node.id;
                  const isDevice = node.type === "Device";
                  const isNetwork = node.type === "Network";
                  const isCustomer = node.type === "Customer";
                  const isCard = node.type === "PaymentCard";

                  let fillColor = "#1E293B";
                  let strokeColor = "#64748B";

                  if (isDevice) {
                    fillColor = isSelected ? "#DC2626" : "#7F1D1D";
                    strokeColor = "#EF4444";
                  } else if (isNetwork) {
                    fillColor = isSelected ? "#7C3AED" : "#4C1D95";
                    strokeColor = "#A855F7";
                  } else if (isCustomer) {
                    fillColor = isSelected ? "#2563EB" : "#1E3A8A";
                    strokeColor = "#3B82F6";
                  } else if (isCard) {
                    fillColor = isSelected ? "#D97706" : "#78350F";
                    strokeColor = "#F59E0B";
                  }

                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer transition-transform duration-200 hover:scale-110"
                    >
                      {/* Outer pulse for shared device */}
                      {isDevice && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="32"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="1.5"
                          className="animate-ping opacity-25"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isDevice ? "24" : "20"}
                        fill={fillColor}
                        stroke={isSelected ? "#10B981" : strokeColor}
                        strokeWidth={isSelected ? 3 : 2}
                        className="shadow-lg transition-all duration-200"
                      />

                      {/* Icon */}
                      <text
                        x={node.x}
                        y={node.y + 4}
                        fill="#FFFFFF"
                        fontSize={isDevice ? "11" : "9"}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {isDevice ? "📱" : isNetwork ? "🌐" : isCustomer ? "👤" : "💳"}
                      </text>

                      {/* Node Label Below */}
                      <text
                        x={node.x}
                        y={node.y + (isDevice ? 36 : 30)}
                        fill={isSelected ? "#10B981" : "#E2E8F0"}
                        fontSize="10"
                        fontWeight={isSelected ? "bold" : "normal"}
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Bottom Canvas Legend */}
              <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Phone/PC</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> Internet IP</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Customer</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Payment Card</span>
                </div>
                <span>Click any circle to inspect</span>
              </div>
            </div>

            {/* Right Node Forensic Inspector (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-muted/15 h-full flex flex-col justify-between p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <span className="text-xs font-bold text-foreground">Entity Forensic Inspector</span>
                    <Badge
                      variant={selectedNode.riskScore >= 80 ? "destructive" : "secondary"}
                      className="text-xs font-bold"
                    >
                      {selectedNode.type}
                    </Badge>
                  </div>

                  {/* Selected Entity Header */}
                  <div className="space-y-1.5">
                    <span className="text-sm font-bold text-foreground block">
                      {selectedNode.label}
                    </span>
                    <p className="text-xs text-foreground/90 leading-relaxed bg-background/90 p-3 rounded-xl border border-border/40 font-medium">
                      {selectedNode.details}
                    </p>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-background/90 border border-border/40">
                      <span className="text-[10px] text-muted-foreground font-bold block">
                        Fraud Score
                      </span>
                      <span className="text-base font-extrabold text-rose-500 font-mono">
                        {selectedNode.riskScore}%
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-background/90 border border-border/40">
                      <span className="text-[10px] text-muted-foreground font-bold block">
                        Loss Prevented
                      </span>
                      <span className="text-base font-extrabold text-emerald-500 font-mono">
                        {selectedCase.lossAtRisk}
                      </span>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Recommended Action
                    </span>
                    <div className="text-[11px] text-foreground/90 space-y-1.5 bg-background/90 p-2.5 rounded-xl border border-border/40">
                      <div className="flex items-start gap-1.5 text-rose-500 font-semibold">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>Blacklist device hardware ID to prevent future account creation.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40">
                  <Button
                    onClick={() => toast.success(`Exported PDF Forensic Dossier for ${selectedCase.name}`)}
                    variant="outline"
                    className="w-full h-8 text-xs font-bold gap-1.5 rounded-xl border-slate-200 dark:border-slate-800"
                  >
                    <Download className="h-3 w-3" /> Download Case Dossier (PDF)
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
