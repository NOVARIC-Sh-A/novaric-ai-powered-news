// lib/politician-schemas.ts
import { z } from 'zod';

export const PoliticianCardItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  numericId: z.number().optional().nullable(),
  name: z.string(),
  category: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  shortBio: z.string().optional().nullable(),
  detailedBio: z.string().optional().nullable(),
  dynamicScore: z.number().optional().nullable(),
  paragonAnalysis: z.record(z.any()).optional().nullable(),
  commentary: z.string().optional().nullable(),
  last_updated: z.string().optional().nullable(),
  // Extended fields §4
  dateOfBirth: z.string().optional().nullable(),
  placeOfBirth: z.string().optional().nullable(),
  electoralZone: z.string().optional().nullable(),
  party: z.string().optional().nullable(),
  paragonDimensions: z.array(z.number().nullable()).optional().nullable(),
  composite: z.number().optional().nullable(),
  compositeDelta: z.number().optional().nullable(),
  periodEnd: z.string().optional().nullable(),
}).passthrough();

export const PoliticianCardsResponseSchema = z.object({
  data: z.array(PoliticianCardItemSchema),
  count: z.number().optional(),
  source: z.string().optional(),
  meta: z.object({
    totalProfiles: z.number().optional(),
    activeMps: z.number().optional(),
    paragonActive: z.number().optional(),
    monitoringText: z.string().optional(),
  }).optional(),
}).passthrough();

export type ValidatedPoliticianCardItem = z.infer<typeof PoliticianCardItemSchema>;
export type ValidatedPoliticianCardsResponse = z.infer<typeof PoliticianCardsResponseSchema>;
