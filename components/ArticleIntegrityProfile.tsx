import React from 'react';
import { IntegrityMatrix, MetricDetail, LethePoint, MetricDetailItem } from './IntegrityMatrix';
import { ArticleIntegrityProfileData, ArticleMetrics } from '../types';

interface Props {
  aipData: ArticleIntegrityProfileData;
  metrics?: ArticleMetrics; // Added metrics for detailed breakdown
}

export const ArticleIntegrityProfile: React.FC<Props> = ({ aipData, metrics }) => {
  
  // 1. Map Detailed Metrics from raw ArticleMetrics if available
  const detailedMetrics: MetricDetail[] = metrics ? [
    {
      category: "Besueshmëria (Credibility)",
      metricId: "metric:credibility",
      score: Math.round((metrics.credibility.verifiedClaims / (metrics.credibility.totalClaims || 1)) * 100),
      items: [
        { 
          label: "Pretendime të Verifikuara", 
          value: `${metrics.credibility.verifiedClaims}/${metrics.credibility.totalClaims}`, 
          status: (metrics.credibility.verifiedClaims / (metrics.credibility.totalClaims || 1)) > 0.7 ? "Good" : "Average" 
        },
        { 
          label: "Burime Parësore", 
          value: `${Math.round(metrics.credibility.primarySourceRatio)}%`, 
          status: metrics.credibility.primarySourceRatio > 50 ? "Good" : "Average" 
        },
        { 
          label: "Burime Totale", 
          value: metrics.credibility.totalSources.toString(), 
          status: metrics.credibility.totalSources >= 5 ? "Good" : "Average" 
        }
      ] as MetricDetailItem[]
    },
    {
      category: "Lexueshmëria (Readability)",
      metricId: "metric:readability",
      score: Math.max(0, Math.min(100, 100 - (metrics.readability.fleschKincaidLevel - 8) * 10)),
      items: [
        { 
          label: "Niveli Flesch-Kincaid", 
          value: metrics.readability.fleschKincaidLevel.toFixed(1), 
          status: metrics.readability.fleschKincaidLevel < 12 ? "Good" : "Average" 
        },
        { 
          label: "Zëri Pasiv", 
          value: `${metrics.readability.passiveVoicePercentage.toFixed(1)}%`, 
          status: metrics.readability.passiveVoicePercentage < 15 ? "Good" : "Average" 
        }
      ] as MetricDetailItem[]
    },
    {
      category: "Anshmëria & Sentimenti",
      metricId: "metric:bias_sentiment",
      score: Math.round((1 - Math.abs(metrics.biasAndSentiment.overallSentiment)) * 100),
      items: [
        { 
          label: "Subjektiviteti", 
          value: `${Math.round(metrics.biasAndSentiment.subjectivityPercentage)}%`, 
          status: metrics.biasAndSentiment.subjectivityPercentage < 30 ? "Good" : "Average" 
        },
        { 
          label: "Sentimenti", 
          value: metrics.biasAndSentiment.overallSentiment.toFixed(2), 
          status: Math.abs(metrics.biasAndSentiment.overallSentiment) < 0.3 ? "Good" : "Average" 
        }
      ] as MetricDetailItem[]
    },
    ...(metrics.seoAndAccessibility ? [{
      category: "SEO & Aksesueshmëria",
      metricId: "metric:seo_accessibility",
      score: Math.round(metrics.seoAndAccessibility.internalLinks > 0 ? 95 : 85),
      items: [
        {
          label: "Lidhje të Brendshme",
          value: String(metrics.seoAndAccessibility.internalLinks || 0),
          status: (metrics.seoAndAccessibility.internalLinks || 0) >= 3 ? "Good" : "Average"
        },
        {
          label: "Mbulimi me Alt Text",
          value: `${Math.round(metrics.seoAndAccessibility.altTextCoverage || 0)}%`,
          status: (metrics.seoAndAccessibility.altTextCoverage || 0) >= 80 ? "Good" : "Average"
        }
      ] as MetricDetailItem[]
    }] : [])
  ] : [];

  // 2. Map Lethe (Omission) points if available (placeholder logic if not in types yet)
  const letheData: LethePoint[] = [];

  const matrixData = {
    context: "Media" as const,
    // Convert 0-100 structural score to 0-10
    score: Number((aipData.structuralTrustworthinessScore / 10).toFixed(1)), 
    summary: aipData.clinicalSummary || "Analizë e integritetit bazuar në metodologjinë NER.",
    originSteps: [
      { label: "Burimi", active: true, isCurrent: false },
      { label: "Procesimi", active: true, isCurrent: false },
      { label: "Auditimi", active: true, isCurrent: true }
    ],
    // Map logical coherence to CSR Spectrum
    csrValue: Math.max(0, Math.min(100, 100 - aipData.logicalCoherenceScore)), 
    letheData: letheData,
    detailedMetrics: detailedMetrics
  };

  return (
    <section className="my-8">
      <IntegrityMatrix 
        context={matrixData.context}
        score={matrixData.score}
        summary={matrixData.summary}
        originSteps={matrixData.originSteps}
        csrValue={matrixData.csrValue}
        letheData={matrixData.letheData}
        detailedMetrics={matrixData.detailedMetrics}
      />
    </section>
  );
};