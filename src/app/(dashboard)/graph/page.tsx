"use client";

import React, { useEffect, useState } from "react";
import {
  Share2,
  Users,
  Smartphone,
  Globe,
  CreditCard,
  Building,
  Search,
  RotateCcw,
  Maximize2,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SeverityBadge, EntityIcon } from "@/components/sentinel/severity-badge";
import { InteractiveGraphCanvas } from "@/components/graph/interactive-graph-canvas";
import { toast } from "sonner";

export default function GraphExplorerPage() {
  const [graphData, setGraphData] = useState<any>(null);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGraph() {
      try {
        const res = await fetch("/api/rings/RING-0042/graph");
        if (res.ok) {
          const data = await res.json();
          setGraphData(data);
          if (data.nodes && data.nodes.length > 0) {
            setSelectedEntity(data.nodes[0]);
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

  const rawNodes = graphData?.nodes || [];
  const rawEdges = graphData?.edges || [];

  const filteredNodes = rawNodes.filter((node: any) => {
    const matchesType = typeFilter === "ALL" || (node.data?.type || "").toUpperCase() === typeFilter.toUpperCase();
    const matchesSearch =
      (node.data?.label || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.data?.entityId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const nodeIds = new Set(filteredNodes.map((n: any) => n.id));
  const filteredEdges = rawEdges.filter((e: any) => nodeIds.has(e.source) && nodeIds.has(e.target));

  const selectedNodeData = selectedEntity?.data || {
    label: "Device D102",
    type: "Device",
    risk: "CRITICAL",
    entityId: "D102",
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
              GRAPH EXPLORER
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-red-500 border-red-500/30">
              {filteredNodes.length} Active Nodes
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
            Full-screen heterogeneous entity network inspection across customers, devices, IPs, and payment instruments.
          </p>
        </div>

        {/* Entity Type Filter Tabs */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-xs font-mono font-bold">
          {[
            { id: "ALL", label: "ALL" },
            { id: "CUSTOMER", label: "CUSTOMER" },
            { id: "DEVICE", label: "DEVICE" },
            { id: "IP", label: "IP" },
            { id: "PAYMENTINSTRUMENT", label: "PAYMENT" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTypeFilter(t.id)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer text-[10px] sm:text-xs font-bold ${
                typeFilter === t.id
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas & Inspector (12 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="rounded-3xl border border-border/60 shadow-md bg-card overflow-hidden">
            <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search entity (e.g. D102, C001)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-xs rounded-xl font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setSearchQuery(""); setTypeFilter("ALL"); }}
                  className="h-8 text-xs font-bold font-mono rounded-xl gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>RESET</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <InteractiveGraphCanvas
                nodes={filteredNodes}
                edges={filteredEdges}
                selectedNode={selectedEntity}
                onSelectNode={(node) => setSelectedEntity(node)}
                height={500}
              />

              {/* Bottom Legend */}
              <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between flex-wrap gap-3 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-foreground">LEGEND:</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-blue-400" /> Customer</span>
                  <span className="flex items-center gap-1"><Smartphone className="h-3.5 w-3.5 text-red-400" /> Device</span>
                  <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-purple-400" /> IP Address</span>
                  <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5 text-emerald-400" /> Payment</span>
                </div>
                <span className="text-[10px]">Animated lines = Active device usage</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right-Side Entity Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="rounded-3xl border border-border/60 bg-card p-5 space-y-4 font-mono text-xs shadow-xs">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                ENTITY INSPECTOR
              </span>
              <Badge variant="outline" className="text-[10px] uppercase font-bold">
                {selectedNodeData.type || "Device"}
              </Badge>
            </div>

            <div className="space-y-3">
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
                onClick={() => toast.info(`Viewing timeline for ${selectedNodeData.entityId || "D102"}`)}
                className="h-8 text-[10px] font-bold font-mono rounded-xl cursor-pointer"
              >
                [VIEW TIMELINE]
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.info(`Focus locked to ${selectedNodeData.entityId || "D102"}`)}
                className="h-8 text-[10px] font-bold font-mono rounded-xl cursor-pointer"
              >
                [FOCUS GRAPH]
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
