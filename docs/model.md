# Model Architecture & Multi-Modal Fusion

## Overview

PayPilot AI deploys a 5-stage progressive model architecture culminating in the **PayPilot Hybrid Ensemble** (`hybrid-v1`), fusing tabular gradient boosting, historical behavioral dynamics, and relation-aware Graph Neural Networks.

---

## 1. Sub-Model Architectures

### 1. Model 1: Logistic Regression Baseline (`logreg-v1`)
* Linear L2-regularized classifier operating on standardized tabular transaction features (Amount log-scale, payment type, country, device flags).
* Serves as the minimal linear baseline for benchmark comparisons.

### 2. Model 2: LightGBM Tabular Base (`lightgbm-v1`)
* Gradient Boosted Decision Tree (GBDT) with histogram binning and tree depth regularization.
* Captures non-linear feature interactions between transaction amount, network anonymity flags (Tor, VPN, Datacenter Proxy), and country risk indicators.

### 3. Model 3: LightGBM + Behavioral ML Engine (`behavioral-v1`)
* Incorporates windowed velocity counters (1 min, 5 min, 1 hour, 24 hours), amount deviation Z-scores ($Z = \frac{x - \mu}{\sigma}$), payment instrument switching cadence, and device familiarity ratios.
* Implements cold-start gating: When `historyAvailable = false`, behavioral weights dynamically zero out to prevent false-positive penalization.

### 4. Model 4: Heterogeneous GNN (`gnn-v1`)
* Implemented with **PyTorch Geometric** (`HeteroData`).
* Uses multi-layer relation-aware message passing across 7 node types (`Customer`, `Transaction`, `Device`, `Network`, `PaymentInstrument`, `Merchant`, `Email`).
* Detects distributed card-testing rings and synthetic identity clusters sharing physical devices or network subnets across multiple customer IDs.

### 5. Model 5: PayPilot Hybrid Ensemble (`hybrid-v1`)
* Dynamic weighted aggregation:
  $$\text{Risk}_{\text{prob}} = w_1 P_{\text{tabular}} + w_2 P_{\text{behavioral}} + w_3 P_{\text{gnn}}$$
* Weights dynamically adapt based on data availability flags:
  * With Established History: $w_1 = 0.40, w_2 = 0.30, w_3 = 0.30$
  * With Cold Start: $w_1 = 0.55, w_2 = 0.00, w_3 = 0.45$

---

## 2. Confidence Engine Formulation

Information Confidence is computed as:
$$\text{Conf} = \text{Base} + \Delta_{\text{history}} + \Delta_{\text{identity}} + \Delta_{\text{graph}}$$

Where:
* $\Delta_{\text{history}} \in [-0.15, +0.25]$ depending on customer transaction count and account age.
* $\Delta_{\text{identity}} \in [-0.10, +0.12]$ based on verified device fingerprint and residential ASN.
* $\Delta_{\text{graph}} \in [-0.12, +0.13]$ based on multi-hop ego-network density and entity connectivity.
