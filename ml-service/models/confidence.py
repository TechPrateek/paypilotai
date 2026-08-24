from typing import Dict, Any

class ConfidenceScorer:
    """
    Computes separate Information Confidence score (0.0 - 1.0).
    Confidence is orthogonal to Risk:
    - A transaction can be High Risk with High Confidence (e.g. multi-entity confirmed fraud cluster)
    - A transaction can be High Risk with Low Confidence (e.g. cold-start customer with unusual amount) -> REVIEW
    """
    @staticmethod
    def compute_confidence(
        history_available: bool,
        identity_available: bool,
        graph_available: bool,
        graph_density: float,
        customer_tx_count: int,
        device_observed: bool
    ) -> float:
        score = 0.50 # Base baseline confidence

        # 1. Historical Information Availability
        if history_available:
            if customer_tx_count >= 10:
                score += 0.25
            elif customer_tx_count >= 3:
                score += 0.15
            else:
                score += 0.08
        else:
            # Cold start penalty to confidence (NOT to risk!)
            score -= 0.15

        # 2. Identity Completeness
        if identity_available and device_observed:
            score += 0.12
        elif not identity_available:
            score -= 0.10

        # 3. Graph Context Density
        if graph_available:
            if graph_density > 0.3:
                score += 0.13
            elif graph_density > 0.1:
                score += 0.08
        else:
            score -= 0.12

        return round(float(max(min(score, 0.98), 0.35)), 2)
