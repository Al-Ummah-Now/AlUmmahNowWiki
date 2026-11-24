[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Auth v1.0 roadmap: Documentation & developer experience

| | |
|---|---|
| **ID** | `AUTH-R4` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md), [openauth](../repos/openauth.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) (`apps/dev`) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-23 |

## Goal

A developer can connect an app to Al Ummah Now sign-in using only our published docs, and every documented request works as written. Docs stay true because CI fails when they drift from the code.

Two audiences:

- **App developers**, who build a client: our web, native, TV and server apps today.
- **Contributors**, who run, change or release the auth server and the openauth fork.

## What exists today

| Area | Where | State on 2026-11-23 |
|---|---|---|
| API spec | [`openapi.yaml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/d4c7bb193c07b07e4b0b02c0d0ba6dbf10154a3e/openapi.yaml) | Four paths (`/authorize`, `/token`, `/logout`, `/`). Its production server is a `workers.dev` URL, not `auth.alummahnow.net`. The router ([`router.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/apps/auth/src/router.ts), [`index.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/apps/auth/src/index.ts)) serves far more: discovery, keys, userinfo, device grant, passkeys, sessions, account, invites, moderation, revocations, themes and the admin API. Nothing checks the spec against the code. |
| Repo guides | [`API_REFERENCE.md`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/API_REFERENCE.md), [`SDK_USAGE.md`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/SDK_USAGE.md), [`AUTHENTICATION_FLOWS.md`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/AUTHENTICATION_FLOWS.md), [`QUICKSTART.md`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/QUICKSTART.md) | Written for the 2025 email-code server: one-hour tokens (they last 15 minutes), an `auth_session` cookie, sessions in KV, no PKCE (required today), the upstream package name. The README still says to build the fork under `/tmp`. |
| Integration guide | [`CLIENT-INTEGRATION-GUIDE.md`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/plans/CLIENT-INTEGRATION-GUIDE.md) | Documents `@alummahnow/auth-client`, a package that was planned and never built. The story was marked Done; it is not. |
| SDK, JavaScript and TypeScript | `@al-ummah-now/openauth/client` ([`client.ts`](https://github.com/Al-Ummah-Now/openauth/blob/master/packages/openauth/src/client.ts)) | Authorize, exchange, refresh and verify. No client credentials, device grant, revocation or userinfo, so each caller writes its own `fetch`. |
| SDK, Python and Go | none | – |
| Discovery | [`enterprise/issuer.ts`](https://github.com/Al-Ummah-Now/openauth/blob/master/packages/openauth/src/enterprise/issuer.ts) `/.well-known/openid-configuration` | Advertises a `/register` endpoint that no route serves, `id_token` responses the issuer doesn't support, and no revocation or introspection endpoint. `service_documentation` points at `/docs`, which redirects to the profile app. `/.well-known/oauth-authorization-server` lists neither PKCE nor the client authentication methods. A standard OAuth library configures itself wrongly from either. |
| Library docs site | [`www`](https://github.com/Al-Ummah-Now/openauth/tree/master/www), live on [GitHub Pages](https://al-ummah-now.github.io/openauth/) | Upstream's text: installs `@openauthjs/openauth`, edits link to `toolbeam/openauth`. No page for the device grant, native clients, passkeys, PKCE rules, confidential clients, key rotation or revocation. |
| Examples | [`examples`](https://github.com/Al-Ummah-Now/openauth/tree/master/examples) | Next.js, React, SvelteKit, Astro, API and issuer examples. Not type-checked or run in CI. |
| Developer site | [`apps/dev`](https://github.com/Al-Ummah-Now/AlUmmahNowUI/tree/main/apps/dev), [alummahnow.dev](https://alummahnow.dev) | System design, including an [identity page](https://alummahnow.dev/en/system-design/identity/) ([AUN-DEV-SITE](AUN-DEV-SITE-developer-and-partner-site.md)). It explains how sign-in is built. Nothing says how to use it. |
| Key management | Auth admin → [Clients](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/apps/admin/app/routes/clients.tsx) | Staff create clients, rotate secrets and delete them. No self-service (AR4-D1). |
| Usage analytics | [`utils/analytics.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/apps/auth/src/utils/analytics.ts) | Writes events to an Analytics Engine dataset (`AUTH_ANALYTICS`), bound in every environment's Wrangler config. Nothing reads them: no query, no page. |

## Stories

Each is one PR. Back end and library first, then docs, then the site.

| Story | Repo | What | Done when | Status |
|---|---|---|---|---|
| **R4-1 Discovery tells the truth** | openauth | Both discovery documents list only what the issuer supports: `code` and `token`, the enabled grants, the endpoints that exist, `S256`, the client authentication methods, the prompts it handles. `service_documentation` becomes an issuer option and is left out when unset. `/userinfo` answers an invalid token with 401 and `WWW-Authenticate` (RFC 6750). Today a token of the wrong kind gets 200 with an error body, and any other bad token, or a failure to read our own keys, gets a 400 HTML page that tells the caller to start signing in again. A key-read failure becomes 500 | A test walks every URL a discovery document lists and gets something other than 404 | **merged** ([openauth#58](https://github.com/Al-Ummah-Now/openauth/pull/58)); Auth took it in [Auth#492](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/492), in production |
| **R4-2 TypeScript client completes the flows** | openauth | `createClient` gains `clientCredentials`, `device` (start and poll with `slow_down`), `revoke` and `userinfo`, with typed results and no thrown network surprises. Existing methods don't change | Tests run each against a real in-memory issuer | **merged** ([openauth#60](https://github.com/Al-Ummah-Now/openauth/pull/60)), published as openauth 1.1.0; Auth does not use it yet |
| **R4-3 Python and Go examples** | openauth | `examples/client/python` and `examples/client/go`, on standard libraries: sign-in with PKCE, refresh, access-token verification from the published keys, client credentials | CI starts the test issuer and runs both against it | **merged** ([openauth#63](https://github.com/Al-Ummah-Now/openauth/pull/63)) |
| **R4-4 Complete OpenAPI spec** | Auth | `openapi.json` (3.1) covers every route, each marked `x-audience`: `public`, `app` (first-party apps and their servers) or `admin`. A test reads the mounted routes and fails on a route missing from the spec, or a spec path no route serves | Drift test and spec validation in the existing Auth unit tests | **merged** ([Auth#498](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/498)), with [Auth#501](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/501) (a dead route removed) and [Auth#506](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/506) (request bodies) |
| **R4-5 Repo guides rewritten** | Auth | `API_REFERENCE`, `SDK_USAGE`, `AUTHENTICATION_FLOWS`, `QUICKSTART`, the README setup and the client integration guide describe the server as it is. Plans for packages that don't exist are marked as history. A test checks that relative links resolve and that retired names don't come back | Docs test in CI | **merged** ([Auth#499](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/499)) |
| **R4-6 Library docs site** | openauth | Fork package name, GitHub Packages install, our links, and pages for what the fork added. Content only; [openauth#55](https://github.com/Al-Ummah-Now/openauth/pull/55) keeps the framework upgrade | Build passes; frames audited | **waiting** for [openauth#55](https://github.com/Al-Ummah-Now/openauth/pull/55) (held for the owner): the same folder, and its build and frames need that install |
| **R4-7 Auth section on alummahnow.dev** | UI | `/{en,ar}/auth/`: overview and choosing a flow; web, native, TV and server quickstarts; tokens and how to verify them; sign-out and revocation; errors and limits; sequence figures using the existing diagram kit | Every page in both languages; diagram gate, axe and copy tests green; frames audited | **merged** ([UI#147](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/147), [UI#150](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/150)), with the footer fix [UI#149](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/149) |
| **R4-8 API reference on alummahnow.dev** | UI | `/{en,ar}/auth/reference/`: reduced by a script from the Auth spec at a pinned commit and committed, so a build needs no network. `public` and `app` operations only. Live filter, copyable curl, TypeScript, Python and Go samples | A build test fails if an operation lacks either language's summary | **merged** ([Auth#503](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/503), [UI#152](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/152)) |
| **R4-9 Developer tools on alummahnow.dev** | UI | `/{en,ar}/auth/tools/`: an authorize-request builder that makes a PKCE pair, and an access-token inspector. Both run in the browser only and send nothing | Unit and E2E tests, including that no request leaves the page | **merged** ([UI#151](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/151)) |
| **R4-10 Developer portal** | – | Self-service apps, keys and usage | **Not built** (AR4-D1). R4-7 to R4-9 are the developer pages, and the Auth admin manages keys | **not built** |

Two roadmap items stay as they are: **example apps** exist in `openauth/examples` (R4-3 adds languages), and **key management** for our own apps is the Auth admin's Clients page.

## Data model and API

No database change. No new server endpoint. R4-1 changes the content of two public documents and the status code of an error on `/userinfo`. R4-2 adds methods to a client library. A consumer that reads `registration_endpoint` or `id_token` from discovery would notice; no repo in the org does.

## Platforms

| Platform | Needs |
|---|---|
| Web | R4-2 client; R4-7 web quickstart |
| Auth admin | Nothing |
| Apple, Android, Desktop | Documentation of the native flow they already use (system browser, PKCE, passkey, `install_id`). No app change |
| TV | Documentation of the device grant |
| Servers | R4-2 `clientCredentials`; R4-3 examples |

## Feature switch and tiers

None. These are public docs, a library and static pages. The developer tools call no API, so there is nothing to switch off.

## Languages

alummahnow.dev pages are in English and Arabic with the same keys, ٠–٩ in Arabic prose, and code left-to-right. Spec summaries carry `x-summary-ar`. The repo guides and the library docs stay English, as they are in every repo.

## Tests

- Library: unit tests on an in-memory issuer. No network, no shared state.
- Examples: run in CI against an issuer started by the job, and stopped after it.
- Auth: spec drift, spec validity, docs links.
- Site: copy parity, build-time reference checks, axe, no horizontal scroll at 320 px, local E2E only. Nothing runs against deployed QA.

## Costs

Nothing per video or per view. Static pages on Workers static assets are free to serve, and GitHub Actions is free for public repos. The TypeScript client makes fewer calls than the hand-written ones, because discovery and keys stay cached.

## Safety

- The site never shows `admin` operations, staff hostnames beyond those already public, or real client ids and secrets. Samples use placeholder values.
- The token inspector decodes locally, says so, and keeps nothing: no storage, no URL parameters.
- The request builder's PKCE verifier stays in the page.
- Python and Go samples verify signature, issuer, expiry and audience. A sample that skips a check is a bug.

## Owner decisions

All decided on 2026-11-23.

1. **AR4-D1 (owner): no outside developers.** Only our own apps and scholar sites use our sign-in. Staff create clients. The options were A (our own only), B (staff approval) and C (self-service portal). B and C need a consent screen, per-app scopes, developer terms, abuse reports and a way to switch an app off.
2. **AR4-D2 (orchestrator, routine): tested Python and Go examples** on standard OAuth libraries, no packages of our own.
3. **AR4-D3 (orchestrator, routine): GitHub Packages only** for `@al-ummah-now/openauth`.

## Constraints

- Cost-conscious design: prefer low unit costs ([O1](decisions.md#o1-cost-conscious-design)).
- alummahnow.dev shows only what runs today, spells out abbreviations and carries no citation lists ([AUN-DEV-SITE](AUN-DEV-SITE-developer-and-partner-site.md)).
- Sign-in and profile pages default to English unless `?lang=ar` ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## History

The roadmap (December 2024) listed five items under documentation and developer experience and was never updated. The 2026-11-21 reconciliation marked integration guides and example apps Done, and the API spec, SDKs and portal In Progress ([Auth#17](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/17), [Auth#48](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/48), [Auth#18](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/18), [openauth#54](https://github.com/Al-Ummah-Now/openauth/pull/54)). The inventory above replaces it.

## Sources

- [AlUmmahNowAuth/ROADMAP.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/ROADMAP.md)
- [AlUmmahNowAuth/.github/ISSUE_TEMPLATE/roadmap_epic.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/.github/ISSUE_TEMPLATE/roadmap_epic.md)
- [AlUmmahNowAuth#22](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/22)
- [AlUmmahNowAuth#8](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/8) (closed roadmap issue)
