# PayPilot AI — API Specification

## 1. Next.js App Router Endpoints

### `POST /api/risk/analyze`
Submits a live transaction for risk assessment, database storage, structured evidence generation, and alert dispatching.

**Request Body:**
```json
{
  "amount": 75000,
  "currency": "INR",
  "paymentMethod": "CREDIT_CARD",
  "country": "IN",
  "customerId": "cust_12345",
  "deviceId": "dev_98765",
  "isNewDevice": true,
  "transactionsInLast5Min": 1
}
```

**Response (200 OK):**
```json
{
  "riskProbability": 0.54,
  "riskScore": 54,
  "confidence": 0.88,
  "decision": "REVIEW",
  "modelVersion": "hybrid-v1",
  "dataAvailability": {
    "historyAvailable": true,
    "identityAvailable": true,
    "graphAvailable": true,
    "behavioralFeaturesAvailable": true
  },
  "evidence": [
    {
      "category": "BEHAVIOR",
      "description": "Transaction amount is 3.2x higher than customer 90-day baseline.",
      "severity": "MEDIUM",
      "source": "BEHAVIORAL_ENGINE"
    },
    {
      "category": "CONTEXT",
      "description": "New device observed. Contextual signal alone is insufficient to classify transaction as fraudulent.",
      "severity": "LOW",
      "source": "HEURISTIC"
    }
  ],
  "assessmentId": "ass_cuid123"
}
```

---

### `GET /api/transactions/:id/graph`
Returns the multi-hop heterogeneous ego-network for the interactive Graph Explorer.

**Response (200 OK):**
```json
{
  "transactionId": "tx_123",
  "nodes": [
    { "id": "tx_123", "label": "Tx: ₹75,000", "type": "Transaction", "isTarget": true },
    { "id": "cust_123", "label": "Customer: Raj Patel", "type": "Customer", "isTarget": false },
    { "id": "dev_123", "label": "Device: Desktop Chrome", "type": "Device", "isTarget": false }
  ],
  "edges": [
    { "id": "cust_123_tx_123", "source": "cust_123", "target": "tx_123", "relationship": "MADE" },
    { "id": "tx_123_dev_123", "source": "tx_123", "target": "dev_123", "relationship": "USED_DEVICE" }
  ],
  "graphDensity": 0.25,
  "sharedEntityCount": 0
}
```

---

### `POST /api/simulator/analyze`
Evaluates simulated input parameters in-memory against the Python ML service and returns model breakdowns without saving to the database.

---

## 2. Python FastAPI ML Service Endpoints (`:8000`)

* `GET /health`: Health probe returning loaded models and service status.
* `POST /api/predict`: Core hybrid risk and confidence evaluation.
* `GET /api/graph/{transaction_id}`: Extracts ego-network subgraphs from NetworkX / PyG.
* `POST /api/explain`: Synthesizes natural language explanations strictly grounded in structured evidence.
* `GET /api/evaluation/ablation`: Returns empirical benchmark metrics and cost curves.
* `GET /api/evaluation/cold-start`: Returns cold-start vs established customer evaluation.
