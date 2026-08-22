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
const COUNTRIES = ['IN', 'IN', 'IN', 'IN', 'IN', 'IN', 'US', 'GB', 'SG', 'AE', 'NG'];
const PAYMENT_METHODS = ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET'];

function getRandomItem<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateRandomIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function generateRandomFingerprint() {
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

async function main() {
  console.log('Starting seed...');

  // Clean up existing data
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
  await prisma.customer.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.user.deleteMany();
  await prisma.device.deleteMany();
  await prisma.iPAddress.deleteMany();
  await prisma.modelVersion.deleteMany();

  const passwordHash = await bcrypt.hash('demo123', 10);

  // 1. Create Users
  console.log('Creating users...');
  const merchantUser = await prisma.user.create({
    data: {
      email: 'merchant@paypilot.ai',
      name: 'Raj Patel',
      passwordHash,
      role: 'MERCHANT',
    },
  });

  const analystUser = await prisma.user.create({
    data: {
      email: 'analyst@paypilot.ai',
      name: 'Priya Sharma',
      passwordHash,
      role: 'ANALYST',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@paypilot.ai',
      name: 'Vikram Singh',
      passwordHash,
      role: 'ADMIN',
    },
  });

  // 2. Create Merchants
  console.log('Creating merchants...');
  const merchant = await prisma.merchant.create({
    data: {
      name: 'TechMart India',
      businessType: 'E-Commerce',
      apiKey: 'sk_test_' + generateRandomFingerprint(),
      userId: merchantUser.id,
      webhookUrl: 'https://techmart.example.com/api/webhooks/payment',
    },
  });

  // 3. Create Customers (Batch)
  console.log('Creating customers...');
  const customerData = [];
  for (let i = 0; i < 60; i++) {
    const firstName = getRandomItem(INDIAN_FIRST_NAMES);
    const lastName = getRandomItem(INDIAN_LAST_NAMES);
    const country = getRandomItem(COUNTRIES);
    const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);

    customerData.push({
      externalId: `cust_${i + 1}_${generateRandomFingerprint().slice(0, 6)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@example.com`,
      name: `${firstName} ${lastName}`,
      phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      country: country,
      accountCreatedAt: createdAt,
      merchantId: merchant.id,
      createdAt: createdAt,
    });
  }
  await prisma.customer.createMany({ data: customerData });
  const customers = await prisma.customer.findMany({ where: { merchantId: merchant.id } });

  // 4. Create Devices (Batch)
  console.log('Creating devices...');
  const deviceData = [];
  for (let i = 0; i < 20; i++) {
    deviceData.push({
      fingerprint: generateRandomFingerprint(),
      browser: getRandomItem(BROWSERS),
      os: getRandomItem(OS),
      deviceType: getRandomItem(DEVICE_TYPES),
      firstSeen: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
      lastSeen: new Date(),
    });
  }
  await prisma.device.createMany({ data: deviceData });
  const devices = await prisma.device.findMany();

  // 5. Create CustomerDevice links
  console.log('Linking devices to customers...');
  const custDeviceData = customers.map((cust) => ({
    customerId: cust.id,
    deviceId: getRandomItem(devices).id,
    firstSeen: cust.createdAt,
    lastSeen: new Date(),
    transactionCount: Math.floor(Math.random() * 10) + 1,
  }));
  await prisma.customerDevice.createMany({ data: custDeviceData, skipDuplicates: true });

  // 6. Create Risk Rules
  console.log('Creating risk rules...');
  const rules = [
    { name: 'Maximum Transaction Amount', description: 'Triggers on transactions over ₹100,000', category: 'AMOUNT', condition: JSON.stringify({ threshold: 100000 }), score: 20, severity: 'HIGH', isGlobal: true, enabled: true },
    { name: 'High Transaction Velocity', description: 'More than 5 transactions in 5 minutes', category: 'VELOCITY', condition: JSON.stringify({ count: 5, windowMinutes: 5 }), score: 20, severity: 'HIGH', isGlobal: true, enabled: true },
    { name: 'New Device Detection', description: 'Transaction initiated from a previously unseen device', category: 'DEVICE', condition: JSON.stringify({ isNewDevice: true }), score: 15, severity: 'MEDIUM', isGlobal: true, enabled: true },
    { name: 'New Account Risk', description: 'Account age less than 7 days with high-value transactions', category: 'ACCOUNT', condition: JSON.stringify({ maxAgeDays: 7 }), score: 15, severity: 'MEDIUM', isGlobal: true, enabled: true },
    { name: 'Country Risk Assessment', description: 'Transaction originating from designated high-risk geography', category: 'LOCATION', condition: JSON.stringify({ highRiskCountries: ['NG', 'RU', 'KP', 'GH', 'PK'] }), score: 15, severity: 'HIGH', isGlobal: true, enabled: true },
    { name: 'IP Risk Check', description: 'Identified proxy, VPN, Tor exit node or blacklisted IP', category: 'IP', condition: JSON.stringify({ blockProxy: true, blockVpn: true }), score: 30, severity: 'CRITICAL', isGlobal: true, enabled: true },
    { name: 'Suspicious Payment Method', description: 'Unverified wallet or prepaid card with high balance', category: 'PAYMENT', condition: JSON.stringify({ methods: ['WALLET'] }), score: 10, severity: 'MEDIUM', isGlobal: true, enabled: true },
    { name: 'Failed Payment Velocity', description: '3 or more failed payment attempts prior to transaction', category: 'BEHAVIOR', condition: JSON.stringify({ failedAttemptsThreshold: 3 }), score: 20, severity: 'HIGH', isGlobal: true, enabled: true },
    { name: 'Disposable Email Service', description: 'Customer registered with disposable/temporary email provider', category: 'ACCOUNT', condition: JSON.stringify({ checkDisposable: true }), score: 10, severity: 'MEDIUM', isGlobal: true, enabled: true },
    { name: 'Statistical Anomaly Detection', description: 'Amount deviates more than 3 standard deviations from baseline', category: 'ANOMALY', condition: JSON.stringify({ zScoreThreshold: 3.0 }), score: 25, severity: 'HIGH', isGlobal: true, enabled: true },
  ];

  await prisma.riskRule.createMany({
    data: rules.map((r) => ({ ...r, merchantId: merchant.id })),
  });

  // 7. Create Model Versions
  console.log('Creating model versions...');
  await prisma.modelVersion.createMany({
    data: [
      {
        name: 'PayPilot Hybrid Risk Model',
        version: 'v1.0',
        description: 'Production rule engine with statistical Z-score baseline',
        status: 'ACTIVE',
        accuracy: 0.942,
        precision: 0.895,
        recall: 0.921,
        f1Score: 0.908,
        falsePositiveRate: 0.024,
        detectionRate: 0.931,
        trainedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        activatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'PayPilot Rule Engine Legacy',
        version: 'v0.9',
        description: 'Legacy heuristic scoring model without anomaly baselines',
        status: 'ARCHIVED',
        accuracy: 0.912,
        precision: 0.854,
        recall: 0.887,
        f1Score: 0.870,
        falsePositiveRate: 0.041,
        detectionRate: 0.892,
        trainedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        activatedAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // 8. Create Transactions + Evaluations in parallel batches
  console.log('Creating sample transactions and risk assessments...');
  const txCount = 120;
  const chunkLength = 15;

  for (let c = 0; c < txCount; c += chunkLength) {
    const promises = [];
    for (let i = c; i < Math.min(c + chunkLength, txCount); i++) {
      const cust = getRandomItem(customers);
      const dev = getRandomItem(devices);
      const method = getRandomItem(PAYMENT_METHODS);
      const currency = Math.random() > 0.15 ? 'INR' : (Math.random() > 0.5 ? 'USD' : 'EUR');
      
      const isHighFraud = i < 20;
      const isMediumRisk = !isHighFraud && i < 45;

      let amount: number;
      let country: string;
      let riskScore: number;
      let riskLevel: string;
      let decision: string;
      let status: string;

      const txDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);

      if (isHighFraud) {
        amount = currency === 'INR' ? Math.floor(getRandomNumber(75000, 220000)) : Math.floor(getRandomNumber(1200, 3500));
        country = Math.random() > 0.4 ? getRandomItem(['NG', 'RU', 'US', 'GH']) : 'IN';
        riskScore = Math.floor(getRandomNumber(78, 96));
        riskLevel = riskScore >= 80 ? 'CRITICAL' : 'HIGH';
        decision = riskScore >= 80 ? 'BLOCK' : 'REVIEW';
        status = decision === 'BLOCK' ? 'FAILED' : (Math.random() > 0.5 ? 'COMPLETED' : 'PENDING');
      } else if (isMediumRisk) {
        amount = currency === 'INR' ? Math.floor(getRandomNumber(15000, 65000)) : Math.floor(getRandomNumber(200, 900));
        country = Math.random() > 0.8 ? 'US' : 'IN';
        riskScore = Math.floor(getRandomNumber(32, 65));
        riskLevel = riskScore >= 60 ? 'HIGH' : 'MEDIUM';
        decision = riskScore >= 60 ? 'REVIEW' : 'APPROVE_WITH_MONITORING';
        status = 'COMPLETED';
      } else {
        amount = currency === 'INR' ? Math.floor(getRandomNumber(500, 18000)) : Math.floor(getRandomNumber(10, 250));
        country = 'IN';
        riskScore = Math.floor(getRandomNumber(4, 28));
        riskLevel = 'LOW';
        decision = 'APPROVE';
        status = 'COMPLETED';
      }

      const p = (async () => {
        const tx = await prisma.transaction.create({
          data: {
            externalId: `tx_${generateRandomFingerprint().slice(0, 12)}`,
            amount,
            currency,
            paymentMethod: method,
            country,
            city: country === 'IN' ? getRandomItem(['Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Pune']) : 'New York',
            ip: generateRandomIP(),
            deviceId: dev.id,
            status,
            customerId: cust.id,
            merchantId: merchant.id,
            createdAt: txDate,
            updatedAt: txDate,
          },
        });

        const aiExplanation = isHighFraud
          ? `High risk score (${riskScore}/100) triggered by unusual volume, velocity, and geography (${country}). Recommended: ${decision}.`
          : isMediumRisk
          ? `Moderate risk score (${riskScore}/100) triggered by new device fingerprint.`
          : `Standard behavioral profile. Risk score: ${riskScore}/100. Automatically approved.`;

        const assessment = await prisma.riskAssessment.create({
          data: {
            transactionId: tx.id,
            riskScore,
            riskLevel,
            decision,
            anomalyScore: isHighFraud ? 91.5 : (isMediumRisk ? 54.2 : 12.0),
            aiExplanation,
            processingTimeMs: Math.floor(getRandomNumber(8, 35)),
            createdAt: txDate,
          },
        });

        if (riskScore >= 30) {
          await prisma.riskFactor.create({
            data: {
              assessmentId: assessment.id,
              name: amount > 50000 ? 'Unusual Transaction Amount' : 'New Device Fingerprint',
              category: amount > 50000 ? 'AMOUNT' : 'DEVICE',
              severity: riskScore >= 80 ? 'CRITICAL' : 'HIGH',
              scoreContribution: 25,
              explanation: `Risk factor evaluated for transaction ${tx.externalId}.`,
              createdAt: txDate,
            },
          });
        }

        if (isHighFraud && i < 15) {
          const rCase = await prisma.riskCase.create({
            data: {
              transactionId: tx.id,
              customerId: cust.id,
              status: 'OPEN',
              priority: riskScore >= 85 ? 'CRITICAL' : 'HIGH',
              assignedAnalystId: analystUser.id,
              createdAt: txDate,
              updatedAt: txDate,
            },
          });

          await prisma.caseNote.create({
            data: {
              caseId: rCase.id,
              authorId: analystUser.id,
              content: `Flagged with score ${riskScore}/100 (${riskLevel}).`,
              createdAt: new Date(txDate.getTime() + 10 * 60 * 1000),
            },
          });
        }

        if (isHighFraud && i < 15) {
          await prisma.alert.create({
            data: {
              type: 'CRITICAL_TRANSACTION',
              severity: riskScore >= 85 ? 'CRITICAL' : 'WARNING',
              title: `Risk Alert: ${currency} ${amount.toLocaleString()}`,
              message: `Transaction ${tx.externalId} flagged with score ${riskScore}/100.`,
              transactionId: tx.id,
              merchantId: merchant.id,
              read: false,
              resolved: false,
              createdAt: txDate,
            },
          });
        }
      })();

      promises.push(p);
    }
    await Promise.all(promises);
  }

  // 9. Create Audit Logs (Batch)
  console.log('Creating audit logs...');
  const auditData = [];
  const auditActions = ['LOGIN', 'UPDATE_RISK_RULE', 'RESOLVE_CASE', 'OVERRIDE_DECISION', 'SIMULATION_TEST'];
  for (let i = 0; i < 25; i++) {
    const act = getRandomItem(auditActions);
    const u = getRandomItem([analystUser, adminUser, merchantUser]);
    auditData.push({
      userId: u.id,
      action: act,
      resource: 'System',
      ipAddress: generateRandomIP(),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    });
  }
  await prisma.auditLog.createMany({ data: auditData });

  // 10. Create Notifications (Batch)
  console.log('Creating notifications...');
  await prisma.notification.createMany({
    data: [
      { userId: merchantUser.id, type: 'CRITICAL_FRAUD', title: '🚨 Critical Fraud Spike Detected', message: 'High-risk transactions detected from same IP.', read: false },
      { userId: merchantUser.id, type: 'CASE_ASSIGNED', title: '📋 New Investigation Case Assigned', message: 'Case #RC-8491 assigned to analyst queue.', read: false },
      { userId: merchantUser.id, type: 'RULE_CHANGE', title: '⚙️ Global Risk Rule Updated', message: 'Country Risk Assessment enabled for new corridors.', read: false },
    ],
  });

  console.log('✅ Seeding completed successfully!');
  console.log('Credentials:');
  console.log('  Merchant: merchant@paypilot.ai / demo123');
  console.log('  Analyst:  analyst@paypilot.ai / demo123');
  console.log('  Admin:    admin@paypilot.ai / demo123');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
