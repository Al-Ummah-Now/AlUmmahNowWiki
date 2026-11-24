[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 20: System parental controls

| | |
|---|---|
| **ID** | `E20` |
| **Owning repos** | [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **planned**. This spec replaces the Kids Mode spec ([O45](decisions.md#o45-no-in-app-kids-mode-support-the-systems-parental-controls)). Nothing is built until the spec passes review and the owner confirms |
| **Last updated** | 2026-11-24 (store and platform docs read 2026-11-23) |
| **Depends on** | [Epic 9](E09-native-platform-foundations.md) (app config, attestation), [Epic 23](E23-release-engineering.md) (store releases), [AUN-FEATURES](AUN-FEATURES-feature-switches.md) |

## 1. Goal

A parent limits what their child does in Al Ummah Now with the **controls the device already has**: Screen Time on Apple devices, Family Link on Android, Family Safety on Windows, and website limits in a browser. This epic is the work our apps must do so that those controls work properly.

Owner, 2026-11-24: "parental controls are for the apps to allow parents use SYSTEM settings to limit their children access", and "THE EPIC IS TO build anything needed for apple parental control features if there is anything the app should do". The same day the owner confirmed the same depth for Android.

### Out of scope, by owner decision

No in-app Kids Mode: no PIN, no time limits of our own, no curated kids catalog, no child profiles, no kids sessions or token scopes. The earlier spec ([wiki #209](https://github.com/Al-Ummah-Now/AlUmmahNowWiki/pull/209)) and its PRs ([#1778](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1778), [#1780](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1780), [#1794](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1794), [#1801](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1801)) are closed without merging. They are background only.

### The short answer

| Platform | Must do | Optional, recommended | Not needed |
|---|---|---|---|
| **Apple** | Answer the age-rating questionnaire truthfully, including the 2026 social media and November 2026 questions; call the Declared Age Range API where the law requires it and adapt; run the significant-change flow; keep age-restricted videos out of reach of minors | Read the device's media rating limit (the only such signal on Apple TV); add the Entertainment category so Time Allowances covers viewing | FamilyControls authorization, DeviceActivity, ManagedSettings writes, our own shields or limits, SensitiveContentAnalysis, Kids category, anything for Ask to Buy while there are no purchases |
| **Android** | IARC rating, Target audience, the user-generated content duties; Play Age Signals where required, and adapt; notify significant changes in Play Console; stop playback cleanly when Family Link suspends the app | Read Android TV's blocked ratings; mark Auto and TV items with a rating | Families Policy program, Teacher Approved, neutral age screen, Restrict Minor Access, storing Play's `installId` |
| **Windows** | Microsoft Store IARC rating kept current; Windows age signals from 2027-01-01 (California covers computers) | none | Any Family Safety integration: it works on the app with no code |
| **Web** | Nothing mandatory | Honor the `Prefer: safe` header; one public parents' guide that lists our domains and the steps per device | RTA label, `rating` meta tags |

**What makes this urgent:** Texas is in force now, California and Alabama start on 2027-01-01. Our apps are not in any public store yet, so the duties start with the **first public store release** ([E20-D9](#11-owner-decisions)).

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
| Native app identity | `X-AUN-Client` ([AUN-ORIGIN](AUN-ORIGIN-request-origin.md)), `X-AUN-Native-Proof` (`apps/api-videos/src/lib/attestation/`) | Ready to use |
| Native app settings | `GET /api/v1/app-config` (`apps/api-videos/src/routers/app-config.router.ts`, `packages/shared-types/src/app-config.ts`) | Ready to carry the age policy. Its `kids` app id was never used |
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
| Age assurance | Yes once E20-A2 ships, else No | No | Yes once E20-A2 ships | Apple counts the Declared Age Range API |
| Unrestricted web access | No | No | No | No web view; sign-in is the system session |
| User-generated content | Yes | Yes | Yes | Videos come from creators (guideline 1.2.1 calls this creator content) |
| Social media | **Yes** | No while it only plays | No | [E20-D1](#11-owner-decisions). Answer Yes from the first release, so that adding likes and comments later doesn't change the rating, which would be a significant change in Texas (§7) |
| Social media disabled under 13 | **No** | – | – | Saying Yes also promises that "only age-appropriate UGC is delivered" to under-13s. That needs a curated catalog, which the owner ruled out |
| Messaging and chat | No until comments or chat ship in the app, then Yes (Apple counts public posting) | No | No | Does not raise the rating |
| Advertising, gambling, contests, loot boxes, location, dating | No | No | No | |
| Mature or suggestive themes, realistic violence, alcohol or drug references, medical information, horror or fear, profanity, weapons, health topics | Infrequent where creators' lectures and news can touch them (realistic violence, alcohol and drug references, mature themes, medical); none for the rest | Same | None (a creation tool) | Any one of realistic violence, alcohol references or medical information at "infrequent" already gives 13+ |
| Sexual content, graphic violence | None | None | None | Against the community guidelines |
| **Result** | **13+** | **13+** | **13+ by override**, to match the minimum account age | [E20-D1](#11-owner-decisions) |

Also fill the optional **Age Suitability URL** with the parents' guide (§6.3). Keep "For Kids" and "For Children" out of names, subtitles, keywords and screenshots (guideline 2.3.8 reserves them); the in-app `islamic_kids` label is fine. `scripts/check-store-metadata.py` gains that word check in English and Arabic.

### 3.2 Screen Time and Content & Privacy Restrictions

| Parent's control | How it acts on us | What we must do |
|---|---|---|
| **App Store, Media & Apps → Apps rating** | Hides or blocks apps above the limit. A child under 13 asks for an exception for a 13+ app | The truthful rating (§3.1). It also drives the block on Apple TV and Mac |
| **App Limits, Downtime, Always Allowed** | The system shields the app and can end it at any moment | Nothing to call. Playback must pause and the position must survive (E20-A5). Never try to detect or work around a shield |
| **Time Allowances** (iOS, iPadOS, macOS 27) | Entertainment and Games follow the App Store category; Social Media follows the questionnaire | Our category is Photo & Video, so *viewing* falls in no allowance. Adding **Entertainment** as the secondary category puts it where a parent expects ([E20-D7](#11-owner-decisions)) |
| **Communication Limits** | Covers calls, Messages and apps that use PermissionKit with known contacts. Public comments and live chat are not contact-based | Nothing today: no direct messages. If a signal says Communication Limits are on, hide live chat and comment writing (E20-A2). Direct messages ([LR-4.2](LR-4.2-legacy-messaging.md), deferred) may not ship for minors without PermissionKit's communication topic |
| **Web content: limit adult websites, allowed only** | Can block `auth.alummahnow.net` inside the system sign-in sheet | Sign-in failure shows a plain message in the person's language and the app keeps working as a guest (E20-A5) |
| **Media ratings, explicit content** | `ManagedSettingsStore().effectiveMaximumMovieRating` (0 to 1000; iOS 15, tvOS 26), which Apple says an app may read without FamilyControls authorization, and `effectiveDenyExplicitContent` (iOS 26, tvOS 26), whose page says "an authorized app" | Optional. Read it at launch and on return to the foreground; hide age-restricted videos when explicit content is denied or the movie limit is below R (400). Apple says *subscribing* to changes needs the Family Controls entitlement, so we only read. E20-A4 starts with a device check of what reads without that entitlement; whatever doesn't is dropped, not requested |
| **Siri, Spotlight, Top Shelf, widgets, Now Playing** | Our titles can appear outside the app, even when it is limited | Age-restricted videos never go to any of them |
| **Ask to Buy** | Covers downloads (free ones too) and In-App Purchases | Nothing: there are no In-App Purchases and creator support in apps is off. If purchases ever ship: handle StoreKit's pending state, and give each product a Texas age rating |
| **App deletion, privacy, location limits** | Generic | Nothing: we ask for none of them |

FamilyControls, DeviceActivity, ManagedSettings *writes* and the Screen Time framework exist for parental-control apps and browsers. We are neither. Asking for the Family Controls entitlement would add an Apple approval and buy nothing. SensitiveContentAnalysis is for person-to-person images; our images are scanned on the server ([Epic 28](E28-ai-moderation.md)).

### 3.3 Declared Age Range (must do where required)

`AgeRangeService` (iOS, iPadOS and macOS 26.0; `isEligibleForAgeFeatures` 26.2; `requiredRegulatoryFeatures` 26.4; `.confirmed` 26.5). **Not on tvOS.** Entitlement `com.apple.developer.declared-age-range`. Older systems get no signal and behave as today. In regulated regions the system shares the range without asking; elsewhere the person, or the parent in Family Sharing ("Age Range for Apps": Always, Ask First, Never), decides. It never gives a birth date. Parents' choices there are themselves a system parental control, and our job is to honor them.

Rules:

1. Ask with gates **13, 16, 18**. The system may replace the gates with the law's.
2. **When to ask** ([E20-D4](#11-owner-decisions)). If `requiredRegulatoryFeatures` contains `declaredAgeRangeRequired` (or, on 26.2 and 26.3, `isEligibleForAgeFeatures` is true): at first launch after install, when an account signs in on that device, and when a significant change takes effect. Otherwise: once, the first time someone tries to comment, chat, post or upload. Never on a plain launch, never for watching. A periodic re-check happens at most once in 12 months (the Utah and Alabama limit).
3. Use `lowerBound`; `nil` means under 13. Use `activeParentalControls` for Communication Limits.
4. Nothing about the range goes into logs, analytics, crash samples, push or support diagnostics.
5. Errors (`notAvailable` and `invalidRequest` from 26.0; `declinedOnboarding`, `invalidAccount` and `network` from 27.0, so behind an availability check and a default case) and `declinedSharing` are "no signal", never "adult" and never "child".

The outcome is a **level** evaluated in aun-core from the signal and the policy the server sends (§5.2): the same code on every platform.

### 3.4 Significant changes and revoked consent (must do, Texas now)

- **Minors**: PermissionKit `SignificantAppUpdateTopic` sends the parent a question through `PermissionButton`; until approved, the changed feature stays off. **Verified adults** where required: `showSignificantUpdateAcknowledgment`. Handled changes are kept in iCloud key-value storage (Apple's sample does this), and a person who installs after the change is not asked.
- The list of changes (id, date, English and Arabic text) comes from app config, written on the admin page (E20-B2). Counsel decides what is significant; the release checklist asks at each release.
- `AppStore.ageRatingCode` (iOS, macOS, tvOS 26.2): compare with the last known code at launch; a change starts the same flow.
- **Revoked consent**: Apple stops the app from launching. App Store Server Notifications V2 also sends `RESCIND_CONSENT` with a signed app transaction. Receiving it is optional. We count it and store no identifier (E20-B5).

### 3.5 Differences on tvOS and macOS

| | iPhone, iPad | Mac | Apple TV |
|---|---|---|---|
| App rating limit | Yes | Yes (Mac App Store apps) | Yes |
| Downtime, App Limits, Time Allowances | Yes | Yes | No |
| Declared Age Range | Yes | Can ask; "eligible" is always false | **No** |
| PermissionKit | Yes | Yes | No |
| Media rating limit readable | Yes | No (not in ManagedSettings for macOS) | tvOS 26 |
| Our behavior | Full | Ask only at first social use | Read the media limit; never list age-restricted videos; no sign-in, comments or chat. Any later sign-in on TV takes the level from the account |
| Outside the store | – | Studio for Mac (Developer ID): app limits still work, rating limits don't | – |

tvOS kids profiles filter the Apple TV app, not third-party apps.

### 3.6 CarPlay

CarPlay shows the phone app's content, so the phone's level and limits apply. Age-restricted videos never appear in CarPlay lists ([E14](E14-offline-listen.md) owns CarPlay).

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
| Data safety | Update when age signals are used (§8) | The Play library itself collects nothing |

### 4.2 Family Link and the device's own parental controls

| Parent's control | How it acts on us | What we must do |
|---|---|---|
| Content filter by rating, app approval, purchase approval | Play hides or asks for apps above the limit | The truthful rating |
| App time limit, downtime, device lock, app block, Android's own Settings → Parental controls | The system suspends the package | No API to call. `AunPlaybackService` must stop foreground playback, Android Auto and Cast control when the app is suspended, save the position, and resume cleanly. Test with `cmd package suspend` (E20-G3) |
| Notification hiding while locked | System | Nothing |
| Website filter in Chrome | Custom Tabs sign-in may be blocked | Same plain message as Apple |
| Age sharing per app | Family Link decides for supervised users | Honor it (§4.3) |

### 4.3 Play Age Signals (must do where required)

`com.google.android.play:age-signals:0.0.6` (November 2026, beta), phones, foldables and tablets on Android 6 and up. **Not TV** (`DEVICE_NOT_SUPPORTED`) and not sideloaded builds (`APP_NOT_OWNED`). Responses for everyone by 2026-12-11; mandatory in California and Brazil from January 2027; live in Texas; Alabama "details coming soon".

1. `getApplicableAgeFeatures()`. If it contains `MANDATORY_SHARING`, ask at the same moments as §3.3; otherwise only at first social use.
2. `requestAgeSignalsAccess(activity)`, then `checkAgeSignals()` when `SHARED`. Default ranges (0–12, 13–15, 16–17, 18+) fit our gates, so no custom ranges.
3. Map: `ageUpper ≤ 12` under 13; and so on; `ageRangeSource` `TIER_B` means a parent manages the age. `VERIFICATION_REQUIRED`: tell the person to open the Play Store to finish (Google's instruction), with viewing still open ([E20-D5](#11-owner-decisions)).
4. `significantChangeStatus` `PENDING` or `DECLINED` keeps the changed feature off.
5. Retry only the codes Google marks retryable, at most twice, never blocking the first screen. Use Play Integrity (already in `integrity-play`) when a level is sent to the server.
6. Google's terms: **only** for age-appropriate experiences and legal compliance. No ads, analytics, profiling or sharing. Do not store `installId`: it exists only to report revoked approvals, and Play already stops the app. Reopened only if counsel answers yes to Q5.

The library goes in `viewer-mobile` and `studio-mobile` behind an interface in `core-bridge`, so the Fire flavor and TV never link it.

### 4.4 Significant changes

Declared in Play Console → Age signals (up to 3, up to 90 days ahead, English required, Arabic added), without a release. The same id and date go in app config, so both stores and the server agree.

### 4.5 Android TV, Google TV, Fire TV

- The TV app is a placeholder. These are rules for [Epic 15](E15-tv-apps.md), tested when its screens land (E20-G4).
- Google TV kids profiles show only apps the parent chose; the rating decides what can be offered. No code.
- `TvInputManager.isParentalControlsEnabled()` and `isRatingBlocked()` are readable by any app but are built for TV inputs. Optional: when on, hide age-restricted videos.
- Any home-screen channel, Watch Next or Engage entry carries a content rating and is never an age-restricted video.
- Fire TV: answer Amazon's content questionnaire; Amazon's parental PIN uses it. Amazon's `GetUserAgeData` is for Fire **tablets**, which we don't target. Nothing to build.
- Android Auto: set Media3's explicit extra on anything age-restricted, and leave such items out of the browse tree.

## 5. Shared design

### 5.1 What each level may do

Recommended values ([E20-D2](#11-owner-decisions), [E20-D3](#11-owner-decisions)); every number is set on the admin page, never in code.

| | Under 13 | 13–15 | 16–17 | 18+ | No signal |
|---|---|---|---|---|---|
| Watch public videos | Yes, as a guest | Yes | Yes | Yes | Yes |
| Age-restricted videos | No | No | No | On the web only (§5.3) | Web warning page |
| Sign in, history, downloads, notifications | No | Yes | Yes | Yes | Yes |
| Comment, post, react | No | Yes | Yes | Yes | Yes |
| Live chat | No | No | Yes | Yes | Yes |
| Upload, create a channel | No | Yes, if the creator tier allows | Same | Same | Same |
| Give or receive creator support | No | No | No | Yes (it has its own 18+ check) | Its own check |

Age sits **in front of** creator tiers, not inside them: a tier can never lower a legal minimum, so this is one platform-wide policy. Features a level can't use are hidden, with no "not available for your age" text ([Hidden when off](../guides/product-rules.md#hidden-when-off)). The one exception is an action already on screen (a deep link to comments, a stale page): the server's localized refusal shows.

"No signal" is not an adult signal. It means we know nothing, so nothing changes, except where the system says sharing is required and it is unresolved: then viewing works and writing waits ([E20-D5](#11-owner-decisions)).

### 5.2 Data and API

**Switches** (Features page, all default **off**, server-enforced): `ageSignals` (group people), `ageRestrictedVideos` (group people), `parentsGuide` (group site). `ageSignals` can be turned on only when the policy is saved with English and Arabic text for every listed change (a check in `feature-preconditions.ts`). Off: apps don't ask, the config key is absent, the routes answer `404 feature_off`.

**Policy**: one rule, key `age.policy`, in the existing `config` document of the **`APP_CONFIG` KV**, the only store `GET /api/v1/app-config` reads (`apps/api-videos/src/endpoints/app-config/appConfigGet.ts`). It is not a `site_settings` value and not in `ADMIN_DB`. Videos admin → App config gains an **Age policy** form that writes that rule through `apps/admin-api/src/routers/appConfig.router.ts`, with its validation, conflict check and audit row (`site_settings_log`, key `app-config:config`). The rule editor refuses to edit the key by hand. `appConfigGet` leaves the key out while `ageSignals` is off. The server's own checks read the same rule. It travels in an answer the apps already fetch, so it costs no extra request:

```json
"config": { "age.policy": {
  "v": 1,
  "minimumAge": { "signIn": 13, "comment": 13, "post": 13, "liveChat": 16, "upload": 13, "support": 18, "ageRestricted": 18 },
  "ask": "requiredThenFirstSocialUse",
  "unresolvedWhereRequired": "viewOnly",
  "accountLevel": false,
  "significantChanges": [ { "id": "2027-02-live-chat", "effectiveFrom": "2027-02-01", "platforms": ["ios", "ipados", "macos", "android"], "text": { "en": "…", "ar": "…" } } ]
} }
```

**Core** (`aun-common`, exported through `aun-ffi`): `evaluate_age(signal, account_level, policy) -> AgeDecision` with one flag per row of §5.1, and `due_to_ask(history, policy, now)`. Pure functions; no I/O. The lowest level wins when the device and the account disagree. A client that has no policy, or a newer `v` than it knows, changes nothing.

**Account level** (only when `accountLevel` is true, [E20-D6](#11-owner-decisions)), next free `search` migration:

```sql
CREATE TABLE user_age_levels (
  user_id    TEXT PRIMARY KEY,
  level      TEXT NOT NULL CHECK (level IN ('under13','13_15','16_17')),
  expires_at TEXT NOT NULL            -- 12 months; asking again renews it
);
CREATE INDEX idx_user_age_levels_expires ON user_age_levels (expires_at);
```

- Adults have **no row**. The range itself, its source, the platform and the region are never stored.
- `PUT /api/v1/me/age-level` `{ "band": "under13|13_15|16_17|adult" }`, signed in, rate-limited per user. Two rules, the same for every client:
  1. **Lowering, or a first level, needs no proof** and takes effect at once: it can only restrict the caller.
  2. **Raising or clearing always needs a valid `X-AUN-Native-Proof`**, checked with `acceptProof` (`lib/attestation/service.ts`) against this account. It does not depend on "Require a proof from these clients" (`enforceClientIds`). No proof, an expired one, another account's, or that platform's attestation switched off: `403 native_proof_required`, and the level stays. The web, Windows, Linux, TV and Mac have no attestation, so there a level can only go down.
- Ways up: the iPhone, iPad or Android app with a proof; expiry after 12 months; support staff with an audited reason. A proof shows the request came from our genuine app, not that the age is true; a determined person can still get around it. That is accepted: we never claim to verify ages.
- **`accountLevel` can't be turned on**: the Age policy save refuses it (`409 feature_precondition`; it is a policy field, not a switch) until App Attest and Play Integrity are on and the viewers that send proofs are released (E20-A6, E20-G5). Neither viewer attests today. The same PRs update App Privacy and Data safety.
- `GET /api/me/features` drops the keys the level may not use.
- Enforcement: middleware `requireMinimumAge(key)`, one primary-key read, cached per isolate for 60 seconds, then `403 age_minimum` (new code in `API_ERROR_CATALOGUE`, English and Arabic). If the row can't be read, the write answers `503 service_unavailable`. Keys:

| Key | Routes |
|---|---|
| `signIn` | Every personal write: watch history and progress, likes and reactions, subscriptions, playlists, watch later, downloads, device and push registration, notification settings, profile |
| `comment`, `post`, `liveChat`, `upload`, `support` | Comments and replies; community posts; chat messages; uploads, channel creation and Studio writes; creator support |
| Exempt, with the reason in the route table | Sign-out, account deletion, data export, privacy and consent choices, reporting content, `PUT /me/age-level` itself: they protect the person. Public reads |

- A route table test fails when a signed-in writing route has neither the middleware nor an exemption with a reason.
- GDPR export and erase include the row. A daily job deletes expired rows through the index. The level never enters analytics, recommendations, email or admin lists; support staff see only "age rule applied", and can clear it with an audited reason.
- `under13` on an existing account: every personal write above stops, so nothing new is collected; push stops at the next send, which skips accounts below `signIn`. What else the law requires (notice, deletion, consent) is question Q2 for counsel; nothing is deleted automatically before that answer.

**Apple notifications** (optional, E20-B5): `POST /webhooks/apple/app-store`, outside the session and CSRF middleware. Verifies the JWS chain to **Apple Root CA – G3** (the App Attest root in `lib/attestation/apple-root.ts` is a different root), then bundle id and environment; rejects anything else with 401. De-duplicates on `notificationUUID`. Acts on `RESCIND_CONSENT` only, by adding one to a daily counter. Stores no transaction or user id.

### 5.3 Content flags

**Does a system control ever need a per-video flag? No.** Screen Time, Family Link and Family Safety act on the *app's* rating, never on one of our videos. Two flags are still needed, for other reasons:

| Flag | Needed for | Set by | Effect |
|---|---|---|---|
| `ageRestricted` on the video | Apple 1.2.1(a): creator apps must let people identify content above the app's rating **and** limit it by verified or declared age. Microsoft 11.11.3 says the same. The readable media limits (§3.2, §4.5) and `Prefer: safe` (§6.2) need something to act on | Creator in Studio and upload defaults (the field exists); staff in admin, and only staff can undo a staff setting; AI moderation may suggest it, never set it | [E20-D8](#11-owner-decisions): recommended to keep such videos **out of every store app** (lists, search; deep links open the web), and to show a warning page on the web |
| `madeForKids` on the video | COPPA treats child-directed videos differently even on a general site; [PL-D11](AUN-PLAYER-LINKS-in-video-links.md#16-owner-decisions) hides links on them; E17 turns chat off on them | Creator at upload and in Studio; staff; YouTube import | Comments start off (as imports do today), no live chat, no player links. Never used to unlock anything, never a catalog |

Both are booleans on the video record and columns on the video index (`age_restricted`, `made_for_kids`, both `NOT NULL DEFAULT 0`), filtered through existing indexed list queries, never a scan. No backfill: unset is false, and `importedFrom.madeForKids` is read as a fallback. A video can't be both. `islamic_kids` stays a subject label and implies neither flag.

Native clients: `/api/v1` catalog, search, related and playlist answers leave out age-restricted videos for any request with `X-AUN-Client`, and the single-video answer gives `403 age_restricted` with the web link. Apps also drop any item with `ageRestricted: true`, so an old cache can't leak one.

## 6. Windows and web

### 6.1 Windows

- **Store (must do):** IARC in Partner Center, kept current (policy 11.11). The current answers in `store/microsoft/privacy.md` say "no interaction", true for today's viewer; they change when comments ship. Policy 11.12 (user content) needs Terms in the app, reporting, and respect for the user's parental settings.
- **Family Safety:** app limits, blocking and the age filter work on the app with no code. The filter covers Store apps; the direct downloads (MSI, MSIX, zip) have no rating, so a parent uses app limits there. The parents' guide says so.
- **Age signals:** `Windows.System.User.GetUserAgeRangeAsync` (Windows 11 24H2 and later, package capability `userAccountInformation`, the person's consent in Windows privacy settings, Microsoft accounts only, still marked prerelease). Ranges under 10, 10–12, 13–15, 16–17, 18+; `null` is unknown. California's law covers computers, so build it behind a method-presence check (E20-W2). `GetAgeVerificationStatusAsync` is not needed.
- **Linux (Flathub, snap):** California exempts open-license operating systems, and there is no signal to ask for. Nothing to build.
- **Samsung TV:** the Seller Office age question, same answers as TV. Nothing to build.

### 6.2 Web

- **RTA label and `<meta name="rating">`: no.** Both declare the page adult. Google treats them as explicit and drops the page under SafeSearch. Our pages are not.
- **`Prefer: safe` (RFC 8674), optional, recommended:** Firefox sends it when the operating system's parental controls are on, and Edge sends it too. When present on a server-rendered page or API request, age-restricted videos are left out and their page shows the warning without a "continue" button; the answer carries `Preference-Applied: safe` and `Vary: Prefer`. Cloudflare's cache ignores `Vary`, so every cached key that can contain one gains a `safe` part. It works only with `ageRestrictedVideos` on.
- **Website limits** in Screen Time, Family Link and Family Safety work per domain, with no code. Parents need the list, which is in the guide: `alummahnow.net` and its subdomains, `alummahnow.link`, plus any other domain in use ([environments and domains](../guides/environments.md)).
- California's signed law puts the signal duty on apps, not on websites; a level learned in an app may still count as knowledge on the web for the same account (Q3).

### 6.3 Parents' guide

A public, bilingual frosted-glass page at `/help/parents` (web help, `parentsGuide` switch): what our rating is and why, how to limit the app on iPhone, iPad, Mac, Apple TV, Android, Google TV, Windows and in browsers with the system's own settings, what the app does when a parent shares an age range, the domains, and how to report something. No claim that the app is for children. The App Store Age Suitability URL points here.

## 7. Laws that decide dates

Read from the statute or the legislature's own digest unless marked †. Counsel confirms before any store release.

| Law | Status on 2026-11-23 | What a developer must do | Applies to us |
|---|---|---|---|
| **Texas** SB 2420 (Bus. & Com. Code ch. 121) | **In force.** The Fifth Circuit stayed the injunction (2026-05-28; Apple acted from 2026-06-04); appeal pending | Give each app (and purchase) an age rating and its reasons (121.052); notify the store **before** a significant change: data types, rating, monetization, or material function (121.053); verify age category and consent with the store's data (121.054); use it only for age protection, law and safety, and **delete it once verified** (121.055). No enforcing terms against a minor without consent. Good-faith reliance is protected | Phones and tablets, from the first store release. New store accounts only |
| **California** AB 1043 + AB 1856† (Civ. Code 1798.500 ff.) | **2027-01-01**; apps already downloaded and updated since 2026-01-01: first request **before 2027-07-01** | Ask for the signal when the app is downloaded and launched; treat it as the main sign of age; use it to follow other laws; don't prompt people to change it, share it, or ask when no law requires. Receiving it is actual knowledge | All apps from a store on phones, tablets **and computers** |
| **Alabama** HB 161 | **2027-01-01** (stores have until 2027-10-01 for old accounts) | As Utah, plus use the **lowest** category for our own restrictions | Phones and tablets. Google: "details coming soon" |
| **Utah** SB 142 as amended by HB 498 | Developer duties **2027-05-06**; minors or parents may sue ($1,000 or actual damages) | Verify category and consent; notify significant changes; use only for restrictions, law, safety; **lowest** category for first defaults; never share; routine re-check at most once in 12 months | Phones and tablets |
| **Louisiana** HB 977 (Act 185), replaces Act 481 | **2027-07-01** | As Utah; also **connected devices**; trust our own better knowledge over the store's | Phones, tablets and connected devices (TVs likely; Q5) |
| **COPPA** (16 CFR 312, amended; compliance date 2026-04-22) | In force | Actual knowledge of an under-13 means no personal information without verifiable parental consent | A store signal of under 13 can be actual knowledge (Q2) |
| Brazil Digital ECA, Australia under-16 social media, UK Online Safety Act and Children's Code, EU DSA art. 28 | In force or phasing in | Differ by country; some require more than a store signal | Counsel question Q5 before opening those storefronts |

The Apple page that gave 2026 dates for Utah and Louisiana predates both amendments. California's and Alabama's final rules may change; the release checklist re-reads this table.

## 8. Every platform at a glance

| Platform | Work |
|---|---|
| Web | Studio and upload fields for the two flags; warning page; `Prefer: safe`; parents' guide; hidden features per level when account levels are on |
| Videos admin | Three switches, Age policy page, staff flag on a video with a reason and Undo, "age rule" on a user with audited clear |
| Apple | Store answers, age range adapter, significant changes, media limits, interruption behavior; `app-privacy.json` gains the age band only if account levels are on (until then Data Not Collected holds for the viewer) |
| Android | Store answers, Play Age Signals, significant changes, suspension, TV rules; `data-safety.csv` the same way |
| Desktop | Store answers, Windows age range; privacy answers the same way |
| Core | Level evaluation, policy types, scrubber keys (`ageLower`, `ageUpper`, `ageRange`, `ageBand`) |

## 9. Legal and safety

- Minimum data: no birth date, no document, no face check, ever. The range stays on the device unless [E20-D6](#11-owner-decisions) turns account levels on.
- Terms of Service, a privacy policy and the child-safety standard page must be public before the first store release: the stores ask for them, Play requires accepting Terms before user content, and Texas is about enforcing terms against minors. They are with counsel and the CMS, not in this epic.
- Native comments, chat and posts each need in-app report and block in the same release ([Epic 12](E12-viewer-mobile.md), [Epic 17](E17-live-in-apps.md)).

Questions for counsel (to add to the letter already in preparation):

1. **Q1.** Texas says delete the store's data once verified; California says treat the signal as knowledge and apply it. Is keeping a *derived level* on the account (never the range, never for adults) acceptable in both?
2. **Q2.** A store signal of under 13 on a signed-in account: is that COPPA actual knowledge, and must we notify a parent, delete, or suspend the account?
3. **Q3.** Does a level learned in an app bind the website for the same account under California's text?
4. **Q4.** Minimum account age 13 in the Terms: is 13 right in every storefront we open (the EU varies from 13 to 16)?
5. **Q5.** Which storefronts need more than the store signal, and do internal-testing builds (Admin, QA) fall under any of these laws? If account levels are on, must a consent revoked in Play (reported only by `installId`) or at Apple also end access on our other surfaces?
6. **Q6.** Which of our planned changes are "significant" (live chat, comments, creator support, downloads, a new data type)?
7. **Q7.** Made-for-kids videos on a general site: must history and recommendations be off for them as well as comments?

## 10. Stories (one PR each)

| Story | What | Repo | Visual | Needs |
|---|---|---|---|---|
| **E20-0** | This spec | Wiki | – | – |
| **E20-A1** | `store/apple/age-rating.{md,json}`: every questionnaire answer per record with its source file; CI check (answers complete, sources exist, reserved words absent in both languages); RELEASING and the [store checklist](../guides/store-release-checklist.md) | Apple | – | D1, D7 |
| **E20-G1** | `store/play/content-rating.{md,json}` (IARC, target audience, user content) with the same check in `checkStoreListings` | Android | – | D1 |
| **E20-W1** | `store/microsoft/age-rating.md`, privacy answers, Samsung answers, test in `StoreListingTests` | Desktop | – | D1 |
| **E20-B1** | `ageRestricted` and `madeForKids` on the video: record, index columns, upload defaults applied at last, API, `/api/v1` rules, import fallback, `ageRestrictedVideos` switch | AlUmmahNow | – | D8 |
| **E20-B1u** | Studio, upload and admin fields (with staff lock and Undo) and the web warning page | AlUmmahNow | yes | B1 |
| **E20-B2** | `ageSignals` switch and precondition, the `age.policy` rule in the `APP_CONFIG` `config` document, Age policy form, OpenAPI | AlUmmahNow | yes | D2–D5 |
| **E20-B3** | Core: policy types, `evaluate_age`, `due_to_ask`, scrubber keys, UniFFI; release candidate | Core | – | B2 contract |
| **E20-B4** | Account level: table, API and middleware, route-table test. Both fail closed: if the existing `user_age_levels` row can't be read, `PUT /me/age-level` and every checked write answer `503 service_unavailable`, so a failed read is never taken for a first level or a pass. Also `GET /api/me/features`, export and erase, expiry job. Ships with `accountLevel` false | AlUmmahNow | – | B2; **turn-on** waits for D6, Q1–Q3, A6 and G5 |
| **E20-B5** | `RESCIND_CONSENT` receiver (optional) | AlUmmahNow | – | – |
| **E20-A2** | Declared Age Range in Viewer and Studio (iOS, iPadOS, macOS): entitlement, adapter, ask rules, hidden features, Communication Limits | Apple | yes | B3 |
| **E20-A3** | Significant-change flow (PermissionKit, acknowledgment sheet, `ageRatingCode`, iCloud storage) | Apple | yes | A2 |
| **E20-A4** | Read media limits on iOS and tvOS; drop age-restricted items from lists, Top Shelf, Spotlight, Now Playing, CarPlay | Apple | – | B1 |
| **E20-A5** | Interruption: shield mid-playback, blocked sign-in domain; en/ar message | Apple | yes | – |
| **E20-A6** | App Attest in the iPhone and iPad viewer, sending proofs with `PUT /me/age-level`; App Privacy answers. Only if D6 turns account levels on | Apple | – | B4, viewer sign-in |
| **E20-G2** | Play Age Signals in viewer and Studio; Fire and TV flavors don't link it | Android | yes | B3 |
| **E20-G3** | Suspension and resume in `AunPlaybackService`, Auto and Cast; significant-change state | Android | – | G2 |
| **E20-G4** | TV and Auto: blocked ratings, rating on home-screen entries, explicit extra | Android | – | B1, Epic 15 screens |
| **E20-G5** | Play Integrity in `viewer-mobile` (`:integrity-play`), same use; Data safety answers. Only if D6 turns account levels on | Android | – | B4, viewer sign-in |
| **E20-W2** | Windows age range adapter, capability, consent text. Lowers an account level, never raises one | Desktop | yes | B3 |
| **E20-S1** | Parents' guide page and Age Suitability URL | AlUmmahNow | yes | D1 |
| **E20-S2** | `Prefer: safe` | AlUmmahNow | – | B1u |
| **E20-R** | Store release gate: checklist lines (re-read §7, answers, significant change?, switch on), device runs recorded | Wiki | – | all must-do stories |

Order: A1, G1, W1 and B1 first (no signal needed), then B2, B3, then the app stories, Apple before Android before Windows. Nothing starts before the owner confirms.

## 11. Owner decisions

| ID | Question | Options | Recommendation and why | Blocks |
|---|---|---|---|---|
| **E20-D1** | Minimum age and store rating | **A.** 13+ everywhere (Viewer, TV, Mac, Studio; Play target 13 and over; "social media: Yes" from the first release). **B.** Try for a lower rating. **C.** 16+ | **A.** Truthful answers give 13+ anyway (news, alcohol and medical mentions, a social feed). Under-13s can still install it with a parent's exception. A lower rating needs a curated catalog, which you ruled out | A1, G1, W1, S1 |
| **E20-D2** | A child the system says is under 13 | **A.** Watch as a guest; sign-in and everything that writes is hidden. **B.** Block the app. **C.** No difference | **A.** It keeps the benefit, collects nothing (COPPA), and leaves the parent's own limits in charge | B2 |
| **E20-D3** | Ages 13 to 17 | **A.** As adults, except no live chat under 16, no age-restricted videos and no money. **B.** Also no comments or posts under 16. **C.** No difference but money | **A.** Live chat is the hardest to moderate in time. All values stay editable in admin | B2 |
| **E20-D4** | When do apps ask for the age range? | **A.** Automatically only where the law requires; elsewhere once, at the first comment, chat, post or upload. **B.** Everyone at first launch. **C.** Only where required | **A.** No prompt for people who only watch, and a parent's choice still works worldwide | A2, G2, W2 |
| **E20-D5** | Where sharing is required but unresolved (Texas "verification required") | **A.** Watching works; writing waits. **B.** Nothing changes. **C.** Block the app | **A.** Safe against the terms-with-minors rule without locking anyone out | B2 |
| **E20-D6** | Where the age level lives | **A.** Device only. **B.** Also a derived level on the account (minors only, 12 months), enforced by the server and the web | **Build both, run A now; turn B on only when counsel answers Q1–Q3.** A device-only rule can be walked around on the web; a stored level has a legal question | B4 turn-on |
| **E20-D7** | App Store secondary category | **A.** Add Entertainment (primary stays Photo & Video). **B.** Leave it. **C.** Education | **A.** Then a parent's Entertainment time allowance covers watching here | A1 |
| **E20-D8** | Videos above 13+ (such as war footage) and made-for-kids videos | **A.** Not allowed at all. **B.** Allowed with an age-restricted flag: never in the apps, warning page on the web; made-for-kids videos start with comments and chat off. **C.** Allowed in apps for confirmed adults | **B.** Apple requires a mechanism or the content's absence from the app; absence is simpler, works on TV, and avoids checking adults' ages | B1, A4, G4, S2 |
| **E20-D9** | Public store release | **A.** No public release in any store until the must-do stories for that store are done and `ageSignals` is on. **B.** Release outside the affected US states first. **C.** Release and follow up | **A.** Texas is in force, stores can't exclude one state for us, and nothing is public yet, so waiting costs little | E20-R |

Nothing else here needs the owner: formats, names, limits and order are set above.

## 12. Tests

Every test seeds and deletes its own data; no paid services; stores and systems are faked in CI.

- **Server (B1–B5):** switch off gives `404 feature_off` and no config key; precondition refuses a missing Arabic text; `/api/v1` list, search, related, playlist and single-video answers never contain an age-restricted video for `X-AUN-Client` and do for the web; staff lock; flags mutually exclusive; import fallback; the query plans use an index. Account level: lower at once; higher and `adult` refused from the web, Windows and any client without a proof, with attestation on and off, with `enforceClientIds` empty, with another account's or an expired proof; accepted with a good one, adult deletes; precondition refuses `accountLevel` without attestation; unreadable row refuses the write, expiry through the index, every writing route covered, `GET /api/me/features` drops keys, export and erase, no band in logs or error samples. Apple notification: good chain, wrong root, wrong bundle, wrong environment, replay, other types ignored.
- **Core (B3):** a table test for every band × account level × policy × missing value, unknown policy version, gates replaced by the system, ask cadence across install, sign-in, change and 12 months; the same table runs through Swift, Kotlin and C# bindings.
- **Apple (A1–A5):** unit tests with a fake `AgeRangeProviding` for every declaration, `nil` bounds, declined, each error, iOS 17 (framework absent), 26.2 and 26.4 paths, tvOS (never asks); fake `AskCenter` for approve, decline, not available; iCloud merge. UI tests in English and Arabic, iPhone, iPad and Mac: hidden features per level, no prompt while watching, shield mid-video keeps the position, blocked sign-in message. tvOS UI test: no age-restricted item with a limit below R. Real devices before release, with Apple's sandbox scenarios (Settings → Developer → Sandbox Apple Account → Age Assurance: the six cases, plus Revoke App Consent) and a real child account: rating limit, Ask to Buy for a free download, App Limit, Downtime, Time Allowance, Always/Ask/Never.
- **Android (G1–G4):** `FakeAgeSignalsManager` for each documented example and every error code; one Robolectric and one instrumented run in English and Arabic; suspend and unsuspend the package during playback, background audio and an Auto session on an emulator; the Fire and TV APKs contain no age-signals class. Real device with a Family Link child: rating filter, app approval, app limit, block, sharing on and off.
- **Windows (W1–W2):** fake `IAgeSignals` for each range, `null`, access denied, method missing on old Windows; launch test; a real child Microsoft account in Family Safety: limit, block, age filter.
- **Web (B1u, S1, S2):** local-stack Playwright in Chromium, Firefox and WebKit: warning page, `Prefer: safe` with and without (and that a cached page never crosses over), guide page in English and Arabic, light and dark, phone and desktop, axe clean; Eastern Arabic digits in Arabic ages.

## 13. Costs

| Item | Cost |
|---|---|
| Age signals from Apple, Google, Microsoft | Free; on the device |
| Policy | Inside an existing app-config answer: 0 extra requests |
| Account level (when on) | 1 indexed row read per write request, cached 60 s: at most 1 read in a comment's existing dozens; 1 row write per minor per year. At 1 million writing users a month and 20 writes each, under 20 million row reads, about $0.02 on D1 |
| Content flags | 2 columns; no new query, 0 per view |
| `Prefer: safe` | A second cache entry only for pages that contain a flagged video and are asked for with the header |
| Apple notifications | 1 Worker request each |
| Per video, per view | 0 |

## 14. Sources

Read 2026-11-23.

- **Apple:** [age rating values and definitions](https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions/), [set an app age rating](https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating/), [2025 ratings](https://developer.apple.com/news/?id=ks775ehf), [social media questions](https://developer.apple.com/news/?id=tlur8uvi), [Time Allowances](https://developer.apple.com/news/?id=0d2gpmml), [November 2026 descriptors](https://developer.apple.com/news/?id=yxkh08us), [Texas, June 2026](https://developer.apple.com/news/?id=sg176nne), [age assurance Q&A](https://developer.apple.com/support/age-assurance), [age-appropriate experiences](https://developer.apple.com/kids/), [Declared Age Range](https://developer.apple.com/documentation/declaredagerange), [requiredRegulatoryFeatures](https://developer.apple.com/documentation/declaredagerange/agerangeservice/requiredregulatoryfeatures), [PermissionKit](https://developer.apple.com/documentation/permissionkit), [reading media ratings](https://developer.apple.com/documentation/managedsettings/readingmedia), [ageRatingCode](https://developer.apple.com/documentation/storekit/appstore/ageratingcode), [sandbox testing](https://developer.apple.com/documentation/storekit/testing-age-assurance-in-sandbox), [App Review Guidelines 1.2, 1.3, 2.3.6, 2.3.8](https://developer.apple.com/app-store/review/guidelines/)
- **Google:** [Play Age Signals](https://developer.android.com/google/play/age-signals/overview), [request](https://developer.android.com/google/play/age-signals/request-age-signals), [responses](https://developer.android.com/google/play/age-signals/understand-age-signals-responses), [errors](https://developer.android.com/google/play/age-signals/handle-errors), [significant changes](https://developer.android.com/google/play/age-signals/notify-significant-changes), [revoked approvals](https://developer.android.com/google/play/age-signals/revoked-app-approval), [regional protections](https://developer.android.com/distribute/age-appropriate-experiences/regional-protections), [Age Signals policy](https://support.google.com/googleplay/android-developer/answer/16585319), [US state laws](https://support.google.com/googleplay/android-developer/answer/16569691), [content ratings](https://support.google.com/googleplay/android-developer/answer/9859655), [target audience](https://support.google.com/googleplay/android-developer/answer/9867159), [Families policies](https://support.google.com/googleplay/android-developer/answer/9893335), [user-generated content](https://support.google.com/googleplay/android-developer/answer/9876937), [child safety standards](https://support.google.com/googleplay/android-developer/answer/14747720), [Family Link time limits](https://support.google.com/families/answer/7103340), [Google TV parental controls](https://support.google.com/googletv/answer/10070481), [TvInputManager](https://developer.android.com/reference/android/media/tv/TvInputManager)
- **Amazon, Microsoft, web:** [GetUserAgeData](https://developer.amazon.com/docs/app-submission/user-age-verification.html), [Windows age signals](https://learn.microsoft.com/en-us/windows/apps/develop/security/age-signals/), [Microsoft Store policies 11.11, 11.12](https://learn.microsoft.com/en-us/windows/apps/publish/store-policies), [Family Safety filters](https://support.microsoft.com/en-us/account-billing/filter-inappropriate-apps-and-games-da38c83a-0717-31ea-b6f2-6cdd95639189), [RFC 8674](https://www.rfc-editor.org/rfc/rfc8674), [SafeSearch and rating tags](https://developers.google.com/search/docs/specialty/explicit/guidelines)
- **Law:** [Texas SB 2420](https://capitol.texas.gov/tlodocs/89R/billtext/html/SB02420F.htm), [Fifth Circuit stay](https://fpf.org/blog/comparing-enacted-app-store-accountability-acts/), [Utah HB 498](https://le.utah.gov/Session/2026/bills/enrolled/HB0498.pdf), [Louisiana Act 185 digest](https://www.legis.la.gov/legis/ViewDocument.aspx?d=1486866), [Alabama HB 161](https://alison.legislature.state.al.us/files/pdf/SearchableInstruments/2026RS/HB161-enr.pdf), California AB 1856, Chapter 184 of 2026 (†`leginfo.legislature.ca.gov`, bill 202520260AB1856, refused automated reading, so §7 relies on [a section-by-section summary](https://didit.me/blog/california-digital-age-assurance-act-2026/) and the [Assembly analysis](https://billtexts.s3.amazonaws.com/ca/ca-analysishttps-leginfo-legislature-ca-gov-faces-billAnalysisClient-xhtml-bill-id-202520260AB1856-ca-analysis-401404.pdf) of an earlier version)
