import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        customer: true,
        merchant: true,
        riskAssessment: {
          include: {
            riskFactors: true,
          },
        },
        riskCase: {
          include: {
            notes: {
              include: {
                author: true,
              },
              orderBy: { createdAt: "desc" },
            },
            assignedAnalyst: true,
          },
        },
        alerts: true,
        device: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const formattedTransaction = {
      ...transaction,
      amount: Number(transaction.amount),
    };

    return NextResponse.json(formattedTransaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}
