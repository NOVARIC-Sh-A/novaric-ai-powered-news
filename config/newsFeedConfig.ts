/**
 * NOVARIC® NewsFeed Operations & Thresholds Configuration
 * Provides config-driven freshness, image provenance, alerting, and ramp controls.
 */

export interface NewsFeedConfig {
  albanianWarnMin: number;
  albanianCritMin: number;
  intlWarnMin: number;
  intlCritMin: number;
  ogDominationThreshold: number;
  slackWebhookUrl: string;
  alertWebhookUrl: string;
  runbookUrl: string;
  opsMetricsAuthToken: string;
  rampMode: 'off' | 'canary' | 'full';
}

export interface ConfigValidationResult {
  config: NewsFeedConfig;
  validationErrors: string[];
}

export const DEFAULT_NEWS_FEED_CONFIG: NewsFeedConfig = {
  albanianWarnMin: 360,    // 6 hours
  albanianCritMin: 1440,   // 24 hours
  intlWarnMin: 720,        // 12 hours
  intlCritMin: 1440,       // 24 hours
  ogDominationThreshold: 0.35, // 35% of images
  slackWebhookUrl: '',
  alertWebhookUrl: '',
  runbookUrl: 'https://github.com/novaric/media-monitor/blob/main/docs/NEWS_FEED_ARCHITECTURE.md#operations-runbook',
  opsMetricsAuthToken: '',
  rampMode: 'full',
};

/**
 * Validates provided environment variables or current process/import.meta env.
 * Enforces safe defaults if values are missing or out of valid bounds.
 */
export function validateNewsFeedConfig(envObj?: Record<string, string | undefined>): ConfigValidationResult {
  const env = envObj || (typeof process !== 'undefined' && process.env ? process.env : {});
  const errors: string[] = [];

  // 1. Albanian Freshness Warning
  let albanianWarn = DEFAULT_NEWS_FEED_CONFIG.albanianWarnMin;
  const rawAlbWarn = env.NEWS_FRESHNESS_ALBANIAN_WARN_MIN ?? (env.ALBANIAN_LAG_WARNING_HOURS ? String(Number(env.ALBANIAN_LAG_WARNING_HOURS) * 60) : undefined);
  if (rawAlbWarn !== undefined && rawAlbWarn.trim() !== '') {
    const num = Number(rawAlbWarn);
    if (!isNaN(num) && num > 0 && num <= 43200) { // Max 30 days
      albanianWarn = num;
    } else {
      errors.push(`Invalid Albanian warn lag="${rawAlbWarn}". Must be a positive number <= 43200m. Using default ${DEFAULT_NEWS_FEED_CONFIG.albanianWarnMin}m.`);
    }
  }

  // 2. Albanian Freshness Critical
  let albanianCrit = DEFAULT_NEWS_FEED_CONFIG.albanianCritMin;
  const rawAlbCrit = env.NEWS_FRESHNESS_ALBANIAN_CRIT_MIN ?? (env.ALBANIAN_LAG_CRITICAL_HOURS ? String(Number(env.ALBANIAN_LAG_CRITICAL_HOURS) * 60) : undefined);
  if (rawAlbCrit !== undefined && rawAlbCrit.trim() !== '') {
    const num = Number(rawAlbCrit);
    if (!isNaN(num) && num > albanianWarn && num <= 43200) {
      albanianCrit = num;
    } else {
      errors.push(`Invalid Albanian crit lag="${rawAlbCrit}". Must be greater than warning (${albanianWarn}m) and <= 43200m. Using default ${DEFAULT_NEWS_FEED_CONFIG.albanianCritMin}m.`);
    }
  }

  // 3. International Freshness Warning
  let intlWarn = DEFAULT_NEWS_FEED_CONFIG.intlWarnMin;
  const rawIntlWarn = env.NEWS_FRESHNESS_INTL_WARN_MIN ?? (env.INTL_LAG_WARNING_HOURS ? String(Number(env.INTL_LAG_WARNING_HOURS) * 60) : undefined);
  if (rawIntlWarn !== undefined && rawIntlWarn.trim() !== '') {
    const num = Number(rawIntlWarn);
    if (!isNaN(num) && num > 0 && num <= 43200) {
      intlWarn = num;
    } else {
      errors.push(`Invalid Intl warn lag="${rawIntlWarn}". Must be a positive number <= 43200m. Using default ${DEFAULT_NEWS_FEED_CONFIG.intlWarnMin}m.`);
    }
  }

  // 4. International Freshness Critical
  let intlCrit = DEFAULT_NEWS_FEED_CONFIG.intlCritMin;
  const rawIntlCrit = env.NEWS_FRESHNESS_INTL_CRIT_MIN ?? (env.INTL_LAG_CRITICAL_HOURS ? String(Number(env.INTL_LAG_CRITICAL_HOURS) * 60) : undefined);
  if (rawIntlCrit !== undefined && rawIntlCrit.trim() !== '') {
    const num = Number(rawIntlCrit);
    if (!isNaN(num) && num > intlWarn && num <= 43200) {
      intlCrit = num;
    } else {
      errors.push(`Invalid Intl crit lag="${rawIntlCrit}". Must be greater than warning (${intlWarn}m) and <= 43200m. Using default ${DEFAULT_NEWS_FEED_CONFIG.intlCritMin}m.`);
    }
  }

  // 5. OpenGraph Domination Threshold
  let ogDomination = DEFAULT_NEWS_FEED_CONFIG.ogDominationThreshold;
  const rawOg = env.NEWS_OG_DOMINATION_THRESHOLD ?? env.OG_FALLBACK_CRITICAL_RATIO ?? env.OG_FALLBACK_WARNING_RATIO;
  if (rawOg !== undefined && rawOg.trim() !== '') {
    const num = Number(rawOg);
    if (!isNaN(num) && num >= 0.05 && num <= 0.95) {
      ogDomination = num;
    } else {
      errors.push(`Invalid OG Domination threshold="${rawOg}". Must be between 0.05 and 0.95. Using default ${DEFAULT_NEWS_FEED_CONFIG.ogDominationThreshold}.`);
    }
  }

  // 6. Ramp Mode
  let ramp: 'off' | 'canary' | 'full' = DEFAULT_NEWS_FEED_CONFIG.rampMode;
  const rawRamp = (env.NEWSFEED_RAMP ?? env.VITE_NEWSFEED_RAMP ?? env.NEWSFEED_RAMP_MODE ?? '').trim().toLowerCase();
  if (rawRamp === 'off' || rawRamp === 'canary' || rawRamp === 'full') {
    ramp = rawRamp;
  } else if (rawRamp !== '') {
    errors.push(`Invalid NEWSFEED_RAMP="${rawRamp}". Allowed: 'off' | 'canary' | 'full'. Using default 'full'.`);
  }

  const config: NewsFeedConfig = {
    albanianWarnMin: albanianWarn,
    albanianCritMin: albanianCrit,
    intlWarnMin: intlWarn,
    intlCritMin: intlCrit,
    ogDominationThreshold: ogDomination,
    slackWebhookUrl: (env.OPS_ALERT_SLACK_WEBHOOK_URL || '').trim(),
    alertWebhookUrl: (env.OPS_ALERT_WEBHOOK_URL || env.OPS_ALERT_EMAIL_WEBHOOK_URL || '').trim(),
    runbookUrl: (env.OPS_RUNBOOK_URL || DEFAULT_NEWS_FEED_CONFIG.runbookUrl).trim(),
    opsMetricsAuthToken: (env.OPS_METRICS_AUTH_TOKEN || '').trim(),
    rampMode: ramp,
  };

  return { config, validationErrors: errors };
}

let cachedConfig: NewsFeedConfig | null = null;

export function getNewsFeedConfig(): NewsFeedConfig {
  if (!cachedConfig) {
    const { config, validationErrors } = validateNewsFeedConfig();
    if (validationErrors.length > 0) {
      console.warn('[NewsFeedConfig] Configuration validation warnings detected:', validationErrors);
    }
    cachedConfig = config;
  }
  return cachedConfig;
}

/**
 * Resets cached config (useful during automated tests or hot reconfiguration)
 */
export function resetNewsFeedConfigCache(): void {
  cachedConfig = null;
}

export function validateAndNormalizeConfig(envObj?: Record<string, string | undefined>): NewsFeedConfig {
  return validateNewsFeedConfig(envObj).config;
}
