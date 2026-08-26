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
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const SCENARIO_ICONS: Record<string, any> = {
  CheckCircle,
  AlertTriangle,
  UserX,
  CreditCard,
  Zap,
  Globe,
  UserCheck,
  Smartphone,
  RefreshCw,
  ShieldAlert,
};

export default function SimulatorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>("1. Regular Returning Customer");

  const [formData, setFormData] = useState({
    amount: 2400,
    currency: "INR",
    paymentMethod: "UPI",
    country: "IN",
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
      currency: scenario.input.currency,
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
    <div className="space-y-6 p-2 sm:p-4 md:p-8">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Payment Risk Simulator</h2>
          <Badge variant="secondary" className="font-mono text-xs bg-primary/10 text-primary border-primary/20">
            Interactive Tester
          </Badge>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
          Test how PayPilot AI evaluates real customer orders with False-Positive Protection, Cost-Aware Decisioning, and Abuse-Ring Scoring.
        </p>
      </div>

      {/* FinTech Core Scenarios */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
          Common Customer Situations (Click to test)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEMO_SCENARIOS.map((scenario) => {
            const Icon = SCENARIO_ICONS[scenario.icon] || Shield;
            const isSelected = activeScenario === scenario.name;

            return (
              <Card
                key={scenario.name}
                className={`cursor-pointer transition-all duration-150 hover:shadow-md border ${
                  isSelected
                    ? "border-primary ring-1 ring-primary bg-primary/5 shadow-sm"
                    : "border-border/60 hover:border-primary/50"
                }`}
                onClick={() => loadScenario(scenario)}
              >
                <CardContent className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-muted/60">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-semibold text-xs text-foreground leading-tight">
                        {scenario.name}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {scenario.description}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px]">
                    <span className="text-muted-foreground font-medium">Expected Result:</span>
                    <Badge
                      variant={scenario.expectedDecision === "BLOCK" ? "destructive" : scenario.expectedDecision === "REVIEW" ? "secondary" : "outline"}
                      className="text-[10px] py-0 px-1.5 h-4 font-normal"
                    >
                      {scenario.expectedDecision} • {scenario.expectedConfidence}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Simulator Interface: Left Form / Right Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Order Signals (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="p-4 sm:p-5 pb-3 bg-muted/20 border-b border-border/40">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" /> Order & Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Order Amount</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="h-8 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(val) => setFormData({ ...formData, currency: val || "INR" })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Payment Method</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(val) => setFormData({ ...formData, paymentMethod: val || "UPI" })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPI">UPI / VPA</SelectItem>
                      <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                      <SelectItem value="DEBIT_CARD">Debit Card</SelectItem>
                      <SelectItem value="NET_BANKING">Net Banking</SelectItem>
                      <SelectItem value="WALLET">Digital Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Customer Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(val) => setFormData({ ...formData, country: val || "IN" })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.slice(0, 10).map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name} ({c.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Customer's Past Orders</Label>
                  <Input
                    type="number"
                    value={formData.customerTotalTransactions}
                    onChange={(e) => setFormData({ ...formData, customerTotalTransactions: Number(e.target.value) })}
                    className="h-8 text-xs font-mono"
                    placeholder="0 for First-Time Buyer"
                  />
                  <span className="text-[10px] text-muted-foreground">0 = First-Time Buyer (False Positive Guard Active)</span>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Account Age (in Days)</Label>
                  <Input
                    type="number"
                    value={formData.accountAgeDays}
                    onChange={(e) => setFormData({ ...formData, accountAgeDays: Number(e.target.value) })}
                    className="h-8 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Past Payment Failures</Label>
                  <Input
                    type="number"
                    value={formData.previousFailedAttempts}
                    onChange={(e) => setFormData({ ...formData, previousFailedAttempts: Number(e.target.value) })}
                    className="h-8 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Payment Attempts in Last 5 Min</Label>
                  <Input
                    type="number"
                    value={formData.transactionsInLast5Min}
                    onChange={(e) => setFormData({ ...formData, transactionsInLast5Min: Number(e.target.value) })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Contextual Toggle Switches */}
              <div className="pt-2 border-t border-border/40 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-normal">Customer on a New Phone / Computer</Label>
                    <p className="text-[11px] text-muted-foreground">Weak signal: Never blocked alone</p>
                  </div>
                  <Switch
                    checked={formData.isNewDevice}
                    onCheckedChange={(val) => setFormData({ ...formData, isNewDevice: val })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-normal">Hidden IP Address / VPN / Proxy</Label>
                    <p className="text-[11px] text-muted-foreground">Internet location masked or hidden</p>
                  </div>
                  <Switch
                    checked={formData.isTorIp || formData.isProxyIp}
                    onCheckedChange={(val) => setFormData({ ...formData, isTorIp: val, isProxyIp: val })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-normal">Temporary / Fake Email Address</Label>
                    <p className="text-[11px] text-muted-foreground">Disposable email inbox service</p>
                  </div>
                  <Switch
                    checked={formData.isDisposableEmail}
                    onCheckedChange={(val) => setFormData({ ...formData, isDisposableEmail: val })}
                  />
                </div>
              </div>

              <Button
                onClick={analyze}
                disabled={loading}
                className="w-full h-10 font-semibold mt-4"
              >
                {loading ? "Checking Order Safety..." : "Check Payment Safety"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Form: Live Evaluation Results (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <Card className="border border-border/60 shadow-md">
            <CardHeader className="p-4 sm:p-5 pb-3 bg-muted/20 border-b border-border/40">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> Cost-Aware AI Decision
                </span>
                {result && (
                  <Badge variant="outline" className="font-mono text-xs">
                    {result.processingTimeMs || 12}ms analysis
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-5">
              {result ? (
                <>
                  {/* Gauge & Decision Badges */}
                  <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-xl border border-border/50">
                    <RiskGauge score={result.riskScore} size={160} />
                    <div className="flex items-center gap-3 mt-3">
                      <RiskBadge level={result.riskScore >= 80 ? "CRITICAL" : result.riskScore >= 60 ? "HIGH" : result.riskScore >= 30 ? "MEDIUM" : "LOW"} />
                      <DecisionBadge decision={result.decision} />
                    </div>
                  </div>

                  {/* Confidence Breakdown */}
                  <div className="p-4 rounded-lg bg-card/80 border border-border/50">
                    <ConfidenceGauge
                      confidence={result.confidence}
                      dataAvailability={result.dataAvailability}
                    />
                  </div>

                  {/* Cost-Aware Expected Loss Reasoning */}
                  {result.expectedCosts && (
                    <div className="p-3.5 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-primary" /> Expected Business Loss Analysis
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">C_FP: ₹450 | C_FN: ₹4,500</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded bg-background/90 border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">Loss if Approved</span>
                          <span className="font-bold text-rose-400 font-mono">
                            {formatCurrency(result.expectedCosts.approveExpectedLoss, "INR")}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-background/90 border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">Loss if Blocked</span>
                          <span className="font-bold text-amber-400 font-mono">
                            {formatCurrency(result.expectedCosts.blockExpectedLoss, "INR")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Multi-Modal Breakdown including Abuse-Ring Risk */}
                  {result.modelBreakdown && (
                    <div className="p-3.5 rounded-lg bg-muted/30 border border-border/40 space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        Multi-Modal Signal Breakdown
                      </span>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 rounded bg-background/80 border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">Order Details</span>
                          <span className="font-bold text-blue-400 font-mono">
                            {Math.round(result.modelBreakdown.lightgbm * 100)}%
                          </span>
                        </div>
                        <div className="p-2 rounded bg-background/80 border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">Past Habits</span>
                          <span className="font-bold text-emerald-400 font-mono">
                            {Math.round(result.modelBreakdown.behavioral * 100)}%
                          </span>
                        </div>
                        <div className="p-2 rounded bg-background/80 border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">Abuse-Ring Risk</span>
                          <span className="font-bold text-purple-400 font-mono">
                            {Math.round((result.ringRisk || result.modelBreakdown.gnn) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Structured Evidence List */}
                  {result.evidence && (
                    <StructuredEvidencePanel evidenceList={result.evidence} />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[340px] text-center text-muted-foreground p-6">
                  <Shield className="h-10 w-10 mb-3 opacity-30 text-primary" />
                  <h4 className="font-semibold text-sm text-foreground">Ready to Test</h4>
                  <p className="text-xs mt-1 max-w-xs">
                    Choose one of the sample situations above or enter order details, then click "Check Payment Safety".
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
