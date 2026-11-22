/**
 * Owner decision t329u: /metodologjia may refer to published standards, but may not claim membership,
 * certification, endorsement, conformity or an independent audit without evidence.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MethodologyMetrics } from '../components/methodology/MethodologyMetrics';
import { FALLBACK_AUDITS, FALLBACK_METRICS } from '../services/methodologyService';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');
const files = [
  'components/methodology/MethodologyPage.tsx',
  'components/methodology/MethodologyMetrics.tsx',
  'components/methodology/PipelineVisualizer.tsx',
  'components/methodology/TrustRibbon.tsx',
  'services/methodologyService.ts',
];

describe('/metodologjia credential claims', () => {
  it('makes no conformity, certification, membership or independent-audit claim', () => {
    for (const file of files) {
      const src = read(file);
      assert.doesNotMatch(src, /Konform|Certifikata|EFCSN & IFCN Vlerësimi|auditimit të pavarur të integritetit|auditohet/, file);
      assert.doesNotMatch(src, /AUD-MET-2026-01|Këshilli Mbikëqyrës i Pavarur|dy nënshkrime|compliance_score: 98/, file);
    }
  });

  it('keeps references to published standards labelled as references', () => {
    assert.match(read('components/methodology/MethodologyPage.tsx'), /Referencë: standardet e publikuara EFCSN & IFCN/);
  });

  it('carries no fallback audit and no audit dates', () => {
    assert.deepEqual(FALLBACK_AUDITS, []);
    assert.equal(FALLBACK_METRICS.last_audit_at, null);
    assert.equal(FALLBACK_METRICS.next_audit_at, null);
  });

  it('shows an audit record only with a published evidence link', () => {
    const seed = {
      id: 'TEST-AUDIT', audited_at: '2026-08-12T10:00:00Z', auditor: 'Test auditor', result: 'passed' as const,
      result_label_sq: 'Test', compliance_score: 50, notes: 'Test', next_audit_at: null,
    };
    const without = renderToStaticMarkup(React.createElement(MethodologyMetrics, { metrics: FALLBACK_METRICS, audits: [seed] }));
    assert.doesNotMatch(without, /TEST-AUDIT|Test auditor|50%/);
    assert.match(without, /Nuk ka auditim të publikuar/);
    assert.match(without, /nuk pretendon anëtarësim, certifikim, miratim ose auditim/);
    const withEvidence = renderToStaticMarkup(React.createElement(MethodologyMetrics, { metrics: FALLBACK_METRICS, audits: [{ ...seed, evidence_url: 'https://example.invalid/report.pdf' }] }));
    assert.match(withEvidence, /TEST-AUDIT/);
    assert.match(withEvidence, /href="https:\/\/example\.invalid\/report\.pdf"/);
  });
});
