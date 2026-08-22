import { RiskAssessmentResult, TransactionInput } from './types';

export function generateExplanation(result: RiskAssessmentResult, input: TransactionInput): string {
  let explanation = `Assessment: Transaction categorized as ${result.riskLevel} risk (Score: ${result.riskScore}). Action recommended: ${result.decision}.\n\n`;

  if (result.attackPattern) {
    explanation += `ALERT: Detected potential ${result.attackPattern} pattern.\n\n`;
  }

  if (result.factors.length === 0) {
    explanation += 'No significant risk factors identified for this transaction.\n';
  } else {
    explanation += 'Contributing factors:\n';
    for (const factor of result.factors) {
      explanation += `- [${factor.severity}] ${factor.name}: ${factor.explanation} (Evidence: ${factor.evidence})\n`;
    }
  }

  if (result.anomalyScore > 0) {
    explanation += `\nAnomaly Detection: Score of ${result.anomalyScore}/100 based on user historical patterns.`;
  }

  return explanation;
}
