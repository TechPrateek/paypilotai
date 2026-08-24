import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle, ShieldAlert, ShoppingBag, Activity, Share2, Smartphone, History } from "lucide-react";

export interface EvidenceItem {
  id?: string;
  category: "TRANSACTION" | "BEHAVIOR" | "GRAPH" | "CONTEXT" | "DATA_AVAILABILITY";
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  source?: string;
  evidenceData?: any;
}

interface StructuredEvidencePanelProps {
  evidenceList: EvidenceItem[];
}

const CATEGORY_MAP: Record<string, { label: string; icon: React.ReactNode }> = {
  TRANSACTION: { label: "Order Details", icon: <ShoppingBag className="h-4 w-4 text-blue-400" /> },
  BEHAVIOR: { label: "Spending Habits", icon: <Activity className="h-4 w-4 text-emerald-400" /> },
  GRAPH: { label: "Connected Accounts & Devices", icon: <Share2 className="h-4 w-4 text-purple-400" /> },
  CONTEXT: { label: "Device & Internet Check", icon: <Smartphone className="h-4 w-4 text-amber-400" /> },
  DATA_AVAILABILITY: { label: "Past Order History", icon: <History className="h-4 w-4 text-cyan-400" /> },
};

const SOURCE_NAMES: Record<string, string> = {
  LIGHTGBM: "Order AI",
  BEHAVIORAL_ENGINE: "Customer History AI",
  GNN: "Device Network AI",
  HEURISTIC: "Safety Check",
  HYBRID_ENGINE: "PayPilot AI",
  NETWORK_INTEL: "Internet Safety Check",
};

const SEVERITY_BADGES: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; class: string }> = {
  LOW: { variant: "outline", label: "Normal / Safe", class: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" },
  MEDIUM: { variant: "secondary", label: "Attention Needed", class: "border-amber-500/30 text-amber-400 bg-amber-500/10" },
  HIGH: { variant: "destructive", label: "High Risk", class: "border-rose-500/30 text-rose-400 bg-rose-500/10" },
};

export function StructuredEvidencePanel({ evidenceList }: StructuredEvidencePanelProps) {
  if (!evidenceList || evidenceList.length === 0) {
    return (
      <Card className="border border-border/60">
        <CardHeader className="py-3 px-4 bg-muted/20 border-b border-border/40">
          <CardTitle className="text-sm font-semibold">Why Was This Decision Made?</CardTitle>
          <CardDescription className="text-xs">No unusual signals detected.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 shadow-md">
      <CardHeader className="py-3.5 px-4 bg-muted/20 border-b border-border/40 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Why PayPilot Made This Recommendation
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Plain-English summary of everything checked across the order, customer habits, devices, and network.
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-xs font-mono">
          {evidenceList.length} Signals Checked
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {evidenceList.map((item, idx) => {
          const sevConfig = SEVERITY_BADGES[item.severity] || SEVERITY_BADGES.LOW;
          const catConfig = CATEGORY_MAP[item.category] || { label: item.category, icon: <ShoppingBag className="h-4 w-4 text-primary" /> };
          const sourceLabel = item.source ? (SOURCE_NAMES[item.source] || item.source) : "Safety Check";

          return (
            <div
              key={item.id || idx}
              className="p-3 rounded-lg border border-border/50 bg-card/60 hover:bg-muted/20 transition-colors flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-muted/50 border border-border/40">
                    {catConfig.icon}
                  </div>
                  <span className="font-semibold text-xs text-foreground tracking-wide">
                    {catConfig.label}
                  </span>
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4 font-normal text-muted-foreground">
                    {sourceLabel}
                  </Badge>
                </div>

                <Badge variant={sevConfig.variant} className={`text-[10px] px-2 py-0.5 ${sevConfig.class}`}>
                  {sevConfig.label}
                </Badge>
              </div>

              <p className="text-xs text-foreground/90 leading-relaxed pl-8">
                {item.description}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
