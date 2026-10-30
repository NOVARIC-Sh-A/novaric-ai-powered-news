"""
Load a politician dossier from tables that already exist.

Missing tables, missing columns, and empty result sets stay empty.
Nothing in this module invents scores, emails, education, promises, or replies.
Zodiac / star sign is display-only and is never read or returned here.
"""

from __future__ import annotations

import json
import logging
import sqlite3
from typing import Any, Dict, Iterable, List, Optional

logger = logging.getLogger("novaric.dossier")

DIMENSION_KEYS = ("D1", "D2", "D3", "D4", "D5", "D6", "D7")
SCORE_COLUMNS = {
    "D1": "d1_policy_engagement",
    "D2": "d2_accountability",
    "D3": "d3_representation",
    "D4": "d4_assertiveness",
    "D5": "d5_governance",
    "D6": "d6_party_cohesion",
    "D7": "d7_narrative",
}

OPTIONAL_TABLES = {
    "promises": ("promises", "political_promises", "pledges"),
    "consistency": ("consistency_flags", "statement_vote_flags"),
    "replies": ("politician_replies", "right_of_reply", "profile_replies"),
}


def empty_dossier() -> Dict[str, Any]:
    return {
        "bio": {
            "fullName": None,
            "education": None,
            "profession": None,
            "email": None,
            "party": None,
            "activeStatus": None,
        },
        "promises": [],
        "consistencyFlags": [],
        "votingRecord": [],
        "assetTimeline": [],
        "assetDeclaration": None,
        "rhetoric": None,
        "affiliations": [],
        "evidence": [],
        "rightOfReply": [],
        "scoreRevisions": [],
        "recentActivity": [],
        "mandates": [],
        "dimensionReadings": {},
    }


def attach_dossier(payload: Dict[str, Any], dossier: Dict[str, Any]) -> Dict[str, Any]:
    """Copy dossier fields onto a profile payload and fill gaps in dimension objects."""
    bio = dossier.get("bio") or empty_dossier()["bio"]
    payload["bio"] = bio
    for key in (
        "promises",
        "consistencyFlags",
        "votingRecord",
        "assetTimeline",
        "affiliations",
        "evidence",
        "rightOfReply",
        "scoreRevisions",
        "recentActivity",
        "mandates",
    ):
        value = dossier.get(key)
        payload[key] = value if isinstance(value, list) else []
    payload["assetDeclaration"] = dossier.get("assetDeclaration")
    payload["rhetoric"] = dossier.get("rhetoric")
    readings = dossier.get("dimensionReadings") if isinstance(dossier.get("dimensionReadings"), dict) else {}
    payload["dimensionReadings"] = readings
    for list_key in ("paragonAnalysis", "dimensions"):
        dims = payload.get(list_key)
        if isinstance(dims, list):
            merge_dimension_readings(dims, readings)
    return payload


def merge_dimension_readings(dimensions: List[Dict[str, Any]], readings: Dict[str, Any]) -> None:
    for dim in dimensions:
        if not isinstance(dim, dict):
            continue
        key = str(dim.get("key") or "").upper()
        extra = readings.get(key) if isinstance(readings, dict) else None
        if not isinstance(extra, dict):
            continue
        for field in ("score", "peerAverage", "benchmark", "completeness", "confidenceLow", "confidenceHigh"):
            if dim.get(field) is None and extra.get(field) is not None:
                dim[field] = extra[field]


def load_sqlite_dossier(conn: sqlite3.Connection, politician: Dict[str, Any]) -> Dict[str, Any]:
    dossier = empty_dossier()
    if not politician:
        return dossier
    pol = dict(politician)
    pid = pol.get("id")
    _apply_identity(dossier, pol)
    if not pid:
        return dossier

    _apply_candidacy_bio(dossier, _rows(conn, "candidacies", "politician_id", pid))
    dossier["votingRecord"] = _voting_record(conn, pid)
    dossier["assetTimeline"], dossier["assetDeclaration"] = _assets(conn, pid)
    dossier["rhetoric"] = _rhetoric(conn, pid)
    dossier["recentActivity"] = _activity(conn, pid, dossier["votingRecord"])
    dossier["mandates"] = _mandates(conn, pid)
    dossier["affiliations"] = _affiliations(conn, pid, pol, dossier["bio"].get("party"))
    dossier["evidence"] = _evidence(conn, pid)
    dossier["scoreRevisions"] = _score_revisions(conn, pid)
    dossier["dimensionReadings"] = _dimension_readings(conn, pid)
    dossier["promises"] = _generic_rows(conn, OPTIONAL_TABLES["promises"], pid, _promise_from_row)
    dossier["consistencyFlags"] = _generic_rows(conn, OPTIONAL_TABLES["consistency"], pid, _consistency_from_row)
    dossier["rightOfReply"] = _generic_rows(conn, OPTIONAL_TABLES["replies"], pid, _reply_from_row)
    return dossier


def load_supabase_dossier(client: Any, politician: Dict[str, Any]) -> Dict[str, Any]:
    dossier = empty_dossier()
    if not politician:
        return dossier
    pol = dict(politician)
    pid = pol.get("id")
    _apply_identity(dossier, pol)
    if client is None or not pid:
        return dossier

    _apply_candidacy_bio(dossier, _sb(client, "candidacies", {"politician_id": pid}))
    vote_rows = _sb(client, "vote_records", {"politician_id": pid})
    votes_by_id = {}
    vote_ids = [row.get("vote_id") for row in vote_rows if row.get("vote_id")]
    if vote_ids:
        for vote in _sb_in(client, "votes", "id", vote_ids):
            votes_by_id[vote.get("id")] = vote
    dossier["votingRecord"] = [_vote_item(rec, votes_by_id.get(rec.get("vote_id")) or {}) for rec in vote_rows]
    dossier["votingRecord"] = [item for item in dossier["votingRecord"] if item]

    declarations = _sb(client, "asset_declarations", {"politician_id": pid})
    decl_ids = [row.get("id") for row in declarations if row.get("id")]
    assets_by_decl: Dict[Any, List[Dict[str, Any]]] = {}
    for asset in _sb_in(client, "declaration_assets", "declaration_id", decl_ids):
        assets_by_decl.setdefault(asset.get("declaration_id"), []).append(asset)
    timeline = []
    for decl in declarations:
        item = _asset_item(decl, assets_by_decl.get(decl.get("id")) or [])
        if item:
            timeline.append(item)
    timeline.sort(key=lambda item: item.get("year") or 0, reverse=True)
    dossier["assetTimeline"] = timeline
    dossier["assetDeclaration"] = _declaration_from_timeline(timeline)

    speeches = _sb(client, "speeches", {"politician_id": pid})
    mentions = _mentions_for(client, pid)
    dossier["rhetoric"] = _rhetoric_from(speeches, mentions)
    dossier["recentActivity"] = _activity_from(speeches, dossier["votingRecord"], mentions)
    dossier["mandates"] = _mandates_from(
        _sb(client, "parliamentary_mandates", {"person_id": pid})
        or _sb(client, "parliamentary_mandates", {"politician_id": pid}),
        _sb(client, "role_history", {"person_id": pid}) or _sb(client, "role_history", {"politician_id": pid}),
    )
    dossier["affiliations"] = _affiliations_from(
        pol,
        dossier["bio"].get("party"),
        _sb(client, "role_history", {"person_id": pid}) or _sb(client, "role_history", {"politician_id": pid}),
        _sb(client, "contract_links", {"politician_id": pid}),
    )
    evidence_rows = _sb(client, "paragon_evidence", {"person_id": pid}) or _sb(
        client, "paragon_evidence", {"politician_id": pid}
    )
    dossier["evidence"] = [item for item in (_evidence_item(row) for row in evidence_rows) if item]
    score_rows = _sb(client, "paragon_scores", {"politician_id": pid})
    dossier["scoreRevisions"] = _revisions_from(score_rows)
    dim_rows = _sb(client, "paragon_dimension_scores", {"person_id": pid}) or _sb(
        client, "paragon_dimension_scores", {"politician_id": pid}
    )
    dossier["dimensionReadings"] = _readings_from(dim_rows, score_rows[:1] if score_rows else [])
    dossier["promises"] = _generic_supabase(client, OPTIONAL_TABLES["promises"], pid, _promise_from_row)
    dossier["consistencyFlags"] = _generic_supabase(client, OPTIONAL_TABLES["consistency"], pid, _consistency_from_row)
    dossier["rightOfReply"] = _generic_supabase(client, OPTIONAL_TABLES["replies"], pid, _reply_from_row)
    return dossier


def identity_dossier(profile: Dict[str, Any]) -> Dict[str, Any]:
    """Identity fields already on a profile export. Does not copy placeholder bios."""
    dossier = empty_dossier()
    _apply_identity(dossier, profile or {})
    party = dossier["bio"].get("party")
    if party:
        dossier["affiliations"] = [{"kind": "party", "label": party, "detail": None, "url": None}]
    return dossier


def _apply_identity(dossier: Dict[str, Any], pol: Dict[str, Any]) -> None:
    status = _first(pol, "parliamentary_status", "parliamentaryStatus")
    active = pol.get("is_active_mp")
    if active is None and "activeStatus" in pol:
        active = pol.get("activeStatus")
    if isinstance(active, str):
        active = active.strip().lower() in {"1", "true", "yes"}
    if active is not None:
        active_status = bool(active)
    elif status == "active_mp":
        active_status = True
    elif status:
        active_status = False
    else:
        active_status = None

    email = _blank_to_none(_first(pol, "parliament_email", "parliamentEmail"))
    education = _blank_to_none(_first(pol, "education"))
    profession = _blank_to_none(_first(pol, "profession"))
    dossier["bio"] = {
        "fullName": _blank_to_none(_first(pol, "full_name", "fullName", "name")),
        "education": education,
        "profession": profession,
        "email": email,
        "party": _blank_to_none(_first(pol, "party_short", "party")),
        "activeStatus": active_status,
    }


def _apply_candidacy_bio(dossier: Dict[str, Any], rows: Iterable[Dict[str, Any]]) -> None:
    bio = dossier["bio"]
    ordered = sorted(list(rows or []), key=lambda row: row.get("election_year") or row.get("electionYear") or 0, reverse=True)
    for row in ordered:
        if not bio.get("education"):
            education = row.get("education")
            if isinstance(education, dict):
                education = education.get("summary") or education.get("level") or education.get("degree")
            bio["education"] = _blank_to_none(education)
        if not bio.get("profession"):
            bio["profession"] = _blank_to_none(row.get("profession"))
        if bio.get("education") and bio.get("profession"):
            break


def _voting_record(conn: sqlite3.Connection, pid: str) -> List[Dict[str, Any]]:
    records = _rows(conn, "vote_records", "politician_id", pid)
    if not records:
        return []
    votes = {row.get("id"): row for row in _rows_by_ids(conn, "votes", [row.get("vote_id") for row in records])}
    items = [_vote_item(rec, votes.get(rec.get("vote_id")) or {}) for rec in records]
    return [item for item in items if item]


def _vote_item(record: Dict[str, Any], vote: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    choice = _first(record, "vote_choice", "choice")
    subject = _first(vote, "title", "vote_subject", "subject")
    if not choice and not subject:
        return None
    with_party = record.get("voted_with_party")
    if with_party is None:
        with_party = record.get("with_party")
    passed = vote.get("passed")
    return {
        "id": str(record.get("id") or record.get("vote_id") or ""),
        "subject": subject,
        "votedAt": _first(vote, "vote_date", "voted_at", "votedAt"),
        "choice": choice,
        "passed": None if passed is None else bool(passed),
        "sourceUrl": _first(vote, "source_url", "sourceUrl"),
        "withParty": None if with_party is None else bool(with_party),
    }


def _assets(conn: sqlite3.Connection, pid: str):
    declarations = _rows(conn, "asset_declarations", "politician_id", pid)
    if not declarations:
        return [], None
    decl_ids = [row.get("id") for row in declarations]
    grouped: Dict[Any, List[Dict[str, Any]]] = {}
    for asset in _rows_by_ids(conn, "declaration_assets", decl_ids, column="declaration_id"):
        grouped.setdefault(asset.get("declaration_id"), []).append(asset)
    timeline = []
    for decl in declarations:
        item = _asset_item(decl, grouped.get(decl.get("id")) or [])
        if item:
            timeline.append(item)
    timeline.sort(key=lambda item: item.get("year") or 0, reverse=True)
    return timeline, _declaration_from_timeline(timeline)


def _asset_item(decl: Dict[str, Any], assets: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    year = decl.get("decl_year") if decl.get("decl_year") is not None else decl.get("year")
    if year is None:
        return None
    on_time = decl.get("on_time")
    if on_time is None:
        on_time = decl.get("onTime")
    categories = []
    for asset in assets:
        value = asset.get("value_low")
        if value is None:
            value = asset.get("value")
        categories.append({
            "category": asset.get("category"),
            "detail": asset.get("description") or asset.get("detail"),
            "value": value,
        })
    return {
        "year": int(year),
        "filedAt": _first(decl, "submitted_date", "filed_at", "filedAt"),
        "onTime": None if on_time is None else bool(on_time),
        "sourceUrl": _first(decl, "source_url", "source_pdf_url", "sourceUrl"),
        "categories": [cat for cat in categories if cat.get("category")],
    }


def _declaration_from_timeline(timeline: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not timeline:
        return None
    latest = timeline[0]
    return {
        "year": latest.get("year"),
        "onTime": latest.get("onTime"),
        "categories": latest.get("categories") or [],
        "sourceUrl": latest.get("sourceUrl"),
        "declaredDate": latest.get("filedAt"),
    }


def _rhetoric(conn: sqlite3.Connection, pid: str) -> Optional[Dict[str, Any]]:
    speeches = _rows(conn, "speeches", "politician_id", pid)
    mentions = _mentions_sqlite(conn, pid)
    return _rhetoric_from(speeches, mentions)


def _rhetoric_from(speeches: List[Dict[str, Any]], mentions: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    excerpts = []
    sentiments = []
    words = []
    for speech in speeches or []:
        excerpt = _blank_to_none(_first(speech, "speech_text", "excerpt", "agenda_item"))
        if excerpt:
            excerpts.append({
                "date": _first(speech, "speech_date", "spoke_at", "spokeAt"),
                "excerpt": excerpt,
                "sourceUrl": _first(speech, "source_url", "sourceUrl"),
                "topic": _blank_to_none(_first(speech, "agenda_item", "key_topics")),
            })
        sentiment = _num(speech.get("sentiment"))
        if sentiment is not None:
            sentiments.append(sentiment)
        count = _num(speech.get("word_count"))
        if count is not None:
            words.append(count)
    for mention in mentions or []:
        excerpt = _blank_to_none(_first(mention, "headline", "context_span", "title"))
        if excerpt:
            excerpts.append({
                "date": _first(mention, "published_at", "publishedAt"),
                "excerpt": excerpt,
                "sourceUrl": _first(mention, "url", "source_url"),
                "topic": _blank_to_none(mention.get("outlet_name") or mention.get("outlet_slug")),
            })
        sentiment = _num(mention.get("sentiment"))
        if sentiment is not None:
            sentiments.append(sentiment)
    if not excerpts and not sentiments:
        return None
    return {
        "speechCount": len(speeches or []),
        "mentionCount": len(mentions or []),
        "averageSentiment": round(sum(sentiments) / len(sentiments), 3) if sentiments else None,
        "averageWordCount": round(sum(words) / len(words), 1) if words else None,
        "excerpts": excerpts[:12],
    }


def _activity(conn: sqlite3.Connection, pid: str, voting: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    speeches = _rows(conn, "speeches", "politician_id", pid)
    mentions = _mentions_sqlite(conn, pid)
    return _activity_from(speeches, voting, mentions)


def _activity_from(speeches: List[Dict[str, Any]], voting: List[Dict[str, Any]], mentions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    items = []
    for speech in speeches or []:
        title = _blank_to_none(_first(speech, "agenda_item", "key_topics", "excerpt"))
        if not title:
            continue
        items.append({
            "date": _first(speech, "speech_date", "spoke_at") or "",
            "type": "speech",
            "title": title,
            "source": _first(speech, "source_url", "sourceUrl") or "Kuvendi",
            "detail": _blank_to_none(_first(speech, "speech_text", "excerpt")),
        })
    for vote in voting or []:
        if not vote.get("subject"):
            continue
        items.append({
            "date": vote.get("votedAt") or "",
            "type": "vote",
            "title": vote.get("subject"),
            "source": vote.get("sourceUrl") or "Kuvendi",
            "detail": vote.get("choice"),
        })
    for mention in mentions or []:
        title = _blank_to_none(_first(mention, "headline", "title"))
        if not title:
            continue
        items.append({
            "date": _first(mention, "published_at", "publishedAt") or "",
            "type": "media",
            "title": title,
            "source": mention.get("url") or mention.get("outlet_name") or "Media",
            "detail": None,
        })
    items.sort(key=lambda item: item.get("date") or "", reverse=True)
    return items[:30]


def _mandates(conn: sqlite3.Connection, pid: str) -> List[Dict[str, Any]]:
    parliamentary = _rows(conn, "parliamentary_mandates", "person_id", pid) or _rows(
        conn, "parliamentary_mandates", "politician_id", pid
    )
    roles = _rows(conn, "role_history", "person_id", pid) or _rows(conn, "role_history", "politician_id", pid)
    return _mandates_from(parliamentary, roles)


def _mandates_from(parliamentary: List[Dict[str, Any]], roles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    items = []
    for row in parliamentary or []:
        start = _first(row, "mandate_start", "start_date")
        end = _first(row, "mandate_end", "end_date")
        current = row.get("is_active")
        if current is None:
            current = row.get("is_current")
        items.append({
            "period": _period(start, end),
            "role": _first(row, "current_parliamentary_group", "official_title", "legislature") or row.get("parliamentary_status"),
            "current": bool(current) if current is not None else not end,
        })
    for row in roles or []:
        start = row.get("start_date")
        end = row.get("end_date")
        current = row.get("is_current")
        title = row.get("official_title") or row.get("role_type")
        if not title:
            continue
        items.append({
            "period": _period(start, end),
            "role": title if not row.get("institution") else f"{title} · {row.get('institution')}",
            "current": bool(current) if current is not None else not end,
        })
    return items


def _affiliations(conn: sqlite3.Connection, pid: str, pol: Dict[str, Any], party: Optional[str]) -> List[Dict[str, Any]]:
    roles = _rows(conn, "role_history", "person_id", pid) or _rows(conn, "role_history", "politician_id", pid)
    contracts = _rows(conn, "contract_links", "politician_id", pid)
    return _affiliations_from(pol, party, roles, contracts)


def _affiliations_from(pol: Dict[str, Any], party: Optional[str], roles: List[Dict[str, Any]], contracts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    items = []
    if party:
        items.append({"kind": "party", "label": party, "detail": None, "url": None})
    social = pol.get("social")
    if isinstance(social, str):
        social = _parse_json(social)
    if isinstance(social, dict):
        for kind, url in social.items():
            if url:
                items.append({"kind": str(kind), "label": str(kind), "detail": None, "url": str(url)})
    for row in roles or []:
        label = row.get("official_title") or row.get("role_type")
        if not label:
            continue
        items.append({
            "kind": "role",
            "label": label,
            "detail": row.get("institution"),
            "url": row.get("source_url"),
        })
    for row in contracts or []:
        label = row.get("entity_name") or row.get("title")
        if not label:
            continue
        items.append({
            "kind": row.get("link_type") or "contract",
            "label": label,
            "detail": row.get("link_type"),
            "url": None,
        })
    return items


def _evidence(conn: sqlite3.Connection, pid: str) -> List[Dict[str, Any]]:
    rows = _rows(conn, "paragon_evidence", "person_id", pid) or _rows(conn, "paragon_evidence", "politician_id", pid)
    return [item for item in (_evidence_item(row) for row in rows) if item]


def _evidence_item(row: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    title = _blank_to_none(_first(row, "source_title", "sourceTitle", "title"))
    url = _blank_to_none(_first(row, "source_url", "sourceUrl", "url"))
    if not title and not url:
        return None
    key = str(_first(row, "dimension_key", "dimensionKey") or "").upper()
    if key and not key.startswith("D"):
        key = ""
    return {
        "id": str(row.get("id") or ""),
        "dimensionKey": key or None,
        "metricKey": _blank_to_none(_first(row, "metric_key", "metricKey")),
        "sourceTitle": title,
        "sourceUrl": url,
        "sourcePublisher": _blank_to_none(_first(row, "source_publisher", "sourcePublisher")),
        "excerpt": _blank_to_none(_first(row, "evidence_excerpt", "excerpt")),
        "retrievedAt": _first(row, "retrieved_at", "retrievedAt"),
    }


def _score_revisions(conn: sqlite3.Connection, pid: str) -> List[Dict[str, Any]]:
    rows = _rows(conn, "paragon_scores", "politician_id", pid)
    return _revisions_from(rows)


def _revisions_from(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    revisions = []
    for row in rows or []:
        dimensions = {}
        any_score = False
        for key, column in SCORE_COLUMNS.items():
            value = _num(row.get(column))
            if value is None:
                value = _num((row.get("dimensions") or {}).get(key) if isinstance(row.get("dimensions"), dict) else None)
            dimensions[key] = value
            if value is not None:
                any_score = True
        composite = _num(row.get("composite"))
        if composite is not None:
            any_score = True
        if not any_score:
            continue
        revisions.append({
            "computedAt": _first(row, "computed_at", "computedAt", "calculated_at"),
            "periodEnd": _first(row, "period_end", "periodEnd"),
            "modelVersion": _first(row, "model_version", "modelVersion"),
            "composite": composite,
            "dimensions": dimensions,
        })
    revisions.sort(key=lambda item: item.get("computedAt") or "", reverse=True)
    return revisions


def _dimension_readings(conn: sqlite3.Connection, pid: str) -> Dict[str, Any]:
    rows = _rows(conn, "paragon_dimension_scores", "person_id", pid) or _rows(
        conn, "paragon_dimension_scores", "politician_id", pid
    )
    scores = _rows(conn, "paragon_scores", "politician_id", pid)
    scores.sort(key=lambda row: str(row.get("computed_at") or row.get("period_end") or ""), reverse=True)
    return _readings_from(rows, scores[:1])


def _readings_from(rows: List[Dict[str, Any]], score_rows: List[Dict[str, Any]]) -> Dict[str, Any]:
    readings: Dict[str, Any] = {}
    for row in rows or []:
        key = str(row.get("dimension_key") or row.get("key") or "").upper()
        if key not in SCORE_COLUMNS:
            continue
        reading = {
            "score": _num(row.get("score")),
            "peerAverage": _num(_first(row, "peer_average", "peerAverage")),
            "benchmark": _num(row.get("benchmark")),
            "completeness": _num(_first(row, "coverage_percentage", "completeness")),
            "confidenceLow": _num(_first(row, "confidence_low", "confidenceLow")),
            "confidenceHigh": _num(_first(row, "confidence_high", "confidenceHigh")),
        }
        if any(value is not None for value in reading.values()):
            readings[key] = reading
    if score_rows:
        metrics = score_rows[0].get("metrics")
        if isinstance(metrics, str):
            metrics = _parse_json(metrics)
        if isinstance(metrics, dict):
            for key in DIMENSION_KEYS:
                blob = metrics.get(key)
                if not isinstance(blob, dict):
                    continue
                current = readings.get(key) or {
                    "score": None,
                    "peerAverage": None,
                    "benchmark": None,
                    "completeness": None,
                    "confidenceLow": None,
                    "confidenceHigh": None,
                }
                for field, aliases in (
                    ("completeness", ("completeness", "coverage_percentage", "coverage")),
                    ("confidenceLow", ("confidence_low", "confidenceLow")),
                    ("confidenceHigh", ("confidence_high", "confidenceHigh")),
                ):
                    if current.get(field) is None:
                        for alias in aliases:
                            value = blob.get(alias)
                            if isinstance(value, dict):
                                continue
                            number = _num(value)
                            if number is not None:
                                current[field] = number
                                break
                if any(value is not None for value in current.values()):
                    readings[key] = current
    return readings


def _mentions_sqlite(conn: sqlite3.Connection, pid: str) -> List[Dict[str, Any]]:
    links = _rows(conn, "mention_entities", "politician_id", pid)
    if not links:
        return []
    mentions = {row.get("id"): row for row in _rows_by_ids(conn, "media_mentions", [row.get("mention_id") for row in links])}
    merged = []
    for link in links:
        mention = dict(mentions.get(link.get("mention_id")) or {})
        mention.update({k: v for k, v in link.items() if v is not None})
        merged.append(mention)
    return merged


def _mentions_for(client: Any, pid: str) -> List[Dict[str, Any]]:
    links = _sb(client, "mention_entities", {"politician_id": pid})
    if not links:
        return []
    mentions = {row.get("id"): row for row in _sb_in(client, "media_mentions", "id", [row.get("mention_id") for row in links])}
    merged = []
    for link in links:
        mention = dict(mentions.get(link.get("mention_id")) or {})
        mention.update({k: v for k, v in link.items() if v is not None})
        merged.append(mention)
    return merged


def _generic_rows(conn, tables: Iterable[str], pid: str, mapper) -> List[Dict[str, Any]]:
    items = []
    for table in tables:
        for row in _rows(conn, table, "politician_id", pid):
            item = mapper(row)
            if item:
                items.append(item)
        if items:
            break
    return items


def _generic_supabase(client, tables: Iterable[str], pid: str, mapper) -> List[Dict[str, Any]]:
    for table in tables:
        rows = _sb(client, table, {"politician_id": pid})
        items = [item for item in (mapper(row) for row in rows) if item]
        if items:
            return items
    return []


def _promise_from_row(row: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    text = _blank_to_none(_first(row, "text", "promise", "statement", "title"))
    if not text:
        return None
    return {
        "id": str(row.get("id") or ""),
        "text": text,
        "status": _blank_to_none(_first(row, "status", "state")),
        "date": _first(row, "promised_at", "date", "created_at"),
        "sourceUrl": _first(row, "source_url", "url"),
    }


def _consistency_from_row(row: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    statement = _blank_to_none(_first(row, "statement", "statement_text", "text"))
    vote = _blank_to_none(_first(row, "vote", "vote_subject", "vote_choice"))
    if not statement and not vote:
        return None
    return {
        "id": str(row.get("id") or ""),
        "statement": statement,
        "vote": vote,
        "flag": _blank_to_none(_first(row, "flag", "status", "conflict")),
        "sourceUrl": _first(row, "source_url", "url"),
    }


def _reply_from_row(row: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    statement = _blank_to_none(_first(row, "statement", "body", "text", "reply"))
    if not statement:
        return None
    return {
        "id": str(row.get("id") or ""),
        "submittedAt": _first(row, "submitted_at", "created_at", "published_at"),
        "statement": statement,
        "status": _blank_to_none(row.get("status")),
        "sourceUrl": _first(row, "source_url", "url"),
    }


def _rows(conn: sqlite3.Connection, table: str, column: str, value: Any) -> List[Dict[str, Any]]:
    if value is None or not _table_exists(conn, table):
        return []
    columns = _columns(conn, table)
    if column not in columns:
        return []
    try:
        cursor = conn.execute(f"SELECT * FROM {table} WHERE {column} = ?", (value,))
        return [dict(row) for row in cursor.fetchall()]
    except sqlite3.Error as exc:
        logger.info("Dossier read skipped for %s: %s", table, exc)
        return []


def _rows_by_ids(conn: sqlite3.Connection, table: str, ids: List[Any], column: str = "id") -> List[Dict[str, Any]]:
    clean = [item for item in ids if item is not None]
    if not clean or not _table_exists(conn, table) or column not in _columns(conn, table):
        return []
    placeholders = ",".join("?" for _ in clean)
    try:
        cursor = conn.execute(f"SELECT * FROM {table} WHERE {column} IN ({placeholders})", clean)
        return [dict(row) for row in cursor.fetchall()]
    except sqlite3.Error as exc:
        logger.info("Dossier read skipped for %s: %s", table, exc)
        return []


def _table_exists(conn: sqlite3.Connection, table: str) -> bool:
    try:
        row = conn.execute(
            "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
            (table,),
        ).fetchone()
    except sqlite3.Error:
        return False
    return row is not None


def _columns(conn: sqlite3.Connection, table: str) -> set:
    try:
        rows = conn.execute(f"PRAGMA table_info({table})").fetchall()
    except sqlite3.Error:
        return set()
    names = set()
    for row in rows:
        if isinstance(row, sqlite3.Row):
            names.add(row["name"])
        else:
            names.add(row[1])
    return names


def _sb(client: Any, table: str, filters: Dict[str, Any], limit: int = 200) -> List[Dict[str, Any]]:
    if client is None:
        return []
    try:
        query = client.table(table).select("*")
        for key, value in filters.items():
            if value is None:
                return []
            query = query.eq(key, value)
        result = query.limit(limit).execute()
        data = getattr(result, "data", None)
        return data if isinstance(data, list) else []
    except Exception as exc:
        logger.info("Dossier read skipped for %s: %s", table, exc)
        return []


def _sb_in(client: Any, table: str, column: str, values: List[Any]) -> List[Dict[str, Any]]:
    clean = [item for item in values if item is not None]
    if client is None or not clean:
        return []
    try:
        result = client.table(table).select("*").in_(column, clean).execute()
        data = getattr(result, "data", None)
        return data if isinstance(data, list) else []
    except Exception as exc:
        logger.info("Dossier read skipped for %s: %s", table, exc)
        return []


def _first(row: Dict[str, Any], *names: str) -> Any:
    if not isinstance(row, dict):
        return None
    for name in names:
        if name in row and row[name] not in (None, ""):
            return row[name]
    return None


def _blank_to_none(value: Any) -> Optional[str]:
    if value is None:
        return None
    if isinstance(value, str):
        stripped = value.strip()
        return stripped or None
    return str(value)


def _num(value: Any) -> Optional[float]:
    if value is None or isinstance(value, bool) or isinstance(value, dict):
        return None
    if isinstance(value, str) and not value.strip():
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if number != number:
        return None
    return number


def _parse_json(value: str) -> Any:
    try:
        return json.loads(value)
    except (TypeError, ValueError):
        return None


def _period(start: Any, end: Any) -> Optional[str]:
    start_text = _blank_to_none(start)
    end_text = _blank_to_none(end)
    if start_text and end_text:
        return f"{start_text} — {end_text}"
    return start_text or end_text
