import json
from pathlib import Path
from typing import Dict, Any, List, Tuple

import networkx as nx


class HeterogeneousGraphBuilder:
    """
    Historical heterogeneous payment graph.

    Production graph scoring uses relational connectivity rather than
    a neural GNN. Historical transactions from the synthetic abuse
    dataset are loaded so shared infrastructure can be detected from
    actual graph relationships.
    """

    def __init__(self, load_dataset: bool = True):
        self.graph = nx.Graph()

        if load_dataset:
            self._load_historical_dataset()

    def _load_historical_dataset(self) -> None:
        """
        Load historical transactions into the graph.

        Dataset schema:
          id
          customer_id
          device_id
          ip_id
          payment_id
          merchant_id
        """

        dataset_path = (
            Path(__file__).resolve().parents[1]
            / "dataset"
            / "synthetic_abuse_dataset.json"
        )

        if not dataset_path.exists():
            return

        try:
            with dataset_path.open("r", encoding="utf-8") as f:
                dataset = json.load(f)

            transactions = dataset.get("transactions", [])

            for tx in transactions:
                self._add_dataset_transaction(tx)

        except (OSError, json.JSONDecodeError):
            # Keep inference available even if historical data
            # cannot be loaded.
            return

    def _add_dataset_transaction(self, tx: Dict[str, Any]) -> None:
        """
        Convert dataset field names into graph entities.
        """

        tx_id = str(tx.get("id") or "tx_unknown")
        customer_id = str(tx.get("customer_id") or "cust_unknown")
        device_id = str(tx.get("device_id") or "dev_unknown")
        ip_id = str(tx.get("ip_id") or "ip_unknown")
        payment_id = str(tx.get("payment_id") or "payment_unknown")
        merchant_id = str(tx.get("merchant_id") or "merchant_unknown")

        self.graph.add_node(
            tx_id,
            node_type="Transaction",
            amount=float(tx.get("amount", 0) or 0),
            ground_truth=tx.get("ground_truth"),
            is_fraud=bool(tx.get("is_fraud", False)),
        )

        self.graph.add_node(
            customer_id,
            node_type="Customer",
        )

        self.graph.add_node(
            device_id,
            node_type="Device",
        )

        self.graph.add_node(
            ip_id,
            node_type="Network",
        )

        self.graph.add_node(
            payment_id,
            node_type="PaymentInstrument",
        )

        self.graph.add_node(
            merchant_id,
            node_type="Merchant",
        )

        self.graph.add_edge(
            customer_id,
            tx_id,
            relationship="MADE",
        )

        self.graph.add_edge(
            tx_id,
            device_id,
            relationship="USED_DEVICE",
        )

        self.graph.add_edge(
            tx_id,
            ip_id,
            relationship="FROM_NETWORK",
        )

        self.graph.add_edge(
            tx_id,
            payment_id,
            relationship="USED_PAYMENT",
        )

        self.graph.add_edge(
            tx_id,
            merchant_id,
            relationship="BELONGS_TO",
        )

    def add_transaction_subgraph(
        self,
        tx_data: Dict[str, Any],
    ) -> str:

        tx_id = str(
            tx_data.get("transactionId")
            or tx_data.get("id")
            or "tx_target"
        )

        customer_id = str(
            tx_data.get("customerId")
            or "cust_unknown"
        )

        device_id = str(
            tx_data.get("deviceId")
            or tx_data.get("deviceFingerprint")
            or "dev_unknown"
        )

        network_id = str(
            tx_data.get("networkId")
            or tx_data.get("ip")
            or "net_unknown"
        )

        payment_id = str(
            tx_data.get("paymentInstrumentId")
            or "payment_unknown"
        )

        merchant_id = str(
            tx_data.get("merchantId")
            or "mer_unknown"
        )

        email = str(
            tx_data.get("customerEmail")
            or f"{customer_id}@example.com"
        )

        amount = float(tx_data.get("amount", 0) or 0)
        risk_score = int(tx_data.get("riskScore", 0) or 0)

        self.graph.add_node(
            tx_id,
            node_type="Transaction",
            amount=amount,
            risk_score=risk_score,
        )

        self.graph.add_node(
            customer_id,
            node_type="Customer",
        )

        self.graph.add_node(
            device_id,
            node_type="Device",
        )

        self.graph.add_node(
            network_id,
            node_type="Network",
        )

        self.graph.add_node(
            payment_id,
            node_type="PaymentInstrument",
        )

        self.graph.add_node(
            merchant_id,
            node_type="Merchant",
        )

        self.graph.add_node(
            email,
            node_type="Email",
        )

        self.graph.add_edge(
            customer_id,
            tx_id,
            relationship="MADE",
        )

        self.graph.add_edge(
            tx_id,
            device_id,
            relationship="USED_DEVICE",
        )

        self.graph.add_edge(
            tx_id,
            payment_id,
            relationship="USED_PAYMENT",
        )

        self.graph.add_edge(
            tx_id,
            network_id,
            relationship="FROM_NETWORK",
        )

        self.graph.add_edge(
            tx_id,
            merchant_id,
            relationship="BELONGS_TO",
        )

        self.graph.add_edge(
            customer_id,
            email,
            relationship="USES_EMAIL",
        )

        return tx_id

    def _shared_customer_count(
        self,
        entity_id: str,
        entity_type: str,
        current_customer_id: str,
    ) -> int:
        """
        Count distinct historical customers connected to an entity.
        """

        if entity_id not in self.graph:
            return 0

        customers = set()

        for neighbor in self.graph.neighbors(entity_id):

            if self.graph.nodes[neighbor].get("node_type") != "Transaction":
                continue

            for customer in self.graph.neighbors(neighbor):

                if (
                    self.graph.nodes[customer].get("node_type")
                    == "Customer"
                    and customer != current_customer_id
                ):
                    customers.add(customer)

        return len(customers)

    def get_shared_entity_evidence(
        self,
        tx_dict: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Calculate historical shared infrastructure evidence.
        """

        customer_id = str(
            tx_dict.get("customerId")
            or "cust_unknown"
        )

        device_id = str(
            tx_dict.get("deviceId")
            or tx_dict.get("deviceFingerprint")
            or ""
        )

        network_id = str(
            tx_dict.get("networkId")
            or tx_dict.get("ip")
            or ""
        )

        payment_id = str(
            tx_dict.get("paymentInstrumentId")
            or ""
        )

        shared_device_customers = self._shared_customer_count(
            device_id,
            "Device",
            customer_id,
        )

        shared_network_customers = self._shared_customer_count(
            network_id,
            "Network",
            customer_id,
        )

        shared_payment_customers = self._shared_customer_count(
            payment_id,
            "PaymentInstrument",
            customer_id,
        )

        shared_entities = sum(
            count > 0
            for count in [
                shared_device_customers,
                shared_network_customers,
                shared_payment_customers,
            ]
        )

        return {
            "sharedEntities": shared_entities,
            "sharedDeviceCustomers": shared_device_customers,
            "sharedNetworkCustomers": shared_network_customers,
            "sharedPaymentCustomers": shared_payment_customers,
        }

    def compute_ring_risk(
        self,
        transaction_id: str,
        tx_dict: Dict[str, Any] = None,
    ) -> float:

        tx_dict = tx_dict or {}

        evidence = self.get_shared_entity_evidence(tx_dict)

        shared_device_customers = evidence["sharedDeviceCustomers"]
        shared_network_customers = evidence["sharedNetworkCustomers"]
        shared_payment_customers = evidence["sharedPaymentCustomers"]

        is_tor = bool(tx_dict.get("isTorIp"))
        is_proxy = bool(
            tx_dict.get("isProxyIp")
            or tx_dict.get("isVpnIp")
            or tx_dict.get("isSuspiciousIp")
        )

        switches = int(
            tx_dict.get("paymentInstrumentSwitchCount", 0)
            or 0
        )

        velocity = int(
            tx_dict.get("transactionsInLast5Min", 0)
            or 0
        )

        # Small baseline.
        ring_risk = 0.05

        # Actual historical shared infrastructure.
        if shared_device_customers >= 6:
            ring_risk += 0.35
        elif shared_device_customers >= 3:
            ring_risk += 0.25
        elif shared_device_customers >= 1:
            ring_risk += 0.12

        if shared_network_customers >= 4:
            ring_risk += 0.25
        elif shared_network_customers >= 2:
            ring_risk += 0.15
        elif shared_network_customers >= 1:
            ring_risk += 0.08

        if shared_payment_customers >= 3:
            ring_risk += 0.20
        elif shared_payment_customers >= 1:
            ring_risk += 0.10

        # Contextual signals.
        if is_tor:
            ring_risk += 0.30
        elif is_proxy:
            ring_risk += 0.15

        if switches >= 3:
            ring_risk += 0.20
        elif switches >= 1:
            ring_risk += 0.10

        if velocity >= 10:
            ring_risk += 0.20
        elif velocity >= 5:
            ring_risk += 0.10

        return float(
            min(
                max(ring_risk, 0.0),
                0.98,
            )
        )

    def extract_ego_network(
        self,
        transaction_id: str,
        depth: int = 2,
    ) -> Dict[str, Any]:

        if transaction_id not in self.graph:
            return {
                "nodes": [],
                "edges": [],
                "sharedEntityCount": 0,
            }

        subgraph = nx.ego_graph(
            self.graph,
            transaction_id,
            radius=depth,
        )

        nodes = []

        for node_id, data in subgraph.nodes(data=True):
            nodes.append(
                {
                    "id": node_id,
                    "nodeType": data.get(
                        "node_type",
                        "Unknown",
                    ),
                }
            )

        edges = []

        for source, target, data in subgraph.edges(data=True):
            edges.append(
                {
                    "source": source,
                    "target": target,
                    "relationship": data.get(
                        "relationship",
                        "ASSOCIATED_WITH",
                    ),
                }
            )

        shared_entities = sum(
            1
            for node in subgraph.nodes()
            if subgraph.degree(node) > 2
        )

        return {
            "nodes": nodes,
            "edges": edges,
            "sharedEntityCount": shared_entities,
        }