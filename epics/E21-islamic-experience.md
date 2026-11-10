[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 21: Islamic experience layer

| | |
|---|---|
| **ID** | `E21` |
| **Owning repos** | [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **planned** |
| **Last updated** | 2026-11-08 |

## Goal

Prayer times, Hijri seasons, scholar verification, recitation tools, learning paths, intentional viewing.

## Scope

- Depends on: 12

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 21.1 | Prayer times (auto-pause at adhan, opt-in) |  |
| 21.2 | Hijri calendar & Ramadan mode |  |
| 21.3 | Scholar & institution verification |  |
| 21.4 | Recitation tools |  |
| 21.5 | Learning paths |  |
| 21.6 | Intentional viewing (autoplay off, no streaks) |  |
| 21.7 | Content preferences |  |
| 21.8 | Study mode notes |  |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Decisions and constraints

- [D7](decisions.md#d7-prayer-time-data): Prayer-time data (open)

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
| AlUmmahNow | [#380](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/380) | issue | Channel verification can be lost to a concurrent owner edit (R2 read-modify-write) | OPEN | 2026-11-08 |
| AlUmmahNowApple | [#9](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/9) | issue | Viewer stories after the first slice (Epics 12-17, 20-22) | OPEN | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
