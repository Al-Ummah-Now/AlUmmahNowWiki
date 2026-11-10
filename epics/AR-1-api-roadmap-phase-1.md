[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# api-videos roadmap Phase 1: enhanced core features

| | |
|---|---|
| **ID** | `AR-1` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2025-11-05 |

> Most items exist (upload progress, thumbnails, status, chapters, subscriptions, notifications, history, search, trending, analytics). Bookmarks = Watch later (29.6).

## Goal

Q1 2025 API core features.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| – | Video management |  |
| – | User features |  |
| – | Content discovery |  |
| – | Analytics & metrics |  |

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

- [apps/api-videos/ROADMAP.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/apps/api-videos/ROADMAP.md)
