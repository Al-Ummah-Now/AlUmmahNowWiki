[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Videos admin: platform content management

| | |
|---|---|
| **ID** | `CHAT-ADMIN-CONTENT` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-10 |
| **Origin** | Chat only: no repo doc defines this epic |

> API (#576) and UI (#627) merged 2026-11-10.

## Goal

Channels, videos, users and jobs managed inside the videos admin, with no links to the auth admin (owner reversed the first brief).

## Decisions and constraints

- [O14](decisions.md#o14-auth-is-a-separable-sso-provider): Auth is a separable SSO provider (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PRs [AlUmmahNow#576](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/576), [AlUmmahNow#627](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/627), [AlUmmahNow#636](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/636), [AlUmmahNow#645](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/645), [AlUmmahNow#649](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/649)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- The first brief linked the Users section to the auth admin; the owner reversed that minutes later. Docs written from the first brief would be wrong.

## Sources

- [AlUmmahNow#576](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/576), [AlUmmahNow#627](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/627)
