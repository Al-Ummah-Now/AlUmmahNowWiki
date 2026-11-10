[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Scalability audit and index-backed lists

| | |
|---|---|
| **ID** | `AUN-SCALABILITY` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-10 |

> Audit doc merged (#506); many fixes merged (#514, #517, #520, #522, #554); index-backed public lists (#685) and per-object index repair (#683) open.

## Goal

Owner (chat 2026-11-09 20:38 UTC): "is the apps all scalable?" Remove in-memory state, lost updates and unbounded scans.

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PRs [AlUmmahNow#506](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/506), [AlUmmahNow#514](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/514), [AlUmmahNow#517](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/517), [AlUmmahNow#520](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/520), [AlUmmahNow#522](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/522), [AlUmmahNow#554](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/554); open [AlUmmahNow#683](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/683), [AlUmmahNow#685](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/685)

## Open questions

- None recorded in the sources.

## Sources

- [docs/architecture/SCALABILITY-AUDIT.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/architecture/SCALABILITY-AUDIT.md)
- Chat: thread `a83a74e9-2889-4e3a-830d-8b191f961789`, 2026-11-09 20:47 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3Ab2e9b7ca-d930-4636-bb7f-68323b3fa1ff%3Adelegate-task%3Aa83a74e9-2889-4e3a-830d-8b191f961789`)
