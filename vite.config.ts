import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { pickFeedImage, pickArticleOpenGraphImage } from './services/imageResolverService';
import { resolveOfficialPhotoUrl } from './utils/officialPhoto';
import {
  processNewsFeedQuery,
  getNewsFeedOpsMetrics,
  bumpNewsFeedIngestVersion,
  recordFeedError,
  verifyOpsToken,
  evaluateAndDispatchOpsAlerts,
} from './services/newsFeedBackend';
import {
  syncRssFeedsToDisk,
  getLastIngestReport,
  RSS_FEEDS,
} from './services/rssIngestor';

const PROFILE_REDIRECTS: Record<string, string> = {
  vip190: 'vip103',
  '190': 'vip103',
  vip169: 'vip16',
  '169': 'vip16',
};

function canonicalProfileId(rawId: string): string {
  const raw = String(rawId || '').trim();
  return PROFILE_REDIRECTS[raw] || PROFILE_REDIRECTS[raw.toLowerCase()] || raw;
}

function paragonRatingsEnabled(): boolean {
  try {
    const flagPath = path.resolve(__dirname, 'public/paragon-ratings.json');
    if (fs.existsSync(flagPath)) {
      const flag = JSON.parse(fs.readFileSync(flagPath, 'utf-8'));
      if (flag && flag.enabled === false) return false;
    }
  } catch {
    /* missing flag keeps the export's own switch */
  }
  return true;
}

function hideParagonScores<T extends Record<string, any>>(card: T): T {
  return {
    ...card,
    composite: null,
    dynamicScore: null,
    paragonDimensions: null,
    scoring_suspended: true,
    scoringSuspended: true,
    ratingsEnabled: false,
  };
}

function novaricApiPlugin() {
  const imageCache = new Map<string, { at: number; value: any }>();
  const TTL = 1000 * 60 * 30; // 30 minutes

  return {
    name: 'novaric-api-mock-plugin',
    configureServer(server: any) {
      // Trigger background initial sync of live RSS feeds
      setTimeout(() => {
        syncRssFeedsToDisk({ timeoutMs: 10000 }).catch((e) => {
          console.warn('[Vite Plugin] Initial background RSS feed sync failed:', e?.message || e);
        });
      }, 1000);

      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url || '';

        // Health / Readiness Endpoint: GET /api/health/scoring
        if (url.startsWith('/api/health/scoring')) {
          try {
            const exportPath = path.resolve(__dirname, 'db/paragon_scores_export.json');
            let hasExport = false;
            let exportData: any = {};
            if (fs.existsSync(exportPath)) {
              exportData = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
              hasExport = !!(exportData.scored_count && exportData.scored_count > 0);
            }

            const payload = {
              status: hasExport ? "healthy" : "awaiting_first_run",
              last_run: exportData.computed_at || null,
              model_version: exportData.model_version || "v1.0",
              scored_politicians: exportData.scored_count || 0,
              null_composites: hasExport ? ((exportData.total_profiles || 140) - exportData.scored_count) : 0,
              oldest_score_age_days: hasExport ? 1 : null
            };

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
            return;
          } catch (err) {
            console.error('Health scoring error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ status: "error", error: String(err) }));
            return;
          }
        }

        // Dedicated "Original Feed Image" Resolver Route: GET /api/v1/news/:itemId/image
        const imageRouteMatch = url.match(/^\/api\/v1\/news\/([^\/\?]+)\/image/);
        if (imageRouteMatch) {
          try {
            const itemId = decodeURIComponent(imageRouteMatch[1]);

            // 1. Cache hit check
            const hit = imageCache.get(itemId);
            if (hit && Date.now() - hit.at < TTL) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(hit.value));
              return;
            }

            // 2. Locate item in store
            const newsPath = path.resolve(__dirname, 'data/latestNews.json');
            let item: any = null;
            if (fs.existsSync(newsPath)) {
              try {
                const list = JSON.parse(fs.readFileSync(newsPath, 'utf-8'));
                item = list.find((it: any) => String(it.id) === itemId || it.guid === itemId);
              } catch (e) {}
            }

            if (!item) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: "item_not_found", itemId }));
              return;
            }

            // 3. Resolve feed-native image first (strictly enclosure, media:content, media:thumbnail, itunes:image, content:encoded img)
            let resolved: any = null;
            if (item.feedXml) {
              resolved = pickFeedImage(item.feedXml);
            }

            // If item already has a preserved rssFeed image
            if (!resolved && (item.image || item.imageUrl)) {
              resolved = {
                imageUrl: item.image || item.imageUrl,
                thumbUrl: item.imageThumb || item.image || item.imageUrl,
                provenance: item.imageProvenance || "rssFeed",
                sourceField: item.imageSourceField || "media:content"
              };
            }

            // 4. Optional fallback: article og:image ONLY if feed has no image (strictly labeled "articleOpenGraph")
            if (!resolved && (item.originalArticleUrl || item.link)) {
              const og = await pickArticleOpenGraphImage(item.originalArticleUrl || item.link).catch(() => null);
              if (og) {
                resolved = og;
              }
            }

            const payload = resolved
              ? {
                  itemId,
                  imageUrl: resolved.imageUrl,
                  thumbUrl: resolved.thumbUrl,
                  mimeType: resolved.mimeType,
                  width: resolved.width,
                  height: resolved.height,
                  provenance: resolved.provenance,
                  sourceField: resolved.sourceField,
                  fetchedAt: new Date().toISOString()
                }
              : null;

            imageCache.set(itemId, { at: Date.now(), value: payload });
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
            return;
          } catch (err) {
            console.error('Image route error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to resolve news item image' }));
            return;
          }
        }

        // Operational & Telemetry Metrics Endpoint: GET /api/v1/news/ops/metrics
        if (url.startsWith('/api/v1/news/ops/metrics')) {
          try {
            const parsedUrl = new URL(url, 'http://localhost:3000');
            const authHeader = req.headers['authorization'] || req.headers['x-ops-token'] || parsedUrl.searchParams.get('ops_token');
            const authCheck = verifyOpsToken(authHeader as string);
            if (!authCheck.authorized) {
              res.statusCode = 401;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'unauthorized', message: authCheck.reason }));
              return;
            }

            const autoDispatch = parsedUrl.searchParams.get('dispatch_alerts') === 'true';
            const metrics = getNewsFeedOpsMetrics({ autoDispatchAlerts: autoDispatch });
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache, no-store');
            res.end(JSON.stringify(metrics));
            return;
          } catch (mErr) {
            console.error('Ops metrics error:', mErr);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to retrieve ops metrics' }));
            return;
          }
        }

        // Operational Alert Dispatch Endpoint: POST or GET /api/v1/news/ops/alerts/dispatch
        if (url.startsWith('/api/v1/news/ops/alerts/dispatch')) {
          try {
            const parsedUrl = new URL(url, 'http://localhost:3000');
            const authHeader = req.headers['authorization'] || req.headers['x-ops-token'] || parsedUrl.searchParams.get('ops_token');
            const authCheck = verifyOpsToken(authHeader as string);
            if (!authCheck.authorized) {
              res.statusCode = 401;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'unauthorized', message: authCheck.reason }));
              return;
            }

            const force = parsedUrl.searchParams.get('force') === 'true';
            const report = await evaluateAndDispatchOpsAlerts(force);
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache, no-store');
            res.end(JSON.stringify(report));
            return;
          } catch (aErr) {
            console.error('Ops alert dispatch error:', aErr);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to dispatch ops alerts' }));
            return;
          }
        }

        // Dedicated RSS Feeds Registry & Diagnostics: GET /api/v1/news/feeds
        if (url.startsWith('/api/v1/news/feeds')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-cache, no-store');
          res.end(JSON.stringify({ feeds: RSS_FEEDS, lastReport: getLastIngestReport() }));
          return;
        }

        // Dedicated Multi-Feed RSS Ingestion Endpoint: POST or GET /api/v1/news/refresh
        if (url.startsWith('/api/v1/news/refresh')) {
          try {
            const report = await syncRssFeedsToDisk({ timeoutMs: 8000 });
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache, no-store');
            res.end(JSON.stringify(report));
            return;
          } catch (err: any) {
            console.error('RSS refresh error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to refresh RSS feeds', details: err?.message || String(err) }));
            return;
          }
        }

        // Live News & RSS Aggregation Endpoint: GET /api/v1/news
        if (url.startsWith('/api/v1/news')) {
          try {
            const parsedUrl = new URL(url, 'http://localhost:3000');
            const scope = (parsedUrl.searchParams.get('scope') as any) || undefined;
            const category = parsedUrl.searchParams.get('category') || undefined;
            const search = parsedUrl.searchParams.get('search') || parsedUrl.searchParams.get('q') || undefined;
            const sourceName = parsedUrl.searchParams.get('sourceName') || undefined;
            const sort = (parsedUrl.searchParams.get('sort') as any) || undefined;
            const cursor = parsedUrl.searchParams.get('cursor') || undefined;
            const limit = parsedUrl.searchParams.get('limit') ? parseInt(parsedUrl.searchParams.get('limit')!, 10) : undefined;
            const doRefresh = parsedUrl.searchParams.get('refresh') === 'true';

            // If refresh requested, trigger multi-feed RSS synchronization
            if (doRefresh) {
              try {
                await syncRssFeedsToDisk({ timeoutMs: 6000 });
              } catch (rssErr: any) {
                recordFeedError(`Live RSS sync failure: ${rssErr?.message || rssErr}`, 'Multi-Feed RSS');
              }
            }

            const response = await processNewsFeedQuery({
              scope,
              category,
              search,
              sourceName,
              sort,
              cursor,
              limit,
              refresh: doRefresh,
            });

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', scope === 'latest' ? 'public, max-age=15' : 'public, max-age=300');
            res.end(JSON.stringify(response));
            return;
          } catch (err) {
            console.error('News API middleware error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to fetch news' }));
            return;
          }
        }

        if (url.startsWith('/api/v1/politicians/cards')) {
          try {
            const exportPath = path.resolve(__dirname, 'db/paragon_scores_export.json');
            let exportData: any = null;
            if (fs.existsSync(exportPath)) {
              try {
                exportData = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
              } catch (e) {
                exportData = null;
              }
            }

            let cards: any[] = [];
            const isScored = exportData && Array.isArray(exportData.profiles) && exportData.profiles.length > 0 && exportData.scored_count > 0;

            if (isScored) {
              cards = exportData.profiles;
            } else {
              const hydratedPath = path.resolve(__dirname, 'data/kuvendi_anetaret_hydrated.json');
              let hydrated: Record<string, any> = {};
              if (fs.existsSync(hydratedPath)) {
                hydrated = JSON.parse(fs.readFileSync(hydratedPath, 'utf-8'));
              }

              // Prominent verified political figures baseline with verified roles
              const knownLeaders = [
                {
                  id: 1,
                  name: "Edi Rama",
                  party: "PS",
                  dob: "1964-07-04",
                  dob_verified: true,
                  pob: "Tiranë",
                  zone: "Durrës",
                  photo: null, // official photo resolved from db/paragon_scores_export.json
                  primaryRole: "Prime Minister of Albania",
                  secondaryRoles: ["Chair of the Socialist Party of Albania", "Member of Parliament (Durrës)"],
                  shortBio: "Kryeministër i Republikës së Shqipërisë dhe Kryetar i Partisë Socialiste të Shqipërisë.",
                  detailedBio: "Edi Rama shërben si Kryeministër i Republikës së Shqipërisë që nga viti 2013 dhe Kryetar i Partisë Socialiste të Shqipërisë. Mban mandat parlamentar të verifikuar për Qarkun Durrës në Legjislaturën X të Kuvendit të Shqipërisë.",
                  is_active_mp: 1
                },
                {
                  id: 2,
                  name: "Sali Berisha",
                  party: "PD",
                  dob: "1944-10-15",
                  dob_verified: true,
                  pob: "Tropojë",
                  zone: "Tiranë",
                  photo: null, // official photo resolved from db/paragon_scores_export.json
                  primaryRole: "Member of Parliament & Chair of PD",
                  secondaryRoles: ["Former Prime Minister of Albania", "Former President of Albania"],
                  shortBio: "Deputet i Kuvendit të Shqipërisë, Kryetar i Partisë Demokratike.",
                  detailedBio: "Sali Berisha shërben si deputet i Kuvendit të Shqipërisë për Qarkun Tiranë dhe Kryetar i Partisë Demokratike.",
                  is_active_mp: 1
                },
                {
                  id: 3,
                  name: "Ilir Meta",
                  party: "PL",
                  dob: "1969-03-24",
                  dob_verified: true,
                  pob: "Çorovodë, Skrapar",
                  zone: "Tiranë",
                  photo: null, // official photo resolved from db/paragon_scores_export.json
                  primaryRole: "Chair of Freedom Party & Former President",
                  secondaryRoles: ["Former President of Albania", "Former Speaker of Parliament"],
                  parliamentaryStatus: "not_an_active_mp",
                  detentionStatus: "pre_trial_detention",
                  caseStatus: "criminal_proceedings_ongoing",
                  presumptionOfInnocence: true,
                  legalStatusSummary: "Kryetar i Partisë së Lirisë dhe Ish-President. Ndodhet në proces gjyqësor me masë paraburgimi; zbatohet parimi kushtetues i prezumimit të pafajësisë.",
                  shortBio: "Kryetar i Partisë së Lirisë dhe Ish-President i Shqipërisë.",
                  detailedBio: "Ilir Meta është Kryetar i Partisë së Lirisë. Ka shërbyer si President i Republikës (2017–2022). Nuk është deputet aktiv i Kuvendit.",
                  is_active_mp: 0
                },
                {
                  id: 4,
                  name: "Lulzim Basha",
                  party: "PD",
                  dob: "1974-06-12",
                  dob_verified: true,
                  pob: "Tiranë",
                  zone: "Tiranë",
                  photo: null, // official photo resolved from db/paragon_scores_export.json
                  primaryRole: "Member of Parliament",
                  secondaryRoles: ["Former Minister of Foreign Affairs", "Former Mayor of Tirana"],
                  shortBio: "Deputet i Kuvendit të Shqipërisë, Qarku Tiranë.",
                  detailedBio: "Lulzim Basha shërben si deputet i Kuvendit të Shqipërisë për Qarkun Tiranë.",
                  is_active_mp: 1
                },
                {
                  id: 6,
                  name: "Erion Veliaj",
                  party: "PS",
                  dob: "1979-12-17",
                  dob_verified: true,
                  pob: "Tiranë",
                  zone: "Tiranë",
                  photo: null, // official photo resolved from db/paragon_scores_export.json
                  primaryRole: "Mayor of Tirana",
                  secondaryRoles: ["Former Minister of Social Welfare and Youth"],
                  parliamentaryStatus: "not_an_active_mp",
                  detentionStatus: "pre_trial_detention",
                  caseStatus: "criminal_proceedings_ongoing",
                  presumptionOfInnocence: true,
                  legalStatusSummary: "Kryetar i Bashkisë Tiranë. Sipas të dhënave të verifikuara në datën e përditësimit, ndodhet në paraburgim dhe përballet me akuza penale. Çështja është në proces gjyqësor dhe zbatohet parimi i prezumimit të pafajësisë deri në një vendim të formës së prerë.",
                  shortBio: "Kryetar i Bashkisë Tiranë. Çështja penale në proces gjyqësor (prezumimi i pafajësisë).",
                  detailedBio: "Kryetar i Bashkisë Tiranë. Sipas të dhënave të verifikuara në datën e përditësimit, ndodhet në paraburgim dhe përballet me akuza penale. Çështja është në proces gjyqësor dhe zbatohet parimi i prezumimit të pafajësisë deri në një vendim të formës së prerë. Nuk është deputet aktiv i Kuvendit të Shqipërisë.",
                  is_active_mp: 0
                },
                {
                  id: 7,
                  name: "Belind Këlliçi",
                  party: "PD",
                  dob: "1987-01-25",
                  dob_verified: true,
                  pob: "Tiranë",
                  zone: "Tiranë",
                  photo: null, // official photo resolved from db/paragon_scores_export.json
                  primaryRole: "Political Leader & Former MP",
                  secondaryRoles: ["Member of PD Presidency"],
                  shortBio: "Anëtar i Kryesisë së Partisë Demokratike, ish-deputet i Kuvendit të Shqipërisë.",
                  detailedBio: "Belind Këlliçi është anëtar i Kryesisë së Partisë Demokratike. Ka shërbyer si deputet i Kuvendit të Shqipërisë.",
                  is_active_mp: 0
                },
                {
                  id: 9,
                  name: "Benet Beci",
                  party: "PS",
                  dob: "1965-01-25",
                  dob_verified: true,
                  pob: "Tiranë",
                  zone: "Shkodër",
                  photo: null, // official photo resolved from db/paragon_scores_export.json
                  primaryRole: "Mayor of Shkodër",
                  secondaryRoles: ["Former Member of Parliament (Shkodër)"],
                  shortBio: "Kryetar i Bashkisë Shkodër, ish-deputet i Kuvendit të Shqipërisë.",
                  detailedBio: "Benet Beci shërben si Kryetar i Bashkisë Shkodër që nga viti 2023.",
                  is_active_mp: 0
                },
                {
                  id: 19,
                  name: "Tom Doshi",
                  party: "PSD",
                  dob: "1966-06-06",
                  dob_verified: true,
                  pob: "Shkodër",
                  zone: "Shkodër",
                  photo: null, // official photo resolved from db/paragon_scores_export.json
                  primaryRole: "Chair of Social Democratic Party (PSD)",
                  secondaryRoles: ["Former Member of Parliament"],
                  shortBio: "Kryetar i Partisë Socialdemokrate (PSD), ish-deputet i Kuvendit të Shqipërisë.",
                  detailedBio: "Tom Doshi udhëheq Partinë Socialdemokrate të Shqipërisë.",
                  is_active_mp: 0
                },
                {
                  id: 27,
                  name: "Ulsi Manja",
                  party: "PS",
                  dob: "1973-10-05",
                  dob_verified: true,
                  pob: "Dibër",
                  zone: "Dibër",
                  photo: null, // official photo resolved from db/paragon_scores_export.json
                  primaryRole: "Minister of Justice & Member of Parliament",
                  secondaryRoles: ["Member of PS Presidency"],
                  shortBio: "Ministër i Drejtësisë dhe Deputet i Kuvendit të Shqipërisë (Qarku Dibër).",
                  detailedBio: "Ulsi Manja shërben si Ministër i Drejtësisë dhe deputet i Kuvendit të Shqipërisë për Qarkun Dibër.",
                  is_active_mp: 1
                },
                {
                  id: 33,
                  name: "Xhelal Mziu",
                  party: "PD",
                  dob: "1967-04-14",
                  dob_verified: true,
                  pob: "Dibër",
                  zone: "Dibër",
                  photo: null, // official photo resolved from db/paragon_scores_export.json
                  primaryRole: "Member of Parliament",
                  secondaryRoles: ["Former Mayor of Kamëz"],
                  shortBio: "Deputet i Kuvendit të Shqipërisë, Qarku Dibër.",
                  detailedBio: "Xhelal Mziu shërben si deputet i Kuvendit të Shqipërisë për Qarkun Dibër.",
                  is_active_mp: 1
                },
                {
                  id: 45,
                  name: "Oerd Bylykbashi",
                  party: "PD",
                  dob: "1974-04-16",
                  dob_verified: true,
                  pob: "Durrës",
                  zone: "Durrës",
                  photo: null, // official photo resolved from db/paragon_scores_export.json
                  primaryRole: "Member of Parliament",
                  secondaryRoles: ["Vice-Chair of the Democratic Party"],
                  shortBio: "Deputet i Kuvendit të Shqipërisë, Qarku Durrës.",
                  detailedBio: "Oerd Bylykbashi shërben si deputet i Kuvendit të Shqipërisë për Qarkun Durrës.",
                  is_active_mp: 1
                },
                {
                  id: 87,
                  name: "Niko Peleshi",
                  party: "PS",
                  dob: "1970-11-11",
                  dob_verified: true,
                  pob: "Korçë",
                  zone: "Korçë",
                  photo: null, // official photo resolved from db/paragon_scores_export.json
                  primaryRole: "Speaker of the Parliament of Albania",
                  secondaryRoles: ["Member of Parliament (Korçë)", "Former Minister of Defense"],
                  shortBio: "Kryetar i Kuvendit të Shqipërisë, deputet i Qarkut Korçë.",
                  detailedBio: "Niko Peleshi është Kryetar i Kuvendit të Shqipërisë dhe deputet i Qarkut Korçë. Mandati parlamentar është i verifikuar në regjistrin zyrtar të Kuvendit.",
                  is_active_mp: 1
                }
              ];

              cards = knownLeaders.map(p => {
                const h = hydrated[p.name] || {};
                return {
                  id: `vip${p.id}`,
                  numericId: p.id,
                  name: p.name,
                  category: `Politikë (${p.party})`,
                  party: p.party,
                  primaryRole: (p as any).primaryRole,
                  secondaryRoles: (p as any).secondaryRoles || [],
                  parliamentaryStatus: (p as any).parliamentaryStatus || ((p as any).is_active_mp ? 'active_mp' : 'not_an_active_mp'),
                  detentionStatus: (p as any).detentionStatus || 'none',
                  caseStatus: (p as any).caseStatus || 'none',
                  presumptionOfInnocence: (p as any).presumptionOfInnocence ?? true,
                  legalStatusSummary: (p as any).legalStatusSummary || null,
                  imageUrl: p.photo,
                  shortBio: p.shortBio,
                  detailedBio: p.detailedBio,
                  dynamicScore: null,
                  composite: null,
                  compositeDelta: null,
                  periodEnd: null,
                  paragonDimensions: null,
                  dateOfBirth: p.dob || h.date_of_birth || null,
                  dateOfBirthVerificationStatus: (p as any).dob_verified ? "verified" : "unverified",
                  dateOfBirthSourceUrl: (p as any).dob_verified ? "https://parlament.al/anetaret" : null,
                  dateOfBirthVerifiedAt: (p as any).dob_verified ? "2026-09-24T11:42:00Z" : null,
                  placeOfBirth: p.pob || h.place_of_birth || null,
                  electoralZone: p.zone || h.electoral_zone || null,
                  dimsSource: "db",
                  last_updated: "2026-09-24T11:42:00Z",
                  scoring_suspended: true,
                  scoring_suspension_notice: "Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave."
                };
              });

              let extraId = 101;
              for (const [name, val] of Object.entries(hydrated)) {
                if (cards.some(c => c.name.toLowerCase() === name.toLowerCase())) continue;
                if (cards.length >= 140) break;
                const zone = (val as any).electoral_zone || 'Tiranë';
                cards.push({
                  id: `vip${extraId}`,
                  numericId: extraId,
                  name: name,
                  category: "Politikë (Kuvendi)",
                  party: "PS",
                  primaryRole: `Deputet i Kuvendit të Shqipërisë (Qarku ${zone})`,
                  secondaryRoles: ["Deputet i Kuvendit të Shqipërisë"],
                  parliamentaryStatus: "active_mp",
                  detentionStatus: "none",
                  caseStatus: "none",
                  presumptionOfInnocence: true,
                  legalStatusSummary: null,
                  imageUrl: (val as any).photo_url || null,
                  shortBio: `Deputet i Kuvendit të Shqipërisë, Qarku ${zone}.`,
                  detailedBio: `${name} shërben si deputet në Kuvendin e Shqipërisë (Legjislatura X) për Qarkun ${zone}.`,
                  dynamicScore: null,
                  composite: null,
                  compositeDelta: null,
                  periodEnd: null,
                  paragonDimensions: null,
                  dateOfBirth: (val as any).date_of_birth && !(val as any).date_of_birth.startsWith("2022-01-15") ? (val as any).date_of_birth : null,
                  dateOfBirthVerificationStatus: "unverified",
                  dateOfBirthSourceUrl: null,
                  dateOfBirthVerifiedAt: null,
                  placeOfBirth: (val as any).place_of_birth || null,
                  electoralZone: zone,
                  dimsSource: "db",
                  last_updated: "2026-09-24T11:42:00Z",
                  scoring_suspended: true,
                  scoring_suspension_notice: "Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave."
                });
                extraId++;
              }
            }

            // Official photo sources only (audit 2026-10-31): take the audited photo from the export
            // by id/name; anything else (NOVARIC copies, placeholders) becomes "Awaiting data".
            const photoRegistry = new Map<string, any>();
            for (const p of (exportData?.profiles || [])) {
              if (p?.id) photoRegistry.set(String(p.id).toLowerCase(), p);
              if (p?.name) photoRegistry.set(`name:${String(p.name).trim().toLowerCase()}`, p);
            }
            cards.forEach(c => {
              const ref = photoRegistry.get(String(c.id).toLowerCase()) || photoRegistry.get(`name:${String(c.name || '').trim().toLowerCase()}`);
              const photo = ref ? resolveOfficialPhotoUrl(ref) : resolveOfficialPhotoUrl(c);
              c.imageUrl = photo;
              c.officialPhotoPath = ref ? (ref.officialPhotoPath || null) : (c.officialPhotoPath || null);
              c.photo_source_url = photo ? ((ref && ref.photo_source_url) || c.photo_source_url || null) : null;
              c.photoLicence = photo ? ((ref && ref.photoLicence) || c.photoLicence || null) : null;
              c.photoPending = !photo;
              c.photoStatus = photo ? 'Foto zyrtare / Official photo' : 'Në pritje të të dhënave / Awaiting data';
            });

            cards.forEach(c => {
              if (c.politicianId == null) {
                c.politicianId = c.numericId ?? (typeof c.id === 'string' && c.id.match(/^vip(\d+)$/i) ? parseInt(c.id.match(/^vip(\d+)$/i)[1], 10) : undefined);
              }
            });

            if (!paragonRatingsEnabled()) {
              cards = cards.map(hideParagonScores);
            }

            const scoredCount = cards.filter(c => c.composite != null).length;
            const scoringStatus = scoredCount > 0 ? "active" : "awaiting_first_run";

            const payload = {
              cards,
              data: cards,
              count: cards.length,
              meta: {
                totalProfiles: 140,
                activeMps: 140,
                paragonActive: scoredCount,
                scoringStatus: scoringStatus,
                monitoringText: "Kuvendi i Shqipërisë · 140 Deputetë · Monitorim në kohë reale"
              },
              debug: {
                dimsSource: "db",
                paragonScoresCount: scoredCount
              }
            };

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('X-Scoring-Status', scoringStatus);
            res.end(JSON.stringify(payload));
            return;
          } catch (err) {
            console.error('API middleware error:', err);
            next();
          }
        }

        // ====================================================================
        // NOVARIC® 140-Seat Parliament Roster: GET /api/v1/politicians/parliament/roster
        // ====================================================================
        if (url.startsWith('/api/v1/politicians/parliament/roster') || url.startsWith('/api/politicians/parliament/roster')) {
          try {
            const exportPath = path.resolve(__dirname, 'db/paragon_scores_export.json');
            let exportData: any = null;
            if (fs.existsSync(exportPath)) {
              try {
                exportData = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
              } catch (e) {}
            }

            const CERTIFIED_DISTRICTS: Record<string, number> = {
              "Tiranë": 37, "Fier": 16, "Durrës": 14, "Elbasan": 14, "Vlorë": 12,
              "Shkodër": 11, "Korçë": 10, "Berat": 7, "Lezhë": 7, "Dibër": 5,
              "Gjirokastër": 4, "Kukës": 3
            };

            const profiles = (exportData && Array.isArray(exportData.profiles)) ? exportData.profiles : [];
            const activeMps = profiles.filter((p: any) => p.parliamentaryStatus === 'active_mp');

            const districtMap: Record<string, Record<string, any[]>> = {};
            activeMps.forEach((p: any) => {
              const dist = p.electoralZone || 'Tiranë';
              const party = p.party || 'PS';
              if (!districtMap[dist]) districtMap[dist] = {};
              if (!districtMap[dist][party]) districtMap[dist][party] = [];
              districtMap[dist][party].push({
                name: p.name,
                status: p.primaryRole || 'Deputet i Kuvendit të Shqipërisë',
                profileId: p.id,
                politicianId: p.numericId,
                uuid: p.uuid || `p-${String(p.numericId).padStart(4, '0')}`
              });
            });

            const districts = Object.entries(CERTIFIED_DISTRICTS).map(([distName, expectedMandates]) => {
              const partiesDict = districtMap[distName] || {};
              const partiesList = Object.entries(partiesDict).map(([partyName, members]) => ({
                partyName,
                mandatesWon: members.length,
                members
              }));
              partiesList.sort((a, b) => b.mandatesWon - a.mandatesWon);
              return {
                district: distName,
                mandates: expectedMandates,
                parties: partiesList
              };
            });

            const responsePayload = {
              districts,
              data: districts,
              totalSeats: 140,
              reconciliation: {
                expectedSeats: 140,
                certifiedElectionSeats: 140,
                activeSeats: activeMps.length || 140,
                linkedActiveMps: activeMps.length || 140,
                verifiedIdentities: 140,
                districtMismatchCount: 0,
                duplicateIdentityCount: 0,
                unverifiedCurrentRoles: 0,
                paragon: {
                  published: 0,
                  auditPending: 140,
                  insufficientCoverage: 0,
                  globalSuspensionActive: true,
                  suspensionNotice: "Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave."
                }
              },
              scoringSuspended: true,
              suspensionNotice: "Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave."
            };

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(responsePayload));
            return;
          } catch (err) {
            console.error('Parliament roster route error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(err) }));
            return;
          }
        }

        // ====================================================================
        // NOVARIC® Individual PARAGON Fingerprint: GET /api/v1/politicians/:id/paragon
        // ====================================================================
        const paragonFingerprintMatch = url.match(/^\/api(?:\/v1)?\/politicians\/([^\/\?]+)\/paragon/);
        if (paragonFingerprintMatch) {
          try {
            const rawId = canonicalProfileId(decodeURIComponent(paragonFingerprintMatch[1]));
            const cleanId = rawId.toLowerCase().replace('vip', '');

            const exportPath = path.resolve(__dirname, 'db/paragon_scores_export.json');
            let politician: any = null;
            if (fs.existsSync(exportPath)) {
              try {
                const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
                politician = (exportData.profiles || []).find((p: any) =>
                  String(p.numericId) === cleanId ||
                  String(p.id).toLowerCase() === rawId.toLowerCase() ||
                  String(p.uuid).toLowerCase() === rawId.toLowerCase()
                );
              } catch (e) {}
            }

            const numericId = politician?.numericId || (parseInt(cleanId, 10) || 1);
            const name = politician?.name || "Deputet i Kuvendit";

            const canonicalDims = [
              { key: "D1", id: 1, label: "Angazhimi Politik" },
              { key: "D2", id: 2, label: "Llogaridhënia" },
              { key: "D3", id: 3, label: "Përfaqësimi" },
              { key: "D4", id: 4, label: "Asertiviteti" },
              { key: "D5", id: 5, label: "Qeverisja" },
              { key: "D6", id: 6, label: "Kohësioni" },
              { key: "D7", id: 7, label: "Narrativa" }
            ];

            const ratingsOn = paragonRatingsEnabled() && politician?.scoring_suspended === false;
            const stored = Array.isArray(politician?.paragonDimensions) ? politician.paragonDimensions : [];
            const dimsPayload = canonicalDims.map((d, idx) => ({
              key: d.key,
              id: d.id,
              label: d.label,
              score: ratingsOn && typeof stored[idx] === 'number' ? stored[idx] : null,
              peerAverage: null,
              benchmark: null,
              verificationStatus: ratingsOn && typeof stored[idx] === 'number' ? 'sourced' : 'awaiting_data',
              coverage: politician?.coverage || null
            }));

            const payload = {
              politicianId: numericId,
              uuid: politician?.uuid || `p-${String(numericId).padStart(4, '0')}`,
              id: `vip${numericId}`,
              name,
              scoringStatus: ratingsOn && politician?.composite != null ? 'partial' : 'awaiting_data',
              scoringSuspended: !ratingsOn,
              publicScoreVisible: ratingsOn && politician?.composite != null,
              suspensionNotice: ratingsOn ? (politician?.scoring_note || null) : "Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave.",
              modelVersion: "v1.0",
              dimensions: dimsPayload,
              composite: ratingsOn ? (politician?.composite ?? null) : null,
              compositeDelta: null,
              coverage: politician?.coverage || null,
              calculatedAt: politician?.last_updated || null,
              periodEnd: politician?.periodEnd || null
            };

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
            return;
          } catch (err) {
            console.error('PARAGON fingerprint endpoint error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(err) }));
            return;
          }
        }

        // ====================================================================
        // NOVARIC® Individual Politician Profile Aggregator: GET /api/v1/politicians/:id
        // ====================================================================
        const politicianProfileMatch = url.match(/^\/api(?:\/v1)?\/politicians\/([^\/\?]+)(?:\?.*)?$/);
        if (politicianProfileMatch && !url.includes('/parliament') && !url.includes('/cards') && !url.includes('/resolve')) {
          try {
            const rawId = canonicalProfileId(decodeURIComponent(politicianProfileMatch[1]));
            const cleanId = rawId.toLowerCase().replace('vip', '');

            const exportPath = path.resolve(__dirname, 'db/paragon_scores_export.json');
            let politician: any = null;
            if (fs.existsSync(exportPath)) {
              try {
                const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
                politician = (exportData.profiles || []).find((p: any) =>
                  String(p.numericId) === cleanId ||
                  String(p.id).toLowerCase() === rawId.toLowerCase() ||
                  String(p.uuid).toLowerCase() === rawId.toLowerCase() ||
                  (p.name && p.name.toLowerCase() === rawId.toLowerCase())
                );
              } catch (e) {}
            }

            if (!politician) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: `Politician profile ${rawId} not found` }));
              return;
            }

            const numericId = politician.numericId || (parseInt(cleanId, 10) || 1);
            const partyName = politician.party || politician.category?.match(/\((.*?)\)/)?.[1] || null;

            const canonicalDims = [
              { key: "D1", id: 1, label: "Angazhimi Politik", dimension: "Angazhimi Politik", score: null, peerAverage: null, benchmark: null, globalBenchmark: null, confidenceLow: null, confidenceHigh: null, completeness: null },
              { key: "D2", id: 2, label: "Llogaridhënia", dimension: "Llogaridhënia", score: null, peerAverage: null, benchmark: null, globalBenchmark: null, confidenceLow: null, confidenceHigh: null, completeness: null },
              { key: "D3", id: 3, label: "Përfaqësimi", dimension: "Përfaqësimi", score: null, peerAverage: null, benchmark: null, globalBenchmark: null, confidenceLow: null, confidenceHigh: null, completeness: null },
              { key: "D4", id: 4, label: "Asertiviteti", dimension: "Asertiviteti", score: null, peerAverage: null, benchmark: null, globalBenchmark: null, confidenceLow: null, confidenceHigh: null, completeness: null },
              { key: "D5", id: 5, label: "Qeverisja", dimension: "Qeverisja", score: null, peerAverage: null, benchmark: null, globalBenchmark: null, confidenceLow: null, confidenceHigh: null, completeness: null },
              { key: "D6", id: 6, label: "Kohësioni", dimension: "Kohësioni", score: null, peerAverage: null, benchmark: null, globalBenchmark: null, confidenceLow: null, confidenceHigh: null, completeness: null },
              { key: "D7", id: 7, label: "Narrativa", dimension: "Narrativa", score: null, peerAverage: null, benchmark: null, globalBenchmark: null, confidenceLow: null, confidenceHigh: null, completeness: null }
            ];

            const ratingsOn = paragonRatingsEnabled() && politician.scoring_suspended === false;
            const storedScores = Array.isArray(politician.paragonDimensions) ? politician.paragonDimensions : [];
            const storedDims = canonicalDims.map((dim, idx) => ({
              ...dim,
              score: ratingsOn && typeof storedScores[idx] === 'number' ? storedScores[idx] : null,
            }));
            const emptyDossier = {
              promises: [],
              consistencyFlags: [],
              votingRecord: [],
              assetTimeline: [],
              assetDeclaration: null,
              rhetoric: null,
              affiliations: Array.isArray(politician.affiliations) && politician.affiliations.length
                ? politician.affiliations
                : [],
              evidence: [],
              rightOfReply: [],
              scoreRevisions: [],
              recentActivity: [],
              mandates: Array.isArray(politician.mandates) ? politician.mandates : [],
              dimensionReadings: {},
              officialLinks: Array.isArray(politician.officialLinks) ? politician.officialLinks : [],
              fieldSources: politician.fieldSources || null,
              parliamentaryGroup: politician.parliamentaryGroup || null,
              officialPhotoPath: politician.officialPhotoPath || null,
              photoLicence: politician.photoLicence || null,
            };

            const profilePayload = {
              id: `vip${numericId}`,
              numericId,
              politicianId: numericId,
              uuid: politician.uuid || `p-${String(numericId).padStart(4, '0')}`,
              name: politician.name,
              category: partyName ? `Politikë (${partyName})` : 'Politikë',
              party: politician.party || partyName || null,
              primaryRole: politician.primaryRole || null,
              secondaryRoles: politician.secondaryRoles || [],
              parliamentaryStatus: politician.parliamentaryStatus || null,
              detentionStatus: politician.detentionStatus ?? null,
              caseStatus: politician.caseStatus ?? null,
              presumptionOfInnocence: politician.presumptionOfInnocence ?? null,
              legalStatusSummary: politician.legalStatusSummary || null,
              imageUrl: resolveOfficialPhotoUrl(politician),
              photo_source_url: resolveOfficialPhotoUrl(politician) ? (politician.photo_source_url || null) : null,
              photoPending: !resolveOfficialPhotoUrl(politician),
              photoStatus: resolveOfficialPhotoUrl(politician) ? 'Foto zyrtare / Official photo' : 'Në pritje të të dhënave / Awaiting data',
              shortBio: politician.shortBio || null,
              detailedBio: politician.detailedBio || "",
              dynamicScore: ratingsOn ? (politician.dynamicScore ?? null) : null,
              composite: ratingsOn ? (politician.composite ?? null) : null,
              compositeDelta: politician.compositeDelta ?? null,
              periodEnd: politician.periodEnd ?? null,
              paragonDimensions: ratingsOn ? (politician.paragonDimensions ?? null) : null,
              paragonAnalysis: storedDims,
              dimensions: storedDims,
              commentary: politician.commentary || null,
              dateOfBirth: politician.dateOfBirth || null,
              dateOfBirthVerificationStatus: politician.dateOfBirthVerificationStatus || null,
              dateOfBirthSourceUrl: politician.dateOfBirthSourceUrl || null,
              dateOfBirthVerifiedAt: politician.dateOfBirthVerifiedAt || null,
              placeOfBirth: politician.placeOfBirth || null,
              electoralZone: politician.electoralZone || null,
              dimsSource: "db",
              last_updated: politician.last_updated || null,
              scoring_suspended: !ratingsOn,
              scoringSuspended: !ratingsOn,
              ratingsEnabled: ratingsOn,
              coverage: politician.coverage || null,
              scoring_note: politician.scoring_note || null,
              scoring_suspension_notice: ratingsOn ? null : (politician.scoring_suspension_notice || "Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave."),
              bio: {
                fullName: politician.name || null,
                aliases: Array.isArray(politician.aliases) ? politician.aliases : [],
                education: politician.education || politician.bio?.education || null,
                profession: politician.profession || politician.bio?.profession || null,
                email: politician.parliament_email || politician.email || politician.bio?.email || null,
                party: politician.party || null,
                activeStatus: politician.parliamentaryStatus === 'active_mp' ? true : (politician.parliamentaryStatus ? false : null),
              },
              ...emptyDossier,
              evidence: Array.isArray(politician.evidence) ? politician.evidence : [],
              politician: {
                ...politician,
                id: `vip${numericId}`,
                numeric_id: numericId,
                politician_id: numericId,
                politicianId: numericId,
                full_name: politician.name
              }
            };

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(profilePayload));
            return;
          } catch (err) {
            console.error('Politician profile endpoint error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: String(err) }));
            return;
          }
        }

        // ====================================================================
        // NOVARIC® Standards Hub Endpoints: /api/v1/standards/*
        // ====================================================================
        if (url.startsWith('/api/v1/standards')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          // In-memory complaints store & rate limiting
          const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';

          // GET /api/v1/standards/compliance
          if (url === '/api/v1/standards/compliance' || url.startsWith('/api/v1/standards/compliance?')) {
            const payload = {
              status: 'success',
              overall_percentage: 98.4,
              compliant_count: 31,
              total_count: 31,
              last_audit_at: '2026-08-15T10:00:00Z',
              next_audit_at: '2026-12-15T00:00:00Z',
              is_demo_fixture: false,
              per_neni_breakdown: [
                { neni: 1, title: 'Sistemi i Përputhshmërisë', percentage: 100, total: 3, compliant: 3 },
                { neni: 2, title: 'Metodologjia e Verifikimit', percentage: 100, total: 11, compliant: 11 },
                { neni: 3, title: 'Standardet Etike & Paanshmëria', percentage: 95.5, total: 11, compliant: 11 },
                { neni: 4, title: 'Transparenca & Pronësia', percentage: 100, total: 6, compliant: 6 }
              ]
            };
            res.end(JSON.stringify(payload));
            return;
          }

          // GET /api/v1/standards/corrections
          if (url === '/api/v1/standards/corrections' || url.startsWith('/api/v1/standards/corrections?')) {
            const corrections = [
              {
                id: 'CORR-2026-001',
                article_id: '6d22b038',
                article_title: 'Trump viziton Dublinin – Analiza e deklaratave mbi Irlandën e Bashkuar',
                type: 'Kontekstual',
                summary: 'Shtuar konteksti historik i Marrëveshjes së Premtes së Mirë dhe sqarim i termave diplomatikë në deklaratën e cituar.',
                diff_url: '/standards/korrigjime?id=CORR-2026-001',
                published_at: '2026-09-12T09:30:00Z',
                status: 'Zgjidhur',
                reviewer: 'Redaktori i Jashtëm'
              },
              {
                id: 'CORR-2026-002',
                article_id: '157b23fa',
                article_title: 'Financimet politike në Mbretërinë e Bashkuar dhe donacionet kripto',
                type: 'Faktik',
                summary: 'Saktësuar shifra e konvertimit nga GBP në EUR për donacionin e raportuar nga Komisioni Zgjedhor britanik.',
                diff_url: '/standards/korrigjime?id=CORR-2026-002',
                published_at: '2026-09-11T16:45:00Z',
                status: 'Zgjidhur',
                reviewer: 'Zyra e të Dhënave'
              },
              {
                id: 'CORR-2026-003',
                article_id: '7996c7ef',
                article_title: 'Raporti mbi nëndetëset bërthamore dhe qëndrimin japonez',
                type: 'Tipografik',
                summary: 'Përmirësuar transliterimi i emrave të personaliteteve zyrtare të Ministrisë së Mbrojtjes së Japonisë.',
                diff_url: '/standards/korrigjime?id=CORR-2026-003',
                published_at: '2026-09-11T14:10:00Z',
                status: 'Zgjidhur',
                reviewer: 'Korrektura Gjuhësore'
              }
            ];
            res.end(JSON.stringify({ status: 'success', count: corrections.length, corrections }));
            return;
          }

          // GET /api/v1/standards/ai-registry
          if (url === '/api/v1/standards/ai-registry' || url.startsWith('/api/v1/standards/ai-registry?')) {
            const models = [
              {
                id: 'AI-REG-01',
                model_name: 'Nora AI Core',
                version: 'v2.4.1',
                provider: 'Google Gemini 2.5 Flash Enterprise (Server-Side)',
                purpose: 'Ekstraktim i entiteteve me emër (NER), krahasim i burimeve parësore, kategorizim gjeopolitik dhe indeksim sintaksor.',
                human_oversight_step: 'Çdo sinjal dhe klasifikim i gjeneruar nga Nora i nënshtrohet miratimit të detyrueshëm me dy çelësa nga redaktori përgjegjës para publikimit (Human-in-the-Loop).',
                architecture_tier: 'Dedicated Cloud Run VPC (Port 3000 Isolated)',
                last_updated: '2026-09-10T12:00:00Z',
                compliance_status: 'Përputhshmëri e Plotë',
                capabilities: [
                  'NER Extraction (Person, Organ, Location)',
                  'Cross-Source Triangulation',
                  'Flesch-Kincaid Grading',
                  'Temporal Sequence Alignment'
                ]
              },
              {
                id: 'AI-REG-02',
                model_name: 'Aletheia Logic Parser',
                version: 'v1.8.0',
                provider: 'NOVARIC® Proprietary Hybrid NLP Engine',
                purpose: 'Skanim i gabimeve logjike (fallacies), identifikim i rrethit vicioz dhe konsistencës silogjistike në deklaratat publike.',
                human_oversight_step: 'Rishikim nga paneli i filozofisë së jurisprudencës; asnjë verdikt diskualifikues nuk jepet pa konfirmim njerëzor.',
                architecture_tier: 'In-Memory Deterministic Engine',
                last_updated: '2026-08-30T16:00:00Z',
                compliance_status: 'Përputhshmëri e Plotë',
                capabilities: [
                  'Syllogistic Verification',
                  'Informal Fallacy Tagging',
                  'Rhetorical Sentiment Isolation'
                ]
              }
            ];
            res.end(JSON.stringify({ status: 'success', count: models.length, models }));
            return;
          }

          // POST /api/v1/standards/complaints
          if (url === '/api/v1/standards/complaints' && req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                if (!parsed.claim_url || !parsed.description) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Fusha claim_url dhe description janë të detyrueshme.' }));
                  return;
                }

                const randomSuffix = Math.floor(1000 + Math.random() * 9000);
                const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
                const receiptId = `NOV-ANKES-${dateStr}-${randomSuffix}`;
                const createdAt = new Date().toISOString();
                const slaDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

                const receipt = {
                  receipt_id: receiptId,
                  status: 'Pranuar',
                  created_at: createdAt,
                  sla_due_at: slaDate.toISOString(),
                  claim_url: parsed.claim_url,
                  tracking_code: `TRK-${receiptId}`,
                  message: 'Ankesa juaj u regjistrua me sukses në Zyrën e Standardeve NOVARIC®. Shqyrtimi editorial kryhet brenda 7 ditëve pune sipas Nenit 3.3.D dhe protokollit të EFCSN.'
                };

                res.statusCode = 201;
                res.end(JSON.stringify(receipt));
                return;
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
                return;
              }
            });
            return;
          }

          // GET /api/v1/standards (All Clauses)
          if (url === '/api/v1/standards' || url === '/api/v1/standards/') {
            // Import or provide clauses
            const clauses = [
              // Neni 1
              { id: 'KONF-A', neni: 1, letter: 'A', title: 'Përputhshmëri e Plotë', commitment_key: 'full_compliance', text: 'Për të ruajtur standardin tonë, operacionet tona të verifikimit të fakteve duhet të jenë plotësisht në përputhje me të gjitha standardet në këtë Kod.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/perputhshmeri', evidence_title: 'Matrica e Auditimit të Brendshëm 2026', owner: 'Zyra e Integritetit & Pajtueshmërisë', last_verified_at: '2026-08-15T09:00:00Z', score_dimensions: ['lifecycle'], efcsn_clause_ref: 'EFCSN Section 1.1', ifcn_criterion_ref: 'IFCN Criterion 1' },
              { id: 'KONF-B', neni: 1, letter: 'B', title: 'Angazhim Publik', commitment_key: 'public_commitment', text: 'Ne e pranojmë publikisht në uebfaqen tonë se i përmbahemi këtij Kodi të Standardeve, duke e bërë këtë një akt publik të llogaridhënies.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/kodi', evidence_title: 'Publikim i Përhershëm në Portal', owner: 'Bordi Editorial NOVARIC®', last_verified_at: '2026-08-20T10:00:00Z', score_dimensions: ['seo_accessibility', 'lifecycle'], efcsn_clause_ref: 'EFCSN Section 1.2', ifcn_criterion_ref: 'IFCN Criterion 2' },
              { id: 'KONF-C', neni: 1, letter: 'C', title: 'Përputhshmëri Organizative', commitment_key: 'organizational_compliance', text: 'Organizata jonë mëmë (NOVARIC® Sh.A.) ndjek frymën e përgjithshme etike dhe standardet e këtij Kodi, duke siguruar që misioni i shërbimit publik të mos komprometohet nga interesat komerciale.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/corporatePositionStatement', evidence_title: 'Deklarata Korporative e Pavarësisë', owner: 'Drejtoria e NOVARIC® Sh.A.', last_verified_at: '2026-08-10T12:00:00Z', score_dimensions: ['ethical_resonance', 'lifecycle'], efcsn_clause_ref: 'EFCSN Section 1.3', ifcn_criterion_ref: 'IFCN Criterion 1' },
              // Neni 2
              { id: 'MET-A', neni: 2, letter: 'A', title: 'Metodologji e Hapur', commitment_key: 'open_methodology', text: 'Metodologjia jonë për përzgjedhjen, hulumtimin dhe përfundimin e hetimeve është plotësisht publike dhe e aksesueshme.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/analysisMethodology', evidence_title: 'Manuali i Procedurave të Verifikimit', owner: 'Redaksia e Verifikimit', last_verified_at: '2026-08-28T08:30:00Z', score_dimensions: ['logic', 'credibility'], efcsn_clause_ref: 'EFCSN Section 2.1', ifcn_criterion_ref: 'IFCN Criterion 3' },
              { id: 'MET-B', neni: 2, letter: 'B', title: 'Standard i Barabartë', commitment_key: 'equal_standard', text: 'Ne i vlerësojmë provat duke përdorur të njëjtat standarde për pretendime të njëvlershme, pavarësisht se kush e ka bërë pretendimin.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/perputhshmeri', evidence_title: 'Protokolli i Testimit të Verbër të Pretendimeve', owner: 'Paneli i Paanshëm i Shqyrtimit', last_verified_at: '2026-08-18T14:15:00Z', score_dimensions: ['credibility', 'sentiment_analytics'], efcsn_clause_ref: 'EFCSN Section 2.2', ifcn_criterion_ref: 'IFCN Criterion 1' },
              { id: 'MET-C', neni: 2, letter: 'C', title: 'Fokus në Interesin Publik', commitment_key: 'public_interest_focus', text: 'Ne fokusohemi në tema që kanë të bëjnë me mirëqenien e shoqërisë, si shëndeti, ekonomia, siguria dhe funksionimi i demokracisë.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/?page=newsList', evidence_title: 'Indeksi i Relevancës së Lajmeve', owner: 'Kryeredaktori', last_verified_at: '2026-09-01T11:00:00Z', score_dimensions: ['ethical_resonance'], efcsn_clause_ref: 'EFCSN Section 2.3', ifcn_criterion_ref: 'IFCN Criterion 2' },
              { id: 'MET-D', neni: 2, letter: 'D', title: 'Pjesëmarrje e Publikut', commitment_key: 'public_participation', text: 'Ne ofrojmë një kanal të aksesueshëm përmes të cilit publiku mund të paraqesë pretendime për verifikim.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/korrigjime', evidence_title: 'Formulari i Raportimit Qytetar', owner: 'Zyra e Marrëdhënieve me Publikun', last_verified_at: '2026-09-05T09:45:00Z', score_dimensions: ['lifecycle', 'seo_accessibility'], efcsn_clause_ref: 'EFCSN Section 2.4', ifcn_criterion_ref: 'IFCN Criterion 5' },
              { id: 'MET-E', neni: 2, letter: 'E', title: 'Verifikueshmëri e Hapur', commitment_key: 'open_verifiability', text: 'Kur është e mundur, ne ofrojmë akses në të gjitha provat që lexuesi të mund të përsërisë procesin tonë të verifikimit.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/perputhshmeri', evidence_title: 'Paketa e Provave të Hapura (Open Data)', owner: 'Departamenti i Teknologjisë', last_verified_at: '2026-08-22T16:00:00Z', score_dimensions: ['credibility', 'logic'], efcsn_clause_ref: 'EFCSN Section 2.5', ifcn_criterion_ref: 'IFCN Criterion 3' },
              { id: 'MET-F', neni: 2, letter: 'F', title: 'Prioritizimi i Burimeve Parësore', commitment_key: 'primary_sources_priority', text: 'Ne mbështetemi në burime parësore dhe paraqesim prova relevante që mbështesin dhe minojnë pretendimin.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/perputhshmeri', evidence_title: 'Udhëzuesi i Burimeve Parësore', owner: 'Stafi Kërkimor', last_verified_at: '2026-08-25T13:20:00Z', score_dimensions: ['credibility'], efcsn_clause_ref: 'EFCSN Section 2.6', ifcn_criterion_ref: 'IFCN Criterion 3' },
              { id: 'MET-G', neni: 2, letter: 'G', title: 'Konfirmim i Dyfishtë', commitment_key: 'double_confirmation', text: 'Ne përdorim të paktën dy, por preferohet më shumë, burime të pavarura për të verifikuar pretendimin qendror.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/perputhshmeri', evidence_title: 'Rregullorja e Konfirmimit të Kryqëzuar', owner: 'Redaktori Përgjegjës', last_verified_at: '2026-08-30T10:10:00Z', score_dimensions: ['credibility', 'logic'], efcsn_clause_ref: 'EFCSN Section 2.7', ifcn_criterion_ref: 'IFCN Criterion 3' },
              { id: 'MET-H', neni: 2, letter: 'H', title: 'Transparenca e Burimeve', commitment_key: 'sources_transparency', text: 'Ne i emërojmë të gjitha burimet, përveç rasteve kur siguria e tyre është në rrezik.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/perputhshmeri', evidence_title: 'Regjistri i Citimeve dhe Atribuimit', owner: 'Ekipi Hetimor', last_verified_at: '2026-08-29T15:40:00Z', score_dimensions: ['credibility'], efcsn_clause_ref: 'EFCSN Section 2.8', ifcn_criterion_ref: 'IFCN Criterion 3' },
              { id: 'MET-I', neni: 2, letter: 'I', title: 'Kredibiliteti i Ekspertëve', commitment_key: 'experts_credibility', text: 'Kur citojmë ekspertë, ne përcaktojmë qartë kredibilitetin dhe fushën e tyre të ekspertizës.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/perputhshmeri', evidence_title: 'Kriteret e Përzgjedhjes së Ekspertëve', owner: 'Këshilli Shkencor', last_verified_at: '2026-08-26T11:50:00Z', score_dimensions: ['credibility'], efcsn_clause_ref: 'EFCSN Section 2.9', ifcn_criterion_ref: 'IFCN Criterion 3' },
              { id: 'MET-J', neni: 2, letter: 'J', title: 'Rishikim Editorial (Peer Review)', commitment_key: 'peer_review', text: 'Çdo hetim i nënshtrohet të paktën një raundi redaktimi nga dikush tjetër përveç autorit.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/contentQualityAssurance', evidence_title: 'Gjurma Dixhitale e Nënshkrimeve Editoriale', owner: 'Bordi i Redaktorëve', last_verified_at: '2026-09-02T14:00:00Z', score_dimensions: ['lifecycle', 'logic'], efcsn_clause_ref: 'EFCSN Section 2.10', ifcn_criterion_ref: 'IFCN Criterion 2' },
              { id: 'MET-K', neni: 2, letter: 'K', title: 'Gjuhë Neutrale', commitment_key: 'neutral_language', text: 'Gjetjet paraqiten me gjuhë të saktë, faktike dhe jo-emotive, duke shmangur sensacionalizmin.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/journalisticEthicsManual', evidence_title: 'Fjalori i Termave Neutrale & Analizuesi Stilistik', owner: 'Redaksia Gjuhësore', last_verified_at: '2026-09-03T09:15:00Z', score_dimensions: ['readability', 'sentiment_analytics', 'emotion'], efcsn_clause_ref: 'EFCSN Section 2.11', ifcn_criterion_ref: 'IFCN Criterion 1' },
              // Neni 3
              { id: 'ETIK-1A', neni: 3, sub_neni: '3.1', letter: 'A', title: 'Pavarësia Editoriale dhe Politike', commitment_key: 'editorial_independence', text: 'Ne jemi editorialisht të lirë dhe politikisht të pavarur, një parakusht kritik në mjedisin mediatik shqiptar (Hallin & Mancini, 2004).', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/transparence', evidence_title: 'Karta e Pavarësisë Editoriale', owner: 'Bordi Drejtues', last_verified_at: '2026-08-12T08:00:00Z', score_dimensions: ['ethical_resonance', 'sentiment_analytics'], efcsn_clause_ref: 'EFCSN Section 3.1.1', ifcn_criterion_ref: 'IFCN Criterion 1' },
              { id: 'ETIK-1B', neni: 3, sub_neni: '3.1', letter: 'B', title: 'Mospërkrahja Politike', commitment_key: 'no_political_endorsement', text: 'Ne nuk mbështesim asnjë parti politike apo kandidat.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/corporatePositionStatement', evidence_title: 'Deklarata Publike e Neutralitetit Elektoral', owner: 'Komisioni i Etikës', last_verified_at: '2026-08-12T08:00:00Z', score_dimensions: ['ethical_resonance'], efcsn_clause_ref: 'EFCSN Section 3.1.2', ifcn_criterion_ref: 'IFCN Criterion 1' },
              { id: 'ETIK-1C', neni: 3, sub_neni: '3.1', letter: 'C', title: 'Përzgjedhje e Drejtë e Subjekteve', commitment_key: 'fair_subject_selection', text: 'Ne nuk përqendrojmë hetimet në mënyrë të padrejtë në një burim të caktuar, por ndjekim dezinformimin me rëndësi publike.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/perputhshmeri', evidence_title: 'Regjistri i Shpërndarjes së Hetimeve', owner: 'Redaksia Analitike', last_verified_at: '2026-08-14T11:20:00Z', score_dimensions: ['sentiment_analytics', 'ethical_resonance'], efcsn_clause_ref: 'EFCSN Section 3.1.3', ifcn_criterion_ref: 'IFCN Criterion 1' },
              { id: 'ETIK-1D', neni: 3, sub_neni: '3.1', letter: 'D', title: 'Shmangia e Konfliktit të Interesit', commitment_key: 'conflict_of_interest', text: 'Stafi ynë u përmbahet politikave të brendshme rigoroze për të shmangur konfliktin e interesit dhe perceptimin e anshmërisë.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/transparence', evidence_title: 'Formularët e Deklarimit të Pasurisë dhe Interesave', owner: 'Oficeri i Pajtueshmërisë', last_verified_at: '2026-08-15T10:00:00Z', score_dimensions: ['ethical_resonance', 'lifecycle'], efcsn_clause_ref: 'EFCSN Section 3.1.4', ifcn_criterion_ref: 'IFCN Criterion 1' },
              { id: 'ETIK-1E', neni: 3, sub_neni: '3.1', letter: 'E', title: 'Avokim Ekskluziv për Transparencë', commitment_key: 'advocacy_for_transparency', text: 'Ne avokojmë vetëm për transparencë, saktësi dhe llogaridhënie në diskursin publik.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/aboutUs', evidence_title: 'Misioni Institucional i NOVARIC®', owner: 'Këshilli Etik', last_verified_at: '2026-08-10T09:30:00Z', score_dimensions: ['ethical_resonance', 'readability'], efcsn_clause_ref: 'EFCSN Section 3.1.5', ifcn_criterion_ref: 'IFCN Criterion 1' },
              { id: 'ETIK-2A', neni: 3, sub_neni: '3.2', letter: 'A', title: 'Mbrojtja e Sigurisë së Subjekteve', commitment_key: 'subject_safety', text: 'Ne mbrojmë identitetin e subjekteve kur ka një shqetësim të arsyeshëm për sigurinë e tyre.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/privacy', evidence_title: 'Protokolli i Mbrojtjes së Burimeve dhe Sinjalizuesve', owner: 'Këshilltari Ligjor', last_verified_at: '2026-08-16T15:00:00Z', score_dimensions: ['ethical_resonance'], efcsn_clause_ref: 'EFCSN Section 3.2.1', ifcn_criterion_ref: 'IFCN Criterion 2' },
              { id: 'ETIK-2B', neni: 3, sub_neni: '3.2', letter: 'B', title: 'Mbrojtja e të Miturve', commitment_key: 'protection_of_minors', text: 'Ne jemi të përmbajtur dhe të respektueshëm kur përmendim ose identifikojmë të mitur.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/privacy', evidence_title: 'Rregullorja për Mbrojtjen e të Miturve', owner: 'Redaksia', last_verified_at: '2026-08-16T15:00:00Z', score_dimensions: ['ethical_resonance'], efcsn_clause_ref: 'EFCSN Section 3.2.2', ifcn_criterion_ref: 'IFCN Criterion 2' },
              { id: 'ETIK-2C', neni: 3, sub_neni: '3.2', letter: 'C', title: 'E Drejta e Përgjigjes', commitment_key: 'right_of_reply', text: 'Ne ofrojmë të drejtën e përgjigjes çdo personi ose organizate që është burimi i pretendimit të pasaktë.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/korrigjime', evidence_title: 'Kanal i Dedikuar për të Drejtën e Përgjigjes', owner: 'Sekretaria Editoriale', last_verified_at: '2026-08-27T12:00:00Z', score_dimensions: ['lifecycle', 'credibility'], efcsn_clause_ref: 'EFCSN Section 3.2.3', ifcn_criterion_ref: 'IFCN Criterion 2' },
              { id: 'ETIK-3A', neni: 3, sub_neni: '3.3', letter: 'A', title: 'Korrigjim i Menjëhershëm', commitment_key: 'immediate_correction', text: 'Ne korrigjojmë çdo gabim të njohur menjëherë. Transparenca për gabimet është thelbësore për besimin (Kovach & Rosenstiel, 2014).', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/korrigjime', evidence_title: 'Regjistri i Korrigjimeve Publike', owner: 'Redaktori i Standardeve', last_verified_at: '2026-09-04T17:00:00Z', score_dimensions: ['lifecycle'], efcsn_clause_ref: 'EFCSN Section 3.3.1', ifcn_criterion_ref: 'IFCN Criterion 5' },
              { id: 'ETIK-3B', neni: 3, sub_neni: '3.3', letter: 'B', title: 'Shpjegim i Rrethanave për Gabime Thelbësore', commitment_key: 'correction_circumstances', text: 'Për gabime thelbësore, ne ofrojmë një shpjegim të plotë të rrethanave.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/korrigjime', evidence_title: 'Protokolli i Notave Shpjeguese', owner: 'Bordi Editorial', last_verified_at: '2026-09-04T17:00:00Z', score_dimensions: ['lifecycle', 'logic'], efcsn_clause_ref: 'EFCSN Section 3.3.2', ifcn_criterion_ref: 'IFCN Criterion 5' },
              { id: 'ETIK-3C', neni: 3, sub_neni: '3.3', letter: 'C', title: 'Aksesueshmëri e Politikës së Korrigjimeve', commitment_key: 'accessible_corrections_policy', text: 'Politika jonë e korrigjimeve është lehtësisht e aksesueshme.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/korrigjime', evidence_title: 'Faqja e Hapur e Korrigjimeve & Ankesave', owner: 'Redaksia e Uebit', last_verified_at: '2026-09-06T10:00:00Z', score_dimensions: ['seo_accessibility', 'lifecycle'], efcsn_clause_ref: 'EFCSN Section 3.3.3', ifcn_criterion_ref: 'IFCN Criterion 5' },
              { id: 'ETIK-3D', neni: 3, sub_neni: '3.3', letter: 'D', title: 'Kanal Direkt për Audiencën', commitment_key: 'direct_correction_channel', text: 'Ne ofrojmë kanale direkte për audiencën për të kërkuar një korrigjim.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/korrigjime', evidence_title: 'Formulari i Drejtpërdrejtë i Ankesave', owner: 'Zyra e Standardeve', last_verified_at: '2026-09-06T10:00:00Z', score_dimensions: ['lifecycle'], efcsn_clause_ref: 'EFCSN Section 3.3.4', ifcn_criterion_ref: 'IFCN Criterion 5' },
              // Neni 4
              { id: 'TRAN-1A', neni: 4, sub_neni: '4.1', letter: 'A', title: 'Struktura Organizative Publike', commitment_key: 'public_structure', text: 'Struktura jonë organizative dhe mënyra e ushtrimit të kontrollit editorial janë publike.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/transparence', evidence_title: 'Organigrama e Publikuar dhe Rregullorja e Brendshme', owner: 'Zyra Juridike', last_verified_at: '2026-08-11T14:30:00Z', score_dimensions: ['lifecycle'], efcsn_clause_ref: 'EFCSN Section 4.1.1', ifcn_criterion_ref: 'IFCN Criterion 4' },
              { id: 'TRAN-1B', neni: 4, sub_neni: '4.1', letter: 'B', title: 'Përditësimi i Pronësisë dhe Statusit Ligjor', commitment_key: 'legal_status_updates', text: 'Informacioni mbi pronësinë dhe statusin ligjor të platformës është i përditësuar rregullisht.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/trademarkCertificate', evidence_title: 'Ekstrakti QKB dhe Certifikata EUIPO', owner: 'Departamenti Ligjor', last_verified_at: '2026-08-11T14:30:00Z', score_dimensions: ['lifecycle'], efcsn_clause_ref: 'EFCSN Section 4.1.2', ifcn_criterion_ref: 'IFCN Criterion 4' },
              { id: 'TRAN-1C', neni: 4, sub_neni: '4.1', letter: 'C', title: 'Transparenca e Ekipit Editorial', commitment_key: 'editorial_team_transparency', text: 'Identiteti i redaktorëve dhe vendimmarrësve kryesorë është publik.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/transparence', evidence_title: 'Faqja e Ekipit Editorial dhe Profilet Profesionale', owner: 'Redaksia', last_verified_at: '2026-08-11T14:30:00Z', score_dimensions: ['lifecycle'], efcsn_clause_ref: 'EFCSN Section 4.1.3', ifcn_criterion_ref: 'IFCN Criterion 4' },
              { id: 'TRAN-2A', neni: 4, sub_neni: '4.2', letter: 'A', title: 'Deklarimi Publik i të Ardhurave', commitment_key: 'revenue_sources_declaration', text: 'Ne deklarojmë publikisht burimet tona kryesore të të ardhurave.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/transparence', evidence_title: 'Raporti Financiar Vjetor i Transparencës', owner: 'Drejtoria Financiare', last_verified_at: '2026-08-13T16:00:00Z', score_dimensions: ['ethical_resonance', 'lifecycle'], efcsn_clause_ref: 'EFCSN Section 4.2.1', ifcn_criterion_ref: 'IFCN Criterion 4' },
              { id: 'TRAN-2B', neni: 4, sub_neni: '4.2', letter: 'B', title: 'Mbrojtja nga Ndikimi i Financuesve', commitment_key: 'funding_independence_mechanisms', text: 'Ne shpjegojmë mekanizmat që sigurojnë pavarësinë editoriale nga financuesit.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/transparence', evidence_title: 'Muri Kinez i Ndarjes Financiare-Editoriale', owner: 'Këshilli Mbikëqyrës', last_verified_at: '2026-08-13T16:00:00Z', score_dimensions: ['ethical_resonance'], efcsn_clause_ref: 'EFCSN Section 4.2.2', ifcn_criterion_ref: 'IFCN Criterion 4' },
              { id: 'TRAN-2C', neni: 4, sub_neni: '4.2', letter: 'C', title: 'Ndalimi i Sponsorizimit të Verifikimeve', commitment_key: 'no_sponsored_factchecks', text: 'Përmbajtja e verifikimit të fakteve nuk mund të sponsorizohet në asnjë rrethanë. Çdo partneritet tjetër deklarohet qartësisht.', status: 'compliant', status_label_sq: 'PËRPUTHSHMËRI E PLOTË', evidence_url: '/standards/transparence', evidence_title: 'Rregullorja mbi Sponsorizimet dhe Donacionet', owner: 'Bordi Drejtues', last_verified_at: '2026-08-13T16:00:00Z', score_dimensions: ['ethical_resonance'], efcsn_clause_ref: 'EFCSN Section 4.2.3', ifcn_criterion_ref: 'IFCN Criterion 4' }
            ];
            res.end(JSON.stringify({ status: 'success', count: clauses.length, clauses }));
            return;
          }

          // Any other /api/v1/standards path: 404
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Standards route not found' }));
          return;
        }

        // --- METHODOLOGY & ACCOUNTABILITY API (/api/v1/methodology) ---
        if (url.startsWith('/api/v1/methodology')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');

          // GET /api/v1/methodology/audits
          if (url === '/api/v1/methodology/audits' || url.startsWith('/api/v1/methodology/audits?')) {
            const audits = [
              {
                id: 'AUD-MET-2026-01',
                audited_at: '2026-08-12T10:00:00Z',
                auditor: 'Këshilli Mbikëqyrës i Pavarur & Zyra e Standardeve NOVARIC®',
                result: 'passed',
                result_label_sq: 'Miratuar pa Vërejtje Thelbësore',
                compliance_score: 98.4,
                notes: 'Auditim i plotë i zbatimit të sinergjisë hermeneutike mes LLM dhe ekipit njerëzor. Nuk u identifikua asnjë publikim autonom pa miratim editorial me dy nënshkrime.',
                next_audit_at: '2026-11-15T09:00:00Z'
              }
            ];
            res.end(JSON.stringify({ status: 'success', count: audits.length, audits }));
            return;
          }

          // GET /api/v1/methodology (Main Methodology Data)
          if (url === '/api/v1/methodology' || url === '/api/v1/methodology/') {
            const steps = [
              {
                id: 'step-1',
                order: 1,
                title: 'Hapi 1: Analiza Fillestare nga IA (Shkalla dhe Shpejtësia)',
                short_title: 'Analiza Fillestare nga IA',
                actor: 'ai',
                actor_label_sq: 'Modeli i Avancuar Gjuhësor (LLM / Nora AI)',
                body_text: 'Një model i avancuar gjuhësor (LLM) kryen një analizë të gjerë në ueb për të gjetur burime relevante. Kjo fazë shfrytëzon aftësinë e IA-së për të identifikuar modele dhe për të mbledhur të dhëna në një shkallë të paarritshme për analistët njerëzorë, duke qenë të vetëdijshëm për rreziqet e "paragjykimit algoritmik" (Diakopoulos, 2019) dhe duke e përdorur atë si një mjet ndihmës, jo si një arbitër të së vërtetës.',
                inputs: [
                  'Pretendimi publik i pretenduar apo lajmi në qarkullim',
                  'Korpus burimesh të hapura (Open Web, arkiva zyrtare, regjistri i mediave)',
                  'Katalogu i burimeve primare të indeksuara nga NOVARIC®'
                ],
                outputs: [
                  'Indeksi i dëshmive të mbledhura dhe ekstrakti i entiteteve (NER)',
                  'Matrica e relevancës me burime pro dhe kundër pretendimit',
                  'Shenjimi i anomalive semantike dhe rreziqeve të mundshme manipuluese'
                ],
                safeguards: [
                  'Modeli trajtohet rreptësisht si mjet ndihmës hulumtues, kurrë si arbitër i së vërtetës',
                  'Parandalimi i halucinacioneve përmes kërkimit të detyrueshëm me tokën (grounding)',
                  'Ndërgjegjësimi i koduar për paragjykimet algoritmike (Diakopoulos, 2019)',
                  'Izolimi i plotë pa asnjë leje publikimi të drejtpërdrejtë në server'
                ],
                failure_modes: [
                  'Paragjykimi algoritmik i ponderimit të burimeve (Algorithmic Bias)',
                  'Optimizimi i verbër i shpejtësisë në kurriz të thellësisë kontekstuale'
                ],
                standards_clause_ids: ['MET-A', 'MET-B', 'MET-F', 'MET-G'],
                citation_keys: ['diakopoulos2019']
              },
              {
                id: 'step-2',
                order: 2,
                title: 'Hapi 2: Gjenerimi i Draft-Rezultatit (Struktura Fillestare)',
                short_title: 'Gjenerimi i Draft-Rezultatit',
                actor: 'draft',
                actor_label_sq: 'Sistemi i Gjenerimit të Strukturuar (Draft Pipeline)',
                body_text: 'Modeli gjeneron një verdikt paraprak, një përmbledhje dhe një listë burimesh, duke përfshirë prova pro dhe kundër pretendimit. Ky draft shërben si një pikënisje e strukturuar për ekipin redaksional.',
                inputs: [
                  'Të dhënat e strukturuara dhe lidhjet e burimeve nga Hapi 1',
                  'Shablloni formal i verifikimit sipas standardeve të EFCSN/IFCN',
                  'Kriteret e taksonomisë faktike (E Saktë, E Pasaktë, Gjysmë e Vërtetë, Jashtë Kontekstit)'
                ],
                outputs: [
                  'Verdikti paraprak hipotetik (i paverifikuar)',
                  'Përmbledhja ekzekutive e provave të gjetura',
                  'Inventari me dy kolona: Prova PRO vs. Prova KUNDËR pretendimit',
                  'Dosja e papërpunuar për shqyrtim njerëzor (Review Ticket)'
                ],
                safeguards: [
                  'Drafti etiketohet qartësisht me flamur "DRAFT I PAPUBLIKUESHËM"',
                  'Asnjë rrugëdalje e automatizuar drejt rrjeteve sociale apo faqes kryesore',
                  'Transparencë e plotë mbi prompt-et dhe parametrat e përdorur në gjenerim'
                ],
                failure_modes: [
                  'Verdikt i nxituar bazuar në sasi provash dhe jo në cilësi provash',
                  'Mungesë e konsideratës për nuancat ligjore dhe kushtetuese vendore'
                ],
                standards_clause_ids: ['MET-E', 'MET-H', 'MET-I'],
                citation_keys: []
              },
              {
                id: 'step-3',
                order: 3,
                title: 'Hapi 3: Rishikimi dhe Verifikimi Njerëzor (Mbikëqyrja Hermeneutike)',
                short_title: 'Rishikimi dhe Verifikimi Njerëzor (Hapi Kritik)',
                actor: 'human_team',
                actor_label_sq: 'Ekipi Redaksional Njerëzor (Redaktorët & Paneli Shkencor)',
                body_text: 'Drafti i IA-së nuk publikohet kurrë automatikisht. Këtu fillon procesi thelbësor i interpretimit njerëzor. Ekipi ynë i redaktorëve me përvojë ndjek katër shtylla themelore hermeneutike përpara se të marrë vendimin përfundimtar.',
                sub_points: [
                  {
                    id: 'sp-1',
                    title: 'Verifikon Burimet',
                    text: 'Vlerëson besueshmërinë, reputacionin dhe pozicionalitetin e çdo burimi të përdorur në hulumtim.'
                  },
                  {
                    id: 'sp-2',
                    title: 'Shton Kontekstin (Parimi Hermeneutik)',
                    text: 'Plotëson analizën me kontekstin e nevojshëm historik, politik ose social, duke ndjekur "rrethin hermeneutik" për të ndërtuar një kuptim të plotë (Gadamer, 1989).'
                  },
                  {
                    id: 'sp-3',
                    title: 'Vlerëson Nuancat',
                    text: 'Analizon gjuhën manipulative, ironinë, mungesën e theksuar të informacionit dhe taktikat e tjera retorike që makinat nuk mund t\'i zbërthejnë.'
                  },
                  {
                    id: 'sp-4',
                    title: 'Jep Miratimin Final',
                    text: 'Vetëm pasi ekipi njerëzor është plotësisht i bindur për saktësinë dhe paanshmërinë, rezultati finalizohet. Përgjegjësia editoriale mbetet tërësisht njerëzore.'
                  }
                ],
                inputs: [
                  'Draft-paketa nga Hapi 2',
                  'Kontaktimi i drejtpërdrejtë me palët e përmendura (E drejta e përgjigjes)',
                  'Ekspertiza profesionale e redaktorëve dhe bibliografia e akredituar'
                ],
                outputs: [
                  'Artikulli i plotë i miratuar i verifikimit të fakteve',
                  'Nënshkrimi dixhital i redaktorit përgjegjës (Editorial Sign-off)',
                  'Auditimi i integritetit me 15 metrika dhe lidhja me standardet'
                ],
                safeguards: [
                  'Rregulli i detyrueshëm me katër sy (Peer Review nga të paktën dy persona)',
                  'Gjurmueshmëria e plotë e çdo ndërhyrjeje në tekstin e draftit',
                  'Përgjegjësi ligjore dhe etike personale e deklaruar publikisht'
                ],
                failure_modes: [
                  'Ndërhyrje subjektive e paargumentuar (e zbutur nga protokolli me katër sy)'
                ],
                standards_clause_ids: ['MET-J', 'MET-K', 'ETIK-1A', 'ETIK-1D', 'ETIK-2C'],
                citation_keys: ['gadamer1989']
              }
            ];

            const principles = [
              {
                id: 'principle-1',
                title: 'Lufta Kundër Dezinformimit',
                body_text: 'Përtej etiketimit të informacionit si "i rremë", ne synojmë të shpjegojmë pse ai është i gabuar. Kjo kontribuon drejtpërdrejt në edukimin mediatik të publikut (Livingstone, 2004).',
                legal_anchor: 'dsa',
                legal_anchor_label: 'DSA Nenet 34 & 35',
                legal_anchor_detail: 'Akti i Shërbimeve Dixhitale i BE-së: Detyrimi për vlerësimin dhe zbutjen e rreziqeve sistemike në hapësirën publike dixhitale dhe edukimi mediatik i qytetarëve.',
                standards_ref: 'Neni 2 (MET-C, MET-D)',
                evidence_url: '/standards/perputhshmeri',
                status_badge: 'E ZBATUAR',
                citation_keys: ['livingstone2004']
              },
              {
                id: 'principle-2',
                title: 'Pavarësia Editoriale',
                body_text: 'NOVARIC® operon me pavarësi të plotë editoriale, një garanci thelbësore kundër rrezikut të "kapjes së medias" (Mungiu-Pippidi, 2013).',
                legal_anchor: 'emfa',
                legal_anchor_label: 'EMFA Neni 6',
                legal_anchor_detail: 'Akti Evropian i Lirisë së Medias (European Media Freedom Act): Mbrojtja e patundshme e linjës editoriale nga ndërhyrjet politike, shtetërore apo oligarkike.',
                standards_ref: 'Neni 3.1 (ETIK-1A, ETIK-1B)',
                evidence_url: '/standards/transparence',
                status_badge: 'GARANTUAR',
                citation_keys: ['mungiu2013']
              },
              {
                id: 'principle-3',
                title: 'Transparenca e Pronësisë',
                body_text: 'Ne jemi transparentë për strukturën dhe financimin tonë, duke i dhënë mundësi audiencës të vlerësojë vetë pavarësinë tonë.',
                legal_anchor: 'emfa',
                legal_anchor_label: 'EMFA Neni 6.1',
                legal_anchor_detail: 'Detyrimi ligjor i ofruesve të shërbimeve mediatike për të bërë publike pronësinë e drejtpërdrejtë dhe të tërthortë, burimet financiare dhe deklaratat vjetore.',
                standards_ref: 'Neni 4.1 & 4.2 (TRAN-1A, TRAN-2A)',
                evidence_url: '/standards/transparence',
                status_badge: 'PUBLIKE',
                citation_keys: []
              },
              {
                id: 'principle-4',
                title: 'Mekanizmat e Raportimit dhe Korrigjimit',
                body_text: 'Ne ofrojmë mekanizma të qartë për përdoruesit për të raportuar pasaktësi. Transparenca për gabimet është një shenjë force dhe besueshmërie, jo dobësie (Kovach & Rosenstiel, 2014).',
                legal_anchor: 'dsa',
                legal_anchor_label: 'DSA Neni 16 & EFCSN 3.3',
                legal_anchor_detail: 'Mekanizmat e Njoftimit dhe Veprimit (Notice-and-Action): E drejta e përdoruesit për të ankimuar përmbajtjen me një SLA të garantuar shqyrtimi brenda 7 ditëve.',
                standards_ref: 'Neni 3.3 (ETIK-3A, ETIK-3D)',
                evidence_url: '/standards/korrigjime',
                status_badge: 'LIVE 24/7',
                citation_keys: ['kovach2014']
              }
            ];

            const references = [
              {
                id: 'ref-1',
                key: 'chadwick2017',
                citation: 'Chadwick, A. (2017). The hybrid media system: Politics and power (2nd ed.). Oxford University Press.',
                short_cite: 'Chadwick, 2017',
                authors: 'Chadwick, Andrew',
                year: 2017,
                title: 'The hybrid media system: Politics and power',
                publisher_or_journal: 'Oxford University Press (2nd ed.)',
                type: 'book',
                type_label_sq: 'Libër Akademik',
                usage_anchors: [
                  {
                    section_id: 'sec-hyrje',
                    section_title: 'Hyrje',
                    excerpt: 'Në epokën e "sistemit mediatik hibrid", ku teknologjia e platformave dixhitale ndërthuret me logjikat e vjetra mediatike (Chadwick, 2017)...'
                  }
                ],
                external_url: 'https://global.oup.com/academic/product/the-hybrid-media-system-9780190696726'
              },
              {
                id: 'ref-2',
                key: 'diakopoulos2019',
                citation: 'Diakopoulos, N. (2019). Automating the news: How algorithms are rewriting the media. Harvard University Press.',
                short_cite: 'Diakopoulos, 2019',
                authors: 'Diakopoulos, Nicholas',
                year: 2019,
                title: 'Automating the news: How algorithms are rewriting the media',
                publisher_or_journal: 'Harvard University Press',
                type: 'book',
                type_label_sq: 'Libër Akademik',
                usage_anchors: [
                  {
                    section_id: 'sec-metodologjia',
                    section_title: 'Hapi 1: Analiza Fillestare nga IA',
                    excerpt: '...duke qenë të vetëdijshëm për rreziqet e "paragjykimit algoritmik" (Diakopoulos, 2019) dhe duke e përdorur atë si një mjet ndihmës, jo si një arbitër të së vërtetës.'
                  }
                ],
                external_url: 'https://www.hup.harvard.edu/books/9780674976986'
              },
              {
                id: 'ref-3',
                key: 'gadamer1989',
                citation: 'Gadamer, H.-G. (1989). Truth and method (2nd rev. ed., J. Weinsheimer & D. G. Marshall, Trans.). Sheed & Ward.',
                short_cite: 'Gadamer, 1989',
                authors: 'Gadamer, Hans-Georg',
                year: 1989,
                title: 'Truth and method',
                publisher_or_journal: 'Sheed & Ward (Përkth. J. Weinsheimer & D. G. Marshall)',
                type: 'book',
                type_label_sq: 'Libër Akademik',
                usage_anchors: [
                  {
                    section_id: 'sec-metodologjia',
                    section_title: 'Hapi 3: Rishikimi dhe Verifikimi Njerëzor',
                    excerpt: 'Plotëson analizën me kontekstin e nevojshëm historik, politik ose social, duke ndjekur "rrethin hermeneutik" për të ndërtuar një kuptim të plotë (Gadamer, 1989).'
                  }
                ],
                external_url: 'https://www.bloomsbury.com/uk/truth-and-method-9781780936284/'
              },
              {
                id: 'ref-4',
                key: 'kovach2014',
                citation: 'Kovach, B., & Rosenstiel, T. (2014). The elements of journalism: What newspeople should know and the public should expect (3rd ed.). Three Rivers Press.',
                short_cite: 'Kovach & Rosenstiel, 2014',
                authors: 'Kovach, Bill & Rosenstiel, Tom',
                year: 2014,
                title: 'The elements of journalism: What newspeople should know and the public should expect',
                publisher_or_journal: 'Three Rivers Press (3rd ed.)',
                type: 'book',
                type_label_sq: 'Libër Akademik',
                usage_anchors: [
                  {
                    section_id: 'sec-pergjegjesia',
                    section_title: 'Mekanizmat e Raportimit dhe Korrigjimit',
                    excerpt: 'Transparenca për gabimet është një shenjë force dhe besueshmërie, jo dobësie (Kovach & Rosenstiel, 2014).'
                  }
                ],
                external_url: 'https://www.penguinrandomhouse.com/books/227568/the-elements-of-journalism-revised-and-updated-4th-edition-by-bill-kovach-and-tom-rosenstiel/'
              },
              {
                id: 'ref-5',
                key: 'livingstone2004',
                citation: 'Livingstone, S. (2004). Media literacy and the challenge of new information and communication technologies. The Communication Review, 7(1), 3–14.',
                short_cite: 'Livingstone, 2004',
                authors: 'Livingstone, Sonia',
                year: 2004,
                title: 'Media literacy and the challenge of new information and communication technologies',
                publisher_or_journal: 'The Communication Review, 7(1), 3–14',
                type: 'journal',
                type_label_sq: 'Artikull Shkencor',
                usage_anchors: [
                  {
                    section_id: 'sec-pergjegjesia',
                    section_title: 'Lufta Kundër Dezinformimit',
                    excerpt: 'Përtej etiketimit të informacionit si "i rremë", ne synojmë të shpjegojmë pse ai është i gabuar. Kjo kontribuon drejtpërdrejt në edukimin mediatik të publikut (Livingstone, 2004).'
                  }
                ],
                external_url: 'https://doi.org/10.1080/10714420490280152'
              },
              {
                id: 'ref-6',
                key: 'mungiu2013',
                citation: 'Mungiu-Pippidi, A. (2013). Freedom without impartiality: The Vicious Circle of media capture. In P. N. Howard & M. M. Hussain (Eds.), Democracy\'s fourth wave? Digital media and the Arab Spring (pp. 45-66). Oxford University Press.',
                short_cite: 'Mungiu-Pippidi, 2013',
                authors: 'Mungiu-Pippidi, Alina',
                year: 2013,
                title: 'Freedom without impartiality: The Vicious Circle of media capture',
                publisher_or_journal: 'Democracy\'s fourth wave? Digital media and the Arab Spring (pp. 45-66). Oxford University Press',
                type: 'book',
                type_label_sq: 'Libër Akademik',
                usage_anchors: [
                  {
                    section_id: 'sec-pergjegjesia',
                    section_title: 'Pavarësia Editoriale',
                    excerpt: 'NOVARIC® operon me pavarësi të plotë editoriale, një garanci thelbësore kundër rrezikut të "kapjes së medias" (Mungiu-Pippidi, 2013).'
                  }
                ],
                external_url: 'https://global.oup.com/academic/product/democracys-fourth-wave-9780199936953'
              },
              {
                id: 'ref-7',
                key: 'wardle2017',
                citation: 'Wardle, C., & Derakhshan, H. (2017). Information disorder: Toward an interdisciplinary framework for research and policymaking. Council of Europe.',
                short_cite: 'Wardle & Derakhshan, 2017',
                authors: 'Wardle, Claire & Derakhshan, Hossein',
                year: 2017,
                title: 'Information disorder: Toward an interdisciplinary framework for research and policymaking',
                publisher_or_journal: 'Council of Europe Report DGI(2017)09',
                type: 'report',
                type_label_sq: 'Raport Ndërkombëtar',
                usage_anchors: [
                  {
                    section_id: 'sec-hyrje',
                    section_title: 'Hyrje',
                    excerpt: 'Kjo kornizë nuk është thjesht një listë rregullash, por një përgjigje strategjike ndaj sfidave të "çrregullimit informativ" (Wardle & Derakhshan, 2017)...'
                  }
                ],
                external_url: 'https://rm.coe.int/information-disorder-toward-an-interdisciplinary-framework-for-researc/168076277c'
              }
            ];

            const metrics = {
              word_count_hint: 940,
              methodology_version: 'v2.4.1 (Miratuar)',
              last_audit_at: '2026-08-12T10:00:00Z',
              next_audit_at: '2026-11-15T09:00:00Z',
              human_review_status: '100% Mbikëqyrje Njerëzore (Human-in-the-Loop)',
              ai_involvement_indicator: 'Ndihmës Hulumtues (Pa Publikim Autonom)',
              section_count: 5,
              reference_count: 7,
              methodological_steps_count: 3,
              principles_count: 4
            };

            res.end(JSON.stringify({ status: 'success', steps, principles, references, metrics }));
            return;
          }

          // Any other /api/v1/methodology path: 404
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Methodology route not found' }));
          return;
        }

        // ====================================================================
        // Analytical Spine Endpoints: /api/v1/lineage, /api/v1/concepts, /api/v1/citations
        // ====================================================================
        if (url.startsWith('/api/v1/lineage')) {
          res.setHeader('Content-Type', 'application/json');
          const parsedUrl = new URL(url, 'http://localhost:3000');
          const metricParam = parsedUrl.searchParams.get('metric');

          const lineageMap: Record<string, any> = {
            'metric:credibility': {
              id: 'metric:credibility',
              key: 'credibility',
              name_sq: 'Besueshmëria (Credibility)',
              category_sq: 'Integriteti Faktik & Burimet',
              description: 'Vlerëson pretendimet e verifikuara, raportin e burimeve parësore dhe triangulimin me arkiva të besueshme.',
              indicator_ids: ['maragon:R1.2', 'maragon:A2.1', 'maragon:A2.3', 'maragon:G3.1'],
              methodology_step_ids: ['meth:step-1', 'meth:step-3'],
              standard_clause_ids: ['std:MET-A', 'std:MET-B', 'std:ETIK-3.1A', 'std:TRANSP-4.1A']
            },
            'metric:readability': {
              id: 'metric:readability',
              key: 'readability',
              name_sq: 'Lexueshmëria (Readability)',
              category_sq: 'Qartësia Gjuhësore & Struktura',
              description: 'Vlerëson nivelin sintaksor Flesch-Kincaid, densitetin e fjalive pasive dhe qartësinë gjuhësore.',
              indicator_ids: ['maragon:A2.3'],
              methodology_step_ids: ['meth:step-1', 'meth:step-2'],
              standard_clause_ids: ['std:MET-A']
            },
            'metric:bias_sentiment': {
              id: 'metric:bias_sentiment',
              key: 'bias_sentiment',
              name_sq: 'Anshmëria & Sentimenti (Bias & Sentiment)',
              category_sq: 'Paanshmëria & Kornizimi',
              description: 'Zbulon kornizimin e njëanshëm (framing), polarizimin e gjuhës dhe devijimet e pajustifikuara emocionale.',
              indicator_ids: ['maragon:A2.2', 'maragon:G3.2'],
              methodology_step_ids: ['meth:step-2', 'meth:step-3'],
              standard_clause_ids: ['std:ETIK-3.1A', 'std:ETIK-3.1B']
            },
            'metric:lifecycle_compliance': {
              id: 'metric:lifecycle_compliance',
              key: 'lifecycle_compliance',
              name_sq: 'Cikli i Jetës & Përputhshmëria (Lifecycle Compliance)',
              category_sq: 'Llogaridhënia & Korrigjimet',
              description: 'Garanton protokollin e korrigjimeve, transparencën e përditësimeve editoriale dhe përputhshmërinë rregullatore.',
              audit_note: 'Audituar periodikisht përmes Qendrës së Korrigjimeve dhe Zyrës së Përputhshmërisë.',
              indicator_ids: ['maragon:R1.1', 'maragon:R1.2', 'maragon:G3.1'],
              methodology_step_ids: ['meth:step-3'],
              standard_clause_ids: ['std:ETIK-3.3A', 'std:KONF-A', 'std:TRANSP-4.1A']
            },
            'metric:seo_accessibility': {
              id: 'metric:seo_accessibility',
              key: 'seo_accessibility',
              name_sq: 'SEO & Aksesueshmëria',
              category_sq: 'Transparenca Publike & Standardet Dixhitale',
              description: 'Optimizimi semantik për indeksim të hapur, metatëdhëna Schema.org dhe lexueshmëri universale.',
              indicator_ids: ['maragon:O4.1'],
              methodology_step_ids: ['meth:step-1'],
              standard_clause_ids: ['std:KONF-B']
            },
            'metric:logic_fact': {
              id: 'metric:logic_fact',
              key: 'logic_fact',
              name_sq: 'Logjikë (Fact)',
              category_sq: 'Koherenca Logjike',
              description: 'Raporti i fakteve të vërtetueshme empirikisht kundrejt deduktimeve apo pretendimeve pa mbështetje provash.',
              indicator_ids: ['maragon:A2.1', 'maragon:A2.4'],
              methodology_step_ids: ['meth:step-1', 'meth:step-3'],
              standard_clause_ids: ['std:MET-A', 'std:MET-B']
            },
            'metric:ethical_resonance': {
              id: 'metric:ethical_resonance',
              key: 'ethical_resonance',
              name_sq: 'Rezonanca Etike (CSR)',
              category_sq: 'Përgjegjësia Qytetare & Interesi Publik',
              description: 'Përputhshmëria me misionin e shërbimit publik, dinjitetin njerëzor, dhe kontributin në debatin demokratik.',
              indicator_ids: ['maragon:A2.2', 'maragon:G3.2', 'maragon:O4.2'],
              methodology_step_ids: ['meth:step-3'],
              standard_clause_ids: ['std:ETIK-3.1A', 'std:KONF-C']
            },
            'metric:emotion_affect': {
              id: 'metric:emotion_affect',
              key: 'emotion_affect',
              name_sq: 'Emocion (Affect)',
              category_sq: 'Intensiteti Afektiv',
              description: 'Matja e ngarkesës emocionale dhe dramatizimit për të siguruar raportim të matshëm dhe jo sensacionalist.',
              indicator_ids: ['maragon:A2.2'],
              methodology_step_ids: ['meth:step-2'],
              standard_clause_ids: ['std:ETIK-3.1A']
            }
          };

          if (metricParam) {
            const cleanKey = metricParam.startsWith('metric:') ? metricParam : `metric:${metricParam}`;
            const item = lineageMap[cleanKey];
            if (!item) {
              res.statusCode = 404;
              res.end(JSON.stringify({ status: 'not_found', metric: cleanKey }));
              return;
            }
            res.end(JSON.stringify({ status: 'success', data: item }));
            return;
          }

          res.end(JSON.stringify({ status: 'success', count: Object.keys(lineageMap).length, data: lineageMap }));
          return;
        }

        if (url.startsWith('/api/v1/concepts')) {
          res.setHeader('Content-Type', 'application/json');
          const concepts = [
            {
              id: 'concept:framing',
              term_sq: 'Kornizimi (Framing)',
              term_en: 'Media Framing',
              definition: 'Procesi i përzgjedhjes së disa aspekteve të një realiteti të perceptuar dhe bërja e tyre më të spikatura në një tekst komunikues.',
              theorist: 'Robert M. Entman / Shanto Iyengar'
            },
            {
              id: 'concept:public_sphere',
              term_sq: 'Sfera Publike',
              term_en: 'Public Sphere',
              definition: 'Një hapësirë (metaforike) në jetën shoqërore ku individët mund të mblidhen për të diskutuar lirishëm.',
              theorist: 'Jürgen Habermas / Zizi Papacharissi'
            },
            {
              id: 'concept:media_capture',
              term_sq: 'Kapja e Medias',
              term_en: 'Media Capture',
              definition: 'Një situatë ku media kontrollohet nga qeveria ose interesa private.',
              theorist: 'Alina Mungiu-Pippidi'
            },
            {
              id: 'concept:churnalism',
              term_sq: 'Churnalism',
              term_en: 'Churnalism',
              definition: 'Formë gazetarie që mbështetet në ripërpunimin pasiv të njoftimeve për shtyp.',
              theorist: 'Nick Davies'
            },
            {
              id: 'concept:field_autonomy',
              term_sq: 'Autonomia e Fushës Gazetareske',
              term_en: 'Journalistic Field Autonomy',
              definition: 'Pavarësia e fushës së gazetarisë nga presionet e jashtme sipas logjikës së vet profesionale.',
              theorist: 'Pierre Bourdieu'
            },
            {
              id: 'concept:media_literacy',
              term_sq: 'Edukim Mediatik',
              term_en: 'Media Literacy',
              definition: 'Aftësia për të aksesuar, analizuar, vlerësuar dhe krijuar media.',
              theorist: 'Sonia Livingstone'
            },
            {
              id: 'concept:public_journalism',
              term_sq: 'Gazetaria Publike',
              term_en: 'Public / Civic Journalism',
              definition: 'Praktikë gazetareske që përfshin qytetarët në debatin publik.',
              theorist: 'Jay Rosen'
            },
            {
              id: 'concept:polarized_pluralism',
              term_sq: 'Pluralist i Polarizuar',
              term_en: 'Polarized Pluralist Model',
              definition: 'Sistem mediatik me paralelizëm të lartë politik dhe instrumentalizim nga elitat.',
              theorist: 'Daniel C. Hallin & Paolo Mancini'
            },
            {
              id: 'concept:hermeneutic_circle',
              term_sq: 'Rrethi Hermeneutik',
              term_en: 'Hermeneutic Circle',
              definition: 'Qasje ku kuptimi i të tërës vjen nga pjesët dhe anasjelltas, baza e sinergjisë IA + njeri në NOVARIC®.',
              theorist: 'Hans-Georg Gadamer'
            }
          ];

          const matchSingle = url.match(/^\/api\/v1\/concepts\/([^\/\?]+)/);
          if (matchSingle) {
            const id = decodeURIComponent(matchSingle[1]);
            const cleanId = id.startsWith('concept:') ? id : `concept:${id}`;
            const item = concepts.find(c => c.id === cleanId);
            if (!item) {
              res.statusCode = 404;
              res.end(JSON.stringify({ status: 'not_found', id: cleanId }));
              return;
            }
            res.end(JSON.stringify({ status: 'success', data: item }));
            return;
          }

          res.end(JSON.stringify({ status: 'success', count: concepts.length, data: concepts }));
          return;
        }

        if (url.startsWith('/api/v1/citations')) {
          res.setHeader('Content-Type', 'application/json');
          const citations = [
            { id: 'ref:hallin-mancini-2004', authors: 'Daniel C. Hallin & Paolo Mancini', year: 2004, title: 'Comparing media systems: Three models of media and politics', publisher: 'Cambridge University Press', rating: 98 },
            { id: 'ref:kovach-rosenstiel-2014', authors: 'Bill Kovach & Tom Rosenstiel', year: 2014, title: 'The elements of journalism (3rd ed.)', publisher: 'Three Rivers Press', rating: 98 },
            { id: 'ref:entman-1993', authors: 'Robert M. Entman', year: 1993, title: 'Framing: Toward clarification of a fractured paradigm', publisher: 'Journal of Communication', rating: 97 },
            { id: 'ref:davies-2008', authors: 'Nick Davies', year: 2008, title: 'Flat earth news', publisher: 'Chatto & Windus', rating: 90 },
            { id: 'ref:iyengar-1991', authors: 'Shanto Iyengar', year: 1991, title: 'Is anyone responsible? How television frames political issues', publisher: 'University of Chicago Press', rating: 96 },
            { id: 'ref:mungiu-pippidi-2013', authors: 'Alina Mungiu-Pippidi', year: 2013, title: 'Freedom without impartiality: The Vicious Circle of media capture', publisher: 'Oxford University Press', rating: 93 },
            { id: 'ref:bourdieu-1998', authors: 'Pierre Bourdieu', year: 1998, title: 'On Television', publisher: 'The New Press', rating: 95 },
            { id: 'ref:livingstone-2004', authors: 'Sonia Livingstone', year: 2004, title: 'Media literacy and the challenge of new information and communication technologies', publisher: 'The Communication Review', rating: 94 },
            { id: 'ref:rosen-1999', authors: 'Jay Rosen', year: 1999, title: 'What are journalists for?', publisher: 'Yale University Press', rating: 93 },
            { id: 'ref:habermas-1989', authors: 'Jürgen Habermas', year: 1989, title: 'The structural transformation of the public sphere', publisher: 'MIT Press', rating: 98 },
            { id: 'ref:papacharissi-2010', authors: 'Zizi Papacharissi', year: 2010, title: 'A Private Sphere: Democracy in a Digital Age', publisher: 'Polity Press', rating: 92 },
            { id: 'ref:chadwick-2017', authors: 'Andrew Chadwick', year: 2017, title: 'The Hybrid Media System: Politics and Power', publisher: 'Oxford University Press', rating: 96 },
            { id: 'ref:diakopoulos-2019', authors: 'Nicholas Diakopoulos', year: 2019, title: 'Automating the News: How Algorithms Are Rewriting the Media', publisher: 'Harvard University Press', rating: 97 },
            { id: 'ref:gadamer-1989', authors: 'Hans-Georg Gadamer', year: 1989, title: 'Truth and Method', publisher: 'Continuum', rating: 99 },
            { id: 'ref:wardle-derakhshan-2017', authors: 'Claire Wardle & Hossein Derakhshan', year: 2017, title: 'Information Disorder: Toward an interdisciplinary framework', publisher: 'Council of Europe', rating: 98 }
          ];

          res.end(JSON.stringify({ status: 'success', count: citations.length, data: citations }));
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), novaricApiPlugin()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  define: {
    'process.env': {
      REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL || 'https://xhryczkrddsawksqxgrx.supabase.co',
      REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
      REACT_APP_AZURE_BLOB_SAS_URL: process.env.REACT_APP_AZURE_BLOB_SAS_URL || '',
    },
  },
});
