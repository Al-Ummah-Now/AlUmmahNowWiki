[← Home](../README.md)

# AlUmmahNowCMS

[Repository](https://github.com/Al-Ummah-Now/AlUmmahNowCMS) · default branch `main`

## Purpose

The staff-only content admin for `www`, at `cms.alummahnow.net`. It also exposes the public read API that [AlUmmahNowUI](AlUmmahNowUI.md) consumes.

Sign-in is SSO only. Super Admin and Admin map to bknd `admin`. Moderator maps to bknd `editor`. Everyone else gets a 403 page.

## Tech stack

[bknd](https://bknd.io) 0.21 in code mode on a Cloudflare Worker, wrapped by a small Hono app. Cloudflare D1 and R2. Vitest and Playwright.

## Layout

| Path | What it is |
|---|---|
| [`src/schema.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/src/schema.ts) | Content model, defined only in code |
| [`src/routes`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/tree/main/src/routes) | Hono routes |
| [`src/lib`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/tree/main/src/lib) | Helpers |
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
```

To change the content model, edit `src/schema.ts` (adding only), run `npm run check:schema`, and save the SQL it prints as the next migration. See the [README](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/README.md#changing-the-content-model).

## Deployment

| Workflow | Runs on | Does |
|---|---|---|
| [`ci.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/.github/workflows/ci.yml) | PRs and pushes | Lint, types, tests, schema and migration checks, bundles |
| [`deploy-qa.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/.github/workflows/deploy-qa.yml) | Push to `main` | Migrates and deploys QA, smoke, E2E |
| [`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/.github/workflows/release.yml) | `vYYYY.MM.DD` tag on `main`, or manual | Tag: stage → production. Manual: stage only |
| [`rollback.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/.github/workflows/rollback.yml) | Manual | Rollback |

See [Release process](../guides/release-process.md).

## Key docs

[README](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/README.md) · [ARCHITECTURE.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/ARCHITECTURE.md) · [Spec](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/SPEC.md) · [Plan](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/PLAN.md) · [Public API](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/PUBLIC_API.md) · [CONTRIBUTING.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/CONTRIBUTING.md) · [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/SECURITY.md)

## Owners and contacts

No individual owners are named. Security reports go through private vulnerability reporting.

## Current state (2026-11-09)

7 open issues, 6 labelled `queue`. One open PR: SSO prompt handling and account chooser ([#20](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/20)).

Queue: AI writing assist ([#17](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/17)), retire the unused `bknd` Worker name ([#11](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/11)), image variants ([#10](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/10)), draft preview ([#9](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/9)), revisions ([#8](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/8)), scheduled publishing ([#7](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/7)).

Recently merged: CMS v1 ([#12](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/12)), tag-based release ([#16](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/16)).

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
| [CMS page builder (blocks) and card posts](../epics/CMS-PAGE-BLOCKS-cms-page-blocks.md) | in progress |
| [www home timeline (CMS-managed feed)](../epics/CMS-HOME-TIMELINE-www-home-timeline.md) | shipped |
| [Release pipeline, tagged releases and skew protection](../epics/AUN-RELEASE-release-pipeline-skew.md) | shipped |
| [Security audit of the public repos](../epics/CHAT-SECURITY-public-repo-security.md) | shipped |
| [Single sign-on everywhere and sign-out ends SSO](../epics/CHAT-SSO-sso-everywhere.md) | shipped |
