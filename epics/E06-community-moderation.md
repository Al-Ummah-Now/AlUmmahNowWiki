[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 6: Community & moderation platform

| | |
|---|---|
| **ID** | `E06` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-08 |

> 26 ACs: 2 done, 3 partial, 3 not done, 18 owned by Epics 21.3, 22.3, 26, 28.

## Goal

Safer, more engaged community: scholar verification, moderation tools, engagement features.

## Scope

- Scholar verification
- Moderation tools (→ Epic 28)
- Community engagement

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 6.1 | Scholar verification | Partial: admin verification endpoint (#367) and verified badge (#382); application flow → Epic 21.3. |
| 6.2 | Community moderation tools | Owned by Epic 28. |
| 6.3 | Community engagement | Partial: community guidelines page (#346); study groups → 22.3; forums/Q&A → 26; reputation, similar users → queue issues. |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- [docs/epics/STATUS-5-8.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-5-8.md)
- PRs [AlUmmahNow#346](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/346), [AlUmmahNow#367](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/367), [AlUmmahNow#382](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/382)
- Follow-up [AlUmmahNow#380](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/380)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#332](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/332) | PR | docs(epics): Epics 5–8 status audit (STATUS-5-8.md) | MERGED | 2026-11-08 |
| AlUmmahNow | [#346](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/346) | PR | feat(web): community guidelines page, en/ar (Epic 6.3) | MERGED | 2026-11-08 |
| AlUmmahNow | [#356](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/356) | issue | Community reputation and recognition of positive contributions — Epic 6.3 | OPEN | 2026-11-08 |
| AlUmmahNow | [#357](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/357) | issue | Discover users and creators with similar interests — Epic 6.3 | OPEN | 2026-11-08 |
| AlUmmahNow | [#367](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/367) | PR | feat(admin-api): channel verification endpoint with audit log (Epic 6.1) | MERGED | 2026-11-08 |
| AlUmmahNow | [#382](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/382) | PR | feat: verified badge on the watch page; localized VerifiedBadge component (Epic 6.1) | MERGED | 2026-11-08 |
| AlUmmahNow | [#385](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/385) | PR | feat(entitlements): plans schema, Free seed, catalogue and resolver (Epic 27, 1/6) | MERGED | 2026-11-08 |
| AlUmmahNow | [#389](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/389) | PR | test(release): Epics 5–8 release regressions (shorts, history channel, related, chapters, guidelines) | MERGED | 2026-11-08 |
| AlUmmahNow | [#390](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/390) | PR | feat(api-videos): resolve entitlements and add GET /api/entitlements (Epic 27, 2/6) | OPEN | 2026-11-09 |
| AlUmmahNow | [#391](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/391) | PR | feat(api-videos): enforce Free plan limits with grandfathering (Epic 27, 3/6) | OPEN | 2026-11-08 |

## Open questions

- Admin-web UI for verification not built (endpoint usable from admin-api).

## Conflicts between sources

- In the archive, Epic 6's stories sit under a duplicate **"Epic 7"** heading; STATUS-5-8 maps them by story number.
- EPIC-29-PLAN says 29.3 (creator comment moderation) is owned by "Epic 5–8 (Epic 6)", while STATUS-5-8 says 6.2 moderation is owned by Epic 28. Neither doc claims creator-side comment moderation as done.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/archive/epics-original.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/archive/epics-original.md)
- [docs/epics/STATUS-5-8.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-5-8.md)
