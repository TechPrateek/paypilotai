"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Search,
  Filter,
  Share2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Layers,
  Smartphone,
  Globe,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SeverityBadge } from "@/components/sentinel/severity-badge";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterRing, setFilterRing] = useState<string>("ALL");
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await fetch("/api/transactions?limit=100");
        if (res.ok) {
          const data = await res.json();
          setTransactions(data.transactions || []);
        }
      } catch (err) {
        console.error("Failed to load transactions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const filteredTxs = transactions.filter((tx) => {
    const ring = tx.cluster_id || tx.metadata?.ring_id || (tx.riskAssessment?.riskScore >= 80 ? "RING-0042" : "CLEAN");
    const matchesRing = filterRing === "ALL" || (filterRing === "RING" ? ring !== "CLEAN" : ring === "CLEAN");
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      tx.id.toLowerCase().includes(searchLower) ||
      (tx.customer?.name || tx.customer_id || "").toLowerCase().includes(searchLower) ||
      (tx.deviceId || tx.device_id || "").toLowerCase().includes(searchLower) ||
      (tx.ip || tx.ip_id || "").toLowerCase().includes(searchLower);
    return matchesRing && matchesSearch;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
              TRANSACTIONS
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-red-500 border-red-500/30">
              {filteredTxs.length} Correlated Records
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
            Correlated payment records linked to detected abuse patterns.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search transaction, customer, device..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs rounded-xl w-60 sm:w-72 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-xs font-mono font-bold">
            {[
              { id: "ALL", label: "ALL" },
              { id: "RING", label: "RING LINKED" },
              { id: "CLEAN", label: "CLEAN" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilterRing(t.id)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer text-[10px] sm:text-xs font-bold ${
                  filterRing === t.id
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <Card className="rounded-3xl border border-border/60 shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-border/40 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Device</th>
                  <th className="py-3 px-3">IP Address</th>
                  <th className="py-3 px-3">Risk</th>
                  <th className="py-3 px-3">Ring</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 font-medium">
                {filteredTxs.slice(0, 50).map((tx) => {
                  const score = tx.riskAssessment?.riskScore || tx.risk_score || (tx.cluster_id ? 91 : 12);
                  const ringId = tx.cluster_id || (score >= 80 ? "RING-0042" : "—");
                  const customerName = tx.customer?.name || tx.customer_id || "Customer C001";
                  const deviceId = tx.deviceId || tx.device_id || "D102";
                  const ipAddress = tx.ip || tx.ip_id || "185.220.101.45";
                  const time = tx.createdAt ? new Date(tx.createdAt).toLocaleTimeString() : (tx.timestamp ? tx.timestamp.slice(11, 19) : "10:01:02");

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-muted/40 transition-colors cursor-pointer group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-bold text-foreground">
                        {tx.id.slice(0, 14)}...
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-3 font-bold text-foreground">
                        ₹{Number(tx.amount || 4500).toLocaleString()}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-3 text-muted-foreground flex items-center gap-1.5 pt-4">
                        <Users className="h-3 w-3 text-blue-400 shrink-0" />
                        <span>{customerName}</span>
                      </td>

                      {/* Device */}
                      <td className="py-3.5 px-3 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Smartphone className="h-3 w-3 text-red-400 shrink-0" />
                          <span>{deviceId}</span>
                        </span>
                      </td>

                      {/* IP */}
                      <td className="py-3.5 px-3 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3 text-purple-400 shrink-0" />
                          <span>{ipAddress}</span>
                        </span>
                      </td>

                      {/* Risk */}
                      <td className="py-3.5 px-3">
                        <span className={`font-bold ${score >= 80 ? "text-red-500" : score >= 60 ? "text-orange-500" : "text-emerald-500"}`}>
                          {score} / 100
                        </span>
                      </td>

                      {/* Ring */}
                      <td className="py-3.5 px-3">
                        {ringId !== "—" ? (
                          <Link href={`/investigations/${ringId}`} className="hover:underline">
                            <Badge variant="destructive" className="font-mono text-[9px] px-1.5 py-0">
                              {ringId}
                            </Badge>
                          </Link>
                        ) : (
                          <span className="text-muted-foreground text-[10px]">None</span>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-3 text-muted-foreground text-[11px]">
                        {time}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Link href="/graph">
                          <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold font-mono rounded-xl gap-1 cursor-pointer">
                            <Share2 className="h-3 w-3 text-red-500" />
                            <span>[VIEW IN GRAPH]</span>
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
