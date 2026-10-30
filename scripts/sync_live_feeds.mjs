import fs from 'fs';
import path from 'path';

async function sync() {
  console.log('[sync] Fetching live Albanian feeds...');
  const { fetchLiveAlbanianFeeds } = await import('../services/liveAlbanianNewsService.js').catch(async () => {
    return await import('../services/liveAlbanianNewsService.ts');
  });

  const live = await fetchLiveAlbanianFeeds(true);
  console.log(`[sync] Successfully fetched ${live.length} live Albanian articles!`);

  const diskPath = path.resolve(process.cwd(), 'data/latestNews.json');
  let existing = [];
  if (fs.existsSync(diskPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(diskPath, 'utf8'));
    } catch (e) {
      existing = [];
    }
  }

  // Prepend live articles, deduping by URL and title
  const seenUrls = new Set();
  const seenTitles = new Set();
  const merged = [];

  for (const item of [...live, ...existing]) {
    const u = item.originalArticleUrl?.trim().toLowerCase();
    const t = item.title?.trim().toLowerCase();
    if (u && seenUrls.has(u)) continue;
    if (t && seenTitles.has(t)) continue;
    if (u) seenUrls.add(u);
    if (t) seenTitles.add(t);
    merged.push(item);
  }

  fs.writeFileSync(diskPath, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`[sync] Saved ${merged.length} total articles to ${diskPath}`);
}

sync().catch(err => {
  console.error('[sync] Error:', err);
  process.exit(1);
});
