[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# api-videos roadmap Phase 2: advanced platform features

| | |
|---|---|
| **ID** | `AR-2` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2025-11-05 |

> Carried by numbered epics: live (17, D3), moderation (28), monetisation (24, 27; deferred by D4), privacy (1.3, 29.5).

## Goal

Q2 2025: live streaming, moderation, monetisation, privacy.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| – | Live streaming |  |
| – | Content moderation |  |
| – | Monetisation support |  |
| – | Privacy & security |  |

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

## Conflicts between sources

- This roadmap lists an "ad placement API"; native Epic 24.3 allows only opt-in ethical sponsorship with no behavioural targeting, and D4 says no monetisation at launch.

## Sources

- [apps/api-videos/ROADMAP.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/apps/api-videos/ROADMAP.md)
