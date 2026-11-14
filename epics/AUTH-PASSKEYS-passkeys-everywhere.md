[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Passkeys everywhere (sign in with a passkey on every site and app)

| | |
|---|---|
| **ID** | `AUTH-PASSKEYS` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) (issuer, profile, account hub, auth admin), [openauth](../repos/openauth.md) (fork: passkey provider, `amr`), [AlUmmahNow](../repos/AlUmmahNow.md) (admin-api, admin-web), [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md) (CMS admin), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **building**: build-ready spec v2 (2026-11-13). PK1–PK8 are **built to recommendation, owner may change** |
| **Last updated** | 2026-11-13 |

Read from AlUmmahNowAuth `origin/main` [`b7b0d53`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/tree/b7b0d53) and openauth `origin/master` [`2d74b49`](https://github.com/Al-Ummah-Now/openauth/tree/2d74b49) on 2026-11-13. Comes from [AUN-ADMIN-NATIVE](AUN-ADMIN-NATIVE-native-admin-app.md) decision AD6 and step-up decision AD5. Also closes [AlUmmahNowAuth#361](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/361).

## Why

Owner (AD6): **every user can sign in with a passkey everywhere**, on every site and native app. **Staff must use one.** Today a stolen password is enough to reach any account, including admin.

## What exists today

- **No passkeys or MFA.** The issuer has one provider, `password` (password sign-in; sign-up and reset by emailed code). Upstream openauth has an unmerged passkey PR (#270, listed in the fork's `docs/UPSTREAM_ANALYSIS.md`).
- **`auth_time`, `prompt=login` and `max_age` already work in the fork** (openauth#20, `enterprise/session-integration.ts`). Access tokens carry `auth_time` (seconds), kept across refreshes; silent single sign-on keeps the account session's original sign-in time; `prompt=login` and a `max_age` older than the session force a fresh sign-in. #361 still needs **`amr`**, consumers that check `auth_time`, and staff enforcement.
- **Every app signs in through the auth site.** Web apps redirect there. Native apps use the system browser sheet (ASWebAuthenticationSession on Apple, Custom Tabs on Android, the system browser on Desktop). So a passkey on the auth site works in every app without native passkey code: Safari uses iCloud Keychain, Chrome uses Google Password Manager, Windows uses Windows Hello, and any of them can use a phone or security key over QR.
- **Domains:** main sites on alummahnow.net, scholar sites and SaaS on .org, apps on .app. All sign-in happens on `auth.<env>alummahnow.net`.
- **Staff roles in Auth RBAC today** (role names in tokens): `Super Admin`, `Admin`, `Moderator`, `Writer`. AUN-ADMIN-NATIVE adds `Content Reviewer` and `Senior Reviewer` (VR7). `Scholar` and `Member` are not staff.

## Decisions (PK1–PK8): built to recommendation, owner may change

| # | Decision | Built as |
|---|---|---|
| PK1 | Ask users to add a passkey | After an interactive sign-in, at most once every 30 days, dismissible ("Not now"). Never on silent sign-on |
| PK2 | Remove the password once a passkey exists | Yes, optional, from the account hub; email code stays as recovery. **Not in the first build** (password stays); listed under Later |
| PK3 | Staff grace period | None for new staff. Staff who already had a staff role when enforcement was switched on get 7 days |
| PK4 | Staff recovery | Another admin sends a one-time passkey setup link from the auth admin; audited; email notice to the user |
| PK5 | Synced passkeys for staff | Allowed; device-bound security keys optional |
| PK6 | Passkeys per account | Up to 10 |
| PK7 | Upstream | Built in the fork; offer upstream later |
| PK8 | Order | Staff first (auth admin, admin-web/admin-api, CMS admin, native admin app), then everyone. Everyone can already add one from day one; only enforcement is staff-only |

## Design

### Relying party

- **RP id = the issuer's host without the leading `auth.`**: `alummahnow.net` (prod), `stage.alummahnow.net` (stage), `qa.alummahnow.net` (QA), `localhost` (local). Every subdomain of an environment shares one passkey; QA and stage passkeys never show up on production. Override with the `WEBAUTHN_RP_ID` var.
- **Allowed origins:** the issuer origin and the profile origin of the same environment (`https://auth.…`, `https://profile.auth.…`; `http://localhost:3301`/`3302` locally). Ceremonies run only on those pages.
- **RP name:** "Al Ummah Now" (QA/stage: "Al Ummah Now QA" / "Al Ummah Now Stage" so the passkey manager shows which one is which).
- **Options:** resident key **required** (discoverable), user verification **required**, attestation `none`, algorithms ES256 and RS256, timeout 5 minutes. Library: `@simplewebauthn/server` (WebCrypto; runs on Workers).

### Data model (Auth D1, migration `0038_webauthn_credentials`)

```sql
CREATE TABLE webauthn_credentials (
  id TEXT PRIMARY KEY,              -- credential id, base64url (unique)
  user_id TEXT NOT NULL,
  public_key TEXT NOT NULL,         -- COSE public key, base64url
  counter INTEGER NOT NULL DEFAULT 0,
  transports TEXT,                  -- JSON array ("internal","hybrid","usb",...)
  device_type TEXT NOT NULL,        -- "singleDevice" | "multiDevice" (synced)
  backed_up INTEGER NOT NULL DEFAULT 0,
  aaguid TEXT,
  name TEXT NOT NULL,               -- user-editable; default from the AAGUID or the browser
  created_at INTEGER NOT NULL,      -- epoch ms
  last_used_at INTEGER,
  deleted_at INTEGER                -- soft delete: Undo for 30 s in the hub, purged by the 30-day purge
);
CREATE UNIQUE INDEX idx_webauthn_credentials_id ON webauthn_credentials(id);
CREATE INDEX idx_webauthn_credentials_user ON webauthn_credentials(user_id);

CREATE TABLE webauthn_prompts (     -- PK1 "Not now"
  user_id TEXT PRIMARY KEY,
  dismissed_at INTEGER NOT NULL
);

CREATE TABLE passkey_setup_tickets ( -- PK4 recovery links
  token_hash TEXT PRIMARY KEY,      -- SHA-256 of the token in the link
  user_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,      -- 24 h
  used_at INTEGER
);
CREATE INDEX idx_passkey_setup_tickets_user ON passkey_setup_tickets(user_id);

CREATE TABLE auth_settings (        -- admin-managed settings
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,              -- JSON
  updated_at INTEGER NOT NULL,
  updated_by TEXT
);
```

**Every query is by key** (`id`, `user_id`, `token_hash`, `key`); there is no list-all query. The hub and admin list one user's passkeys by `user_id` (at most 10 rows). The enforcement summary counts staff without a passkey by walking the staff role assignments (`rbac_user_roles` by `role_id`, indexed) and checking each user by `user_id`, capped at 500. Full scans on Auth D1 block every sign-in.

Challenges are never stored in D1: a sign-in challenge lives in the flow's encrypted provider state (the same cookie the password provider uses), a registration challenge in a 5-minute HMAC-signed, single-use ticket bound to the user (KV `AUTH_STORAGE`, key `passkey:reg:<nonce>`).

### openauth fork

1. **`amr` in tokens.** Providers report how the user authenticated: `ctx.success(c, props, { amr })`. Defaults when a provider gives none: `password` → `["pwd"]`, `code` → `["otp"]`, OAuth/OIDC providers → `["fed"]`. The issuer keeps `amr` next to `authTime` on the authorization code, the refresh token and the account session, and writes it to access tokens as the top-level claim `amr`. Silent single sign-on reuses the account session's `amr` and `auth_time` (a silent hop never upgrades or refreshes them). Tokens issued before this change have no `amr`.
2. **`PasskeyProvider`** (`@al-ummah-now/openauth/provider/passkey`): an *embedded* provider (it never appears on the provider-select page and `/authorize` still goes straight to the password page). Routes under `/passkey`:
   - `POST /passkey/options` → authentication options (empty `allowCredentials`: discoverable) and stores the challenge in the flow's provider state.
   - `POST /passkey/verify` (form post, field `credential` = the JSON assertion) → verifies with the stored challenge, the RP id and the origins; looks the credential up through the app's `store`, checks and updates the counter, then `ctx.success(c, { userID, email, credentialId }, { amr: ["passkey"] })`. Failure re-renders the password sign-in page with "That passkey didn't work. Try again or use your password." (en/ar).
   - Config: `rpID(req)`, `origins(req)`, `store: { get(credentialId), touch(credentialId, counter) }`.
3. **Registration helpers** (`@al-ummah-now/openauth/passkey`): `registrationOptions(...)` and `verifyRegistration(...)` wrapping `@simplewebauthn/server`, plus `passkeyClientScript` (a small inline script, no external file) that does the browser side of both ceremonies with base64url conversion.
4. **Sign-in page** (`PasswordUI`, `passkey` option): a **"Sign in with a passkey"** button under the form and `autocomplete="username webauthn"` on the email field, so browsers offer saved passkeys in the email autofill (conditional UI). The button and autofill only appear when the browser supports WebAuthn (`PublicKeyCredential` and, for autofill, `isConditionalMediationAvailable()`). Starting the button cancels any pending autofill request first. All copy en/ar, RTL with the page.
5. **Code lifetime option** `ttl.code` (seconds, default 60).
6. **`onRefresh` may patch properties.** The app's refresh hook can return `properties` (merged into the token's properties), so `passkey_deadline` below follows the setting on the next refresh.

### Token claims (contract for every consumer)

| Claim | Where | Meaning |
|---|---|---|
| `amr` | top level, string array | How the user signed in: `pwd`, `otp`, `passkey`, `fed`. Silent sign-on keeps the original. Absent on tokens issued before the change (treat as no passkey) |
| `auth_time` | top level, epoch seconds | When the user last really signed in (exists today) |
| `properties.passkey_deadline` | in `properties`, epoch seconds | Present only for staff while staff enforcement is on. From that time on the user must have signed in with a passkey. A value in the future is the grace end (PK3) |

**Consumer rule (every staff surface):**

```
staffRole(token) && properties.passkey_deadline !== undefined && !amr.includes("passkey"):
    now >= passkey_deadline  → show the "Passkey needed" page (not an error), no staff access
    now <  passkey_deadline  → staff access, banner "Add a passkey by <date>"
step-up action:  auth_time > now - 900  (and amr includes "passkey" when the rule above applies)
    else 401 { error: "step_up_required", max_age: 900 } → the app reopens sign-in with prompt=login&max_age=900
```

The "Passkey needed" page (en/ar, Light/Dark, in-app) says why, and offers **Add a passkey** (→ `https://auth.<env>alummahnow.net/passkeys/setup?return_to=<this app>`) and **Sign in with a passkey** (→ the app's own sign-in with `prompt=login`). admin-api answers `403 { error: "passkey_required", setup_url }` so admin-web and the native admin apps can show the same page.

### Auth issuer (AlUmmahNowAuth)

- **Wiring:** `PasskeyProvider` next to `password`, store = `webauthn_credentials` by `id`. The success handler resolves the user by the credential's `user_id` (never by an email typed on the page) and refuses suspended/deleted accounts as today.
- **Staff policy** (`apps/auth/src/passkeys/policy.ts`): staff = any role whose name, lower-cased with spaces as `_`, is `super_admin`, `admin`, `moderator`, `writer`, `content_reviewer` or `senior_reviewer`. Setting `auth_settings['staff_passkeys']` = `{ enforced: boolean, enforcedAt: ms, graceDays: 7 }` (default off). `passkey_deadline` = `enforcedAt + 7 d` for staff whose staff role was assigned before `enforcedAt`, else `enforcedAt`. Computed at sign-in and on every refresh.
- **After sign-in card** (PK1): after an interactive sign-in (password or passkey provider, never `session`), if the user has no passkey and either is staff without a passkey or has not dismissed the card in 30 days, Auth answers with an interstitial page instead of the redirect: **"Sign in faster next time: add a passkey"**, buttons **Add a passkey** and **Not now** (staff: **Continue**, no 30-day snooze). Browsers without WebAuthn skip it automatically. Continuing goes to the app's redirect. The code is already issued, so the fork's authorization-code lifetime becomes configurable (`ttl.code`, default 60 s) and Auth sets 10 minutes, the RFC 6749 maximum and what silent sign-on already uses. A card left open longer only means the app restarts sign-in, which single sign-on completes silently.
- **Adding a passkey requires a recent, strong sign-in:** the account session must be under 15 minutes old. Staff adding their **first** passkey must also enter an emailed code (or use an admin's setup link); otherwise a stolen password could enrol the thief's passkey.
- **Every add or remove** writes an audit event (`passkey.added`, `passkey.removed`, `passkey.setup_link_sent`, `passkey.enforcement_changed`) and sends the user an email notice (en or ar, the account's language) with a link to the account hub.
- **Routes on the auth host** (same-origin, CSRF: `Origin` must be the issuer or profile origin; all JSON):

| Route | Who | What |
|---|---|---|
| `GET /passkeys/setup?return_to=&ticket=` | signed-in browser | The add-a-passkey page (also the "Passkey needed" target). Asks for an email code when required |
| `POST /passkeys/register/options` | signed-in, fresh | Registration options; refuses at 10 passkeys |
| `POST /passkeys/register/verify` | signed-in, fresh | Saves the credential |
| `POST /passkeys/email-code` / `POST /passkeys/email-code/verify` | signed-in staff | The extra code for a first staff passkey |
| `POST /passkeys/prompt/dismiss` | signed-in | "Not now" |
| `GET /account/passkeys`, `PATCH /account/passkeys/:id`, `DELETE /account/passkeys/:id`, `POST /account/passkeys/:id/restore` | profile app (bearer) | Hub list, rename, remove (soft) and Undo |
| `GET /admin/users/:id/passkeys`, `DELETE /admin/users/:id/passkeys/:cid`, `POST /admin/users/:id/passkeys/setup-link` | auth admin | Recovery (PK4) |
| `GET/PUT /admin/settings/staff-passkeys` | auth admin, Super Admin | Enforcement switch and the count of staff without a passkey |

### Account hub (profile app)

New **Passkeys** section on `profile.auth.…`: each passkey with its name, "Synced" or "This device only", created and last used dates. **Add a passkey** (runs the ceremony on the profile origin), **Rename** (inline), **Remove** (in-app accessible dialog; then an Undo toast for 30 s). Removing the **last passkey of a staff account is refused** with an explanation. Empty state explains passkeys in one sentence. en/ar, RTL, Light/Dark.

### Staff enforcement points

| Surface | Check | Where |
|---|---|---|
| Auth admin (`admin.auth.…`) | Consumer rule on its own session token; step-up (15 min) for role changes, deletes, setup links and the enforcement switch | AlUmmahNowAuth `apps/admin` |
| admin-api | Consumer rule on every staff request (`403 passkey_required`); `auth_time` within 900 s for high-risk actions (`401 step_up_required`) | AlUmmahNow `apps/admin-api` |
| admin-web | Shows the "Passkey needed" page for its token or a `passkey_required` answer; on `step_up_required` reopens sign-in with `prompt=login&max_age=900` and retries | AlUmmahNow `apps/admin-web` |
| CMS admin | Consumer rule when mapping the Auth token to a CMS staff session; "Passkey needed" page instead of the admin | AlUmmahNowCMS |
| Native admin apps | Same as admin-web, through admin-api's answers | Apple/Android/Desktop (when built) |

**High-risk admin-api actions (step-up):** suspending, unsuspending or deleting a user (moderation requests to Auth), permanent deletes, granting or removing staff roles, revealing a minor item and approving an escalated item (AUN-VIDEO-REVIEW).

### Recovery

- **Users:** sign in with password (or reset it by email code), then add a new passkey.
- **Staff (PK4):** an email code alone is not enough. Another admin opens the user in the auth admin → **Passkeys** → **Send setup link** (step-up required; never for your own account). The link is single use, lives 24 hours and lets that user add a passkey after signing in, without the extra email code. Audited; the user gets an email notice.
- **Owner break-glass:** `scripts/passkeys/setup-link.ts <email> --env <qa|stage|production>` mints the same link through `wrangler d1 execute` by key (owner's Cloudflare access only), so the owner is never locked out even if they are the only Super Admin.

### Rollout

1. Ship the code with enforcement **off** everywhere. Anyone can add a passkey; tokens carry `amr`; nothing is blocked.
2. **QA:** a Super Admin adds a passkey, then switches enforcement on in the auth admin (the switch refuses unless the admin switching it has a passkey). Check admin-web, CMS admin and auth admin with a staff account with and without a passkey.
3. **Production, staff:** the owner registers a passkey on `auth.alummahnow.net` from the account hub, then switches enforcement on. Existing staff get 7 days and a banner; new staff need one at once. **Waiting for the owner.**

   Before step 2 on QA/stage: E2E-created admins count as new staff and would be blocked at once ([AlUmmahNowAuth#367](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/367)). Enforcement stays off on QA and stage until that is decided.
4. **Everyone:** the after-sign-in card is on from step 1 (PK1); nothing is enforced for non-staff.

## Tests

- **Unit (openauth):** `amr` on code, refresh and silent sign-on; passkey options/verify with a fake authenticator; counter regression refused; embedded provider not on the select page.
- **Unit (Auth):** staff policy and deadlines, refresh patch, routes (fresh session, 10 limit, last staff passkey refused, setup ticket single use, CSRF origin), every D1 query by key.
- **E2E (local stack, Playwright Chromium with a CDP virtual authenticator `WebAuthn.addVirtualAuthenticator`):** add from the card, sign in with the button, sign in from autofill, rename/remove/undo in the hub, staff "Passkey needed" page and step-up. Every spec creates its own accounts and deletes them even on failure. No E2E against deployed QA on PRs; `sso-journey.spec.ts` stays green.
- **Release:** one stage spec (virtual authenticator). Native flows: manual smoke per release.

## Cost

Two to three D1 reads and one write per passkey sign-in, no external service. Under $1 a month at millions of sign-ins.

## Later

- PK2 (remove the password), native passkey APIs (ASAuthorizationController, Android Credential Manager, Windows WebAuthn) with associated-domain and asset-links files, and WebAuthn related origins (`/.well-known/webauthn`) for sites that sign in on their own host.

## Build status

| Piece | PR | State |
|---|---|---|
| Spec v2 | [Wiki#52](https://github.com/Al-Ummah-Now/AlUmmahNowWiki/pull/52) | merged |
| openauth: `amr`, embedded `PasskeyProvider`, sign-in button and autofill, `ttl.code` | [openauth#44](https://github.com/Al-Ummah-Now/openauth/pull/44) | merged, published 1.0.50 |
| openauth: one passkey ceremony per sign-in page (autofill/button race found by the E2E) | [openauth#45](https://github.com/Al-Ummah-Now/openauth/pull/45) | merged, published 1.0.51 |
| Auth: migration, issuer, card, setup page, hub, auth admin, staff policy, export/erase, break-glass script, E2E | [AlUmmahNowAuth#366](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/366) | merged, released to production |
| admin-api / admin-web: passkey gate, "Passkey needed" page, grace banner, step-up | [AlUmmahNow#1289](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1289) | merged; ships with the next AlUmmahNow release tag |
| CMS admin: staff passkeys at the CMS sign-in | [AlUmmahNowCMS#124](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/124) | merged |
| Fix: hub Passkeys card error on sessions from before 15-minute tokens, card spacing, accurate copy (device, password manager, phone, security key), card E2E | [AlUmmahNowAuth#370](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/370) | in review |
| Copy: admin passkey screens and help guide | [AlUmmahNow#1316](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1316) | in review |
| Copy: CMS passkey-needed page | [AlUmmahNowCMS#127](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/127) | in review |
| Enforcement on QA/stage | — | off; waits on [AlUmmahNowAuth#367](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/367) |
| Enforcement on production | — | off; **waiting for the owner** to register a passkey on `auth.alummahnow.net` (account hub → Passkeys → Add a passkey), then switch it on in the auth admin → Security |

**Owner break-glass:** `node --experimental-strip-types scripts/passkeys/setup-link.ts <email> --env <qa|stage|production>` (AlUmmahNowAuth) prints a single-use 24-hour setup link.
