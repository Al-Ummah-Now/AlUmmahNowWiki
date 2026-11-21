[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 26: Embedded discussions ("Ummah Comments")

| | |
|---|---|
| **ID** | `E26` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-21 |

> Read-only v1 shipped (`/embed/comments/{videoId}` + `widget.js`, embeds plan D10). Posting, Sites, moderation and the rest are queued (#261).

## Goal

A site owner drops one tag on a page to get a video plus its comment thread, or a thread alone, powered by Al Ummah Now accounts and moderation.

## Scope

- Sites managed in Studio
- Moderation and anti-abuse shared with Epic 28
- Public OAuth client in AlUmmahNowAuth for posting

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 26.1 | Sites in Studio |  |
| 26.2 | Widget: install | In Progress — split one step: partially built, acceptance not fully met: Kimi: #264 supplies a read-only tag, but 26.2 also requires site keys, verified domains, framework/WordPress snippets and hijack protection.; GLM: apps/web/public/embed/widget.js + <alummah-discussion> shipped in #264 with an install contract in docs/embeds and e2e coverage. |
| 26.3 | Widget: experience | In Progress — both audits agree: AlUmmahNow#264 (merged): read-only thread, replies and load more; AlUmmahNow issue #261 (open): posting and the rest of the widget experience; apps/web/src/app/embed/comments/[id]; AlUmmahNow#261 |
| 26.4 | Thread scope | In Progress — both cross-checks agree: #264 implements scope=shared only; docs/embeds/README.md:273 explicitly leaves Site/page threads out of v1.; #264 ships the shared video thread (scope=shared); docs/embeds defers page-scoped threads beyond v1. |
| 26.5 | Moderation (Studio → Sites) |  |
| 26.6 | Anti-abuse |  |
| 26.7 | SEO & no-JS |  |
| 26.8 | Data, privacy & export |  |
| 26.9 | API (`/api/sites`, `/api/discussions`) | In Progress — both audits agree: AlUmmahNow#264 (merged): read-only discussion endpoint and widget; AlUmmahNow issue #261 (open): Sites, posting and remaining API; apps/admin-api/src/routers/sites.router.ts; apps/admin-api/src/routers/siteDomains.router.ts |
| 26.10 | Studio surfaces |  |

## Decisions and constraints

- [E2](decisions.md#e2-default-thread-scope): Default thread scope (open)
- [E3](decisions.md#e3-guest-commenting): Guest commenting (open)
- [EMB-D10](decisions.md#emb-d10-discussions-v1-read-only): Discussions v1 read-only (decided)
- [EMB-D11](decisions.md#emb-d11-no-signed-in-embeds-in-v1): No signed-in embeds in v1 (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Issue [AlUmmahNow#261](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/261)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#252](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/252) | PR | docs(embeds): embed & sharing contract and v1 plan (epics 25/26) | CLOSED | 2026-11-08 |
| AlUmmahNow | [#261](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/261) | issue | Embedded discussions (Epic 26): posting, Sites, moderation and the rest beyond read-only v1 | OPEN | 2026-11-08 |
| AlUmmahNow | [#264](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/264) | PR | feat(embeds): embed player, oEmbed, share dialog, social cards, embed analytics, read-only discussions widget | MERGED | 2026-11-08 |
| AlUmmahNowUI | [#3](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/3) | issue | Embedded discussions on www (epic 26 consumer) | OPEN | 2026-11-08 |

### Reconciled 2026-11-21

- **E26 / Widget: experience (HLB-787): In Progress** — both audits agree: AlUmmahNow#264 (merged): read-only thread, replies and load more; AlUmmahNow issue #261 (open): posting and the rest of the widget experience; apps/web/src/app/embed/comments/[id]; AlUmmahNow#261
- **E26 / API (/api/sites, /api/discussions) (HLB-793): In Progress** — both audits agree: AlUmmahNow#264 (merged): read-only discussion endpoint and widget; AlUmmahNow issue #261 (open): Sites, posting and remaining API; apps/admin-api/src/routers/sites.router.ts; apps/admin-api/src/routers/siteDomains.router.ts
- **E26 / Widget: install (HLB-786): In Progress** — split one step: partially built, acceptance not fully met: Kimi: #264 supplies a read-only tag, but 26.2 also requires site keys, verified domains, framework/WordPress snippets and hijack protection.; GLM: apps/web/public/embed/widget.js + <alummah-discussion> shipped in #264 with an install contract in docs/embeds and e2e coverage.
- **E26 / Thread scope (HLB-788): In Progress** — both cross-checks agree: #264 implements scope=shared only; docs/embeds/README.md:273 explicitly leaves Site/page threads out of v1.; #264 ships the shared video thread (scope=shared); docs/embeds defers page-scoped threads beyond v1.
## Open questions

- Guest commenting (E3): off by default, Pro+ with pre-moderation (recommendation).

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/specs/EMBEDS-COMMENTS-TIERS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EMBEDS-COMMENTS-TIERS.md)
- [docs/embeds/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/embeds/PLAN.md)
