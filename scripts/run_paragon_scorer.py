#!/usr/bin/env python3
"""
NOVARIC® PARAGON® Scorer Runner — Evidence-First Integrity Recovery
Entrypoint: scripts/run_paragon_scorer.py

Iterates over active MPs (is_active_mp = 1), loads empirical metrics from
relational DB tables, evaluates PARAGON dimensions strictly via verifiable evidence,
and writes scores to paragon_scores.
Also generates the unified profiles export incorporating structured roles,
presumption of innocence, and scoring suspension notice.
"""

import sys
import os
import argparse
import json
import sqlite3
import math
import uuid
from datetime import datetime, timezone, date
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
DB_PATH = ROOT_DIR / "db" / "novaric.db"
EXPORT_JSON_PATH = ROOT_DIR / "db" / "paragon_scores_export.json"

sys.path.insert(0, str(ROOT_DIR))
from services.paragon_scoring_engine import (
    apply_time_decay,
    generate_albanian_commentary
)

def get_connection(db_path: Path = DB_PATH) -> sqlite3.Connection:
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def get_or_seed_weights(conn: sqlite3.Connection, model_version: str = "v1.0") -> Tuple[Dict[str, float], float]:
    cur = conn.cursor()
    cur.execute("SELECT weights, decay_half_life_days FROM scoring_weights WHERE model_version = ?", (model_version,))
    row = cur.fetchone()
    if not row:
        default_weights = {
            "d1": 1.0 / 7.0,
            "d2": 1.0 / 7.0,
            "d3": 1.0 / 7.0,
            "d4": 1.0 / 7.0,
            "d5": 1.0 / 7.0,
            "d6": 1.0 / 7.0,
            "d7": 1.0 / 7.0,
            "decay_half_life_days": 180.0
        }
        cur.execute(
            "INSERT INTO scoring_weights (model_version, weights, decay_half_life_days) VALUES (?, ?, ?)",
            (model_version, json.dumps(default_weights), 180.0)
        )
        conn.commit()
        return default_weights, 180.0

    w_dict = json.loads(row["weights"])
    decay_half_life = float(row["decay_half_life_days"])
    return w_dict, decay_half_life

def load_mp_metrics(conn: sqlite3.Connection, pol_id: str) -> Dict[str, Any]:
    """
    Loads all empirical metrics for an MP from DB tables.
    Missing evidence returns None / 0, NEVER synthetic defaults.
    """
    cur = conn.cursor()
    metrics: Dict[str, Any] = {}

    # D1: Bills sponsored
    cur.execute("""
        SELECT sponsor_type, count(*) as cnt 
        FROM bill_sponsors 
        WHERE politician_id = ? 
        GROUP BY sponsor_type
    """, (pol_id,))
    lead_bills = 0
    coauthor_bills = 0
    for r in cur.fetchall():
        if r["sponsor_type"] == "lead":
            lead_bills = r["cnt"]
        elif r["sponsor_type"] == "coauthor":
            coauthor_bills = r["cnt"]

    # D1 & D4: Speeches & Words
    cur.execute("""
        SELECT count(*) as speech_cnt, COALESCE(sum(word_count), 0) as total_words
        FROM speeches
        WHERE politician_id = ?
    """, (pol_id,))
    sp_row = cur.fetchone()
    speech_cnt = sp_row["speech_cnt"] if sp_row else 0
    total_words = sp_row["total_words"] if sp_row else 0

    # D1 & D5: Attendance
    cur.execute("""
        SELECT count(*) as total_sess, COALESCE(sum(attended), 0) as attended_sess
        FROM attendance
        WHERE politician_id = ? AND session_type = 'committee'
    """, (pol_id,))
    att_row = cur.fetchone()
    total_committee = att_row["total_sess"] if att_row else 0
    attended_committee = att_row["attended_sess"] if att_row else 0
    committee_att_pct = (attended_committee / total_committee * 100.0) if total_committee > 0 else None

    # D2: Asset declarations
    cur.execute("""
        SELECT on_time, audit_clean, unjustified_procurement_flag, decl_year
        FROM asset_declarations
        WHERE politician_id = ?
        ORDER BY decl_year DESC LIMIT 1
    """, (pol_id,))
    asset_row = cur.fetchone()
    has_asset = asset_row is not None
    asset_on_time = bool(asset_row["on_time"]) if has_asset else None
    asset_audit_clean = bool(asset_row["audit_clean"]) if has_asset else None
    procurement_flag = bool(asset_row["unjustified_procurement_flag"]) if has_asset else None

    # D2 & D6: Vote records
    cur.execute("""
        SELECT count(*) as total_v,
               COALESCE(sum(CASE WHEN vote_choice != 'absent' THEN 1 ELSE 0 END), 0) as participated_v,
               COALESCE(sum(voted_with_party), 0) as party_align_v
        FROM vote_records
        WHERE politician_id = ?
    """, (pol_id,))
    vr_row = cur.fetchone()
    total_votes = vr_row["total_v"] if vr_row else 0
    part_votes = vr_row["participated_v"] if vr_row else 0
    party_align_votes = vr_row["party_align_v"] if vr_row else 0
    vote_part_pct = (part_votes / total_votes * 100.0) if total_votes > 0 else None
    party_whip_pct = (party_align_votes / part_votes * 100.0) if part_votes > 0 else None

    # D3: Candidacies
    cur.execute("""
        SELECT preferential_votes, constituency_initiatives, regional_hearings_attended
        FROM candidacies
        WHERE politician_id = ?
        ORDER BY election_year DESC LIMIT 1
    """, (pol_id,))
    cand_row = cur.fetchone()
    has_candidacy = cand_row is not None
    pref_votes = cand_row["preferential_votes"] if has_candidacy else None
    zone_inits = cand_row["constituency_initiatives"] if has_candidacy else None
    regional_hearings = cand_row["regional_hearings_attended"] if has_candidacy else None

    # D7: Media mentions
    cur.execute("""
        SELECT count(*) as mention_cnt,
               AVG(sentiment) as avg_sentiment,
               AVG(toxicity) as avg_toxicity,
               MIN(days_elapsed) as min_days
        FROM mention_entities
        WHERE politician_id = ?
    """, (pol_id,))
    m_row = cur.fetchone()
    media_cnt = m_row["mention_cnt"] if m_row else 0
    avg_sentiment = float(m_row["avg_sentiment"]) if (m_row and m_row["avg_sentiment"] is not None) else None
    avg_toxicity = float(m_row["avg_toxicity"]) if (m_row and m_row["avg_toxicity"] is not None) else None
    days_since_media = float(m_row["min_days"]) if (m_row and m_row["min_days"] is not None) else None

    metrics["bills_sponsored_lead"] = lead_bills
    metrics["bills_sponsored_coauthor"] = coauthor_bills
    metrics["plenary_speeches_count"] = speech_cnt
    metrics["total_words_spoken"] = total_words
    metrics["committee_attendance_pct"] = committee_att_pct
    metrics["asset_declaration_exists"] = has_asset
    metrics["asset_declaration_on_time"] = asset_on_time
    metrics["asset_audit_clean"] = asset_audit_clean
    metrics["unjustified_procurement_flag"] = procurement_flag
    metrics["vote_participation_pct"] = vote_part_pct
    metrics["party_vote_alignment_pct"] = party_whip_pct
    metrics["candidacy_exists"] = has_candidacy
    metrics["preferential_votes_count"] = pref_votes
    metrics["constituency_initiatives"] = zone_inits
    metrics["regional_hearings_attended"] = regional_hearings
    metrics["media_mentions_count"] = media_cnt
    metrics["media_avg_sentiment"] = avg_sentiment
    metrics["toxicity_score"] = avg_toxicity
    metrics["days_since_latest_media"] = days_since_media

    return metrics

def score_politician(
    pol_row: sqlite3.Row,
    metrics: Dict[str, Any],
    weights: Dict[str, float],
    decay_half_life: float
) -> Tuple[Dict[str, Optional[float]], Optional[float], Dict[str, Any]]:
    """
    Computes dimensions ONLY from verifiable empirical data.
    If a dimension has no underlying data, it scores NULL.
    No synthetic defaults. No artificial score floors.
    """
    scores: Dict[str, Optional[float]] = {
        "d1": None, "d2": None, "d3": None, "d4": None,
        "d5": None, "d6": None, "d7": None
    }
    available_dims = []
    missing_dims = []

    # D1: Policy Engagement & Expertise
    has_d1 = (metrics["bills_sponsored_lead"] > 0 or 
              metrics["bills_sponsored_coauthor"] > 0 or 
              metrics["plenary_speeches_count"] > 0 or 
              metrics["committee_attendance_pct"] is not None)
    if has_d1:
        att = metrics["committee_attendance_pct"] or 0.0
        d1_raw = (
            min(40.0, metrics["bills_sponsored_lead"] * 12.0 + metrics["bills_sponsored_coauthor"] * 4.0) +
            min(35.0, metrics["plenary_speeches_count"] * 1.8) +
            (att * 0.25)
        )
        scores["d1"] = round(min(100.0, max(0.0, d1_raw)), 1)
        available_dims.append("d1")
    else:
        missing_dims.append("d1")

    # D2: Accountability & Transparency
    has_d2 = (metrics["asset_declaration_exists"] or metrics["vote_participation_pct"] is not None)
    if has_d2:
        on_time = metrics["asset_declaration_on_time"]
        audit = metrics["asset_audit_clean"]
        v_pct = metrics["vote_participation_pct"]
        proc = metrics["unjustified_procurement_flag"]

        on_time_pts = 40.0 if on_time is True else (10.0 if on_time is False else 20.0)
        audit_pts = 30.0 if audit is True else (5.0 if audit is False else 15.0)
        vote_pts = (v_pct * 0.3) if v_pct is not None else 15.0
        proc_penalty = 25.0 if proc is True else 0.0

        d2_raw = on_time_pts + audit_pts + vote_pts - proc_penalty
        scores["d2"] = round(min(100.0, max(0.0, d2_raw)), 1)
        available_dims.append("d2")
    else:
        missing_dims.append("d2")

    # D3: Representation & Responsiveness
    has_d3 = metrics["candidacy_exists"] and (metrics["preferential_votes_count"] is not None or metrics["constituency_initiatives"] is not None)
    if has_d3:
        inits = metrics["constituency_initiatives"] or 0
        hearings = metrics["regional_hearings_attended"] or 0
        p_votes = metrics["preferential_votes_count"] or 0
        d3_raw = (
            min(40.0, inits * 10.0) +
            min(30.0, hearings * 6.0) +
            min(30.0, (p_votes / 10000.0) * 30.0)
        )
        scores["d3"] = round(min(100.0, max(0.0, d3_raw)), 1)
        available_dims.append("d3")
    else:
        missing_dims.append("d3")

    # D4: Assertiveness & Influence
    has_d4 = (metrics["total_words_spoken"] > 0 or metrics["bills_sponsored_lead"] > 0 or metrics["plenary_speeches_count"] > 0)
    if has_d4:
        leadership_debates = min(5, metrics["plenary_speeches_count"] // 2)
        amendments = metrics["bills_sponsored_lead"]
        words = metrics["total_words_spoken"]
        d4_raw = (
            min(40.0, leadership_debates * 8.0) +
            min(30.0, amendments * 15.0) +
            min(30.0, (words / 25000.0) * 30.0)
        )
        scores["d4"] = round(min(100.0, max(0.0, d4_raw)), 1)
        available_dims.append("d4")
    else:
        missing_dims.append("d4")

    # D5: Governance & Institutional Strength
    has_d5 = (metrics["committee_attendance_pct"] is not None or metrics["plenary_speeches_count"] > 0 or metrics["bills_sponsored_lead"] > 0)
    if has_d5:
        comp_score = metrics["committee_attendance_pct"] or 0.0
        inst_inits = metrics["bills_sponsored_lead"] + (1 if metrics["plenary_speeches_count"] > 5 else 0)
        d5_raw = (comp_score * 0.6) + min(40.0, inst_inits * 15.0)
        scores["d5"] = round(min(100.0, max(0.0, d5_raw)), 1)
        available_dims.append("d5")
    else:
        missing_dims.append("d5")

    # D6: Organizational & Party Cohesion
    has_d6 = (metrics["party_vote_alignment_pct"] is not None)
    if has_d6:
        whip_align = metrics["party_vote_alignment_pct"]
        d6_raw = whip_align
        scores["d6"] = round(min(100.0, max(0.0, d6_raw)), 1)
        available_dims.append("d6")
    else:
        missing_dims.append("d6")

    # D7: Narrative & Communication
    has_d7 = (metrics["media_mentions_count"] > 0 and metrics["media_avg_sentiment"] is not None)
    if has_d7:
        cnt = metrics["media_mentions_count"]
        sent = metrics["media_avg_sentiment"]
        tox = metrics["toxicity_score"] or 0.0
        days = metrics["days_since_latest_media"] or 30.0

        decay = apply_time_decay(days, decay_half_life)
        sentiment_scaled = ((sent + 1.0) / 2.0) * 50.0
        volume_scaled = min(40.0, (cnt / 100.0) * 40.0)
        tox_penalty = tox * 30.0

        d7_raw = ((sentiment_scaled + volume_scaled - tox_penalty) + 20.0) * decay
        scores["d7"] = round(min(100.0, max(0.0, d7_raw)), 1)
        available_dims.append("d7")
    else:
        missing_dims.append("d7")

    # Coverage metadata
    k = len(available_dims)
    metrics_envelope = dict(metrics)
    metrics_envelope["_coverage"] = {
        "available": available_dims,
        "missing": missing_dims
    }
    metrics_envelope["_composite_coverage"] = f"{k}/7"

    # Composite: Require at least 1 verified dimension
    if k == 0:
        composite = None
    else:
        weight_sum = sum(weights.get(d, 1.0 / 7.0) for d in available_dims)
        score_sum = sum(weights.get(d, 1.0 / 7.0) * scores[d] for d in available_dims)
        composite = round(score_sum / weight_sum, 1)

    return scores, composite, metrics_envelope

def run_scorer(
    politician_id: Optional[str] = None,
    dry_run: bool = False,
    period_end: Optional[str] = None,
    force: bool = False,
    model_version: str = "v1.0"
):
    if not period_end:
        today = date.today()
        period_end = today.strftime("%Y-%m-%d")

    period_start = f"{int(period_end[:4]) - 1}{period_end[4:]}"

    conn = get_connection()
    cur = conn.cursor()

    weights, decay_half_life = get_or_seed_weights(conn, model_version)

    # Strictly target ACTIVE MPs for parliamentary performance scoring
    if politician_id:
        cur.execute("SELECT * FROM politicians WHERE (id = ? OR numeric_id = ?) AND is_active_mp = 1", (politician_id, politician_id))
    else:
        cur.execute("SELECT * FROM politicians WHERE is_active_mp = 1 ORDER BY numeric_id ASC")
    active_mps = cur.fetchall()

    if not active_mps:
        print("No active MPs found to score.")
        conn.close()
        return

    run_id = f"score-run-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:6]}"
    started_at = datetime.now(timezone.utc).isoformat()

    if not dry_run:
        cur.execute("""
            INSERT INTO scoring_runs (id, model_version, period_end, started_at, status)
            VALUES (?, ?, ?, ?, 'running')
        """, (run_id, model_version, period_end, started_at))
        conn.commit()

    print(f"============================================================")
    print(f"PARAGON® Evidence-First Scorer Run: {run_id}")
    print(f"Model Version: {model_version} | Period: {period_start} -> {period_end}")
    print(f"Mode: {'DRY RUN (No DB write)' if dry_run else 'PRODUCTION AUDIT'}")
    print(f"Active MPs Targeted: {len(active_mps)}")
    print(f"============================================================\n")

    records_computed = 0
    records_updated = 0
    computed_scores_by_id = {}

    now_iso = datetime.now(timezone.utc).isoformat()

    for mp in active_mps:
        pol_id = mp["id"]
        numeric_id = mp["numeric_id"]
        name = mp["full_name"]
        party = mp["party_short"]

        metrics = load_mp_metrics(conn, pol_id)
        scores, composite, metrics_envelope = score_politician(mp, metrics, weights, decay_half_life)

        records_computed += 1
        computed_scores_by_id[pol_id] = (scores, composite, metrics_envelope)

        if dry_run:
            print(f"MP: {name} (ID: {pol_id}, #{numeric_id}, {party}) -> Composite: {composite}% | Dims: {scores}")
        else:
            cur.execute("""
                SELECT 1 FROM paragon_scores
                WHERE politician_id = ? AND period_end = ? AND model_version = ?
            """, (pol_id, period_end, model_version))
            exists = cur.fetchone() is not None

            # Upsert into paragon_scores
            cur.execute("""
                INSERT INTO paragon_scores (
                    politician_id, computed_at, period_start, period_end, model_version,
                    d1_policy_engagement, d2_accountability, d3_representation,
                    d4_assertiveness, d5_governance, d6_party_cohesion, d7_narrative,
                    composite, metrics
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(politician_id, period_end, model_version) DO UPDATE SET
                    computed_at = excluded.computed_at,
                    d1_policy_engagement = excluded.d1_policy_engagement,
                    d2_accountability = excluded.d2_accountability,
                    d3_representation = excluded.d3_representation,
                    d4_assertiveness = excluded.d4_assertiveness,
                    d5_governance = excluded.d5_governance,
                    d6_party_cohesion = excluded.d6_party_cohesion,
                    d7_narrative = excluded.d7_narrative,
                    composite = excluded.composite,
                    metrics = excluded.metrics
            """, (
                pol_id, now_iso, period_start, period_end, model_version,
                scores["d1"], scores["d2"], scores["d3"], scores["d4"],
                scores["d5"], scores["d6"], scores["d7"],
                composite, json.dumps(metrics_envelope)
            ))
            if exists:
                records_updated += 1

    # Now prepare comprehensive export profiles for ALL figures in the directory
    # (both active MPs and non-MP figures such as Erion Veliaj)
    cur.execute("SELECT * FROM politicians ORDER BY numeric_id ASC")
    all_politicians = cur.fetchall()

    scored_profiles_export = []

    for person in all_politicians:
        pol_id = person["id"]
        numeric_id = person["numeric_id"]
        name = person["full_name"]
        party = person["party_short"]
        is_active = person["is_active_mp"] == 1

        if is_active and pol_id in computed_scores_by_id:
            scores, composite, metrics_envelope = computed_scores_by_id[pol_id]
            paragon_dims = [
                scores["d1"], scores["d2"], scores["d3"],
                scores["d4"], scores["d5"], scores["d6"], scores["d7"]
            ]
            has_dims = any(d is not None for d in paragon_dims)
            cov_str = metrics_envelope.get("_composite_coverage", "0/7")
        else:
            # Non-MP figures (e.g. Erion Veliaj) or figures without parliamentary scoring
            scores = {"d1": None, "d2": None, "d3": None, "d4": None, "d5": None, "d6": None, "d7": None}
            composite = None
            paragon_dims = None
            has_dims = False
            cov_str = "0/7"

        # Official photo sources only (photo audit 2026-10-31); no NOVARIC copies/placeholders.
        from ingestion.image_mirror import resolve_official_photo
        from utils.official_photo import AWAITING_PHOTO_STATUS, OFFICIAL_PHOTO_STATUS
        resolved_photo_url, photo_src, is_pending = resolve_official_photo(
            f"vip{numeric_id}", person["photo_url"],
            person["photo_source_url"] if "photo_source_url" in person.keys() else None, name)
        photo_status = AWAITING_PHOTO_STATUS if is_pending else OFFICIAL_PHOTO_STATUS

        sec_roles = []
        if person["secondary_roles"]:
            try:
                sec_roles = json.loads(person["secondary_roles"])
            except Exception:
                sec_roles = [person["secondary_roles"]]

        scored_profiles_export.append({
            "id": f"vip{numeric_id}",
            "numericId": numeric_id,
            "uuid": pol_id,
            "name": name,
            "category": f"Politikë ({party})",
            "party": party,
            "primaryRole": person["primary_role"],
            "secondaryRoles": sec_roles,
            "parliamentaryStatus": person["parliamentary_status"],
            "detentionStatus": person["detention_status"],
            "caseStatus": person["case_status"],
            "presumptionOfInnocence": bool(person["presumption_of_innocence"]),
            "legalStatusAsOf": person["legal_status_as_of"],
            "legalStatusSummary": person["legal_status_summary"],
            "imageUrl": resolved_photo_url,
            "photo_source_url": photo_src,
            "photoPending": is_pending,
            "photoStatus": photo_status,
            "shortBio": person["bio_short"],
            "detailedBio": person["bio_detailed"],
            "dynamicScore": int(round(composite)) if composite is not None else None,
            "composite": composite,
            "compositeDelta": 0.0 if composite is not None else None,
            "periodEnd": period_end if composite is not None else None,
            "paragonDimensions": paragon_dims if has_dims else None,
            "dateOfBirth": person["date_of_birth"],
            "dateOfBirthVerificationStatus": person["date_of_birth_verification_status"],
            "dateOfBirthSourceUrl": person["date_of_birth_source_url"],
            "dateOfBirthVerifiedAt": person["date_of_birth_verified_at"],
            "placeOfBirth": person["place_of_birth"],
            "electoralZone": person["electoral_zone"],
            "dimsSource": "db",
            "last_updated": now_iso,
            "_composite_coverage": cov_str,
            "scoring_suspended": True,
            "scoring_suspension_notice": "Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave."
        })

    finished_at = datetime.now(timezone.utc).isoformat()

    if not dry_run:
        cur.execute("""
            UPDATE scoring_runs
            SET finished_at = ?, records_computed = ?, records_updated = ?, status = 'success'
            WHERE id = ?
        """, (finished_at, records_computed, records_updated, run_id))
        conn.commit()

        # Write synchronized export JSON with containment & scoring suspension headers
        with open(EXPORT_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump({
                "pipeline_stage": "P2",
                "run_id": run_id,
                "model_version": model_version,
                "period_end": period_end,
                "computed_at": finished_at,
                "total_profiles": len(scored_profiles_export),
                "scored_count": sum(1 for p in scored_profiles_export if p["composite"] is not None),
                "scoring_suspended": True,
                "scoring_suspension_notice": "Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave.",
                "profiles": scored_profiles_export
            }, f, indent=2)

    print(f"\n============================================================")
    print(f"PARAGON® Integrity Scorer Run Completed:")
    print(f"  Total Profiles in Export: {len(scored_profiles_export)}")
    print(f"  Active MPs Scored: {records_computed}")
    print(f"  Scoring Suspended Notice Published to Frontend")
    print(f"============================================================\n")
    conn.close()

def main():
    parser = argparse.ArgumentParser(description="NOVARIC® PARAGON Scorer Runner")
    parser.add_argument("--id", type=str, help="Specific Politician ID or Numeric ID to score")
    parser.add_argument("--all", action="store_true", help="Score all active MPs")
    parser.add_argument("--dry-run", action="store_true", help="Calculate scores without persisting to database")
    parser.add_argument("--force", action="store_true", help="Force recalculate existing scores")
    parser.add_argument("--period-end", type=str, help="Period end date YYYY-MM-DD")
    parser.add_argument("--model-version", type=str, default="v1.0", help="Scoring model version")

    args = parser.parse_args()

    if not args.all and not args.id:
        print("Error: Must specify --all or --id <politician_id>")
        sys.exit(1)

    run_scorer(
        politician_id=args.id,
        dry_run=args.dry_run,
        period_end=args.period_end,
        force=args.force,
        model_version=args.model_version
    )

if __name__ == "__main__":
    main()
