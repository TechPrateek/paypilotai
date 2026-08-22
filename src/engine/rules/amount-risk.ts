import { TransactionInput, RiskFactorResult } from '../types';

export function evaluateAmountRisk(input: TransactionInput): RiskFactorResult[] {
  const factors: RiskFactorResult[] = [];
  
  if (input.customerAverageAmount > 0) {
    if (input.amount > 5 * input.customerAverageAmount) {
      factors.push({
        name: 'Excessive Amount Multiplier',
        category: 'Amount Risk',
        severity: 'CRITICAL',
        scoreContribution: 30,
        explanation: 'Transaction amount is more than 5x the customer historical average.',
        evidence: `Amount: ${input.amount}, Average: ${input.customerAverageAmount}`
      });
    } else if (input.amount > 3 * input.customerAverageAmount) {
      factors.push({
        name: 'High Amount Multiplier',
        category: 'Amount Risk',
        severity: 'HIGH',
        scoreContribution: 20,
        explanation: 'Transaction amount is more than 3x the customer historical average.',
        evidence: `Amount: ${input.amount}, Average: ${input.customerAverageAmount}`
      });
    }
  }

  if (input.amount > 100000 && input.currency === 'INR' && input.accountAgeDays < 30) {
    factors.push({
      name: 'High Amount on New Account',
      category: 'Amount Risk',
      severity: 'CRITICAL',
      scoreContribution: 25,
      explanation: 'High value transaction (>1,000,00) on an account less than 30 days old.',
      evidence: `Amount: ${input.amount} INR, Account Age: ${input.accountAgeDays} days`
    });
  }

  if (input.amount > 50000 && input.customerTotalTransactions < 5) {
    factors.push({
      name: 'High Value with Limited History',
      category: 'Amount Risk',
      severity: 'HIGH',
      scoreContribution: 15,
      explanation: 'High value transaction (>50,000) from an account with fewer than 5 previous transactions.',
      evidence: `Amount: ${input.amount}, Total Transactions: ${input.customerTotalTransactions}`
    });
  }

  return factors;
}
