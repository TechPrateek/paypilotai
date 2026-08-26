"use client";

import React, { useState } from "react";
import {
  Settings,
  DollarSign,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  Save,
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

  const handleSave = () => {
    toast.success("Cost parameters and detection thresholds updated!");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
            SETTINGS & PARAMETERS
          </h1>
          <Badge variant="outline" className="font-mono text-xs">
            Configurable
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
          Configure business cost assumptions ($C_&#123;\text&#123;fp&#125;&#125;, C_&#123;\text&#123;fn&#125;&#125;$) and risk score classification thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Cost Model */}
        <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
          <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
            <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span>Business Cost Model</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Used to calculate Expected Loss = FP × C_FP + FN × C_FN
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs font-mono">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">False Positive Cost (C_FP in ₹)</Label>
              <Input
                type="number"
                value={costFp}
                onChange={(e) => setCostFp(Number(e.target.value))}
                className="h-8 text-xs font-mono rounded-xl"
              />
              <span className="text-[10px] text-muted-foreground">Friction cost & lost customer lifetime value</span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">False Negative Cost (C_FN in ₹)</Label>
              <Input
                type="number"
                value={costFn}
                onChange={(e) => setCostFn(Number(e.target.value))}
                className="h-8 text-xs font-mono rounded-xl"
              />
              <span className="text-[10px] text-muted-foreground">Direct unrecovered chargeback loss</span>
            </div>

            <Button onClick={handleSave} size="sm" className="w-full h-8 text-xs font-bold rounded-xl mt-2">
              <Save className="h-3.5 w-3.5 mr-1.5" /> Save Cost Parameters
            </Button>
          </CardContent>
        </Card>

        {/* Risk Thresholds */}
        <Card className="rounded-3xl border border-border/60 shadow-xs bg-card">
          <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
            <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              <span>Severity Cutoffs</span>
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
                className="h-8 text-xs font-mono rounded-xl"
              />
              <span className="text-[10px] text-rose-500">Scores &gt;= {criticalThresh} trigger immediate ring isolation</span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">High Severity Cutoff (0-100)</Label>
              <Input
                type="number"
                value={highThresh}
                onChange={(e) => setHighThresh(Number(e.target.value))}
                className="h-8 text-xs font-mono rounded-xl"
              />
              <span className="text-[10px] text-amber-500">Scores &gt;= {highThresh} trigger analyst investigation</span>
            </div>

            <Button onClick={handleSave} size="sm" className="w-full h-8 text-xs font-bold rounded-xl mt-2">
              <Save className="h-3.5 w-3.5 mr-1.5" /> Save Severity Cutoffs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
