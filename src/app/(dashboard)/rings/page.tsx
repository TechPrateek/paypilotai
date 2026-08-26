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
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SeverityBadge } from "@/components/sentinel/severity-badge";
import { toast } from "sonner";

export default function AbuseRingsPage() {
  const [rings, setRings] = useState<any[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"risk" | "exposure" | "entities">("risk");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const filteredRings = rings
    .filter((r) => {
      const matchesSev = filterSeverity === "ALL" || r.severity === filterSeverity;
      const matchesStatus = filterStatus === "ALL" || (r.status || "UNDER REVIEW").includes(filterStatus);
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.pattern_type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSev && matchesStatus && matchesSearch;
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
              ABUSE RINGS
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-red-500 border-red-500/30">
              {rings.length} Detected Rings
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
            Detected groups of entities exhibiting coordinated payment-abuse behavior.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search ring ID, pattern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs rounded-xl w-48 sm:w-64 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-xs font-mono font-bold">
            {["ALL", "CRITICAL", "HIGH"].map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer text-[11px] ${
                  filterSeverity === sev
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sorting Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
        <span>Showing {filteredRings.length} detected rings</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold">Sort By:</span>
          {[
            { id: "risk", label: "Risk Score" },
            { id: "exposure", label: "Exposure" },
            { id: "entities", label: "Entities" },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSortBy(s.id as any)}
              className={`px-2 py-0.5 rounded-md cursor-pointer text-[10px] font-bold ${
                sortBy === s.id ? "bg-red-500/15 text-red-500 border border-red-500/30" : "hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Abuse Rings Ledger Table */}
      <Card className="rounded-3xl border border-border/60 shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-border/40 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                  <th className="py-3 px-4">Ring ID</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Risk</th>
                  <th className="py-3 px-3">Entities</th>
                  <th className="py-3 px-3">Transactions</th>
                  <th className="py-3 px-3">Exposure</th>
                  <th className="py-3 px-3">Evidence</th>
                  <th className="py-3 px-3">First Seen</th>
                  <th className="py-3 px-3">Last Seen</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 font-medium">
                {filteredRings.map((ring) => {
                  const firstSeen = ring.first_seen || "10:01";
                  const lastSeen = ring.last_seen || "10:08";
                  const status = ring.status || "UNDER REVIEW";

                  return (
                    <tr
                      key={ring.id}
                      className="hover:bg-muted/40 transition-colors group cursor-pointer"
                    >
                      {/* Ring ID */}
                      <td className="py-4 px-4 font-bold text-foreground">
                        <Link href={`/investigations/${ring.id}`} className="hover:underline flex items-center gap-2">
                          <Share2 className="h-3.5 w-3.5 text-red-500 shrink-0" />
                          <span>{ring.id}</span>
                        </Link>
                      </td>

                      {/* Severity */}
                      <td className="py-4 px-3">
                        <SeverityBadge severity={ring.severity} />
                      </td>

                      {/* Risk */}
                      <td className="py-4 px-3 font-bold text-red-500 text-sm">
                        {ring.risk_score}
                      </td>

                      {/* Entities */}
                      <td className="py-4 px-3 text-foreground">
                        {ring.accounts_count}
                      </td>

                      {/* Transactions */}
                      <td className="py-4 px-3 text-foreground">
                        {ring.transactions_count}
                      </td>

                      {/* Exposure */}
                      <td className="py-4 px-3 font-bold text-emerald-500">
                        ₹{ring.exposure >= 100000 ? `${(ring.exposure / 100000).toFixed(1)}L` : ring.exposure}
                      </td>

                      {/* Evidence Strength */}
                      <td className="py-4 px-3 text-emerald-500 font-bold">
                        {ring.evidence_strength}%
                      </td>

                      {/* First Seen */}
                      <td className="py-4 px-3 text-muted-foreground text-[11px]">
                        {firstSeen}
                      </td>

                      {/* Last Seen */}
                      <td className="py-4 px-3 text-muted-foreground text-[11px]">
                        {lastSeen}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3">
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px] uppercase font-bold text-amber-500 border-amber-500/30"
                        >
                          {status}
                        </Badge>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <Link href={`/investigations/${ring.id}`}>
                          <Button size="sm" className="h-7 text-xs font-bold font-mono rounded-xl gap-1 shadow-xs cursor-pointer">
                            <span>Inspect</span>
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </Link>
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
