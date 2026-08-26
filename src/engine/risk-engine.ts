import { TransactionInput, RiskAssessmentResult, RiskFactorResult } from './types';
import { evaluateAmountRisk } from './rules/amount-risk';
import { evaluateVelocityRisk } from './rules/velocity-risk';
import { evaluateDeviceRisk } from './rules/device-risk';
import { evaluateLocationRisk } from './rules/location-risk';
import { evaluateAccountRisk } from './rules/account-risk';
import { evaluateIpRisk } from './rules/ip-risk';
import { evaluatePaymentRisk } from './rules/payment-risk';
import { evaluateBehaviorRisk } from './rules/behavior-risk';
import { detectAnomaly } from './anomaly-detector';
import { makeDecision } from './decision-engine';
import { detectAttackPattern } from './attack-detector';
import { generateExplanation } from './explanation-generator';

export function analyzeTransaction(input: TransactionInput): RiskAssessmentResult {
  const startTime = Date.now();
  
  let factors: RiskFactorResult[] = [];
  
  factors = factors.concat(evaluateAmountRisk(input));
  factors = factors.concat(evaluateVelocityRisk(input));
  factors = factors.concat(evaluateDeviceRisk(input));
  factors = factors.concat(evaluateLocationRisk(input));
  factors = factors.concat(evaluateAccountRisk(input));
  factors = factors.concat(evaluateIpRisk(input));
  factors = factors.concat(evaluatePaymentRisk(input));
  factors = factors.concat(evaluateBehaviorRisk(input));

  let riskScore = 0;
  for (const factor of factors) {
    riskScore += factor.scoreContribution;
  }

  const { anomalyScore } = detectAnomaly(input);
  if (anomalyScore >= 75) {
    riskScore += 10;
  }

  riskScore = Math.min(Math.max(riskScore, 0), 100);

  const hasStrongFraudEvidence = Boolean(
    input.isSuspiciousIp ||
    (input.transactionsInLast5Min >= 10) ||
    (input.previousFailedAttempts >= 5)
  );

  const { decision, riskLevel } = makeDecision(riskScore, hasStrongFraudEvidence);
  const attackPattern = detectAttackPattern(input, factors);

  const processingTimeMs = Date.now() - startTime;

  const result: RiskAssessmentResult = {
    riskScore,
    riskLevel,
    decision,
    factors,
    anomalyScore,
    attackPattern,
    processingTimeMs
  };

  return result;
}
