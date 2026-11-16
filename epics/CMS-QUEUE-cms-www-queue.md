[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# CMS and www: post-v1 queue

| | |
|---|---|
| **ID** | `CMS-QUEUE` |
| **Owning repos** | [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) |
| **Status** | **in progress**: draft preview, scheduled publishing, revisions, responsive images, Articles and search are live (CMS v2026.11.10.3 to v2026.11.10.5, UI v2026.11.10.2 to v2026.11.10.4). The About page managed in the CMS (CMS #130, UI #109) is merged, not yet in a production release. Continue watching (UI #115), videos in www search (UI #114), the newsletter (UI #117, AlUmmahNow #1384) and the scholar fallback, nav link and byline links (UI #113, CMS #137) are built, in review |
| **Last updated** | 2026-11-14 |

> Scheduled publishing (#41), revisions (#43), draft preview (CMS #38, UI #24), image variants (#42) shipped 2026-11-10. Post search shipped on www (CMS #60, UI #35), and the CMS gained a writer role for scholars (CMS #67). Continue watching, videos in www search, the newsletter and the scholar links are built and in review (package WWW-1). A general Content Editor role, embedded discussions on www (Epic 26) and retiring the old `al-ummah-now-ui` Worker are still queued.

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
| – | Continue watching on www | Built, in review ([AlUmmahNowUI#115](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/115), closes #4): a row under the hero for signed-in viewers, filled in the browser from the videos API's continue-watching list so the home HTML stays edge-cacheable. www's sealed session cookie now holds the access and refresh tokens (refreshed server-side, revoked at sign-out). |
| – | Search | Post search shipped: header autocomplete and a search page over live CMS posts (CMS #60, UI #35). Videos in www search: built, in review ([AlUmmahNowUI#114](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/114)): a Videos group in the search boxes and up to 6 videos on the search page from the videos API's search index, linking to the videos site's search for more. |
| – | Newsletter | Built, in review ([AlUmmahNow#1384](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1384), [AlUmmahNowUI#117](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/117), closes #6). The videos admin API stores subscribers (double opt-in, only token hashes, per-IP rate limit, Turnstile where enforced) and sends through Resend via its contact mail queue (retry/backoff, DLQ, failures on the Errors page with Retry). Admins write issues in English and Arabic on the admin Newsletter page (`newsletter:manage`, audited) and erase subscribers. www has a footer form on every page and `/{l}/newsletter/`, plus confirm and unsubscribe pages (button POST; RFC 8058 one-click). $0 on Resend's free tier (3,000 emails a month). Off or unconfigured = invisible ([AlUmmahNowUI#123](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/123), [AlUmmahNow#1484](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1484)): www reads `GET /public/features` on the admin API (on only when Resend, the mail queue and the internal key are bound, and www has `ADMIN_API_URL` + `INTERNAL_API_KEY`). When off there is no footer section, `/newsletter` and `/newsletter/confirm` are 404, and unsubscribe still works without a Sign up link; the admin API answers subscribe/confirm with 404 `feature_off`. |
| – | Scholar fallback, nav link and byline links (UI #41, #42) | Built, in review ([AlUmmahNowUI#113](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/113), [AlUmmahNowCMS#137](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/137)): scholar pages render from the KV snapshot when the CMS is down; Scholars / العلماء in the header menu (CMS) and in www's built-in nav; timeline bylines link to the scholar page with `rel=author`. |
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
