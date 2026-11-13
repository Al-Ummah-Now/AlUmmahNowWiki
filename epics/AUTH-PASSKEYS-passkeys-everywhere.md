[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Passkeys everywhere (sign in with a passkey on every site and app)

| | |
|---|---|
| **ID** | `AUTH-PASSKEYS` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) (issuer, profile, account hub), [openauth](../repos/openauth.md) (fork: passkey provider), [AlUmmahNow](../repos/AlUmmahNow.md) (admin-api checks), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **planned**: draft v1 spec from owner decision AD6 (2026-11-13); open decisions PK1–PK8. Nothing is built |
| **Last updated** | 2026-11-13 |

Read from AlUmmahNowAuth `origin/main` and the openauth fork on 2026-11-13. Comes from [AUN-ADMIN-NATIVE](AUN-ADMIN-NATIVE-native-admin-app.md) decision AD6.

## Why

Owner (AD6): **every user can sign in with a passkey everywhere**, on every site and native app. **Staff must use one.** Today a stolen password is enough to reach any account, including admin.

## What exists today

- **No passkeys, MFA, `max_age` or `auth_time`** anywhere in AlUmmahNowAuth. Providers in the openauth fork: password, email code and social OAuth. Upstream openauth has an unmerged passkey PR (#270, listed in the fork's `docs/UPSTREAM_ANALYSIS.md`).
- **Every app signs in through the auth site.** Web apps redirect there. Native apps use the system browser sheet (ASWebAuthenticationSession on Apple, Custom Tabs on Android, the system browser on Desktop). So a passkey on the auth site works in every app without native passkey code: Safari uses iCloud Keychain, Chrome uses Google Password Manager, Windows uses Windows Hello, and any of them can use a phone or security key over QR.
- **Domains:** main sites on alummahnow.net, scholar sites and SaaS on .org, apps on .app. All sign-in happens on `auth.alummahnow.net`.

## Scope

1. **Passkey provider in the openauth fork.** WebAuthn registration and assertion with `@simplewebauthn/server` (runs on Workers' WebCrypto). Relying party id `alummahnow.net`, so every subdomain shares one passkey. Discoverable credentials and user verification required.
2. **Sign-in page.** "Sign in with a passkey" button plus browser autofill (conditional UI) on the email field. Password and email code stay for users who have no passkey.
3. **Add a passkey** after sign-in (an in-page prompt card, never a browser dialog), and in the account hub: list, rename, remove, last used, device type. Removing the last passkey of a staff account is refused.
4. **Storage.** New Auth D1 table `webauthn_credentials` (credential id, user id, public key, sign count, transports, backup state, name, created, last used), unique index on credential id and index on user id. Every query is by key, never a scan (full scans on Auth D1 block every sign-in).
5. **Tokens say how the user signed in.** Access and id tokens carry `amr` (`pwd`, `otp`, `passkey`, social) and `auth_time`. The issuer honours `prompt=login` and `max_age`.
6. **Staff must use a passkey.** A user with any staff role (`super_admin`, `admin`, `moderator`, `content_reviewer`, `senior_reviewer`) must sign in with a passkey. admin-web, admin-api, the CMS admin and the native admin apps reject a staff token whose `amr` lacks `passkey`, with a page that walks them through adding one. Granting a staff role to someone without a passkey sends them that setup link.
7. **Step-up** (AD5, 15 minutes). High-risk admin actions need `auth_time` within 15 minutes; the app reopens sign-in with `prompt=login&max_age=900`, which for staff is a passkey prompt.
8. **Other domains.** Sites that are not under alummahnow.net and sign in on their own host would need WebAuthn related origins (`/.well-known/webauthn` on alummahnow.net listing them). Not needed while every site uses `auth.alummahnow.net`.
9. **Recovery.** Users: email code, then add a new passkey. Staff: email code alone is not enough; another admin re-enables the account from the auth admin, and the event is audited and sends an email notice.
10. **Native polish (later).** Native passkey APIs (ASAuthorizationController, Android Credential Manager, Windows WebAuthn API) only if the browser sheet proves clumsy. They need associated-domain and asset-links files on alummahnow.net.

## Tests

Local stack with a virtual authenticator (Playwright/Chromium CDP `WebAuthn.addVirtualAuthenticator`) for register, sign in, autofill, remove and step-up. One release spec on stage. Native flows are manual smoke per release.

## Cost

Two to three D1 reads and one write per passkey sign-in, no external service. Under $1 a month at millions of sign-ins.

## Open decisions

| # | Decision | Recommendation |
|---|---|---|
| PK1 | Ask users to add a passkey | After sign-in, at most once every 30 days, and dismissible |
| PK2 | Can a user remove their password once they have a passkey | Yes, optional, with email code kept as recovery |
| PK3 | Staff grace period | None for new staff. Existing staff get 7 days, then sign-in requires a passkey |
| PK4 | Staff recovery | Another admin re-enables, audited, email notice to the user |
| PK5 | Synced passkeys (iCloud, Google) allowed for staff | Yes; device-bound security keys optional |
| PK6 | Passkey count per account | Up to 10 |
| PK7 | Upstream | Build in the fork, offer it upstream later |
| PK8 | Order | Staff first (admin, CMS admin, native admin app), then everyone |
