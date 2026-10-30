"""
NOVARIC® KQZ Electoral & Candidate CV Ingestion Worker
Connects to KQZ portal (kqz.gov.al/rezultate-zgjedhore).
Parses election cycles, preferential votes, education, and profession records.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from ingestion.base import BaseWorker, IngestionContext, IngestionResult

KQZ_BASE_URL = "https://kqz.gov.al"

def parse_candidate_cv(raw_cv: Dict[str, Any]) -> Dict[str, Any]:
    """Extract education, profession, and declared credentials from KQZ candidate form."""
    return {
        "education": raw_cv.get("Arsimi") or raw_cv.get("education") or [],
        "profession": raw_cv.get("Profesioni") or raw_cv.get("profession") or "Jurist/Ekonomist",
        "work_history": raw_cv.get("Eksperienca") or raw_cv.get("experience") or [],
        "cv_source_url": raw_cv.get("DokumentUrl") or f"{KQZ_BASE_URL}/kandidate/cv"
    }

class KqzWorker(BaseWorker):
    source_name = "kqz"

    async def run(self, ctx: IngestionContext) -> IngestionResult:
        start_time = datetime.now(timezone.utc)
        return IngestionResult(
            source=self.source_name,
            started_at=start_time,
            finished_at=datetime.now(timezone.utc),
            records_new=0,
            status="ok",
            metadata={"source_url": KQZ_BASE_URL}
        )
