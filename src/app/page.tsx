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
  Network,
  UserCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      <header className="px-6 h-16 flex items-center border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-xl tracking-tight">PayPilot AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How it Works
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-medium">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button className="text-sm font-medium">Try Demo</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-48 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:32px_32px]" />
          <div className="absolute inset-0 flex items-center justify-center dark:bg-black/80 bg-white/80 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Next-Gen Risk Management
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Stop Payment Fraud <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Before It Happens</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                PayPilot AI uses intelligent risk scoring, behavioral analysis, and explainable AI to protect every transaction without blocking legitimate customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto font-medium text-md px-8">
                    Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/simulator">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto font-medium text-md px-8">
                    Try Fraud Simulator
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-20 bg-muted/30 border-y">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Real-time Protection, Simplified</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Our AI engine works in milliseconds to secure your revenue pipeline.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-4 p-6 relative">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">1. Payment Received</h3>
                <p className="text-muted-foreground">Every transaction is securely captured via API, instantly gathering hundreds of data points.</p>
                <div className="hidden md:block absolute right-0 top-14 translate-x-1/2 text-muted-foreground/30">
                  <ArrowRight className="h-8 w-8" />
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 p-6 relative">
                <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2">
                  <BrainCircuit className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">2. AI Analysis</h3>
                <p className="text-muted-foreground">Real-time risk scoring utilizes 8 specialized detection modules to analyze behavior and network signals.</p>
                <div className="hidden md:block absolute right-0 top-14 translate-x-1/2 text-muted-foreground/30">
                  <ArrowRight className="h-8 w-8" />
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 p-6">
                <div className="h-16 w-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">3. Smart Decision</h3>
                <p className="text-muted-foreground">The system automatically Approves, routes for Review, or Blocks the transaction with a full AI explanation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Enterprise-Grade Risk Infrastructure</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to scale payments securely, all in one unified platform.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <Card className="bg-background border-muted hover:border-primary/50 transition-colors shadow-sm">
                <CardHeader>
                  <Activity className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Real-time Risk Scoring</CardTitle>
                  <CardDescription>Sub-100ms latency for synchronous transaction evaluation.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background border-muted hover:border-primary/50 transition-colors shadow-sm">
                <CardHeader>
                  <FileSearch className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Explainable AI</CardTitle>
                  <CardDescription>No more black boxes. See exactly why a decision was made.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background border-muted hover:border-primary/50 transition-colors shadow-sm">
                <CardHeader>
                  <Search className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Fraud Pattern Detection</CardTitle>
                  <CardDescription>Automatically identify and alert on emerging fraud rings.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background border-muted hover:border-primary/50 transition-colors shadow-sm">
                <CardHeader>
                  <UserCheck className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Customer Risk Profiles</CardTitle>
                  <CardDescription>Track long-term behavioral changes at the identity level.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background border-muted hover:border-primary/50 transition-colors shadow-sm">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription>Deep insights into approval rates and false positives.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background border-muted hover:border-primary/50 transition-colors shadow-sm">
                <CardHeader>
                  <Layers className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Case Management</CardTitle>
                  <CardDescription>Streamlined workflow for manual transaction reviews.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Risk Modules Overview */}
        <section className="w-full py-20 bg-muted/20 border-t">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto bg-card rounded-2xl border shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold mb-6">Powered by 8 Specialized Risk Modules</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {['Velocity Checks', 'Device Fingerprinting', 'IP Intelligence', 'Behavioral Biometrics', 'Network Graph', 'Email Risk', 'Card Anomalies', 'Custom Rules'].map((module, i) => (
                  <div key={i} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium border flex items-center">
                    <Shield className="h-3 w-3 mr-2" />
                    {module}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white">Try PayPilot AI Now</h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Experience the power of our platform with a fully functional demo environment. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" variant="secondary" className="font-semibold px-8 h-12">
                  <Lock className="mr-2 h-4 w-4" /> Sign in to Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-background">
        <div className="container px-4 md:px-6 mx-auto grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <ShieldCheck className="h-5 w-5 text-primary mr-2" />
              <span className="font-bold text-lg">PayPilot AI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Intelligent payment risk management platform for modern enterprises.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Risk Engine</Link></li>
              <li><Link href="#" className="hover:text-primary">Analytics</Link></li>
              <li><Link href="#" className="hover:text-primary">Rules Management</Link></li>
              <li><Link href="#" className="hover:text-primary">Integrations</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Documentation</Link></li>
              <li><Link href="#" className="hover:text-primary">API Reference</Link></li>
              <li><Link href="#" className="hover:text-primary">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary">Security</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="container px-4 md:px-6 mx-auto mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PayPilot AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
