[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Scholar sites (spec, draft for owner review)

| | |
|---|---|
| **ID** | `AUN-SCHOLAR-SITES` |
| **Owning repos** | [AlUmmahNowUI](../repos/AlUmmahNowUI.md) (renders the sites), [AlUmmahNow](../repos/AlUmmahNow.md) (site registry, entitlements, community posts, Studio, admin), [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md) (scholars, posts, featuring), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) (sign-in on new hosts) |
| **Status** | **planned**: a spec waiting on the owner (decisions SS1–SS18) |
| **Last updated** | 2026-11-13 |

> Owner request (2026-11-13): *"scholar sites, like mustafa-elbadry.alummahnow.net, which is a tier on its own, where the channel gets a site of its own filled with the channel's videos and community posts; connect the www scholars with channels, and community posts with www posts; and channel community should have the same post types as www."*
>
> Code facts below were read from `main` on 2026-11-13: AlUmmahNow [`de8c284`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/de8c284f8a1b84b7008c416a68e2f007de55ab5c), AlUmmahNowCMS [`d661daf`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/tree/d661daf7d266cb6804637cf616fa7b5fa680b21b), AlUmmahNowUI [`b521637`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/b5216371b3aa37a8308f1bc3b6491af4b8689a82). Visual review page with diagrams and mocks: see the PR description.

## 1. Summary

A **scholar site** is a small public website on its own subdomain, for example `mustafa-elbadry.alummahnow.net`, built automatically from one channel: its videos, Shorts, playlists, live streams and posts, plus the linked scholar's bio. Nobody builds pages by hand. The site is a **tier entitlement granted per channel by an admin**. It is not self-serve and has no payment step.

The recommendation in one paragraph:

- **www renders every site.** The www Astro Worker learns to answer for many hostnames and picks the site from the `Host` header. It already renders scholar pages, reads the CMS and the videos API, and has an HTML edge cache and KV fallbacks, so a site costs almost nothing extra to run.
- **The videos admin grants the site.** A new site registry lives in admin-api D1, next to plans and entitlements. It is published to a small KV namespace that www reads at the edge.
- **One post schema, two stores, one place for engagement.** Posts keep living where they are written (CMS D1 or the community store in R2). Both stores adopt a shared schema with the same post kinds. Posts are linked both ways, and likes, votes and comments always live on the videos community post.
- **Scholar ↔ channel becomes explicit**: each scholar has one primary channel, and each site belongs to exactly one channel.
- **The MVP is one site, `mustafa-elbadry`**, read-only. Comments and likes hand off to the videos site. Sign-in, unified post kinds, Studio settings and custom domains follow in later phases.

## 2. What exists today

| Area | Today | Source |
|---|---|---|
| Scholar profile | CMS D1 `scholars` holds `sso_sub`, `slug` (English, unique), `name_en/ar`, `bio_en/ar`, `avatar_media_id` and `channel_ids` (a JSON array of up to 5 owned channels; the first one is where articles post). It is created at the first writer sign-in. | CMS `migrations/0013_scholars.sql`, `src/lib/scholars/profiles.ts` |
| Scholar page | `www/{en,ar}/scholars/{slug}/` shows every post by the scholar (featured or not) plus videos from `channel_ids[0]` (8 per page), with an RSS feed per scholar. | UI `src/pages/[locale]/scholars/[slug]/index.astro` |
| Featuring | `featured_at` on a post puts it on the main site. `MAIN_SITE_SQL = author_sub IS NULL OR featured_at IS NOT NULL`. | CMS `src/lib/scholars/main-site.ts` |
| Article → community | CMS outbox `community_links` → `PUT {videos-api}/internal/scholars/:userId/articles/cms-<id>` with `X-API-Key`. The community post is an `article` type that links to `www/{locale}/articles/{slug}/`. | CMS `src/lib/scholars/community.ts:160`, videos `apps/api-videos/src/lib/scholar-articles.ts` |
| Channel → scholar | The videos web app asks the CMS `GET /api/public/v1/scholars/by-channel/:channelId` and links to the www scholar page. Videos stores no scholar id. | `apps/web/src/lib/scholars/lookup.ts` |
| Channels | JSON records in R2 (`channels` bucket) with `handle`, `nameLocalized`, `descriptionLocalized`, `avatarUrl`, `coverUrl`, `links`, `isVerified`, `members` (channel roles) and sections. | `packages/shared-types/src/channel.ts` |
| Community posts | JSON in R2 (`community-posts`): `posts/{channelId}/{postId}.json` and an index capped at 1000. Likes, poll votes and threaded comments sit beside them. Kinds: `text`, `image` (≤10), `poll`, `quiz`, `video`, `gif`, `article` (CMS mirror only). | `packages/shared-types/src/community-post.ts` |
| www posts | CMS D1 `posts` with `kind` ∈ {`article`, `cards`} (≤40 slides), locales `en`/`ar` joined by `translation_key`, scheduling, revisions and the KV home timeline (`FEED_FORMAT` 3). | CMS `src/schema.ts:70`, `src/lib/feed/format.ts` |
| Plans | admin-api D1 `plans`, `plan_entitlements`, `subscriptions`, `entitlement_overrides`; the subject can be a user, channel or organisation. A `sites.max` key exists but nothing enforces it at runtime yet. | `apps/admin-api/migrations/0004_plans_entitlements.sql`, `packages/shared-types/src/entitlements.ts` |
| Theme | One site-wide theme (`site.theme`, admin-chosen, default Fawanees). www vendors the four built-in themes and has no per-host theme. | [Theming](../guides/theming.md) |
| Hosts and cookies | www is one Worker on the custom domains `www.` and the apex. Its session cookie is `__Host-aun_www` (host-only). The videos session cookie is host-only too. Nothing routes by `Host`. | UI `wrangler.jsonc`, `src/lib/auth.ts`; videos `session-cookie.ts` |

## 3. Concept and tier

### 3.1 What a site is

- **One site per channel, one channel per site.** The owner's wording is "the channel gets a site". A scholar with several channels picks a primary channel, and that channel can hold the site.
- **Built from existing content only.** There is no new page builder. The site shows what the channel and the linked scholar publish. Featuring for www still happens in the CMS and does not change what the site shows: everything the channel publishes publicly is on its site.
- **Platform code, channel branding.** The scholar can't upload HTML, CSS or scripts. They choose from a small, safe set of options (§5.4).
- **Institutions too.** The tier is per channel, so a mosque or institute channel without a linked scholar can get a site. It then has an About page from the channel's About and no scholar bio. Should the product still be called "Scholar sites" then? See SS2.

### 3.2 The tier

Sites follow [AUN-SUBS](AUN-SUBS-subscriptions-plan.md) and [Epic 27](E27-plans-entitlements.md): every limit is an entitlement key, and admins manage plans. New keys:

| Key | Type | Meaning |
|---|---|---|
| `site.enabled` | bool | The channel may have a site |
| `site.customDomain` | bool | It may also be served on an outside domain (phase 4) |
| `site.themeChoice` | enum `platform` \| `builtin` \| `package` | `platform` follows the site-wide theme; `builtin` lets the channel pick one of the four; `package` also allows a published theme-builder package |
| `site.branding` | enum `basic` \| `full` | `basic`: logo, banner and accent from the safe palette. `full`: adds a hero, a pinned intro video and section order |
| `site.analytics` | bool | Site analytics in Studio |

**How it is granted.** S6 in AUN-SUBS proposes that a plan belongs to the user, not to each channel. A site is about one channel, so the recommendation is to grant it as an **add-on on the channel subject** (`subscriptions.subject_type = 'channel'`, which the tables already allow). The add-on is called "Scholar site" and is admin-granted only. It is independent of the owner's creator plan, so revoking a creator plan doesn't silently take a site down (SS1, SS3).

**Included vs the base channel**

| | Channel on videos (any creator) | With a Scholar site |
|---|---|---|
| Channel page `videos/@handle` | ✓ | ✓ (unchanged) |
| Own address `slug.alummahnow.net` | – | ✓ |
| Home that mixes videos, Shorts, posts, live | Channel Home sections | ✓, in a reading-first layout |
| Articles and card posts as pages with their own URLs | Only as a link-out community post | ✓ native pages, with SEO |
| Scholar bio, RSS, sitemap, JSON-LD `Person` | – | ✓ |
| Branding (logo, banner, accent) | Avatar and banner | ✓ (`site.branding`) |
| Theme choice | – | Per `site.themeChoice` |
| Site analytics | Channel analytics | ✓ plus page views per site |
| Custom domain | – | Phase 4 (`site.customDomain`) |

## 4. Domains

### 4.1 Hostnames per environment

| Env | Pattern | Example |
|---|---|---|
| Production | `<slug>.alummahnow.net` | `mustafa-elbadry.alummahnow.net` |
| Stage | `<slug>.stage.alummahnow.net` | `mustafa-elbadry.stage.alummahnow.net` |
| QA | `<slug>.qa.alummahnow.net` | `mustafa-elbadry.qa.alummahnow.net` |

### 4.2 How Cloudflare serves them (recommended: one Workers Custom Domain per site)

When an admin grants a site, admin-api calls the Cloudflare API to attach `<slug>.<env-suffix>alummahnow.net` as a **Workers Custom Domain** of the www Worker for that environment. On revoke it detaches the domain. This is the same mechanism www already uses for `www.` and the apex.

- **Why not a wildcard route?** A `*.alummahnow.net/*` route plus a proxied wildcard DNS record would also work. But it needs a wildcard certificate for the two-level QA and stage names. Universal SSL covers only one level, so that means Advanced Certificate Manager, about $10 a month per zone. It would also answer for every made-up subdomain, which we would then have to 404, and it sits beside 20 existing hosts whose routes must never be shadowed. Per-site custom domains give each site its own managed certificate, need no DNS wildcard, and make "the site exists" and "the host exists" the same fact.
- **What it needs.** A scoped API token in the Secrets Store with *Workers Custom Domains: edit* and *DNS: edit* on the `alummahnow.net` zone only. Today's wrangler token lacks DNS scope. The call is idempotent, and a daily reconcile job compares the registry with the attached domains.
- **Limits.** There are hundreds of sites at most, which is well inside Cloudflare's custom-domain limits. **Unverified:** the exact per-zone limit should be confirmed before the first 100 sites.
- **TLS.** Each custom domain gets its own edge certificate within a few minutes. The site shows as "Provisioning" in admin until it answers over HTTPS. HSTS `includeSubDomains` is already sent by www and is fine for these hosts.

### 4.3 Slug rules

- **Source.** The slug defaults to the linked scholar's CMS slug, which is already an English phrase from the Arabic name (CMS slug rule: English title → AI translation → transliteration). For an unlinked channel it comes from the channel's English name, then its handle. An admin can edit it before granting.
- **Shape.** `[a-z0-9-]`, 3–40 characters, starting and ending with a letter or digit, no `--` (punycode safety), unique across all sites in the environment.
- **Reserved.** Every existing host label (`www`, `videos`, `api`, `auth`, `admin`, `cms`, `media`, `images`, `realtime`, `profile`, `qa`, `stage`, `dev`, `mail`, `status`, `docs`, `help`, `embed`, `cdn`, `static`, `assets`) plus generic words (`app`, `apps`, `login`, `account`, `accounts`, `support`, `blog`, `shop`, `pay`, `billing`, `about`, `news`, `live`, `kids`, `quran`, `scholars`, `alummah`, `ummah`). The list lives in `packages/shared-types` and admin-api checks it.
- **Renames.** Unlike www's slug rule (no old-slug redirects), a renamed site keeps its old host as a **301 to the new host for 12 months** (SS6). The old custom domain stays attached and the Worker answers it with redirects only. A subdomain is shared and printed in far more places than an article slug.

### 4.4 Redirects, canonical URLs and SEO

The same content can appear in four places: the scholar site, www (scholar page, article page, home timeline when featured), the videos channel (Community tab, watch page) and search. The rules:

| Content | Canonical URL when the channel has a site | Other places |
|---|---|---|
| Article and cards posts by the site's scholar | **The site**: `https://<slug>.alummahnow.net/<locale>/posts/<post-slug>/` | The www article page stays reachable, with `rel=canonical` pointing to the site. The home timeline and Articles list link to the www copy, so readers stay on www. |
| Community posts (text, image, poll, quiz…) | The site's post page | The videos Community tab shows them as today. |
| Videos and Shorts | **The videos watch page** stays canonical: it holds comments, the player and analytics | The site's watch page `/<locale>/watch/<id>/` embeds the player and has `rel=canonical` to videos. |
| Scholar profile | The site's About page | `www/{locale}/scholars/{slug}/` stays as the www directory entry. It gets a prominent "Visit site" link and `rel=canonical` to the site home (SS7). |
| Channel page `videos/@handle` | Stays canonical for the channel on videos | It gets a "Website" link in the channel header. |

- **Sitemaps.** Each site serves `/sitemap.xml` (its posts and pages) and `/robots.txt`. www's sitemap leaves out URLs whose canonical is a site.
- **Structured data.** `Person` (or `Organization`) with `sameAs` pointing to the www scholar page and the videos channel, `WebSite`, `BreadcrumbList`, and `Article` or `VideoObject` per page.
- **hreflang.** `en` ↔ `ar` alternates follow the post's `translation_key`, the same as www.
- **Revoked site.** The host 302s to the www scholar page, or to the channel when there is no scholar, for 90 days, then the custom domain is detached. Canonicals on www fall back to www within one cache cycle, because the registry is the only switch.

## 5. Site content and structure

### 5.1 Pages

All paths are under `/<locale>/` (`en` or `ar`), the same as www. `/` negotiates the locale like www (302). A site can set its default locale (an Arabic scholar → `ar`).

| Page | Path | Content |
|---|---|---|
| **Home** | `/` | Header with the site's logo or avatar, name and nav. Then: a live-now banner when the channel is live; the latest long video as a hero; a Shorts strip; the latest posts as a timeline mixing articles, cards, text, image, poll and video posts (the www timeline renderer); playlists; the channel's sections in its own order when `site.branding = full` |
| **Videos** | `/videos/` | Grid of long videos, newest first, with load-more. Filters: Videos / Shorts / Live / Playlists |
| **Watch** | `/watch/<id>/` | The videos embed player (EMB-D1: embeds are served by the videos host), title, description, "Comment on Al Ummah Now" and more videos from the channel. Canonical → videos |
| **Shorts** | `/shorts/` | Vertical grid; opens the embed in the Shorts viewer |
| **Posts** | `/posts/` | Every post kind, newest first, with kind filters (Articles, Cards, Posts, Polls) |
| **Post** | `/posts/<slug>/` | A full article (www `PostArticle`), the cards viewer, or a single community post. Shows engagement counts and a "Join the discussion" handoff in the MVP, with inline comments in phase 2 |
| **Playlists** | `/playlists/` and `/playlists/<id>/` | Playlist grid and playlist page |
| **About** | `/about/` | Scholar bio (`bio_en`/`bio_ar`), photo, channel About, links, contact email if public, "Also on Al Ummah Now" links |
| **Search** | `/search/` | Phase 3: the www search API scoped to the channel and scholar |
| **Feeds** | `/rss.xml`, `/sitemap.xml` | Per locale |

Wording follows the [glossary](../guides/glossary.md): Arabic UI uses «مرئي / مرئيات» for video and never «فيديو» (for example «أحدث المرئيات»). Shorts are «المقاطع القصيرة», the glossary's one exception.

### 5.2 Rendering: which app hosts the sites

| | **www Astro Worker, multi-tenant (recommended)** | Videos web app (Next.js on OpenNext) | New dedicated Worker |
|---|---|---|---|
| Already renders | Scholar pages, articles, cards, timeline, RSS, JSON-LD | Channel pages, sections, community, watch | Nothing |
| Rendering cost | Light SSR, HTML edge cache `s-maxage=60, SWR 600` | Heavy bundle, slower cold start, mostly client-side React | Light, but a third copy of the renderers |
| Data reach | CMS service binding, videos public API, FEED KV, CONTENT_SNAPSHOT fallbacks | Videos API, CMS over HTTPS | Would need both |
| Theme | Vendors all four themes and the lantern street | All themes plus packages | Would need vendoring |
| Isolation | Session cookie is `__Host-`, so each host gets its own | Host-only cookie | Own |
| Fit | A reading-first site of posts and pages | An app of video tools | – |

**Recommendation: www.** Content sites are www's job, and the scholar page already does 70% of the home page. Request handling becomes:

1. `src/worker.ts` reads `Host`. `www.*` and the apex behave exactly as today.
2. Any other host → `siteForHost(host)`: an isolate cache (60 s) → KV `SITES` key `host:<host>` → a site config `{siteId, slug, channelId, scholarSlug, defaultLocale, theme, branding, status, canonicalHost}`. Unknown host → a plain 404 page that is never cached and has no links to the platform.
3. Astro renders the same `[locale]` routes, but site mode switches the layout (`SiteLayout.astro`), the nav, the data sources (scoped to one channel and one scholar), canonical URLs, `SITE_URL` and the theme.
4. The edge cache key already includes the full URL, so the host is part of it. Add the site's `config_version` to the key so a branding change shows within one TTL.

Video playback reuses the production player through the videos host's embed route, so signed URLs, R2/Bunny selection, analytics and the Shorts viewer stay in one place. Live uses the same embed.

### 5.3 Data sources (all existing, read-only in the MVP)

| Need | Source | Cache |
|---|---|---|
| Site config | KV `SITES` (written only by admin-api) | Isolate 60 s |
| Channel profile, videos, Shorts, playlists, live state | Videos public API (`/api/channels/:id`, `/api/channels/:id/videos?sort=latest`, playlists, live) | Cache API 60 s, the same as `src/lib/videos.ts` |
| Scholar bio and CMS posts | CMS public API over the service binding (`/scholars/:slug` already returns every post by the scholar) | 60 s → stale 10 min → KV snapshot |
| Community posts | Videos public API `GET /channels/:id/posts` (public visibility only) | 60 s |
| Engagement counts | Already inside the community post JSON (`likes`, `comments`) | 60 s |

There is no new database read on the hot path: one KV read per isolate per minute, and everything else as www does today.

### 5.4 Theme and branding per site

- **Default:** the site follows the platform theme (Fawanees today), so a site looks like part of Al Ummah Now.
- **`site.themeChoice = builtin`:** the channel may pin one of the four built-in themes (Lantern, Zujaj, Nahas, Fawanees). www already ships all four on every page and switches with `html[data-theme]`, so this costs nothing.
- **`site.themeChoice = package`:** a published theme-builder package. This needs www to render builder packages, which is open as [UI#55](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/55). Phase 3.
- **Branding (both levels):** a logo (square, used as-is; owner rule: crop and resize only), a wide banner, and an **accent chosen from a pre-checked AA-safe palette** (about 8 swatches per theme, tested by `check:tokens` against both modes). There is no free colour picker, which keeps contrast guaranteed. The header stays dark in every theme, as the platform rule requires.
- **Light, dark and system** are per viewer, as everywhere else. The lantern street shows on Fawanees sites in both modes.
- **Platform marks:** a small "on Al Ummah Now" mark in the footer and the platform account menu stay on every site (SS10).

### 5.5 Languages

- `en` and `ar` with full RTL, the same `[locale]` routes and the same i18n strings as www. Site-specific text (tagline, bio) comes in both languages, and when one is missing the page shows the other with the existing "Only available in …" notice.
- One-language posts behave as on www: alternates via `translation_key`, otherwise the notice.

## 6. Data model and connections

### 6.1 Scholar ↔ channel

Today the CMS holds `scholars.channel_ids` (up to 5, from the user's owned channels), and the first one gets articles. That ordering is implicit and lives only in the CMS.

**Proposal:**

- **One-to-many, with one primary.** A scholar may have up to 5 channels. Exactly one is `primary` and receives articles, and that is the channel that can hold the site. Make it explicit: CMS migration `scholars.primary_channel_id` (backfilled from `channel_ids[0]`), editable by admins in the CMS scholar editor with a channel autocomplete (owner rule: no raw id inputs).
- **A channel belongs to at most one scholar.** Add a unique check in the CMS. Today two scholars could in theory list the same channel only if both owned it, which ownership prevents. The check guards channel transfers ([AUN-CHANNEL-CLAIM](AUN-CHANNEL-CLAIM-channel-claim-transfer.md)).
- **The source of truth stays in the CMS** (scholars are a CMS concept). The site registry copies `scholar_slug` when an admin links them, and a CMS webhook (outbox, the same pattern as `community_links`) tells admin-api when a scholar's slug, names or primary channel change. The KV site config is then republished.
- **Videos learns the link without asking every time:** the site config in KV gives `channelId → site host`, so the channel page can show "Website" without the per-request CMS lookup it does today.

### 6.2 Site registry (new, admin-api D1)

```sql
create table channel_sites (
  id            text primary key,        -- site_<ulid>
  channel_id    text not null unique,
  slug          text not null unique,    -- current host label
  scholar_slug  text,                    -- CMS scholar, null for institutions
  status        text not null,           -- provisioning | active | suspended | revoked
  default_locale text not null default 'ar',
  theme         text,                    -- null = platform theme; builtin id or pkg@ver
  branding_json text not null default '{}',  -- logo/banner media ids, accent swatch id, tagline en/ar, section order
  custom_domain text unique,             -- phase 4
  config_version integer not null default 1,
  granted_by text not null, granted_at text not null,
  updated_by text, updated_at text not null,
  deleted_at text                        -- 30-day soft delete, restorable (admin rule)
);
create table channel_site_hosts (        -- old slugs kept as 301s, custom domains
  host text primary key, site_id text not null, kind text not null, -- primary | redirect | custom
  expires_at text
);
```

Every change writes the audit log and republishes `host:<host>` and `channel:<channelId>` keys in KV `SITES`. Admin actions are undoable or soft-deleted ([data lifecycle](../guides/data-lifecycle.md)): revoking a site is a soft delete, restorable for 30 days, before the host is detached.

### 6.3 Posts: one schema, linked stores

**The question:** should www posts and community posts become one post model?

| Option | What it means | For | Against |
|---|---|---|---|
| A. Move everything into one store | Community posts move from R2 into a new D1 posts service (or the CMS) | One id, no sync | A large migration of every channel's posts, likes and comments. The CMS becomes a dependency of every channel, not just scholars. It breaks the native apps' community API |
| **B. One schema, linked stores (recommended)** | Both stores use the same post kinds and fields. Each post has one **home** (where it was written) and, when it belongs to a scholar's primary channel, a **mirror** in the other store, linked by a global id | Builds on the outbox that already syncs articles. No migration of existing engagement. Each surface keeps its strengths (CMS: slugs, translations, revisions, featuring; videos: engagement, notifications) | Two copies of content; edits must go through the home store |
| C. Keep two models | Only map the kinds on display | Least work | It doesn't meet the owner's "same post types" |

**Recommended rules (option B):**

1. **Global id.** Every post gets `uid = pst_<ulid>`, stored in both copies. Existing ids stay (`cms-<id>` external ids, community `postId`).
2. **Home store.** A post written in the CMS (by a scholar or staff) has its home in CMS D1. A post written in Studio's Community has its home in the community R2 store. You can edit a post only in its home. The mirror shows "Edit in CMS" or "Edit in Studio" deep links (SSO).
3. **Mirrors.** CMS → community already exists for articles (`community_links`); widen it to every kind. **New:** community → CMS for channels that are a scholar's primary channel. The api-videos outbox calls a CMS internal endpoint (`PUT /internal/community/:uid`, `X-API-Key` from the Secrets Store), and the CMS stores the mirror as a post with `author_sub` set and `origin = 'community'`. Then featuring (`featured_at`), search, the scholar page and the site all work unchanged for community posts.
4. **Engagement lives in one place:** the videos community post. Likes, poll votes, quiz answers and comments for every post, including CMS-home articles, go to the community copy. www and the sites read counts from it and send actions to the videos API (phase 2). One discussion per post, wherever it is read.
5. **Featuring stays an editorial CMS action.** Editors can now feature a scholar's poll or image post to the home timeline as well as articles. The timeline's `FeedItem` gains `type: 'post'` items of every kind. That changes the shape, so `FEED_FORMAT` is bumped to 4.
6. **Deletes** follow the home. A soft delete at home soft-deletes the mirror (30-day restore keeps both).

### 6.4 Comments and likes across surfaces

| Surface | MVP | Phase 2 |
|---|---|---|
| Videos Community tab | As today | As today |
| www article page and site post page | Counts plus "Join the discussion" → the videos post | Inline comments, likes, poll votes through the videos API, with a signed-in site session (§8.4). Later, the Epic 26 comments widget |
| Watch page on the site | "Comment on Al Ummah Now" → the videos watch page | Same (canonical stays on videos) |

## 7. Unifying post types

### 7.1 Inventory

| Kind | www / CMS today | Channel community today | Proposal |
|---|---|---|---|
| Article (title, body, cover, slug) | ✓ `article` | Mirror only (`article`, link card, refused by the public API) | **Both.** Studio gets an article editor (markdown, cover). A Studio article posts natively; for a scholar channel it mirrors to the CMS |
| Cards / slides (≤40, 4:5 or square) | ✓ `cards` | – | **Both.** Studio card editor (phase 2b) |
| Text (short, no title) | – | ✓ `text` | **Both.** CMS "Short post" kind |
| Image (1–10, caption, alt) | Page blocks only | ✓ `image` | **Both** |
| Video share (video, Short, playlist) | Timeline video entries and page blocks only | ✓ `video` (by `videoId`) | **Both.** Widen to `{videoId \| playlistId}` |
| Poll (2–5 options, end time) | – | ✓ `poll` | **Both** (votes on videos) |
| Quiz (2–4 options, answer, explanation) | – | ✓ `quiz` | **Both** |
| GIF | – | ✓ `gif` | **Both**, or retire GIF (SS13) |
| Link (URL card) | – | – | Add to both? (SS13) |
| Quote, CTA, columns, divider | Page blocks | – | **Stay page blocks.** Pages are not posts |

### 7.2 The shared schema (`PostV2`)

Every kind shares an envelope; the `body` part differs by kind.

```ts
type PostKind = 'article' | 'cards' | 'text' | 'image' | 'video' | 'poll' | 'quiz' | 'gif' /* | 'link' */;
interface PostV2 {
  uid: string;                     // pst_<ulid>, the same in every store
  kind: PostKind;
  home: 'cms' | 'community';
  channelId?: string;              // the posting channel (community home, or a scholar's primary channel)
  authorSub?: string;              // auth user id; null = staff
  locale: 'en' | 'ar';
  translationKey?: string;         // joins the en/ar versions
  slug?: string;                   // required for article/cards; derived ("<kind>-<short-uid>") for others
  title?: string;                  // required for article/cards
  text?: string;                   // markdown (article) or plain text with links (others)
  cover?: MediaRef;
  slides?: Slide[];                // cards
  images?: MediaRef[];             // image (≤10), with alt text required
  video?: { videoId?: string; playlistId?: string };
  poll?: { options: { id: string; text: string }[]; multiple: boolean; endsAt?: string };
  quiz?: { options: { id: string; text: string }[]; correctOptionId: string; explanation?: string };
  gif?: MediaRef;
  status: 'draft' | 'scheduled' | 'published' | 'deleted';
  visibility: 'public' | 'subscribers' | 'members';
  publishAt?: string;
  featuredAt?: string;             // CMS editorial flag, mirrored read-only
  commentsEnabled: boolean;
  tags?: string[];
  createdAt: string; updatedAt: string;
}
```

- **Where it lives.** `packages/post-schema` in the monorepo holds the types, a zod validator, the kind rules (limits, required fields) and fixtures. The CMS and www vendor it with a pinned sync, the same way they vendor Fanous (`sync:posts` + `check:posts`, with drift failing CI). That is consistent with how those repos consume the monorepo today.
- **Renderers.** www (Astro) and the videos app (React) can't share components directly. Share what can be shared: **one CSS file per kind** (class names and tokens only) and **pure HTML-string renderers** for the read-only views, used by www, the sites and the email digests. The videos app wraps the same classes in its React `PostCard` types. A visual fixture test renders every kind in both apps and compares the structure.
- **Visibility.** Sites and www show only `public` posts. `subscribers` and `members` posts stay on videos.

### 7.3 Migration path

1. **Schema package and fixtures**: no data change.
2. **Community store:** new posts are written with `uid` and `schemaVersion: 2`. Old posts get a `uid` lazily on read-and-write, plus a one-off backfill job per environment (R2 list → patch). The index cap of 1000 per channel stays; sites page through the API.
3. **CMS:** migration `0018_post_kinds.sql` widens `kind` and adds `uid`, `origin`, `channel_id`, `images`, `video_ref`, `poll`, `quiz`, `gif` and `visibility`. It is expand-only. `FEED_FORMAT` → 4 rebuilds the feed automatically.
4. **Backfill links:** existing `community_links` rows get a `uid` on both sides.
5. **Community → CMS mirror** is switched on per scholar channel (a flag), mustafa-elbadry first, then all scholars.
6. **Studio** gains article and cards editors. The public API stops refusing `article` for Studio-authored posts.

## 8. Admin and creator UX

### 8.1 Granting (videos admin)

- **Where:** admin-web → *Channels → channel → Plan & add-ons → Scholar site*. A sites list (*Sites*) shows every site with status, host, channel, scholar, granted by and date. Both lists have a live autocomplete search (owner rule).
- **Grant dialog:** pick the channel (autocomplete). The slug is pre-filled from the scholar or channel with a live availability check; then the default locale and an optional linked scholar (autocomplete over CMS scholars). *Grant* creates the add-on, the registry row and the custom domain. The status then moves from *Provisioning* to *Active* (the certificate is ready, a health check passes).
- **Suspend and revoke:** suspend (the site shows a neutral "unavailable" page, 503, and the host stays) or revoke (soft delete, redirect to www, restore for 30 days). Both use the in-app accessible dialog, never browser prompts.
- **Audit:** every change appears in the admin audit log and the site's History.

### 8.2 Site settings in Studio (channel owner and channel admins)

*Studio → Channel → Site* (shown only when `site.enabled`):

- **Overview:** the address with Copy and Open, the status, and a QR code.
- **Branding:** logo, banner, accent swatches, tagline (en/ar), default language. What is shown depends on `site.branding`.
- **Theme:** "Follow Al Ummah Now" or a pick, per `site.themeChoice`.
- **Home layout** (`full`): reorder or hide the home blocks (Live, Latest video, Shorts, Posts, Playlists, channel sections).
- **Preview:** an iframe of the real site with `?preview=<signed token>` that shows unsaved settings. It is not cached, and the token lasts 10 minutes and is bound to the channel. Toggles for en/ar, light/dark and phone/desktop.
- **Publish:** settings save as a draft and *Publish* bumps `config_version`. The previous version can be restored.
- Channel roles: owner and channel admin edit; editors and moderators view only.
- Scholars edit their bio in the CMS (where it lives). The Site tab links there.

### 8.3 Analytics per site

- **Page views and visitors:** www writes one Workers Analytics Engine data point per HTML render that is not served from cache, plus a tiny beacon for cached views, with the site id and path kind (home/post/watch/about). There are no cookies and no personal data.
- **Studio → Analytics → Site** reuses the shared value-axis chart: views by day, top posts, top referrers, en vs ar, and phone vs desktop. Video plays from the site already count as embed plays on the video, and a `referrer_site` dimension is added to tell them apart.
- **Admin:** totals per site in *Sites*.

### 8.4 Sign-in on a site (phase 2)

- Each site host gets its own `__Host-aun_site` cookie (the same sealed format as www). No cookie is ever set with `Domain=.alummahnow.net` (§9.3).
- **OAuth client.** Use one client per environment, "Scholar sites", with redirect URIs registered **per site on grant** (admin-api → Auth admin API; exact match, no wildcards). Revoke removes them. Auth's CORS for the silent probe (`/session/accounts`) must allow the registered site origins.
- The silent sign-in probe works on `*.alummahnow.net` hosts because they are same-site with `auth.` It **won't** work on custom domains (third-party cookies), so there sign-in is a click (phase 4).
- Single sign-out: add each site's front-channel logout URL to the auth client's logout list on grant.

## 9. Cost, caching, performance, security, accessibility

### 9.1 Cost at target scale (O1: $500 a month for the whole platform at scale)

The assumptions are deliberately high: 300 sites, 2M site page views a month on top of the 2M platform viewers, a 70% edge-cache hit rate, video bytes from R2 + CDN (free egress, already counted under D2).

| Item | Unit price | Monthly at that scale |
|---|---|---|
| Worker requests (www) | $0.30 / M after the included 10 M | ≈ $0–2 (≈ 2.6 M extra incl. assets and API) |
| Worker CPU | $0.02 / M CPU-ms; SSR ≈ 15 ms on a miss | ≈ $0.20 |
| KV `SITES` reads | Isolate-cached; ≈ 1 read per isolate-minute | < $0.50 |
| Videos API and CMS reads | Cache API 60 s; D1/R2 reads per miss only | < $1 |
| Workers Analytics Engine | Included tier, then $0.25 / M points | ≈ $0.50 |
| Workers Custom Domains and certificates | No charge | $0 |
| Custom domains on outside domains (phase 4, Cloudflare for SaaS) | 100 hostnames free, then $0.10 each | $0–20 |
| Workers Logs (www already logs every invocation on QA/stage; production follows S14 sampling) | $0.60 / M lines | ≈ $1 |
| **Total** | | **≈ $5–25**, which is under $0.01 per thousand page views |

What could break the cap: turning off the HTML cache, or per-request uncached CMS or videos calls. Guards: the cost-monitor gets a `sites` line, and a spec asserts that `cache-control` is set on site HTML.

### 9.2 Caching and performance

- HTML: `s-maxage=60, stale-while-revalidate=600`, keyed by URL (which includes the host) + version + theme + site `config_version`. Signed-in views are never cached (they carry a session cookie), the same as www.
- Images through the existing image variants; posters and avatars through the CDN. LCP target < 2.5 s on 4G for the home page, with no client JS needed for reading (only the player iframe, cards and the timeline enhancements, as on www).
- The player iframe is a facade (click-to-play), as on the scholar page today, so no player JS loads until a viewer presses play.

### 9.3 Security and tenant isolation

- **No tenant code.** Sites run only platform code. Scholars can't add scripts, HTML or CSS. Markdown goes through the same sanitiser as www. This matters because `*.alummahnow.net` sites are **same-site** with every app: anything script-capable on a site could send SameSite=Lax requests with other apps' cookies.
- **Cookies stay host-only.** Today every app's session cookie is host-only (`__Host-aun_www`, `al_ummah_session` with no Domain). Add a release check that fails if any app sets a `Domain=` cookie on the parent domain, because a parent-domain cookie would be sent to every scholar site.
- **CSP** stays the same as www (`script-src 'self'` plus the hashes in use), `frame-src` only for the videos embed host, `form-action` for auth, `frame-ancestors 'none'`. Each site gets the same HSTS.
- **Host validation.** An unknown host is a 404 with no platform links. `SITE_URL` is derived from the registry, never from the raw `Host` header, so a spoofed `Host` can't poison the edge cache (the cache key uses the registry's canonical host).
- **Slug abuse.** The reserved list, admin-only grants, and a homograph check (ASCII only).
- **Suspension.** Moderation actions on a channel (suspend or delete) mark the site `suspended` automatically through the registry, in the same transaction path that suspends the channel.
- **Preview tokens** are signed (HMAC, secret in the Secrets Store), short-lived and bound to the channel. Responses carrying them are never cached and are `noindex`.

### 9.4 Accessibility

- The same bar as the rest of the platform: WCAG 2.1 AA, axe on every page kind in both locales and both modes, keyboard paths, focus rings from tokens, `lang` and `dir` on `<html>`, skip link, and alt text required for image posts and cards (the schema enforces it).
- Accent swatches are pre-checked for AA as text and as button backgrounds in both modes.
- Reduced motion turns off the lantern street motion and card auto-advance.
- The theme visibility suite runs one site in every theme.

## 10. Phased rollout

| Phase | Scope | Repos | Done when |
|---|---|---|---|
| **0. Decisions** | The owner answers SS1–SS18 | – | Decisions recorded in the [decision log](decisions.md) |
| **1. MVP: mustafa-elbadry** | Registry (D1 + KV) and grant/revoke in admin-web; Cloudflare custom-domain provisioning; `site.enabled` key and add-on; www multi-tenant: Home, Videos, Shorts, Watch (embed), Posts (CMS article/cards + community posts read-only, rendered with the existing renderers and a basic renderer per community kind), About, RSS, sitemap, canonicals, en/ar, light/dark, platform theme plus logo, banner and accent; "Website" link on the channel page and www scholar page; `primary_channel_id` in the CMS; handoff links for engagement | AlUmmahNow (admin-api, admin-web, shared-types), UI, CMS | The QA site works end to end with E2E (own data, cleanup); a stage site; the production site for mustafa-elbadry granted by an admin |
| **2. One post model** | `packages/post-schema`; CMS kinds widened (migration, FEED_FORMAT 4); community `uid` backfill; community → CMS mirror for scholar channels; featuring any kind; inline engagement on www and sites with site sign-in (per-site redirect URIs, `__Host-aun_site`) | All | A poll written in Studio on a scholar channel shows on the site, the www scholar page and, once featured, the home timeline, with votes counted once |
| **2b. Studio parity** | Article and cards editors in Studio; CMS text/image/poll/quiz/video editors | AlUmmahNow, CMS | The same set of kinds in both editors |
| **3. Site settings and analytics** | Studio Site tab (branding, theme pick, home layout, preview, publish/restore); `site.branding = full`; builtin theme pick, then theme packages (UI#55); site analytics; site search; playlists pages | AlUmmahNow, UI | A creator changes their site without staff help |
| **4. Custom domains** | Cloudflare for SaaS custom hostnames; DNS verification flow; click sign-in on outside domains | AlUmmahNow, UI, Auth | A scholar's own domain serves the site with TLS |
| **Native apps** | Channel screens link to the site; no site rendering in apps | Native | – |

Each phase updates this wiki page and the relevant repo pages, as the wiki rule requires.

### Migrations (summary)

| Repo | Migration | Phase |
|---|---|---|
| AlUmmahNow admin-api | `0021_channel_sites.sql` (registry, hosts) plus new entitlement keys and the "Scholar site" add-on seed | 1 |
| AlUmmahNowCMS | `0018_scholar_primary_channel.sql`, then `0019_post_kinds.sql` (kinds, uid, origin…) | 1, 2 |
| AlUmmahNow api-videos | No SQL. A one-off R2 backfill job adds `uid`; `scholar-articles/` mappings gain `uid` | 2 |
| AlUmmahNowAuth | No schema change if per-site redirect URIs go into the existing client tables; otherwise a small migration | 2 |

Migration numbers are the next free ones today. Check them again when building.

## 11. Risks

| Risk | Mitigation |
|---|---|
| Two stores drift (option B) | One home per post, an idempotent outbox with retries and backoff (already proven by `community_links`), a nightly reconcile that compares `uid`s, and drift alerts to the cost/ops channel |
| Duplicate content hurts SEO | Exactly one canonical per item (§4.4), and www's sitemap leaves out site-canonical URLs |
| www becomes a single point of failure for every site | www already has stale-cache and KV snapshot fallbacks; sites get the same chain. Release E2E covers one site |
| Same-site exposure (§9.3) | No tenant code ever; a release check for parent-domain cookies |
| Cloudflare API token over-scoped | Zone-scoped token with two permissions, in the Secrets Store; used only by admin-api's grant/reconcile jobs |
| Branding makes sites inaccessible | Swatches only, contrast-checked; owner assets used as-is |
| A scholar leaves or a channel is transferred | Revoke or suspend follows channel status; the registry is keyed by channel, so a transfer keeps the site with the channel (SS4) |
| Studio and CMS editors diverge | One schema package, fixture tests in both apps |

## 12. Decisions for the owner

| # | Decision | Recommendation |
|---|---|---|
| SS1 | Is a Scholar site an **add-on granted per channel** (admin-only), separate from the user's creator plan? | Yes. A channel-subject add-on "Scholar site", admin-granted, no payment |
| SS2 | Who can get a site: scholars only, or also institutions and other invited channels? Is the product name "Scholar sites" or "Channel sites"? | Any admin-chosen channel; call it "Scholar site" in the UI for now |
| SS3 | Does granting a site also need a creator plan (Creator Plus per S7)? | No. The site add-on stands alone |
| SS4 | One site per channel, and the site stays with the channel on transfer? | Yes and yes |
| SS5 | Hostnames: `<slug>.alummahnow.net` in production, `<slug>.qa.` / `<slug>.stage.` in test environments, provisioned as Workers Custom Domains per site (not a wildcard route) | Yes |
| SS6 | Renaming a site keeps the old host as a 301 for 12 months (unlike www's no-redirect slug rule) | Yes |
| SS7 | Canonical: articles/cards and community posts → the site; videos → the videos watch page; the www scholar page stays but points its canonical at the site | Yes |
| SS8 | Should the site show every public channel post and video, or can the creator hide some from the site only? | Everything public; no per-item hiding in v1 |
| SS9 | Rendering: www's Astro Worker serves all sites, multi-tenant by host | Yes |
| SS10 | Platform presence on a site: the dark platform header with the account menu, plus a footer mark? Or the site's own header with only a footer mark? | The site's own header (dark, per theme rules) with the platform account menu in it, plus a footer mark |
| SS11 | Theme choice: follow the platform theme at launch; pin a built-in theme with `site.themeChoice = builtin`; theme packages later | Yes |
| SS12 | Post model: **one shared schema with linked stores (option B)**, engagement always on the videos community post | Yes |
| SS13 | Post kinds: keep GIF? Add a Link kind to both? | Keep GIF; add Link in phase 2 |
| SS14 | Community posts on a scholar's primary channel are mirrored into the CMS, so editors can feature them to the www home timeline | Yes |
| SS15 | Scholars write long-form in the CMS (as today), and Studio also gets article and cards editors (phase 2b)? Or CMS-only for long-form? | Both, with one schema |
| SS16 | Sign-in on sites in phase 2 with one OAuth client and per-site exact redirect URIs (no wildcard redirect support in Auth) | Yes |
| SS17 | Custom outside domains (phase 4) through Cloudflare for SaaS ($0.10 per host after 100) | Yes, later, behind `site.customDomain` |
| SS18 | MVP scope: mustafa-elbadry only, read-only with handoff links for engagement, and production only after QA and stage sign-off | Yes |

## Open questions not yet decisions

- Does a CMS scholar with slug `mustafa-elbadry` exist in production, and is their primary channel the right one? **Unverified**; checked when phase 1 starts.
- Will the native apps ever open site URLs in-app (universal links)? Not in scope.

## Status evidence

- This page (draft PR on AlUmmahNowWiki). No code yet.

## Sources

- CMS: [`docs/SCHOLARS.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/docs/SCHOLARS.md), [`migrations/0013_scholars.sql`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/migrations/0013_scholars.sql), [`src/lib/scholars/community.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/src/lib/scholars/community.ts), [`src/schema.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/src/schema.ts), [`docs/PUBLIC_API.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/docs/PUBLIC_API.md), [`src/lib/feed/format.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/src/lib/feed/format.ts)
- www: [`src/pages/[locale]/scholars/[slug]/index.astro`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/src/pages/%5Blocale%5D/scholars/%5Bslug%5D/index.astro), [`src/lib/edge.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/src/lib/edge.ts), [`src/lib/auth.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/src/lib/auth.ts), [`wrangler.jsonc`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/wrangler.jsonc)
- Videos: [`packages/shared-types/src/community-post.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/packages/shared-types/src/community-post.ts), [`packages/shared-types/src/channel.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/packages/shared-types/src/channel.ts), [`apps/api-videos/src/lib/scholar-articles.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/api-videos/src/lib/scholar-articles.ts), [`apps/api-videos/src/routers/scholars-internal.router.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/api-videos/src/routers/scholars-internal.router.ts), [`apps/web/src/lib/scholars/lookup.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/web/src/lib/scholars/lookup.ts), [`packages/shared-types/src/entitlements.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/packages/shared-types/src/entitlements.ts), [`apps/admin-api/migrations/0004_plans_entitlements.sql`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/admin-api/migrations/0004_plans_entitlements.sql), [`docs/plans/SUBSCRIPTIONS.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/docs/plans/SUBSCRIPTIONS.md)
- Wiki: [AUN-SUBS](AUN-SUBS-subscriptions-plan.md), [Epic 27](E27-plans-entitlements.md), [CMS home timeline](CMS-HOME-TIMELINE-www-home-timeline.md), [Channel sections](AUN-CHANNEL-SECTIONS-channel-sections.md), [Theming](../guides/theming.md), [Authentication](../guides/authentication.md), [Environments](../guides/environments.md)
