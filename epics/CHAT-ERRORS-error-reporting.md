[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Error reporting and the admin Errors page

| | |
|---|---|
| **ID** | `CHAT-ERRORS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-10 |
| **Origin** | Chat only: no repo doc defines this epic |

> Merged 2026-11-10 (#588, #589, #607, #608).

## Goal

Every server and client error reaches an admin Errors page with needs-action items (owner: "errors should flag admin for action").

## Decisions and constraints

- [O26](decisions.md#o26-always-async-with-admin-visible-errors): Always async, with admin-visible errors (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PRs [AlUmmahNow#588](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/588), [AlUmmahNow#589](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/589), [AlUmmahNow#607](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/607), [AlUmmahNow#608](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/608)

## Open questions

- None recorded in the sources.

## Sources

- Chat: thread `a4d13f08-52bb-4d63-aa6e-52a252c824d9`, 2026-11-10 04:11 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3Afb56a035-d93a-45fa-80ca-07cf6fd15c9b%3Adelegate-task%3Aa4d13f08-52bb-4d63-aa6e-52a252c824d9`)
