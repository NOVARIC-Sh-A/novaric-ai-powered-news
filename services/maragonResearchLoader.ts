import researchJson from '../data/maragon/vip_m1.research.json';
import { MaragonResearchPayload, MaragonResearchPayloadSchema } from '../lib/maragon-schemas';

const parsed = MaragonResearchPayloadSchema.safeParse(researchJson);
if (!parsed.success) {
  throw new Error(`MARAGON research payload failed validation: ${parsed.error.message}`);
}

const RESEARCH_BY_ID: Record<string, MaragonResearchPayload> = {
  [parsed.data.subject.id]: parsed.data,
};

export function getMaragonResearch(id: string | number | null | undefined): MaragonResearchPayload | null {
  if (id == null) return null;
  return RESEARCH_BY_ID[String(id)] ?? null;
}

export function validatedMaragonResearch(): MaragonResearchPayload {
  return parsed.data;
}
