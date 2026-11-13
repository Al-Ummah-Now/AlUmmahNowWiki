[← Home](../README.md)

# AlUmmahNow

[Repository](https://github.com/Al-Ummah-Now/AlUmmahNow) · default branch `main`

## Purpose

The monorepo for the videos product: the viewer site and Creator Studio, its APIs, background processing, video transcoding into R2, realtime delivery, scheduled publishing, the platform analytics collector and the staff admin site.

## Tech stack

- Turborepo with pnpm workspaces, TypeScript
- `web` and `admin-web`: Next.js 16 on Cloudflare Workers through OpenNext
- `api-videos` and `admin-api`: Hono, with OpenAPI 3.1 through chanfana on `api-videos`
- Cloudflare R2, D1, KV, Queues, Durable Objects, Containers and Workers AI
- Bunny.net for video streaming and image storage, with R2 + Cloudflare CDN delivery beside it (see [Video delivery](../guides/video-delivery.md))

The root [README](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/README.md) and the `apps/web` section of CLAUDE.md still say Next.js 15. `apps/web/package.json` is on 16.

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
| [`apps/media`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/apps/media) | R2 transcoder: transcode queue consumer, FFmpeg on Cloudflare Containers, private `/priv/*` route on `media.*` | R2 (public and private media buckets), queue, Containers, D1 |
| [`apps/cost-monitor`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/apps/cost-monitor) | Scheduled collector of platform analytics and costs for the admin Operations page | D1 |
| [`apps/log-service`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/apps/log-service) | Local log aggregator, never deployed | None |
| [`packages/shared-types`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/packages/shared-types) | Shared TypeScript types | |
| [`packages/logger`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/packages/logger) | Shared logging | |
| [`packages/fanous-tokens`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/packages/fanous-tokens) | Design tokens and per-platform generators | |
| [`packages/theme-packages`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/packages/theme-packages) | Theme package format v1 and the built-in themes as packages | |
| [`packages/app-icons`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/packages/app-icons) | Per-app favicon sets made from the owner's art | |
| [`packages/mcp-log-server`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/packages/mcp-log-server) | MCP server for watching logs | |
| [`scripts/release`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/scripts/release) | Release gates, promote, rollback, smoke, translation sync | |
| [`scripts/local-stack`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/scripts/local-stack) | The local E2E stack: one Miniflare, fakes, leftover check | |

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

Default ports from the README: web 3001, api-videos 3086, websocket 3087, processor 3088, log-service 3089, admin-api 3090, admin-web 3091.

For E2E, boot the local stack instead of pointing at QA. See [Testing and E2E](../guides/testing.md).

The checks CI requires, such as `pnpm check:config`, `pnpm check:migrations`, `pnpm check:schema`, `pnpm check:tokens` and `pnpm test:scripts`, are listed in [CLAUDE.md, "Release gates"](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/CLAUDE.md#release-gates).

## Deployment

| Workflow | Runs on | Does |
|---|---|---|
| [`deploy.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/deploy.yml) | PRs, pushes to `main` | Tests, release checks and builds. Push to `main` deploys QA (including `apps/media`) and syncs QA's translation store |
| [`local-e2e.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/local-e2e.yml) | PRs, pushes to `main`, nightly, releases | E2E on a local stack per job: release, admin and web suites |
| [`release-e2e.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/release-e2e.yml) | Releases, manual | Release suite's deployed specs on stage (the release gate); by hand on QA or stage |
| [`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/release.yml) | `v*` tag on `main`, or manual | Tag: stage → stage E2E + Local E2E + secrets checks → production. Manual run on `main`: stage only |
| [`rollback.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/rollback.yml) | Manual | Rolls back stage or production |
| [`e2e-tests.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/e2e-tests.yml) | After each release tag's Release run, manual | Legacy web specs not yet on the local stack, against QA. Gates nothing |
| [`media-cdn.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/media-cdn.yml) | Manual | Media host's Cloudflare settings as code |
| Cleanup workflows | Hourly, daily, manual | Run-account sweep, QA leftovers, Bunny test-library census and sweep, orphan collections, production test data. See [Testing and E2E](../guides/testing.md#cleanup-jobs-for-shared-environments) |

The release promotes seven workers (web, admin-web, api-videos, processor, websocket-server, admin-api and scheduler), then deploys `cost-monitor` and `media`. CLAUDE.md's "App Responsibilities" still says the scheduler is deployed by hand; the release scripts (`scripts/release/apps.ts`) include it.

See [Release process](../guides/release-process.md).

## Key docs

Many of the 472 files under `docs/` are old. `docs/archive/` and `docs/legacy/` are historical, and several older index pages describe an earlier version of the system. Start with these:

- [CLAUDE.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/CLAUDE.md): current architecture, deploy rules and standards
- [BEFORE_YOU_CODE.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/BEFORE_YOU_CODE.md): required development process
- [CONTRIBUTING.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/CONTRIBUTING.md)
- [Release pipeline spec](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/release-pipeline/SPEC.md) and [plan](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/release-pipeline/PLAN.md)
- [Local E2E stack](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/testing/LOCAL-STACK.md)
- [Media delivery runbook](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/media-delivery/RUNBOOK.md) and [Bunny libraries](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/operations/bunny-libraries.md)
- [Admin analytics and live updates](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/admin/LIVE_OPS.md), [account action requests](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/admin/AUTH_MODERATION_REQUESTS.md), [invites](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/admin/INVITES.md)
- [Logging policy](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/operations/logging.md)
- [PRD](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/PRD.md), [epics 1–8](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/epics.md), [native epics](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/native-apps/EPICS.md)
- [Specs index](../guides/specs-index.md)
- [Themes](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/design/THEMES.md)
- [Architecture decision records](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/docs/adr)
- [GDPR notes](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/compliance/GDPR.md)
- [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/SECURITY.md)

## Channel subscriptions

Subscriptions belong to the account, as on other video sites ([#1152](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1152)).

- **Who subscribes.** A signed-in user with no active channel subscribes **as themselves**; no channel is needed. With a channel active, the user subscribes **as that channel**: the web sends it in the `channelId` header, and the API refuses a channel the caller doesn't own (403). No one can subscribe to their own channel.
- **Status.** `GET /api/channels/:id/subscriptions/status` answers for the identity in use now (the active channel, or the account itself), so the Subscribe button always shows what clicking it will change.
- **Counts.** Each subscriber identity counts once. An account that subscribes as itself and as one of its channels counts twice, as two subscribers. Analytics (new subscribers per day and totals) come from the same store and include both kinds.
- **Lists.** The Subscriptions feed, `/subscriptions/manage` and the sidebar list are per account: a channel appears once, whichever identities subscribe to it. Unsubscribe on the manage page (`DELETE …/subscriptions?scope=all`) removes every one of those subscriptions; the Subscribe button removes only the current identity's.
- **Notifications.** The channel owner gets "new subscriber" for both kinds. The new-video bell is per account and stays on while any of the account's identities still subscribes.
- **Storage.** D1 `channel_subscriptions` (NOTIFICATIONS_DB, migration 0008), one row per (channel, subscriber). An account's own subscription uses the subscriber key `user:<userId>`; channel ids never contain a colon. Queue events carry `subscriberType` (`user`/`channel`) and `subscriberChannelId` (null for an account's own subscription).
- **Privacy.** The data export lists every subscription with `subscribedAs` (`member`/`channel`). Erasure removes both kinds and takes them off the counts.

## Video comments without a channel

A signed-in user comments on videos as the identity in use now, the same way as on community posts since [#1139](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1139) and #1144 ([#1153](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1153), issue [#1151](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1151)).

- **Who comments.** With no active channel, the user comments, replies and likes comments **as themselves**. The author is their profile: display name (else first + last name) and avatar. With a channel active, all of these act **as that channel**, as before.
- **The comment box** says who it posts as: "Commenting as {name}" / «تعلّق باسم {name}». Signed-out visitors get the sign-in prompt.
- **Editing and deleting.** The author edits or deletes their own comment whatever identity is active. Video owners and channel moderators can still delete it.
- **Likes** are per identity: a channel's like, or the user's own when no channel is active. `isLiked` in the comment list follows the identity in use.
- **API.** The `channelId` header is optional on `POST/PUT/DELETE /api/videos/:id/comments[/:cid]`. A comment made without one has `channelId: null`, and so does its author block. Queue events and the moderation scan carry no channel for it.
- **Privacy.** Export, erasure and footprints key on the user id, so they cover these comments and likes too.

Save to playlist no longer needs a channel either: see [Playlists without a channel](#playlists-without-a-channel). **Watch later** is per user.

## Playlists without a channel

Playlists belong to the account when no channel is active ([#1183](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1183)).

- **Personal playlists.** With no active channel, a signed-in user creates, renames, reorders, deletes and fills **their own playlists**. These have `channelId: ''` (the same convention as Watch later) and are owned by the account. With a channel active, Save and Manage Playlists use **the channel's playlists**, as before. Studio, uploads and channel playlist sections only ever use channel playlists.
- **Where.** **Save** on the watch page (Shorts play there too), **Save to playlist** in every video card's ⋮ menu, the **Playlists** section under You, and **You › Playlists** (`/library/playlists`). That page offers the same editor as channels, without the channel video picker; videos come from Save.
- **Which videos.** A personal playlist takes any public video. A channel playlist takes the channel's own videos, plus public videos saved from their watch pages.
- **Visibility.** Every playlist is **Public**, **Unlisted** or **Private**.
  - Unlisted (`isPublic: false` + `isUnlisted: true`) opens for anyone with the link: the page, Play all, the embed and the queue. It never appears in lists, channel sections, search, feeds or sitemaps.
  - Private opens only for its owner (and a channel playlist's managers).
  - The playlist page is `noindex` unless public.
- **API.**
  - The `channelId` header is optional on `POST/PATCH/DELETE /api/playlists[/:id]` and `POST/DELETE /api/playlists/:id/videos[/:videoId]`.
  - `GET /api/playlists?mine=true` lists the caller's personal playlists, private and unlisted included.
  - `visibility: public | unlisted | private` on create and update wins over `isPublic`. Responses carry `visibility`.
- **Moderation and privacy.** The admin Playlists list marks "Personal (no channel)" and "Unlisted". Export, erasure and privacy footprints key on the owner, so personal playlists are covered.
- **Native apps.** Playlists exist only in Studio (channel playlists). Viewer playlists are tracked in [Core#39](https://github.com/Al-Ummah-Now/AlUmmahNowCore/issues/39), [Android#19](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/19), [Apple#30](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/30) and [Desktop#38](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/38).

## Site visits (admin)

The admin's **Overview → Site visits** page (`/site-visits`, every admin) shows how people reach the videos site ([#1202](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1202); counting since [#1184](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1184), decision [D-SEO-9](../epics/AUN-SEO-search-visibility.md#d-seo-9-analytics)).

- **How visits are counted.** One visit is the first page a browser tab opens on the videos site. The web server classifies it (landing page kind, referrer source and host) and the processor adds it to daily counters in D1 `analytics_daily` (entity `site`/`videos`). No cookies, no ids, no IP or user agent, no third party: the page shows **aggregates only**, never anything about one visitor. Visitors who decline analytics are not counted. Days are UTC.
- **Period.** Last 7, 30 or 90 days (`?days=`), today included. Every number on the page is for that period, not since launch.
- **Tiles.** *Visits in the period* (the sum of the daily counts, with the date range), *Average per day* and *Busiest day*.
- **Visits per day.** The shared admin line chart (0-based round value axis; in Arabic the axis is on the right and days run right to left). "Show the numbers" opens the table. A day with no counter is 0.
- **Where visits came from.** Grouped, largest first, with each row's count and share of the period's visits:
  - *Search engines*: Google, Bing, DuckDuckGo, … and *AI assistants* (ChatGPT, Perplexity, Copilot, Claude, Gemini).
  - *Social networks*: X, Facebook, WhatsApp, Telegram, YouTube, …
  - *Al Ummah Now sites*: www, scholar sites and our other apps.
  - *Other websites*: any other referring site.
  - *Direct*: no referrer (typed or bookmarked links, apps that hide the referrer).
- **Pages visits started on.** The landing page kind: Home, Watch page, Shorts, Channel page, Playlist, Search results, Explore, Videos list, Channels directory, Live, account pages (history, subscriptions), Other pages.
- **Top referring websites.** The 30 referring hosts with the most visits in the period (direct visits have no host).
- **API.** admin-api `GET /api/content/analytics/visits?days=N` (1–365), which reads api-videos' internal `/analytics/visits`.

## Owners and contacts

The repo doesn't name individual owners and has no CODEOWNERS file. Security reports go through private vulnerability reporting.

## Current state (2026-11-12)

303 open issues, 152 labelled `queue`. 45 open PRs. Latest release tag: `v2026.11.12.9`. About 430 PRs merged from 2026-11-09 to 2026-11-12; the [changelog](../guides/changelog.md) groups them.

What shipped in those four days, by area:

- **Testing:** most E2E moved off shared QA onto a local Miniflare stack with own-data builders and leftover checks; the QA-wide suite is nightly only. See [Testing and E2E](../guides/testing.md).
- **Video delivery:** R2 + Cloudflare CDN beside Bunny in every environment, the API choosing one playback URL, a new production Bunny library and per-channel collections. See [Video delivery](../guides/video-delivery.md).
- **Creator Studio** on the web ([#498](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/498)), with bulk rename and bulk edit ([#765](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/765), [#809](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/809), [#812](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/812)), creator trash ([#764](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/764)) and Studio Live ([#872](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/872)).
- **Admin:** a redesigned shell that follows the site theme, with grouped navigation, breadcrumbs and ⌘K search ([#820](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/820)); shared lists ([#823](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/823)); Action needed / History queues ([#821](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/821), [#822](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/822)); Warn user ([#824](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/824)); soft delete with 30-day purge ([#698](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/698)); every lookup an autocomplete that opens with content ([#696](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/696), [#852](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/852)); live pages over WebSockets with polling only as a fallback ([#967](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/967), [#971](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/971), [#973](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/973)); an Operations page with platform analytics per environment ([#974](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/974), [#976](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/976)); Delivery and Live streaming pages ([#897](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/897), [#871](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/871)).
- **Live streaming:** a provider-neutral live layer with Bunny Live and self-hosted adapters, round-robin ([#867](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/867)). See [D3](../epics/D3-live-provider.md).
- **Playlists:** playback with the list in the URL, a queue API, autoplay and a pane ([#856](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/856)); bilingual names ([#833](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/833)); Watch later per user ([#847](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/847)).
- **Themes:** the site-wide theme set by admins, Fawanees by default ([#492](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/492)), theme packages and the theme builder ([#575](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/575), [#587](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/587)). See [Theming](../guides/theming.md).
- **Scale and correctness:** the scalability audit's fixes (atomic counters, conditional writes, D1 indexes, sharded websockets). See [AUN-SCALABILITY](../epics/AUN-SCALABILITY-scalability-audit.md).
- **Privacy:** account erasure covers invites, error identity, category suggestions and upload traces; channel deletes remove Bunny collections. See [Deletion, erasure and cleanup](../guides/data-lifecycle.md).
- **Product rules:** one display-name rule (display name, else first + last, email only as a last resort; [#1032](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1032)); the Arabic plural for videos is «المرئيات» ([#1033](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1033)); dislikes are hidden and their routes answer 410 ([#884](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/884), [#889](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/889)); a Short is ≤ 3 minutes and vertical or square ([#591](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/591)); uploads and channel creation are by creator-tier invitation ([#630](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/630), [#715](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/715)).

Open: R2 backfill of existing videos (waiting for a cost report), and the remaining legacy web specs to move to the local stack.

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
| [Web Creator Studio](../epics/AUN-CREATOR-STUDIO-web-creator-studio.md) | shipped |
| [Per-channel roles](../epics/AUN-CHANNEL-ROLES-channel-roles.md) | in progress |
| [Channel claim, transfer and self-service account move](../epics/AUN-CHANNEL-CLAIM-channel-claim-transfer.md) | planned |
| [Account hub ("Al Ummah Now Account")](../epics/AUTH-ACCOUNT-HUB-account-hub.md) | in progress |
| [CMS AI writing assist](../epics/CMS-AI-ASSIST-cms-ai-writing-assist.md) | shipped |
| [Move video delivery to R2 + Cloudflare CDN](../epics/AUN-R2-MIGRATION-r2-video-migration.md) | in progress |
| [Themes: Lantern, Zujaj, Nahas, Fawanees, and the theme builder](../epics/AUN-THEMES-themes.md) | in progress |
| [Release pipeline, tagged releases and skew protection](../epics/AUN-RELEASE-release-pipeline-skew.md) | shipped |
| [Cost monitoring dashboard and alerts](../epics/AUN-COST-cost-monitoring.md) | in progress |
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
