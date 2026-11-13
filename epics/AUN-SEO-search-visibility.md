[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Search visibility (SEO): audit and spec

| | |
|---|---|
| **ID** | `AUN-SEO` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (videos web), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) (www), [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md). It also touches [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) and [openauth](../repos/openauth.md) (noindex only), and the scholar sites that are being specified separately |
| **Status** | **planned**: draft for owner review. No code has changed |
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
- **`contentUrl` is omitted.** The HLS URL is signed and expires; `embedUrl` is enough for Google ([D-SEO-11](#d-seo-11-a-stable-contenturl)).
- `hasPart` `Clip` entries come from chapters when they exist (Epic 8).
- Only on public, ready, published videos. Never emit JSON-LD for anything a signed-out visitor cannot watch.

**Other types:**

- Organization `@id` = `https://www.alummahnow.net/#organization` on every host.
- A scholar's `Person` `@id` = `https://{slug}.alummahnow.net/#person`, or `https://www.alummahnow.net/{l}/scholars/{slug}/#person` until scholar sites ship.
- `BreadcrumbList` on watch, playlist, article, CMS and scholar pages.

### URL, canonical and hreflang rules

| Content | Canonical | hreflang | Other URLs that show it | What they do |
|---|---|---|---|---|
| Video, Short | `videos.…/{L}/video/{id}`, where `{L}` follows [D-SEO-1](#d-seo-1-watch-page-language-urls) | D-SEO-1 | `/{l}/video?vid=`, `/video/{id}`, `?list=`, `?t=`, `?utm_*` | `?vid=` → **301** to canonical. Query params keep the page but the canonical drops them. Unknown locale → 308 |
| Live | `videos.…/{l}/live/{id}` | en, ar, x-default=en | – | After the stream ends, if it becomes a video: 301 → the watch URL |
| Channel | `videos.…/{l}/@{handle}` | en, ar, x-default=en | `/channels/{id}`, `/c/{handle}` | **301** → `@handle` (today only the canonical is set). An old handle (after a rename) → 301 if handle history exists |
| Playlist | `videos.…/{l}/playlist/{id}` | en, ar, x-default | – | – |
| Post (new) | `videos.…/{l}/post/{id}` | en, ar | `?tab=community` | link |
| Article (staff) | `www/{l}/articles/{slug}/` | Linked translations only, plus x-default | Other-language URL (borrowed) | noindex + canonical (today) |
| Article (scholar) | [D-SEO-2](#d-seo-2-canonical-home-for-scholar-content) | as above | www article, scholar site article, community post | See [scholar sites](#scholar-sites) |
| CMS page | `www/{l}/{slug}/` | Linked translations + x-default | Borrowed language | **Make it noindex**, as articles already are |
| Embeds | none (noindex) | – | – | – |

- **Query parameters:** canonicals never carry `utm_*`, `t`, `list`, `index`, `autoplay`, `lang` or `tab`. List pages keep `?page=N` self-canonical, as www does today.
- **Trailing slash:** www uses a slash, videos doesn't. Neither changes, but each host 308s the other form.
- **Every hreflang set is reciprocal** and includes `x-default` (English).

### Scholar sites

Coordination rules for the separate scholar-sites spec (`<slug>.alummahnow.net`), assuming [D-SEO-2](#d-seo-2-canonical-home-for-scholar-content) option A:

| Thing | Canonical home | Scholar site | www | Videos channel |
|---|---|---|---|---|
| Scholar profile | `https://{slug}.alummahnow.net/{l}/` | Self-canonical, `ProfilePage` + `Person` `@id …/#person`, `sameAs` → channel(s) and socials | `/{l}/scholars/{slug}/` → **301** to the scholar site ([D-SEO-3](#d-seo-3-www-scholar-pages-after-scholar-sites-ship)); the directory stays and links out | "Scholar site" link (server-rendered); channel JSON-LD `sameAs` + `author` → `#person` |
| Scholar article | Scholar site `/{l}/articles/{slug}/` | Self-canonical, `Article`, author `#person` | If featured: shown on home and the Articles list as a card **linking to the scholar site**. Any www article URL → 301 to the scholar site | Community post links to the scholar site URL |
| Scholar video | `videos.…/{L}/video/{id}` (always) | Facade or embed + `ItemList`; **no `VideoObject`** in lists. A video "page" on the scholar site, if built, has `canonical` → the watch URL | As today: facade, link to watch | Owner |
| Sitemap | – | `https://{slug}.alummahnow.net/sitemap.xml`: profile + articles, hreflang; **no videos** | Drops scholar profiles and scholar articles; keeps `/scholars/` | Video sitemap lists the scholar's videos |
| robots.txt | – | Per host: `Allow: /`, `Sitemap:` its own; non-production `Disallow: /` | – | – |
| Unknown or retired slug | – | Wildcard host for an unknown slug → **404** (never a 200 shell). A retired scholar → 410, or 301 to www `/scholars/` | – | – |
| Custom domain (later) | The custom domain | Subdomain → 301 to the custom domain, every path | Links use the custom domain | Links use the custom domain |

- **Reserved slugs** (never a scholar host): `www`, `videos`, `api`, `auth`, `account`, `profile`, `admin`, `cms`, `media`, `images`, `realtime`, `qa`, `stage`, `mail`, `status`, `help`, `docs`, `static`, `cdn`, plus any existing DNS label.
- **QA and stage** scholar hosts follow the environment pattern and are always noindex.

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
- **IndexNow** (Bing, Yandex) is pinged on publish, update and delete from the CMS and from api-videos. It is cheap and stateless. Google has no ping API; it relies on the sitemap `lastmod`.

### robots rules

| Host | robots.txt | Page-level |
|---|---|---|
| `www` (prod) | `Allow: /`; `Disallow: /auth/`, `/preview`, `/*?q=`; `Sitemap:` | noindex: search with `q`, borrowed languages, preview, paged scholar views, errors |
| `videos` (prod) | `Allow: /`; `Disallow: /api/`, `/*/studio`, `/*/settings`, `/*/upload`, `/*/history`, `/*/library`, `/*/notifications`, `/*/profile`, `/*/dashboard`, `/*/analytics`, `/dev/`; **do not disallow `/embed/`, `/thumb/` or `/oembed`** (Google must fetch them); `Sitemap:` | `noindex` on the same pages (in case of external links), search (`noindex, follow`), embeds (`noindex, indexifembedded`), errors |
| `auth`, `profile.auth`, `account`, `admin`, `admin.auth`, `cms`, `videos.api`, `admin.api`, `realtime` | `Disallow: /` | `X-Robots-Tag: noindex, nofollow` on every response |
| `media`, `images` | `Allow: /` (images can rank in Google Images); no sitemap | – |
| Every QA and stage host | `Disallow: /` | `X-Robots-Tag: noindex, nofollow` from the environment |
| Scholar hosts | as www | as www |

**AI crawlers:** Cloudflare's managed robots.txt is on, but no `Content-Signal` is set ([D-SEO-8](#d-seo-8-ai-crawler-content-signals)).

### Deleted, private and scheduled content

| State | Watch / channel / playlist | Sitemap | JSON-LD, OG | Embed, `/thumb`, oEmbed |
|---|---|---|---|---|
| Public, ready | 200, indexable | yes | yes | 200 |
| Processing or failed upload | 404 to signed-out visitors | no | no | 404 |
| Private (owner-only) | **404** for everyone but the owner. Never 403, which confirms the URL exists | no | no | 404 |
| Unlisted, if introduced ([D-SEO-5](#d-seo-5-unlisted-videos)) | 200, `noindex`, no sitemap; link-sharing works | no | OG yes (sharing), JSON-LD no | 200 |
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

| Phase | Scope | Repos | Size |
|---|---|---|---|
| **0: stop the damage (days)** | Non-production noindex + Disallow on videos and every non-www host (#2); noindex + `Disallow: /` on auth, profile, account, admin, cms and API hosts (#8); utility pages noindex (#8); soft 404 → 404 for video and playlist, and 503 on API errors (#1); `?vid=` → 301 and card links → `/video/{id}`, watch → `@handle` (#6); fix `alummahnow.com` in live OG (#13); www stops emitting signed thumbnails (#9); Search Console + Bing verification and sitemap submission (#10, owner) | AlUmmahNow, Auth, openauth, UI | S each |
| **1: be understood (1–2 weeks)** | Title template and descriptions (#7, #11); `VideoObject`, `BroadcastEvent`, `BreadcrumbList`, `WebSite` + `SearchAction` (#5); videos robots.txt + sitemap index with video sitemaps (#3); www sitemap fixes, list pages → `ItemList` (#9); `publishedAt` set for every upload; release `seo.spec.ts` in all three repos | AlUmmahNow, UI, CMS | M |
| **2: be fast and server-rendered (2–3 weeks)** | Watch, home, channel-tab and playlist content server-rendered (#4); LCP work and RUM (#15); legal and help pages as CMS pages (#14); 410 after purge; www trailing-slash 308, CMS borrowed-page noindex, 404 canonical (#16, #19) | AlUmmahNow, UI, CMS | M–L |
| **3: grow** | Post permalinks + `SocialMediaPosting` (#12); scholar sites under the matrix above; slug and handle history redirects (#17); IndexNow (#21); chapters as `Clip`; image sitemap; weekly crawl job | all | M |

## Decisions for the owner

### D-SEO-1: Watch-page language URLs

Every video has `/en/video/{id}` and `/ar/video/{id}`. Only the interface language differs; the title and description are the same text.

- **A (recommended):** the canonical is the URL in the **video's content language** (Arabic video → `/ar/…`). The other-language URL stays usable and sets its canonical to it. No hreflang on watch pages, and the sitemap lists one URL per video. This consolidates signals and halves crawling. It needs a content language per video: a field, or detection from the title's script.
- **B:** keep both indexable with hreflang en/ar + x-default (today, plus x-default). Simpler, but Google sees two near-duplicates per video.

### D-SEO-2: Canonical home for scholar content

- **A (recommended):** the scholar site is canonical for the scholar's profile and articles. www features link there.
- **B:** www stays canonical; the scholar site is a branded view with canonical tags to www. Easier, but the scholar sites build no search presence of their own.

### D-SEO-3: www scholar pages after scholar sites ship

- **A (recommended):** `/{l}/scholars/{slug}/` 301s to the scholar site, and the www directory stays.
- **B:** keep them as summaries with canonical tags to the scholar site.

### D-SEO-4: Deleted content status

404 during the 30-day restore window, then 410 after purge or an admin's permanent delete (recommended). The alternative is 410 immediately.

### D-SEO-5: Unlisted videos

Today "unlisted" is treated as private. Should a real unlisted state exist (200 by link, noindex, not in lists or sitemaps)? The recommendation is yes, since it is common on sharing sites. It is gated by plans like other creator features.

### D-SEO-6: Default description and tagline

The proposed text replaces "Excerpts from scholars' clips about the state of the nation today":

- **en:** "Watch and share videos, Shorts and live streams from creators and scholars, in Arabic and English."
- **ar:** «شاهد وشارك المرئيات والمقاطع القصيرة والبث المباشر من صنّاع المحتوى والعلماء، بالعربية والإنجليزية.»

The www Articles list blurb ("Announcements and updates from the Al Ummah Now team") changes to match.

### D-SEO-7: Slug history redirects on www

Renamed slugs return 404 today, by design. The recommendation is a slug-history table and 301s, because shared and indexed links survive.

### D-SEO-8: AI crawler content signals

Cloudflare's managed robots.txt is on, but no `Content-Signal` line is set. The recommendation is `search=yes, ai-input=yes, ai-train=no`. Alternatives are no to all AI, or yes to all.

### D-SEO-9: Analytics on videos

- **A (recommended):** in-house RUM (web-vitals to the existing endpoint) + Search Console.
- **B:** also allow Cloudflare Web Analytics (cookieless) as www already does. This needs the CSP test changed.

### D-SEO-10: Video URL slugs and Shorts URLs

Keep ID-only URLs (`/video/{id}`) with no title slug and no separate `/shorts/{id}` route (recommended). The alternative adds `/video/{id}/{english-slug}` using the CMS slug rule.

### D-SEO-11: A stable `contentUrl`

For public R2 videos, expose a stable public HLS or MP4 URL as `contentUrl`. The recommendation is **not now**: `embedUrl` is enough, and a public URL adds egress cost against the $500 cap.

### D-SEO-12: Search Console account

Which Google account owns the Domain property, and who else gets access? The owner adds the DNS TXT record in Cloudflare.
