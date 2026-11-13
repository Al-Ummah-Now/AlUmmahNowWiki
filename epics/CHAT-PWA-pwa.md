[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Progressive web app for mobile/desktop

| | |
|---|---|
| **ID** | `CHAT-PWA` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **rejected** |
| **Last updated** | 2026-11-07 |
| **Origin** | Chat only: no repo doc defines this epic |

> Proposed by the assistant on 2026-11-07 02:18 UTC; superseded by D1 (native everywhere).

## Goal

Installable web app instead of native apps.

## Decisions and constraints

- [D1](decisions.md#d1-app-stack): App stack (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- None found on GitHub or in the repos.

## Open questions

- None recorded in the sources.

## Conflicts between sources

- EPICS.md Epic 16 still says "the web app stays installable as a PWA for everyone else", so PWA survives as a fallback, not a product line.

## Sources

- [AlUmmahNow#164](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/164), [AlUmmahNow#323](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/323)
