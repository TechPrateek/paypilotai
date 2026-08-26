"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Search,
  Share2,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Globe,
  CheckCircle,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await fetch("/api/rings/RING-0042/transactions");
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
    const matchesFilter =
      filterType === "ALL" ? true : filterType === "FLAGGED" ? tx.is_fraud : !tx.is_fraud;
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.device_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
              TRANSACTION LEDGER
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-blue-500 border-blue-500/30">
              Graph Context Enabled
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
            Search individual payment records and jump directly to their relational graph context.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search TX-ID, Customer, Device..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs rounded-xl w-48 sm:w-64 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-xs font-semibold">
            {["ALL", "FLAGGED", "CLEAN"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilterType(f)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-mono text-[11px] ${
                  filterType === f
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <Card className="rounded-3xl border border-border/60 shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Device ID</th>
                  <th className="py-3 px-3">IP Address</th>
                  <th className="py-3 px-3">Related Ring</th>
                  <th className="py-3 px-3">Risk Status</th>
                  <th className="py-3 px-4 text-right">Graph Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-xs font-medium font-mono">
                {filteredTxs.slice(0, 30).map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {tx.id}
                    </td>
                    <td className="py-3.5 px-3 text-muted-foreground">
                      {tx.customer_id}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-foreground">
                      ₹{tx.amount}
                    </td>
                    <td className="py-3.5 px-3 text-muted-foreground text-[11px]">
                      {tx.timestamp.slice(11, 19)}
                    </td>
                    <td className="py-3.5 px-3 text-muted-foreground">
                      {tx.device_id}
                    </td>
                    <td className="py-3.5 px-3 text-muted-foreground">
                      {tx.ip_id}
                    </td>
                    <td className="py-3.5 px-3">
                      <Link href={`/investigations/${tx.cluster_id}`}>
                        <Badge variant="outline" className="font-mono text-[10px] text-rose-500 hover:underline">
                          {tx.cluster_id}
                        </Badge>
                      </Link>
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge
                        variant={tx.is_fraud ? "destructive" : "secondary"}
                        className="font-mono text-[10px] uppercase font-bold"
                      >
                        {tx.is_fraud ? "FLAGGED RING" : "CLEAN"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/investigations/${tx.cluster_id}`}>
                        <Button size="sm" variant="outline" className="h-7 text-xs font-bold rounded-xl gap-1">
                          <Share2 className="h-3 w-3 text-emerald-500" />
                          <span>View in Graph</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
