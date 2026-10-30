"""Dossier loader returns stored rows and leaves every missing section empty."""

import sqlite3
import unittest

from db.init_db import init_schema
from services.politician_dossier import load_sqlite_dossier
from api.v1.politicians import normalize_dimensions


class TestPoliticianDossier(unittest.TestCase):
    def setUp(self):
        self.conn = sqlite3.connect(":memory:")
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA foreign_keys = ON;")
        init_schema(self.conn)
        self.conn.execute(
            """
            INSERT INTO politicians (
                id, numeric_id, full_name, primary_role, parliamentary_status,
                party_short, parliament_email, electoral_zone, date_of_birth, place_of_birth
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "p-0002",
                2,
                "Sali Berisha",
                "Member of Parliament & Chair of PD",
                "active_mp",
                "PD-AMSH",
                "s.berisha@parlament.al",
                "Tiranë",
                "1944-10-15",
                "Tropojë",
            ),
        )
        self.conn.execute(
            "INSERT INTO scoring_weights (model_version, weights) VALUES (?, ?)",
            ("v1.0", "{}"),
        )
        self.conn.commit()

    def tearDown(self):
        self.conn.close()

    def test_empty_sections_stay_empty(self):
        dossier = load_sqlite_dossier(self.conn, {"id": "p-0002", "full_name": "Sali Berisha", "party_short": "PD-AMSH", "parliament_email": "s.berisha@parlament.al", "parliamentary_status": "active_mp"})
        self.assertEqual(dossier["bio"]["email"], "s.berisha@parlament.al")
        self.assertIsNone(dossier["bio"]["education"])
        self.assertIsNone(dossier["bio"]["profession"])
        self.assertEqual(dossier["promises"], [])
        self.assertEqual(dossier["consistencyFlags"], [])
        self.assertEqual(dossier["votingRecord"], [])
        self.assertEqual(dossier["assetTimeline"], [])
        self.assertIsNone(dossier["assetDeclaration"])
        self.assertIsNone(dossier["rhetoric"])
        self.assertEqual(dossier["evidence"], [])
        self.assertEqual(dossier["rightOfReply"], [])
        self.assertEqual(dossier["scoreRevisions"], [])
        self.assertNotIn("zodiac", str(dossier).lower())

    def test_stored_vote_asset_and_score_are_returned(self):
        self.conn.execute("ALTER TABLE votes ADD COLUMN source_url TEXT")
        self.conn.execute(
            "INSERT INTO votes (id, vote_date, title, passed, source_url) VALUES (?, ?, ?, ?, ?)",
            ("vote-1", "2026-03-01", "Projektligji për buxhetin", 1, "https://parlament.al/votime/1"),
        )
        self.conn.execute(
            "INSERT INTO vote_records (id, vote_id, politician_id, vote_choice) VALUES (?, ?, ?, ?)",
            ("vr-1", "vote-1", "p-0002", "yes"),
        )
        self.conn.execute(
            """
            INSERT INTO asset_declarations (id, politician_id, decl_year, on_time, source_url, submitted_date)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            ("decl-1", "p-0002", 2024, 1, "https://www.ildkpki.al/decl/1", "2024-03-20"),
        )
        self.conn.execute(
            """
            INSERT INTO speeches (id, politician_id, speech_date, word_count, agenda_item, speech_text, sentiment)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            ("sp-1", "p-0002", "2026-02-02", 1200, "Buxheti", "Fjala në seancë.", 0.2),
        )
        self.conn.execute(
            """
            INSERT INTO paragon_scores (
                politician_id, computed_at, period_start, period_end, model_version,
                d1_policy_engagement, composite, metrics
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            ("p-0002", "2026-09-01T00:00:00Z", "2026-01-01", "2026-09-01", "v1.0", 64.0, 64.0, '{"D1": {"completeness": 40, "confidence_low": 58, "confidence_high": 70}}'),
        )
        self.conn.execute(
            """
            CREATE TABLE paragon_evidence (
                id TEXT PRIMARY KEY,
                person_id TEXT,
                dimension_key TEXT,
                metric_key TEXT,
                source_url TEXT,
                source_title TEXT,
                source_publisher TEXT,
                evidence_excerpt TEXT,
                retrieved_at TEXT
            )
            """
        )
        self.conn.execute(
            """
            INSERT INTO paragon_evidence (
                id, person_id, dimension_key, metric_key, source_url, source_title, source_publisher, evidence_excerpt, retrieved_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            ("ev-1", "p-0002", "D1", "attendance", "https://parlament.al/mbledhjet", "Mbledhjet", "Kuvendi", "Pjesëmarrje e regjistruar", "2026-09-01"),
        )
        self.conn.commit()

        politician = dict(self.conn.execute("SELECT * FROM politicians WHERE id = ?", ("p-0002",)).fetchone())
        dossier = load_sqlite_dossier(self.conn, politician)

        self.assertEqual(dossier["votingRecord"][0]["subject"], "Projektligji për buxhetin")
        self.assertEqual(dossier["votingRecord"][0]["choice"], "yes")
        self.assertEqual(dossier["votingRecord"][0]["sourceUrl"], "https://parlament.al/votime/1")
        self.assertEqual(dossier["assetTimeline"][0]["year"], 2024)
        self.assertTrue(dossier["assetTimeline"][0]["onTime"])
        self.assertEqual(dossier["assetDeclaration"]["year"], 2024)
        self.assertEqual(dossier["rhetoric"]["speechCount"], 1)
        self.assertEqual(dossier["rhetoric"]["excerpts"][0]["excerpt"], "Fjala në seancë.")
        self.assertEqual(dossier["evidence"][0]["dimensionKey"], "D1")
        self.assertEqual(dossier["scoreRevisions"][0]["composite"], 64.0)
        self.assertEqual(dossier["dimensionReadings"]["D1"]["completeness"], 40)
        self.assertEqual(dossier["dimensionReadings"]["D1"]["confidenceLow"], 58)
        self.assertEqual(dossier["dimensionReadings"]["D1"]["confidenceHigh"], 70)
        self.assertEqual(len(dossier["recentActivity"]) >= 1, True)

    def test_normalize_dimensions_does_not_invent_scores(self):
        dims = normalize_dimensions(None)
        self.assertEqual(len(dims), 7)
        self.assertTrue(all(item["score"] is None for item in dims))
        self.assertTrue(all(item["peerAverage"] is None for item in dims))
        self.assertTrue(all(item["benchmark"] is None for item in dims))

        stored = normalize_dimensions({"d1_policy_engagement": 61.5, "d2_accountability": None})
        by_key = {item["key"]: item for item in stored}
        self.assertEqual(by_key["D1"]["score"], 61.5)
        self.assertIsNone(by_key["D2"]["score"])
        self.assertIsNone(by_key["D7"]["score"])


if __name__ == "__main__":
    unittest.main()
