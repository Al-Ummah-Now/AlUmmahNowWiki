[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Playlists: add during upload, bulk add, ordering

| | |
|---|---|
| **ID** | `CHAT-PLAYLISTS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-10 |
| **Origin** | Chat only: no repo doc defines this epic |

> Merged 2026-11-10 (#668, #677).

## Goal

Pick or create playlists in single and batch upload; add many videos at once; sort by field or manually, ascending or descending.

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PRs [AlUmmahNow#668](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/668), [AlUmmahNow#677](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/677)

## Open questions

- None recorded in the sources.

## Sources

- Chat: thread `b3036b4f-e700-45ac-8658-dede17f5d691`, 2026-11-10 12:36–12:40 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/b3036b4f-e700-45ac-8658-dede17f5d691`)
