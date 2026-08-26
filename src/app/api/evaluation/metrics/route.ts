import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const evalPath = path.join(process.cwd(), "ml-service", "dataset", "evaluation_results.json");
    if (fs.existsSync(evalPath)) {
      const data = JSON.parse(fs.readFileSync(evalPath, "utf-8"));
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: "Evaluation results not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching evaluation metrics:", error);
    return NextResponse.json({ error: "Failed to fetch evaluation metrics" }, { status: 500 });
  }
}
