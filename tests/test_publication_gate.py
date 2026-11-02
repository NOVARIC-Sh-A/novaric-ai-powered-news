import json
import unittest
from pathlib import Path

from services.paragon_publication_gate import NOTICE, BANNER, scores_are_public, load_gate


class TestPublicationGate(unittest.TestCase):
    def test_current_gate_records_the_legacy_authorization(self):
        gate = load_gate()
        self.assertIs(gate.get("authorized"), True)
        self.assertEqual(gate.get("auditState"), "published")
        self.assertEqual(gate.get("authorizedBy"), "Dr Alban Gj. THIKA")
        self.assertTrue(scores_are_public(True))
        self.assertFalse(scores_are_public(False))
        sql = Path("db/migrations/20261101_paragon_legacy_publication.sql").read_text(encoding="utf-8")
        self.assertIn("hist-legacy-publication-2026-11-01", sql)
        self.assertNotIn("UPDATE paragon_scores", sql)
        self.assertNotIn("DELETE FROM", sql)

    def test_only_authorized_published_with_provenance_opens(self):
        open_gate = {"authorized": True, "auditState": "published", "enabled": True}
        self.assertTrue(scores_are_public(True, open_gate))
        self.assertFalse(scores_are_public(False, open_gate))
        self.assertFalse(scores_are_public(True, {"authorized": True, "auditState": "verified", "enabled": True}))
        self.assertFalse(scores_are_public(True, {"authorized": False, "auditState": "published", "enabled": True}))
        self.assertFalse(scores_are_public(True, {}))

    def test_notice_text_is_the_suspension_sentence(self):
        self.assertIn("përkohësisht të pezulluara", NOTICE)
        self.assertEqual(BANNER, "PARAGON® — Audit në proces")

    def test_migration_does_not_delete_score_rows(self):
        sql = Path("db/migrations/20261101_paragon_audit_state.sql").read_text(encoding="utf-8")
        down = Path("db/migrations/20261101_paragon_audit_state_down.sql").read_text(encoding="utf-8")
        self.assertNotIn("DELETE FROM paragon_scores", sql)
        self.assertNotIn("DROP TABLE paragon_scores", sql)
        self.assertNotIn("DROP TABLE politicians", down)
        self.assertIn("paragon_audit_history", sql)

    def test_null_is_not_rewritten_to_zero_in_the_engine_contract(self):
        source = Path("services/paragon_scoring_engine.py").read_text(encoding="utf-8")
        self.assertNotIn("or 0.0  # missing", source)
        gate = json.loads(Path("data/paragon/publication_gate.json").read_text(encoding="utf-8"))
        self.assertIsNone(gate.get("composite"))


if __name__ == "__main__":
    unittest.main()
