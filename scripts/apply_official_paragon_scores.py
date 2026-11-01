#!/usr/bin/env python3
"""Apply cited parliamentary metrics through the PARAGON engine and patch the export.

Methodology v2 adds a labelled vote-share proxy for Përfaqësimi, lexicon stability
for Narrativa, committee attendance from the minute header, and a Kuvendi-wide
benchmark. An overall score is published only when the engine's coverage rule is met.
"""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

from scripts.collect_kuvendi_rollcalls import fold
from services.paragon_scoring_engine import calculate_paragon_dimensions

ROOT = Path(__file__).resolve().parent.parent
EXPORT = ROOT / "db" / "paragon_scores_export.json"
ROLL = ROOT / "data" / "official" / "kuvendi_rollcall_scores.json"
FLOOR = ROOT / "data" / "official" / "plenary_assertiveness.json"
COMMITTEE = ROOT / "data" / "official" / "committee_governance.json"
ZONES = ROOT / "data" / "official" / "kqz_2025_zone_results.json"
NARRATIVE = ROOT / "data" / "official" / "narrative_consistency.json"
MIN_ROLLCALLS = 8
MIN_ALIGNMENT = 5
MIN_MEETINGS = 1
PARTY_CODE = {
    "PS": "PS",
    "PD-AMSH": "PD-AMSH",
    "PSD": "PSD",
    "Mundësia": "MUNDËSIA",
    "Nisma Shqipëria Bëhet": "NISMA-SHB",
    "Lëvizja Bashkë": "BASHKË",
}
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
    "Indeksi është i pjesshëm kur mbulimi është nën 7/7. Pikët vijnë nga fletët e votimit të Kuvendit "
    "(prezenca, pjesëmarrja në votim, kohezioni), nga procesverbalet plenare, nga lista e pjesëmarrjes "
    "në krye të procesverbalit të komisionit, nga pjesa e votave të subjektit në qark (metodë proxy, jo "
    "votë parapëlqyese) dhe nga qëndrueshmëria tematike e fjalimeve sipas leksikut të publikuar. "
    "Shenja e horoskopit nuk pikëzohet."
)
FULL_NOTICE = (
    "Indeksi mbulon të shtatë dimensionet PARAGON® nga burime zyrtare të cituara. "
    "Shenja e horoskopit nuk pikëzohet."
)
DIM_KEYS = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"]


def pct(part: int, whole: int) -> float:
    return round(100.0 * part / whole, 1)


def bare_name(name: str) -> str:
    return fold(re.sub(r"\s*\([^)]*\)\s*", " ", name or "").strip())


def mean_or_none(values: list[float]):
    if len(values) < 2:
        return None
    return round(sum(values) / len(values), 1)


def main():
    export = json.loads(EXPORT.read_text(encoding="utf-8"))
    roll = json.loads(ROLL.read_text(encoding="utf-8"))
    floor = json.loads(FLOOR.read_text(encoding="utf-8")) if FLOOR.exists() else {"people": {}}
    committee = json.loads(COMMITTEE.read_text(encoding="utf-8")) if COMMITTEE.exists() else {"people": {}}
    zones_doc = json.loads(ZONES.read_text(encoding="utf-8")) if ZONES.exists() else {"zones": {}}
    narrative = json.loads(NARRATIVE.read_text(encoding="utf-8")) if NARRATIVE.exists() else {"people": {}}
    people = roll["people"]
    speakers = floor.get("people") or {}
    committees = committee.get("people") or {}
    narratives = narrative.get("people") or {}
    zones = zones_doc.get("zones") or {}
    shares = {}
    for profile in export["profiles"]:
        if profile.get("parliamentaryStatus") != "active_mp":
            continue
        zone = zones.get(profile.get("electoralZone") or "")
        code = PARTY_CODE.get(profile.get("party") or "")
        subject = (zone or {}).get("subjects", {}).get(code) if zone else None
        if not subject:
            continue
        shares[bare_name(profile["name"])] = {
            "share": round(float(subject["share"]), 1),
            "votes": subject["votes"],
            "mandates": subject["mandates"],
            "magnitude": zone["magnitude"],
            "zone": profile["electoralZone"],
            "code": code,
            "sourceUrl": zones_doc.get("sourceUrl"),
            "decisionUrl": zone.get("kqzDecisionUrl"),
        }
    methods_by_id = {}
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
                "ku krye-lista 'Marrin pjesë' ose 'Mungojnë' e procesverbalit e emërton, para hapjes së mbledhjes."
            )
        share = shares.get(bare_name(profile["name"]))
        if share:
            metrics["subject_vote_share_pct"] = share["share"]
            notes.append(
                f"Përfaqësimi (proxy): {share['code']} në {share['zone']} ka {share['share']}% të votave "
                f"të vlefshme ({share['votes']} vota, {share['mandates']}/{share['magnitude']} mandate). "
                "Nuk është votë parapëlqyese."
            )
        story = narratives.get(profile["id"]) or {}
        if story.get("score") is not None and int(story.get("classifiedTurns") or 0) >= 5:
            metrics["narrative_topic_consistency_pct"] = story["score"]
            notes.append(
                f"Narrativa (proxy, {story.get('method') or narrative.get('method')}): "
                f"{story['dominantTurns']}/{story['classifiedTurns']} ndërhyrje të klasifikuara bien te tema "
                f"'{story['dominantTopic']}' sipas leksikut narrative_lexicon_v1."
            )
        dimensions, composite, envelope = calculate_paragon_dimensions(metrics)
        methods_by_id[profile["id"]] = {
            "D3": {
                "method": "kqz_subject_vote_share_v1",
                "proxy": True,
                "methodNote": "Metodë proxy: pjesa e votave të subjektit zgjedhor në qark, jo vota parapëlqyese e kandidatit. docs/PARAGON_METHODOLOGY_v2.md",
            } if metrics.get("subject_vote_share_pct") is not None else None,
            "D5": {
                "method": "committee_header_attendance_v2",
                "proxy": False,
                "methodNote": "Pjesëmarrja në listën e hapjes së procesverbalit të komisionit.",
            } if metrics.get("committee_meeting_attendance_pct") is not None else None,
            "D7": {
                "method": "narrative_topic_stability_v1",
                "proxy": True,
                "methodNote": "Metodë proxy: qëndrueshmëria e temës sipas leksikut të publikuar narrative_lexicon_v1, jo përputhje fjalim-votim. docs/PARAGON_METHODOLOGY_v2.md",
            } if metrics.get("narrative_topic_consistency_pct") is not None else None,
        }
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
        if metrics.get("subject_vote_share_pct") is not None and share:
            evidence.append({
                "dimensionKey": "D3",
                "sourceTitle": "Lidhja 1 — rezultati përfundimtar për zonën zgjedhore (proxy)",
                "sourceUrl": share["sourceUrl"],
                "sourcePublisher": "Tabela e rezultatit përfundimtar; mandatet kryqëzohen me njoftimin e KQZ",
                "retrievedAt": zones_doc.get("retrievedAt") or RETRIEVED,
                "excerpt": next(note for note in notes if note.startswith("Përfaqësimi")),
                "decisionUrl": share["decisionUrl"],
                "proxy": True,
            })
        if metrics.get("narrative_topic_consistency_pct") is not None:
            story_urls = story.get("sourceUrls") or []
            evidence.append({
                "dimensionKey": "D7",
                "sourceTitle": "Procesverbal plenar — leksik narrative_lexicon_v1 (proxy)",
                "sourceUrl": story_urls[0] if story_urls else SOURCE_PAGE,
                "sourcePublisher": PUBLISHER,
                "retrievedAt": narrative.get("retrievedAt") or RETRIEVED,
                "excerpt": next(note for note in notes if note.startswith("Narrativa")),
                "proxy": True,
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
    grouped = {}
    for profile in export["profiles"]:
        dims = profile.get("paragonDimensions") or [None] * 7
        group = profile.get("parliamentaryGroup") or profile.get("party") or ""
        grouped.setdefault(group, {name: [] for name in DIM_ORDER})
        for name, value in zip(DIM_ORDER, dims):
            if isinstance(value, (int, float)):
                buckets[name].append(float(value))
                grouped[group][name].append(float(value))
    cohort = {name: mean_or_none(vals) for name, vals in buckets.items()}
    peer_composite = mean_or_none(values)
    for profile in export["profiles"]:
        dims = profile.get("paragonDimensions") or [None] * 7
        group = profile.get("parliamentaryGroup") or profile.get("party") or ""
        group_vals = grouped.get(group) or {}
        readings = {}
        for key, name, value in zip(DIM_KEYS, DIM_ORDER, dims):
            meta = (methods_by_id.get(profile["id"]) or {}).get(key) or {}
            readings[key] = {
                "score": value,
                "peerAverage": mean_or_none(group_vals.get(name) or []),
                "benchmark": cohort[name],
                "method": meta.get("method"),
                "proxy": True if meta.get("proxy") else False if meta else None,
                "methodNote": meta.get("methodNote"),
            }
        profile["dimensionReadings"] = readings
        profile["peerAverage"] = peer_composite if isinstance(profile.get("composite"), (int, float)) else None
        profile["benchmark"] = peer_composite

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
    awaiting = []
    if dim_counts["Përfaqësimi"]:
        active.append("Përfaqësimi (proxy: pjesa e votave të subjektit në qark)")
    else:
        awaiting.append("Përfaqësimi")
    if dim_counts["Qeverisja"]:
        active.append("Qeverisja (lista e hapjes së procesverbalit të komisionit)")
    else:
        awaiting.append("Qeverisja")
    if dim_counts["Narrativa"]:
        active.append("Narrativa (proxy: leksik narrative_lexicon_v1)")
    else:
        awaiting.append("Narrativa")
    export["dimensionCohort"] = {
        name: {"mean": cohort[name], "n": len(buckets[name]), "benchmark": cohort[name]}
        for name in DIM_ORDER
    }
    export["compositeCohort"] = {"mean": peer_composite, "n": len(values), "benchmark": None}
    export["paragon_inputs"] = {
        "active": active,
        "awaiting": awaiting,
        "assertivenessMethod": "docs/PARAGON_ASERTIVITETI.md",
        "remainingDimensionsMethod": "docs/PARAGON_REMAINING_DIMENSIONS.md",
        "methodologyV2": "docs/PARAGON_METHODOLOGY_v2.md",
        "representationMethod": "kqz_subject_vote_share_v1",
        "narrativeMethod": "narrative_topic_stability_v1",
        "benchmark": "Unweighted mean of published scores for that dimension across all scored profiles in Legislature XI.",
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
