[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 25: Sharing & embeddable player

| | |
|---|---|
| **ID** | `E25` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md), [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-07 |

> v1 shipped per `docs/embeds/PLAN.md` (embed routes, oEmbed, share dialog, postMessage API, embed analytics context); 25.1/25.2 extras, 25.5 npm wrapper, 25.6 creator controls, 25.7, 25.8 Studio views are queued (#255–#259).

## Goal

Every video is shareable and embeddable with the Al Ummah Now player.

## Scope

- Served at `{videos host}/embed/...` for now; `embed.alummahnow.net` (E1) queued
- v1 consults no entitlement (embeds plan D12)

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 25.1 | Share sheet (web + apps) | Share dialog shipped in v1; short links, QR, chapter links → #259. |
| 25.2 | Rich previews | OG/Twitter metadata in v1; JSON-LD → #259. |
| 25.3 | oEmbed provider | Shipped (`/oembed`). |
| 25.4 | Embed player (iframe) | Shipped (facade by default). |
| 25.5 | Player JavaScript API | postMessage API shipped; npm wrapper → #256. |
| 25.6 | Creator embed controls (Studio) | Queued (#257). |
| 25.7 | Embed end screen & related | Queued (#255). |
| 25.8 | Embed analytics | Source/origin rollups shipped; API/Studio views → #258. |
| 25.9 | Cost guardrails | Tied to D2 / E4. |

## Decisions and constraints

- [E1](decisions.md#e1-embed-host-domain): Embed host domain (deferred)
- [E4](decisions.md#e4-delivery-cost-for-embeds): Delivery cost for embeds (open)
- [D2](decisions.md#d2-video-delivery): Video delivery (decided), see the [D2 page](D2-video-delivery.md)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Issues [AlUmmahNow#255](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/255), [AlUmmahNow#256](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/256), [AlUmmahNow#257](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/257), [AlUmmahNow#258](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/258), [AlUmmahNow#259](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/259)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#252](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/252) | PR | docs(embeds): embed & sharing contract and v1 plan (epics 25/26) | CLOSED | 2026-11-08 |
| AlUmmahNow | [#256](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/256) | issue | Embeds: @alummahnow/embed JS wrapper (npm + CDN) with types (spec 25.5) | OPEN | 2026-11-08 |
| AlUmmahNow | [#257](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/257) | issue | Embeds: creator embed controls in Studio (allow/deny, domain allowlists, signed embed tokens, private embeds) (spec 25.6) | OPEN | 2026-11-08 |
| AlUmmahNow | [#258](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/258) | issue | Embeds: embed analytics in the analytics API and Studio (spec 25.8) | OPEN | 2026-11-08 |
| AlUmmahNow | [#259](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/259) | issue | Sharing: short links, QR code, chapter links, share for playlists/channels/live/posts, JSON-LD VideoObject (spec 25.1/25.2) | OPEN | 2026-11-08 |
| AlUmmahNow | [#263](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/263) | issue | Embed analytics: rank kept embed origins by count, harden origin attribution | OPEN | 2026-11-08 |
| AlUmmahNow | [#264](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/264) | PR | feat(embeds): embed player, oEmbed, share dialog, social cards, embed analytics, read-only discussions widget | MERGED | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Conflicts between sources

- `docs/embeds/PLAN.md` numbers its own decisions **D1–D12**, which collide with the native-apps decisions D1–D11. This wiki prefixes them as **EMB-D1…EMB-D12** (see [decisions](decisions.md)).

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/specs/EMBEDS-COMMENTS-TIERS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EMBEDS-COMMENTS-TIERS.md)
- [docs/embeds/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/embeds/PLAN.md)
