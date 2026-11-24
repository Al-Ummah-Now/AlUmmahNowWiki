[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 20: System parental controls

| | |
|---|---|
| **ID** | `E20` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md), [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md) |
| **Status** | **planned**. This spec replaces the Kids Mode spec ([O45](decisions.md#o45-no-in-app-kids-mode-support-the-systems-parental-controls)). All owner decisions are made (§11); the build starts when the rewrite passes review |
| **Last updated** | 2026-11-24 (store, platform, Google and YouTube docs read 2026-11-23) |
| **Depends on** | [Epic 23](E23-release-engineering.md) (store releases), [AUN-FEATURES](AUN-FEATURES-feature-switches.md), [AUTH-ACCOUNT-HUB](AUTH-ACCOUNT-HUB-account-hub.md) steps C1 and C3 (account events) |

## 1. Goal

A parent limits what their child does in Al Ummah Now with the **controls the device already has**: Screen Time on Apple devices, Family Link on Android, Family Safety on Windows, and website limits in a browser. This epic is what our apps must do so those controls work, plus the age rules of our own service, done **the way YouTube and Google do them**.

Owner, 2026-11-24: "parental controls are for the apps to allow parents use SYSTEM settings to limit their children access", and "THE EPIC IS TO build anything needed for apple parental control features if there is anything the app should do"; the same for Android. On the age: "date of birth in profile". On a rule YouTube doesn't have: "does youtube do that?". So this spec follows what YouTube and Google do and adds no cases of its own.

**Out of scope, by owner decision:** no in-app Kids Mode, PIN, time limits, curated kids catalog, child profiles or kids app. The earlier spec ([wiki #209](https://github.com/Al-Ummah-Now/AlUmmahNowWiki/pull/209)) and its PRs ([#1778](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1778), [#1780](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1780), [#1794](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1794), [#1801](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1801)) were closed without merging.

| Platform | Must do | Not needed |
|---|---|---|
| **Apple** | Truthful age rating answers; stop cleanly when Screen Time ends the app | FamilyControls, ManagedSettings, DeviceActivity, PermissionKit, Declared Age Range, SensitiveContentAnalysis, Kids category, anything for Ask to Buy while there are no purchases |
| **Android** | IARC rating, Target audience, the user-generated content duties; stop cleanly when Family Link suspends the app | Families program, Teacher Approved, neutral age screen, Restrict Minor Access, Play Age Signals |
| **Windows** | Microsoft Store IARC rating kept current | Any Family Safety or Windows age API code |
| **Web** | Nothing for the controls themselves; the parents' guide lists our domains | RTA label, `rating` meta tags |
| **Our service** | Date of birth in the profile (§5), age-restricted and made-for-kids videos (§5.4, §5.5) | Anything that guesses or verifies ages |

## 2. What exists today (2026-11-23, default branches)

| Area | Where | Today |
|---|---|---|
| Apple viewer (iPhone, iPad, Mac, Apple TV) | [AlUmmahNowApple](../repos/AlUmmahNowApple.md) `Apps/Viewer{IOS,Mac,TV}`, `Packages/AUNFeatures`, `Packages/AUNPlayer`; deployment targets iOS/tvOS 17, macOS 14 in `project.yml` | Guest only (`GuestAuthSession` in `Packages/AUNCoreBridge/Sources/AUNCoreBridge/Services.swift`). Plays public videos. No sign-in, comments, chat, posts, purchases or web views. App Privacy answer: Data Not Collected |
| Apple Studio | `Apps/Studio{IOS,Mac}`, `Packages/AUNStudio` | Sign-in through the system session (`Session/WebAuthenticator.swift`), uploads, comment moderation. Studio for Mac ships by Developer ID, outside the App Store |
| Apple store files | `store/apple/<app>/metadata`, `store/apple/app-privacy.{md,json}`, `scripts/check-store-metadata.py`, `docs/RELEASING.md` | The questionnaire is one line in the owner checklist ("age rating questionnaire", category Photo & Video). **No recorded answers** |
| Android viewer, Studio, Admin | [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md) `viewer-mobile`, `studio-mobile`, `admin-mobile`; minSdk 26, target 37 in `build-logic/convention/src/main/kotlin/AunAndroid.kt` | Viewer is guest only (`GuestOnlyAuthBridge` in `viewer-mobile/…/AppContainer.kt`). Background audio and Android Auto through `player/…/AunPlaybackService.kt` and `LibraryCallback.kt` |
| Android TV, Fire TV | `viewer-tv`, `feature-tv/…/ModuleInfo.kt` | A placeholder screen, no network features |
| Android store files | `*/src/main/play/listings`, `store/play/data-safety.{md,csv}`, `docs/RELEASE.md` | Content rating and Target audience are one line. **No recorded answers** |
| Windows, Linux, Samsung TV | [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) `src/AlUmmahNow.Windows` (WinUI 3), `src/AlUmmahNow.Linux` (GTK 4), `src/AlUmmahNow.Tizen`. There is no Uno app; the Mac apps are native Swift in AlUmmahNowApple | Viewer with optional sign-in; no comments. IARC answers are in `store/microsoft/privacy.md`. `Package.appxmanifest` asks only for `internetClient` and `runFullTrust` |
| Core | [AlUmmahNowCore](../repos/AlUmmahNowCore.md) `crates/aun-api` (generated), `aun-common`, `aun-ffi`, `aun-telemetry` | Already scrubs `birthdate` in logs (`crates/aun-telemetry/src/scrub.rs`). No age logic |
| Age at sign-up | `AlUmmahNowAuth/apps` | **No date of birth, no minimum age, no Terms acceptance.** No Terms of Service or privacy policy page is published ([legal work in progress](#9-legal-and-safety)) |
| Age-restricted flag | `packages/shared-types/src/upload-defaults.ts` and `apps/api-videos/src/lib/templates/validator.ts` have `ageRestricted` and `madeForKids` in **upload defaults only**; the plan in `docs/features/15-age-restriction.md` was never built | Not on the video record (`packages/shared-types/src/video.ts`), not enforced anywhere |
| Made for kids | YouTube import stores `importedFrom.madeForKids` and starts comments off (`apps/api-videos/src/lib/youtube-import/service.ts`, `yt_import_items.made_for_kids`) | No flag for our own uploads. [PL-D11](AUN-PLAYER-LINKS-in-video-links.md#16-owner-decisions) and E17 also want one |
| `islamic_kids` category | `apps/api-videos/migrations/search/0050_video_categories.sql`, native label lists | A subject label, nothing more |
| Reporting and blocking | `apps/api-videos/src/endpoints/moderation/reportCreate.ts`, `lib/channelComments/blocks.ts`; AI and human moderation ([Epic 28](E28-ai-moderation.md)) | On the server and the web. Not in any native viewer |
| Feature switches | `packages/shared-types/src/feature-registry.ts`, `apps/api-videos/src/middleware/require-feature.ts`, `apps/admin-api/src/lib/feature-preconditions.ts` | The pattern to use |
| Adult-only money features | `minSupporterAge`, `minCreatorAge` in `packages/shared-types/src/support.ts` | Self-confirmed 18+ at checkout; `appsEnabled` is off |

## 3. Apple

### 3.1 Age rating questionnaire (must do)

Ratings are 4+, 9+, 13+, 16+ and 18+. Every answer is per app record: Al Ummah Now (iOS), TV, Mac and Studio (iOS). The TestFlight-only Admin and QA records need answers only if they ever leave internal testing. Studio for Mac is not in the store, so it has none. Three recent changes matter:

- Since September 2026 the **social media** questions must be answered to submit anything. Apple's definition is "redistribution, amplification, or interaction with user-generated content through a social feed or similar discovery method", and its examples include views, likes, comments and shares. *Yes* means a 13+ minimum and the **Social Media Time Allowance**.
- Since 2026-11-16 there are **Shared Location** and **Dating and Relationships** questions; every app must answer by 2027-01-12. Ours are No and No.
- If our Terms set a higher minimum age than Apple's result, we must override the rating to match it.

Recommended answers (recorded in the repo by story [E20-A1](#10-stories-one-pr-each), checked in CI, and re-checked at each release):

| Question | Viewer iOS, Mac | Viewer TV | Studio iOS | Why |
|---|---|---|---|---|
| Parental controls (in-app) | No | No | No | We have none by design; the device has them |
| Age assurance | No | No | No | A date of birth people type themselves is not assurance |
| Unrestricted web access | No | No | No | No web view; sign-in is the system session |
| User-generated content | Yes | Yes | Yes | Videos come from creators (guideline 1.2.1 calls this creator content) |
| Social media | **Yes** | No while it only plays | No | [E20-D1](#11-owner-decisions). Answer Yes from the first release, so that adding likes and comments later doesn't change the rating, which the laws in §7 treat as a significant change |
| Social media disabled under 13 | **No** | – | – | Saying Yes also promises that "only age-appropriate UGC is delivered" to under-13s. That needs a curated catalog, which the owner ruled out |
| Messaging and chat | No until comments or chat ship in the app, then Yes (Apple counts public posting) | No | No | Does not raise the rating |
| Advertising, gambling, contests, loot boxes, location, dating | No | No | No | |
| Mature or suggestive themes, realistic violence, alcohol or drug references, medical information, horror or fear, profanity, weapons, health topics | Infrequent where creators' lectures and news can touch them (realistic violence, alcohol and drug references, mature themes, medical); none for the rest | Same | None (a creation tool) | Age-restricted videos (§5.4) are behind an 18+ account. Any one of realistic violence, alcohol references or medical information at "infrequent" already gives 13+ |
| Sexual content, graphic violence | None | None | None | Against the community guidelines |
| **Result** | **13+** | **13+** | **13+ by override**, to match the minimum account age | [E20-D1](#11-owner-decisions) |

Also fill the optional **Age Suitability URL** with the parents' guide (§6.3). Keep "For Kids" and "For Children" out of names, subtitles, keywords and screenshots (guideline 2.3.8 reserves them); the in-app `islamic_kids` label is fine. `scripts/check-store-metadata.py` gains that word check in English and Arabic.

### 3.2 Screen Time and Content & Privacy Restrictions

| Parent's control | How it acts on us | What we must do |
|---|---|---|
| **Apps rating** limit | Hides or blocks apps above the limit; a child asks for an exception | The truthful rating (§3.1) |
| **App Limits, Downtime, Always Allowed** | The system shields the app and can end it at any moment | Nothing to call. Playback pauses and the position survives (E20-A5). Never detect or work around a shield |
| **Time Allowances** (iOS, iPadOS, macOS 27) | Entertainment and Games follow the App Store category; Social Media follows the questionnaire | Secondary category **Entertainment**, so watching counts where a parent expects ([E20-D7](#11-owner-decisions)) |
| **Communication Limits** | Calls, Messages and contact-based apps | Nothing: no direct messages. If they ever ship ([LR-4.2](LR-4.2-legacy-messaging.md), deferred), that epic looks at PermissionKit |
| **Web content** limits | Can block `auth.alummahnow.net` inside the system sign-in sheet | Sign-in failure shows a plain message in the person's language; watching keeps working (E20-A5) |
| **Ask to Buy** | Downloads and In-App Purchases | Nothing: no In-App Purchases, and creator support in apps is off |

The same holds on Mac. Apple TV has the rating limit but no Downtime or App Limits. Studio for Mac is outside the store, so app limits work and rating limits don't.

## 4. Android

### 4.1 Play Console declarations (must do)

| Declaration | Recommended answer | Why |
|---|---|---|
| **Content rating (IARC)** | One questionnaire per app (viewer, TV, Studio), category Video or Entertainment for the viewer. Users interact: Yes for the viewer once comments ship; Studio Yes (uploads are published). Shares location: No. Purchases: No. Unrestricted internet: No. Themes: the same truthful "infrequent" answers as §3.1 | Family Link and Play filter on this rating. Expected: Teen / PEGI 12, confirmed by what IARC returns |
| **Target audience** | 13–15, 16–17, 18 and over. Not a child-directed app | Any group under 13 puts the **whole** app under the Families Policy, which user comments, chat and open uploads can't meet |
| "Could unintentionally appeal to children" | Answer truthfully; keep the store screenshots and icon free of cartoon kids' content | Play reviews the listing against the declaration |
| Families program, Teacher Approved, neutral age screen | Not used | They are for apps that target children or serve ads |
| **Restrict Minor Access** | Off | It is for adult-only apps |
| **User-generated content policy** | Before any writing feature ships in a native app: accept the Terms before the first post, report a video, comment and user in the app, block a user in the app | Policy, and Apple guideline 1.2 |
| Child Safety Standards | Required only for the Social and Dating categories; we use Video Players & Editors. Publish the child-safety standard page anyway (the CSAM process exists) | Costs nothing and covers a category change |
| Data safety | Gains Personal info → Other info (date of birth) with the first app that signs in | It is asked on our Auth page |

### 4.2 Family Link and the device's own parental controls

| Parent's control | How it acts on us | What we must do |
|---|---|---|
| Content filter by rating, app and purchase approval | Play hides or asks for apps above the limit | The truthful rating |
| App time limit, downtime, lock, app block, Android's own Settings → Parental controls | The system suspends the package | `AunPlaybackService` stops foreground playback, Android Auto and Cast control, saves the position, and resumes cleanly (E20-G3; test with `cmd package suspend`) |
| Website filter in Chrome | Can block the Custom Tabs sign-in | The same plain message as Apple |

Google TV kids profiles show only apps the parent chose, by rating: no code. Fire TV: answer Amazon's content questionnaire. The TV app is a placeholder today; nothing more is needed when its screens land.

## 5. Age rules of our service

The account's **date of birth is the only source of truth**, as at Google. No device signal is read: the owner wants one only where a law strictly requires it, which is nowhere for now ([E20-D4](#11-owner-decisions), [E20-D5](#11-owner-decisions); the counsel line is in §7).

### 5.1 What each age may do

| | Signed out, or no date of birth | 13–15 | 16–17 | 18+ |
|---|---|---|---|---|
| Watch public videos | Yes | Yes | Yes | Yes |
| Watch age-restricted videos | No | No | No | Yes, on every surface |
| Like, subscribe, save, history, notifications | Signed in | Yes | Yes | Yes |
| Comment, post | Asks for the date of birth first | Yes | Yes | Yes |
| Live chat | Asks first | No | Yes | Yes |
| Upload, create a channel | Asks first | Yes, if the creator tier allows | Same | Same |
| Give or receive money | Asks first | No | No | Yes |

The limits for 13–17 are the three the owner chose ([E20-D3](#11-owner-decisions)): no live chat under 16, no age-restricted videos, no money. Each is a number on the Age rules admin page, never in code; for money the stricter of that number and the support policy's `minSupporterAge` / `minCreatorAge` wins. Age sits in front of creator tiers: a tier can't lower it. What an age can't use is hidden ([Hidden when off](../guides/product-rules.md#hidden-when-off)).

**Under 13: guests** ([E20-D2](#11-owner-decisions)). They watch without an account, and nothing is stored about them: a signed-out viewer has no history, no id and no profile with us. Sign-in, comments, chat, posts and uploads need an account, and an account needs to be 13 or older (§5.3).

**How can an under-13 have a 13+ app?** A parent approved it (Ask to Buy, a Screen Time exception, Family Link), no content limit is set on the device, it is a shared device, or it was sideloaded. The device's own limits are the parent's tool in each case. We learn an age only from the date of birth, when someone who signed in wants to do more than watch; we never guess it.

### 5.2 Date of birth in the profile

It lives in **Auth**, on the Profile app, and nowhere else.

- **When:** required before the first comment, reply, post, live chat message, upload, channel, money action or age-restricted video. Optional otherwise; watching never needs it.
- **How:** one page, `profile.auth.*/birth-date?return=…` (English and Arabic; Gregorian date; Eastern Arabic digits accepted and shown in Arabic). Neutral: no default, no hint of the age needed, then "You entered 4 May 2001. Is that right?" for every date. Future dates and ages under 3 or over 120 are refused as typing mistakes. The web goes there and back; native apps open it in the system browser session, so **the date never passes through the Videos apps, Core or the Videos APIs**.
- **Stored:** Auth migration, next free number. A table of its own, so no user list, KV user record or webhook can carry it:

```sql
CREATE TABLE user_birth_dates (
  user_id        TEXT PRIMARY KEY,
  birth_date_enc TEXT NOT NULL,   -- AES-256-GCM (services/encryption.ts), key PROFILE_DATA_KEY
  key_id         TEXT NOT NULL,   -- which key, so it can rotate
  changed_at     INTEGER NOT NULL
);
```

- **Key cache:** `getMasterKey` in `services/encryption.ts` keeps one imported `CryptoKey` and ignores the key it is given. E20-P1 first keys that cache by key id and key material, with a test that two keys in one isolate never mix; only then does `PROFILE_DATA_KEY` use it. A missing key fails the request.
- **Shared: the band only.** One top-level claim in access tokens of our first-party clients, `age_band`: `13_15`, `16_17`, `18_plus`, or absent. Not a subject property (OpenAuth hashes those into the subject id). Computed at sign-in and at each refresh, so with 15-minute tokens a birthday reaches every app with no job and no scan. Never in `/userinfo`, ID tokens, webhooks, third-party clients or any API answer. Age counts from the UTC−12 date; 29 February counts on 1 March.
- **Who sees it:** the person sees their date on the Profile page. Our apps and APIs see the band inside the verified token and store it nowhere. Nobody else sees either: not other users, creators, analytics, email, recommendations, logs or error reports. Staff see neither, except that a correction (below) shows old and new band.
- **Changing it** ([E20-D11](#11-owner-decisions)): the person can correct it only within the same band or to a younger one. **They can't make themselves older**; the page says to contact us. Staff correct it in the Auth admin, only when someone asks, with a reason, audited. No documents are asked for or accepted.
- **Export and erasure:** `GET /account/export` includes the date. `DELETE /account`, the admin purge and the run-account teardown delete the row (`deletions/kinds.ts`). Scrubbers drop `birth_date`, `dob`, `age_band`.
- **API (Auth):** `GET` and `PUT /account/birth-date`, the person's own token only; `PUT` needs the Profile app's CSRF and origin checks and a sign-in under 10 minutes old (`requireRecentSignIn`, 600 s), for a first entry as for a change, and is rate-limited. Audit events carry no date and no band.
- **Step-up:** the gated action usually comes long after sign-in, so the birth-date page checks first. When `auth_time` is older than 10 minutes it sends the person through `/login?prompt=login&return=<this page>` (as the passkey pages do) **before** showing the question, and comes back to it with the original `return` kept; `PUT` answering `insufficient_user_authentication` does the same without losing what was typed. Native: the same inside the system browser session, then a token refresh so the new band arrives. `return` accepts only registered app addresses.

**Reading the claim.** The verifiers drop top-level claims today: `client.verify` returns only the subject, and `decodeVerifiedClaims` (`apps/api-videos/src/lib/token-revocation.ts`) keeps `iat`, `exp`, `auth_time` and `sid`. E20-B4 adds `age_band` to `decodeVerifiedClaims`, accepting only the three known values (anything else is absent), and `validateJWTWithSignature` in `apps/api-videos/src/middleware/auth.ts` copies it to `AuthPayload.ageBand` from the token whose signature it has just verified. admin-api and the realtime server don't need it. Tests: a band in an unverified or wrong-issuer token never reaches `AuthPayload`.

**Enforcement in Videos.** Middleware `requireMinimumAge(key)` on comment, post, live chat, upload and channel creation, money, and age-restricted playback, from `AuthPayload.ageBand`: **no database read for the person**. No band: `403 age_required` with `action: "birth_date"`. Below the minimum: `403 age_minimum`. Both in `API_ERROR_CATALOGUE`, English and Arabic. If the switch or the numbers can't be read: `503 service_unavailable`. A route table test fails when a new route of those kinds lacks it. Staff actions are not gated.

**`GET /api/me/features`** gets one new top-level field beside `features`: `needsBirthDate: boolean` (in `UserFeaturesResponse`; `USER_FEATURES_VERSION` stays 1, an absent field reads as false). It is not a feature key, because unreadable features all become `false` and that must not look like "no birth date needed"; the 403 is what decides. `liveChat`, `upload`, `createChannel`, `support` and `supportReceive` are left out for a band that may not use them. Comments and posts have no feature key and need none: every account that can exist may use them, and without a date the composer follows `needsBirthDate`.

**Switches** (Features page, all default **off**, server-enforced, `404 feature_off`): `ageRules`, for the whole set of age rules (the gated actions, age-restricted videos and made-for-kids videos), and `parentsGuide`. `ageRules` is refused in every environment until E20-B2, then turns on only when three checks in `feature-preconditions.ts` pass, each failing closed with its own reason: (1) **Auth's birth date is on**: admin-api reads the issuer's public discovery document (`env.Issuer`, 3-second timeout; Auth caches that document for 5 minutes in `well-known-cache.ts` and drops it when the setting changes), where Auth lists `age_band` in `claims_supported` only while its `birth_date` setting is on; no binding, no new secret, and Auth still knows no app; (2) the numbers are saved; (3) **account events work**: the Videos receiver recorded a valid event, at least the daily `verification` one, in the last 48 hours. The numbers: one row, `age_rules (id = 1, json, version, updated_by, updated_at)` in `SEARCH_DB` next to `feature_switches`, read through the same 30-second cache (`SWITCHES_TTL_MS`), edited on videos admin → **Age rules**, audited and conflict-checked. The numbers are the three limits of [E20-D3](#11-owner-decisions): live chat, age-restricted videos and money. Each is 13, 16 or 18, because Videos knows only the band. Comments, posts, uploads and channels need the account minimum, 13, which is Auth's own and isn't set here.

### 5.3 A date of birth under 13

As at Google, with one difference by decision: Google leaves the account usable for 14 days and then disables it; **we disable at once** ([E20-D10](#11-owner-decisions)).

1. After "Is that right? Yes" the date is **not saved**. The account's status becomes `age_disabled`; all sessions are revoked; its channels, videos, comments, posts and messages are hidden; push, email, scheduled posts and payouts stop. **From then on the account can't get a token of any kind**: `accountStateOf` refuses it at sign-in, code exchange, device grant and refresh, as it refuses a suspended one.
2. Signing in shows one page instead of a token: the account is disabled because of the age entered; download your data; if the date was wrong, a parent or the account holder can ask us to correct it; the account and everything in it will be deleted on *date*. The same text goes out once by email.
3. **Getting the data, with no token.** The page is shown only after a full sign-in there and then (password, code or passkey; never `prompt=none` or an existing session). Auth then sets one encrypted, HttpOnly, `SameSite=Strict` cookie, 10 minutes, scoped to `/account/age-disabled`, with its own audience, that no other route reads. With it the page offers **Download** (the Auth export, served by Auth) and **Send me everything**, below. **No restricted token exists, so no service has to recognize one.**
   - Auth emits `account-export-requested` with a random export id and the subject, nothing else. At most one a day.
   - Videos builds the export in a **new queued job** around `collectUserData` (resumable; today it runs only inside `GET /api/privacy/export`) and uploads it to Auth, `PUT /internal/account-exports/<export id>/<part>`, with its own machine client and the scope `account-exports:write` (as `tokens:revoke` works today). `<part>` is the `exportPart` in that client's own metadata (`oauth_clients.metadata`), and any other value is refused: Auth names no app. Auth accepts it only for an export it asked that client for, once, and keeps it in a **private R2 bucket of Auth's**, deleted after 8 days. So Auth still calls no app, and **Videos never handles an email address**: `profiles.email` is not trusted for anything here.
   - When the parts asked for have arrived (or after 24 hours, saying what is missing), **Auth sends the email itself**, to the account's verified Auth address, through its own mail path, in one language.
   - The link opens an Auth page. It carries a 256-bit random value; Auth stores only its SHA-256, in `account_exports (id PRIMARY KEY, user_id, created_at, token_hash UNIQUE, expires_at, consumed_at)`: the row is made when the export is asked for, and `token_hash` and `expires_at` stay null until the link is minted with the email. The parts that arrived are in `account_export_parts (export_id, part, client_id, r2_key, received_at, PRIMARY KEY (export_id, part))`. Valid **7 days** from minting. `GET` and `HEAD` show a plain "Download your data" page and change nothing, so mail scanners and prefetch can't spend it, and it says nothing about whose data it is. The button is a `POST` with an origin check; one `UPDATE … SET consumed_at WHERE token_hash = ? AND consumed_at IS NULL AND expires_at > ?` spends it, and only the request that changed the row streams the files (`no-store`, `Referrer-Policy: no-referrer`). Unknown, expired and spent links get the same 404 page in the same time, from the `GET` too; the route is rate-limited. Lifting or purging the account deletes its exports and links.
4. **30 days** later it is deleted for good, in Auth and in every app: Google's documented window after disabling, and our own 30-day purge. Records the law requires us to keep stay.
5. A correction: staff lift it in the Auth admin with a reason, audited. The date is asked again at the next gated action.
6. Staff accounts are not disabled automatically; a super admin looks.

In Auth (E20-P4): `AccountState` gains `age_disabled`, returned by `accountStateOf` for that status and refused by `isRefusedAccountState`, so `auth-handlers.ts` shows this page and not the suspended one, and an admin's unsuspend can't clear it. Disabling adds an `admin_deletions` row (kind `user`, `deleted_by = 'age'`, the previous status in its snapshot) so `purge.ts` deletes it when due; the `user` handler in `deletions/kinds.ts` accepts an `age_disabled` account without `deleted_at`, its restore puts the snapshot's status back, and Recently deleted shows it as "Disabled for age", apart from deleted ones (`'age'` joins `NOT_A_USER` in `deletions/service.ts`). The account's own `DELETE /account` is not reachable, because there is no token; the page offers **Delete now** instead.

Auth calls no app ([design rule](../guides/authentication.md#design-rule-auth-depends-on-no-app)), so hiding, restoring, exporting and deleting reach Videos as account events (`account-disabled` with the reason `age` or, when any account is deleted and can still be restored, `deleted`; `account-enabled`; `account-export-requested`; `account-purged` only when Auth really purges the account): steps **C1** (built, off) **and C3** (not built yet) of the [account hub](AUTH-ACCOUNT-HUB-account-hub.md) ([Auth#507](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/507)). `ageRules` can't be turned on before they exist.

### 5.4 Age-restricted videos

As at YouTube: "not viewable to users who are under 18 years of age or signed out", and not on most third-party sites. They need a signed-in **18+** account **on every surface**: web, iPhone, iPad, Mac, Android, Windows. Where there is no sign-in (Apple TV, Android TV, Samsung TV and the guest viewers today) they don't play. Embeds don't play them; they link to the watch page ([Epic 25](E25-sharing-embeds.md)).

- `ageRestricted` on the video record. Set by the creator in Studio, or by staff, who can lock it; AI moderation may suggest it, never set it. Creators can appeal a staff setting. Studio has a filter for it.
- **Reads answer 200 with the media taken out.** `GET /api/videos/:id`, `/api/v1` video, playlist, channel and search answers give title, thumbnail, description and `ageRestricted: true` to everyone, and without an `18_plus` band every media, caption and download field is removed (`withPlayback` in `videoFetch.ts` and `playlistFetch.ts` is skipped). An answer that does carry them is `private, no-store`. **Anything that would play or hand out the video answers 403** `age_required` or `age_minimum`: play and playback addresses, captions, Listen audio, downloads, embeds' playback. Media is served by the signed path private videos use, so a public address can't be shared.
- Watch page without access: "Sign in to confirm your age" (or the birth-date step, or "not available for your age"), in one screen, web and native. With access: an 18+ mark below the description.
- Not featured, not on Home or Explore, and never on surfaces outside the app (Top Shelf, Spotlight, widgets, Now Playing for others, notifications, share cards show the title card only). Listen mode and downloads follow the same rule ([E14](E14-offline-listen.md)).
- This is also what Apple 1.2.1(a) and Microsoft 11.11.3 ask: content above the app's rating is identified and limited by a declared age.

### 5.5 Made-for-kids videos

As at YouTube. `madeForKids` on the video record: the creator at upload and in Studio, staff, or YouTube import (today only `importedFrom.madeForKids`, read as a fallback). While set: **comments and live chat off** (the creator can't turn them on), no notifications about it, no player links or cards ([PL-D11](AUN-PLAYER-LINKS-in-video-links.md#16-owner-decisions)), and **no personalization**: watching it isn't added to history, recommendations or interests, and what is suggested beside it doesn't depend on the viewer. Views are still counted. It unlocks nothing and is not a catalog. `islamic_kids` stays a subject label.

Setting either flag needs `ageRules` on: off is `404 feature_off`, unreadable `503`. `ageRestricted` can't be set at all before E20-B4 enforces it on every read path: `404 feature_off` even with the switch on. A video can't have both (`400 content_flags_conflict`), and only staff undo a restriction staff set (`403 age_restricted_locked`). For a video already made for kids, unreadable switches keep the rules on: they only take things away. The search index carries each flag in a video's payload; E20-B4 adds the columns (`age_restricted`, `made_for_kids`, `NOT NULL DEFAULT 0`) that Home and Explore filter on in existing indexed queries, never a scan. No backfill: unset is false. No system control reads either one: Screen Time, Family Link and Family Safety act on the *app's* rating.

## 6. Windows and web

- **Windows:** IARC in Partner Center, kept current (policy 11.11; answers in `store/microsoft/privacy.md`, which change when comments ship); Terms, reporting and respect for parental settings for user content (11.12). Family Safety limits, blocking and the age filter work with no code; the filter covers Store apps, so for direct downloads a parent uses app limits. Samsung TV: the Seller Office age question. Linux: nothing.
- **Web:** RTA and `<meta name="rating">` declare a page adult and drop it under SafeSearch; ours are not. Website limits work per domain with no code.
- **Parents' guide:** a public, bilingual frosted-glass page at `/help/parents` (`parentsGuide` switch): our rating and why, how to limit the app on each device with the system's own settings, our domains (`alummahnow.net` and its subdomains, `alummahnow.link`, plus any other [domain in use](../guides/environments.md)), how to report something. No claim that the app is for children. The App Store Age Suitability URL points here.

## 7. Laws: counsel items

Nothing here is designed around a state law, by owner decision. Counsel answers these before a store release; the release checklist (E20-R) carries them.

| Law | Date | The question |
|---|---|---|
| COPPA (16 CFR 312) | In force | An under-13 date the person types is actual knowledge. Is disabling at once and deleting after 30 days acceptable, and may we send the one email (§5.3)? |
| Texas SB 2420 | In force, appeal pending | Counsel item only ([E20-D5](#11-owner-decisions)) |
| California AB 1043 and AB 1856 | 2027-01-01 | As we read it, it requires an app to ask for the system's age signal when it is downloaded and launched. We read none. Is that needed before a release there? |
| Alabama HB 161 | 2027-01-01 | The same question |
| Utah SB 142 / HB 498, Louisiana Act 185 | 2027-05-06, 2027-07-01 | The same question |
| Minimum age 13 (EU 13–16; Google uses per-country ages), Australia under 16, UK and EU duties, Brazil | In force or phasing in | Which storefronts need more than 13 and a date of birth? |

If counsel says a signal is required somewhere, it is one story per platform (Declared Age Range, Play Age Signals, Windows age API), added then.

## 8. Every platform at a glance

| Platform | Work |
|---|---|
| Auth and Profile | Date of birth page, claim, correction by staff, disabled accounts |
| Web | Birth-date and sign-in steps, hidden features per band, flags in Studio and upload, age screen, parents' guide |
| Videos admin | Two switches (`ageRules`, `parentsGuide`), Age rules page, staff flag and lock on a video with a reason and Undo |
| Apple, Android, Windows | Store answers; stop cleanly when the system ends the app; open the birth-date page in the system browser; the age screen; hidden features per band. Privacy answers gain the date of birth with the first app that signs in |
| TV | Age-restricted videos show as not playable here |
| Core | Band from the token, error codes, scrubber keys |

## 9. Legal and safety

- Minimum data: one date of birth, encrypted, in Auth, seen by its owner only; everyone else gets a band. No documents, face checks or estimates, ever.
- Terms of Service, a privacy policy and the child-safety standard page must be public before the first store release. They are with counsel and the CMS.
- Native comments, chat and posts each need in-app report and block in the same release ([Epic 12](E12-viewer-mobile.md), [Epic 17](E17-live-in-apps.md)).

## 10. Stories (one PR each)

| Story | What | Repo | Visual | Needs |
|---|---|---|---|---|
| **E20-A1** | `store/apple/age-rating.{md,json}`: every answer per record with its source file; secondary category Entertainment; CI check (complete, sources exist, reserved words absent in both languages); RELEASING and the [store checklist](../guides/store-release-checklist.md) | Apple | – | – |
| **E20-G1** | `store/play/content-rating.{md,json}` with the same check in `checkStoreListings` | Android | – | – |
| **E20-W1** | `store/microsoft/age-rating.md`, privacy and Samsung answers, test in `StoreListingTests` | Desktop | – | – |
| **E20-P1** | Auth: the encryption key cache keyed by key id, `user_birth_dates`, `PROFILE_DATA_KEY`, API, `birth_date` setting (off), export, erase, audit, scrubber | AlUmmahNowAuth | – | – |
| **E20-P2** | Auth: `age_band` claim at sign-in and refresh for first-party clients, `claims_supported` in discovery; the openauth fork change if a top-level claim needs one | AlUmmahNowAuth, openauth | – | P1 |
| **E20-P3** | Profile: the birth-date page with step-up, and settings row; staff correction in the Auth admin | AlUmmahNowAuth | yes | P1 |
| **E20-P4** | Under 13: `age_disabled` in `accountStateOf`, the disabled page with its cookie and Delete now, `purge.ts` and Recently deleted, lift | AlUmmahNowAuth | yes | P3, account hub C1 ([Auth#507](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/507)) |
| **E20-P5** | Account exports in Auth: `account_exports`, private bucket, upload endpoint and scope, email, one-time download page | AlUmmahNowAuth | yes | P4 |
| **E20-B1** | `ageRestricted` and `madeForKids` on the video: record, index payload, API on upload and edit, import fallback; made-for-kids rules; the `ageRules` switch, not yet possible to turn on | AlUmmahNow | – | – |
| **E20-B2** | The three checks that let `ageRules` turn on, `age_rules` row, Age rules page, OpenAPI | AlUmmahNow | yes | – |
| **E20-B3** | Core: band, error codes, scrubber keys, UniFFI; release candidate | Core | – | P2 |
| **E20-B4** | The claim in `decodeVerifiedClaims` and `AuthPayload`; `requireMinimumAge`, route table test, `needsBirthDate`, age-restricted media only with `18_plus`, embeds, index columns and Home/Explore filters | AlUmmahNow | – | P2, B1, B2 |
| **E20-B5** | Web: birth-date and sign-in steps, age screen, hidden features, Studio, upload (with upload defaults applied) and admin flags | AlUmmahNow | yes | P3, B4 |
| **E20-B6** | Account events in Videos: hide, restore, erase, the queued export job that uploads to Auth, last verified event | AlUmmahNow | – | P5, account hub C3 ([Auth#507](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/507)) |
| **E20-A5** | Apple: shield mid-playback, blocked sign-in domain | Apple | yes | – |
| **E20-A6** | Apple: birth-date page, age screen, hidden features; App Privacy | Apple | yes | B3, viewer sign-in |
| **E20-G3** | Android: suspension and resume in playback, Auto and Cast | Android | – | – |
| **E20-G5** | Android: as A6; Data safety | Android | yes | B3, viewer sign-in |
| **E20-W2** | Desktop: as A6; privacy answers | Desktop | yes | B3 |
| **E20-S1** | Parents' guide and Age Suitability URL | AlUmmahNow | yes | – |
| **E20-R** | Release checklist per store ([E20-D9](#11-owner-decisions)): answers current, age-restricted rule on, date of birth rules on for apps that sign in, report and block in the app, Terms and privacy public, counsel answers (§7) | Wiki | – | – |

Order: A1, G1, W1, B1, A5, G3 and S1 need nothing else; then P1, P2, P3 with B2; then B3, B4, P4, P5, B6; then B5, A6, G5, W2. Apple before Android before Windows.

## 11. Owner decisions

D1 to D5 are the owner's answers. On 2026-11-24 the owner asked to follow what YouTube and Google do and to stop inventing cases; D6 to D11 were then settled on that rule by the orchestrator, with nothing left to ask.

| ID | Question | Decision |
|---|---|---|
| **E20-D1** | Minimum age and store rating | **Owner:** 13+ everywhere, Play target audience 13 and over, social media answered Yes |
| **E20-D2** | Under 13 | **Owner:** they watch as guests; sign-in, comments, chat, posts and uploads are hidden, and nothing is stored about them |
| **E20-D3** | Ages 13–17 | **Owner:** as adults, with three limits: no live chat under 16, no age-restricted videos, no money. All three editable in admin |
| **E20-D4** | Where the age comes from | **Owner:** "date of birth in profile". The account's date of birth is the single source of truth; device signals only where a law strictly requires one, so nowhere for now |
| **E20-D5** | Unresolved store signal in Texas | **Owner:** "i dont care about texas". No Texas-specific handling; a counsel item only |
| **E20-D6** | A device signal against an older date of birth | **Moot.** The owner: "does youtube do that?". No device or sign-in limits, no signal memory |
| **E20-D7** | App Store secondary category | Entertainment |
| **E20-D8** | Age-restricted and made-for-kids videos | As YouTube: age-restricted needs a signed-in 18+ account on every surface, apps included; made-for-kids has comments and chat off and no personalization |
| **E20-D9** | Public store release | No public release in a store until its must-do items are done. A release checklist (E20-R), not a gate built around state laws |
| **E20-D10** | A date of birth under 13 | As Google: the account is disabled, with time to have the date corrected or download the data, then deleted. Disabled at once; deleted after 30 days, Google's documented window after disabling |
| **E20-D11** | Changing your own date of birth | As Google: nobody can make themselves an adult. Only staff correct it, on request. (Moving up from 13–15 to 16–17 is the same: staff only) |

## 12. Tests

Every test seeds and deletes its own data; no paid services; stores and systems are faked in CI.

- **Auth and Profile:** the date is ciphertext in D1 and in no list, KV record, webhook, `/userinfo`, ID token, third-party token, audit row or log; export has it, all three deletions remove it; only its owner reads it. Claim at each boundary (13, 16, 18, 29 February, UTC−12), at sign-in and refresh. An older band is refused to the person and works for staff with an audited reason; same or younger works. Two encryption keys in one isolate never mix. Step-up: an old sign-in goes through `prompt=login` and back with `return` kept, web and native; a foreign `return` is refused. Under 13: date not saved; every grant (password, code, passkey, native passkey, device, code exchange, refresh, `prompt=none`) refused; unsuspend doesn't clear it; the cookie only after a full sign-in, refused by every other route, expired after 10 minutes; Auth export; exports: the email goes to the verified Auth address whatever `profiles.email` says, and to accounts with no Videos profile; an upload for an unknown, finished or another client's export, or without the scope, is refused; `GET` and `HEAD` never spend a link, two parallel `POST`s give one download, a foreign origin none; unknown, expired and spent answer alike; only the hash is stored; bucket and links gone after 8 days, on lift and on purge; Delete now; day 30 purge in Auth and Videos; lift restores the previous status; staff exception. Playwright on the local stack in English and Arabic, light and dark, phone and desktop, axe clean, Eastern Arabic digits.
- **Videos:** each gated key with every band, no claim, forged and expired tokens, unreadable numbers (503), switch off (404); no band in any answer, log or error sample. Age-restricted, for signed-out, 13–17 and no-date people: 200 without media fields on video, playlist, channel and search reads (web and `/api/v1`), 403 on play, captions, Listen, downloads and embed playback; with 18+ it plays and the answer is `private, no-store`; `ageRules` refused with Auth off, discovery unreachable, or no verified event in 48 hours; staff lock and appeal. Made for kids: comments, chat and notifications refused, not in history or recommendations, views counted. Query plans use an index.
- **Core:** band and error codes through Swift, Kotlin and C#.
- **Apple:** UI tests in English and Arabic on iPhone, iPad, Mac and TV: shield mid-video keeps the position, blocked sign-in message, age screen, birth-date round trip with a fake session. Before release, a real child account: rating limit, Ask to Buy for a free download, App Limit, Downtime, Time Allowance.
- **Android:** package suspended during playback, background audio and Auto; the same screens. A real Family Link child: rating filter, approval, app limit, block.
- **Windows:** launch and screens; a real child Microsoft account in Family Safety: limit, block, age filter.

## 13. Costs

| Item | Cost |
|---|---|
| Date of birth | 1 indexed read and one decryption per token refresh. At 1 million signed-in people a month and 20 refreshes each: 20 million row reads, about $0.02 on D1 |
| Checks in Videos | 0 reads per person: the band is in the token |
| Flags | 2 columns, no new query, 0 per view. Age-restricted playback uses the signed path, as private videos do |

## 14. Sources

Read 2026-11-23.

- **Google and YouTube:** [age requirements](https://support.google.com/accounts/answer/1350409), [update your account to meet age requirements](https://support.google.com/accounts/answer/1333913) (14 days, then disabled, deleted after 30), [birthday](https://support.google.com/accounts/answer/27442), [age-restricted content](https://support.google.com/youtube/answer/2802167), [watching age-restricted videos](https://support.google.com/youtube/answer/10070779), [made for kids](https://support.google.com/youtube/answer/9527654)
- **Apple:** [age rating values](https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions/), [set an app age rating](https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating/), [social media questions](https://developer.apple.com/news/?id=tlur8uvi), [Time Allowances](https://developer.apple.com/news/?id=0d2gpmml), [November 2026 descriptors](https://developer.apple.com/news/?id=yxkh08us), [age-appropriate experiences](https://developer.apple.com/kids/), [App Review Guidelines 1.2, 1.3, 2.3.6, 2.3.8](https://developer.apple.com/app-store/review/guidelines/)
- **Play, Microsoft, web:** [content ratings](https://support.google.com/googleplay/android-developer/answer/9859655), [target audience](https://support.google.com/googleplay/android-developer/answer/9867159), [Families policies](https://support.google.com/googleplay/android-developer/answer/9893335), [user-generated content](https://support.google.com/googleplay/android-developer/answer/9876937), [child safety standards](https://support.google.com/googleplay/android-developer/answer/14747720), [Family Link time limits](https://support.google.com/families/answer/7103340), [Google TV parental controls](https://support.google.com/googletv/answer/10070481), [Microsoft Store policies 11.11, 11.12](https://learn.microsoft.com/en-us/windows/apps/publish/store-policies), [Family Safety filters](https://support.microsoft.com/en-us/account-billing/filter-inappropriate-apps-and-games-da38c83a-0717-31ea-b6f2-6cdd95639189), [rating tags](https://developers.google.com/search/docs/specialty/explicit/guidelines)
- **Law:** [Texas SB 2420](https://capitol.texas.gov/tlodocs/89R/billtext/html/SB02420F.htm), [Utah HB 498](https://le.utah.gov/Session/2026/bills/enrolled/HB0498.pdf), [Louisiana Act 185 digest](https://www.legis.la.gov/legis/ViewDocument.aspx?d=1486866), [Alabama HB 161](https://alison.legislature.state.al.us/files/pdf/SearchableInstruments/2026RS/HB161-enr.pdf), [California, secondary summary](https://didit.me/blog/california-digital-age-assurance-act-2026/) (the chaptered text refused automated reading)
