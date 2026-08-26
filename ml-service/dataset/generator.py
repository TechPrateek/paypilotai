"""
Synthetic Dataset Generator for Abuse-Ring Sentinel
Deterministic, reproducible generation of payment graphs with ground truth labels.
Includes legitimate individual behavior, legitimate shared infrastructure (family/office),
and coordinated abuse rings.
"""

import json
import random
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple

RANDOM_SEED = 42

def generate_synthetic_dataset(output_dir: str = None) -> Dict[str, Any]:
    random.seed(RANDOM_SEED)
    
    start_time = datetime(2026, 8, 1, 0, 0, 0)
    
    customers = []
    devices = []
    ips = []
    payment_instruments = []
    merchants = []
    transactions = []
    rings_metadata = []
    
    # 1. Create Merchants
    merchant_data = [
        ("m-01", "TechMart India", "High-End Electronics"),
        ("m-02", "QuickPay Digital", "Digital Services"),
        ("m-03", "GlobalVoucher Exchange", "Cryptocurrency & Vouchers"),
        ("m-04", "Casino Royal", "Gaming & Entertainment"),
        ("m-05", "FreshCart Grocery", "Supermarket"),
    ]
    for m_id, name, cat in merchant_data:
        merchants.append({"id": m_id, "name": name, "category": cat})
        
    # Helper ID counters
    c_idx = 1
    d_idx = 1
    ip_idx = 1
    p_idx = 1
    tx_idx = 1
    
    # =========================================================================
    # Scenario 1: Legitimate Independent Customers (Normal Distribution)
    # =========================================================================
    for _ in range(80):
        cid = f"C{c_idx:04d}"
        did = f"D{d_idx:04d}"
        ipid = f"IP{ip_idx:04d}"
        pid = f"P{p_idx:04d}"
        c_idx += 1
        d_idx += 1
        ip_idx += 1
        p_idx += 1
        
        customers.append({"id": cid, "name": f"Customer {cid}", "email": f"{cid.lower()}@gmail.com"})
        devices.append({"id": did, "fingerprint": f"fp_{did.lower()}", "type": "MOBILE"})
        ips.append({"id": ipid, "ip": f"49.207.{random.randint(1, 250)}.{random.randint(1, 250)}", "type": "RESIDENTIAL", "is_tor": False, "is_vpn": False})
        payment_instruments.append({"id": pid, "token": f"tok_{pid.lower()}", "card_bin": "411122", "last4": f"{random.randint(1000, 9999)}"})
        
        # 1 to 3 normal transactions spread over August
        tx_count = random.randint(1, 3)
        for _ in range(tx_count):
            t_offset = random.randint(0, 25 * 86400) # across 25 days
            tx_time = start_time + timedelta(seconds=t_offset)
            transactions.append({
                "id": f"TX-{tx_idx:06d}",
                "amount": round(random.uniform(250, 4500), 2),
                "timestamp": tx_time.isoformat(),
                "timestamp_unix": int(tx_time.timestamp()),
                "customer_id": cid,
                "device_id": did,
                "ip_id": ipid,
                "payment_id": pid,
                "merchant_id": random.choice(merchants)["id"],
                "is_fraud": False,
                "cluster_id": "LEGITIMATE_NORMAL",
                "ground_truth": "LEGITIMATE"
            })
            tx_idx += 1

    # =========================================================================
    # Scenario 2: Legitimate Family (Shared Device / Home Wi-Fi)
    # 4 family members sharing 1 iPad & 1 Wi-Fi IP, but separate credit cards & normal timing
    # =========================================================================
    family_did = f"D{d_idx:04d}"
    d_idx += 1
    devices.append({"id": family_did, "fingerprint": "fp_family_ipad_pro", "type": "TABLET"})
    
    family_ipid = f"IP{ip_idx:04d}"
    ip_idx += 1
    ips.append({"id": family_ipid, "ip": "122.161.44.12", "type": "RESIDENTIAL", "is_tor": False, "is_vpn": False})
    
    family_members = []
    for member_name in ["Aarav Sharma", "Pooja Sharma", "Neha Sharma", "Rohan Sharma"]:
        cid = f"C{c_idx:04d}"
        pid = f"P{p_idx:04d}"
        c_idx += 1
        p_idx += 1
        customers.append({"id": cid, "name": member_name, "email": f"{cid.lower()}@sharmafamily.in"})
        payment_instruments.append({"id": pid, "token": f"tok_{pid.lower()}", "card_bin": "524188", "last4": f"{random.randint(1000, 9999)}"})
        family_members.append((cid, pid))
        
        # Each family member makes normal purchases hours/days apart
        for _ in range(2):
            t_offset = random.randint(10000, 2000000)
            tx_time = start_time + timedelta(seconds=t_offset)
            transactions.append({
                "id": f"TX-{tx_idx:06d}",
                "amount": round(random.uniform(500, 3200), 2),
                "timestamp": tx_time.isoformat(),
                "timestamp_unix": int(tx_time.timestamp()),
                "customer_id": cid,
                "device_id": family_did,
                "ip_id": family_ipid,
                "payment_id": pid,
                "merchant_id": "m-05", # FreshCart
                "is_fraud": False,
                "cluster_id": "LEGITIMATE_FAMILY",
                "ground_truth": "LEGITIMATE"
            })
            tx_idx += 1

    # =========================================================================
    # Scenario 3: Legitimate Office / Shared Corporate IP (False Positive Control)
    # 15 coworkers sharing 1 corporate gateway IP, completely independent laptops & cards
    # =========================================================================
    office_ipid = f"IP{ip_idx:04d}"
    ip_idx += 1
    ips.append({"id": office_ipid, "ip": "14.143.38.102", "type": "CORPORATE_OFFICE", "is_tor": False, "is_vpn": False})
    
    for i in range(15):
        cid = f"C{c_idx:04d}"
        did = f"D{d_idx:04d}"
        pid = f"P{p_idx:04d}"
        c_idx += 1
        d_idx += 1
        p_idx += 1
        customers.append({"id": cid, "name": f"Office Worker {i+1}", "email": f"worker{i+1}@techcorp.com"})
        devices.append({"id": did, "fingerprint": f"fp_corp_mac_{did.lower()}", "type": "DESKTOP"})
        payment_instruments.append({"id": pid, "token": f"tok_{pid.lower()}", "card_bin": "438628", "last4": f"{random.randint(1000, 9999)}"})
        
        # Spread normally across workdays
        for _ in range(2):
            t_offset = random.randint(200000, 2200000)
            tx_time = start_time + timedelta(seconds=t_offset)
            transactions.append({
                "id": f"TX-{tx_idx:06d}",
                "amount": round(random.uniform(150, 1200), 2),
                "timestamp": tx_time.isoformat(),
                "timestamp_unix": int(tx_time.timestamp()),
                "customer_id": cid,
                "device_id": did,
                "ip_id": office_ipid,
                "payment_id": pid,
                "merchant_id": "m-02",
                "is_fraud": False,
                "cluster_id": "LEGITIMATE_OFFICE",
                "ground_truth": "LEGITIMATE"
            })
            tx_idx += 1

    # =========================================================================
    # Scenario 4: FLAGSHIP RING-0042 (Coordinated Transaction Burst & Multi-Device Syndicate)
    # 17 Accounts, 4 Devices, 3 IPs, 11 Cards, 84 Transactions, ₹8.4L Exposure
    # =========================================================================
    ring42_start = start_time + timedelta(days=18, hours=10, minutes=1)
    ring42_dids = [f"D{d_idx+i:04d}" for i in range(4)]
    d_idx += 4
    devices.extend([
        {"id": ring42_dids[0], "fingerprint": "fp_farm_dev_alpha", "type": "DESKTOP"},
        {"id": ring42_dids[1], "fingerprint": "fp_farm_dev_beta", "type": "MOBILE"},
        {"id": ring42_dids[2], "fingerprint": "fp_farm_dev_gamma", "type": "DESKTOP"},
        {"id": ring42_dids[3], "fingerprint": "fp_farm_dev_delta", "type": "MOBILE"},
    ])
    
    ring42_ipids = [f"IP{ip_idx+i:04d}" for i in range(3)]
    ip_idx += 3
    ips.extend([
        {"id": ring42_ipids[0], "ip": "185.220.101.44", "type": "TOR_EXIT", "is_tor": True, "is_vpn": True},
        {"id": ring42_ipids[1], "ip": "185.220.101.45", "type": "TOR_EXIT", "is_tor": True, "is_vpn": True},
        {"id": ring42_ipids[2], "ip": "104.244.76.13", "type": "DATACENTER_PROXY", "is_tor": False, "is_vpn": True},
    ])
    
    ring42_pids = [f"P{p_idx+i:04d}" for i in range(11)]
    p_idx += 11
    payment_instruments.extend([
        {"id": pid, "token": f"tok_stolen_{pid.lower()}", "card_bin": "411122" if i % 2 == 0 else "552144", "last4": f"{8000+i}"}
        for i, pid in enumerate(ring42_pids)
    ])
    
    ring42_cids = []
    for i in range(17):
        cid = f"C{c_idx:04d}"
        c_idx += 1
        customers.append({"id": cid, "name": f"Syndicate User {i+1}", "email": f"syndicate{i+1}@burnermail.xyz"})
        ring42_cids.append(cid)

    # 84 coordinated burst transactions
    # 18 transactions occurring within 120 seconds!
    ring42_exposure = 0.0
    for i in range(84):
        # 18 transactions in a 120-sec high burst, remainder spread over 2 hours
        if i < 18:
            sec_offset = int((i * 6.5)) # within 120s
        else:
            sec_offset = 120 + int((i - 18) * 80)
            
        tx_time = ring42_start + timedelta(seconds=sec_offset)
        cid = ring42_cids[i % len(ring42_cids)]
        did = ring42_dids[i % len(ring42_dids)]
        ipid = ring42_ipids[i % len(ring42_ipids)]
        pid = ring42_pids[i % len(ring42_pids)]
        amt = 10000.0 if i < 18 else round(random.uniform(7500, 12500), 2)
        ring42_exposure += amt
        
        transactions.append({
            "id": f"TX-{tx_idx:06d}",
            "amount": amt,
            "timestamp": tx_time.isoformat(),
            "timestamp_unix": int(tx_time.timestamp()),
            "customer_id": cid,
            "device_id": did,
            "ip_id": ipid,
            "payment_id": pid,
            "merchant_id": "m-01", # TechMart
            "is_fraud": True,
            "cluster_id": "RING-0042",
            "ground_truth": "ABUSE_RING"
        })
        tx_idx += 1

    rings_metadata.append({
        "id": "RING-0042",
        "name": "Coordinated Transaction Burst Syndicate #0042",
        "pattern_type": "COORDINATED_TRANSACTION_BURST",
        "severity": "CRITICAL",
        "risk_score": 91,
        "evidence_strength": 87,
        "accounts_count": 17,
        "devices_count": 4,
        "ips_count": 3,
        "payment_instruments_count": 11,
        "transactions_count": 84,
        "exposure": round(ring42_exposure, 2),
        "status": "UNDER_REVIEW",
        "first_seen": ring42_start.isoformat(),
        "last_seen": (ring42_start + timedelta(seconds=sec_offset)).isoformat(),
        "signals": [
            {"type": "SHARED_DEVICE", "description": "7 accounts share Device D102", "score_contrib": 21},
            {"type": "TEMPORAL_COORDINATION", "description": "18 transactions occurred within 120 seconds", "score_contrib": 24},
            {"type": "VELOCITY", "description": "9 transactions/minute burst intensity", "score_contrib": 18},
            {"type": "PAYMENT_REUSE", "description": "4 payment instruments were reused across different customer IDs", "score_contrib": 15},
            {"type": "HISTORICAL_SUSPICION", "description": "3 connected entities had previous suspicious chargebacks", "score_contrib": 13},
        ],
        "dna": {
            "infrastructure_sharing": 85,
            "temporal_coordination": 98,
            "velocity": 92,
            "payment_reuse": 78,
            "account_creation_burst": 90,
            "historical_suspicion": 65
        }
    })

    # =========================================================================
    # Scenario 5: RING-7092 (Tor Proxy Botnet Gang)
    # 4 accounts, 1 device, 1 Tor IP, 4 cards, 14 tx, $145,000 exposure
    # =========================================================================
    ring7092_start = start_time + timedelta(days=20, hours=4, minutes=45)
    r7092_did = f"D{d_idx:04d}"
    d_idx += 1
    devices.append({"id": r7092_did, "fingerprint": "a1b2c3d4e5f6g7", "type": "DESKTOP"})
    
    r7092_ipid = f"IP{ip_idx:04d}"
    ip_idx += 1
    ips.append({"id": r7092_ipid, "ip": "185.220.101.5", "type": "TOR_EXIT", "is_tor": True, "is_vpn": True})
    
    r7092_cids = [f"C{c_idx+i:04d}" for i in range(4)]
    c_idx += 4
    customers.extend([
        {"id": r7092_cids[0], "name": "Michael Chen", "email": "mchen@tornet.org"},
        {"id": r7092_cids[1], "name": "Viktor Orlov", "email": "vorlov@tornet.org"},
        {"id": r7092_cids[2], "name": "Alex Rivera", "email": "arivera@tornet.org"},
        {"id": r7092_cids[3], "name": "David Kumar", "email": "dkumar@tornet.org"},
    ])
    
    r7092_pids = [f"P{p_idx+i:04d}" for i in range(4)]
    p_idx += 4
    payment_instruments.extend([
        {"id": r7092_pids[0], "token": "tok_stolen_4111", "card_bin": "411122", "last4": "4111"},
        {"id": r7092_pids[1], "token": "tok_stolen_5521", "card_bin": "552100", "last4": "5521"},
        {"id": r7092_pids[2], "token": "tok_stolen_8890", "card_bin": "607188", "last4": "8890"},
        {"id": r7092_pids[3], "token": "tok_stolen_1092", "card_bin": "491290", "last4": "1092"},
    ])
    
    r7092_exposure = 145000.0
    for i in range(14):
        tx_time = ring7092_start + timedelta(seconds=i * 20)
        transactions.append({
            "id": f"TX-{tx_idx:06d}",
            "amount": round(r7092_exposure / 14, 2),
            "timestamp": tx_time.isoformat(),
            "timestamp_unix": int(tx_time.timestamp()),
            "customer_id": r7092_cids[i % len(r7092_cids)],
            "device_id": r7092_did,
            "ip_id": r7092_ipid,
            "payment_id": r7092_pids[i % len(r7092_pids)],
            "merchant_id": "m-04", # Casino
            "is_fraud": True,
            "cluster_id": "RING-7092",
            "ground_truth": "ABUSE_RING"
        })
        tx_idx += 1

    rings_metadata.append({
        "id": "RING-7092",
        "name": "Tor Exit Botnet Syndicate #7092",
        "pattern_type": "SHARED_INFRASTRUCTURE_ABUSE",
        "severity": "CRITICAL",
        "risk_score": 94,
        "evidence_strength": 92,
        "accounts_count": 4,
        "devices_count": 1,
        "ips_count": 1,
        "payment_instruments_count": 4,
        "transactions_count": 14,
        "exposure": r7092_exposure,
        "status": "ISOLATED",
        "first_seen": ring7092_start.isoformat(),
        "last_seen": (ring7092_start + timedelta(seconds=14 * 20)).isoformat(),
        "signals": [
            {"type": "SHARED_DEVICE", "description": "4 customer accounts operating on single MacBook Pro (a1b2c3d4e5f6g7)", "score_contrib": 28},
            {"type": "ANONYMOUS_NETWORK", "description": "Masked IP network (185.220.101.5) identified as active Tor exit", "score_contrib": 26},
            {"type": "RAPID_CARD_SWITCH", "description": "4 stolen card BINs rotated following decline events", "score_contrib": 22},
            {"type": "VELOCITY", "description": "14 high-value transfer attempts in under 5 minutes", "score_contrib": 18},
        ],
        "dna": {
            "infrastructure_sharing": 95,
            "temporal_coordination": 88,
            "velocity": 90,
            "payment_reuse": 85,
            "account_creation_burst": 94,
            "historical_suspicion": 80
        }
    })

    # Sort all transactions chronologically for temporal split
    transactions.sort(key=lambda x: x["timestamp_unix"])
    
    total_tx = len(transactions)
    train_end = int(total_tx * 0.70)
    val_end = int(total_tx * 0.85)
    
    for idx, tx in enumerate(transactions):
        if idx < train_end:
            tx["split"] = "TRAIN"
        elif idx < val_end:
            tx["split"] = "VALIDATION"
        else:
            tx["split"] = "HELD_OUT_TEST"

    dataset = {
        "metadata": {
            "dataset_name": "Synthetic Abuse Dataset v1",
            "version": "1.0.0",
            "random_seed": RANDOM_SEED,
            "generated_at": datetime.utcnow().isoformat(),
            "total_transactions": total_tx,
            "total_customers": len(customers),
            "total_devices": len(devices),
            "total_ips": len(ips),
            "total_payment_instruments": len(payment_instruments),
            "total_merchants": len(merchants),
            "total_rings": len(rings_metadata),
            "splits": {
                "train_count": train_end,
                "validation_count": val_end - train_end,
                "held_out_test_count": total_tx - val_end,
                "split_ratio": "70 / 15 / 15 (Temporal Split)"
            }
        },
        "merchants": merchants,
        "customers": customers,
        "devices": devices,
        "ips": ips,
        "payment_instruments": payment_instruments,
        "transactions": transactions,
        "rings": rings_metadata
    }

    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        out_path = os.path.join(output_dir, "synthetic_abuse_dataset.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(dataset, f, indent=2)
        print(f"Generated {total_tx} synthetic transactions -> {out_path}")
        
    return dataset

if __name__ == "__main__":
    generate_synthetic_dataset("ml-service/dataset")
