"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Share2,
  ShieldAlert,
  Users,
  CreditCard,
  Smartphone,
  Globe,
  DollarSign,
  ChevronRight,
  Filter,
  Search,
  CheckCircle2,
  Download,
  Ban,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AbuseRingsPage() {
  const [rings, setRings] = useState<any[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"risk" | "exposure" | "members">("risk");
  const [loading, setLoading] = useState(true);

  // Persistent isolation status map
  const [isolatedRings, setIsolatedRings] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("paypilot_isolated_rings");
      if (stored) {
        setIsolatedRings(JSON.parse(stored));
      }
    } catch {}

    async function fetchRings() {
      try {
        const res = await fetch("/api/rings");
        if (res.ok) {
          const data = await res.json();
          setRings(data.rings || []);
        }
      } catch (err) {
        console.error("Failed to load rings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRings();
  }, []);

  const handleIsolateToggle = (ringId: string, ringName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isolatedRings[ringId];
    const updated = { ...isolatedRings, [ringId]: nextState };
    setIsolatedRings(updated);
    try {
      localStorage.setItem("paypilot_isolated_rings", JSON.stringify(updated));
    } catch {}

    if (nextState) {
      toast.success(`Ring ${ringId} (${ringName}) ISOLATED! All accounts & hardware IDs blacklisted.`);
    } else {
      toast.info(`Ring ${ringId} isolation removed.`);
    }
  };

  const handleExportLedger = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rings, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `paypilot_abuse_rings_ledger_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Exported Abuse Rings Ledger (JSON)");
  };

  const filteredRings = rings
    .filter((r) => {
      const matchesSev = filterSeverity === "ALL" || r.severity === filterSeverity;
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.pattern_type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSev && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "risk") return b.risk_score - a.risk_score;
      if (sortBy === "exposure") return b.exposure - a.exposure;
      return b.accounts_count - a.accounts_count;
    });

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
              ABUSE RINGS QUEUE
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-rose-500 border-rose-500/30">
              {rings.length} Detected Syndicates
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
            Active coordinated syndicates, multi-account farms, and automated card-testing clusters.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter by Ring ID or Pattern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs rounded-xl w-48 sm:w-64 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-xs font-semibold">
            {["ALL", "CRITICAL", "HIGH"].map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-mono text-[11px] ${
                  filterSeverity === sev
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportLedger}
            className="h-8 px-3 text-xs font-bold rounded-xl gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Export Ledger</span>
          </Button>
        </div>
      </div>

      {/* Sorting Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
        <span>Showing {filteredRings.length} rings</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold">Sort By:</span>
          {[
            { id: "risk", label: "Risk Score" },
            { id: "exposure", label: "Exposure Value" },
            { id: "members", label: "Member Accounts" },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSortBy(s.id as any)}
              className={`px-2 py-0.5 rounded-md cursor-pointer text-[10px] font-bold ${
                sortBy === s.id ? "bg-rose-500/15 text-rose-500 border border-rose-500/30" : "hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* High-Density Investigation Table */}
      <Card className="rounded-3xl border border-border/60 shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                  <th className="py-3 px-4">Ring ID & Name</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Risk Score</th>
                  <th className="py-3 px-3">Evidence</th>
                  <th className="py-3 px-3">Members</th>
                  <th className="py-3 px-3">Txs</th>
                  <th className="py-3 px-3">Exposure</th>
                  <th className="py-3 px-3">Containment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-xs font-medium">
                {filteredRings.map((ring) => {
                  const isRingIsolated = !!isolatedRings[ring.id];

                  return (
                    <tr
                      key={ring.id}
                      className="hover:bg-muted/40 transition-colors group cursor-pointer"
                    >
                      {/* Ring ID & Name */}
                      <td className="py-4 px-4">
                        <Link href={`/investigations/${ring.id}`} className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0 group-hover:scale-105 transition-transform">
                            <Share2 className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-bold text-foreground block font-mono text-sm hover:underline">
                              {ring.id}
                            </span>
                            <span className="text-[11px] text-muted-foreground block truncate max-w-[240px]">
                              {ring.name}
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Severity */}
                      <td className="py-4 px-3">
                        <Badge
                          variant={ring.severity === "CRITICAL" ? "destructive" : "secondary"}
                          className="font-mono text-[10px] uppercase font-bold"
                        >
                          {ring.severity}
                        </Badge>
                      </td>

                      {/* Risk Score */}
                      <td className="py-4 px-3">
                        <span className="font-mono font-bold text-rose-500 text-sm">
                          {ring.risk_score} <span className="text-[10px] text-muted-foreground font-normal">/100</span>
                        </span>
                      </td>

                      {/* Evidence Strength */}
                      <td className="py-4 px-3">
                        <span className="font-mono font-bold text-emerald-500 text-xs">
                          {ring.evidence_strength}%
                        </span>
                      </td>

                      {/* Connected Members */}
                      <td className="py-4 px-3 font-mono text-[11px] text-muted-foreground">
                        <span>👤 {ring.accounts_count}</span> | <span>📱 {ring.devices_count}</span> | <span>🌐 {ring.ips_count}</span>
                      </td>

                      {/* Transactions */}
                      <td className="py-4 px-3 font-mono font-bold text-foreground">
                        {ring.transactions_count}
                      </td>

                      {/* Exposure */}
                      <td className="py-4 px-3 font-mono font-bold text-emerald-500">
                        ₹{ring.exposure >= 100000 ? `${(ring.exposure / 100000).toFixed(1)}L` : ring.exposure}
                      </td>

                      {/* Containment Status */}
                      <td className="py-4 px-3">
                        <Badge
                          variant={isRingIsolated ? "default" : "outline"}
                          className={`font-mono text-[10px] uppercase font-bold ${
                            isRingIsolated ? "bg-emerald-600 text-white" : "text-amber-500 border-amber-500/30"
                          }`}
                        >
                          {isRingIsolated ? "ISOLATED ✓" : "ACTIVE THREAT"}
                        </Badge>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant={isRingIsolated ? "secondary" : "destructive"}
                            onClick={(e) => handleIsolateToggle(ring.id, ring.name, e)}
                            className="h-7 text-[11px] font-bold rounded-xl gap-1 cursor-pointer"
                          >
                            {isRingIsolated ? (
                              <>
                                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                <span>Isolated</span>
                              </>
                            ) : (
                              <>
                                <Ban className="h-3 w-3" />
                                <span>Isolate</span>
                              </>
                            )}
                          </Button>

                          <Link href={`/investigations/${ring.id}`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs font-bold rounded-xl gap-1 shadow-xs">
                              <span>Details</span>
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
