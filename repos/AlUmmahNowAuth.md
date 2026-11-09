[← Home](../README.md)

# AlUmmahNowAuth

[Repository](https://github.com/Al-Ummah-Now/AlUmmahNowAuth) · default branch `main`

## Purpose

The single sign-on provider for every Al Ummah Now app, plus the account profile app, the auth admin dashboard and the audit event consumer. See [Authentication and SSO](../guides/authentication.md).

## Tech stack

- pnpm monorepo, TypeScript, Cloudflare Workers
- `@al-ummah-now/openauth`, published from the [openauth fork](openauth.md)
- React Router v7 and shadcn/ui for the admin dashboard
- Cloudflare D1, KV, Queues and Analytics Engine
- Vitest and Playwright

## Layout

| Path | What it is |
|---|---|
| [`apps/auth`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/tree/main/apps/auth) | The OAuth/OIDC issuer, at `auth.*` |
| [`apps/profile`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/tree/main/apps/profile) | Account profile, at `profile.auth.*` |
| [`apps/admin`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/tree/main/apps/admin) | User and client administration, at `admin.auth.*` |
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

Local database setup and seeding are in [QUICKSTART.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/QUICKSTART.md).

## Deployment

| Workflow | Runs on | Does |
|---|---|---|
| [`test.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/test.yml) | PRs, pushes to `main` | Type check, unit tests, config and migration checks, and calls `qa-e2e.yml` |
| [`qa-e2e.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/qa-e2e.yml) | Called from `test.yml` | Deploys to QA and runs E2E |
| [`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/release.yml) | Every push to `main`, or manual | Build once → stage → production |
| [`rollback.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/rollback.yml) | Manual | Rolls back workers |

Unlike the monorepo, **every merge to `main` releases to production** after passing stage. Moving to tags is proposed in [#217](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/217) but hasn't happened. See [Release process](../guides/release-process.md).

## Key docs

- [Release pipeline notes](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/release-pipeline.md) and [CICD.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/CICD.md)
- [ARCHITECTURE.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/ARCHITECTURE.md)
- [Account hub spec](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/account-hub/SPEC.md) and [plan](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/account-hub/PLAN.md)
- [Identity platform spec](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/IDENTITY_PLATFORM_SPEC.md)
- [Client integration guide](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/plans/CLIENT-INTEGRATION-GUIDE.md)
- [SDK usage](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/SDK_USAGE.md) and [API reference](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/API_REFERENCE.md)
- [CONTRIBUTING.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/CONTRIBUTING.md) and [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/SECURITY.md)

Some older docs are out of date. `ARCHITECTURE.md` and `USER_MANAGEMENT.md` describe a simple admin/user role, while the code now uses RBAC roles. See [Site roles and channel roles](../guides/roles.md).

## Owners and contacts

No individual owners are named and there is no CODEOWNERS file. Security reports go through private vulnerability reporting.

## Current state (2026-11-09)

42 open issues, 22 labelled `queue`. 23 open PRs, including dependency updates.

Active work: sign-in and profile following the site theme ([#257](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/257)), single sign-on across profile and auth admin ([#254](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/254)) and `account.*` redirects ([#253](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/253)).

Examples from the queue: profile token refresh ([#252](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/252)), state and PKCE on the profile redirect ([#251](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/251)), billing roles for Epic 27 ([#227](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/227)).

Recently merged: 15-minute access tokens on production and stage ([#244](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/244)), account hub spec ([#250](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/250)).
