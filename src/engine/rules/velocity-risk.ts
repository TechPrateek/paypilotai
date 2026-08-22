import { TransactionInput, RiskFactorResult } from '../types';

export function evaluateVelocityRisk(input: TransactionInput): RiskFactorResult[] {
  const factors: RiskFactorResult[] = [];

  if (input.transactionsInLast5Min >= 10) {
    factors.push({
      name: 'Extreme Transaction Velocity',
      category: 'Velocity Risk',
      severity: 'CRITICAL',
      scoreContribution: 30,
      explanation: 'Card testing attack pattern detected due to very high transaction frequency within 5 minutes.',
      evidence: `${input.transactionsInLast5Min} transactions in last 5 min`
    });
  } else if (input.transactionsInLast5Min >= 5) {
    factors.push({
      name: 'High Transaction Velocity',
      category: 'Velocity Risk',
      severity: 'HIGH',
      scoreContribution: 20,
      explanation: 'High transaction velocity detected within 5 minutes.',
      evidence: `${input.transactionsInLast5Min} transactions in last 5 min`
    });
  }

  if (input.transactionsInLast1Hour >= 20) {
    factors.push({
      name: 'High Hourly Volume',
      category: 'Velocity Risk',
      severity: 'HIGH',
      scoreContribution: 15,
      explanation: 'Unusual number of transactions within the last hour.',
      evidence: `${input.transactionsInLast1Hour} transactions in last hour`
    });
  }

  if (input.customerDeviceCount > 3 && input.transactionsInLast5Min > 2) {
    factors.push({
      name: 'Rapid Device Switching',
      category: 'Velocity Risk',
      severity: 'HIGH',
      scoreContribution: 15,
      explanation: 'Multiple devices used in a short time frame.',
      evidence: `Devices: ${input.customerDeviceCount}, Transactions in 5min: ${input.transactionsInLast5Min}`
    });
  }

  return factors;
}
