"""Same publication rule as services/paragonPublicationGate.ts.

A numeric PARAGON score is public only when the gate file sets authorized
to true, auditState to published, and enabled is not false, and the caller
has provenance for that value. Missing file, bad JSON, or any other state
fails closed.
"""

from __future__ import annotations

import json
from pathlib import Path

NOTICE = (
    "Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e "
    "burimeve dhe integritetit të të dhënave."
)
BANNER = "PARAGON® — Audit në proces"
AUDIT_STATES = ("under_review", "insufficient_coverage", "verified", "published")
GATE_PATH = Path(__file__).resolve().parent.parent / "data" / "paragon" / "publication_gate.json"


def load_gate() -> dict:
    try:
        data = json.loads(GATE_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {"authorized": False, "auditState": "under_review", "enabled": False}
    if not isinstance(data, dict):
        return {"authorized": False, "auditState": "under_review", "enabled": False}
    return data


def scores_are_public(provenance_present: bool, gate: dict | None = None) -> bool:
    current = load_gate() if gate is None else gate
    if not isinstance(current, dict):
        return False
    if current.get("authorized") is not True:
        return False
    if current.get("auditState") != "published":
        return False
    if current.get("enabled") is False:
        return False
    return provenance_present is True
