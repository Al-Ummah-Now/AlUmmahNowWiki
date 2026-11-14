#!/usr/bin/env node
/**
 * Validates features/registry.json, the feature registry (features/README.md). No dependencies.
 *
 *   node scripts/check-registry.mjs [path]
 *
 * Exits 1 with one line per problem. apps/dev in AlUmmahNowUI imports `validateRegistry` from a
 * copy of these rules (apps/dev/scripts/registry.ts), so a registry that passes here builds there.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const STATUSES = ['live', 'rolling', 'building', 'planned'];
export const APPS = ['videos', 'videos-admin', 'api', 'www', 'sites', 'status', 'cms', 'auth', 'profile', 'auth-admin', 'dev', 'native'];
export const REPOS = ['AlUmmahNow', 'AlUmmahNowUI', 'AlUmmahNowCMS', 'AlUmmahNowAuth', 'openauth', 'AlUmmahNowTools', 'AlUmmahNowCore', 'AlUmmahNowApple', 'AlUmmahNowAndroid', 'AlUmmahNowDesktop'];
const TAG = /^v\d{4}\.\d{2}\.\d{2}(\.\d+)?$/;
const PR = new RegExp(`^(${REPOS.join('|')})#\\d+$`);
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Every problem in `reg`, as text; `root` is the wiki checkout (for `wiki` paths), or null to skip that check. */
export function validateRegistry(reg, root) {
  const errs = [];
  if (!reg || typeof reg !== 'object' || reg.version !== 1 || !Array.isArray(reg.features)) return ['registry: needs { "version": 1, "features": [...] }'];
  const seen = new Set();
  for (const [i, f] of reg.features.entries()) {
    const at = `features[${i}]${f && f.id ? ` (${f.id})` : ''}`;
    if (!f || typeof f !== 'object') { errs.push(`${at}: not an object`); continue; }
    const known = ['id', 'name', 'status', 'apps', 'wiki', 'release', 'prs', 'note'];
    for (const k of Object.keys(f)) if (!known.includes(k)) errs.push(`${at}: unknown field "${k}"`);
    if (typeof f.id !== 'string' || !ID.test(f.id)) errs.push(`${at}: id must be kebab-case`);
    else if (seen.has(f.id)) errs.push(`${at}: duplicate id`);
    else seen.add(f.id);
    for (const l of ['en', 'ar']) if (typeof f.name?.[l] !== 'string' || !f.name[l].trim()) errs.push(`${at}: name.${l} is required`);
    // Arabic glossary: «مرئي / مرئيات» for video, never «فيديو»
    if (typeof f.name?.ar === 'string' && /فيديو/.test(f.name.ar)) errs.push(`${at}: name.ar uses «فيديو»; the glossary word is «مرئي / مرئيات»`);
    if (!STATUSES.includes(f.status)) errs.push(`${at}: status must be one of ${STATUSES.join(', ')}`);
    if (!Array.isArray(f.apps) || !f.apps.length || f.apps.some((a) => !APPS.includes(a))) errs.push(`${at}: apps must be a non-empty list of ${APPS.join(', ')}`);
    if (typeof f.wiki !== 'string' || !/^(epics|guides|repos)\/[\w./#-]+$/.test(f.wiki)) errs.push(`${at}: wiki must be a wiki page path such as epics/E10-….md`);
    else if (root && !existsSync(resolve(root, f.wiki.split('#')[0]))) errs.push(`${at}: wiki page ${f.wiki} does not exist`);
    if (f.prs !== undefined && (!Array.isArray(f.prs) || f.prs.some((p) => typeof p !== 'string' || !PR.test(p)))) errs.push(`${at}: prs must look like AlUmmahNow#123`);
    if (f.note !== undefined && (typeof f.note !== 'string' || !f.note.trim())) errs.push(`${at}: note must be text`);
    const r = f.release;
    if (r !== undefined && r !== null) {
      if (!REPOS.includes(r.repo)) errs.push(`${at}: release.repo must be one of the repos`);
      const kinds = [r.tag !== undefined, r.run !== undefined, r.before !== undefined].filter(Boolean).length;
      if (kinds !== 1) errs.push(`${at}: release needs exactly one of tag, run (with sha) or before`);
      if (r.tag !== undefined && !TAG.test(r.tag)) errs.push(`${at}: release.tag must look like v2026.11.14 or v2026.11.14.2`);
      if (r.run !== undefined && (!Number.isInteger(r.run) || typeof r.sha !== 'string' || !/^[0-9a-f]{7,40}$/.test(r.sha))) errs.push(`${at}: release.run needs an integer run id and a commit sha`);
      if (r.before !== undefined && !TAG.test(r.before)) errs.push(`${at}: release.before is the repo's first tag, such as v2026.11.06`);
    }
    if (f.status === 'live' && !r) errs.push(`${at}: live needs the release it shipped in`);
    if (f.status !== 'live' && r) errs.push(`${at}: only live features have a release (it is the production release it shipped in)`);
    if ((f.status === 'rolling' || f.status === 'building') && !f.prs?.length) errs.push(`${at}: ${f.status} needs the PRs`);
  }
  return errs;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const file = resolve(process.argv[2] ?? resolve(root, 'features/registry.json'));
  let reg;
  try {
    reg = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`${file}: ${e.message}`);
    process.exit(1);
  }
  const errs = validateRegistry(reg, root);
  for (const e of errs) console.error(`::error file=features/registry.json::${e}`);
  if (errs.length) process.exit(1);
  const by = Object.fromEntries(STATUSES.map((s) => [s, reg.features.filter((f) => f.status === s).length]));
  console.log(`registry OK: ${reg.features.length} features (${STATUSES.map((s) => `${s} ${by[s]}`).join(', ')})`);
}
