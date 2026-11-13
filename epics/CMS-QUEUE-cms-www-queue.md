[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# CMS and www: post-v1 queue

| | |
|---|---|
| **ID** | `CMS-QUEUE` |
| **Owning repos** | [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-12 |

> Scheduled publishing (#41), revisions (#43), draft preview (CMS #38, UI #24), image variants (#42) shipped 2026-11-10. Post search shipped on www (CMS #60, UI #35), and the CMS gained a writer role for scholars (CMS #67). A general Content Editor role, embedded discussions on www (Epic 26), continue watching on www, a newsletter and retiring the old `al-ummah-now-ui` Worker are still queued.

## Goal

Work deferred out of CMS/www v1.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| – | Content Editor auth role | Queued. A Scholar → `writer` role (own posts only) shipped in CMS #67; Moderator still maps to `editor`. |
| – | Scheduled publishing (#7) | Shipped (#41) |
| – | Revisions/history (#8) | Shipped (#43) |
| – | Draft preview (#9) | Shipped |
| – | Image resizing | Shipped as AVIF/WebP variants (#42) |
| – | Embedded discussions on www (Epic 26 consumer) | Queued ([AlUmmahNowUI#3](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/3)) |
| – | Continue watching on www | Queued ([AlUmmahNowUI#4](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/4)) |
| – | Search | Post search shipped: header autocomplete and a search page over live CMS posts (CMS #60, UI #35). Searching videos from www is not built. |
| – | Newsletter | Queued ([AlUmmahNowUI#6](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/6)) |
| – | Retire `al-ummah-now-ui` and `bknd` Workers | `al-ummah-now-ui` queued ([AlUmmahNowUI#5](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/5)). `bknd` closed: no such Worker was ever deployed ([AlUmmahNowCMS#11](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/11)). |
| – | Contact us link on www | Shipped (UI #23) |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- CMS [AlUmmahNowCMS#38](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/38), [AlUmmahNowCMS#41](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/41), [AlUmmahNowCMS#42](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/42), [AlUmmahNowCMS#43](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/43), [AlUmmahNowCMS#60](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/60), [AlUmmahNowCMS#67](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/67)
- UI [AlUmmahNowUI#23](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/23), [AlUmmahNowUI#24](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/24), [AlUmmahNowUI#26](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/26), [AlUmmahNowUI#35](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/35)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- CMS `ROADMAP.md` still lists scheduled publishing, revisions, draft preview and image resizing as "Queued" (checked 2026-11-12); the CMS PLAN marks them done, and all are merged.

## Sources

- [AlUmmahNowCMS/ROADMAP.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/6d9ea9ef7d34129325d39e48f8fc2cdc4b6f95a1/ROADMAP.md)
- [AlUmmahNowCMS/docs/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/6d9ea9ef7d34129325d39e48f8fc2cdc4b6f95a1/docs/PLAN.md)
- [AlUmmahNowUI/docs/SPEC.md](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/f2c14bac52a6a5ef2769b0a4b6cb078ae8806188/docs/SPEC.md)
