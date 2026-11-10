[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Settings pages redesign (channel-style header, in-place editing)

| | |
|---|---|
| **ID** | `CHAT-SETTINGS-REDESIGN` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **rejected** |
| **Last updated** | 2026-11-08 |
| **Origin** | Chat only: no repo doc defines this epic |

> Superseded by the web Creator Studio; PRs #441 and #444 remain open.

## Goal

Owner request 2026-11-08 19:49 UTC: settings pages with a channel-style header and in-place editing.

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PRs [AlUmmahNow#441](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/441), [AlUmmahNow#444](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/444)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- Recorded as rejected because chat says the web Creator Studio superseded it. The two PRs are still open, so the owner may want them closed.

## Sources

- Chat: thread `0fe5720a-a62d-4c37-8ac7-8eeba089d8ea`, 2026-11-08 19:49 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3Af03a06cf-c9aa-4f08-aa7e-f6e6b82e6608%3Adelegate-task%3A0fe5720a-a62d-4c37-8ac7-8eeba089d8ea`)
