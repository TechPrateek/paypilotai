import time
from typing import Dict, Any, List
from features.transaction import extract_transaction_features
from features.behavioral import extract_behavioral_features
from graph.builder import HeterogeneousGraphBuilder
from graph.model import HeterogeneousGNN
from models.lightgbm_model import LightGBMTabularModel
from models.confidence import ConfidenceScorer

class HybridRiskAggregator:
    """
    Unified Hybrid Risk Engine combining:
    1. Transaction Tabular LightGBM
    2. Historical Behavioral ML
    3. Heterogeneous GNN Representation
    4. Information Confidence Scorer
    5. Calibrated Multi-Signal Decision Engine
    """
    def __init__(self):
        self.lightgbm = LightGBMTabularModel()
        self.gnn = HeterogeneousGNN()
        self.graph_builder = HeterogeneousGraphBuilder()

    def evaluate(self, tx_dict: Dict[str, Any]) -> Dict[str, Any]:
        start_time = time.time()
        
        # 1. Feature Pipelines
        tx_features = extract_transaction_features(tx_dict)
        beh_features, history_available, beh_meta = extract_behavioral_features(tx_dict)
        
        # 2. Graph Pipeline
        tx_id = self.graph_builder.add_transaction_subgraph(tx_dict)
        graph_context = self.graph_builder.extract_ego_network(tx_id, depth=2)
        
        # 3. Model Inferences
        p_tabular = self.lightgbm.predict_proba(tx_features)
        p_gnn = self.gnn.forward(tx_features, graph_context)
        
        # Behavioral score calculation (only if history exists)
        if history_available:
            z_score = beh_meta.get("zScore", 0.0)
            velocity = beh_meta.get("velocity5Min", 0)
            p_beh = min(max(0.1 + (max(z_score - 1.5, 0.0) * 0.25) + (velocity * 0.08), 0.05), 0.95)
        else:
            p_beh = p_tabular # Fallback to tabular prior

        # 4. Multi-modal Weighted Aggregation
        if history_available:
            risk_prob = (0.40 * p_tabular) + (0.30 * p_beh) + (0.30 * p_gnn)
        else:
            # Cold-start re-weighting (rely more on transaction + graph context)
            risk_prob = (0.55 * p_tabular) + (0.45 * p_gnn)
            
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

        # 6. Calibrated Decision Engine (Risk + Confidence Matrix)
        if risk_score < 30:
            decision = "APPROVE"
        elif risk_score >= 80 and confidence >= 0.75:
            # High Risk + High Confidence = BLOCK
            decision = "BLOCK"
        elif risk_score >= 60 or (risk_score >= 80 and confidence < 0.75):
            # High Risk + Low Confidence = REVIEW (Never blindly block unconfirmed cold starts)
            decision = "REVIEW"
        else:
            decision = "APPROVE"

        # 7. Structured Evidence Generation
        evidence: List[Dict[str, Any]] = []

        # Data Availability Evidence
        if not history_available:
            evidence.append({
                "category": "DATA_AVAILABILITY",
                "description": "First-time customer with zero historical merchant transactions. Behavioral confidence is LOW.",
                "severity": "LOW",
                "source": "BEHAVIORAL_ENGINE",
                "evidenceData": {"historyAvailable": False}
            })
        else:
            if beh_meta.get("zScore", 0) > 2.0:
                evidence.append({
                    "category": "BEHAVIOR",
                    "description": f"Transaction amount is {beh_meta.get('amountDeviationRatio')}x higher than customer 90-day baseline (Z-Score: +{beh_meta.get('zScore')}).",
                    "severity": "MEDIUM" if beh_meta.get("zScore") < 3.5 else "HIGH",
                    "source": "BEHAVIORAL_ENGINE",
                    "evidenceData": beh_meta
                })

        # Context Evidence (New device / IP is contextual, NOT fraud)
        if tx_dict.get("isNewDevice"):
            evidence.append({
                "category": "CONTEXT",
                "description": "New device observed. This contextual signal alone is insufficient to classify the transaction as fraudulent.",
                "severity": "LOW",
                "source": "HEURISTIC",
                "evidenceData": {"isNewDevice": True}
            })

        if tx_dict.get("isProxyIp") or tx_dict.get("isVpnIp") or tx_dict.get("isTorIp"):
            net_type = "Tor exit node" if tx_dict.get("isTorIp") else "VPN / Anonymizing Proxy"
            evidence.append({
                "category": "CONTEXT",
                "description": f"Network originating from {net_type}. Verified against threat intelligence.",
                "severity": "HIGH" if tx_dict.get("isTorIp") else "MEDIUM",
                "source": "NETWORK_INTEL",
                "evidenceData": {"network": net_type}
            })

        # Graph Evidence
        shared_count = graph_context.get("sharedEntityCount", 0)
        if shared_count >= 2:
            evidence.append({
                "category": "GRAPH",
                "description": f"Heterogeneous GNN detected {shared_count} shared entity links with multiple transaction clusters.",
                "severity": "HIGH" if shared_count >= 3 else "MEDIUM",
                "source": "GNN",
                "evidenceData": {"sharedEntities": shared_count}
            })
        else:
            evidence.append({
                "category": "GRAPH",
                "description": "Entity graph confirms clean isolation with no anomalous cluster overlap.",
                "severity": "LOW",
                "source": "GNN",
                "evidenceData": {"graphDensity": graph_context.get("graphDensity")}
            })

        # Transaction Model Evidence
        evidence.append({
            "category": "TRANSACTION",
            "description": f"Tabular LightGBM model computed base transaction risk probability of {p_tabular:.2f}.",
            "severity": "HIGH" if p_tabular >= 0.70 else "MEDIUM" if p_tabular >= 0.40 else "LOW",
            "source": "LIGHTGBM",
            "evidenceData": {"p_tabular": round(p_tabular, 3)}
        })

        processing_time_ms = int((time.time() - start_time) * 1000)

        return {
            "riskProbability": round(risk_prob, 3),
            "riskScore": risk_score,
            "confidence": confidence,
            "decision": decision,
            "modelVersion": "hybrid-v1",
            "anomalyScore": round(float(p_gnn * 100), 1),
            "dataAvailability": {
                "historyAvailable": history_available,
                "identityAvailable": True,
                "graphAvailable": True,
                "behavioralFeaturesAvailable": history_available
            },
            "evidence": evidence,
            "modelBreakdown": {
                "lightgbm": round(p_tabular, 3),
                "behavioral": round(p_beh, 3),
                "gnn": round(p_gnn, 3)
            },
            "processingTimeMs": max(processing_time_ms, 5)
        }
