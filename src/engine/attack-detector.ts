import { TransactionInput, RiskFactorResult } from './types';

export function detectAttackPattern(input: TransactionInput, factors: RiskFactorResult[]): string | undefined {
  if (input.transactionsInLast5Min >= 10 && input.amount < 500) {
    return 'CARD_TESTING';
  }

  if (input.isNewDevice && input.customerCountries.length > 0 && !input.customerCountries.includes(input.country) && input.amount > (input.customerAverageAmount * 2)) {
    return 'ACCOUNT_TAKEOVER';
  }

  if (input.transactionsInLast5Min >= 5 && input.amount > 10000) {
    return 'VELOCITY_ATTACK';
  }

  if (input.amount > (input.customerAverageAmount * 3) && input.isSuspiciousIp && input.previousFailedAttempts >= 3) {
    return 'PAYMENT_FRAUD';
  }

  if (input.previousDisputes >= 3) {
    return 'FRIENDLY_FRAUD';
  }

  const allCountries = new Set([...input.customerCountries, input.country]);
  if (allCountries.size >= 3 && input.transactionsInLast1Hour >= 3) {
    return 'IMPOSSIBLE_TRAVEL';
  }

  return undefined;
}
