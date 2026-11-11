import { z } from 'zod';

export const CANONICAL_MARAGON_INDICATOR_IDS = [
  'maragon:R1.1',
  'maragon:R1.2',
  'maragon:A2.1',
  'maragon:A2.2',
  'maragon:A2.3',
  'maragon:A2.4',
  'maragon:G3.1',
  'maragon:G3.2',
  'maragon:O4.1',
  'maragon:O4.2',
] as const;

export const MaragonIndicatorStatusSchema = z.enum([
  'not_assessed',
  'insufficient_evidence',
  'not_applicable',
  'assessed',
  'assessed-qualitative',
]);

/** Null, or a finite measured score. Missing stays null; 0 is allowed. */
export const MaragonNullableScoreSchema = z.union([
  z.null(),
  z.number().finite().min(0).max(100),
]);

export const MaragonEvidenceSchema = z.object({
  evidenceId: z.string().min(1),
  title: z.string().min(1),
  publisher: z.string().min(1),
  url: z.string().url().nullable().optional(),
  sourcePage: z.string().url().optional(),
  publicationDate: z.string().nullable().optional(),
  republicationDate: z.string().optional(),
  accessDate: z.string().min(1),
  excerpt: z.string(),
  observation: z.string(),
  limitations: z.string(),
}).passthrough();

export const MaragonIndicatorSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  title_sq: z.string().min(1),
  title_en: z.string().min(1),
  status: MaragonIndicatorStatusSchema,
  score: MaragonNullableScoreSchema,
  evidenceIds: z.array(z.string()),
  commentary_sq: z.string(),
  commentary_en: z.string(),
  limitations: z.string().optional(),
  missingDataReason: z.string().optional(),
  supplementary: z.boolean().optional(),
  notPartOfTenCanonicalIndicators: z.boolean().optional(),
}).passthrough();

export const MaragonResearchPayloadSchema = z.object({
  meta: z.object({
    documentId: z.string().min(1),
    schemaVersion: z.string().min(1),
    methodologyApproved: z.boolean(),
    accessDate: z.string().min(1),
  }).passthrough(),
  subject: z.object({
    id: z.string().min(1),
    fullName: z.string().min(1),
    category: z.string().min(1),
    shortBio_sq: z.string(),
    shortBio_en: z.string(),
    detailedBio_sq: z.string(),
    detailedBio_en: z.string(),
    dateOfBirth: z.string().nullable().optional(),
    age: z.number().nullable().optional(),
    zodiacSign: z.string().nullable().optional(),
  }).passthrough(),
  photo: z.object({
    photoPending: z.boolean(),
    imageUrl: z.string().nullable(),
    photoCandidates: z.array(z.object({
      imageUrl: z.string().optional(),
      reuseBasisDocumented: z.boolean().optional(),
    }).passthrough()).optional(),
  }).passthrough(),
  publication: z.object({
    biographyStatus: z.enum(['draft', 'pending_review', 'approved', 'withheld']),
    assessmentStatus: z.enum(['not_assessed', 'research_only', 'pending_review', 'approved', 'withheld', 'suspended']),
    authorizedForPublicDisplay: z.boolean(),
  }).passthrough(),
  scoring: z.object({
    scoringSuspended: z.boolean(),
    composite: MaragonNullableScoreSchema,
    averageMaragonScore: MaragonNullableScoreSchema,
    latestScore: MaragonNullableScoreSchema,
    aletheiaScore: MaragonNullableScoreSchema,
    dynamicScore: MaragonNullableScoreSchema,
  }).passthrough(),
  trajectory: z.object({
    status: z.string(),
    doNotUseLabel: z.string().optional(),
  }).passthrough(),
  sampling: z.object({
    validated: z.boolean(),
    method_sq: z.string(),
    method_en: z.string(),
    limitations: z.array(z.string()),
  }).passthrough(),
  canonicalIndicatorIdsInOrder: z.array(z.string()).length(10),
  indicators: z.array(MaragonIndicatorSchema).min(10),
  evidenceRegister: z.array(MaragonEvidenceSchema).min(1),
}).passthrough().superRefine((payload, ctx) => {
  const expected = [...CANONICAL_MARAGON_INDICATOR_IDS];
  if (payload.canonicalIndicatorIdsInOrder.join('|') !== expected.join('|')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['canonicalIndicatorIdsInOrder'],
      message: 'Canonical indicators must be the ten MARAGON ids once, in order.',
    });
  }

  const canonical = payload.indicators.filter((item) => item.id !== 'maragon:C' && !item.supplementary);
  const canonicalIds = canonical.map((item) => item.id);
  if (canonicalIds.join('|') !== expected.join('|')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['indicators'],
      message: 'The ten canonical indicators must appear exactly once, in order, before any supplementary axis.',
    });
  }
  if (new Set(canonicalIds).size !== canonicalIds.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['indicators'],
      message: 'A canonical indicator id is repeated.',
    });
  }

  const supplementary = payload.indicators.filter((item) => item.id === 'maragon:C');
  if (supplementary.length !== 1 || supplementary[0].status !== 'not_assessed' || supplementary[0].score !== null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['indicators'],
      message: 'Supplementary C must appear once, unscored, with status not_assessed.',
    });
  }

  const knownEvidence = new Set(payload.evidenceRegister.map((item) => item.evidenceId));
  if (knownEvidence.size !== payload.evidenceRegister.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['evidenceRegister'],
      message: 'Evidence ids must be unique.',
    });
  }
  payload.indicators.forEach((indicator, index) => {
    indicator.evidenceIds.forEach((evidenceId) => {
      if (!knownEvidence.has(evidenceId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['indicators', index, 'evidenceIds'],
          message: `${indicator.id} cites missing evidence ${evidenceId}.`,
        });
      }
    });
  });
});

export type MaragonResearchPayload = z.infer<typeof MaragonResearchPayloadSchema>;
