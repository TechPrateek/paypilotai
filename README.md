# PayPilot AI — Intelligent Payment Risk & Fraud Detection

A full-stack FinTech web application and machine learning project that analyzes online payment transactions in real-time, calculates a risk score from 0 to 100, and helps merchants decide whether to **Approve**, **Review**, or **Block** an order.

---

## 📌 Project Motivation

Most simple fraud rules reject customers whenever they shop from a new phone or place their first order. In real life:
> **A new customer or a new device does NOT automatically mean fraud.**

I built **PayPilot AI** to solve this problem by combining transaction details, past buying habits, and a connected network map (Graph ML) so merchants don't lose good customers while still stopping real card testers and attackers.

---

## 🚀 Key Features

* **Merchant Dashboard**: Live overview of total orders, revenue, approval rate, risk scores, and charts.
* **Risk Score & Decision (0–100)**: Evaluates transaction amounts, location, device, network, and past history.
* **Interactive Connection Map**: Visual network graph showing how a customer, device, IP address, and card are connected.
* **Payment Simulator**: Test 7 realistic scenarios (e.g. first-time buyer, network timeout retry, switching from UPI to card, and coordinated fraud attacks).
* **Investigation Case Queue**: Risk analysts can open cases, review evidence, change status, and add investigation notes.
* **Plain-English Explanations**: Every decision explains *why* an action was recommended in simple terms.

---

## 🛠️ Tech Stack Used

* **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Shadcn/UI, Recharts, Lucide Icons
* **Backend**: Next.js API Routes, NextAuth (Auth.js) session management
* **Database**: PostgreSQL with Prisma ORM (includes 520+ seeded sample transactions)
* **ML Microservice**: Python, FastAPI, LightGBM, NetworkX / PyTorch Geometric, Scikit-learn

---

## 💻 How to Run Locally

### 1. Prerequisites
* Node.js (v18 or higher)
* Python (v3.10 or higher)

### 2. Setup the Python ML Service
In your first terminal:
```bash
cd ml-service
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*(FastAPI server will start on `http://127.0.0.1:8000`)*

### 3. Setup the Next.js Frontend & Database
In a second terminal:
```bash
# Install dependencies
npm install

# Push database schema to PostgreSQL
npx prisma db push

# Seed sample transactions and demo data
npx tsx prisma/seed.ts

# Start the web app
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 🔑 Demo Login Accounts

Password for all demo accounts: `demo123`

| Role | Email | Password | What You Can Test |
| :--- | :--- | :--- | :--- |
| **Store Merchant** | `merchant@paypilot.ai` | `demo123` | View store dashboard, test simulator, configure rules |
| **Risk Analyst** | `analyst@paypilot.ai` | `demo123` | Investigate cases, add notes, view visual graph map |
| **Administrator** | `admin@paypilot.ai` | `demo123` | View audit logs, user list, and model metrics |

---

## 🧠 How the Risk Engine Works

1. **Order Details (LightGBM)**: Analyzes amount, payment method (UPI, Card, NetBanking), and country.
2. **Customer Habits (Behavioral)**: Checks if the amount is normal for this customer and tracks velocity.
3. **Connected Network (Graph ML)**: Checks if the phone fingerprint or IP is linked to previously reported accounts.
4. **Confidence Score**: Separates fraud risk from customer age so first-time buyers are not blocked.

---

## 📂 Project Structure

```
paypilot-ai/
├── ml-service/             # Python FastAPI backend for ML models
│   ├── app/                # FastAPI routes & prediction endpoints
│   ├── features/           # Feature extraction functions
│   ├── graph/              # Network graph builder & GNN logic
│   └── models/             # LightGBM & Hybrid Risk Aggregator
├── prisma/                 # Prisma database schema & seed script
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/                # Next.js pages & API routes
│   │   ├── (auth)/         # Login & Register pages
│   │   ├── (dashboard)/    # Overview, Transactions, Cases, Simulator
│   │   └── api/            # Backend API endpoints
│   ├── components/         # React UI components & Graph Explorer
│   └── lib/                # Database connection & helpers
└── README.md
```

---

## 🎓 What I Learned Building This

* How to build a multi-service architecture connecting a Next.js web application to a Python FastAPI service.
* Designing relational databases and writing seed scripts with Prisma ORM and PostgreSQL.
* Building interactive custom data visualizations and network graphs with SVG in React.
* Implementing authentication and role-based access control (Merchant, Analyst, Admin).
* Handling real-world FinTech edge cases like cold-start users and payment retry behavior.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
