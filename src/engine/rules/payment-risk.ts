import { TransactionInput, RiskFactorResult } from '../types';

export function evaluatePaymentRisk(input: TransactionInput): RiskFactorResult[] {
  const factors: RiskFactorResult[] = [];

  if (input.paymentMethod === 'WALLET' && input.amount > 50000) {
    factors.push({
      name: 'High Value Wallet Transaction',
      category: 'Payment Risk',
      severity: 'MEDIUM',
      scoreContribution: 10,
      explanation: 'Unusually high amount for a wallet transaction.',
      evidence: `Method: WALLET, Amount: ${input.amount}`
    });
  }

  if (input.country !== 'IN' && input.amount > 20000) {
    factors.push({
      name: 'High Value International Card',
      category: 'Payment Risk',
      severity: 'LOW',
      scoreContribution: 5,
      explanation: 'High value transaction from an international payment method.',
      evidence: `Country: ${input.country}, Amount: ${input.amount}`
    });
  }

  return factors;
}
