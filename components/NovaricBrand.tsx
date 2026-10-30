import React from 'react';

interface NovaricBrandProps {
  suffix?: string;
  className?: string;
}

/**
 * Canonical NOVARIC® Brand Mark Component
 * Adheres strictly to NOVARIC-BRAND-CONTROL-MASTER.md §6.1/§6.2:
 * - Wrapper class: .novaric-brand (inline, white-space: nowrap)
 * - Registered symbol class: .novaric-registered (font-size: 40%, vertical-align: super, margin-left: 0.10em, margin-right: 0.05em, line-height: 0)
 * - Accessibility: aria-hidden="true" on superscript
 */
export const NovaricBrand: React.FC<NovaricBrandProps> = ({ suffix = '', className = '' }) => (
  <span className={`novaric-brand ${className}`.trim()}>
    NOVARIC<sup aria-hidden="true" className="novaric-registered">®</sup>{suffix}
  </span>
);

export default NovaricBrand;
