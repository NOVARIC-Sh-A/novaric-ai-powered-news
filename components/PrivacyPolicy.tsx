import React from 'react';
import { isPrivacyRevisionLive, privacyInternalPreview } from '../data/privacy/privacyPolicyRevision';
import { PrivacyPolicyLegacy20250608 } from './privacy/PrivacyPolicyLegacy20250608';
import { PrivacyPolicyRevision } from './privacy/PrivacyPolicyRevision';

/** Draft revision is fail-closed; the previous policy remains visible until a recorded release. */
export const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  isPrivacyRevisionLive() || privacyInternalPreview()
    ? <PrivacyPolicyRevision onBack={onBack} />
    : <PrivacyPolicyLegacy20250608 onBack={onBack} />
);
