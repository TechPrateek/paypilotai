export const RISK_THRESHOLDS = {
  LOW: { min: 0, max: 29 },
  MEDIUM: { min: 30, max: 59 },
  HIGH: { min: 60, max: 79 },
  CRITICAL: { min: 80, max: 100 },
} as const;

export const DECISION_LABELS: Record<string, string> = {
  APPROVE: "Approve",
  APPROVE_WITH_MONITORING: "Approve with Monitoring",
  REVIEW: "Review",
  BLOCK: "Block",
};

export const RISK_LEVEL_LABELS: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  REFUNDED: "Refunded",
  DISPUTED: "Disputed",
};

export const CASE_STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  INVESTIGATING: "Investigating",
  CONFIRMED_FRAUD: "Confirmed Fraud",
  FALSE_POSITIVE: "False Positive",
  RESOLVED: "Resolved",
};

export const PAYMENT_METHODS = [
  { value: "UPI", label: "UPI" },
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "DEBIT_CARD", label: "Debit Card" },
  { value: "NET_BANKING", label: "Net Banking" },
  { value: "WALLET", label: "Wallet" },
] as const;

export const CURRENCIES = [
  { value: "INR", label: "INR (₹)", symbol: "₹" },
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
] as const;
