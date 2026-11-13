[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 2: Advanced video player analytics (Phase 3)

| | |
|---|---|
| **ID** | `E02` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-08 |

> Events tracked and sent; the backend stores only `ready` and `watch_time` (#347).

## Goal

Complete the Phase 3 engagement tracking for the player (#79).

## Scope

- Track all player events
- Send to backend
- Creator insights
- Chat 2026-11-08 05:50 UTC: the owner asked for a working watch-history and analytics event pipeline; done through the history fixes (#294, #327) and #336. Sources: [AlUmmahNow#234](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/234), [AlUmmahNow#336](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/336)

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 2.1 | Advanced engagement tracking | Events done (#336). |
| 2.2 | Real-time performance metrics | Partly: QoE events sent, not stored (#347). |
| 2.3 | Creator insights dashboard | Covered by Epic 5.1 (analytics dashboard). |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- [docs/epics/STATUS-1-4.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-1-4.md)
- Issue [AlUmmahNow#79](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/79)
- PR [AlUmmahNow#336](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/336)
- Open: [AlUmmahNow#347](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/347)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#336](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/336) | PR | feat(web): report volume, playback rate and load milestones (#79) | MERGED | 2026-11-08 |
| AlUmmahNow | [#347](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/347) | issue | Analytics: store the player's engagement events (seek, volume, quality, buffering) | OPEN | 2026-11-08 |
| AlUmmahNow | [#390](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/390) | PR | feat(api-videos): resolve entitlements and add GET /api/entitlements (Epic 27, 2/6) | OPEN | 2026-11-09 |
| AlUmmahNow | [#426](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/426) | PR | test(release): player accessibility, touch and analytics; Epics 1-4 status | MERGED | 2026-11-08 |

## Open questions

- localStorage backup AC was dropped on purpose for GDPR (story 1.3). Owner to confirm the AC is removed.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/archive/epics-original.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/archive/epics-original.md)
- [docs/epics/STATUS-1-4.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-1-4.md)
