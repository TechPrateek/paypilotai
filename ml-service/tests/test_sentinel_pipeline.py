"""
Abuse-Ring Sentinel — Automated Test Suite
Tests:
1. API Predict Contract & Structure
2. False-Positive Control: Corporate Wi-Fi (15 coworkers on 1 IP)
3. Coordinated Fraud Ring Detection (Device D102 + sub-minute burst)
4. Evaluation Mathematical Consistency (TN + FP + FN + TP == Total)
5. Cost-Sensitive Decision Loss Minimization
"""

import sys
import os
import unittest
import json

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from models.hybrid_model import HybridRiskAggregator
from evaluation.heldout_evaluator import run_heldout_evaluation

class TestAbuseRingSentinelPipeline(unittest.TestCase):
    def setUp(self):
        self.aggregator = HybridRiskAggregator()

    def test_01_prediction_structure_and_types(self):
        """Verify inference returns all required fields and valid probability bounds."""
        tx_data = {
            "transactionId": "tx_test_01",
            "amount": 4500.0,
            "currency": "INR",
            "paymentMethod": "UPI",
            "country": "IN",
            "customerId": "cust_test_100",
            "deviceId": "dev_laptop_01",
            "ip": "103.21.54.10",
            "isNewDevice": False,
            "transactionsInLast5Min": 1,
            "customerTotalTransactions": 10,
        }
        res = self.aggregator.evaluate(tx_data)
        
        self.assertIn("riskProbability", res)
        self.assertIn("riskScore", res)
        self.assertIn("decision", res)
        self.assertIn("confidence", res)
        self.assertIn("evidence", res)
        self.assertIn("modelBreakdown", res)
        self.assertIn("expectedCosts", res)
        
        self.assertTrue(0.0 <= res["riskProbability"] <= 1.0)
        self.assertTrue(0 <= res["riskScore"] <= 100)
        self.assertIn(res["decision"], ["APPROVE", "REVIEW", "BLOCK"])
        self.assertTrue(len(res["evidence"]) >= 1)

    def test_02_false_positive_control_corporate_wifi(self):
        """
        Verify that 15 coworkers sharing 1 corporate IP with distinct laptops
        are NOT flagged as a fraud ring.
        """
        corporate_ip = "14.143.38.102"
        decisions = []
        
        for i in range(1, 16):
            coworker_tx = {
                "transactionId": f"tx_office_{i}",
                "amount": 350.0 + (i * 50),
                "customerId": f"employee_{i:03d}",
                "deviceId": f"macbook_m3_pro_{i:03d}",  # Independent hardware devices
                "ip": corporate_ip,                     # Shared corporate gateway
                "isNewDevice": False,
                "isProxyIp": False,
                "isTorIp": False,
                "transactionsInLast5Min": 1,            # Normal individual transaction rate
                "customerTotalTransactions": 25,
            }
            res = self.aggregator.evaluate(coworker_tx)
            decisions.append(res["decision"])
            
        # None of the legitimate coworkers should be hard blocked
        self.assertNotIn("BLOCK", decisions)
        approve_count = decisions.count("APPROVE")
        self.assertGreaterEqual(approve_count, 14, "Corporate Wi-Fi coworkers must be approved without false alarms")

    def test_03_fraud_ring_detection(self):
        """
        Verify that multiple accounts operating through single device D102
        with sub-minute bursts and card switches trigger BLOCK / CRITICAL risk.
        """
        fraud_tx = {
            "transactionId": "tx_ring_attack_01",
            "amount": 9500.0,
            "customerId": "bot_account_07",
            "deviceId": "dev_d102_compromised",
            "ip": "185.220.101.45",
            "isTorIp": True,
            "transactionsInLast5Min": 14,
            "paymentInstrumentSwitchCount": 5,
            "customerTotalTransactions": 0,
        }
        res = self.aggregator.evaluate(fraud_tx)
        
        self.assertGreaterEqual(res["riskScore"], 75, "Fraud ring transaction must receive elevated risk score >= 75")
        self.assertEqual(res["decision"], "BLOCK", "Coordinated bot burst on shared device must trigger BLOCK")
        self.assertTrue(any(e["category"] == "GRAPH" for e in res["evidence"]), "Must generate graph evidence")

    def test_04_evaluation_mathematical_consistency(self):
        """
        Verify authoritative held-out evaluation is mathematically sound:
        TN + FP + FN + TP == Total Sample Count
        Precision, Recall, F1, and FPR formulas are strictly satisfied.
        """
        results = run_heldout_evaluation()
        
        cm = results["sentinel_metrics"]["confusion_matrix"]
        tn, fp, fn, tp = cm["tn"], cm["fp"], cm["fn"], cm["tp"]
        total_samples = results["protocol"]["test_sample_count"]
        
        # 1. Total samples invariant
        self.assertEqual(tn + fp + fn + tp, total_samples, f"Confusion matrix sum ({tn+fp+fn+tp}) must equal test count ({total_samples})")
        
        # 2. Precision formula
        expected_precision = round((tp / (tp + fp)) * 100, 1) if (tp + fp) > 0 else 100.0
        self.assertEqual(results["sentinel_metrics"]["precision"], expected_precision)
        
        # 3. Recall formula
        expected_recall = round((tp / (tp + fn)) * 100, 1) if (tp + fn) > 0 else 0.0
        self.assertEqual(results["sentinel_metrics"]["recall"], expected_recall)
        
        # 4. F1 formula
        prec_f = tp / (tp + fp) if (tp + fp) > 0 else 1.0
        rec_f = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        expected_f1 = round((2 * prec_f * rec_f / (prec_f + rec_f)) * 100, 1) if (prec_f + rec_f) > 0 else 0.0
        self.assertEqual(results["sentinel_metrics"]["f1"], expected_f1)
        
        # 5. FPR formula
        expected_fpr = round((fp / (fp + tn)) * 100, 1) if (fp + tn) > 0 else 0.0
        self.assertEqual(results["sentinel_metrics"]["fpr"], expected_fpr)

    def test_05_cost_loss_minimization(self):
        """
        Verify that optimal threshold (0.70) yields lower expected business loss
        on the validation tuning set than lower thresholds (0.50).
        """
        results = run_heldout_evaluation()
        thresh_table = results["threshold_analysis"]
        
        loss_at_50 = next(t["expected_loss"] for t in thresh_table if abs(t["threshold"] - 0.50) < 0.01)
        loss_at_optimal = next(t["expected_loss"] for t in thresh_table if abs(t["threshold"] - 0.70) < 0.01)
        
        self.assertLess(loss_at_optimal, loss_at_50, "Optimal threshold (0.70) must achieve lower business loss than tau=0.50 on validation set")

if __name__ == "__main__":
    unittest.main()
