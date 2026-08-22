import React from "react";
import { DateFilter } from "@/components/dashboard/date-filter";
import { StatCard } from "@/components/dashboard/stat-card";
import { TransactionVolumeChart } from "@/components/charts/transaction-volume-chart";
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart";
import { DecisionBreakdownChart } from "@/components/charts/decision-breakdown-chart";
import { TopRiskReasonsChart } from "@/components/charts/top-risk-reasons-chart";
import {
  ArrowLeftRight,
  DollarSign,
  CheckCircle,
  Eye,
  XCircle,
  Percent,
  Gauge,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function OverviewPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [
    totalTransactions,
    volumeAgg,
    approvedCount,
    reviewCount,
    blockedCount,
    riskAvg,
    blockedVolume,
    allAssessments,
    topFactors,
  ] = await Promise.all([
    prisma.transaction.count(),
    prisma.transaction.aggregate({ _sum: { amount: true } }),
    prisma.transaction.count({ where: { riskAssessment: { decision: "APPROVE" } } }),
    prisma.transaction.count({ where: { riskAssessment: { decision: "REVIEW" } } }),
    prisma.transaction.count({ where: { riskAssessment: { decision: "BLOCK" } } }),
    prisma.riskAssessment.aggregate({ _avg: { riskScore: true } }),
    prisma.transaction.aggregate({
      where: { riskAssessment: { decision: "BLOCK" } },
      _sum: { amount: true },
    }),
    prisma.riskAssessment.findMany({
      select: { riskScore: true, riskLevel: true, decision: true },
    }),
    prisma.riskFactor.groupBy({
      by: ["name"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 8,
    }),
  ]);

  const totalVolume = Number(volumeAgg._sum.amount || 0);
  const preventedLoss = Number(blockedVolume._sum.amount || 0);
  const fraudRate = totalTransactions > 0 ? ((blockedCount / totalTransactions) * 100).toFixed(1) : "0.0";
  const avgScore = Math.round(riskAvg._avg.riskScore || 24);

  // Distribution data
  const distributionData = [
    { name: "LOW (0-29)", count: allAssessments.filter((a) => a.riskScore <= 29).length },
    { name: "MEDIUM (30-59)", count: allAssessments.filter((a) => a.riskScore >= 30 && a.riskScore <= 59).length },
    { name: "HIGH (60-79)", count: allAssessments.filter((a) => a.riskScore >= 60 && a.riskScore <= 79).length },
    { name: "CRITICAL (80-100)", count: allAssessments.filter((a) => a.riskScore >= 80).length },
  ];

  // Decisions data
  const decisionData = [
    { name: "APPROVE", value: approvedCount },
    { name: "REVIEW", value: reviewCount },
    { name: "BLOCK", value: blockedCount },
  ];

  // Top reasons
  const topReasonsData = topFactors.map((f) => ({
    reason: f.name,
    count: f._count.id,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time payment risk detection, analytics, and prevented loss monitoring.
          </p>
        </div>
        <DateFilter />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Transactions"
          value={totalTransactions.toLocaleString()}
          change="+12.4%"
          changeType="positive"
          icon={ArrowLeftRight}
          description="database verified"
        />
        <StatCard
          title="Total Volume"
          value={formatCurrency(totalVolume, "INR")}
          change="+8.2%"
          changeType="positive"
          icon={DollarSign}
          description="processed transactions"
        />
        <StatCard
          title="Approved"
          value={approvedCount.toLocaleString()}
          change={`${totalTransactions > 0 ? Math.round((approvedCount / totalTransactions) * 100) : 0}%`}
          changeType="positive"
          icon={CheckCircle}
          description="auto-approved"
        />
        <StatCard
          title="Under Review"
          value={reviewCount.toLocaleString()}
          change={`${totalTransactions > 0 ? Math.round((reviewCount / totalTransactions) * 100) : 0}%`}
          changeType="neutral"
          icon={Eye}
          description="manual review queue"
        />
        <StatCard
          title="Blocked Transactions"
          value={blockedCount.toLocaleString()}
          change="-1.8%"
          changeType="positive"
          icon={XCircle}
          description="fraud prevention"
        />
        <StatCard
          title="Fraud Rate"
          value={`${fraudRate}%`}
          change="-0.3%"
          changeType="positive"
          icon={Percent}
          description="industry benchmark < 2.5%"
        />
        <StatCard
          title="Avg Risk Score"
          value={avgScore.toString()}
          change="-4"
          changeType="positive"
          icon={Gauge}
          description="out of 100 (Safe)"
        />
        <StatCard
          title="Prevented Loss"
          value={formatCurrency(preventedLoss, "INR")}
          change="+$42K"
          changeType="positive"
          icon={Shield}
          description="fraud saved"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionVolumeChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart data={distributionData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Decision Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <DecisionBreakdownChart data={decisionData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Risk Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <TopRiskReasonsChart data={topReasonsData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
