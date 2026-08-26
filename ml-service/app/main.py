"""
Abuse-Ring Sentinel — FastAPI Backend Service
Provides graph investigation, ring detection, timeline analysis, and empirical evaluation APIs.
"""

import json
import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from dataset.generator import generate_synthetic_dataset
from evaluation.heldout_evaluator import run_heldout_evaluation

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
        "environment": "SYNTHETIC_EVALUATION"
    }

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
        "total_exposure": sum(r["exposure"] for r in data["rings"])
    }

@app.get("/api/rings/{ring_id}")
def get_ring_detail(ring_id: str):
    data = load_data()
    ring = next((r for r in data["rings"] if r["id"].upper() == ring_id.upper()), None)
    if not ring:
        raise HTTPException(status_code=404, detail=f"Ring '{ring_id}' not found")
        
    # Calculate blast radius from real transactions
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
    
    # Calculate burst intensity (transactions in short windows)
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

@app.get("/api/rings/{ring_id}/signals")
def get_ring_signals(ring_id: str):
    data = load_data()
    ring = next((r for r in data["rings"] if r["id"].upper() == ring_id.upper()), None)
    if not ring:
        raise HTTPException(status_code=404, detail=f"Ring '{ring_id}' not found")
    return {"ring_id": ring["id"], "signals": ring["signals"]}

@app.get("/api/rings/{ring_id}/transactions")
def get_ring_transactions(ring_id: str):
    data = load_data()
    ring_txs = [tx for tx in data["transactions"] if tx.get("cluster_id") == ring_id.upper()]
    return {"ring_id": ring_id, "transactions": ring_txs, "count": len(ring_txs)}

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
# 3. Model Evaluation APIs (Held-Out Test Set)
# =========================================================================
@app.get("/api/evaluation/metrics")
def get_evaluation_metrics():
    return load_evaluation()

@app.get("/api/evaluation/thresholds")
def get_evaluation_thresholds():
    eval_data = load_evaluation()
    return {
        "selected_threshold": eval_data["protocol"]["selected_threshold"],
        "thresholds": eval_data["threshold_analysis"]
    }

@app.get("/api/evaluation/protocol")
def get_evaluation_protocol():
    eval_data = load_evaluation()
    return eval_data["protocol"]
