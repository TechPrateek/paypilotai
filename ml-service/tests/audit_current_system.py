import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ML = ROOT / "ml-service"

sys.path.insert(0, str(ML))

DATASET = ML / "dataset" / "synthetic_abuse_dataset.json"


def check_dataset():
    print("\n=== 1. DATASET ===")

    if not DATASET.exists():
        print("[FAIL] Dataset not found")
        return None

    data = json.loads(DATASET.read_text(encoding="utf-8"))

    transactions = data.get("transactions", [])
    rings = data.get("rings", [])

    print(f"[PASS] Dataset found")
    print(f"Transactions : {len(transactions)}")
    print(f"Rings        : {len(rings)}")

    if transactions:
        sample = transactions[0]
        print("Transaction schema:")
        print(" ", list(sample.keys()))

    return data


def check_graph():
    print("\n=== 2. GRAPH ENGINE ===")

    try:
        from graph.builder import HeterogeneousGraphBuilder

        builder = HeterogeneousGraphBuilder()

        print("[PASS] HeterogeneousGraphBuilder imports")

        tx = {
            "transactionId": "AUDIT-TX",
            "customerId": "AUDIT-CUST",
            "deviceId": "D0097",
            "ip": "IP0083",
            "networkId": "IP0083",
            "paymentInstrumentId": "P0100",
            "paymentInstrumentSwitchCount": 3,
            "transactionsInLast5Min": 14,
            "isTorIp": True,
            "isSuspiciousIp": True,
        }

        tx_id = builder.add_transaction_subgraph(tx)
        risk = builder.compute_ring_risk(tx_id, tx)

        print(f"Graph nodes after ONE transaction: {builder.graph.number_of_nodes()}")
        print(f"Graph edges after ONE transaction: {builder.graph.number_of_edges()}")
        print(f"Ring risk: {risk}")

        if risk >= 0.9:
            print("[PASS] High-risk transaction produces high ring risk")
        else:
            print("[WARN] Ring risk unexpectedly low")

        if builder.graph.number_of_nodes() <= 10:
            print("[INFO] Graph currently contains only current transaction entities")

    except Exception as e:
        print(f"[FAIL] Graph test failed: {e}")


def check_dataset_graph_loading(data):
    print("\n=== 3. HISTORICAL GRAPH LOADING ===")

    try:
        from graph.builder import HeterogeneousGraphBuilder

        builder = HeterogeneousGraphBuilder()

        transactions = data.get("transactions", [])

        for tx in transactions:
            normalized = {
                "transactionId": tx.get("transactionId") or tx.get("id"),
                "customerId": tx.get("customerId") or tx.get("customer_id"),
                "deviceId": tx.get("deviceId") or tx.get("device_id"),
                "ip": tx.get("ip") or tx.get("ip_id"),
                "networkId": tx.get("networkId") or tx.get("ip_id"),
                "paymentInstrumentId": tx.get("paymentInstrumentId") or tx.get("payment_id"),
                "merchantId": tx.get("merchantId") or tx.get("merchant_id"),
            }

            builder.add_transaction_subgraph(normalized)

        print(f"Historical transactions loaded: {len(transactions)}")
        print(f"Graph nodes: {builder.graph.number_of_nodes()}")
        print(f"Graph edges: {builder.graph.number_of_edges()}")

        if len(transactions) > 100 and builder.graph.number_of_nodes() > 100:
            print("[PASS] Dataset can form a historical graph")
        else:
            print("[WARN] Historical graph is small")

    except Exception as e:
        print(f"[FAIL] Historical graph test failed: {e}")


def check_behavioral():
    print("\n=== 4. BEHAVIORAL ENGINE ===")

    try:
        from features.behavioral import extract_behavioral_features

        tx = {
            "amount": 25000,
            "customerAverageAmount": 1500,
            "customerTotalTransactions": 8,
            "transactionsInLast5Min": 14,
            "transactionsInLast1Hour": 20,
        }

        features, history, meta = extract_behavioral_features(tx)

        print(f"History available: {history}")
        print(f"Metadata: {meta}")

        if meta.get("velocity5Min") == 14:
            print("[PASS] 5-minute velocity correctly propagated")
        else:
            print("[FAIL] Velocity mismatch")

    except Exception as e:
        print(f"[FAIL] Behavioral test failed: {e}")


def check_hybrid():
    print("\n=== 5. HYBRID INFERENCE ===")

    try:
        from models.hybrid_model import HybridRiskAggregator

        engine = HybridRiskAggregator()

        tx = {
            "transactionId": "AUDIT-RING",
            "amount": 25000,
            "currency": "INR",
            "paymentMethod": "UPI",
            "country": "IN",
            "city": "Noida",
            "ip": "IP0083",
            "deviceId": "D0097",
            "deviceFingerprint": "FP-D0097",
            "networkId": "IP0083",
            "paymentInstrumentId": "P0100",
            "customerId": "CUST-RING-001",
            "customerEmail": "user001@example.com",
            "accountAgeDays": 3,
            "isNewDevice": False,
            "isNewIp": False,
            "previousFailedAttempts": 3,
            "timeBetweenAttemptsSeconds": 8,
            "transactionsInLast5Min": 14,
            "transactionsInLast1Hour": 20,
            "paymentInstrumentSwitchCount": 3,
            "isProxyIp": False,
            "isVpnIp": False,
            "isTorIp": True,
            "isSuspiciousIp": True,
            "isDisposableEmail": False,
            "customerAverageAmount": 1500,
            "customerTotalTransactions": 8,
            "customerDeviceCount": 1,
            "previousDisputes": 1,
        }

        result = engine.evaluate(tx)

        risk_probability = result.get("riskProbability", result.get("risk_probability"))
        risk_score = result.get("riskScore", result.get("risk_score"))
        ring_risk = result.get("ringRisk", result.get("ring_risk"))
        decision = result.get("decision")

        print("Risk probability:", risk_probability)
        print("Risk score:", risk_score)
        print("Ring risk:", ring_risk)
        print("Decision:", decision)

        breakdown = result.get("modelBreakdown", result.get("model_breakdown", {}))

        print("Model breakdown:")
        print(json.dumps(breakdown, indent=2))

        if result.get("decision") == "BLOCK":
            print("[PASS] Ring transaction is blocked")
        else:
            print("[WARN] Ring transaction was not blocked")

    except Exception as e:
        print(f"[FAIL] Hybrid inference failed: {e}")


def main():
    print("=" * 60)
    print("PAYPILOT AI — AUTOMATED TECHNICAL AUDIT")
    print("=" * 60)

    data = check_dataset()

    if data:
        check_graph()
        check_dataset_graph_loading(data)
        check_behavioral()
        check_hybrid()

    print("\n" + "=" * 60)
    print("AUDIT COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()


