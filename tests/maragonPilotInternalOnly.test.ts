import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const ROOT = path.resolve(import.meta.dirname, '..');
const PILOT = path.join('data', 'maragon', 'pilots');

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === 'pilots') continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.(ts|tsx|js|jsx|css|html)$/.test(name)) out.push(full);
  }
  return out;
}

test('no page, API, component or build script reads the internal pilot folder', () => {
  const hits = sourceFiles(ROOT).filter((file) => {
    if (file.endsWith(`${path.sep}maragonPilotInternalOnly.test.ts`)) return false;
    const text = readFileSync(file, 'utf8');
    return text.includes('maragon/pilots') || text.includes('seven-point-fevziu');
  });
  assert.deepEqual(hits.map((file) => path.relative(ROOT, file)), []);
  assert.equal(statSync(path.join(ROOT, PILOT, 'seven-point-fevziu-20261127')).isDirectory(), true);
});
