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

  const merchants = [merchant];

  // 3. Create Customers
  console.log('Creating customers...');
  const customers = [];
  for (let i = 0; i < 100; i++) {
    const firstName = getRandomItem(INDIAN_FIRST_NAMES);
    const lastName = getRandomItem(INDIAN_LAST_NAMES);
    const country = getRandomItem(COUNTRIES);
    const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);

    const customer = await prisma.customer.create({
      data: {
        externalId: `cust_${i + 1}_${generateRandomFingerprint().slice(0, 6)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@example.com`,
        name: `${firstName} ${lastName}`,
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        country: country,
        accountCreatedAt: createdAt,
        merchantId: merchant.id,
        createdAt: createdAt,
      },
    });
    customers.push(customer);
  }

  // 4. Create Devices
  console.log('Creating devices...');
  const devices = [];
  for (let i = 0; i < 25; i++) {
    const dev = await prisma.device.create({
      data: {
        fingerprint: generateRandomFingerprint(),
        browser: getRandomItem(BROWSERS),
        os: getRandomItem(OS),
        deviceType: getRandomItem(DEVICE_TYPES),
        firstSeen: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
        lastSeen: new Date(),
      },
    });
    devices.push(dev);
  }

  // 5. Create CustomerDevice links
  console.log('Linking devices to customers...');
  for (const cust of customers) {
    const dev = getRandomItem(devices);
    await prisma.customerDevice.create({
      data: {
        customerId: cust.id,
        deviceId: dev.id,
        firstSeen: cust.createdAt,
        lastSeen: new Date(),
        transactionCount: Math.floor(Math.random() * 10) + 1,
      },
    });
  }

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

  for (const r of rules) {
    await prisma.riskRule.create({
      data: {
        ...r,
        merchantId: merchant.id,
      },
    });
  }

  // 7. Create Model Versions
  console.log('Creating model versions...');
  await prisma.modelVersion.create({
    data: {
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
  });

  await prisma.modelVersion.create({
    data: {
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
  });

  // 8. Create Transactions + Risk Assessments + Factors + Cases + Alerts
  console.log('Creating 500+ transactions with risk evaluations...');
  const txBatch = [];

  for (let i = 0; i < 520; i++) {
    const cust = getRandomItem(customers);
    const dev = getRandomItem(devices);
    const method = getRandomItem(PAYMENT_METHODS);
    const currency = Math.random() > 0.15 ? 'INR' : (Math.random() > 0.5 ? 'USD' : 'EUR');
    
    // Determine risk profile
    const isHighFraud = i < 35; // 35 critical/high risk cases
    const isMediumRisk = !isHighFraud && i < 110; // medium risk

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

    // Risk Assessment
    const aiExplanation = isHighFraud
      ? `This transaction has an elevated risk score of ${riskScore}/100. Key triggers include an unusually high amount (${currency} ${amount.toLocaleString()}), rapid velocity, and location mismatch originating from ${country}. Recommendation is ${decision}.`
      : isMediumRisk
      ? `Transaction flagged with moderate risk (${riskScore}/100) due to new device fingerprint and slight deviation from customer baseline spending.`
      : `Transaction verified within expected behavioral profile with low risk score (${riskScore}/100). Approved automatically.`;

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

    // Risk Factors for Medium / High / Critical
    if (riskScore >= 30) {
      if (amount > 50000) {
        await prisma.riskFactor.create({
          data: {
            assessmentId: assessment.id,
            name: 'Unusual Transaction Amount',
            category: 'AMOUNT',
            severity: amount > 100000 ? 'CRITICAL' : 'HIGH',
            scoreContribution: amount > 100000 ? 30 : 20,
            explanation: `Amount of ${currency} ${amount.toLocaleString()} is significantly higher than customer historical average.`,
            evidence: `Customer avg is ${currency} 4,500. Current is ${Math.round(amount / 4500)}x higher.`,
            createdAt: txDate,
          },
        });
      }

      if (isHighFraud) {
        await prisma.riskFactor.create({
          data: {
            assessmentId: assessment.id,
            name: 'High Transaction Velocity',
            category: 'VELOCITY',
            severity: 'CRITICAL',
            scoreContribution: 25,
            explanation: 'Detected multiple rapid payment attempts within a 5-minute interval.',
            evidence: '8 transaction attempts detected in last 5 minutes.',
            createdAt: txDate,
          },
        });

        if (country !== 'IN') {
          await prisma.riskFactor.create({
            data: {
              assessmentId: assessment.id,
              name: 'Geographic Location Anomaly',
              category: 'LOCATION',
              severity: 'HIGH',
              scoreContribution: 20,
              explanation: `Payment originated from ${country}, while customer primarily transacts in India.`,
              evidence: `Prior 12 transactions from India (IN). Current from ${country}.`,
              createdAt: txDate,
            },
          });
        }

        await prisma.riskFactor.create({
          data: {
            assessmentId: assessment.id,
            name: 'New Device Fingerprint',
            category: 'DEVICE',
            severity: 'MEDIUM',
            scoreContribution: 15,
            explanation: 'Device fingerprint has never been previously associated with this customer account.',
            evidence: `Device ${dev.fingerprint.slice(0, 8)} first seen at ${txDate.toISOString().slice(0, 10)}.`,
            createdAt: txDate,
          },
        });
      }
    }

    // Risk Case for high-risk / review transactions
    if (isHighFraud && i < 20) {
      const caseStatuses = ['OPEN', 'INVESTIGATING', 'CONFIRMED_FRAUD', 'RESOLVED', 'FALSE_POSITIVE'];
      const cStatus = getRandomItem(caseStatuses);

      const rCase = await prisma.riskCase.create({
        data: {
          transactionId: tx.id,
          customerId: cust.id,
          status: cStatus,
          priority: riskScore >= 85 ? 'CRITICAL' : 'HIGH',
          assignedAnalystId: analystUser.id,
          resolution: cStatus === 'RESOLVED' ? 'Customer confirmed authorization via phone verification.' : (cStatus === 'CONFIRMED_FRAUD' ? 'Account takeover confirmed. Payment blocked.' : null),
          createdAt: txDate,
          updatedAt: txDate,
        },
      });

      // Add Case Notes
      await prisma.caseNote.create({
        data: {
          caseId: rCase.id,
          authorId: analystUser.id,
          content: `Automated case creation: Transaction ${tx.externalId} flagged with score ${riskScore}/100 (${riskLevel}).`,
          createdAt: new Date(txDate.getTime() + 10 * 60 * 1000),
        },
      });

      if (cStatus !== 'OPEN') {
        await prisma.caseNote.create({
          data: {
            caseId: rCase.id,
            authorId: analystUser.id,
            content: `Analyst review in progress: Checked device footprint (${dev.os}/${dev.browser}) and IP reputation. Status updated to ${cStatus}.`,
            createdAt: new Date(txDate.getTime() + 45 * 60 * 1000),
          },
        });
      }
    }

    // Alerts for critical transactions
    if (isHighFraud && i < 25) {
      await prisma.alert.create({
        data: {
          type: 'CRITICAL_TRANSACTION',
          severity: riskScore >= 85 ? 'CRITICAL' : 'WARNING',
          title: `Critical Risk Detected: ${currency} ${amount.toLocaleString()} (${cust.name})`,
          message: `Transaction ${tx.externalId} exceeded risk threshold with score ${riskScore}/100. Action recommended: ${decision}.`,
          transactionId: tx.id,
          merchantId: merchant.id,
          read: Math.random() > 0.4,
          resolved: Math.random() > 0.7,
          createdAt: txDate,
        },
      });
    }
  }

  // 9. Create Audit Logs
  console.log('Creating audit logs...');
  const auditActions = [
    { action: 'LOGIN', resource: 'User', details: 'User authenticated from dashboard' },
    { action: 'UPDATE_RISK_RULE', resource: 'RiskRule', details: 'Updated Maximum Transaction Amount threshold' },
    { action: 'RESOLVE_CASE', resource: 'RiskCase', details: 'Analyst resolved fraud case after verification' },
    { action: 'OVERRIDE_DECISION', resource: 'Transaction', details: 'Manual override: APPROVE for low risk dispute' },
    { action: 'SIMULATION_TEST', resource: 'Simulator', details: 'Simulated Card Testing scenario' },
    { action: 'UPDATE_THRESHOLD', resource: 'Settings', details: 'Adjusted Critical risk threshold to 80' },
  ];

  for (let i = 0; i < 45; i++) {
    const item = getRandomItem(auditActions);
    const u = getRandomItem([analystUser, adminUser, merchantUser]);
    await prisma.auditLog.create({
      data: {
        userId: u.id,
        action: item.action,
        resource: item.resource,
        previousValue: JSON.stringify({ status: 'PENDING' }),
        newValue: JSON.stringify({ status: 'RESOLVED' }),
        ipAddress: generateRandomIP(),
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PayPilot/1.0',
        createdAt: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // 10. Create Notifications
  console.log('Creating notifications...');
  const notifs = [
    { type: 'CRITICAL_FRAUD', title: '🚨 Critical Fraud Spike Detected', message: '5 high-risk transactions detected from same IP in last hour.' },
    { type: 'CASE_ASSIGNED', title: '📋 New Investigation Case Assigned', message: 'Case #RC-8491 assigned to analyst queue.' },
    { type: 'HIGH_RISK_CUSTOMER', title: '⚠️ High Risk Velocity Alert', message: 'Customer Aarav Patel reached 8 transactions in 5 min.' },
    { type: 'RULE_CHANGE', title: '⚙️ Global Risk Rule Updated', message: 'Country Risk Assessment enabled for new corridors.' },
  ];

  for (const n of notifs) {
    await prisma.notification.create({
      data: {
        userId: merchantUser.id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: false,
        createdAt: new Date(),
      },
    });
  }

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
