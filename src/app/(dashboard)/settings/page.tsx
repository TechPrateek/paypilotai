"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  DollarSign,
  ShieldAlert,
  RotateCcw,
  Save,
  RefreshCw,
  Webhook,
  Sparkles,
  Layers,
  Network,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ConfigurationPage() {
  const [costFp, setCostFp] = useState(450);
  const [costFn, setCostFn] = useState(4500);
  const [operatingThreshold, setOperatingThreshold] = useState(0.70);
  const [minRingSize, setMinRingSize] = useState(3);
  const [temporalWindow, setTemporalWindow] = useState(120);
  const [velocityWindow, setVelocityWindow] = useState(60);
  const [minSignals, setMinSignals] = useState(3);
  const [webhookUrl, setWebhookUrl] = useState("https://api.sentinel.internal/webhooks/ring-alert");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sentinel_configuration");
      if (stored) {
        const s = JSON.parse(stored);
        if (s.costFp) setCostFp(s.costFp);
        if (s.costFn) setCostFn(s.costFn);
        if (s.operatingThreshold) setOperatingThreshold(s.operatingThreshold);
        if (s.minRingSize) setMinRingSize(s.minRingSize);
        if (s.temporalWindow) setTemporalWindow(s.temporalWindow);
        if (s.webhookUrl) setWebhookUrl(s.webhookUrl);
      }
    } catch {}
  }, []);

  const handleSaveConfig = () => {
    const configObj = {
      costFp,
      costFn,
      operatingThreshold,
      minRingSize,
      temporalWindow,
      velocityWindow,
      minSignals,
      webhookUrl,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem("sentinel_configuration", JSON.stringify(configObj));
    } catch {}
    toast.success("Configuration policy and parameters saved successfully.");
  };

  const handleResetDefaults = () => {
    setCostFp(450);
    setCostFn(4500);
    setOperatingThreshold(0.70);
    setMinRingSize(3);
    setTemporalWindow(120);
    setVelocityWindow(60);
    setMinSignals(3);
    setWebhookUrl("https://api.sentinel.internal/webhooks/ring-alert");
    try {
      localStorage.removeItem("sentinel_configuration");
    } catch {}
    toast.info("Reset configuration to default baseline parameters.");
  };

  const handleRunPipelineAction = async (action: string) => {
    setIsProcessing(action);
    try {
      const res = await fetch("/api/evaluation/retrain", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        toast.success(`Completed: ${action}! Test Precision: ${data.metrics.precision}%, Recall: ${data.metrics.recall}%, F1: ${data.metrics.f1}%`);
      }
    } catch {
      toast.error(`Execution failed for ${action}`);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
              CONFIGURATION
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-red-500 border-red-500/30">
              System Policy
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
            Detection policy, business cost assumptions and model pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetDefaults}
            className="h-8 text-xs font-bold font-mono rounded-xl gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>RESET DEFAULTS</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSaveConfig}
            className="h-8 text-xs font-bold font-mono rounded-xl gap-1.5 bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>SAVE CONFIGURATION</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Business Loss Model */}
        <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
          <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
            <CardTitle className="text-sm font-bold font-mono tracking-tight flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span>BUSINESS LOSS MODEL</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Formula: Expected Loss = (FP × C_FP) + (FN × C_FN)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs font-mono">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">C_FP — False Positive Cost (₹)</Label>
              <Input
                type="number"
                value={costFp}
                onChange={(e) => setCostFp(Number(e.target.value))}
                className="h-9 text-xs font-mono rounded-xl"
              />
              <span className="text-[10px] text-muted-foreground">Friction cost per false positive investigation</span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">C_FN — False Negative Cost (₹)</Label>
              <Input
                type="number"
                value={costFn}
                onChange={(e) => setCostFn(Number(e.target.value))}
                className="h-9 text-xs font-mono rounded-xl"
              />
              <span className="text-[10px] text-muted-foreground">Direct unrecovered chargeback loss per missed syndicate</span>
            </div>

            <div className="pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
              * Note: Illustrative business cost assumptions for evaluation optimization.
            </div>
          </CardContent>
        </Card>

        {/* 2. Risk Score Policy */}
        <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
          <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
            <CardTitle className="text-sm font-bold font-mono tracking-tight flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              <span>RISK SCORE POLICY</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Scores above the selected threshold are prioritized for investigation.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs font-mono">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <span className="text-[10px] text-red-500 font-bold block">CRITICAL</span>
                <span className="text-base font-black text-foreground">80 – 100</span>
              </div>
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <span className="text-[10px] text-orange-500 font-bold block">HIGH</span>
                <span className="text-base font-black text-foreground">60 – 79</span>
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-[10px] text-yellow-600 dark:text-yellow-400 font-bold block">MEDIUM</span>
                <span className="text-base font-black text-foreground">30 – 59</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] text-emerald-500 font-bold block">LOW</span>
                <span className="text-base font-black text-foreground">0 – 29</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Detection Parameters */}
        <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
          <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
            <CardTitle className="text-sm font-bold font-mono tracking-tight flex items-center gap-2">
              <Sliders className="h-4 w-4 text-purple-500" />
              <span>DETECTION PARAMETERS</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Algorithmic graph clustering and temporal burst cutoffs
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-bold">Operating Threshold (τ)</Label>
                <Input
                  type="number"
                  step="0.05"
                  value={operatingThreshold}
                  onChange={(e) => setOperatingThreshold(Number(e.target.value))}
                  className="h-8 text-xs font-mono rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-bold">Min Ring Size (Entities)</Label>
                <Input
                  type="number"
                  value={minRingSize}
                  onChange={(e) => setMinRingSize(Number(e.target.value))}
                  className="h-8 text-xs font-mono rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-bold">Temporal Window (Seconds)</Label>
                <Input
                  type="number"
                  value={temporalWindow}
                  onChange={(e) => setTemporalWindow(Number(e.target.value))}
                  className="h-8 text-xs font-mono rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-bold">Min Supporting Signals</Label>
                <Input
                  type="number"
                  value={minSignals}
                  onChange={(e) => setMinSignals(Number(e.target.value))}
                  className="h-8 text-xs font-mono rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Defensive Alerting */}
        <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
          <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
            <CardTitle className="text-sm font-bold font-mono tracking-tight flex items-center gap-2">
              <Webhook className="h-4 w-4 text-blue-500" />
              <span>DEFENSIVE ALERTING</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Downstream forensic security notification endpoint
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs font-mono">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Webhook Destination</Label>
              <Input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="h-8 text-xs font-mono rounded-xl"
              />
            </div>

            <div className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                Defensive Notification Payload Preview
              </span>
              <p className="text-[11px] text-foreground font-mono">
                &#123; &quot;event&quot;: &quot;RING_DETECTED&quot;, &quot;ring_id&quot;: &quot;RING-0042&quot;, &quot;risk_score&quot;: 91, &quot;severity&quot;: &quot;CRITICAL&quot; &#125;
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. Graph Feature Pipeline & Model Pipeline Execution (Full Width) */}
      <Card className="rounded-3xl border border-border/60 shadow-xs bg-card overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
          <CardTitle className="text-sm font-bold font-mono tracking-tight flex items-center gap-2">
            <Network className="h-4 w-4 text-primary" />
            <span>GRAPH FEATURE PIPELINE & MODEL EXECUTION</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Multi-hop graph construction and feature extraction on 301 synthetic transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          {/* Pipeline Flow Diagram */}
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 font-mono text-xs flex items-center justify-between overflow-x-auto gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-background border border-border/60 font-bold shrink-0">Dataset (301 txs)</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-background border border-border/60 font-bold shrink-0">Entity Resolution</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-background border border-border/60 font-bold shrink-0">Graph Construction</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-background border border-border/60 font-bold shrink-0">Feature Extraction</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-background border border-border/60 font-bold shrink-0">Sentinel Model</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold shrink-0">Held-Out Test</span>
          </div>

          {/* Real Execution Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <Button
              size="sm"
              variant="outline"
              disabled={!!isProcessing}
              onClick={() => handleRunPipelineAction("Feature Extraction")}
              className="h-9 text-xs font-bold rounded-xl gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isProcessing === "Feature Extraction" ? "animate-spin text-red-500" : ""}`} />
              <span>EXTRACT FEATURES</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={!!isProcessing}
              onClick={() => handleRunPipelineAction("Model Training")}
              className="h-9 text-xs font-bold rounded-xl gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isProcessing === "Model Training" ? "animate-spin text-red-500" : ""}`} />
              <span>TRAIN MODEL</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={!!isProcessing}
              onClick={() => handleRunPipelineAction("Validation Tuning")}
              className="h-9 text-xs font-bold rounded-xl gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isProcessing === "Validation Tuning" ? "animate-spin text-red-500" : ""}`} />
              <span>RUN VALIDATION</span>
            </Button>

            <Button
              size="sm"
              disabled={!!isProcessing}
              onClick={() => handleRunPipelineAction("Held-Out Evaluation")}
              className="h-9 text-xs font-bold rounded-xl gap-1.5 bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isProcessing === "Held-Out Evaluation" ? "animate-spin" : ""}`} />
              <span>EVALUATE TEST SET</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
