[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Single sign-on everywhere and sign-out ends SSO

| | |
|---|---|
| **ID** | `CHAT-SSO` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md), [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md), [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md), [openauth](../repos/openauth.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-12 |
| **Origin** | Chat only: no repo doc defines this epic |

> Merged 2026-11-08/09 (Auth #254, UI #14/#15, CMS #20, openauth #15). Hardened 2026-11-10 to 11-12 after an SSO audit: PKCE for every web client, logout CSRF guard, sign-out revokes refresh tokens, account switch drops the old token. Native apps still open (Android #5, Desktop #21).

## Goal

"If you are signed in then you are signed in… all apps need to do that"; the website shows every signed-in account; sign-out walks the whole chain.

## Decisions and constraints

- [O13](decisions.md#o13-signed-in-once-means-signed-in-everywhere): Signed in once means signed in everywhere (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Auth [AlUmmahNowAuth#254](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/254)
- UI [AlUmmahNowUI#14](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/14), [AlUmmahNowUI#15](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/15)
- CMS [AlUmmahNowCMS#20](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/20)
- openauth [openauth#15](https://github.com/Al-Ummah-Now/openauth/pull/15), [openauth#28](https://github.com/Al-Ummah-Now/openauth/pull/28)
- Hardening: Auth [AlUmmahNowAuth#276](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/276), [AlUmmahNowAuth#283](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/283), [AlUmmahNowAuth#302](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/302); monorepo [AlUmmahNow#559](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/559), [AlUmmahNow#718](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/718), [AlUmmahNow#984](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/984)
- Still open: [AlUmmahNowAndroid#5](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/5), [AlUmmahNowDesktop#21](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/21), native sign-out [AlUmmahNowAuth#310](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/310)

## Open questions

- None recorded in the sources.

## Sources

- Chat: thread `b3036b4f-e700-45ac-8658-dede17f5d691`, 2026-11-08 04:20 and 2026-11-09 03:35 UTC, position 5017 (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/b3036b4f-e700-45ac-8658-dede17f5d691`)
