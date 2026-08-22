# PayPilot AI — Intelligent Payment Risk & Fraud Detection Platform

<div align="center">
  <h3>Stop Payment Fraud Before It Happens</h3>
  <p>An enterprise-grade payment risk scoring and fraud investigation management platform for modern merchants.</p>
</div>

---

## 🚀 Overview

**PayPilot AI** is an AI-powered fintech risk platform that analyzes payment transactions in real-time and computes a deterministic **Risk Score from 0–100**.

Based on multidimensional signal evaluation (amount deviation, velocity spikes, device fingerprinting, location anomalies, IP intelligence, disposable credentials, and prior chargeback history), PayPilot AI recommends:
* **APPROVE** (Score 0–29)
* **APPROVE WITH MONITORING** (Score 30–59)
* **REVIEW** (Score 60–79)
* **BLOCK** (Score 80–100)

Every decision includes **explainable AI breakdowns**, showing merchants and risk analysts the exact contributing factors with auditable evidence.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Lucide Icons, Recharts, `cmdk` (Command Palette), `sonner` (Toasts), `next-themes` (Dark/Light Mode).
* **Backend**: Next.js App Router API Routes & Server Actions, NextAuth v5 (Auth.js) credentials & session management.
* **Database & ORM**: Prisma ORM with SQLite (embedded zero-config for demo/local) / PostgreSQL ready.
* **Risk Engine**: Deterministic TypeScript scoring orchestrator with 8 specialized rule modules and statistical Z-score baseline anomaly detection.

---

## 🏗️ Architecture

```
User / Payment Gateway Webhook
             ↓
    Next.js 15 API / Webhook
             ↓
  ┌────────────────────────────────────────────────────────┐
  │              PayPilot AI Risk Engine                   │
  │                                                        │
  │  ├── 1. Amount Risk (historical multiplier & outliers) │
  │  ├── 2. Velocity Detection (short-window tx spikes)    │
  │  ├── 3. Device Analysis (fingerprints & multi-account) │
  │  ├── 4. Location Analysis (impossible travel & geo)    │
  │  ├── 5. Account Risk (account age & credential flags)  │
  │  ├── 6. IP Reputation (proxies, VPNs & blacklists)     │
  │  ├── 7. Payment Method Risk (card / wallet / corridor) │
  │  └── 8. Behavioral & Dispute Risk (failed attempt spk) │
  │                                                        │
  │  └── Statistical Anomaly Detector (Z-score baseline)   │
  └────────────────────────────────────────────────────────┘
             ↓
        Risk Score (0–100) + Clamped Contributions
             ↓
     Decision Engine → APPROVE / REVIEW / BLOCK
             ↓
   Explainable AI Investigation Narrative Generator
             ↓
        Prisma ORM (Database Persistence)
             ↓
  Interactive Fintech Dashboard & Investigation Queue
```

---

## 🔑 Demo Accounts & Credentials

Log in with any of the pre-seeded demo accounts (password for all is `demo123`):

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Merchant** | `merchant@paypilot.ai` | `demo123` | Dashboard, transactions, rules, fraud simulator, analytics |
| **Risk Analyst** | `analyst@paypilot.ai` | `demo123` | Investigation queue, case notes, decision overrides, customer risk timelines |
| **Admin** | `admin@paypilot.ai` | `demo123` | User management, global risk rules, audit logs, model version monitoring |

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
* Node.js 18.18+ or 20+
* npm or yarn or pnpm

### 2. Setup & Database Seeding
```bash
cd paypilot-ai

# Install dependencies
npm install

# Push schema to SQLite database (dev.db created automatically)
npx prisma db push

# Seed 520+ transactions, customers, rules, and investigation cases
npx tsx prisma/seed.ts

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Interactive Fraud Simulator

PayPilot AI includes a live **Fraud Simulator** with 6 pre-configured attack vectors:

1. **Normal Payment**: Legitimate low-risk transaction (`APPROVE`).
2. **Suspicious Payment**: Elevated amount from new device (`APPROVE_WITH_MONITORING`).
3. **Account Takeover**: Device switch + international location change + high amount (`REVIEW`).
4. **Card Testing Attack**: Rapid succession of micro-charges with high failure rates from proxy IP (`BLOCK`).
5. **Velocity Attack**: High-value burst transactions in under 5 minutes (`BLOCK`).
6. **Impossible Travel**: Geographic conflict between recent transactions (`REVIEW`).

---

## 📊 Database Models (16 Models)

* `User`: Multi-role accounts (Merchant, Analyst, Admin).
* `Merchant`: Store metadata, API keys, webhook URLs.
* `Customer`: Consumer accounts, email, phone, country.
* `Transaction`: Amounts, currencies (INR/USD/EUR), methods (UPI, Card, Wallet), statuses.
* `RiskAssessment`: Computed score, level, decision, anomaly score, AI narrative.
* `RiskFactor`: Score contributions, categories, explanations, evidence strings.
* `RiskRule`: Configurable rule definitions, score weights, threshold JSON.
* `RiskCase`: Investigation queue, priority, analyst assignments, status.
* `CaseNote`: Internal investigation notes and audit logs.
* `Alert`: Real-time fraud detection alerts and notifications.
* `Device`: Fingerprints, browser, OS, device types.
* `IPAddress`: Geolocation, proxy, VPN, and reputation flags.
* `CustomerDevice`: Customer-to-device mapping and reuse frequency.
* `AuditLog`: Action tracking (rule edits, case resolutions, overrides).
* `ModelVersion`: ML / Rule model performance metrics and versions.
* `Notification`: User alerts for critical spikes and rule updates.

---

## 🛡️ Key Features

* **Global Search (Ctrl+K)**: Instant Command Palette across transactions, customers, and cases.
* **Dark / Light Mode**: Fintech SaaS aesthetics with Tailwind CSS tokens.
* **Real-time Analytics**: Prevented losses, fraud rate trends, risk score distributions, country heatmaps.
* **Payment Webhook**: `POST /api/webhooks/payment` endpoint for simulated payment gateways.
* **Explainable AI**: Natural language investigation narratives generated from concrete deterministic risk signals.

---

## 🔮 Future Roadmap

* Graph-based fraud syndicate detection (Neo4j / NetworkX).
* Real-time streaming ingestion via Kafka / Apache Flink.
* Device biometric and canvas fingerprinting SDK.
* Real IP intelligence provider integration (MaxMind / IPQualityScore).
* Chargeback prediction & adaptive threshold tuning.
