[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Scholar sites: white-label sites (spec, draft for owner review)

| | |
|---|---|
| **ID** | `AUN-SCHOLAR-SITES` |
| **Owning repos** | [AlUmmahNowUI](../repos/AlUmmahNowUI.md) (www and the new sites Worker, sharing one render package), [AlUmmahNow](../repos/AlUmmahNow.md) (Studio as the site CMS, site data in the existing R2 buckets, entitlements, community posts, admin), [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md) (scholar pages for scholars without the tier, featuring), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) (sign-in on new hosts, branded sign-in) |
| **Status** | **in progress**: phase 1 **complete** (2026-11-13); phase 2: sites Worker live on production, own domains proven on QA, Studio self-service (SS16) merged; revision 10 |
| **Last updated** | 2026-11-13 |

> **Request (2026-11-13):** *"scholar sites, like mustafa-elbadry.alummahnow.net, which is a tier on its own, where the channel gets a site of its own filled with the channel's videos and community posts; connect the www scholars with channels, and community posts with www posts; and channel community should have the same post types as www."*
>
> **Direction (2026-11-13, revision 2):** *"A scholar site is a toned-down version of the website. It's the same, but WHITE-LABEL: they get their own theme and so on; maybe even Studio becomes their own CMS. The scholar sites are independent. Not all scholars will get the white label, and the white label might even allow full domains outside Al Ummah Now."*
>
> **Answers (2026-11-13, revision 9): the last four, plus the hosting and domains setup.**
> - **SS12:** yes. A renamed subdomain keeps a 301 for 12 months (as built).
> - **SS14:** confirmed. GIF posts stay, and **Link** posts are added: a preview card with the image, title and site name, plus the creator's optional comment. Link must be complete in the Studio composer, on www, on the sites and in the native apps.
> - **SS16 (changed):** staff setup from the admin **and** Studio self-service for channel owners both ship from day one: phase 3's self-service moves into phase 2. The first site is mustafa-elbadry.
> - **SS18 (changed):** scholars write only in Studio, but the CMS **writer role stays for staff** who edit Al Ummah Now's own content. Only scholar accounts get "Write in Studio"; staff writers keep the full CMS editor.
> - **One shared sites Worker** for every site, routed by host; no per-site Workers (confirms SS3).
> - **Own domains:** a token with *SSL and Certificates → Edit* on `alummahnow.org` is stored in the Secrets Store (`sites-saas-token`, store `f8eddc99…`), bound to admin-api. Cloudflare for SaaS is being enabled on the zone by the owner (until then the custom hostnames API answers 1404, no quota): "Add your own domain" is built in the admin and Studio (create the custom hostname, show the CNAME/TXT to add, poll the certificate) and tested with mocks.
> - The release token now has *Zone WAF Edit* on every alummahnow zone; whether it can make the one-time `alummahnow.org` wildcard DNS, routes and fallback origin is checked by the zone setup workflow.
>
> **Hosting and own domains are live (2026-11-13, revision 10).**
> - The release token is the org secret `CLOUDFLARE_API_TOKEN` with DNS and SSL edit on `alummahnow.org`. The Sites zone workflow made the proxied AAAA `100::` records (`*`, `@`, `www`, `sites`, `*.qa`, `sites.qa`, `*.stage`, `sites.stage`) and turned Always Use HTTPS on. The owner enabled Cloudflare for SaaS, and the fallback origin is `sites.alummahnow.org`.
> - Production: `https://sites.alummahnow.org/healthz` answers, `alummahnow.org` 301s to www, and unknown subdomains get a 404. QA and stage subdomains (`<slug>.qa.alummahnow.org`) resolve but need the Advanced Certificate (about $10/month, waiting on the owner). Their deploy smoke skips until then.
> - **Own domains, proven end to end on QA:** the Sites zone workflow mode *own-domain-smoke-qa* created a throwaway custom hostname, added the scholar's records in `alummahnow.com`, routed it to the QA Worker and fetched `/healthz` over HTTPS. Everything was removed afterwards. Validation took 77 s.
> - **Routing (AlUmmahNowUI#97):** production `*/*` serves every own domain. QA and stage use test domains only, under `*.qa-sites.alummahnow.com` / `*.stage-sites.alummahnow.com`. All envs share one custom-hostname namespace on the zone, so QA/stage admin-api refuses other hosts (videos #1309).
> - **What a scholar adds at their DNS provider** (Studio → Site → Domains shows the exact values): `CNAME <host> → sites.alummahnow.org`, `TXT _cf-custom-hostname.<host>` (ownership), and usually two `TXT _acme-challenge.<host>` (certificate). All of them can be added at once. A bare domain needs CNAME flattening/ALIAS at the provider, or they can use `www.` and redirect the apex.
> - Studio self-service (SS16) merged: videos #1281 and AlUmmahNowUI #95.
>
> **Answers (2026-11-13, revision 8): SS9 and the domain plan.** Scholar sites live on **`alummahnow.org`**. Every white-label site gets `<slug>.alummahnow.org` (QA `<slug>.qa.alummahnow.org`, stage `<slug>.stage.alummahnow.org`). The same zone is the Cloudflare for SaaS zone for scholars' own domains, with the DNS target `sites.alummahnow.org`. The zone has been in our Cloudflare account since 2026-11-13. The main sites stay on `alummahnow.net`, `alummahnow.com` redirects to `.net`, and `alummahnow.app` is reserved for apps (§4).
>
> **Answers (2026-11-13, revision 7):**
> - **SS8:** no opt-out. Every public post on a scholar's primary channel gets a www reference, and editors decide what to feature.
> - **SS11:** yes. One Al Ummah Now account everywhere, and branded sign-in still says so.
> - **SS13:** yes. A site may be single-language.
>
> **Answers (2026-11-13, revision 6):**
> - **SS3:** sites run on a **separate "sites" Worker**, with its own deploy and routes, so attaching domains never touches www. It shares www's rendering code through a package. Workers for Platforms is not needed (§5.2).
> - **SS5:** yes, one post format for the CMS and community, with engagement on the videos side.
> - **SS6 (changes the model):** from the start, a scholar's content, on the www scholar page and on the white-label site, is **fuelled by the channel's community posts**. www holds only thin, hidden **references** (like a repost), which editors can feature or curate without copying. This applies to every scholar, with or without the tier (§6.3).
> - **SS7:** as recommended. Videos are canonical on the videos site for subdomain sites; on a scholar's own domain, the site's watch page is canonical.
>
> **Answers (2026-11-13, revision 5):** SS1 is an admin add-on with two tiers. SS2: the channel's owner and admins **are** the site's owner and admins; the site follows the channel, one per channel. SS17: a site can choose **any active platform theme**. SS4: reuse existing storage. Site posts **are** the channel's community posts, and new storage is added only for what doesn't exist yet (§6.2).
>
> **Theme (2026-11-13, revision 4, which replaces revision 3's theme builder):** white-label sites use the **same theme infrastructure** as the platform. Al Ummah Now provides the themes, and a site only **chooses** one of them, independently of the platform's active theme. There is no theme editing, no site-scoped theme builder and no theme package of the site's own. The choice is pinned per site and never falls back to the platform theme. Branding beyond the theme is the **logo, name and favicon** only.
>
> Code facts were read from `main` on 2026-11-13: AlUmmahNow [`de8c284`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/de8c284f8a1b84b7008c416a68e2f007de55ab5c), AlUmmahNowCMS [`d661daf`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/tree/d661daf7d266cb6804637cf616fa7b5fa680b21b), AlUmmahNowUI [`b521637`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/b5216371b3aa37a8308f1bc3b6491af4b8689a82). The visual review page, with diagrams and mocks, is linked from the PR description.

## 1. Summary

There are two levels for a scholar. Both are **fuelled by the scholar's channel's community posts** (SS6):

| | **Scholar page** (no tier, every scholar) | **White-label site** (a tier; admins choose who gets it) |
|---|---|---|
| Where | `www.alummahnow.net/{en,ar}/scholars/{slug}/` | Its own host: `<slug>.alummahnow.org` and/or the scholar's **own domain** (`example.com`) |
| Content comes from | The channel's community posts (via www references) and videos | The same community posts and videos, plus the site's pages |
| Looks like | Al Ummah Now (platform theme and header) | **The scholar's brand on one of our themes**: a theme the site chooses (independent of the platform's), plus its own logo, name and favicon. The Al Ummah Now mark is optional by tier |
| Written in | **Studio** (community posts of every kind, including articles and cards) | **Studio**, also acting as the site's CMS: pages, navigation, home layout, SEO, domains |
| Rendered by | www Worker | The **sites Worker** (same render package as www) |
| Canonical | www | **The site's own host**, for everything it publishes |
| On the www home | When editors feature the post's www reference | Same: the reference links to the site |

The recommendation in short:

- **One source of truth for scholar content: the community post.** Scholars write in Studio. The CMS keeps a thin hidden **reference** per post (slug, locale, featuring, curation and a summary cache for the feed) and never a copy of the content. Existing CMS scholar posts are converted (§6.6).
- **A separate sites Worker** (`al-ummah-now-sites`) serves every white-label host on the dedicated **`alummahnow.org`** zone: a wildcard route for `<slug>.alummahnow.org`, plus the zone's Cloudflare for SaaS fallback origin `sites.alummahnow.org` for own domains. Its rendering comes from a package shared with www, so "the same website, toned down" stays literally true, and www's config is never touched when a domain is attached. Workers for Platforms is not needed, because we run our own code for every site.
- **Existing storage first:** community posts (R2), channel Home sections (R2), the channel record (R2). New storage is only the site's settings, pages and host index, as R2 objects in existing buckets, plus reference rows in the CMS's existing `posts` table. No new database or KV namespace (§6.2).
- **Own domains from day one**, through Cloudflare for SaaS custom hostnames on `alummahnow.org` ($0.10 per hostname per month after the first 100).
- **The tier is an admin add-on on the channel** (SS1), with two tiers. The channel's owner and admins run the site (SS2). The site chooses any active platform theme, pinned (SS17).

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
| Address | `videos/@handle` | `www/…/scholars/slug/` | `slug.alummahnow.org` or own domain |
| Branding | Avatar and banner | Al Ummah Now | A chosen platform theme + its own logo, name and favicon |
| Written in | Studio (community posts) | Studio (community posts; www holds refs) | Studio (posts) + Studio as the site CMS |
| Content pages | – | – | ✓ (blocks) |
| Own navigation | – | – | ✓ |
| Post kinds | Community kinds | article, cards | Every `PostV2` kind |
| Canonical | videos | www | The site |
| Platform mark | Platform | Platform | By tier |

## 4. Domains

### 4.0 The domain plan (SS9, decided 2026-11-13)

| Domain | Use |
|---|---|
| `alummahnow.net` | The main sites (www, videos, auth, CMS, admin, media…), as today. Nothing for scholar sites |
| **`alummahnow.org`** | **Scholar sites only.** `<slug>.alummahnow.org` per white-label site, and the Cloudflare for SaaS zone for scholars' own domains (`sites.alummahnow.org`). The zone has been in our Cloudflare account since 2026-11-13 |
| `alummahnow.com` | Redirects to `alummahnow.net` |
| `alummahnow.app` | Reserved for apps |

The apex `alummahnow.org` and `www.alummahnow.org` 301 to `https://www.alummahnow.net/` (a scholar directory page can come later).

Because `.org` is a **separate registrable domain**, scholar sites are a different "site" in browser terms from every platform app. That shapes sign-in (§5.4) and isolation (§9.3).

### 4.1 Two kinds of host

| Kind | Example | How Cloudflare serves it | Cost |
|---|---|---|---|
| **Platform subdomain** (every white-label site) | `mustafa-elbadry.alummahnow.org`; QA `mustafa-elbadry.qa.alummahnow.org`; stage `mustafa-elbadry.stage.alummahnow.org` | **Production:** a proxied wildcard DNS record `*.alummahnow.org`, the zone's Universal SSL certificate (which covers one level of wildcard), and a Worker route `*.alummahnow.org/*` to the production sites Worker. Adding a site writes only its host index entry; **no Cloudflare call per site**. **QA and stage:** routes `*.qa.alummahnow.org/*` and `*.stage.alummahnow.org/*` to their Workers. These names are two levels deep, so they need a wildcard certificate from Advanced Certificate Manager (one certificate covers both), or a free Workers Custom Domain per test site | Production free. QA/stage: ACM about $10 a month for the zone, or free with per-site custom domains |
| **Own domain** (`site.customDomains.max > 0`) | `example.com`, `www.example.com` | A **Cloudflare for SaaS custom hostname** on the `alummahnow.org` zone. The scholar adds a CNAME to **`sites.alummahnow.org`** (the fallback origin), and Cloudflare issues the certificate (HTTP or TXT validation) | First 100 hostnames free, then **$0.10 per hostname per month** |

**Route precedence.** The more specific `*.qa.` and `*.stage.` routes win over `*.alummahnow.org/*`, and own-domain traffic arrives through the fallback origin's `*/*` route to the production Worker. QA and stage own-domain tests use a test hostname with an explicit route to that environment's Worker. **To verify in phase 2:** route matching order on this zone, and that a custom hostname reaches the Worker through `*/*`.

### 4.2 Own domains with Cloudflare for SaaS

- **The zone is `alummahnow.org`**, dedicated to scholar sites, so the catch-all `*/*` route and the wildcard can't affect a platform host on `alummahnow.net`. Phase 2 setup on the zone:
  1. Enable Cloudflare for SaaS. *(done 2026-11-13)*
  2. Add the proxied fallback origin `sites.alummahnow.org`. *(done)*
  3. Add the wildcard DNS record and the routes. *(DNS done. Routes: production `*/*`; QA/stage test-domain routes `*.qa-sites` / `*.stage-sites.alummahnow.com`)*
  4. Turn on HSTS for the apex and its subdomains. They are all ours, so `includeSubDomains` is safe.
- **Flow in Studio → Site → Domains:**
  1. The owner types `example.com`.
  2. Studio shows the DNS records: a CNAME `www.example.com → sites.alummahnow.org`, and for the apex either their DNS provider's CNAME flattening/ALIAS or a redirect from the apex to `www`.
  3. admin-api creates the custom hostname through the Cloudflare API, with a token limited to custom hostnames on `alummahnow.org`.
  4. Status moves through *Waiting for DNS* → *Issuing certificate* → *Live*. A job checks every 10 minutes for 72 hours, then daily.
  5. The owner picks the **primary host**. All other hosts 301 to it, and `<slug>.alummahnow.org` stays as a fallback that also 301s.
- **Removing a domain** deletes the custom hostname, and the site's primary falls back to `<slug>.alummahnow.org`. The removed domain's DNS is the scholar's to clean up.
- **Abuse and ownership:** the hostname goes live only after Cloudflare validates DNS. A domain that is already attached to another site is refused. Suspending the site serves a neutral "unavailable" page on every host.
- **Limits:** SaaS custom hostnames scale into the thousands. **Unverified:** the plan limits and price on the `alummahnow.org` zone should be confirmed in the dashboard before launch.

### 4.3 Slug rules (platform subdomain)

- **Default** is the scholar's English CMS slug (CMS slug rule: English title → AI translation → transliteration), else the channel's English name, else its handle. An admin or the site owner can change it.
- **Shape:** `[a-z0-9-]`, 3–40 characters, starting and ending with a letter or digit, no `--`, unique per environment.
- **Reserved:** on `alummahnow.org`: `www`, `sites` (the fallback origin), `qa`, `stage` and `app`; plus every platform host label (`www`, `videos`, `api`, `auth`, `admin`, `cms`, `media`, `images`, `realtime`, `profile`, `qa`, `stage`, `dev`, `mail`, `status`, `docs`, `help`, `embed`, `cdn`, `static`, `assets`) plus generic words (`app`, `login`, `account`, `support`, `blog`, `shop`, `pay`, `billing`, `about`, `news`, `live`, `kids`, `quran`, `scholars`, `ummah`, `alummah`). The list lives in `packages/shared-types`.
- **Renames** keep the old subdomain as a 301 for 12 months (SS12).

### 4.4 Canonical URLs (decided by the owner's independence rule)

| Content | Scholar without the tier | White-label on a platform subdomain | White-label on its own domain |
|---|---|---|---|
| Articles, cards, posts, pages | www (as today) | **The site** | **The site** (primary host) |
| Scholar profile and About | The www scholar page | The site. The www scholar page stays the full page (profile, posts, videos) as for every scholar (SS6), with no "Visit site" block; only its `rel=canonical` points to the site's home (owner, 2026-11-14) | Same |
| Videos and Shorts | The videos watch page | **The videos watch page.** The site's watch page has `rel=canonical` to videos | **The site's watch page.** The videos watch page for that channel's videos points `rel=canonical` to the site and leaves them out of the videos sitemap |
| Community tab on videos | – | Posts link to the site | Same |

**Why videos depend on the domain.** A site on `<slug>.alummahnow.org` is still an Al Ummah Now-branded host, although it is a separate registrable domain. Pointing a video's canonical at it would split one video's search signals between two platform hosts for no gain. The videos watch page also holds the comments, recommendations and full player, so it stays canonical.

A scholar on their own domain is building their own brand. Independence means search results should lead to their domain, so the site's watch page is canonical. The videos platform still plays the video, counts the views and hosts the comments; only the page search engines index moves. This is consistent: **the canonical follows the brand host** (SS7, decided 2026-11-13).

Other rules:

- Each host serves its own `sitemap.xml` and `robots.txt`. www's and videos' sitemaps leave out URLs whose canonical is a site.
- Structured data: `Person` or `Organization` with `sameAs` to the channel (and to the www scholar page), `WebSite`, `BreadcrumbList`, and `Article` or `VideoObject` per page.
- `hreflang` pairs `en` and `ar` through `translation_key`.
- **Losing the tier:** for 90 days, hosts 302 to the www scholar page (or the channel). Canonicals go back to www and videos within one cache cycle. Custom hostnames are removed after 90 days. Content is kept (§6.4).

## 5. The site

### 5.1 Pages (the www page set, scoped to one channel)

All paths are under `/<locale>/` (`en`, `ar`). The site sets its default locale and can be single-language (SS13, decided): a single-language site serves only that locale, and the other prefix 301s to it.

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

### 5.2 Rendering: a separate sites Worker sharing www's code (SS3, answered)

**Why a separate Worker.** The owner wants domains handled independently of www. Attaching a subdomain or an own domain, the SaaS zone's `*/*` route, and a bad site config must never touch www's deploy, routes or cache.

| | www Worker (`al-ummah-now-www`) | **Sites Worker (`al-ummah-now-sites[-qa\|-stage]`)** |
|---|---|---|
| Hosts | `www.alummahnow.net` and the apex (as today) | Every white-label host on the `alummahnow.org` zone: the wildcard routes `*.alummahnow.org/*` (and `*.qa.`/`*.stage.` per environment), plus the fallback origin's `*/*` route for own domains |
| Code | `apps/www` | `apps/sites` |
| Shared | `packages/render`: Astro components (timeline, post and cards renderers, blocks, video facades, layouts), data clients (CMS, videos, community), themes, i18n, edge cache helpers | Same package |
| Deploy | Its own release | Its own release, gated by the same E2E. A sites deploy can't break www, and the reverse |
| Bindings | CMS service binding, `FEED`, `CONTENT_SNAPSHOT` | CMS service binding (directory entry, references), `CONTENT_SNAPSHOT` (last good site configs), no `FEED` |

**Where the code lives.** AlUmmahNowUI becomes a small workspace: `apps/www`, `apps/sites` and `packages/render`. One PR changes both apps, and CI builds both. That is lighter than publishing a package from another repo, and the two can't drift.

**How a request works (sites Worker):**

1. Read `Host`, then isolate cache (60 s), then `GET {videos-api}/api/sites/by-host/:host` (Cache API 60 s, from the R2 host index and `settings.json`). The last good answer is kept in `CONTENT_SNAPSHOT`, so a videos API outage still renders the site in its own theme. An unknown host gets a bare 404 that is never cached.
2. A non-primary host 301s to the primary.
3. Render the same `[locale]` routes from `packages/render` with `SiteLayout`, scoped to the channel.
4. The edge cache key is URL (with host) + build + `configVersion` + theme version.

**Do we need Workers for Platforms?** No.

| | **Cloudflare for SaaS + one sites Worker (recommended)** | Workers for Platforms (WfP) |
|---|---|---|
| What it is for | Serving **many customer domains** with TLS from one zone, routed to our Worker | Running **customer-supplied code**: thousands of isolated user Workers in a dispatch namespace, each uploaded by or for a customer |
| Fits us? | Yes. We run **our own code** for every site; only the data differs | No. No site runs its own code (§9.3), and WfP doesn't provide domains: you still need Cloudflare for SaaS for custom hostnames |
| Price | Our existing Workers Paid plan ($5/month account-wide; 10 M requests and 30 M CPU-ms included, then $0.30 / M requests and $0.02 / M CPU-ms). Custom hostnames: 100 free, then $0.10 each per month | **$25/month** base (includes about 20 M requests, 60 M CPU-ms and 1,000 scripts), then about $0.30 / M requests, $0.02 / M CPU-ms and $0.02 per script per month, **plus** the same Cloudflare for SaaS hostname fees |
| Limits | Custom hostnames: up to tens of thousands on non-Enterprise plans. Workers Custom Domains: per-zone limit to confirm | Script count and dispatch limits per namespace |
| Operations | One Worker to deploy | A dispatch Worker plus per-site scripts to upload, version and keep in step |

**Unverified:** the WfP and SaaS prices and limits above are from Cloudflare's public pricing as remembered on 2026-11-13. Check them in the dashboard before phase 2. The recommendation doesn't depend on the exact numbers: WfP solves a problem we don't have (untrusted code), and it still needs Cloudflare for SaaS for domains.

**Routes are static.** The sites Worker's `wrangler.jsonc` declares its zone routes on `alummahnow.org` once. Adding a site never changes Cloudflare config, only the R2 host index. Only own domains (custom hostnames), and the QA/stage per-site domains if ACM isn't bought, are created through the API.

### 5.3 Theme and branding

**Owner rules (revision 4):** sites use the same theme infrastructure as the platform. We provide the themes, and a site **chooses one, independently of the platform's active theme**. There is no theme editing, no site theme builder and no site-owned packages. Branding beyond the theme is the **logo, name and favicon** only.

- **What a site can choose.** It can choose any theme in the platform's catalogue:
  - **every active theme in the platform's theme list, automatically** (SS17, answered): the four built-in themes (Lantern, Zujaj, Nahas, Fawanees) plus every package platform admins publish in the existing admin theme builder. There is no separate "offered to sites" flag.
  - If admins retire a theme that a site uses, the site keeps its pinned version (the CSS objects are immutable), and Studio asks the owner to choose another. Nothing changes until they do.

  Themes are made and changed only by platform admins, through the existing theme pipeline: theme packages, the contrast gate, `check:tokens` and theme visibility runs.
- **Independent of the platform.** The site's choice is stored on the site. The platform's `site.theme` setting (videos admin), the `GET /public/site-theme` read and the `?theme=` preview never apply on a site host. When admins change the platform's active theme, no site changes.
- **Pinned to a version.** The site's `themeRef` (in `settings.json`) holds `<themeId>@<version>`, for example `fawanees@1.2.0`. It is never empty and never means "follow the platform". At grant, the site starts on the platform's current theme, copied in as a pinned ref, and the owner can choose another at any time.
- **Theme updates are offered, not applied.** When the platform ships a new version of a theme (for example Fawanees 1.2 → 1.3), a pinned site keeps its version. Studio shows "Update available" with a side-by-side preview, and the owner chooses. Only a contrast or security fix can be pushed by an admin to sites pinned to that version, and the push is audited and announced in Studio. www keeps each pinned version's compiled CSS as an immutable object keyed by version, for as long as a site uses it.
- **Never falls back to the platform theme.** If a read fails, www renders the site's last-known config, theme ref included, from www's `CONTENT_SNAPSHOT` KV. Platform pages fall back to Fawanees; a site never does.
- **What www needs.** Built-in themes already ship on every www page (`html[data-theme]`), so phase 1 needs only the per-site ref and version-pinned CSS. Admin-published packages need www to render packages ([UI#55](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/55)). Because SS17 offers every active theme, UI#55 is now a **phase 1** item. Until it ships, the theme list in Studio shows only the themes www can render.
- **Header.** Every platform theme has a dark header (a builder rule), so sites have one too. The former question about light headers no longer arises.
- **Branding = logo, name and favicon only.**
  - The **name** (en/ar) shows in the header, titles and feeds.
  - The **logo** is square, used as-is (crop and resize only), and shown in the header.
  - The **favicon** is used as-is, with exact-size PNGs generated as for the platform apps.
  - There are no banners, colour overrides, fonts, custom CSS or wordmarks. The social share image is generated from the logo, name and chosen theme, not uploaded.
- **Light, dark and system** are per viewer, as on the platform. The lantern street shows when the chosen theme is Fawanees.

### 5.4 Platform mark and sign-in

- `site.platformMark` decides the footer: a band ("Videos and posts on Al Ummah Now", plus the platform account menu), a small link, or none. **Every site keeps** a footer link to its terms and privacy notice and a "Report content" link, because the platform hosts and moderates it.
- **Accounts stay Al Ummah Now accounts** (one identity, O13, SS11). A viewer signs in to comment, like, vote or subscribe.
- **Cross-site sign-in works, by redirect.** `alummahnow.org` and own domains are a different registrable domain from `auth.alummahnow.net`. The silent background probe www uses (a credentialed fetch to `auth…/session/accounts`) would be a third-party request, and Safari, Firefox and Chrome with third-party cookies blocked drop its cookie. So sites **don't probe**. The flow:
  1. The viewer clicks **Sign in**.
  2. A **top-level redirect** goes to `auth.alummahnow.net/authorize` (PKCE, the sites client, the site's exact redirect URI). That is a first-party visit to auth, so its `__session` cookie (SameSite=Lax) is sent.
  3. If the viewer is already signed in to Al Ummah Now, auth returns straight away with a code, with no password and no prompt. If not, they see the (branded) sign-in page.
  4. The callback on the site sets the host-only `__Host-aun_site` session (sealed, 8 h).

  The result: one click and no password for anyone signed in elsewhere. The same flow serves `<slug>.alummahnow.org` and own domains.
- **Sign-out.** **Sign out** on a site redirects top-level to auth `/logout` and back. Signing out elsewhere can't reach a site through front-channel logout iframes, because those are third-party too. Instead, the site session holds the refresh token, auth's logout revokes refresh tokens (shipped in the SSO audit), and the site re-checks every 5 minutes. A site session therefore ends within 5 minutes of a sign-out anywhere, and after 8 h at most.
- **Release check.** The SSO journey spec gains a site case: a viewer signed in on www signs in on a QA site with one click (no password), and a sign-out on www ends the site session within the re-check window.
- **Branded sign-in** (`site.brandedSignIn`): Auth shows the site's logo and theme on the sign-in page for that site's OAuth redirect, using Auth's existing theme packages. The text still says it is an Al Ummah Now account, so people know which account they are using (SS11, decided).

## 6. Data model and connections

### 6.1 Scholar ↔ channel ↔ site

- A scholar has up to 5 channels and one **primary** channel (`scholars.primary_channel_id` in the CMS, backfilled from `channel_ids[0]`). The primary channel's community posts **are** the scholar's posts (SS6).
- A channel belongs to at most one scholar, and has at most one site (SS2). The site's owner and admins are the channel's (SS2).
- **Every scholar, with or without the tier, writes in Studio.** The CMS keeps the scholar profile (bio and avatar for the www directory) and the references. The CMS writer screen becomes a link to Studio (SS18).

### 6.2 Where everything is stored (reuse first)

Owner rule (SS4): reuse existing storage. Site posts **are** the channel's community posts, and new storage is added only for what doesn't exist yet. The result is no new database and no new KV namespace: the new pieces are JSON objects in two R2 buckets api-videos already has.

| What | Where | New? | Why there |
|---|---|---|---|
| **Every scholar post** (scholar page, site, Community tab) | **Community posts**, R2 `community-posts`: `posts/{channelId}/{postId}.json` and the index, via the existing `/channels/:id/posts` API | No: the single source of truth | Same posts, same likes, votes and comments. `PostV2` adds fields to the same JSON (§6.3) |
| www references to scholar posts (slug, locale, featuring, curation, timeline, search, summary cache) | CMS D1 `posts`, rows with `kind = 'ref'` | No new table: new columns on `posts` | Featuring, curated pages, search and the KV feed already run on `posts` |
| Videos, Shorts, playlists, live | Existing videos, playlists and live stores and APIs | No | – |
| Site home layout | **Channel Home sections**, R2 `channel_sections` (AUN-CHANNEL-SECTIONS: up to 12 sections, 13 types including Spotlight, Shorts, Live, playlists and Community posts) | No. Two section types are added: `page` (embed a site page) and `cta`. The videos channel page ignores them | Editing the site home and the channel Home tab is one job, not two |
| About, name, logo | The channel record, R2 `channels` (`nameLocalized`, `descriptionLocalized`, `avatarUrl`, `links`, `contactEmail`) | No. The site name defaults to the channel name, and the logo to the avatar | The site follows the channel |
| Who can edit | **Channel roles** on the channel record (owner, admin, editor, moderator) | No (SS2, answered) | The channel's owner and admins **are** the site's owner and admins |
| Tier and its keys | admin-api D1 `subscriptions` / `entitlement_overrides` (subject = channel) | No: rows in existing tables | Plans already live there. The admin **Sites** list is a query over these rows |
| Site settings: theme ref, favicon, logo override, locales, platform mark, navigation, SEO, redirects, status | R2 `channel_sections`: `site/{channelId}/settings.json` | **New object** | Small (a few KB), read as one object per render miss, edited rarely |
| Pages (content and list pages) and their revisions | R2 `channel_sections`: `site/{channelId}/pages/index.json`, `…/pages/{pageId}.json`, `…/pages/{pageId}/rev/{ts}.json` (last 20 kept) | **New objects** | The same pattern as community posts: one JSON per item plus an index. At most `site.pages.max` per site, always read per site |
| Host → site index (subdomains and own domains) | R2 `channel_tabs`: `site-hosts/{host}.json` → `{channelId, kind, cfId, status, primary}` | **New objects** | The same pattern as the handle index `channel-handles/{handle}`: a create-only conditional put stops one host being attached to two sites |
| Site search | The existing search index (`SEARCH_DB`), with pages added as a new document kind | No new database | Search already lives there |
| Edge copy for outages | www's existing `CONTENT_SNAPSHOT` KV (last good site config) | No | Gives "never fall back to the platform theme" without a new namespace |
| Site page views | A Workers Analytics Engine dataset (write-only metrics; nothing to run) | New dataset | Cheapest per-event store. Video plays keep using the existing video analytics |

**Why R2 JSON and not D1 or KV for the new pieces**

- **Consistency:**
  - R2 is strongly consistent: a page a scholar publishes is read back at once.
  - KV is eventually consistent, taking up to about 60 s across locations, and its 1 write per second per key limit doesn't suit an editor. KV also can't enforce "this domain is attached once".
  - D1 is consistent but would mean a new database. None of the existing ones fit: notifications, search and auth are other domains, and the Auth DB is sensitive to extra load.
- **Lost updates:** `settings.json` and `pages/index.json` are written with an ETag condition (`onlyIf`). If two admins edit at once, the second save gets "Changed by someone else — reload", as in the CMS. Each page is its own object.
- **Access pattern:** every read and write is "this channel's site". There are no cross-site joins. The one cross-site list (admin Sites) comes from the admin-api D1 rows that already exist.
- **Cost:**
  - Rates: R2 Class A $4.50 per million writes and Class B $0.36 per million reads, with storage negligible (KB per site).
  - Studio edits are a few thousand writes a month across all sites. Reads happen only on a cache miss: about 1 settings read per host per isolate-minute, plus a page read per uncached page view.
  - At target scale that is **under $1 a month**. A new D1 would cost about the same, but adds a database to migrate, back up and release.
- **When to move to D1:** only if a future feature needs queries across sites or within a site over many items (for example thousands of pages per site, or filtering pages by field). Not in this spec.

**Grant and lifecycle:** admin-api records the grant in its existing tables and calls api-videos `POST /internal/sites/:channelId` (create, suspend, restore, revoke). api-videos writes `settings.json` and the subdomain's host index object, and admin-api attaches the Cloudflare domain. Revoking moves the `site/{channelId}/` prefix into the 30-day trash, the same soft-delete rule as other content.

### 6.3 Posts: one format, community as the source (SS5, SS6 answered)

**Rule.** A scholar's content is always a **community post on their primary channel**. www, the scholar page and the white-label site all read it from there. The CMS holds only a **reference**, a thin hidden row, so editors can feature and curate it without copying it. Staff posts, which have no channel, stay native CMS posts.

**Kinds** are the same everywhere: `article`, `cards`, `text`, `image`, `video` (video, Short or playlist), `poll`, `quiz`, `gif`, and `link` if SS14 says so. Page-only block types (quote, CTA, columns, divider) stay blocks.

| Kind | www / CMS today | Community today | After |
|---|---|---|---|
| Article | ✓ | Link-out mirror | Community (Studio editor); staff in the CMS |
| Cards (≤40) | ✓ | – | Community (Studio editor); staff in the CMS |
| Text | – | ✓ | Both |
| Image (1–10, alt required) | Blocks only | ✓ | Both |
| Video / Short / playlist | Timeline entries | ✓ (video) | Both |
| Poll | – | ✓ | Both |
| Quiz | – | ✓ | Both |
| GIF | – | ✓ | Both (SS14) |
| Link | – | – | SS14 |

```ts
interface PostV2 {                   // one format: community JSON and CMS staff posts
  uid: string;                       // pst_<ulid>
  kind: 'article'|'cards'|'text'|'image'|'video'|'poll'|'quiz'|'gif'|'link';
  channelId?: string; authorSub?: string;          // community posts always have a channel
  locale: 'en'|'ar'; translationKey?: string;
  slug?: string; title?: string; text?: string; cover?: MediaRef;
  slides?: Slide[]; images?: MediaRef[];
  video?: { videoId?: string; playlistId?: string };
  poll?: { options: {id:string;text:string}[]; multiple: boolean; endsAt?: string };
  quiz?: { options: {id:string;text:string}[]; correctOptionId: string; explanation?: string };
  gif?: MediaRef; link?: { url: string; title?: string; image?: MediaRef };
  status: 'draft'|'scheduled'|'published'|'deleted';
  visibility: 'public'|'subscribers'|'members';
  publishAt?: string;               // no opt-out from www (SS8): editors decide what to feature
  commentsEnabled: boolean; tags?: string[]; createdAt: string; updatedAt: string;
}
```

**The www reference (CMS `posts`, `kind = 'ref'`).** New columns on the existing table:

| Column | Meaning |
|---|---|
| `ref_post_id`, `ref_channel_id` | The community post it points to |
| `slug`, `locale`, `translation_key`, `published_at`, `status` | Copied from the post, for www URLs, alternates and lists |
| `author_sub` | The scholar (as today) |
| `featured_at`, `featured_by`, `show_on_timeline`, tags, page entries | **Editorial state, owned by www.** This is the only part editors change |
| `summary_json` | A cache of title, excerpt, cover and first slides, used by the KV feed builder and search. Refreshed on every sync. Never edited |

- **Hidden:** refs don't appear in the CMS posts list as editable posts. Editors see them in a **Scholar posts** picker (autocomplete) on the Timeline and Featuring screens, with *Feature* and *Add to page*, and an *Open in Studio* link for the scholar.
- **Created automatically:** api-videos keeps an outbox. Every create, update or delete of a public post on a scholar's primary channel calls the CMS (`PUT/DELETE /internal/refs/:postId`, `X-API-Key` from the Secrets Store), with the same retry and backoff as today's `community_links`, in the opposite direction. One ref per post, so the scholar page, search, the sitemap and featuring all work without an extra step.
- **Rendering:** list views (timeline, scholar page, curated pages) render from `summary_json`. A post page fetches the community post itself (Cache API, 60 s), so an edit in Studio shows on www within a minute. A featured ref whose post is deleted drops off the timeline on the next feed build.
- **Engagement** (likes, votes, quiz answers, comments) is always on the community post, so there is one discussion wherever it is read.
- **Feed shape:** feed items gain every kind and a `ref` source, so `FEED_FORMAT` goes to 4 (automatic rebuild).
- **Canonical:** without the tier, the www post URL. With the tier, the site (§4.4). The www URL stays the same in both cases, so getting the tier needs no move. Only the canonical and a 301 change (SS6).
- **Shared code:** `packages/post-schema` (types, zod validator, limits, fixtures) in the monorepo, vendored by the CMS and AlUmmahNowUI with a pinned sync (`sync:posts`, `check:posts`). Renderers for each kind live in `packages/render` (www and sites). The videos app wraps the same CSS classes in React, and a fixture test renders every kind in both.

### 6.4 Getting the tier, and losing it

- **On:** nothing moves, because the posts already live on the channel. The site starts showing them. The refs' canonical switches to the site, and the www post pages stay, with `rel=canonical` to the site's post URLs (no 301). Bio and avatar stay editable in Studio and sync to the CMS directory entry.
- **Off:** the site goes offline (§4.4). The www URLs serve again and become canonical. Pages and settings are kept for 90 days, then go to the 30-day trash.

### 6.5 Comments and likes

| Surface | Before phase 4 | Phase 4 |
|---|---|---|
| Site post and watch pages | Counts, plus "Join the discussion" on the videos post | Inline comments, likes and votes through the videos API, signed in with the site's own session (`__Host-aun_site`) |
| www scholar posts | Counts, plus "Join the discussion" | Same inline component |

### 6.6 Migration: existing CMS scholar posts become community posts

Applies to every CMS post with `author_sub` set (scholar posts), per environment.

1. **Freeze:** the CMS writer screen switches to "Write in Studio". Editors can still feature.
2. **Convert each post** onto the scholar's primary channel:
   - **Articles that already have a community mirror** (`community_post_id` set through `community_links`): the existing community post is **upgraded in place** to a full `article` (body, cover, slug, locale, translation key). It keeps its id, likes and comments.
   - **Cards posts and articles without a mirror:** a new community post (`article` or `cards`), with media re-referenced, not copied.
3. **Turn the CMS row into a ref:** `kind = 'ref'`, plus the ref columns. The slug, locale, `translation_key`, `featured_at`/`featured_by` and page entries are kept, so **www URLs and the home timeline don't change**. The original body and slides go into the revisions table and are kept for 30 days for rollback.
4. Retire `community_links` (CMS → community) once every row is converted. The ref outbox (community → CMS) replaces it.
5. Bump `FEED_FORMAT` to 4 (automatic rebuild).
6. **Check:** a script compares each converted post with its original (title, body hash, slide count, slug, featured state) and lists any differences. Only then is the rollback copy dropped.

A scholar without a channel can't be converted. The script lists them, and admins link a channel first. QA, then stage, then production, each with the owner's go-ahead for production (data change).

## 7. Studio as the site's CMS## 7. Studio as the site's CMS

### 7.1 Scope

**Studio → Site** is shown only when `site.enabled`. Permissions come from **channel roles** (SS2, answered): the channel owner and channel admins are the site's owner and admins (settings, theme, domains, navigation); editors write posts and pages; moderators moderate comments. There is no separate site membership, and a channel transfer moves the site with it.

| Area | What it does | Today's equivalent |
|---|---|---|
| Overview | Status, hosts, quick links, checklist (logo, About, first page, domain) | – |
| **Posts** | The channel's community posts: every `PostV2` kind, with schedule, en/ar pair, pin and comments switch. Every public post gets a www reference, with no opt-out (SS8); editors decide what is featured. For every scholar, not only the tier | Community posts, plus the article and cards editors (from the CMS) |
| **Pages** | Block pages (markdown, image, gallery, posts list, cards, videos, video, CTA, columns, quote, divider) and list pages (curated or filter), drafts, schedule, revisions, preview | CMS pages, blocks and page kinds |
| **Navigation** | Main menu and footer links per language: pages, list pages, Videos/Shorts/Posts/About, external links. Drag to reorder, up to `site.navigation.max` | CMS nav |
| **Home** | The channel's Home sections (the same editor and storage as the Home tab), plus the site-only `page` and `cta` sections | Channel sections (reused) |
| **About** | Bio (en/ar), photo, links, contact, credentials | CMS scholar profile, channel About |
| **Theme & brand** | Choose one of the platform's themes (independent of the platform's active theme), see and accept update offers, upload the logo and favicon, set the site name (en/ar), preview in both modes. No theme editing (§5.3) | The admin Site theme page (choose only) |
| **Domains** | Subdomain, own domains, DNS steps, status, primary host | – |
| **SEO** | Title template, description, search console verification token, redirects (social image generated) | CMS SEO fields |
| **Analytics** | Site views, top pages and posts, referrers, languages, devices | Channel analytics |

Preview: an iframe of the real site with a signed, 10-minute, channel-bound preview token that shows drafts. It is never cached and is `noindex`.

### 7.2 What the CMS keeps

- www itself: the home timeline, featuring, staff pages and posts, list pages, translations and the AI writing assist.
- The scholar directory (bio, avatar) and the **references** to scholar posts. Editors feature and curate refs; they never edit scholar content.
- The scholar writer role becomes "Write in Studio" (SS18). Scholars still sign in to the CMS only if they also have staff duties.

### 7.3 Reuse, not a second CMS

- **The block schema becomes shared.** Block types move into `packages/post-schema` (as `BlockV1`), so the CMS and Studio validate the same JSON and www and the sites Worker render both with the same `Blocks.astro` from `packages/render`.
- **The editors are React in Studio**, built on the shared schema. The CMS keeps its own editor. Both write the same JSON. Fixture tests keep the two in step.
- **AI assist** (slug, translate, summarise) uses the same Workers AI routes and budget guard as the CMS, metered per site (feature `site-assist`) and off in tests.
- **Moderation:** site posts and pages are platform content. They go through the same reports, AI moderation (Epic 28) and admin actions as community posts.

### 7.4 Home layout = the channel's Home sections

The site home renders the channel's existing Home sections (`channel_sections`, up to 12) in their order: spotlight, Shorts, live, playlists, community posts and the rest. Two section types are added that only the site renders: `page` (a site page's blocks) and `cta`. The videos channel page skips them.

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
| Worker requests and CPU (sites Worker) | $0.30 / M requests after the included 10 M; $0.02 / M CPU-ms | ≈ $1–3 |
| R2 site objects, CMS and videos reads | Cached 60 s; R2 Class B only on a miss | < $2 |
| Version-pinned theme CSS (R2 + CDN) | Class B reads, cached | < $0.50 |
| Analytics Engine | Included, then $0.25 / M | ≈ $0.50 |
| `<slug>.alummahnow.org` in production (wildcard DNS + Universal SSL) | No charge | $0 |
| QA/stage wildcard certificate (Advanced Certificate Manager on `alummahnow.org`) | About $10 a month for the zone; optional (free alternative: per-site custom domains) | ≈ $10 |
| **Own domains (Cloudflare for SaaS)** | 100 free, then $0.10 per hostname | **$20** (300 hostnames) |
| `alummahnow.org` zone | Already in the account; domain renewal ≈ $10–15 a year | ≈ $1 |
| AI assist in Studio | Workers AI, per-site budget | Capped by budget (S13) |
| **Total** | | **≈ $25–40** (≈ $25–30 without ACM), about $0.10 per site per month for an own domain |

At 1,000 own domains (2,000 hostnames) the SaaS line is $190 a month. That is why `site.customDomains.max` exists and is admin-set, and the cost-monitor gets a `custom_hostnames` line with an alert. Guard: a spec asserts that site HTML is cacheable.

### 9.2 Caching and performance

The same as www: `s-maxage=60, stale-while-revalidate=600`. Signed-in views are never cached. Images go through variants. Videos use a click-to-play facade, so there is no player JS until play. Target LCP is under 2.5 s on 4G.

### 9.3 Security and tenant isolation

- **Only platform code runs on a site.** Content is markdown and blocks, sanitised as on www. Sites have no theme or CSS input at all: they choose a platform theme, and the only uploads are the logo and favicon (images, re-encoded). Sites are on `alummahnow.org`, a **different registrable domain** from the platform (`alummahnow.net`). Browsers treat them as cross-site to every platform app. Platform cookies (SameSite=Lax) are never sent from a site page, and a site can't set cookies on `alummahnow.net`. Sites are same-site with **each other** under `alummahnow.org`, so their cookies stay host-only. If sites ever ran third-party code, `alummahnow.org` could go on the Public Suffix List; that isn't needed now.
- **Cookies stay host-only.** Add a release check that fails if any app sets `Domain=.alummahnow.net` or the sites Worker sets `Domain=.alummahnow.org`. Each site host gets its own `__Host-aun_site` session.
- **CSP** is the same as www: `script-src 'self'` plus hashes, `frame-src` only the videos embed host, `form-action` auth, `frame-ancestors 'none'`. HSTS on every host, with `includeSubDomains` on `alummahnow.org`. An own domain gets HSTS without `includeSubDomains`, because we don't own their other subdomains.
- **Host validation.** `SITE_URL` always comes from the registry, never from the raw `Host` header, so a spoofed host can't poison the cache. Unknown hosts get a bare 404.
- **OAuth.** Each host's exact redirect URI is registered when the host goes live and removed when it is detached. Auth never accepts wildcard redirect URIs.
- **API tokens.** One scoped token in the Secrets Store: Custom Hostnames (plus Workers Custom Domains for QA/stage, if no ACM) on the `alummahnow.org` zone only. It has **no access to `alummahnow.net`**. Only admin-api's jobs use it.
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
| **0. Decisions** | Owner answers the open decisions | Recorded in the [decision log](decisions.md) |
| **1. Community-fuelled scholar content** (every scholar) | `packages/post-schema`; Studio article and cards editors; CMS ref rows, the ref outbox and the Scholar posts picker; the www scholar page and post pages read community posts; `FEED_FORMAT` 4; **migration §6.6**; CMS `primary_channel_id` | Every scholar post on www is a ref to a community post, with URLs and featuring unchanged |
| **2. Sites Worker and the first white-label site** (can start alongside phase 1) | AlUmmahNowUI workspace (`apps/www`, `apps/sites`, `packages/render`); **`alummahnow.org` zone setup** (Cloudflare for SaaS on, fallback origin `sites.alummahnow.org`, wildcard DNS and routes, HSTS, ACM for QA/stage if chosen, scoped API token); sites Worker per environment; tier keys and seeds; grant in admin; site objects in existing R2; per-site custom domains; **SaaS zone and own domains**; UI#55 (admin themes on www and sites); canonical rules | mustafa-elbadry live on its subdomain (and its own domain if any), after QA and stage |
| **3. Studio as the site CMS** | Studio → Site: Overview, About, Navigation, Home (channel sections + `page`/`cta`), Pages, Theme & brand (choose), Domains, SEO, preview, revisions | The scholar runs the site without staff |
| **4. Engagement and identity** | Inline comments, likes and votes on www and sites; site sign-in; branded sign-in; site analytics | A viewer comments without leaving the page |

Every phase updates this page and the repo pages (wiki rule).

### Migrations

| Repo | Change | Phase |
|---|---|---|
| AlUmmahNowCMS | `primary_channel_id`; ref columns on `posts` (`ref_post_id`, `ref_channel_id`, `summary_json`); conversion script (§6.6) | 1 |
| AlUmmahNow community store | `PostV2` fields (`uid`, `schemaVersion: 2`, article/cards bodies), backfilled lazily and by a one-off job | 1 |
| AlUmmahNow api-videos | Ref outbox; no new database. New R2 key prefixes `site/{channelId}/…` (`channel_sections`) and `site-hosts/` (`channel_tabs`); two section types | 1, 2 |
| AlUmmahNow admin-api | Entitlement keys and the two add-on seeds | 2 |
| AlUmmahNowUI | Workspace split; new `al-ummah-now-sites` Worker (QA, stage, production) | 2 |
| AlUmmahNowAuth | Per-host redirect URIs for the sites client; branded sign-in | 2, 4 |

Migration numbers are assigned when building.

## 11. Risks

| Risk | Mitigation |
|---|---|
| Studio grows into a second CMS that drifts from the CMS | One shared schema for posts and blocks, one render package (www and sites), fixture tests in both editors |
| Refs drift from their community posts | Idempotent outbox with retries, a nightly reconcile (community index ↔ refs), and post pages that read the community post directly |
| Converting existing scholar posts loses content | Upgrade in place where a mirror exists, a comparison script, and the original body kept 30 days for rollback |
| Own-domain sites used for phishing or impersonation | Admin-only grant, validated DNS, the legal/report footer always on, sign-in always names the account, no custom forms |
| SaaS hostname costs grow | `site.customDomains.max` per tier, a cost-monitor line and an alert |
| Duplicate content | One canonical per item, chosen by the brand host (§4.4); platform sitemaps leave site-canonical URLs out |
| A bad sites deploy takes every site down | Separate Worker and release, so www is unaffected; stale-cache and `CONTENT_SNAPSHOT` fallbacks with each site's last good config; release E2E covers one site per host kind |
| A theme update changes a site unexpectedly | Sites stay pinned; updates are offered with a preview; only audited contrast or security fixes are pushed |
| A scholar leaves the tier | 90-day offline period with everything kept; posts stay on the channel |

## 12. Decisions for the owner

**Answered** (kept here for the record):

| # | Answer | Date |
|---|---|---|
| SS1 | An admin-granted add-on on the channel, with two tiers: "White-label" and "White-label + domain" | 2026-11-13 |
| SS2 | The channel's owner and admins **are** the site's owner and admins (channel roles); the site follows the channel, one per channel | 2026-11-13 |
| SS3 | A **separate sites Worker** that shares www's rendering code through a package. Cloudflare for SaaS + one Worker, not Workers for Platforms | 2026-11-13 |
| SS4 | Studio is the site CMS on **existing storage**; only settings, pages and the host index are new R2 objects | 2026-11-13 |
| SS5 | One post format for the CMS and community; engagement on the videos side | 2026-11-13 |
| SS6 | Scholar content is **fuelled by community posts** from the start (with or without the tier); www holds hidden references; existing CMS scholar posts are converted | 2026-11-13 |
| SS7 | Videos are canonical on the videos site for subdomain sites; on a scholar's own domain, the site's watch page is canonical (§4.4) | 2026-11-13 |
| SS8 | No opt-out: every public scholar post gets a www reference; editors decide what to feature | 2026-11-13 |
| SS9 | Scholar sites live on **`alummahnow.org`**: `<slug>.alummahnow.org` per site (`.qa.`/`.stage.` in test), and the same zone is the Cloudflare for SaaS zone for own domains (target `sites.alummahnow.org`). `.net` stays for the main sites, `.com` redirects to `.net`, and `.app` is reserved for apps | 2026-11-13 |
| SS10 | No longer applies: every platform theme has a dark header | 2026-11-13 |
| SS11 | One Al Ummah Now account everywhere; branded sign-in still names it | 2026-11-13 |
| SS13 | A site may be single-language | 2026-11-13 |
| SS15 | Covered by SS6: every scholar post gets a ref, so editors can feature it | 2026-11-13 |
| SS12 | A renamed subdomain keeps a 301 for 12 months | 2026-11-13 |
| SS14 | Keep GIF; add Link posts (preview card: image, title, site name + optional comment) in Studio, www, sites and native apps | 2026-11-13 |
| SS16 | First site mustafa-elbadry. Staff setup from the admin **and** Studio self-service for channel owners, both from day one (phase 3 self-service moves into phase 2) | 2026-11-13 |
| SS17 | Any active platform theme, automatically (choose-only, pinned) | 2026-11-13 |
| SS18 | Scholars write only in Studio ("Write in Studio" for scholar accounts); the CMS writer role **stays** for staff editing Al Ummah Now's own content | 2026-11-13 |
| – | Earlier: it is a tier; white-label; independent with posts canonical on the site; not every scholar gets it; own domains in scope; platform mark optional by tier; sites choose one of our themes, with no editing; branding is logo, name and favicon | 2026-11-13 |

Every decision is answered (revision 9).

## Open questions, not decisions

- Does mustafa-elbadry have, or want, an own domain? Is their CMS slug and primary channel right in production? **Unverified.**
- Cloudflare for SaaS plan limits and price on the `alummahnow.org` zone, and route precedence on it. **Unverified**; check before phase 2.
- Advanced Certificate Manager for QA/stage (≈ $10 a month) or free per-site custom domains for test sites: an engineering call in phase 2, defaulting to ACM so test sites work instantly.

## Status evidence

- This page (draft PR on AlUmmahNowWiki).
- **Phase 1 (community-fuelled scholar content): complete, 2026-11-13.** Merged: AlUmmahNow #1203 (`674a88c`) and #1222 (`b64d32b`), AlUmmahNowCMS #117 (`bbf0e1a`), AlUmmahNowUI #88 (`ca68194`).
  - AlUmmahNow [#1203](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1203): `PostV2` in `packages/shared-types/src/post-schema.ts` (an engineering call: a file in shared-types, not a new `packages/post-schema` package, so no lockfile change; vendored byte for byte by the CMS and www with `sync:posts`/`check:posts`); Studio composer for articles, cards and links plus a post language; the reference outbox in the processor (`CMS_INTERNAL_URL`); `/internal/posts` and the conversion endpoints. Docs: `docs/features/scholar-posts.md`.
  - AlUmmahNowCMS [#117](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/117): migration 0019 (`primary_channel_id`; `posts.ref_post_id`, `ref_channel_id`, `summary_json`), `/internal/refs`, refs in the public API (`ref`, `v2`, `community`), `FEED_FORMAT` 4, Featuring "Scholar posts" with Open in Studio, Write in Studio for writers, the conversion and its check. **A reference keeps its community post's `kind`** (instead of `kind = 'ref'`), so the Articles list and `/cards` keep filtering on kind; refs are the rows with `ref_post_id`. Docs: `docs/SCHOLARS.md` §7–§8.
  - AlUmmahNowUI [#88](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/88): www renders every kind (post pages, lists, timeline) and "Join the discussion"; the renderers, post types, en/ar strings, CSS and the vendored PostV2 live in `packages/render/src/posts/`, shared with the sites Worker.
  - AlUmmahNow [#1222](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1222): scheduled community posts go live at their time (#1218), hidden until then.
  - **Conversion (§6.6):** QA converted **1** post (an article with a community copy, upgraded in place, featured; check 1 ok, 0 different). Stage: **0** to convert. Production: **not applicable**: there are no scholars in production (owner, 2026-11-13), so no production conversion is needed. The conversion script (`AlUmmahNowCMS scripts/ops/convert-scholar-posts.ts`) stays for future use.
  - **Nightly reference check** (#1217, done): AlUmmahNow #1234 (channel digest) + AlUmmahNowCMS #118 (03:00 UTC, scholars' primary channels, one indexed query per channel, migration 0020, ≤ 50 repairs a night).
  - **End-to-end test** (#1219, done): AlUmmahNow #1236 `78-scholar-refs.spec.ts` on the local stack (Studio → outbox → CMS ref → www, en and ar). The stack runs the CMS and www from their released local-stack bundles (AlUmmahNowCMS #119, AlUmmahNowUI #92).
  - **Add to page** (done): AlUmmahNowCMS #121, Featuring → Scholar posts → "Add to page": an in-page dialog per language with a live autocomplete of that language's curated list pages, through the list's own endpoint. Phase 1 has no open follow-ups. SS14 and SS18 were answered in revision 9 (below).

- **Phase 2 (sites Worker, grant, Studio Site MVP), 2026-11-13, in review:**
  - AlUmmahNowUI [#86](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/86) (merged): the workspace split, www moved to `apps/www`.
  - AlUmmahNowUI [#87](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/87): `packages/render` (themes, street, sealed cookies, embed URLs, markdown, image hosts, HTML edge cache; www keeps re-exports) and `apps/sites` → `al-ummah-now-sites[-qa|-stage]`: host → site from api-videos with a `CONTENT_SNAPSHOT` last-good copy (`site-config:<host>`), zone names 301 to www, unknown host bare 404, renamed subdomain 301 (12 months, SS12 as recommended), revoked → channel, suspended → 503; home, videos, posts, post, watch, About, robots and sitemap per host; SS7 canonicals; sign-in by top-level redirect with a host-only `__Host-aun_site` session re-checked every 5 minutes; routes on the `alummahnow.org` zone; QA deploy and stage → production release jobs; cookie-domain release check (`scripts/check-cookie-domains.mjs`). Owner DNS/certificate/SaaS steps: `apps/sites/docs/DOMAINS.md`.
  - AlUmmahNow [#1204](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1204): `packages/shared-types/src/site.ts`; api-videos site store in the existing R2 buckets (`channel_sections` `site/{channelId}/settings.json` + 10-minute previews, `channel_tabs` `site-hosts/{host}.json` create-only), `/internal/sites`, `GET /api/sites/by-host/:host`, `/api/sites/channel/:id` (Studio); admin-api migration 0022 (two add-on plans; **a grant is one `entitlement_overrides` row per `site.*` key on the channel**, reason `addon:<tier>`, not a subscription, because a channel can hold only one live subscription) and `/api/sites` with audit; admin-web **Scholar sites** page; Studio → **Site** (theme, name, logo, favicon, languages, menu, About, preview).
  - AlUmmahNowAuth [#357](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/357) (merged): one public PKCE client "Al Ummah Now (sites)" per env (migration 0034) whose single exact `https://<host>/auth/callback` is accepted when `<host>` is a live site's primary host in the registry; `/logout` may return to a live site. A site's sign-out passes auth's "Sign out?" confirmation (logout-CSRF rule).
  - Engineering calls: themes offered are the four built-ins until UI#55; the logo/favicon upload reuses the community image upload (owner-only today, #1213).
  - Not yet: owner DNS step, revoked-site lifecycle (#1214), platform-side canonicals and "Visit site" (#1215), first site mustafa-elbadry (#1216).

- **Revision 9 work, 2026-11-13:**
  - **SS18 (staff writers keep the CMS):**
    - AlUmmahNowCMS #122 (merged `a33d066`) and AlUmmahNowAuth #360 (merged `b7b0d53`). #117 had made every CMS "writer" a Write in Studio link, because auth only had a "Scholar" role.
    - Auth now has a **Writer** role (migration 0035), which maps to the new bknd role `staff_writer`: the full CMS editor for Al Ummah Now's own posts (`author_sub IS NULL`, not refs), with no delete, no timeline switch and no other screens.
    - The auth "Scholar" role keeps the bknd name `writer`, so a stale session never gains rights. It alone gets Write in Studio.
  - **SS14 (Link posts):**
    - AlUmmahNow #1267 (merged `28816d2`): `link.siteName`, post-schema revision 2. Studio gets "Get preview": `POST /api/community/media/link-preview` reads the Open Graph tags with SSRF guards and copies the image to our storage. The Community tab card shows the site name.
    - AlUmmahNowCMS #123: `v2.link.site_name`, FEED_FORMAT 5.
    - AlUmmahNowUI #94: the shared `PostLinkCard` on www and the sites; the sites also render GIF and cards posts.
    - Native apps have no community surface yet: Android #21, Apple #32 and Desktop #40 cover a Community tab with every PostV2 kind, Link included.
  - **Own domains (#1212):** AlUmmahNow #1272. See `docs/features/scholar-sites-domains.md`.
    - admin-api calls Cloudflare for SaaS with `sites-saas-token` (bound as `SITES_SAAS_TOKEN`). The status checks come from an indexed D1 table (migration 0023): every 10 minutes for 72 hours, then daily.
    - api-videos keeps the state and the create-only host index.
    - Studio → Site → Domains and admin Scholar sites both work: add a domain, copy the CNAME/TXT records, see its status, check now, pick the main address, remove it in the in-app dialog.
    - While SaaS is off (1404), both say "not available yet".
  - **SS16 Studio self-service:** AlUmmahNow #1281, plus the sites rendering in AlUmmahNowUI. See `docs/features/scholar-sites-studio.md`.
    - Site pages from blocks (text, image, video, button, quote, divider, latest posts, latest or playlist videos), per language. Draft/published, the last 10 versions restorable, preview, `site.pages.max`. Editors may write pages.
    - The menu can link pages. Home can show a page above the sections.
    - Search engines: title template, description, verification codes. Path redirects. A checklist.
    - #1213: channel admins and editors may upload images.
    - Engineering call: "Home" reuses the channel's sections plus one site page above them (the spec's `page` section). A `cta` is a block in that page, not a new channel-section type.
  - **Release token check (Sites zone workflow, AlUmmahNowUI #93, run 43503680139):** it can read the zone and Worker routes and set Always Use HTTPS. It is **missing** Zone → DNS: Edit (and Read), which the wildcard and the record setup need, and Zone → SSL and Certificates: Edit, which the fallback origin needs, with Cloudflare for SaaS enabled. Worker routes are attached by every sites deploy.

## Sources

- CMS: [`docs/SCHOLARS.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/docs/SCHOLARS.md), [`migrations/0013_scholars.sql`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/migrations/0013_scholars.sql), [`src/lib/scholars/community.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/src/lib/scholars/community.ts), [`src/schema.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/src/schema.ts), [`src/lib/blocks.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/src/lib/blocks.ts), [`docs/PUBLIC_API.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/docs/PUBLIC_API.md), [`src/lib/feed/format.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/d661daf7d266cb6804637cf616fa7b5fa680b21b/src/lib/feed/format.ts)
- www: [`src/pages/[locale]/scholars/[slug]/index.astro`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/src/pages/%5Blocale%5D/scholars/%5Bslug%5D/index.astro), [`src/lib/edge.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/src/lib/edge.ts), [`src/lib/auth.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/src/lib/auth.ts), [`wrangler.jsonc`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/b5216371b3aa37a8308f1bc3b6491af4b8689a82/wrangler.jsonc)
- Videos: [`packages/shared-types/src/community-post.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/packages/shared-types/src/community-post.ts), [`packages/shared-types/src/channel.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/packages/shared-types/src/channel.ts), [`apps/api-videos/src/lib/scholar-articles.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/api-videos/src/lib/scholar-articles.ts), [`apps/api-videos/src/routers/scholars-internal.router.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/api-videos/src/routers/scholars-internal.router.ts), [`apps/web/src/lib/scholars/lookup.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/web/src/lib/scholars/lookup.ts), [`packages/shared-types/src/entitlements.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/packages/shared-types/src/entitlements.ts), [`apps/admin-api/migrations/0004_plans_entitlements.sql`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/apps/admin-api/migrations/0004_plans_entitlements.sql), [`docs/plans/SUBSCRIPTIONS.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/de8c284f8a1b84b7008c416a68e2f007de55ab5c/docs/plans/SUBSCRIPTIONS.md)
- Wiki: [AUN-SUBS](AUN-SUBS-subscriptions-plan.md), [Epic 27](E27-plans-entitlements.md), [CMS home timeline](CMS-HOME-TIMELINE-www-home-timeline.md), [Channel sections](AUN-CHANNEL-SECTIONS-channel-sections.md), [Theming](../guides/theming.md), [Authentication](../guides/authentication.md), [Environments](../guides/environments.md), [Data lifecycle](../guides/data-lifecycle.md)
