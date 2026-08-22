import { TransactionInput } from './types';

export function detectAnomaly(input: TransactionInput): { anomalyScore: number; isAnomalous: boolean; explanation: string } {
  if (input.customerAverageAmount <= 0) {
    return {
      anomalyScore: 0,
      isAnomalous: false,
      explanation: 'Insufficient history for anomaly detection'
    };
  }

  const estimatedStdDev = input.customerAverageAmount * 0.5;
  const zScore = Math.abs(input.amount - input.customerAverageAmount) / estimatedStdDev;

  let anomalyScore = 0;
  let explanation = '';

  if (zScore > 3) {
    anomalyScore = 95;
    explanation = 'Extremely unusual amount';
  } else if (zScore > 2) {
    anomalyScore = 75;
    explanation = 'Significantly higher than normal';
  } else if (zScore > 1.5) {
    anomalyScore = 50;
    explanation = 'Moderately unusual';
  } else {
    anomalyScore = Math.min(Math.round(zScore * 20), 100);
    explanation = anomalyScore > 20 ? 'Slightly unusual' : 'Normal variation';
  }

  return {
    anomalyScore,
    isAnomalous: anomalyScore >= 75,
    explanation
  };
}
