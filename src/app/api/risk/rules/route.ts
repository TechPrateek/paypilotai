import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { riskRuleSchema } from "@/lib/validators";

export async function GET() {
  try {
    const rules = await prisma.riskRule.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ],
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error("Error fetching rules:", error);
    return NextResponse.json(
      { error: "Failed to fetch risk rules" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = riskRuleSchema.parse(body);

    const rule = await prisma.riskRule.create({
      data: {
        ...validatedData,
        condition: typeof validatedData.condition === 'string' ? validatedData.condition : JSON.stringify(validatedData.condition),
      },
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error("Error creating rule:", error);
    return NextResponse.json(
      { error: "Failed to create risk rule" },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Rule ID required" }, { status: 400 });
    }

    const validatedData = riskRuleSchema.parse(data);

    const rule = await prisma.riskRule.update({
      where: { id },
      data: {
        ...validatedData,
        condition: typeof validatedData.condition === 'string' ? validatedData.condition : JSON.stringify(validatedData.condition),
      },
    });

    return NextResponse.json(rule);
  } catch (error) {
    console.error("Error updating rule:", error);
    return NextResponse.json(
      { error: "Failed to update risk rule" },
      { status: 400 }
    );
  }
}
