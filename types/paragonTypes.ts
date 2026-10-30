
export interface ParagonScore {
  politician_id: number;
  overall_score: number;
  calculated_at: string;
  politicians: {
    id: number;
    name: string;
    image_url?: string;
  };
  // Optional properties for component compatibility
  dimension_scores?: Record<string, { score: number }>;
}

export interface ParagonTrendEntry {
  politician_id: number;
  overall_score: number;
  calculated_at: string;
  politicians: {
    name: string;
  };
  // Optional properties for component compatibility
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
  latestScores: ParagonScore[];
  topRisers: ParagonDeltaResult[];
  topFallers: ParagonDeltaResult[];
  recentTrends: ParagonTrendEntry[];
}
