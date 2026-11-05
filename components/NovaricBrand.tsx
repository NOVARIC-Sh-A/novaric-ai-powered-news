import React from 'react';

interface NovaricBrandProps {
  suffix?: string;
  className?: string;
}

/**
 * Canonical NOVARIC® Brand Mark Component
 * Adheres strictly to NOVARIC-BRAND-CONTROL-MASTER.md §6.1/§6.2:
 * - Wrapper class: .novaric-brand (inline, white-space: nowrap)
 * - Registered symbol class: .registered-mark (font-size: 58%, raised to the cap height, no gap before it)
 * - Accessibility: aria-hidden="true" on superscript
 */
export const NovaricBrand: React.FC<NovaricBrandProps> = ({ suffix = '', className = '' }) => (
  <span className={`novaric-brand ${className}`.trim()}>
    NOVARIC<sup aria-hidden="true" className="registered-mark">®</sup>{suffix}
  </span>
);

export default NovaricBrand;
