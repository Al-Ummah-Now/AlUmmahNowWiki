[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 12: Viewer mobile apps (iOS / iPadOS / Android)

| | |
|---|---|
| **ID** | `E12` |
| **Owning repos** | [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-10 |

> iOS/iPadOS viewer (Apple step 3) and Android phone/tablet viewer (Android step 3, PR #4) merged; sign-in waits on Epic 9 native clients.

## Goal

Native viewer apps at parity with the core web experience plus mobile strengths.

## Scope

- Depends on: 9, 10, 11, 13

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 12.1 | Onboarding |  |
| 12.2 | Home |  |
| 12.3 | Watch page (autoplay off by default) |  |
| 12.4 | Lamahat (short reflections) |  |
| 12.5 | Subscriptions feed |  |
| 12.6 | Library |  |
| 12.7 | Search (Arabic diacritics-insensitive) |  |
| 12.8 | Channel page |  |
| 12.9 | Community posts |  |
| 12.10 | Comments |  |
| 12.11 | Profile & accounts (incl. deletion 9.7) |  |
| 12.12 | Tablet & foldable layouts |  |
| 12.13 | Widgets & shortcuts |  |
| 12.14 | Deep links |  |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Decisions and constraints


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
| AlUmmahNowApple | [#9](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/9) | issue | Viewer stories after the first slice (Epics 12-17, 20-22) | OPEN | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [AlUmmahNowApple/docs/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/e1777cba481c31a0967befa9e25ac5672125a092/docs/PLAN.md)
- [AlUmmahNowAndroid/docs/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/blob/4e7eb38a5a18a3f255ca83697e5c806b3a524160/docs/PLAN.md)
