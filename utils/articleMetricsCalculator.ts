import { ArticleMetrics, ArticleIntegrityProfileData, ArticleEvaluationData, MetricEvaluation, MetricEvaluationCategory } from '../types';

interface SourceWithCredibility {
  id: number;
  url: string;
  text: string;
  credibility_industry_rating_pct: number;
}

// CONFIGURATION
const METRIC_THRESHOLDS: { [key: string]: any } = {
  // Credibility
  verifiedClaimsRatio: { thresholds: [50, 70, 90], rule: 'asc' },
  primarySourceRatio: { thresholds: [10, 25, 50], rule: 'asc' },
  totalSources: { thresholds: [2, 5, 10], rule: 'asc' },
  // Readability
  fleschKincaidLevel: { thresholds: [15, 12, 9], rule: 'desc' },
  passiveVoicePercentage: { thresholds: [15, 10, 5], rule: 'desc' },
  avgSentenceLength: { thresholds: [25, 20, 15], rule: 'desc' },
  // Bias & Sentiment
  subjectivityPercentage: { thresholds: [30, 20, 10], rule: 'desc' },
  overallSentimentAbs: { thresholds: [0.5, 0.25, 0.1], rule: 'desc' },
  // Lifecycle & Compliance
  isSponsored: { rule: 'boolean_false_is_high' },
  hasDisclosures: { rule: 'boolean_true_is_high' },
  isGdpdCompliant: { rule: 'boolean_true_is_high' },
  // SEO & Accessibility
  altTextCoverage: { thresholds: [50, 80, 95], rule: 'asc' },
  internalLinks: { thresholds: [1, 3, 5], rule: 'asc' },
  externalLinks: { thresholds: [2, 5, 10], rule: 'asc' },
};

const EVALUATION_CATEGORIES: { [key: string]: { label: MetricEvaluationCategory; score: number } } = {
  LOW: { label: 'E Ulët', score: 1 },
  MEDIUM_LOW: { label: 'Mesatare e Ulët', score: 2 },
  MEDIUM: { label: 'Mesatare', score: 3 },
  HIGH: { label: 'E Lartë', score: 4 },
};

const METRIC_WEIGHTS = {
  credibility: 4,
  readability: 2,
  biasAndSentiment: 3,
  lifecycleAndCompliance: 1.5,
  seoAndAccessibility: 1,
};

// HELPER FUNCTION
function evaluateMetric(value: number, config: any): { label: MetricEvaluationCategory; score: number } {
  if (!config) return EVALUATION_CATEGORIES.MEDIUM;
  
  if (config.rule === 'boolean_true_is_high') {
    return value ? EVALUATION_CATEGORIES.HIGH : EVALUATION_CATEGORIES.LOW;
  }
  if (config.rule === 'boolean_false_is_high') {
    return !value ? EVALUATION_CATEGORIES.HIGH : EVALUATION_CATEGORIES.LOW;
  }
  
  const [low, med, high] = config.thresholds;
  if (config.rule === 'asc') {
    if (value >= high) return EVALUATION_CATEGORIES.HIGH;
    if (value >= med) return EVALUATION_CATEGORIES.MEDIUM;
    if (value >= low) return EVALUATION_CATEGORIES.MEDIUM_LOW;
    return EVALUATION_CATEGORIES.LOW;
  } else { // rule 'desc'
    if (value <= high) return EVALUATION_CATEGORIES.HIGH;
    if (value <= med) return EVALUATION_CATEGORIES.MEDIUM;
    if (value <= low) return EVALUATION_CATEGORIES.MEDIUM_LOW;
    return EVALUATION_CATEGORIES.LOW;
  }
}

// MAIN EVALUATION ENGINE
export function evaluateArticleMetrics(rawMetrics: ArticleMetrics): ArticleEvaluationData {
  const breakdown: any = {
    credibility: {},
    readability: {},
    biasAndSentiment: {},
    lifecycleAndCompliance: {},
    seoAndAccessibility: {},
  };
  const categoryScores: { [key: string]: number[] } = {
    credibility: [],
    readability: [],
    biasAndSentiment: [],
    lifecycleAndCompliance: [],
    seoAndAccessibility: [],
  };

  // 1. Evaluate Credibility
  const verifiedClaimsRatio = (rawMetrics.credibility.verifiedClaims / (rawMetrics.credibility.totalClaims || 1)) * 100;
  const verifiedClaimsEval = evaluateMetric(verifiedClaimsRatio, METRIC_THRESHOLDS.verifiedClaimsRatio);
  breakdown.credibility.verifiedClaims = { value: `${rawMetrics.credibility.verifiedClaims}/${rawMetrics.credibility.totalClaims}`, category: verifiedClaimsEval.label, score: verifiedClaimsEval.score };
  categoryScores.credibility.push(verifiedClaimsEval.score);

  const primarySourceRatioEval = evaluateMetric(rawMetrics.credibility.primarySourceRatio, METRIC_THRESHOLDS.primarySourceRatio);
  breakdown.credibility.primarySourceRatio = { value: `${rawMetrics.credibility.primarySourceRatio.toFixed(0)}%`, category: primarySourceRatioEval.label, score: primarySourceRatioEval.score };
  categoryScores.credibility.push(primarySourceRatioEval.score);

  // 2. Evaluate Readability
  const fleschKincaidEval = evaluateMetric(rawMetrics.readability.fleschKincaidLevel, METRIC_THRESHOLDS.fleschKincaidLevel);
  breakdown.readability.fleschKincaidLevel = { value: rawMetrics.readability.fleschKincaidLevel.toFixed(1), category: fleschKincaidEval.label, score: fleschKincaidEval.score };
  categoryScores.readability.push(fleschKincaidEval.score);

  const passiveVoiceEval = evaluateMetric(rawMetrics.readability.passiveVoicePercentage, METRIC_THRESHOLDS.passiveVoicePercentage);
  breakdown.readability.passiveVoicePercentage = { value: `${rawMetrics.readability.passiveVoicePercentage.toFixed(1)}%`, category: passiveVoiceEval.label, score: passiveVoiceEval.score };
  categoryScores.readability.push(passiveVoiceEval.score);

  // 3. Evaluate Bias & Sentiment
  const subjectivityEval = evaluateMetric(rawMetrics.biasAndSentiment.subjectivityPercentage, METRIC_THRESHOLDS.subjectivityPercentage);
  breakdown.biasAndSentiment.subjectivityPercentage = { value: `${rawMetrics.biasAndSentiment.subjectivityPercentage.toFixed(0)}%`, category: subjectivityEval.label, score: subjectivityEval.score };
  categoryScores.biasAndSentiment.push(subjectivityEval.score);

  const overallSentimentAbsEval = evaluateMetric(Math.abs(rawMetrics.biasAndSentiment.overallSentiment), METRIC_THRESHOLDS.overallSentimentAbs);
  breakdown.biasAndSentiment.overallSentiment = { value: rawMetrics.biasAndSentiment.overallSentiment.toFixed(2), category: overallSentimentAbsEval.label, score: overallSentimentAbsEval.score };
  categoryScores.biasAndSentiment.push(overallSentimentAbsEval.score);

  // 4. Evaluate Lifecycle & Compliance
  const hasDisclosuresEval = evaluateMetric(rawMetrics.lifecycleAndCompliance.hasDisclosures ? 1 : 0, METRIC_THRESHOLDS.hasDisclosures);
  breakdown.lifecycleAndCompliance.hasDisclosures = { value: rawMetrics.lifecycleAndCompliance.hasDisclosures, category: hasDisclosuresEval.label, score: hasDisclosuresEval.score };
  categoryScores.lifecycleAndCompliance.push(hasDisclosuresEval.score);

  // 5. Evaluate SEO & Accessibility
  const altTextEval = evaluateMetric(rawMetrics.seoAndAccessibility.altTextCoverage, METRIC_THRESHOLDS.altTextCoverage);
  breakdown.seoAndAccessibility.altTextCoverage = { value: `${rawMetrics.seoAndAccessibility.altTextCoverage.toFixed(0)}%`, category: altTextEval.label, score: altTextEval.score };
  categoryScores.seoAndAccessibility.push(altTextEval.score);
  
  // Calculate average scores for main categories
  const avgCategoryScores: { [key: string]: number } = {};
  for (const category in categoryScores) {
    const scores = categoryScores[category];
    if (scores.length > 0) {
      avgCategoryScores[category] = scores.reduce((a, b) => a + b, 0) / scores.length;
    } else {
      avgCategoryScores[category] = 3; // Default to Medium if no metrics
    }
  }

  // Calculate final weighted score
  let totalWeightedScore = 0;
  let totalWeight = 0;
  for (const category in avgCategoryScores) {
    const weight = METRIC_WEIGHTS[category as keyof typeof METRIC_WEIGHTS] || 1;
    totalWeightedScore += avgCategoryScores[category] * weight;
    totalWeight += weight;
  }
  const finalScore = (totalWeight > 0) ? (totalWeightedScore / totalWeight) : 3;

  // Determine final category label
  let finalCategory: MetricEvaluationCategory | 'Mesatare' = 'Mesatare';
  if (finalScore >= 3.5) finalCategory = 'E Lartë';
  else if (finalScore >= 2.5) finalCategory = 'Mesatare';
  else if (finalScore >= 1.5) finalCategory = 'Mesatare e Ulët';
  else finalCategory = 'E Ulët';

  return {
    overallScore: finalScore.toFixed(2),
    overallCategory: finalCategory,
    breakdown,
  };
}

// --- PREVIOUS FUNCTIONS TO KEEP ---

const analyzeSentiment = (text: string): { overall: number; subjectivity: number } => {
  const positiveWords = ['përparim', 'sukses', 'rritje', 'mirë', 'reformë', 'mbështetje', 'zgjidhje', 'përfitime', 'premtuese', 'forcim', 'përmirësim'];
  const negativeWords = ['korrupsion', 'shantazh', 'toksik', 'pengesë', 'problem', 'frikë', 'pasiguri', 'ryshfet', 'dëm', 'skandal', 'akuzë', 'krim', 'dobësi', 'dështim', 'shkelje'];
  
  const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
  let positiveScore = 0;
  let negativeScore = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) positiveScore++;
    if (negativeWords.includes(word)) negativeScore++;
  });
  
  const totalSentimentWords = positiveScore + negativeScore;
  if (totalSentimentWords === 0) return { overall: 0, subjectivity: 0.1 };

  const overall = (positiveScore - negativeScore) / totalSentimentWords;
  const subjectivity = Math.min(1, (totalSentimentWords / words.length) * 5);
  
  return { overall: parseFloat(overall.toFixed(2)), subjectivity: parseFloat(subjectivity.toFixed(2)) };
};

export const calculateArticleMetrics = (
  articleText: string,
  meta: { url: string; published_at: string; article_id: string; },
  sources: SourceWithCredibility[],
  config?: { researchHours?: number; focusKeyword?: string; claimsTotal?: number; claimsVerified?: number; primarySourceRatio?: number; }
): ArticleMetrics => {
  const sentiment = analyzeSentiment(articleText);

  return {
    credibility: {
      totalClaims: config?.claimsTotal || 15,
      verifiedClaims: config?.claimsVerified || 13,
      totalSources: sources.length,
      primarySourceRatio: (config?.primarySourceRatio || 0.6) * 100,
    },
    readability: {
      avgSentenceLength: 24.1,
      fleschKincaidLevel: 12.5,
      passiveVoicePercentage: 7.5,
    },
    biasAndSentiment: {
      overallSentiment: sentiment.overall,
      subjectivityPercentage: sentiment.subjectivity * 100,
    },
    lifecycleAndCompliance: {
      lastUpdated: meta.published_at,
      changeCount: 0,
      estimatedWorkHours: config?.researchHours || 0,
      isSponsored: false,
      hasDisclosures: true,
      isGdpdCompliant: true,
    },
    seoAndAccessibility: {
      focusKeyword: config?.focusKeyword || "Analizë",
      internalLinks: 3,
      externalLinks: sources.length,
      altTextCoverage: 100,
    },
  };
};

export const calculateArticleIntegrityProfile = (metrics: ArticleMetrics): ArticleIntegrityProfileData => {
  const verifiedRatio = metrics.credibility.totalClaims > 0 ? (metrics.credibility.verifiedClaims / metrics.credibility.totalClaims) : 0;
  const sourceScore = Math.min(1, (metrics.credibility.totalSources + metrics.seoAndAccessibility.externalLinks) / 15);
  const disclosureScore = metrics.lifecycleAndCompliance.hasDisclosures ? 1 : 0.5;
  const sponsorshipPenalty = metrics.lifecycleAndCompliance.isSponsored ? 0.75 : 1;
  const structuralTrustworthinessScore = Math.round(
    ((verifiedRatio * 0.4) + (sourceScore * 0.4) + (disclosureScore * 0.2)) * 100 * sponsorshipPenalty
  );

  const readabilityScore = Math.max(0, 100 - ((metrics.readability.fleschKincaidLevel - 8) * 5) - (metrics.readability.passiveVoicePercentage * 2));
  const objectivityScore = (1 - Math.abs(metrics.biasAndSentiment.overallSentiment)) * (100 - metrics.biasAndSentiment.subjectivityPercentage) / 100;
  const structureScore = Math.min(100, (metrics.seoAndAccessibility.internalLinks * 10) + metrics.seoAndAccessibility.altTextCoverage);
  const logicalCoherenceScore = Math.round(
    (readabilityScore * 0.4) + (objectivityScore * 0.4) + (structureScore * 0.2)
  );

  const isTrustworthy = structuralTrustworthinessScore >= 50;
  const isCoherent = logicalCoherenceScore >= 60;
  let quadrant: 1 | 2 | 3 | 4;
  let statusLabel: string;
  let clinicalSummary: string;

  if (isTrustworthy && isCoherent) {
    quadrant = 4; statusLabel = "Analizë me Integritet të Lartë";
    clinicalSummary = `Ky artikull demonstron integritet të lartë konceptual...`;
  } else if (!isTrustworthy && isCoherent) {
    quadrant = 2; statusLabel = "Opinion i Pabazuar";
    clinicalSummary = `Artikulli është i shkruar mirë dhe logjikisht koherent...`;
  } else if (isTrustworthy && !isCoherent) {
    quadrant = 3; statusLabel = "Material i Papërpunuar";
    clinicalSummary = `Përmbajtja është strukturalisht e besueshme...`;
  } else {
    quadrant = 1; statusLabel = "Përmbajtje me Rrezik të Lartë";
    clinicalSummary = `Ky artikull paraqet rrezik të lartë...`;
  }

  return { structuralTrustworthinessScore, logicalCoherenceScore, quadrant, statusLabel, clinicalSummary };
};