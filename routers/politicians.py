
from fastapi import APIRouter, HTTPException, Path
from utils.supabase_client import supabase, _get
from typing import Dict, Any, List, Optional

router = APIRouter(prefix="/api/politicians", tags=["Politicians"])

PARAGON_DIMENSIONS = [
    "Policy Engagement & Expertise",
    "Accountability & Transparency",
    "Representation & Responsiveness",
    "Assertiveness & Influence",
    "Governance & Institutional Strength",
    "Organizational & Party Cohesion",
    "Narrative & Communication"
]

@router.get("/{id_or_slug}")
async def get_politician_profile(id_or_slug: str = Path(...)):
    if not supabase:
        raise HTTPException(status_code=503, detail="Database connectivity error")

    # 1. Resolve Identity
    col = "id" if id_or_slug.isdigit() else "slug"
    val = int(id_or_slug) if id_or_slug.isdigit() else id_or_slug
    
    p_res = supabase.table("politicians").select("*").eq(col, val).maybe_single().execute()
    politician = p_res.data
    if not politician:
        raise HTTPException(status_code=404, detail="Politician record not found")

    p_id = politician["id"]

    # 2. Fetch Aggregated Layers
    scores_res = supabase.table("paragon_scores").select("*").eq("politician_id", p_id).order("calculated_at", desc=True).limit(1).execute()
    latest_score = scores_res.data[0] if scores_res.data else {}
    
    metrics_res = supabase.table("paragon_metrics").select("*").eq("politician_id", p_id).execute()
    checklist_res = supabase.table("profile_improvement_checklist").select("*").eq("politician_id", p_id).execute()
    profile_res = supabase.table("profiles").select("*").eq("id", politician.get("profile_id", "")).maybe_single().execute()

    # 3. Normalize dimensions for UI stability
    raw_dims = latest_score.get("dimension_scores") or {}
    if not isinstance(raw_dims, dict):
        raw_dims = {}
    normalized_dimensions = []
    for dim in PARAGON_DIMENSIONS:
        normalized_dimensions.append({
            "dimension": dim,
            "score": raw_dims.get(dim) if dim in raw_dims else None
        })

    from services.politician_dossier import attach_dossier, load_supabase_dossier

    payload = {
        "politician": politician,
        "overall_score": latest_score.get("overall_score") if latest_score else None,
        "dimensions": normalized_dimensions,
        "metrics": metrics_res.data or [],
        "improvement_checklist": checklist_res.data or [],
        "profile_enrichment": profile_res.data or {},
        "metadata": {
            "last_updated": latest_score.get("calculated_at") or latest_score.get("last_updated")
        }
    }
    return attach_dossier(payload, load_supabase_dossier(supabase, politician))
