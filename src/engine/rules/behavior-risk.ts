import { TransactionInput, RiskFactorResult } from '../types';

export function evaluateBehaviorRisk(input: TransactionInput): RiskFactorResult[] {
  const factors: RiskFactorResult[] = [];

  if (input.previousFailedAttempts >= 5) {
    factors.push({
      name: 'Excessive Failed Attempts',
      category: 'Behavior Risk',
      severity: 'CRITICAL',
      scoreContribution: 20,
      explanation: 'Numerous consecutive failed payment attempts.',
      evidence: `Failed Attempts: ${input.previousFailedAttempts}`
    });
  } else if (input.previousFailedAttempts >= 3) {
    factors.push({
      name: 'Multiple Failed Attempts',
      category: 'Behavior Risk',
      severity: 'HIGH',
      scoreContribution: 10,
      explanation: 'Several recent failed payment attempts.',
      evidence: `Failed Attempts: ${input.previousFailedAttempts}`
    });
  }

  if (input.isDisposableEmail) {
    factors.push({
      name: 'Disposable Email',
      category: 'Behavior Risk',
      severity: 'MEDIUM',
      scoreContribution: 10,
      explanation: 'Email address belongs to a disposable email provider.',
      evidence: 'isDisposableEmail = true'
    });
  }

  if (input.previousDisputes >= 3) {
    factors.push({
      name: 'Frequent Disputes',
      category: 'Behavior Risk',
      severity: 'HIGH',
      scoreContribution: 15,
      explanation: 'Frequent disputes - possible friendly fraud.',
      evidence: `Disputes: ${input.previousDisputes}`
    });
  } else if (input.previousDisputes >= 1) {
    factors.push({
      name: 'Prior Disputes',
      category: 'Behavior Risk',
      severity: 'MEDIUM',
      scoreContribution: 5,
      explanation: 'Customer has history of disputing transactions.',
      evidence: `Disputes: ${input.previousDisputes}`
    });
  }

  return factors;
}
