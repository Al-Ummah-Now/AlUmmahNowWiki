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
| Auth issuer | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) `auth` | `auth.qa.alummahnow.net` | `auth.stage.alummahnow.net` | `auth.alummahnow.net` |
| Account profile | `profile` | `profile.auth.qa.alummahnow.net` | `profile.auth.stage.alummahnow.net` | `profile.auth.alummahnow.net` |
| Auth admin | `admin` | `admin.auth.qa.alummahnow.net` | `admin.auth.stage.alummahnow.net` | `admin.auth.alummahnow.net` |

The apex `alummahnow.net` redirects to `www`, keeping path and query.

`processor`, `scheduler` and the auth `audit-consumer` have no public hostname.

These come from the Wrangler configs and release scripts in each repo. The production hosts for the public site, CMS, videos, API, realtime, admin, admin API, auth and profile all answered HTTP requests on 2026-11-09.

The monorepo's release spec and [issue #185](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/185) describe the admin apps as not yet deployed to production. The hosts do respond, so those notes look out of date. **Unverified:** which build is running there.

## Rules that apply everywhere

- Each environment has its own auth issuer. Stage also has its own database, KV and signing keys, so a stage token is never valid in production.
- Stage has production's shape. In AlUmmahNowAuth, the config check requires stage and production to have the same binding names and kinds.
- The native apps have QA and production builds. There is no native stage build in their plans.

## Where each environment comes from

See [Release process](release-process.md).
