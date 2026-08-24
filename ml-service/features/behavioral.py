import numpy as np
from typing import Dict, Any, Tuple

def extract_behavioral_features(tx: Dict[str, Any]) -> Tuple[np.ndarray, bool, Dict[str, Any]]:
    """
    Extract historical behavioral features with strict cold-start & no-leakage logic.
    Returns:
      (features_array, history_available, behavioral_metadata)
    """
    customer_total_tx = tx.get("customerTotalTransactions", 0) or 0
    customer_avg_amount = tx.get("customerAverageAmount")
    
    # Check if history is genuinely available
    if customer_total_tx < 2 or customer_avg_amount is None or customer_avg_amount <= 0:
        history_available = False
        # Return zeros for behavioral vector - model handles cold start explicitly
        behavioral_vector = np.zeros(6, dtype=np.float32)
        metadata = {
            "historyAvailable": False,
            "behavioralConfidence": "LOW",
            "amountDeviationRatio": 1.0,
            "velocity5Min": tx.get("transactionsInLast5Min", 0) or 0,
            "velocity1Hour": tx.get("transactionsInLast1Hour", 0) or 0,
            "notes": "First-time or cold-start customer with insufficient historical transactions."
        }
        return behavioral_vector, history_available, metadata

    history_available = True
    amount = float(tx.get("amount", 1000.0))
    avg_amount = float(customer_avg_amount)
    
    # 1. Amount deviation ratio (amount / historical_mean)
    amount_ratio = amount / max(avg_amount, 1.0)
    
    # 2. Approximate Z-Score deviation
    estimated_std = max(avg_amount * 0.45, 50.0)
    z_score = (amount - avg_amount) / estimated_std
    
    # 3. Transaction Velocities
    velocity_5min = float(tx.get("transactionsInLast5Min", 0) or 0)
    velocity_1hour = float(tx.get("transactionsInLast1Hour", 0) or 0)
    
    # 4. Device Familiarity (1.0 = known device, 0.0 = brand new device)
    device_count = float(tx.get("customerDeviceCount", 1) or 1)
    is_new_device = 1.0 if tx.get("isNewDevice", False) else 0.0
    device_familiarity = 0.0 if is_new_device else 1.0
    
    # 5. Dispute history rate
    disputes = float(tx.get("previousDisputes", 0) or 0)
    dispute_rate = disputes / max(float(customer_total_tx), 1.0)
    
    features = [
        amount_ratio,
        z_score,
        velocity_5min,
        velocity_1hour,
        device_familiarity,
        dispute_rate
    ]
    
    metadata = {
        "historyAvailable": True,
        "behavioralConfidence": "HIGH",
        "amountDeviationRatio": round(amount_ratio, 2),
        "zScore": round(z_score, 2),
        "velocity5Min": int(velocity_5min),
        "velocity1Hour": int(velocity_1hour),
        "notes": f"Historical profile analyzed across {customer_total_tx} transactions."
    }
    
    return np.array(features, dtype=np.float32), history_available, metadata
