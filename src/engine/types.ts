export interface TransactionInput {
  amount: number;
  currency: string;
  paymentMethod: string;
  country: string;
  city?: string;
  ip?: string;
  deviceFingerprint?: string;
  isNewDevice: boolean;
  customerId: string;
  customerEmail?: string;
  accountAgeDays: number;
  previousFailedAttempts: number;
  transactionsInLast5Min: number;
  transactionsInLast1Hour: number;
  customerAverageAmount: number;
  customerTotalTransactions: number;
  customerCountries: string[];
  customerDeviceCount: number;
  isDisposableEmail: boolean;
  isProxyIp: boolean;
  isVpnIp: boolean;
  isSuspiciousIp: boolean;
  previousDisputes: number;
}

export interface RiskFactorResult {
  name: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  scoreContribution: number;
  explanation: string;
  evidence: string;
}

export interface RiskAssessmentResult {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  decision: 'APPROVE' | 'APPROVE_WITH_MONITORING' | 'REVIEW' | 'BLOCK';
  factors: RiskFactorResult[];
  anomalyScore: number;
  attackPattern?: string;
  processingTimeMs: number;
}

export interface RiskThresholds {
  low: number;      // 0-29
  medium: number;   // 30-59
  high: number;     // 60-79
  critical: number; // 80-100
}
