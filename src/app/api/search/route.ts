import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const q = (searchParams.get("q") || "").trim().toLowerCase();

    if (!q || q.length < 1) {
      return NextResponse.json({
        rings: [],
        transactions: [],
        customers: [],
        devices: [],
        ips: []
      });
    }

    const datasetPath = path.join(process.cwd(), "ml-service", "dataset", "synthetic_abuse_dataset.json");
    let rings: any[] = [];
    let transactions: any[] = [];
    let customers: any[] = [];
    let devices: any[] = [];
    let ips: any[] = [];

    if (fs.existsSync(datasetPath)) {
      const data = JSON.parse(fs.readFileSync(datasetPath, "utf-8"));

      // 1. Search Rings
      rings = (data.rings || [])
        .filter((r: any) =>
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.pattern_type.toLowerCase().includes(q) ||
          r.severity.toLowerCase().includes(q)
        )
        .slice(0, 5);

      // 2. Search Transactions
      transactions = (data.transactions || [])
        .filter((t: any) =>
          t.id.toLowerCase().includes(q) ||
          t.customer_id.toLowerCase().includes(q) ||
          t.device_id.toLowerCase().includes(q) ||
          t.cluster_id?.toLowerCase().includes(q)
        )
        .slice(0, 6);

      // 3. Search Customers
      customers = (data.customers || [])
        .filter((c: any) =>
          c.id.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
        )
        .slice(0, 5);

      // 4. Search Devices
      devices = (data.devices || [])
        .filter((d: any) =>
          d.id.toLowerCase().includes(q) ||
          d.fingerprint.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q)
        )
        .slice(0, 5);

      // 5. Search IPs
      ips = (data.ips || [])
        .filter((ip: any) =>
          ip.id.toLowerCase().includes(q) ||
          ip.ip.toLowerCase().includes(q) ||
          ip.type.toLowerCase().includes(q)
        )
        .slice(0, 5);
    }

    return NextResponse.json({
      rings,
      transactions,
      customers,
      devices,
      ips
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
