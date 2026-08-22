import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { webhookPaymentSchema } from "@/lib/validators";
import { analyzeTransaction } from "@/engine/risk-engine";
import { TransactionInput } from "@/engine/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = webhookPaymentSchema.parse(body);

    // Find default merchant if none specified
    const merchant = await prisma.merchant.findFirst();
    if (!merchant) {
      return NextResponse.json({ error: "Merchant not configured" }, { status: 400 });
    }

    // Create or find customer
    let customer = await prisma.customer.findUnique({
      where: { externalId: data.customer_id },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          externalId: data.customer_id,
          name: `Customer ${data.customer_id.slice(-4)}`,
          email: `${data.customer_id}@example.com`,
          country: data.country,
          merchantId: merchant.id,
        },
      });
    }

    // Setup input for risk engine
    const transactionInput: TransactionInput = {
      amount: data.amount,
      currency: data.currency,
      paymentMethod: data.payment_method,
      country: data.country,
      ip: data.ip,
      deviceFingerprint: data.device_id,
      isNewDevice: false,
      customerId: customer.id,
      accountAgeDays: 30,
      previousFailedAttempts: 0,
      transactionsInLast5Min: 1,
      transactionsInLast1Hour: 1,
      customerAverageAmount: 5000,
      customerTotalTransactions: 10,
      customerCountries: [data.country],
      customerDeviceCount: 1,
      isDisposableEmail: false,
      isProxyIp: false,
      isVpnIp: false,
      isSuspiciousIp: false,
      previousDisputes: 0,
    };

    const riskResult = analyzeTransaction(transactionInput);

    const transaction = await prisma.transaction.create({
      data: {
        externalId: data.transaction_id || `tx_wh_${Date.now()}`,
        amount: data.amount,
        currency: data.currency,
        status: riskResult.decision === "BLOCK" ? "FAILED" : "COMPLETED",
        paymentMethod: data.payment_method,
        country: data.country,
        ip: data.ip,
        customerId: customer.id,
        merchantId: merchant.id,
        riskAssessment: {
          create: {
            riskScore: riskResult.riskScore,
            riskLevel: riskResult.riskLevel,
            decision: riskResult.decision,
            anomalyScore: riskResult.anomalyScore,
            aiExplanation: `Webhook evaluation: score ${riskResult.riskScore}/100. Action: ${riskResult.decision}.`,
            processingTimeMs: riskResult.processingTimeMs,
            riskFactors: {
              create: riskResult.factors.map((f) => ({
                name: f.name,
                category: f.category,
                severity: f.severity,
                scoreContribution: f.scoreContribution,
                explanation: f.explanation,
                evidence: f.evidence,
              })),
            },
          },
        },
      },
    });

    if (riskResult.riskLevel === "HIGH" || riskResult.riskLevel === "CRITICAL") {
      await prisma.alert.create({
        data: {
          transactionId: transaction.id,
          merchantId: merchant.id,
          type: "CRITICAL_TRANSACTION",
          title: `High Risk Payment Detected - Score: ${riskResult.riskScore}`,
          severity: riskResult.riskLevel === "CRITICAL" ? "CRITICAL" : "WARNING",
          message: `Webhook transaction ${transaction.externalId} flagged with ${riskResult.riskLevel} risk level.`,
          resolved: false,
        },
      });
    }

    return NextResponse.json(
      {
        status: "success",
        decision: riskResult.decision,
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
        transactionId: transaction.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 });
  }
}
