// types/methodology.ts
// Data contracts for NOVARIC® Methodology & Accountability Framework (Sinergjia Hermeneutike)

export type MethodologyActorType = 'ai' | 'draft' | 'human_team';

export interface StepSubPoint {
  id: string;
  title: string;
  text: string;
}

export interface MethodologyStep {
  id: string;
  order: number;
  title: string;
  short_title: string;
  actor: MethodologyActorType;
  actor_label_sq: string;
  body_text: string;
  sub_points?: StepSubPoint[];
  inputs: string[];
  outputs: string[];
  safeguards: string[];
  failure_modes: string[];
  standards_clause_ids: string[];
  citation_keys: string[];
}

export type LegalAnchorType = 'dsa' | 'emfa' | 'internal';

export interface FrameworkPrinciple {
  id: string;
  title: string;
  body_text: string;
  legal_anchor: LegalAnchorType;
  legal_anchor_label: string;
  legal_anchor_detail: string;
  standards_ref: string;
  evidence_url: string;
  status_badge: string;
  citation_keys: string[];
}

export type ReferenceType = 'book' | 'journal' | 'report';

export interface MethodReference {
  id: string;
  key: string;
  citation: string;
  short_cite: string;
  authors: string;
  year: number;
  title: string;
  publisher_or_journal: string;
  type: ReferenceType;
  type_label_sq: string;
  usage_anchors: {
    section_id: string;
    section_title: string;
    excerpt: string;
  }[];
  external_url?: string;
}

export interface MethodologyAudit {
  id: string;
  audited_at: string;
  auditor: string;
  result: 'passed' | 'minor_observation' | 'action_required';
  result_label_sq: string;
  compliance_score: number;
  notes: string;
  next_audit_at: string | null;
}

export interface MethodologyMetricsData {
  word_count_hint: number;
  methodology_version: string;
  last_audit_at: string | null;
  next_audit_at: string | null;
  human_review_status: string;
  ai_involvement_indicator: string;
  section_count: number;
  reference_count: number;
  methodological_steps_count: number;
  principles_count: number;
}

export interface MethodologyResponse {
  steps: MethodologyStep[];
  principles: FrameworkPrinciple[];
  references: MethodReference[];
  metrics: MethodologyMetricsData;
  isFixture?: boolean;
}
