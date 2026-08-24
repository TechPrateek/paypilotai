"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, ZoomIn, ZoomOut, RefreshCw, Layers, ShieldAlert, CheckCircle, Info } from "lucide-react";

export interface GraphNodeData {
  id: string;
  label: string;
  type: "Transaction" | "Customer" | "Device" | "Network" | "PaymentInstrument" | "Merchant" | "Email" | "Address";
  properties?: Record<string, any>;
  isTarget?: boolean;
  riskScore?: number;
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  relationship: string;
  properties?: Record<string, any>;
}

export interface GraphExplorerProps {
  transactionId: string;
  initialNodes?: GraphNodeData[];
  initialEdges?: GraphEdgeData[];
  height?: number;
}

const NODE_COLORS: Record<string, { bg: string; border: string; text: string; fill: string; simpleLabel: string }> = {
  Transaction: { bg: "bg-blue-600", border: "#2563eb", text: "text-blue-200", fill: "#3b82f6", simpleLabel: "Order" },
  Customer: { bg: "bg-emerald-600", border: "#059669", text: "text-emerald-200", fill: "#10b981", simpleLabel: "Customer" },
  Device: { bg: "bg-rose-600", border: "#e11d48", text: "text-rose-200", fill: "#f43f5e", simpleLabel: "Phone / PC" },
  Network: { bg: "bg-cyan-600", border: "#0891b2", text: "text-cyan-200", fill: "#06b6d4", simpleLabel: "Internet IP" },
  PaymentInstrument: { bg: "bg-amber-600", border: "#d97706", text: "text-amber-200", fill: "#f59e0b", simpleLabel: "Card / UPI" },
  Merchant: { bg: "bg-purple-600", border: "#7c3aed", text: "text-purple-200", fill: "#8b5cf6", simpleLabel: "Your Store" },
  Email: { bg: "bg-slate-600", border: "#475569", text: "text-slate-200", fill: "#64748b", simpleLabel: "Email" },
  Address: { bg: "bg-indigo-600", border: "#4f46e5", text: "text-indigo-200", fill: "#6366f1", simpleLabel: "Address" },
};

const RELATION_SIMPLE_LABELS: Record<string, string> = {
  MADE: "Placed by",
  USED_DEVICE: "Used Phone/PC",
  USED_PAYMENT: "Paid via",
  FROM_NETWORK: "Connected from",
  BELONGS_TO: "Store",
  USES_EMAIL: "Email",
  ASSOCIATED_WITH: "Linked to",
};

export function GraphExplorer({ transactionId, initialNodes, initialEdges, height = 460 }: GraphExplorerProps) {
  const [nodes, setNodes] = useState<GraphNodeData[]>(initialNodes || []);
  const [edges, setEdges] = useState<GraphEdgeData[]>(initialEdges || []);
  const [loading, setLoading] = useState(!initialNodes);
  const [selectedNode, setSelectedNode] = useState<GraphNodeData | null>(null);
  const [zoom, setZoom] = useState(1);
  const [density, setDensity] = useState(0.25);
  const [sharedCount, setSharedCount] = useState(0);

  useEffect(() => {
    if (!initialNodes || initialNodes.length === 0) {
      fetchGraph();
    }
  }, [transactionId]);

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions/${transactionId}/graph`);
      if (res.ok) {
        const data = await res.json();
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setDensity(data.graphDensity || 0.2);
        setSharedCount(data.sharedEntityCount || 0);
        const target = data.nodes?.find((n: GraphNodeData) => n.isTarget) || data.nodes?.[0];
        if (target) setSelectedNode(target);
      }
    } catch (e) {
      console.error("Failed to load graph data", e);
    } finally {
      setLoading(false);
    }
  };

  const centerX = 350;
  const centerY = 210;
  const radius = 150;

  const nodePositions: Record<string, { x: number; y: number }> = {};
  const nonTargetNodes = nodes.filter((n) => !n.isTarget);
  const targetNode = nodes.find((n) => n.isTarget) || nodes[0];

  if (targetNode) {
    nodePositions[targetNode.id] = { x: centerX, y: centerY };
  }

  nonTargetNodes.forEach((node, index) => {
    const angle = (index / Math.max(nonTargetNodes.length, 1)) * 2 * Math.PI - Math.PI / 2;
    nodePositions[node.id] = {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  });

  return (
    <Card className="border border-border/60 shadow-md bg-card overflow-hidden">
      <CardHeader className="py-3 px-4 bg-muted/20 border-b border-border/40 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold">Connected Accounts, Devices & Payments Map</CardTitle>
          <Badge variant="outline" className="text-xs font-mono ml-2">
            Visual Connection Map
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.min(z + 0.15, 1.6))}>
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.max(z - 0.15, 0.6))}>
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setZoom(1); fetchGraph(); }}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 relative">
        {loading ? (
          <div className="flex items-center justify-center h-[460px] text-muted-foreground gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-primary" />
            <span>Loading connection map...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[460px]">
            {/* SVG Visualizer */}
            <div className="lg:col-span-3 bg-zinc-950/40 relative overflow-hidden flex items-center justify-center p-4 border-r border-border/40">
              {/* Legend Overlay */}
              <div className="absolute top-3 left-3 bg-background/80 backdrop-blur border border-border/50 rounded-lg p-2 text-xs flex flex-wrap gap-2.5 z-10">
                {Object.entries(NODE_COLORS).slice(0, 6).map(([type, c]) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.fill }} />
                    <span className="text-[11px] font-medium text-muted-foreground">{c.simpleLabel}</span>
                  </div>
                ))}
              </div>

              {/* Stats Overlay */}
              <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur border border-border/50 rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-4 z-10 text-muted-foreground">
                <span><strong>Items:</strong> {nodes.length}</span>
                <span><strong>Links:</strong> {edges.length}</span>
                {sharedCount > 0 && (
                  <Badge variant="destructive" className="text-[10px] py-0 px-1.5 h-4">
                    {sharedCount} Shared Across Multiple Accounts
                  </Badge>
                )}
              </div>

              {/* SVG Canvas */}
              <svg
                viewBox="0 0 700 420"
                className="w-full h-[400px] select-none transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
              >
                <defs>
                  <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </radialGradient>
                  <marker
                    id="arrowhead"
                    markerWidth="8"
                    markerHeight="6"
                    refX="22"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#64748b" opacity="0.7" />
                  </marker>
                </defs>

                {/* Edges */}
                {edges.map((edge) => {
                  const p1 = nodePositions[edge.source];
                  const p2 = nodePositions[edge.target];
                  if (!p1 || !p2) return null;

                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;
                  const label = RELATION_SIMPLE_LABELS[edge.relationship] || edge.relationship;

                  return (
                    <g key={edge.id} className="transition-opacity hover:opacity-100 opacity-70">
                      <line
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke="#64748b"
                        strokeWidth="1.75"
                        strokeDasharray="3 3"
                        markerEnd="url(#arrowhead)"
                      />
                      <rect
                        x={midX - 32}
                        y={midY - 8}
                        width="64"
                        height="16"
                        rx="3"
                        fill="#09090b"
                        stroke="#27272a"
                        strokeWidth="0.75"
                      />
                      <text
                        x={midX}
                        y={midY + 3}
                        fontSize="9"
                        textAnchor="middle"
                        fill="#a1a1aa"
                        className="select-none"
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                  const pos = nodePositions[node.id] || { x: centerX, y: centerY };
                  const colorConfig = NODE_COLORS[node.type] || NODE_COLORS.Transaction;
                  const isSelected = selectedNode?.id === node.id;
                  const isTarget = node.isTarget;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      className="cursor-pointer group"
                      onClick={() => setSelectedNode(node)}
                    >
                      {isTarget && (
                        <circle r="42" fill="url(#targetGlow)" className="animate-pulse" />
                      )}

                      <circle
                        r={isTarget ? 26 : 20}
                        fill={colorConfig.fill}
                        stroke={isSelected ? "#ffffff" : isTarget ? "#60a5fa" : colorConfig.border}
                        strokeWidth={isSelected ? 3 : isTarget ? 2.5 : 1.5}
                        className="transition-all duration-150 group-hover:filter group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                      />

                      <text
                        y={3}
                        fontSize={isTarget ? "11" : "9.5"}
                        fontWeight="bold"
                        textAnchor="middle"
                        fill="#ffffff"
                        className="pointer-events-none select-none tracking-tight"
                      >
                        {colorConfig.simpleLabel.slice(0, 4)}
                      </text>

                      <text
                        y={isTarget ? 38 : 32}
                        fontSize="10"
                        fontWeight={isTarget ? "600" : "500"}
                        textAnchor="middle"
                        fill={isSelected ? "#ffffff" : "#cbd5e1"}
                        className="pointer-events-none select-none bg-background/90"
                      >
                        {node.label.length > 20 ? node.label.slice(0, 18) + "..." : node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected Node Property Drawer */}
            <div className="p-4 bg-card/60 flex flex-col justify-between">
              {selectedNode ? (
                <div className="space-y-4">
                  <div className="border-b border-border/50 pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        variant="secondary"
                        className="text-xs font-semibold tracking-wide"
                        style={{
                          backgroundColor: NODE_COLORS[selectedNode.type]?.fill + "25",
                          color: NODE_COLORS[selectedNode.type]?.fill,
                        }}
                      >
                        {NODE_COLORS[selectedNode.type]?.simpleLabel || selectedNode.type}
                      </Badge>
                      {selectedNode.isTarget && (
                        <Badge variant="default" className="text-[10px] bg-blue-600">
                          Current Order
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm leading-tight text-foreground">{selectedNode.label}</h4>
                    <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">{selectedNode.id}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="font-medium text-muted-foreground uppercase text-[10px] tracking-wider">Item Details</p>
                    {selectedNode.properties && Object.keys(selectedNode.properties).length > 0 ? (
                      <div className="space-y-1.5 bg-muted/30 p-2.5 rounded-md border border-border/40 text-[11px]">
                        {Object.entries(selectedNode.properties).map(([k, v]) => (
                          <div key={k} className="flex justify-between items-center text-foreground/90">
                            <span className="text-muted-foreground">{k}:</span>
                            <span className="font-medium truncate max-w-[130px]">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic text-xs">No extra details recorded.</p>
                    )}
                  </div>

                  <div className="p-2.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-blue-300 mb-1">
                      <Info className="h-3.5 w-3.5" />
                      Why This Connection Matters
                    </div>
                    <p className="text-[11px] text-blue-200/80 leading-relaxed">
                      PayPilot checks if this phone, card, or internet IP address is being shared with suspicious or previously reported accounts.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                  <Layers className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-xs">Click any circle on the map to see its details and connections.</p>
                </div>
              )}

              <div className="pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>PayPilot Visual Network</span>
                <span className="font-mono text-primary font-semibold">Active</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
