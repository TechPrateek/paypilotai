export const COUNTRIES = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "AE", name: "UAE", flag: "🇦🇪" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
] as const;

export const HIGH_RISK_COUNTRIES = ["NG", "GH", "PK", "BD", "VN", "PH"];

export function getCountryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name || code;
}

export function getCountryFlag(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.flag || "🏳️";
}
