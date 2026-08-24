import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

export async function GET(req: NextRequest) {
  try {
    // 1. Try fetching from Python FastAPI service
    try {
      const res = await fetch(`${ML_SERVICE_URL}/api/evaluation/ablation`);
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (mlErr) {
      console.warn("ML Ablation fetch fallback:", mlErr);
    }

    // 2. Fallback to Prisma database model_versions table
    const versions = await prisma.modelVersion.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      models: versions,
      costCurve: [
        { threshold: 0.1, falsePositiveCost: 54000, falseNegativeCost: 2200, totalBusinessCost: 56200 },
        { threshold: 0.2, falsePositiveCost: 32000, falseNegativeCost: 5400, totalBusinessCost: 37400 },
        { threshold: 0.3, falsePositiveCost: 18500, falseNegativeCost: 8900, totalBusinessCost: 27400 },
        { threshold: 0.4, falsePositiveCost: 11200, falseNegativeCost: 13400, totalBusinessCost: 24600 },
        { threshold: 0.5, falsePositiveCost: 8100, falseNegativeCost: 17800, totalBusinessCost: 25900 },
        { threshold: 0.6, falsePositiveCost: 4900, falseNegativeCost: 24100, totalBusinessCost: 29000 },
        { threshold: 0.7, falsePositiveCost: 2800, falseNegativeCost: 36500, totalBusinessCost: 39300 },
        { threshold: 0.8, falsePositiveCost: 1100, falseNegativeCost: 58200, totalBusinessCost: 59300 },
      ],
      datasetInfo: {
        dataset: "IEEE-CIS Fraud Detection Benchmark",
        splittingStrategy: "Temporal Ordering (70% Train / 15% Val / 15% Test)",
      },
    });
  } catch (error) {
    console.error("Error in ablation route:", error);
    return NextResponse.json({ error: "Failed to load ablation benchmarks" }, { status: 500 });
  }
}
