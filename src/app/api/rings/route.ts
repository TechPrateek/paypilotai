import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const datasetPath = path.join(process.cwd(), "ml-service", "dataset", "synthetic_abuse_dataset.json");
    if (fs.existsSync(datasetPath)) {
      const data = JSON.parse(fs.readFileSync(datasetPath, "utf-8"));
      return NextResponse.json({
        rings: data.rings,
        total_rings: data.rings.length,
        active_rings_count: data.rings.filter((r: any) => r.status === "ACTIVE_THREAT").length,
        critical_rings_count: data.rings.filter((r: any) => r.severity === "CRITICAL").length,
        total_exposure: data.rings.reduce((acc: number, r: any) => acc + r.exposure, 0),
        total_accounts_affected: data.rings.reduce((acc: number, r: any) => acc + r.accounts_count, 0),
      });
    }
    return NextResponse.json({ rings: [] });
  } catch (error) {
    console.error("Error loading rings:", error);
    return NextResponse.json({ error: "Failed to load rings" }, { status: 500 });
  }
}
