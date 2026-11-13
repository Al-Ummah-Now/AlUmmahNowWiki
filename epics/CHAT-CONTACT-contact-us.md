[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Contact us page and admin inbox

| | |
|---|---|
| **ID** | `CHAT-CONTACT` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-10 |
| **Origin** | Chat only: no repo doc defines this epic |

> Merged 2026-11-10 (#568, #584, #615, #626; www link UI #23).

## Goal

A Contact us page with an admin inbox; mail sent through a queue with retries.

## Decisions and constraints

- [O26](decisions.md#o26-always-async-with-admin-visible-errors): Always async, with admin-visible errors (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PRs [AlUmmahNow#568](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/568), [AlUmmahNow#584](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/584), [AlUmmahNow#615](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/615), [AlUmmahNow#626](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/626)

## Open questions

- None recorded in the sources.

## Sources

- [AlUmmahNow#568](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/568), [AlUmmahNow#584](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/584)
