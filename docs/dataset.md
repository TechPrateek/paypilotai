# IEEE-CIS Fraud Benchmark & Dataset Engineering

## Overview

PayPilot AI's machine learning pipelines and ablation benchmarks are structured around the industry standard **IEEE-CIS Fraud Detection** dataset (`train_transaction.csv` and `train_identity.csv`), adapted for modern multi-modal graph learning.

---

## 1. Temporal Splitting & Data Leakage Prevention

> [!IMPORTANT]
> Standard random K-Fold cross validation causes catastrophic look-ahead data leakage in payment fraud detection because fraud syndicates evolve dynamically over time.

PayPilot AI enforces strict **Temporal Splitting**:
* **Training Set**: Earliest 70% of chronological transactions ($t_0 \to t_{70\%}$)
* **Validation Set**: Middle 15% of transactions ($t_{70\%} \to t_{85\%}$)
* **Out-of-Time Test Set**: Latest 15% of transactions ($t_{85\%} \to t_{100\%}$)

### Zero Leakage Rules
1. Rolling velocity counts (e.g. `transactionsInLast5Min`, `transactionsInLast1Hour`) only aggregate strictly prior events ($t < t_{\text{current}}$).
2. Historical behavioral baselines (e.g. `customerAverageAmount`, `amountDeviationRatio`) compute stats strictly before the target timestamp.
3. Cold-start accounts flag `historyAvailable = false` and pass default zero vectors instead of imputing future data.

---

## 2. Handling Missing Identity Context

In real-world merchant checkout traffic and the IEEE-CIS benchmark:
* ~70% of transactions lack rich identity telemetry (`train_identity.csv` is absent or unlinked).
* PayPilot AI handles missing identity by:
  1. Emitting an explicit `DATA_AVAILABILITY` structured evidence record (`identityAvailable = false`).
  2. Applying a confidence score penalty ($\Delta \text{conf} = -0.15$) rather than inflating the fraud risk probability.
  3. Leveraging proxy network IP heuristics and device fingerprint hashes where full identity attributes are omitted.

---

## 3. Benchmark Dataset Ingestion

The dataset pipeline is encapsulated in `ml-service/dataset/ieee_cis_loader.py` and provides automated loading, feature log-scaling, categorical one-hot mappings, and graph adjacency matrix construction.
