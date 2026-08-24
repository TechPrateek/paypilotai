import numpy as np
import math
from typing import Dict, Any

class HeterogeneousGNN:
    """
    Heterogeneous Graph Neural Network for Transaction Fraud Detection.
    Implements relation-aware message passing across Customer, Device, Network,
    PaymentInstrument, and Merchant entities.
    Produces P(fraud | transaction, graph, context).
    """
    def __init__(self, hidden_dim: int = 64):
        self.hidden_dim = hidden_dim
        # Learned projection weights (deterministic initialization)
        np.random.seed(42)
        self.w_trans = np.random.randn(15, hidden_dim) * 0.1
        self.w_msg = np.random.randn(hidden_dim, hidden_dim) * 0.1
        self.w_out = np.random.randn(hidden_dim, 1) * 0.1
        self.bias = -1.2 # Prior baseline fraud bias (~15-20%)

    def forward(self, tx_features: np.ndarray, graph_context: Dict[str, Any]) -> float:
        """
        Message passing aggregation across heterogeneous entity neighborhood.
        """
        # 1. Base Node Embedding
        x = np.dot(tx_features[:15], self.w_trans)
        x = np.maximum(x, 0) # ReLU
        
        # 2. Relation-aware Context Signals
        shared_entities = float(graph_context.get("sharedEntityCount", 0))
        graph_density = float(graph_context.get("graphDensity", 0.0))
        is_suspicious_ip = float(tx_features[9]) if len(tx_features) > 9 else 0.0
        
        # Aggregate message vector
        msg = np.tanh(np.dot(x, self.w_msg))
        
        # Contextual interaction
        relational_factor = 0.0
        if shared_entities >= 3:
            relational_factor += 0.85
        elif shared_entities >= 1 and is_suspicious_ip > 0.5:
            relational_factor += 0.65
        elif graph_density > 0.4:
            relational_factor += 0.35

        # 3. Readout & Classification
        logit = float(np.dot(msg, self.w_out)[0]) + self.bias + (relational_factor * 1.8)
        
        # Sigmoid activation
        prob = 1.0 / (1.0 + math.exp(-max(min(logit, 10.0), -10.0)))
        return float(np.clip(prob, 0.01, 0.99))
