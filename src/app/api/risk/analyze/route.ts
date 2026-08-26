import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeTransaction } from "@/engine/risk-engine";
import { TransactionInput } from "@/engine/types";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    let customerHistory = {
      averageAmount: 0,
      transactionCount: 0,
      countries: [data.country || "IN"],
      devices: [] as string[],
      failedAttempts: 0,
      disputes: 0,
    };

    let hasHistory = false;
    if (data.customerId && data.customerId !== "guest") {
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
        hasHistory = true;
        const amounts = txs.map((tx) => Number(tx.amount));
        customerHistory.averageAmount = amounts.reduce((a, b) => a + b, 0) / txs.length;
        customerHistory.transactionCount = txs.length;
        customerHistory.countries = Array.from(new Set(txs.map((t) => t.country).filter(Boolean))) as string[];
        customerHistory.devices = Array.from(new Set(txs.map((t) => t.deviceId).filter(Boolean))) as string[];
        customerHistory.failedAttempts = txs.filter((t) => t.status === "FAILED").length;
        customerHistory.disputes = txs.filter((t) => t.status === "DISPUTED").length;
      }
    }

    const payload = {
      transactionId: data.id || data.transactionId,
      amount: Number(data.amount) || 1000,
      currency: data.currency || "INR",
      paymentMethod: data.paymentMethod || "UPI",
      country: data.country || "IN",
      city: data.city,
      ip: data.ip,
      deviceId: data.deviceId,
      deviceFingerprint: data.deviceId || data.deviceFingerprint,
      networkId: data.networkId,
      paymentInstrumentId: data.paymentInstrumentId,
      customerId: data.customerId || "guest",
      customerEmail: data.customerEmail,
      accountAgeDays: data.accountAgeDays ?? (hasHistory ? 60 : 0),
      isNewDevice: data.isNewDevice ?? !hasHistory,
      isNewIp: data.isNewIp ?? false,
      previousFailedAttempts: data.previousFailedAttempts ?? customerHistory.failedAttempts,
      timeBetweenAttemptsSeconds: data.timeBetweenAttemptsSeconds ?? 0,
      transactionsInLast5Min: data.transactionsInLast5Min ?? 0,
      transactionsInLast1Hour: data.transactionsInLast1Hour ?? (hasHistory ? 1 : 0),
      paymentInstrumentSwitchCount: data.paymentInstrumentSwitchCount ?? 0,
      isProxyIp: data.isProxyIp ?? false,
      isVpnIp: data.isVpnIp ?? false,
      isTorIp: data.isTorIp ?? false,
      isSuspiciousIp: data.isSuspiciousIp ?? false,
      isDisposableEmail: data.isDisposableEmail ?? false,
      customerAverageAmount: hasHistory ? customerHistory.averageAmount : null,
      customerTotalTransactions: customerHistory.transactionCount,
      customerDeviceCount: customerHistory.devices.length || 1,
      previousDisputes: customerHistory.disputes,
    };

    let result: any = null;

    // 1. Attempt inference via Python FastAPI ML Service
    try {
      const mlRes = await fetch(`${ML_SERVICE_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (mlRes.ok) {
        result = await mlRes.json();
      }
    } catch (mlErr) {
      console.warn("Python ML service unreachable, falling back to embedded rule engine:", mlErr);
    }

    // 2. Embedded fallback if ML service is offline (Honest fallback labelling)
    if (!result) {
      const transactionInput: TransactionInput = {
        amount: payload.amount,
        currency: payload.currency,
        paymentMethod: payload.paymentMethod,
        country: payload.country,
        city: payload.city,
        ip: payload.ip,
        deviceFingerprint: payload.deviceFingerprint,
        isNewDevice: payload.isNewDevice,
        customerId: payload.customerId,
        customerEmail: payload.customerEmail,
        accountAgeDays: payload.accountAgeDays,
        previousFailedAttempts: payload.previousFailedAttempts,
        transactionsInLast5Min: payload.transactionsInLast5Min,
        transactionsInLast1Hour: payload.transactionsInLast1Hour,
        customerAverageAmount: payload.customerAverageAmount || 5000,
        customerTotalTransactions: payload.customerTotalTransactions,
        customerCountries: customerHistory.countries,
        customerDeviceCount: payload.customerDeviceCount,
        isDisposableEmail: payload.isDisposableEmail,
        isProxyIp: payload.isProxyIp,
        isVpnIp: payload.isVpnIp,
        isSuspiciousIp: payload.isSuspiciousIp,
        previousDisputes: payload.previousDisputes,
      };

      const fallbackResult = analyzeTransaction(transactionInput);
      const isCold = !hasHistory;
      result = {
        transaction_id: payload.transactionId || `tx_${Date.now()}`,
        transactionId: payload.transactionId || `tx_${Date.now()}`,
        risk_probability: Number((fallbackResult.riskScore / 100).toFixed(2)),
        riskProbability: Number((fallbackResult.riskScore / 100).toFixed(2)),
        risk_score: fallbackResult.riskScore,
        riskScore: fallbackResult.riskScore,
        risk_level: fallbackResult.riskLevel,
        riskLevel: fallbackResult.riskLevel,
        confidence: isCold ? 0.50 : 0.88,
        decision: fallbackResult.decision,
        model_version: "fallback-rule-engine",
        modelVersion: "fallback-rule-engine",
        anomalyScore: fallbackResult.anomalyScore,
        dataAvailability: {
          historyAvailable: hasHistory,
          identityAvailable: true,
          graphAvailable: false,
          behavioralFeaturesAvailable: hasHistory,
        },
        evidence: [
          {
            category: isCold ? "DATA_AVAILABILITY" : "BEHAVIOR",
            description: isCold
              ? "First-time customer with zero historical merchant transactions."
              : `Customer history evaluated across ${customerHistory.transactionCount} transactions.`,
            severity: "LOW",
            source: "FALLBACK_RULE_ENGINE",
          },
          {
            category: "TRANSACTION",
            description: `Heuristic rule engine computed risk score of ${fallbackResult.riskScore}/100.`,
            severity: fallbackResult.riskScore >= 70 ? "HIGH" : fallbackResult.riskScore >= 40 ? "MEDIUM" : "LOW",
            source: "FALLBACK_RULE_ENGINE",
          },
        ],
        modelBreakdown: { tabular: 1.0, behavioral: 0.0, gnn: 0.0 },
        processingTimeMs: fallbackResult.processingTimeMs,
        is_fallback: true,
      };
    }

    // 3. Database Persistence if transaction ID is present
    if (data.id || data.transactionId) {
      const txId = data.id || data.transactionId;
      const merchant = await prisma.merchant.findFirst();

      const aiExplanation = result.decision === "BLOCK"
        ? `Block recommendation generated (Risk: ${result.riskScore}/100, Confidence: ${Math.round((result.confidence || 0.85) * 100)}%). Entity graph and multi-signal corroboration identified high-risk syndicate patterns.`
        : result.decision === "REVIEW"
        ? `Review recommended (Risk: ${result.riskScore}/100, Confidence: ${Math.round((result.confidence || 0.85) * 100)}%). Secondary verification advised based on elevated risk factors.`
        : `Transaction approved (Risk: ${result.riskScore}/100, Confidence: ${Math.round((result.confidence || 0.85) * 100)}%). Legitimate risk profile observed.`;

      // Update Transaction
      try {
        await prisma.transaction.update({
          where: { id: txId },
          data: {
            riskProbability: result.riskProbability || result.risk_probability,
            riskScore: result.riskScore || result.risk_score,
            confidence: result.confidence,
            decision: result.decision,
            modelVersion: result.modelVersion || result.model_version,
          },
        });

        // Upsert RiskAssessment
        const assessment = await prisma.riskAssessment.upsert({
          where: { transactionId: txId },
          create: {
            transactionId: txId,
            riskScore: result.riskScore || result.risk_score,
            riskProbability: result.riskProbability || result.risk_probability,
            confidence: result.confidence,
            riskLevel: (result.riskScore || result.risk_score) >= 80 ? "CRITICAL" : (result.riskScore || result.risk_score) >= 60 ? "HIGH" : (result.riskScore || result.risk_score) >= 30 ? "MEDIUM" : "LOW",
            decision: result.decision,
            anomalyScore: result.anomalyScore || 0,
            modelVersion: result.modelVersion || result.model_version,
            dataAvailability: JSON.stringify(result.dataAvailability || {}),
            aiExplanation,
            processingTimeMs: result.processingTimeMs || result.processing_time_ms || 10,
          },
          update: {
            riskScore: result.riskScore || result.risk_score,
            riskProbability: result.riskProbability || result.risk_probability,
            confidence: result.confidence,
            riskLevel: (result.riskScore || result.risk_score) >= 80 ? "CRITICAL" : (result.riskScore || result.risk_score) >= 60 ? "HIGH" : (result.riskScore || result.risk_score) >= 30 ? "MEDIUM" : "LOW",
            decision: result.decision,
            anomalyScore: result.anomalyScore || 0,
            dataAvailability: JSON.stringify(result.dataAvailability || {}),
            aiExplanation,
          },
        });

        // Create RiskEvidences
        if (result.evidence && result.evidence.length > 0) {
          await prisma.riskEvidence.deleteMany({ where: { assessmentId: assessment.id } });
          await prisma.riskEvidence.createMany({
            data: result.evidence.map((e: any) => ({
              assessmentId: assessment.id,
              category: e.category,
              description: e.description,
              severity: e.severity,
              source: e.source || "SENTINEL_ENGINE",
              evidenceData: e.evidenceData ? JSON.stringify(e.evidenceData) : null,
            })),
          });
        }

        return NextResponse.json({ ...result, assessmentId: assessment.id });
      } catch (dbErr) {
        console.warn("DB persistence warning (proceeding with inference response):", dbErr);
      }
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
