[← Home](../README.md)

# AlUmmahNowUI

[Repository](https://github.com/Al-Ummah-Now/AlUmmahNowUI) · default branch `main`

## Purpose

The public website at `www.alummahnow.net`. It explains the platform, links to videos, profile and sign-in, and shows editorial content written in the [CMS](AlUmmahNowCMS.md). The apex domain redirects to `www`.

## Tech stack

Astro 5 with server rendering on Cloudflare Workers, Tailwind 4, English and Arabic (RTL). Vitest and Playwright. Node 22+.

## Layout

| Path | What it is |
|---|---|
| [`src/worker.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/src/worker.ts) | Edge wrapper around Astro: redirects, language choice, security headers |
| [`src/pages`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/main/src/pages) | Locale pages, auth routes, health, sitemap, errors |
| [`src/lib`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/main/src/lib) | CMS fallback chain, videos, embeds, markdown, auth, session |
| [`src/i18n`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/main/src/i18n) | English and Arabic strings |
| [`src/content/fallback`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/main/src/content/fallback) | Built-in content for when the CMS is unavailable |
| [`scripts`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/main/scripts) | Config checks and release scripts |
| [`e2e`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/main/e2e) | Playwright |

## Run and test locally

```sh
npm ci
npm run dev        # http://localhost:4321, without the edge wrapper
npm run preview    # the real Worker through wrangler dev
npm run lint && npm run typecheck && npm test
npm run e2e
```

## Deployment

| Workflow | Runs on | Does |
|---|---|---|
| [`ci.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/.github/workflows/ci.yml) | PRs and pushes | Lint, types, unit tests, config check, build, local Playwright |
| [`deploy-qa.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/.github/workflows/deploy-qa.yml) | Push to `main` | Deploys QA, smoke, Playwright |
| [`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/.github/workflows/release.yml) | `vYYYY.MM.DD` tag on `main`, or manual | Tag: stage → production. Manual: stage only |
| [`rollback.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/.github/workflows/rollback.yml) | Manual | Rollback and smoke |

`www` binds the CMS Worker of the same environment, so a brand-new environment needs its CMS released first. See [Release process](../guides/release-process.md).

## Key docs

[README](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/README.md) · [Spec](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/docs/SPEC.md) · [Plan](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/docs/PLAN.md) · [CMS public API](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/docs/CMS_PUBLIC_API.md) · [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/SECURITY.md)

## Owners and contacts

No individual owners are named. Security reports go through private vulnerability reporting.

## Current state (2026-11-09)

4 open issues, all `queue`. One open PR: shared sign-in on `www` with a multi-account header ([#14](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/14)).

Queue: newsletter or contact form ([#6](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/6)), retire the old `workers.dev` deployment ([#5](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/5)), Continue Watching row ([#4](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/4)), embedded discussions ([#3](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/3)).

Recently merged: `www` v1 ([#7](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/7)), tag-based release ([#11](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/11)).
