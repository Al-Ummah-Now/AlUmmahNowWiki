[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 3: Internationalization enhancement (Phase 2)

| | |
|---|---|
| **ID** | `E03` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-08 |

> #80, #81, #82 closed by #339.

## Goal

Bilingual player strings with plurals, locale formatting and language validation.

## Scope

- Plurals
- Locale-specific date/time
- Runtime language validation

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 3.1 | Dynamic pluralization (#82) | Done (#339). |
| 3.2 | Locale date/time formatting (#80) | Done (#339). |
| 3.3 | Runtime language validation (#81) | Done (#339). |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- [docs/epics/STATUS-1-4.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-1-4.md)
- Issues [AlUmmahNow#80](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/80), [AlUmmahNow#81](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/81), [AlUmmahNow#82](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/82)
- PR [AlUmmahNow#339](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/339)
- App-wide follow-up [AlUmmahNow#299](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/299)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#339](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/339) | PR | feat(web): player plurals, isValidLanguage and a regional locale prop (#80, #81, #82) | MERGED | 2026-11-08 |
| AlUmmahNow | [#391](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/391) | PR | feat(api-videos): enforce Free plan limits with grandfathering (Epic 27, 3/6) | OPEN | 2026-11-08 |
| AlUmmahNow | [#426](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/426) | PR | test(release): player accessibility, touch and analytics; Epics 1-4 status | MERGED | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/archive/epics-original.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/archive/epics-original.md)
- [docs/epics/STATUS-1-4.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-1-4.md)
