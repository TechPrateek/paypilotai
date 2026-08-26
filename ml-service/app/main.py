"""
Abuse-Ring Sentinel — FastAPI Backend Service
Provides graph investigation, ring detection, timeline analysis, real-time ML inference, and empirical evaluation APIs.
"""

import json
import os
import sys
import time
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from dataset.generator import generate_synthetic_dataset
from evaluation.heldout_evaluator import run_heldout_evaluation
from models.hybrid_model import HybridRiskAggregator
from app.schemas import TransactionPredictionRequest, PredictionResponse

app = FastAPI(
    title="Abuse-Ring Sentinel API",
    description="Coordinated Payment Abuse Detection & Investigation Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATASET_PATH = os.path.join(os.path.dirname(__file__), "..", "dataset", "synthetic_abuse_dataset.json")
EVAL_PATH = os.path.join(os.path.dirname(__file__), "..", "dataset", "evaluation_results.json")

# Persistent Hybrid Aggregator instance
risk_aggregator = HybridRiskAggregator()

def load_data() -> Dict[str, Any]:
    if not os.path.exists(DATASET_PATH):
        generate_synthetic_dataset(os.path.dirname(DATASET_PATH))
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def load_evaluation() -> Dict[str, Any]:
    if not os.path.exists(EVAL_PATH):
        run_heldout_evaluation()
    with open(EVAL_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "Abuse-Ring Sentinel",
        "detection_engine": "ONLINE",
        "model_version": "abuse-ring-sentinel-v1.0",
        "environment": "SYNTHETIC_EVALUATION"
    }

# =========================================================================
# 0. Real ML Inference Endpoint (/api/predict)
# =========================================================================
@app.post("/api/predict")
def predict_transaction(req: TransactionPredictionRequest):
    """
    Real-time multi-modal fraud & abuse-ring inference:
    Tabular + Behavioral + Graph Relational Scoring + Cost-Optimal Decisioning.
    """
    try:
        req_dict = req.dict()
        eval_result = risk_aggregator.evaluate(req_dict)
        
        # Determine risk level
        score = eval_result["riskScore"]
        if score >= 80:
            risk_level = "CRITICAL"
        elif score >= 60:
            risk_level = "HIGH"
        elif score >= 30:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
            
        # Map decision format
        decision = eval_result["decision"]
        if decision == "APPROVE" and score >= 30:
            decision_code = "APPROVE_WITH_MONITORING"
        else:
            decision_code = decision

        # Extract risk factors with explicit contributions
        factors = []
        model_breakdown = eval_result.get("modelBreakdown", {})
        graph_prob = model_breakdown.get("graph", model_breakdown.get("gnn", 0))
        tabular_prob = model_breakdown.get("tabular", model_breakdown.get("lightgbm", 0))
        beh_prob = model_breakdown.get("behavioral", 0)

        if graph_prob >= 0.5:
            factors.append({
                "name": "shared_entity_infrastructure",
                "category": "GRAPH",
                "severity": "CRITICAL" if graph_prob >= 0.75 else "HIGH",
                "score_contribution": int(round(graph_prob * 35)),
                "explanation": f"Graph relational engine detected elevated multi-hop entity sharing score ({graph_prob:.2f}) across devices/IPs."
            })
        if tabular_prob >= 0.5:
            factors.append({
                "name": "tabular_fraud_anomaly",
                "category": "TRANSACTION",
                "severity": "HIGH",
                "score_contribution": int(round(tabular_prob * 30)),
                "explanation": f"Calibrated tabular risk scorer estimated fraud probability of {tabular_prob:.2f}."
            })
        if beh_prob >= 0.5:
            factors.append({
                "name": "behavioral_deviation",
                "category": "BEHAVIOR",
                "severity": "HIGH" if beh_prob >= 0.75 else "MEDIUM",
                "score_contribution": int(round(beh_prob * 25)),
                "explanation": f"Transaction deviates significantly from customer historical baseline."
            })
            
        return {
            "transaction_id": req.transactionId or f"tx_{int(time.time()*1000)}",
            "transactionId": req.transactionId or f"tx_{int(time.time()*1000)}",
            "risk_probability": eval_result["riskProbability"],
            "riskProbability": eval_result["riskProbability"],
            "risk_score": eval_result["riskScore"],
            "riskScore": eval_result["riskScore"],
            "ring_risk": eval_result.get("ringRisk", 0.0),
            "ringRisk": eval_result.get("ringRisk", 0.0),
            "risk_level": risk_level,
            "riskLevel": risk_level,
            "decision": decision_code,
            "confidence": eval_result["confidence"],
            "model_version": "abuse-ring-sentinel-v1.0",
            "modelVersion": "abuse-ring-sentinel-v1.0",
            "anomaly_score": eval_result.get("anomalyScore", 0.0),
            "anomalyScore": eval_result.get("anomalyScore", 0.0),
            "risk_factors": factors,
            "risk_evidence": eval_result.get("evidence", []),
            "evidence": eval_result.get("evidence", []),
            "data_availability": eval_result.get("dataAvailability", {}),
            "dataAvailability": eval_result.get("dataAvailability", {}),
            "model_breakdown": eval_result.get("modelBreakdown", {}),
            "modelBreakdown": eval_result.get("modelBreakdown", {}),
            "expected_costs": eval_result.get("expectedCosts", {}),
            "expectedCosts": eval_result.get("expectedCosts", {}),
            "processing_time_ms": eval_result.get("processingTimeMs", 8),
            "processingTimeMs": eval_result.get("processingTimeMs", 8),
            "is_fallback": False
        }
    except Exception as e:
        print(f"Error during ML inference: {e}")
        raise HTTPException(status_code=500, detail=f"Inference execution failed: {str(e)}")

# =========================================================================
# 1. Rings APIs
# =========================================================================
@app.get("/api/rings")
def get_rings():
    data = load_data()
    return {
        "rings": data["rings"],
        "total_rings": len(data["rings"]),
        "active_rings_count": sum(1 for r in data["rings"] if r["status"] == "ACTIVE_THREAT"),
        "critical_rings_count": sum(1 for r in data["rings"] if r["severity"] == "CRITICAL"),
        "total_exposure": sum(r["exposure"] for r in data["rings"]),
        "total_accounts_affected": sum(r["accounts_count"] for r in data["rings"])
    }

@app.get("/api/rings/{ring_id}")
def get_ring_detail(ring_id: str):
    data = load_data()
    ring = next((r for r in data["rings"] if r["id"].upper() == ring_id.upper()), None)
    if not ring:
        raise HTTPException(status_code=404, detail=f"Ring '{ring_id}' not found")
        
    ring_txs = [tx for tx in data["transactions"] if tx.get("cluster_id") == ring["id"]]
    customers = list({tx["customer_id"] for tx in ring_txs})
    devices = list({tx["device_id"] for tx in ring_txs})
    ips = list({tx["ip_id"] for tx in ring_txs})
    cards = list({tx["payment_id"] for tx in ring_txs})
    
    blast_radius = {
        "affected_customers": len(customers),
        "affected_transactions": len(ring_txs),
        "affected_devices": len(devices),
        "affected_ips": len(ips),
        "affected_payments": len(cards),
        "total_exposure": ring["exposure"]
    }
    
    return {
        "ring": ring,
        "blast_radius": blast_radius,
        "dna": ring["dna"],
        "signals": ring["signals"]
    }

@app.get("/api/rings/{ring_id}/graph")
def get_ring_graph(ring_id: str):
    data = load_data()
    ring = next((r for r in data["rings"] if r["id"].upper() == ring_id.upper()), None)
    if not ring:
        raise HTTPException(status_code=404, detail=f"Ring '{ring_id}' not found")
        
    ring_txs = [tx for tx in data["transactions"] if tx.get("cluster_id") == ring["id"]]
    
    nodes = []
    edges = []
    node_ids = set()
    
    # 1. Device Nodes
    for tx in ring_txs:
        did = f"dev_{tx['device_id']}"
        if did not in node_ids:
            node_ids.add(did)
            nodes.append({
                "id": did,
                "type": "device",
                "label": f"Device {tx['device_id']}",
                "data": {"id": tx["device_id"], "type": "Device", "risk": "CRITICAL", "entityId": tx["device_id"]}
            })
            
    # 2. IP Nodes
    for tx in ring_txs:
        ipid = f"ip_{tx['ip_id']}"
        if ipid not in node_ids:
            node_ids.add(ipid)
            nodes.append({
                "id": ipid,
                "type": "ip",
                "label": f"IP {tx['ip_id']}",
                "data": {"id": tx["ip_id"], "type": "IP", "risk": "CRITICAL", "entityId": tx["ip_id"]}
            })
            
    # 3. Customer Nodes
    for tx in ring_txs:
        cid = f"cust_{tx['customer_id']}"
        if cid not in node_ids:
            node_ids.add(cid)
            nodes.append({
                "id": cid,
                "type": "customer",
                "label": f"Customer {tx['customer_id']}",
                "data": {"id": tx["customer_id"], "type": "Customer", "risk": "HIGH", "entityId": tx["customer_id"]}
            })
            
    # 4. Payment Nodes
    for tx in ring_txs:
        pid = f"pay_{tx['payment_id']}"
        if pid not in node_ids:
            node_ids.add(pid)
            nodes.append({
                "id": pid,
                "type": "payment",
                "label": f"Card {tx['payment_id']}",
                "data": {"id": tx["payment_id"], "type": "PaymentInstrument", "risk": "HIGH", "entityId": tx["payment_id"]}
            })
            
    # 5. Edges
    edge_set = set()
    for tx in ring_txs:
        cid = f"cust_{tx['customer_id']}"
        did = f"dev_{tx['device_id']}"
        ipid = f"ip_{tx['ip_id']}"
        pid = f"pay_{tx['payment_id']}"
        
        e1 = (cid, did, "USES_DEVICE")
        e2 = (cid, ipid, "USES_IP")
        e3 = (cid, pid, "USES_PAYMENT")
        
        for s, t, r in [e1, e2, e3]:
            key = f"{s}->{t}:{r}"
            if key not in edge_set:
                edge_set.add(key)
                edges.append({
                    "id": f"e_{len(edges)+1}",
                    "source": s,
                    "target": t,
                    "label": r,
                    "animated": True if "DEVICE" in r else False
                })
                
    return {
        "ring_id": ring["id"],
        "nodes": nodes,
        "edges": edges,
        "total_nodes": len(nodes),
        "total_edges": len(edges)
    }

@app.get("/api/rings/{ring_id}/timeline")
def get_ring_timeline(ring_id: str):
    data = load_data()
    ring_txs = [tx for tx in data["transactions"] if tx.get("cluster_id") == ring_id.upper()]
    ring_txs.sort(key=lambda x: x["timestamp_unix"])
    
    first_time = ring_txs[0]["timestamp_unix"] if ring_txs else 0
    last_time = ring_txs[-1]["timestamp_unix"] if ring_txs else 0
    duration_sec = max(last_time - first_time, 1)
    
    return {
        "ring_id": ring_id,
        "total_events": len(ring_txs),
        "duration_seconds": duration_sec,
        "summary": f"{len(ring_txs)} coordinated events executed over {duration_sec}s window",
        "events": [
            {
                "id": tx["id"],
                "timestamp": tx["timestamp"],
                "customer_id": tx["customer_id"],
                "device_id": tx["device_id"],
                "ip_id": tx["ip_id"],
                "amount": tx["amount"],
                "is_fraud": tx["is_fraud"]
            }
            for tx in ring_txs
        ]
    }

# =========================================================================
# 2. Entity & Transaction APIs
# =========================================================================
@app.get("/api/entities/{entity_id}")
def get_entity_profile(entity_id: str):
    data = load_data()
    txs = [tx for tx in data["transactions"] if entity_id in (tx["customer_id"], tx["device_id"], tx["ip_id"], tx["payment_id"])]
    if not txs:
        raise HTTPException(status_code=404, detail=f"Entity '{entity_id}' not found")
        
    related_rings = list({tx["cluster_id"] for tx in txs if tx.get("cluster_id")})
    connected_custs = list({tx["customer_id"] for tx in txs})
    connected_devices = list({tx["device_id"] for tx in txs})
    connected_ips = list({tx["ip_id"] for tx in txs})
    connected_payments = list({tx["payment_id"] for tx in txs})
    
    first_seen = min(tx["timestamp"] for tx in txs)
    last_seen = max(tx["timestamp"] for tx in txs)
    is_suspicious = any(tx["is_fraud"] for tx in txs)
    
    return {
        "entity_id": entity_id,
        "risk_level": "CRITICAL" if is_suspicious else "LOW",
        "risk_score": 92 if is_suspicious else 12,
        "first_seen": first_seen,
        "last_seen": last_seen,
        "transaction_count": len(txs),
        "related_rings": related_rings,
        "connections": {
            "customers": connected_custs,
            "devices": connected_devices,
            "ips": connected_ips,
            "payments": connected_payments
        }
    }

@app.get("/api/transactions")
def get_transactions(limit: int = 100):
    data = load_data()
    txs = data["transactions"][:limit]
    return {
        "total": len(data["transactions"]),
        "transactions": txs
    }

# =========================================================================
# 3. Model Evaluation & Retraining APIs (Held-Out Test Set)
# =========================================================================
@app.get("/api/evaluation/metrics")
def get_evaluation_metrics():
    return load_evaluation()

@app.post("/api/evaluation/run")
@app.post("/api/evaluation/retrain")
def run_evaluation_pipeline():
    """
    Executes real held-out test evaluation against synthetic abuse dataset.
    """
    results = run_heldout_evaluation()
    return {
        "success": True,
        "status": "EVALUATION_COMPLETED",
        "timestamp": time.time(),
        "metrics": results["sentinel_metrics"],
        "protocol": results["protocol"]
    }
