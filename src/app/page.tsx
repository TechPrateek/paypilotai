import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Share2,
  ShieldAlert,
  ArrowRight,
  Activity,
  Network,
  Users,
  Search,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-rose-500/20 overflow-x-hidden font-sans">
      {/* Top Simple Header */}
      <header className="h-16 border-b border-border/40 px-4 sm:px-8 flex items-center justify-between bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5 font-bold text-sm tracking-tight text-foreground font-mono">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <Share2 className="h-4 w-4" />
          </div>
          <span>PAYPILOT</span>
          <span className="text-rose-500">AI</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/overview">
            <Button size="sm" className="h-8 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs gap-1.5">
              <span>Open Console</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 sm:py-28 px-4 flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          <Badge variant="outline" className="font-mono text-xs text-rose-500 border-rose-500/30 px-3 py-1">
            Track 02 — AI Risk Manager
          </Badge>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight font-mono">
            PayPilot AI <br className="hidden sm:inline" />
            <span className="text-rose-500">Abuse-Ring Sentinel</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl font-medium leading-relaxed">
            "Are apparently independent payment accounts actually connected and behaving as a coordinated abuse ring?"
            Sentinel uncovers multi-account syndicates, device farms, and botnet bursts using graph intelligence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/overview">
              <Button size="lg" className="h-11 px-6 font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md gap-2">
                <Share2 className="h-4 w-4" />
                <span>Launch Sentinel Overview</span>
              </Button>
            </Link>

            <Link href="/investigations/RING-0042">
              <Button size="lg" variant="outline" className="h-11 px-6 font-bold text-xs sm:text-sm rounded-xl border-border/60 gap-2">
                <Search className="h-4 w-4 text-emerald-500" />
                <span>Investigate Flagship Ring #0042</span>
              </Button>
            </Link>

            <Link href="/evaluation">
              <Button size="lg" variant="outline" className="h-11 px-6 font-bold text-xs sm:text-sm rounded-xl border-border/60 gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span>Held-Out Evaluation</span>
              </Button>
            </Link>
          </div>
        </section>

        {/* 3 Core Architecture Pillars */}
        <section className="py-12 border-t border-border/40 bg-muted/10 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-card border border-border/60 space-y-2">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 w-fit">
                <Network className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-base font-mono">1. Heterogeneous Graph</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connects Customers, Devices, IPs, and Payment Instruments across multi-hop edges to uncover shared hardware and card rotation.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/60 space-y-2">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 w-fit">
                <Activity className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-base font-mono">2. Temporal Burst Detection</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tracks sub-minute sliding window bursts (e.g. 18 transactions in 120 seconds) to catch automated bot attacks.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/60 space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-base font-mono">3. False-Positive Control</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Protects legitimate shared infrastructure (offices, families) from false flags by verifying personal device independence.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t border-border/40 px-4 text-center text-xs font-mono text-muted-foreground">
        Abuse-Ring Sentinel • Track 02 — AI Risk Manager • Defensive Graph Intelligence Platform
      </footer>
    </div>
  );
}
