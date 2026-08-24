from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

class DataAvailability(BaseModel):
    historyAvailable: bool = Field(..., description="Whether merchant has historical transactions for this customer")
    identityAvailable: bool = Field(True, description="Whether device and network identity is available")
    graphAvailable: bool = Field(True, description="Whether entity graph relationships are available")
    behavioralFeaturesAvailable: bool = Field(..., description="Whether behavioral baseline comparison is valid")

class StructuredEvidenceItem(BaseModel):
    category: Literal["TRANSACTION", "BEHAVIOR", "GRAPH", "CONTEXT", "DATA_AVAILABILITY"]
    description: str
    severity: Literal["LOW", "MEDIUM", "HIGH"]
    source: Optional[str] = "HYBRID_ENGINE"
    evidenceData: Optional[Dict[str, Any]] = None

class TransactionPredictionRequest(BaseModel):
    transactionId: Optional[str] = None
    amount: float
    currency: str = "INR"
    paymentMethod: str = "UPI"
    country: str = "IN"
    city: Optional[str] = None
    ip: Optional[str] = None
    deviceId: Optional[str] = None
    deviceFingerprint: Optional[str] = None
    networkId: Optional[str] = None
    paymentInstrumentId: Optional[str] = None
    customerId: Optional[str] = "guest"
    customerEmail: Optional[str] = None
    accountAgeDays: Optional[int] = 30
    isNewDevice: Optional[bool] = False
    isNewIp: Optional[bool] = False
    previousFailedAttempts: Optional[int] = 0
    timeBetweenAttemptsSeconds: Optional[float] = 0.0
    transactionsInLast5Min: Optional[int] = 0
    transactionsInLast1Hour: Optional[int] = 0
    paymentInstrumentSwitchCount: Optional[int] = 0
    isProxyIp: Optional[bool] = False
    isVpnIp: Optional[bool] = False
    isTorIp: Optional[bool] = False
    isSuspiciousIp: Optional[bool] = False
    isDisposableEmail: Optional[bool] = False
    customerAverageAmount: Optional[float] = None
    customerTotalTransactions: Optional[int] = 0
    customerDeviceCount: Optional[int] = 1
    previousDisputes: Optional[int] = 0

class PredictionResponse(BaseModel):
    riskProbability: float = Field(..., description="Calibrated probability of fraud (0.0 - 1.0)")
    riskScore: int = Field(..., description="Risk score from 0 to 100")
    confidence: float = Field(..., description="Information and context confidence (0.0 - 1.0)")
    decision: Literal["APPROVE", "REVIEW", "BLOCK"]
    modelVersion: str = "hybrid-v1"
    anomalyScore: float = 0.0
    dataAvailability: DataAvailability
    evidence: List[StructuredEvidenceItem]
    modelBreakdown: Dict[str, float]
    processingTimeMs: int

class GraphNode(BaseModel):
    id: str
    label: str
    type: Literal["Transaction", "Customer", "Device", "Network", "PaymentInstrument", "Merchant", "Email", "Address"]
    properties: Dict[str, Any] = {}
    isTarget: bool = False
    riskScore: Optional[int] = None

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    relationship: Literal["MADE", "USED_DEVICE", "USED_PAYMENT", "FROM_NETWORK", "ASSOCIATED_WITH", "USES_EMAIL", "BELONGS_TO", "SHARED_ENTITY"]
    properties: Dict[str, Any] = {}

class GraphResponse(BaseModel):
    transactionId: str
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    graphDensity: float
    sharedEntityCount: int

class ExplanationRequest(BaseModel):
    riskProbability: float
    riskScore: int
    confidence: float
    decision: str
    evidence: List[StructuredEvidenceItem]
    dataAvailability: DataAvailability
    transactionInfo: Dict[str, Any]

class ExplanationResponse(BaseModel):
    explanation: str
    keyFindings: List[str]
    analystRecommendation: str

class ModelBenchmarkItem(BaseModel):
    name: str
    version: str
    description: str
    accuracy: float
    precision: float
    recall: float
    f1Score: float
    prAuc: float
    rocAuc: float
    falsePositiveRate: float
    detectionRate: float
    status: str

class AblationMetricsResponse(BaseModel):
    models: List[ModelBenchmarkItem]
    costCurve: List[Dict[str, Any]]
    datasetInfo: Dict[str, str]

class ColdStartEvaluationResponse(BaseModel):
    establishedCustomers: Dict[str, float]
    coldStartCustomers: Dict[str, float]
    conclusion: str
