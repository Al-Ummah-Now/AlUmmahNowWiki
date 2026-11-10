[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 8: Video content features (chapters, navigation)

| | |
|---|---|
| **ID** | `E08` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-08 |

> 20 ACs: 15 done, 2 not done, 3 owned by Epics 21.8 / 28.7.

## Goal

Chapters, timestamps and better in-player navigation (#38).

## Scope

- Chapters (#38)
- Player navigation

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 8.1 | Chapters and timestamps (#38) | Partial; previous/next chapter + keys done (#340); notes → 21.8; AI chapters → 28.7. |
| 8.2 | Player navigation | Partial. |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- [docs/epics/STATUS-5-8.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-5-8.md)
- Issue [AlUmmahNow#38](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/38)
- PR [AlUmmahNow#340](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/340)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#332](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/332) | PR | docs(epics): Epics 5–8 status audit (STATUS-5-8.md) | MERGED | 2026-11-08 |
| AlUmmahNow | [#340](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/340) | PR | feat(web): previous/next chapter controls + Ctrl/Alt+arrow shortcuts (Epic 8.1, #38) | MERGED | 2026-11-08 |
| AlUmmahNow | [#355](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/355) | issue | Create and share clips (start–end) from a video — Epic 8.2 | OPEN | 2026-11-08 |
| AlUmmahNow | [#389](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/389) | PR | test(release): Epics 5–8 release regressions (shorts, history channel, related, chapters, guidelines) | MERGED | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Conflicts between sources

- Epic 8's stories appear under an "Epic 7" heading in the archive.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/archive/epics-original.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/archive/epics-original.md)
- [docs/epics/STATUS-5-8.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-5-8.md)
