import React from 'react';
import { MaragonDimensionScores } from '../types';
import { publishedBand } from '../utils/maragonBandsOnly';
import { MaragonBandChip } from './maragon/MaragonBandChip';

/**
 * MARAGON® dimension summary — bands only (v1.0 §10). Numbers are never rendered, including as bar widths.
 * `gateOpen` must come from the caller's publication gate; without it every dimension reads "Pa vlerësim".
 */
export const MaragonSummaryDisplay: React.FC<{ scores: MaragonDimensionScores; gateOpen: boolean }> = ({ scores, gateOpen }) => (
  <div className="space-y-3">
    <MaragonBandChip label="Readiness (Gatishmëria)" band={publishedBand(gateOpen, scores?.Readiness)} />
    <MaragonBandChip label="Aptitude (Aftësia)" band={publishedBand(gateOpen, scores?.Aptitude)} />
    <MaragonBandChip label="Governance (Qeverisja)" band={publishedBand(gateOpen, scores?.Governance)} />
    <MaragonBandChip label="Oversight Nurturing (Kujdesi Mbikëqyrës)" band={publishedBand(gateOpen, scores?.OversightNurturing)} />
  </div>
);
