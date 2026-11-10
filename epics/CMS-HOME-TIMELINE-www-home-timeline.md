[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# www home timeline (CMS-managed feed)

| | |
|---|---|
| **ID** | `CMS-HOME-TIMELINE` |
| **Owning repos** | [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-10 |

> Merged 2026-11-10 (CMS #51, UI #30): weekly buckets published to Workers KV.

## Goal

A timeline-style www home with videos inside, managed in the CMS.

## Decisions and constraints

- [O28](decisions.md#o28-home-timeline-in-weekly-kv-buckets): Home timeline in weekly KV buckets (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- CMS [AlUmmahNowCMS#51](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/51)
- UI [AlUmmahNowUI#30](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/30)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- The owner first asked for it "cached on r2", then asked "Kv is faster than r2 or not?". It was built on KV, with no explicit owner OK in chat.

## Sources

- [AlUmmahNowCMS/docs/FEED.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/6d9ea9ef7d34129325d39e48f8fc2cdc4b6f95a1/docs/FEED.md)
- Chat: thread `0c0b9655-0e2d-4ba3-9c6c-03b7baa17f2a`, 2026-11-10 15:15 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3Afb56a035-d93a-45fa-80ca-07cf6fd15c9b%3Adelegate-task%3A0c0b9655-0e2d-4ba3-9c6c-03b7baa17f2a`)
- Chat: thread `b3036b4f-e700-45ac-8658-dede17f5d691`, 2026-11-10 15:13 UTC, position 14614 (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/b3036b4f-e700-45ac-8658-dede17f5d691`)
