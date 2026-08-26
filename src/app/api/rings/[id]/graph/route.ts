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
      
      const nodes: any[] = [];
      const edges: any[] = [];
      const nodeIds = new Set<string>();

      // Devices
      ringTxs.forEach((tx: any) => {
        const did = `dev_${tx.device_id}`;
        if (!nodeIds.has(did)) {
          nodeIds.add(did);
          nodes.push({
            id: did,
            type: "device",
            data: { label: `Device ${tx.device_id}`, type: "Device", risk: "CRITICAL", entityId: tx.device_id },
            position: { x: 380 + (nodes.length % 3) * 60, y: 180 + Math.floor(nodes.length / 3) * 60 },
          });
        }
      });

      // IPs
      ringTxs.forEach((tx: any) => {
        const ipid = `ip_${tx.ip_id}`;
        if (!nodeIds.has(ipid)) {
          nodeIds.add(ipid);
          nodes.push({
            id: ipid,
            type: "ip",
            data: { label: `IP ${tx.ip_id}`, type: "IP", risk: "CRITICAL", entityId: tx.ip_id },
            position: { x: 380, y: 50 },
          });
        }
      });

      // Customers
      ringTxs.forEach((tx: any, idx: number) => {
        const cid = `cust_${tx.customer_id}`;
        if (!nodeIds.has(cid)) {
          nodeIds.add(cid);
          const isLeft = idx % 2 === 0;
          nodes.push({
            id: cid,
            type: "customer",
            data: { label: `Customer ${tx.customer_id}`, type: "Customer", risk: "HIGH", entityId: tx.customer_id },
            position: { x: isLeft ? 150 : 600, y: 120 + (idx * 40) % 240 },
          });
        }
      });

      // Payment Instruments
      ringTxs.forEach((tx: any, idx: number) => {
        const pid = `pay_${tx.payment_id}`;
        if (!nodeIds.has(pid)) {
          nodeIds.add(pid);
          const isLeft = idx % 2 === 0;
          nodes.push({
            id: pid,
            type: "payment",
            data: { label: `Card ${tx.payment_id}`, type: "PaymentInstrument", risk: "HIGH", entityId: tx.payment_id },
            position: { x: isLeft ? 40 : 720, y: 120 + (idx * 40) % 240 },
          });
        }
      });

      // Edges
      const edgeSet = new Set<string>();
      ringTxs.forEach((tx: any) => {
        const cid = `cust_${tx.customer_id}`;
        const did = `dev_${tx.device_id}`;
        const ipid = `ip_${tx.ip_id}`;
        const pid = `pay_${tx.payment_id}`;

        const relations = [
          { s: cid, t: did, label: "USES_DEVICE" },
          { s: cid, t: ipid, label: "USES_IP" },
          { s: cid, t: pid, label: "USES_PAYMENT" },
        ];

        relations.forEach(({ s, t, label }) => {
          const key = `${s}->${t}:${label}`;
          if (!edgeSet.has(key)) {
            edgeSet.add(key);
            edges.push({
              id: `e_${edges.length + 1}`,
              source: s,
              target: t,
              label,
              animated: label === "USES_DEVICE",
            });
          }
        });
      });

      return NextResponse.json({
        ring_id: ring.id,
        nodes,
        edges,
        total_nodes: nodes.length,
        total_edges: edges.length,
      });
    }
    return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching ring graph:", error);
    return NextResponse.json({ error: "Failed to fetch ring graph" }, { status: 500 });
  }
}
