import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const filter = searchParams.get("filter") || "ALL";

    // 1. Try fetching from database
    try {
      const dbCount = await prisma.transaction.count();
      if (dbCount > 0) {
        const txs = await prisma.transaction.findMany({
          take: limit,
          skip: (page - 1) * limit,
          orderBy: { createdAt: "desc" },
          include: {
            customer: true,
            device: true,
            riskAssessment: true,
          },
        });

        return NextResponse.json({
          total: dbCount,
          page,
          totalPages: Math.ceil(dbCount / limit),
          transactions: txs.map((t) => ({
            id: t.id,
            externalId: t.externalId,
            amount: Number(t.amount),
            currency: t.currency,
            paymentMethod: t.paymentMethod,
            country: t.country,
            timestamp: t.createdAt.toISOString(),
            customer_id: t.customerId,
            customerName: t.customer?.name || "Customer",
            device_id: t.deviceId || "D101",
            ip_id: t.ip || "192.168.1.1",
            is_fraud: t.riskAssessment?.riskLevel === "CRITICAL" || t.riskAssessment?.riskLevel === "HIGH",
            cluster_id: t.riskAssessment?.riskLevel === "CRITICAL" ? "RING-0042" : undefined,
          })),
        });
      }
    } catch (dbErr) {
      console.warn("DB query failed, using synthetic dataset fallback:", dbErr);
    }

    // 2. Fallback to rich synthetic dataset (301 transactions)
    const datasetPath = path.join(process.cwd(), "ml-service", "dataset", "synthetic_abuse_dataset.json");
    if (fs.existsSync(datasetPath)) {
      const data = JSON.parse(fs.readFileSync(datasetPath, "utf-8"));
      let allTxs = data.transactions || [];

      // Attach customer names if available
      const customerMap = new Map((data.customers || []).map((c: any) => [c.id, c.name]));

      allTxs = allTxs.map((t: any) => ({
        ...t,
        customerName: customerMap.get(t.customer_id) || `Customer ${t.customer_id}`,
        paymentMethod: t.amount > 5000 ? "CREDIT_CARD" : "UPI",
      }));

      // Apply search query
      if (search) {
        allTxs = allTxs.filter(
          (t: any) =>
            t.id.toLowerCase().includes(search) ||
            t.customer_id.toLowerCase().includes(search) ||
            t.customerName.toLowerCase().includes(search) ||
            t.device_id.toLowerCase().includes(search) ||
            t.ip_id.toLowerCase().includes(search) ||
            t.cluster_id?.toLowerCase().includes(search)
        );
      }

      // Apply status filter
      if (filter === "FLAGGED") {
        allTxs = allTxs.filter((t: any) => t.is_fraud);
      } else if (filter === "CLEAN") {
        allTxs = allTxs.filter((t: any) => !t.is_fraud);
      }

      const total = allTxs.length;
      const paginated = allTxs.slice((page - 1) * limit, page * limit);

      return NextResponse.json({
        total,
        page,
        totalPages: Math.ceil(total / limit),
        transactions: paginated,
      });
    }

    return NextResponse.json({ total: 0, transactions: [] });
  } catch (error) {
    console.error("Transactions API error:", error);
    return NextResponse.json({ error: "Failed to load transactions" }, { status: 500 });
  }
}
