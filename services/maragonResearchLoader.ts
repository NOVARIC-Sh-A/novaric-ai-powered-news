import researchJson from '../data/maragon/vip_m1.research.json';
import gridaJson from '../data/maragon/vip_m2.research.json';
import topStoryJson from '../data/maragon/show_top_story.research.json';
import { MaragonResearchPayload, MaragonResearchPayloadSchema } from '../lib/maragon-schemas';

function parseResearch(payload: unknown, label: string): MaragonResearchPayload {
  const parsed = MaragonResearchPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(`MARAGON research payload failed validation (${label}): ${parsed.error.message}`);
  }
  return parsed.data;
}

const parsed = parseResearch(researchJson, 'vip_m1');
const grida = parseResearch(gridaJson, 'vip_m2');
const topStory = parseResearch(topStoryJson, 'show_top_story');

const RESEARCH_BY_ID: Record<string, MaragonResearchPayload> = {
  [parsed.subject.id]: parsed,
  [grida.subject.id]: grida,
  [topStory.subject.id]: topStory,
};

export function getMaragonResearch(id: string | number | null | undefined): MaragonResearchPayload | null {
  if (id == null) return null;
  return RESEARCH_BY_ID[String(id)] ?? null;
}

export function validatedMaragonResearch(): MaragonResearchPayload {
  return parsed;
}
