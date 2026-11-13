[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Visual Importer roadmap: 6 sprints / milestones

| | |
|---|---|
| **ID** | `TOOLS-IMPORTER` |
| **Owning repos** | [AlUmmahNowTools](../repos/AlUmmahNowTools.md) |
| **Status** | **deferred** |
| **Last updated** | 2026-11-12 |

> No status in the roadmap. `FEATURE_MATRIX.md` says "Overall Health 21%"; `IMPLEMENTATION_COMPLETE.md` says the watch/approval UI is "100% Complete". Native Epic 19.2 absorbs bulk import and retires the .NET importer once it ships.

## Goal

Harden and extend the Windows bulk importer (.NET, Uno) for Bunny/R2 uploads.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| Sprint 1 | Critical security & stability (P0-001…005) |  |
| Sprint 2 | Core functionality (P1-001…006) |  |
| Sprint 3 | Quality & docs (P1-007…010) |  |
| Sprint 4 | Enhanced features (P2-001…006) |  |
| Sprint 5 | Advanced features (P2-007…010) |  |
| Sprint 6 | UI/UX incl. mobile app and AI features (P3) |  |

## Decisions and constraints

- [O1](decisions.md#o1-whole-platform-cost-cap): Whole-platform cost cap (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Tools [AlUmmahNowTools#19](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/19), [AlUmmahNowTools#21](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/21), [AlUmmahNowTools#23](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/23), [AlUmmahNowTools#27](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/27), [AlUmmahNowTools#30](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/30), [AlUmmahNowTools#31](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/31)
- Importer work merged 2026-11-09 to 11-10, not tracked against the sprint list. Scalability-audit fixes: idempotent imports [AlUmmahNowTools#34](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/34), session-scoped lookups [AlUmmahNowTools#31](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/31), one upload routine for import and Resume [AlUmmahNowTools#33](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/33), unique storage keys [AlUmmahNowTools#30](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/30). Other changes: thumbnails keep the video's shape [AlUmmahNowTools#40](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/40), no hard-delete of platform content [AlUmmahNowTools#41](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/41), channel autocomplete [AlUmmahNowTools#42](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/42), owner's icon art [AlUmmahNowTools#45](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/45).

## Open questions

- None recorded in the sources.

## Conflicts between sources

- The roadmap budgets **$5,000–10,000/month** for infrastructure, which contradicts the ≤ $500/month whole-platform cap.
- P3-005 (mobile app) overlaps the native-apps epics; P3-006 suggests Azure AI.
- `FEATURE_MATRIX` (21% health) and `IMPLEMENTATION_COMPLETE` (100%) disagree and aren't dated against each other.
- Status here is *deferred* because `EPICS.md` Epic 19 retires this importer once 19.2 ships. The Tools repo itself doesn't say so.

## Sources

- [AlUmmahNowTools/IMPLEMENTATION_ROADMAP.md](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/cd9e20f563608b957f0ba325fa5bb93aef52f9cb/IMPLEMENTATION_ROADMAP.md)
- [AlUmmahNowTools/CONSOLIDATION_PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/cd9e20f563608b957f0ba325fa5bb93aef52f9cb/CONSOLIDATION_PLAN.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
