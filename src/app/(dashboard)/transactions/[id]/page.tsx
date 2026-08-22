import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, getRiskLevelColor } from '@/lib/utils';
import RiskFactorsPanel from '@/components/transactions/risk-factors-panel';
import { RiskGauge } from '@/components/dashboard/risk-gauge';
import { RiskBadge } from '@/components/dashboard/risk-badge';
import { DecisionBadge } from '@/components/dashboard/decision-badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Sparkles, Clock, User, Smartphone, Globe, CreditCard } from 'lucide-react';

export default async function TransactionDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const transaction = await prisma.transaction.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      device: true,
      riskAssessment: {
        include: { riskFactors: true }
      },
      riskCase: true,
    }
  });

  if (!transaction) return notFound();

  return (
    <div className="space-y-6 p-4 pt-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Transaction Investigation</h2>
            <Badge variant="outline" className="font-mono">{transaction.externalId}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Created at {new Date(transaction.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {transaction.riskCase ? (
            <Link href={`/risk-cases/${transaction.riskCase.id}`}>
              <Button>
                <Shield className="mr-2 h-4 w-4" /> View Risk Case
              </Button>
            </Link>
          ) : (
            <Link href="/risk-cases">
              <Button variant="outline">
                <Shield className="mr-2 h-4 w-4" /> Open Fraud Case
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left column: Summary & Details (6 cols) */}
        <div className="md:col-span-6 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" /> Transaction Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Amount</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Status</span>
                  <Badge variant={transaction.status === "COMPLETED" ? "secondary" : "destructive"}>
                    {transaction.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Payment Method</span>
                  <span className="font-medium">{transaction.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Origin Country</span>
                  <span className="font-medium">{transaction.country} {transaction.city ? `(${transaction.city})` : ''}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">IP Address</span>
                  <span className="font-mono text-xs">{transaction.ip || '192.168.1.1'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Transaction ID</span>
                  <span className="font-mono text-xs">{transaction.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Customer Profile Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transaction.customer ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <Link href={`/customers/${transaction.customer.id}`} className="font-semibold text-primary hover:underline">
                      {transaction.customer.name}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{transaction.customer.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Registered Country:</span>
                    <span>{transaction.customer.country}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Account Created:</span>
                    <span>{transaction.customer.accountCreatedAt ? new Date(transaction.customer.accountCreatedAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              ) : <p className="text-sm text-muted-foreground">No customer record linked.</p>}
            </CardContent>
          </Card>

          {transaction.device && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" /> Device & Environment
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fingerprint:</span>
                  <span className="font-mono text-xs">{transaction.device.fingerprint.slice(0, 16)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device Type:</span>
                  <span>{transaction.device.deviceType || 'Desktop'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Browser / OS:</span>
                  <span>{transaction.device.browser} / {transaction.device.os}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: Risk Assessment (6 cols) */}
        <div className="md:col-span-6 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> Risk Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transaction.riskAssessment ? (
                <div className="space-y-5">
                  <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-xl border">
                    <RiskGauge score={transaction.riskAssessment.riskScore} size={170} />
                    <div className="flex items-center gap-3 mt-3">
                      <RiskBadge level={transaction.riskAssessment.riskLevel as any} />
                      <DecisionBadge decision={transaction.riskAssessment.decision as any} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {transaction.riskAssessment.processingTimeMs || 12}ms processing
                      </span>
                      <span>•</span>
                      <span>Anomaly Score: {transaction.riskAssessment.anomalyScore || 0}%</span>
                    </div>
                  </div>

                  {transaction.riskAssessment.aiExplanation && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <Sparkles className="h-3.5 w-3.5" /> Explainable AI Investigation Summary
                      </div>
                      <p className="text-xs leading-relaxed text-foreground/90">
                        {transaction.riskAssessment.aiExplanation}
                      </p>
                    </div>
                  )}

                  <RiskFactorsPanel factors={transaction.riskAssessment.riskFactors as any} />
                </div>
              ) : <p className="text-sm text-muted-foreground">No risk assessment record.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
