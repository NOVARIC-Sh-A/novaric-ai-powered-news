import { OpsMetricsResponse, SourceLagAlert } from '../types';
import { getNewsFeedConfig, NewsFeedConfig } from '../config/newsFeedConfig';

export interface OpsAlertItem {
  id: string;
  sourceCategory: string; // e.g. "RTSH (albanian)" or "Image Provenance (system)"
  severity: 'WARNING' | 'CRITICAL';
  metric: string;         // e.g. "Source Feed Lag" or "OG Fallback Ratio"
  currentValue: string;   // e.g. "480 min (8.0h)" or "42%"
  threshold: string;      // e.g. "Warning > 360 min" or "OG Domination > 35%"
  message: string;
  runbookLink: string;
  timestamp: string;
}

export interface OpsAlertDispatchReport {
  alertsGenerated: OpsAlertItem[];
  slackDispatched: boolean;
  webhookDispatched: boolean;
  suppressedCount: number;
  errors: string[];
}

// In-memory rate limiting and alert log ring buffer (retention: 100 entries)
const recentAlertsMap = new Map<string, { timestamp: number; severity: 'WARNING' | 'CRITICAL' }>();
const alertAuditLog: OpsAlertItem[] = [];
const SUPPRESSION_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_AUDIT_LOG_SIZE = 100;

/**
 * Builds formatted alert items from metrics according to active thresholds
 */
export function buildOpsAlertItems(
  metrics: OpsMetricsResponse,
  config?: NewsFeedConfig
): OpsAlertItem[] {
  const cfg = config || getNewsFeedConfig();
  const alerts: OpsAlertItem[] = [];
  const nowISO = new Date().toISOString();

  // 1. Source Lag Alerts
  if (metrics.sourceLagSummary?.alerts) {
    for (const item of metrics.sourceLagSummary.alerts) {
      if (item.status === 'WARNING' || item.status === 'CRITICAL') {
        const isNational = item.sourceType === 'albanian';
        const warnThresh = isNational ? cfg.albanianWarnMin : cfg.intlWarnMin;
        const critThresh = isNational ? cfg.albanianCritMin : cfg.intlCritMin;
        const threshStr = item.status === 'CRITICAL' ? `Critical > ${critThresh}m` : `Warning > ${warnThresh}m`;
        const lagHours = (item.lagMinutes / 60).toFixed(1);

        alerts.push({
          id: `lag-${item.sourceName}-${item.status}`,
          sourceCategory: `${item.sourceName} (${item.sourceType})`,
          severity: item.status,
          metric: 'Source Ingest Freshness Lag',
          currentValue: `${item.lagMinutes} min (~${lagHours} hours lag)`,
          threshold: threshStr,
          message: `Feedi i lajmeve nga burimi ${item.sourceName} (${item.sourceType}) ka tejkaluar kufirin e freskisë (${threshStr}). Nuk ka artikuj të rinj që nga ${item.newestPublishedAt}.`,
          runbookLink: `${cfg.runbookUrl}#source-freshness-lag`,
          timestamp: nowISO,
        });
      }
    }
  }

  // 2. Image Provenance / OG Fallback Domination Alert
  const imgMetrics = metrics.imageProvenanceMetrics;
  if (imgMetrics && (imgMetrics.ogDominationAlert || (typeof imgMetrics.ogFallbackRatio === 'number' && imgMetrics.ogFallbackRatio > cfg.ogDominationThreshold))) {
    const ratioPct = Math.round(imgMetrics.ogFallbackRatio * 100);
    const threshPct = Math.round(cfg.ogDominationThreshold * 100);
    const severity = imgMetrics.ogFallbackRatio >= 0.35 ? 'CRITICAL' : 'WARNING';
    const artCount = imgMetrics.articleOgCount ?? 0;
    const rssCount = imgMetrics.rssFeedCount ?? 0;

    alerts.push({
      id: `image-og-domination`,
      sourceCategory: 'Media Resolver (Global RSS)',
      severity,
      metric: 'OpenGraph Fallback Ratio',
      currentValue: `${ratioPct}% (${artCount} / ${rssCount + artCount})`,
      threshold: `OG Domination > ${threshPct}%`,
      message: `Raporti i imazheve sekondare OpenGraph (${ratioPct}%) tejkalon pragun e lejuar prej ${threshPct}%. Kjo tregon që burimet RSS po ndryshojnë strukturën e media tags dhe kërkohet përditësimi i parser-it të mediave.`,
      runbookLink: `${cfg.runbookUrl}#image-og-domination`,
      timestamp: nowISO,
    });
  }

  return alerts;
}

/**
 * Formats a Slack Block Kit message payload
 */
export function formatSlackAlertPayload(alerts: OpsAlertItem[], runbookUrl: string) {
  const blocks: any[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '🚨 NOVARIC® Operations Alert: NewsFeed Health Degradation',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Alert Summary:* ${alerts.length} operational issues detected.\n*Runbook:* <${runbookUrl}|View Operational Troubleshooting Runbook>`,
      },
    },
    { type: 'divider' },
  ];

  for (const a of alerts.slice(0, 5)) {
    const icon = a.severity === 'CRITICAL' ? '🔴 *[CRITICAL]*' : '🟡 *[WARNING]*';
    blocks.push({
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `${icon}\n*Source:* ${a.sourceCategory}` },
        { type: 'mrkdwn', text: `*Metric:* ${a.metric}\n*Value:* ${a.currentValue}` },
        { type: 'mrkdwn', text: `*Threshold:* ${a.threshold}` },
        { type: 'mrkdwn', text: `*Remediation:* <${a.runbookLink}|Fix Runbook>` },
      ],
    });
    blocks.push({
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: `${a.message} _(${a.timestamp})_` },
      ],
    });
  }

  if (alerts.length > 5) {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: `_...dhe ${alerts.length - 5} sinjalizime të tjera shtesë._` }],
    });
  }

  return { blocks };
}

/**
 * Dispatches active alerts to configured Slack or Generic Webhook targets.
 * Applies rate-limiting suppression (15m window) to prevent spamming.
 */
export async function dispatchOpsAlertsIfNeeded(
  metrics: OpsMetricsResponse,
  force: boolean = false
): Promise<OpsAlertDispatchReport> {
  const config = getNewsFeedConfig();
  const allAlerts = buildOpsAlertItems(metrics, config);
  const now = Date.now();

  const toDispatch: OpsAlertItem[] = [];
  let suppressedCount = 0;

  for (const alert of allAlerts) {
    const key = alert.id;
    const existing = recentAlertsMap.get(key);

    if (force || !existing || now - existing.timestamp > SUPPRESSION_WINDOW_MS || (existing.severity === 'WARNING' && alert.severity === 'CRITICAL')) {
      toDispatch.push(alert);
      recentAlertsMap.set(key, { timestamp: now, severity: alert.severity });

      // Record in audit log
      alertAuditLog.unshift(alert);
      if (alertAuditLog.length > MAX_AUDIT_LOG_SIZE) {
        alertAuditLog.pop();
      }
    } else {
      suppressedCount++;
    }
  }

  const report: OpsAlertDispatchReport = {
    alertsGenerated: toDispatch,
    slackDispatched: false,
    webhookDispatched: false,
    suppressedCount,
    errors: [],
  };

  if (toDispatch.length === 0) {
    return report;
  }

  // 1. Dispatch to Slack Webhook if configured
  if (config.slackWebhookUrl) {
    try {
      const payload = formatSlackAlertPayload(toDispatch, config.runbookUrl);
      const res = await fetch(config.slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        report.slackDispatched = true;
      } else {
        const errText = await res.text().catch(() => '');
        report.errors.push(`Slack webhook returned status ${res.status}: ${errText}`);
      }
    } catch (err: any) {
      report.errors.push(`Slack webhook dispatch failed: ${err.message || String(err)}`);
    }
  }

  // 2. Dispatch to Generic HTTP / Email Webhook if configured
  if (config.alertWebhookUrl) {
    try {
      const payload = {
        event: 'novaric_newsfeed_ops_alert',
        timestamp: new Date().toISOString(),
        alerts: toDispatch,
        runbookUrl: config.runbookUrl,
        metricsSnapshot: {
          cacheVersion: metrics.cacheVersion,
          windowCounts: metrics.windowCounts,
          ogFallbackRatio: metrics.imageProvenanceMetrics?.ogFallbackRatio,
        },
      };

      const res = await fetch(config.alertWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        report.webhookDispatched = true;
      } else {
        const errText = await res.text().catch(() => '');
        report.errors.push(`Generic alert webhook returned status ${res.status}: ${errText}`);
      }
    } catch (err: any) {
      report.errors.push(`Generic alert webhook dispatch failed: ${err.message || String(err)}`);
    }
  }

  return report;
}

/**
 * Returns historical dispatched alert log for diagnostic inspection
 */
export function getAlertAuditLog(): OpsAlertItem[] {
  return [...alertAuditLog];
}

/**
 * Clears the alert audit log and rate limit history (for testing)
 */
export function clearAlertAuditLog(): void {
  alertAuditLog.length = 0;
  recentAlertsMap.clear();
}

export const buildOpsAlerts = buildOpsAlertItems;
export const clearOpsAlertSuppressionHistory = clearAlertAuditLog;
