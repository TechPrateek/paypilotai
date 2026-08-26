"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Network,
  Search,
  Filter,
  Share2,
  Smartphone,
  Globe,
  User,
  CreditCard,
  RotateCcw,
  Maximize2,
  ShieldAlert,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function GraphExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [graphData, setGraphData] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGraph() {
      try {
        const res = await fetch("/api/rings/RING-0042/graph");
        if (res.ok) {
          const data = await res.json();
          setGraphData(data);
          if (data.nodes && data.nodes.length > 0) {
            setSelectedNode(data.nodes[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load graph:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGraph();
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
              GRAPH EXPLORER
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-purple-500 border-purple-500/30">
              Heterogeneous Entity Network
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
            Search any customer, device hardware fingerprint, IP address, or payment card to reveal hidden syndicate clusters.
          </p>
        </div>

        {/* Search & Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search Customer, Device, IP, Card..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs rounded-xl w-52 sm:w-72 font-mono"
            />
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("Graph centered on primary syndicate component")}
            className="h-8 text-xs font-bold rounded-xl gap-1"
          >
            <Maximize2 className="h-3 w-3" /> Fit View
          </Button>
        </div>
      </div>

      {/* Main Full-Screen Graph Canvas (Split with Entity Inspector) */}
      <Card className="rounded-3xl border border-border/60 shadow-md bg-card overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SVG Visual Canvas (8 cols) */}
            <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-4 relative overflow-hidden border border-slate-800 min-h-[480px] flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              <svg viewBox="0 0 800 480" className="w-full h-full relative z-10 select-none">
                {/* Render Edges */}
                {graphData?.edges?.map((edge: any) => {
                  const sNode = graphData.nodes.find((n: any) => n.id === edge.source);
                  const tNode = graphData.nodes.find((n: any) => n.id === edge.target);
                  if (!sNode || !tNode) return null;

                  const isSel = selectedNode?.id === sNode.id || selectedNode?.id === tNode.id;

                  return (
                    <g key={edge.id}>
                      <line
                        x1={sNode.position.x}
                        y1={sNode.position.y + 20}
                        x2={tNode.position.x}
                        y2={tNode.position.y + 20}
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
                  const isSel = selectedNode?.id === node.id;
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
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer transition-transform duration-200 hover:scale-110"
                    >
                      {isDev && (
                        <circle
                          cx={node.position.x}
                          cy={node.position.y + 20}
                          r="28"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="1.5"
                          className="animate-ping opacity-20"
                        />
                      )}

                      <circle
                        cx={node.position.x}
                        cy={node.position.y + 20}
                        r={isDev ? "22" : "18"}
                        fill={fill}
                        stroke={isSel ? "#10B981" : stroke}
                        strokeWidth={isSel ? 3 : 2}
                        className="shadow-lg"
                      />

                      <text
                        x={node.position.x}
                        y={node.position.y + 24}
                        fill="#FFFFFF"
                        fontSize={isDev ? "10" : "8"}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {isDev ? "📱" : isIP ? "🌐" : isCust ? "👤" : "💳"}
                      </text>

                      <text
                        x={node.position.x}
                        y={node.position.y + (isDev ? 54 : 48)}
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
                <span>7 Node Types • 5 Edge Relations</span>
              </div>
            </div>

            {/* Right Entity Inspector (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="rounded-2xl border border-border/60 shadow-xs bg-muted/15 h-full flex flex-col justify-between p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <span className="text-xs font-bold text-foreground font-mono uppercase">
                      Entity Profile
                    </span>
                    <Badge variant="destructive" className="font-mono text-[10px]">
                      {selectedNode?.data?.type || "Device"}
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-sm font-bold text-foreground font-mono block">
                      {selectedNode?.data?.label || "Device D102"}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed bg-background/90 p-3 rounded-xl border border-border/40 font-medium">
                      Multi-account hardware fingerprint associated with coordinated syndicate RING-0042.
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
                        Connected Ring
                      </span>
                      <span className="text-base font-extrabold text-foreground font-mono">
                        RING-0042
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40">
                  <Link href="/investigations/RING-0042">
                    <Button
                      variant="outline"
                      className="w-full h-8 text-xs font-bold border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 rounded-xl"
                    >
                      Focus Ring #0042 in Console →
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
