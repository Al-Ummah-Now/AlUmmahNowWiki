[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Org wiki and org profile

| | |
|---|---|
| **ID** | `CHAT-WIKI` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), AlUmmahNowWiki, .github |
| **Status** | **in progress** |
| **Last updated** | 2026-11-09 |
| **Origin** | Chat only: no repo doc defines this epic |

> Wiki and org profile merged (AlUmmahNowWiki #1, .github #1); this epics section is the follow-up the owner asked for on 2026-11-10 16:52 UTC.

## Goal

"Update wiki repo with epics for all repos, every single epic discussed should be there."

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

- Chat: thread `af5f8ac1-4bf1-46b4-8a83-998aa3ccb9ab`, 2026-11-09 19:21 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3Ab2e9b7ca-d930-4636-bb7f-68323b3fa1ff%3Adelegate-task%3Aaf5f8ac1-4bf1-46b4-8a83-998aa3ccb9ab`)
