[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Move video delivery to R2 + Cloudflare CDN

| | |
|---|---|
| **ID** | `AUN-R2-MIGRATION` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowTools](../repos/AlUmmahNowTools.md) |
| **Status** | **planned** |
| **Last updated** | 2026-11-10 |

> Filed as AlUmmahNow#687 ("a new epic", no number) right after D2 was decided, 2026-11-10.

## Goal

Infrastructure, transcoding into R2 and migration off Bunny, including the legacy library.

## Scope

- Cache-everything rule, Smart Tiered Cache, custom media hostname (see [D2](D2-video-delivery.md))

## Decisions and constraints

- [D2](decisions.md#d2-video-delivery): Video delivery (decided), see the [D2 page](D2-video-delivery.md)
- [D3](decisions.md#d3-live-provider): Live provider (pending), see the [D3 page](D3-live-provider.md)
- [D11](decisions.md#d11-who-encodes-renditions): Who encodes renditions (open)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Issue [AlUmmahNow#687](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/687)
- Decision PR [AlUmmahNow#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686) (open, head `e689549`)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- No epic number assigned.

## Sources

- [AlUmmahNow#687](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/687)
- Chat: thread `b3036b4f-e700-45ac-8658-dede17f5d691`, 2026-11-10 16:57 UTC, position 15224 (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/b3036b4f-e700-45ac-8658-dede17f5d691`)
