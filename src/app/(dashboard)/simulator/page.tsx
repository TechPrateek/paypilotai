"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RiskGauge } from "@/components/dashboard/risk-gauge";
import { RiskBadge } from "@/components/dashboard/risk-badge";
import { DecisionBadge } from "@/components/dashboard/decision-badge";
import { ConfidenceGauge } from "@/components/dashboard/confidence-gauge";
import { StructuredEvidencePanel } from "@/components/transactions/structured-evidence-panel";
import { DEMO_SCENARIOS, DemoScenario } from "@/constants/demo-scenarios";
import {
  CreditCard,
  Zap,
  Shield,
  Clock,
  Smartphone,
  ShieldAlert,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function SimulatorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>("1. Regular Returning Customer");

  const [formData, setFormData] = useState({
    amount: 120,
    currency: "USD",
    paymentMethod: "Credit Card",
    country: "US",
    isNewDevice: false,
    isNewIp: false,
    accountAgeDays: 180,
    customerTotalTransactions: 15,
    previousFailedAttempts: 0,
    transactionsInLast5Min: 1,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Fraud-Spike Detector
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-blue-500 border-blue-500/30">
              Velocity Guard Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
            Monitors rapid card-testing bot attacks, sliding-window velocity bursts, and protects first-time buyers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-bold shadow-xs">
            <Zap className="h-3.5 w-3.5" />
            <span>5-Min Velocity Limiter Active</span>
          </div>
        </div>
      </div>

      {/* 3 Live Velocity Health Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                CURRENT PAYMENT VELOCITY
              </span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">1.2 tx / min</div>
              <p className="text-xs font-semibold text-emerald-500 mt-1">Normal Safe Range (&lt; 5.0)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                CARD-TESTING BOTS BLOCKED
              </span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">14 Attempts</div>
              <p className="text-xs font-semibold text-rose-500 mt-1">100% Bot Spikes Mitigated</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs bg-card">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                "NEW ≠ FRAUD" PROTECTION
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground font-mono">100% Safe</div>
              <p className="text-xs font-semibold text-emerald-500 mt-1">Zero First-Time Buyers Blocked</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4 Clickable Scenarios */}
      <div>
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 px-1">
          Click any scenario to test how the Fraud-Spike Detector handles it:
        </span>
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
                    <span className="text-muted-foreground font-medium">Expected Result:</span>
                    <Badge
                      variant={scenario.expectedDecision === "BLOCK" ? "destructive" : scenario.expectedDecision === "REVIEW" ? "secondary" : "outline"}
                      className="text-[10px] py-0 px-1.5 h-4 font-bold"
                    >
                      {scenario.expectedDecision}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Interactive Simulator Grid: Left Form / Right Decision Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" /> Test Order Parameters
              </CardTitle>
              <CardDescription className="text-xs">
                Adjust order amount, velocity attempts, and customer history
              </CardDescription>
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
                  <Label className="text-xs">Customer's Past Orders</Label>
                  <Input
                    type="number"
                    value={formData.customerTotalTransactions}
                    onChange={(e) => setFormData({ ...formData, customerTotalTransactions: Number(e.target.value) })}
                    className="h-8 text-xs font-mono rounded-xl"
                    placeholder="0 for First-Time Buyer"
                  />
                  <span className="text-[10px] text-muted-foreground">0 = First-Time Buyer (Protected)</span>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Attempts in Last 5 Min</Label>
                  <Input
                    type="number"
                    value={formData.transactionsInLast5Min}
                    onChange={(e) => setFormData({ ...formData, transactionsInLast5Min: Number(e.target.value) })}
                    className="h-8 text-xs font-mono rounded-xl"
                  />
                  <span className="text-[10px] text-muted-foreground">&gt; 10 = Velocity Bot Spike</span>
                </div>
              </div>

              {/* Switches */}
              <div className="pt-2 border-t border-border/40 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-normal">Customer on a New Phone / Laptop</Label>
                    <p className="text-[10px] text-muted-foreground">Weak signal: Never blocked on its own</p>
                  </div>
                  <Switch
                    checked={formData.isNewDevice}
                    onCheckedChange={(val) => setFormData({ ...formData, isNewDevice: val })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-normal">Hidden Location (Tor / Proxy Network)</Label>
                    <p className="text-[10px] text-muted-foreground">Masked IP network</p>
                  </div>
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
                {loading ? "Checking Order Safety..." : "Test Payment Safety →"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Live Decision Result (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>AI Decision Engine Output</span>
                {result && (
                  <Badge variant="outline" className="font-mono text-xs">
                    {result.processingTimeMs || 12}ms analysis
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

                  {/* Expected Business Loss Reasoning */}
                  {result.expectedCosts && (
                    <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-primary" /> Cost-Aware Expected Loss
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">C_FP: $450 | C_FN: $4,500</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2 rounded-lg bg-background/90 border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">Loss if Approved</span>
                          <span className="font-bold text-rose-500 font-mono">
                            ${result.expectedCosts.approveExpectedLoss.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-background/90 border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">Loss if Blocked</span>
                          <span className="font-bold text-amber-500 font-mono">
                            ${result.expectedCosts.blockExpectedLoss.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Evidence Breakdown */}
                  {result.evidence && (
                    <StructuredEvidencePanel evidenceList={result.evidence} />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[260px] text-center text-muted-foreground">
                  <Shield className="h-10 w-10 mb-2 opacity-30 text-primary" />
                  <p className="text-xs font-semibold text-foreground">Ready to test order safety</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
                    Choose one of the sample scenarios above or enter order parameters to run the velocity test.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
