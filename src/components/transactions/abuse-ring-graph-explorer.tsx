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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GraphNode {
  id: string;
  label: string;
  type: "Customer" | "Device" | "Network" | "PaymentInstrument" | "Merchant";
  riskScore?: number;
  x: number;
  y: number;
  details: string;
  flagged?: boolean;
}

interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  flagged?: boolean;
}

const NODES: GraphNode[] = [
  // Center Device Node (Hardware Fingerprint)
  {
    id: "dev-01",
    label: "Dev: a1b2c3d4e5f6g7",
    type: "Device",
    x: 400,
    y: 250,
    details: "Hardware Fingerprint (Apple M2 Mac / Chrome 121) • Shared by 4 suspicious accounts",
    flagged: true,
    riskScore: 92,
  },
  // Network Node (Tor Exit Node)
  {
    id: "net-01",
    label: "Tor: 185.220.101.5",
    type: "Network",
    x: 400,
    y: 110,
    details: "Known Tor Exit Node • Masking location across 14 rapid payment bursts",
    flagged: true,
    riskScore: 95,
  },
  // Customer 1
  {
    id: "cust-01",
    label: "Cust: Michael Chen",
    type: "Customer",
    x: 210,
    y: 180,
    details: "Account created 1 day ago • 7 failed attempts • Casino Royal",
    flagged: true,
    riskScore: 92,
  },
  // Customer 2
  {
    id: "cust-02",
    label: "Cust: Viktor Orlov",
    type: "Customer",
    x: 590,
    y: 180,
    details: "Account created 3 hours ago • $8,920 wire transfer attempt",
    flagged: true,
    riskScore: 95,
  },
  // Customer 3
  {
    id: "cust-03",
    label: "Cust: Alex Rivera",
    type: "Customer",
    x: 210,
    y: 320,
    details: "Account created 2 days ago • $15,750 Luxury Store order",
    flagged: true,
    riskScore: 87,
  },
  // Customer 4
  {
    id: "cust-04",
    label: "Cust: David Kumar",
    type: "Customer",
    x: 590,
    y: 320,
    details: "Account created 4 days ago • Crypto Exchange purchase",
    flagged: true,
    riskScore: 78,
  },
  // Card 1
  {
    id: "card-01",
    label: "Visa **** 4111",
    type: "PaymentInstrument",
    x: 90,
    y: 180,
    details: "Stolen credit card BIN #411122 • Card testing pattern detected",
    flagged: true,
    riskScore: 90,
  },
  // Card 2
  {
    id: "card-02",
    label: "MC **** 5521",
    type: "PaymentInstrument",
    x: 710,
    y: 180,
    details: "Mastercard debit • High velocity switches",
    flagged: true,
    riskScore: 85,
  },
  // Card 3
  {
    id: "card-03",
    label: "RuPay **** 8890",
    type: "PaymentInstrument",
    x: 90,
    y: 320,
    details: "RuPay credit card • 3 declined OTP timeouts",
    flagged: true,
    riskScore: 75,
  },
  // Card 4
  {
    id: "card-04",
    label: "Visa **** 1092",
    type: "PaymentInstrument",
    x: 710,
    y: 320,
    details: "International card • Declines exceeded threshold",
    flagged: true,
    riskScore: 80,
  },
];

const EDGES: GraphEdge[] = [
  { source: "dev-01", target: "net-01", relationship: "FROM_NETWORK", flagged: true },
  { source: "cust-01", target: "dev-01", relationship: "USED_DEVICE", flagged: true },
  { source: "cust-02", target: "dev-01", relationship: "USED_DEVICE", flagged: true },
  { source: "cust-03", target: "dev-01", relationship: "USED_DEVICE", flagged: true },
  { source: "cust-04", target: "dev-01", relationship: "USED_DEVICE", flagged: true },
  { source: "cust-01", target: "card-01", relationship: "USED_PAYMENT", flagged: true },
  { source: "cust-02", target: "card-02", relationship: "USED_PAYMENT", flagged: true },
  { source: "cust-03", target: "card-03", relationship: "USED_PAYMENT", flagged: true },
  { source: "cust-04", target: "card-04", relationship: "USED_PAYMENT", flagged: true },
];

export function AbuseRingGraphExplorer() {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(NODES[0]); // Default to Center Device

  const handleIsolateRing = () => {
    toast.success("Abuse-Ring Cluster #RING-7092 Isolated! 4 Accounts & 1 Device Fingerprint Blocked.");
  };

  return (
    <div className="space-y-6">
      {/* Interactive Graph Canvas Card */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md bg-card overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-base font-extrabold text-foreground">
                Heterogeneous Abuse-Ring Graph Explorer
              </CardTitle>
            </div>
            <CardDescription className="text-xs mt-0.5">
              Click any node (Customer, Device, Network, or Card) to inspect multi-hop relational connections.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="font-mono text-xs uppercase px-2.5 py-1">
              Active Syndicate: 4 Accounts Linked
            </Badge>
            <Button
              size="sm"
              onClick={handleIsolateRing}
              className="h-8 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
            >
              Isolate Entire Ring
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SVG Visual Graph (8 cols) */}
            <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-4 relative overflow-hidden border border-slate-800 min-h-[420px] flex items-center justify-center">
              {/* Subtle Grid Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              <svg viewBox="0 0 800 420" className="w-full h-full relative z-10 select-none">
                {/* Render Edges */}
                {EDGES.map((edge, i) => {
                  const sourceNode = NODES.find((n) => n.id === edge.source);
                  const targetNode = NODES.find((n) => n.id === edge.target);
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
                        strokeDasharray={edge.flagged ? "4 2" : "none"}
                        className="transition-all duration-300"
                      />
                      {/* Edge Label */}
                      <text
                        x={(sourceNode.x + targetNode.x) / 2}
                        y={(sourceNode.y + targetNode.y) / 2 - 4}
                        fill="#94A3B8"
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {edge.relationship}
                      </text>
                    </g>
                  );
                })}

                {/* Render Nodes */}
                {NODES.map((node) => {
                  const isSelected = selectedNode.id === node.id;
                  const isDevice = node.type === "Device";
                  const isNetwork = node.type === "Network";
                  const isCustomer = node.type === "Customer";
                  const isCard = node.type === "PaymentInstrument";

                  let fillColor = "#1E293B";
                  let strokeColor = "#64748B";
                  let textColor = "#F8FAFC";

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
                      {/* Outer pulse ring for device */}
                      {isDevice && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="34"
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
                        r={isDevice ? "26" : isNetwork ? "22" : "20"}
                        fill={fillColor}
                        stroke={isSelected ? "#10B981" : strokeColor}
                        strokeWidth={isSelected ? 3 : 2}
                        className="shadow-lg transition-all duration-200"
                      />

                      {/* Node Center Icon/Text */}
                      <text
                        x={node.x}
                        y={node.y + 4}
                        fill={textColor}
                        fontSize={isDevice ? "11" : "9"}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {isDevice ? "📱" : isNetwork ? "🌐" : isCustomer ? "👤" : "💳"}
                      </text>

                      {/* Node Label Below */}
                      <text
                        x={node.x}
                        y={node.y + (isDevice ? 38 : 32)}
                        fill={isSelected ? "#10B981" : "#E2E8F0"}
                        fontSize="10"
                        fontWeight={isSelected ? "bold" : "normal"}
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Bottom Canvas Legend */}
              <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Device Node</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> Tor Network</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Customer Account</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Stolen Card</span>
                </div>
                <span>7 Node Types • 7 Relations</span>
              </div>
            </div>

            {/* Right Node Inspector (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-muted/15 h-full flex flex-col justify-between p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <span className="text-xs font-bold text-foreground">Node Forensic Inspector</span>
                    <Badge
                      variant={selectedNode.riskScore && selectedNode.riskScore >= 80 ? "destructive" : "secondary"}
                      className="font-mono text-xs"
                    >
                      {selectedNode.type}
                    </Badge>
                  </div>

                  {/* Selected Node Details */}
                  <div className="space-y-2">
                    <span className="text-sm font-bold text-foreground block">
                      {selectedNode.label}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed bg-background/80 p-3 rounded-xl border border-border/40">
                      {selectedNode.details}
                    </p>
                  </div>

                  {/* Risk & Centrality Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-background/80 border border-border/40">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                        Ring Risk Score
                      </span>
                      <span className="text-base font-extrabold text-rose-500 font-mono">
                        {selectedNode.riskScore || 85}%
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-background/80 border border-border/40">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                        Connected Degree
                      </span>
                      <span className="text-base font-extrabold text-foreground font-mono">
                        {selectedNode.id === "dev-01" ? "4 Accounts" : "1 Entity"}
                      </span>
                    </div>
                  </div>

                  {/* GNN Analysis Summary */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      GNN Message-Passing Findings
                    </span>
                    <div className="text-[11px] text-foreground/80 space-y-1 bg-background/80 p-2.5 rounded-xl border border-border/40">
                      <div className="flex items-center gap-1.5 text-rose-500 font-semibold">
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        <span>High clustering coefficient (0.84)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-500 font-semibold">
                        <Zap className="h-3 w-3 shrink-0" />
                        <span>Rapid card rotation across single MAC/IP</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40">
                  <Button
                    onClick={() => toast.success(`Node ${selectedNode.label} flagged in central abuse registry.`)}
                    variant="outline"
                    className="w-full h-8 text-xs font-bold border-rose-500/30 text-rose-500 hover:bg-rose-500/10 rounded-xl"
                  >
                    Flag This Specific Entity
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
