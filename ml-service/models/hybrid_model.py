import time
from typing import Dict, Any, List
from features.transaction import extract_transaction_features
from features.behavioral import extract_behavioral_features
from graph.builder import HeterogeneousGraphBuilder
from models.lightgbm_model import CalibratedTabularModel
from models.confidence import ConfidenceScorer
from config import (
    COST_FALSE_POSITIVE,
    COST_FALSE_NEGATIVE,
    COST_MANUAL_REVIEW,
    WEIGHT_TABULAR,
    WEIGHT_BEHAVIORAL,
    WEIGHT_GRAPH_RING,
    WEIGHT_COLD_TABULAR,
    WEIGHT_COLD_GRAPH_RING,
)

class HybridRiskAggregator:
    """
    Cost-Aware, False-Positive-Resistant Hybrid Decision Engine:
    1. Feature Extraction Pipelines (Tabular + Behavioral)
    2. Abuse-Ring Relational Graph Engine (ring_risk ∈ [0, 1])
    3. Multi-Modal Risk Aggregation (Tabular + Behavioral + Graph)
    4. Evidence-Based False-Positive Guard
    5. Expected Business Loss Optimization (C_fp vs C_fn)
    """
    def __init__(self):
        self.tabular_model = CalibratedTabularModel()
        self.graph_builder = HeterogeneousGraphBuilder()

    def evaluate(self, tx_dict: Dict[str, Any]) -> Dict[str, Any]:
        start_time = time.time()
        
        # 1. Feature Pipelines
        tx_features = extract_transaction_features(tx_dict)
        beh_features, history_available, beh_meta = extract_behavioral_features(tx_dict)
        
        # 2. Graph Pipeline & Abuse-Ring Risk
        tx_id = self.graph_builder.add_transaction_subgraph(tx_dict)
        graph_context = self.graph_builder.extract_ego_network(tx_id, depth=2)
        ring_risk = self.graph_builder.compute_ring_risk(tx_id, tx_dict)
        
        # 3. Model Inferences
        p_tabular = self.tabular_model.predict_proba(tx_features)
        
        # Behavioral deviation score
        if history_available:
            z_score = beh_meta.get("zScore", 0.0)
            velocity = beh_meta.get("velocity5Min", 0)
            p_beh = min(max(0.1 + (max(z_score - 1.5, 0.0) * 0.25) + (velocity * 0.08), 0.05), 0.95)
        else:
            p_beh = p_tabular

        # 4. Multi-Modal Risk Aggregation
        if history_available:
            risk_prob = (WEIGHT_TABULAR * p_tabular) + (WEIGHT_BEHAVIORAL * p_beh) + (WEIGHT_GRAPH_RING * ring_risk)
        else:
            # Cold-start re-weighting (no behavioral history penalty)
            risk_prob = (WEIGHT_COLD_TABULAR * p_tabular) + (WEIGHT_COLD_GRAPH_RING * ring_risk)
            
        risk_score = int(round(risk_prob * 100))
        risk_score = max(min(risk_score, 100), 1)

        # 5. Confidence Calculation
        customer_tx_count = tx_dict.get("customerTotalTransactions", 0) or 0
        device_observed = bool(tx_dict.get("deviceId") or tx_dict.get("deviceFingerprint"))
        confidence = ConfidenceScorer.compute_confidence(
            history_available=history_available,
            identity_available=True,
            graph_available=True,
            graph_density=graph_context.get("graphDensity", 0.1),
            customer_tx_count=customer_tx_count,
            device_observed=device_observed
        )

        # 6. Expected Business Loss Calculation (Cost-Aware Decisioning)
        loss_approve = risk_prob * COST_FALSE_NEGATIVE
        loss_block = (1.0 - risk_prob) * COST_FALSE_POSITIVE
        loss_review = COST_MANUAL_REVIEW + (risk_prob * 0.10 * COST_FALSE_NEGATIVE)

        # 7. False-Positive Protection Guard (Evidence-Based)
        is_tor = bool(tx_dict.get("isTorIp"))
        is_suspicious_net = bool(tx_dict.get("isSuspiciousIp"))
        extreme_velocity = int(tx_dict.get("transactionsInLast5Min", 0) or 0) >= 10
        high_switches = int(tx_dict.get("paymentInstrumentSwitchCount", 0) or 0) >= 3

        has_strong_fraud_evidence = (
            ring_risk >= 0.60 or
            is_tor or
            (is_suspicious_net and risk_prob >= 0.70) or
            extreme_velocity or
            high_switches or
            (risk_prob >= 0.85 and confidence >= 0.70)
        )

        is_weak_anomaly_only = not has_strong_fraud_evidence

        # Cost-aware action selection
        if is_weak_anomaly_only:
            if loss_approve <= loss_review or risk_score < 60:
                decision = "APPROVE"
            else:
                decision = "REVIEW"
        else:
            min_loss = min(loss_approve, loss_review, loss_block)
            if min_loss == loss_block and risk_prob >= 0.75:
                decision = "BLOCK"
            elif min_loss == loss_review or risk_score >= 55:
                decision = "REVIEW"
            else:
                decision = "APPROVE"

        # 8. Structured Evidence Generation
        evidence: List[Dict[str, Any]] = []

        if not history_available:
            evidence.append({
                "category": "DATA_AVAILABILITY",
                "description": "First-time customer with zero historical merchant transactions. False positive guard active.",
                "severity": "LOW",
                "source": "BEHAVIORAL_ENGINE",
                "evidenceData": {"historyAvailable": False}
            })
        else:
            if beh_meta.get("zScore", 0) > 2.0:
                evidence.append({
                    "category": "BEHAVIOR",
                    "description": f"Transaction amount is {beh_meta.get('amountDeviationRatio')}x higher than customer baseline (Z-Score: +{beh_meta.get('zScore')}).",
                    "severity": "MEDIUM" if beh_meta.get("zScore") < 3.5 else "HIGH",
                    "source": "BEHAVIORAL_ENGINE",
                    "evidenceData": beh_meta
                })

        if tx_dict.get("isNewDevice"):
            evidence.append({
                "category": "CONTEXT",
                "description": "New device observed. Contextual signal protected by False-Positive Guard.",
                "severity": "LOW",
                "source": "HEURISTIC",
                "evidenceData": {"isNewDevice": True}
            })

        if is_tor or tx_dict.get("isProxyIp") or tx_dict.get("isVpnIp"):
            net_type = "Tor exit node" if is_tor else "VPN / Proxy"
            evidence.append({
                "category": "CONTEXT",
                "description": f"Network originating from {net_type}.",
                "severity": "HIGH" if is_tor else "MEDIUM",
                "source": "NETWORK_INTEL",
                "evidenceData": {"network": net_type}
            })

        # Abuse-Ring Graph Relational Evidence
        if ring_risk >= 0.50:
            evidence.append({
                "category": "GRAPH",
                "description": f"Abuse-Ring Sentinel flagged elevated ring risk ({ring_risk:.2f}) across shared entity infrastructure.",
                "severity": "HIGH" if ring_risk >= 0.70 else "MEDIUM",
                "source": "GRAPH_RELATIONAL_ENGINE",
                "evidenceData": {"ringRisk": round(ring_risk, 3), "sharedEntities": graph_context.get("sharedEntityCount", 0)}
            })
        else:
            evidence.append({
                "category": "GRAPH",
                "description": f"Abuse-Ring Sentinel confirmed clean isolation with low ring risk ({ring_risk:.2f}).",
                "severity": "LOW",
                "source": "GRAPH_RELATIONAL_ENGINE",
                "evidenceData": {"ringRisk": round(ring_risk, 3)}
            })

        # Tabular Risk Scorer Evidence
        evidence.append({
            "category": "TRANSACTION",
            "description": f"Calibrated tabular risk scorer predicted fraud probability of {p_tabular:.2f}.",
            "severity": "HIGH" if p_tabular >= 0.70 else "MEDIUM" if p_tabular >= 0.40 else "LOW",
            "source": "TABULAR_RISK_SCORER",
            "evidenceData": {"p_tabular": round(p_tabular, 3)}
        })

        processing_time_ms = int((time.time() - start_time) * 1000)

        return {
            "riskProbability": round(risk_prob, 3),
            "riskScore": risk_score,
            "ringRisk": round(ring_risk, 3),
            "confidence": confidence,
            "decision": decision,
            "modelVersion": "abuse-ring-sentinel-v1.0",
            "anomalyScore": round(float(ring_risk * 100), 1),
            "dataAvailability": {
                "historyAvailable": history_available,
                "identityAvailable": True,
                "graphAvailable": True,
                "behavioralFeaturesAvailable": history_available
            },
            "evidence": evidence,
            "modelBreakdown": {
                "tabular": round(p_tabular, 3),
                "behavioral": round(p_beh, 3),
                "graph": round(ring_risk, 3),
                # Backward-compatible aliases
                "lightgbm": round(p_tabular, 3),
                "gnn": round(ring_risk, 3)
            },
            "expectedCosts": {
                "approveExpectedLoss": round(loss_approve, 1),
                "blockExpectedLoss": round(loss_block, 1),
                "reviewExpectedLoss": round(loss_review, 1)
            },
            "processingTimeMs": max(processing_time_ms, 5)
        }
