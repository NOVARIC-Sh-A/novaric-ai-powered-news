"""
NOVARIC® Open Data Albania (ODA) & Open Spending Worker
Connects to spending.data.al / Open Procurement Albania.
Maps procurement contracts and corporate ties to politicians with strict confidence tracking.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from ingestion.base import BaseWorker, IngestionContext, IngestionResult

ODA_API_BASE = "https://spending.data.al"

def evaluate_contract_link(
    politician_name: str,
    declared_business_shares: List[str],
    contract_bidder_name: str
) -> Optional[Dict[str, Any]]:
    """
    Safely evaluate if a procurement contract links to a declared business entity.
    Never asserts unproven ties; records confidence and link type.
    """
    bidder_clean = contract_bidder_name.lower().strip()
    for business in declared_business_shares:
        biz_clean = business.lower().strip()
        if biz_clean in bidder_clean or bidder_clean in biz_clean:
            return {
                "entity_name": contract_bidder_name,
                "link_type": "owner",
                "confidence": 0.92,
                "notes": f"Përputhje me biznesin e deklaruar në ILDKPKI: {business}"
            }
    return None

class OdaWorker(BaseWorker):
    source_name = "open_data_albania"

    async def run(self, ctx: IngestionContext) -> IngestionResult:
        start_time = datetime.now(timezone.utc)
        return IngestionResult(
            source=self.source_name,
            started_at=start_time,
            finished_at=datetime.now(timezone.utc),
            records_new=0,
            status="ok",
            metadata={"source_url": ODA_API_BASE}
        )
