import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const transactionId = params.id;

    // 1. Attempt fetching from Python FastAPI graph builder
    try {
      const mlRes = await fetch(`${ML_SERVICE_URL}/api/graph/${transactionId}`);
      if (mlRes.ok) {
        const graphData = await mlRes.json();
        return NextResponse.json(graphData);
      }
    } catch (mlErr) {
      console.warn("ML Graph service fallback:", mlErr);
    }

    // 2. Fallback: Build graph directly from Prisma database
    const tx = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        customer: true,
        device: true,
        network: true,
        paymentInstrument: true,
        merchant: true,
      },
    });

    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const nodes: any[] = [
      {
        id: tx.id,
        label: `Tx: ₹${tx.amount.toLocaleString()}`,
        type: "Transaction",
        isTarget: true,
        riskScore: tx.riskScore || 20,
        properties: { amount: tx.amount, status: tx.status, method: tx.paymentMethod },
      },
      {
        id: tx.customer.id,
        label: `Customer: ${tx.customer.name}`,
        type: "Customer",
        isTarget: false,
        properties: { email: tx.customer.email, country: tx.customer.country },
      },
    ];

    const edges: any[] = [
      {
        id: `${tx.customer.id}_${tx.id}`,
        source: tx.customer.id,
        target: tx.id,
        relationship: "MADE",
      },
    ];

    if (tx.device) {
      nodes.push({
        id: tx.device.id,
        label: `Device: ${tx.device.deviceType || "Browser"}`,
        type: "Device",
        isTarget: false,
        properties: { os: tx.device.os, browser: tx.device.browser },
      });
      edges.push({
        id: `${tx.id}_${tx.device.id}`,
        source: tx.id,
        target: tx.device.id,
        relationship: "USED_DEVICE",
      });
    }

    if (tx.network) {
      nodes.push({
        id: tx.network.id,
        label: `Net: ${tx.network.ipAddress || tx.network.type}`,
        type: "Network",
        isTarget: false,
        properties: { ip: tx.network.ipAddress, type: tx.network.type, country: tx.network.country },
      });
      edges.push({
        id: `${tx.id}_${tx.network.id}`,
        source: tx.id,
        target: tx.network.id,
        relationship: "FROM_NETWORK",
      });
    }

    if (tx.paymentInstrument) {
      nodes.push({
        id: tx.paymentInstrument.id,
        label: `Pmt: ${tx.paymentInstrument.type}`,
        type: "PaymentInstrument",
        isTarget: false,
        properties: { brand: tx.paymentInstrument.cardBrand, last4: tx.paymentInstrument.last4 },
      });
      edges.push({
        id: `${tx.id}_${tx.paymentInstrument.id}`,
        source: tx.id,
        target: tx.paymentInstrument.id,
        relationship: "USED_PAYMENT",
      });
    }

    if (tx.merchant) {
      nodes.push({
        id: tx.merchant.id,
        label: `Merchant: ${tx.merchant.name}`,
        type: "Merchant",
        isTarget: false,
        properties: { type: tx.merchant.businessType },
      });
      edges.push({
        id: `${tx.id}_${tx.merchant.id}`,
        source: tx.id,
        target: tx.merchant.id,
        relationship: "BELONGS_TO",
      });
    }

    return NextResponse.json({
      transactionId: tx.id,
      nodes,
      edges,
      graphDensity: 0.25,
      sharedEntityCount: 0,
    });
  } catch (error) {
    console.error("Error fetching transaction graph:", error);
    return NextResponse.json({ error: "Failed to load graph" }, { status: 500 });
  }
}
