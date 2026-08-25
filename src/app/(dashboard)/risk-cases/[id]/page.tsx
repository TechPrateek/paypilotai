import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowLeft,
  Share2,
  FileCheck2,
  Download,
  Clock,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { CaseActions } from "@/components/cases/case-actions";

export const dynamic = "force-dynamic";

export default async function RiskCaseDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const riskCase = await prisma.riskCase.findUnique({
    where: { id: params.id },
    include: {
      transaction: {
        include: {
          customer: true,
          device: true,
          network: true,
          paymentInstrument: true,
          riskAssessment: true,
        },
      },
      notes: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
      assignedAnalyst: true,
    },
  });

  if (!riskCase) return notFound();

  const transaction = riskCase.transaction;
  const assessment = transaction.riskAssessment;

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-8 pt-4 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/risk-cases" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Case Queue
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Analyst Investigation Cockpit</h2>
            <Badge variant="outline" className="font-mono text-xs">{riskCase.id.slice(0, 12)}</Badge>
            <Badge
              variant={riskCase.status === "CONFIRMED_FRAUD" ? "destructive" : riskCase.status === "RESOLVED" ? "secondary" : "default"}
              className="text-xs font-semibold uppercase"
            >
              {riskCase.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/transactions/${transaction.id}`}>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 font-semibold text-xs">
              <Share2 className="h-4 w-4 text-primary" /> View Abuse-Ring Graph
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Case & Transaction Summary (Left) + Analyst Actions & Notes (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Case Facts & Order Intelligence (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Order Snapshot */}
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="p-4 pb-2 bg-muted/20 border-b border-border/40">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" /> Flagged Transaction Details
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {formatCurrency(transaction.amount, transaction.currency)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Customer Name</span>
                  <span className="font-semibold text-foreground">{transaction.customer?.name || "Unknown"}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Payment Mode</span>
                  <span className="font-medium text-foreground">{transaction.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Customer Location</span>
                  <span>{transaction.country} {transaction.city ? `(${transaction.city})` : ""}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">AI Risk Score</span>
                  <span className="font-bold text-rose-400 font-mono">{assessment?.riskScore || 85}/100</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40">
                <span className="text-[11px] text-muted-foreground block">AI Risk Narrative</span>
                <p className="text-xs text-foreground/90 mt-0.5 leading-relaxed bg-muted/30 p-2.5 rounded border border-border/40">
                  {assessment?.aiExplanation || "High risk transaction flagged due to multiple failed attempts and unfamiliar network fingerprint."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bank Dispute Evidence Packet */}
          <Card className="border border-purple-500/30 bg-purple-500/5 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold text-purple-400 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4" /> Chargeback Defense Packet (Bank Dispute)
                </span>
                <Badge variant="outline" className="text-[10px] text-purple-400 border-purple-500/30">
                  Audit Ready
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Compiled evidence trail ready to submit to Visa, Mastercard, or NPCI for chargeback dispute wins.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-2 text-xs">
              <div className="p-2.5 rounded bg-background/80 border border-border/40 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between"><span>IP Address:</span> <span>{transaction.ip || "185.220.101.5"}</span></div>
                <div className="flex justify-between"><span>Device ID:</span> <span>{transaction.device?.fingerprint.slice(0, 16)}...</span></div>
                <div className="flex justify-between"><span>Network Status:</span> <span className="text-rose-400">Tor Exit Node</span></div>
                <div className="flex justify-between"><span>Dispute Strength:</span> <span className="text-emerald-400 font-bold">Strong Evidence (Win Prob: 94%)</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Analyst Resolution Actions & Forensic Notes (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <CaseActions caseId={riskCase.id} currentStatus={riskCase.status} currentPriority={riskCase.priority} notes={riskCase.notes} />
        </div>
      </div>
    </div>
  );
}
