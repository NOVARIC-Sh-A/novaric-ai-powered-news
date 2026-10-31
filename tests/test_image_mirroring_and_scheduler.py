"""
NOVARIC® PARAGON Politicians Pipeline P1 Hardening Test Suite
Verifies:
1. Official photos (photo audit 2026-10-31):
   - Photos load directly from the official source (Kuvendi / Wikimedia Commons local copy)
   - No media.novaric.al copies, no NOVARIC mock photos
   - Profiles without an official photo are null + 'Në pritje të të dhënave / Awaiting data'
   - Strict idempotency (0 mutations on re-run)
2. Weekly Cloud Scheduler Spec & Retry/Backoff:
   - Cron schedule 0 4 * * 1 (weekly Monday 04:00 UTC)
   - Retry count 5, exponential backoff (min 10s, max 300s)
   - Authenticated POST /api/v1/politicians/ingest
3. Alerting Engine:
   - Final failure alerting on unhandled exceptions
   - Material membership change signal when active-MP count deltas vs previous run
4. Cards Contract Immutability:
   - 104 cards, 10 required schema fields preserved after deploys
"""

import unittest
import asyncio
import sqlite3
import os
import json
from datetime import datetime, timezone

from ingestion.image_mirror import (
    ImageMirrorWorker,
    resolve_official_photo,
    is_missing_or_generic_photo,
)
from utils.official_photo import AWAITING_PHOTO_STATUS, is_official_photo_source
from ingestion.alerts import (
    dispatch_pipeline_alert,
    record_run_and_evaluate_alerts,
    format_slack_blocks,
    AlertType,
    AlertSeverity,
    pipeline_alert_audit_log
)
from api.v1.politicians import (
    list_politician_cards,
    trigger_kuvendi_ingest,
    Request,
    HTTPException
)


class TestOfficialPhotos(unittest.TestCase):
    """Verifies official-source photos, awaiting-data state and idempotency."""

    def test_official_url_is_kept(self):
        url = "https://kuvendiwebfiles.blob.core.windows.net/webfiles/202509/x.jpg"
        photo_url, source_url, is_pending = resolve_official_photo("vip1", url, url, "Edi Rama")
        self.assertEqual(photo_url, url)
        self.assertFalse(is_pending)

    def test_novaric_copies_and_mock_photos_are_rejected(self):
        for bad in (
            "https://media.novaric.al/politicians/vip999.jpg",
            "https://novaric.co/wp-content/uploads/2025/11/MaleProfile.jpg",
            "https://novaricstorage.blob.core.windows.net/media/Profile-Photos/X.jfif",
            None,
        ):
            photo_url, _src, is_pending = resolve_official_photo("vip999", bad, None, "Nobody")
            self.assertIsNone(photo_url, bad)
            self.assertTrue(is_pending)
            self.assertTrue(is_missing_or_generic_photo(bad))

    def test_export_contains_only_official_photos(self):
        with open("db/paragon_scores_export.json", encoding="utf-8") as f:
            profiles = json.load(f)["profiles"]
        self.assertEqual(len(profiles), 279)
        pending = [p for p in profiles if p.get("photoPending")]
        self.assertEqual(len(pending), 23)
        for p in profiles:
            if p.get("photoPending"):
                self.assertIsNone(p.get("imageUrl"))
                self.assertEqual(p.get("photoStatus"), AWAITING_PHOTO_STATUS)
            else:
                url = p["imageUrl"]
                self.assertTrue(url.startswith("/politicians/official/") or is_official_photo_source(url), url)
            self.assertNotIn("media.novaric.al/politicians", json.dumps(p))

    def test_commons_replacements_recorded_with_licence(self):
        import csv
        with open("data/official/politician_field_sources.csv", encoding="utf-8", newline="") as f:
            rows = list(csv.DictReader(f))
        text = json.dumps(rows)
        for vip in ("vip19", "vip54", "vip232"):
            self.assertTrue(os.path.exists(f"public/politicians/official/{vip}.jpg"))
        self.assertIn("commons.wikimedia.org", text)
        self.assertIn("2026-10-31", text)
        self.assertIn("CC BY", text)

    def test_image_worker_idempotency(self):
        worker = ImageMirrorWorker()
        worker.execute_all(dry_run=False)
        res2 = worker.execute_all(dry_run=False)
        self.assertEqual(res2["sqlite"]["updated_count"], 0)
        self.assertEqual(res2["json_export"]["updated_count"], 0)

    def test_cards_endpoint_serves_official_or_awaiting(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            resp = loop.run_until_complete(list_politician_cards())
            cards = resp["cards"] if isinstance(resp, dict) else resp
            self.assertEqual(len(cards), 104)
            for c in cards:
                img = c.get("imageUrl")
                if img is None:
                    self.assertEqual(c.get("photoStatus"), AWAITING_PHOTO_STATUS)
                else:
                    self.assertTrue(img.startswith("/politicians/official/") or is_official_photo_source(img), img)
        finally:
            loop.close()


class TestCloudSchedulerAndAlerting(unittest.TestCase):
    """Verifies Cloud Scheduler configuration and alerting triggers."""

    def test_cloud_scheduler_spec_file(self):
        """Verifies JSON and YAML scheduler specifications adhere to requirements."""
        json_path = "config/cloud_scheduler_politicians.json"
        yaml_path = "config/cloud_scheduler_politicians.yaml"
        self.assertTrue(os.path.exists(json_path), f"{json_path} must exist")
        self.assertTrue(os.path.exists(yaml_path), f"{yaml_path} must exist")

        with open(json_path, "r") as f:
            spec = json.load(f)

        self.assertEqual(spec["schedule"], "0 4 * * 1", "Weekly schedule must be Monday 04:00 UTC")
        self.assertEqual(spec["timeZone"], "Etc/UTC")
        self.assertEqual(spec["httpTarget"]["httpMethod"], "POST")
        self.assertIn("/api/v1/politicians/ingest", spec["httpTarget"]["uri"])

        retry = spec["retryConfig"]
        self.assertEqual(retry["retryCount"], 5, "Must configure 5 retries")
        self.assertEqual(retry["minBackoffDuration"], "10s")
        self.assertEqual(retry["maxBackoffDuration"], "300s")
        self.assertEqual(retry["maxDoublings"], 5)

    def test_membership_change_alert_trigger(self):
        """Triggers CRITICAL alert when active-MP count changes vs previous run."""
        # Test simulated run with a delta of -1 MP (resignation / deactivation)
        test_conn = sqlite3.connect(":memory:")
        test_conn.row_factory = sqlite3.Row
        cur = test_conn.cursor()
        cur.execute("""
            CREATE TABLE ingestion_runs (
                id TEXT PRIMARY KEY,
                source TEXT,
                started_at TEXT,
                finished_at TEXT,
                records_new INTEGER,
                records_updated INTEGER,
                active_mp_count INTEGER,
                active_mp_delta INTEGER,
                status TEXT,
                error TEXT,
                metadata TEXT
            )
        """)
        # Insert a baseline run with 140 active MPs
        cur.execute("""
            INSERT INTO ingestion_runs 
            (id, source, started_at, finished_at, records_new, records_updated, active_mp_count, active_mp_delta, status)
            VALUES ('run_baseline', 'kuvendi.odata', '2026-09-08T04:00:00Z', '2026-09-08T04:05:00Z', 140, 0, 140, 0, 'ok')
        """)
        test_conn.commit()

        # Run 2: Active MP count drops to 139 (delta = -1)
        eval_res = record_run_and_evaluate_alerts(
            conn_or_client=test_conn,
            run_id="run_delta_test",
            source="kuvendi.odata",
            started_at="2026-09-15T04:00:00Z",
            finished_at="2026-09-15T04:05:00Z",
            records_new=139,
            records_updated=1,
            status="ok",
            active_mp_count=139,
            error=None,
            dry_run=False
        )

        self.assertEqual(eval_res["active_mp_delta"], -1)
        self.assertTrue(eval_res["membership_change_detected"])
        self.assertEqual(len(eval_res["alerts_triggered"]), 1)

        alert = eval_res["alerts_triggered"][0]
        self.assertEqual(alert["alert_type"], AlertType.MEMBERSHIP_CHANGE_DETECTED)
        self.assertEqual(alert["severity"], AlertSeverity.CRITICAL)
        self.assertIn("140 to 139", alert["message"])

        test_conn.close()

    def test_final_failure_alert_trigger(self):
        """Triggers CRITICAL alert when an ingestion job encounters fatal failure."""
        eval_res = record_run_and_evaluate_alerts(
            conn_or_client=None,
            run_id="run_failure_test",
            source="kuvendi.odata",
            started_at="2026-09-15T04:00:00Z",
            finished_at="2026-09-15T04:01:00Z",
            records_new=0,
            records_updated=0,
            status="failed",
            active_mp_count=140,
            error="Upstream Kuvendi OData gateway timeout 504",
            dry_run=False
        )

        self.assertEqual(len(eval_res["alerts_triggered"]), 1)
        alert = eval_res["alerts_triggered"][0]
        self.assertEqual(alert["alert_type"], AlertType.FINAL_FAILURE)
        self.assertEqual(alert["severity"], AlertSeverity.CRITICAL)
        self.assertIn("Upstream Kuvendi OData gateway timeout", alert["message"])


class TestCardsContractPreservation(unittest.TestCase):
    """Verifies that the GET /api/v1/politicians/cards contract is strictly unchanged after P1 deploys."""

    REQUIRED_CARD_FIELDS = {
        "id", "numericId", "name", "category", "imageUrl",
        "shortBio", "detailedBio", "dynamicScore", "last_updated",
        "paragonDimensions"
    }

    def test_cards_contract_schema_preserved(self):
        """All 104 cards conform to the authoritative schema contract."""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            resp = loop.run_until_complete(list_politician_cards())
            cards = resp["cards"] if isinstance(resp, dict) else resp

            self.assertEqual(len(cards), 104)

            for idx, card in enumerate(cards):
                for field in self.REQUIRED_CARD_FIELDS:
                    self.assertIn(
                        field,
                        card,
                        f"Card index {idx} ({card.get('id')}) missing mandatory contract field: {field}"
                    )
                # Numeric checks
                self.assertIsInstance(card["numericId"], int)
                self.assertTrue(card["id"].startswith("vip"))
                # Bio strings
                # No mock data: bios are either real text or null (awaiting data)
                for bio in ("shortBio", "detailedBio"):
                    self.assertTrue(card[bio] is None or len(card[bio]) > 0)
        finally:
            loop.close()


if __name__ == "__main__":
    unittest.main()
