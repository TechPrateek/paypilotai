import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any, Optional

class IEEECISDatasetPipeline:
    """
    IEEE-CIS Fraud Detection Research Benchmark Pipeline.
    
    Research Benchmark Notes:
    - Joined using TransactionID on train_transaction.csv and train_identity.csv.
    - Identity information is missing for ~70% of rows (handled via explicit data availability flags).
    - Splitting strategy: Temporal ordering by TransactionDT (Never use random K-Fold on temporal fraud data!).
    - Earliest 70% -> Train, Next 15% -> Validation, Final 15% -> Test.
    """
    @staticmethod
    def get_pipeline_metadata() -> Dict[str, Any]:
        return {
            "dataset": "IEEE-CIS Fraud Detection",
            "files": ["train_transaction.csv", "train_identity.csv"],
            "joinKey": "TransactionID",
            "temporalColumn": "TransactionDT",
            "totalRowsBenchmark": 590540,
            "trainSplit": "0 to 413,378 (Earliest 70%)",
            "valSplit": "413,379 to 501,959 (Middle 15%)",
            "testSplit": "501,960 to 590,540 (Latest 15%)",
            "handlingMissingIdentity": "Explicit identityAvailable=False flag; graph embeddings fallback to device/IP proxies.",
            "disclaimer": "IEEE-CIS is used as a public research benchmark. It is not assumed to exactly represent production merchant data."
        }
