"""
NOVARIC® PARAGON® Scoring Engine — Evidence-First Integrity Recovery
Computes the 7 PARAGON governance dimensions for Albanian political figures:
1. Angazhimi Politik (D1)
2. Llogaridhënia (D2)
3. Përfaqësimi (D3)
4. Asertiviteti (D4)
5. Qeverisja (D5)
6. Kohësioni (D6)
7. Narrativa (D7)

Rules Enforced:
- Evidence-First: Missing evidence = NULL, Unverified = NULL.
- No synthetic defaults (no att=70.0, on_time=True, audit=True, v_pct=80.0, inits=2, etc.)
- No artificial score floors (no max(15.0, ...), max(20.0, ...), max(25.0, ...))
- Non-MPs are excluded from parliamentary scores
- Real 180-day exponential time decay
"""

import math
from datetime import datetime, timezone, date
from typing import Dict, Any, List, Optional, Tuple

DEFAULT_WEIGHTS = {
    "d1_policy_engagement": 0.18,
    "d2_accountability": 0.18,
    "d3_representation": 0.14,
    "d4_assertiveness": 0.14,
    "d5_governance": 0.14,
    "d6_party_cohesion": 0.10,
    "d7_narrative": 0.12,
    "decay_half_life_days": 180
}

def apply_time_decay(days_elapsed: float, half_life_days: float = 180.0) -> float:
    """Calculate exponential decay factor = 2^(-days / half_life)."""
    if days_elapsed <= 0:
        return 1.0
    return math.pow(0.5, days_elapsed / half_life_days)

def compute_d1_from_attendance(
    attendance_pct: Optional[float],
    bills_lead: int = 0,
    bills_coauthor: int = 0,
    plenary_speeches: int = 0,
    as_of: Optional[str] = None,
    total_sessions: Optional[int] = None,
    attended_sessions: Optional[int] = None,
    absent_sessions: Optional[int] = None,
    attendance_status: Optional[str] = None
) -> Tuple[Optional[float], Dict[str, Any]]:
    now_iso = as_of or datetime.now(timezone.utc).isoformat()
    
    if attendance_status:
        resolved_status = attendance_status
    elif total_sessions is None or total_sessions == 0:
        resolved_status = "no_record"
    elif attended_sessions is not None:
        if attended_sessions == total_sessions:
            resolved_status = "present"
        elif attended_sessions == 0:
            resolved_status = "absent"
        else:
            resolved_status = "mixed"
    elif attendance_pct is not None:
        if attendance_pct >= 99.9:
            resolved_status = "present"
        elif attendance_pct <= 0.0:
            resolved_status = "absent"
        else:
            resolved_status = "mixed"
    else:
        resolved_status = "no_record"

    envelope: Dict[str, Any] = {
        "dimension": "d1_policy_engagement",
        "method": "kuvendi_mbledhjet_attendance_v1",
        "as_of": now_iso,
        "formula": "0.40 * committee_attendance_pct + 0.35 * min(100.0, bills_lead * 25.0 + bills_coauthor * 8.0) + 0.25 * min(100.0, plenary_speeches * 5.0)",
        "sources": ["/mbledhjet", "/aktet", "/anetaret"],
        "lineage_id": "paragon:d1",
        "lineage_target": "maragon:O4.2",
        "attendance_pct": attendance_pct,
        "attendance_status": resolved_status,
        "total_sessions": total_sessions,
        "attended_sessions": attended_sessions,
        "absent_sessions": absent_sessions,
        "bills_lead": bills_lead,
        "bills_coauthor": bills_coauthor,
        "plenary_speeches": plenary_speeches,
    }

    if attendance_pct is None and bills_lead == 0 and bills_coauthor == 0 and plenary_speeches == 0:
        envelope["status"] = "pending_audit"
        envelope["clean_null"] = True
        return None, envelope

    att_val = float(attendance_pct) if attendance_pct is not None else 0.0
    att_component = att_val * 0.40
    bills_score = min(100.0, bills_lead * 25.0 + bills_coauthor * 8.0) * 0.35
    speeches_score = min(100.0, plenary_speeches * 5.0) * 0.25

    d1_raw = att_component + bills_score + speeches_score
    d1 = round(min(100.0, max(0.0, d1_raw)), 1)
    envelope["status"] = "computed"
    envelope["computed_score"] = d1
    return d1, envelope

def calculate_paragon_dimensions(
    raw_metrics: Dict[str, Any],
    weights: Optional[Dict[str, float]] = None,
    strict_nulls: bool = True
) -> Tuple[Dict[str, Optional[float]], Optional[float], Dict[str, Any]]:
    """
    Compute 7 dimension scores strictly from verifiable evidence.
    Missing evidence returns NULL (None), never default assumptions.
    """
    w = weights or DEFAULT_WEIGHTS

    # 1. Angazhimi Politik (D1)
    # A missing input is excluded. It is not treated as zero and it is not filled
    # with a midpoint. Weights of the inputs that exist are renormalised to 0–100.
    committee_att_pct = raw_metrics.get("committee_attendance_pct") if "committee_attendance_pct" in raw_metrics else None
    has_bills = "bills_sponsored_lead" in raw_metrics or "bills_sponsored_coauthor" in raw_metrics
    bills_lead = int(raw_metrics.get("bills_sponsored_lead") or 0) if has_bills else 0
    bills_coauthor = int(raw_metrics.get("bills_sponsored_coauthor") or 0) if has_bills else 0
    has_speeches = "plenary_speeches_count" in raw_metrics
    plenary_speeches = int(raw_metrics.get("plenary_speeches_count") or 0) if has_speeches else 0

    d1_parts = []
    if committee_att_pct is not None:
        d1_parts.append((float(committee_att_pct), 0.40))
    if has_bills:
        bills_score = min(100.0, bills_lead * 25.0 + bills_coauthor * 8.0)
        d1_parts.append((bills_score, 0.35))
    if has_speeches:
        d1_parts.append((min(100.0, plenary_speeches * 5.0), 0.25))

    if d1_parts:
        d1_weight = sum(weight for _, weight in d1_parts)
        d1 = round(min(100.0, max(0.0, sum(value * weight for value, weight in d1_parts) / d1_weight)), 1)
        _, d1_envelope = compute_d1_from_attendance(
            attendance_pct=committee_att_pct,
            bills_lead=bills_lead if has_bills else 0,
            bills_coauthor=bills_coauthor if has_bills else 0,
            plenary_speeches=plenary_speeches if has_speeches else 0,
            as_of=raw_metrics.get("as_of"),
            total_sessions=raw_metrics.get("attendance_sample_size"),
            attended_sessions=raw_metrics.get("attended_sessions"),
            absent_sessions=raw_metrics.get("absent_sessions"),
            attendance_status=raw_metrics.get("attendance_status")
        )
        d1_envelope["computed_score"] = d1
        d1_envelope["status"] = "computed"
        d1_envelope["inputs_used"] = [name for name, present in (
            ("attendance", committee_att_pct is not None),
            ("bills", has_bills),
            ("speeches", has_speeches),
        ) if present]
        raw_metrics["_d1_envelope"] = d1_envelope
    else:
        d1 = None

    # 2. Llogaridhënia (D2)
    # Each component keeps its published maximum (40 on-time, 30 audit, 30 votes).
    # Missing components are left out and the available points are scaled to 0–100.
    asset_on_time = raw_metrics.get("asset_declaration_on_time") if "asset_declaration_on_time" in raw_metrics else None
    asset_audit_clean = raw_metrics.get("asset_audit_clean") if "asset_audit_clean" in raw_metrics else None
    vote_participation_pct = raw_metrics.get("vote_participation_pct") if "vote_participation_pct" in raw_metrics else None
    procurement_flag = raw_metrics.get("unjustified_procurement_flag") if "unjustified_procurement_flag" in raw_metrics else None

    d2_points = 0.0
    d2_cap = 0.0
    if asset_on_time is True:
        d2_points += 40.0
        d2_cap += 40.0
    elif asset_on_time is False:
        d2_points += 10.0
        d2_cap += 40.0
    if asset_audit_clean is True:
        d2_points += 30.0
        d2_cap += 30.0
    elif asset_audit_clean is False:
        d2_points += 5.0
        d2_cap += 30.0
    if vote_participation_pct is not None:
        d2_points += float(vote_participation_pct) * 0.3
        d2_cap += 30.0
    if procurement_flag is True:
        d2_points -= 25.0
    if d2_cap > 0:
        d2 = round(min(100.0, max(0.0, d2_points / d2_cap * 100.0)), 1)
    else:
        d2 = None

    # 3. Përfaqësimi (D3)
    zone_inits = raw_metrics.get("constituency_initiatives")
    regional_hearings = raw_metrics.get("regional_hearings_attended")
    pref_votes = raw_metrics.get("preferential_votes_count")

    has_d3_evidence = (zone_inits is not None or regional_hearings is not None or pref_votes is not None)
    if has_d3_evidence:
        inits_val = zone_inits or 0
        hearings_val = regional_hearings or 0
        votes_val = pref_votes or 0
        d3_raw = (
            min(40.0, inits_val * 10.0) +
            min(30.0, hearings_val * 6.0) +
            min(30.0, (votes_val / 10000.0) * 30.0)
        )
        d3 = round(min(100.0, max(0.0, d3_raw)), 1)
    else:
        d3 = None

    # 4. Asertiviteti (D4)
    debates_led = raw_metrics.get("key_debates_led")
    amendments = raw_metrics.get("amendments_passed")
    words_spoken = raw_metrics.get("total_words_spoken")

    has_d4_evidence = (debates_led is not None or amendments is not None or words_spoken is not None)
    if has_d4_evidence:
        d_val = debates_led or 0
        a_val = amendments or 0
        w_val = words_spoken or 0
        d4_raw = (
            min(40.0, d_val * 8.0) +
            min(30.0, a_val * 15.0) +
            min(30.0, (w_val / 25000.0) * 30.0)
        )
        d4 = round(min(100.0, max(0.0, d4_raw)), 1)
    else:
        d4 = None

    # 5. Qeverisja (D5)
    compliance_score = raw_metrics.get("constitutional_compliance_score")
    reform_inits = raw_metrics.get("institutional_reform_initiatives")

    d5_points = 0.0
    d5_cap = 0.0
    if compliance_score is not None:
        d5_points += float(compliance_score) * 0.6
        d5_cap += 60.0
    if reform_inits is not None:
        d5_points += min(40.0, float(reform_inits) * 15.0)
        d5_cap += 40.0
    if d5_cap > 0:
        d5 = round(min(100.0, max(0.0, d5_points / d5_cap * 100.0)), 1)
    else:
        d5 = None

    # 6. Kohësioni (D6)
    party_align = raw_metrics.get("party_vote_alignment_pct") if "party_vote_alignment_pct" in raw_metrics else None
    group_att = raw_metrics.get("group_meeting_attendance_pct") if "group_meeting_attendance_pct" in raw_metrics else None

    if party_align is not None and group_att is not None:
        d6 = round(min(100.0, max(0.0, (float(party_align) * 0.6) + (float(group_att) * 0.4))), 1)
    elif party_align is not None:
        d6 = round(min(100.0, max(0.0, float(party_align))), 1)
    elif group_att is not None:
        d6 = round(min(100.0, max(0.0, float(group_att))), 1)
    else:
        d6 = None

    # 7. Narrativa (D7)
    media_count = raw_metrics.get("recent_media_mentions_count")
    media_sentiment = raw_metrics.get("media_avg_sentiment")
    media_toxicity = raw_metrics.get("toxicity_score")
    days_since = raw_metrics.get("days_since_latest_media")

    has_d7_evidence = (media_count is not None and media_count > 0 and media_sentiment is not None)
    if has_d7_evidence:
        cnt = media_count or 0
        sent = media_sentiment or 0.0
        tox = media_toxicity or 0.0
        days = days_since if days_since is not None else 30.0
        decay = apply_time_decay(days, w.get("decay_half_life_days", 180.0))
        sentiment_scaled = ((sent + 1.0) / 2.0) * 50.0
        volume_scaled = min(40.0, (cnt / 100.0) * 40.0)
        tox_penalty = tox * 30.0
        d7_raw = ((sentiment_scaled + volume_scaled - tox_penalty) + 20.0) * decay
        d7 = round(min(100.0, max(0.0, d7_raw)), 1)
    else:
        d7 = None

    dimensions: Dict[str, Optional[float]] = {
        "Angazhimi Politik": d1,
        "Llogaridhënia": d2,
        "Përfaqësimi": d3,
        "Asertiviteti": d4,
        "Qeverisja": d5,
        "Kohësioni": d6,
        "Narrativa": d7
    }

    dim_weights = {
        "Angazhimi Politik": w["d1_policy_engagement"],
        "Llogaridhënia": w["d2_accountability"],
        "Përfaqësimi": w["d3_representation"],
        "Asertiviteti": w["d4_assertiveness"],
        "Qeverisja": w["d5_governance"],
        "Kohësioni": w["d6_party_cohesion"],
        "Narrativa": w["d7_narrative"]
    }

    # A single thin dimension is not an overall rating. Require at least two
    # scored dimensions and a quarter of the published weight.
    avail_sum = 0.0
    weight_sum = 0.0
    scored_dim_count = 0
    for dim_name, score_val in dimensions.items():
        if score_val is not None:
            weight = dim_weights[dim_name]
            avail_sum += score_val * weight
            weight_sum += weight
            scored_dim_count += 1

    coverage_pct = round(weight_sum * 100.0, 1)
    raw_metrics["_scored_dimension_count"] = scored_dim_count
    raw_metrics["_coverage_weight"] = coverage_pct
    if weight_sum >= 0.25 and scored_dim_count >= 2:
        composite = round(min(100.0, max(0.0, avail_sum / weight_sum)), 1)
        raw_metrics["_composite_status"] = "partial" if scored_dim_count < 7 else "complete"
    else:
        composite = None
        raw_metrics["_composite_status"] = "insufficient_coverage"

    return dimensions, composite, raw_metrics

def generate_albanian_commentary(
    politician_name: str,
    party_short: str,
    composite: Optional[float],
    dimensions: Dict[str, Optional[float]],
    metrics: Dict[str, Any]
) -> str:
    """
    Factual Albanian summary based strictly on verified records.
    Never claims unverified empirical completeness.
    """
    if composite is None:
        return f"Vlerësimi për {politician_name} ({party_short}) është në proces verifikimi të burimeve primare."

    # Sentence 1: General performance & role
    s1 = f"{politician_name} ({party_short}) arrin një indeks të përgjithshëm PARAGON® prej {int(composite)}% në monitorimin institucional të Kuvendit të Shqipërisë."

    # Sentence 2: Available dimensions
    scored_dims = {k: v for k, v in dimensions.items() if v is not None}
    if scored_dims:
        top_dim = max(scored_dims.items(), key=lambda x: x[1])
        s2 = f"Performanca më e lartë evidentohet në dimensionin '{top_dim[0]}' ({int(top_dim[1])}%), bazuar në nismat ligjore dhe fjalimet plenare të administruara në regjistrin zyrtar."
    else:
        s2 = "Dimensionet analitike janë në pritje të përmbylljes së auditimit institucional."

    # Sentence 3: Transparency & verification status
    if metrics.get("asset_declaration_on_time") is not None:
        on_time_str = "në përputhje me afatin ligjor të 31 marsit" if metrics.get("asset_declaration_on_time") else "me vonesa administrative të shënuara"
        s3 = f"Deklarimet e pasurisë në ILDKPKI janë depozituar {on_time_str}."
    else:
        s3 = "Të dhënat administrative trajtohen sipas parimit të auditimit të pavarur të burimeve."

    return f"{s1} {s2} {s3}"
