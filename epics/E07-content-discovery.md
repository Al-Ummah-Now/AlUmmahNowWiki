[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 7: Content discovery enhancement

| | |
|---|---|
| **ID** | `E07` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-08 |

> 24 ACs: 13 done, 5 partial, 2 not done, 4 owned by Epic 29.

## Goal

Advanced search, trending and better navigation (#40, #39).

## Scope

- Search filters (#40)
- Trending (#39)
- Navigation / related

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 7.1 | Advanced search filters (#40) | Owned by Epic 29.8 (mostly done). |
| 7.2 | Trending algorithm (#39) | Partial; real-time trending → queue issue. |
| 7.3 | Content navigation | Partial; related videos from `/api/recommendations` done (#337). |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- [docs/epics/STATUS-5-8.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-5-8.md)
- Issues [AlUmmahNow#39](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/39), [AlUmmahNow#40](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/40)
- PR [AlUmmahNow#337](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/337)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#332](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/332) | PR | docs(epics): Epics 5–8 status audit (STATUS-5-8.md) | MERGED | 2026-11-08 |
| AlUmmahNow | [#337](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/337) | PR | feat(web): watch page related videos from recommendations (Epic 7.3) | MERGED | 2026-11-08 |
| AlUmmahNow | [#354](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/354) | issue | Real-time trending updates and a cached trending score — Epic 7.2 (#39) | OPEN | 2026-11-08 |
| AlUmmahNow | [#389](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/389) | PR | test(release): Epics 5–8 release regressions (shorts, history channel, related, chapters, guidelines) | MERGED | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Conflicts between sources

- The archive has **three** headings named "Epic 7" (two copies of 7.1/7.2 plus the Epic 6/8 stories).

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/archive/epics-original.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/archive/epics-original.md)
- [docs/epics/STATUS-5-8.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-5-8.md)
