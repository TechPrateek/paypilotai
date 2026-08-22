import { TransactionInput, RiskFactorResult } from '../types';

export function evaluateAccountRisk(input: TransactionInput): RiskFactorResult[] {
  const factors: RiskFactorResult[] = [];

  if (input.accountAgeDays < 1) {
    factors.push({
      name: 'Brand New Account',
      category: 'Account Risk',
      severity: 'CRITICAL',
      scoreContribution: 20,
      explanation: 'Account is less than 1 day old.',
      evidence: `Age: ${input.accountAgeDays} days`
    });
  } else if (input.accountAgeDays < 7) {
    factors.push({
      name: 'Very New Account',
      category: 'Account Risk',
      severity: 'HIGH',
      scoreContribution: 15,
      explanation: 'Account is less than a week old.',
      evidence: `Age: ${input.accountAgeDays} days`
    });
  } else if (input.accountAgeDays < 30) {
    factors.push({
      name: 'New Account',
      category: 'Account Risk',
      severity: 'LOW',
      scoreContribution: 5,
      explanation: 'Account is less than a month old.',
      evidence: `Age: ${input.accountAgeDays} days`
    });
  }

  return factors;
}
