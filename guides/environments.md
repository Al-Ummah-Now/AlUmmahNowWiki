[← Home](../README.md)

# Environments and domains

There are three shared environments, all on subdomains of `alummahnow.net`.

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
- **E2E tests mostly don't use QA any more.** They run on a local stack each CI job boots for itself. QA keeps the deployed specs on PRs and a nightly run. See [Testing and E2E](testing.md).
- **Session cookies are `Secure`** on every deployed host. On a plain-http `localhost` origin (the local E2E stack, local development) browsers drop Secure cookies, so the Auth issuer's `__session` ([Auth#336](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/336), openauth 1.0.47) and admin-web's session cookie (on `main` since 2026-11-13) are not Secure there. The same change for the videos web app is still an open PR ([#1094](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1094)).

## Where each environment comes from

See [Release process](release-process.md).
