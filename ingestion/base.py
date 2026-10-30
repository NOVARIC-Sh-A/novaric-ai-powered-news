"""
NOVARIC® Ingestion Worker Base Interface
Common abstraction for all public Albanian data sources.
"""

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
import abc

@dataclass
class IngestionResult:
    source: str
    started_at: datetime
    finished_at: datetime
    records_new: int = 0
    records_updated: int = 0
    status: str = "ok"  # "ok" | "failed" | "partial"
    error: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class IngestionContext:
    db_session: Any = None
    force_refresh: bool = False
    dry_run: bool = False
    config: Dict[str, Any] = field(default_factory=dict)

class BaseWorker(abc.ABC):
    source_name: str = "base"

    @abc.abstractmethod
    async def run(self, ctx: IngestionContext) -> IngestionResult:
        """Run the ingestion job and return standardized IngestionResult."""
        pass
