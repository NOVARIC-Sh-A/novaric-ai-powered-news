"""
NOVARIC® PARAGON Politicians Pipeline Hardening Test Suite (P0)
Verifies:
1. VIP ID Idempotency (stable Kuvendi Person ID keying, 0 new mints on double re-run, vip125-vip210 range protection).
2. Deactivate-Missing Pass (reconciliation, dry-run mode, soft deactivation, no hard deletes).
3. RLS Security Test Matrix (anon read-only, ingest 401/403/200, anon write denied).
4. Authoritative Cards Contract (104 cards, 10 required fields).
"""

import unittest
import asyncio
import sqlite3
import os
import json
from datetime import datetime, timezone

from ingestion.identity_resolution import (
    IdempotentVipIdAssigner,
    generate_stable_numeric_id,
    CONSUMED_VIP_IDS
)
from ingestion.kuvendi_odata import (
    parse_kuvendi_mp,
    deactivate_missing_mps,
    CANONICAL_POLITICIAN_MAP
)
from api.v1.politicians import (
    list_politician_cards,
    trigger_kuvendi_ingest,
    Request,
    HTTPException
)


class TestVipIdIdempotency(unittest.TestCase):
    """Verifies that VIP IDs are keyed deterministically on stable Kuvendi Person ID."""

    def test_double_rerun_mints_zero_new_vip_ids(self):
        """Proves that running the assigner twice over the same Kuvendi dataset mints 0 new IDs."""
        sample_members = [
            {"Id": 501, "Emri": "Besnik", "Mbiemri": "Bregu", "Atesia": "Gjergj"},
            {"Id": 502, "Emri": "Lindita", "Mbiemri": "Nikolla", "Atesia": "Llesh"},
            {"Id": 503, "Emri": "Gazment", "Mbiemri": "Bardhi", "Atesia": "Kujtim"},
            {"Id": 504, "Emri": "Agron", "Mbiemri": "Shehaj", "Atesia": "Syrja"},
            {"Id": 505, "Emri": "Fatmir", "Mbiemri": "Mediu", "Atesia": "Qani"}
        ]

        assigner = IdempotentVipIdAssigner(canonical_map=CANONICAL_POLITICIAN_MAP)

        # First run: assign IDs
        first_run_ids = {}
        new_mints_run_1 = 0
        for m in sample_members:
            full_name = f"{m['Emri']} {m['Mbiemri']}"
            nid, is_new = assigner.get_or_assign_vip_id(full_name=full_name, kuvendi_person_id=m["Id"])
            first_run_ids[m["Id"]] = nid
            if is_new:
                new_mints_run_1 += 1

        # Second run (exact re-run simulation)
        second_run_ids = {}
        new_mints_run_2 = 0
        for m in sample_members:
            full_name = f"{m['Emri']} {m['Mbiemri']}"
            nid, is_new = assigner.get_or_assign_vip_id(full_name=full_name, kuvendi_person_id=m["Id"])
            second_run_ids[m["Id"]] = nid
            if is_new:
                new_mints_run_2 += 1

        # Assert zero new mints on re-run
        self.assertEqual(new_mints_run_2, 0, f"Expected 0 new mints on double re-run, got {new_mints_run_2}")
        self.assertEqual(first_run_ids, second_run_ids, "Assigned IDs must be strictly identical across runs")

    def test_consumed_vip_range_protection(self):
        """Verifies that newly assigned IDs never collide with the consumed vip125-vip210 range."""
        assigner = IdempotentVipIdAssigner(canonical_map=CANONICAL_POLITICIAN_MAP)
        
        # Verify 125..210 are marked as consumed
        for consumed_id in range(125, 211):
            self.assertIn(consumed_id, assigner.consumed_ids)

        # Generate IDs for 50 arbitrary new names
        for i in range(1, 51):
            nid, _ = assigner.get_or_assign_vip_id(
                full_name=f"Deputet Testues {i}",
                kuvendi_person_id=9000 + i
            )
            # Must not overwrite or collide with consumed range 125..210
            self.assertNotIn(
                nid,
                CONSUMED_VIP_IDS,
                f"Generated ID {nid} collided with pre-allocated consumed range vip125-vip210"
            )


class TestDeactivateMissingPass(unittest.TestCase):
    """Verifies that active MPs absent from status=1 Kuvendi fetch are soft-deactivated."""

    def setUp(self):
        # In-memory SQLite database mimicking production politicians table
        self.conn = sqlite3.connect(":memory:")
        self.conn.row_factory = sqlite3.Row
        cur = self.conn.cursor()
        cur.execute("""
        CREATE TABLE politicians (
            id TEXT PRIMARY KEY,
            numeric_id INTEGER,
            full_name TEXT,
            is_active_mp INTEGER DEFAULT 1,
            active_until TEXT,
            identifiers TEXT
        );
        """)
        # Seed 3 active MPs
        cur.execute("INSERT INTO politicians VALUES ('p1', 1, 'Edi Rama', 1, NULL, '{}')")
        cur.execute("INSERT INTO politicians VALUES ('p2', 2, 'Sali Berisha', 1, NULL, '{}')")
        cur.execute("INSERT INTO politicians VALUES ('p3', 3, 'Deputet Që Ka Dhënë Dorëheqjen', 1, NULL, '{}')")
        self.conn.commit()

    def tearDown(self):
        self.conn.close()

    def test_deactivate_missing_dry_run_mode(self):
        """Dry-run must detect missing MP without performing any database mutations."""
        # Latest status=1 fetch contains only Rama and Berisha (p3 is missing)
        latest_status_1_fetch = [
            {"full_name": "Edi Rama", "numeric_id": 1, "kuvendi_raw": {"Status": 1}},
            {"full_name": "Sali Berisha", "numeric_id": 2, "kuvendi_raw": {"Status": 1}}
        ]

        report = deactivate_missing_mps(
            fetched_active_members=latest_status_1_fetch,
            conn_or_client=self.conn,
            dry_run=True,
            run_timestamp="2026-09-14T00:00:00Z"
        )

        self.assertTrue(report["dry_run"])
        self.assertEqual(report["deactivated_count"], 1)
        self.assertEqual(report["deactivated_mps"][0]["id"], "p3")

        # Verify DB was NOT mutated in dry-run mode
        cur = self.conn.cursor()
        cur.execute("SELECT is_active_mp, active_until FROM politicians WHERE id = 'p3'")
        row = cur.fetchone()
        self.assertEqual(row["is_active_mp"], 1, "Dry-run must not mutate is_active_mp")
        self.assertIsNone(row["active_until"], "Dry-run must not mutate active_until")

    def test_deactivate_missing_execution_soft_deletes_never_hard_deletes(self):
        """Live pass must update is_active_mp=0 and active_until=timestamp, and NEVER delete rows."""
        latest_status_1_fetch = [
            {"full_name": "Edi Rama", "numeric_id": 1, "kuvendi_raw": {"Status": 1}},
            {"full_name": "Sali Berisha", "numeric_id": 2, "kuvendi_raw": {"Status": 1}}
        ]

        report = deactivate_missing_mps(
            fetched_active_members=latest_status_1_fetch,
            conn_or_client=self.conn,
            dry_run=False,
            run_timestamp="2026-09-14T00:00:00Z"
        )

        self.assertFalse(report["dry_run"])
        self.assertEqual(report["deactivated_count"], 1)

        # Verify DB was updated
        cur = self.conn.cursor()
        cur.execute("SELECT is_active_mp, active_until FROM politicians WHERE id = 'p3'")
        row = cur.fetchone()
        self.assertEqual(row["is_active_mp"], 0)
        self.assertEqual(row["active_until"], "2026-09-14T00:00:00Z")

        # Crucial check: Row STILL exists (never hard-deleted)
        cur.execute("SELECT COUNT(*) FROM politicians")
        total_rows = cur.fetchone()[0]
        self.assertEqual(total_rows, 3, "Pipeline must NEVER hard-delete politicians rows")


class TestRlsSecurityMatrix(unittest.TestCase):
    """
    Verifies the RLS Security Matrix:
    - Anon cards read = 200
    - Ingest no token = 401
    - Ingest wrong token = 401/403
    - Ingest valid token = 200
    - Anon table write = denied
    """

    def test_anon_cards_read_returns_200_and_104_cards(self):
        """Anon user can read /cards endpoint without any auth token, receiving 104 cards."""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        res = loop.run_until_complete(list_politician_cards())
        loop.close()

        self.assertIn("cards", res)
        self.assertEqual(len(res["cards"]), 104, "Must return exactly 104 cards")
        self.assertEqual(res["count"], 104)

        # Check all 10 required fields on every card
        required_fields = [
            "id", "numericId", "name", "category", "party",
            "imageUrl", "shortBio", "detailedBio", "dynamicScore", "last_updated"
        ]
        for idx, card in enumerate(res["cards"]):
            for field in required_fields:
                self.assertIn(field, card, f"Card {idx} ({card.get('name')}) missing required field: {field}")
                self.assertIsNotNone(card[field], f"Card {idx} ({card.get('name')}) has null required field: {field}")

    def test_ingest_no_token_returns_401(self):
        """Unauthenticated call to POST /ingest must fail with HTTP 401."""
        req = Request(headers={})
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        with self.assertRaises(HTTPException) as ctx:
            loop.run_until_complete(trigger_kuvendi_ingest(request=req, dry_run=True))
        loop.close()
        self.assertEqual(ctx.exception.status_code, 401)

    def test_ingest_wrong_token_returns_403(self):
        """Call to POST /ingest with wrong token must fail with HTTP 403."""
        req = Request(headers={"Authorization": "Bearer fraudulent-unauthorized-token"})
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        with self.assertRaises(HTTPException) as ctx:
            loop.run_until_complete(trigger_kuvendi_ingest(request=req, dry_run=True))
        loop.close()
        self.assertEqual(ctx.exception.status_code, 403)

    def test_ingest_valid_token_returns_200(self):
        """Call to POST /ingest with valid token succeeds with HTTP 200."""
        valid_token = os.environ.setdefault("OPS_METRICS_AUTH_TOKEN", "test-only-ops-token")
        req = Request(headers={"Authorization": f"Bearer {valid_token}"})
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        res = loop.run_until_complete(trigger_kuvendi_ingest(request=req, dry_run=True))
        loop.close()

        self.assertEqual(res["status"], "ok")
        self.assertTrue(res["dry_run"])

    def test_rls_sql_migration_syntax_and_policies(self):
        """Verifies that the RLS SQL migration defines correct policies denying anon writes."""
        with open("db/migrations/20260914_rls_profiles_paragon_scores.sql", "r") as f:
            sql = f.read()

        self.assertIn("ALTER TABLE politicians ENABLE ROW LEVEL SECURITY;", sql)
        self.assertIn("ALTER TABLE paragon_scores ENABLE ROW LEVEL SECURITY;", sql)
        self.assertIn("politicians_read_anon", sql)
        self.assertIn("paragon_scores_read_anon", sql)
        self.assertIn("TO service_role", sql)


if __name__ == "__main__":
    unittest.main()
