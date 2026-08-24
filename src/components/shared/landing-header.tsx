"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Menu, Sparkles, LogIn, LayoutDashboard, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="px-4 sm:px-6 h-16 flex items-center justify-between border-b sticky top-0 bg-background/90 backdrop-blur-md z-50 transition-all">
      {/* Brand / Logo */}
      <Link href="/" className="flex items-center gap-2 whitespace-nowrap shrink-0">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <span className="font-bold text-lg sm:text-xl tracking-tight text-foreground">
          PayPilot AI
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <Link 
          href="#features" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Features
        </Link>
        <Link 
          href="#how-it-works" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          How it Works
        </Link>
        <Link 
          href="/simulator" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Simulator
        </Link>
        <Link href="/login">
          <Button variant="ghost" size="sm" className="text-sm font-medium">
            Sign In
          </Button>
        </Link>
        <Link href="/overview">
          <Button size="sm" className="text-sm font-medium">
            Try Demo
          </Button>
        </Link>
      </nav>

      {/* Mobile Actions & Menu */}
      <div className="flex items-center gap-2 md:hidden">
        <Link href="/login">
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium">
            Sign In
          </Button>
        </Link>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="inline-flex items-center justify-center rounded-md h-9 w-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground border transition-colors">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-[280px] sm:w-[320px] flex flex-col justify-between">
            <div className="p-6">
              <SheetHeader className="p-0 mb-6 text-left">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <SheetTitle className="font-bold text-lg tracking-tight">PayPilot AI</SheetTitle>
                </div>
              </SheetHeader>

              <nav className="flex flex-col space-y-3">
                <Link
                  href="#features"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  How it Works
                </Link>
                <Link
                  href="/simulator"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <FlaskConical className="h-4 w-4 text-primary" />
                  Fraud Simulator
                </Link>
                <Link
                  href="/overview"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  Live Dashboard
                </Link>
              </nav>
            </div>

            <div className="p-6 border-t bg-muted/30 space-y-3">
              <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full">
                <Button variant="outline" className="w-full justify-center text-sm font-medium h-10">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/overview" onClick={() => setIsOpen(false)} className="block w-full">
                <Button className="w-full justify-center text-sm font-medium h-10">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Open Demo Dashboard
                </Button>
              </Link>
              <p className="text-[11px] text-center text-muted-foreground pt-1">
                © {new Date().getFullYear()} PayPilot AI. All rights reserved.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
