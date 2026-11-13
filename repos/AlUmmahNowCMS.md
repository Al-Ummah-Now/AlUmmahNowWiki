[← Home](../README.md)

# AlUmmahNowCMS

[Repository](https://github.com/Al-Ummah-Now/AlUmmahNowCMS) · default branch `main`

## Purpose

The staff-only content admin for `www`, at `cms.alummahnow.net`. It also exposes the public read API that [AlUmmahNowUI](AlUmmahNowUI.md) consumes.

Sign-in is SSO only. Super Admin and Admin map to bknd `admin`. Moderator maps to bknd `editor` (all content, the timeline and featuring, but no deletes or settings). Scholar maps to `writer`, who sees and edits only their own posts ([`docs/SCHOLARS.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/SCHOLARS.md)). Everyone else gets a 403 page. See [`src/lib/roles.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/src/lib/roles.ts).

What staff do here:

- Write pages and posts in English and Arabic: pages from blocks, card posts with slides, scheduled publishing, revisions with diff and restore, draft preview links for www.
- Manage the www home timeline, which the CMS publishes to Workers KV ([`docs/FEED.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/FEED.md)), and list pages: curated lists and filter pages over the CMS video library ([`docs/specs/WWW-PAGES.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/specs/WWW-PAGES.md)).
- Get AI help that only suggests: translation, SEO copy and a pre-publish check. Translations can be flagged by selection and fixed against a glossary ([`docs/TRANSLATION_FLAGS.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/TRANSLATION_FLAGS.md)).
- Delete safely: deletes are soft, restorable from the Recently deleted screen for 30 days, then purged by a scheduled cleanup. An admin can promote an item to permanent deletion sooner ([`docs/SOFT_DELETE.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/SOFT_DELETE.md)). Destructive actions ask in an in-app dialog, never a browser prompt.

Post and page addresses are generated from the title. An Arabic title gets a short English address: the linked English title first, then an AI translation, then transliteration as the fallback. Names follow the platform rule: display name, else first and last name, else email.

## Tech stack

[bknd](https://bknd.io) 0.21 in code mode on a Cloudflare Worker, wrapped by a Hono app. bknd keeps storage, the data API and permissions. Its admin UI is retired: staff use our own server-rendered screens in [`src/admin`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/tree/main/src/admin) ([`docs/ADMIN_UI_SPEC.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/ADMIN_UI_SPEC.md)). Cloudflare D1, R2, KV, Queues and Workers AI. Vitest and Playwright.

The admin follows the site theme the admin sets in the videos admin (Fawanees if the read fails). Light, Dark and System are per viewer. Fanous tokens are vendored by `npm run sync:fanous` and pinned in [`fanous.lock.json`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/fanous.lock.json).

## Layout

| Path | What it is |
|---|---|
| [`src/schema.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/src/schema.ts) | Content model, defined only in code |
| [`src/routes`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/tree/main/src/routes) | Hono routes: SSO, public API, preview, picker, scholars, release |
| [`src/admin`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/tree/main/src/admin) | Staff screens and their APIs |
| [`src/lib`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/tree/main/src/lib) | Feed, blocks, image variants, AI assist, search, trash, translation flags, helpers |
| [`migrations`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/tree/main/migrations) | D1 migrations, expand-only |
| [`scripts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/tree/main/scripts) | Release and check scripts |
| [`e2e`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/tree/main/e2e) and [`test`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/tree/main/test) | Playwright and Workers-runtime tests |

## Run and test locally

```sh
npm ci
cp .dev.vars.example .dev.vars
npm run db:migrate:local
npm run dev            # http://localhost:8585
npm run lint && npm run typecheck && npm test
npm run check:schema && npm run check:migrations && npm run check:config
npm run check:fanous && npm run check:feed-format
```

`npm run check` runs the whole set. A change to the shape of a home timeline item must bump `FEED_FORMAT`; the feed then rebuilds itself on the next deploy ([`docs/FEED.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/FEED.md)).

To change the content model, edit `src/schema.ts` (adding only), run `npm run check:schema`, and save the SQL it prints as the next migration. See the [README](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/README.md#changing-the-content-model).

## Deployment

| Workflow | Runs on | Does |
|---|---|---|
| [`ci.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/.github/workflows/ci.yml) | PRs and pushes | Lint, types, tests, schema and migration checks, bundles |
| [`deploy-qa.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/.github/workflows/deploy-qa.yml) | Push to `main` | Migrates and deploys QA, smoke, then calls `e2e-qa.yml` |
| [`e2e-qa.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/.github/workflows/e2e-qa.yml) | Called after a QA deploy, or manual | Playwright against QA; optional screen gallery in every theme |
| [`committed-secrets.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/.github/workflows/committed-secrets.yml) | PRs and pushes to `main` | Fails if the repo would publish a secret |
| [`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/.github/workflows/release.yml) | `vYYYY.MM.DD` tag on `main`, or manual | Tag: stage → production. Manual: stage only |
| [`rollback.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/.github/workflows/rollback.yml) | Manual | Rollback |

A candidate version must answer `/healthz` three times in a row before the smoke runs ([#49](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/49)). Stage and production promotes register queue consumers themselves, because `versions upload` doesn't. QA and stage don't keep the per-request log line ([#94](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/94)). See [Release process](../guides/release-process.md).

## Key docs

[README](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/README.md) · [ARCHITECTURE.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/ARCHITECTURE.md) · [Spec](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/SPEC.md) · [Plan](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/PLAN.md) · [Public API](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/PUBLIC_API.md) · [Admin UI spec](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/ADMIN_UI_SPEC.md) · [Home feed](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/FEED.md) · [www pages](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/specs/WWW-PAGES.md) · [Scholars](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/SCHOLARS.md) · [AI assist](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/AI_ASSIST_SPEC.md) · [AI providers](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/AI_PROVIDERS.md) · [Soft delete](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/SOFT_DELETE.md) · [Translation flags](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/TRANSLATION_FLAGS.md) · [CONTRIBUTING.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/CONTRIBUTING.md) · [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/SECURITY.md)

## Owners and contacts

No individual owners are named. Security reports go through private vulnerability reporting.

## Current state (2026-11-12)

Shipped since 2026-11-09 (migrations now run to `0017`):

- Our own admin screens on bknd, and bknd's admin UI retired ([#22](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/22), [#25](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/25), [#29](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/29), [#30](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/30)). Follow-ups: in-app confirm dialogs ([#61](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/61)), live autocomplete in every search box and pickers that open with content ([#64](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/64), [#90](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/90)), spell checking ([#40](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/40)).
- Scheduled publishing ([#41](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/41)), revisions with diff and restore ([#43](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/43)), signed draft preview links ([#38](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/38)), AVIF/WebP image variants ([#42](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/42)).
- Page blocks and card posts ([#48](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/48)); summaries carry a card post's first 10 slides ([#58](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/58)).
- Home timeline published to Workers KV ([#51](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/51)), rebuilt by itself when its format changes ([#72](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/72)). www pages: curated and filter pages, the CMS video library and channels on the timeline ([#88](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/88), [#92](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/92)).
- AI writing assist ([#47](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/47)), moved to Workers AI ([#55](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/55)), with pluggable admin-configured providers and a monthly budget stop ([#65](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/65)). Translation flags and a glossary ([#93](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/93)).
- Scholar pages, the writer role, featuring and community posts ([#67](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/67)). Public search suggest and search for www ([#60](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/60)).
- Soft delete with a 30-day purge ([#63](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/63)). Arabic titles get English addresses ([#89](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/89), [#91](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/91)). Names by the display-name rule ([#96](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/96)). «المرئيات» as the Arabic plural for videos ([#97](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/97)). News renamed Articles ([#56](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/56)).
- SSO: prompt handling and account chooser ([#20](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/20)); a sign-out ends that browser's CMS session ([#68](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/68), [#81](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/81)).
- Fanous tokens synced to Fawanees light 1.1.0 ([#95](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/95)). Favicon is the owner's qalam lantern, as exact-size PNGs with no production SVG ([#70](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/70), [#86](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/86)).

Open: 11 issues and one draft PR, the shared nav contract for the header and account menu ([#99](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/99)). Issues include scholar follow-ups ([#74](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/74), [#75](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/75), [#76](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/76), [#78](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/78)), deleted videos staying on the curated home ([#77](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/77)) and E2E account work ([#80](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/80), [#83](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/83)). Three look done in code but are still open: [#45](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/45) (a key for the old Claude provider, no longer needed on Workers AI), [#46](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/46) (the monthly budget stop shipped in [#65](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/65)) and [#69](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/69) (the three-answer check shipped in [#49](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/49)).

## Epics for this repo

11 epics name this repo. The full list, including epics owned by other repos, is in [Epics](../epics/README.md).

| Epic | Status |
|---|---|
| [Epic 25: Sharing & embeddable player](../epics/E25-sharing-embeds.md) | in progress |
| [Legacy roadmap 2.2: main portal CMS backend](../epics/LR-2.2-legacy-cms-backend.md) | shipped |
| [www (Astro) + CMS (bknd) v1](../epics/CMS-WWW-V1-cms-www-v1.md) | shipped |
| [CMS: our own admin screens on top of bknd](../epics/CMS-ADMIN-UI-cms-admin-ui.md) | shipped |
| [CMS and www: post-v1 queue](../epics/CMS-QUEUE-cms-www-queue.md) | in progress |
| [CMS AI writing assist](../epics/CMS-AI-ASSIST-cms-ai-writing-assist.md) | shipped |
| [CMS page builder (blocks) and card posts](../epics/CMS-PAGE-BLOCKS-cms-page-blocks.md) | shipped |
| [www home timeline (CMS-managed feed)](../epics/CMS-HOME-TIMELINE-www-home-timeline.md) | shipped |
| [Release pipeline, tagged releases and skew protection](../epics/AUN-RELEASE-release-pipeline-skew.md) | shipped |
| [Security audit of the public repos](../epics/CHAT-SECURITY-public-repo-security.md) | shipped |
| [Single sign-on everywhere and sign-out ends SSO](../epics/CHAT-SSO-sso-everywhere.md) | shipped |
