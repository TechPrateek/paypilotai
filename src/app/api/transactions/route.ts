import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const riskLevel = searchParams.get("riskLevel");
    const decision = searchParams.get("decision");
    const status = searchParams.get("status");
    const country = searchParams.get("country");
    const paymentMethod = searchParams.get("paymentMethod");
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const search = searchParams.get("search");
    const customerId = searchParams.get("customerId");

    const where: Prisma.TransactionWhereInput = {};

    if (riskLevel) {
      where.riskAssessment = { riskLevel: riskLevel as any };
    }
    if (decision) {
      where.riskAssessment = { ...where.riskAssessment, decision: decision as any };
    }
    if (status) {
      where.status = status;
    }
    if (country) {
      where.country = country;
    }
    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }
    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount.gte = parseFloat(minAmount);
      if (maxAmount) where.amount.lte = parseFloat(maxAmount);
    }
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }
    if (customerId) {
      where.customerId = customerId;
    }
    if (search) {
      where.OR = [
        { externalId: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { email: { contains: search } } },
      ];
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          customer: true,
          riskAssessment: {
            include: {
              riskFactors: true,
            },
          },
          device: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    const formattedTransactions = transactions.map((tx: any) => ({
      ...tx,
      amount: Number(tx.amount),
    }));

    return NextResponse.json({
      data: formattedTransactions,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
