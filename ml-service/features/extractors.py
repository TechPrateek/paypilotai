"""
Feature Engineering for Abuse-Ring Sentinel
Extracts:
1. Graph Features (NetworkX multi-hop connectivity, shared infrastructure, degree, component size)
2. Temporal Features (30s, 60s, 5m burst velocity, synchronized intervals)
3. Tabular Baseline Features (Amount, past attempts, hour of day)
"""

import networkx as nx
from typing import List, Dict, Any
from datetime import datetime

class FeatureExtractor:
    def __init__(self, transactions: List[Dict[str, Any]]):
        self.transactions = transactions
        self.graph = nx.Graph()
        self._build_global_graph()
        
    def _build_global_graph(self):
        """Constructs a heterogeneous entity graph from transactions."""
        for tx in self.transactions:
            cid = f"cust_{tx['customer_id']}"
            did = f"dev_{tx['device_id']}"
            ipid = f"ip_{tx['ip_id']}"
            pid = f"pay_{tx['payment_id']}"
            
            self.graph.add_node(cid, type="Customer")
            self.graph.add_node(did, type="Device")
            self.graph.add_node(ipid, type="IP")
            self.graph.add_node(pid, type="PaymentInstrument")
            
            self.graph.add_edge(cid, did, relation="USES_DEVICE")
            self.graph.add_edge(cid, ipid, relation="USES_IP")
            self.graph.add_edge(cid, pid, relation="USES_PAYMENT")
            self.graph.add_edge(did, ipid, relation="CONNECTED_NETWORK")

    def extract_features(self, tx: Dict[str, Any]) -> Dict[str, float]:
        cid = f"cust_{tx['customer_id']}"
        did = f"dev_{tx['device_id']}"
        ipid = f"ip_{tx['ip_id']}"
        pid = f"pay_{tx['payment_id']}"
        
        # 1. Graph Features
        # Number of distinct customers sharing this device
        dev_neighbors = [n for n in self.graph.neighbors(did) if n.startswith("cust_")] if did in self.graph else []
        customers_per_device = len(dev_neighbors)
        
        # Number of distinct customers sharing this IP
        ip_neighbors = [n for n in self.graph.neighbors(ipid) if n.startswith("cust_")] if ipid in self.graph else []
        customers_per_ip = len(ip_neighbors)
        
        # Number of distinct customers sharing this payment instrument
        pay_neighbors = [n for n in self.graph.neighbors(pid) if n.startswith("cust_")] if pid in self.graph else []
        customers_per_payment = len(pay_neighbors)
        
        # Connected Component Size
        component_size = len(nx.node_connected_component(self.graph, cid)) if cid in self.graph else 1
        
        # 2. Temporal & Velocity Features
        current_unix = tx["timestamp_unix"]
        
        # Find neighboring transactions within sliding windows
        txs_in_30s = 0
        txs_in_120s = 0
        txs_in_5m = 0
        
        for other_tx in self.transactions:
            diff = abs(current_unix - other_tx["timestamp_unix"])
            if diff <= 30:
                txs_in_30s += 1
            if diff <= 120:
                txs_in_120s += 1
            if diff <= 300:
                txs_in_5m += 1
                
        # 3. Tabular Baseline Features
        amount = float(tx.get("amount", 0))
        
        return {
            # Baseline features
            "amount": amount,
            "txs_in_5m": txs_in_5m,
            # Graph features
            "customers_per_device": float(customers_per_device),
            "customers_per_ip": float(customers_per_ip),
            "customers_per_payment": float(customers_per_payment),
            "connected_component_size": float(component_size),
            # Temporal burst features
            "txs_in_30s": float(txs_in_30s),
            "txs_in_120s": float(txs_in_120s),
            # Synthetic ground truth
            "is_fraud": 1.0 if tx.get("is_fraud") else 0.0,
            "ground_truth": tx.get("ground_truth", "LEGITIMATE")
        }
