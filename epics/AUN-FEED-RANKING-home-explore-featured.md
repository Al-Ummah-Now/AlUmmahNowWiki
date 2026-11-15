[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Home, Explore and Featured ranking

| | |
|---|---|
| **ID** | `AUN-FEED-RANKING` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (api-videos, admin-api, admin-web, web, scheduler, processor, shared-types) |
| **Status** | **planned**: spec only, waiting on owner decisions R1–R16, F1–F12, RV1–RV10 and RD1–RD7 |
| **Last updated** | 2026-11-15 |
| **Origin** | Owner request 2026-11-15: "spec algorithm for showing videos in main page, explore for guests, registered users and channels, with or without subscriptions, and have an admin page to tune that algorithm". Same day: "cover the FEATURED video too", then "admins must be able to set the featured video MANUALLY". Later: related videos / up next, and controlled randomness plus long-tail exploration. |
| **Review page** | [claude.ai artifact](https://claude.ai/artifact/DPqrHVEnP1SEmQ5faU2VMG) (private to the owner) |

Written from AlUmmahNow `main` at `62fbbdff0`. The source wins when this page and the source disagree.

## Goal

One explainable ranking for the videos home page, Explore and the featured (hero) slot, with
different inputs per audience: guests, signed-in viewers with or without subscriptions, and a
channel acting as itself. Admins tune every weight and rule in admin-web, preview the result as any
audience, and undo any change. Admins can also pin the featured video by hand.

It must stay inside the $500/month infrastructure cap at millions of viewers, never scan a D1 table,
and use no third-party AI.

## 1. How it works today

### Home (videos app `/`)

- `apps/web/src/app/[locale]/page.tsx` reads the first page on the server with
  `fetchVideosWithPagination` → `GET /api/videos?limit=15` (default `sort=date`). **The home page is
  newest first. There is no ranking.** Guests and signed-in viewers get the same list; `useAuth` is
  imported but unused in `HomePageClient.tsx`.
- Long videos and Shorts are mixed in one grid, in every language.
- The anonymous first page is edge-cached and keyed by a list generation
  (`apps/api-videos/src/endpoints/video/videoList.ts:116-125`).
- Above the grid: the Continue Watching shelf (history) and the hero.

### Featured (hero) today

- `pickHomeFeatured` (`apps/web/src/lib/video/hero.ts`) picks from the **first page of the newest-first
  list**: a video with `isFeatured = true`, else the newest ready landscape video, else the newest
  ready video of any shape (a Short, letterboxed).
- **No admin or Studio tool sets `isFeatured`.** The flag exists in `packages/shared-types/src/video.ts`
  but nothing writes it, so in practice the hero is simply the newest landscape video.
- One video id is hard-coded as "never featured" (`HOME_HERO_EXCLUDED` in `HomePageClient.tsx:20`).
- Everyone sees the same hero, including viewers who already watched it.
- **Channel page:** the channel owner's `channel_spotlight` section has a trailer (for
  non-subscribers) and a returning-viewer video (for subscribers), set in Studio
  (`apps/api-videos/src/lib/channelSectionPopulator.ts:314`). With no spotlight section there is no
  featured video.
- **Explore** has no featured slot.

### Explore

- `apps/web/src/hooks/useExplore.ts` calls `GET /api/trending?period=week&limit=12&language=`, then
  falls back to search `sort=popular, date=month` when nothing trends. `GET /api/explore` returns
  category tiles (non-empty, admin-managed order from #1423), the 12 newest channels and seasonal rails
  (`explore/seasonal.json` in the `global_settings` bucket). Live-now comes from `useLiveStreams`.
- `/api/trending` (`apps/api-videos/src/endpoints/discovery/discovery.ts`) ranks with
  `trendingScore` in `apps/api-videos/src/lib/discovery.ts:254`:
  `score = 3·recentLikes + 5·recentComments + 4·log10(1 + viewsVelocity·windowHours)` with decayed
  event weights. On a cache miss it lists the videos bucket and reads up to 500 objects, so **it ranks
  only the first 500 keys in R2 key order** (random UUIDs, not the newest). This is issue
  [#990](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/990). The answer is edge-cached for 120 s.
- No personalisation; the Explore fetches send no auth.

### Other lists that rank

| Surface | Order today | Source |
|---|---|---|
| Subscriptions (`/subscriptions`, `/feed` redirects) | newest first from subscribed channels | `lib/feedIndex.ts` on `search_videos` |
| Shorts player (`/shorts`) | newest first | `GET /api/v1/shorts`, `endpoints/video/publicPlay.ts:87` |
| Watch page "related" | profile match from the watched video and the last 10 history items | `GET /api/recommendations`, `lib/recommendations.ts` |
| Sections API (popular, recent, trending, by category) | index query; trending uses `lib/trendingAlgorithm.ts` (hybrid) | `lib/sections/sectionIndex.ts`; only the `/sections` demo page uses it |
| Search `sort=popular` | `views DESC, popularity DESC` | `lib/search/query.ts:152` |

There are **three different trending formulas** (`api-videos/lib/discovery.ts`,
`api-videos/lib/trendingAlgorithm.ts`, `admin-api/lib/trendingAlgorithm.ts`), all with hard-coded
weights. None of them is admin-tunable, and none uses watch time.

### Related videos, up next and autoplay today

- **Watch page "related" and "Up next"**: `GET /api/recommendations?videoId=&excludeWatched=`
  (`apps/api-videos/src/endpoints/discovery/discovery.ts`, `lib/recommendations.ts`,
  `lib/discovery.ts:303-370`). Candidates come from the search index in one batch: up to 100 of the
  same category, 40 of the same channel, 50 full-text matches on the title and tags, and 50 recent
  videos. Score: `4·category + 3·channel + 2·tag (≤ 3) + 1·title word (≤ 3) + prior`, with
  `prior = 0.5·log10(1+views) + 0.5·log10(1+likes) + 1/(1+ageDays/30)`. Signed in, the last 10
  history items also seed the profile.
- **Series next**: a numbered title ("Lesson 4", «الدرس ٤») puts the next number in the same channel first
  (`seriesNext: true`, `lib/series.ts`).
- **Watched videos**: with `excludeWatched=true` they rank last and only fill the shelf. **There is no
  channel cap** (one channel can fill the shelf), no language rule, and no co-watch signal.
- **Autoplay**: `autoplayNext` (profile, on by default) plays the playlist's next item, else the first
  Up next card, after a 3 s countdown (`lib/playback-settings.ts`, `PlayerOverlays.tsx`).
- **Shorts next**: newest first after the current Short (`GET /api/v1/shorts?after=`), the same for
  everyone.
- **Same scholar**: no field links a channel or video to a scholar profile in the videos data today
  (scholar sites live on www), so this source needs a link first (RV7).
- Guests share one edge-cached answer per video; signed-in answers are cached per viewer hash.

### Data sources

Videos, channels, comments, watch history and playlists are JSON objects in R2. D1 holds projections
and per-user indexes. What a ranking can use:

| Signal | Where it lives today | Usable as is? |
|---|---|---|
| Listing state (public, released, ready, review cleared, not removed) | R2 video JSON; projected to SEARCH_DB `search_videos.visible` | yes |
| Published time, language, category, Short, duration, channel | `search_videos` (`created_at`, `language` (detected from text when unset), `category`, `is_short`, `duration`, `channel_id`); indexes on `(category, created_at)`, `(language, created_at)`, `(is_short, created_at)`, `(channel_id, created_at)` | yes |
| Views | Durable Object `VIEW_COUNTER` flushes a total into the video JSON; `search_videos.views` may lag; **no timestamps** | total only |
| Views and watch time per day, retention in 5 % buckets | NOTIFICATIONS_DB `analytics_daily(entity_type, entity_id, day, metric, dim, value)`, written by the processor | yes: momentum and watch-through come from here |
| Likes | `likes[]` with dates inside the video JSON; NOTIFICATIONS_DB `liked_videos(user_id, video_id, liked_at)` | yes (dislikes are off) |
| Comments | `comments[]` inside the video JSON | yes |
| Shares | `sharesCount` exists in the type but is **never written** | no: phase 0 adds share events |
| Impressions, click-through | **not recorded** (analytics reports them as 0) | no: phase 0 adds them (5.1) |
| Co-watch ("watched X, then Y") | **not recorded** | no: phase 0 adds it from the existing view event (3b.2) |
| Watch history | R2 `watch_history/{userId}:{videoId}` (`percentageWatched`, `completed`, `lastWatchedAt`), kept 548 days, pausable (`watchHistoryPaused`) | yes, but listing R2 per request is too costly at scale |
| Subscriptions | NOTIFICATIONS_DB `channel_subscriptions` (PK `channel_id, subscriber_channel_id`, index `user_id, created_at`); a viewer with no channel is `user:<userId>` | yes |
| Watch later / playlists | private R2 playlists (`watch-later-<userId>`) | weak signal, not used |
| Channel trust | `channel.isVerified`, `channel.reviewTrusted`, `isSuspended`, `isHidden` in R2; `search_channels.visible` | yes |
| Reports | REPORTS_DB `reports` with `idx_reports_open_entity(status, entity_type, entity_id, created_at)`; **no automatic hide by report count** | yes, counted per changed video |
| NSFW | REPORTS_DB `content_reviews` (`risk`, `nsfw`, `top_category`); **no flag on the video** | must be projected (2.7) |
| Categories | SEARCH_DB `video_categories` (admin-managed, #1423) | yes |
| Viewer languages | **none**: no content-language preference; only UI locale | phase 1 adds one |
| "Not interested" | **none** | out of scope (later) |

Precomputed lists today are R2 objects (`index:recent-videos`, `index:popular-videos`,
`index:trending-videos`, `index:category`) rebuilt by the section endpoints when stale. No cron
computes trending; `/api/trending` and `/api/recommendations` rank per request behind the edge cache.

### www home timeline (AlUmmahNowUI)

The www home page is a separate, CMS-curated timeline stored in Workers KV (`FEED` binding; CMS is the
only writer). Editors choose and order it in the CMS. This spec does not change it. The two meet in
two places only:

- the CMS timeline may embed a "videos for you" block later that calls the new `GET /api/feed/home`
  (decision R16), and
- an editor who features a video on www does not feature it on the videos app; the two featured
  lists stay separate unless the owner wants one (decision F12).

## 2. The algorithm

### 2.1 Pipeline

```
          every 10 min (scheduler)                         per request (api-videos)
 ┌────────────────────────────────────┐        ┌────────────────────────────────────────────┐
 │ counters (D1 + Analytics Engine)    │        │ 1. config (KV, isolate cache 60 s)          │
 │   → video_scores (search D1)        │        │ 2. segment pool (KV / edge cache)           │
 │ segment pools: top 500 per segment  │──KV──▶ │ 3. viewer state (1 indexed D1 row)          │
 │   (surface × format × language)     │        │ 4. hard filters → score → diversity re-rank │
 │ featured: resolve pins + auto pick  │        │ 5. page of 24 + featured + Shorts shelf     │
 └────────────────────────────────────┘        └────────────────────────────────────────────┘
```

1. **Candidates** are precomputed. A scheduled job keeps a per-video score row and writes, for every
   segment (surface × format × content language), the top 500 candidates with their features to KV.
   Nothing on the request path queries the whole catalogue.
2. **Hard filters** remove anything that must never show (section 2.7).
3. **Score**: a weighted sum of a few normalised signals, each in [0, 1].
4. **Diversity re-rank** spreads channels and categories and reserves exploration slots.
5. Guests get the segment page from the edge cache. Signed-in viewers get the same pool re-ranked with
   their own small state, which costs one indexed D1 read.

### 2.2 Signals (each normalised to 0–1)

All rates are smoothed with a prior, so a video with 3 views and 3 likes does not beat one with 3,000
views and 900 likes. With `n` trials, `k` successes, a prior rate `p₀` for the format and a prior
weight `m`:

> smoothed rate = (k + m·p₀) / (n + m)

Each smoothed rate is then turned into a percentile within its format (long or Short) and language,
so weights compare like with like.

| Signal | Plain words | Math | Default |
|---|---|---|---|
| **Freshness** F | Newer is better, halving every *h* hours. | F = 2^(−age / h) | h = 72 h home long, 36 h Shorts, 168 h Explore |
| **Watch-through** W | Do people who start it keep watching? From the `analytics_daily` retention buckets: the share of starts that reach 70 %. | W = pct( smoothed(completions ≥ 70 %, starts) ) | m = 20 starts |
| **Approval** A | Likes per qualified view, minus dislikes. | A = pct( smoothed(likes − 0.5·dislikes, qviews) ) | m = 50 |
| **Conversation** C | Comments per qualified view (held/removed comments do not count). | C = pct( smoothed(comments, qviews) ) | m = 100 |
| **Sharing** S | Share-button uses and short-link opens per qualified view (not recorded today; the weight stays 0 until phase 0 has 30 days of data). | S = pct( smoothed(shares, qviews) ) | m = 100 |
| **Momentum** M | Qualified views in the last 24 h compared with the video's own 7-day daily average, log-damped so one viral counter cannot dominate. | M = pct( log(1 + q24h) − log(1 + q7d/7) ) | — |
| **Reach** R | How many people watched at all, log-scaled; used as confidence, never alone. | R = log10(1 + qviews) / log10(1 + qviews_p99) | capped at 1 |
| **Channel quality** Q | Verified or trusted channel, low report rate, complete metadata (HD thumbnail, title in the viewer's language, captions). | Q = 0.4·trusted + 0.3·(1 − reportRate_pct) + 0.3·metadata | — |
| **Affinity** P (signed-in) | How close the video's category and channel are to what this viewer watched to the end and liked in the last 90 days. | P = 0.6·cat[v.category] + 0.4·chan[v.channel], both decayed with a 30-day half-life and scaled to 0–1 | top 20 categories, top 50 channels |
| **Subscription** U (signed-in) | A new upload from a subscribed channel. | U = 1 if subscribed and age ≤ 7 days, decaying: U = 2^(−age / 48 h) | — |
| **Language** L | The video's language is one of the viewer's languages. | L = 1 match, 0.5 no language set, 0 other | see R2 |

Raw view counts are never a signal by themselves; they enter only through reach (a log) and as `n` in
the smoothed rates.

### 2.3 Score

> **score(v, viewer) = Σᵢ wᵢ · signalᵢ(v, viewer) − penalties(v)**

Defaults per surface (weights sum to 1 so a score reads as a 0–1 value; every weight is editable):

| Weight | Home, guest | Home, signed-in | Explore "Trending" | Shorts shelf | Featured (auto) |
|---|---|---|---|---|---|
| Freshness F | 0.25 | 0.20 | 0.10 | 0.25 | 0.30 |
| Watch-through W | 0.20 | 0.15 | 0.15 | 0.25 | 0.20 |
| Approval A | 0.10 | 0.08 | 0.10 | 0.10 | 0.10 |
| Conversation C | 0.05 | 0.04 | 0.05 | 0.02 | 0.05 |
| Sharing S | 0.05 | 0.04 | 0.10 | 0.08 | 0.05 |
| Momentum M | 0.10 | 0.08 | 0.35 | 0.15 | 0.10 |
| Reach R | 0.05 | 0.03 | 0.05 | 0.05 | 0.05 |
| Channel quality Q | 0.10 | 0.08 | 0.05 | 0.05 | 0.15 |
| Affinity P | — | 0.15 | — | 0.05 | — |
| Subscription U | — | 0.10 | — | — | — |
| Language L | 0.10 (multiplier, below) | same | same | same | same |

Language is applied as a multiplier, not a summand: `score × (0.5 + 0.5·L)` by default, or a hard
filter when R2 says so.

**Penalties** (subtracted, editable):

- open reports from distinct users: 0.05 each, up to 0.2 (beyond the hide threshold the video is
  filtered, section 2.7);
- a channel already shown twice above this slot: handled by the diversity pass, not a penalty;
- clickbait guard: high click-through but watch-through below the 20th percentile: 0.1 (needs
  impressions, phase 2).

### 2.4 Audiences

| Audience | Inputs | Home | Explore |
|---|---|---|---|
| **Guest** | UI language (`en` unless `?lang=ar`), the Explore language filter, nothing else | Segment page from the edge cache. Videos seen earlier **in this browser tab session** are skipped client-side (sessionStorage list, never sent to the server). | Same for everyone in the segment |
| **Signed-in, no subscriptions** | + content languages from settings, affinity from history and likes, watched set | Pool re-ranked with affinity; watched videos removed | Language only (R14) |
| **Signed-in, with subscriptions** | + subscribed channels (account-wide: channel identities and `user:<id>` rows) | Up to σ of the first page (default 30 %, i.e. 7 of 24) are subscription uploads (U > 0, unwatched), placed by score, never all at the top; later pages fall to 15 % | Subscribed channels are **down-weighted** ×0.7 in Explore so Explore stays about discovery |
| **Channel acting as itself** (`channelId` header from the active identity) | That channel identity's own subscriptions; the account's history; the channel's category as a mild affinity seed | As signed-in, and the channel's **own videos are excluded** (they live in Studio) | As signed-in |
| **History paused** | No new history is written | Affinity frozen at the moment of pausing; watched exclusion still uses existing history | — |
| **"Don't personalise" on** | — | Served exactly as a guest of the same language, except watched videos are still skipped if the viewer allows it (R9) | as guest |

**Cold start for a new signed-in viewer** (fewer than 5 qualified watches): affinity is empty, so the
page is the guest page plus subscriptions. Optional topic picker on first visit: decision R13.

### 2.5 Home page layout

1. Featured (section 3).
2. Continue Watching (unchanged: partly watched, newest first).
3. Main grid, 24 per page, long videos only.
4. One Shorts shelf (12) after the second row, ranked by the Shorts weights (R11).
5. "Load more" continues the same ranked list with a cursor that pins the pool version, so a page
   never repeats or skips when the pool is rebuilt in between.

### 2.6 Diversity and exploration (greedy re-rank)

Walk the scored list and take the best item that keeps every rule; skip and come back otherwise.

| Rule | Default | Range |
|---|---|---|
| Most videos from one channel per page of 24 | 2 | 1–6 |
| Same channel in adjacent slots | never | on/off |
| Largest share of one category per page | 40 % | 20–100 % |
| Watched videos (finished ≥ 90 %, or ≥ 50 % in the last 30 days) | excluded | thresholds editable |
| Partly watched (< 90 %) | moved to Continue Watching, not the grid | on/off |
| Exploration slots per page | 10 % (2 of 24) on Home, a 12-card "New voices" rail on Explore (see 2.9) | 0–30 % |
| Pinned slots (editorial) | none | 0–4 |

**Exploration (cold start for new videos and channels)** uses the impression-based pool, slots and
boost of 2.9(b). A channel younger than 24 hours, or one with an open moderation case, gets no
exploration slots (R15).

### 2.7 Safety: hard filters (never weights)

A video is never a candidate on any algorithmic surface when any of these is true:

- not `isVideoPubliclyVisible` (shared-types `video-visibility.ts`): removed, not public, not released,
  or not ready, which includes **pre-publication review** states (checking, held, rejected, appealed);
- its channel is blocked, hidden or deleted, or the uploader is suspended;
- it is hidden by reports, or has open reports from at least *k* distinct users (default 3; 1 when a
  trusted reporter filed it) until a moderator closes them (R10);
- it is flagged NSFW by AI moderation or a reviewer (REPORTS_DB `content_reviews.nsfw`), whatever its
  later state: it may be watchable by link after review, but it is **never ranked** and never
  featured. The projection copies the flag into a new `search_videos.nsfw` column so the filter is
  a column check, not a join;
- a scheduled premiere that has not started, a live stream (live has its own rail), or an unlisted or
  private video.

Admins can loosen none of these on the tuning page; they are shown there read-only.

### 2.8 Islamic content

Ranking Qur'an recitations against each other by popularity can read as ranking the recitation of
the Qur'an itself, or ranking reciters. Proposed default (R1):

- In the `quran_recitation` category, momentum, approval, conversation, sharing and reach weights are
  **zero**. Order is freshness, the viewer's language and followed reciters (subscriptions/affinity),
  and channel quality only.
- No "Trending" badge or rank number on Qur'an recitation; Explore shows a "Recently added
  recitations" rail instead of a trending rail for that category.
- Detected Qur'an in other categories (tafsir, lectures) is ranked normally; the rule is per category,
  admin-editable as a list of "no popularity ranking" categories.

### 2.9 Randomness and long-tail exploration

Two separate, admin-tunable mechanisms. Both apply to Home, Explore, related and the automatic
featured pick, and both are visible in preview-as.

**(a) Rotation among near-equal items.** A fixed order makes the same video win every time when two
videos score 0.612 and 0.609. Items whose scores are close are shuffled, so they rotate between page
loads, but never in a way that duplicates or skips across pages.

- **Bands**: walk the ranked list; a band starts at an item and holds every following item whose score
  is within δ of it (default δ = 0.03 on the 0–1 scale). Items are shuffled inside their band only.
- **Max displacement**: no item moves more than *d* places from its unshuffled rank (default 4), so a
  wide band cannot pull a weak item to the top.
- **Seeded**: the shuffle uses a seeded generator, `seed = hash(viewerKey, surface, loadSeed)`. Every page
  load gets a new `loadSeed`, so the order rotates between loads. The "load more" cursor carries
  `loadSeed`, the pool version and the viewer-state version, so pages 2, 3… are slices of the **same**
  shuffled list: no duplicates, no skips.
- **Guests and the cache**: a guest's `loadSeed` is one of *K* variants (default 8), chosen at random
  by the page on each load. Each segment page then has *K* cache entries instead of one, so rotation
  stays cacheable.
- **Math**: rank by `score`, form bands, then within a band order by `u = hash(seed, videoId)` (a
  uniform 0–1 value), subject to `|newRank − rank| ≤ d`.

Pinned slots, subscription slots, series-next and playlist-next never move.

**(b) Long-tail exploration (impression-based).** Videos that rarely reach a page never collect the
signals they would need to rank. Two levers, each with a cap so quality holds:

- **Exploration slots** (epsilon-greedy): a share ε of each page (default 10 % on Home, 1 of 12 in
  related, a 12-card "New voices" rail on Explore) is filled from the **under-exposed pool**. A video is
  under-exposed while it has fewer than **T impressions** (default 1,000) on that surface family. It
  enters the pool only above a quality floor: channel quality Q ≥ 0.4, no open reports, channel at
  least 24 h old, and every hard filter in 2.7. The draw is seeded like (a), with probability
  proportional to `(1 − imp/T) · (0.5·Q + 0.5·W_prior)`.
- **Impression boost** (soft, in the main score): `+ β · max(0, 1 − imp/T)` with β = 0.05 by default.
  It decays to zero as impressions reach T.
- **Ejection**: after 200 impressions, a video whose watch-through is in the bottom 20 % for its format
  leaves the pool early. This stops clickbait from riding exploration.
- **Caps**: exploration never exceeds 30 % of a page, never takes position 1 on Home, and never takes
  the featured slot unless the admin turns that on (RD5).

Exploration needs impressions, which are recorded cheaply as described in 5.1.

| Setting | Default | Range |
|---|---|---|
| Band width δ | 0.03 | 0–0.10 |
| Max displacement d | 4 | 0–10 |
| Guest seed variants K | 8 | 1–16 |
| Exploration share ε (Home / related / Explore rail) | 10 % / 1 of 12 / 12 cards | 0–30 % |
| Impression threshold T | 1,000 | 100–10,000 |
| Impression boost β | 0.05 | 0–0.20 |
| Quality floor Q | 0.4 | 0–1 |
| Ejection | bottom 20 % watch-through after 200 impressions | 0–50 %, 50–1,000 |

## 3. Featured video

### 3.1 Where a single featured video appears

| Surface | Who sets it today | Proposed |
|---|---|---|
| Home hero | nobody (newest landscape) | Admin manual pins, else automatic |
| Explore top | none | New featured slot: admin manual pins, else automatic "Explore pick" |
| Channel page spotlight | channel owner in Studio (trailer / returning) | Unchanged; automatic fallback when the owner set nothing (F6) |

### 3.2 Resolution order (per request)

```
manual pins for this surface, active now, matching audience + language, by priority
   └─ skip a pin that is unavailable (not publicly visible, in review, deleted, reported-hidden)
   └─ skip a pin this viewer finished (F2)
automatic pick (3.4)
   └─ skip watched, unsafe, Shorts (F7)
newest ready landscape video in the viewer's language (today's rule, last resort)
```

The **mode switch** per surface is **Manual** or **Automatic**:

- **Automatic**: pins are ignored; the algorithm picks.
- **Manual**: pins win while one applies to the viewer; when none applies (none active, all
  expired, all unavailable or all watched by this viewer), the slot **falls back to the algorithm**,
  never to an empty frame. The admin page shows a warning "No pin applies to guests in Arabic now:
  Automatic is showing" with the video it fell back to.

### 3.3 Manual pins (admins)

Each pin is a row:

| Field | Values |
|---|---|
| Video | any **published** video, picked with the live autocomplete (`/api/suggest/video`) showing thumbnail, title, channel, duration and state; a video in review, private, unlisted, removed or NSFW-flagged cannot be picked |
| Surface | Home, Explore |
| Audience | Everyone · Guests · Signed-in · Subscribers of the video's channel · Not subscribed |
| Language | Any · English · Arabic (the viewer's UI language) |
| Schedule | optional start and end time (shown in the admin's time zone, stored UTC); "no end" allowed |
| Priority | 1–100; ties go to the newest pin |
| Note | why it is pinned (shown in history) |

Rules:

- A pin that becomes unavailable is skipped at once (the request checks visibility on the pin's
  `search_videos` row by primary key), and the scheduler marks it **Unavailable** within 10 minutes
  and tells admins in the admin alerts. It comes back on its own if the video is published again,
  until its end time.
- A pin past its end time becomes **Expired** and stays in the list for 30 days, then is purged
  (soft-delete rule for admin data).
- Changes are audited (`ranking:featured:<surface>`), apply at once with an **Undo** toast, and show in
  preview-as before saving.
- Replaces the hard-coded `HOME_HERO_EXCLUDED` with a "Never feature automatically" list on the same
  page (F8).

Channel owners keep setting their own channel's featured video (trailer and returning video) in
Studio. That is unchanged; admins do not override a channel page.

### 3.4 Automatic pick

Eligible: landscape, ready, an HD thumbnail, duration ≥ 2 min, published ≤ 7 days ago (≤ 30 days
when nothing qualifies), channel quality Q ≥ 0.5, not on the "never feature" list, every hard filter
in 2.7.

| Audience | Automatic hero |
|---|---|
| Guest | Highest featured-weight score in the segment, rotated (below) |
| Signed-in, no subscriptions | Same pool re-scored with affinity; skip watched |
| Signed-in, with subscriptions | The best unwatched upload from a subscribed channel in the last 48 h if its score is at least 80 % of the best overall (F10); else as above |
| Channel acting as itself | As signed-in, never its own video |

**Rotation**: the guest hero changes every 6 hours (F3), using the seeded shuffle of 2.9(a): the pick is the top-1 of the top 5 after a
seeded shuffle with seed (segment, 6-hour bucket), so caching still works and the slot is not the
same video all day. Signed-in viewers see the next one of the five once they watch the current one.

**Channel page automatic fallback** (F6): the channel's newest landscape video from the last 30 days;
else its highest watch-through video; skipping videos the viewer finished.

## 3b. Related videos, up next and autoplay

### 3b.1 Where it applies

| Surface | Rule |
|---|---|
| Watch page "Up next" (first card) and related shelf (12) | Ranked list below; card 1 is what autoplay plays |
| Playlist playback | The playlist's next item always comes first (unchanged); at the playlist's end, the end screen and autoplay use the ranked list for the **last** video, skipping every item of that playlist |
| Shorts next | Ranked Shorts list (Shorts weights), seeded per Shorts session, instead of newest-first for everyone |
| Embeds | Unchanged: the embed's own playlist only, or end-screen suggestions as guest (embeds never act as the viewer) |

### 3b.2 Candidate sources (each bounded and indexed)

| Source | Query | Up to |
|---|---|---|
| Series next | `lib/series.ts` on the channel's index rows (exists) | 1 |
| Same playlist (when watching from one) | next items of that playlist | 5 |
| **Co-watched** | new `related_covisit(video_id, other_id, weight, day)`, PK `(video_id, other_id)`, read `WHERE video_id = ? ORDER BY weight DESC LIMIT 30` | 30 |
| Same channel | `search_videos (channel_id, created_at)` | 40 |
| Same category, viewer language | `search_videos (category, created_at)` with a language predicate | 100 |
| Tags and title words | FTS on the seed's title and tags (exists) | 50 |
| Same scholar | other channels linked to the same scholar profile (needs the link, RV7) | 20 |
| Under-exposed in the same category | 2.9(b) pool | 10 |

**Co-watch, cheaply.** When a viewer opens a video from a related card, Up next or autoplay, the watch
URL already carries the origin. The existing view event gets one more field, `from=<videoId>`, and no
user id. The impression aggregator (5.1) counts `(from, to)` pairs in memory and writes them **once
a day**, only pairs seen at least 3 times. Each video keeps its top 50 pairs, and weights decay with a
30-day half-life. Nothing is written per view.

### 3b.3 Score

> **rel(c | seed, viewer) = Σ wᵢ · simᵢ(c, seed) + w_q · quality(c) + w_p · P(c, viewer) − penalties**

| Similarity signal | Plain words | Math | Default weight |
|---|---|---|---|
| Co-watch | Share of viewers who went from the seed to this video | `covisit(seed,c) / max covisit(seed,·)` | 0.25 |
| Category | Same category | 1 / 0 | 0.15 |
| Tags and title | Overlap of tags and title words | Jaccard(tags ∪ words) | 0.15 |
| Same channel | Same channel as the seed | 1 / 0 | 0.10 |
| Same scholar | Same scholar, other channel | 1 / 0 | 0.05 |
| Language | Viewer's language (as L in 2.2) | multiplier | — |
| Quality | Watch-through + approval + channel quality (2.2) | `0.5·W + 0.2·A + 0.3·Q` | 0.20 |
| Freshness | Gentle, so classics still appear | `2^(−age/720 h)` | 0.05 |
| Affinity (signed in) | As in 2.2 | P | 0.05 |

**Order of the list**

1. Playlist next, if the viewer is watching from a playlist.
2. Series next, if one exists.
3. The rest by `rel`, after band shuffle (2.9a) and one exploration slot (2.9b).

### 3b.4 Rules

- **Never** the video itself. **Never** a watched video (R4 thresholds) for signed-in viewers. No
  filling the list with watched videos as today; the shelf is shorter instead (RV3). Guests skip
  videos watched in this tab session.
- **Channel cap**: at most 4 of 12 from the seed's channel, and at most 2 in a row (RV2). Series and
  playlist next do not count toward the cap.
- **Format**: a long video's list holds long videos; a Short's next holds Shorts.
- **Safety**: every hard filter of 2.7 applies, plus NSFW-flagged seeds get an empty related list.
- **Qur'an recitation (consistent with R1)**: when the seed is a recitation, popularity terms (co-watch
  weight from counts, approval, reach) are zero for candidate recitations. The list orders by the same
  reciter (channel), the next surah (series-like: surah number from the title or category metadata,
  RV6), the viewer's language for translation or tafsir, then freshness. No "most watched" recitation
  ordering. Recitations shown after non-Qur'an seeds are ranked like any video, with popularity zero.

### 3b.5 Audiences

| Viewer | Related list |
|---|---|
| Guest | Seed-only: one edge-cached list per (video, language, seed variant) |
| Signed-in | Seed + affinity (small weight) + watched removed; cached per viewer for 60 s |
| With subscriptions | As signed-in, plus a 0.05 boost for subscribed channels; the cap still applies |
| Channel acting as itself | As signed-in; its own videos keep the same-channel cap (it is watching its own channel's video) |
| History paused or "Don't personalise" | As guest, with watched still skipped when history exists |


New admin-web page **Videos admin › Feed & featured** (`/feed-tuning`).

### 4.1 Layout

- **Surfaces** tabs: Home · Explore · Shorts shelf · Featured · Related.
- **Randomness** panel on every surface tab: band width, max displacement, guest seed variants,
  exploration share, impression threshold, boost, quality floor and ejection (2.9).
- **Weights**: a slider and a number box per weight with its range (0–1, step 0.01), the default as a
  tick, and the plain-words explanation from 2.2. Weights are shown normalised ("Freshness 25 %").
- **Rules**: diversity caps, watched thresholds, exploration share, subscription share σ, freshness
  half-lives (6–336 h), language mode, report threshold, "no popularity ranking" categories.
- **Safety** (read-only): the hard filters of 2.7.
- **Featured**: the Manual/Automatic switch per surface, the pin list (thumbnail, audience, language,
  schedule, state chip: Live · Scheduled · Expired · Unavailable · Fallback showing) and the "never
  feature" list.
- **Presets**: Balanced (default), Fresh, Community favourites (engagement-heavy), Discovery
  (exploration 25 %), Calm (no momentum, no trending badges). Applying a preset fills the draft; it
  is not live until published.
- **Preview as** (section 4.2).
- **History**: every published version with who, when and the note; a diff of changed values;
  **Restore** on any row.

### 4.2 Preview as

- Pick **Guest** (with language en/ar), **a user** or **a channel**; on the Related tab also pick
  **a video** (live autocomplete with thumbnail) to see its Up next and related list via the shared live autocomplete
  (`/api/suggest/user`, `/api/suggest/channel`; opens with initial results).
- Two columns, **Live** and **Draft**, each showing the featured video and the first 24 cards with
  rank, score and the top three contributing signals per card ("Freshness 0.21 · Watch-through 0.17 ·
  Subscribed 0.10"). Moved cards show ▲/▼ and their old rank; new ones are marked "New".
- **Randomness in preview**: a **Re-roll** button draws a new load seed; "Show bands" outlines cards
  that share a band; exploration cards carry an "Exploring · 240 / 1,000 impressions" chip; a
  "Randomness off" toggle shows the pure ranked order next to it.
- Summary line: overlap of the two pages, channels per page, category mix, share of exploration and
  subscription slots, languages.
- The preview runs the same code as production (`POST /api/admin/feed/preview` in admin-api calls an
  internal api-videos route with the draft config) and **writes nothing** (no impressions, no state).
- Previewing as a specific user reads that user's derived state and subscriptions: **audited** as
  `ranking:preview:user:<id>` and available to admins only (R8). Moderators can preview as guest.

### 4.3 Publishing, history, undo

- Config is one JSON document, versioned in a `feed_config_versions` table in `REPORTS_DB`
  (version, json, note, actor, created_at, restored_from) with the live pointer in `site_settings`
  (`ranking:live_version`), written in one `db.batch` with the audit row, like
  `apps/admin-api/src/lib/siteSettings.ts`.
- Optimistic concurrency like app-config: publish carries the version it was based on; 409 if
  another admin published meanwhile.
- On publish, admin-api writes the document to KV `FEED_CONFIG` key `live` (api-videos reads it with a
  60 s isolate cache) and asks the scheduler to rebuild pools now.
- **Undo** toast (8 s, `u` key) after publish; later, **Restore** from History publishes the old
  version as a new one. Pins apply at once with Undo; deleting a pin is a soft delete restorable for
  30 days.
- Zod validation per field with ranges; an out-of-range value never saves.
- Roles: new permission `ranking:manage` for `super_admin` and `admin`; `moderator` can view the page,
  preview as guest and see history (R8). Audit keys `ranking:*` get an area in
  `apps/admin-api/src/lib/audit/feed.ts` `describeKey`.

### 4.4 A/B split

Not now (R7). At today's traffic an A/B test cannot tell a 5 % change in click-through from noise:
with a 5 % baseline it needs about 120,000 impressions per arm, weeks at current volume. Build the
measurement now (impressions, clicks, watch time per surface; phase 1) and the split later, when
daily viewers pass about 50,000.

When built: up to 2 drafts run against Live, each with a share of signed-in viewers (bucket =
hash(userId, experimentId) mod 100). Guests are not bucketed (no identifier is kept). Metrics per arm
on the History tab: click-through rate, qualified views per visit, watch minutes per visit, 7-day
return rate, Shorts swipe-through. The unused `apps/web/src/hooks/useExperiment.ts` scaffolding is
replaced, not extended.

## 5. Performance and cost

### 5.1 Storage

| Store | What | Size | Written |
|---|---|---|---|
| search D1 `video_scores` | one row per listed video: smoothed rates, percentiles, base score per surface, updated_at | ~200 B × videos | scheduler, only when a value changed by more than 0.01 |
| search D1 index | `(surface_format_lang, base_score DESC)` | | |
| KV `FEED_POOLS` | `pool:<surface>:<format>:<lang>:<version>`: top 500 ids with features | ~60 KB each, ~16 keys | every 10 min |
| NOTIFICATIONS_DB `feed_viewer_state` (PK `user_id`, next to `channel_subscriptions` so one batch reads both) | affinity top-k, watched ids (last 500, compact), languages, opt-out | ≤ 4 KB per viewer | at most once per viewer per hour, from the watch-event queue |
| Durable Object `IMPRESSIONS` (4 shards, the `VIEW_COUNTER` pattern) | in-memory impression counts per (video, surface) and co-watch pairs | memory only | — |
| Analytics Engine `FEED_IMPRESSIONS` | one data point per video per shard per hour: index = video id, doubles = impressions on home, explore, related, shorts, featured | — | hourly flush from the DO |
| search D1 `video_scores.impressions_*` | cumulative impressions per surface family (for T) | in the existing row | with the score update, only when changed |
| search D1 `related_covisit` (PK `video_id, other_id`) | top 50 co-watched per video, decayed weight | ~50 rows × videos | daily flush, pairs seen ≥ 3 times |
| REPORTS_DB `feed_config_versions`, `featured_pins` | config and pins | small | admin actions |

**No full scans.** Every query is by primary key or ordered by an index with a `LIMIT`. A test fails
when `EXPLAIN QUERY PLAN` of any feed query shows `SCAN` (section 7).

**Recording impressions cheaply.** The page reports cards that were at least half visible for one
second. Ids are batched in the browser and sent in one `navigator.sendBeacon` when the tab is hidden,
and every 60 s while scrolling: about 2–3 beacons per viewer per day, never one per card. The beacon
carries surface and video ids only, with no user or session id. api-videos forwards it to one of 4
`IMPRESSIONS` Durable Object shards, chosen at random. A shard adds the counts in memory and flushes
once an hour, one Analytics Engine data point per video. The hourly scheduler run reads one Analytics
Engine SQL query (`SUM` grouped by video for the last hour) and adds the totals to `video_scores` for
videos that changed. If a shard is evicted, up to an hour of approximate counts is lost, which is
acceptable for exploration. **Clicks** need no new writes: card links carry `src=<surface>&pos=<n>`,
and the existing view event already records a traffic source in `analytics_daily`, so click-through
is views by source divided by impressions.

Counters the job needs (qualified views, completions, likes, comments, shares) come from existing
writes, rolled up per video per hour by the processor from the events it already consumes, plus the hourly
impression totals above. The scheduler reads only videos whose counters changed since
its last run (a dirty set kept in KV by the queue consumer), not the catalogue.

### 5.2 Estimates

Assumptions: 4.5 feed pages per daily viewer, 20 % signed in, 40 % of guest pages miss the edge cache
in their colo at 1 k viewers falling to 5 % at 1 M; catalogue 2 k / 20 k / 100 k listed videos;
10 % of videos change counters per hour. Workers Paid included: 10 M requests, D1 25 B rows read and
50 M rows written, KV 10 M reads and 1 M writes, Analytics Engine 10 M data points per month.

| Per month | 1 k daily viewers | 100 k | 1 M |
|---|---|---|---|
| Feed page requests | 135 k | 13.5 M | 135 M |
| D1 rows read (viewer state + subscriptions + pins + pool rebuild) | ~3 M | ~0.3 B | ~3 B |
| D1 rows written (scores ×3 for indexes + viewer state) | ~0.4 M | ~10 M | ~45 M |
| KV reads (pools, config misses) | ~60 k | ~2 M | ~8 M |
| KV writes (pools) | ~70 k | ~70 k | ~70 k |
| Impression beacons → DO requests (2.5 per viewer per day) | 75 k | 7.5 M | 75 M |
| DO duration (4 shards) | idle | ~0.3 M GB-s | ~1.3 M GB-s |
| AE points (hourly flush, 1 per video per shard) | 0.2 M | 14 M | 58 M |
| Co-watch D1 rows written (daily, ≥ 3 sightings, ×2 for index) | ~10 k | ~2 M | ~18 M |
| **Added cost** | **$0** | **≈ $3–5** | **≈ $45–60** |

At 1 M daily viewers that is roughly: DO requests $11, DO duration $11, Analytics Engine $12, D1
writes over the included 50 M about $13, KV and the rest under $5. This is about $0.0015 per viewer
per month. Related lists add no request: `/api/recommendations` is already called once per watch page,
and co-watch adds one 30-row primary-key read to it.

Workers requests grow only by the impression beacons above: the page already makes one list call, and it becomes one feed call. CPU for
re-ranking 500 candidates is under 2 ms. The per-viewer unit cost at 1 M daily viewers is about
$0.0015 per viewer per month, inside the cap's per-view budget.

What would break the budget, and is ruled out: one Analytics Engine point or Queue message per impression (~$800/month at 1 M), per-impression D1 or KV writes (1 M viewers × 100 cards
= $3 k/month in D1 writes), R2 history listings per request (class A, ~$120/month at 1 M), and
per-request Workers AI.

### 5.3 Caching

- Guest pages: Cache API per (surface, format, language, pool version, page) for 120 s, plus the
  browser `max-age=60`.
- Signed-in pages: `private, no-store`; the per-viewer result is kept in the Cache API under a hash of
  the viewer id for 60 s (as `/api/recommendations` does) so "load more" and back-navigation are free.
- Featured: resolved with the page; pins are cached in the isolate for 60 s and invalidated on
  publish.

### 5.4 Machine learning

None in the first version: every number above is explainable on the admin page. A later option
(phase 4, decision R12) is Workers AI multilingual text embeddings (`bge-m3`) computed once per video
at publish, to improve affinity across languages. No third-party AI.

## 6. Privacy (GDPR)

- **New per-viewer setting**: content languages (Settings › Language), used by R2.
- **Stored per signed-in viewer**: `feed_viewer_state` only (affinity top 20 categories and top 50
  channels with decayed weights, the last 500 watched ids, content languages, opt-out flag, updated
  time). It is derived from watch history and likes the platform already keeps.
- **Retention**: affinity decays (30-day half-life); the row is deleted after 180 days without a visit.
- **Erase**: `eraseUserNotifications` (processor, `notifications-store.ts`) deletes the row with the
  subscriptions and likes it already erases; a test asserts it.
- **Pause history**: no new affinity; watched exclusion uses what exists.
- **Don't personalise** (Settings › Privacy, default off): served as a guest; turning it on deletes the
  derived row at once.
- **Guests**: no cookie and no identifier. The "seen this session" list stays in sessionStorage and is
  never sent. Analytics Engine data points carry the segment, never an IP, user id or session id.
- **Impressions and co-watch** carry no user, session or IP: a beacon holds surface and video ids, and
  co-watch pairs are kept only when seen at least 3 times in a day.
- **Admin preview as a user** is audited and admin-only.

## 7. Tests

All on the local stack with seeded data; no paid AI, no deployed QA.

- **Pure functions** in `packages/shared-types/src/feed/`: smoothing, percentiles, score, diversity,
  exploration draw, featured resolution. Golden tests with a fixed clock and seed.
- **Seed builder**: 300 videos over 30 channels, en/ar/none, every category, long and Short,
  counters shaped to known answers, plus unsafe ones (in review, rejected, reported, NSFW, blocked
  channel, unlisted, private, scheduled). Every spec seeds its own data and deletes it.
- **Properties**: no unsafe video on any surface; channel cap and category cap hold on every page;
  no watched video; no repeats across "load more"; the channel identity never sees its own videos;
  Qur'an recitation order unchanged when only popularity counters change.
- **Cost guards**: every feed SQL runs through `EXPLAIN QUERY PLAN` (fails on `SCAN`); a request
  budget test asserts rows read per signed-in request ≤ 300 and zero D1 writes per request.
- **Featured**: schedule start and end with a fake clock; unpublish, review hold, delete and report-hide
  each fall back; a viewer who finished the pin sees the next pin; Manual with no applicable pin shows
  Automatic; audience and language targeting.
- **Randomness**: with a fixed seed the order is reproducible; across 3 pages with one seed, there are
  no duplicates and no skips; no item moves more than d places; pinned, series and playlist slots
  never move; guests get at most K distinct orders.
- **Exploration**: share never above ε or 30 %; nothing below the quality floor; ejection after the
  threshold; boost is zero at T.
- **Impressions**: a beacon of 24 ids becomes 24 counts after one flush (fake clock); shard eviction
  loses at most one window; no request writes D1.
- **Related**: never the seed, never watched (signed in), channel cap, series and playlist next first,
  playlist end skips the playlist's items, Shorts stay Shorts, recitation seeds ignore popularity.
- **Admin E2E (local)**: change a weight → preview shows the diff → publish → home order changes →
  Undo restores; moderator cannot publish; preview-as-user writes an audit row.
- **Privacy**: erase removes `feed_viewer_state`; opt-out deletes it and serves the guest page.

## 8. Rollout

| Phase | What | Switch |
|---|---|---|
| 0 | Measurement: impression beacons and the `IMPRESSIONS` shards, click source on card links, co-watch pairs, hourly counter roll-ups, `video_scores`. Fix #990 by reading trending candidates from the index. | none visible |
| 1 | **Featured**: manual pins + automatic pick, admin page Featured tab and preview. Smallest, most visible step. | per surface, Automatic until the first pin |
| 2 | **Shadow**: the new home and Explore ranking runs beside today's for every request in a 1 % sample, logging overlap and the hard-filter count; admin preview live. Two weeks. | `ranking:mode = shadow` |
| 3 | Explore trending and rails switch; related and Up next switch (shadow first). | per surface: `off → shadow → on` |
| 4 | Home for guests, then signed-in, then subscriptions. | per surface and audience |
| 5 | A/B split, embeddings (when R7/R12 say so). | later |

Each switch is on the admin page, audited, and can go back to `off` (today's order) at once.

## 9. Owner decisions

### Ranking

| # | Question | Recommendation |
|---|---|---|
| R1 | Qur'an recitation: no popularity ranking (freshness, language, followed reciters only), no trending badge? | **Yes**, editable list of such categories |
| R2 | Language: filter to the viewer's languages, or boost them? | **Filter** for long videos (UI language + chosen content languages); videos with no language and the `quran_recitation` category are shown to everyone |
| R3 | Subscription share on the first home page | **30 %** (7 of 24), 15 % later pages |
| R4 | What counts as watched (excluded) | finished ≥ 90 %, or ≥ 50 % in the last 30 days |
| R5 | Channel identity personalisation | the channel's own subscriptions + the account's history; its own videos excluded |
| R6 | Exploration share | **10 %** home, a "New voices" rail on Explore |
| R7 | A/B split now? | **No**; build measurement now, A/B at ~50 k daily viewers |
| R8 | Who may preview as a specific user | **Admins only, audited**; moderators view and preview as guest |
| R9 | "Don't personalise" switch | **Yes**, Settings › Privacy, off by default; turning it on deletes derived data |
| R10 | Report threshold to drop a video from ranked surfaces | **3** distinct reporters (1 trusted) until a moderator closes them |
| R11 | Shorts on home | **One Shorts shelf** after row 2; none in the main grid |
| R12 | Embeddings later (Workers AI bge-m3) | **Later**, phase 5, only if affinity misses across languages |
| R13 | Topic picker for new signed-in viewers | **Not now**; reconsider with data |
| R14 | Explore personalisation | **Language only**; subscribed channels down-weighted ×0.7 |
| R15 | New channels in exploration | after **24 h** and with no open moderation case |
| R16 | www home timeline | **Keep separate** (CMS-curated); optional "videos for you" block later |

### Featured

| # | Question | Recommendation |
|---|---|---|
| F1 | Default mode | **Automatic** on Home and Explore; switch to Manual when a pin is added |
| F2 | Hide a manual pin from a viewer who watched it? | **Yes, when finished (≥ 90 %)**: that viewer gets the next pin, then Automatic. Guests always see it (no history). |
| F3 | Automatic rotation | every **6 h** among the top 5 |
| F4 | Pin targeting | Everyone · Guests · Signed-in · Subscribers of the video's channel · Not subscribed; × Any/en/ar |
| F5 | Who may pin | **admin and super admin**; moderators view (or a new "Editor" role, if wanted) |
| F6 | Channel page with no spotlight set | **Automatic**: newest landscape in 30 days, else best watch-through |
| F7 | Shorts as the automatic hero | **Never**; a manual pin may be a Short (letterboxed) |
| F8 | Remove the hard-coded hero exclusion | **Yes**, move it to the "Never feature" list |
| F9 | Automatic hero age limit | **7 days**, 30 when none qualify |
| F10 | Subscribed viewers' hero | the best fresh (48 h) unwatched upload from a subscription when it scores ≥ 80 % of the best |
| F11 | Several active pins for one audience | **Highest priority wins**; optional "rotate between pins" toggle per surface |
| F12 | Share featured with the www timeline | **No**, separate lists |

### Related videos

| # | Question | Recommendation |
|---|---|---|
| RV1 | Co-watch signal ("people who watched X also watched") | **Yes**, from the view event's `from` field, aggregated daily, pairs seen ≥ 3 times, no user id |
| RV2 | Same-channel cap in a related list of 12 | **4**, at most 2 in a row; series and playlist next exempt |
| RV3 | Fill with watched videos when too few unwatched ones (today's behaviour)? | **No**: a shorter list instead |
| RV4 | Language | **Viewer's language first** (multiplier); the seed's language counts as one of them |
| RV5 | Playlist end | Up next = related list of the last video, **skipping every playlist item** |
| RV6 | Qur'an recitation seeds | **Same reciter, then next surah, then language, then freshness**; no popularity |
| RV7 | Same scholar | **Add a scholar link** to channels (from scholar sites) before using it; weight 0.05 |
| RV8 | Shorts next | **Ranked** (Shorts weights, seeded per Shorts session) instead of newest-first |
| RV9 | Autoplay after a recitation | **Autoplay the same reciter's next surah**, never an unrelated video |
| RV10 | Subscription boost in related | **Small (0.05)**, the channel cap still applies |

### Randomness and exploration

| # | Question | Recommendation |
|---|---|---|
| RD1 | Rotate near-equal items between page loads | **Yes**: band shuffle δ = 0.03, max displacement 4, stable across "load more" |
| RD2 | Guest rotation | **8 seed variants** per segment page (keeps caching) |
| RD3 | Exploration share | **10 %** Home, **1 of 12** related, "New voices" rail on Explore; hard cap 30 % |
| RD4 | Impression threshold T and boost β | **1,000** impressions, β = 0.05 |
| RD5 | Exploration in the featured slot | **Off** by default; admin may allow it |
| RD6 | Record impressions with batched beacons and 4 sharded Durable Objects (≈ $25/month at 1 M) | **Yes** |
| RD7 | Randomness for Qur'an recitation lists | **Yes, band shuffle only**; exploration slots allowed for new reciters above the quality floor |

## Related

- [AUN-VIDEO-CATEGORIES](AUN-VIDEO-CATEGORIES-admin-managed-categories.md) (category list)
- [AUN-VIDEO-REVIEW](AUN-VIDEO-REVIEW-pre-publication-review.md) (review states in the visibility rule)
- [AUN-SCALABILITY](AUN-SCALABILITY-scalability-audit.md) (index-first listings)
- [AUN-SEO](AUN-SEO-search-visibility.md) (public / unlisted / private)
- [AUN-CHANNEL-SECTIONS](AUN-CHANNEL-SECTIONS-channel-sections.md) (channel spotlight)
- [AUN-COST](AUN-COST-cost-monitoring.md) (cost monitor)
