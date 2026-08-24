export interface DemoScenario {
  name: string;
  description: string;
  icon: string;
  color: string;
  expectedDecision: "APPROVE" | "REVIEW" | "BLOCK";
  expectedConfidence: string;
  input: {
    amount: number;
    currency: string;
    paymentMethod: string;
    country: string;
    isNewDevice: boolean;
    isNewIp?: boolean;
    accountAgeDays: number;
    customerTotalTransactions: number;
    previousFailedAttempts: number;
    transactionsInLast5Min: number;
    paymentInstrumentSwitchCount?: number;
    isProxyIp?: boolean;
    isVpnIp?: boolean;
    isTorIp?: boolean;
    isSuspiciousIp: boolean;
    isDisposableEmail: boolean;
  };
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    name: "1. Regular Returning Customer",
    description: "A trusted customer making a regular purchase from their usual phone. High safety, smooth checkout.",
    icon: "CheckCircle",
    color: "green",
    expectedDecision: "APPROVE",
    expectedConfidence: "High (94%)",
    input: {
      amount: 2400,
      currency: "INR",
      paymentMethod: "UPI",
      country: "IN",
      isNewDevice: false,
      accountAgeDays: 380,
      customerTotalTransactions: 42,
      previousFailedAttempts: 0,
      transactionsInLast5Min: 0,
      paymentInstrumentSwitchCount: 0,
      isSuspiciousIp: false,
      isDisposableEmail: false,
    },
  },
  {
    name: "2. First-Time Buyer (New Customer)",
    description: "Brand new customer making their first purchase. PayPilot does not block new buyers without proof.",
    icon: "UserCheck",
    color: "blue",
    expectedDecision: "APPROVE",
    expectedConfidence: "New Customer (45%)",
    input: {
      amount: 1850,
      currency: "INR",
      paymentMethod: "UPI",
      country: "IN",
      isNewDevice: true,
      isNewIp: true,
      accountAgeDays: 0,
      customerTotalTransactions: 0,
      previousFailedAttempts: 0,
      transactionsInLast5Min: 0,
      paymentInstrumentSwitchCount: 0,
      isSuspiciousIp: false,
      isDisposableEmail: false,
    },
  },
  {
    name: "3. Known Customer on New Phone",
    description: "An existing buyer using a new mobile phone. Safe to approve, noted as a new device.",
    icon: "Smartphone",
    color: "blue",
    expectedDecision: "APPROVE",
    expectedConfidence: "High (88%)",
    input: {
      amount: 4500,
      currency: "INR",
      paymentMethod: "CREDIT_CARD",
      country: "IN",
      isNewDevice: true,
      accountAgeDays: 240,
      customerTotalTransactions: 19,
      previousFailedAttempts: 0,
      transactionsInLast5Min: 1,
      paymentInstrumentSwitchCount: 0,
      isSuspiciousIp: false,
      isDisposableEmail: false,
    },
  },
  {
    name: "4. Payment Retry After Bank Timeout",
    description: "Customer retrying payment after an initial bank server connection dropped.",
    icon: "RefreshCw",
    color: "emerald",
    expectedDecision: "APPROVE",
    expectedConfidence: "High (90%)",
    input: {
      amount: 3200,
      currency: "INR",
      paymentMethod: "DEBIT_CARD",
      country: "IN",
      isNewDevice: false,
      accountAgeDays: 180,
      customerTotalTransactions: 14,
      previousFailedAttempts: 2,
      transactionsInLast5Min: 2,
      paymentInstrumentSwitchCount: 0,
      isSuspiciousIp: false,
      isDisposableEmail: false,
    },
  },
  {
    name: "5. Switched from UPI to Card",
    description: "Customer tried paying with UPI first, then switched to Card after bank delay.",
    icon: "CreditCard",
    color: "amber",
    expectedDecision: "APPROVE",
    expectedConfidence: "High (86%)",
    input: {
      amount: 6800,
      currency: "INR",
      paymentMethod: "CREDIT_CARD",
      country: "IN",
      isNewDevice: false,
      accountAgeDays: 120,
      customerTotalTransactions: 8,
      previousFailedAttempts: 1,
      transactionsInLast5Min: 2,
      paymentInstrumentSwitchCount: 2,
      isSuspiciousIp: false,
      isDisposableEmail: false,
    },
  },
  {
    name: "6. Large Order (₹85,000)",
    description: "High-value purchase from a loyal customer. Sent to review queue for quick verification.",
    icon: "ShieldAlert",
    color: "amber",
    expectedDecision: "REVIEW",
    expectedConfidence: "High (89%)",
    input: {
      amount: 85000,
      currency: "INR",
      paymentMethod: "CREDIT_CARD",
      country: "IN",
      isNewDevice: false,
      accountAgeDays: 520,
      customerTotalTransactions: 36,
      previousFailedAttempts: 0,
      transactionsInLast5Min: 1,
      paymentInstrumentSwitchCount: 0,
      isSuspiciousIp: false,
      isDisposableEmail: false,
    },
  },
  {
    name: "7. Fraud Attack / Card Testing",
    description: "Attacker making 14 rapid payment attempts from an anonymous hidden network.",
    icon: "Zap",
    color: "red",
    expectedDecision: "BLOCK",
    expectedConfidence: "High (95%)",
    input: {
      amount: 145000,
      currency: "INR",
      paymentMethod: "CREDIT_CARD",
      country: "NG",
      isNewDevice: true,
      isNewIp: true,
      accountAgeDays: 1,
      customerTotalTransactions: 0,
      previousFailedAttempts: 7,
      transactionsInLast5Min: 14,
      paymentInstrumentSwitchCount: 4,
      isTorIp: true,
      isProxyIp: true,
      isSuspiciousIp: true,
      isDisposableEmail: true,
    },
  },
];
