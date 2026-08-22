import { z } from "zod";

export const simulatorInputSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  currency: z.enum(["INR", "USD", "EUR"]).default("INR"),
  paymentMethod: z.enum(["UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET"]).default("UPI"),
  country: z.string().min(2).max(3),
  isNewDevice: z.boolean().default(false),
  accountAgeDays: z.number().min(0).default(365),
  previousFailedAttempts: z.number().min(0).default(0),
  transactionsInLast5Min: z.number().min(0).default(0),
  customerEmail: z.string().email().optional(),
  isDisposableEmail: z.boolean().default(false),
  isSuspiciousIp: z.boolean().default(false),
});

export const transactionCreateSchema = z.object({
  amount: z.number().min(0.01),
  currency: z.enum(["INR", "USD", "EUR"]),
  paymentMethod: z.enum(["UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET"]),
  country: z.string().min(2).max(3),
  city: z.string().optional(),
  ip: z.string().optional(),
  deviceFingerprint: z.string().optional(),
  customerId: z.string(),
  merchantId: z.string(),
});

export const riskRuleSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  category: z.string().min(1),
  condition: z.record(z.string(), z.unknown()),
  score: z.number().min(0).max(100),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  enabled: z.boolean().default(true),
  isGlobal: z.boolean().default(false),
});

export const caseUpdateSchema = z.object({
  status: z.enum(["OPEN", "INVESTIGATING", "CONFIRMED_FRAUD", "FALSE_POSITIVE", "RESOLVED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  assignedAnalystId: z.string().nullable().optional(),
  resolution: z.string().optional(),
});

export const caseNoteSchema = z.object({
  content: z.string().min(1, "Note content is required").max(2000),
});

export const webhookPaymentSchema = z.object({
  transaction_id: z.string().optional(),
  amount: z.number().min(0.01),
  currency: z.enum(["INR", "USD", "EUR"]).default("INR"),
  customer_id: z.string(),
  device_id: z.string().optional(),
  ip: z.string().optional(),
  country: z.string().min(2).max(3),
  payment_method: z.enum(["UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET"]),
});

export type SimulatorInput = z.infer<typeof simulatorInputSchema>;
export type TransactionCreate = z.infer<typeof transactionCreateSchema>;
export type RiskRuleInput = z.infer<typeof riskRuleSchema>;
export type CaseUpdate = z.infer<typeof caseUpdateSchema>;
export type CaseNoteInput = z.infer<typeof caseNoteSchema>;
export type WebhookPayment = z.infer<typeof webhookPaymentSchema>;
