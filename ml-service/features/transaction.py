import numpy as np
import math
from typing import Dict, Any

PAYMENT_METHOD_MAP = {
    "UPI": 0,
    "CREDIT_CARD": 1,
    "DEBIT_CARD": 2,
    "NET_BANKING": 3,
    "WALLET": 4
}

HIGH_RISK_COUNTRIES = {"NG", "GH", "PK", "BD", "VN", "PH", "RU"}

def extract_transaction_features(tx: Dict[str, Any]) -> np.ndarray:
    """
    Extract tabular features for the base LightGBM / Logistic Regression models.
    """
    amount = float(tx.get("amount", 1000.0))
    log_amount = math.log1p(amount)
    
    payment_method = tx.get("paymentMethod", "UPI")
    payment_code = PAYMENT_METHOD_MAP.get(payment_method, 0)
    
    country = tx.get("country", "IN")
    is_high_risk_country = 1.0 if country in HIGH_RISK_COUNTRIES else 0.0
    is_domestic = 1.0 if country == "IN" else 0.0
    
    is_new_device = 1.0 if tx.get("isNewDevice", False) else 0.0
    is_new_ip = 1.0 if tx.get("isNewIp", False) else 0.0
    
    is_proxy = 1.0 if tx.get("isProxyIp", False) else 0.0
    is_vpn = 1.0 if tx.get("isVpnIp", False) else 0.0
    is_tor = 1.0 if tx.get("isTorIp", False) else 0.0
    is_suspicious_ip = 1.0 if tx.get("isSuspiciousIp", False) else 0.0
    is_disposable_email = 1.0 if tx.get("isDisposableEmail", False) else 0.0
    
    prev_failed = float(tx.get("previousFailedAttempts", 0))
    time_between_retries = float(tx.get("timeBetweenAttemptsSeconds", 0.0))
    instrument_switches = float(tx.get("paymentInstrumentSwitchCount", 0))
    
    # Contextual retry feature: rapid retry with instrument switch
    rapid_retry_switch = 1.0 if (prev_failed >= 2 and time_between_retries < 15.0 and instrument_switches >= 2) else 0.0

    features = [
        log_amount,
        payment_code,
        is_high_risk_country,
        is_domestic,
        is_new_device,
        is_new_ip,
        is_proxy,
        is_vpn,
        is_tor,
        is_suspicious_ip,
        is_disposable_email,
        prev_failed,
        time_between_retries,
        instrument_switches,
        rapid_retry_switch
    ]
    
    return np.array(features, dtype=np.float32)
