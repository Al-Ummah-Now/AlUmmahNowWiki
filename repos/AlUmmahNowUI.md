[← Home](../README.md)

# AlUmmahNowUI

[Repository](https://github.com/Al-Ummah-Now/AlUmmahNowUI) · default branch `main`

## Purpose

The public website at `www.alummahnow.net`. It explains the platform, links to videos, profile and sign-in, and shows editorial content written in the [CMS](AlUmmahNowCMS.md). The apex domain redirects to `www`.

What it shows:

- **Home:** a hero, then one timeline of posts, card posts, videos and channels, newest first. Editors manage it in the CMS, which publishes it to Workers KV. www only reads it. See [www home timeline](../epics/CMS-HOME-TIMELINE-www-home-timeline.md).
- **List pages:** `/videos` and `/articles` are CMS list pages (filter pages over everything published). Other CMS pages can be content pages (blocks) or curated lists. The old `/news/` URLs answer 301 to `/articles/`.
- **Card posts** show all their slides (up to 10) in lists and on the timeline, as a stacked deck. Timeline posts have no boxes, videos play a muted preview on hover, and a Short opens the vertical Shorts viewer ([#63](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/63); design in [the epic](../epics/CMS-HOME-TIMELINE-www-home-timeline.md#how-posts-look-owner-design-2026-11-12)).
- **Scholar pages** at `/{en,ar}/scholars/`, with bylines and an RSS feed per scholar.
- **Search:** a live autocomplete box in the header and a search page over published CMS posts, backed by the CMS search API. Videos are not searched here.
- **Draft preview** for CMS drafts, uncached and `noindex`.
- **Contact:** `/{en,ar}/contact` sends the visitor to the videos site's Contact us page.

## Tech stack

Astro 5 with server rendering on Cloudflare Workers, Tailwind 4, English and Arabic (RTL). Vitest and Playwright. Node 22+.

## Theme

www follows the site theme the admin sets in the videos admin (one of the four Fanous themes, Fawanees by default). Light and Dark stay per viewer: a header toggle with no "System" option; the first visit follows the device. The Worker reads the theme from the videos admin API's public site-theme endpoint, caches it for about 30 seconds, and renders it on `<html data-theme>`. A change reaches every page within about a minute, with no deploy. If the read fails, the page renders Fawanees and isn't stored in the HTML cache.

The theme CSS is vendored from the monorepo by `npm run sync:fanous`, pinned in [`fanous.lock.json`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/apps/www/fanous.lock.json). Only the four built-in themes are vendored, so a theme package made in the theme builder renders as the default here ([#55](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/55)). Details: [`src/lib/site-theme.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/apps/www/src/lib/site-theme.ts) and [Theming](../guides/theming.md).

## Layout

| Path | What it is |
|---|---|
| [`src/worker.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/apps/www/src/worker.ts) | Edge wrapper around Astro: redirects, language choice, security headers |
| [`src/pages`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/main/apps/www/src/pages) | Locale pages, auth routes, health, sitemap, errors |
| [`src/lib`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/main/apps/www/src/lib) | CMS fallback chain, home feed, list pages, search, site theme, videos, embeds, auth, session, edge cache |
| [`src/components`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/main/apps/www/src/components) | Header, timeline, card viewer, blocks, search box |
| [`src/i18n`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/main/apps/www/src/i18n) | English and Arabic strings |
| [`src/content/fallback`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/main/apps/www/src/content/fallback) | Built-in content for when the CMS is unavailable |
| [`scripts`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/main/scripts) | Config and secrets checks, Fanous theme sync, release scripts |
| [`e2e`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/main/apps/www/e2e) | Playwright |

## Run and test locally

```sh
npm ci
npm run dev        # http://localhost:4321, without the edge wrapper
npm run preview    # the real Worker through wrangler dev
npm run lint && npm run typecheck && npm test
npm run check:config && npm run check:fanous
npm run e2e
```

## Deployment

| Workflow | Runs on | Does |
|---|---|---|
| [`ci.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/.github/workflows/ci.yml) | PRs and pushes | Lint, types, unit tests, config check, build, local Playwright |
| [`deploy-qa.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/.github/workflows/deploy-qa.yml) | Push to `main` | Deploys QA, smoke, Playwright |
| [`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/.github/workflows/release.yml) | `vYYYY.MM.DD` tag on `main`, or manual | Tag: stage → production. Manual: stage only |
| [`rollback.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/.github/workflows/rollback.yml) | Manual | Rollback and smoke |
| [`committed-secrets.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/.github/workflows/committed-secrets.yml) | PRs and pushes to `main` | Fails if the repo would publish a secret |

`www` binds the CMS Worker of the same environment, so a brand-new environment needs its CMS released first. See [Release process](../guides/release-process.md).

Release notes:

- A candidate version must answer `/healthz` three times in a row before the smoke runs ([#28](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/28)).
- The HTML edge cache is keyed by Worker version and site theme, so a deploy never serves a page whose stylesheet is gone ([#27](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/27)).
- Only the cron writes the `CONTENT_SNAPSHOT` KV copy: one writer, no request-path writes ([#20](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/20)).
- QA and stage don't keep the per-request log line, to cut Workers Logs cost. Production is unchanged ([#52](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/52)).

## Key docs

[README](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/README.md) · [Spec](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/apps/www/docs/SPEC.md) · [Plan](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/apps/www/docs/PLAN.md) · [CMS public API](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/apps/www/docs/CMS_PUBLIC_API.md) · [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/SECURITY.md)

## Owners and contacts

No individual owners are named. Security reports go through private vulnerability reporting.

## Current state (2026-11-12)

Shipped since 2026-11-09:

- Sign-in: signed in elsewhere means signed in on www, the header lists every account, and sign-out walks auth's whole logout chain ([#14](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/14), [#15](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/15), [#37](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/37), [#62](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/62)). Sign-out asks in an in-app dialog, never a browser prompt ([#33](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/33)).
- The header shows the user's name by the platform rule: display name, else first and last name, else email ([#57](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/57)).
- Home timeline from Workers KV ([#30](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/30)), then one home list with `/videos` and `/articles` as CMS list pages and channel cards ([#51](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/51)).
- News renamed Articles, old URLs 301 ([#31](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/31)). Card posts read whole inline ([#34](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/34)).
- Scholar pages and bylines ([#38](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/38)). Header autocomplete search and a search page ([#35](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/35)).
- Draft preview ([#24](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/24)), responsive AVIF/WebP images ([#26](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/26)), contact link ([#23](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/23)).
- Theme: Light/Dark/System ([#25](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/25)), replaced by a Light/Dark toggle and menus kept inside the viewport ([#76](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/76)), then the admin's site theme in all four Fanous themes ([#54](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/54), [#56](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/56)).
- Favicons are the owner's logo, cropped and downscaled. Production links exact-size PNGs and an ICO, with no SVG ([#40](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/40), [#49](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/49)).
- Arabic plural for videos is «المرئيات» ([#58](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/58)).

Open: 10 issues and one draft PR, the shared nav contract for the header and account menu ([#59](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/59)). Issues include theme-builder packages on www ([#55](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/55)), scholar-page follow-ups ([#41](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/41), [#42](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/42)), text direction in borrowed-language articles ([#36](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/36)), E2E account work ([#45](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/45), [#46](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/46)) and the older queue: embedded discussions ([#3](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/3)), Continue Watching ([#4](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/4)), retiring the old `workers.dev` deployment ([#5](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/5)) and a newsletter ([#6](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/6)).

## Epics for this repo

12 epics name this repo. The full list, including epics owned by other repos, is in [Epics](../epics/README.md).

| Epic | Status |
|---|---|
| [Epic 25: Sharing & embeddable player](../epics/E25-sharing-embeds.md) | in progress |
| [Epic 26: Embedded discussions ("Ummah Comments")](../epics/E26-ummah-comments.md) | in progress |
| [Legacy roadmap 2.3: main portal frontend](../epics/LR-2.3-legacy-portal-frontend.md) | shipped |
| [www (Astro) + CMS (bknd) v1](../epics/CMS-WWW-V1-cms-www-v1.md) | shipped |
| [CMS and www: post-v1 queue](../epics/CMS-QUEUE-cms-www-queue.md) | in progress |
| [CMS page builder (blocks) and card posts](../epics/CMS-PAGE-BLOCKS-cms-page-blocks.md) | shipped |
| [www home timeline (CMS-managed feed)](../epics/CMS-HOME-TIMELINE-www-home-timeline.md) | shipped |
| [Themes: Lantern, Zujaj, Nahas, Fawanees, and the theme builder](../epics/AUN-THEMES-themes.md) | in progress |
| [Release pipeline, tagged releases and skew protection](../epics/AUN-RELEASE-release-pipeline-skew.md) | shipped |
| [Contact us page and admin inbox](../epics/CHAT-CONTACT-contact-us.md) | shipped |
| [Security audit of the public repos](../epics/CHAT-SECURITY-public-repo-security.md) | shipped |
| [Single sign-on everywhere and sign-out ends SSO](../epics/CHAT-SSO-sso-everywhere.md) | shipped |
