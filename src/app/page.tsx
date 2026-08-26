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
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-red-500/20 overflow-x-hidden font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-border/40 px-4 sm:px-8 flex items-center justify-between bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5 font-bold text-sm tracking-tight text-foreground font-mono">
          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
            <Share2 className="h-4 w-4" />
          </div>
          <span>ABUSE-RING</span>
          <span className="text-red-500">SENTINEL</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/overview">
            <Button size="sm" className="h-8 text-xs font-bold font-mono bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs gap-1.5 cursor-pointer">
              <span>OPEN CONSOLE</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 sm:py-28 px-4 flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          <Badge variant="outline" className="font-mono text-xs text-red-500 border-red-500/30 px-3 py-1">
            AI Risk Manager — Track 02
          </Badge>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight font-mono">
            ABUSE-RING <br className="hidden sm:inline" />
            <span className="text-red-500">SENTINEL</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground font-mono font-bold uppercase tracking-wider">
            Coordinated Payment Abuse Detection Platform
          </p>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl font-medium leading-relaxed">
            Detect coordinated payment abuse, fraud rings, and shared infrastructure using heterogeneous graph intelligence and temporal risk signals.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/overview">
              <Button size="lg" className="h-11 px-6 font-bold font-mono text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md gap-2 cursor-pointer">
                <Share2 className="h-4 w-4" />
                <span>LAUNCH OVERVIEW</span>
              </Button>
            </Link>

            <Link href="/investigations/RING-0042">
              <Button size="lg" variant="outline" className="h-11 px-6 font-bold font-mono text-xs sm:text-sm rounded-xl border-border/60 gap-2 cursor-pointer">
                <Search className="h-4 w-4 text-red-500" />
                <span>INVESTIGATE RING-0042</span>
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs font-mono text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Multi-Hop Graph</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 96.6% Held-Out F1</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> False-Positive Protection</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 px-4 text-center font-mono text-xs text-muted-foreground">
        Abuse-Ring Sentinel | AI Risk Manager — Track 02 | Evaluated on Synthetic Dataset
      </footer>
    </div>
  );
}
