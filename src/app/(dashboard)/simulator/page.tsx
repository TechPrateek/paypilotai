"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CircularMetricGauge } from "@/components/charts/circular-metric-gauge";
import { RiskGauge } from "@/components/dashboard/risk-gauge";
import { RiskBadge } from "@/components/dashboard/risk-badge";
import { DecisionBadge } from "@/components/dashboard/decision-badge";
import { ConfidenceGauge } from "@/components/dashboard/confidence-gauge";
import { StructuredEvidencePanel } from "@/components/transactions/structured-evidence-panel";
import { DEMO_SCENARIOS, DemoScenario } from "@/constants/demo-scenarios";
import { COUNTRIES } from "@/constants/countries";
import {
  CheckCircle,
  AlertTriangle,
  UserX,
  CreditCard,
  Zap,
  Globe,
  Sparkles,
  Shield,
  Clock,
  UserCheck,
  Smartphone,
  RefreshCw,
  ShieldAlert,
  Cpu,
  Layers,
  Activity,
  Share2,
  DollarSign,
  ChevronDown,
  Edit2,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function SimulatorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>("1. Regular Returning Customer");

  const [formData, setFormData] = useState({
    amount: 2400,
    currency: "USD",
    paymentMethod: "UPI",
    country: "US",
    isNewDevice: false,
    isNewIp: false,
    accountAgeDays: 380,
    customerTotalTransactions: 42,
    previousFailedAttempts: 0,
    transactionsInLast5Min: 0,
    paymentInstrumentSwitchCount: 0,
    isProxyIp: false,
    isVpnIp: false,
    isTorIp: false,
    isSuspiciousIp: false,
    isDisposableEmail: false,
  });

  const loadScenario = (scenario: DemoScenario) => {
    setActiveScenario(scenario.name);
    setFormData({
      amount: scenario.input.amount,
      currency: "USD",
      paymentMethod: scenario.input.paymentMethod,
      country: scenario.input.country,
      isNewDevice: scenario.input.isNewDevice,
      isNewIp: scenario.input.isNewIp || false,
      accountAgeDays: scenario.input.accountAgeDays,
      customerTotalTransactions: scenario.input.customerTotalTransactions,
      previousFailedAttempts: scenario.input.previousFailedAttempts,
      transactionsInLast5Min: scenario.input.transactionsInLast5Min,
      paymentInstrumentSwitchCount: scenario.input.paymentInstrumentSwitchCount || 0,
      isProxyIp: scenario.input.isProxyIp || false,
      isVpnIp: scenario.input.isVpnIp || false,
      isTorIp: scenario.input.isTorIp || false,
      isSuspiciousIp: scenario.input.isSuspiciousIp,
      isDisposableEmail: scenario.input.isDisposableEmail,
    });
  };

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/simulator/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          accountAgeDays: Number(formData.accountAgeDays),
          customerTotalTransactions: Number(formData.customerTotalTransactions),
          previousFailedAttempts: Number(formData.previousFailedAttempts),
          transactionsInLast5Min: Number(formData.transactionsInLast5Min),
          paymentInstrumentSwitchCount: Number(formData.paymentInstrumentSwitchCount),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        const err = await res.json();
        console.error("Simulation error:", err);
      }
    } catch (error) {
      console.error("Error analyzing simulation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-3 sm:p-5 md:p-8 max-w-[1600px] mx-auto">
      {/* 🌟 Simulation Benchmark Card (Matching Image 2) */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md bg-card overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background border border-border/60 shadow-xs">
              <span className="font-bold text-xs sm:text-sm text-foreground">Simulation - 67889</span>
              <Edit2 className="h-3 w-3 text-muted-foreground" />
            </div>

            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1.5 rounded-xl">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>View Simulations</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => toast.success("Simulation model applied to live pipeline!")}
              className="h-8 px-4 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-xs"
            >
              Apply
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* 5 Circular Metric Donut Gauges Row (Matching Image 2) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center py-2 border-b border-border/40 pb-6">
            <CircularMetricGauge
              percentage={97.31}
              label="Approvals"
              trend="10.25%"
              trendDirection="down"
              color="#10B981"
            />
            <CircularMetricGauge
              percentage={0.62}
              label="Rejections"
              trend="1.01%"
              trendDirection="down"
              color="#F43F5E"
            />
            <CircularMetricGauge
              percentage={0.10}
              label="Claims / Chargebacks"
              trend="0.08%"
              trendDirection="down"
              color="#B91C1C"
            />
            <CircularMetricGauge
              percentage={0.72}
              label="Issuer declines"
              trend="8.34%"
              trendDirection="down"
              color="#1E293B"
            />
            <CircularMetricGauge
              percentage={1.25}
              label="Review"
              trend="0.84%"
              trendDirection="down"
              color="#3B82F6"
            />
          </div>

          {/* Bottom Financial Volume Impact Stats (Matching Image 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-border/40 pt-1">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground block">
                Total Payment Volume
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-foreground font-mono">
                $6,223.40
              </div>
              <div className="inline-block h-1.5 w-12 rounded-full bg-rose-500/80" />
            </div>

            <div className="space-y-1 pt-3 sm:pt-0">
              <span className="text-xs font-semibold text-muted-foreground block">
                Total Chargeback
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-foreground font-mono">
                $567.45
              </div>
              <div className="inline-block h-1.5 w-12 rounded-full bg-emerald-500/80" />
            </div>

            <div className="space-y-1 pt-3 sm:pt-0">
              <span className="text-xs font-semibold text-muted-foreground block">
                Total Issuer Decline
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-foreground font-mono">
                $0.01
              </div>
              <div className="inline-block h-1.5 w-12 rounded-full bg-emerald-500/80" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulator Section Header */}
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight">Fraud-Spike & Bot Simulator</h2>
          <Badge variant="secondary" className="font-mono text-xs bg-primary/10 text-primary border-primary/20">
            Interactive Tester
          </Badge>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
          Simulate rapid card testing, velocity spikes, and "New ≠ Fraud" false-positive protection scenarios.
        </p>
      </div>

      {/* Sample Scenarios Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEMO_SCENARIOS.slice(0, 4).map((scenario) => {
          const isSelected = activeScenario === scenario.name;
          return (
            <Card
              key={scenario.name}
              className={`cursor-pointer transition-all duration-150 rounded-2xl hover:shadow-md border ${
                isSelected
                  ? "border-primary ring-1 ring-primary bg-primary/5 shadow-xs"
                  : "border-border/60 hover:border-primary/50"
              }`}
              onClick={() => loadScenario(scenario)}
            >
              <CardContent className="p-4 space-y-1.5">
                <span className="font-bold text-xs text-foreground block">
                  {scenario.name}
                </span>
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  {scenario.description}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px]">
                  <span className="text-muted-foreground font-medium">Expected:</span>
                  <Badge
                    variant={scenario.expectedDecision === "BLOCK" ? "destructive" : scenario.expectedDecision === "REVIEW" ? "secondary" : "outline"}
                    className="text-[10px] py-0 px-1.5 h-4 font-normal"
                  >
                    {scenario.expectedDecision}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Simulator Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" /> Order Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <Label className="text-xs">Order Amount ($)</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="h-8 text-xs font-mono rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Payment Method</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(val) => setFormData({ ...formData, paymentMethod: val || "Credit Card" })}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="UPI">UPI / VPA</SelectItem>
                      <SelectItem value="Apple Pay">Apple Pay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Customer Past Orders</Label>
                  <Input
                    type="number"
                    value={formData.customerTotalTransactions}
                    onChange={(e) => setFormData({ ...formData, customerTotalTransactions: Number(e.target.value) })}
                    className="h-8 text-xs font-mono rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Attempts in Last 5 Min</Label>
                  <Input
                    type="number"
                    value={formData.transactionsInLast5Min}
                    onChange={(e) => setFormData({ ...formData, transactionsInLast5Min: Number(e.target.value) })}
                    className="h-8 text-xs font-mono rounded-xl"
                  />
                </div>
              </div>

              {/* Switches */}
              <div className="pt-2 border-t border-border/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-normal">New Device / Phone</Label>
                  <Switch
                    checked={formData.isNewDevice}
                    onCheckedChange={(val) => setFormData({ ...formData, isNewDevice: val })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-normal">Tor / Proxy Network</Label>
                  <Switch
                    checked={formData.isTorIp || formData.isProxyIp}
                    onCheckedChange={(val) => setFormData({ ...formData, isTorIp: val, isProxyIp: val })}
                  />
                </div>
              </div>

              <Button
                onClick={analyze}
                disabled={loading}
                className="w-full h-9 font-bold text-xs rounded-xl shadow-xs mt-2"
              >
                {loading ? "Evaluating Safety..." : "Run Risk Analysis →"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Live Decision Result */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>AI Decision Engine Output</span>
                {result && (
                  <Badge variant="outline" className="font-mono text-xs">
                    {result.processingTimeMs || 12}ms
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {result ? (
                <>
                  <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-2xl border border-border/40">
                    <RiskGauge score={result.riskScore} size={150} />
                    <div className="flex items-center gap-3 mt-3">
                      <RiskBadge level={result.riskScore >= 80 ? "CRITICAL" : result.riskScore >= 60 ? "HIGH" : result.riskScore >= 30 ? "MEDIUM" : "LOW"} />
                      <DecisionBadge decision={result.decision} />
                    </div>
                  </div>

                  {result.evidence && (
                    <StructuredEvidencePanel evidenceList={result.evidence} />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[260px] text-center text-muted-foreground">
                  <Shield className="h-10 w-10 mb-2 opacity-30 text-primary" />
                  <p className="text-xs font-semibold text-foreground">Ready to test order safety</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
