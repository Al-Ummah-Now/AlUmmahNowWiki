[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 7: Content discovery enhancement

| | |
|---|---|
| **ID** | `E07` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-21 |

> 24 ACs: 13 done, 5 partial, 2 not done, 4 owned by Epic 29.

## Goal

Advanced search, trending and better navigation (#40, #39).

## Scope

- Search filters (#40)
- Trending (#39)
- Navigation / related

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 7.1 | Advanced search filters (#40) | Owned by Epic 29.8 (mostly done). |
| 7.2 | Trending algorithm (#39) | Ranked rails with day/week/month windows, cold start first ([Discovery ranking](#discovery-ranking)); AlUmmahNow#1718. |
| 7.3 | Content navigation | Related videos from `/api/recommendations` done (#337); personal Recommended (history + subscriptions, privacy-gated) in #1718. |
| 7.4 | Discovery ranking job and rails (#990, #354, #685 for discovery lists) | D1 rails computed by the `discovery.rank` admin job; keyset cursors, full pages, localized titles and channel names (#418, #408). AlUmmahNow#1718. |
| 7.5 | Admin curation: pins, exclusions, home rail order | Videos admin → Discovery: pin videos/channels into rails, exclude, order and switch home rails, run now, preview; audited. AlUmmahNow#1721. |
| 7.6 | Web home rails and labels | Home page rails from `/api/discovery/home`; Explore and rails show the label the rail reports (en + ar). Home has a "Your library" row: Continue watching, Watch later and Liked videos as playlist-style cards (owner 2026-11-21, 2026-11-22). AlUmmahNow#1723. |


## Discovery ranking

Owner brief 2026-11-21: correct at scale **and** good with no users today (one real user on production; libraries arrive by admin bulk import, often with old original dates). No paid AI or embeddings.

**Rails.** A ranked list per rail and scope, computed by the `discovery.rank` job (admin-jobs queue: retry, backoff, DLQ; a run that gives up appears on the Errors page with **Run now**; state and last run on the Jobs and Discovery pages). The hourly cron starts it when no run is active and the last success is over 50 minutes old. Rails: `trending:day|week|month`, `popular`, `new`, `featured`, `top`; scopes: global, `lang:ar`, `lang:en` (the viewer's language ranks higher), `only:ar`, `only:en` (that language's videos only: Explore's content-language filter on `/api/trending?language=`) and `cat:<category>` (top, new, trending:week). Items are stored as ids + score + reason (`discovery_rail_items`, search DB), written only when a rail's hash changes. Endpoints read one keyset page and the video objects from R2, drop anything no longer public, finished and policy-passing, and overfetch so pages stay full. Every feed returns localized titles and channel names.

**Home availability.** Home requests in the same Cloudflare location reuse recently verified public video cards for 30 seconds across languages and limits. When video, channel or rail reads fail, home serves the cards and rails it can read and does not cache that response.

**Cold start first.** Every video has a prior: quality (verified channel, captions, bilingual title, description) × freshness (platform arrival, half-life 7 days, and original publish date, half-life 180 days) + admin-featured channels. Engagement is distinct qualified viewers per day (plus likes and distinct commenters), time-decayed per window, and blended in by confidence `n/(n+K)` with a minimum volume per window (day 3, week 5, month 8, popular 20 viewers). One or two views never decide Trending.

**Honest labels.** A rail with fewer than 6 videos that have real signal does not pretend: Trending becomes *New today / this week / this month* (widening as needed), Popular becomes *Featured*. Each response carries `rail.mode` and `rail.label`; clients show the label (en + ar).

**What never counts.** Views by the video's owner, staff, test and E2E accounts (`@e2e.alummahnow.net`, `@delivered.resend.dev`), bots and headless browsers, and autoplay (E21). Videos owned by test accounts and admin-excluded videos or channels never reach a rail. On QA and stage the seed's creator is the exception (`RANK_SEED_OWNERS`, exact addresses; empty and ignored in production): it owns the whole public library there. Anonymous viewers are keyed by a hash with a salt that lives one day; viewer rows are kept 91 days.

**Diversity and language.** A per-channel penalty mixes channels; the viewer's language ranks higher without hiding the rest.

**Admin control** (videos admin → Discovery; every admin role reads, changes need `discovery:manage` (admins and super admins); audited): pin a video or channel at a position in a rail (optionally for a time window), exclude a video or channel, order and switch home rails, preview any rail with the reason for each item, run now.

**Personal recommendations** only when the viewer's watch history is on: candidates from the site's top list, newest videos of subscribed channels and videos like the recent history; scored by similarity, a subscription boost and site rank; watched videos left out; mixed across channels. History paused → the same content-based list as everyone. Nothing personal is stored. No engagement-maximising signals (E21).

**API.** `GET /api/discovery/home` (admin-ordered home rails, no repeated videos or headings; category rails carry `categoryLabel` en/ar); `/api/trending?period=day|week|month&cursor=`; `/api/videos/sections/{trending,popular,recent,by-category/:c,recommended}` with `window`, `language`, keyset `cursor`, `metadata.rail`.

**Web.** The home page shows the rails between the hero and the full grid, server-rendered in the page language and fetched after hydration when the API was slow. Each heading is the rail's `label` (cold start: *New this week*, *Featured*, *Top in <category>*); a rail scrolls sideways with snap, page buttons on pointer devices and a peeking card on phones; *See all* opens Explore, every video, the category search or the sections page. Explore's Trending and the sections page take their heading from the same label and show no trending ranks while a list is not trending. Copy in shared-types `i18n-rails.ts` (en + ar).

**"Your library" on home (owner 2026-11-21, 2026-11-22).** One row under a rail-style heading ("Your library" / «مكتبتك», *See all* opens the You page) with up to three playlist-style cards, in this order. A single Continue watching card looked lonely, so Watch later and Liked videos joined it:
- **The cards.** All three use the playlist card frame: a stacked cover, a compact count badge («٢٣ مرئيًا»; from 1K, cut to one decimal), the list's name as the title, and a meta line with the cover video's title and, below it, its channel or how far it was watched.
  - *Continue watching* / «متابعة المشاهدة». The cover is the newest unfinished video, with its progress bar. The card opens the history page's Continue watching view (`/history?view=continue`, below). *Resume* / «تابِع» on the cover opens that video, which resumes from its saved position. Left out while watch history is paused.
  - *Watch later* / «المشاهدة لاحقًا». The cover is the first video in the list's saved order. The card opens `/library/watch-later`, and *Play all* plays the list in place from that video (list `WL` at its stored index).
  - *Liked videos* / «المرئيات التي أعجبتك». The cover is the newest like. The card opens `/library/liked`, and *Play all* plays newest first (list `LL`).
  - Each *Play all* is named for its list for screen readers ("Play all in Watch later" / «تشغيل الكل في المشاهدة لاحقًا»).
- **Empty lists.** A list with nothing in it has no card, and the others share the row. With none, or for a signed-out visitor, there is no row. Each list loads on its own (`GET /api/watch-history?completed=false&limit=3`, `/api/library/watch-later?limit=3`, `/api/library/liked?limit=3`). A failed load leaves only that card out, and the row appears once all three have settled, so it never grows card by card.
- **Layout.** The row's own width decides (container queries):
  - Three cards sit side by side once the row is 760px wide (desktop and tablet). Narrower, they swipe, like the rails on phones: on a phone one card and the next peeking. A swipe row keeps the three cards the same size; a 2 + 1 grid would make the third twice as large and push the hero further down.
  - One or two cards share the row from 560px. A card whose cell is at least 520px wide lays its cover beside the text, centred beside the cover. A card that has the row to itself also lists *Up next* / «التالي»: the list's next two videos, titles wrapping to two lines. So a lone card is larger and shows more of the list, not just a bigger picture. Two cards side by side leave it out, because their text column is too narrow. On a phone, two cards swipe and one takes the full width.
  - In narrow cells (three across on a tablet) the action pill and count badge are compact; the pill is still a 24px target.

**The pages behind the cards (owner 2026-11-22, "what does YouTube do and why not a grid?").**
- **Continue watching** (`/history?view=continue`): a grid of the same video cards as the home page. Each card shows the thumbnail with its progress bar and duration, the title, the channel, and "38% watched • 2 hours ago" / «تمت مشاهدة ٣٨٪، قبل ساعتين». The grid has the home grid's gaps: 4–5 columns on desktop, 3 on a tablet, 2 on a phone and 1 below 360px. One header row holds the title, the count, *All history* / «السجل كاملاً» and *Pause watch history* / «إيقاف سجل المشاهدة مؤقتاً». The remove button (×) sits on the card's top corner. It shows on hover or focus, and always on touch screens.
- **Remove with undo.** Remove hides the video at once. A toast (*Removed from watch history* / «أُزيل من سجل المشاهدة» and *Undo* / «تراجع») stays for 6 seconds, above the phone tab bar. Undo puts the video back in its place, and nothing is deleted. The delete is sent when the toast ends, or right away if the page is left or hidden (`keepalive`). A failed delete brings the video back with an error. There is no confirmation dialog. Each × is named for its video for screen readers ("Remove “…” from watch history").
- **Full history** (`/history`): YouTube's list. Videos are grouped by the day they were watched, in the viewer's own time zone: *Today* / «اليوم», *Yesterday* / «أمس», then weekday names for the past week, then dates ("November 12" / «١٢ نوفمبر», with the year when it isn't this year). Each row shows the thumbnail, the title, the channel, the progress and the time watched with its zone ("9:24 AM EST"), with × at the end of the row. On desktop the list is capped at 1120px beside a sticky side column: search, *Pause watch history* and *Clear all history*. Clear all asks for confirmation, and the delete word must be typed. Below 1024px the side column sits between the title and the list.
- **Search history.** `GET /api/watch-history?q=` searches the viewer's newest 200 entries. It matches the current title in every language and the channel name. Case, tashkeel and tatweel are ignored, alef forms, ة/ه and ى/ي match each other, and every word must match. The answer reports `searched` (how many entries it covered), and the page says so: "Searched your 200 most recent videos." / «شمل البحث أحدث ٢٠٠ من المرئيات في سجلك».
- **Watch later and Liked videos** (`/library/watch-later`, `/library/liked`): YouTube's playlist layout, the same as our public playlist page. A cover panel shows the first video's thumbnail stacked like a playlist, the *You* / «أنت» link, the title, «خاصة، ٥ مرئيات» / "Private • 5 videos", *Play all* and *Shuffle* / «ترتيب عشوائي». Beside it is a numbered list. On desktop the panel is sticky beside the list; on a tablet its cover sits beside its text; on a phone it is stacked above the list. Shuffle starts the player's own per-tab shuffle for the list (`WL`/`LL`) from a random video. Watch later rows keep move up, move down and remove at the end of each row. We chose this over a grid because these are ordered queues that are played, not browsed: the list keeps their order and the reordering visible.
- **Fawanees.** Cards, the day list, the side column, the playlist panel and list, the toast and the header bands are solid, blended over the page, so the street never shows through. The themes suite checks all four pages in light and dark (`street library pages`).

**Cost.** Idle: a few thousand D1 reads an hour, near-zero writes. At 100k videos about 72M rows read a month (included quota 25B). Views: about one write per qualified viewer-day. No AI.

**Quran Foundation terms.** Rails store ids, scores and existing index fields only: no transcript or verse text.

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- [docs/epics/STATUS-5-8.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-5-8.md)
- Issues [AlUmmahNow#39](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/39), [AlUmmahNow#40](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/40)
- PR [AlUmmahNow#337](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/337)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#332](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/332) | PR | docs(epics): Epics 5–8 status audit (STATUS-5-8.md) | MERGED | 2026-11-08 |
| AlUmmahNow | [#337](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/337) | PR | feat(web): watch page related videos from recommendations (Epic 7.3) | MERGED | 2026-11-08 |
| AlUmmahNow | [#354](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/354) | issue | Real-time trending updates and a cached trending score — Epic 7.2 (#39) | OPEN | 2026-11-08 |
| AlUmmahNow | [#389](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/389) | PR | test(release): Epics 5–8 release regressions (shorts, history channel, related, chapters, guidelines) | MERGED | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Conflicts between sources

- The archive has **three** headings named "Epic 7" (two copies of 7.1/7.2 plus the Epic 6/8 stories).

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/archive/epics-original.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/archive/epics-original.md)
- [docs/epics/STATUS-5-8.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-5-8.md)
