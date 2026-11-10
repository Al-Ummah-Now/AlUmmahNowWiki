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

## Epics for this repo

58 epics name this repo. The full list, including epics owned by other repos, is in [Epics](../epics/README.md).

| Epic | Status |
|---|---|
| [Epic 1: Critical accessibility & security compliance](../epics/E01-accessibility-security.md) | shipped |
| [Epic 2: Advanced video player analytics (Phase 3)](../epics/E02-player-analytics.md) | in progress |
| [Epic 3: Internationalization enhancement (Phase 2)](../epics/E03-i18n-enhancement.md) | shipped |
| [Epic 4: Phase 5 testing & migration infrastructure](../epics/E04-testing-migration.md) | in progress |
| [Epic 5: Content creator tools enhancement](../epics/E05-creator-tools.md) | in progress |
| [Epic 6: Community & moderation platform](../epics/E06-community-moderation.md) | in progress |
| [Epic 7: Content discovery enhancement](../epics/E07-content-discovery.md) | in progress |
| [Epic 8: Video content features (chapters, navigation)](../epics/E08-video-content-features.md) | in progress |
| [Epic 9: Platform foundations for native clients (backend)](../epics/E09-native-platform-foundations.md) | in progress |
| [Epic 10: Fanous design system](../epics/E10-fanous-design-system.md) | in progress |
| [Epic 17: Live in apps (watch, chat, premieres, reminders)](../epics/E17-live-in-apps.md) | planned |
| [Epic 20: Ummah Kids profiles & parental controls](../epics/E20-ummah-kids.md) | planned |
| [Epic 21: Islamic experience layer](../epics/E21-islamic-experience.md) | planned |
| [Epic 22: Notifications, sharing, study circles](../epics/E22-notifications-sharing-circles.md) | planned |
| [Epic 24: Creator support & premium](../epics/E24-creator-support-premium.md) | deferred |
| [Epic 25: Sharing & embeddable player](../epics/E25-sharing-embeds.md) | in progress |
| [Epic 26: Embedded discussions ("Ummah Comments")](../epics/E26-ummah-comments.md) | in progress |
| [Epic 27: Plans & entitlements framework](../epics/E27-plans-entitlements.md) | in progress |
| [Epic 28: AI-assisted moderation & flagging (Cloudflare Workers AI)](../epics/E28-ai-moderation.md) | in progress |
| [Epic 29: Core web experience completion (P0)](../epics/E29-core-web-experience.md) | in progress |
| [Legacy roadmap 1.1: video portal UI completion](../epics/LR-1.1-legacy-video-portal-ui.md) | shipped |
| [Legacy roadmap 1.2: API backend](../epics/LR-1.2-legacy-api-backend.md) | shipped |
| [Legacy roadmap 2.1: events processor](../epics/LR-2.1-legacy-events-processor.md) | shipped |
| [Legacy roadmap 3.1: Academy platform (LMS)](../epics/LR-3.1-legacy-academy.md) | deferred |
| [Legacy roadmap 4.1: AI chat integration](../epics/LR-4.1-legacy-ai-chat.md) | deferred |
| [Legacy roadmap 4.2: real-time messaging](../epics/LR-4.2-legacy-messaging.md) | deferred |
| [Legacy roadmap 4.3: web archive](../epics/LR-4.3-legacy-web-archive.md) | deferred |
| [api-videos roadmap Phase 1: enhanced core features](../epics/AR-1-api-roadmap-phase-1.md) | shipped |
| [api-videos roadmap Phase 2: advanced platform features](../epics/AR-2-api-roadmap-phase-2.md) | in progress |
| [api-videos roadmap Phase 3: enterprise & scale](../epics/AR-3-api-roadmap-phase-3.md) | deferred |
| [Video player enhancement plan, Phases 1–5 (`[Phase N.M]` issues)](../epics/VP-PHASES-video-player-enhancement-phases.md) | shipped |
| [Live streaming plan, Phases 1–3 (`[Phase 2] Task 2.N` issues)](../epics/LIVE-PHASES-live-streaming-phases.md) | in progress |
| [Production video player (themed, token-driven)](../epics/AUN-VIDEO-PLAYER-production-video-player.md) | in progress |
| [Channel sections (Home tab)](../epics/AUN-CHANNEL-SECTIONS-channel-sections.md) | shipped |
| [Social media management for channels](../epics/AUN-SOCIAL-social-media-management.md) | planned |
| [Web Creator Studio](../epics/AUN-CREATOR-STUDIO-web-creator-studio.md) | planned |
| [Per-channel roles](../epics/AUN-CHANNEL-ROLES-channel-roles.md) | in progress |
| [Channel claim, transfer and self-service account move](../epics/AUN-CHANNEL-CLAIM-channel-claim-transfer.md) | planned |
| [Account hub ("Al Ummah Now Account")](../epics/AUTH-ACCOUNT-HUB-account-hub.md) | in progress |
| [CMS AI writing assist](../epics/CMS-AI-ASSIST-cms-ai-writing-assist.md) | shipped |
| [Move video delivery to R2 + Cloudflare CDN](../epics/AUN-R2-MIGRATION-r2-video-migration.md) | planned |
| [Themes: Lantern, Zujaj, Nahas, Fawanees, and the theme builder](../epics/AUN-THEMES-themes.md) | in progress |
| [Release pipeline, tagged releases and skew protection](../epics/AUN-RELEASE-release-pipeline-skew.md) | shipped |
| [Cost monitoring dashboard and alerts](../epics/AUN-COST-cost-monitoring.md) | planned |
| [Scalability audit and index-backed lists](../epics/AUN-SCALABILITY-scalability-audit.md) | in progress |
| [Videos admin: platform content management](../epics/CHAT-ADMIN-CONTENT-admin-content-management.md) | shipped |
| [Contact us page and admin inbox](../epics/CHAT-CONTACT-contact-us.md) | shipped |
| [Error reporting and the admin Errors page](../epics/CHAT-ERRORS-error-reporting.md) | shipped |
| [Creator tiers: invite-only uploads and channel creation](../epics/CHAT-CREATOR-TIERS-creator-tiers.md) | shipped |
| [Uploads survive deploys; upload rate limits](../epics/CHAT-UPLOADS-upload-resilience.md) | shipped |
| [Shorts format rule and backfill](../epics/CHAT-SHORTS-shorts-rule.md) | shipped |
| [Playlists: add during upload, bulk add, ordering](../epics/CHAT-PLAYLISTS-playlist-improvements.md) | shipped |
| [AI category suggestions; Explore hides empty categories](../epics/CHAT-AI-CATEGORIES-ai-categories.md) | shipped |
| [Security audit of the public repos](../epics/CHAT-SECURITY-public-repo-security.md) | shipped |
| [Settings pages redesign (channel-style header, in-place editing)](../epics/CHAT-SETTINGS-REDESIGN-settings-redesign.md) | rejected |
| [Progressive web app for mobile/desktop](../epics/CHAT-PWA-pwa.md) | rejected |
| [Org wiki and org profile](../epics/CHAT-WIKI-org-wiki.md) | in progress |
| [Single sign-on everywhere and sign-out ends SSO](../epics/CHAT-SSO-sso-everywhere.md) | shipped |
