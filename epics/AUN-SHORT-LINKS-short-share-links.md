[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Short share links (alummahnow.link)

| | |
|---|---|
| **ID** | `AUN-SHORT-LINKS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (`apps/short-links`, videos web share buttons). Native apps: follow-up issues |
| **Status** | **in progress**: Worker and web share buttons in [#1192](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1192); live on QA; stage and production arrive with the next release |
| **Last updated** | 2026-11-13 |

Owner decision, 2026-11-13: short links **redirect** to the real pages, and every share button copies the short link. The owner added the `alummahnow.link` zone to the shared Cloudflare account.

## Links

| Link | Opens |
|---|---|
| `alummahnow.link/v/<videoId>` | the watch page. Shorts go to `/shorts/<id>` once that route is live ([#1185](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1185)); the site redirects them there anyway |
| `alummahnow.link/s/<videoId>` | the Short |
| `alummahnow.link/@<handle>` | the channel, by handle |
| `alummahnow.link/c/<channelId>` | the channel, by id (channels without a handle) |
| `alummahnow.link/p/<postId>` | the community post on its channel's Community tab (scrolled to, and shown first if it is older than the first page) |
| `alummahnow.link/l/<playlistId>` | the playlist |
| `alummahnow.link/` | the www home |

- **Redirects:** 301, cached by browsers for 5 minutes. Open Graph tags, `twitter:` cards and canonical URLs stay on the real pages. Link previewers follow the redirect and read them there.
- **Language:** `?lang=ar` or `?lang=en` opens the page in that language. Without it, the site's own default applies: on the videos site, the viewer's saved choice, else English. The browser's Accept-Language is never read. Share buttons on Arabic pages add `?lang=ar`, so a link shared from the Arabic site opens in Arabic, as the old `/ar/` link did.
- **Kept parameters:** `t` (start time), `list` and `index` (playlist), and `utm_*`. Everything else is dropped.
- **Not found:** an unknown, private or deleted id gets a bilingual 404 page. It names nothing about the item. The Worker looks each id up through the public API as a signed-out visitor, so it can't see more than anyone else. Lookups are cached at the edge: 10 minutes when found, 1 minute when not.
- **API down:** video, channel and playlist links still go to their page (302, not cached). Post links answer 503, because the post's channel comes from the API.

## Search engines

- Every response has `X-Robots-Tag: noindex, nofollow`.
- `robots.txt` refuses every crawler (`Disallow: /`) except the link previewers that check robots.txt before building a card: X, LinkedIn, Slack, Telegram, Discord, WhatsApp, Facebook and Pinterest. Without that exception, cards would not show for short links on those networks.
- Search engines index the real pages, which are canonical. See [AUN-SEO](AUN-SEO-search-visibility.md).

## Clicks

Clicks are counted with our own analytics, as daily aggregate counters. This is the same model as site visits ([#1184](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1184), D-SEO-9).

- **What is sent:** one client analytics event of kind `short_link` per click, holding the link type (`video`, `short`, `channel`, `post`, `playlist`, `home` or `unknown`) and the source. The source is the Referer host classified as direct, platform, site, `search:<engine>` or `social:<network>`.
- **Where it goes:** api-videos queues the event, and the processor adds it to `analytics_daily` (entity `site`, id `short-links`): `clicks`, `type` and `source`.
- **Never stored:** ids, IP addresses or user agents.
- **Not counted:** crawlers, link previews, prefetches and `HEAD` requests. A redirect the browser cached is not counted again.
- **Reading:** admin-api `GET /api/content/analytics/visits?days=` returns them as `shortLinks`.

## Hosts

| Tier | Host | Worker |
|---|---|---|
| QA | `qa.alummahnow.link` | `al-ummah-now-short-links-qa` |
| Stage | `stage.alummahnow.link` | `al-ummah-now-short-links-stage` |
| Production | `alummahnow.link` | `al-ummah-now-short-links` |
| Local E2E stack | `http://localhost:3092` | Miniflare |

Each host is a **Workers Custom Domain**: `wrangler deploy` creates and keeps its DNS record and certificate. The release token can attach them, so the owner has no DNS step. QA was attached on 2026-11-13 and checked live.

- **Web:** finds its short link host from its API host (`shortLinkOriginFor` in shared-types). `SHORT_LINK_URL` overrides it; `off` turns short links off and sharing falls back to the page URL. Localhost and PR previews have none.
- **Release:** QA deploys with `deploy.yml`, followed by the smoke. Stage and production deploy with `release.yml` after the promote, followed by `scripts/release/short-links-smoke.ts`. A failed smoke rolls the Worker back.

## Where sharing uses it

| Surface | Status |
|---|---|
| Videos watch page share dialog (copy, WhatsApp, Telegram, X, Facebook, email, device share) | short link (#1192) |
| Embed "Watch on" and title link | short link (#1192) |
| Video card ⋮ → **Copy link** (new; everyone. Watch later stays signed-in only) | short link (#1192) |
| Playlist page **Share** (new; public playlists) | short link (#1192) |
| Channel header **Share** (new) | short link (#1192) |
| Community post share | short link (#1192) |
| Studio Content → Copy link | short link (#1192) |
| Shorts page share | follows the watch share once #1185's page has one |
| www | no share buttons today |
| Apple, Android, Desktop apps | follow-up issues |

## Code

- [`apps/short-links`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/apps/short-links), with its README.
- `packages/shared-types/src/short-links.ts`: paths, builder, parser, host per tier, click event.
- `apps/web/src/lib/share/short-link.ts`: `shareLink()`, which every share button uses.
- api-videos `GET /api/community/posts/:postId`: a published post's channel, for `/p/` links.
