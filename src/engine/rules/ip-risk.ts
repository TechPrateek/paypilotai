import { TransactionInput, RiskFactorResult } from '../types';

export function evaluateIpRisk(input: TransactionInput): RiskFactorResult[] {
  const factors: RiskFactorResult[] = [];

  if (input.isSuspiciousIp) {
    factors.push({
      name: 'Suspicious IP Address',
      category: 'IP Risk',
      severity: 'CRITICAL',
      scoreContribution: 30,
      explanation: 'IP address matches known bad actors or botnets.',
      evidence: 'isSuspiciousIp = true'
    });
  }

  if (input.isProxyIp) {
    factors.push({
      name: 'Proxy IP Detected',
      category: 'IP Risk',
      severity: 'HIGH',
      scoreContribution: 15,
      explanation: 'Connection is routed through a proxy server.',
      evidence: 'isProxyIp = true'
    });
  }

  if (input.isVpnIp) {
    factors.push({
      name: 'VPN IP Detected',
      category: 'IP Risk',
      severity: 'MEDIUM',
      scoreContribution: 10,
      explanation: 'Connection is routed through a VPN.',
      evidence: 'isVpnIp = true'
    });
  }

  if (!input.ip) {
    factors.push({
      name: 'Missing IP Address',
      category: 'IP Risk',
      severity: 'LOW',
      scoreContribution: 5,
      explanation: 'No IP address provided with transaction.',
      evidence: 'ip is empty'
    });
  }

  return factors;
}
