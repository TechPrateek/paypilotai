export interface DashboardStats {
  totalTransactions: number;
  totalVolume: number;
  approvedCount: number;
  reviewCount: number;
  blockedCount: number;
  fraudRate: number;
  avgRiskScore: number;
  preventedLoss: number;
}

export interface DateFilter {
  from: Date;
  to: Date;
  label: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionFilters {
  riskLevel?: string;
  decision?: string;
  status?: string;
  country?: string;
  paymentMethod?: string;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  customerId?: string;
}

export interface SimulatorInput {
  amount: number;
  currency: string;
  paymentMethod: string;
  country: string;
  isNewDevice: boolean;
  accountAgeDays: number;
  previousFailedAttempts: number;
  transactionsInLast5Min: number;
  customerEmail?: string;
  isDisposableEmail: boolean;
  isSuspiciousIp: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
