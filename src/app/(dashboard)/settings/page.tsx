"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  DollarSign,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  Save,
  RefreshCw,
  Sliders,
  Webhook,
  KeyRound,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SettingsPage() {
  const [costFp, setCostFp] = useState(450);
  const [costFn, setCostFn] = useState(4500);
  const [criticalThresh, setCriticalThresh] = useState(80);
  const [highThresh, setHighThresh] = useState(60);
  const [webhookUrl, setWebhookUrl] = useState("https://api.techmart.in/webhooks/risk-alert");
  const [velocityLimit, setVelocityLimit] = useState(5);
  const [retraining, setRetraining] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("paypilot_settings");
      if (stored) {
        const s = JSON.parse(stored);
        if (s.costFp) setCostFp(s.costFp);
        if (s.costFn) setCostFn(s.costFn);
        if (s.criticalThresh) setCriticalThresh(s.criticalThresh);
        if (s.highThresh) setHighThresh(s.highThresh);
        if (s.webhookUrl) setWebhookUrl(s.webhookUrl);
        if (s.velocityLimit) setVelocityLimit(s.velocityLimit);
      }
    } catch {}
  }, []);

  const handleSaveSettings = () => {
    const settingsObj = {
      costFp,
      costFn,
      criticalThresh,
      highThresh,
      webhookUrl,
      velocityLimit,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem("paypilot_settings", JSON.stringify(settingsObj));
    } catch {}
    toast.success("Settings & cost parameters saved successfully!");
  };

  const handleResetDefaults = () => {
    setCostFp(450);
    setCostFn(4500);
    setCriticalThresh(80);
    setHighThresh(60);
    setWebhookUrl("https://api.techmart.in/webhooks/risk-alert");
    setVelocityLimit(5);
    try {
      localStorage.removeItem("paypilot_settings");
    } catch {}
    toast.info("Restored factory default configuration (C_FP = ₹450, C_FN = ₹4,500).");
  };

  const handleRetrainModel = async () => {
    setRetraining(true);
    try {
      const res = await fetch("/api/evaluation/retrain", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        toast.success(`Model Retrained! Precision: ${data.metrics.precision}%, Recall: ${data.metrics.recall}%, F1: ${data.metrics.f1}%`);
      }
    } catch {
      toast.error("Failed to retrain model");
    } finally {
      setRetraining(false);
    }
  };

  const handleClearCache = () => {
    try {
      localStorage.removeItem("paypilot_tx_verifications");
      localStorage.removeItem("paypilot_isolated_rings");
      localStorage.removeItem("paypilot_blacklisted_nodes");
    } catch {}
    toast.success("Cleared temporary demo verifications and isolation cache.");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
              SYSTEM SETTINGS & PARAMETERS
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-purple-500 border-purple-500/30">
              Live Configurable
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
            Configure business cost assumptions (C_FP, C_FN), severity cutoffs, and automated retraining pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetDefaults}
            className="h-8 text-xs font-bold rounded-xl gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSaveSettings}
            className="h-8 text-xs font-bold rounded-xl gap-1.5 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Cost Model */}
        <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
          <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
            <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span>Business Cost Model Parameters</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Used in Expected Business Loss = (FP × C_FP) + (FN × C_FN)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs font-mono">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">False Positive Cost (C_FP in ₹)</Label>
              <Input
                type="number"
                value={costFp}
                onChange={(e) => setCostFp(Number(e.target.value))}
                className="h-9 text-xs font-mono rounded-xl"
              />
              <span className="text-[10px] text-muted-foreground">Friction cost & lost customer lifetime value</span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">False Negative Cost (C_FN in ₹)</Label>
              <Input
                type="number"
                value={costFn}
                onChange={(e) => setCostFn(Number(e.target.value))}
                className="h-9 text-xs font-mono rounded-xl"
              />
              <span className="text-[10px] text-muted-foreground">Direct unrecovered chargeback liability loss</span>
            </div>
          </CardContent>
        </Card>

        {/* Risk Thresholds */}
        <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
          <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
            <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              <span>Severity Cutoffs & Velocity Guard</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Configurable 0-100 risk score thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs font-mono">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Critical Severity Cutoff (0-100)</Label>
              <Input
                type="number"
                value={criticalThresh}
                onChange={(e) => setCriticalThresh(Number(e.target.value))}
                className="h-9 text-xs font-mono rounded-xl"
              />
              <span className="text-[10px] text-muted-foreground">Scores above this trigger automated syndicate isolation</span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Max Allowed Velocity (Orders/minute)</Label>
              <Input
                type="number"
                value={velocityLimit}
                onChange={(e) => setVelocityLimit(Number(e.target.value))}
                className="h-9 text-xs font-mono rounded-xl"
              />
              <span className="text-[10px] text-muted-foreground">Burst limit per credit card instrument</span>
            </div>
          </CardContent>
        </Card>

        {/* Model Pipeline & Retrain Trigger */}
        <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
          <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
            <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>Model Pipeline & Retraining</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Execute dataset regeneration & model calibration
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs">
            <p className="text-muted-foreground">
              Run the empirical graph extraction pipeline to re-calculate multi-hop NetworkX features across 301 synthetic transactions.
            </p>

            <Button
              onClick={handleRetrainModel}
              disabled={retraining}
              className="w-full h-9 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl cursor-pointer gap-2"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${retraining ? "animate-spin" : ""}`} />
              <span>{retraining ? "Retraining Sentinel Engine..." : "Retrain Sentinel Model Now"}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Storage & Webhooks */}
        <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
          <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
            <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
              <Webhook className="h-4 w-4 text-blue-500" />
              <span>Merchant Webhook & Cache Management</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Real-time alert dispatch endpoint
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3.5 text-xs font-mono">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Webhook URL</Label>
              <Input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="h-9 text-xs font-mono rounded-xl"
              />
            </div>

            <div className="pt-2 border-t border-border/40">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCache}
                className="w-full text-xs font-bold rounded-xl border-border/60 text-muted-foreground hover:text-foreground cursor-pointer gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                <span>Clear Demo Verification State Cache</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
