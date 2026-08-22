"use client";

import { useState } from "react";
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
import { DEMO_SCENARIOS, DemoScenario } from "@/constants/demo-scenarios";
import { COUNTRIES } from "@/constants/countries";
import { CheckCircle, AlertTriangle, UserX, CreditCard, Zap, Globe, Sparkles, Shield, Clock } from "lucide-react";

const SCENARIO_ICONS: Record<string, any> = {
  CheckCircle,
  AlertTriangle,
  UserX,
  CreditCard,
  Zap,
  Globe,
};

export default function SimulatorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    amount: 85000,
    currency: "INR",
    paymentMethod: "CREDIT_CARD",
    country: "IN",
    isNewDevice: true,
    accountAgeDays: 2,
    previousFailedAttempts: 5,
    transactionsInLast5Min: 8,
    isDisposableEmail: false,
    isSuspiciousIp: false,
  });

  const loadScenario = (scenario: DemoScenario) => {
    setActiveScenario(scenario.name);
    setFormData({
      amount: scenario.input.amount,
      currency: scenario.input.currency,
      paymentMethod: scenario.input.paymentMethod,
      country: scenario.input.country,
      isNewDevice: scenario.input.isNewDevice,
      accountAgeDays: scenario.input.accountAgeDays,
      previousFailedAttempts: scenario.input.previousFailedAttempts,
      transactionsInLast5Min: scenario.input.transactionsInLast5Min,
      isDisposableEmail: scenario.input.isDisposableEmail,
      isSuspiciousIp: scenario.input.isSuspiciousIp,
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
          previousFailedAttempts: Number(formData.previousFailedAttempts),
          transactionsInLast5Min: Number(formData.transactionsInLast5Min),
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
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Fraud Simulator</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Simulate transactions against PayPilot AI's deterministic risk engine. Test pre-built attack vectors or customize signals.
        </p>
      </div>

      {/* Predefined Scenarios */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Predefined Attack & Risk Scenarios
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {DEMO_SCENARIOS.map((s) => {
            const Icon = SCENARIO_ICONS[s.icon] || Shield;
            const isSelected = activeScenario === s.name;
            return (
              <button
                key={s.name}
                onClick={() => loadScenario(s)}
                className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                    : "border-border bg-card hover:bg-accent/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 text-${s.color}-500`} />
                  <span className="font-semibold text-xs leading-tight">{s.name}</span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{s.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form & Results Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Form: 7 cols */}
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>Transaction Signals</CardTitle>
            <CardDescription>Configure the transaction attributes to evaluate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(v) => v && setFormData({ ...formData, currency: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(v) => v && setFormData({ ...formData, paymentMethod: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                    <SelectItem value="DEBIT_CARD">Debit Card</SelectItem>
                    <SelectItem value="NET_BANKING">Net Banking</SelectItem>
                    <SelectItem value="WALLET">Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Origin Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(v) => v && setFormData({ ...formData, country: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Account Age (Days)</Label>
                <Input
                  type="number"
                  value={formData.accountAgeDays}
                  onChange={(e) => setFormData({ ...formData, accountAgeDays: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Failed Attempts</Label>
                <Input
                  type="number"
                  value={formData.previousFailedAttempts}
                  onChange={(e) => setFormData({ ...formData, previousFailedAttempts: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tx in Last 5 Min</Label>
                <Input
                  type="number"
                  value={formData.transactionsInLast5Min}
                  onChange={(e) => setFormData({ ...formData, transactionsInLast5Min: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2 border-t">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isNewDevice}
                  onCheckedChange={(c) => setFormData({ ...formData, isNewDevice: c })}
                />
                <Label className="text-xs">New Device</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isDisposableEmail}
                  onCheckedChange={(c) => setFormData({ ...formData, isDisposableEmail: c })}
                />
                <Label className="text-xs">Disposable Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isSuspiciousIp}
                  onCheckedChange={(c) => setFormData({ ...formData, isSuspiciousIp: c })}
                />
                <Label className="text-xs">Suspicious IP</Label>
              </div>
            </div>

            <Button onClick={analyze} disabled={loading} className="w-full mt-4 h-11 text-base font-semibold">
              <Sparkles className="mr-2 h-5 w-5" />
              {loading ? "Evaluating Risk Engine..." : "Analyze Transaction"}
            </Button>
          </CardContent>
        </Card>

        {/* Right Output: 6 cols */}
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>Evaluation Results</CardTitle>
            <CardDescription>Deterministic score & explainable AI breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center p-4 bg-muted/40 rounded-xl border">
                  <RiskGauge score={result.riskScore} size={180} />
                  <div className="flex items-center gap-3 mt-4">
                    <RiskBadge level={result.riskLevel} />
                    <DecisionBadge decision={result.decision} />
                    {result.attackPattern && (
                      <Badge variant="destructive" className="animate-pulse">
                        {result.attackPattern}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {result.processingTimeMs}ms execution
                    </span>
                    <span>•</span>
                    <span>Anomaly Score: {result.anomalyScore}%</span>
                  </div>
                </div>

                {/* Risk Factors */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Contributing Risk Factors ({result.factors?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {result.factors && result.factors.length > 0 ? (
                      result.factors.map((f: any, idx: number) => (
                        <div key={idx} className="flex items-start justify-between p-2.5 rounded-lg border bg-card text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{f.name}</span>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {f.category}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">{f.explanation}</p>
                            {f.evidence && (
                              <p className="text-[11px] font-mono text-muted-foreground/80">{f.evidence}</p>
                            )}
                          </div>
                          <span className="font-bold text-destructive shrink-0 ml-2">
                            +{f.scoreContribution}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No high risk factors identified.</p>
                    )}
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Explainable AI Investigation Summary
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/90">
                    {result.aiExplanation || "Transaction conforms to standard risk parameters."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <Shield className="h-12 w-12 text-muted-foreground/40 mx-auto" />
                <h4 className="font-medium text-sm">No Analysis Run Yet</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Pick a scenario above or enter custom attributes, then click "Analyze Transaction" to run the risk engine.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
