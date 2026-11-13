[← Home](../README.md)

# Environments and domains

There are three shared environments, all on subdomains of `alummahnow.net`; short share links use the `alummahnow.link` zone.

| Environment | Purpose | Data |
|---|---|---|
| **QA** | Testing merged and in-progress work | Its own |
| **Stage** | Release candidate: production config with separate data | Its own |
| **Production** | Live service | Production |

## Hostnames

| Service | Repo | QA | Stage | Production |
|---|---|---|---|---|
| Public site | [AlUmmahNowUI](../repos/AlUmmahNowUI.md) | `www.qa.alummahnow.net` | `www.stage.alummahnow.net` | `www.alummahnow.net` |
| CMS | [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md) | `cms.qa.alummahnow.net` | `cms.stage.alummahnow.net` | `cms.alummahnow.net` |
| Videos site | [AlUmmahNow](../repos/AlUmmahNow.md) `web` | `videos.qa.alummahnow.net` | `videos.stage.alummahnow.net` | `videos.alummahnow.net` |
| Videos API | `api-videos` | `videos.api.qa.alummahnow.net` | `videos.api.stage.alummahnow.net` | `videos.api.alummahnow.net` |
| Realtime | `websocket-server` | `realtime.qa.alummahnow.net` | `realtime.stage.alummahnow.net` | `realtime.alummahnow.net` |
| Admin site | `admin-web` | `admin.qa.alummahnow.net` | `admin.stage.alummahnow.net` | `admin.alummahnow.net` |
| Admin API | `admin-api` | `admin.api.qa.alummahnow.net` | `admin.api.stage.alummahnow.net` | `admin.api.alummahnow.net` |
| Media (R2 + CDN) | `media` Worker | `media.qa.alummahnow.net` | `media.stage.alummahnow.net` | `media.alummahnow.net` |
| Short links | `short-links` Worker ([AUN-SHORT-LINKS](../epics/AUN-SHORT-LINKS-short-share-links.md)) | `qa.alummahnow.link` | `stage.alummahnow.link` | `alummahnow.link` |
| Auth issuer | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) `auth` | `auth.qa.alummahnow.net` | `auth.stage.alummahnow.net` | `auth.alummahnow.net` |
| Account profile | `profile` | `profile.auth.qa.alummahnow.net` | `profile.auth.stage.alummahnow.net` | `profile.auth.alummahnow.net` |
| Auth admin | `admin` | `admin.auth.qa.alummahnow.net` | `admin.auth.stage.alummahnow.net` | `admin.auth.alummahnow.net` |

The apex `alummahnow.net` redirects to `www`, keeping path and query.

`processor`, `scheduler`, `cost-monitor` and the auth `audit-consumer` have no public hostname. The media host serves public HLS from R2 through the CDN and private HLS through the `media` Worker's `/priv/*` route; see [Video delivery](video-delivery.md).

These come from the Wrangler configs and release scripts in each repo. The production hosts for the public site, CMS, videos, API, realtime, admin, admin API, auth and profile all answered HTTP requests on 2026-11-09.

The admin apps are deployed to production by every monorepo release (`release.yml` promotes all its workers). [Issue #185](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/185) and older notes that call them undeployed are out of date.

## Rules that apply everywhere

- Each environment has its own auth issuer. Stage also has its own database, KV and signing keys, so a stage token is never valid in production.
- Stage has production's shape. In AlUmmahNowAuth, the config check requires stage and production to have the same binding names and kinds.
- The native apps have QA and production builds. There is no native stage build in their plans.
- **QA and stage share one Bunny Stream test library**, told apart by a `[stage] ` title prefix. Production has its own libraries. See [Video delivery](video-delivery.md#bunny-libraries-and-collections).
- **E2E tests mostly don't use QA any more.** They run on a local stack each CI job boots for itself. Nothing tests QA on a pull request, a push or a schedule: QA-targeted tests run only with a numbered release ([#1190](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1190)). See [Testing and E2E](testing.md).
- **Session cookies are `Secure`** on every deployed host. On a plain-http `localhost` origin (the local E2E stack, local development) browsers drop Secure cookies, so the Auth issuer's `__session` ([Auth#336](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/336), openauth 1.0.47) admin-web's session cookie and the videos web app's session cookies ([#1094](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1094)) are not Secure there.

## Search engines (crawler rules)

Search engines see only production, and on production only the public sites. The full spec is AUN-SEO (draft, [Wiki#23](https://github.com/Al-Ummah-Now/AlUmmahNowWiki/pull/23)).

| Host | robots.txt | Pages |
|---|---|---|
| `www` (production) | `Allow: /`, `Disallow: /auth/`, `Sitemap:` | indexable; noindex on search results, borrowed-language pages, previews, errors |
| `videos` (production) | `Allow: /`, `Disallow: /api/` | indexable, except `X-Robots-Tag: noindex` on viewer-only pages: search (`noindex, follow`), history, library, settings, upload, Studio, notifications, profile, subscriptions, dashboard, analytics, auth, dev, video edit. Embeds are noindex |
| `auth`, `profile.auth`, `account`, `admin.auth`, `admin`, `videos.api`, `admin.api`, `realtime`, the live host | `Disallow: /` | `X-Robots-Tag: noindex, nofollow` on every response |
| `cms` | `Allow: /api/public/v1/media/`, `Disallow: /` | noindex on everything except public media (www's article and share images) |
| `media` Worker (`/priv/*`) | – | noindex on every response |
| Every QA and stage host | `Disallow: /` | `X-Robots-Tag: noindex, nofollow` on every response |

- **Environment, not host.** The videos site decides from `NEXTJS_ENV` (`production` only). If the variable is missing, it falls back to the host, so production is never hidden by mistake and QA is never indexed.
- **Cloudflare's managed robots.txt** (content signals) is prepended to each host's own file on production.

**Status codes on the videos site:**

| Situation | Status |
|---|---|
| A video or playlist nobody here may see (unknown, private, deleted, hidden, scheduled) | **404**, never a 200 "not found" |
| The owner viewing their own private video or playlist | 200 with noindex |
| The videos API is down | **503** with `Retry-After: 120`, never 404 (`worker.ts` maps page 500s) |

The old watch URL `/{locale}/video?vid={id}` is a **301** to `/{locale}/video/{id}`, and every link uses the canonical form. `/{locale}/video` with no id is a 404.

## Where each environment comes from

See [Release process](release-process.md).
