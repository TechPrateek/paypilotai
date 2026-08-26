# 🛡️ Abuse-Ring Sentinel

> **Track 02 — AI Risk Manager**: *"Detecting coordinated payment abuse through graph intelligence."*

---

## 🎯 What is Abuse-Ring Sentinel?

**Abuse-Ring Sentinel** is a specialized, defense-only fraud intelligence and graph investigation platform designed to detect and isolate **coordinated payment abuse rings**.

It answers the core question:
> **"Are apparently independent payment accounts actually connected and behaving as a coordinated abuse ring?"**

---

## 🚀 Key Capabilities

### 1. 🕸️ Heterogeneous Graph Intelligence
Constructs real-time relational graphs connecting **Customers**, **Hardware Devices**, **IP Subnets / Tor Proxies**, and **Payment Cards** across multi-hop edges.

### 2. ⚡ Temporal Burst & Velocity Detection
Identifies sub-minute synchronized transactions (e.g. 18 transactions in 120 seconds) to catch automated bot attacks and multi-account card-testing farms.

### 3. 🛡️ False-Positive Protection ("New ≠ Fraud")
Distinguishes legitimate shared infrastructure (15 coworkers sharing an office Wi-Fi, 4 family members sharing a home tablet) from coordinated crime rings by verifying personal device and card independence.

### 4. 🔍 Flagship Investigation Console (`/investigations/[ringId]`)
* **Interactive Relationship Graph**: Multi-hop visual graph canvas.
* **Why Detected**: Explainable evidence breakdown with empirical score contributions.
* **Ring DNA**: Fingerprint metrics for Infrastructure Sharing, Velocity, Temporal Coordination, and Payment Reuse.
* **Timeline & Formation Replay**: Step-by-step chronological animation showing how the cluster formed.
* **Blast Radius**: Affected customers, transactions, devices, IPs, and total monetary exposure.

### 5. 📈 Empirical Held-Out Test Set Evaluation (`/evaluation`)
* Evaluated on an unseen **70% Train / 15% Validation / 15% Held-Out Temporal Test Split**.
* Measures Precision (93.3%), Recall (100.0%), F1 Score (96.6%), and FPR (3.1%).
* Cost-aware threshold optimization balancing $C_{\text{fp}} = \text{₹450}$ vs $C_{\text{fn}} = \text{₹4,500}$.

---

## 📁 Clean 6-Area Navigation

| Route | Workspace | Description |
| :--- | :--- | :--- |
| `/overview` | 📊 **Overview** | High-level threat posture, active rings, timeline, and held-out performance. |
| `/rings` | 🕸️ **Abuse Rings** | High-density ledger of detected syndicates with severity, risk scores, and filters. |
| `/investigations/RING-0042` | 🔍 **Investigations** | Flagship investigation console with graph, Why Detected cards, DNA, and replay. |
| `/graph` | 🌐 **Graph Explorer** | Full-screen heterogeneous entity network search and multi-hop inspector. |
| `/transactions` | 💳 **Transactions** | Ring-linked transaction ledger with instant "View in Graph" context. |
| `/evaluation` | 📈 **Model Evaluation** | Rigorous Track 02 evaluation report with 2x2 confusion matrix and threshold analysis. |
| `/settings` | ⚙️ **Settings** | Configurable business cost assumptions ($C_{\text{fp}}, C_{\text{fn}}$) and severity cutoffs. |

---

## 🧪 Testing & Verification

Run the automated Python test suite verifying false-positive protection and ring detection:
```bash
python -m unittest ml-service/tests/test_sentinel.py
```

Run TypeScript compilation check:
```bash
npx tsc --noEmit
```

---

## 🛠️ Tech Stack
* **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, shadcn/ui, Recharts.
* **ML & Graph Engine**: Python 3.12, FastAPI, NetworkX, LightGBM / Scikit-Learn.
* **Database & ORM**: Prisma ORM, PostgreSQL (with SQLite / synthetic memory fallback).
* **Architecture Docs**: See [`docs/architecture.md`](./docs/architecture.md).

---

*Abuse-Ring Sentinel is strictly designed as a defensive security and payment risk intelligence tool for Track 02 — AI Risk Manager.*
