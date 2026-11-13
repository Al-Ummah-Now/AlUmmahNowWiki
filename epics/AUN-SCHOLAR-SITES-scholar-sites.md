[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Scholar sites: white-label sites (spec, draft for owner review)

| | |
|---|---|
| **ID** | `AUN-SCHOLAR-SITES` |
| **Owning repos** | [AlUmmahNowUI](../repos/AlUmmahNowUI.md) (renders the sites), [AlUmmahNow](../repos/AlUmmahNow.md) (Studio as the site CMS, site store, registry, entitlements, community posts, admin), [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md) (scholar pages for scholars without the tier, featuring), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) (sign-in on new hosts, branded sign-in) |
| **Status** | **planned**: revision 4, waiting on the owner (16 open decisions: SS1–SS9, SS11–SS17) |
| **Last updated** | 2026-11-13 |

> **Request (2026-11-13):** *"scholar sites, like mustafa-elbadry.alummahnow.net, which is a tier on its own, where the channel gets a site of its own filled with the channel's videos and community posts; connect the www scholars with channels, and community posts with www posts; and channel community should have the same post types as www."*
>
> **Direction (2026-11-13, revision 2):** *"A scholar site is a toned-down version of the website. It's the same, but WHITE-LABEL: they get their own theme and so on; maybe even Studio becomes their own CMS. The scholar sites are independent. Not all scholars will get the white label, and the white label might even allow full domains outside Al Ummah Now."*
>
> **Theme (2026-11-13, revision 4, which replaces revision 3's theme builder):** white-label sites use the **same theme infrastructure** as the platform. Al Ummah Now provides the themes, and a site only **chooses** one of them, independently of the platform's active theme. There is no theme editing, no site-scoped theme builder and no theme package of the site's own. The choice is pinned per site and never falls back to the platform theme. Branding beyond the theme is the **logo, name and favicon** only.
>
> Code facts were read from `main` on 2026-11-13: AlUmmahNow [`de8c284`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/de8c284f8a1b84b7008c416a68e2f007de55ab5c), AlUmmahNowCMS [`d661daf`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/tree/d661daf7d266cb6804637cf616fa7b5fa680b21b), AlUmmahNowUI [`b521637`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/b5216371b3aa37a8308f1bc3b6491af4b8689a82). The visual review page, with diagrams and mocks, is linked from the PR description.

## 1. Summary

There are two levels for a scholar:

| | **Scholar page** (no tier, every scholar) | **White-label site** (a tier; admins choose who gets it) |
|---|---|---|
| Where | `www.alummahnow.net/{en,ar}/scholars/{slug}/` | Its own host: `<slug>.alummahnow.net` and/or the scholar's **own domain** (`example.com`) |
| Looks like | Al Ummah Now (platform theme and header) | **The scholar's brand on one of our themes**: a theme the site chooses (independent of the platform's), plus its own logo, name and favicon. The Al Ummah Now mark is optional by tier |
| Written in | The CMS (writer role, as today) | **Studio, acting as the site's CMS**: pages, posts of every kind, About, navigation, home layout, SEO, domains |
| Canonical | www | **The site's own host**, for everything it publishes |
| Featured on the www home | Editors feature from the CMS (as today) | Optional: the site can share posts to Al Ummah Now, and editors may feature them. The item links to the site |

A white-label site is **the same website as www, toned down**. It runs on www's renderer, with the same page kinds, post kinds, timeline, card viewer, player embed and languages. It is wearing the scholar's brand and is scoped to one channel.

The recommendation in short:

- **www's Worker renders every white-label site** and picks the site by hostname. That gives "the same website" literally, with no second renderer to keep in step.
- **Studio becomes the site's CMS.** A new **site store** (a D1 database owned by api-videos) holds pages, navigation and settings. Posts are in the community store and use one schema shared with the CMS (`PostV2`).
- **Own domains from day one**, through Cloudflare for SaaS custom hostnames ($0.10 per hostname per month after the first 100). Subdomains of `alummahnow.net` are free Workers Custom Domains.
- **Independence:** text content is canonical on the site's host. Videos stay canonical on the videos site, except on a site with its own domain, where the site's watch page becomes canonical (§4.4).
- **The tier is a plan add-on on the channel**, with keys for the platform mark, domains, theme and pages. Admins grant it; there is no payment.

## 2. What exists today

| Area | Today | Source |
|---|---|---|
| Scholar profile | CMS D1 `scholars` holds `sso_sub`, an English `slug`, `name_en/ar`, `bio_en/ar`, `avatar_media_id` and `channel_ids` (up to 5; the first gets the articles). It is created at the first writer sign-in | CMS `migrations/0013_scholars.sql` |
| Scholar page | `www/{en,ar}/scholars/{slug}/`: every post by the scholar plus videos from `channel_ids[0]`, with RSS | UI `src/pages/[locale]/scholars/[slug]/index.astro` |
| Featuring | `featured_at` puts a scholar post on the main site (`MAIN_SITE_SQL`) | CMS `src/lib/scholars/main-site.ts` |
| Article → community | CMS outbox `community_links` → `PUT {videos-api}/internal/scholars/:userId/articles/cms-<id>` (`X-API-Key`). The post links to the www article | CMS `src/lib/scholars/community.ts`, videos `apps/api-videos/src/lib/scholar-articles.ts` |
| Channel → scholar | The videos web app asks the CMS `by-channel/:channelId` on each request | `apps/web/src/lib/scholars/lookup.ts` |
| Community posts | R2 JSON (`community-posts`), with an index of up to 1000 per channel. Kinds: text, image, poll, quiz, video, gif, article (mirror). Likes, votes and comments sit beside them | `packages/shared-types/src/community-post.ts` |
| www posts | CMS D1 `posts`, kinds `article` and `cards`. Pages are made of blocks: markdown, image, gallery, posts, cards, videos, video, cta, columns, quote, divider | CMS `src/schema.ts`, `src/lib/blocks.ts` |
| Studio | Dashboard, Content (videos, live), Analytics. Community is managed under channel settings | `apps/web/src/app/[locale]/studio/`, `settings/channel/[id]/community/` |
| Plans | admin-api D1 plans, entitlements, subscriptions and overrides. The subject can be a user, channel or organisation. `sites.max` exists but nothing enforces it | `apps/admin-api/migrations/0004_plans_entitlements.sql`, `packages/shared-types/src/entitlements.ts` |
| Theme | One site-wide theme chosen by admins. Theme-builder packages are stored in R2 and D1. www renders only the four built-in themes ([UI#55](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/55)) | [Theming](../guides/theming.md) |
| Hosts and cookies | www is one Worker on the custom domains `www.` and the apex. Every app's session cookie is host-only. Nothing routes by `Host` | UI `wrangler.jsonc`, `src/lib/auth.ts`; videos `session-cookie.ts` |

## 3. Concept and tier

### 3.1 What a white-label site is

- **One site per channel.** A scholar with several channels picks the channel that holds the site. Institutions can get one too, because the tier is on the channel.
- **The same website, toned down.** A site has the www page kinds (home timeline, post pages, content pages, list pages, videos, About, search, RSS, sitemap). It has no platform-wide pieces: no other channels, no global explore, no platform menus.
- **Independent.** It has its own brand, host, canonical URLs, navigation and pages. Al Ummah Now provides the hosting, the player, sign-in and moderation.
- **Platform code only.** The scholar edits content and settings in Studio. They can't upload HTML, CSS or scripts (§9.3). The site **chooses** one of the platform's themes; it can't edit a theme or make its own. The choice belongs to the site, not to the platform (§5.3).

### 3.2 Tier and entitlement keys

The tier follows [AUN-SUBS](AUN-SUBS-subscriptions-plan.md) and [Epic 27](E27-plans-entitlements.md): admins manage plans, and every limit is a key. It is granted as an **add-on on the channel subject** (`subscriptions.subject_type = 'channel'`), independent of the owner's creator plan.

| Key | Type | Meaning | Seed "White-label" | Seed "White-label + domain" |
|---|---|---|---|---|
| `site.enabled` | bool | The channel may have a white-label site | ✓ | ✓ |
| `site.customDomains.max` | int | How many outside domains it may use (0 = subdomain only) | 0 | 2 |
| `site.platformMark` | enum `required` \| `minimal` \| `none` | `required`: "on Al Ummah Now" footer band and the platform account menu. `minimal`: a small footer link. `none`: only the legal and report links | `minimal` | `none` |
| `site.pages.max` | int | Content pages it may publish | 20 | 100 |
| `site.navigation.max` | int | Items in the main menu | 8 | 12 |
| `site.analytics` | bool | Site analytics in Studio | ✓ | ✓ |
| `site.brandedSignIn` | bool | The sign-in page shows the site's brand | – | ✓ |

The seed names and values are suggestions; admins change them in the plans editor (SS1).

### 3.3 Compared with the base channel and the scholar page

| | Channel (any creator) | Scholar page on www | White-label site |
|---|---|---|---|
| Address | `videos/@handle` | `www/…/scholars/slug/` | `slug.alummahnow.net` or own domain |
| Branding | Avatar and banner | Al Ummah Now | A chosen platform theme + its own logo, name and favicon |
| Written in | Studio (community posts) | CMS (writer) | Studio as the site CMS |
| Content pages | – | – | ✓ (blocks) |
| Own navigation | – | – | ✓ |
| Post kinds | Community kinds | article, cards | Every `PostV2` kind |
| Canonical | videos | www | The site |
| Platform mark | Platform | Platform | By tier |

## 4. Domains

### 4.1 Two kinds of host

| Kind | Example | How Cloudflare serves it | Cost |
|---|---|---|---|
| **Platform subdomain** (every white-label site) | `mustafa-elbadry.alummahnow.net`; QA `…qa.alummahnow.net`; stage `…stage.alummahnow.net` | A **Workers Custom Domain** on the www Worker, attached by admin-api when the site is granted. Each gets its own certificate | Free |
| **Own domain** (`site.customDomains.max > 0`) | `example.com`, `www.example.com` | A **Cloudflare for SaaS custom hostname** on a dedicated SaaS zone. The scholar adds a CNAME to `sites.<saas-zone>`, and Cloudflare issues the certificate (HTTP or TXT validation) | First 100 hostnames free, then **$0.10 per hostname per month** |

### 4.2 Own domains with Cloudflare for SaaS

- **A dedicated zone.** The custom hostnames live on a separate zone (a new domain the owner registers, SS9). That zone has a proxied fallback origin (`sites.<saas-zone>`) and a Worker route `*/*` to the www Worker. A catch-all route on `alummahnow.net` itself would sit beside twenty platform hosts, and one routing mistake could take them down. A separate zone keeps the platform zone untouched.
- **Flow in Studio → Site → Domains:**
  1. The owner types `example.com`.
  2. Studio shows the DNS records: a CNAME `www.example.com → sites.<saas-zone>`, and for the apex either their DNS provider's CNAME flattening/ALIAS or a redirect from the apex to `www`.
  3. admin-api creates the custom hostname through the Cloudflare API (custom hostnames edit, SaaS zone only).
  4. Status moves through *Waiting for DNS* → *Issuing certificate* → *Live*. A job checks every 10 minutes for 72 hours, then daily.
  5. The owner picks the **primary host**. All other hosts 301 to it, and the subdomain stays as a fallback that also 301s.
- **Removing a domain** deletes the custom hostname, and the site's primary falls back to the subdomain. The removed domain's DNS is the scholar's to clean up.
- **Abuse and ownership:** the hostname goes live only after Cloudflare validates DNS. A domain that is already attached to another site is refused. Suspending the site serves a neutral "unavailable" page on every host.
- **Limits:** SaaS custom hostnames scale into the thousands. **Unverified:** the plan limits and the current price should be confirmed in the dashboard before launch.

### 4.3 Slug rules (platform subdomain)

- **Default** is the scholar's English CMS slug (CMS slug rule: English title → AI translation → transliteration), else the channel's English name, else its handle. An admin or the site owner can change it.
- **Shape:** `[a-z0-9-]`, 3–40 characters, starting and ending with a letter or digit, no `--`, unique per environment.
- **Reserved:** every platform host label (`www`, `videos`, `api`, `auth`, `admin`, `cms`, `media`, `images`, `realtime`, `profile`, `qa`, `stage`, `dev`, `mail`, `status`, `docs`, `help`, `embed`, `cdn`, `static`, `assets`) plus generic words (`app`, `login`, `account`, `support`, `blog`, `shop`, `pay`, `billing`, `about`, `news`, `live`, `kids`, `quran`, `scholars`, `ummah`, `alummah`). The list lives in `packages/shared-types`.
- **Renames** keep the old subdomain as a 301 for 12 months (SS12).

### 4.4 Canonical URLs (decided by the owner's independence rule)

| Content | Scholar without the tier | White-label on a platform subdomain | White-label on its own domain |
|---|---|---|---|
| Articles, cards, posts, pages | www (as today) | **The site** | **The site** (primary host) |
| Scholar profile and About | The www scholar page | The site's About page. The www scholar page becomes a short directory entry with "Visit site" and `rel=canonical` to the site | Same |
| Videos and Shorts | The videos watch page | **The videos watch page.** The site's watch page has `rel=canonical` to videos | **The site's watch page.** The videos watch page for that channel's videos points `rel=canonical` to the site and leaves them out of the videos sitemap |
| Community tab on videos | – | Posts link to the site | Same |

**Why videos depend on the domain.** A site on `*.alummahnow.net` is still inside the Al Ummah Now family. Pointing a video's canonical at it would split one video's search signals between two platform hosts for no gain. The videos watch page also holds the comments, recommendations and full player, so it stays canonical.

A scholar on their own domain is building their own brand. Independence means search results should lead to their domain, so the site's watch page is canonical. The videos platform still plays the video, counts the views and hosts the comments; only the page search engines index moves. This is consistent: **the canonical follows the brand host** (SS7).

Other rules:

- Each host serves its own `sitemap.xml` and `robots.txt`. www's and videos' sitemaps leave out URLs whose canonical is a site.
- Structured data: `Person` or `Organization` with `sameAs` to the channel (and to the www directory entry), `WebSite`, `BreadcrumbList`, and `Article` or `VideoObject` per page.
- `hreflang` pairs `en` and `ar` through `translation_key`.
- **Losing the tier:** for 90 days, hosts 302 to the www scholar page (or the channel). Canonicals go back to www and videos within one cache cycle. Custom hostnames are removed after 90 days. Content is kept (§6.4).

## 5. The site

### 5.1 Pages (the www page set, scoped to one channel)

All paths are under `/<locale>/` (`en`, `ar`). The site sets its default locale and can be single-language (SS13).

| Page | Path | Content |
|---|---|---|
| Home | `/` | The site's home layout (§7.4): hero, live banner, latest video, Shorts, the post timeline, playlists, chosen pages |
| Videos, Shorts, Playlists, Live | `/videos/`, `/shorts/`, `/playlists/…`, `/live/` | Channel content in grids. Playlist pages |
| Watch | `/watch/<id>/` | The videos embed player, title, description and more from the channel. Canonical per §4.4. Comments: inline in phase 3, a handoff before that |
| Posts | `/posts/` and `/posts/<slug>/` | Every `PostV2` kind with kind filters. Post pages render with www's article, cards and post renderers |
| Content pages | `/<page-slug>/` | Studio block pages (§7.2): "Courses", "Book a lesson", "Fatwa archive" |
| List pages | `/<page-slug>/` | Curated or filter lists (the www pages model): "Ramadan 1448", "Fiqh of prayer" |
| About | `/about/` | Bio, photo, links, contact |
| Search | `/search/` | Scoped to the site |
| Feeds | `/rss.xml`, `/sitemap.xml` | Per locale |

Wording follows the [glossary](../guides/glossary.md): Arabic UI uses «مرئي / مرئيات» for video and never «فيديو». Shorts are «المقاطع القصيرة».

### 5.2 Rendering: www, multi-tenant by host

| | **www Astro Worker (recommended)** | Videos web app (Next.js on OpenNext) | A new site Worker |
|---|---|---|---|
| "Same website, toned down" | It *is* the website | A different app | A copy |
| Already renders | Timeline, articles, cards, pages and blocks, list pages, scholar page, RSS, JSON-LD | Channel pages, community | Nothing |
| Cost per page | Light SSR plus HTML edge cache | Heavy bundle, client React | Light |
| Data reach | CMS binding, videos API, KV fallbacks | Videos API | Would need both |

How a request works:

1. `src/worker.ts` reads `Host`. `www` and the apex behave as today.
2. Any other host → isolate cache (60 s) → KV `SITES` `host:<host>` → `{siteId, channelId, primaryHost, locales, themeRef, themeCssUrl, mark, navVersion, configVersion, status}`. An unknown host gets a bare 404 that is never cached.
3. A non-primary host 301s to the primary.
4. Astro renders the same `[locale]` routes with a site context. The layout is `SiteLayout` (the site's own header, menu and footer). The data is scoped to the channel and the site store. Canonicals, `SITE_URL` and the theme come from the site.
5. The edge cache key is URL (with host) + build + `configVersion` + theme version.

### 5.3 Theme and branding

**Owner rules (revision 4):** sites use the same theme infrastructure as the platform. We provide the themes, and a site **chooses one, independently of the platform's active theme**. There is no theme editing, no site theme builder and no site-owned packages. Branding beyond the theme is the **logo, name and favicon** only.

- **What a site can choose.** It can choose any theme in the platform's catalogue:
  - the four built-in themes (Lantern, Zujaj, Nahas, Fawanees);
  - later, packages that **platform admins** publish in the existing admin theme builder and mark *Offered to sites* (SS17).

  Themes are made and changed only by platform admins, through the existing theme pipeline: theme packages, the contrast gate, `check:tokens` and theme visibility runs.
- **Independent of the platform.** The site's choice is stored on the site. The platform's `site.theme` setting (videos admin), the `GET /public/site-theme` read and the `?theme=` preview never apply on a site host. When admins change the platform's active theme, no site changes.
- **Pinned to a version.** `sites.theme_ref` holds `<themeId>@<version>`, for example `fawanees@1.2.0`. It is never empty and never means "follow the platform". At grant, the site starts on the platform's current theme, copied in as a pinned ref, and the owner can choose another at any time.
- **Theme updates are offered, not applied.** When the platform ships a new version of a theme (for example Fawanees 1.2 → 1.3), a pinned site keeps its version. Studio shows "Update available" with a side-by-side preview, and the owner chooses. Only a contrast or security fix can be pushed by an admin to sites pinned to that version, and the push is audited and announced in Studio. www keeps each pinned version's compiled CSS as an immutable object keyed by version, for as long as a site uses it.
- **Never falls back to the platform theme.** If a read fails, www renders the site's last-known theme ref from KV `SITES`. Platform pages fall back to Fawanees; a site never does.
- **What www needs.** Built-in themes already ship on every www page (`html[data-theme]`), so phase 1 needs only the per-site ref and version-pinned CSS. Admin-published packages need www to render packages ([UI#55](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/55)), which matters only when SS17 offers them.
- **Header.** Every platform theme has a dark header (a builder rule), so sites have one too. The former question about light headers no longer arises.
- **Branding = logo, name and favicon only.**
  - The **name** (en/ar) shows in the header, titles and feeds.
  - The **logo** is square, used as-is (crop and resize only), and shown in the header.
  - The **favicon** is used as-is, with exact-size PNGs generated as for the platform apps.
  - There are no banners, colour overrides, fonts, custom CSS or wordmarks. The social share image is generated from the logo, name and chosen theme, not uploaded.
- **Light, dark and system** are per viewer, as on the platform. The lantern street shows when the chosen theme is Fawanees.

### 5.4 Platform mark and sign-in

- `site.platformMark` decides the footer: a band ("Videos and posts on Al Ummah Now", plus the platform account menu), a small link, or none. **Every site keeps** a footer link to its terms and privacy notice and a "Report content" link, because the platform hosts and moderates it.
- **Accounts stay Al Ummah Now accounts** (one identity, O13). A viewer signs in to comment, like, vote or subscribe. On a platform subdomain the silent sign-in probe works (same site). On an own domain sign-in is a click, because browsers block the probe's third-party cookie.
- **Branded sign-in** (`site.brandedSignIn`): Auth shows the site's logo and theme on the sign-in page for that site's OAuth redirect, using Auth's existing theme packages. The text still says it is an Al Ummah Now account, so people know which account they are using (SS11).

## 6. Data model and connections

### 6.1 Scholar ↔ channel ↔ site

- A scholar has up to 5 channels and one **primary** channel: add `scholars.primary_channel_id` to the CMS, backfilled from `channel_ids[0]`, picked with an autocomplete.
- A channel belongs to at most one scholar, and a channel has at most one site.
- **Without the tier:** the CMS stays the scholar's home (scholar page, writer role, featuring), as today.
- **With the tier:** the site and Studio become the home. The CMS keeps the scholar profile for the www directory entry, and the bio is edited in Studio and synced back (§6.4).

### 6.2 The site store (new D1, owned by api-videos)

Studio talks to api-videos, so the site's data lives beside it.

```sql
create table sites (
  id text primary key,                 -- site_<ulid>
  channel_id text not null unique,
  status text not null,                -- setup | live | suspended | revoked
  primary_host text not null,
  locales text not null,               -- '["ar","en"]', first = default
  theme_ref text not null,             -- <platform themeId>@<ver>, chosen by the site; never 'platform'
  branding_json text not null,         -- logo, favicon, name en/ar (nothing else; §5.3)
  home_json text not null,             -- home layout blocks (§7.4)
  seo_json text not null,              -- title template, description, verification tokens
  config_version integer not null default 1,
  created_at text not null, updated_at text not null, updated_by text,
  deleted_at text                      -- 30-day soft delete
);
create table site_hosts (host text primary key, site_id text not null,
  kind text not null,                  -- subdomain | custom | redirect
  cf_id text, status text not null, primary_host integer not null default 0, expires_at text);
create table site_pages (id text primary key, site_id text not null, slug text not null, locale text not null,
  translation_key text, title text not null, kind text not null,     -- content | curated | filter
  blocks_json text, list_filter_json text, status text not null, publish_at text,
  seo_json text, created_at text not null, updated_at text not null, deleted_at text,
  unique(site_id, slug, locale));
create table site_page_entries (page_id text not null, position integer not null, ref text not null,
  primary key(page_id, position));
create table site_nav (site_id text not null, locale text not null, position integer not null,
  label text not null, target text not null,          -- page:<id> | list:<kind> | url:<https://…>
  parent integer, primary key(site_id, locale, position));
create table site_redirects (site_id text not null, from_path text not null, to_path text not null,
  primary key(site_id, from_path));
create table site_revisions (id text primary key, site_id text not null, entity text not null,
  entity_id text not null, body_json text not null, created_at text not null, created_by text not null);
```

The **grant** (the tier, its keys, who granted it) stays in admin-api with the other plans. admin-api tells api-videos to create, suspend or revoke the site through an internal call. Every publish writes the `host:<host>` and `channel:<id>` keys in KV `SITES`, and www reads only KV and the public APIs.

### 6.3 Posts: one schema (`PostV2`)

**Kinds** are the same everywhere: `article`, `cards`, `text`, `image`, `video` (video, Short or playlist), `poll`, `quiz`, `gif`, and `link` if SS14 says so. Page-only block types (quote, CTA, columns, divider) stay blocks.

| Kind | www / CMS today | Community today | After |
|---|---|---|---|
| Article | ✓ | Link-out mirror | Both; Studio editor |
| Cards (≤40) | ✓ | – | Both; Studio editor |
| Text | – | ✓ | Both |
| Image (1–10, alt required) | Blocks only | ✓ | Both |
| Video / Short / playlist | Timeline entries | ✓ (video) | Both |
| Poll | – | ✓ | Both |
| Quiz | – | ✓ | Both |
| GIF | – | ✓ | Both (SS14) |
| Link | – | – | SS14 |

```ts
interface PostV2 {
  uid: string;                       // pst_<ulid>, the same wherever the post appears
  kind: 'article'|'cards'|'text'|'image'|'video'|'poll'|'quiz'|'gif'|'link';
  home: 'cms' | 'community';         // where it is edited
  channelId?: string; siteId?: string; authorSub?: string;
  locale: 'en'|'ar'; translationKey?: string;
  slug?: string; title?: string; text?: string; cover?: MediaRef;
  slides?: Slide[]; images?: MediaRef[];
  video?: { videoId?: string; playlistId?: string };
  poll?: { options: {id:string;text:string}[]; multiple: boolean; endsAt?: string };
  quiz?: { options: {id:string;text:string}[]; correctOptionId: string; explanation?: string };
  gif?: MediaRef; link?: { url: string; title?: string; image?: MediaRef };
  status: 'draft'|'scheduled'|'published'|'deleted';
  visibility: 'public'|'subscribers'|'members';
  publishAt?: string; sharedToPlatform?: boolean; featuredAt?: string;
  commentsEnabled: boolean; tags?: string[]; createdAt: string; updatedAt: string;
}
```

- **The types live in** `packages/post-schema` (types, a zod validator, limits and fixtures). The CMS and www vendor it with a pinned sync, the way they vendor Fanous (`sync:posts`, `check:posts`).
- **Renderers:** each kind gets one CSS file and pure HTML-string renderers for www and the sites. The videos app wraps the same classes in React. A fixture test renders every kind in both.
- **Stores:**
  - Studio posts, including every white-label site post, live in the **community store**, written there as `PostV2`.
  - CMS posts by staff and by scholars without the tier stay in **CMS D1**.
  - Engagement (likes, votes, quiz answers, comments) is **always on the community copy**, so there is one discussion wherever a post is read.
- **Links:** the CMS → community mirror (`community_links`) widens to every kind. For scholars **without** the tier, community → CMS mirroring lets editors feature their Studio posts on www (SS15).
- **Sharing a white-label post to www:** a site post with `sharedToPlatform` (on by default, per post) is mirrored to the CMS as a reference. Editors can then feature it on the www home timeline. Its link and canonical point to the site. Feed items gain every kind, which changes the feed shape, so `FEED_FORMAT` goes to 4.

### 6.4 Moving a scholar onto the tier, and off it

- **On:** a one-time **move** of the scholar's CMS posts into the site. Each post is copied into the community store as `PostV2` with the same `uid`, slug and translations. Its home becomes `community`. The CMS row turns into a read-only reference whose www URL 301s to the site (an exception to www's no-redirect rule, because the content moved; SS6). Comments and likes already live on the community copy. Bio and avatar: Studio becomes the editor, and changes sync to the CMS profile for the www directory entry.
- **Off:** the site goes offline (§4.4), and posts stay in the community store and on the channel's Community tab. Pages and settings are kept for 90 days, so restoring the tier brings the site back as it was. After 90 days pages move to the 30-day trash.

### 6.5 Comments and likes

| Surface | Phase 1 | Phase 3 |
|---|---|---|
| Site post and watch pages | Counts, plus "Join the discussion" on the videos post | Inline comments, likes and votes through the videos API, signed in with the site's own session (`__Host-aun_site`) |
| www | As today | Same component |

## 7. Studio as the site's CMS

### 7.1 Scope

**Studio → Site** is shown only when `site.enabled`. Channel owners and channel admins edit; editors write posts and pages; moderators view.

| Area | What it does | Today's equivalent |
|---|---|---|
| Overview | Status, hosts, quick links, checklist (logo, About, first page, domain) | – |
| **Posts** | Create and edit every `PostV2` kind, with schedule, en/ar pair, share to Al Ummah Now, pin and comments switch | Community posts (6 kinds) plus CMS articles and cards |
| **Pages** | Block pages (markdown, image, gallery, posts list, cards, videos, video, CTA, columns, quote, divider) and list pages (curated or filter), drafts, schedule, revisions, preview | CMS pages, blocks and page kinds |
| **Navigation** | Main menu and footer links per language: pages, list pages, Videos/Shorts/Posts/About, external links. Drag to reorder, up to `site.navigation.max` | CMS nav |
| **Home** | Ordered home blocks: hero (pinned video or post), live banner, latest videos, Shorts, timeline, playlists, a page's blocks, CTA | Channel sections and the www home |
| **About** | Bio (en/ar), photo, links, contact, credentials | CMS scholar profile, channel About |
| **Theme & brand** | Choose one of the platform's themes (independent of the platform's active theme), see and accept update offers, upload the logo and favicon, set the site name (en/ar), preview in both modes. No theme editing (§5.3) | The admin Site theme page (choose only) |
| **Domains** | Subdomain, own domains, DNS steps, status, primary host | – |
| **SEO** | Title template, description, search console verification token, redirects (social image generated) | CMS SEO fields |
| **Analytics** | Site views, top pages and posts, referrers, languages, devices | Channel analytics |

Preview: an iframe of the real site with a signed, 10-minute, channel-bound preview token that shows drafts. It is never cached and is `noindex`.

### 7.2 What the CMS keeps

- www itself: the home timeline, featuring, staff pages and posts, list pages, translations and the AI writing assist.
- Scholars **without** the tier keep writing in the CMS (writer role).
- The www scholar directory, plus the reference rows for shared and moved site posts.

### 7.3 Reuse, not a second CMS

- **The block schema becomes shared.** Block types move into `packages/post-schema` (as `BlockV1`), so the CMS and Studio validate the same JSON and www renders both with the same `Blocks.astro`.
- **The editors are React in Studio**, built on the shared schema. The CMS keeps its own editor. Both write the same JSON. Fixture tests keep the two in step.
- **AI assist** (slug, translate, summarise) uses the same Workers AI routes and budget guard as the CMS, metered per site (feature `site-assist`) and off in tests.
- **Moderation:** site posts and pages are platform content. They go through the same reports, AI moderation (Epic 28) and admin actions as community posts.

### 7.4 Home layout blocks

`hero`, `live`, `latestVideos`, `shorts`, `timeline` (posts of every kind, or filtered), `playlists`, `page` (embed a content page's blocks), `cta`, `channelSections` (reuse the channel's own section order).

## 8. Admin UX

- **Grant:** admin-web → *Channels → channel → Plan & add-ons → White-label site*. Choose the add-on and seed (or set the keys), the subdomain (live availability check), the default languages and the linked scholar (autocomplete). On *Grant*, the site is created in `setup`, the subdomain attached, and the owner notified with a link to Studio → Site.
- **Sites list:** status, hosts (with own domains and their certificate state), channel, scholar, tier, granted by, last publish. It has an autocomplete search.
- **Suspend, revoke and restore** use in-app dialogs and the 30-day soft delete. Moderation of the channel cascades to its site.
- **Audit** for every change.

## 9. Cost, caching, performance, security, accessibility

### 9.1 Cost at target scale (O1: $500 a month for the whole platform at scale)

Assumptions: 300 white-label sites, 150 with an own domain (2 hostnames each = 300 custom hostnames), 2M site page views a month, 70% edge-cache hits.

| Item | Unit price | Monthly |
|---|---|---|
| Worker requests and CPU (www) | $0.30 / M requests after the included 10 M; $0.02 / M CPU-ms | ≈ $1–3 |
| KV, D1 site store, CMS and videos reads | Cached 60 s; D1 reads only on a miss | < $2 |
| Version-pinned theme CSS (R2 + CDN) | Class B reads, cached | < $0.50 |
| Analytics Engine | Included, then $0.25 / M | ≈ $0.50 |
| Platform subdomains (Workers Custom Domains) | No charge | $0 |
| **Own domains (Cloudflare for SaaS)** | 100 free, then $0.10 per hostname | **$20** (300 hostnames) |
| SaaS zone (separate domain) | Free plan zone; domain registration ≈ $10 a year | ≈ $1 |
| AI assist in Studio | Workers AI, per-site budget | Capped by budget (S13) |
| **Total** | | **≈ $25–30**, about $0.10 per site per month for an own domain |

At 1,000 own domains (2,000 hostnames) the SaaS line is $190 a month. That is why `site.customDomains.max` exists and is admin-set, and the cost-monitor gets a `custom_hostnames` line with an alert. Guard: a spec asserts that site HTML is cacheable.

### 9.2 Caching and performance

The same as www: `s-maxage=60, stale-while-revalidate=600`. Signed-in views are never cached. Images go through variants. Videos use a click-to-play facade, so there is no player JS until play. Target LCP is under 2.5 s on 4G.

### 9.3 Security and tenant isolation

- **Only platform code runs on a site.** Content is markdown and blocks, sanitised as on www. Sites have no theme or CSS input at all: they choose a platform theme, and the only uploads are the logo and favicon (images, re-encoded). This matters most on `*.alummahnow.net`, which is **same-site** with every app.
- **Cookies stay host-only.** Add a release check that fails if any app sets `Domain=.alummahnow.net`. Each site host gets its own `__Host-aun_site` session.
- **CSP** is the same as www: `script-src 'self'` plus hashes, `frame-src` only the videos embed host, `form-action` auth, `frame-ancestors 'none'`. HSTS on every host. An own domain gets HSTS without `includeSubDomains`, because we don't own their other subdomains.
- **Host validation.** `SITE_URL` always comes from the registry, never from the raw `Host` header, so a spoofed host can't poison the cache. Unknown hosts get a bare 404.
- **OAuth.** Each host's exact redirect URI is registered when the host goes live and removed when it is detached. Auth never accepts wildcard redirect URIs.
- **API tokens.** Two scoped tokens in the Secrets Store: Workers Custom Domains + DNS on `alummahnow.net`, and Custom Hostnames on the SaaS zone. Only admin-api's jobs use them.
- **Phishing risk on own domains.** A white-label site carries someone else's name and logo on an outside domain. Mitigations: admin-only grants; the legal and report footer is always present; sign-in always says it is an Al Ummah Now account; no forms other than platform forms (no custom form builder in v1).

### 9.4 Accessibility

WCAG 2.1 AA is the floor:

- axe runs on every page kind in both languages and both modes, on one fixture site per platform theme.
- Contrast is guaranteed by the platform's theme pipeline. Sites can't change colours.
- Image and cards posts must have alt text. Reduced motion is honoured.
- `lang` and `dir` are set on `<html>`, and every page has a skip link.

## 10. Phased rollout

| Phase | Scope | Done when |
|---|---|---|
| **0. Decisions** | Owner answers SS1–SS16 | Recorded in the [decision log](decisions.md) |
| **1. White-label site, set up by staff** | Tier keys and seeds; grant flow in admin; site store (D1) and KV `SITES`; www multi-tenant rendering (home, videos, Shorts, watch, posts, About, RSS, sitemap) from existing channel content and CMS posts; the site's chosen theme pinned per site (version-pinned CSS), logo, name and favicon, set up by staff for the first site; platform subdomain; **own-domain support (SaaS zone, custom hostnames, DNS flow in admin)**; canonical rules; CMS `primary_channel_id` | mustafa-elbadry's site live on its subdomain (and on its own domain if they have one), after QA and stage |
| **2. Studio as the site CMS** | Studio → Site: Overview, About, Navigation, Home layout, Pages (blocks and list pages), Theme & brand (choose a theme, logo, name, favicon), Domains self-serve, SEO, preview, revisions | The scholar runs their site without staff help |
| **2b. One post model** | `packages/post-schema` (posts and blocks); CMS kinds widened (`FEED_FORMAT` 4); `uid` backfill; Studio article and cards editors; share-to-platform and featuring; move-in tool for CMS posts | A site's poll or article can be featured on the www home, with one discussion |
| **3. Engagement and identity** | Inline comments, likes and votes on sites; site sign-in; branded sign-in; site analytics | A viewer comments on a site post without leaving the site |
| **Native apps** | Channel screens link to the site | – |

Every phase updates this page and the repo pages (wiki rule).

### Migrations

| Repo | Migration | Phase |
|---|---|---|
| AlUmmahNow admin-api | Entitlement keys and the two add-on seeds | 1 |
| AlUmmahNow api-videos | New D1 database `al-ummah-now-sites[-qa\|-stage]` with the §6.2 tables | 1 |
| AlUmmahNowCMS | `primary_channel_id` (1); post kinds, `uid`, `origin`, reference rows (2b) | 1, 2b |
| AlUmmahNow community store | R2 backfill adding `uid` and `schemaVersion: 2` | 2b |
| AlUmmahNowAuth | Per-host redirect URIs on the sites client; branded sign-in per redirect | 1, 3 |

Migration numbers are assigned when building.

## 11. Risks

| Risk | Mitigation |
|---|---|
| Studio grows into a second CMS that drifts from the CMS | One shared schema for posts and blocks, one renderer (www), fixture tests in both editors |
| Own-domain sites used for phishing or impersonation | Admin-only grant, validated DNS, the legal/report footer always on, sign-in always names the account, no custom forms |
| SaaS hostname costs grow | `site.customDomains.max` per tier, a cost-monitor line and an alert |
| Duplicate content | One canonical per item, chosen by the brand host (§4.4); platform sitemaps leave site-canonical URLs out |
| www is a single point of failure for every site | www's stale-cache and KV snapshot fallbacks also cover sites; release E2E covers one site per host kind |
| A theme update changes a site unexpectedly | Sites stay pinned; updates are offered with a preview; only audited contrast or security fixes are pushed |
| A scholar leaves the tier | 90-day offline period with everything kept; posts stay on the channel |

## 12. Decisions for the owner

The owner's 2026-11-13 direction answered these earlier questions: it is a **tier**, white-label, with **its own choice of theme and its own name and logo**, **independent** (canonical on its own host), **not every scholar** gets it, and **own domains** are in scope. The theme rules answered more. A site **chooses one of our themes, independently** of the platform's active theme, pinned per site, with no fallback to the platform theme. There is **no theme editing or site theme builder**, and branding is **logo, name and favicon only**. The former **SS10** (light headers) no longer arises, because every platform theme has a dark header, so it is removed and the other numbers are kept. What is left:

| # | Decision | Recommendation |
|---|---|---|
| SS1 | The tier is an **add-on on the channel**, granted by admins, separate from the user's creator plan. Seeds: "White-label" (subdomain, minimal mark) and "White-label + domain" (2 domains, no mark, branded sign-in) | Yes, with keys as in §3.2 |
| SS2 | One site per channel, and the site stays with the channel on transfer | Yes |
| SS3 | www's Worker renders the sites ("the same website, toned down") | Yes |
| SS4 | **Studio is the site's CMS** (posts, pages, navigation, home, About, theme, domains, SEO), with a new site store in D1 owned by api-videos. The CMS stays for www and for scholars without the tier | Yes |
| SS5 | One post schema (`PostV2`) and one block schema shared by the CMS and Studio; engagement always on the videos community post | Yes |
| SS6 | When a scholar gets the tier, their existing CMS posts **move** to the site, and old www URLs 301 to the site (an exception to the no-redirect rule) | Yes, with the scholar's consent at grant |
| SS7 | Videos: canonical on videos for subdomain sites; on the **site** for sites with their own domain | Yes (§4.4) |
| SS8 | White-label posts can be **shared to Al Ummah Now** (on by default per post) so editors can feature them on www; the item links to the site | Yes |
| SS9 | Own domains go on a **separate SaaS zone** (a new domain the owner registers) rather than a catch-all on `alummahnow.net` | Yes; the owner picks the domain name |
| SS11 | Viewers sign in with their Al Ummah Now account everywhere. Branded sign-in still says "Al Ummah Now account" | Yes |
| SS12 | A renamed subdomain keeps a 301 for 12 months | Yes |
| SS13 | Can a site be single-language (Arabic only, for example)? | Yes; the default is both |
| SS14 | Keep GIF posts, and add a Link kind? | Keep GIF; add Link |
| SS15 | For scholars **without** the tier, mirror their Studio community posts into the CMS so editors can feature them | Yes |
| SS16 | First site: mustafa-elbadry, set up by staff in phase 1 (their chosen platform theme, logo, name and favicon, subdomain, own domain if they have one), with Studio self-service in phase 2 | Yes |
| SS17 | Which platform themes are offered to sites: the four built-ins at launch, then admin-published packages marked *Offered to sites* once www renders packages (UI#55)? | Yes |

## Open questions, not decisions

- Does mustafa-elbadry have, or want, an own domain? Is their CMS slug and primary channel right in production? **Unverified.**
- Cloudflare for SaaS plan limits and price on this account. **Unverified**; check before phase 1.

## Status evidence

- This page (draft PR on AlUmmahNowWiki). No code yet.

## Sources

- CMS: [`docs/SCHOLARS.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/docs/SCHOLARS.md), [`migrations/0013_scholars.sql`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/migrations/0013_scholars.sql), [`src/lib/scholars/community.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/src/lib/scholars/community.ts), [`src/schema.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/src/schema.ts), [`src/lib/blocks.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/src/lib/blocks.ts), [`docs/PUBLIC_API.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/docs/PUBLIC_API.md), [`src/lib/feed/format.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/src/lib/feed/format.ts)
- www: [`src/pages/[locale]/scholars/[slug]/index.astro`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/src/pages/%5Blocale%5D/scholars/%5Bslug%5D/index.astro), [`src/lib/edge.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/src/lib/edge.ts), [`src/lib/auth.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/src/lib/auth.ts), [`wrangler.jsonc`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/wrangler.jsonc)
- Videos: [`packages/shared-types/src/community-post.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/packages/shared-types/src/community-post.ts), [`packages/shared-types/src/channel.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/packages/shared-types/src/channel.ts), [`apps/api-videos/src/lib/scholar-articles.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/api-videos/src/lib/scholar-articles.ts), [`apps/api-videos/src/routers/scholars-internal.router.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/api-videos/src/routers/scholars-internal.router.ts), [`apps/web/src/lib/scholars/lookup.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/web/src/lib/scholars/lookup.ts), [`packages/shared-types/src/entitlements.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/packages/shared-types/src/entitlements.ts), [`apps/admin-api/migrations/0004_plans_entitlements.sql`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/admin-api/migrations/0004_plans_entitlements.sql), [`docs/plans/SUBSCRIPTIONS.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/docs/plans/SUBSCRIPTIONS.md)
- Wiki: [AUN-SUBS](AUN-SUBS-subscriptions-plan.md), [Epic 27](E27-plans-entitlements.md), [CMS home timeline](CMS-HOME-TIMELINE-www-home-timeline.md), [Channel sections](AUN-CHANNEL-SECTIONS-channel-sections.md), [Theming](../guides/theming.md), [Authentication](../guides/authentication.md), [Environments](../guides/environments.md), [Data lifecycle](../guides/data-lifecycle.md)
