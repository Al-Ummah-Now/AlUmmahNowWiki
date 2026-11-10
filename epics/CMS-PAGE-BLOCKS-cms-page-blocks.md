[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# CMS page builder (blocks) and card posts

| | |
|---|---|
| **ID** | `CMS-PAGE-BLOCKS` |
| **Owning repos** | [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-10 |
| **Origin** | Chat only: no repo doc defines this epic |

> CMS side merged (CMS #48); www rendering is open (UI #29).

## Goal

Composed pages from blocks and slide/card posts, with an additive public API. Owner request in chat, 2026-11-10 13:42 UTC.

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- CMS [AlUmmahNowCMS#48](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/48)
- Open UI [AlUmmahNowUI#29](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/29)

## Open questions

- None recorded in the sources.

## Sources

- Chat: thread `eced10bf-6a0a-4b1d-ba11-4f3e8d677c71`, 2026-11-10 13:43 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3Afb56a035-d93a-45fa-80ca-07cf6fd15c9b%3Adelegate-task%3Aeced10bf-6a0a-4b1d-ba11-4f3e8d677c71`)
