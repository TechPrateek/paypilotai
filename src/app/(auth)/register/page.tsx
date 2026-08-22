"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldCheck, Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNext();
      return;
    }
    
    setLoading(true);
    // Mock registration
    setTimeout(() => {
      setLoading(false);
      toast.success("Account created successfully. Please sign in.");
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center mb-8">
        <Link href="/" className="flex items-center">
          <ShieldCheck className="h-10 w-10 text-primary mr-2" />
          <span className="font-bold text-3xl tracking-tight">PayPilot AI</span>
        </Link>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            {step === 1 && "Step 1 of 3: Account Details"}
            {step === 2 && "Step 2 of 3: Business Details"}
            {step === 3 && "Step 3 of 3: Risk Preferences"}
          </CardDescription>
          <div className="flex gap-2 mt-4">
            <div className={`h-2 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-2 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-2 flex-1 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="register-form" className="space-y-4">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <Label htmlFor="merchant">Merchant / Company Name</Label>
                  <Input id="merchant" placeholder="Acme Corp" required />
                </div>
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Select required defaultValue="ecommerce">
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="saas">SaaS / Software</SelectItem>
                      <SelectItem value="digital_goods">Digital Goods</SelectItem>
                      <SelectItem value="travel">Travel & Hospitality</SelectItem>
                      <SelectItem value="financial">Financial Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume">Expected Monthly Volume</Label>
                  <Select required defaultValue="100k">
                    <SelectTrigger>
                      <SelectValue placeholder="Select volume" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10k">Under $10,000</SelectItem>
                      <SelectItem value="100k">$10,000 - $100,000</SelectItem>
                      <SelectItem value="1m">$100,000 - $1M</SelectItem>
                      <SelectItem value="10m">Over $1M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Set your initial risk thresholds. Transactions scoring above the block threshold are automatically rejected.
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Block Threshold</Label>
                    <span className="font-bold text-red-500">85+</span>
                  </div>
                  <Slider defaultValue={[85]} max={100} step={1} className="[&>span:first-child]:bg-muted [&_[role=slider]]:bg-red-500" />
                  <p className="text-xs text-muted-foreground">Transactions scoring 85-100 will be instantly blocked.</p>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div className="flex justify-between items-center">
                    <Label>Review Threshold</Label>
                    <span className="font-bold text-amber-500">65+</span>
                  </div>
                  <Slider defaultValue={[65]} max={100} step={1} className="[&>span:first-child]:bg-muted [&_[role=slider]]:bg-amber-500" />
                  <p className="text-xs text-muted-foreground">Transactions scoring 65-84 will be sent for manual review.</p>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={handlePrev}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          ) : (
            <Link href="/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              Cancel
            </Link>
          )}

          <Button type="submit" form="register-form" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {!loading && step === 3 && <Check className="mr-2 h-4 w-4" />}
            {loading ? "Creating..." : step === 3 ? "Complete Registration" : "Next Step"}
            {!loading && step < 3 && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
