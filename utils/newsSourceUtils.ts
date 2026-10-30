// utils/newsSourceUtils.ts
import { BreakingNewsArticle } from '../types';
import { allNewsSources, breakingNewsSources, BreakingNewsSource } from '../data/newsSources';

export { breakingNewsSources, allNewsSources };
export type { BreakingNewsSource };

export const getSourceLogo = (name: string): string => {
  const n = (name || '').toLowerCase();
  
  // Albanian & Regional Media
  if (n.includes('top channel')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Top_Channel_logo.svg/512px-Top_Channel_logo.svg.png';
  if (n.includes('tv klan') || n.includes('klan')) return 'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/TV_Klan.svg/1200px-TV_Klan.svg.png';
  if (n.includes('syri')) return 'https://www.syri.net/images/logo.png';
  if (n.includes('reporter')) return 'https://www.reporter.al/wp-content/themes/reporter/img/logo.png';
  if (n.includes('birn')) return 'https://balkaninsight.com/wp-content/themes/balkaninsight/images/logo.png';
  if (n.includes('shqiptarja')) return 'https://shqiptarja.com/images/logo_shqiptarja.png';
  if (n.includes('pamfleti')) return 'https://pamfleti.net/images/logo.png';
  if (n.includes('rtsh')) return 'https://upload.wikimedia.org/wikipedia/sq/thumb/8/8e/Radio_Televizioni_Shqiptar_%28logo%29.svg/512px-Radio_Televizioni_Shqiptar_%28logo%29.svg.png';
  if (n.includes('monitor')) return 'https://monitor.al/wp-content/themes/monitor/images/logo.png';
  if (n.includes('koha')) return 'https://www.koha.net/apple-touch-icon.png';
  if (n.includes('evropa e lirë') || n.includes('evropaelire')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Radio_Free_Europe-Radio_Liberty_logo.svg/512px-Radio_Free_Europe-Radio_Liberty_logo.svg.png';

  // International Tier 1 & Global Agencies
  if (n.includes('guardian')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/The_Guardian_2018.svg/512px-The_Guardian_2018.svg.png';
  if (n.includes('france 24') || n.includes('france24')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/France_24_logo.svg/512px-France_24_logo.svg.png';
  if (n.includes('deutsche welle') || n.includes('dw')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Deutsche_Welle_logo.svg/512px-Deutsche_Welle_logo.svg.png';
  if (n.includes('le monde') || n.includes('lemonde')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Le_Monde_logo.svg/512px-Le_Monde_logo.svg.png';
  if (n.includes('sky news') || n.includes('skynews')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Sky_News_logo_2018.svg/512px-Sky_News_logo_2018.svg.png';
  if (n.includes('new york times') || n.includes('nytimes')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/The_New_York_Times_logo.png/512px-The_New_York_Times_logo.png';
  if (n.includes('washington post')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/The_Washington_Post_Logo.svg/512px-The_Washington_Post_Logo.svg.png';
  if (n.includes('npr')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/National_Public_Radio_logo.svg/512px-National_Public_Radio_logo.svg.png';
  if (n.includes('cbc')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/CBC_Logo_1992-present.svg/512px-CBC_Logo_1992-present.svg.png';
  if (n.includes('pbs')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/PBS_NewsHour_logo.svg/512px-PBS_NewsHour_logo.svg.png';
  if (n.includes('nbc')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/NBC_News_2022.svg/512px-NBC_News_2022.svg.png';
  if (n.includes('al jazeera') || n.includes('aljazeera')) return 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Aljazeera_eng.svg/512px-Aljazeera_eng.svg.png';
  if (n.includes('rnz')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/RNZ_logo.svg/512px-RNZ_logo.svg.png';
  if (n.includes('the hindu') || n.includes('hindu')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/The_Hindu_logo.svg/512px-The_Hindu_logo.svg.png';
  if (n.includes('straits times')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/The_Straits_Times_Logo.svg/512px-The_Straits_Times_Logo.svg.png';
  if (n.includes('japan times')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/The_Japan_Times_logo.svg/512px-The_Japan_Times_logo.svg.png';
  if (n.includes('abc news australia')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ABC_News_Australia_logo.svg/512px-ABC_News_Australia_logo.svg.png';
  if (n.includes('abc news') || n.includes('abcnews')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/ABC_News_logo_2021.svg/512px-ABC_News_logo_2021.svg.png';
  if (n.includes('euronews')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Euronews_logo_2016.svg/512px-Euronews_logo_2016.svg.png';
  if (n.includes('bbc')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/BBC.svg/512px-BBC.svg.png';
  if (n.includes('reuters')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Reuters_Logo.svg/512px-Reuters_Logo.svg.png';
  if (n.includes('cnn')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/512px-CNN.svg.png';

  return 'https://novaric.co/wp-content/uploads/2025/07/NOVARIC-Logos_Master-WB-R_12062025_500x500.webp';
};

/**
 * Resolves the primary URL pointing to the original source publication
 */
export const getArticleSourceUrl = (item: Partial<BreakingNewsArticle> | null | undefined): string | null => {
  if (!item) return null;

  if (item.originalArticleUrl && (item.originalArticleUrl.startsWith('http://') || item.originalArticleUrl.startsWith('https://'))) {
    return item.originalArticleUrl;
  }

  if (item.feedUrl && (item.feedUrl.startsWith('http://') || item.feedUrl.startsWith('https://'))) {
    return item.feedUrl;
  }

  const rawName = (item.sourceName || '').trim();
  const n = rawName.toLowerCase();

  // Match against registered sources
  const matchedSource = allNewsSources.find(s => {
    const sName = s.sourceName.toLowerCase();
    return n.includes(sName) || sName.includes(n);
  });

  if (matchedSource?.homepageUrl) {
    return matchedSource.homepageUrl;
  }

  // Explicit fallback mappings
  if (n.includes('top channel')) return 'https://top-channel.tv';
  if (n.includes('tv klan') || n.includes('klan')) return 'https://tvklan.al';
  if (n.includes('syri')) return 'https://www.syri.net';
  if (n.includes('reporter')) return 'https://www.reporter.al';
  if (n.includes('birn')) return 'https://balkaninsight.com';
  if (n.includes('shqiptarja')) return 'https://shqiptarja.com';
  if (n.includes('pamfleti')) return 'https://pamfleti.net';
  if (n.includes('rtsh')) return 'https://rtsh.al';
  if (n.includes('monitor')) return 'https://monitor.al';
  if (n.includes('koha')) return 'https://koha.net';
  if (n.includes('evropa e lirë') || n.includes('evropaelire') || n.includes('rferl')) return 'https://evropaelire.org';
  if (n.includes('euronews')) return 'https://euronews.al';
  if (n.includes('bbc')) return 'https://www.bbc.com';
  if (n.includes('reuters')) return 'https://www.reuters.com';
  if (n.includes('cnn')) return 'https://www.cnn.com';
  if (n.includes('novaric')) return 'https://novaric.co';

  return null;
};
