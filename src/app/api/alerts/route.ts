import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const read = searchParams.get("read");
    const resolved = searchParams.get("resolved");
    const severity = searchParams.get("severity");

    const where: Prisma.AlertWhereInput = {};

    if (read !== null) where.read = read === "true";
    if (resolved !== null) where.resolved = resolved === "true";
    if (severity) where.severity = severity as any;

    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        transaction: true
      }
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, read, resolved } = body;

    if (!id) {
      return NextResponse.json({ error: "Alert ID required" }, { status: 400 });
    }

    const updateData: any = {};
    if (read !== undefined) updateData.read = read;
    if (resolved !== undefined) updateData.resolved = resolved;

    const alert = await prisma.alert.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error("Error updating alert:", error);
    return NextResponse.json(
      { error: "Failed to update alert" },
      { status: 400 }
    );
  }
}
