import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { caseUpdateSchema } from "@/lib/validators";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    const riskCase = await prisma.riskCase.findUnique({
      where: { id },
      include: {
        transaction: {
          include: {
            riskAssessment: {
              include: { riskFactors: true }
            }
          }
        },
        customer: true,
        assignedAnalyst: true,
        notes: {
          include: { author: true },
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    if (!riskCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json(riskCase);
  } catch (error) {
    console.error("Error fetching case:", error);
    return NextResponse.json(
      { error: "Failed to fetch risk case" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await req.json();

    const validatedData = caseUpdateSchema.parse(body);

    const updatedCase = await prisma.riskCase.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedCase);
  } catch (error) {
    console.error("Error updating case:", error);
    return NextResponse.json(
      { error: "Failed to update risk case" },
      { status: 400 }
    );
  }
}
