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
      const ring = data.rings.find((r: any) => r.id.toUpperCase() === ringId);
      
      if (!ring) {
        return NextResponse.json({ error: `Ring ${ringId} not found` }, { status: 404 });
      }

      const ringTxs = data.transactions.filter((tx: any) => tx.cluster_id === ring.id);
      const customers = Array.from(new Set(ringTxs.map((tx: any) => tx.customer_id)));
      const devices = Array.from(new Set(ringTxs.map((tx: any) => tx.device_id)));
      const ips = Array.from(new Set(ringTxs.map((tx: any) => tx.ip_id)));
      const cards = Array.from(new Set(ringTxs.map((tx: any) => tx.payment_id)));

      return NextResponse.json({
        ring,
        blast_radius: {
          affected_customers: customers.length,
          affected_transactions: ringTxs.length,
          affected_devices: devices.length,
          affected_ips: ips.length,
          affected_payments: cards.length,
          total_exposure: ring.exposure,
        },
        dna: ring.dna,
        signals: ring.signals,
      });
    }
    return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching ring detail:", error);
    return NextResponse.json({ error: "Failed to fetch ring detail" }, { status: 500 });
  }
}
