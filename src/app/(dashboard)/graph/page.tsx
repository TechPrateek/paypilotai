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
  ShieldCheck,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InteractiveGraphCanvas } from "@/components/graph/interactive-graph-canvas";
import { toast } from "sonner";

export default function GraphExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [graphData, setGraphData] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [blacklistedNodes, setBlacklistedNodes] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("paypilot_blacklisted_nodes");
      if (stored) setBlacklistedNodes(JSON.parse(stored));
    } catch {}

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

  const handleToggleBlacklist = (nodeId: string) => {
    const nextState = !blacklistedNodes[nodeId];
    const updated = { ...blacklistedNodes, [nodeId]: nextState };
    setBlacklistedNodes(updated);
    try {
      localStorage.setItem("paypilot_blacklisted_nodes", JSON.stringify(updated));
    } catch {}

    if (nextState) {
      toast.success(`Entity ${nodeId} added to global blacklist.`);
    } else {
      toast.info(`Entity ${nodeId} removed from blacklist.`);
    }
  };

  const handleExportGraph = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graphData || {}, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `paypilot_entity_graph_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Exported Heterogeneous Graph Topology (JSON)");
  };

  // Filter nodes according to selectedType & searchQuery
  const filteredNodes = (graphData?.nodes || []).filter((n: any) => {
    const matchesType = selectedType === "ALL" || n.type === selectedType;
    const matchesSearch =
      n.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

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
              {filteredNodes.length} Visible Nodes
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
            onClick={handleExportGraph}
            className="h-8 px-3 text-xs font-bold rounded-xl gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-emerald-500" />
            <span>Export Graph</span>
          </Button>
        </div>
      </div>

      {/* Entity Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-2xl w-fit text-xs font-semibold overflow-x-auto">
        {[
          { id: "ALL", label: "All Entities" },
          { id: "CUSTOMER", label: "👤 Customers" },
          { id: "DEVICE", label: "📱 Devices" },
          { id: "IP", label: "🌐 Gateway IPs" },
          { id: "PAYMENT", label: "💳 Card BINs" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedType(tab.id)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-mono text-[11px] ${
              selectedType === tab.id
                ? "bg-background text-foreground shadow-xs font-bold border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Full-Screen Graph Canvas (Split with Entity Inspector) */}
      <Card className="rounded-3xl border border-border/60 shadow-md bg-card overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Animated Graph Canvas (8 cols) */}
            <div className="lg:col-span-8">
              <InteractiveGraphCanvas
                nodes={filteredNodes}
                edges={graphData?.edges || []}
                onSelectNode={(node) => setSelectedNode(node)}
              />
            </div>

            {/* Entity Inspector Side Panel (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="text-xs font-bold font-mono text-muted-foreground uppercase">
                    Selected Entity Inspector
                  </span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {selectedNode?.type || "DEVICE"}
                  </Badge>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-bold">Node ID</span>
                    <span className="font-bold text-foreground text-sm">{selectedNode?.id || "D102"}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block font-bold">Description</span>
                    <span className="font-bold text-foreground">{selectedNode?.label || "Hardware Laptop (Windows 11)"}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block font-bold">Blacklist Status</span>
                    {blacklistedNodes[selectedNode?.id || "D102"] ? (
                      <Badge variant="destructive" className="font-mono text-[10px] uppercase font-bold mt-1">
                        BLACKLISTED ✗
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="font-mono text-[10px] uppercase font-bold mt-1 text-emerald-500 border-emerald-500/30">
                        ACTIVE / CLEAN ✓
                      </Badge>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block font-bold">Syndicate Ring</span>
                    <Link href="/investigations/RING-0042">
                      <span className="text-rose-500 font-bold hover:underline cursor-pointer">
                        RING-0042 (84 txs) →
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 space-y-2">
                  <Button
                    size="sm"
                    variant={blacklistedNodes[selectedNode?.id || "D102"] ? "secondary" : "destructive"}
                    onClick={() => handleToggleBlacklist(selectedNode?.id || "D102")}
                    className="w-full text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {blacklistedNodes[selectedNode?.id || "D102"] ? (
                      <>
                        <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                        <span>Remove from Blacklist</span>
                      </>
                    ) : (
                      <>
                        <Ban className="h-3.5 w-3.5 mr-1" />
                        <span>Blacklist This Entity</span>
                      </>
                    )}
                  </Button>

                  <Link href="/investigations/RING-0042" className="block">
                    <Button size="sm" variant="outline" className="w-full text-xs font-bold rounded-xl">
                      <span>Open Syndicate Dossier →</span>
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
