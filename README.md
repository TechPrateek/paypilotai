# PayPilot AI
> Coordinated Payment Abuse Detection & Graph Forensics Platform

---

## Why I Built This

Most conventional payment fraud systems evaluate transactions in silos: check the order amount, verify the billing country, and check simple single-card velocity.

However, coordinated payment abuse rings are designed specifically to bypass these single-transaction filters:
* Attackers cycle multiple stolen credit cards across dozens of newly created synthetic accounts.
* They keep transaction amounts low to avoid triggering standard velocity rules.
* They route traffic through Tor exit nodes and residential VPN subnets to mask origins.

When evaluated in isolation, **every single transaction appears legitimate**. But when you map the underlying entities into a relational graph and analyze micro-burst timings (30s–120s windows), the coordinated abuse ring immediately emerges.

I built **PayPilot AI** to detect, investigate, and explain these coordinated syndicates using multi-hop graph intelligence, temporal burst extraction, and cost-aware decisioning.

---

## System Architecture

```
                       [ Incoming Payment Event ]
                                   │
                                   ▼
                   [ Next.js API (/api/risk/analyze) ]
                                   │
                      (Retrieve Customer History)
                                   │
                                   ▼
                [ FastAPI ML Service (/api/predict) ]
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
 [ Tabular Scorer ]       [ Behavioral Engine ]     [ Graph Engine (NetworkX) ]
 - Transaction features   - Amount Z-scores         - Multi-hop entity graph
 - Network indicators     - Customer baseline dev   - Shared device/IP/card links
 - Payment method flags   - 5-min retry velocity    - Ego-network density
        └──────────────────────────┬──────────────────────────┘
                                   │
                                   ▼
                     [ Multi-Modal Aggregator ]
                                   │
                                   ▼
                    [ False-Positive Guard ]
          (Protects shared corporate Wi-Fi / family devices)
                                   │
                                   ▼
                    [ Cost-Aware Decision Engine ]
        Expected Loss = (FP × C_fp) + (FN × C_fn) + (Review × C_review)
                                   │
                                   ▼
                     [ Structured Output & Evidence ]
                                   │
                                   ▼
               [ Interactive SOC Investigation Console ]
```

---

## Core Detection Mechanisms

### 1. Relational Entity Graph
Built using NetworkX to map heterogeneous nodes and multi-hop edges:
* **Nodes**: `Customer`, `Device`, `IP/Network`, `PaymentInstrument`, `Merchant`
* **Edges**: `MADE`, `USED_DEVICE`, `USED_PAYMENT`, `FROM_NETWORK`
* Calculates entity degrees, multi-account device sharing, and connected components.

### 2. Temporal Burst & Velocity Extractors
* Measures transaction concentration within sliding 30-second and 120-second windows.
* Detects synchronized bot farms attempting rapid card authorization testing.

### 3. False-Positive Protection ("Shared Infrastructure ≠ Fraud")
A major challenge with graph-based detection is avoiding false alarms on legitimate shared networks.
* **Corporate Office Scenario**: 15 coworkers making lunch purchases through a single office gateway (`14.143.38.102`) using independent laptops $\rightarrow$ **APPROVED / NOT A RING**.
* **Fraud Ring Scenario**: 7 accounts sharing a single device (`D102`) executing 18 sub-minute transactions $\rightarrow$ **BLOCKED / RING DETECTED**.

### 4. Cost-Sensitive Business Loss Optimization
Rather than using arbitrary thresholds, operating threshold $\tau = 0.70$ is optimized on the validation split to minimize total financial business loss:

$$\text{Expected Loss} = (\text{FP} \times C_{\text{fp}}) + (\text{FN} \times C_{\text{fn}})$$

* Default baseline: $C_{\text{fp}} = \text{₹450}$ (customer friction / support cost) vs $C_{\text{fn}} = \text{₹4,500}$ (direct chargeback loss).
* Fully configurable in the settings console.

---

## Workspaces & Investigation Tools

| Workspace | Route | What It Does |
| :--- | :--- | :--- |
| **Overview** | `/overview` | Threat posture dashboard, active critical rings, timeline cluster chart, and live metrics. |
| **Abuse Rings** | `/rings` | Filterable ledger of detected syndicates with severity badges, exposure amounts, and affected entity counts. |
| **Investigation Console** | `/investigations/[ringId]` | Flagship console featuring an interactive canvas graph, "Why Detected" evidence cards, Ring DNA fingerprint, and chronological event replay. |
| **Graph Explorer** | `/graph` | Full-screen entity search and multi-hop relationship inspector. |
| **Transactions** | `/transactions` | Correlated transaction ledger with 1-click "View in Graph" context jump. |
| **Model Evaluation** | `/evaluation` | Empirical held-out test report with 2×2 confusion matrix, threshold loss curves, and baseline comparison. |
| **Configuration** | `/settings` | Server-backed loss parameter controls ($C_{\text{fp}}, C_{\text{fn}}$) and execution triggers. |

---

## Empirical Benchmark & Evaluation

Evaluated against a temporal **70% Train / 15% Validation / 15% Test** split (46 unseen test samples):

* **Precision**: **93.3%**
* **Recall**: **100.0%**
* **F1 Score**: **96.6%**
* **False Positive Rate (FPR)**: **3.1%**
* **PR-AUC**: **0.942** | **ROC-AUC**: **0.968**
* **Test Confusion Matrix**: $\text{TN} = 31, \text{FP} = 1, \text{FN} = 0, \text{TP} = 14$ (Total = 46 samples)

---

## Tech Stack

* **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Recharts, Lucide Icons
* **Backend & ML Service**: Python 3.12, FastAPI, NetworkX, NumPy, Scikit-Learn
* **Database & Persistence**: Prisma ORM, PostgreSQL

---

## Getting Started Locally

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/TechPrateek/paypilotai.git
cd paypilotai

# Install Node dependencies
npm install

# Install Python requirements
cd ml-service
pip install -r requirements.txt
cd ..
```

### 2. Start the Backend ML Service

```bash
cd ml-service
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Start the Next.js Frontend

In a second terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running the Automated Test Suite

Run the end-to-end Python pipeline tests (covering API contracts, corporate Wi-Fi false positive guard, fraud ring detection, and evaluation invariants):

```bash
python -m unittest discover ml-service/tests
```

Run TypeScript compilation check:

```bash
npx tsc --noEmit
```

---

## Project Notes & Disclaimer

* **Synthetic Dataset**: All transaction, customer, and ring data in this demonstration is generated from a synthetic benchmark dataset to evaluate multi-hop abuse patterns safely.
* **Defense-Only Tooling**: **PayPilot AI** is built exclusively as an AI payment risk management and defensive fraud forensics platform.
