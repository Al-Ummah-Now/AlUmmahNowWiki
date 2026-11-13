[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# www home timeline (CMS-managed feed)

| | |
|---|---|
| **ID** | `CMS-HOME-TIMELINE` |
| **Owning repos** | [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-13 |

> Merged 2026-11-10 (CMS #51, UI #30): weekly buckets published to Workers KV. Since then the feed rebuilds itself when its format changes (CMS #72), card posts show all their slides (CMS #58, UI #34), the home is one list with channels as timeline items (CMS #92, UI #51), and video frames take the video's shape with the channel name in the page language (CMS #98, UI #57).

## Goal

A timeline-style www home with videos inside, managed in the CMS.

## How it works

- Staff manage the timeline on the CMS Timeline screen: posts join by default, editors add videos, playlists and channels, and can pin or hide any item. Every change is logged.
- The CMS is the only writer of the `FEED` KV namespace. www only reads it, so the home page never calls the CMS on the request path.
- Every stored feed carries a format number (`FEED_FORMAT`, now 3). A deploy whose code has a newer format rebuilds the feed by itself, so nobody needs to press "Rebuild everything" after a shape change.
- The home page is the hero, then this one list. There are no tabs, rails or "all …" links. `/videos` and `/articles` are separate CMS list pages, not filters of the home list.

## How posts look (owner design, 2026-11-12)

The owner asked for "a better design … without a container that is seen" and chose direction A (Quiet overlay) of four directions, with card posts shown as a stacked deck ([review page](https://claude.ai/artifact/P5FZJeFKLeChwPdXWLJjXb), [AlUmmahNowUI#63](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/63)).

- **No boxes.** Each post is its content. Space and a hairline separate posts; day headings stay.
- **Card posts** are a stacked deck. The top card shows, and the next two wait behind it, turned toward the next side (right in English, left in Arabic). Next throws the top card off toward the start of the line. You can drag or swipe it (finger or mouse) or use the arrow keys in the reading direction and Home/End.
  - The pager sits over the card on hover or focus: small side arrows, a "2 / 5" chip and thin segments. On touch, the segments stay faintly visible and a tap shows the rest.
  - Title (a link), author and time appear over the top on hover, focus or a tap.
  - Screen readers hear "Card 2 of 5". Only the top card is reachable; the cards behind it are inert.
  - Reduced motion: the cards cross-fade and nothing is thrown. Without JS it is a scroll-snap strip.
  - The pager has no eight-point stars (owner correction).
- **Videos** show only the media. Title, channel and time appear over the top on hover or focus. **One click or tap plays a video in place, with sound** (owner: "videos only need 1 click to play"); play data is fetched before the click so playback starts inside it.
  - Resting the mouse plays a muted preview in place, with play/pause, sound and progress controls.
  - The controls act on the preview only and never open the post (owner bug: unmute opened the Short).
  - There is no preview on touch, under reduced motion or with Save-Data.
- **Shorts** are one per post, vertical and centred, at most 32rem tall. One click or tap opens the **Shorts viewer**, already playing with sound:
  - It is full screen, with one Short per screen; scroll or swipe up (or ↑ ↓) for the next.
  - It starts with sound (falling back to muted) and has a link to the videos site.
  - Esc returns focus to the Short. Nothing autoplays under reduced motion.
  - If the videos platform does not answer, the Short plays in place as before.
- **Articles** read as text: byline (scholar avatar or the site mark, name, time), cover, title and excerpt.

The previews and the viewer use the videos platform's public play API: `GET /api/v1/videos/{id}/play` and `GET /api/v1/shorts?after=`. Both are on the videos API ([AlUmmahNow#1102](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1102), contract in `docs/embeds/README.md` §8). www's CSP allows that API in `connect-src` and the platform's media hosts in `media-src`.

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
- UI [AlUmmahNowUI#30](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/30), [AlUmmahNowUI#34](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/34), [AlUmmahNowUI#51](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/51), [AlUmmahNowUI#57](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/57), [AlUmmahNowUI#63](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/63) (design without boxes, card deck, previews, Shorts viewer)
- Videos API (play + next Shorts): [AlUmmahNow#1102](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1102)

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
