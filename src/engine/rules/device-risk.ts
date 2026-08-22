import { TransactionInput, RiskFactorResult } from '../types';

export function evaluateDeviceRisk(input: TransactionInput): RiskFactorResult[] {
  const factors: RiskFactorResult[] = [];

  if (input.isNewDevice) {
    factors.push({
      name: 'New Device Detected',
      category: 'Device Risk',
      severity: 'MEDIUM',
      scoreContribution: 15,
      explanation: 'Device never seen before for this customer.',
      evidence: 'isNewDevice = true'
    });
  }

  if (input.customerDeviceCount > 7) {
    factors.push({
      name: 'Excessive Devices',
      category: 'Device Risk',
      severity: 'CRITICAL',
      scoreContribution: 25,
      explanation: 'Device used by many customers or customer uses unusually high number of devices.',
      evidence: `Device Count: ${input.customerDeviceCount}`
    });
  } else if (input.customerDeviceCount > 5) {
    factors.push({
      name: 'High Device Count',
      category: 'Device Risk',
      severity: 'HIGH',
      scoreContribution: 20,
      explanation: 'Customer has associated with a high number of devices.',
      evidence: `Device Count: ${input.customerDeviceCount}`
    });
  }

  if (!input.deviceFingerprint) {
    factors.push({
      name: 'Missing Device Fingerprint',
      category: 'Device Risk',
      severity: 'LOW',
      scoreContribution: 5,
      explanation: 'Missing device information, potentially masked.',
      evidence: 'deviceFingerprint is empty'
    });
  }

  return factors;
}
