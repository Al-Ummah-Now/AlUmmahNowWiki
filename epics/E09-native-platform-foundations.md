[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 9: Platform foundations for native clients (backend)

| | |
|---|---|
| **ID** | `E09` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md), [openauth](../repos/openauth.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-08 |

> 9.1, 9.2, 9.3, 9.4 (part), 9.5, 9.9 merged; 9.6, 9.7, 9.8 in open PRs; 9.6 was blocked on D2 (decided 2026-11-10).

## Goal

Make the backend safe and complete for public native clients on every platform.

## Scope

- Depends on: —

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 9.1 | Native public OAuth clients (PKCE S256, custom schemes, universal links, refresh rotation) | Merged in openauth#18, AlUmmahNowAuth#228/#229; follow-up AlUmmahNowAuth#239. |
| 9.2 | Device authorization grant (RFC 8628) + activate page; codes expire in 10 min | Merged in openauth#19, AlUmmahNowAuth#231. |
| 9.3 | Versioned API `/api/v1`, OpenAPI contract, `/api/app-config` | Merged (#369, #416); follow-ups #409, #415. |
| 9.4 | Push fan-out to APNs, FCM, WNS, web push; device registration; per-category prefs | 9.4a/9.4b merged (#421, #422); provider credentials needed (#414, #443). |
| 9.5 | Remote config & feature flags (KV) by platform, version, locale | Merged (#369, #416); admin UI queued (#413). |
| 9.6 | Playback authorization: signed expiring playback/download URLs, device-bound entitlements | Open PR #434. Was blocked on D2; D2 decided 2026-11-10 (R2 + Cloudflare CDN), so the R2 adapter can now be written. |
| 9.7 | In-app account deletion & data export (Apple 5.1.1(v), Play policy) | openauth#20, AlUmmahNowAuth#233 merged; monorepo PR #433 open; #437. |
| 9.8 | Client telemetry ingest (consent-gated, QoE) | Open PRs #432/#433; Core PR #18 merged. |
| 9.9 | Watch-state sync & Continue watching | Merged (#406); Core issue #13. |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Decisions and constraints

- [D2](decisions.md#d2-video-delivery): Video delivery (decided), see the [D2 page](D2-video-delivery.md)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence


GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#309](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/309) | PR | docs: native apps epics (9–24), embeds/discussions/tiers (25–27), AI moderation (28) — onto main | MERGED | 2026-11-08 |
| AlUmmahNow | [#329](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/329) | PR | docs(native-apps): Epic 9 implementation plan | MERGED | 2026-11-08 |
| AlUmmahNow | [#369](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/369) | PR | feat(api-videos): versioned public API, OpenAPI contract in CI, /api/v1/app-config (Epic 9.3) | MERGED | 2026-11-08 |
| AlUmmahNow | [#406](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/406) | PR | feat(api-videos): watch-state sync and Continue watching for native clients (Epic 9.9) | MERGED | 2026-11-08 |
| AlUmmahNow | [#409](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/409) | issue | api-videos: /openapi.json paths are double-prefixed (/api/videos/api/videos) | OPEN | 2026-11-08 |
| AlUmmahNow | [#411](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/411) | issue | native apps: universal links / app links verification files (AASA + assetlinks.json) | OPEN | 2026-11-08 |
| AlUmmahNow | [#412](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/412) | issue | public site: alummahnow.net/activate redirects to the auth device page | OPEN | 2026-11-08 |
| AlUmmahNow | [#413](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/413) | issue | admin-web: remote config & feature flags editor | OPEN | 2026-11-08 |
| AlUmmahNow | [#414](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/414) | issue | push notifications: provider credentials (APNs, FCM, WNS, Web Push VAPID) | OPEN | 2026-11-08 |
| AlUmmahNow | [#415](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/415) | issue | native apps: create the APP_CONFIG KV namespaces and bind them to api-videos | OPEN | 2026-11-08 |
| AlUmmahNow | [#416](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/416) | PR | feat(api-videos): remote config and feature flags in /api/v1/app-config (Epic 9.5) | MERGED | 2026-11-08 |
| AlUmmahNow | [#421](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/421) | PR | feat(api-videos): push device registration (Epic 9.4a) | MERGED | 2026-11-08 |
| AlUmmahNow | [#422](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/422) | PR | feat(processor): push fan-out behind a PushProvider interface (Epic 9.4b) | MERGED | 2026-11-08 |
| AlUmmahNow | [#432](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/432) | PR | feat(api-videos): client telemetry ingest to Analytics Engine (Epic 9.8) | OPEN | 2026-11-08 |
| AlUmmahNow | [#433](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/433) | PR | feat(api-videos): in-app account deletion and export (Epic 9.7) | OPEN | 2026-11-08 |
| AlUmmahNow | [#434](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/434) | PR | feat(api-videos): PlaybackAuthorizer and POST /api/v1/videos/:id/playback (Epic 9.6) | OPEN | 2026-11-08 |
| AlUmmahNow | [#437](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/437) | issue | Access tokens live 30 days and survive account deletion / sign-out | OPEN | 2026-11-08 |
| AlUmmahNow | [#443](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/443) | issue | api-videos: legacy /openapi.json doubles path prefixes for fromHono routers | OPEN | 2026-11-08 |
| AlUmmahNowAndroid | [#3](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/3) | PR | feat(core-bridge,design): core interfaces + Fanous theme and components | MERGED | 2026-11-08 |
| AlUmmahNowApple | [#6](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/6) | issue | Sign-in and real uploads: native PKCE client, device flow on tvOS, Studio upload destinations | OPEN | 2026-11-09 |
| AlUmmahNowAuth | [#228](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/228) | PR | chore(deps): @al-ummah-now/openauth 1.0.24 (native app clients) | MERGED | 2026-11-08 |
| AlUmmahNowAuth | [#229](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/229) | PR | feat(auth): native app OAuth clients for QA, stage and prod (Epic 9.1) | MERGED | 2026-11-08 |
| AlUmmahNowAuth | [#231](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/231) | PR | feat(auth): device authorization grant for TV apps (Epic 9.2) | MERGED | 2026-11-08 |
| AlUmmahNowAuth | [#233](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/233) | PR | feat(auth): in-app account deletion and export (Epic 9.7) | MERGED | 2026-11-08 |
| AlUmmahNowAuth | [#239](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/239) | issue | Native clients: /authorize accepts requests without PKCE (verify enforcement) | OPEN | 2026-11-08 |
| AlUmmahNowCore | [#3](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/3) | PR | feat(aun-api): OpenAPI-generated client, retries, auth refresh, offline write queue | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#8](https://github.com/Al-Ummah-Now/AlUmmahNowCore/issues/8) | issue | Epic 9.8: telemetry ingest endpoint for native apps (analytics + crash batches) | OPEN | 2026-11-08 |
| AlUmmahNowCore | [#13](https://github.com/Al-Ummah-Now/AlUmmahNowCore/issues/13) | issue | Epic 9.9: server sync support for native apps (client stamps, change feed with tombstones, notes, continue watching) | OPEN | 2026-11-08 |
| AlUmmahNowCore | [#14](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/14) | PR | feat(aun-auth): PKCE S256, device flow, multi-account, FFI facade | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#18](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/18) | PR | feat(aun-telemetry): consent-gated telemetry, QoE tracker, breadcrumbs, sinks | MERGED | 2026-11-08 |
| AlUmmahNowDesktop | [#5](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/5) | issue | Video list returns short pages (filter applied after paging), so Home needs many requests | OPEN | 2026-11-08 |
| AlUmmahNowDesktop | [#17](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/17) | issue | Replace temporary core bridges: real TUS uploads and sign-in | OPEN | 2026-11-08 |
| openauth | [#18](https://github.com/Al-Ummah-Now/openauth/pull/18) | PR | feat: native app clients (RFC 8252): per-client PKCE, private-use schemes, loopback ports | MERGED | 2026-11-08 |
| openauth | [#19](https://github.com/Al-Ummah-Now/openauth/pull/19) | PR | feat: device authorization grant (RFC 8628) with a bilingual activation page | MERGED | 2026-11-08 |
| openauth | [#20](https://github.com/Al-Ummah-Now/openauth/pull/20) | PR | feat: OIDC auth_time (and iat) on access tokens, kept across refreshes | MERGED | 2026-11-08 |

## Open questions

- `apple-app-site-association` / `assetlinks.json` need the Apple team id and signing fingerprints (owner).
- Push provider credentials (APNs, FCM, WNS, VAPID) are owner inputs.

## Conflicts between sources

- Every native repo waits on 9.1/9.2 native OAuth client IDs (owner inputs) before sign-in works; Android's `AuthBridge` throws `Unavailable` and Apple runs as a guest.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [docs/native-apps/EPIC-9-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPIC-9-PLAN.md)
- [AlUmmahNowCore/docs/SYNC.md](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/45d873a0b0fa908bead87d91f28bd33a2b41bedb/docs/SYNC.md)
