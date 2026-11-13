[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Web Creator Studio

| | |
|---|---|
| **ID** | `AUN-CREATOR-STUDIO` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-12 |

> Spec merged ([#476](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/476)); the Studio stack #478–#498 merged 2026-11-11 as [#498](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/498). Since then: bulk rename and edit ([#765](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/765), [#809](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/809), [#812](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/812)), creator trash ([#764](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/764)), Studio Live ([#872](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/872)), and the Videos list from cache ([#794](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/794)). The native Studio apps are tracked in [Epic 18](E18-studio-mobile.md) and [Epic 19](E19-studio-desktop.md).

## Goal

A dedicated Studio area of the web app for creators.

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Open PRs [AlUmmahNow#476](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/476), [AlUmmahNow#482](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/482)

## Open questions

- Spec not merged; scope as in the PR.

## Conflicts between sources

- No epic number. Overlaps native Studio epics 18/19 and Epic 26.10 Studio surfaces.

## Sources

- [CREATOR-STUDIO.md (PR #476)](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/476)
- Chat: thread `1f3dfeca-e7b7-402a-bffa-b86b7ead8935`, 2026-11-09 15:52 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3Ab2e9b7ca-d930-4636-bb7f-68323b3fa1ff%3Adelegate-task%3A1f3dfeca-e7b7-402a-bffa-b86b7ead8935`)
