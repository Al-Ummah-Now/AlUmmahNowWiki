[← Home](../README.md)

# AlUmmahNowAuth

[Repository](https://github.com/Al-Ummah-Now/AlUmmahNowAuth) · default branch `main`

## Purpose

The single sign-on provider for every Al Ummah Now app, plus the account profile app, the auth admin dashboard and the audit event consumer. See [Authentication and SSO](../guides/authentication.md).

## Tech stack

- pnpm monorepo, TypeScript, Cloudflare Workers
- `@al-ummah-now/openauth`, published from the [openauth fork](openauth.md)
- React Router v7 and shadcn/ui for the admin dashboard
- Cloudflare D1, KV, Queues, Analytics Engine and Workers Rate Limiting. D1 is the source of truth for users, sessions of profile and admin, and revocations
- Vitest and Playwright

## Layout

| Path | What it is |
|---|---|
| [`apps/auth`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/tree/main/apps/auth) | The OAuth/OIDC issuer, at `auth.*` |
| [`apps/profile`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/tree/main/apps/profile) | Account profile, at `profile.auth.*` |
| [`apps/admin`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/tree/main/apps/admin) | Users, clients, roles, moderation requests, sign-in themes and recently deleted items, at `admin.auth.*` |
| [`apps/audit-consumer`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/tree/main/apps/audit-consumer) | Queue consumer that writes audit events |
| [`packages/ui`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/tree/main/packages/ui) | Shared UI |
| [`e2e`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/tree/main/e2e) | Playwright suites |

## Run and test locally

```sh
pnpm install
pnpm dev            # or pnpm dev:auth, pnpm dev:admin, pnpm dev:profile, pnpm dev:consumer
pnpm type-check
pnpm lint
pnpm test:unit
pnpm test:e2e
```

Local database setup and seeding are in [QUICKSTART.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/QUICKSTART.md). The issuer adds a `Server-Timing` header per request with its stage and binding timings, which helps when a sign-in is slow ([#315](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/315)).

## Deployment

| Workflow | Runs on | Does |
|---|---|---|
| [`test.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/test.yml) | PRs, pushes to `main` | Lint, type check, unit tests, config and migration checks, and calls `qa-e2e.yml` under a waiting QA lock |
| [`qa-e2e.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/qa-e2e.yml) | Called from `test.yml` | Deploys to QA and runs E2E with per-run accounts |
| [`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/release.yml) | Every push to `main`, or manual | Build once → stage → production |
| [`rollback.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/rollback.yml) | Manual | Rolls back workers |
| [`local-stack-bundle.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/local-stack-bundle.yml) | After each successful release, or manual | Publishes the released auth, profile and admin workers and migrations as a `local-stack-<sha>` prerelease, which AlUmmahNow's local E2E stack downloads |

Unlike the monorepo, **every merge to `main` releases to production** after passing stage. Moving to tags is proposed in [#217](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/217) but hasn't happened. See [Release process](../guides/release-process.md).

## Key docs

- [Release pipeline notes](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/release-pipeline.md) and [CICD.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/CICD.md)
- [ARCHITECTURE.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/ARCHITECTURE.md)
- [Moderation requests](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/MODERATION_REQUESTS.md) and [admin invites](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/USER_INVITES.md)
- [Account hub spec](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/account-hub/SPEC.md) and [plan](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/account-hub/PLAN.md)
- [Identity platform spec](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/IDENTITY_PLATFORM_SPEC.md)
- [Client integration guide](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/plans/CLIENT-INTEGRATION-GUIDE.md)
- [SDK usage](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/SDK_USAGE.md) and [API reference](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/API_REFERENCE.md)
- [CONTRIBUTING.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/CONTRIBUTING.md) and [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/SECURITY.md)

Some older docs are out of date. `ARCHITECTURE.md` and `USER_MANAGEMENT.md` describe a simple admin/user role, while the code now uses RBAC roles. See [Site roles and channel roles](../guides/roles.md).

## Owners and contacts

No individual owners are named and there is no CODEOWNERS file. Security reports go through private vulnerability reporting.

## Current state (2026-11-12)

61 open issues, 23 labelled `queue`. 22 open PRs, mostly dependency updates; the shared nav ([#329](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/329)) is a held draft. The fork is pinned at openauth 1.0.47.

Shipped since 2026-11-09:

- **Security and scale audit.** PKCE for every first-party web client, single-use codes and atomic refresh rotation (openauth 1.0.42 on D1), Workers Rate Limiting, attempt limits, D1 as the source of truth for users and revocations, profile and admin sessions in D1 with one refresh at a time, and no tokens for suspended or deleted accounts ([#266](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/266), [#268](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/268), [#264](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/264), [#273](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/273), [#285](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/285), [#286](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/286), [#288](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/288), [#302](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/302)).
- **Admin.** Moderation requests from client apps ([#275](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/275)), invites that pre-provision accounts ([#299](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/299)), the Scholar role ([#298](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/298)), 30-day soft delete ([#293](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/293)), in-page confirm dialogs and user autocompletes ([#294](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/294), [#295](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/295), [#320](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/320)).
- **Look and language.** English unless `?lang=ar`, per-request theme, Auth's own theme packages managed in the auth admin, Fawanees by default ([#261](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/261), [#257](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/257), [#279](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/279), [#282](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/282), [#322](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/322)). One email design, each email in one language ([#319](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/319)). One display-name rule shared with the monorepo ([#327](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/327)).
- **Reliability.** JWKS and discovery edge-cached with a last good copy ([#333](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/333)), sign-in latency work ([#315](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/315)), lower D1/KV/log usage ([#321](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/321)).
- **Privacy.** Purging an account removes its email-to-subject record and invite rows ([#326](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/326), [#335](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/335)).
- **Testing.** Per-run E2E accounts and QA/stage-only teardown routes ([#303](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/303), [#309](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/309)), a local-stack bundle per release ([#323](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/323)).

Open examples: auth admin following the site theme ([#330](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/330)), PII in sign-in logs ([#313](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/313)), the invites view in the admin ([#301](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/301)), Dependabot alert triage ([#297](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/297)), billing roles ([#227](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/227)). Releasing from tags is still only proposed ([#217](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/217)).

## Epics for this repo

22 epics name this repo. The full list, including epics owned by other repos, is in [Epics](../epics/README.md).

| Epic | Status |
|---|---|
| [Epic 9: Platform foundations for native clients (backend)](../epics/E09-native-platform-foundations.md) | in progress |
| [Epic 26: Embedded discussions ("Ummah Comments")](../epics/E26-ummah-comments.md) | in progress |
| [Epic 27: Plans & entitlements framework](../epics/E27-plans-entitlements.md) | in progress |
| [Epic 29: Core web experience completion (P0)](../epics/E29-core-web-experience.md) | in progress |
| [Legacy roadmap 1.3: SSO authentication service](../epics/LR-1.3-legacy-sso.md) | shipped |
| [Auth v1.0 roadmap: Authentication & token management](../epics/AUTH-R1-auth-tokens.md) | in progress |
| [Auth v1.0 roadmap: OAuth & external authentication](../epics/AUTH-R2-auth-oauth.md) | in progress |
| [Auth v1.0 roadmap: RBAC & user management](../epics/AUTH-R3-auth-rbac.md) | in progress |
| [Auth v1.0 roadmap: Documentation & developer experience](../epics/AUTH-R4-auth-docs-dx.md) | planned |
| [Auth v1.0 roadmap: CI/CD & infrastructure](../epics/AUTH-R5-auth-cicd.md) | in progress |
| [Auth v1.0 roadmap: Release & distribution](../epics/AUTH-R6-auth-release.md) | planned |
| [Auth v1.0 roadmap: milestones and phases](../epics/AUTH-PHASES-auth-roadmap-phases.md) | in progress |
| [Identity platform: SSO provider, Lanes 1–7](../epics/AUTH-IDP-identity-platform.md) | shipped |
| [Account hub ("Al Ummah Now Account")](../epics/AUTH-ACCOUNT-HUB-account-hub.md) | in progress |
| [OpenAuth fork: enterprise features](../epics/AUTH-ENTERPRISE-openauth-enterprise-features.md) | shipped |
| [OpenAuth enterprise admin APIs](../epics/OA-ADMIN-APIS-openauth-admin-apis.md) | in progress |
| [Auth app plans: admin enhancement, RBAC UI, refactor, M2M admin API, OpenAuth 1.0.9 migration](../epics/AUTH-APP-PLANS-auth-app-plans.md) | in progress |
| [www (Astro) + CMS (bknd) v1](../epics/CMS-WWW-V1-cms-www-v1.md) | shipped |
| [Themes: Lantern, Zujaj, Nahas, Fawanees, and the theme builder](../epics/AUN-THEMES-themes.md) | in progress |
| [Release pipeline, tagged releases and skew protection](../epics/AUN-RELEASE-release-pipeline-skew.md) | shipped |
| [Security audit of the public repos](../epics/CHAT-SECURITY-public-repo-security.md) | shipped |
| [Single sign-on everywhere and sign-out ends SSO](../epics/CHAT-SSO-sso-everywhere.md) | shipped |
