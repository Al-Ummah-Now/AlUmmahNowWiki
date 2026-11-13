[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Account hub ("Al Ummah Now Account")

| | |
|---|---|
| **ID** | `AUTH-ACCOUNT-HUB` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md), [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-12 |

> Spec merged (Auth #250); `account.*` → `profile.auth.*` redirect merged (Auth #253, step A1). Step A2's sign-in hardening landed through the SSO audit (state and PKCE, sessions in D1 with one refresh at a time, logout CSRF guard). Other steps (A3–C3, T1) not started.

## Goal

Turn the profile app into a Google-account-style hub: home, devices, data, connected apps, deletion events.

## Scope

- Decisions: no photo in auth (initials avatar); email is permanent; deletion everywhere; `account.*` is a redirect only; auth depends on no app

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| A1 | `account.*` 301 redirect, client-name migration | Merged (#253) |
| A2 | Sign-in hardening (state, PKCE, refresh, CSRF) | Merged (#276, #283, #286, #287, #302). Issues #251 and #252 are still open |
| A3 | Hub UI rebuild on theme tokens |  |
| A4 | AlUmmahNow #444 wording |  |
| B1 | `/account/profile`, stored locale default |  |
| B3 | Recent activity |  |
| B4 | Connected apps |  |
| B4b | Launcher and privacy links from the client registry (chat: "profile app should link to all available apps", 2026-11-08) |  |
| B5 | Hub pages, step-up |  |
| B6 | AlUmmahNow privacy link |  |
| C1 | Account events (signed SETs) |  |
| C2 | Deletion in the hub |  |
| C3 | Videos receiver erases on `account.deleted` |  |
| T1 | Drop theme-demo redirect URIs |  |

## Decisions and constraints

- [O15](decisions.md#o15-account-is-only-a-redirect): `account.*` is only a redirect (decided)
- [O21](decisions.md#o21-english-default-on-sign-in-and-profile): English default on sign-in and profile (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Auth [AlUmmahNowAuth#250](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/250), [AlUmmahNowAuth#253](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/253)
- A2: [AlUmmahNowAuth#276](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/276), [AlUmmahNowAuth#283](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/283), [AlUmmahNowAuth#286](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/286), [AlUmmahNowAuth#287](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/287), [AlUmmahNowAuth#302](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/302)

## Open questions

- Does the owner still want phases A2–C3, given the chat decision below?

## Conflicts between sources

- Chat 2026-11-09 03:40 UTC: the owner scaled the hub down to "just a redirect" (`account.*` → `profile.auth.*`). The merged spec still plans phases A–C.
- The spec keeps a `lang` cookie, and step B1 adds a stored-locale default. The hub *is* the profile app, so this conflicts with the English-default rule ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).
- Lane 7's profile account switcher and sessions page overlap Phase A.

## Sources

- [AlUmmahNowAuth/docs/account-hub/SPEC.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/docs/account-hub/SPEC.md)
- [AlUmmahNowAuth/docs/account-hub/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/docs/account-hub/PLAN.md)
- Chat: thread `26081015-8e1e-48a5-bfcc-d2049759df6d`, 2026-11-09 03:06 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3Aecc01bc5-fad0-4ead-b91b-d432567940f7%3Adelegate-task%3A26081015-8e1e-48a5-bfcc-d2049759df6d`)
- Chat: thread `b3036b4f-e700-45ac-8658-dede17f5d691`, 2026-11-09 03:40 UTC, position 8409 (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/b3036b4f-e700-45ac-8658-dede17f5d691`)
