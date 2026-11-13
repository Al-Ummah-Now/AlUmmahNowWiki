[← Home](../README.md)

# Bot protection

How Al Ummah Now keeps bots out of sign-up, sign-in, comments, posts, reports and Contact us, and
the Cloudflare settings the owner manages by hand. Added 2026-11-13 ("CAPTCHA and bot block").

Code and details live in the repos: AlUmmahNow `docs/features/bot-protection.md` and AlUmmahNowAuth
`docs/BOT_PROTECTION.md`. Pull requests: [Auth#358](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/358),
[#1248](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1248), [CMS#120](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/120).

## Three layers

1. **Cloudflare Turnstile** (free, no image puzzles). The widget runs in *managed* mode and is drawn
   *interaction-only*: almost every visitor sees nothing. Only when Cloudflare is unsure does a
   small box ask for one click. English or Arabic with the page.
2. **Rate limits in the Workers** (Cloudflare's Rate Limiting binding: counters at the edge, no
   database writes). Keyed by the signed-in account, else the visitor's IP.
3. **Scripted clients refused** on writes in production (curl, python-requests, Go-http-client,
   wget, Scrapy and the like). Browsers, our apps and search-engine crawlers are never refused;
   reading pages stays open to Googlebot, Bingbot and link previewers.

## Where each check runs

| Action | Turnstile | Rate limit |
| --- | --- | --- |
| Create an account | always | per IP and per email (Auth) |
| Forgot password / send or resend an email code | always | per IP and per email, 5 codes a minute per IP |
| Sign in | from the 3rd failed attempt for that email in 15 minutes | per IP, per email, 10 failures per 15 minutes |
| Contact us | always | per IP and per account (hourly and daily) |
| Report a video, comment, channel or live stream | always | 10 a minute |
| Comment or reply (videos and community posts) | an account's first one, then remembered for 180 days | 10 a minute |
| New community post | an account's first one, then remembered | 5 a minute |
| Likes, votes, subscriptions | no | 60 a minute |
| Start an upload | no (uploads are by invitation) | 10 a minute, plus the creator tier's limits |
| Search, search suggestions (videos and www) | no | 120 a minute |

Our native apps (Studio for iOS and Android) cannot show the widget, so their sign-ins skip
Turnstile on comments, posts and reports; the rate limits still apply.

## Modes and rollout

Each Worker has `TURNSTILE_MODE`: `off`, `monitor` (check and count, never refuse) or `enforce`.

| Environment | Mode | Keys |
| --- | --- | --- |
| QA and stage | `enforce` | Cloudflare's test keys: always pass, answered by our own code, so tests never call Cloudflare |
| Local stack, CI | `off` or test keys | the same |
| Production | `off` at merge → `monitor` → `enforce` | widget **al-ummah-now-production** (alummahnow.net, .org, .com, .app) |

The scripted-client refusal turns on in production together with `enforce`. If Cloudflare's
Turnstile service is down, requests are let through and counted; the rate limits still hold.

Tests are never blocked: QA and stage use the test keys; E2E helpers that call the API directly send
Cloudflare's documented test token. A signed test header (`X-AUN-Bot-Bypass`) exists for runs
against real keys outside production; production has no bypass.

## Abuse page

Videos admin → **Operations → Abuse** shows, for the last 24 hours or 7 days and per environment,
how many Turnstile checks passed, failed or had no token, how many requests were rate limited and
how many scripted clients were refused, per endpoint. The numbers are counters only (Cloudflare
Analytics Engine): no IP, email, account or token is stored. They refresh every 5 minutes and cost
no database reads.

## Privacy

Turnstile sends the visitor's IP and browser signals to Cloudflare, which issues a one-time token;
we pass the token and IP to Cloudflare to check it and keep neither. The "passed once" memory is the
account id only, for 180 days. Rate-limit counters live in Cloudflare's memory for a minute. The
GDPR inventory (AlUmmahNow `docs/compliance/GDPR.md`) lists all of this.

## Owner steps in the Cloudflare dashboard

All five zones are on the **Free** plan, and our API token cannot change zone settings, so these are
clicks for the owner. Do them in order; each says what it protects and what to check afterwards.

### 1. Bot Fight Mode: only on the zones without APIs

Bot Fight Mode on the Free plan cannot be switched off for single hostnames. On
**alummahnow.net** it would also challenge the APIs, the native apps and the release E2E runs
(QA and stage share that zone), so leave it **off** there. **alummahnow.link** serves link
previews to chat apps, so leave it off there too.

For **alummahnow.org**, **alummahnow.com** and **alummahnow.app**:

1. Cloudflare dashboard → choose the zone.
2. **Security** → **Bots**.
3. Turn **Bot Fight Mode** on.
4. Check: open a scholar site on alummahnow.org and `https://alummahnow.com` in a private window;
   both must load normally.

### 2. WAF managed rules: confirm they are on

For each of the five zones:

1. **Security** → **WAF** → **Managed rules**.
2. **Cloudflare Free Managed Ruleset** must show **Enabled** (it is on by default). If it is off,
   turn it on with the default action.

### 3. Block scanners before they reach a Worker (alummahnow.net)

Scanners probing for WordPress, PHP and leaked config files cost a Worker run each. One free custom
rule stops them at the edge:

1. Zone **alummahnow.net** → **Security** → **WAF** → **Custom rules** → **Create rule**.
2. Name: `Block probe paths`.
3. **Edit expression** and paste:
   ```
   (http.request.uri.path contains "/wp-") or (http.request.uri.path contains ".php") or (starts_with(http.request.uri.path, "/.env")) or (starts_with(http.request.uri.path, "/.git"))
   ```
4. Action: **Block**. **Deploy**.
5. Check: `https://videos.alummahnow.net/wp-login.php` answers 403; the videos site still loads.

### 4. One edge rate limit for sign-in posts (alummahnow.net)

The Free plan allows one rate-limiting rule. Use it for the production sign-in host, which takes the
most guessing:

1. Zone **alummahnow.net** → **Security** → **WAF** → **Rate limiting rules** → **Create rule**.
2. Name: `Auth form posts`.
3. **Edit expression**:
   ```
   (http.host eq "auth.alummahnow.net" and http.request.method eq "POST" and starts_with(http.request.uri.path, "/password/"))
   ```
4. Characteristics: **IP**. Requests: **30** per **10 seconds**. Action: **Block** for **10 seconds**.
5. **Deploy**. Check: signing in on the videos site still works.

### 5. Security level and Browser Integrity Check: leave the defaults

**Security** → **Settings**: keep the security level at its default (Medium) and **Browser
Integrity Check** on. Use **I'm Under Attack** only during an attack: it puts a challenge page in
front of every request, which breaks the APIs and the apps while it is on.

### 6. AI crawlers: your call

**Security** → **Bots** → **Block AI bots**. This is a content decision, not a security one: it stops
AI companies' crawlers from reading the public pages. Search engines are not affected.

### 7. Turnstile: nothing to click

The widget **al-ummah-now-production** was created through the API and its secret is in the
Secrets Store (`turnstile-secret`). **Turnstile** in the account dashboard shows its traffic and
solve rate. If scholar sites ever move to domains outside these five zones, add those hostnames to
the widget there.

## Turning it on in production

### Where each Worker is (2026-11-13)

| Worker | Production mode | Since |
| --- | --- | --- |
| Auth (sign-up, reset, repeated sign-in) | `monitor` | [Auth#359](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/359), released 2026-11-13 18:32 UTC |
| api-videos (comments, posts, reports), admin-api (Contact us) | `off` | [#1248](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1248); goes to `monitor` in a one-line PR after the first videos release that contains #1248 |

QA and stage run `enforce` with Cloudflare's test keys in every Worker.

### What decides `monitor` → `enforce`

Read on the Abuse page (Operations → Abuse, environment production, last 7 days), per endpoint:

| Signal | Meaning | Go for `enforce` when |
| --- | --- | --- |
| failed + no token ÷ all checks | how many visitors would be refused | at most 2% on normal days, and any spike is a burst (bots), not a steady share |
| no token alone | the widget did not run (blocked script, very old browser) | at most 1%; above that, find out why before refusing anyone |
| Turnstile unavailable | siteverify unreachable or our secret wrong | about 0; any steady count is a configuration fault to fix first |
| passed | real traffic | enough to judge: at least ~200 checks on the endpoint in the window |

Cross-checks: the Turnstile widget's own page in the Cloudflare dashboard (solve rate, how often the click box was shown); the admin Errors page and Contact us messages for "I can't sign up / comment"; sign-ups completed per day (they should not drop).

### Checklist before any `enforce` switch

- [ ] The Abuse-page numbers above hold for the endpoint being switched.
- [ ] **Native apps keep working.** They cannot show the widget; a token Auth signed for a registered native client is their pass (they sign up and sign in on Auth's web pages, which carry Turnstile). `NATIVE_CLIENT_IDS` on api-videos lists every native client of the environment: Viewer (iOS / Android), Viewer (TV), Viewer (desktop), Studio (iOS / Android), Studio (desktop) ([#1275](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1275); the test `native-clients.spec.ts` pins the lists).
- [ ] **Native User-Agents pass** the scripted-client refusal (production, `enforce`): Core `aun-core/…` with the app prefix, Apple URLSession (Studio TUS uploads), Android OkHttp and Dalvik (TUS), the Windows and Linux apps, or none. Pinned by the same test; a native client never ships a library default such as curl, python-requests, Go-http-client or `Java/…`.
- [ ] **A new native client** (the native admin app, AUN-ADMIN-NATIVE) is registered in Auth, added to `NATIVE_CLIENT_IDS` and the test, and sends a named User-Agent (`AlUmmahNow-Admin-<platform>/<version>`), before it ships.
- [ ] A Studio upload from iOS, Android and Windows on stage succeeds after the switch (TUS create, PATCH, finish).
- [ ] Stronger native proof (App Attest / Play Integrity, [#1274](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1274)) is not required for `enforce`; it replaces the signed-client exemption later.

### When

- **Auth:** read every day from 2026-11-14 for 7 days. If the table above holds on 2026-11-20, `enforce` for sign-up and password reset first, sign-in a day later. With too little traffic by then, extend the window rather than guess.
- **api-videos and admin-api:** 7 days after their `monitor` release, same rules: Contact us and reports first, then first comments and posts.
- Each switch is a one-line PR. Auth deploys on merge; the videos Workers with the next release. To undo, set `off` (or back to `monitor`) the same way.

`scripts/e2e/token-revocation.sh prod` signs up with curl; under `enforce` it stops at sign-up with a clear message (production has no bypass). Run it on QA, or while production Auth is in `monitor`.

## Known flake

The theme visibility CI job sometimes fails with "the page never hydrated" on a random theme spec (desktop or phone); a rerun of the same commit passes. It predates bot protection and is tracked in [#1196](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1196) with the evidence.
