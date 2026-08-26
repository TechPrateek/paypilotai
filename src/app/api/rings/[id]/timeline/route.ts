import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const ringId = params.id.toUpperCase();
    const datasetPath = path.join(process.cwd(), "ml-service", "dataset", "synthetic_abuse_dataset.json");
    
    if (fs.existsSync(datasetPath)) {
      const data = JSON.parse(fs.readFileSync(datasetPath, "utf-8"));
      const ringTxs = data.transactions.filter((tx: any) => tx.cluster_id === ringId);
      ringTxs.sort((a: any, b: any) => a.timestamp_unix - b.timestamp_unix);

      const firstTime = ringTxs[0]?.timestamp_unix || 0;
      const lastTime = ringTxs[ringTxs.length - 1]?.timestamp_unix || 0;
      const durationSec = Math.max(lastTime - firstTime, 1);

      return NextResponse.json({
        ring_id: ringId,
        total_events: ringTxs.length,
        duration_seconds: durationSec,
        summary: `${ringTxs.length} coordinated events executed over ${durationSec}s window`,
        events: ringTxs.map((tx: any) => ({
          id: tx.id,
          timestamp: tx.timestamp,
          customer_id: tx.customer_id,
          device_id: tx.device_id,
          ip_id: tx.ip_id,
          amount: tx.amount,
          is_fraud: tx.is_fraud,
        })),
      });
    }
    return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching ring timeline:", error);
    return NextResponse.json({ error: "Failed to fetch ring timeline" }, { status: 500 });
  }
}
