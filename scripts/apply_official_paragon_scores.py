#!/usr/bin/env python3
"""Apply cited parliamentary metrics through the PARAGON engine and patch the export.

Scored inputs are plenary presence, vote participation, party-line alignment,
named floor activity, and committee attendance from minutes that list the member.
Përfaqësimi and Narrativa stay null until a citable official series exists.
An overall score is published only when the engine's coverage rule is met.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from services.paragon_scoring_engine import calculate_paragon_dimensions

ROOT = Path(__file__).resolve().parent.parent
EXPORT = ROOT / "db" / "paragon_scores_export.json"
ROLL = ROOT / "data" / "official" / "kuvendi_rollcall_scores.json"
FLOOR = ROOT / "data" / "official" / "plenary_assertiveness.json"
COMMITTEE = ROOT / "data" / "official" / "committee_governance.json"
MIN_ROLLCALLS = 8
MIN_ALIGNMENT = 5
MIN_MEETINGS = 3
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
    "(prezenca në seancë, pjesëmarrja në votim, kohezioni me grupin), nga procesverbalet plenare "
    "kur e emërtojnë deputetin, dhe nga pjesëmarrja në mbledhjet e komisioneve kur procesverbali "
    "e liston te 'Marrin pjesë' ose 'Mungojnë'. Përfaqësimi dhe Narrativa mbeten në pritje. "
    "Shenja e horoskopit nuk pikëzohet."
)
FULL_NOTICE = (
    "Indeksi mbulon të shtatë dimensionet PARAGON® nga burime zyrtare të cituara. "
    "Shenja e horoskopit nuk pikëzohet."
)
DIM_KEYS = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"]


def pct(part: int, whole: int) -> float:
    return round(100.0 * part / whole, 1)


def main():
    export = json.loads(EXPORT.read_text(encoding="utf-8"))
    roll = json.loads(ROLL.read_text(encoding="utf-8"))
    floor = json.loads(FLOOR.read_text(encoding="utf-8")) if FLOOR.exists() else {"people": {}}
    committee = json.loads(COMMITTEE.read_text(encoding="utf-8")) if COMMITTEE.exists() else {"people": {}}
    people = roll["people"]
    speakers = floor.get("people") or {}
    committees = committee.get("people") or {}
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
        speech = speakers.get(profile["id"]) or {}
        speech_urls = speech.get("sourceUrls") or []
        if speech.get("interventions"):
            metrics["plenary_interventions"] = speech["interventions"]
            metrics["total_words_spoken"] = speech.get("words") or 0
            notes.append(
                f"Asertiviteti: {speech['interventions']} ndërhyrje në procesverbalet plenare "
                f"({speech.get('words') or 0} fjalë)."
            )
        questions = int(speech.get("questions") or 0)
        interpellations = int(speech.get("interpellations") or 0)
        motions = int(speech.get("motions") or 0)
        if questions or interpellations or motions:
            metrics["parliamentary_questions"] = questions
            metrics["interpellations"] = interpellations
            metrics["motions"] = motions
            notes.append(
                f"Pyetje {questions}, interpelanca {interpellations}, mocione {motions} nga dokumentet e Kuvendit që e emërtojnë."
            )
        meeting = committees.get(profile["id"]) or {}
        meeting_urls = meeting.get("sourceUrls") or []
        if int(meeting.get("meetings") or 0) >= MIN_MEETINGS:
            metrics["committee_meeting_attendance_pct"] = pct(meeting["present"], meeting["meetings"])
            notes.append(
                f"Qeverisja: i pranishëm {meeting['present']}/{meeting['meetings']} mbledhje komisioni "
                "ku procesverbali e liston te 'Marrin pjesë' ose 'Mungojnë'."
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
        profile["scoring_note"] = FULL_NOTICE if scored_dims == 7 else NOTICE
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
        if metrics.get("committee_meeting_attendance_pct") is not None:
            evidence.append({
                "dimensionKey": "D5",
                "sourceTitle": "Procesverbal komisioni — Marrin pjesë / Mungojnë",
                "sourceUrl": meeting_urls[0] if meeting_urls else SOURCE_PAGE,
                "sourcePublisher": PUBLISHER,
                "retrievedAt": committee.get("retrievedAt") or RETRIEVED,
                "excerpt": next(note for note in notes if note.startswith("Qeverisja")),
            })
        if metrics.get("plenary_interventions") or metrics.get("parliamentary_questions") is not None and (
            metrics.get("parliamentary_questions") or metrics.get("interpellations") or metrics.get("motions")
        ):
            evidence.append({
                "dimensionKey": "D4",
                "sourceTitle": "Procesverbal plenar / pyetje / interpelancë / mocion",
                "sourceUrl": speech_urls[0] if speech_urls else SOURCE_PAGE,
                "sourcePublisher": PUBLISHER,
                "retrievedAt": RETRIEVED,
                "excerpt": " ".join(note for note in notes if note.startswith("Asertiviteti") or note.startswith("Pyetje")),
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

    buckets = {name: [] for name in DIM_ORDER}
    for profile in export["profiles"]:
        dims = profile.get("paragonDimensions") or [None] * 7
        for name, value in zip(DIM_ORDER, dims):
            if isinstance(value, (int, float)):
                buckets[name].append(float(value))
    cohort = {
        name: round(sum(vals) / len(vals), 1) if len(vals) >= 2 else None
        for name, vals in buckets.items()
    }
    peer_composite = round(sum(values) / len(values), 1) if len(values) >= 2 else None
    for profile in export["profiles"]:
        dims = profile.get("paragonDimensions") or [None] * 7
        profile["dimensionReadings"] = {
            key: {"score": value, "peerAverage": cohort[name], "benchmark": None}
            for key, name, value in zip(DIM_KEYS, DIM_ORDER, dims)
        }
        profile["peerAverage"] = peer_composite if isinstance(profile.get("composite"), (int, float)) else None
        profile["benchmark"] = None

    export["ratings_enabled"] = True
    export["scoring_suspended"] = False
    export["scoring_suspension_notice"] = None
    export["scoring_note"] = NOTICE
    export["scored_count"] = scored
    export["computed_at"] = now
    export["period_end"] = RETRIEVED
    export["model_version"] = "v1.0"
    active = [
        "Angazhimi Politik (prezenca në seancë)",
        "Llogaridhënia (pjesëmarrja në votim)",
        "Asertiviteti (ndërhyrje, pyetje, interpelanca, mocione)",
        "Kohësioni (përputhja me grupin)",
    ]
    awaiting = ["Përfaqësimi", "Narrativa"]
    if dim_counts["Qeverisja"]:
        active.append("Qeverisja (pjesëmarrja në mbledhjet e komisionit)")
    else:
        awaiting.insert(1, "Qeverisja")
    export["dimensionCohort"] = {
        name: {"mean": cohort[name], "n": len(buckets[name]), "benchmark": None}
        for name in DIM_ORDER
    }
    export["compositeCohort"] = {"mean": peer_composite, "n": len(values), "benchmark": None}
    export["paragon_inputs"] = {
        "active": active,
        "awaiting": awaiting,
        "assertivenessMethod": "docs/PARAGON_ASERTIVITETI.md",
        "remainingDimensionsMethod": "docs/PARAGON_REMAINING_DIMENSIONS.md",
        "blocked": roll.get("blocked", []),
        "votesUsed": roll.get("votesUsed"),
        "filesListed": roll.get("filesListed"),
        "minimumRollcalls": MIN_ROLLCALLS,
        "minimumCommitteeMeetings": MIN_MEETINGS,
        "committeeMinutesUsed": committee.get("minutesUsed"),
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
