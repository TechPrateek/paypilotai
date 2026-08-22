import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ transactions: [], customers: [], cases: [] });
    }

    const [transactions, customers, cases] = await Promise.all([
      prisma.transaction.findMany({
        where: { externalId: { contains: q } },
        take: 5
      }),
      prisma.customer.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { externalId: { contains: q } }
          ]
        },
        take: 5
      }),
      prisma.riskCase.findMany({
        where: { id: { contains: q } },
        take: 5
      })
    ]);

    return NextResponse.json({
      transactions: transactions.map(t => ({ ...t, amount: Number(t.amount) })),
      customers,
      cases
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
