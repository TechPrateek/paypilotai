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
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/session-provider";
import { toast } from "sonner";

export default function TransactionsPage() {
  const { data: session } = useAuth();
  const user = session?.user;
  const isMerchant = user?.role === "MERCHANT";

  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions?limit=100&filter=${filterType}&search=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
        setTotalCount(data.total || (data.transactions || []).length);
      }
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTransactions();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, filterType]);

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
              {isMerchant ? "ORDERS & PAYMENTS" : "TRANSACTION LEDGER"}
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-blue-500 border-blue-500/30">
              {totalCount} Total Records
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
            {isMerchant
              ? "All checkout transactions for TechMart India with automated fraud protection status."
              : "Search individual payment records and inspect their multi-hop graph relationship context."}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search TX-ID, Customer, Device, Ring..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs rounded-xl w-52 sm:w-72 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: "ALL", label: "All Records" },
              { id: "FLAGGED", label: "🚨 Blocked Rings" },
              { id: "CLEAN", label: "✓ Approved Clean" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-mono text-[11px] ${
                  filterType === f.id
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={loadTransactions}
            className="h-8 w-8 p-0 rounded-xl cursor-pointer"
            title="Refresh transactions"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Main Transactions Table */}
      <Card className="rounded-3xl border border-border/60 shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-3">Customer Name</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Payment Method</th>
                  <th className="py-3 px-3">Timestamp</th>
                  {!isMerchant && <th className="py-3 px-3">Device / IP</th>}
                  <th className="py-3 px-3">Protection Status</th>
                  <th className="py-3 px-3">{isMerchant ? "Dispute Shield" : "Related Ring"}</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-xs font-medium font-mono">
                {loading && transactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-muted-foreground font-mono text-xs">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-muted-foreground font-mono text-xs">
                      No matching transactions found for "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/40 transition-colors group">
                      {/* TX ID */}
                      <td className="py-3.5 px-4 font-bold text-foreground">
                        {tx.id}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-foreground block font-sans">
                          {tx.customerName || `Customer ${tx.customer_id}`}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          ID: {tx.customer_id}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-3 font-bold text-foreground text-sm">
                        ₹{Number(tx.amount).toLocaleString()}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-3">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {tx.paymentMethod || "UPI"}
                        </Badge>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-3 text-muted-foreground text-[11px]">
                        {tx.timestamp ? tx.timestamp.slice(0, 10) + " " + tx.timestamp.slice(11, 16) : "Aug 20, 10:01"}
                      </td>

                      {/* Hardware / IP (For Analyst & Admin) */}
                      {!isMerchant && (
                        <td className="py-3.5 px-3 text-muted-foreground text-[11px]">
                          <span>📱 {tx.device_id}</span>
                          <span className="block text-[10px] text-slate-400">🌐 {tx.ip_id}</span>
                        </td>
                      )}

                      {/* Protection Status */}
                      <td className="py-3.5 px-3">
                        <Badge
                          variant={tx.is_fraud ? "destructive" : "secondary"}
                          className={`font-mono text-[10px] uppercase font-bold ${
                            !tx.is_fraud ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : ""
                          }`}
                        >
                          {tx.is_fraud ? "FLAGGED ABUSE" : "APPROVED CLEAN"}
                        </Badge>
                      </td>

                      {/* Related Ring / Dispute Shield */}
                      <td className="py-3.5 px-3">
                        {tx.cluster_id && tx.cluster_id !== "LEGITIMATE_NORMAL" && tx.cluster_id !== "LEGITIMATE_OFFICE" && tx.cluster_id !== "LEGITIMATE_FAMILY" ? (
                          <Link href={`/investigations/${tx.cluster_id}`}>
                            <Badge variant="outline" className="font-mono text-[10px] text-rose-500 hover:underline border-rose-500/30 cursor-pointer">
                              {tx.cluster_id}
                            </Badge>
                          </Link>
                        ) : (
                          <span className="text-emerald-500 text-[11px] font-semibold">
                            ✓ Protected
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {isMerchant ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toast.success(`Receipt & Settlement verified for order ${tx.id}`)}
                            className="h-7 text-[11px] font-bold rounded-xl"
                          >
                            Verify Order
                          </Button>
                        ) : (
                          <Link href={tx.cluster_id ? `/investigations/${tx.cluster_id}` : `/graph`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs font-bold rounded-xl gap-1 hover:bg-rose-500/10 hover:text-rose-500">
                              <Share2 className="h-3 w-3 text-emerald-500" />
                              <span>View in Graph</span>
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
