[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# api-videos roadmap Phase 2: advanced platform features

| | |
|---|---|
| **ID** | `AR-2` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-21 |

> Carried by numbered epics: live (17, D3), moderation (28), monetisation (24, 27; deferred by D4), privacy (1.3, 29.5).

## Goal

Q2 2025: live streaming, moderation, monetisation, privacy.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| – | Live streaming | In Progress — split one step: partially built, acceptance not fully met: Kimi: apps/api-videos/ROADMAP.md:121-126 also requires real-time chat and stream scheduling; AlUmmahNow#872/#1373 ship only part of that live scope.; GLM: AlUmmahNow#872+#1373+#1387 merged and #1367 attached the prod live host (11-15): create, watch, viewer counts and tier limits are live in production; chat/premieres/apps remain under E17/LIVE-PHASES. |
| – | Content moderation | In Progress — both cross-checks agree: apps/api-videos/ROADMAP.md:128-133 includes DMCA tooling and enforcement, while #330/#343/#384 leave fast path and holds open (#392/#393).; Manual moderation (reports, review queues, CSAM #1327-1330) is live but AI runs shadow-only and Phase B holds are open (#393); carrier epic 28 mid-flight. |
| – | Monetisation support | In Progress — both audits agree: AlUmmahNow#1418, #1419 (merged): web pay flow and admin Payments, off by default; AlUmmahNow#1415 (merged): beta tier requests; AlUmmahNow#1418; AlUmmahNow#1419 |
| – | Privacy & security | In Progress — both audits agree: AlUmmahNowAuth#233 (merged): account deletion/export; AlUmmahNow main: apps/api-videos/src/endpoints/privacy/privacy.ts; AlUmmahNow#434 (open): signed playback authorization; apps/api-videos/src/endpoints/privacy; AlUmmahNow#349 |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- None found on GitHub or in the repos.

### Reconciled 2026-11-21

- **AR-2 / Monetisation support (AUN-16): In Progress** — both audits agree: AlUmmahNow#1418, #1419 (merged): web pay flow and admin Payments, off by default; AlUmmahNow#1415 (merged): beta tier requests; AlUmmahNow#1418; AlUmmahNow#1419
- **AR-2 / Privacy & security (AUN-17): In Progress** — both audits agree: AlUmmahNowAuth#233 (merged): account deletion/export; AlUmmahNow main: apps/api-videos/src/endpoints/privacy/privacy.ts; AlUmmahNow#434 (open): signed playback authorization; apps/api-videos/src/endpoints/privacy; AlUmmahNow#349
- **AR-2 / Live streaming (AUN-14): In Progress** — split one step: partially built, acceptance not fully met: Kimi: apps/api-videos/ROADMAP.md:121-126 also requires real-time chat and stream scheduling; AlUmmahNow#872/#1373 ship only part of that live scope.; GLM: AlUmmahNow#872+#1373+#1387 merged and #1367 attached the prod live host (11-15): create, watch, viewer counts and tier limits are live in production; chat/premieres/apps remain under E17/LIVE-PHASES.
- **AR-2 / Content moderation (AUN-15): In Progress** — both cross-checks agree: apps/api-videos/ROADMAP.md:128-133 includes DMCA tooling and enforcement, while #330/#343/#384 leave fast path and holds open (#392/#393).; Manual moderation (reports, review queues, CSAM #1327-1330) is live but AI runs shadow-only and Phase B holds are open (#393); carrier epic 28 mid-flight.
## Open questions

- None recorded in the sources.

## Conflicts between sources

- This roadmap lists an "ad placement API"; native Epic 24.3 allows only opt-in ethical sponsorship with no behavioural targeting, and D4 says no monetisation at launch.

## Sources

- [apps/api-videos/ROADMAP.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/apps/api-videos/ROADMAP.md)
