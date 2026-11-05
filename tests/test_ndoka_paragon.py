"""Nard Ndoka is scored only by the shared PARAGON engine and the same official inputs."""
import json
import unittest
from pathlib import Path

from scripts.apply_official_paragon_scores import (
    MIN_ALIGNMENT,
    MIN_MEETINGS,
    MIN_ROLLCALLS,
    bare_name,
)
from services.paragon_scoring_engine import calculate_paragon_dimensions

ROOT = Path(__file__).resolve().parents[1]


class TestNdokaParagon(unittest.TestCase):
    def test_the_shared_engine_has_no_official_inputs_for_vip282(self):
        export = json.loads((ROOT / "db" / "paragon_scores_export.json").read_text(encoding="utf-8"))
        profile = next(item for item in export["profiles"] if item["id"] == "vip282")
        roll = json.loads((ROOT / "data" / "official" / "kuvendi_rollcall_scores.json").read_text(encoding="utf-8"))
        floor = json.loads((ROOT / "data" / "official" / "plenary_assertiveness.json").read_text(encoding="utf-8"))
        committee = json.loads((ROOT / "data" / "official" / "committee_governance.json").read_text(encoding="utf-8"))
        narrative = json.loads((ROOT / "data" / "official" / "narrative_consistency.json").read_text(encoding="utf-8"))
        zones = json.loads((ROOT / "data" / "official" / "kqz_2025_zone_results.json").read_text(encoding="utf-8"))

        stats = (roll.get("people") or {}).get("vip282") or {}
        speech = (floor.get("people") or {}).get("vip282") or {}
        meeting = (committee.get("people") or {}).get("vip282") or {}
        story = (narrative.get("people") or {}).get("vip282") or {}
        metrics = {}
        if stats.get("rollcalls", 0) >= MIN_ROLLCALLS:
            metrics["committee_attendance_pct"] = 1
        if speech.get("interventions"):
            metrics["plenary_interventions"] = speech["interventions"]
        if int(meeting.get("meetings") or 0) >= MIN_MEETINGS:
            metrics["committee_meeting_attendance_pct"] = 1
        if stats.get("comparable", 0) >= MIN_ALIGNMENT:
            metrics["party_vote_alignment_pct"] = 1
        zone = (zones.get("zones") or {}).get(profile.get("electoralZone") or "")
        self.assertIsNone(zone)
        if story.get("score") is not None and int(story.get("classifiedTurns") or 0) >= 5:
            metrics["narrative_topic_consistency_pct"] = story["score"]

        self.assertEqual(metrics, {})
        dimensions, composite, envelope = calculate_paragon_dimensions(metrics)
        self.assertEqual(list(dimensions.values()), [None, None, None, None, None, None, None])
        self.assertIsNone(composite)
        self.assertEqual(envelope["_composite_status"], "insufficient_coverage")
        self.assertEqual(profile["composite"], None)
        self.assertEqual(profile["paragonDimensions"], [None, None, None, None, None, None, None])
        self.assertNotIn(bare_name(profile["name"]), {})


if __name__ == "__main__":
    unittest.main()
