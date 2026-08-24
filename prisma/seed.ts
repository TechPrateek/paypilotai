import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const INDIAN_FIRST_NAMES = [
  'Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Advik', 'Kavya', 'Ishaan', 'Aryan',
  'Reyansh', 'Saanvi', 'Myra', 'Atharv', 'Ayush', 'Rohan', 'Sneha', 'Rahul', 'Neha',
  'Amit', 'Pooja', 'Vikram', 'Anjali', 'Karan', 'Kriti', 'Siddharth', 'Aditi', 'Raj',
  'Riya', 'Sameer', 'Priya', 'Arjun', 'Simran', 'Akash', 'Shruti', 'Nikhil', 'Tanvi'
];

const INDIAN_LAST_NAMES = [
  'Patel', 'Sharma', 'Singh', 'Kumar', 'Das', 'Gupta', 'Jain', 'Verma', 'Yadav',
  'Shah', 'Mehta', 'Bose', 'Mukherjee', 'Chakraborty', 'Nair', 'Menon', 'Rao', 'Reddy',
  'Desai', 'Joshi', 'Mishra', 'Pandey', 'Tiwari', 'Bhatia', 'Malhotra', 'Kaur', 'Iyer',
  'Ahuja', 'Chauhan', 'Agarwal', 'Chatterjee', 'Dubey', 'Garg', 'Kapoor', 'Mathur'
];

const BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge'];
const OS = ['Windows', 'macOS', 'Android', 'iOS'];
const DEVICE_TYPES = ['Desktop', 'Mobile', 'Tablet'];
const PAYMENT_METHODS = ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET'];
const CARD_BRANDS = ['VISA', 'MASTERCARD', 'RUPAY', 'AMEX'];

function getRandomItem<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateRandomIP() {
  return `${Math.floor(Math.random() * 220) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function generateRandomFingerprint() {
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function makeId(prefix = 'cuid') {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

async function main() {
  console.log('Starting high-speed batch seed...');

  // 1. Clean up existing data
  await prisma.riskEvidence.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.riskRule.deleteMany();
  await prisma.caseNote.deleteMany();
  await prisma.riskCase.deleteMany();
  await prisma.riskFactor.deleteMany();
  await prisma.riskAssessment.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.customerDevice.deleteMany();
  await prisma.paymentInstrument.deleteMany();
  await prisma.network.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.user.deleteMany();
  await prisma.device.deleteMany();
  await prisma.iPAddress.deleteMany();
  await prisma.modelVersion.deleteMany();

  const passwordHash = await bcrypt.hash('demo123', 10);

  // 2. Create Users
  const merchantUser = await prisma.user.create({
    data: { id: makeId('usr'), email: 'merchant@paypilot.ai', name: 'Raj Patel', passwordHash, role: 'MERCHANT' },
  });
  const analystUser = await prisma.user.create({
    data: { id: makeId('usr'), email: 'analyst@paypilot.ai', name: 'Priya Sharma', passwordHash, role: 'ANALYST' },
  });
  const adminUser = await prisma.user.create({
    data: { id: makeId('usr'), email: 'admin@paypilot.ai', name: 'Vikram Singh', passwordHash, role: 'ADMIN' },
  });
  const viewerUser = await prisma.user.create({
    data: { id: makeId('usr'), email: 'viewer@paypilot.ai', name: 'Aditi Rao', passwordHash, role: 'VIEWER' },
  });

  // 3. Create Merchant
  const merchant = await prisma.merchant.create({
    data: {
      id: makeId('mer'),
      name: 'TechMart India',
      businessType: 'E-Commerce',
      apiKey: 'sk_test_' + generateRandomFingerprint(),
      userId: merchantUser.id,
      webhookUrl: 'https://techmart.example.com/webhooks/paypilot',
    },
  });

  // 4. Create Model Versions
  await prisma.modelVersion.createMany({
    data: [
      {
        id: makeId('mdl'),
        name: 'PayPilot Hybrid Model (LightGBM + Behavioral + Hetero-GNN)',
        version: 'hybrid-v1',
        description: 'Multi-modal ensemble combining transaction LightGBM, historical behavioral baseline, and PyG Heterogeneous GNN embeddings.',
        status: 'ACTIVE',
        accuracy: 0.962,
        precision: 0.914,
        recall: 0.938,
        f1Score: 0.926,
        prAuc: 0.941,
        rocAuc: 0.982,
        falsePositiveRate: 0.018,
        detectionRate: 0.938,
        trainedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        activatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: makeId('mdl'),
        name: 'PayPilot Heterogeneous GNN (PyTorch Geometric)',
        version: 'gnn-v1',
        description: 'Heterogeneous Graph Neural Network with relation-aware message passing over 7 entity node types.',
        status: 'TESTING',
        accuracy: 0.941,
        precision: 0.887,
        recall: 0.902,
        f1Score: 0.894,
        prAuc: 0.912,
        rocAuc: 0.964,
        falsePositiveRate: 0.027,
        detectionRate: 0.902,
        trainedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: makeId('mdl'),
        name: 'PayPilot Behavioral ML (LightGBM + Behavioral)',
        version: 'behavioral-v1',
        description: 'LightGBM model enhanced with strict temporal behavioral deviation, windowed velocities, and cold-start fallback.',
        status: 'TESTING',
        accuracy: 0.935,
        precision: 0.871,
        recall: 0.884,
        f1Score: 0.877,
        prAuc: 0.889,
        rocAuc: 0.951,
        falsePositiveRate: 0.032,
        detectionRate: 0.884,
        trainedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: makeId('mdl'),
        name: 'PayPilot Baseline (LightGBM Tabular)',
        version: 'lightgbm-v1',
        description: 'Baseline LightGBM trained solely on tabular transaction and device metadata without relational graph context.',
        status: 'ARCHIVED',
        accuracy: 0.912,
        precision: 0.824,
        recall: 0.841,
        f1Score: 0.832,
        prAuc: 0.845,
        rocAuc: 0.923,
        falsePositiveRate: 0.048,
        detectionRate: 0.841,
        trainedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // 5. Batch Devices
  const devices = [];
  for (let i = 0; i < 30; i++) {
    devices.push({
      id: makeId('dev'),
      fingerprint: generateRandomFingerprint(),
      browser: getRandomItem(BROWSERS),
      os: getRandomItem(OS),
      deviceType: getRandomItem(DEVICE_TYPES),
      firstSeen: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      lastSeen: new Date(),
    });
  }
  await prisma.device.createMany({ data: devices });

  // 6. Batch Networks
  const networks = [];
  for (let i = 0; i < 25; i++) {
    const isSuspicious = i > 20;
    const isVpn = i > 17 && i <= 20;
    const isTor = i === 24;
    const type = isTor ? 'TOR' : isVpn ? 'VPN' : isSuspicious ? 'DATACENTER' : getRandomItem(['RESIDENTIAL', 'CELLULAR']);
    networks.push({
      id: makeId('net'),
      networkHash: 'net_' + generateRandomFingerprint().slice(0, 16),
      ipAddress: generateRandomIP(),
      type,
      country: isSuspicious ? 'NG' : getRandomItem(['IN', 'IN', 'IN', 'US', 'GB', 'SG']),
      city: isSuspicious ? 'Lagos' : getRandomItem(['Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Pune']),
      isProxy: isSuspicious || isVpn,
      isVpn,
      isTor,
      isSuspicious,
      firstSeenAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      lastSeenAt: new Date(),
    });
  }
  await prisma.network.createMany({ data: networks });

  // 7. Batch Payment Instruments
  const paymentInstruments = [];
  for (let i = 0; i < 40; i++) {
    const isUpi = i % 2 === 0;
    const isCard = !isUpi;
    paymentInstruments.push({
      id: makeId('pmt'),
      tokenizedReference: isUpi
        ? `vpa_tok_${generateRandomFingerprint().slice(0, 12)}`
        : `card_tok_${generateRandomFingerprint().slice(0, 12)}`,
      type: isUpi ? 'UPI_VPA' : 'CARD_TOKEN',
      cardBrand: isCard ? getRandomItem(CARD_BRANDS) : null,
      cardBin: isCard ? `${Math.floor(100000 + Math.random() * 900000)}` : null,
      last4: isCard ? `${Math.floor(1000 + Math.random() * 9000)}` : null,
      firstSeenAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    });
  }
  await prisma.paymentInstrument.createMany({ data: paymentInstruments });

  // 8. Batch Customers
  const customers = [];
  const customerDevices = [];
  for (let i = 0; i < 100; i++) {
    const isColdStart = i >= 80;
    const firstName = getRandomItem(INDIAN_FIRST_NAMES);
    const lastName = getRandomItem(INDIAN_LAST_NAMES);
    const accountCreatedAt = isColdStart
      ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
      : new Date(Date.now() - (30 + Math.random() * 700) * 24 * 60 * 60 * 1000);
    const custId = makeId('cust');

    customers.push({
      id: custId,
      externalId: `cust_${firstName.toLowerCase()}_${i + 101}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      name: `${firstName} ${lastName}`,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      country: 'IN',
      accountCreatedAt,
      merchantId: merchant.id,
    });

    customerDevices.push({
      id: makeId('cdev'),
      customerId: custId,
      deviceId: devices[i % devices.length].id,
      firstSeen: accountCreatedAt,
      lastSeen: new Date(),
      transactionCount: isColdStart ? 1 : Math.floor(2 + Math.random() * 15),
    });
  }
  await prisma.customer.createMany({ data: customers });
  await prisma.customerDevice.createMany({ data: customerDevices });

  // 9. Batch 520 Transactions, Assessments, Factors, Evidence, Cases, Notes, Alerts
  const transactions = [];
  const assessments = [];
  const factors = [];
  const evidences = [];
  const cases = [];
  const notes = [];
  const alerts = [];

  for (let i = 0; i < 520; i++) {
    const customer = customers[i % customers.length];
    const isColdStart = new Date(customer.accountCreatedAt).getTime() > (Date.now() - 3 * 24 * 60 * 60 * 1000);
    const device = devices[i % devices.length];
    const network = networks[i % networks.length];
    const paymentInstrument = paymentInstruments[i % paymentInstruments.length];

    let amount = Math.floor(getRandomNumber(250, 8500));
    if (i % 25 === 0) amount = Math.floor(getRandomNumber(45000, 185000));

    const isSimulatedFraud = i < 25;
    const isMediumReview = i >= 25 && i < 75;

    let riskScore: number;
    let riskProbability: number;
    let confidence: number;
    let decision: string;
    let riskLevel: string;

    if (isSimulatedFraud) {
      riskScore = Math.floor(getRandomNumber(82, 98));
      riskProbability = Number((riskScore / 100).toFixed(2));
      confidence = Number(getRandomNumber(0.85, 0.97).toFixed(2));
      decision = 'BLOCK';
      riskLevel = 'CRITICAL';
    } else if (isMediumReview) {
      riskScore = Math.floor(getRandomNumber(60, 78));
      riskProbability = Number((riskScore / 100).toFixed(2));
      confidence = isColdStart ? Number(getRandomNumber(0.42, 0.58).toFixed(2)) : Number(getRandomNumber(0.72, 0.88).toFixed(2));
      decision = 'REVIEW';
      riskLevel = 'HIGH';
    } else {
      riskScore = Math.floor(getRandomNumber(4, 28));
      riskProbability = Number((riskScore / 100).toFixed(2));
      confidence = isColdStart ? 0.65 : Number(getRandomNumber(0.88, 0.98).toFixed(2));
      decision = 'APPROVE';
      riskLevel = 'LOW';
    }

    const txDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    const status = isSimulatedFraud ? (Math.random() > 0.5 ? 'FAILED' : 'DISPUTED') : (Math.random() > 0.05 ? 'COMPLETED' : 'FAILED');
    const txId = makeId('tx');
    const assessmentId = makeId('ass');

    transactions.push({
      id: txId,
      externalId: `tx_${Date.now().toString(36)}_${i + 1}`,
      amount,
      currency: 'INR',
      paymentMethod: getRandomItem(PAYMENT_METHODS),
      country: network.country || 'IN',
      city: network.city || 'Mumbai',
      ip: network.ipAddress || generateRandomIP(),
      deviceId: device.id,
      networkId: network.id,
      paymentInstrumentId: paymentInstrument.id,
      status,
      riskProbability,
      riskScore,
      confidence,
      decision,
      modelVersion: 'hybrid-v1',
      customerId: customer.id,
      merchantId: merchant.id,
      createdAt: txDate,
      updatedAt: txDate,
    });

    const dataAvailability = JSON.stringify({
      historyAvailable: !isColdStart,
      identityAvailable: true,
      graphAvailable: true,
      behavioralFeaturesAvailable: !isColdStart,
    });

    const aiExplanation = decision === 'BLOCK'
      ? `Critical risk detected (Score ${riskScore}/100, Confidence ${(confidence * 100).toFixed(0)}%). Multi-entity graph correlation and velocity attack patterns strongly corroborate fraud. Recommendation: BLOCK.`
      : decision === 'REVIEW'
      ? `Review recommended (Score ${riskScore}/100, Confidence ${(confidence * 100).toFixed(0)}%). ${isColdStart ? 'First-time customer observed with elevated transaction value. Behavioral confidence is low; manual review is advised.' : 'Transaction amount exceeds standard baseline profile.'}`
      : `Transaction approved (Score ${riskScore}/100, Confidence ${(confidence * 100).toFixed(0)}%). No elevated risk patterns detected across transaction ML, graph entities, or network context.`;

    assessments.push({
      id: assessmentId,
      transactionId: txId,
      riskScore,
      riskProbability,
      confidence,
      riskLevel,
      decision,
      anomalyScore: isSimulatedFraud ? Number(getRandomNumber(75, 96).toFixed(1)) : Number(getRandomNumber(5, 30).toFixed(1)),
      modelVersion: 'hybrid-v1',
      dataAvailability,
      aiExplanation,
      processingTimeMs: Math.floor(getRandomNumber(8, 24)),
      createdAt: txDate,
    });

    if (isSimulatedFraud) {
      factors.push({
        id: makeId('fac'),
        assessmentId,
        name: 'Graph Entity Correlation',
        category: 'GRAPH',
        severity: 'CRITICAL',
        scoreContribution: 35,
        explanation: 'Device fingerprint is linked to confirmed fraud cluster.',
        evidence: `Device ${device.fingerprint.slice(0, 8)}... connected to 5 disputed nodes`,
        createdAt: txDate,
      });
      evidences.push({
        id: makeId('evd'),
        assessmentId,
        category: 'GRAPH',
        description: 'Transaction device and network are shared with 4+ previously disputed accounts across the entity graph.',
        severity: 'HIGH',
        source: 'GNN',
        evidenceData: JSON.stringify({ graphRisk: 0.92 }),
        createdAt: txDate,
      });
    } else if (isMediumReview) {
      factors.push({
        id: makeId('fac'),
        assessmentId,
        name: isColdStart ? 'Cold Start Verification' : 'Baseline Amount Deviation',
        category: 'TRANSACTION',
        severity: 'HIGH',
        scoreContribution: 25,
        explanation: isColdStart ? 'First-time customer requires initial identity verification.' : 'Amount deviates significantly from historical mean.',
        evidence: `Amount: ₹${amount.toLocaleString()}`,
        createdAt: txDate,
      });
      evidences.push({
        id: makeId('evd'),
        assessmentId,
        category: isColdStart ? 'DATA_AVAILABILITY' : 'BEHAVIOR',
        description: isColdStart
          ? 'First-time customer with zero historical merchant transactions. Behavioral confidence is LOW.'
          : 'Transaction amount is 3.4x higher than customer 90-day average baseline.',
        severity: 'MEDIUM',
        source: 'BEHAVIORAL_ENGINE',
        evidenceData: JSON.stringify({ historyAvailable: !isColdStart }),
        createdAt: txDate,
      });
    }

    if (decision === 'BLOCK' || decision === 'REVIEW') {
      const caseId = makeId('cas');
      const caseStatus = isSimulatedFraud
        ? getRandomItem(['CONFIRMED_FRAUD', 'RESOLVED', 'IN_REVIEW', 'OPEN'])
        : getRandomItem(['OPEN', 'IN_REVIEW', 'FALSE_POSITIVE', 'RESOLVED']);

      cases.push({
        id: caseId,
        transactionId: txId,
        customerId: customer.id,
        status: caseStatus,
        priority: isSimulatedFraud ? 'CRITICAL' : 'HIGH',
        assignedAnalystId: analystUser.id,
        resolution: caseStatus === 'CONFIRMED_FRAUD'
          ? 'Confirmed fraudulent attack matching known card testing syndicate.'
          : caseStatus === 'FALSE_POSITIVE'
          ? 'Customer identity confirmed via 2FA OTP verification.'
          : null,
        createdAt: txDate,
        updatedAt: new Date(txDate.getTime() + 1000 * 60 * 30),
      });

      notes.push({
        id: makeId('not'),
        caseId,
        authorId: analystUser.id,
        content: isSimulatedFraud
          ? 'Investigated entity graph. Found 4 linked transaction attempts with proxy IP.'
          : 'Cold start transaction flagged for manual review. Initiated verification flow.',
        createdAt: new Date(txDate.getTime() + 1000 * 60 * 15),
      });
    }

    if (decision === 'BLOCK') {
      alerts.push({
        id: makeId('alt'),
        type: 'CRITICAL_TRANSACTION',
        severity: 'CRITICAL',
        title: `High Risk Attack Flagged - Score ${riskScore}`,
        message: `Transaction flagged by Hybrid Risk Engine (Confidence: ${(confidence * 100).toFixed(0)}%).`,
        transactionId: txId,
        read: Math.random() > 0.5,
        resolved: Math.random() > 0.5,
        merchantId: merchant.id,
        createdAt: txDate,
      });
    }
  }

  // Execute batch inserts
  console.log(`Inserting ${transactions.length} transactions, ${assessments.length} assessments...`);
  await prisma.transaction.createMany({ data: transactions });
  await prisma.riskAssessment.createMany({ data: assessments });
  if (factors.length > 0) await prisma.riskFactor.createMany({ data: factors });
  if (evidences.length > 0) await prisma.riskEvidence.createMany({ data: evidences });
  if (cases.length > 0) await prisma.riskCase.createMany({ data: cases });
  if (notes.length > 0) await prisma.caseNote.createMany({ data: notes });
  if (alerts.length > 0) await prisma.alert.createMany({ data: alerts });

  // 10. Default Risk Rules
  await prisma.riskRule.createMany({
    data: [
      {
        id: makeId('rul'),
        name: 'Extreme Multiplier Anomaly',
        description: 'Triggers review when transaction amount exceeds 5x customer historical 90-day baseline with established history.',
        category: 'AMOUNT',
        condition: JSON.stringify({ multiplier: 5.0, minHistoryCount: 5 }),
        score: 30,
        severity: 'HIGH',
        enabled: true,
        isGlobal: true,
      },
      {
        id: makeId('rul'),
        name: 'Micro-Window Velocity Attack',
        description: 'Detects card testing and rapid burst transactions exceeding 5 attempts within 5 minutes.',
        category: 'VELOCITY',
        condition: JSON.stringify({ maxAttempts: 5, windowMinutes: 5 }),
        score: 25,
        severity: 'CRITICAL',
        enabled: true,
        isGlobal: true,
      },
      {
        id: makeId('rul'),
        name: 'High-Risk Network & Tor Exit Node',
        description: 'Flags transactions originating from anonymizing proxy networks and Tor relays.',
        category: 'NETWORK',
        condition: JSON.stringify({ blockTor: true, blockDatacenterProxy: true }),
        score: 30,
        severity: 'CRITICAL',
        enabled: true,
        isGlobal: true,
      },
      {
        id: makeId('rul'),
        name: 'Contextual Payment Retry Analyzer',
        description: 'Evaluates rapid instrument switching and amount step-downs after payment failures.',
        category: 'RETRY',
        condition: JSON.stringify({ maxCardSwitches: 3, windowMinutes: 15 }),
        score: 20,
        severity: 'HIGH',
        enabled: true,
        isGlobal: true,
      },
    ],
  });

  // 11. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        id: makeId('aud'),
        userId: adminUser.id,
        action: 'DEPLOY_MODEL_VERSION',
        entity: 'MODEL_VERSION',
        entityId: 'hybrid-v1',
        newValue: JSON.stringify({ status: 'ACTIVE', version: 'hybrid-v1' }),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: makeId('aud'),
        userId: analystUser.id,
        action: 'RESOLVE_RISK_CASE',
        entity: 'RISK_CASE',
        newValue: JSON.stringify({ status: 'CONFIRMED_FRAUD' }),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('✅ High-speed database batch seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
