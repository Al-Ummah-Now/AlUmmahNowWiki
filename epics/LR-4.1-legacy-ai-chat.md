[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Legacy roadmap 4.1: AI chat integration

| | |
|---|---|
| **ID** | `LR-4.1` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **deferred** |
| **Last updated** | 2025-11-05 |

> Native-apps spec §10 puts AI beyond transcription (semantic search, summaries, auto-translation) out of scope for now.

## Goal

Islamic knowledge chatbot with referenced answers.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| – | Knowledge chatbot |  |
| – | Discovery assistance |  |
| – | Learning path guidance |  |
| – | Referenced Q&A |  |
| – | Arabic/English |  |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- None found on GitHub or in the repos.

## Open questions

- None recorded in the sources.

## Sources

- [docs/legacy/ROADMAP.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/legacy/ROADMAP.md)
