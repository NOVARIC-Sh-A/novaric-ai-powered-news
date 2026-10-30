export type ScoreDimensionKey =
  | 'credibility'
  | 'readability'
  | 'sentiment_analytics'
  | 'lifecycle'
  | 'seo_accessibility'
  | 'logic'
  | 'ethical_resonance'
  | 'emotion';

export type StandardsSubView = 'hub' | 'kodi' | 'perputhshmeri' | 'korrigjime' | 'transparence' | 'ai';

export type StandardStatus = 'compliant' | 'in_progress' | 'verified';

export interface StandardClause {
  id: string; // e.g., "KONF-A", "MET-E", "ETIK-3.3A"
  neni: number; // 1, 2, 3, 4
  sub_neni?: string; // "3.1", "3.2", "3.3", "4.1", "4.2"
  letter: string; // "A", "B", etc.
  title: string;
  commitment_key: string;
  text: string;
  status: StandardStatus;
  status_label_sq: string;
  evidence_url: string;
  evidence_title: string;
  owner: string;
  last_verified_at: string; // ISO string
  score_dimensions: ScoreDimensionKey[];
  audit_note?: string;
  efcsn_clause_ref?: string;
  ifcn_criterion_ref?: string;
}

export interface ScoreDimensionInfo {
  key: ScoreDimensionKey;
  title: string;
  subtitle: string;
  weightLabel: string;
  governing_clause_ids: string[];
  description: string;
  measurement_metric: string;
}

export interface ComplianceSummary {
  overall_percentage: number;
  compliant_count: number;
  total_count: number;
  last_audit_at: string;
  next_audit_at: string;
  is_demo_fixture: boolean;
  per_neni_breakdown: Array<{
    neni: number;
    title: string;
    percentage: number;
    total: number;
    compliant: number;
  }>;
}

export interface CorrectionItem {
  id: string;
  article_id: string;
  article_title: string;
  type: 'Faktik' | 'Burimor' | 'Tipografik' | 'Kontekstual';
  summary: string;
  diff_url?: string;
  published_at: string;
  status: 'Zgjidhur' | 'Në Rishikim' | 'Arkivuar';
  reviewer: string;
}

export interface ComplaintSubmission {
  claim_url: string;
  description: string;
  contact_email?: string;
  complainant_email?: string;
  complainant_name?: string;
  clause_referenced?: string;
  clause_ref?: string;
}

export interface ComplaintReceipt {
  receipt_id: string;
  status: 'Pranuar' | 'Në Shqyrtim';
  created_at: string;
  sla_due_at: string;
  claim_url: string;
  message: string;
  tracking_code: string;
}

export interface AiRegistryEntry {
  id: string;
  model_name: string;
  version: string;
  provider: string;
  purpose: string;
  human_oversight_step: string;
  architecture_tier: string;
  last_updated: string;
  compliance_status: 'Përputhshmëri e Plotë' | 'Në Audit';
  capabilities: string[];
}

export interface TransparencyLedgerItem {
  id: string;
  category: 'ownership' | 'funding' | 'editorial' | 'governance';
  category_label_sq: string;
  title: string;
  description: string;
  legal_entity: string;
  evidence_name: string;
  evidence_url: string;
  document_url?: string;
  file_format?: string;
  verified_at: string;
  certifying_body: string;
}
