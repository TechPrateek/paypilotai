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
  HelpCircle,
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
  simpleExplanation: string;
  flagged?: boolean;
}

interface GraphEdge {
  source: string;
  target: string;
  simpleRelation: string;
  flagged?: boolean;
}

const NODES: GraphNode[] = [
  // Center Device Node (Hardware Fingerprint)
  {
    id: "dev-01",
    label: "📱 Same Mac Laptop",
    type: "Device",
    x: 400,
    y: 250,
    simpleExplanation: "⚠️ 1 Single Laptop was used by 4 different customer names to place orders within 1 hour.",
    flagged: true,
    riskScore: 92,
  },
  // Network Node (Tor Exit Node)
  {
    id: "net-01",
    label: "🌐 Hidden IP Location",
    type: "Network",
    x: 400,
    y: 110,
    simpleExplanation: "⚠️ Location was masked using an anonymous proxy to hide where the attacker is sitting.",
    flagged: true,
    riskScore: 95,
  },
  // Customer 1
  {
    id: "cust-01",
    label: "👤 Michael Chen",
    type: "Customer",
    x: 210,
    y: 180,
    simpleExplanation: "Brand new account • Tried 7 failed payments in 5 minutes.",
    flagged: true,
    riskScore: 92,
  },
  // Customer 2
  {
    id: "cust-02",
    label: "👤 Viktor Orlov",
    type: "Customer",
    x: 590,
    y: 180,
    simpleExplanation: "Account created 3 hours ago • Tried large $8,920 transfer on same laptop.",
    flagged: true,
    riskScore: 95,
  },
  // Customer 3
  {
    id: "cust-03",
    label: "👤 Alex Rivera",
    type: "Customer",
    x: 210,
    y: 320,
    simpleExplanation: "Tried buying $15,750 of electronics using stolen credit card.",
    flagged: true,
    riskScore: 87,
  },
  // Customer 4
  {
    id: "cust-04",
    label: "👤 David Kumar",
    type: "Customer",
    x: 590,
    y: 320,
    simpleExplanation: "Used the same laptop to buy crypto vouchers.",
    flagged: true,
    riskScore: 78,
  },
  // Card 1
  {
    id: "card-01",
    label: "💳 Visa **** 4111",
    type: "PaymentInstrument",
    x: 90,
    y: 180,
    simpleExplanation: "Stolen card number tested repeatedly with micro-amounts.",
    flagged: true,
    riskScore: 90,
  },
  // Card 2
  {
    id: "card-02",
    label: "💳 MC **** 5521",
    type: "PaymentInstrument",
    x: 710,
    y: 180,
    simpleExplanation: "Mastercard card declined 3 times.",
    flagged: true,
    riskScore: 85,
  },
  // Card 3
  {
    id: "card-03",
    label: "💳 RuPay **** 8890",
    type: "PaymentInstrument",
    x: 90,
    y: 320,
    simpleExplanation: "Card failed OTP verification.",
    flagged: true,
    riskScore: 75,
  },
  // Card 4
  {
    id: "card-04",
    label: "💳 Visa **** 1092",
    type: "PaymentInstrument",
    x: 710,
    y: 320,
    simpleExplanation: "International card with failed payment limit.",
    flagged: true,
    riskScore: 80,
  },
];

const EDGES: GraphEdge[] = [
  { source: "dev-01", target: "net-01", simpleRelation: "Connected via", flagged: true },
  { source: "cust-01", target: "dev-01", simpleRelation: "Used same laptop", flagged: true },
  { source: "cust-02", target: "dev-01", simpleRelation: "Used same laptop", flagged: true },
  { source: "cust-03", target: "dev-01", simpleRelation: "Used same laptop", flagged: true },
  { source: "cust-04", target: "dev-01", simpleRelation: "Used same laptop", flagged: true },
  { source: "cust-01", target: "card-01", simpleRelation: "Used Card 1", flagged: true },
  { source: "cust-02", target: "card-02", simpleRelation: "Used Card 2", flagged: true },
  { source: "cust-03", target: "card-03", simpleRelation: "Used Card 3", flagged: true },
  { source: "cust-04", target: "card-04", simpleRelation: "Used Card 4", flagged: true },
];

export function AbuseRingGraphExplorer() {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(NODES[0]); // Default to Center Device

  const handleIsolateRing = () => {
    toast.success("Fraud Ring Blocked! 4 Fake Accounts & 1 Device ID blacklisted.");
  };

  return (
    <div className="space-y-6">
      {/* Visual Connection Map Card */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md bg-card overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-base font-extrabold text-foreground">
                How We Caught the Fraud Gang (Connection Map)
              </CardTitle>
            </div>
            <CardDescription className="text-xs mt-0.5">
              Click any circle below (Person, Phone, Internet, or Card) to see why it was flagged.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="font-mono text-xs uppercase px-2.5 py-1">
              🚨 4 Fake Accounts on 1 Laptop
            </Badge>
            <Button
              size="sm"
              onClick={handleIsolateRing}
              className="h-8 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
            >
              Block Entire Gang
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
                        fontFamily="sans-serif"
                        fontWeight="bold"
                      >
                        {edge.simpleRelation}
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
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Phone/Laptop</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> Internet Location</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Customer</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Payment Card</span>
                </div>
                <span>Click any circle to see details</span>
              </div>
            </div>

            {/* Right Plain-English Inspector (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-muted/15 h-full flex flex-col justify-between p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <span className="text-xs font-bold text-foreground">Why This Was Flagged</span>
                    <Badge
                      variant={selectedNode.riskScore && selectedNode.riskScore >= 80 ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {selectedNode.riskScore && selectedNode.riskScore >= 80 ? "High Risk" : "Safe"}
                    </Badge>
                  </div>

                  {/* Selected Node Details */}
                  <div className="space-y-2">
                    <span className="text-sm font-bold text-foreground block">
                      {selectedNode.label}
                    </span>
                    <p className="text-xs text-foreground/90 leading-relaxed bg-background/90 p-3 rounded-xl border border-border/40 font-medium">
                      {selectedNode.simpleExplanation}
                    </p>
                  </div>

                  {/* Simple Status Cards */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-background/90 border border-border/40">
                      <span className="text-[10px] text-muted-foreground font-bold block">
                        Fraud Score
                      </span>
                      <span className="text-base font-extrabold text-rose-500 font-mono">
                        {selectedNode.riskScore || 85}%
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-background/90 border border-border/40">
                      <span className="text-[10px] text-muted-foreground font-bold block">
                        Linked Accounts
                      </span>
                      <span className="text-base font-extrabold text-foreground font-mono">
                        {selectedNode.id === "dev-01" ? "4 People" : "1 Person"}
                      </span>
                    </div>
                  </div>

                  {/* Simple Key Findings in Plain English */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Simple Summary
                    </span>
                    <div className="text-[11px] text-foreground/90 space-y-1.5 bg-background/90 p-3 rounded-xl border border-border/40">
                      <div className="flex items-start gap-1.5 text-rose-500 font-semibold">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>Same laptop used with 4 different customer names.</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-amber-500 font-semibold">
                        <Zap className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>Cards were swapped rapidly after payment failed.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40">
                  <Button
                    onClick={() => toast.success(`Flagged ${selectedNode.label} for store protection.`)}
                    variant="outline"
                    className="w-full h-8 text-xs font-bold border-rose-500/30 text-rose-500 hover:bg-rose-500/10 rounded-xl"
                  >
                    Block This Customer/Device
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
