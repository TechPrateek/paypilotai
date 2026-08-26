import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "ml-service", "config", "server_configuration.json");

const DEFAULT_CONFIG = {
  cost_fp: 450.0,
  cost_fn: 4500.0,
  cost_review: 50.0,
  operating_threshold: 0.70,
  min_ring_size: 3,
  temporal_window_seconds: 120,
  velocity_window_seconds: 60,
  min_signals: 3,
  webhook_url: "https://api.sentinel.internal/webhooks/ring-alert",
  alerts_enabled: true,
  updated_at: new Date().toISOString(),
};

function getStoredConfig() {
  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    }
  } catch (err) {
    console.warn("Could not read server config, using defaults:", err);
  }
  return DEFAULT_CONFIG;
}

export async function GET() {
  const config = getStoredConfig();
  return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation
    const cost_fp = Number(body.cost_fp || body.costFp || 450.0);
    const cost_fn = Number(body.cost_fn || body.costFn || 4500.0);
    const cost_review = Number(body.cost_review || body.costReview || 50.0);
    const operating_threshold = Number(body.operating_threshold || body.operatingThreshold || 0.70);
    const min_ring_size = Number(body.min_ring_size || body.minRingSize || 3);
    const temporal_window = Number(body.temporal_window_seconds || body.temporalWindow || 120);

    if (cost_fp <= 0 || cost_fn <= 0) {
      return NextResponse.json({ error: "Cost parameters C_FP and C_FN must be > 0" }, { status: 400 });
    }
    if (operating_threshold <= 0 || operating_threshold >= 1) {
      return NextResponse.json({ error: "Operating threshold must be between 0 and 1" }, { status: 400 });
    }
    if (min_ring_size < 2) {
      return NextResponse.json({ error: "Minimum ring size must be >= 2" }, { status: 400 });
    }

    const newConfig = {
      cost_fp,
      cost_fn,
      cost_review,
      operating_threshold,
      min_ring_size,
      temporal_window_seconds: temporal_window,
      velocity_window_seconds: Number(body.velocity_window_seconds || body.velocityWindow || 60),
      min_signals: Number(body.min_signals || body.minSignals || 3),
      webhook_url: body.webhook_url || body.webhookUrl || "https://api.sentinel.internal/webhooks/ring-alert",
      alerts_enabled: body.alerts_enabled !== undefined ? body.alerts_enabled : true,
      updated_at: new Date().toISOString(),
    };

    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Server configuration updated successfully.",
      configuration: newConfig,
    });
  } catch (error) {
    console.error("Configuration API error:", error);
    return NextResponse.json({ error: "Failed to update configuration" }, { status: 500 });
  }
}
