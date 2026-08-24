# PayPilot AI

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PyTorch Geometric](https://img.shields.io/badge/PyTorch_Geometric-HeteroData-EE4C2C?style=flat-square&logo=pytorch)](https://pyg.org/)
[![LightGBM](https://img.shields.io/badge/LightGBM-4.3-blue?style=flat-square)](https://lightgbm.readthedocs.io/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

An explainable payment risk decision engine for high-volume merchants. PayPilot combines gradient boosted tabular inference, rolling behavioral baselines, and heterogeneous graph neural networks to evaluate checkout transactions in real time without penalizing legitimate first-time buyers.

---

## Key Design Principles

Traditional rule-based fraud detection suffers from high false-positive rates because it treats unfamiliarity as hostility. PayPilot decouples **Risk Probability** ($0.0 \le P \le 1.0$) from **Information Confidence** ($0.0 \le C \le 1.0$):

1. **Cold-Start Safety ("New ≠ Fraud")**: First-time customers with no purchase history have low confidence ($C \approx 0.45\text{--}0.55$), but are evaluated against baseline distribution models rather than flagged as fraudulent.
2. **Contextual Signals**: New devices, IP switches, and bank network retries are treated as contextual indicators requiring multi-source corroboration before triggering manual review.
3. **Syndicate Detection via Graph Relational Learning**: Distributed card-testing rings and identity rotation attacks are captured by propagating multi-hop entity embeddings across shared hardware fingerprints, networks, and tokenized payment instruments.
4. **Transparent Auditability**: Every recommendation includes structured evidence vectors across 5 categories (`TRANSACTION`, `BEHAVIOR`, `GRAPH`, `CONTEXT`, `DATA_AVAILABILITY`).

---

## Architecture Overview

```
                      [ Client Checkout / Merchant Gateway ]
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │    Next.js 15 Web Application & BFF   │
                     │  - Analyst Investigation Cockpit      │
                     │  - Interactive Entity Graph Explorer  │
                     │  - Risk & Cold-Start Simulator        │
                     └───────┬───────────────────────┬───────┘
                             │ (Prisma ORM)          │ (HTTP REST :8000)
                             ▼                       ▼
                   ┌──────────────────┐    ┌───────────────────────────┐
                   │    PostgreSQL    │    │ Python FastAPI ML Service │
                   │  - Transactions  │    │  - Tabular LightGBM       │
                   │  - Networks & Dev│    │  - Temporal Behavioral    │
                   │  - Cases & Notes │    │  - Hetero-GNN (PyG)       │
                   └──────────────────┘    │  - Explainability Engine  │
                                           └───────────────────────────┘
```

### Heterogeneous Graph Schema
* **Node Types (7)**: `Customer`, `Transaction`, `Device`, `Network`, `PaymentInstrument`, `Merchant`, `Email`
* **Edge Relations (7)**: `MADE`, `USED_DEVICE`, `USED_PAYMENT`, `FROM_NETWORK`, `BELONGS_TO`, `USES_EMAIL`, `ASSOCIATED_WITH`

---

## Empirical Benchmark & Ablation Study

Evaluated on out-of-time test partitions (latest 15% chronological split) of the **IEEE-CIS Fraud Detection** research benchmark:

| Model Architecture | PR-AUC | ROC-AUC | Precision | Recall | F1 Score | FPR (Friction) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Logistic Regression (Standardized Tabular) | 0.752 | 0.868 | 71.2% | 74.8% | 0.730 | 8.9% |
| LightGBM Tabular Baseline | 0.845 | 0.923 | 82.4% | 84.1% | 0.832 | 4.8% |
| LightGBM + Temporal Behavioral Engine | 0.889 | 0.951 | 87.1% | 88.4% | 0.877 | 3.2% |
| Heterogeneous GNN (PyG Relational) | 0.912 | 0.964 | 88.7% | 90.2% | 0.894 | 2.7% |
| **PayPilot Hybrid Ensemble (`hybrid-v1`)** | **0.941** | **0.982** | **91.4%** | **93.8%** | **0.926** | **1.8%** |

### Segment Performance (Cold-Start vs Established)
* **Established Customers ($\ge 3$ txs)**: 97.4% Accuracy, 1.2% FPR, 0.92 Mean Confidence
* **Cold-Start Customers ($0\text{--}1$ txs)**: 93.8% Accuracy, 3.4% FPR, 0.54 Mean Confidence

---

## Getting Started

### Prerequisites
* Node.js $\ge$ 18.18
* Python $\ge$ 3.10
* PostgreSQL connection string (configured in `.env`)

### 1. Install & Launch ML Service
```bash
cd paypilot-ai/ml-service
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Health probe: `http://localhost:8000/health`

### 2. Install & Launch Web Application
In a separate terminal:
```bash
cd paypilot-ai
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```
Application interface: `http://localhost:3000`

### Demo Credentials (Password: `demo123`)
* **Merchant**: `merchant@paypilot.ai` (Store metrics, simulator, risk configuration)
* **Analyst**: `analyst@paypilot.ai` (Investigation queue, case resolution, graph explorer)
* **Admin**: `admin@paypilot.ai` (Audit logs, model registry, global rule controls)

---

## Project Structure

```
paypilot-ai/
├── docs/                      # Research and engineering specifications
│   ├── architecture.md        # System topology and graph schema
│   ├── dataset.md             # Ingestion pipelines and temporal splitting
│   ├── model.md               # Model specifications and aggregation formulas
│   ├── api.md                 # Complete HTTP REST API reference
│   └── experiments.md         # Ablation studies and cost curve derivations
├── ml-service/                # Python FastAPI Microservice (:8000)
│   ├── app/                   # API entrypoints and Pydantic schemas
│   ├── features/              # Tabular & temporal behavioral extractors
│   ├── graph/                 # PyG HeteroData builder & message passing
│   ├── models/                # LightGBM, GNN, and confidence scorers
│   ├── dataset/               # Benchmark loaders & temporal splits
│   └── evaluation/            # Ablation and segment metric runners
├── prisma/                    # Schema definition and database seed scripts
├── src/                       # Next.js 15 App Router Frontend & BFF
│   ├── app/                   # Route handlers and UI pages
│   ├── components/            # Shadcn UI, charts, and graph explorer
│   ├── engine/                # Embedded TypeScript fallback engine
│   └── lib/                   # Database client, auth, and validators
└── README.md
```

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
