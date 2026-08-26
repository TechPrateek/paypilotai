import { RiskThresholds, RiskAssessmentResult } from './types';

// Centralized Business Cost Model (INR)
export const COST_FALSE_POSITIVE = 450;
export const COST_FALSE_NEGATIVE = 4500;
export const COST_MANUAL_REVIEW = 120;

export function makeDecision(
  riskScore: number,
  hasStrongFraudEvidence: boolean = false,
  thresholds?: RiskThresholds
): { decision: RiskAssessmentResult['decision']; riskLevel: RiskAssessmentResult['riskLevel']; expectedLoss: { approve: number; block: number; review: number } } {
  const pFraud = Math.max(Math.min(riskScore / 100, 0.99), 0.01);
  const pLegit = 1 - pFraud;

  // Expected business losses
  const lossApprove = Math.round(pFraud * COST_FALSE_NEGATIVE);
  const lossBlock = Math.round(pLegit * COST_FALSE_POSITIVE);
  const lossReview = Math.round(COST_MANUAL_REVIEW + (pFraud * 0.10 * COST_FALSE_NEGATIVE));

  const expectedLoss = { approve: lossApprove, block: lossBlock, review: lossReview };

  let decision: RiskAssessmentResult['decision'] = 'APPROVE';
  let riskLevel: RiskAssessmentResult['riskLevel'] = 'LOW';

  if (riskScore >= 80) {
    riskLevel = 'CRITICAL';
  } else if (riskScore >= 60) {
    riskLevel = 'HIGH';
  } else if (riskScore >= 30) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'LOW';
  }

  // False-Positive Protection Guard
  if (!hasStrongFraudEvidence) {
    // Weak signals alone CANNOT trigger a hard BLOCK
    if (riskScore < 60) {
      decision = 'APPROVE';
    } else {
      decision = 'REVIEW';
    }
  } else {
    // Strong evidence present: choose action with lowest expected business loss
    if (riskScore >= 80 && lossBlock < lossApprove) {
      decision = 'BLOCK';
    } else if (riskScore >= 55) {
      decision = 'REVIEW';
    } else {
      decision = 'APPROVE';
    }
  }

  return { decision, riskLevel, expectedLoss };
}
