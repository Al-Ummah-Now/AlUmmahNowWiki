[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# www (Astro) + CMS (bknd) v1

| | |
|---|---|
| **ID** | `CMS-WWW-V1` |
| **Owning repos** | [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-12 |

> CMS v1 (CMS #12) and www v1 W1–W10 (UI #7) merged 2026-11-08 with stage-then-promote releases. Later work is tracked in [CMS and www: post-v1 queue](CMS-QUEUE-cms-www-queue.md), [CMS admin UI](CMS-ADMIN-UI-cms-admin-ui.md), [page blocks](CMS-PAGE-BLOCKS-cms-page-blocks.md) and [home timeline](CMS-HOME-TIMELINE-www-home-timeline.md).

## Goal

AlUmmahNowUI is www; AlUmmahNowCMS is its admin; www hosts videos from the videos app through CMS and the embeds work; both are auth clients (owner, chat 2026-11-08 11:09 UTC).

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| C1 | bknd code mode |  |
| C2 | Migrations + guard |  |
| C3 | SSO (public PKCE) |  |
| C4 | Public read API |  |
| C5 | Video picker + embeds adapter |  |
| C6 | Error pages, CSP |  |
| C7 | wrangler envs |  |
| C8 | CI/release |  |
| C9 | E2E |  |
| C10 | Docs |  |
| W1 | Astro 5 starter cleanup |  |
| W2 | i18n en/ar, RTL |  |
| W3 | CMS client with fallbacks |  |
| W4 | Pages |  |
| W5 | Embeds facade |  |
| W6 | Sign-in |  |
| W7 | SEO |  |
| W8 | Apex redirect, headers, cache |  |
| W9 | Envs + domains |  |
| W10 | CI/E2E/release |  |

## Decisions and constraints

- [O23](decisions.md#o23-www-is-the-ui-cms-its-admin-both-auth-clients): www is the UI, CMS its admin; both auth clients (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- CMS [AlUmmahNowCMS#6](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/6), [AlUmmahNowCMS#12](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/12), [AlUmmahNowCMS#16](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/16), [AlUmmahNowCMS#20](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/20)
- UI [AlUmmahNowUI#2](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/2), [AlUmmahNowUI#7](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/7), [AlUmmahNowUI#14](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/14), [AlUmmahNowUI#15](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/15)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- AlUmmahNowUI's copy of the shared plan ([`docs/PLAN.md`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/docs/PLAN.md)) still says to rotate a CMS client secret; the CMS is a public PKCE client with no secret (CMS SPEC v1.1). Still true on 2026-11-12.
- www picks `/en/` or `/ar/` from a cookie, then Accept-Language, then `en`. The English-default rule covers only sign-in and profile pages, so this is a different surface.

## Sources

- [AlUmmahNowCMS/docs/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/6d9ea9ef7d34129325d39e48f8fc2cdc4b6f95a1/docs/PLAN.md)
- [AlUmmahNowCMS/docs/SPEC.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/6d9ea9ef7d34129325d39e48f8fc2cdc4b6f95a1/docs/SPEC.md)
- [AlUmmahNowUI/docs/SPEC.md](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/f2c14bac52a6a5ef2769b0a4b6cb078ae8806188/docs/SPEC.md)
- [AlUmmahNowCMS/ROADMAP.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/6d9ea9ef7d34129325d39e48f8fc2cdc4b6f95a1/ROADMAP.md)
- [AlUmmahNowCMS#6](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/6), [AlUmmahNowUI#2](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/2)
