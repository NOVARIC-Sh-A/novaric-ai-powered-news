"""
NOVARIC® PARAGON Politicians Pipeline Alerting Engine
Monitors ingestion runs, final failures, and material active-MP count deltas (membership changes).
Dispatches alerts to Slack Webhook, Cloud Monitoring, and audit logs.
"""

import json
import logging
import os
import sqlite3
import urllib.request
import urllib.error
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple

logger = logging.getLogger("novaric.ingestion.alerts")

RUNBOOK_URL = "https://github.com/novaric/paragon-media/blob/main/docs/POLITICIANS_PIPELINE_RUNBOOK.md"


class AlertSeverity:
    INFO = "INFO"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class AlertType:
    FINAL_FAILURE = "INGESTION_FINAL_FAILURE"
    MEMBERSHIP_CHANGE_DETECTED = "MEMBERSHIP_CHANGE_DETECTED"
    IMAGE_MIRROR_DEFECT = "IMAGE_MIRROR_DEFECT"
    HEALTH_DEGRADED = "INGESTION_HEALTH_DEGRADED"


# In-memory audit log for alerts generated in the current process
pipeline_alert_audit_log: List[Dict[str, Any]] = []


def format_slack_blocks(
    alert_type: str,
    severity: str,
    title: str,
    message: str,
    fields: Dict[str, Any],
    runbook_anchor: str = ""
) -> Dict[str, Any]:
    """
    Builds Slack Block Kit formatted message payload.
    """
    severity_emoji = "🚨" if severity == AlertSeverity.CRITICAL else ("⚠️" if severity == AlertSeverity.WARNING else "ℹ️")
    runbook_full = f"{RUNBOOK_URL}#{runbook_anchor}" if runbook_anchor else RUNBOOK_URL

    blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": f"{severity_emoji} NOVARIC® Alert: {title}",
                "emoji": True
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*Severity:* `{severity}` | *Type:* `{alert_type}`\n{message}"
            }
        }
    ]

    field_elements = []
    for k, v in fields.items():
        field_elements.append({
            "type": "mrkdwn",
            "text": f"*{k}:*\n{v}"
        })

    if field_elements:
        # Group into blocks of max 10 fields per Slack specs
        for i in range(0, len(field_elements), 10):
            blocks.append({
                "type": "section",
                "fields": field_elements[i:i+10]
            })

    blocks.append({
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": f"📋 *Runbook:* <{runbook_full}|View Triage Procedures> | ⏱️ {datetime.now(timezone.utc).isoformat()}"
            }
        ]
    })

    return {
        "text": f"[{severity}] {title}: {message}",
        "blocks": blocks
    }


def dispatch_pipeline_alert(
    alert_type: str,
    severity: str,
    title: str,
    message: str,
    details: Optional[Dict[str, Any]] = None,
    runbook_anchor: str = "",
    webhook_url: Optional[str] = None
) -> Dict[str, Any]:
    """
    Dispatches pipeline alert to Slack webhook, Cloud Monitoring / audit log.
    """
    details = details or {}
    now_iso = datetime.now(timezone.utc).isoformat()
    alert_payload = {
        "id": f"alert-{int(datetime.now().timestamp() * 1000)}",
        "alert_type": alert_type,
        "severity": severity,
        "title": title,
        "message": message,
        "details": details,
        "timestamp": now_iso,
        "runbook_url": f"{RUNBOOK_URL}#{runbook_anchor}" if runbook_anchor else RUNBOOK_URL
    }

    # Record in audit log
    pipeline_alert_audit_log.append(alert_payload)
    if len(pipeline_alert_audit_log) > 100:
        pipeline_alert_audit_log.pop(0)

    # Structured stdout log
    log_line = {
        "event": "ops_alert",
        "system": "novaric_politicians_pipeline",
        "alert": alert_payload
    }
    if severity == AlertSeverity.CRITICAL:
        logger.error(json.dumps(log_line))
    elif severity == AlertSeverity.WARNING:
        logger.warning(json.dumps(log_line))
    else:
        logger.info(json.dumps(log_line))

    # Dispatch to HTTP webhook if configured
    url = webhook_url or os.getenv("OPS_SLACK_WEBHOOK_URL") or os.getenv("ALERT_WEBHOOK_URL")
    webhook_sent = False
    webhook_error = None

    if url:
        try:
            slack_payload = format_slack_blocks(
                alert_type=alert_type,
                severity=severity,
                title=title,
                message=message,
                fields=details,
                runbook_anchor=runbook_anchor
            )
            req = urllib.request.Request(
                url,
                data=json.dumps(slack_payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=5) as resp:
                webhook_sent = resp.status in (200, 204)
        except Exception as ex:
            webhook_error = str(ex)
            logger.warning(f"Failed to dispatch alert webhook to {url}: {ex}")

    return {
        "alert": alert_payload,
        "dispatched_webhook": webhook_sent,
        "webhook_error": webhook_error
    }


def record_run_and_evaluate_alerts(
    conn_or_client: Any,
    run_id: str,
    source: str,
    started_at: str,
    finished_at: str,
    records_new: int,
    records_updated: int,
    status: str,
    active_mp_count: int,
    error: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
    dry_run: bool = False
) -> Dict[str, Any]:
    """
    Evaluates ingestion metrics:
    1. Checks for final failure (status != 'ok' or error is not None) -> CRITICAL alert.
    2. Queries previous successful run -> compares active_mp_count.
       If delta != 0 -> CRITICAL alert for parliamentary membership change.
    3. Persists run metrics into ingestion_runs table (when not dry_run or with dry_run flag).
    """
    alerts_triggered = []
    prev_active_count: Optional[int] = None
    delta: int = 0

    # 1. Evaluate failure alert
    if status != "ok" or error:
        err_msg = error or "Unknown fatal failure"
        alert_res = dispatch_pipeline_alert(
            alert_type=AlertType.FINAL_FAILURE,
            severity=AlertSeverity.CRITICAL,
            title="Ingestion Job Fatal Failure",
            message=f"Kuvendi ingestion job `{run_id}` terminated with error: {err_msg}",
            details={
                "Run ID": run_id,
                "Source": source,
                "Error": err_msg,
                "Started At": started_at,
                "Finished At": finished_at
            },
            runbook_anchor="safe-rollback-procedures"
        )
        alerts_triggered.append(alert_res)

    # 2. Query previous successful run from SQLite if available
    is_sqlite = False
    if conn_or_client is not None and hasattr(conn_or_client, "cursor"):
        is_sqlite = True
        try:
            cur = conn_or_client.cursor()
            cur.execute(
                "SELECT active_mp_count FROM ingestion_runs WHERE status = 'ok' AND active_mp_count > 0 ORDER BY started_at DESC LIMIT 1"
            )
            row = cur.fetchone()
            if row:
                prev_active_count = row[0] if isinstance(row, (list, tuple)) else row["active_mp_count"]
        except Exception as e:
            logger.warning(f"Could not read previous run active count: {e}")

    # Fallback to 140 baseline if no prior recorded run exists in table
    if prev_active_count is None:
        prev_active_count = 140

    delta = active_mp_count - prev_active_count

    # 3. Check for Material Membership Change Signal
    # Any delta in active MPs (delta != 0) signals an MP resignation, substitution, or mandate change
    if delta != 0 and not dry_run:
        delta_sign = f"+{delta}" if delta > 0 else f"{delta}"
        membership_title = "Material MP Membership Change Signal"
        membership_msg = (
            f"Kuvendi i Shqipërisë membership change detected: "
            f"Active MPs changed from {prev_active_count} to {active_mp_count} (Delta: {delta_sign}). "
            f"Updated records: {records_updated}, New records: {records_new}."
        )
        alert_res = dispatch_pipeline_alert(
            alert_type=AlertType.MEMBERSHIP_CHANGE_DETECTED,
            severity=AlertSeverity.CRITICAL,
            title=membership_title,
            message=membership_msg,
            details={
                "Run ID": run_id,
                "Previous Active MPs": str(prev_active_count),
                "Current Active MPs": str(active_mp_count),
                "Delta": delta_sign,
                "Records Updated": str(records_updated),
                "Records New": str(records_new)
            },
            runbook_anchor="deactivate-missing-pass-operational-guide"
        )
        alerts_triggered.append(alert_res)

    # 4. Persist to ingestion_runs table
    if is_sqlite and not dry_run:
        try:
            meta_json = json.dumps(metadata or {})
            cur = conn_or_client.cursor()
            cur.execute(
                """
                INSERT OR REPLACE INTO ingestion_runs 
                (id, source, started_at, finished_at, records_new, records_updated, active_mp_count, active_mp_delta, status, error, metadata)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    run_id,
                    source,
                    started_at,
                    finished_at,
                    records_new,
                    records_updated,
                    active_mp_count,
                    delta,
                    status,
                    error,
                    meta_json
                )
            )
            conn_or_client.commit()
        except Exception as e:
            logger.warning(f"Failed to persist ingestion_run to SQLite: {e}")

    return {
        "run_id": run_id,
        "status": status,
        "active_mp_count": active_mp_count,
        "previous_active_count": prev_active_count,
        "active_mp_delta": delta,
        "membership_change_detected": (delta != 0),
        "alerts_triggered": [a.get("alert") for a in alerts_triggered],
        "dry_run": dry_run
    }
