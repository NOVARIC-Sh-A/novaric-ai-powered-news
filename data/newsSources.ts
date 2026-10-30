// data/newsSources.ts
// ============================================================
// NOVARIC® Media Intelligence — Verified News Source Registry
// ============================================================

export type SourceClassification = "international" | "balkan" | "albanian";

export type BreakingNewsSource = {
  sourceName: string;
  feedUrl: string;
  homepageUrl: string;
  region: string;
  primaryLanguage: string;
  category: SourceClassification;
};

export const breakingNewsSources: BreakingNewsSource[] = [
  {
    sourceName: "BBC News",
    feedUrl: "https://feeds.bbci.co.uk/news/rss.xml",
    homepageUrl: "https://www.bbc.com/news",
    region: "Europe",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "The Guardian",
    feedUrl: "https://www.theguardian.com/world/rss",
    homepageUrl: "https://www.theguardian.com/world",
    region: "Europe",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "Euronews",
    feedUrl: "https://www.euronews.com/rss?level=theme&name=news",
    homepageUrl: "https://www.euronews.com",
    region: "Europe",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "France 24",
    feedUrl: "https://www.france24.com/en/rss",
    homepageUrl: "https://www.france24.com/en/",
    region: "Europe",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "Deutsche Welle",
    feedUrl: "https://rss.dw.com/rdf/rss-en-all",
    homepageUrl: "https://www.dw.com/en/",
    region: "Europe",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "Le Monde",
    feedUrl: "https://www.lemonde.fr/rss/une.xml",
    homepageUrl: "https://www.lemonde.fr/",
    region: "Europe",
    primaryLanguage: "fr",
    category: "international"
  },
  {
    sourceName: "Sky News",
    feedUrl: "https://feeds.skynews.com/feeds/rss/world.xml",
    homepageUrl: "https://news.sky.com/world",
    region: "Europe",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "The New York Times",
    feedUrl: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    homepageUrl: "https://www.nytimes.com",
    region: "North America",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "The Washington Post",
    feedUrl: "https://feeds.washingtonpost.com/rss/world",
    homepageUrl: "https://www.washingtonpost.com",
    region: "North America",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "NPR",
    feedUrl: "https://feeds.npr.org/1001/rss.xml",
    homepageUrl: "https://www.npr.org",
    region: "North America",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "CBC News",
    feedUrl: "https://www.cbc.ca/cmlink/rss-topstories",
    homepageUrl: "https://www.cbc.ca/news/",
    region: "North America",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "ABC News",
    feedUrl: "https://feeds.abcnews.com/abcnews/topstories",
    homepageUrl: "https://abcnews.go.com/",
    region: "North America",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "PBS NewsHour",
    feedUrl: "https://www.pbs.org/newshour/feeds/rss/headlines",
    homepageUrl: "https://www.pbs.org/newshour/",
    region: "North America",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "NBC News",
    feedUrl: "https://feeds.nbcnews.com/nbcnews/public/news",
    homepageUrl: "https://www.nbcnews.com/",
    region: "North America",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "Al Jazeera English",
    feedUrl: "https://www.aljazeera.com/xml/rss/all.xml",
    homepageUrl: "https://www.aljazeera.com",
    region: "Middle East",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "ABC News Australia",
    feedUrl: "https://www.abc.net.au/news/feed/51120/rss.xml",
    homepageUrl: "https://www.abc.net.au/news",
    region: "Asia Pacific",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "RNZ Pacific",
    feedUrl: "https://www.rnz.co.nz/rss/pacific.xml",
    homepageUrl: "https://www.rnz.co.nz/news/pacific",
    region: "Asia Pacific",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "The Hindu International",
    feedUrl: "https://www.thehindu.com/news/international/feeder/default.rss",
    homepageUrl: "https://www.thehindu.com/news/international/",
    region: "Asia Pacific",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "The Straits Times World",
    feedUrl: "https://www.straitstimes.com/news/world/rss.xml",
    homepageUrl: "https://www.straitstimes.com/news/world",
    region: "Asia Pacific",
    primaryLanguage: "en",
    category: "international"
  },
  {
    sourceName: "The Japan Times",
    feedUrl: "https://www.japantimes.co.jp/feed/",
    homepageUrl: "https://www.japantimes.co.jp/",
    region: "Asia Pacific",
    primaryLanguage: "en",
    category: "international"
  }
];

export const regionalNewsSources: BreakingNewsSource[] = [
  // Albanian National & Local Sources
  {
    sourceName: "RTSH",
    feedUrl: "https://lajme.rtsh.al/feed/",
    homepageUrl: "https://rtsh.al",
    region: "Albania",
    primaryLanguage: "sq",
    category: "albanian"
  },
  {
    sourceName: "Top Channel",
    feedUrl: "https://top-channel.tv/feed/",
    homepageUrl: "https://top-channel.tv",
    region: "Albania",
    primaryLanguage: "sq",
    category: "albanian"
  },
  {
    sourceName: "TV Klan",
    feedUrl: "https://tvklan.al/feed/",
    homepageUrl: "https://tvklan.al",
    region: "Albania",
    primaryLanguage: "sq",
    category: "albanian"
  },
  {
    sourceName: "Euronews Albania",
    feedUrl: "https://euronews.al/feed/",
    homepageUrl: "https://euronews.al",
    region: "Albania",
    primaryLanguage: "sq",
    category: "albanian"
  },
  {
    sourceName: "BIRN Shqipëri",
    feedUrl: "https://www.reporter.al/feed/",
    homepageUrl: "https://reporter.al",
    region: "Albania",
    primaryLanguage: "sq",
    category: "albanian"
  },
  {
    sourceName: "Monitor Ekonomik",
    feedUrl: "https://monitor.al/feed/",
    homepageUrl: "https://monitor.al",
    region: "Albania",
    primaryLanguage: "sq",
    category: "albanian"
  },
  {
    sourceName: "Syri TV",
    feedUrl: "https://www.syri.net/feed/",
    homepageUrl: "https://www.syri.net",
    region: "Albania",
    primaryLanguage: "sq",
    category: "albanian"
  },
  // Balkan Regional Sources
  {
    sourceName: "Koha Ditore",
    feedUrl: "https://www.koha.net/rss",
    homepageUrl: "https://koha.net",
    region: "Kosovo",
    primaryLanguage: "sq",
    category: "balkan"
  },
  {
    sourceName: "Radio Evropa e Lirë",
    feedUrl: "https://www.evropaelire.org/api/z$q_eprqo-",
    homepageUrl: "https://evropaelire.org",
    region: "Balkans",
    primaryLanguage: "sq",
    category: "balkan"
  },
  {
    sourceName: "Balkan Insight",
    feedUrl: "https://balkaninsight.com/feed/",
    homepageUrl: "https://balkaninsight.com",
    region: "Balkans",
    primaryLanguage: "en",
    category: "balkan"
  }
];

export const allNewsSources: BreakingNewsSource[] = [
  ...regionalNewsSources,
  ...breakingNewsSources
];
