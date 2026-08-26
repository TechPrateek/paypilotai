import os

# Business Cost Model (Default values in INR)
# C_FP: Cost of friction/lost customer when a legitimate transaction is falsely rejected
COST_FALSE_POSITIVE = float(os.getenv("COST_FALSE_POSITIVE", 450.0))

# C_FN: Financial loss from an undetected fraudulent transaction (chargeback + loss)
COST_FALSE_NEGATIVE = float(os.getenv("COST_FALSE_NEGATIVE", 4500.0))

# C_REVIEW: Operational labor cost of routing a transaction for manual review / 2FA
COST_MANUAL_REVIEW = float(os.getenv("COST_MANUAL_REVIEW", 120.0))

# Multi-Signal Weights for Established Customers
WEIGHT_TABULAR = 0.40
WEIGHT_BEHAVIORAL = 0.30
WEIGHT_GRAPH_RING = 0.30

# Multi-Signal Weights for Cold-Start Customers (No history)
WEIGHT_COLD_TABULAR = 0.55
WEIGHT_COLD_GRAPH_RING = 0.45
