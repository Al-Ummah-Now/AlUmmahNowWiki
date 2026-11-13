[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Search visibility (SEO): audit and spec

| | |
|---|---|
| **ID** | `AUN-SEO` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (videos web), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) (www), [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md). It also touches [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) and [openauth](../repos/openauth.md) (noindex only), and the scholar sites that are being specified separately |
| **Status** | **in progress**: owner decisions D-SEO-1 to D-SEO-12 taken 2026-11-13; being implemented in phases |
| **Last updated** | 2026-11-13 |

Read from `origin/main` on 2026-11-13: AlUmmahNow [`de8c284`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/de8c284f8a1b84b7008c416a68e2f007de55ab5c), AlUmmahNowUI [`b521637`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/b5216371b3aa37a8308f1bc3b6491af4b8689a82), AlUmmahNowCMS [`d661daf`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/tree/d661daf7d266cb6804637cf616fa7b5fa680b21b). The live checks fetched production pages as Googlebot (smartphone) and as desktop Chrome, read-only. Lighthouse 12.6 ran locally in mobile mode, because the PageSpeed Insights API was over its daily quota.

## Progress

Defect fixes that need no decision, opened 2026-11-13. Live behaviour is in [Environments: Search engines](../guides/environments.md#search-engines-crawler-rules).

| Gap | Fix | PR |
|---|---|---|
| #1 soft 404s | Real 404 (owner sees their private one, noindex); 503 when the API is down | [#1158](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1158) |
| #2 QA/stage indexable | Non-production videos: noindex + `Disallow: /` | [#1158](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1158) |
| #6 (part) `?vid=` | 301 to `/video/{id}`; every link canonical | [#1158](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1158) |
| #7 (part) `/ar` title | Site name in the page's language | [#1158](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1158) |
| #8 utility pages, private hosts | Videos viewer-only pages noindex | [#1158](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1158) |
| #8 utility pages, private hosts | admin, APIs, realtime, media | [#1160](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1160) |
| #8 utility pages, private hosts | auth, profile/account, auth admin | [Auth#342](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/342) |
| #8 utility pages, private hosts | cms (public media stays crawlable) | [CMS#104](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/104) |

410 after purge waits on [D-SEO-4](#d-seo-4-deleted-content-status). Everything else waits on the decisions below.

## Summary

- **www is in reasonable shape.** It renders on the server, returns real 404s, sets canonical and hreflang tags, and has JSON-LD, a sitemap, RSS and a production-only robots.txt.
- **The videos site is mostly invisible to search.**
  - It has no robots.txt of its own, no sitemap and no structured data.
  - Missing videos and playlists return **200** with `index, follow` (soft 404s).
  - The main content (video lists, descriptions, the channel link) appears only after JavaScript runs.
  - Every video card links to a duplicate URL (`/video?vid=`) that has no title, canonical or description.
- **QA and stage videos are open to crawlers.** `videos.qa` and `videos.stage` serve `index, follow`, and their robots.txt has no rules.
- **Search Console is not set up.** There is no `google-site-verification` or Bing DNS record on `alummahnow.net`; the only TXT records are Proton Mail's. A web search for `site:alummahnow.net` found no pages.

## What exists today

### Hosts, robots and sitemaps (live, 2026-11-13)

| Host | `/` | robots.txt | Sitemap | Notes |
|---|---|---|---|---|
| `alummahnow.net` | 301 → www (keeps path) | (redirects) | (redirects) | Correct |
| `www.alummahnow.net` | **302** → `/en/` (cookie, then Accept-Language) | `Allow: /`, `Disallow: /auth/`, `Sitemap:` | `/sitemap.xml`, 14 URLs | Good base; problems in [gaps](#gaps-ranked) |
| `videos.alummahnow.net` | 307 → `/en` | **Only Cloudflare's managed content-signals comment block.** No rules, no `Sitemap:` line | **404** | The app has no `robots.ts` or `sitemap.ts` |
| `videos.qa` / `videos.stage` | 200 | Same comment block, **no Disallow** | none | **`index, follow`** on every page |
| `www.qa` / `www.stage` | 200 | `Disallow: /` | – | `X-Robots-Tag: noindex, nofollow`, which is correct |
| `auth`, `profile.auth`, `account`, `admin`, `admin.auth`, `cms`, `media`, `videos.api` | redirect to login, or 200 | Comment block only | none | **No noindex anywhere** except `/invite/:token` and CMS admin responses |

The 1,248-byte robots.txt on every non-www host is the one Cloudflare's **managed robots.txt** generates: content-signal definitions with no `Content-Signal:` line and no rules. Cloudflare prepends it to the origin's file, so it will stay at the top after each app adds its own rules.

### Page types: videos site (`videos.alummahnow.net`)

| Page | URL | Status | `<title>` | Description | Canonical / hreflang | OG / Twitter | JSON-LD | Content without JS |
|---|---|---|---|---|---|---|---|---|
| Home | `/en`, `/ar` | 200 | "Al Ummah Now" (English on `/ar` too) | Root English: "Excerpts from scholars' clips about the state of the nation today" | none | `website`, 512² icon, `summary` | none | "Loading…"; no videos |
| Watch | `/{l}/video/{id}` | 200 | Video title only, no brand | **None.** Most videos have an empty description and there is no fallback | Self, en + ar, **no x-default** | `video.other`, `/thumb/{id}.jpg`, `og:video` = embed, `twitter:card=player` ✅ | **none** | Title in a `<p>` if the API answers within 700 ms. No `<h1>`, description, channel link or date. Poster is a CSS background |
| Watch (legacy) | `/{l}/video?vid={id}` | 200 | Root default | Root default | **none** | Root default | none | Nothing. **Every video card links here** (`components/videoCard/index.tsx:24`) |
| Missing or private video | `/{l}/video/{bad}` | **200 (soft 404)** | Root default | Root default | none | Root default | – | "Video not found" after JS |
| Shorts | Same watch URL; no `/shorts` route | 200 | as watch | as watch | as watch | 405×720 player card ✅ | none | as watch |
| Channel | `/{l}/@handle`; `/channels/{id}` (200, canonical → `@handle`) | 200, missing → 404 ✅ | Channel name, no brand | Channel description, often empty | Self `@handle`, en + ar | **Inherits root:** `og:url` = site root, icon image | none | Header `<h1>` yes; video tabs "Loading…" |
| Playlist | `/{l}/playlist/{id}` | 200, **missing → 200** | Root default | Root default | none | Root default | none | Nothing |
| Search | `/{l}/search?q=` | 200 | Root default | Root default | none | Root default | none | `index, follow` |
| Explore, Sections, Videos, Channels | `/{l}/explore` etc. | 200 | Some are "X \| Al Ummah Now" | Some | Relative alternates, no canonical | Override drops `og:image` and `og:url` | none | Client lists |
| Live list | `/en/live`, `/ar/live` | 200 | "Live Streams \| Al Ummah Now" | Lecture wording | none | **`og:url` hard-coded to `https://alummahnow.com/...`** and a 32×32 favicon as the image | none | Client |
| Live watch | `/{l}/live/{id}` | 200 | Generic "Live \| Al Ummah Now" | none | none | none | none (no `BroadcastEvent`) | Client |
| Community post | No permalink; `/channels/{id}?tab=community` | – | – | – | – | – | – | Client |
| Embed | `/embed/v/{id}` | 200 (missing → 200) | Video title | Root | – | – | – | `noindex, nofollow` |
| Share image | `/thumb/{id}.jpg` | 200 / 404 ✅ | – | – | – | Real size (1080×1920 Short, 1280×720 landscape), cached 1 h ✅ | – | – |
| oEmbed | `/oembed` | 200 / 404 ✅ | – | – | – | – | – | – |
| Signed-in pages (history, library, settings, upload, notifications, profile) | | 200 | Root default | Root default | none | – | – | **`index, follow`** |
| Studio | `/{l}/studio…` | 200 | | | | | | `noindex, nofollow` ✅ |
| 404 | any | 404 ✅ | "Al Ummah Now" | Root | – | – | – | **Two robots metas** (`noindex` and `index, follow`) |
| Help, privacy, terms | `/{l}/help` etc. | **404** | | | | | | Not on either site; www has no CMS rows for them on prod |

Sources: `apps/web/src/app/layout.tsx` (root metadata), [`lib/embed/watch-metadata.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/web/src/lib/embed/watch-metadata.ts), [`lib/channel-metadata.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/web/src/lib/channel-metadata.ts), [`components/video/WatchPageSkeleton.tsx`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/web/src/components/video/WatchPageSkeleton.tsx), [`app/en/live/page.tsx`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/web/src/app/en/live/page.tsx), [`app/thumb/[file]/route.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/web/src/app/thumb/%5Bfile%5D/route.ts).

**`publishedAt`:** an optional field in `packages/shared-types/src/video.ts`. Only the scheduler sets it, when it publishes a scheduled video. Normal uploads have only `dateCreated` (upload time). There is no D1 column. The field that is being added should become the `uploadDate` source; see [rules](#structured-data-json-ld).

### Page types: www (`www.alummahnow.net`)

| Page | Status | Title | Description | Canonical / hreflang | JSON-LD | Notes |
|---|---|---|---|---|---|---|
| Home `/{l}/` | 200 | Site name | Tagline + default | Self, en, ar, x-default ✅ | `Organization`, `WebSite` (no `SearchAction`) | Server-rendered. Lighthouse perf 99 |
| Articles list `/{l}/articles/` | 200 | "Articles \| Al Ummah Now" | "Announcements and updates from the Al Ummah Now team" | Self + pair | none | Wording is team news, not a content site |
| Article `/{l}/articles/{slug}/` | 200 | `seo_title` or title, with `\| site` | `seo_description` → excerpt → … **live: card post shows the site default "مرئيات إسلامية ومجتمع"** | Self; only languages that exist; x-default ✅ | `Article` (headline, image, dates, inLanguage, author) | Other-language URL: 200, `noindex` + canonical to the original ✅ |
| Videos list `/{l}/videos/` | 200 | "Videos \| …" | ok | Self | **One `VideoObject` per facade** | thumbnailUrl is a **signed Bunny URL that expired at 2026-11-13 17:00 UTC** (unsigned → 403). The first item has no thumbnailUrl. description = title |
| Scholars `/{l}/scholars/`, `/{l}/scholars/{slug}/` | 200 / 404 | "{name}: articles and videos" | Bio excerpt | Self + pair | `ProfilePage` + `Person` (sameAs = channel), `VideoObject` per video | Production has no scholars yet |
| CMS page `/{l}/{slug}/` | 200 / 404 | `seo_title` or title | `seo_description` → summary | Self; a borrowed language gets canonical to the original but stays **indexable** | none | |
| Search `/{l}/search` | 200 | "Search \| …" | ok | Self | none | Empty search is **indexable**; `?q=` is noindex |
| Contact `/{l}/contact/` | **302** → videos contact | | | | | Permanent move, so it should be 301/308 |
| 404 | 404 ✅ | localized | default | **Canonical → home** (should have none) | – | noindex ✅ |
| RSS `/{l}/rss.xml` | 200 | | | | | English feed is empty (all posts are Arabic) |

Sources: [`src/lib/seo.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/src/lib/seo.ts), [`src/layouts/BaseLayout.astro`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/src/layouts/BaseLayout.astro), [`src/pages/sitemap.xml.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/src/pages/sitemap.xml.ts), [`src/lib/edge.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/src/lib/edge.ts), CMS [`src/routes/public-api.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/src/routes/public-api.ts) (`/sitemap`, `alternates()`), [`docs/SCHOLARS.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/docs/SCHOLARS.md).

**www sitemap today:**
- `/en|ar/articles/` and `/en|ar/videos/` each appear **twice**. The 0016 seed added them as CMS pages, and the static list repeats them.
- Static entries have no `lastmod`. Posts have `lastmod` but **no hreflang**, even when they are linked translations. There is no `x-default` and no image extension.
- Unfeatured scholar posts are included. That is intended: scholar pages are public and indexable.

**CMS:** pages and posts have `seo_title`, `seo_description`, `cover` and `show_in_sitemap`, and the editor has a "Search & sharing" card with an AI suggest. There is no OG-image override, no noindex field, no IndexNow or sitemap ping on publish, and **no slug history**, so renamed slugs return 404.

### Core Web Vitals (Lighthouse 12.6, mobile, lab)

| Page | Perf | LCP | CLS | TBT | Weight | LCP element |
|---|---|---|---|---|---|---|
| videos watch `/en/video/37bc…` | 69 | **8.4 s** | 0.022 | 60 ms | 2.3 MB | Poster/player, after the client fetch |
| videos home `/en` | 74 | **7.6 s** | 0.005 | 50 ms | 1.6 MB | `img.home-hero-img`, which only exists after the client fetch |
| videos channel `/en/@AlUmmahNow` | 94 | 2.6 s | 0.014 | 40 ms | 2.2 MB | Cover `<img>` |
| www home `/en/` | 99 | 1.7 s | 0 | 0 ms | 0.5 MB | Hero wordmark |
| www article `/ar/articles/judgment-is-only-for-allah/` | 85 | 4.4 s | 0 | 0 ms | 0.5 MB | Card PNG from `cms.` at `w=960` |

There is no CrUX field data, because there is too little traffic. On the videos site, Font Awesome CSS from cdnjs blocks rendering, images are `unoptimized`, and the watch poster is a CSS background that is never preloaded. Lighthouse SEO was 92 on watch and channel (missing meta description) and 100 elsewhere. Accessibility was 98–100.

### Analytics and verification

- **www:** Cloudflare Web Analytics is injected by the zone.
- **Videos:** in-house analytics only. A CSP unit test forbids third-party analytics. `/api/analytics/performance` exists and can receive web-vitals.
- **Verification:** no Google or Bing verification on either site, neither as a meta tag nor as a DNS TXT record.

### Scholar pages today and the coming scholar sites

- The v1 scholar pages are on www at `/{l}/scholars/{slug}/` ([UI#38](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/38), [CMS#67](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/67)).
  - The videos channel page links to them through `lib/scholars/lookup.ts`, using CMS `GET /scholars/by-channel/:id`.
  - Articles are mirrored to the channel's Community tab as `cms-<id>` posts that link back to www.
- The `<slug>.alummahnow.net` spec is being written separately. Its wiki branch had no content on 2026-11-13, so the [canonical rules below](#scholar-sites) are this page's proposal for that spec to adopt or change.
- Host derivation in `apps/web/src/lib/scholars/sites.ts` will need a scholar-host case.

## Gaps, ranked

Impact is how much indexing or traffic is lost; effort is S (≤ 1 day), M (2–4 days) or L (a week or more). **Bold** rows are the top 10.

| # | Gap | Example: now → expected | Impact | Effort |
|---|---|---|---|---|
| **1** | **Soft 404s for missing, private and deleted videos and playlists** | `/en/video/00000000-…` → 200 `index, follow` "Al Ummah Now". Expected: 404 (or 410 after purge), `noindex` | High | S |
| **2** | **QA and stage videos are indexable** | `videos.qa…/en` → 200 `index, follow`, robots.txt without rules. Expected: `Disallow: /` + `X-Robots-Tag: noindex` on every non-production host (www already does this) | High | S |
| **3** | **No robots.txt rules or sitemaps on videos** | `/robots.txt` = comments only; `/sitemap.xml` 404. Expected: a sitemap index with video, channel and playlist sitemaps | High | M |
| **4** | **Watch page content needs JavaScript** | No `<h1>`, description, channel link or date in the HTML; LCP 8.4 s. Expected: server-rendered `<h1>`, description, `<a href=/@handle>`, `<time>` and a poster `<img fetchpriority=high>` | High | M |
| **5** | **No `VideoObject` on watch pages** (and no `BroadcastEvent` for live) | none → `VideoObject` with name, description, `thumbnailUrl=/thumb/{id}.jpg`, `uploadDate`, `duration`, `embedUrl`, `interactionStatistic`, `author` | High | S |
| **6** | **Internal links go to the duplicate `?vid=` URL; watch links to `/channels/{id}`** | Cards → `/en/video?vid=X`. Expected: `/en/video/X`, with a 301 from `?vid=`; channel links → `/@handle` | High | S |
| **7** | **Titles and descriptions** | Watch has no description; videos titles have no brand; `/ar` home title and description are English; default text is lecture-specific. Expected: [templates](#page-templates) | Med–High | S |
| **8** | **Utility pages and other hosts are indexable** | `/en/search`, `/en/history`, `/en/settings`, `/en/upload`, auth, profile, `account.`, admin, cms, `videos.api` → no noindex. Expected: noindex + `Disallow` | Medium | S |
| **9** | **www structured data and sitemap defects** | Signed Bunny thumbnails that expire within a day; a VideoObject with no thumbnail; VideoObjects on list pages; duplicate sitemap URLs; no hreflang for translated posts | Medium | S |
| **10** | **No Search Console or Bing, and no SEO checks in CI** | Nothing is verified, so there is no coverage data. Expected: a Domain property (DNS TXT, covering all subdomains including scholar sites), sitemaps submitted, an `seo` release spec | High (blind) | S |
| 11 | Channel, playlist, home and list pages lack OG and own metadata | Channel `og:url` = site root, 512² icon, `summary` | Medium | S |
| 12 | No post permalinks | Community posts and mirrored articles only exist inside `?tab=community` | Medium | M |
| 13 | Live pages | `og:url` → `alummahnow.com`; generic title; no `BroadcastEvent` | Medium (when live is used) | S |
| 14 | No legal or help pages | `/en/privacy`, `/en/terms`, `/en/help` → 404 on both sites | Medium (trust, Ads, app stores) | S (CMS pages) |
| 15 | Videos LCP: Font Awesome CSS blocks rendering, images unoptimized, hero rendered client-side | Home LCP 7.6 s | Medium | M |
| 16 | www trailing slash | `/ar/articles/x` and `/x/` both 200. Expected: 308 to the slash form | Low | S |
| 17 | Renamed slugs 404 with no redirect; removed content is 404, never 410 | | Low–Med | M |
| 18 | `og:image` on www is the original upload (up to 10 MB) with no width, height or alt | | Low | S |
| 19 | 404 pages: two robots metas (videos); canonical → home (www) | | Low | S |
| 20 | `/` redirects are 302/307 and vary on cookie and Accept-Language | Acceptable for a language chooser. Keep, but make `x-default` point at `/en/` (done on www) | Low | – |
| 21 | No IndexNow or ping on publish; English RSS empty; www articles list described as "team announcements" | | Low | S |

## Spec

### Principles

1. **One canonical URL for each piece of content, on the host that owns it.** Videos, Shorts, live streams, channels, playlists and posts belong to `videos.`. Articles and CMS pages belong to www. A scholar's profile belongs to their scholar site once it exists. Every other surface links or embeds and never competes.
2. **What crawlers see is server-rendered.** Title, description, `<h1>`, primary text, primary links and the LCP image are in the first HTML response.
3. **Status codes tell the truth.** 200 means indexable content exists. Missing content is 404, purged content is 410, an outage is 503 with Retry-After, and a moved page is 301/308.
4. **Non-production never gets indexed.** Every QA and stage host sends `X-Robots-Tag: noindex, nofollow` and robots.txt `Disallow: /`, decided from the environment rather than the request host.
5. **Neutral wording.** Copy describes a video and community site for creators and scholars, not a lecture library.

### Page templates

Titles use `{page} | Al Ummah Now` in English and `{page} | الأمة الآن` in Arabic, matching www. On videos this should be a Next `title.template`. The brand is left off only where the page *is* the brand (home). Titles are cut to about 60 characters before the brand, and descriptions to 150–160, at a word boundary.

| Page | Title (en / ar) | Description (when the field is empty) | OG / Twitter | JSON-LD |
|---|---|---|---|---|
| Videos home | "Al Ummah Now: videos, Shorts and live" / "الأمة الآن: مرئيات ومقاطع قصيرة وبث مباشر" | See [default description](#d-seo-6-default-description-and-tagline) | `website`, 1200×630 brand image, `summary_large_image` | `WebSite` + `SearchAction` (`/{l}/search?q={search_term_string}`), `Organization` (`@id` shared with www) |
| Watch / Short | `{title} \| …` | `{description}`, else en "Watch “{title}” from {channel} on Al Ummah Now." / ar «شاهد "{title}" من {channel} على الأمة الآن.» | Keep today's `video.other` and player card; add `og:description`, `og:locale:alternate`, `article:published_time` | `VideoObject` (below) + `BreadcrumbList` (Channel → Video) |
| Live | `{title} (live) \| …` / `{title} (مباشر) \| …` | Same pattern | Player card | `VideoObject` with `publication: BroadcastEvent {isLiveBroadcast, startDate, endDate}` |
| Channel | `{name} \| …` | `{description}`, else "{name} on Al Ummah Now: {n} videos" / «{name} على الأمة الآن: {n} مرئي» (number agreement per the [glossary](../guides/glossary.md)) | `profile`, avatar or cover, `og:url` = canonical | `ProfilePage` → `mainEntity`: `Person` (when linked to a scholar, using the scholar site's `@id`) or `Organization`; `sameAs` = scholar site; `interactionStatistic` (followers) |
| Playlist | `{title} \| …` | `{description}`, else "A playlist of {n} videos from {channel}" | First video's `/thumb` | `ItemList` of watch URLs + `BreadcrumbList` |
| Post permalink (new) | First line of the post | First 160 characters | Image if there is one | `SocialMediaPosting` (author → channel) |
| Search, explore, library, history, settings, upload, notifications, profile, auth error | localized | – | – | `noindex, follow` (search) or `noindex, nofollow` (the rest) |
| Embed | `{title} \| …` | – | – | `noindex, indexifembedded`; drop `nofollow` |
| www home | Site name | Tagline + default | as today | `Organization` (+ `sameAs` socials), `WebSite` + `SearchAction` |
| www article | `{seo_title or title} \| …` | `seo_description` → excerpt → first text → **never the site default** | `article` + `article:published_time`, `article:author`, `og:image:width/height/alt` from a 1200-wide variant | `Article` (or `NewsArticle` if the editors mark it as news), `author` → scholar `Person` `@id`, `BreadcrumbList` |
| www list page (videos, articles, curated) | as today | as today | as today | **`ItemList` of URLs**, not `VideoObject`s |
| www / scholar-site scholar page | `{name}: articles and videos` | Bio excerpt | Avatar | `ProfilePage` + `Person` |
| Legal and help (CMS pages) | as CMS | as CMS | default | `WebPage` + `BreadcrumbList` |

**Arabic JSON-LD:** values are in the page's language (`inLanguage: "ar"`), with `alternateName` for the other-language name when there is one. Do not transliterate. Dates are ISO 8601 UTC. Numbers are Western digits in JSON-LD; Arabic-Indic digits are only for display.

### Structured data (JSON-LD)

**`VideoObject` for a watch page** (built from one server-side `EmbedVideo`; add `publishedAt`, `views` and `likes` to it):

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "@id": "https://videos.alummahnow.net/ar/video/{id}#video",
  "name": "{title}",
  "description": "{description or the fallback sentence}",
  "thumbnailUrl": ["https://videos.alummahnow.net/thumb/{id}.jpg"],
  "uploadDate": "{publishedAt ?? dateCreated}",
  "duration": "PT{m}M{s}S",
  "embedUrl": "https://videos.alummahnow.net/embed/v/{id}",
  "inLanguage": "ar",
  "isFamilyFriendly": true,
  "interactionStatistic": [
    {"@type": "InteractionCounter", "interactionType": {"@type": "WatchAction"}, "userInteractionCount": 11},
    {"@type": "InteractionCounter", "interactionType": {"@type": "LikeAction"}, "userInteractionCount": 0}
  ],
  "author": {"@type": "Person|Organization", "name": "{channel}", "url": "https://videos.alummahnow.net/ar/@{handle}"},
  "publisher": {"@id": "https://www.alummahnow.net/#organization"}
}
```

Rules:

- **`thumbnailUrl` is always the stable `/thumb/{id}.jpg`**, never a signed Bunny or R2 URL. That includes www and scholar sites, which currently embed tokens that expire within a day.
- **`uploadDate`** is the moment the video became public. Use `publishedAt` when it is set; the field being added must be set for normal uploads too, not only by the scheduler. Fall back to `dateCreated`.
- **`contentUrl`** is the stable public R2 MP4 ([D-SEO-11](#d-seo-11-a-stable-contenturl)), never the signed HLS URL. api-videos names it in the playable view (`contentUrl`) only for public videos that have the R2 rendition. The web keeps it only as an absolute https URL on a video that is not unlisted or private, and `VideoObject` emits it only then. Bunny-only videos keep `embedUrl` alone. The video sitemap's `<video:content_loc>` follows once `/api/sitemap` carries the URL (AlUmmahNow#1200).
- `hasPart` `Clip` entries come from chapters when they exist (Epic 8).
- Only on public, ready, published videos. Never emit JSON-LD for anything a signed-out visitor cannot watch.

**Other types:**

- Organization `@id` = `https://www.alummahnow.net/#organization` on every host.
- A scholar's `Person` `@id` = `https://{slug}.alummahnow.net/#person`, or `https://www.alummahnow.net/{l}/scholars/{slug}/#person` until scholar sites ship.
- `BreadcrumbList` on watch, playlist, article, CMS and scholar pages.

### URL, canonical and hreflang rules

| Content | Canonical | hreflang | Other URLs that show it | What they do |
|---|---|---|---|---|
| Video | `videos.…/{l}/video/{id}`: **each language self-canonical** ([D-SEO-1](#d-seo-1-watch-page-language-urls)) | en, ar, x-default=en | `/{l}/video?vid=`, `/video/{id}`, `?list=`, `?t=`, `?utm_*` | `?vid=` → **301** to canonical. Query params keep the page but the canonical drops them. Unknown locale → 308 |
| Short | `videos.…/{l}/shorts/{id}` ([D-SEO-10](#d-seo-10-shorts-urls)) | en, ar, x-default=en | `/{l}/video/{id}` of a Short | **301** → `/shorts/{id}` |
| Live | `videos.…/{l}/live/{id}` | en, ar, x-default=en | – | After the stream ends, if it becomes a video: 301 → the watch URL |
| Channel | `videos.…/{l}/@{handle}` | en, ar, x-default=en | `/channels/{id}`, `/c/{handle}` | **301** → `@handle` (today only the canonical is set). An old handle (after a rename) → 301 if handle history exists |
| Playlist | `videos.…/{l}/playlist/{id}` | en, ar, x-default | – | – |
| Post (new) | `videos.…/{l}/post/{id}` | en, ar | `?tab=community` | link |
| Article (staff) | `www/{l}/articles/{slug}/` | Linked translations only, plus x-default | Other-language URL (borrowed) | noindex + canonical (today) |
| Article (scholar) | www without the tier; the white-label site's host with it ([D-SEO-2](#d-seo-2-and-d-seo-3-scholar-content)) | as above | www article, site article, community post | See [scholar sites](#scholar-sites) |
| CMS page | `www/{l}/{slug}/` | Linked translations + x-default | Borrowed language | **Make it noindex**, as articles already are |
| Embeds | none (noindex) | – | – | – |

- **Query parameters:** canonicals never carry `utm_*`, `t`, `list`, `index`, `autoplay`, `lang` or `tab`. List pages keep `?page=N` self-canonical, as www does today.
- **Trailing slash:** www uses a slash, videos doesn't. Neither changes, but each host 308s the other form.
- **Every hreflang set is reciprocal** and includes `x-default` (English).

### Scholar sites

Decided by the owner (D-SEO-2/3) and specified in [AUN-SCHOLAR-SITES §4.4](https://github.com/Al-Ummah-Now/AlUmmahNowWiki/blob/docs/scholar-sites-spec/epics/AUN-SCHOLAR-SITES-scholar-sites.md) ([Wiki#22](https://github.com/Al-Ummah-Now/AlUmmahNowWiki/pull/22)). **The canonical follows the brand host.** This page adopts those rules:

| Content | Scholar without the tier | White-label site on `<slug>.alummahnow.net` | White-label site on its own domain |
|---|---|---|---|
| Profile / About | www `/{l}/scholars/{slug}/` | The site's About page. The www scholar page becomes a directory entry with `rel=canonical` to the site | Same, on the domain |
| Articles and posts | www `/{l}/articles/{slug}/` | The site. Existing www URLs **301** to the site when the tier is granted (SS6) | The domain |
| Videos and Shorts | videos watch page | **videos watch page**; the site's watch page has `rel=canonical` to videos | **The site's watch page**; the videos watch page points `rel=canonical` to it, and the videos sitemap leaves it out |
| Sitemap / robots.txt | www | Each host serves its own; www and videos sitemaps leave out site-canonical URLs | Same |
| Losing the tier | – | 302 to www for 90 days; canonicals return to www/videos within one cache cycle | Same |

**SEO-side requirements on the sites:**
- **JSON-LD:** `Person` `@id` = `https://{site-host}/#person` (or www `/{l}/scholars/{slug}/#person` without the tier). The channel's `ProfilePage` uses it in `sameAs` / `mainEntity`.
- **Hosts:** an unknown wildcard host answers 404, never a 200 shell. Reserved labels are never site slugs: `www videos api auth account profile admin cms media images realtime live qa stage mail status help docs static cdn`.
- **Non-production:** QA/stage site hosts are always noindex.
- **Videos canonical override (own domains):** the videos watch page reads the site registry (KV `SITES`, `channel:<id>`) to set the cross-host canonical. The videos sitemap and `VideoObject` follow the same lookup.

### Sitemap architecture

**Videos** (a new `app/sitemap*` route set, generated from D1 by cursor and cached at the edge for 1 h):

```
https://videos.alummahnow.net/sitemap.xml            ← sitemap index
  /sitemaps/static.xml                                home, videos, channels, live list, explore (en + ar, hreflang)
  /sitemaps/videos-{n}.xml                             ≤ 10,000 videos each, newest first, video extension
  /sitemaps/channels-{n}.xml                           public channels with ≥ 1 public video, hreflang
  /sitemaps/playlists-{n}.xml                          public playlists with ≥ 1 public video
  /sitemaps/live.xml                                   upcoming and live streams (video extension, <video:live>yes)
  /sitemaps/posts-{n}.xml                              (after post permalinks ship)
```

- **Video entries:**
  - `<loc>` is the canonical URL, with `<lastmod>` = `dateModified`.
  - The video extension carries `thumbnail_loc` (`/thumb/{id}.jpg`), `title`, `description` (fallback sentence if empty), `player_loc` (embed), `duration`, `publication_date`, `family_friendly`, and `live` where it applies.
  - Only public, ready and published videos. Shorts are included.
- **Freshness:** a newly published video is in the sitemap within 1 h (edge TTL). The sitemap index `lastmod` is the newest item's.
- **Removal:** private, deleted or unpublished videos drop out at the next rebuild. Their URLs start returning 404/410 at the same moment.

**www:** keep one `sitemap.xml` until it passes about 5,000 URLs, then split it into an index. Fixes:

- Dedupe the static and CMS list pages.
- Add `lastmod` to every entry.
- Add hreflang + x-default to translated posts and pages.
- Add `image:image` for covers.
- Drop scholar entries once scholar sites ship.

**Scholar sites:** one `sitemap.xml` per host, as above.

**Submission:**

- Every production robots.txt has a `Sitemap:` line. Sitemaps are submitted in Search Console (one Domain property) and Bing.
- **IndexNow** (Bing, Yandex) is pinged on publish, update and delete from the CMS and from api-videos. Google has no ping API; it relies on the sitemap `lastmod`. Both hosts use key `9e1b0c3eec45ae20f6d905e0d4c5b004`, served at `/<key>.txt` (www from AlUmmahNowUI `public/`, videos from `apps/web/public`). Both ping production only.
  - **www (CMS):** a stateless 30-minute cron sends every post and page that changed or went live in the last 35 minutes.
  - **videos (api-videos):** D1 triggers on `search_videos` (search migration `0030`) queue a video in `indexnow_pending` when its row is inserted, when its `content_hash`/`visible`/`is_short` changes, or when it is deleted. That table holds exactly the videos everyone may see, so this covers publish, a scheduled release (the scheduler goes through the processor's search sync), Unlisted/Private → Public, title/description/tag edits, and delete/private/unlisted/moderation (removed URLs are sent too). The triggers catch every writer (api-videos, processor, admin-api). Views, likes and the reconcile touch leave the hash alone, so they never ping. The 10-minute cron (`lib/indexnow.ts`) sends `/{en,ar}/video/<id>` (Shorts: `/shorts/<id>` plus the old `/video/<id>`) in one POST of at most 10,000 URLs. It removes the rows it sent; 429, 5xx and network errors retry on the next run. QA and stage only empty the queue.

### robots rules

| Host | robots.txt | Page-level |
|---|---|---|
| `www` (prod) | `Allow: /`; `Disallow: /auth/`, `/preview`, `/*?q=`; `Sitemap:` | noindex: search with `q`, borrowed languages, preview, paged scholar views, errors |
| `videos` (prod) | `Allow: /`; `Disallow: /api/`, `/*/studio`, `/*/settings`, `/*/upload`, `/*/history`, `/*/library`, `/*/notifications`, `/*/profile`, `/*/dashboard`, `/*/analytics`, `/dev/`; **do not disallow `/embed/`, `/thumb/` or `/oembed`** (Google must fetch them); `Sitemap:` | `noindex` on the same pages (in case of external links), search (`noindex, follow`), embeds (`noindex, indexifembedded`), errors |
| `auth`, `profile.auth`, `account`, `admin`, `admin.auth`, `cms`, `videos.api`, `admin.api`, `realtime` | `Disallow: /` | `X-Robots-Tag: noindex, nofollow` on every response |
| `media`, `images` | `Allow: /` (images can rank in Google Images); no sitemap | – |
| Every QA and stage host | `Disallow: /` | `X-Robots-Tag: noindex, nofollow` from the environment |
| Scholar hosts | as www | as www |

**AI crawlers** ([D-SEO-8](#d-seo-8-ai-crawlers)), on every public host (www, videos, scholar sites):
- **Allowed:** search and answer bots that link back to the source: `Googlebot`, `Bingbot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Perplexity-User`, `Claude-SearchBot`, `Claude-User`, `DuckAssistBot`, `Applebot`.
- **Blocked** (`Disallow: /` each): training-only crawlers `Google-Extended`, `GPTBot`, `CCBot`, `ClaudeBot`, `anthropic-ai`, `Applebot-Extended`, `Bytespider`, `meta-externalagent`, `Meta-ExternalAgent`, `FacebookBot`, `cohere-training-data-crawler`, `Diffbot`, `Omgilibot`, `img2dataset`, `PanguBot`, `Timpibot`.
- **Content signals:** `Content-Signal: search=yes, ai-input=yes, ai-train=no` in Cloudflare's managed robots.txt (zone setting).

### Deleted, private and scheduled content

| State | Watch / channel / playlist | Sitemap | JSON-LD, OG | Embed, `/thumb`, oEmbed |
|---|---|---|---|---|
| Public, ready | 200, indexable | yes | yes | 200 |
| Processing or failed upload | 404 to signed-out visitors | no | no | 404 |
| Private (owner-only) | **404** for everyone but the owner. Never 403, which confirms the URL exists | no | no | 404 |
| **Unlisted** ([D-SEO-5](#d-seo-5-unlisted-videos)) | 200 to anyone with the link, `noindex`; never in lists, search, feeds, recommendations, playlists of others or sitemaps | no | OG yes (sharing), JSON-LD no | 200 |
| Scheduled (not yet public) | 404 until published, then 200. `uploadDate` = publish time | added on publish | – | 404 |
| Live upcoming | 200, indexable, `BroadcastEvent` with `startDate` | `live.xml` | yes | 200 |
| Soft-deleted (30-day restore window) | **404** (restorable) | removed | – | 404 |
| Purged, or deleted by an admin for policy | **410 Gone** | removed | – | 410 |
| Channel deleted | 404, then 410 after purge. Its videos follow the video rule | removed | – | – |
| API error / outage | **503 + `Retry-After: 120`**, never 404. Today `apiRequestServer` maps any error to `null`, so the channel layout returns `notFound()` | – | – | 503 |
| www post or page unpublished | 404 (today). Purged → 410 | removed | – | – |
| www slug renamed | 301 old → new ([D-SEO-7](#d-seo-7-slug-history-redirects-on-www)) | new only | – | – |

**Implementation note for videos:** the watch layout already loads the video anonymously in `generateMetadata`. Its result (found / not found / gone / error) should drive `notFound()` or a 410 or 503 response through middleware, instead of the client-side "Video not found" message. Signed-in owners still see their private video, because the client fetch goes through when the session is present (render a noindex owner view).

### Performance targets

**Targets** (p75, mobile, field data from Search Console CWV and in-house RUM):

| Metric | Target |
|---|---|
| LCP | ≤ 2.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.1 |
| TTFB, HTML | ≤ 600 ms |

**Lab budgets** (release check):

| Page | Lighthouse perf | LCP | JS |
|---|---|---|---|
| Watch, home (videos) | ≥ 85 | ≤ 3.0 s | ≤ 300 KB gzip on the first route |
| www | ≥ 95 | ≤ 2.0 s | – |

**Changes on the videos site:**

1. Render the hero and poster as `<img fetchpriority="high">` on the server, sized from `/thumb`, not CSS backgrounds, plus `<link rel=preload as=image>` on watch.
2. Self-host or subset Font Awesome, or replace it with the SVG icons already in Fanous, to remove the render-blocking cdnjs CSS.
3. Serve thumbnails through `images.alummahnow.net` resizing (`?width=` already exists) with `srcset`, instead of `unoptimized` full images.
4. Preload the main woff2 per locale.
5. Load `playerjs` only on pages with a player.

**Changes on www:** article card images use AVIF/WebP variants (they exist) and should not request PNG `w=960` for the LCP image.

**RUM:** send `web-vitals` (LCP, INP, CLS, TTFB) to the existing `/api/analytics/performance` from both sites, and add a CWV panel to admin analytics.

### Monitoring

1. **Search Console:** a Domain property for `alummahnow.net`, verified by a DNS TXT record. That covers www, videos and every scholar subdomain. Submit each sitemap. Bing Webmaster Tools imports from GSC. Weekly review of coverage, CWV and video indexing reports. The owner adds the TXT record, because the wrangler token cannot edit DNS.
2. **Release SEO spec** in each web repo's release gate (`seo.spec.ts`). It seeds its own public video, channel, playlist and article and deletes them afterwards, following the project's own-data rule. It checks, with Playwright's `request` and **no JavaScript**:
   - Status codes: public 200; missing, private and deleted 404/410; `?vid=` 301; non-production `X-Robots-Tag`.
   - `<title>` matches the template and is non-empty; meta description is non-empty and ≤ 160 characters.
   - Exactly one canonical, absolute, same host, no query string; hreflang reciprocal, including x-default.
   - Robots meta as the matrix says (one tag only).
   - JSON-LD parses, and the required fields exist per type (`VideoObject`: name, description, thumbnailUrl, uploadDate, duration, embedUrl). `thumbnailUrl` returns 200 `image/*` **without a token**.
   - OG: `og:image` returns 200 and its declared size matches the real one; `twitter:card` is `player` on watch.
   - SSR content: an `<h1>` with the video title and an `<a>` to the channel, both in the HTML.
   - `robots.txt` has a `Sitemap:` line; the sitemap index parses; the seeded video appears in it within one rebuild (or via a cache-bypass param on non-production); every sitemap `<loc>` sampled (20) returns 200.
3. **Unit tests** for the metadata builders: title truncation, Arabic fallback sentences, JSON-LD shapes.
4. **Weekly production crawl:** a scheduled read-only job samples 200 URLs from the production sitemaps and reports non-200s, missing tags and JSON-LD errors as a GitHub issue. Budget: zero AI, a few hundred requests.
5. **Rich results:** run Google's Rich Results Test by hand on one watch, one article and one channel after each phase.

## Phased plan

Updated after the owner's decisions. Each phase ships as PRs merged on green and goes out with the next release of each repo.

| Phase | Scope | Repos |
|---|---|---|
| **0: stop the damage** ✅ in PR | Real 404/503 (#1), non-production noindex (#2), private hosts and utility pages noindex (#8), `?vid=` 301 (#6), `/ar` title (#7) | AlUmmahNow, Auth, CMS |
| **1: decisions D-1, D-4, D-5** | x-default on every hreflang set (D-1); 410 after purge on API and pages (D-4); **Unlisted** visibility in API, Studio, upload, web and admin, plus a native issue (D-5) | AlUmmahNow, native issue |
| **2: be understood** | Title template + D-6 default description (from the copy PRs); channel, playlist and home metadata; `VideoObject` (with `contentUrl` from D-11 when an R2 MP4 exists), `BroadcastEvent`, `BreadcrumbList`, `WebSite` + `SearchAction`; videos sitemap index (videos, Shorts, channels, playlists, live) + `Sitemap:` line; www sitemap fixes, `ItemList`, unsigned thumbnails; `publishedAt` on every upload; AI-crawler robots rules (D-8); release `seo.spec.ts` | AlUmmahNow, UI, CMS |
| **3: URLs and media** | `/shorts/{id}` + 301 (D-10); R2 MP4 rendition + public `contentUrl` (D-11); www slug history + 301 (D-7); landing page + referrer source in in-house analytics (D-9); IndexNow | AlUmmahNow, UI, CMS |
| **4: fast and server-rendered** | Server-rendered watch, home, channel tabs and playlists (#4); LCP work, Font Awesome removal, RUM (#15); legal and help pages (#14); www trailing slash 308, borrowed-page noindex, 404 canonical (#16, #19) | AlUmmahNow, UI, CMS |
| **5: grow** | Post permalinks + `SocialMediaPosting` (#12); scholar-site SEO with AUN-SCHOLAR-SITES; handle history; chapters as `Clip`; weekly production crawl | all |

## Owner decisions (2026-11-13)

### D-SEO-1: Watch-page language URLs

**Decided:** both `/en/video/{id}` and `/ar/video/{id}` stand as their own canonical (a video's language is not known). Each page is self-canonical with an `en`/`ar` hreflang pair and `x-default` = `/en/`. The same applies to Shorts, channels, playlists, live and list pages.

### D-SEO-2 and D-SEO-3: Scholar content

**Decided:**
- White-label scholar sites are independent: their own content is canonical on their own host, including external custom domains.
- Scholars without the tier keep the www scholar page canonical.
- Details follow [AUN-SCHOLAR-SITES §4.4](https://github.com/Al-Ummah-Now/AlUmmahNowWiki/blob/docs/scholar-sites-spec/epics/AUN-SCHOLAR-SITES-scholar-sites.md); see [Scholar sites](#scholar-sites) above.

### D-SEO-4: Deleted content status

**Decided:** 404 during the 30-day restore window, then **410** after purge. The `admin_deletions` row with `purged_at` set is the tombstone.

### D-SEO-5: Unlisted videos

**Decided:** add a real **Unlisted** visibility. It is link-only, and never appears in lists, search, sitemaps or feeds. Its pages are noindex.

**Model:** `isPublic: false` plus `isUnlisted: true`.
- Every list, index and feed that already requires `isPublic` keeps unlisted videos out by default.
- Only single-item reads by id (watch, embed, oEmbed, `/thumb`, playback, comments, views) admit them.

### D-SEO-6: Default description and tagline

**Decided:** tagline option 4 from the copy audit. The default description is its long line:
- en: "Upload videos, go live and post to your channel, and see what the community is sharing, in Arabic and English."
- ar: «ارفع المرئيات وابدأ البث المباشر وانشر في قناتك، وتابع ما يشاركه المجتمع، بالعربية والإنجليزية.»

It ships in the copy PRs ([AlUmmahNow#1168](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1168) for the videos site, [UI#79](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/79) for www). SEO work uses it wherever a page has no description of its own and never sets its own default text.

### D-SEO-7: Slug history redirects on www

**Decided:** yes. Renamed slugs keep a history row in the CMS, and www answers **301** old → new.

### D-SEO-8: AI crawlers

**Decided:**
- Allow AI search and answer bots that link back.
- Block training-only crawlers on all public hosts.
- See [robots rules](#robots-rules) for both lists.

### D-SEO-9: Analytics

**Decided:** our own analytics only, with no third party and no cookies. The in-house analytics are extended with **landing page** and **referrer source** (search engine / social / direct / other site, from `document.referrer`).

### D-SEO-10: Shorts URLs

**Decided:** add `/{l}/shorts/{id}`, a vertical viewer.
- `/{l}/video/{id}` of a Short **301**s there.
- Sitemaps and JSON-LD use the Shorts URL.
- Video URLs stay ID-only.

### D-SEO-11: A stable `contentUrl`

**Decided:** expose a stable public **R2 MP4** as `contentUrl` for videos that have an R2 rendition. Bunny-only videos keep `embedUrl` only.

**The rendition:**
- **One progressive MP4 at the 480p rung** (portrait: 480 wide), remuxed from the 480p HLS rung the transcoder already makes (`-c copy -movflags +faststart`, no second encode). Peak rate is 1.4 Mb/s + 128 kb/s audio; about **0.45 GB per hour** at CRF 23.
- **URL:** `https://media.alummahnow.net/v/{id}/{rev}/480p.mp4`, through the public R2 custom domain and CDN.
- **Headers:** `Cache-Control: public, max-age=31536000, immutable`, because the revision is in the path. `Content-Disposition: inline`. Range requests are supported.
- **Scope:** public, ready videos only. Private, unlisted and removed videos have no public MP4; their media stays under `/priv/`.

**Hotlinking and abuse:**
- Egress is free on R2, so the risk is request volume.
- A Cloudflare rate-limit rule on `media.*/v/*.mp4` (per IP, e.g. 60/min).
- CDN caching absorbs repeats.
- The cost-monitor gets an R2 Class B line for the bucket.

**Projected cost at the [AUN-SUBS](AUN-SUBS-subscriptions-plan.md) scales:**

| Scale | Library | Extra storage | Storage $/mo ($0.015/GB) | Reads (CDN-cached; ≤ 10 M Class B) | Total |
|---|---|---|---|---|---|
| S1 | 500 h | 0.23 TB | $3.4 | ≤ $3.6 | **≈ $7** |
| S2 (near the $500 cap) | 2,500 h | 1.1 TB | $17 | ≤ $3.6 | **≈ $21** |
| S3 | 5,000 h | 2.25 TB | $34 | ≤ $3.6 | **≈ $38** |

Transcode cost is negligible, because the MP4 is a remux of an existing rung.

### D-SEO-12: Search Console and Bing (owner steps)

The owner uses their own Google account. One **Domain property** covers every host, including scholar subdomains.

**Google Search Console:**
1. Open <https://search.google.com/search-console>, choose **Add property → Domain**, and enter `alummahnow.net`.
2. Google shows a TXT record like `google-site-verification=XXXXXXXX`. Copy it.
3. In Cloudflare, open **alummahnow.net → DNS → Records → Add record**:
   - Type **TXT**
   - Name **`@`** (the apex)
   - Content: the full `google-site-verification=…` value
   - TTL **Auto**
   - Save. Keep the existing Proton Mail TXT records.
4. Back in Search Console, click **Verify**. DNS usually propagates in minutes; retry after an hour if it fails.
5. **Sitemaps → Add a new sitemap**, one per host. The Domain property accepts full URLs:
   - `https://www.alummahnow.net/sitemap.xml`
   - `https://videos.alummahnow.net/sitemap.xml` (live once phase 2 ships; submitting earlier just shows "couldn't fetch")
   - Each white-label site: `https://{slug}.alummahnow.net/sitemap.xml`, and own domains in their own properties
6. **Settings → Users and permissions:** add any other account that should see the reports (Full or Restricted).

**Bing Webmaster Tools:**
1. Open <https://www.bing.com/webmasters>, sign in, and choose **Import from Google Search Console**. This brings the verified property and its sitemaps, with no DNS change.
2. If importing fails, add the site manually, choose **DNS verification**, and add the CNAME or TXT record Bing shows in Cloudflare DNS, as in step 3 above.
3. Under **Settings → IndexNow**, nothing is needed: the IndexNow key file is served by the sites once phase 3 ships.

**Own domains of white-label sites:** each is its own Domain property, verified the same way in that domain's DNS. The site's Studio SEO screen stores the token (AUN-SCHOLAR-SITES `seo_json`).
