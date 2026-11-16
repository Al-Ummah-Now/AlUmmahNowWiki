/**
 * Tests for the feature registry rules (scripts/check-registry.mjs, features/README.md).
 *
 *   node --test scripts/check-registry.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STATUSES, validateRegistry } from './check-registry.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = { id: 'x', name: { en: 'X', ar: 'س' }, apps: ['www'], wiki: 'guides/x.md' };
const rel = { repo: 'AlUmmahNowUI', tag: 'v2026.11.14.2' };
const check = (f) => validateRegistry({ version: 1, features: [{ ...base, ...f }] }, null);

test('the checked-in registry passes', () => {
  assert.deepEqual(validateRegistry(JSON.parse(readFileSync(resolve(root, 'features/registry.json'), 'utf8')), root), []);
});

test('statuses, in the order the site lists them', () => {
  assert.deepEqual(STATUSES, ['live', 'ready', 'rolling', 'building', 'planned']);
});

test('live needs its release', () => {
  assert.deepEqual(check({ status: 'live', release: rel }), []);
  assert.match(check({ status: 'live' }).join(), /live needs the release/);
});

test('ready needs its release and a note saying what it waits for', () => {
  assert.deepEqual(check({ status: 'ready', release: rel, note: 'No production sites yet.' }), []);
  assert.match(check({ status: 'ready', note: 'No production sites yet.' }).join(), /ready needs the release/);
  assert.match(check({ status: 'ready', release: rel }).join(), /ready needs a note/);
});

test('only live and ready features have a release', () => {
  for (const status of ['rolling', 'building', 'planned']) {
    assert.match(check({ status, release: rel, prs: ['AlUmmahNowUI#1'] }).join(), /only live and ready features have a release/);
  }
});

test('rolling and building need their PRs', () => {
  assert.match(check({ status: 'rolling' }).join(), /rolling needs the PRs/);
  assert.deepEqual(check({ status: 'building', prs: ['AlUmmahNowUI#1'] }), []);
});

test('unknown status is rejected', () => {
  assert.match(check({ status: 'shipped' }).join(), /status must be one of live, ready, rolling, building, planned/);
});
