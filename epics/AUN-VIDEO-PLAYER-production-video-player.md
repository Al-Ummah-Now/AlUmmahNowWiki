[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Production video player (themed, token-driven)

| | |
|---|---|
| **ID** | `AUN-VIDEO-PLAYER` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-10 |

> Spec and plan merged 2026-11-10 (#472); player fixes and release tests merged the same day (#536, #538, #556, #561); native theme registry PR #500 open.

## Goal

One production web player on Video.js with every colour from fanous-tokens, so each theme (Lantern, Zujaj, Nahas, Fawanees) gets its own player.

## Scope

- Player tokens per theme
- Build-time theme selection
- Defect fixes from the theme-demo comparison

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PRs [AlUmmahNow#472](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/472), [AlUmmahNow#536](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/536), [AlUmmahNow#538](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/538), [AlUmmahNow#556](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/556), [AlUmmahNow#561](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/561); open [AlUmmahNow#500](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/500), [AlUmmahNow#480](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/480)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- No epic number assigned; it continues Epic 1/2/8 player work and Epic 10 tokens.

## Sources

- [docs/specs/VIDEO-PLAYER.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/VIDEO-PLAYER.md)
- [docs/specs/VIDEO-PLAYER-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/VIDEO-PLAYER-PLAN.md)
- Chat: thread `93d9de70-f692-414d-9966-180d1e1cd209`, 2026-11-09 12:10 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3Aacc6a73a-4719-4518-9670-74b346eaa748%3Adelegate-task%3A93d9de70-f692-414d-9966-180d1e1cd209`)
