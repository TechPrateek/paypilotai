"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Topbar & Nav
    appName: "PayPilot AI",
    overview: "Overview & Store Cockpit",
    fraudSpikeDetector: "Fraud-Spike Detector",
    abuseRingSentinel: "Abuse-Ring Sentinel",
    metrics: "Model & Test Metrics",
    signOut: "Sign Out",
    search: "Search orders, customers, or transactions...",
    
    // Overview Money Cards
    moneySaved: "Money Saved from Fraud",
    moneySavedDesc: "Direct loss prevented by AI block",
    approvedSales: "Safe Approved Sales",
    approvedSalesDesc: "Genuine customer orders",
    moneyInReview: "Orders Under Review",
    moneyInReviewDesc: "Awaiting 2FA / manual check",
    actualFraudLoss: "Fraud Loss Rate",
    actualFraudLossDesc: "Industry benchmark < 2.0%",
    
    // Attack Banner
    activeAttackDetected: "Active Syndicate Attack Blocked!",
    attackDetail: "Tor/Proxy Network with 14 rapid micro-attempts was automatically isolated.",
    allSystemsSafe: "All Payment Systems Safe & Normal",
    allSystemsSafeDesc: "Zero active fraud spikes or syndicate attacks detected.",
    
    // 2 Active Pillars
    fraudSpikeDesc: "Rapid velocity & bot attack limiter",
    abuseRingDesc: "Multi-hop shared entity graph isolation",
    active: "Active",
    
    // Transaction Details
    orderSummary: "Order Summary",
    customerProfile: "Customer Details",
    deviceDetails: "Customer's Phone / PC",
    networkCheck: "Internet Connection Check",
    whyDecisionMade: "Why PayPilot Made This Recommendation",
    riskScore: "AI Risk Score",
    aiConfidence: "AI Confidence Level",
    
    // Simulator
    testPaymentSafety: "Check Payment Safety",
    readyToTest: "Ready to Test",
    orderAmount: "Order Amount",
    pastOrders: "Customer's Past Orders",
    newCustomer: "First-Time Buyer (No Past Orders)",
    knownCustomer: "Known Established Customer",
  },
  hi: {
    // Topbar & Nav
    appName: "पेपायलट AI (PayPilot)",
    overview: "डैशबोर्ड और स्टोर विवरण",
    fraudSpikeDetector: "तेज़ अटैक डिटेक्टर (Fraud-Spike)",
    abuseRingSentinel: "अटैक रिंग जासूस (Abuse-Ring)",
    metrics: "AI मॉडल और मेट्रिक्स (Metrics)",
    signOut: "लॉग आउट (Sign Out)",
    search: "ऑर्डर, ग्राहक या पेमेंट खोजें...",
    
    // Overview Money Cards
    moneySaved: "फ्रॉड से बचाया गया पैसा",
    moneySavedDesc: "AI द्वारा ब्लॉक किया गया फ्रॉड नुकसान",
    approvedSales: "सफल व सुरक्षित बिक्री",
    approvedSalesDesc: "असली ग्राहकों के सुरक्षित ऑर्डर्स",
    moneyInReview: "जाँच में अटका पैसा (Review)",
    moneyInReviewDesc: "OTP / मैन्युअल चेकिंग के लिए रुका",
    actualFraudLoss: "फ्रॉड दर (Fraud Rate)",
    actualFraudLossDesc: "नॉर्मल दर 2.0% से कम होनी चाहिए",
    
    // Attack Banner
    activeAttackDetected: "⚠️ बड़ा फ्रॉड अटैक सफलतापूर्वक ब्लॉक किया गया!",
    attackDetail: "फेक IP और अज्ञात नेटवर्क से 14 लगातार पेमेंट अटैक रोके गए — नुकसान बचाया।",
    allSystemsSafe: "🟢 सभी पेमेंट सिस्टम सुरक्षित हैं",
    allSystemsSafeDesc: "वर्तमान में कोई फ्रॉड अटैक या कार्ड टेस्टिंग नहीं हो रही है।",
    
    // 2 Active Pillars
    fraudSpikeDesc: "लगातार तेज फर्जी पेमेंट रोकना",
    abuseRingDesc: "फोन व IP का फ्रॉड जाल खोजना",
    active: "चालू (Active)",
    
    // Transaction Details
    orderSummary: "ऑर्डर का विवरण",
    customerProfile: "ग्राहक की जानकारी",
    deviceDetails: "ग्राहक का मोबाइल / कंप्यूटर",
    networkCheck: "इंटरनेट कनेक्शन की जाँच",
    whyDecisionMade: "AI ने यह फैसला क्यों लिया?",
    riskScore: "जोखिम स्कोर (Risk Score)",
    aiConfidence: "AI को कितना भरोसा है (Confidence)",
    
    // Simulator
    testPaymentSafety: "पेमेंट की सुरक्षा जाँचें",
    readyToTest: "परीक्षण के लिए तैयार",
    orderAmount: "ऑर्डर की राशि (रुपये)",
    pastOrders: "ग्राहक के पुराने ऑर्डर्स",
    newCustomer: "नया ग्राहक (पहली बार खरीदारी)",
    knownCustomer: "पुराना व भरोसेमंद ग्राहक",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("paypilot_lang") as Language;
    if (saved === "en" || saved === "hi") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("paypilot_lang", lang);
  };

  const t = (key: string) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
