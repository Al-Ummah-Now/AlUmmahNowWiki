[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 4: Phase 5 testing & migration infrastructure

| | |
|---|---|
| **ID** | `E04` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-12 |

> E2E mostly done; #71 rollout superseded by `release.yml`. Since 2026-11-12 most E2E runs on a local Miniflare stack per CI job, with own-data builders, leftover checks and per-test outcome summaries; QA's wide suite is nightly only. See [Testing and E2E](../guides/testing.md).

## Goal

E2E suite, A/B framework and rollout plan for the new player.

## Scope

- Playwright E2E (#68)
- A/B testing
- Migration and rollout (#71)

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 4.1 | E2E test suite (#68) | Mostly done; resume E2E covered by `watch-history-periodic.player.spec.ts`; real devices #349. Local stack: [#962](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/962), [#965](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/965), [#987](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/987), [#1050](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1050), [#1054](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1054). |
| 4.2 | A/B testing framework | Superseded: no flags; staged release with auto-rollback. |
| 4.3 | Migration and rollout (#71) | Superseded by `release.yml` / `rollback.yml`; owner to confirm close. |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- [docs/epics/STATUS-1-4.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-1-4.md)
- Issues [AlUmmahNow#68](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/68), [AlUmmahNow#71](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/71)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#426](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/426) | PR | test(release): player accessibility, touch and analytics; Epics 1-4 status | MERGED | 2026-11-08 |

## Open questions

- Can #71 close as superseded? (owner)

## Conflicts between sources

- Archive lists story 4.2 (A/B framework); STATUS-1-4 marks feature flags / staged % rollout as superseded. Recorded as superseded, not rejected.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/archive/epics-original.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/archive/epics-original.md)
- [docs/epics/STATUS-1-4.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-1-4.md)
