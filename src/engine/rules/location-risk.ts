import { TransactionInput, RiskFactorResult } from '../types';

const HIGH_RISK_COUNTRIES = ['NG', 'GH', 'PK', 'BD', 'VN', 'PH'];

export function evaluateLocationRisk(input: TransactionInput): RiskFactorResult[] {
  const factors: RiskFactorResult[] = [];

  if (input.customerCountries.length > 0 && !input.customerCountries.includes(input.country)) {
    factors.push({
      name: 'Unusual Location',
      category: 'Location Risk',
      severity: 'HIGH',
      scoreContribution: 15,
      explanation: 'Transaction from a country different from all customer\'s previous countries.',
      evidence: `Current: ${input.country}, Historical: ${input.customerCountries.join(', ')}`
    });
  }

  if (HIGH_RISK_COUNTRIES.includes(input.country)) {
    factors.push({
      name: 'High Risk Country',
      category: 'Location Risk',
      severity: 'MEDIUM',
      scoreContribution: 10,
      explanation: 'Country is listed in high-risk locations.',
      evidence: `Country: ${input.country}`
    });
  }

  const allCountries = new Set([...input.customerCountries, input.country]);
  if (allCountries.size >= 3) {
    factors.push({
      name: 'Multiple Countries Detected',
      category: 'Location Risk',
      severity: 'HIGH',
      scoreContribution: 20,
      explanation: 'Customer has transactions from 3 or more different countries.',
      evidence: `Countries count: ${allCountries.size}`
    });
  }

  return factors;
}
