import { RiskThresholds, RiskAssessmentResult } from './types';

export function makeDecision(riskScore: number, thresholds?: RiskThresholds): { decision: RiskAssessmentResult['decision']; riskLevel: RiskAssessmentResult['riskLevel'] } {
  const t = thresholds || {
    low: 29,
    medium: 59,
    high: 79,
    critical: 100
  };

  if (riskScore <= t.low) {
    return { decision: 'APPROVE', riskLevel: 'LOW' };
  } else if (riskScore <= t.medium) {
    return { decision: 'APPROVE_WITH_MONITORING', riskLevel: 'MEDIUM' };
  } else if (riskScore <= t.high) {
    return { decision: 'REVIEW', riskLevel: 'HIGH' };
  } else {
    return { decision: 'BLOCK', riskLevel: 'CRITICAL' };
  }
}
