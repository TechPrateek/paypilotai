# 🛡️ Abuse-Ring Sentinel
> **Track 02 — AI Risk Manager**: *"Coordinated Payment Abuse Detection & Investigation Platform"*

---

## 🎯 What is Abuse-Ring Sentinel?

**Abuse-Ring Sentinel** is a specialized, defense-only fraud intelligence and graph investigation platform designed to detect and isolate **coordinated payment abuse rings**.

It addresses the fundamental question:
> **"Are apparently independent payment accounts actually connected and behaving as a coordinated abuse ring?"**

The platform combines **heterogeneous entity graphs**, **sliding-window temporal burst extractors**, and **cost-sensitive risk scoring** with empirical verification on a temporal held-out test set.

---

## 🏗️ Technical Architecture & Data Flow

```
[ Incoming Payment Transaction ]
               │
               ▼
[ Next.js API: POST /api/risk/analyze ]
               │
               ├── (1) Customer Historical Context Retrieval (Prisma / DB)
               │
               ▼
[ FastAPI Service: POST /api/predict ]
               │
               ├── (2) Feature Extraction (Tabular + Behavioral)
               │
               ├── (3) Heterogeneous Graph Construction (NetworkX)
               │       - Typed Entities: Customer, Device, IP, PaymentInstrument
               │       - Multi-Hop Relations: USES_DEVICE, USES_IP, USES_PAYMENT
               │
               ├── (4) Multi-Modal Risk Aggregation
               │       - Tabular Model: Calibrated risk scorer
               │       - Behavioral Engine: Baseline deviation (Z-score & velocity)
               │       - Graph Engine: Ring risk from relational connectivity
               │
               ├── (5) False-Positive Protection Guard
               │       - Distinguishes shared corporate Wi-Fi from coordinated bot farms
               │
               └── (6) Cost-Aware Decision Engine
                       - Expected Loss: (FP × C_FP) + (FN × C_FN) + (REVIEW × C_REVIEW)
                       - Action: APPROVE | APPROVE_WITH_MONITORING | REVIEW | BLOCK
               │
               ▼
[ Structured Evidence & Persistence ]
               │
               ▼
[ Analyst SOC & Investigation Console (/investigations/[ringId]) ]
```

---

## 🚀 Key Modules & Capabilities

### 1. 🕸️ Graph Intelligence & Entity Resolution
* Constructs heterogeneous relational graphs connecting **Customers**, **Hardware Devices**, **IP Subnets**, and **Payment Cards**.
* Computes multi-hop ego-network features and connected component sizes.

### 2. ⚡ Temporal Burst & Velocity Detection
* Identifies synchronized micro-transactions (e.g. 18 transactions in 120 seconds) to catch automated bot attacks and multi-account card-testing farms.

### 3. 🛡️ False-Positive Protection ("Shared ≠ Fraud")
* **Corporate Office Benchmark**: 15 coworkers sharing an office Wi-Fi (`14.143.38.102`) with independent laptops and normal intervals $\rightarrow$ **APPROVED / NOT A RING**.
* **Coordinated Fraud Ring**: 7 accounts sharing device `D102` with 18 sub-minute burst orders $\rightarrow$ **BLOCKED / RING DETECTED**.

### 4. 🔍 Flagship Investigation Console (`/investigations/[ringId]`)
* **Interactive Relationship Graph**: Multi-hop visual canvas with zoom/pan and node inspection.
* **Why Detected**: Plain-language evidence cards generated from real detector features.
* **Ring DNA**: Structural feature strength bars (Shared Infrastructure, Temporal Coordination, Velocity, Payment Reuse, Historical Suspicion).
* **Step-by-Step Timeline**: Chronological event stream with exact timestamps, amounts, and device IDs.
* **Blast Radius**: Affected customers, transactions, devices, IPs, cards, and exposure.

### 5. 📈 Empirical Held-Out Test Set Evaluation (`/evaluation`)
* Evaluated on a **70% Train / 15% Validation / 15% Held-Out Temporal Test Split** (46 test samples).
* **Validation Threshold Optimization**: Operating threshold $\tau = 0.70$ selected strictly on validation data to minimize Expected Loss.
* **Held-Out Test Performance**:
  * **Precision**: 93.3%
  * **Recall**: 100.0%
  * **F1 Score**: 96.6%
  * **False Positive Rate (FPR)**: 3.1%
  * **PR-AUC**: 0.942 | **ROC-AUC**: 0.968
  * **Confusion Matrix**: $\text{TN}=31, \text{FP}=1, \text{FN}=0, \text{TP}=14$ (Total = 46)

---

## 🧭 Navigation & Workspaces

| Route | Workspace | Description |
| :--- | :--- | :--- |
| `/overview` | 📊 **Overview** | High-level threat posture, active rings, timeline, and held-out performance. |
| `/rings` | 🕸️ **Abuse Rings** | High-density ledger of detected syndicates with severity, risk scores, and filters. |
| `/investigations/RING-0042` | 🔍 **Investigations** | Flagship investigation console with graph, Why Detected cards, DNA, and replay. |
| `/graph` | 🌐 **Graph Explorer** | Full-screen heterogeneous entity network search and multi-hop inspector. |
| `/transactions` | 💳 **Transactions** | Ring-linked transaction ledger with instant `[VIEW IN GRAPH]` context. |
| `/evaluation` | 📈 **Model Evaluation** | Rigorous evaluation console with 2×2 confusion matrix and threshold analysis. |
| `/settings` | ⚙️ **Configuration** | Server-backed business cost parameters ($C_{\text{fp}}, C_{\text{fn}}$) and execution triggers. |

---

## 🧪 Automated Testing

Run the Python pipeline test suite:
```bash
python -m unittest ml-service/tests/test_sentinel_pipeline.py
```

Run TypeScript compilation check:
```bash
npx tsc --noEmit
```

---

## ⚠️ Synthetic Data & Cost Model Disclaimers
* **Synthetic Evaluation**: All data shown in this prototype is generated from a controlled synthetic dataset modeling real-world payment abuse patterns.
* **Illustrative Cost Model**: Default parameters ($C_{\text{fp}} = \text{₹450}$, $C_{\text{fn}} = \text{₹4,500}$) represent illustrative financial trade-offs for loss minimization.

---

*Abuse-Ring Sentinel is strictly designed as a defensive security and payment risk intelligence system for Track 02 — AI Risk Manager.*
