[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# CMS: our own admin screens on top of bknd

| | |
|---|---|
| **ID** | `CMS-ADMIN-UI` |
| **Owning repos** | [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-10 |

> Spec (#21) and all four build PRs merged (#22, #25, #29, #30, retiring bknd's admin UI) on 2026-11-09/10, plus spell checking (#40).

## Goal

Keep bknd for storage, data API and permissions; replace its admin UI with our own staff screens (owner: "bknd UI is bad… i am with option one").

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| PR 1 | Spec and case inventory | #21 |
| PR 2 | Foundation: themed shell, Overview | #22 |
| PR 3 | Pages and posts editors | #25 |
| PR 4 | Navigation, videos, site settings, library, people | #29 |
| PR 5 | Retire bknd's admin UI, E2E for every case | #30 |

## Decisions and constraints

- [O22](decisions.md#o22-cms-keeps-bknd-under-our-own-admin-screens): CMS keeps bknd under our own admin screens (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- CMS [AlUmmahNowCMS#21](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/21), [AlUmmahNowCMS#22](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/22), [AlUmmahNowCMS#25](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/25), [AlUmmahNowCMS#29](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/29), [AlUmmahNowCMS#30](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/30), [AlUmmahNowCMS#40](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/40)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- The CMS admin picks its UI language from `?lang=`, a `cms_lang` cookie and Accept-Language. The English-default rule covers only sign-in and profile, so this is a note, not a hard conflict.

## Sources

- [AlUmmahNowCMS/docs/ADMIN_UI_SPEC.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/6d9ea9ef7d34129325d39e48f8fc2cdc4b6f95a1/docs/ADMIN_UI_SPEC.md)
- Chat: thread `7904fb76-d01a-48a1-8f1f-bfe8c90b015a`, 2026-11-09 23:08 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3A5350b6b8-40d1-470e-b39c-db4070082e6a%3Adelegate-task%3A7904fb76-d01a-48a1-8f1f-bfe8c90b015a`)
