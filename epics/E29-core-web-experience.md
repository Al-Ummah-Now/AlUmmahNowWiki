[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 29: Core web experience completion (P0)

| | |
|---|---|
| **ID** | `E29` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-08 |

> All P0 stories built (Sprint A, merged through #163) and verified on QA 2026-11-08; P1/P2 stories mostly open (#370–#378).

## Goal

Channels, posting, commenting, profiles, reactions, subscriptions, search and browse pages complete on the web, reused by the native apps.

## Scope

- Sprint A (P0): 29.1, 29.2, 29.6, 29.7, 29.8 + 29.9, 29.10
- Sprint B (P1): 29.3, 29.4, 29.5, 29.11, 29.12, 29.13, 29.15, 29.17
- Sprint C (P2): 29.14, 29.16, 29.18
- Core viewing, commenting, subscribing, search and library are free for everyone; creator extras are tiered (Epic 27)
- **Sprint A** (chat-only execution record): the owner said "yes start on e spint a" at 2026-11-07 04:35 UTC; three agents (search/explore, library/notifications, handles/About/comments) merged and were on QA by 06:24 UTC ([AlUmmahNow#170](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/170), [AlUmmahNow#163](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/163)). No message starts Sprints B or C by name. Chat: thread `b3036b4f-e700-45ac-8658-dede17f5d691`, 2026-11-07 04:35–06:24 UTC, position 2087 (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/b3036b4f-e700-45ac-8658-dede17f5d691`)

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 29.1 | `@handle` URLs, channel About | Built (P0). Lookalike handles #276. |
| 29.2 | Comments completion | Built; signed-out live delivery fixed (#361); #379. |
| 29.3 | Creator comment moderation | P1; owned by Epic 6/28. |
| 29.4 | Community posts completion | Partial (#370). |
| 29.5 | Public profile + privacy toggles | Not built (#371). |
| 29.6 | Library hub, Watch later, Liked | Built (P0). |
| 29.7 | Explore page | Built (P0). |
| 29.8 | Search v2 (Arabic normalisation) | Built (P0). |
| 29.9 | Search index (D1 FTS5) | Built (P0). |
| 29.10 | Notification center | Built (P0). |
| 29.11 | Home personalisation | Partial (#372). |
| 29.12 | Watch page completion | Owned by Epic 8. |
| 29.13 | Playlists queue, shuffle, visibility | Not built (#373). |
| 29.14 | Lamahat vertical viewer | Not built (#374). |
| 29.15 | Subscriptions UX | Partial (#375). |
| 29.16 | Account settings consolidation | Not built (#376). |
| 29.17 | Live watch page `/live/{id}` | Not built (#377); chat after D3. |
| 29.18 | Channel extras | Partial (#378). |

## Decisions and constraints

- [D3](decisions.md#d3-live-provider): Live provider (pending), see the [D3 page](D3-live-provider.md)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PR [AlUmmahNow#163](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/163)
- Bugs: [AlUmmahNow#293](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/293), [AlUmmahNow#297](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/297), [AlUmmahNow#298](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/298), [AlUmmahNow#299](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/299), [AlUmmahNow#301](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/301)
- [AlUmmahNowAuth#183](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/183) (language lost later in the auth flow)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#168](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/168) | PR | feat: Library hub, Watch later, liked videos and notification center (Epic 29.6, 29.10) | MERGED | 2026-11-07 |
| AlUmmahNow | [#169](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/169) | PR | feat: Sprint A search & discovery — D1 search index, Search v2, Explore (Epic 29: 29.7–29.9) | MERGED | 2026-11-07 |
| AlUmmahNow | [#170](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/170) | PR | Sprint A: @handle channels + About, owner edit/delete, comments completion (29.1, 29.2) | MERGED | 2026-11-07 |
| AlUmmahNow | [#338](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/338) | PR | fix(web): sign-in opens the auth pages in the site language (#293) | MERGED | 2026-11-08 |
| AlUmmahNow | [#342](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/342) | PR | fix(web): unknown channel pages keep the API and realtime config (#297) | MERGED | 2026-11-08 |
| AlUmmahNow | [#345](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/345) | PR | fix(web): a CDN outage shows a retryable network error (#298) | MERGED | 2026-11-08 |
| AlUmmahNow | [#358](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/358) | PR | fix(web): singular counts, Arabic confirm and timezones, menu overflow (#299) | MERGED | 2026-11-08 |
| AlUmmahNow | [#361](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/361) | PR | feat(realtime): signed-out viewers get live comments (#301) | MERGED | 2026-11-08 |
| AlUmmahNow | [#370](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/370) | issue | Epic 29.4: community posts: post detail URL, edit/delete UI, scheduled posts, subscriber notifications | OPEN | 2026-11-08 |
| AlUmmahNow | [#371](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/371) | issue | Epic 29.5: public profile page and privacy toggles | OPEN | 2026-11-08 |
| AlUmmahNow | [#372](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/372) | issue | Epic 29.11: home category chips and not-interested feedback | OPEN | 2026-11-08 |
| AlUmmahNow | [#373](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/373) | issue | Epic 29.13: playlist play-all queue, shuffle/loop, visibility enforcement | OPEN | 2026-11-08 |
| AlUmmahNow | [#374](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/374) | issue | Epic 29.14: Lamahat vertical viewer on web | OPEN | 2026-11-08 |
| AlUmmahNow | [#375](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/375) | issue | Epic 29.15: subscriptions sidebar dots, new-since-last-visit, manage sort/filter | OPEN | 2026-11-08 |
| AlUmmahNow | [#376](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/376) | issue | Epic 29.16: account settings consolidation | OPEN | 2026-11-08 |
| AlUmmahNow | [#377](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/377) | issue | Epic 29.17: live watch page /live/{id} | OPEN | 2026-11-08 |
| AlUmmahNow | [#378](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/378) | issue | Epic 29.18: channel trailer, featured channels UI, section enum, transfer | OPEN | 2026-11-08 |
| AlUmmahNow | [#379](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/379) | issue | Realtime: watch page opens 3 sockets; 2 never authenticate | OPEN | 2026-11-08 |
| AlUmmahNow | [#424](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/424) | PR | test(release): Epic 29 core web specs and plan doc | MERGED | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Conflicts between sources

- CORE-WEB-EXPERIENCE.md says team roles are "native 19.6"; EPICS.md has Teams & roles as 19.8.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/specs/CORE-WEB-EXPERIENCE.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/CORE-WEB-EXPERIENCE.md)
- [docs/specs/EPIC-29-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EPIC-29-PLAN.md)
