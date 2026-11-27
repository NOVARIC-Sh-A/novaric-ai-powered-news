/**
 * Public display of MARAGON® draft scoring.
 *
 * 'draft-values' — show each draft number with the DRAFT label.
 * 'bands-only' — band names only. The build drops draft numbers from the
 * client bundle, and the API omits them.
 *
 * Swap this one constant, then rebuild. Do not change methodology flags here.
 */
export type MaragonPublicDisplay = 'draft-values' | 'bands-only';

export const MARAGON_PUBLIC_DISPLAY: MaragonPublicDisplay = 'draft-values';
