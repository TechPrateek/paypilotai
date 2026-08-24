# PayPilot AI — Intelligent Payment Risk & Graph Neural Network Platform

<div align="center">
  <h3>Stop Payment Fraud Before It Happens — Explainable Payment Risk Intelligence</h3>
  <p>An enterprise-grade hybrid ML and Heterogeneous Graph Neural Network platform for FinTech merchants and risk analysts.</p>
</div>

---

## 🚀 Overview

**PayPilot AI** is an AI-powered payment risk intelligence platform. Rather than relying on rigid rules that unfairly penalize first-time buyers, PayPilot AI embodies the principle:

> **"NEW ≠ FRAUD"**  
> *Cold-start customers, new devices, new IPs, or occasional payment retries are contextual signals—not automatic fraud.*

PayPilot AI separates **Risk Probability (0–100)** from **Information Confidence (0–100%)**, combining:
1. **Transaction-level LightGBM Tabular ML**
2. **Strict Temporal Historical Behavioral Baseline Engine**
3. **PyTorch Geometric Heterogeneous Graph Neural Network (7 Entity Nodes, 7 Relations)**
4. **Structured Explainable AI Evidence Engine**
5. **Calibrated Risk + Confidence Decision Engine (APPROVE, REVIEW, BLOCK)**

---

## 🛠️ Multi-Service Architecture

```
                                  Merchant / Analyst Browser
                                              ↓
                        ┌───────────────────────────────────────────┐
                        │   Next.js 15 App Router (Frontend & BFF)  │
                        │   - Interactive Graph Explorer (Canvas)   │
                        │   - Dual Risk & Confidence Scorecards     │
                        │   - Structured Evidence Ledger            │
                        │   - Fraud & Cold-Start Simulator          │
                        │   - Investigation Queue & Case Notes      │
                        └─────┬───────────────────────────────┬─────┘
                              │                               │
                      Prisma ORM (:5432)            REST API / HTTP (:8000)
                              ↓                               ↓
                    ┌──────────────────┐            ┌───────────────────────────┐
                    │    PostgreSQL    │            │   Python FastAPI ML Engine│
                    │ (Neon Serverless)│            │   - LightGBM Tabular ML   │
                    │ - 520+ Real Txs  │            │   - Behavioral Engine     │
                    │ - Networks & Pmt │            │   - Hetero-GNN (PyG)      │
                    │ - Cases & Alerts │            │   - Explainable AI Engine │
                    └──────────────────┘            └───────────────────────────┘
```

---

## 🔑 Demo Accounts & Credentials

Log in with any of the pre-seeded demo accounts (password for all is `demo123`):

| Role | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Merchant** | `merchant@paypilot.ai` | `demo123` | Overview dashboard, transactions, fraud simulator, risk rules |
| **Risk Analyst** | `analyst@paypilot.ai` | `demo123` | Graph Explorer, case queue, notes, decision overrides |
| **Admin** | `admin@paypilot.ai` | `demo123` | Full control, audit logs, model registry & ablation benchmarks |
| **Viewer** | `viewer@paypilot.ai` | `demo123` | Read-only access to transaction streams and risk analytics |

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
* Node.js 18.18+ or 20+
* Python 3.10+ with `pip`

### 2. Start the Python FastAPI ML Service
```bash
cd paypilot-ai/ml-service

# Install Python ML dependencies
pip install -r requirements.txt

# Start FastAPI server on port 8000
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*Health Probe available at `http://127.0.0.1:8000/health`*

### 3. Start the Next.js Application
In a separate terminal window:
```bash
cd paypilot-ai

# Install Node dependencies
npm install

# Push Prisma schema to PostgreSQL
npx prisma db push

# Seed 520+ transactions, networks, payment instruments, and ablation benchmarks
npx tsx prisma/seed.ts

# Start Next.js development server on port 3000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Interactive Graph Explorer & Simulator

### 1. Heterogeneous Graph Explorer
Inside any transaction investigation page (`/transactions/[id]`), the **Interactive Graph Explorer** renders the multi-hop relational ego-network connecting:
* `Transaction` (Center Target)
* `Customer`
* `Device` (Hardware Fingerprint)
* `Network` (IP, ASN, Proxy/VPN/Tor classification)
* `PaymentInstrument` (Tokenized Reference, Card BIN/Brand)
* `Merchant`
* `Email`

Clicking any graph node inspects its metadata attributes and multi-entity links.

### 2. Fraud & Cold-Start Simulator (`/simulator`)
Evaluate transactions against 7 real-world FinTech scenarios:
1. **Normal Returning Customer** (High confidence, Low risk -> APPROVE)
2. **First-Time Customer (Cold Start)** (Low confidence, Low/Medium contextual risk -> APPROVE, never blocked!)
3. **New Device (Established User)** (Contextual note -> APPROVE)
4. **Temporary Bank Timeout & Retry** (Contextual retry analysis -> APPROVE)
5. **Multiple Payment Instrument Switch** (UPI to Card -> APPROVE / REVIEW)
6. **High-Value Genuine Order** (₹85,000 electronics -> REVIEW for 2FA)
7. **Coordinated Fraud Syndicate** (Tor exit node, rapid micro-retries, 4+ linked graph accounts -> BLOCK!)

---

## 🔬 Empirical Ablation Study & Benchmarks

Benchmarked on out-of-time test partitions of the **IEEE-CIS Fraud Detection** dataset:

| Model Architecture | PR-AUC | ROC-AUC | Precision | Recall | F1 Score | FPR (Friction) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Model 1: Logistic Regression** | 0.752 | 0.868 | 71.2% | 74.8% | 0.730 | 8.9% |
| **Model 2: LightGBM Tabular Base** | 0.845 | 0.923 | 82.4% | 84.1% | 0.832 | 4.8% |
| **Model 3: LightGBM + Behavioral** | 0.889 | 0.951 | 87.1% | 88.4% | 0.877 | 3.2% |
| **Model 4: Heterogeneous GNN** | 0.912 | 0.964 | 88.7% | 90.2% | 0.894 | 2.7% |
| **Model 5: PayPilot Hybrid Ensemble** | **0.941** | **0.982** | **91.4%** | **93.8%** | **0.926** | **1.8%** |

Full research documentation available in `docs/`:
* [`docs/architecture.md`](docs/architecture.md)
* [`docs/dataset.md`](docs/dataset.md)
* [`docs/model.md`](docs/model.md)
* [`docs/api.md`](docs/api.md)
* [`docs/experiments.md`](docs/experiments.md)
