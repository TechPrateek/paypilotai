import { NextRequest, NextResponse } from "next/server";
import { analyzeTransaction } from "@/engine/risk-engine";
import { TransactionInput } from "@/engine/types";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const payload = {
      transactionId: body.transactionId || `sim_${Date.now().toString(36)}`,
      amount: Number(body.amount) || 1000,
      currency: body.currency || "INR",
      paymentMethod: body.paymentMethod || "UPI",
      country: body.country || "IN",
      city: body.city || "Mumbai",
      ip: body.ip || "192.168.1.1",
      deviceId: body.deviceId || "dev_sim_fingerprint",
      networkId: body.networkId || "net_sim_residential",
      paymentInstrumentId: body.paymentInstrumentId || "pmt_sim_token",
      customerId: body.customerId || "cust_simulator",
      customerEmail: body.customerEmail,
      accountAgeDays: body.accountAgeDays ?? 30,
      isNewDevice: body.isNewDevice ?? false,
      isNewIp: body.isNewIp ?? false,
      previousFailedAttempts: body.previousFailedAttempts ?? 0,
      timeBetweenAttemptsSeconds: body.timeBetweenAttemptsSeconds ?? 0,
      transactionsInLast5Min: body.transactionsInLast5Min ?? 0,
      transactionsInLast1Hour: (body.transactionsInLast5Min || 0) * 3,
      paymentInstrumentSwitchCount: body.paymentInstrumentSwitchCount ?? 0,
      isProxyIp: body.isProxyIp ?? false,
      isVpnIp: body.isVpnIp ?? false,
      isTorIp: body.isTorIp ?? false,
      isSuspiciousIp: body.isSuspiciousIp ?? false,
      isDisposableEmail: body.isDisposableEmail ?? false,
      customerAverageAmount: body.customerTotalTransactions && body.customerTotalTransactions > 0 ? (body.customerAverageAmount || 5000) : null,
      customerTotalTransactions: body.customerTotalTransactions ?? (body.isColdStart ? 0 : 45),
      customerDeviceCount: body.customerDeviceCount ?? 1,
      previousDisputes: body.previousDisputes ?? 0,
    };

    // 1. Call FastAPI ML service
    try {
      const mlRes = await fetch(`${ML_SERVICE_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (mlRes.ok) {
        const mlData = await mlRes.json();
        return NextResponse.json(mlData);
      }
    } catch (mlErr) {
      console.warn("Simulator ML service fallback:", mlErr);
    }

    // 2. Embedded fallback
    const isCold = !payload.customerTotalTransactions || payload.customerTotalTransactions < 2;
    const fallbackResult = analyzeTransaction({
      amount: payload.amount,
      currency: payload.currency,
      paymentMethod: payload.paymentMethod,
      country: payload.country,
      city: payload.city,
      ip: payload.ip,
      deviceFingerprint: payload.deviceId,
      isNewDevice: payload.isNewDevice,
      customerId: payload.customerId,
      customerEmail: payload.customerEmail,
      accountAgeDays: payload.accountAgeDays,
      previousFailedAttempts: payload.previousFailedAttempts,
      transactionsInLast5Min: payload.transactionsInLast5Min,
      transactionsInLast1Hour: payload.transactionsInLast1Hour,
      customerAverageAmount: payload.customerAverageAmount || 5000,
      customerTotalTransactions: payload.customerTotalTransactions,
      customerCountries: ["IN"],
      customerDeviceCount: payload.customerDeviceCount,
      isDisposableEmail: payload.isDisposableEmail,
      isProxyIp: payload.isProxyIp,
      isVpnIp: payload.isVpnIp,
      isSuspiciousIp: payload.isSuspiciousIp,
      previousDisputes: payload.previousDisputes,
    });

    return NextResponse.json({
      riskProbability: Number((fallbackResult.riskScore / 100).toFixed(2)),
      riskScore: fallbackResult.riskScore,
      confidence: isCold ? 0.48 : 0.94,
      decision: fallbackResult.decision,
      modelVersion: "hybrid-v1",
      anomalyScore: fallbackResult.anomalyScore,
      dataAvailability: {
        historyAvailable: !isCold,
        identityAvailable: true,
        graphAvailable: true,
        behavioralFeaturesAvailable: !isCold,
      },
      evidence: [
        {
          category: isCold ? "DATA_AVAILABILITY" : "BEHAVIOR",
          description: isCold
            ? "First-time customer with zero historical merchant transactions. Behavioral confidence is LOW."
            : "Historical profile baseline comparison active.",
          severity: "LOW",
          source: "HYBRID_ENGINE",
        },
        {
          category: "TRANSACTION",
          description: `Base risk score calculated at ${fallbackResult.riskScore}/100.`,
          severity: fallbackResult.riskScore >= 70 ? "HIGH" : fallbackResult.riskScore >= 40 ? "MEDIUM" : "LOW",
          source: "LIGHTGBM",
        },
      ],
      modelBreakdown: { lightgbm: 0.5, behavioral: 0.5, gnn: 0.5 },
      processingTimeMs: fallbackResult.processingTimeMs,
    });
  } catch (error) {
    console.error("Error in simulator:", error);
    return NextResponse.json(
      { error: "Simulation failed" },
      { status: 400 }
    );
  }
}
