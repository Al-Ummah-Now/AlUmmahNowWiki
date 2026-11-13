[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Move video delivery to R2 + Cloudflare CDN

| | |
|---|---|
| **ID** | `AUN-R2-MIGRATION` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowTools](../repos/AlUmmahNowTools.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-12 |

> Filed as AlUmmahNow#687 ("a new epic", no number) right after D2 was decided, 2026-11-10. Side-by-side delivery live in every environment since 2026-11-12; viewers move only when an admin changes the delivery switch. How it works: [Video delivery](../guides/video-delivery.md).

## Goal

Infrastructure, transcoding into R2 and migration off Bunny, including the legacy library.

## Scope

- Cache-everything rule, Smart Tiered Cache, custom media hostname (see [D2](D2-video-delivery.md)): **done**, applied as code by releases
- Transcoder on Cloudflare Containers (`apps/media`): **done** ([#893](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/893))
- Dual write beside Bunny, playback switch with fallback to Bunny, QoE per source, daily cost inputs, Delivery comparison page: **done** ([#894](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/894), [#895](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/895), [#896](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/896), [#897](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/897))
- Keep our own originals; transcodes start at upload: **done** ([#972](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/972))
- API picks the source and returns one URL: **done** ([#1013](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1013))
- Release gate for R2 delivery: **done** ([#1016](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1016))
- Backfill of existing videos into R2: **waiting** for the owner to approve a cost report
- Moving viewers off Bunny and retiring the legacy library: **not started**

## Decisions and constraints

- [D2](decisions.md#d2-video-delivery): Video delivery (decided), see the [D2 page](D2-video-delivery.md)
- [D3](decisions.md#d3-live-provider): Live provider (decided 2026-11-11: both, round-robin), see the [D3 page](D3-live-provider.md)
- [D11](decisions.md#d11-who-encodes-renditions): Who encodes renditions (open)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Issue [AlUmmahNow#687](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/687)
- Decision PR [AlUmmahNow#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686) (merged 2026-11-10 as `f4cca7db`)
- Live in stage and production with release `v2026.11.12.3` ([#948](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/948))
- [Media delivery runbook](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/media-delivery/RUNBOOK.md), [R2 delivery plan](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/media-delivery/R2-DELIVERY-PLAN.md)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- No epic number assigned.

## Sources

- [AlUmmahNow#687](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/687)
- Chat: thread `b3036b4f-e700-45ac-8658-dede17f5d691`, 2026-11-10 16:57 UTC, position 15224 (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/b3036b4f-e700-45ac-8658-dede17f5d691`)
