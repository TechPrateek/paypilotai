import networkx as nx
from typing import Dict, Any, List, Tuple

class HeterogeneousGraphBuilder:
    """
    Constructs and maintains the heterogeneous payment entity graph with:
    - Nodes: Customer, Transaction, Device, Network, PaymentInstrument, Merchant, Email, Address
    - Edges: MADE, USED_DEVICE, USED_PAYMENT, FROM_NETWORK, ASSOCIATED_WITH, USES_EMAIL, BELONGS_TO
    """
    def __init__(self):
        self.graph = nx.Graph()
        
    def add_transaction_subgraph(self, tx_data: Dict[str, Any]) -> str:
        tx_id = str(tx_data.get("transactionId") or tx_data.get("id") or "tx_target")
        cust_id = str(tx_data.get("customerId") or "cust_unknown")
        dev_id = str(tx_data.get("deviceId") or tx_data.get("deviceFingerprint") or "dev_unknown")
        net_id = str(tx_data.get("networkId") or tx_data.get("ip") or "net_unknown")
        pmt_id = str(tx_data.get("paymentInstrumentId") or "pmt_unknown")
        merchant_id = str(tx_data.get("merchantId") or "mer_techmart")
        email = str(tx_data.get("customerEmail") or f"{cust_id}@example.com")
        
        risk_score = int(tx_data.get("riskScore", 15))
        amount = float(tx_data.get("amount", 1000.0))

        # Add Nodes
        self.graph.add_node(tx_id, node_type="Transaction", label=f"Tx: ₹{amount:,.0f}", amount=amount, risk_score=risk_score)
        self.graph.add_node(cust_id, node_type="Customer", label=f"Cust: {cust_id[:12]}")
        self.graph.add_node(dev_id, node_type="Device", label=f"Dev: {dev_id[:10]}")
        self.graph.add_node(net_id, node_type="Network", label=f"Net: {net_id[:12]}")
        self.graph.add_node(pmt_id, node_type="PaymentInstrument", label=f"Pmt: {pmt_id[:12]}")
        self.graph.add_node(merchant_id, node_type="Merchant", label="Merchant: TechMart")
        self.graph.add_node(email, node_type="Email", label=f"Email: {email[:15]}")

        # Add Typed Relational Edges
        self.graph.add_edge(cust_id, tx_id, relationship="MADE")
        self.graph.add_edge(tx_id, dev_id, relationship="USED_DEVICE")
        self.graph.add_edge(tx_id, pmt_id, relationship="USED_PAYMENT")
        self.graph.add_edge(tx_id, net_id, relationship="FROM_NETWORK")
        self.graph.add_edge(tx_id, merchant_id, relationship="BELONGS_TO")
        self.graph.add_edge(cust_id, email, relationship="USES_EMAIL")
        
        return tx_id

    def extract_ego_network(self, transaction_id: str, depth: int = 2) -> Dict[str, Any]:
        """
        Extracts multi-hop relational subgraph around a transaction for analyst inspection.
        """
        if transaction_id not in self.graph:
            # Create synthetic local graph around this transaction if standalone
            self.add_transaction_subgraph({"transactionId": transaction_id})

        # 2-hop neighborhood
        subgraph_nodes = set([transaction_id])
        current_layer = {transaction_id}
        for _ in range(depth):
            next_layer = set()
            for n in current_layer:
                if n in self.graph:
                    neighbors = set(self.graph.neighbors(n))
                    next_layer.update(neighbors)
            subgraph_nodes.update(next_layer)
            current_layer = next_layer

        subgraph = self.graph.subgraph(subgraph_nodes)
        
        nodes_out = []
        for n, data in subgraph.nodes(data=True):
            nodes_out.append({
                "id": str(n),
                "label": data.get("label", str(n)),
                "type": data.get("node_type", "Transaction"),
                "properties": {k: v for k, v in data.items() if k not in ["node_type", "label"]},
                "isTarget": (n == transaction_id),
                "riskScore": data.get("risk_score", None)
            })

        edges_out = []
        for u, v, data in subgraph.edges(data=True):
            edges_out.append({
                "id": f"{u}_{v}",
                "source": str(u),
                "target": str(v),
                "relationship": data.get("relationship", "ASSOCIATED_WITH"),
                "properties": {k: v for k, v in data.items() if k != "relationship"}
            })

        density = nx.density(subgraph) if len(subgraph) > 1 else 0.0
        shared_entities = sum(1 for n in subgraph.nodes() if subgraph.degree(n) > 2)

        return {
            "transactionId": transaction_id,
            "nodes": nodes_out,
            "edges": edges_out,
            "graphDensity": round(float(density), 3),
            "sharedEntityCount": shared_entities
        }
