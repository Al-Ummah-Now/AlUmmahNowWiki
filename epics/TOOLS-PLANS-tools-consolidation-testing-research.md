[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Tools: FileScan consolidation, testing plan, encoding and Bunny research roadmaps

| | |
|---|---|
| **ID** | `TOOLS-PLANS` |
| **Owning repos** | [AlUmmahNowTools](../repos/AlUmmahNowTools.md) |
| **Status** | **planned** |
| **Last updated** | 2026-11-12 |

> Consolidation looks done in code (no FileScanApi; SignalR client exists) though the plan says "Proposed"; the 7-week testing plan is all unticked; the encoding and Bunny roadmaps have no status.

## Goal

Smaller Tools plans.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| Consolidation P1–P5 | Merge FileScanApi into the Windows service with SignalR | Looks done (observation) |
| Testing Wk 1–7 | ViewModel tests, E2E (WinAppDriver), CI | Not started |
| Encoding P1–P4 | FFMpegCore metadata, thumbnails, throttled upload, transcoding | FFMpegCore added (Tools #21) |
| Bunny P1–P4 | Retry, refactor, resumable uploads, cost monitoring | Retry/rate limiting merged (Tools #19, #24); 429/5xx retry with jittered backoff and `Retry-After` ([AlUmmahNowTools#39](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/39), 2026-11-10) |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- FileScan service concurrency fixes from the monorepo's [scalability audit](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/architecture/SCALABILITY-AUDIT.md) (TOOLS-5 to TOOLS-9): [AlUmmahNowTools#32](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/32), [AlUmmahNowTools#35](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/35), [AlUmmahNowTools#36](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/36), [AlUmmahNowTools#37](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/37), [AlUmmahNowTools#38](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/38) (merged 2026-11-10). They harden the consolidated service; the plan documents themselves are unchanged.

## Open questions

- None recorded in the sources.

## Conflicts between sources

- Consolidation plan says "Proposed - Awaiting Approval" but the work appears merged.
- Resumable uploads and encoding queues overlap `aun-upload` (Epic 11) and `aun-media` (Epic 30).

## Sources

- [AlUmmahNowTools/CONSOLIDATION_PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/cd9e20f563608b957f0ba325fa5bb93aef52f9cb/CONSOLIDATION_PLAN.md)
- [AlUmmahNowTools/TESTING_IMPLEMENTATION_PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/cd9e20f563608b957f0ba325fa5bb93aef52f9cb/TESTING_IMPLEMENTATION_PLAN.md)
