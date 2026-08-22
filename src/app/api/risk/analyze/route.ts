import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeTransaction } from "@/engine/risk-engine";
import { TransactionInput } from "@/engine/types";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    let customerHistory = {
      averageAmount: 5000,
      transactionCount: 1,
      countries: [data.country || "IN"],
      devices: [] as string[],
      failedAttempts: 0,
      disputes: 0,
    };

    if (data.customerId) {
      const txs = await prisma.transaction.findMany({
        where: { customerId: data.customerId },
        select: {
          amount: true,
          status: true,
          country: true,
          deviceId: true,
        },
      });

      if (txs.length > 0) {
        const amounts = txs.map((tx) => Number(tx.amount));
        customerHistory.averageAmount = amounts.reduce((a, b) => a + b, 0) / txs.length;
        customerHistory.transactionCount = txs.length;
        customerHistory.countries = Array.from(new Set(txs.map((t) => t.country).filter(Boolean))) as string[];
        customerHistory.devices = Array.from(new Set(txs.map((t) => t.deviceId).filter(Boolean))) as string[];
        customerHistory.failedAttempts = txs.filter((t) => t.status === "FAILED").length;
        customerHistory.disputes = txs.filter((t) => t.status === "DISPUTED").length;
      }
    }

    const transactionInput: TransactionInput = {
      amount: Number(data.amount) || 1000,
      currency: data.currency || "INR",
      paymentMethod: data.paymentMethod || "UPI",
      country: data.country || "IN",
      city: data.city,
      ip: data.ip,
      deviceFingerprint: data.deviceId || data.deviceFingerprint,
      isNewDevice: data.isNewDevice ?? false,
      customerId: data.customerId || "guest",
      customerEmail: data.customerEmail,
      accountAgeDays: data.accountAgeDays ?? 30,
      previousFailedAttempts: data.previousFailedAttempts ?? customerHistory.failedAttempts,
      transactionsInLast5Min: data.transactionsInLast5Min ?? 0,
      transactionsInLast1Hour: data.transactionsInLast1Hour ?? 1,
      customerAverageAmount: customerHistory.averageAmount,
      customerTotalTransactions: customerHistory.transactionCount,
      customerCountries: customerHistory.countries,
      customerDeviceCount: customerHistory.devices.length || 1,
      isDisposableEmail: data.isDisposableEmail ?? false,
      isProxyIp: data.isProxyIp ?? false,
      isVpnIp: data.isVpnIp ?? false,
      isSuspiciousIp: data.isSuspiciousIp ?? false,
      previousDisputes: customerHistory.disputes,
    };

    const result = analyzeTransaction(transactionInput);

    if (data.id) {
      const merchant = await prisma.merchant.findFirst();
      const assessment = await prisma.riskAssessment.create({
        data: {
          transactionId: data.id,
          riskScore: result.riskScore,
          riskLevel: result.riskLevel,
          decision: result.decision,
          anomalyScore: result.anomalyScore,
          aiExplanation: `Risk evaluation score: ${result.riskScore}/100. Level: ${result.riskLevel}. Action: ${result.decision}.`,
          processingTimeMs: result.processingTimeMs,
          riskFactors: {
            create: result.factors.map((f) => ({
              name: f.name,
              category: f.category,
              severity: f.severity,
              scoreContribution: f.scoreContribution,
              explanation: f.explanation,
              evidence: f.evidence,
            })),
          },
        },
        include: {
          riskFactors: true,
        },
      });

      if (result.riskLevel === "HIGH" || result.riskLevel === "CRITICAL") {
        await prisma.alert.create({
          data: {
            transactionId: data.id,
            merchantId: merchant?.id || "default",
            type: "CRITICAL_TRANSACTION",
            title: `High Risk Transaction - Score ${result.riskScore}`,
            severity: result.riskLevel === "CRITICAL" ? "CRITICAL" : "WARNING",
            message: `Transaction ${data.id} flagged with ${result.riskLevel} risk level.`,
            resolved: false,
          },
        });
      }

      return NextResponse.json({ ...result, assessmentId: assessment.id });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error analyzing transaction:", error);
    return NextResponse.json(
      { error: "Failed to analyze transaction" },
      { status: 500 }
    );
  }
}
