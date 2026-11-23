import React from 'react';
import { isPrivacyRevisionLive, privacyInternalPreview } from '../data/privacy/privacyPolicyRevision';
import { GdprPolicyLegacy } from './privacy/GdprPolicyLegacy';
import { PrivacyPolicyRevision } from './privacy/PrivacyPolicyRevision';

/** Same corrected notice at the old GDPR route; no claim of GDPR certification. */
export const GdprPolicyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  isPrivacyRevisionLive() || privacyInternalPreview()
    ? <PrivacyPolicyRevision onBack={onBack} />
    : <GdprPolicyLegacy onBack={onBack} />
);
