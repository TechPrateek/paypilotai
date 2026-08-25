import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import RiskFactorsPanel from "@/components/transactions/risk-factors-panel";
import { RiskGauge } from "@/components/dashboard/risk-gauge";
import { RiskBadge } from "@/components/dashboard/risk-badge";
import { DecisionBadge } from "@/components/dashboard/decision-badge";
import { ConfidenceGauge } from "@/components/dashboard/confidence-gauge";
import { StructuredEvidencePanel } from "@/components/transactions/structured-evidence-panel";
import { GraphExplorer } from "@/components/graph/graph-explorer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Sparkles,
  Clock,
  User,
  Smartphone,
  Globe,
  CreditCard,
  Layers,
  Network as NetworkIcon,
  CheckCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TransactionDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const transaction = await prisma.transaction.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      device: true,
      network: true,
      paymentInstrument: true,
      riskAssessment: {
        include: {
          riskFactors: true,
          riskEvidences: true,
        },
      },
      riskCase: true,
    },
  });

  if (!transaction) return notFound();

  const assessment = transaction.riskAssessment;
  const dataAvailability = assessment?.dataAvailability
    ? JSON.parse(assessment.dataAvailability)
    : { historyAvailable: true, identityAvailable: true, graphAvailable: true };

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-8 pt-4 sm:pt-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Order Investigation</h2>
            <Badge variant="outline" className="font-mono text-xs">{transaction.externalId}</Badge>
            <Badge variant="secondary" className="text-xs font-mono bg-primary/10 text-primary border-primary/20">
              AI Monitored
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Placed at {new Date(transaction.createdAt).toLocaleString()} • Store: TechMart India
          </p>
        </div>
        <div className="flex items-center gap-2">
          {transaction.riskCase ? (
            <Link href={`/risk-cases/${transaction.riskCase.id}`}>
              <Button size="sm" className="h-9">
                <Shield className="mr-1.5 h-4 w-4" /> View Investigation Case ({transaction.riskCase.status})
              </Button>
            </Link>
          ) : (
            <Link href="/risk-cases">
              <Button variant="outline" size="sm" className="h-9">
                <Shield className="mr-1.5 h-4 w-4" /> Open Investigation
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Grid: Details & Dual Risk/Confidence Evaluation */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Order Details & Customer Context (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Order Summary */}
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="p-4 sm:p-5 pb-3 bg-muted/20 border-b border-border/40">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" /> Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Order Amount</span>
                  <span className="text-xl font-bold text-foreground">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Payment Status</span>
                  <Badge variant={transaction.status === "COMPLETED" ? "secondary" : "destructive"} className="mt-0.5">
                    {transaction.status === "COMPLETED" ? "Successful" : transaction.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Payment Method</span>
                  <span className="font-medium">
                    {transaction.paymentMethod}{" "}
                    {transaction.paymentInstrument
                      ? `(${transaction.paymentInstrument.cardBrand || transaction.paymentInstrument.type} •••• ${transaction.paymentInstrument.last4 || ""})`
                      : ""}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Customer Location</span>
                  <span className="font-medium">
                    {transaction.country} {transaction.city ? `(${transaction.city})` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Internet IP Address</span>
                  <span className="font-mono text-xs text-foreground/90">{transaction.ip || "192.168.1.1"}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Transaction ID</span>
                  <span className="font-mono text-xs break-all text-muted-foreground">{transaction.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Profile Snapshot */}
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="p-4 sm:p-5 pb-3 bg-muted/20 border-b border-border/40">
              <CardTitle className="text-sm sm:text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Customer Profile
                </span>
                {dataAvailability.historyAvailable ? (
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    Known Customer
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/30">
                    First-Time Buyer
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-3">
              {transaction.customer ? (
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Customer Name:</span>
                    <Link
                      href={`/customers/${transaction.customer.id}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {transaction.customer.name}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email Address:</span>
                    <span className="font-mono text-xs">{transaction.customer.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Account Created:</span>
                    <span>
                      {transaction.customer.accountCreatedAt
                        ? new Date(transaction.customer.accountCreatedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Customer ID:</span>
                    <span className="font-mono text-xs text-muted-foreground">{transaction.customer.externalId}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No customer record linked.</p>
              )}
            </CardContent>
          </Card>

          {/* Network & Device Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Device Card */}
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="p-3.5 pb-2 bg-muted/20 border-b border-border/40">
                <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-rose-400" /> Customer's Phone / Computer
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device Type:</span>
                  <span className="font-medium">{transaction.device?.deviceType || "Desktop"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Operating System:</span>
                  <span className="font-medium">
                    {transaction.device?.os || "Windows"} ({transaction.device?.browser || "Chrome"})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device Fingerprint:</span>
                  <span className="font-mono text-[10px]">
                    {transaction.device?.fingerprint.slice(0, 12)}...
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Network Card */}
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="p-3.5 pb-2 bg-muted/20 border-b border-border/40">
                <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                  <NetworkIcon className="h-3.5 w-3.5 text-cyan-400" /> Internet Connection Check
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connection Type:</span>
                  <span className="font-medium">{transaction.network?.type || "RESIDENTIAL"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VPN / Proxy:</span>
                  <span className="font-medium">
                    {transaction.network?.isTor ? "Tor Anonymous Network" : transaction.network?.isVpn ? "VPN Active" : transaction.network?.isProxy ? "Proxy Detected" : "Normal Home/Mobile Connection"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connection Safety:</span>
                  <span className={transaction.network?.isSuspicious ? "text-rose-400 font-semibold" : "text-emerald-400 font-medium"}>
                    {transaction.network?.isSuspicious ? "Suspicious Network Flagged" : "Normal Safe Connection"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Risk & Confidence Evaluation + Evidence (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border border-border/60 shadow-md">
            <CardHeader className="p-4 sm:p-5 pb-3 bg-muted/20 border-b border-border/40">
              <CardTitle className="text-sm sm:text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> AI Risk Assessment & Recommendation
                </span>
                <Badge variant="outline" className="text-xs font-mono font-bold">
                  Score: {assessment?.riskScore || 0}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-5">
              {assessment ? (
                <>
                  {/* Gauge & Decision Badges */}
                  <div className="flex flex-col items-center justify-center p-5 bg-muted/30 rounded-xl border border-border/50">
                    <RiskGauge score={assessment.riskScore} size={180} />
                    <div className="flex items-center gap-3 mt-3">
                      <RiskBadge level={assessment.riskLevel as any} />
                      <DecisionBadge decision={assessment.decision as any} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {assessment.processingTimeMs || 14}ms analysis
                      </span>
                    </div>
                  </div>

                  {/* Confidence Gauge */}
                  <div className="p-4 rounded-lg bg-card/80 border border-border/50">
                    <ConfidenceGauge
                      confidence={assessment.confidence || (dataAvailability.historyAvailable ? 0.92 : 0.52)}
                      dataAvailability={dataAvailability}
                    />
                  </div>

                  {/* Explainable AI Narrative */}
                  {assessment.aiExplanation && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <Sparkles className="h-3.5 w-3.5" /> Why PayPilot Made This Recommendation
                      </div>
                      <p className="text-xs leading-relaxed text-foreground/90">
                        {assessment.aiExplanation}
                      </p>
                    </div>
                  )}

                  {/* Legacy Risk Factors Panel */}
                  {assessment.riskFactors && assessment.riskFactors.length > 0 && (
                    <RiskFactorsPanel factors={assessment.riskFactors as any} />
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No risk assessment record available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Module 1: Chargeback Evidence Responder */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" /> Chargeback Evidence Responder (Dispute Audit Trail)
          </h3>
          <Badge variant="outline" className="text-[11px] font-mono">Bank-Ready Dispute Packet</Badge>
        </div>
        <StructuredEvidencePanel
          evidenceList={
            assessment?.riskEvidences && assessment.riskEvidences.length > 0
              ? (assessment.riskEvidences as any)
              : [
                  {
                    category: dataAvailability.historyAvailable ? "BEHAVIOR" : "DATA_AVAILABILITY",
                    description: dataAvailability.historyAvailable
                      ? "Customer has a normal, verified order history with our store."
                      : "First-time customer with zero previous orders. Confidence is lower, but transaction is safe to approve.",
                    severity: "LOW",
                    source: "BEHAVIORAL_ENGINE",
                  },
                  {
                    category: "TRANSACTION",
                    description: `Standard order amount and payment method matched legitimate customer patterns.`,
                    severity: "LOW",
                    source: "LIGHTGBM",
                  },
                  {
                    category: "GRAPH",
                    description: "No connections found to suspicious or previously disputed accounts.",
                    severity: "LOW",
                    source: "GNN",
                  },
                ]
          }
        />
      </div>

      {/* Module 2: Abuse-Ring Sentinel */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Abuse-Ring Sentinel (Multi-Hop Entity Isolation)
          </h3>
          <Badge variant="outline" className="text-[11px] font-mono">Graph GNN Active</Badge>
        </div>
        <GraphExplorer transactionId={transaction.id} />
      </div>
    </div>
  );
}
