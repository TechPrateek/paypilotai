# PayPilot AI — Payment Fraud & Abuse-Ring Risk Manager

> **Track**: AI Risk Manager — *Stop the merchant losing money to fraud, returns, and chargebacks*  
> **Repository**: [https://github.com/TechPrateek/paypilotai](https://github.com/TechPrateek/paypilotai)  
> **Core Principle**: *"A new customer or a new device does NOT automatically mean fraud."*

---

## 📌 Project Overview

**PayPilot AI** is a cost-aware, false-positive-resistant payment risk decision engine built to protect online merchants from coordinated cyber fraud while preventing lost sales from unnecessary customer friction.

It focuses specifically on **2 Core Defense Pillars**:

```
                            PAYPILOT AI
              ┌──────────────────────────────────────┐
              │                                      │
              ▼                                      ▼
   [ 1. FRAUD-SPIKE DETECTOR ]            [ 2. ABUSE-RING SENTINEL ]
   • Sliding-window velocity (< 5 min)    • Heterogeneous Entity Graph (7 nodes)
   • Card-testing bot attack limiter      • Multi-account device & IP rings
   • False-positive protection guard      • Normalized Ring Risk (0 - 100)
   • Dedicated Section: /simulator        • Dedicated Section: /transactions
```

---

## 🚀 The 2 Core Defense Pillars

### 1. ⚡ Fraud-Spike Detector (Temporal / Velocity Layer)
* **What it Does**: Monitors rapid transaction bursts, payment instrument rotation, and failure velocities within a 5-minute sliding window.
* **Why it Matters**: Automatically detects and throttles automated card-testing bots testing stolen card numbers with micro-transactions.
* **Cost-Aware Decisioning**: Uses expected loss optimization ($C_{\text{fp}} = \text{₹450}$ vs $C_{\text{fn}} = \text{₹4,500}$) so good buyers are not rejected.
* **Interactive Section**: [`/simulator`](http://localhost:3000/simulator)

### 2. 🕸️ Abuse-Ring Sentinel (Relational / Graph Layer)
* **What it Does**: Connects 7 entity node types (`Customer`, `Device`, `Network/IP`, `PaymentInstrument`, `Transaction`, `Merchant`, `Email`) across 7 typed relations.
* **Why it Matters**: Detects when a single physical phone/laptop or Tor IP subnet is being used to operate multiple fake accounts across rotated cards.
* **Interactive Section**: [`/transactions`](http://localhost:3000/transactions) & [`/transactions/[id]`](http://localhost:3000/transactions)

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Shadcn/UI, Recharts, Lucide Icons
* **Localization & UX**: Multi-Language Support (**English & हिन्दी**) + **Dark / Light Mode**
* **Backend & API**: Next.js API Routes, NextAuth (Auth.js) session management
* **Database & ORM**: PostgreSQL with Prisma ORM (includes 520+ seeded real FinTech transactions)
* **ML Microservice**: Python 3.10+, FastAPI, LightGBM, NetworkX / PyTorch Geometric, Scikit-learn

---

## 💻 How to Run Locally

### 1. Start Python ML Microservice
```bash
cd ml-service
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*(Runs on `http://127.0.0.1:8000`)*

### 2. Start Next.js Web Application
In a second terminal:
```bash
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```
*(Runs on `http://localhost:3000`)*

---

## 🔑 Demo Login Accounts (Password: `demo123`)

| Role | Email | Password | What You Can Test |
| :--- | :--- | :--- | :--- |
| **Store Merchant** | `merchant@paypilot.ai` | `demo123` | Store dashboard, Fraud-Spike simulator, live attack alerts |
| **Risk Analyst** | `analyst@paypilot.ai` | `demo123` | Abuse-Ring graph explorer, case cockpit, forensic notes |
| **Administrator** | `admin@paypilot.ai` | `demo123` | Model metrics, IEEE-CIS benchmarks, system audit logs |

---

## 📊 Empirical Benchmarks (Held-Out Test Set)

Evaluated on the IEEE-CIS Fraud Detection temporal validation benchmark:
* **Precision**: 91.4%
* **Recall**: 93.8%
* **False Positive Rate (FPR)**: 1.8%
* **Loss Cost Reduction**: 73.8% reduction compared to legacy rule-based tools.

---

## 📄 License

This project is open source under the [MIT License](LICENSE).
