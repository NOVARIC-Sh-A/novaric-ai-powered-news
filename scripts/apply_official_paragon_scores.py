#!/usr/bin/env python3
"""Apply roll-call metrics through the PARAGON engine and patch the export.

Only plenary presence, vote participation, and party-line alignment are scored.
Every other dimension stays null. An overall score is published only when the
engine's coverage rule is met.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from services.paragon_scoring_engine import calculate_paragon_dimensions

ROOT = Path(__file__).resolve().parent.parent
EXPORT = ROOT / "db" / "paragon_scores_export.json"
ROLL = ROOT / "data" / "official" / "kuvendi_rollcall_scores.json"
MIN_ROLLCALLS = 8
MIN_ALIGNMENT = 5
RETRIEVED = "2026-10-31"
SOURCE_PAGE = "https://kuvendiapi.azurewebsites.net/api/dokumentet"
PUBLISHER = "Kuvendi i Shqipërisë"
DIM_ORDER = [
    "Angazhimi Politik",
    "Llogaridhënia",
    "Përfaqësimi",
    "Asertiviteti",
    "Qeverisja",
    "Kohësioni",
    "Narrativa",
]
AWAITING = "Në pritje të të dhënave / Awaiting data"
NOTICE = (
    "Indeksi është i pjesshëm. Pikët e publikuara vijnë nga fletët e votimit të Kuvendit "
    "(prezenca në seancë, pjesëmarrja në votim, kohezioni me grupin). Dimensionet pa burim "
    "zyrtar mbeten në pritje dhe nuk hyjnë në indeks. Shenja e horoskopit nuk pikëzohet."
)


def pct(part: int, whole: int) -> float:
    return round(100.0 * part / whole, 1)


def main():
    export = json.loads(EXPORT.read_text(encoding="utf-8"))
    roll = json.loads(ROLL.read_text(encoding="utf-8"))
    people = roll["people"]
    now = datetime.now(timezone.utc).isoformat()
    scored = 0
    dim_counts = {name: 0 for name in DIM_ORDER}
    values = []

    for profile in export["profiles"]:
        stats = people.get(profile["id"]) or {}
        metrics = {}
        notes = []
        if stats.get("rollcalls", 0) >= MIN_ROLLCALLS:
            metrics["committee_attendance_pct"] = pct(stats["present"], stats["rollcalls"])
            metrics["attendance_sample_size"] = stats["rollcalls"]
            metrics["attended_sessions"] = stats["present"]
            metrics["absent_sessions"] = stats["rollcalls"] - stats["present"]
            metrics["vote_participation_pct"] = pct(stats["participated"], stats["rollcalls"])
            notes.append(
                f"Prezenca {stats['present']}/{stats['rollcalls']} dhe pjesëmarrja në votim "
                f"{stats['participated']}/{stats['rollcalls']} nga fletët 'Votimi i deputetëve' "
                f"të depozituara që nga {roll['since']}."
            )
            if stats.get("comparable", 0) >= MIN_ALIGNMENT:
                metrics["party_vote_alignment_pct"] = pct(stats["aligned"], stats["comparable"])
                notes.append(
                    f"Kohezioni {stats['aligned']}/{stats['comparable']} vota me shumicën e grupit "
                    "parlamentar të regjistruar në të njëjtën fletë."
                )
        dimensions, composite, envelope = calculate_paragon_dimensions(metrics)
        dim_list = [dimensions[name] for name in DIM_ORDER]
        scored_dims = sum(1 for value in dim_list if value is not None)
        for name, value in zip(DIM_ORDER, dim_list):
            if value is not None:
                dim_counts[name] += 1
        profile["paragonDimensions"] = dim_list if scored_dims else None
        profile["composite"] = composite
        profile["dynamicScore"] = int(round(composite)) if composite is not None else None
        profile["compositeDelta"] = None
        profile["periodEnd"] = RETRIEVED if composite is not None else None
        profile["coverage"] = f"{scored_dims}/7"
        profile["coverageWeight"] = envelope.get("_coverage_weight")
        profile["compositeStatus"] = envelope.get("_composite_status")
        profile["scoring_suspended"] = False
        profile["ratings_enabled"] = True
        profile["scoring_suspension_notice"] = None
        profile["scoring_note"] = NOTICE
        sources = stats.get("sourceUrls") or []
        profile["paragonSources"] = {
            "publisher": PUBLISHER,
            "pageUrl": SOURCE_PAGE,
            "retrievedAt": RETRIEVED,
            "documentType": roll.get("documentType"),
            "sampleUrls": sources,
            "rollcalls": stats.get("rollcalls", 0),
            "notes": " ".join(notes) if notes else AWAITING,
        }
        evidence = []
        if metrics.get("committee_attendance_pct") is not None:
            evidence.append({
                "dimensionKey": "D1",
                "sourceTitle": "Fletë votimi — prezenca në seancë",
                "sourceUrl": sources[0] if sources else SOURCE_PAGE,
                "sourcePublisher": PUBLISHER,
                "retrievedAt": RETRIEVED,
                "excerpt": notes[0] if notes else None,
            })
        if metrics.get("vote_participation_pct") is not None:
            evidence.append({
                "dimensionKey": "D2",
                "sourceTitle": "Fletë votimi — pjesëmarrja në votim",
                "sourceUrl": sources[0] if sources else SOURCE_PAGE,
                "sourcePublisher": PUBLISHER,
                "retrievedAt": RETRIEVED,
                "excerpt": notes[0] if notes else None,
            })
        if metrics.get("party_vote_alignment_pct") is not None:
            evidence.append({
                "dimensionKey": "D6",
                "sourceTitle": "Fletë votimi — kohezioni i grupit",
                "sourceUrl": sources[0] if sources else SOURCE_PAGE,
                "sourcePublisher": PUBLISHER,
                "retrievedAt": RETRIEVED,
                "excerpt": notes[-1] if notes else None,
            })
        profile["evidence"] = evidence
        field_sources = profile.setdefault("fieldSources", {})
        field_sources["paragonScore"] = {
            "value": composite,
            "coverage": profile["coverage"],
            "sourceUrl": SOURCE_PAGE,
            "retrievedAt": RETRIEVED,
            "licence": "Official parliamentary record",
            "notes": profile["paragonSources"]["notes"],
        }
        if composite is not None:
            scored += 1
            values.append(composite)
        profile["last_updated"] = now

    export["ratings_enabled"] = True
    export["scoring_suspended"] = False
    export["scoring_suspension_notice"] = None
    export["scoring_note"] = NOTICE
    export["scored_count"] = scored
    export["computed_at"] = now
    export["period_end"] = RETRIEVED
    export["model_version"] = "v1.0"
    export["paragon_inputs"] = {
        "active": ["Angazhimi Politik (prezenca në seancë)", "Llogaridhënia (pjesëmarrja në votim)", "Kohësioni (përputhja me grupin)"],
        "awaiting": ["Përfaqësimi", "Asertiviteti", "Qeverisja", "Narrativa"],
        "blocked": roll.get("blocked", []),
        "votesUsed": roll.get("votesUsed"),
        "filesListed": roll.get("filesListed"),
        "minimumRollcalls": MIN_ROLLCALLS,
    }
    EXPORT.write_text(json.dumps(export, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = {
        "profiles": len(export["profiles"]),
        "withOverall": scored,
        "dimensions": dim_counts,
        "min": min(values) if values else None,
        "max": max(values) if values else None,
        "mean": round(sum(values) / len(values), 1) if values else None,
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
