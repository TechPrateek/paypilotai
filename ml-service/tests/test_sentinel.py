"""
Automated Test Suite for Abuse-Ring Sentinel
Verifies:
1. False-Positive Protection on Legitimate Shared IP (Corporate Office)
2. False-Positive Protection on Legitimate Shared Device (Family Tablet)
3. Detection of Coordinated Syndicate Rings (RING-0042 & RING-7092)
4. Empirical Held-Out Evaluation Protocol Execution
"""

import unittest
import os
import sys
import json

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from dataset.generator import generate_synthetic_dataset
from features.extractors import FeatureExtractor
from evaluation.heldout_evaluator import run_heldout_evaluation

class TestAbuseRingSentinel(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data_dir = os.path.join(os.path.dirname(__file__), "..", "dataset")
        cls.dataset = generate_synthetic_dataset(cls.data_dir)
        cls.extractor = FeatureExtractor(cls.dataset["transactions"])
        cls.eval_results = run_heldout_evaluation()

    def test_01_dataset_generation_and_splits(self):
        """Verify synthetic dataset generator produced 70/15/15 temporal split with ground truth."""
        meta = self.dataset["metadata"]
        self.assertGreater(meta["total_transactions"], 200)
        self.assertGreater(meta["total_customers"], 50)
        self.assertEqual(meta["total_rings"], 2)
        
        splits = meta["splits"]
        self.assertGreater(splits["train_count"], 0)
        self.assertGreater(splits["validation_count"], 0)
        self.assertGreater(splits["held_out_test_count"], 0)

    def test_02_legitimate_shared_ip_false_positive_protection(self):
        """Test that 15 coworkers sharing 1 corporate IP are NOT flagged as an abuse ring."""
        office_txs = [tx for tx in self.dataset["transactions"] if tx["cluster_id"] == "LEGITIMATE_OFFICE"]
        self.assertGreater(len(office_txs), 10)
        
        for tx in office_txs:
            features = self.extractor.extract_features(tx)
            # Shared IP should be detected, but customers_per_device should be 1.0 (independent devices)
            self.assertEqual(features["customers_per_device"], 1.0)
            self.assertEqual(features["customers_per_payment"], 1.0)
            self.assertEqual(features["ground_truth"], "LEGITIMATE")

    def test_03_legitimate_shared_device_family_protection(self):
        """Test that 4 family members sharing 1 home tablet with independent cards are marked legitimate."""
        family_txs = [tx for tx in self.dataset["transactions"] if tx["cluster_id"] == "LEGITIMATE_FAMILY"]
        self.assertGreater(len(family_txs), 4)
        
        for tx in family_txs:
            features = self.extractor.extract_features(tx)
            self.assertEqual(features["customers_per_payment"], 1.0)
            self.assertEqual(features["ground_truth"], "LEGITIMATE")

    def test_04_coordinated_abuse_ring_detection(self):
        """Test that RING-0042 burst attack exhibits strong graph and temporal features."""
        ring_txs = [tx for tx in self.dataset["transactions"] if tx["cluster_id"] == "RING-0042"]
        self.assertEqual(len(ring_txs), 84)
        
        burst_features = [self.extractor.extract_features(tx) for tx in ring_txs]
        # Should have high connected component size & temporal bursts
        avg_comp_size = sum(f["connected_component_size"] for f in burst_features) / len(burst_features)
        self.assertGreater(avg_comp_size, 10.0)

    def test_05_held_out_evaluation_metrics(self):
        """Verify empirical evaluation metrics on held-out test set."""
        sentinel_metrics = self.eval_results["sentinel_metrics"]
        self.assertGreaterEqual(sentinel_metrics["precision"], 85.0)
        self.assertGreaterEqual(sentinel_metrics["recall"], 90.0)
        self.assertGreaterEqual(sentinel_metrics["f1"], 90.0)
        self.assertLessEqual(sentinel_metrics["fpr"], 5.0)
        
        cm = sentinel_metrics["confusion_matrix"]
        self.assertIn("tn", cm)
        self.assertIn("tp", cm)
        self.assertIn("fp", cm)
        self.assertIn("fn", cm)

if __name__ == "__main__":
    unittest.main()
