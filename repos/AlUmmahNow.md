[← Home](../README.md)

# AlUmmahNow

[Repository](https://github.com/Al-Ummah-Now/AlUmmahNow) · default branch `main`

## Purpose

The monorepo for the videos product: the viewer site, its APIs, background processing, realtime delivery, scheduled publishing and the staff admin site.

## Tech stack

- Turborepo with pnpm workspaces, TypeScript
- `web` and `admin-web`: Next.js 16 on Cloudflare Workers through OpenNext
- `api-videos` and `admin-api`: Hono, with OpenAPI 3.1 through chanfana on `api-videos`
- Cloudflare R2, D1, KV, Queues, Durable Objects and Workers AI
- Bunny.net for video streaming and image storage

The root [README](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/README.md) still says Next.js 15. `apps/web/package.json` is on 16.

## Layout

| Path | What it is | Cloudflare resources (production config) |
|---|---|---|
| [`apps/web`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/apps/web) | Viewer site, `/en/*` and `/ar/*` | R2 |
| [`apps/api-videos`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/apps/api-videos) | Videos API | R2, D1, KV, queue producers, cron |
| [`apps/processor`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/apps/processor) | Queue consumer, including AI moderation | R2, D1, queues, Workers AI, cron |
| [`apps/websocket-server`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/apps/websocket-server) | Realtime messaging | Durable Objects, KV |
| [`apps/admin-api`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/apps/admin-api) | Staff API | D1, R2, KV, queue producer |
| [`apps/admin-web`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/apps/admin-web) | Staff site | None bound directly |
| [`apps/scheduler`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/apps/scheduler) | Per-minute cron for scheduled publishing | R2, KV, Durable Objects, queue producer |
| [`apps/log-service`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/apps/log-service) | Local log aggregator, never deployed | None |
| [`packages/shared-types`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/packages/shared-types) | Shared TypeScript types | |
| [`packages/logger`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/packages/logger) | Shared logging | |
| [`packages/fanous-tokens`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/packages/fanous-tokens) | Design tokens and per-platform generators | |
| [`packages/mcp-log-server`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/packages/mcp-log-server) | MCP server for watching logs | |
| [`scripts/release`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/scripts/release) | Release gates, promote, rollback, smoke | |

## Run and test locally

Needs Node and pnpm 9.15.4. CI uses Node 22, and the release scripts run on plain Node 22.

```sh
pnpm install
pnpm --filter @al-ummah/shared-types build
pnpm --filter @al-ummah/logger build
pnpm dev            # all apps; or pnpm web:dev, pnpm api:dev, pnpm processor:dev, pnpm websocket:dev
pnpm type-check
pnpm lint
pnpm test
```

Default ports from the README: web 3001, api-videos 3086, websocket 3087, processor 3088, log-service 3089.

The checks CI requires, such as `pnpm check:config`, `pnpm check:migrations`, `pnpm check:schema`, `pnpm check:tokens` and `pnpm test:scripts`, are listed in [CLAUDE.md, "Release gates"](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/CLAUDE.md#release-gates).

## Deployment

| Workflow | Runs on | Does |
|---|---|---|
| [`deploy.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/deploy.yml) | PRs, pushes to `main` | Tests, release checks and builds. Push to `main` deploys QA |
| [`release-e2e.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/release-e2e.yml) | PRs and releases | Release regression E2E suite |
| [`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/release.yml) | `v*` tag on `main`, or manual | Tag: stage → stage E2E → production. Manual run on `main`: stage only |
| [`rollback.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/rollback.yml) | Manual | Rolls back stage or production |

See [Release process](../guides/release-process.md).

## Key docs

Many of the 472 files under `docs/` are old. `docs/archive/` and `docs/legacy/` are historical, and several older index pages describe an earlier version of the system. Start with these:

- [CLAUDE.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/CLAUDE.md): current architecture, deploy rules and standards
- [BEFORE_YOU_CODE.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/BEFORE_YOU_CODE.md): required development process
- [CONTRIBUTING.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/CONTRIBUTING.md)
- [Release pipeline spec](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/release-pipeline/SPEC.md) and [plan](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/release-pipeline/PLAN.md)
- [PRD](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/PRD.md), [epics 1–8](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/epics.md), [native epics](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/native-apps/EPICS.md)
- [Specs index](../guides/specs-index.md)
- [Themes](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/design/THEMES.md)
- [Architecture decision records](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/docs/adr)
- [GDPR notes](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/compliance/GDPR.md)
- [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/SECURITY.md)

## Owners and contacts

The repo doesn't name individual owners and has no CODEOWNERS file. Security reports go through private vulnerability reporting.

## Current state (2026-11-09)

181 open issues, 131 labelled `queue`. 50 open PRs. Latest release tag: `v2026.11.08.5`.

Active work includes the site-wide theme ([#492](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/492), on hold for the owner), Creator Studio ([#476](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/476), [#482](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/482), [#484](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/484)), the production video player spec ([#472](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/472)), channel roles ([#462](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/462)) and plans and entitlements ([#390](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/390), [#428](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/428), [#429](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/429)).

Examples from the queue: per-PR preview deploys for web E2E ([#486](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/486)), Firefox and WebKit release smoke ([#471](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/471)), short pages from `GET /api/videos` ([#451](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/451)).

Recently merged: playback resume fix ([#470](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/470)), QA E2E cleanup ([#467](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/467)), playlist thumbnails ([#466](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/466)).
