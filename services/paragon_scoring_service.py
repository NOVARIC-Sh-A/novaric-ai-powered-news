
from utils.supabase_client import supabase_upsert
from datetime import datetime, timezone
from typing import Dict, Any

def save_calculated_paragon_score(
    politician_id: int, 
    overall: int, 
    dimensions: Dict[str, int], 
    signals: Dict[str, Any]
):
    now = datetime.now(timezone.utc).isoformat()
    
    payload = {
        "politician_id": politician_id,
        "overall_score": int(overall),
        "dimension_scores": dimensions,
        "signals_raw": signals,
        "calculated_at": now,
        "last_updated": now
    }
    
    # Authoritative write to latest scores
    supabase_upsert("paragon_scores", payload, on_conflict="politician_id")
    
    # Append to snapshots for trend analysis
    supabase_upsert("paragon_snapshots", payload)
