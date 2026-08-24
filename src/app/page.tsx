import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Activity, 
  BrainCircuit, 
  FileSearch,
  ArrowRight,
  Shield,
  Layers,
  Lock,
  Search,
  UserCheck
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LandingHeader } from "@/components/shared/landing-header";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 sm:py-20 md:py-28 lg:py-36 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:32px_32px]" />
          <div className="absolute inset-0 flex items-center justify-center dark:bg-black/80 bg-white/80 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          
          <div className="container px-4 md:px-6 relative z-10 mx-auto">
            <div className="flex flex-col items-center space-y-6 sm:space-y-8 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Next-Gen Risk Management
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight sm:leading-none">
                Stop Payment Fraud <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Before It Happens</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-sm sm:text-base md:text-xl text-muted-foreground px-2 sm:px-0">
                PayPilot AI uses intelligent risk scoring, behavioral analysis, and explainable AI to protect every transaction without blocking legitimate customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center px-4 sm:px-0 max-w-md sm:max-w-none mx-auto">
                <Link href="/overview" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto font-medium text-sm sm:text-base px-6 sm:px-8 h-11 sm:h-12 shadow-sm">
                    Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/simulator" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto font-medium text-sm sm:text-base px-6 sm:px-8 h-11 sm:h-12">
                    Try Fraud Simulator
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-14 sm:py-20 bg-muted/30 border-y">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">Real-time Protection, Simplified</h2>
              <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">Our AI engine works in milliseconds to secure your revenue pipeline.</p>
            </div>
            
            <div className="grid gap-6 sm:gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 p-5 sm:p-6 rounded-2xl bg-card border shadow-xs relative">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-1">
                  <Zap className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold">1. Payment Received</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">Every transaction is securely captured via API, instantly gathering hundreds of data points.</p>
                <div className="hidden md:block absolute right-0 top-14 translate-x-1/2 text-muted-foreground/30">
                  <ArrowRight className="h-6 w-6" />
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 p-5 sm:p-6 rounded-2xl bg-card border shadow-xs relative">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-1">
                  <BrainCircuit className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold">2. AI Analysis</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">Real-time risk scoring utilizes 8 specialized detection modules to analyze behavior and network signals.</p>
                <div className="hidden md:block absolute right-0 top-14 translate-x-1/2 text-muted-foreground/30">
                  <ArrowRight className="h-6 w-6" />
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 p-5 sm:p-6 rounded-2xl bg-card border shadow-xs">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-1">
                  <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold">3. Smart Decision</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">The system automatically Approves, routes for Review, or Blocks the transaction with a full AI explanation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-14 sm:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">Enterprise-Grade Risk Infrastructure</h2>
              <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">Everything you need to scale payments securely, all in one unified platform.</p>
            </div>
            
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <Card className="bg-background border-muted hover:border-primary/50 transition-colors shadow-xs">
                <CardHeader className="p-5 sm:p-6">
                  <Activity className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                  <CardTitle className="text-lg sm:text-xl">Real-time Risk Scoring</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Sub-100ms latency for synchronous transaction evaluation.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background border-muted hover:border-primary/50 transition-colors shadow-xs">
                <CardHeader className="p-5 sm:p-6">
                  <FileSearch className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                  <CardTitle className="text-lg sm:text-xl">Explainable AI</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">No more black boxes. See exactly why a decision was made.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background border-muted hover:border-primary/50 transition-colors shadow-xs">
                <CardHeader className="p-5 sm:p-6">
                  <Search className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                  <CardTitle className="text-lg sm:text-xl">Fraud Pattern Detection</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Automatically identify and alert on emerging fraud rings.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background border-muted hover:border-primary/50 transition-colors shadow-xs">
                <CardHeader className="p-5 sm:p-6">
                  <UserCheck className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                  <CardTitle className="text-lg sm:text-xl">Customer Risk Profiles</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Track long-term behavioral changes at the identity level.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background border-muted hover:border-primary/50 transition-colors shadow-xs">
                <CardHeader className="p-5 sm:p-6">
                  <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                  <CardTitle className="text-lg sm:text-xl">Advanced Analytics</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Deep insights into approval rates and false positives.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background border-muted hover:border-primary/50 transition-colors shadow-xs">
                <CardHeader className="p-5 sm:p-6">
                  <Layers className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                  <CardTitle className="text-lg sm:text-xl">Case Management</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Streamlined workflow for manual transaction reviews.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Risk Modules Overview */}
        <section className="w-full py-14 sm:py-20 bg-muted/20 border-t">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto bg-card rounded-2xl border shadow-xs p-5 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Powered by 8 Specialized Risk Modules</h2>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {['Velocity Checks', 'Device Fingerprinting', 'IP Intelligence', 'Behavioral Biometrics', 'Network Graph', 'Email Risk', 'Card Anomalies', 'Custom Rules'].map((module, i) => (
                  <div key={i} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm font-medium border flex items-center">
                    <Shield className="h-3 w-3 mr-1.5 shrink-0" />
                    <span>{module}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 sm:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-white">Try PayPilot AI Now</h2>
            <p className="text-primary-foreground/80 text-sm sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8">
              Experience the power of our platform with a fully functional demo environment. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-xs sm:max-w-none mx-auto">
              <Link href="/overview" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold px-8 h-11 sm:h-12 text-sm sm:text-base">
                  <Lock className="mr-2 h-4 w-4" /> Launch Demo Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-10 sm:py-12 bg-background">
        <div className="container px-4 md:px-6 mx-auto grid gap-8 grid-cols-2 md:grid-cols-4">
          <div className="space-y-3 col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 whitespace-nowrap">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <span className="font-bold text-lg">PayPilot AI</span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground pr-4">
              Intelligent payment risk management platform for modern enterprises.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-xs sm:text-sm tracking-wider uppercase text-foreground">Product</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-primary transition-colors">Risk Engine</Link></li>
              <li><Link href="/analytics" className="hover:text-primary transition-colors">Analytics</Link></li>
              <li><Link href="/risk-rules" className="hover:text-primary transition-colors">Rules Management</Link></li>
              <li><Link href="/simulator" className="hover:text-primary transition-colors">Simulator</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-xs sm:text-sm tracking-wider uppercase text-foreground">Resources</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><Link href="/overview" className="hover:text-primary transition-colors">Live Dashboard</Link></li>
              <li><Link href="/transactions" className="hover:text-primary transition-colors">Transactions</Link></li>
              <li><Link href="/risk-cases" className="hover:text-primary transition-colors">Case Management</Link></li>
              <li><Link href="/audit-logs" className="hover:text-primary transition-colors">Audit Logs</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-xs sm:text-sm tracking-wider uppercase text-foreground">Company</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="container px-4 md:px-6 mx-auto mt-8 sm:mt-12 pt-6 sm:pt-8 border-t text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PayPilot AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
