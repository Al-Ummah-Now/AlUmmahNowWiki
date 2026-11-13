[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# www home timeline (CMS-managed feed)

| | |
|---|---|
| **ID** | `CMS-HOME-TIMELINE` |
| **Owning repos** | [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-12 |

> Merged 2026-11-10 (CMS #51, UI #30): weekly buckets published to Workers KV. Since then the feed rebuilds itself when its format changes (CMS #72), card posts show all their slides (CMS #58, UI #34), the home is one list with channels as timeline items (CMS #92, UI #51), and video frames take the video's shape with the channel name in the page language (CMS #98, UI #57).

## Goal

A timeline-style www home with videos inside, managed in the CMS.

## How it works

- Staff manage the timeline on the CMS Timeline screen: posts join by default, editors add videos, playlists and channels, and can pin or hide any item. Every change is logged.
- The CMS is the only writer of the `FEED` KV namespace. www only reads it, so the home page never calls the CMS on the request path.
- Every stored feed carries a format number (`FEED_FORMAT`, now 3). A deploy whose code has a newer format rebuilds the feed by itself, so nobody needs to press "Rebuild everything" after a shape change.
- The home page is the hero, then this one list. There are no tabs, rails or "all …" links. `/videos` and `/articles` are separate CMS list pages, not filters of the home list.

Design: [`docs/FEED.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/FEED.md) and [`docs/specs/WWW-PAGES.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/specs/WWW-PAGES.md).

## Decisions and constraints

- [O28](decisions.md#o28-home-timeline-in-weekly-kv-buckets): Home timeline in weekly KV buckets (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- CMS [AlUmmahNowCMS#51](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/51), [AlUmmahNowCMS#53](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/53), [AlUmmahNowCMS#58](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/58), [AlUmmahNowCMS#72](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/72), [AlUmmahNowCMS#87](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/87), [AlUmmahNowCMS#88](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/88), [AlUmmahNowCMS#92](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/92), [AlUmmahNowCMS#98](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/98)
- UI [AlUmmahNowUI#30](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/30), [AlUmmahNowUI#34](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/34), [AlUmmahNowUI#51](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/51), [AlUmmahNowUI#57](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/57)

## Open questions

- Curated home videos keep showing after the video is deleted on the videos site ([AlUmmahNowCMS#77](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/77)).
- A scholar's byline on the timeline should link to their page ([AlUmmahNowUI#42](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/42)).
- Scholars release note: rebuild the KV timeline once per environment ([AlUmmahNowCMS#78](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/78)).

## Conflicts between sources

- The owner first asked for it "cached on r2", then asked "Kv is faster than r2 or not?". It was built on KV, with no explicit owner OK in chat.

## Sources

- [AlUmmahNowCMS/docs/FEED.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/FEED.md)
- [AlUmmahNowCMS/docs/specs/WWW-PAGES.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/specs/WWW-PAGES.md)
- [AlUmmahNowCMS#51](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/51), [AlUmmahNowUI#30](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/30)
- [AlUmmahNowCMS#51](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/51)
