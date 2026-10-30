import React from 'react';

// This file contains most of the type definitions for the application.

export type Page =
  | 'main'
  | 'privacy'
  | 'socialMediaPolicy'
  | 'copyrightPolicy'
  | 'journalisticEthicsManual'
  | 'aboutUs'
  | 'newsTicker'
  | 'newsArticle'
  | 'rightSidebar'
  | 'leftSidebar'
  | 'politiciansPage'
  | 'mediaPersonalitiesPage'
  | 'judiciaryPage'
  | 'businessPage'
  | 'worldTimeTicker'
  | 'mobileNav'
  | 'tvShowPage'
  | 'newsletterWelcome'
  | 'dataSourceCoverage'
  | 'newsList'
  | 'brandGuidelines'
  | 'articlesList'
  | 'articlePage'
  | 'academicJournalsList'
  | 'academicJournalPage'
  | 'vipProfilePage'
  | 'shkoderEconomyPage'
  | 'shkoderPoliticsPage'
  | 'shkoderSocialPage'
  | 'novaricAcademy'
  | 'novaricJournalManifesto'
  | 'fakeNewsAnalysis'
  | 'fakeNewsArchive'
  | 'mediaEducationFramework'
  | 'trademarkCertificate'
  | 'parliamentMembersPage'
  | 'sitemap'
  | 'analysisMethodology'
  | 'openLetterShkreliBeci'
  | 'newsFeatureShkreliBeci'
  | 'shkoderShockTherapy'
  | 'buletinDhomaTregtise'
  | 'albanianMediaBenchmark'
  | 'newsletterSubscription'
  | 'newsletter'
  | 'tvPersonalitiesAnalysis'
  | 'hermeneuticFramework'
  | 'deconstructNews'
  | 'novaricCodeOfStandards'
  | 'standards'
  | 'methodology'
  | 'buletinCorruptionAnalysis'
  | 'buletinMethodology'
  | 'noraAiProfile'
  | 'articleMetricsExplained'
  | 'factCheckForm'
  | 'paragonMethodologyPage'
  | 'paragonVisualizationPage'
  | 'paragonNetworkMap'
  | 'novaricMediaHouse'
  | 'maragonFramework'
  | 'acppaMethodology'
  | 'buletinBeShqiperi'
  | 'politicalProfileFramework'
  | 'pvafInstitutionalPerformance'
  | 'paragonMethodologyUnified'
  | 'politicalEthicsComparison'
  | 'bibliografiaEZgjeruar'
  | 'powerNetworkAnalysis'
  | 'politicalIntegrityProfile'
  | 'europeanEthicsStructures'
  | 'agib'
  | 'archetypesExplained'
  | 'politicalProfile'
  | 'paragonConceptKapsh'
  | 'paragonConceptBehavioral'
  | 'paragonConceptCompetency'
  | 'paragonConceptFeedback'
  | 'paragonConceptEngine'
  | 'contentQualityAssurance'
  | 'shkoderCulturePage'
  | 'jurisprudencePage'
  | 'judicialPerformancePage'
  | 'judicialPhilosophyPage'
  | 'judicialEthicsPage'
  | 'judicialProfileMethodologyPage'
  | 'judicialEcosystemAnalysisMethodologyPage'
  | 'bibliografiaJurisprudences'
  | 'paragonResultPage'
  | 'mediaEducationBibliography'
  | 'zodiacInfoPage'
  | 'maragonReportPage'
  | 'jasminaLumanajProfile'
  | 'pressConferences'
  | 'pressReleaseNovaricVisa'
  | 'europeanCommission'
  | 'euCodeOfConduct'
  | 'euReferencesArchive'
  | 'paragonLeaderboard'
  | 'paragonDashboard'
  | 'ethicalResonance'
  | 'whitepaperVisualizationPage'
  | 'aiReadinessMatrix'
  | 'corporatePositionStatement'
  | 'gdprPolicy'
  | 'cidaMethodology'
  | 'reputationWarRoom'
  | 'nexusHumanistAiGovernance'
  | 'authorProfile'
  | 'profiliIAutorit';

export type SourceType = 'albanian' | 'international' | 'balkan' | 'regional';
export type NewsAuthenticityRating = 'VERIFIED_ACCURATE' | 'MOSTLY_ACCURATE' | 'PARTIALLY_ACCURATE' | 'ACCURACY_UNCLEAR' | 'POTENTIAL_MISINFORMATION';
export type SourceReliabilityRating = 'VERY_HIGH_REPUTATION' | 'HIGH_REPUTATION' | 'MEDIUM_REPUTATION' | 'LOW_REPUTATION_MIXED' | 'UNRELIABLE_UNKNOWN';

export interface ForensicMetrics {
    adjectiveToNounRatio: number;
    maliceCoefficient: number;
    integrityScore: number;
    loadedLanguage: string[];
    evidenceGaps: string[];
    verificationHash: string;
}

export interface CrdsUrlAnalysis {
    id: string;
    url: string;
    headline: string;
    metrics: ForensicMetrics;
    serpRank: number;
    status: 'Tracking' | 'Mitigated' | 'Critical';
}

export interface NerBreakdown {
  SRS: number;
  CIS: number;
  CSC: number;
  TRF: number;
  ECM: number;
}

export type ImageProvenance =
  | "rssFeed"          // enclosure / media / itunes / content:encoded img
  | "articleOpenGraph" // fallback only
  | "articleOg"        // shortened alias
  | "none";

export type NewsImage = {
  itemId: string;
  imageUrl: string;
  thumbUrl?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  provenance: ImageProvenance;
  sourceField?: string;
  fetchedAt: string;
};

export interface BreakingNewsArticle {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  image?: string | null;
  imageThumb?: string | null;
  imageProvenance?: ImageProvenance;
  imageSourceField?: string | null;
  feedXml?: any;
  publishedDate: string;
  publishedAt?: string; // ISO 8601 UTC timestamp
  ingestedAt?: string;  // ISO 8601 UTC timestamp of database insertion
  title_sq?: string;
  title_en?: string;
  content_sq?: string;
  content_en?: string;
  sourceName: string;
  sourceType: SourceType;
  feedUrl?: string;
  originalArticleUrl?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  isHighlyRelevantCurrentDevelopment: boolean;
  newsAuthenticity: NewsAuthenticityRating;
  sourceReliability: SourceReliabilityRating;
  shkoderNewsCategory?: string;
  isLiveStream?: boolean;
  readTimeMinutes?: number;

  // -----------------------------
  // NER — BACKEND AUTHORITATIVE
  // -----------------------------
  ecosystemRating?: number;
  nerVersion?: string;
  nerBreakdown?: {
    SRS: number;
    CIS: number;
    CSC: number;
    TRF: number;
    ECM: number;
  };
}

export type BreakingNewsItemData = BreakingNewsArticle;

export type NewsFeedScope = 'latest' | 'archive' | 'gap' | 'all';

export interface NewsTimeWindow {
  start?: string; // ISO 8601 UTC
  end?: string;   // ISO 8601 UTC
}

export interface NewsApiResponse {
  serverTime: string; // ISO 8601 UTC
  scope: NewsFeedScope;
  window: NewsTimeWindow;
  items: BreakingNewsArticle[];
  nextCursor: string | null;
  count: number;
  total: number;
}

export interface NewsQueryOptions {
  scope?: NewsFeedScope;
  category?: string;
  q?: string;
  sourceName?: string;
  sort?: 'newest' | 'oldest' | 'ner_score';
  cursor?: string;
  limit?: number;
  refresh?: boolean;
  balancePerSource?: boolean;
  maxPerSource?: number;
}

export interface DedupeTelemetry {
  canonicalUrlWins: number;
  ampMobileWins: number;
  guidWins: number;
  syndicationWins: number;
  idFallbackWins: number;
  totalDedupeWins: number;
}

export interface SourceLagAlert {
  sourceName: string;
  sourceType: SourceType;
  newestPublishedAt: string;
  lagMinutes: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export interface OpsMetricsResponse {
  serverTime: string;
  cacheVersion: number;
  windowCounts: {
    latestCount: number;
    gapCount: number;
    archiveCount: number;
    totalCount: number;
  };
  cacheStats: {
    latestEntries: number;
    archiveEntries: number;
    hits: number;
    misses: number;
    hitRatio: number;
  };
  latencyMetrics: {
    p50Ms: number;
    p95Ms: number;
    p99Ms: number;
    avgMs: number;
    totalQueries: number;
  };
  nerMetrics: {
    avgScore: number;
    p10Score: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
  };
  imageProvenanceMetrics: {
    rssFeedCount: number;
    articleOgCount: number;
    noneCount: number;
    ogFallbackRatio: number;
    ogDominationAlert: boolean;
  };
  dedupeTelemetry: DedupeTelemetry;
  sourceLagSummary: {
    healthyCount: number;
    warningCount: number;
    criticalCount: number;
    alerts: SourceLagAlert[];
  };
  topFeedErrors: Array<{ sourceName?: string; error: string; timestamp: string }>;
}

export type ZodiacSign = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type Archetype = 'Analisti' | 'Moderatori' | 'Komunikatori' | 'Roja Publik' | 'I Paidentifikuar';

export interface ParagonEntry {
  dimension: string;
  score: number;
  peerAverage: number;
  globalBenchmark: number;
  description: string;
  commentary: string;
}

export type ParagonDimension =
  | 'Angazhimi Politik'
  | 'Llogaridhënia'
  | 'Përfaqësimi'
  | 'Asertiviteti'
  | 'Qeverisja'
  | 'Kohësioni'
  | 'Narrativa';

export type MaragonDimension =
  | 'Pajtueshmëria Etike'
  | 'Profesionalizmi në Kriza'
  | 'Saktësia Faktike & Verifikimi'
  | 'Paanshmëria, Balanca & Anshmëria'
  | 'Thellësia e Analizës/Pyetjeve'
  | 'Qartësia & Koherenca'
  | 'Promovimi i të Menduarit Kritik';

export interface TranslatedParagonEntry extends ParagonEntry {
  originalDimension: ParagonDimension;
}

export interface PoliticalDocument {
  title: string;
  date: string;
  type: string;
  url: string;
  size?: string;
}

export interface PoliticalSpeech {
  title: string;
  date: string;
  summary: string;
  url?: string;
  location?: string;
}

export interface RelatedLink {
  title: string;
  source: string;
  url: string;
}

export interface Psychometrics {
  aggressionIndex: number;
  logicalFallacyRate: number;
  vocabularyComplexity: string;
  emotionalDriver: string;
  mindset?: { dogmaticVsOpen: number; populistVsElitist: number };
  spectrogramData?: { time: number; intensity: number; type: string }[];
}

export interface MaragonDimensionScores {
  Readiness: number;
  Aptitude: number;
  Governance: number;
  OversightNurturing: number;
}

export interface VipProfile {
  id: string | number;
  name: string;
  imageUrl: string;
  category: string;
  shortBio: string;
  detailedBio: string;
  zodiacSign?: ZodiacSign;
  paragonAnalysis?: ParagonEntry[];
  maragonAnalysis?: ParagonEntry[];
  timelineEvents?: { year: string; title: string; description?: string }[];
  documents?: PoliticalDocument[];
  speeches?: PoliticalSpeech[];
  relatedLinks?: RelatedLink[];
  age?: number;
  dateOfBirth?: string;
  tvShowLogoUrl?: string;
  audienceRating?: number;
  archetype?: Archetype;
  aletheiaScore?: number;
  topFallacies?: string[];
  csrRiskLevel?: 'Low' | 'Moderate' | 'High' | 'Critical';
  horizonRigidity?: number;
  aggressionIndex?: number;
  ignoredTopics?: string[];
  psychometrics?: Psychometrics;
  genome?: any;
  gender?: string;
  improvement_checklist?: any[];
  professionalPerformance?: { excellent: number; good: number; average: number; needsImprovement: number };
  skillsDevelopment?: { leadership: number; communication: number; expertise: number; ethics: number };
  performanceAnalysis?: ParagonEntry[];
  journalisticConduct?: any;
  maragonSummary?: MaragonDimensionScores;
  averageMaragonScore?: number;
  latestScore?: number;
  paragon?: any;
  numericId?: number;
  politicianId?: number;
  dynamicScore?: number;
  clickCount?: number;
  publicPerception?: { positive: number; neutral: number; negative: number; [key: string]: any };
  commentary?: string;
  placeOfBirth?: string;
  electoralZone?: string;
  paragonDimensions?: any[];
  compositeHistory?: any[];
  bio?: any;
  recentActivity?: any[];
  assetDeclaration?: any;
  mandates?: any[];
  party?: string;
  composite?: number | null;
  compositeDelta?: number | null;
  periodEnd?: string | null;
  dimsSource?: 'db' | 'synthetic' | 'none';
  primaryRole?: string;
  secondaryRoles?: string[];
  parliamentaryStatus?: string;
  detentionStatus?: string;
  caseStatus?: string;
  presumptionOfInnocence?: boolean;
  legalStatusAsOf?: string;
  legalStatusSummary?: string;
  dateOfBirthVerificationStatus?: 'verified' | 'unverified';
  dateOfBirthSourceUrl?: string;
  dateOfBirthVerifiedAt?: string;
  roleHistory?: any[];
  scoringSuspended?: boolean;
  scoringSuspensionNotice?: string;
}

export interface ArticleData {
  id: number;
  title: string;
  author: string;
  publishedDate: string;
  imageUrl?: string;
  content: string;
  isArticleOfTheDay?: boolean;
  featurePageId?: string;
}

export interface AcademicJournalData {
  id: number;
  title: string;
  authors: string[];
  journalName: string;
  publicationDate: string;
  summary: string;
  url: string;
  imageUrl?: string;
  isFeatured?: boolean;
}

export interface ClaimLedgerEntry {
  claim_sq: string;
  claim_en: string;
  reality_sq?: string;
  reality_en?: string;
  type: 'Criminal Allegation' | 'Institutional Accusation' | 'Speculative Inference' | 'Rhetorical Insinuation';
  hasAttribution: boolean;
  hasEvidence: boolean;
  risk: 'low' | 'medium' | 'high';
}

export interface ForensicMarker {
    id: string;
    text_sq: string;
    text_en: string;
    type: 'malice' | 'logic' | 'void';
    alert_sq: string;
    alert_en: string;
    category_sq: string;
    category_en: string;
    description_sq: string;
    description_en: string;
}

export interface FakeNewsCaseStudy {
  id: string;
  source: string;
  headline_sq: string;
  headline_en: string;
  articleUrl: string;
  verdictSummary_sq: string;
  verdictSummary_en: string;
  integrityScore: number;
  
  // The interactive transcript structure
  forensicTranscript?: (string | ForensicMarker)[];
  
  narrativeAngle_sq: string;
  narrativeAngle_en: string;
  defamatoryAnalysis_sq: string;
  defamatoryAnalysis_en: string;
  
  maliceMarkers_sq?: string[];
  maliceMarkers_en?: string[];
  
  logicFractures_sq?: string[];
  logicFractures_en?: string[];
  
  claimLedger?: ClaimLedgerEntry[];
  
  evidenceRatioExplanation_sq?: string;
  evidenceRatioExplanation_en?: string;
  
  neutralRewrite_sq?: string;
  neutralRewrite_en?: string;
  
  chartData: ChartSegment[];
  publicPerception: { isFake: number; isReal: number };
  keyTactics_sq?: string[];
  keyTactics_en?: string[];
  
  // Advanced Audit Fields
  fallacies?: { name: string; desc: string }[];
  ethicsCompliance?: { label: string; status: 'PASSED' | 'FAILED' }[];
}

export interface ChartSegment {
  name: string;
  value: number;
  color: string;
}

export interface ParliamentDistrict {
  district: string;
  mandates: number;
  parties: {
    partyName: string;
    mandatesWon: number;
    members: {
      name: string;
      status: string;
      profileId?: string;
      politicianId?: number;
      uuid?: string;
    }[];
  }[];
}

export interface Source {
  uri: string;
  title: string;
}

export interface FactCheckResult {
  originalClaim: string;
  summary: string;
  sources: Source[];
  truePoints?: string[];
  falsePoints?: string[];
  qualityAnalysis?: {
    sentiment: string;
    writingStyle: string;
    logicalIntegrity: string;
  };
  finalIntegrityScore?: number;
  verdict: string;
}

export interface ProfileInput {
  personal: {
    fullName: string;
    dob: string;
    age?: number;
    party?: string;
    title?: string;
    zodiacSign?: ZodiacSign;
  };
  educationHistory: { degree: string; institution: string; location: string }[];
  workHistory: { role: string; organization: string; location: string; reasonForExit: string }[];
  politicalHistory: { role: string; party: string; period: string }[];
  keyLifeEvents: { year: number; event: string }[];
}

export interface PsychometricTrait {
  rating: string;
  evidence: string[];
}

export interface PsychometricProfile {
  opennessToExperience: PsychometricTrait;
  conscientiousness: PsychometricTrait;
  extraversion: PsychometricTrait;
  agreeableness: PsychometricTrait;
  emotionalStability: PsychometricTrait;
}

export interface MatrixProfile {
  formal_euro_atlantic_score: number;
  informal_albanian_score: number;
  archetype: string;
  contextClashEvents: string[];
}

export interface PerformancePortfolioItem {
  event: string;
  competencies?: string[];
  skillGaps?: string[];
}

export interface IntegrityAnalysis {
  agib: AgibAnalysis;
  cri: CriAnalysis;
  riskQuadrant: number;
  overallAlert: 'Integritet i Qëndrueshëm' | 'ALERT I LARTË INTEGRITETI';
  clinicalSummary: string;
}

export interface AgibAnalysis {
  archetype: string;
  archetypeScore: number;
  centralityScore: number;
  scriIndex: number;
  vulnerability: 'I Ulët' | 'Mesatar' | 'I Lartë';
}

export interface CriAnalysis {
  moralDetachmentIndex: number;
  euphemisticLanguage: string;
  advantageousComparison: string;
  displacementOfResponsibility: string;
  eliteClosureIndex: number;
  impunityContext: string;
  criScore: number;
  behavioralRisk: 'I Ulët' | 'Mesatar' | 'I Lartë';
}

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  group: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  type?: 'direct' | 'thematic';
}

export interface FinalDiagnosis {
  alertLevel: string;
  alertType: string;
  executiveSummary: string;
}

export interface FullProfileAnalysis {
  profileInput: ProfileInput;
  kapschAnalysis: {
    layer1_psychometricProfile: PsychometricProfile;
    layer2_matrixProfile: MatrixProfile;
    layer3_performancePortfolio: PerformancePortfolioItem[];
  };
  performanceAnalysis: {
    individualScores: number[];
    datasets: { label: string; scores: number[] }[];
    strengths: { label: string; score: number }[];
    weaknesses: { label: string; score: number }[];
    recommendations: string[];
  };
  integrityAnalysis: IntegrityAnalysis;
  networkMapData: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  finalDiagnosis: FinalDiagnosis;
}

export interface ProcessedVipProfile extends VipProfile {
  processedAnalysis: {
    overallScore: number;
    translatedAnalysis: TranslatedParagonEntry[];
    topDimensions: TranslatedParagonEntry[];
    bottomDimensions: TranslatedParagonEntry[];
    recommendations: string[];
  };
}

export interface ArticleMetrics {
  credibility: {
    totalClaims: number;
    verifiedClaims: number;
    totalSources: number;
    primarySourceRatio: number;
  };
  readability: {
    avgSentenceLength: number;
    fleschKincaidLevel: number;
    passiveVoicePercentage: number;
  };
  biasAndSentiment: {
    overallSentiment: number;
    subjectivityPercentage: number;
  };
  lifecycleAndCompliance: {
    lastUpdated: string;
    changeCount: number;
    estimatedWorkHours: number;
    isSponsored: boolean;
    hasDisclosures: boolean;
    isGdpdCompliant: boolean;
  };
  seoAndAccessibility: {
    focusKeyword: string;
    internalLinks: number;
    externalLinks: number;
    altTextCoverage: number;
  };
}

export interface ArticleIntegrityProfileData {
  structuralTrustworthinessScore: number;
  logicalCoherenceScore: number;
  quadrant: 1 | 2 | 3 | 4;
  statusLabel: string;
  clinicalSummary: string;
  recommendations?: {
    structural: string[];
    coherence: string[];
  };
}

export type MetricEvaluationCategory = 'E Ulët' | 'Mesatare e Ulët' | 'Mesatare' | 'E Lartë';

export interface MetricEvaluation {
  value: string | number | boolean;
  category: MetricEvaluationCategory | 'Mesatare';
  score: number;
}

export interface ArticleEvaluationData {
  overallScore: string;
  overallCategory: MetricEvaluationCategory | 'Mesatare';
  breakdown: {
    credibility: { [key: string]: MetricEvaluation };
    readability: { [key: string]: MetricEvaluation };
    biasAndSentiment: { [key: string]: MetricEvaluation };
    lifecycleAndCompliance: { [key: string]: MetricEvaluation };
    seoAndAccessibility: { [key: string]: MetricEvaluation };
  };
}

export enum VerdictLabel {
  TRUE = 'E Vërtetë',
  MOSTLY_TRUE = 'Kryesisht e Vërtetë',
  HALF_TRUE = 'Pjesërisht e Vërtetë',
  MOSTLY_FALSE = 'Kryesisht e Gabuar',
  FALSE = 'E Gabuar',
  MISLEADING = 'Mashtruese',
  UNVERIFIABLE = 'E Paverifikueshme',
  CANNOT_DETERMINE = 'Nuk mund të përcaktohet',
  UNKNOWN = 'E Panjohur'
}

export interface ArticleAnalysis {
  title: string;
  summary: string;
  verdict: VerdictLabel;
  authenticityRating: NewsAuthenticityRating;
  sources: Source[];
}

export interface MunicipalityPerformance {
  kpi: string;
  value: number;
  description: string;
}

export interface ShkoderSocioEconomicData {
  totalPopulation: number;
  households: number;
  unemploymentRate: number;
  povertyRate: number;
  populationPyramid: { ageGroup: string; male: number; female: number }[];
  populationGrowth: { year: number; population: number }[];
  genderRatio: { male: number; female: number };
  educationAttainment: { level: string; percentage: number }[];
  employmentBySector: { sector: string; percentage: number }[];
  householdIncomeDistribution: { bracket: string; percentage: number }[];
  businessSizeDistribution: { size: string; percentage: number }[];
  housingType: { type: string; percentage: number }[];
  healthIndicators: { indicator: string; value: string }[];
}

export interface ShkoderPoliticalData {
  councilComposition: { party: string; seats: number; color: string }[];
  keyIssues: { issue: string; summary: string }[];
}

export interface DesignSearchResultItem {
  designNumber: string;
  verbalElement?: string;
  status: string;
  applicationDate: string;
  applicants: { name: string }[];
}

export interface DesignSearchResult {
  totalElements: number;
  designs: DesignSearchResultItem[];
}

export interface TVPersonalityAnalysis {
  id: string;
  name: string;
  imageUrl: string;
  analysis: {
    dimension: string;
    description: string;
    score: number;
    peerAverage: number;
    globalBenchmark: number;
    commentary: string;
  }[];
}

export interface ClaimAnalysis {
  claim: string;
  verdict: 'E Vërtetë' | 'E Gabuar' | 'Mashtruese' | 'E Paverifikueshme';
  reason: string;
  sources?: Source[];
  detectedBias?: string;
  framingTechniques?: string[];
  disinformationPattern?: string;
}

export interface IntegrityReport {
  integrityScore: number;
  verdict: 'Integritet i Lartë' | 'Integritet i Moderuar' | 'Integritet i Ulët';
  analysisSummary?: {
    mainBias: string;
    dominantNarrative: string;
  };
  warnings?: string[];
  claims?: ClaimAnalysis[];
}

export interface HighlightedSegment {
  text: string;
  category: 'Kornizim Kulturor' | 'Mbrojtje e Burimit' | 'Gjuhë Emocionale' | 'Arketip Narrativ';
  explanation: string;
}

export interface DeconstructedArticle {
  analyzedText: string;
  segments: HighlightedSegment[];
}

export interface ParagonLiveScore {
  politician_id: number;
  overall_score: number;
  calculated_at: string;
  politicians: {
    id: number;
    name: string;
    image_url?: string;
  };
  dimension_scores?: Record<string, { score: number }>;
}

export interface ParagonTrendEntry {
  politician_id: number;
  overall_score: number;
  calculated_at: string;
  politicians: {
    name: string;
  };
  delta?: number;
}

export interface ParagonDeltaResult {
  politician_id: number;
  name: string;
  new_score: number;
  previous_score: number;
  delta: number;
}

export interface ParagonDashboardResponse {
  latestScores: ParagonLiveScore[];
  topRisers: ParagonDeltaResult[];
  topFallers: ParagonDeltaResult[];
  recentTrends: ParagonTrendEntry[];
}

export interface ParagonScore extends ParagonLiveScore {}

export interface VipProfileResponseDto {
  id: string | number;
  name: string;
  image_url?: string;
  category: string;
  short_bio: string;
  detailed_bio: string;
  gender?: string;
  zodiac_sign?: ZodiacSign;
  birth_date?: string;
  age?: number;
  paragon_score?: number;
  overall_score?: number;
}

export interface PoliticianParagonDto {
  politician_id: number;
  overall_score: number;
  calculated_at: string;
  dimension_scores: Record<string, number>;
}

export interface PoliticianFullDto {
  politician: any;
  paragon_scores?: PoliticianParagonDto;
  profile_enrichment?: any;
  improvement_checklist?: any[];
}

export interface PoliticianAnalysisResult {
  id: string | number;
  name: string;
  factCheckSummary: {
    claim: string;
    verdict: string;
    explanation: string;
    source: string;
  };
  sentiment: { positive: number; neutral: number; negative: number };
  transparencyScore: { score: number; label: string; justification: string };
}

export interface TvShowData {
  id: number;
  name: string;
  channel: string;
  logoUrl: string;
  description: string;
  host: string;
  commonTopics: string[];
  statistics: {
    audienceImpact: number;
    informationCredibility: number;
    discussionQuality: number;
  };
  maragonSummary?: MaragonDimensionScores;
}

export interface MaragonIndicatorScore {
  score: number;
  evidenceId: string;
}

export interface MaragonFullReport extends MaragonDimensionScores {
  entityId: string;
  entityType: 'individual' | 'tvShow';
  compositeScore: number;
  benchmarks: {
    peerAverage: MaragonDimensionScores;
    standardAdherence: MaragonDimensionScores;
  };
  indicatorDetails: Record<string, MaragonIndicatorScore>;
  explainabilityData: any;
}