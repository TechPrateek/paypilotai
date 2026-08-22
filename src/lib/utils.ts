import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "INR"): string {
  const symbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
  };
  const symbol = symbols[currency] || currency;

  if (amount >= 10000000) {
    return `${symbol}${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `${symbol}${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}K`;
  }
  return `${symbol}${amount.toLocaleString("en-IN")}`;
}

export function formatFullCurrency(amount: number, currency: string = "INR"): string {
  const locales: Record<string, string> = {
    INR: "en-IN",
    USD: "en-US",
    EUR: "de-DE",
  };
  return new Intl.NumberFormat(locales[currency] || "en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getRiskLevelColor(level: string): string {
  switch (level) {
    case "LOW":
      return "text-green-600 dark:text-green-400";
    case "MEDIUM":
      return "text-yellow-600 dark:text-yellow-400";
    case "HIGH":
      return "text-orange-600 dark:text-orange-400";
    case "CRITICAL":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
}

export function getRiskLevelBg(level: string): string {
  switch (level) {
    case "LOW":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "HIGH":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "CRITICAL":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
}

export function getDecisionColor(decision: string): string {
  switch (decision) {
    case "APPROVE":
      return "text-green-600 dark:text-green-400";
    case "APPROVE_WITH_MONITORING":
      return "text-yellow-600 dark:text-yellow-400";
    case "REVIEW":
      return "text-orange-600 dark:text-orange-400";
    case "BLOCK":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
}

export function getDecisionBg(decision: string): string {
  switch (decision) {
    case "APPROVE":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "APPROVE_WITH_MONITORING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "REVIEW":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "BLOCK":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function truncateId(id: string, length: number = 8): string {
  return id.length > length ? `${id.slice(0, length)}...` : id;
}

export function getScoreColor(score: number): string {
  if (score <= 29) return "#22c55e";
  if (score <= 59) return "#eab308";
  if (score <= 79) return "#f97316";
  return "#ef4444";
}
