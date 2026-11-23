[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Web Creator Studio

| | |
|---|---|
| **ID** | `AUN-CREATOR-STUDIO` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress**: Studio shipped in `v2026.11.11.4`; completing it (Comments, and Posts, Playlists, Customisation and Settings moved into Studio) is open in [AlUmmahNow#1382](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1382), held for the owner's screenshots |
| **Last updated** | 2026-11-22 |

> Spec merged ([#476](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/476)); the Studio stack #478–#498 merged 2026-11-11 as [#498](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/498). Since then: bulk rename and edit ([#765](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/765), [#809](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/809), [#812](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/812)), creator trash ([#764](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/764)), Studio Live ([#872](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/872)), and the Videos list from cache ([#794](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/794)). In review (WEB-6, 2026-11-14): Studio **Comments** ([#771](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/771)): one inbox for a channel's video and post comments with Inbox, Held and Removed (kept 90 days), search and filters, bulk approve, remove, restore, pin and heart, replies as the channel and per-channel blocks, all by channel role (`comment.moderate`), backend [#1388](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1388); Posts, Playlists, Customisation and Settings moved into Studio with 301s from `/settings/channel/*` ([#772](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/772)) and the scholar Write article / My articles links ([#744](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/744)), [#1382](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1382), held for owner screenshots; channel editors and managers without a tier of their own upload under the owner's tier ([#759](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/759), [#1369](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1369)). The native Studio apps are tracked in [Epic 18](E18-studio-mobile.md) and [Epic 19](E19-studio-desktop.md).

## Goal

A dedicated Studio area of the web app for creators.

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Merged: [AlUmmahNow#476](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/476) (spec), [AlUmmahNow#498](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/498) (Studio stack)
- Open (WEB-6): [AlUmmahNow#1382](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1382), [AlUmmahNow#1388](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1388), [AlUmmahNow#1369](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1369)

## Open questions

- Spec not merged; scope as in the PR.

## Conflicts between sources

- No epic number. Overlaps native Studio epics 18/19 and Epic 26.10 Studio surfaces.

## Sources

- [CREATOR-STUDIO.md (PR #476)](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/476)
- [AlUmmahNow#476](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/476), [AlUmmahNow#482](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/482)
