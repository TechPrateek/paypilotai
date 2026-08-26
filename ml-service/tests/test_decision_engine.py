import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.hybrid_model import HybridRiskAggregator

class TestPayPilotDecisionEngine(unittest.TestCase):
    def setUp(self):
        self.engine = HybridRiskAggregator()

    def test_1_legitimate_new_customer(self):
        """
        Test 1: Legitimate New Customer
        First-time customer, new device, normal amount (₹1,850), normal velocity.
        Must NOT be blocked.
        """
        tx = {
            "amount": 1850.0,
            "currency": "INR",
            "paymentMethod": "UPI",
            "country": "IN",
            "isNewDevice": True,
            "isNewIp": True,
            "accountAgeDays": 0,
            "customerTotalTransactions": 0,
            "previousFailedAttempts": 0,
            "transactionsInLast5Min": 0,
            "isSuspiciousIp": False,
            "isDisposableEmail": False
        }
        res = self.engine.evaluate(tx)
        self.assertNotEqual(res["decision"], "BLOCK", "False-Positive Guard failed: New customer was blocked!")
        self.assertEqual(res["decision"], "APPROVE")
        self.assertLess(res["confidence"], 0.70, "Confidence should be low for first-time customer")

    def test_2_high_risk_fraud(self):
        """
        Test 2: High-Risk Fraud
        High amount, Tor IP, 7 failed attempts, 14 transactions in last 5 minutes.
        Must be BLOCKED.
        """
        tx = {
            "amount": 145000.0,
            "currency": "INR",
            "paymentMethod": "CREDIT_CARD",
            "country": "NG",
            "isNewDevice": True,
            "isNewIp": True,
            "accountAgeDays": 1,
            "customerTotalTransactions": 0,
            "previousFailedAttempts": 7,
            "transactionsInLast5Min": 14,
            "paymentInstrumentSwitchCount": 4,
            "isTorIp": True,
            "isSuspiciousIp": True,
            "isDisposableEmail": True
        }
        res = self.engine.evaluate(tx)
        self.assertEqual(res["decision"], "BLOCK")
        self.assertGreaterEqual(res["riskScore"], 80)
        self.assertGreaterEqual(res["ringRisk"], 0.60)

    def test_3_shared_device_legitimate(self):
        """
        Test 3: Shared Device but Legitimate
        Family / shared desktop with multiple users, but normal amounts and residential IP.
        Must NOT be automatically blocked.
        """
        tx = {
            "amount": 2400.0,
            "currency": "INR",
            "paymentMethod": "UPI",
            "country": "IN",
            "deviceId": "shared_family_desktop_01",
            "isNewDevice": False,
            "accountAgeDays": 180,
            "customerTotalTransactions": 25,
            "previousFailedAttempts": 0,
            "transactionsInLast5Min": 1,
            "isSuspiciousIp": False,
            "isTorIp": False
        }
        res = self.engine.evaluate(tx)
        self.assertNotEqual(res["decision"], "BLOCK")
        self.assertEqual(res["decision"], "APPROVE")
        self.assertLess(res["ringRisk"], 0.40)

    def test_4_coordinated_abuse_ring(self):
        """
        Test 4: Coordinated Abuse Ring
        Multi-card rotation, rapid retry bursts, Tor exit node.
        Must trigger elevated ring risk and be BLOCKED.
        """
        tx = {
            "amount": 95000.0,
            "currency": "INR",
            "paymentMethod": "CREDIT_CARD",
            "country": "IN",
            "deviceId": "syndicate_bot_device_99",
            "isTorIp": True,
            "isProxyIp": True,
            "isSuspiciousIp": True,
            "transactionsInLast5Min": 12,
            "paymentInstrumentSwitchCount": 5
        }
        res = self.engine.evaluate(tx)
        self.assertGreaterEqual(res["ringRisk"], 0.70, "Abuse-Ring Sentinel failed to flag coordinated pattern")
        self.assertEqual(res["decision"], "BLOCK")

    def test_5_borderline_transaction(self):
        """
        Test 5: Borderline Transaction
        Large purchase from an established customer on a high-value item.
        Cost-aware expected loss routes to REVIEW instead of hard block.
        """
        tx = {
            "amount": 85000.0,
            "currency": "INR",
            "paymentMethod": "CREDIT_CARD",
            "country": "IN",
            "isNewDevice": False,
            "accountAgeDays": 520,
            "customerTotalTransactions": 36,
            "customerAverageAmount": 12000.0,
            "previousFailedAttempts": 0,
            "transactionsInLast5Min": 1,
            "isSuspiciousIp": False
        }
        res = self.engine.evaluate(tx)
        self.assertIn(res["decision"], ["REVIEW", "APPROVE"])
        self.assertIn("expectedCosts", res)
        self.assertIn("approveExpectedLoss", res["expectedCosts"])
        self.assertIn("blockExpectedLoss", res["expectedCosts"])

if __name__ == "__main__":
    unittest.main()
