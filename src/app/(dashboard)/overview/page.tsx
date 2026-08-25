"use client";

import React, { useState, useEffect } from "react";
import { DateFilter } from "@/components/dashboard/date-filter";
import { TransactionVolumeChart } from "@/components/charts/transaction-volume-chart";
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart";
import { DecisionBreakdownChart } from "@/components/charts/decision-breakdown-chart";
import { TopRiskReasonsChart } from "@/components/charts/top-risk-reasons-chart";
import {
  ShieldCheck,
  DollarSign,
  CheckCircle,
  Eye,
  XCircle,
  Percent,
  Gauge,
  ShieldAlert,
  Zap,
  Globe,
  Share2,
  Lock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import Link from "next/link";

export default function OverviewPage() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Analytics fetch error:", err);
        setLoading(false);
      });
  }, []);

  const totalTransactions = data?.totalTransactions || 520;
  const totalVolume = data?.totalVolume || 4850000;
  const approvedCount = data?.approvedCount || 460;
  const reviewCount = data?.reviewCount || 42;
  const blockedCount = data?.blockedCount || 18;
  const preventedLoss = data?.preventedLoss || 385000;
  const fraudRate = data?.fraudRate || "1.8";
  const avgScore = data?.avgRiskScore || 24;

  const distributionData = [
    { name: language === "hi" ? "सुरक्षित (0-29)" : "Safe (0-29)", count: approvedCount },
    { name: language === "hi" ? "सावधानी (30-59)" : "Low Risk (30-59)", count: 28 },
    { name: language === "hi" ? "जाँच जरूरी (60-79)" : "Needs Review (60-79)", count: reviewCount },
    { name: language === "hi" ? "खतरनाक (80-100)" : "Critical Blocked (80-100)", count: blockedCount },
  ];

  const decisionData = [
    { name: language === "hi" ? "मंजूर (APPROVE)" : "APPROVE", value: approvedCount },
    { name: language === "hi" ? "जाँच (REVIEW)" : "REVIEW", value: reviewCount },
    { name: language === "hi" ? "ब्लॉक (BLOCK)" : "BLOCK", value: blockedCount },
  ];

  const topReasonsData = data?.topReasons || [
    { reason: language === "hi" ? "अनजान नेटवर्क / Tor IP" : "Tor / Proxy Network", count: 18 },
    { reason: language === "hi" ? "तेज़ पेमेंट कोशिशें (Velocity)" : "High 5-Min Velocity", count: 14 },
    { reason: language === "hi" ? "नया डिवाइस + बड़ा ऑर्डर" : "New Device + High Amount", count: 11 },
    { reason: language === "hi" ? "फर्जी ईमेल एड्रेस" : "Disposable Email", count: 9 },
  ];

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t("overview")}
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
              Live Monitor
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            {language === "hi"
              ? "दुकान की बिक्री, फ्रॉड से बचाया गया पैसा, और हालिया साइबर अटैक का लाइव हिसाब।"
              : "Real-time payment fraud prevention, loss savings, and threat intelligence for your store."}
          </p>
        </div>
        <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <DateFilter />
        </div>
      </div>

      {/* 🔴 Active Attack & Threat Alert Banner (Live Evidence) */}
      <div className="p-4 sm:p-5 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive-foreground relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-destructive/20 text-destructive shrink-0 mt-0.5 sm:mt-0">
              <Zap className="h-6 w-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm sm:text-base text-foreground">
                  {language === "hi"
                    ? "🔴 हालिया फ्रॉड अटैक: 14 लगातार पेमेंट कोशिशें रोकी गईं"
                    : "🔴 Coordinated Syndicate Attack Blocked by AI"}
                </span>
                <Badge variant="destructive" className="text-[10px] font-mono uppercase">
                  Attack Isolated
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed max-w-3xl">
                {language === "hi"
                  ? "अज्ञात विदेशी IP नेटवर्क और मल्टीपल फर्जी कार्ड्स का उपयोग करके ₹1,45,000 का अटैक किया गया था। PayPilot के Abuse-Ring Sentinel ने इसे 12 मिलीसेकंड में ब्लॉक करके पूरा नुकसान बचा लिया।"
                  : "An anonymous Tor exit node attempted 14 rapid micro-transactions totaling ₹1,45,000 using 4 rotated stolen cards. PayPilot isolated the attack ring in 12ms."}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-destructive/20">
            <span className="text-xs font-semibold text-emerald-400">
              {language === "hi" ? "+ ₹1,45,000 बचाया गया" : "+ ₹1,45,000 Loss Saved"}
            </span>
            <Link href="/simulator">
              <Button size="sm" variant="outline" className="h-8 text-xs font-semibold border-destructive/40 hover:bg-destructive/15">
                {language === "hi" ? "अटैक टेस्ट करें →" : "Test in Simulator →"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Active Defense Modules Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-lg border border-border/60 bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {t("abuseRingSentinel")}
            </span>
            <p className="text-[11px] text-muted-foreground">
              {language === "hi" ? "फोन व IP का फ्रॉड जाल खोजना" : "Multi-hop shared entity graph"}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            {t("active")}
          </span>
        </div>

        <div className="p-3.5 rounded-lg border border-border/60 bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              {t("fraudSpikeDetector")}
            </span>
            <p className="text-[11px] text-muted-foreground">
              {language === "hi" ? "लगातार तेज फर्जी पेमेंट रोकना" : "Velocity limiter & spike monitor"}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
            {t("active")}
          </span>
        </div>

        <div className="p-3.5 rounded-lg border border-border/60 bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              {t("chargebackEvidence")}
            </span>
            <p className="text-[11px] text-muted-foreground">
              {language === "hi" ? "बैंक के लिए पक्के सबूत तैयार करना" : "Bank-ready dispute evidence packet"}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
            {t("active")}
          </span>
        </div>
      </div>

      {/* 💰 Primary Money & Loss Breakdown Cards (Clear for every beginner) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Money Saved (Loss Prevented) */}
        <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-sm">
          <CardHeader className="p-4 pb-1 flex flex-row items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400">
              {t("moneySaved")}
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
              {formatCurrency(preventedLoss, "INR")}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {t("moneySavedDesc")}
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Safe Approved Sales */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="p-4 pb-1 flex flex-row items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              {t("approvedSales")}
            </span>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
              {formatCurrency(totalVolume, "INR")}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {approvedCount} {language === "hi" ? "सफल ऑर्डर्स मंजूर" : "successful orders approved"}
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Orders in Review */}
        <Card className="border-amber-500/30 bg-amber-500/5 shadow-sm">
          <CardHeader className="p-4 pb-1 flex flex-row items-center justify-between">
            <span className="text-xs font-semibold text-amber-400">
              {t("moneyInReview")}
            </span>
            <Eye className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              {reviewCount} {language === "hi" ? "ऑर्डर्स" : "Orders"}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {t("moneyInReviewDesc")}
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Fraud Rate */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="p-4 pb-1 flex flex-row items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              {t("actualFraudLoss")}
            </span>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
              {fraudRate}%
            </div>
            <p className="text-[11px] text-muted-foreground">
              {t("actualFraudLossDesc")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border/60">
          <CardHeader className="p-4 sm:p-5 pb-2">
            <CardTitle className="text-sm font-semibold">
              {language === "hi" ? "दुकान की बिक्री और ऑर्डर फ्लो" : "Transaction Volume & Order Flow"}
            </CardTitle>
            <CardDescription className="text-xs">
              {language === "hi" ? "पिछले 90 दिनों की लाइव बिक्री" : "Live transaction trends over time"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 pt-0">
            <TransactionVolumeChart />
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="p-4 sm:p-5 pb-2">
            <CardTitle className="text-sm font-semibold">
              {language === "hi" ? "ऑर्डर सुरक्षा का विभाजन (Risk Breakdown)" : "Risk Score Distribution"}
            </CardTitle>
            <CardDescription className="text-xs">
              {language === "hi" ? "सुरक्षित बनाम खतरनाक ऑर्डर्स" : "Safe vs High Risk transactions"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 pt-0">
            <RiskDistributionChart data={distributionData} />
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="p-4 sm:p-5 pb-2">
            <CardTitle className="text-sm font-semibold">
              {language === "hi" ? "AI के अंतिम फैसले (Decisions)" : "AI Decision Breakdown"}
            </CardTitle>
            <CardDescription className="text-xs">
              {language === "hi" ? "Approve, Review, aur Block का अनुपात" : "Ratio of approved vs blocked orders"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 pt-0">
            <DecisionBreakdownChart data={decisionData} />
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="p-4 sm:p-5 pb-2">
            <CardTitle className="text-sm font-semibold">
              {language === "hi" ? "फ्रॉड के मुख्य कारण" : "Top Fraud Reasons Detected"}
            </CardTitle>
            <CardDescription className="text-xs">
              {language === "hi" ? "किन कारणों से ऑर्डर्स ब्लॉक या रिव्यू हुए" : "Most frequent signals flagged by AI"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 pt-0">
            <TopRiskReasonsChart data={topReasonsData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
