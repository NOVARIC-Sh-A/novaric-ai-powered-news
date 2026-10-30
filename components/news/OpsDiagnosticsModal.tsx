import React, { useEffect, useState } from 'react';
import { OpsMetricsResponse } from '../../types';
import { fetchNewsOpsMetrics, dispatchNewsOpsAlerts } from '../../services/newsService';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  Flame,
  Image as ImageIcon,
  Layers,
  RefreshCw,
  Server,
  ShieldCheck,
  Send,
  X,
} from 'lucide-react';

export interface OpsDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerRefresh?: () => Promise<void>;
}

export const OpsDiagnosticsModal: React.FC<OpsDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  onTriggerRefresh,
}) => {
  const [metrics, setMetrics] = useState<OpsMetricsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [dispatching, setDispatching] = useState<boolean>(false);
  const [dispatchMsg, setDispatchMsg] = useState<string | null>(null);

  const loadMetrics = async () => {
    setLoading(true);
    const data = await fetchNewsOpsMetrics();
    if (data) {
      setMetrics(data);
    }
    setLoading(false);
  };

  const handleManualAlertDispatch = async () => {
    try {
      setDispatching(true);
      setDispatchMsg(null);
      const res: any = await dispatchNewsOpsAlerts(true);
      if (res && res.dispatched) {
        setDispatchMsg(`✅ Dërguar me sukses: ${res.alertsCount} alerte te ${res.endpointsCount} webhook(s).`);
      } else if (res && res.reason) {
        setDispatchMsg(`ℹ️ Nuk u dërguan alerte: ${res.reason}`);
      } else {
        setDispatchMsg('✅ Dërgesa e alerteve u përfundua.');
      }
      setTimeout(() => setDispatchMsg(null), 5000);
    } catch (e: any) {
      setDispatchMsg(`❌ Dështoi dërgimi: ${e.message}`);
    } finally {
      setDispatching(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMetrics();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onTriggerRefresh) {
      await onTriggerRefresh();
    }
    await loadMetrics();
    setRefreshing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      id="ops-diagnostics-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ops-modal-title"
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        id="ops-diagnostics-container"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 id="ops-modal-title" className="text-lg font-bold text-white flex items-center gap-2">
                Qendra e Diagnostikës & Telemetrisë Operative
                <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE SLA
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Monitorimi në kohë reale i dritareve kohore, pastërtisë së cache-it, vlerësimit NER dhe vonesës së burimeve.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualAlertDispatch}
              disabled={dispatching || loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-xs font-medium text-rose-200 border border-rose-800/80 transition-colors disabled:opacity-50 cursor-pointer"
              id="ops-dispatch-alerts-btn"
              title="Dërgo alerte të menjëhershme në kanalet e konfiguruara (Slack/Webhook)"
            >
              <Send className={`w-3.5 h-3.5 ${dispatching ? 'animate-pulse text-rose-300' : ''}`} />
              <span>{dispatching ? 'Duke dërguar...' : 'Dërgo Alerte (Slack)'}</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
              id="ops-refresh-btn"
              title="Rifresko të dhënat e telemetrisë"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing || loading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{refreshing ? 'Duke u rifreskuar...' : 'Rifresko'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Mbyll"
              id="ops-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {dispatchMsg && (
          <div className="px-6 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-cyan-300 flex items-center justify-between">
            <span>{dispatchMsg}</span>
            <button onClick={() => setDispatchMsg(null)} className="text-slate-400 hover:text-white text-xs">×</button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!metrics && loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-sm font-mono text-slate-400">Duke mbledhur telemetrinë e motorit operativ...</p>
            </div>
          ) : !metrics ? (
            <div className="p-6 text-center text-slate-400">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-sm">Telemetria operative nuk është e disponueshme për momentin.</p>
            </div>
          ) : (
            <>
              {/* 1. Window Counts & Cache Version Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Section A Window */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-mono uppercase tracking-wider">Seksioni A (Radar &le; 60m)</span>
                    <Clock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {metrics.windowCounts.latestCount} <span className="text-xs font-sans text-slate-400">artikuj</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Skadon automatikisht në kufirin 60-minutësh; toleron +5 min skew.
                  </p>
                </div>

                {/* Transition Gap Window */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-mono uppercase tracking-wider">Hendeku (1h–16h)</span>
                    <Layers className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {metrics.windowCounts.gapCount} <span className="text-xs font-sans text-slate-400">artikuj</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    I fshehur nga default-i; i aksesueshëm vetëm me toggle të kërkuar.
                  </p>
                </div>

                {/* Section B Archive Window */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-mono uppercase tracking-wider">Seksioni B (Arkiva &gt; 16h)</span>
                    <Database className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black text-cyan-400 font-mono">
                    {metrics.windowCounts.archiveCount} <span className="text-xs font-sans text-slate-400">artikuj</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Shfletim i pakufishëm me kursor <code className="text-slate-300 font-mono">(pubAt, id)</code>.
                  </p>
                </div>

                {/* Cache Hit Ratio & Version */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-mono uppercase tracking-wider">Cache & Versioni</span>
                    <Server className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-purple-400 font-mono">
                      {Math.round(metrics.cacheStats.hitRatio * 100)}%
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      v{metrics.cacheVersion} gen
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {metrics.cacheStats.hits} goditje / {metrics.cacheStats.misses} dështime (auto-invalidim në ingest).
                  </p>
                </div>
              </div>

              {/* 2. Latency & NER Quality Percentiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* API Latency SLA */}
                <div className="p-5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      Vonesa e Përgjigjes së API (Latencat)
                    </h3>
                    <span className="text-xs font-mono text-slate-400">
                      {metrics.latencyMetrics.totalQueries} pyetëzime
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Mesatarja</div>
                      <div className="text-base font-bold text-white mt-0.5">{metrics.latencyMetrics.avgMs}ms</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">p50</div>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{metrics.latencyMetrics.p50Ms}ms</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">p95</div>
                      <div className="text-base font-bold text-cyan-400 mt-0.5">{metrics.latencyMetrics.p95Ms}ms</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">p99</div>
                      <div className="text-base font-bold text-amber-400 mt-0.5">{metrics.latencyMetrics.p99Ms}ms</div>
                    </div>
                  </div>
                </div>

                {/* NER Ecosystem Ratings */}
                <div className="p-5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Integriteti i Lajmeve (NER v2.4)
                    </h3>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Mesatare: {metrics.nerMetrics.avgScore}/100
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">p10 Prag</div>
                      <div className="text-base font-bold text-cyan-300 mt-0.5">{metrics.nerMetrics.p10Score}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">&ge; 85 Lartë</div>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{metrics.nerMetrics.highCount}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">70-84 Mes.</div>
                      <div className="text-base font-bold text-amber-400 mt-0.5">{metrics.nerMetrics.mediumCount}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">&lt; 70 Ulët</div>
                      <div className="text-base font-bold text-rose-400 mt-0.5">{metrics.nerMetrics.lowCount}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Image Provenance Breakdown & Deduplication Telemetry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Provenance Breakdown */}
                <div className="p-5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      Origjina e Imazheve (Provenance Ratio)
                    </h3>
                    {metrics.imageProvenanceMetrics.ogDominationAlert ? (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        VËMENDJE: OG &gt; 35%
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        HEALTHY PROVENANCE
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
                      <span className="text-slate-300">Strukturë Native RSS (media:content / enclosure)</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {metrics.imageProvenanceMetrics.rssFeedCount} artikuj
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
                      <span className="text-slate-300">Open Graph Fallback Scraper (articleOg)</span>
                      <span className="font-mono font-bold text-amber-400">
                        {metrics.imageProvenanceMetrics.articleOgCount} artikuj ({Math.round(metrics.imageProvenanceMetrics.ogFallbackRatio * 100)}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
                      <span className="text-slate-300">Pa imazh (Placeholder / None)</span>
                      <span className="font-mono text-slate-400">
                        {metrics.imageProvenanceMetrics.noneCount} artikuj
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deduplication Wins by Rule */}
                <div className="p-5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Deduplikimi i Kanoneve &amp; URL-ve
                    </h3>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {metrics.dedupeTelemetry.totalDedupeWins} duplikate të eliminuara
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-slate-900/80 flex items-center justify-between">
                      <span className="text-slate-400">Canonical URL</span>
                      <span className="font-mono font-bold text-slate-200">{metrics.dedupeTelemetry.canonicalUrlWins}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/80 flex items-center justify-between">
                      <span className="text-slate-400">AMP &amp; Mobile Host</span>
                      <span className="font-mono font-bold text-cyan-400">{metrics.dedupeTelemetry.ampMobileWins}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/80 flex items-center justify-between">
                      <span className="text-slate-400">RSS Guid / ID</span>
                      <span className="font-mono font-bold text-purple-400">{metrics.dedupeTelemetry.guidWins}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/80 flex items-center justify-between">
                      <span className="text-slate-400">Sindikim Kryq</span>
                      <span className="font-mono font-bold text-amber-400">{metrics.dedupeTelemetry.syndicationWins}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Per-Source Freshness & Ingest Lag Monitoring */}
              <div className="p-5 rounded-xl bg-slate-950/40 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-slate-200">
                      Gjurmimi i Vonesës së Burimeve (Per-Source Lag Alerts)
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-emerald-400">{metrics.sourceLagSummary.healthyCount} aktive</span>
                    {metrics.sourceLagSummary.warningCount > 0 && (
                      <span className="text-amber-400">{metrics.sourceLagSummary.warningCount} paralajmërime</span>
                    )}
                    {metrics.sourceLagSummary.criticalCount > 0 && (
                      <span className="text-rose-400">{metrics.sourceLagSummary.criticalCount} kritike</span>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] font-mono text-slate-400 uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">Agjencia / Burimi</th>
                        <th className="py-2 px-3">Kategoria</th>
                        <th className="py-2 px-3">Publikimi i Fundit</th>
                        <th className="py-2 px-3">Vonesa (Lag)</th>
                        <th className="py-2 px-3 text-right">Statusi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {metrics.sourceLagSummary.alerts.slice(0, 12).map((alert, idx) => {
                        const isWarning = alert.status === 'WARNING';
                        const isCritical = alert.status === 'CRITICAL';
                        return (
                          <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                            <td className="py-2 px-3 font-sans font-medium text-slate-200">{alert.sourceName}</td>
                            <td className="py-2 px-3 text-slate-400 capitalize">{alert.sourceType}</td>
                            <td className="py-2 px-3 text-slate-400 text-[11px]">
                              {alert.newestPublishedAt ? new Date(alert.newestPublishedAt).toUTCString().slice(5, 22) : 'N/A'}
                            </td>
                            <td className="py-2 px-3">
                              {alert.lagMinutes < 60
                                ? `${alert.lagMinutes} min`
                                : `${Math.floor(alert.lagMinutes / 60)}h ${alert.lagMinutes % 60}m`}
                            </td>
                            <td className="py-2 px-3 text-right">
                              {isCritical ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                  <AlertTriangle className="w-3 h-3" /> KRITIKE (&gt;24h)
                                </span>
                              ) : isWarning ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                  <AlertTriangle className="w-3 h-3" /> VONESË (&gt;6h)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3 h-3" /> AKTIVE
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-xs font-mono text-slate-400">
          <div>
            Koha e Serverit: <span className="text-slate-200">{metrics?.serverTime || new Date().toISOString()}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans transition-colors cursor-pointer"
          >
            Mbyll Dritaren
          </button>
        </div>
      </div>
    </div>
  );
};
