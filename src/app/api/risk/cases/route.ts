import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const assignedAnalystId = searchParams.get("assignedAnalystId");

    const where: Prisma.RiskCaseWhereInput = {};

    if (status) {
      where.status = status as any;
    }
    if (priority) {
      where.priority = priority as any;
    }
    if (assignedAnalystId) {
      where.assignedAnalystId = assignedAnalystId;
    }

    const [cases, total] = await Promise.all([
      prisma.riskCase.findMany({
        where,
        include: {
          transaction: true,
          customer: true,
          assignedAnalyst: true,
          _count: {
            select: { notes: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.riskCase.count({ where }),
    ]);

    return NextResponse.json({
      data: cases,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json(
      { error: "Failed to fetch risk cases" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId } = body;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { riskAssessment: true }
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    let priority = "MEDIUM";
    const score = transaction.riskAssessment?.riskScore || 0;
    if (score >= 90) priority = "CRITICAL";
    else if (score >= 70) priority = "HIGH";
    else if (score < 40) priority = "LOW";

    const riskCase = await prisma.riskCase.create({
      data: {
        transactionId,
        customerId: transaction.customerId,
        status: "OPEN",
        priority: priority as any,
      },
    });

    return NextResponse.json(riskCase, { status: 201 });
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { error: "Failed to create risk case" },
      { status: 500 }
    );
  }
}
