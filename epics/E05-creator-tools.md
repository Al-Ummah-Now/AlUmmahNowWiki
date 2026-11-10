[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 5: Content creator tools enhancement

| | |
|---|---|
| **ID** | `E05` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-08 |

> 23 ACs: 4 done, 4 partial, 6 not done here, 9 owned elsewhere. Planned gaps (CSV export, bulk edit) shipped 2026-11-08.

## Goal

Better creator analytics, monetisation and content workflow.

## Scope

- Creator analytics
- Halal monetisation (moved to Epic 24/27)
- Content management workflow

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 5.1 | Advanced creator analytics | Partial. Dashboard done; CSV export done (#383); demographics, posting-time insights, predictions → queue issues; live data → Epic 17; revenue → Epic 24. |
| 5.2 | Halal-compliant monetisation | Owned by Epic 24 (+ Epic 27 payments). Nothing built. |
| 5.3 | Content management workflow | Partial. Scheduling, upload progress, processing status done; bulk edit done (#388); versioning, licence → queue issues; collaboration → channel roles. |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- [docs/epics/STATUS-5-8.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-5-8.md)
- PRs [AlUmmahNow#383](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/383), [AlUmmahNow#388](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/388), [AlUmmahNow#389](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/389)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#332](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/332) | PR | docs(epics): Epics 5–8 status audit (STATUS-5-8.md) | MERGED | 2026-11-08 |
| AlUmmahNow | [#350](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/350) | issue | Creator analytics: viewer demographics (country, device, language) — Epic 5.1 | OPEN | 2026-11-08 |
| AlUmmahNow | [#351](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/351) | issue | Creator analytics: retention curve, best posting times, content suggestions — Epic 5.1 | OPEN | 2026-11-08 |
| AlUmmahNow | [#352](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/352) | issue | Studio: replace a video's file and keep metadata history (versioning) — Epic 5.3 | OPEN | 2026-11-08 |
| AlUmmahNow | [#353](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/353) | issue | Video license field on the video and edit form (standard / Creative Commons) — Epic 5.3 | OPEN | 2026-11-08 |
| AlUmmahNow | [#383](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/383) | PR | feat(web): export creator analytics as CSV (Epic 5.1) | MERGED | 2026-11-08 |
| AlUmmahNow | [#388](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/388) | PR | feat(videos): bulk edit from the dashboard (Epic 5.3) | MERGED | 2026-11-08 |
| AlUmmahNow | [#389](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/389) | PR | test(release): Epics 5–8 release regressions (shorts, history channel, related, chapters, guidelines) | MERGED | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/archive/epics-original.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/archive/epics-original.md)
- [docs/epics/STATUS-5-8.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-5-8.md)
