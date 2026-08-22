import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: {
            riskAssessment: true,
          }
        },
        customerDevices: {
          include: { device: true }
        },
        riskCases: {
          orderBy: { createdAt: "desc" }
        }
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const stats = await prisma.transaction.aggregate({
      where: { customerId: id },
      _count: { id: true },
      _sum: { amount: true },
      _avg: { amount: true }
    });
    
    const failedCount = await prisma.transaction.count({
      where: { customerId: id, status: 'FAILED' }
    });

    const formattedCustomer = {
      ...customer,
      devices: customer.customerDevices,
      transactions: customer.transactions.map((tx: any) => ({
        ...tx,
        amount: Number(tx.amount)
      })),
      stats: {
        totalTransactions: stats._count.id,
        totalSpending: Number(stats._sum.amount || 0),
        avgAmount: Number(stats._avg.amount || 0),
        failedCount
      }
    };

    return NextResponse.json(formattedCustomer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}
