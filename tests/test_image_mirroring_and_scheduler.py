"""
NOVARIC® PARAGON Politicians Pipeline P1 Hardening Test Suite
Verifies:
1. Image Mirroring:
   - All Kuvendi photos mirrored to media.novaric.al/politicians/{id}.jpg
   - Original URL preserved as photo_source_url
   - Exactly 2 missing photos mapped to documented placeholder + 'Foto në pritje' path
   - Strict idempotency (0 mutations on re-run)
   - Target 104/104 resolved in production cards view
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
    resolve_mirrored_photo,
    is_missing_or_generic_photo,
    MEDIA_DOMAIN,
    POLITICIANS_MEDIA_BASE,
    PLACEHOLDER_PENDING_URL,
    FOTO_NE_PRITJE_PATH,
    DOCUMENTED_MISSING_PHOTO_VIP_IDS
)
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


class TestImageMirroring(unittest.TestCase):
    """Verifies image mirroring to media.novaric.al, placeholder paths, and idempotency."""

    def test_mirrored_url_structure_and_source_retention(self):
        """Standard profile photo maps to media.novaric.al and retains original source URL."""
        photo_url, source_url, is_pending = resolve_mirrored_photo(
            vip_id="vip1",
            current_photo_url="https://novaricstorage.blob.core.windows.net/media/Profile-Photos/Edi-RAMA.jfif",
            current_source_url=None,
            name="Edi Rama"
        )
        self.assertEqual(photo_url, "https://media.novaric.al/politicians/vip1.jpg")
        self.assertEqual(source_url, "https://novaricstorage.blob.core.windows.net/media/Profile-Photos/Edi-RAMA.jfif")
        self.assertFalse(is_pending)

    def test_documented_missing_photos_resolution(self):
        """The 2 documented missing photos (vip106, vip113) resolve to placeholder-pending and is_pending=True."""
        for vip_id, name in [("vip106", "Zija Ismaili"), ("vip113", "Redi Muçi")]:
            photo_url, source_url, is_pending = resolve_mirrored_photo(
                vip_id=vip_id,
                current_photo_url="https://novaric.co/wp-content/uploads/2025/11/MaleProfile.jpg",
                current_source_url=None,
                name=name
            )
            self.assertEqual(photo_url, PLACEHOLDER_PENDING_URL)
            self.assertTrue(is_pending)
            self.assertIn(vip_id, DOCUMENTED_MISSING_PHOTO_VIP_IDS)

    def test_image_mirror_idempotency(self):
        """Proves that executing image mirroring worker multiple times produces 0 updates on re-run."""
        worker = ImageMirrorWorker()
        # First execution (ensure populated)
        res1 = worker.execute_all(dry_run=False)
        self.assertTrue(res1["target_104_resolved"])

        # Second execution (strict re-run)
        res2 = worker.execute_all(dry_run=False)
        self.assertEqual(res2["sqlite"]["updated_count"], 0, "Second run must perform 0 updates in SQLite")
        self.assertEqual(res2["json_export"]["updated_count"], 0, "Second run must perform 0 updates in JSON export")
        self.assertTrue(res2["target_104_resolved"])

    def test_top_104_cards_image_resolution(self):
        """Verifies that all 104 cards served by the cards endpoint resolve their images to media.novaric.al."""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            resp = loop.run_until_complete(list_politician_cards())
            cards = resp["cards"] if isinstance(resp, dict) else resp
            self.assertEqual(len(cards), 104, "Must return exactly 104 politician cards")

            mirrored_count = 0
            pending_count = 0
            source_url_count = 0

            for c in cards:
                img = c.get("imageUrl", "")
                self.assertTrue(
                    img.startswith("https://media.novaric.al/politicians/"),
                    f"Card {c.get('id')} has non-mirrored image: {img}"
                )
                if "placeholder-pending" in img or c.get("photoPending"):
                    pending_count += 1
                else:
                    mirrored_count += 1

                if c.get("photo_source_url"):
                    source_url_count += 1

            self.assertEqual(mirrored_count + pending_count, 104)
            self.assertEqual(pending_count, 2, "Must have exactly 2 documented pending photos")
            self.assertEqual(mirrored_count, 102, "Must have exactly 102 active mirrored photos")
            self.assertEqual(source_url_count, 104, "All 104 cards must preserve their photo_source_url")
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
                self.assertTrue(len(card["shortBio"]) > 0)
                self.assertTrue(len(card["detailedBio"]) > 0)
        finally:
            loop.close()


if __name__ == "__main__":
    unittest.main()
