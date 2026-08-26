#!/usr/bin/env python3
"""
CLI script to generate deterministic synthetic dataset for Abuse-Ring Sentinel.
"""
import os
import sys

# Add ml-service to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "ml-service"))

from dataset.generator import generate_synthetic_dataset

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(__file__), "..", "ml-service", "dataset")
    generate_synthetic_dataset(out_dir)
    print("Dataset generation complete!")
