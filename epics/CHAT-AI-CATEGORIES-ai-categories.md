[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# AI category suggestions; Explore hides empty categories

| | |
|---|---|
| **ID** | `CHAT-AI-CATEGORIES` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-10 |
| **Origin** | Chat only: no repo doc defines this epic |

> Merged 2026-11-10 (#605, #639).

## Goal

Workers AI suggests a category, the uploader confirms; Explore hides categories with no videos.

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PRs [AlUmmahNow#605](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/605), [AlUmmahNow#639](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/639)

## Open questions

- None recorded in the sources.

## Sources

- Chat: thread `gate-task%3Aai-categories-2026-11-10`, 2026-11-10 04:23 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3Afb56a035-d93a-45fa-80ca-07cf6fd15c9b%3Adelegate-task%3Aai-categories-2026-11-10`)
