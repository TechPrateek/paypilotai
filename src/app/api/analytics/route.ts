import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    let whereDate: any = {};
    if (dateFrom || dateTo) {
      whereDate = {
        createdAt: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      };
    }

    const [
      totalStats,
      approvedCount,
      reviewCount,
      blockedCount,
      riskStats,
      blockedVolume,
      allAssessments,
      allTransactions,
      topFactors,
    ] = await Promise.all([
      prisma.transaction.aggregate({
        where: whereDate,
        _count: { id: true },
        _sum: { amount: true },
      }),
      prisma.transaction.count({ where: { ...whereDate, riskAssessment: { decision: 'APPROVE' } } }),
      prisma.transaction.count({ where: { ...whereDate, riskAssessment: { decision: 'REVIEW' } } }),
      prisma.transaction.count({ where: { ...whereDate, riskAssessment: { decision: 'BLOCK' } } }),
      prisma.riskAssessment.aggregate({
        where: { transaction: whereDate },
        _avg: { riskScore: true },
      }),
      prisma.transaction.aggregate({
        where: { ...whereDate, riskAssessment: { decision: 'BLOCK' } },
        _sum: { amount: true },
      }),
      prisma.riskAssessment.findMany({
        where: { transaction: whereDate },
        select: { riskScore: true, riskLevel: true, decision: true },
      }),
      prisma.transaction.findMany({
        where: whereDate,
        select: { amount: true, currency: true, paymentMethod: true, country: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
        take: 300,
      }),
      prisma.riskFactor.groupBy({
        by: ['name'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ]);

    const totalTransactions = totalStats._count.id;
    const totalVolume = Number(totalStats._sum.amount || 0);
    const fraudRate = totalTransactions > 0 ? (blockedCount / totalTransactions) * 100 : 0;
    const preventedLoss = Number(blockedVolume._sum.amount || 0);

    // Group transactions by date for volume chart
    const volumeMap: Record<string, { date: string; count: number; volume: number }> = {};
    for (const tx of allTransactions) {
      const d = tx.createdAt.toISOString().slice(0, 10);
      if (!volumeMap[d]) {
        volumeMap[d] = { date: d, count: 0, volume: 0 };
      }
      volumeMap[d].count += 1;
      volumeMap[d].volume += Number(tx.amount);
    }
    const volumeOverTime = Object.values(volumeMap).slice(-30);

    // Distribution by bucket
    const distribution = [
      { name: "LOW (0-29)", count: allAssessments.filter(a => a.riskScore <= 29).length, color: "#22c55e" },
      { name: "MEDIUM (30-59)", count: allAssessments.filter(a => a.riskScore >= 30 && a.riskScore <= 59).length, color: "#eab308" },
      { name: "HIGH (60-79)", count: allAssessments.filter(a => a.riskScore >= 60 && a.riskScore <= 79).length, color: "#f97316" },
      { name: "CRITICAL (80-100)", count: allAssessments.filter(a => a.riskScore >= 80).length, color: "#ef4444" },
    ];

    // Decisions breakdown
    const decisions = [
      { name: "APPROVE", value: approvedCount, color: "#22c55e" },
      { name: "MONITOR", value: allAssessments.filter(a => a.decision === 'APPROVE_WITH_MONITORING').length, color: "#eab308" },
      { name: "REVIEW", value: reviewCount, color: "#f97316" },
      { name: "BLOCK", value: blockedCount, color: "#ef4444" },
    ];

    // Country risk
    const countryMap: Record<string, { country: string; count: number; blocked: number }> = {};
    for (const tx of allTransactions) {
      if (!countryMap[tx.country]) {
        countryMap[tx.country] = { country: tx.country, count: 0, blocked: 0 };
      }
      countryMap[tx.country].count += 1;
    }
    const countryRisk = Object.values(countryMap).slice(0, 10);

    // Top risk reasons
    const topReasons = topFactors.map(f => ({
      reason: f.name,
      count: f._count.id,
    }));

    return NextResponse.json({
      summary: {
        totalTransactions,
        totalVolume,
        approvedCount,
        reviewCount,
        blockedCount,
        fraudRate: Number(fraudRate.toFixed(2)),
        avgRiskScore: Math.round(riskStats._avg.riskScore || 0),
        preventedLoss,
      },
      volumeOverTime,
      distribution,
      decisions,
      countryRisk,
      topReasons,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
