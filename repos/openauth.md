[← Home](../README.md)

# openauth

[Repository](https://github.com/Al-Ummah-Now/openauth) · default branch `master` · fork of [anomalyco/openauth](https://github.com/anomalyco/openauth)

## Purpose

The organisation's fork of OpenAuth, a standards-based OAuth 2.0 provider library. [AlUmmahNowAuth](AlUmmahNowAuth.md) consumes it as `@al-ummah-now/openauth`. The fork adds features the auth service needs, described in [ENTERPRISE_FEATURES.md](https://github.com/Al-Ummah-Now/openauth/blob/master/docs/ENTERPRISE_FEATURES.md). Recent additions include native app clients (RFC 8252), the device authorization grant (RFC 8628) and `auth_time` on access tokens.

## Tech stack

TypeScript, Bun workspaces, Changesets. Published to GitHub Packages.

## Layout

| Path | What it is |
|---|---|
| [`packages/openauth`](https://github.com/Al-Ummah-Now/openauth/tree/master/packages/openauth) | The library |
| [`examples`](https://github.com/Al-Ummah-Now/openauth/tree/master/examples) | Example issuers and clients |
| [`www`](https://github.com/Al-Ummah-Now/openauth/tree/master/www) | Documentation site |
| [`docs`](https://github.com/Al-Ummah-Now/openauth/tree/master/docs) | Fork documentation |

## Run and test locally

```sh
bun install
cd packages/openauth
bun run build
bun test
```

## Deployment

This is a library, so it has no environments. [`publish-github.yml`](https://github.com/Al-Ummah-Now/openauth/blob/master/.github/workflows/publish-github.yml) publishes after the test and format workflows:

- A PR that changes the package gets a pre-release `X.Y.Z-pr.{PR}.{run}`.
- A push to `master` gets a patch bump, changelog, tag and GitHub release.
- A manual run can bump patch, minor or major.

Details are in [RELEASING.md](https://github.com/Al-Ummah-Now/openauth/blob/master/docs/RELEASING.md).

## Key docs

- [RELEASING.md](https://github.com/Al-Ummah-Now/openauth/blob/master/docs/RELEASING.md)
- [ENTERPRISE_FEATURES.md](https://github.com/Al-Ummah-Now/openauth/blob/master/docs/ENTERPRISE_FEATURES.md)
- [UPSTREAM_ANALYSIS.md](https://github.com/Al-Ummah-Now/openauth/blob/master/docs/UPSTREAM_ANALYSIS.md)
- [SECURITY.md](https://github.com/Al-Ummah-Now/openauth/blob/master/SECURITY.md)
- Fork plans in AlUmmahNowAuth: [plan](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/OPENAUTH_FORK_PLAN.md), [setup](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/OPENAUTH_FORK_SETUP.md)

## Owners and contacts

No individual owners are named. GitHub Issues are disabled on this fork, so track fork work in [AlUmmahNowAuth issues](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues).

## Current state (2026-11-09)

One open PR, [#2](https://github.com/Al-Ummah-Now/openauth/pull/2) (Version Packages). Latest fork version bump on `master` is 1.0.29. AlUmmahNowAuth's `apps/auth` pins 1.0.28.

Recently merged: `auth_time` on access tokens ([#20](https://github.com/Al-Ummah-Now/openauth/pull/20)), device grant ([#19](https://github.com/Al-Ummah-Now/openauth/pull/19)), native clients ([#18](https://github.com/Al-Ummah-Now/openauth/pull/18)).

## Epics for this repo

9 epics name this repo. The full list, including epics owned by other repos, is in [Epics](../epics/README.md).

| Epic | Status |
|---|---|
| [Epic 9: Platform foundations for native clients (backend)](../epics/E09-native-platform-foundations.md) | in progress |
| [Legacy roadmap 1.3: SSO authentication service](../epics/LR-1.3-legacy-sso.md) | shipped |
| [Identity platform: SSO provider, Lanes 1–7](../epics/AUTH-IDP-identity-platform.md) | shipped |
| [OpenAuth fork: enterprise features](../epics/AUTH-ENTERPRISE-openauth-enterprise-features.md) | shipped |
| [OpenAuth enterprise admin APIs](../epics/OA-ADMIN-APIS-openauth-admin-apis.md) | in progress |
| [OpenAuth theme unification for the multi-tenant issuer](../epics/OA-THEME-openauth-theme-unification.md) | in progress |
| [Themes: Lantern, Zujaj, Nahas, Fawanees, and the theme builder](../epics/AUN-THEMES-themes.md) | in progress |
| [Security audit of the public repos](../epics/CHAT-SECURITY-public-repo-security.md) | shipped |
| [Single sign-on everywhere and sign-out ends SSO](../epics/CHAT-SSO-sso-everywhere.md) | shipped |
