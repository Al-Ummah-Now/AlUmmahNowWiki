[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# App updates: every app checks for a new version, tells the user, and desktop apps update themselves

| | |
|---|---|
| **ID** | `AUN-APP-UPDATES` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (shared-types, api-videos, admin-api, admin-web), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md), [AlUmmahNowTools](../repos/AlUmmahNowTools.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowWiki](https://github.com/Al-Ummah-Now/AlUmmahNowWiki) |
| **Status** | **planned** (spec revision 1); build starts with the server stories, behind the `appUpdates` switch (default **off**) |
| **Last updated** | 2026-11-23 |
| **Origin** | Owner requirement 2026-11-23, relayed by the orchestrator: "every desktop and native app checks for updates and tells the user when a new version is out. Desktop apps also let the user update from inside the app, either automatically or manually." |
| **Related** | [Epic 9](E09-native-platform-foundations.md) story 9.3/9.5 (`GET /api/v1/app-config`, built), issue [AlUmmahNow#413](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/413) (App config admin page, built), issue [AlUmmahNow#1434](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1434) (App config native client: this epic takes its forced-update part), [AUN-FEATURES](AUN-FEATURES-feature-switches.md), [AUN-ADMIN-NATIVE](AUN-ADMIN-NATIVE-native-admin-app.md), [Epic 23](E23-release-engineering.md) |

## Goal

Every native and desktop app knows, without a store release of its own, when a newer version is out and whether the running build is too old to keep working:

- **All apps** show a small, dismissible notice in English or Arabic when a new version is out, with an **Update** button that does the right thing for where the app came from (App Store, TestFlight, Play, Microsoft Store, a direct download).
- **Builds below the minimum version** that an admin sets show a full-screen "Please update" screen instead of the app. This is the only forced update, and it is the escape hatch for a broken or unsafe build already in users' hands.
- **Desktop apps installed from our own downloads** (the Desktop viewer and Studio on Windows, the Tools app on Windows, macOS and Linux, Studio for Mac) download, verify and install the update themselves, automatically or when the user clicks **Update**, then restart.
- **Nothing unverified is ever installed.** Every self-installed update is checked against an ed25519 signature made in CI, and against the platform code signature once the owner's certificates exist. HTTPS only.
- **One source of truth** for the latest version per app, platform and channel: the signed release manifest each repo's release workflow publishes, indexed by api-videos and served through `GET /api/v1/app-config`. Admins see the current versions and set the minimum version on the existing **App config** page.

## Decisions and constraints

- **Feature switch** `appUpdates` on the Features page ([O39](decisions.md#o39-one-features-page-server-enforced), [AUN-FEATURES](AUN-FEATURES-feature-switches.md)), **default off**. The server enforces it: while it is off, `GET /api/v1/app-config` answers `update.status: "ok"` with no notice data, so no app shows anything. Because the minimum-version gate is the escape hatch for a bad build, the owner is asked to turn it on as soon as the first app ships the check ([APPUPD-D1](#owner-decisions)).
- **Not tier-gated.** Updates are not a creator capability; every user of every app gets them. The admin settings (minimum version, check interval, release-note overrides) are site-wide operational values, edited by `settings:manage` admins, with an audit row ([#1434](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1434) "operational values are admin-managed").
- **Store rules come first** ([§8](#8-store-rules-and-safety)). App Store, Mac App Store, TestFlight, Play and Microsoft Store builds never download or install code themselves; they only open their store. Self-updating is only for builds we distribute ourselves.
- **No browser-style prompts** ([No browser prompts](../guides/product-rules.md)): the notice is an in-app bar; the forced screen and "Restart now?" are in-app views, never `confirm`/`alert` or a system dialog we raise ourselves (store sheets the OS shows are fine).
- **Hidden when off** ([Product rules](../guides/product-rules.md)): no "updates are disabled" text anywhere for users. The Settings **Updates** section on desktop shows only while the switch is on and the build can self-update.
- **Arabic** uses ٠–٩ through each app's shared digit formatter ([Numbers and dates](../guides/numbers-and-dates.md)), Arabic commas «،», and «مرئي/مرئيات» where videos are named.
- **Never store or ask for secrets in agents.** Every key and certificate below is an owner item; the orchestrator collects it. Every release workflow already builds unsigned when a secret is missing, with a `::notice::`; the update path follows the same rule (unsigned manifest → apps show the notice with a download link, never self-install; [§5.5](#55-without-the-signing-key)).
- **Cost cap** $500/month for the platform ([O1](decisions.md#o1-whole-platform-cost-cap)). This epic adds about **$0** ([§10](#10-costs)).

## 1. What exists today

| Area | What exists | Where |
|---|---|---|
| Version policy API | `GET /api/v1/app-config?platform&app&version[&locale&installId]` → `update: { status: ok\|recommended\|required, minimumVersion, latestVersion, storeUrl }`, `Cache-Control: public, max-age=300`. Policies come from the `versions` document in the `APP_CONFIG` KV, defaults `minimumVersion: 0.0.0`. | AlUmmahNow `apps/api-videos/src/lib/app-config.ts`, `src/endpoints/app-config/appConfigGet.ts` |
| Shared types | Platforms `ios ipados tvos macos android androidtv firetv windows linux tizen webos web`; apps `viewer studio kids`; `APP_CONFIG_SEMVER` (3 numeric parts, optional suffix); `compareAppVersions` (suffix ignored) | AlUmmahNow `packages/shared-types/src/app-config.ts` |
| Admin page | Videos admin → **App config** (`/app-config`, `settings:manage`): edits the `flags`, `config` and `versions` documents, dry run, history; audit in `site_settings_log` | AlUmmahNow `apps/admin-web/src/app/(protected)/app-config/`, `components/app-config/VersionList.tsx`, `apps/admin-api/src/routers/appConfig.router.ts` |
| Hourly cron | api-videos runs `47 * * * *` | AlUmmahNow `apps/api-videos/wrangler.jsonc` |
| Core client | `get_AppConfigGet` is generated but **no app calls it** | AlUmmahNowCore `crates/aun-api/src/generated.rs` |
| Desktop | .NET: WinUI 3 viewer, Studio and Admin on Windows; GTK viewer and Studio on Linux; Tizen. Releases from `vX.Y.Z[-preview.N]` tags: MSI + zip + MSIX (Store and sideload), `.deb` + Flatpak, TPK; draft GitHub release. **No update check.** | AlUmmahNowDesktop `.github/workflows/release.yml`, `docs/RELEASE.md` |
| Admin for Windows | WinUI 3, MSIX from a private R2 bucket (`ADMIN_RELEASE_BUCKET`), staff only | AlUmmahNowDesktop `docs/ADMIN_WINDOWS.md`, `release-admin-windows.yml` |
| Tools | .NET 9 Uno Platform app (Windows, macOS arm64/x64, Linux). `vYYYY.MM.DD[.N]` tags (US Eastern date); MSI, portable zip, `.dmg`s, `.tar.gz`, `.deb`, `SHA256SUMS.txt`; unsigned until the owner's certificates arrive. First release `v2026.11.22`. **No update check.** | AlUmmahNowTools `.github/workflows/release.yml`, `docs/RELEASE.md` |
| Apple | SwiftUI apps: ViewerIOS, ViewerMac (Mac App Store), ViewerTV, StudioIOS, StudioMac (**Developer ID, GitHub release**), AdminIOS and AdminMac (TestFlight internal). `vX.Y.Z[-N]` tags. **No update check.** | AlUmmahNowApple `Apps/`, `docs/RELEASING.md` |
| Android | Compose apps: viewer-mobile, viewer-tv (Google Play and Fire TV/Amazon flavors), studio-mobile, admin-mobile (Play internal). `vYYYY.MM.DD[.N]` tags; Play internal track; a pre-release-key APK on the GitHub release for testers. **No update check.** | AlUmmahNowAndroid `docs/RELEASE.md` |
| Release notes | Each store listing already has per-version notes in English and Arabic | Desktop `store/microsoft/<app>/<lang>/release-notes.txt`; Android `*/src/main/play/release-notes/{en-US,ar}/internal.txt`; Apple fastlane `store/apple/<app>/metadata/<lang>/release_notes.txt` |

So the server half of "minimum version and forced update" exists; what is missing is (a) knowing the **latest** version without an admin typing it, (b) release notes, channels and install sources, (c) every client, and (d) self-updating desktop builds.

**Issue #1434.** Its "App config admin page" part is already built (#413). Its "Minimum supported version / forced update" part is this epic ([APPUPD-3](#11-stories), [APPUPD-5](#11-stories) and the client stories); its "remote config + feature flags channel" part is covered by the Core client in [APPUPD-5](#11-stories) (the same fetch returns `flags` and `config`). When those stories merge, #1434 is narrowed to its remaining rows (telemetry sampling and sync intervals, which read `config` keys through the same client).

## 2. Versions, channels and install sources

### 2.1 Version formats

| Repo | Tag | Version the app reports | Example |
|---|---|---|---|
| Desktop | `vX.Y.Z`, `vX.Y.Z-preview.N` | `X.Y.Z[-preview.N]` | `1.4.2`, `1.5.0-preview.3` |
| Apple | `vX.Y.Z[-N]` | `CFBundleShortVersionString` `X.Y.Z` | `1.2.3` |
| Tools | `vYYYY.MM.DD[.N]` | `YYYY.MM.DD[.N]` | `2026.11.22`, `2026.11.22.2` |
| Android | `vYYYY.MM.DD[.N]` | `versionName` without the `-qa` suffix | `2026.11.14.2` |

`APP_CONFIG_SEMVER` and `compareAppVersions` are widened ([APPUPD-1](#11-stories)) to **3 or 4 numeric parts** (a missing 4th part is 0, so `2026.11.22` = `2026.11.22.0` < `2026.11.22.2`) and **semver pre-release precedence** (`1.5.0-preview.2` < `1.5.0-preview.10` < `1.5.0`). Build metadata after `+` is ignored. `-qa` is not a pre-release: QA builds call the QA API, whose own `APP_CONFIG` KV and release index list QA builds, and they strip `-qa` before sending.

### 2.2 Channels

`stable` (default) and `beta`. A build is `beta` when it came from a pre-release tag (Desktop `-preview.N`, a GitHub pre-release), TestFlight, or the Play internal or testing tracks. A `beta` build is told about the newest of `beta` and `stable`; a `stable` build only about `stable`.

### 2.3 Install sources

The client sends where it was installed from, because that decides what **Update** does:

| `source` | Detected by | Update does |
|---|---|---|
| `appstore` | iOS/iPadOS/tvOS/macOS: StoreKit 2 `AppTransaction.shared` environment `production` | open the App Store product page in the app (`SKStoreProductViewController`), or `itms-apps://` / `macappstore://` |
| `testflight` | `AppTransaction` environment `sandbox` | open TestFlight (`itms-beta://`) |
| `play` | Android `getInstallSourceInfo().installingPackageName == com.android.vending` | Play In-App Updates ([§6](#6-android)) |
| `amazon` | installer `com.amazon.venezia` | open the Amazon Appstore page |
| `msstore` | Windows: the app runs with package identity and the Store installed it (`StoreContext` returns an app license) | `StoreContext.RequestDownloadAndInstallStorePackageUpdatesAsync` (the Store's own consent UI) |
| `direct` | our own installer: Velopack on Windows/macOS, Sparkle on Studio for Mac | download, verify, install, restart ([§5](#5-desktop-self-update)) |
| `managed` | MSI per-machine installs, sideloaded MSIX, `.deb`, Flatpak, `.tar.gz`, Admin MSIX from R2, the Android pre-release APK | open the download page (`url`) |
| `samsung` | Tizen | nothing (Samsung updates TV apps); only the minimum-version screen applies |

### 2.4 Apps

`APP_CONFIG_APPS` gains `tools` and `admin`, so the list is `viewer studio kids tools admin`. Every app/platform pair in scope:

| App | Platforms | Sources |
|---|---|---|
| `viewer` | ios, ipados, tvos, macos | appstore, testflight |
| `viewer` | android, androidtv, firetv | play, amazon, managed |
| `viewer` | windows | msstore, direct, managed |
| `viewer` | linux | managed |
| `viewer` | tizen | samsung |
| `studio` | ios, ipados | appstore, testflight |
| `studio` | macos | direct (Sparkle) |
| `studio` | android | play, managed |
| `studio` | windows | msstore, direct, managed |
| `studio` | linux | managed |
| `tools` | windows, macos | direct (Velopack), managed (MSI) |
| `tools` | linux | managed (see [APPUPD-D9](#owner-decisions)) |
| `admin` | ios, ipados, macos | testflight |
| `admin` | android | play (internal) |
| `admin` | windows | managed (signed R2 link from admin-api) |

## 3. Single source of truth

### 3.1 The release manifest

Every release workflow (Desktop, Tools, Apple, Android; and Desktop's `release-admin-windows.yml`) publishes, as assets of the GitHub release for the tag:

- `app-release.json`: what this tag released;
- `app-release.json.sig`: `{ "keyId": "<8 hex>", "sig": "<base64 ed25519 over the exact bytes of app-release.json>" }`.

```json
{
  "schema": 1,
  "repo": "AlUmmahNowTools",
  "tag": "v2026.11.23",
  "version": "2026.11.23",
  "channel": "stable",
  "publishedAt": "2026-11-23T18:04:11Z",
  "notes": { "en": "Faster folder scans.", "ar": "فحص أسرع للمجلدات." },
  "artifacts": [
    { "app": "tools", "platform": "windows", "arch": "x64", "kind": "velopack-full",
      "url": "https://github.com/Al-Ummah-Now/AlUmmahNowTools/releases/download/v2026.11.23/AlUmmahNow.Tools-2026.11.23-win-full.nupkg",
      "sha256": "…", "size": 81234567 },
    { "app": "tools", "platform": "windows", "arch": "x64", "kind": "msi", "url": "…", "sha256": "…", "size": 0 }
  ],
  "stores": [ { "app": "viewer", "platform": "ios", "source": "appstore" } ]
}
```

- `notes` come from the store release-notes files the repos already keep (§1). CI fails the release if either language is missing or over 1,500 characters.
- `artifacts` lists every downloadable file with its SHA-256 (the same values as `SHA256SUMS.txt`). `kind` is one of `velopack-full`, `velopack-delta`, `sparkle-zip`, `msi`, `msix`, `zip`, `dmg`, `deb`, `flatpak`, `tar`, `apk`.
- `stores` lists the store builds the tag uploaded (TestFlight, Play internal, Microsoft Store draft). They are **not** "available" until the store says so ([§3.3](#33-store-availability)).
- Signing runs in a final CI step with the repo's `UPDATE_SIGNING_KEY` secret (an ed25519 private key, [§9](#9-owner-items-keys-and-certificates)). Without it, the manifest is still published, unsigned, with no `.sig` ([§5.5](#55-without-the-signing-key)).
- Draft GitHub releases (Desktop) are invisible until a person publishes them, so "published on GitHub" is what "released" means.

### 3.2 The index in api-videos

The hourly cron (`47 * * * *`) and the admin's **Refresh now** button run the indexer ([APPUPD-2](#11-stories)):

1. For each repo in a fixed list, read `https://github.com/Al-Ummah-Now/<repo>/releases.atom` (the public Atom feed; it lists pre-releases and costs no REST API quota, so it never competes with the shared GitHub token).
2. For each tag not yet indexed, fetch `…/releases/download/<tag>/app-release.json` and `.sig`, check the signature against the public keys in `UPDATE_PUBLIC_KEYS` (a non-secret wrangler variable, one or two keys per repo for rotation), and check `repo` and `tag` match where it was fetched from.
3. Store the result in the `APP_CONFIG` KV document `releases`: per `<app>/<platform>/<channel>`, the newest release (version, tag, notes, publishedAt, artifacts for that pair, `signed: true|false`), plus the previous five for the admin page.

Unsigned or wrongly signed manifests are indexed with `signed: false` and an admin **Errors** entry ([O26](decisions.md#o26-always-async-with-admin-visible-errors)); they never drive a self-install and only produce a notice with a download link. Reads are a few small HTTPS requests per hour.

Why pull instead of CI pushing to an endpoint: pulling needs **no write credential in four repos**, and the signature means the server, not GitHub, decides what to trust. Apps that self-install also verify the manifest **themselves** with the public key compiled into the app, so a compromised API can point at a release but cannot make an app install anything that was not signed in CI.

### 3.3 Store availability

A store build is uploaded long before users can get it (review, phased release). The index marks it available only when the store says so:

- **App Store, Mac App Store**: the indexer calls the public `https://itunes.apple.com/lookup?bundleId=<id>` for each production bundle id each hour; `version` there is what users can install. tvOS is not in that lookup; ViewerTV uses the `stores` entry and the notice is still correct because the App Store app shows the update when it exists.
- **TestFlight, Play, Microsoft Store**: no public lookup. The notice's *text and notes* come from our index; *availability* comes from the device API (Play In-App Updates, `StoreContext`), so a Play or Store user is told only when their store has the update. TestFlight builds show the notice from our index (the `stores` entry); TestFlight itself shows the build within minutes of processing.

### 3.4 Admin-set policy

The existing `versions` document keeps the **policy**, set by admins: per `<app>/<platform>` (or `<app>/*`), optionally per channel (`<app>/<platform>#beta`):

| Field | Meaning | Validation |
|---|---|---|
| `minimumVersion` | Builds below it see the forced screen | version format; **must not be above the latest released version** of that pair (server and editor) |
| `latestVersion` | Kept for old documents; now read-only, filled from the index | — |
| `storeUrl` | Store or download page when the index has none | `https://` |
| `notesOverride` | `{ en, ar }`, replaces CI notes for one version | both languages required ([Localized fields](../guides/product-rules.md)), each ≤ 1,500 |
| `message` | `{ en, ar }`, optional text on the forced screen ("This version can no longer sign in.") | both or neither |

The `config` document gains `updates.checkHours` (default 6, range 1–48) and `updates.autoInstallDefault` (default per [APPUPD-D5](#owner-decisions)).

## 4. API

### 4.1 `GET /api/v1/app-config` (public, extended, backwards compatible)

New optional query: `channel` (`stable|beta`, default `stable`), `source` (§2.3), `arch` (`x64|arm64`). New fields in `update`, old fields unchanged:

```json
{
  "update": {
    "enabled": true,
    "status": "recommended",
    "minimumVersion": "2026.11.10",
    "latestVersion": "2026.11.23",
    "storeUrl": "https://github.com/Al-Ummah-Now/AlUmmahNowTools/releases/tag/v2026.11.23",
    "channel": "stable",
    "publishedAt": "2026-11-23T18:04:11Z",
    "notes": { "en": "Faster folder scans.", "ar": "فحص أسرع للمجلدات." },
    "message": null,
    "action": "install",
    "url": "https://github.com/Al-Ummah-Now/AlUmmahNowTools/releases/tag/v2026.11.23",
    "manifestUrl": "https://github.com/Al-Ummah-Now/AlUmmahNowTools/releases/download/v2026.11.23/app-release.json",
    "signed": true,
    "checkHours": 6
  }
}
```

- `enabled: false` (switch off) → `status: "ok"`, every new field null. Nothing is shown.
- `action`: `store` (open the store), `install` (self-update from `manifestUrl`; only for `source=direct` and `signed: true`), `download` (open `url`), `none`.
- `notes` returns **both** languages; the app shows the one matching its own UI language ([English default](../guides/product-rules.md)).
- Still public, cacheable 300 s, no user data. `installId` stays optional and random per install.

### 4.2 Admin

admin-api (all `settings:manage`, audited in `site_settings_log`):

- `GET /api/app-config/releases` → the `releases` index: per app, platform and channel, latest version, published time, signed or not, notes, store availability, and the minimum version in force.
- `POST /api/app-config/releases/refresh` → runs the indexer now (one at a time; 429 while one runs).
- Minimum version, notes override and message are edited through the existing `PUT /api/app-config/versions`.

The admin page **App config** gains a **Releases** tab (default tab): a table per app (viewer, studio, tools, admin, kids hidden until it exists) with rows per platform and channel: *Latest*, *Released*, *Signed*, *In store*, *Minimum*, and an **Edit** action that opens the existing version editor for that row, prefilled. A minimum above the latest is refused under the field. **Refresh now** at the top. English and Arabic, ٠–٩ in Arabic.

## 5. Desktop self-update

### 5.1 The updater: Velopack (recommended), Sparkle for Studio for Mac

| Option | Stacks | Verdict |
|---|---|---|
| **Velopack** | .NET on Windows, macOS and Linux (AppImage); one `vpk pack` in CI; per-user install with no admin rights; delta packages; `UpdateManager` API with a pluggable update source; MIT; maintained (successor of Clowd.Squirrel) | **Recommended** for the Desktop viewer and Studio on Windows and for Tools on Windows and macOS: both are .NET, so one updater, one manifest flow, one set of tests |
| Squirrel.Windows / Clowd.Squirrel | Windows only | Unmaintained; Velopack replaces it |
| MSIX App Installer (`.appinstaller`) | Windows MSIX | Needs a trusted signing certificate before it works at all, and gives no in-app UI or "install automatically" control; fine for the Store, not for our downloads |
| WinSparkle | Windows, native | Not .NET; its own UI; second updater to maintain |
| Tauri updater / electron-updater | Tauri / Electron | Not our stacks |
| **Sparkle 2** | macOS native apps | **Confirmed** for **Studio for Mac** (SwiftUI, Developer ID, GitHub release): the standard updater for Mac apps outside the store, ed25519 (EdDSA) signatures on every archive, checks the Developer ID Team ID, and a custom user driver lets us show our own notice instead of its window. Never in Mac App Store builds ([§8](#8-store-rules-and-safety)) |

### 5.2 Packaging changes

- **Tools** (Windows, macOS): CI adds `vpk pack` for `win-x64`, `osx-arm64`, `osx-x64`, producing `Setup.exe` / `.pkg`, the full `.nupkg` and (from the second release) a delta `.nupkg`. These become the primary downloads; the MSI and `.dmg` stay for managed installs ([APPUPD-D2](#owner-decisions)). Uno's `Main` calls `VelopackApp.Build().Run()` first.
- **Desktop** (Windows, viewer and Studio): the same, next to the MSI, zip and MSIX. Velopack's per-user install and the MSIX are separate installs; the download page recommends one ([APPUPD-D2](#owner-decisions)).
- **Studio for Mac**: CI runs Sparkle's `sign_update` on the notarized `.zip` and publishes `appcast-studio-mac.xml` as a release asset; `SUFeedURL` is `https://github.com/Al-Ummah-Now/AlUmmahNowApple/releases/latest/download/appcast-studio-mac.xml`; `SUPublicEDKey` is the committed public key.
- **Linux** (Desktop `.deb`/Flatpak, Tools `.deb`/`.tar.gz`): notice and download link ([APPUPD-D9](#owner-decisions)).

### 5.3 The flow

1. **Check** 30 seconds after launch, then every `checkHours` (default 6), and on **Check now**. One request to `/api/v1/app-config`. Offline or an error: try again at the next interval; never a user-facing error except after **Check now** ("Couldn't check for updates. Try again later.").
2. **Verify the manifest** (`action: install` only): fetch `manifestUrl` and `.sig` over HTTPS; verify the ed25519 signature with a public key compiled into the app; check `version` equals `latestVersion`, is **higher** than the running version (no downgrades or replays of older signed manifests), and `repo` is this app's repo.
3. **Download** the `velopack-full` (or `velopack-delta`) artifact for this app, platform and arch, from an `https://github.com/Al-Ummah-Now/` or `objects.githubusercontent.com` URL only. A custom Velopack `IUpdateSource` builds Velopack's feed **from the verified manifest**, so Velopack's own SHA-256 check uses the signed hash. Any mismatch deletes the file and logs a warning; nothing is installed.
4. **Check the code signature** when the build carries signing config: Windows `WinVerifyTrust` on `Setup.exe`/the new main executable with the publisher subject pinned at build time; macOS `SecStaticCodeCheckValidity` with the Team ID pinned. Unsigned builds skip this step (the ed25519 check still applies).
5. **Install**:
   - *Install updates automatically* **on**: steps 2–4 run in the background; the bar says "Update ready. It installs when you close the app." with **Restart now**. Velopack applies it on exit (`WaitExitThenApplyUpdates`).
   - **off**: the bar says "Version ٢٠٢٦.١١.٢٣ is available." with **What's new** and **Update**. **Update** runs steps 2–4 with a progress line in the bar, then **Restart now**.
   - Studio and Tools never restart on their own while an upload, encode or import runs; **Restart now** is disabled with "Finish or pause your uploads first."
6. **Settings → Updates** (shown only when the switch is on and `source=direct`): current version, last checked time, **Install updates automatically** (on/off), **Check now** with its result line.

### 5.4 Microsoft Store and managed installs

`msstore` builds use `StoreContext`: on launch and every `checkHours`, `GetAppAndOptionalStorePackageUpdatesAsync`; when it finds one, the same bar with **Update** → `RequestDownloadAndInstallStorePackageUpdatesAsync` (the Store's own UI). `managed` builds show the bar with **Download**, which opens `url` in the browser.

### 5.5 Without the signing key

Until the owner provides `UPDATE_SIGNING_KEY` for a repo, its manifests are unsigned, the API answers `signed: false` and `action: download`, and every app shows the notice with a **Download** link to the release page. Self-install switches on by itself on the first signed release, with no app change.

## 6. Android

- **Play builds** (viewer, studio, viewer-tv Google flavor, admin-mobile on internal testing): `com.google.android.play:app-update` (`AppUpdateManager`).
  - On launch and on resume (at most every `checkHours`): `appUpdateInfo`. If `updateAvailability == UPDATE_AVAILABLE`:
    - our API says `required` and `IMMEDIATE` is allowed → start an **immediate** update (Play's full-screen flow). If the user backs out, the forced screen stays.
    - otherwise → our bar with **Update**, which starts a **flexible** update; on `DOWNLOADED`, the bar becomes "Update ready" with **Restart** (`completeUpdate()`).
  - If our API says `required` but Play has no update yet (rollout lag), the forced screen shows with **Open Play Store**.
  - Tests use `FakeAppUpdateManager`.
- **Fire TV (Amazon)**: no in-app update API. The bar (TV focusable) with **Update** opening `amzn://apps/android?p=net.alummahnow.tv`.
- **Sideloaded pre-release APK** (`managed`): the bar with **Download**, opening the GitHub release page in the browser. No in-app APK install ([APPUPD-D8](#owner-decisions)), so no `REQUEST_INSTALL_PACKAGES` permission, which Play forbids in Play builds anyway.
- **TV** (viewer-tv): the bar is a focusable row at the top of Home, reachable with the D-pad; Back dismisses it.

## 7. Apple

- **iOS, iPadOS, tvOS, Mac App Store builds and TestFlight** cannot install updates themselves. On launch and on return to the foreground (at most every `checkHours`), call the API; on `recommended`, the bar with **Update**:
  - `appstore`: `SKStoreProductViewController` with the app's App Store id (stays in the app; iOS/iPadOS), `macappstore://apps.apple.com/app/id<id>` on macOS, the App Store app on tvOS;
  - `testflight`: `itms-beta://` (opens TestFlight).
- On `required`: the forced screen with **Update** (same targets). Apple allows a "this version is no longer supported" screen; the app downloads no code ([§8](#8-store-rules-and-safety)).
- The App Store lookup confirms availability server-side (§3.3), so iOS users are never told about a version still in review.
- **Studio for Mac** (Developer ID): Sparkle 2 with a custom `SPUUserDriver` that drives our bar and Settings → Updates (same flow as §5.3; Sparkle verifies the EdDSA signature and the Developer ID Team ID before installing). Until the Developer ID and notarization secrets exist, Studio for Mac is ad hoc signed: Sparkle refuses to update ad hoc builds safely, so it shows **Download** instead ([§9](#9-owner-items-keys-and-certificates)).
- **Admin (iOS, iPadOS, Mac)**: TestFlight internal → the TestFlight path above.

## 8. Store rules and safety

- **Apple App Review 2.5.2**: apps may not download or install executable code; we only open the store. **Guideline 2.4.5(vii)**: Mac App Store apps are updated only through the Mac App Store, so Sparkle is compiled out of ViewerMac (and any future Mac App Store target) by a build setting checked in CI.
- **Google Play Device and Network Abuse policy**: a Play app may not update itself by any means other than Google Play. Play builds use only the In-App Updates API; the APK download link exists only in the non-Play flavor/source and the `REQUEST_INSTALL_PACKAGES` permission is never declared.
- **Microsoft Store 10.2.x**: Store builds are updated by the Store; the Velopack updater is not in the MSIX (the MSIX build defines `AUN_STORE`, and a test fails if the updater is reachable).
- **Integrity**: ed25519 over the manifest, SHA-256 per file, HTTPS only, host allowlist, no downgrades, code-signature check when configured. The private keys live only in GitHub Actions secrets; the public keys are in the repos and in the API's variables. Key rotation: each app accepts up to two public keys; a new key ships in one release before the old one stops signing.
- **Privacy**: the check sends app, platform, version, channel, source, arch, locale and the existing random `installId`; no account data. Desktop `store/microsoft/privacy.md`, Android `store/play/data-safety.md` and Apple privacy answers are updated in the same PRs.
- **A user is never locked out by mistake**: the forced screen appears only for `required`, which needs an admin to raise the minimum above the running version, and the editor refuses a minimum above the latest released version. Offline, an app uses its last known answer (AUN-FEATURES `lastKnownElseHidden`): it never blocks on a minimum it has not seen.

## 9. Owner items: keys and certificates

Nothing here is ever requested or stored by an agent. The orchestrator collects each value and puts it in the GitHub secret named. Every release keeps working without them (unsigned, download link only).

| # | Item | Secret / variable | Repo | Unlocks |
|---|---|---|---|---|
| K1 | ed25519 update signing key for Desktop (generate with `scripts/update-keygen` from [APPUPD-4](#11-stories); it prints the public key to commit and writes the private key to a file) | `UPDATE_SIGNING_KEY` | AlUmmahNowDesktop | signed manifests → self-install |
| K2 | the same for Tools | `UPDATE_SIGNING_KEY` | AlUmmahNowTools | signed manifests → self-install |
| K3 | the same for Apple (also Sparkle's EdDSA key) | `UPDATE_SIGNING_KEY` | AlUmmahNowApple | signed manifest, Sparkle appcast |
| K4 | the same for Android (manifest only; Play and the APK have their own signing) | `UPDATE_SIGNING_KEY` | AlUmmahNowAndroid | signed manifest |
| K5 | Windows code-signing certificate (OV or EV exported to PFX, or Azure Trusted Signing) | `WINDOWS_CERT_PFX_BASE64`, `WINDOWS_CERT_PASSWORD` | Desktop, Tools (same names) | signed `Setup.exe`/MSI, publisher pinning, no SmartScreen "unknown publisher" |
| K6 | Apple Developer ID Application certificate + App Store Connect API key | `DEVELOPER_ID_P12`, `DEVELOPER_ID_P12_PASSWORD`, `APPLE_TEAM_ID`, `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` | Apple, Tools (same names) | notarized Studio for Mac and Tools for Mac, Team ID pinning, Sparkle self-update |
| K7 | Play upload key + service account (already listed in Android `docs/RELEASE.md`) | `AUN_UPLOAD_*`, `PLAY_SERVICE_ACCOUNT_JSON` | Android | Play builds, so In-App Updates has something to find |
| K8 | App Store ids of each production app (not secret) | variables `APPSTORE_ID_VIEWER`, `APPSTORE_ID_STUDIO`, `APPSTORE_ID_VIEWER_MAC` | Apple | the in-app App Store sheet; lookup by bundle id works before that |

The four K1–K4 public keys also go in api-videos' `UPDATE_PUBLIC_KEYS` variable (not secret), in the same PR that commits them.

## 10. Costs

- `GET /api/v1/app-config`: one request per app launch and per `checkHours` per running install, cached 300 s at the edge; within the Workers requests already paid for at today's scale. One KV read per uncached request.
- Indexer: about 4 repos × (1 Atom read + new-tag fetches) + up to 6 App Store lookups per hour, on the existing hourly cron. One KV write per run that finds something new.
- Hosting: GitHub Releases for every file and manifest (free for public repos; GitHub does not meter release downloads). Delta packages keep downloads small. If the owner prefers our own domain ([APPUPD-D3](#owner-decisions)), R2 storage for a few GB is under $1/month with free egress.
- **Total: about $0/month.**

## 11. Stories

One PR each, in this order (server, then admin, then clients). Each is behind `appUpdates`.

| # | Story | Repo |
|---|---|---|
| APPUPD-1 | Shared types: `tools`, `admin` apps; 4-part versions; pre-release precedence in `compareAppVersions`; channel and source enums; manifest schema and ed25519 verify helper (WebCrypto `Ed25519`) with tests (tampered byte, wrong key, wrong repo, downgrade) | AlUmmahNow |
| APPUPD-2 | api-videos: the `appUpdates` switch (feature registry, default off); release indexer on the hourly cron (Atom feed, manifest + signature, App Store lookup) into KV `releases`; admin Errors on bad manifests; internal refresh route | AlUmmahNow |
| APPUPD-3 | api-videos: extend `GET /api/v1/app-config` (channel, source, arch, notes, action, url, manifestUrl, signed, checkHours, message); `minimumVersion ≤ latest` validation; OpenAPI; tests for the gate per source | AlUmmahNow |
| APPUPD-4 | Manifest tooling: `scripts/app-release/` (build `app-release.json` from release files and notes, sign, verify, keygen) as a small Node script copied into each app repo with a shared test vector, so all repos sign the same way | AlUmmahNow (source), each app repo |
| APPUPD-5 | Core: `aun-updates` crate: fetch app-config with the existing transport, compare versions, last-known answer, dismissed-per-version store, next-check scheduling; exposed through the bridges to Apple, Android and Desktop; also exposes `flags`/`config` (closes #1434's client row) | AlUmmahNowCore |
| APPUPD-6 | admin-api + admin-web: Releases tab, Refresh now, minimum/notes override/message editing with en+ar, minimum ≤ latest check; screenshots | AlUmmahNow |
| APPUPD-7 | Tools: Velopack packaging in `release.yml` + `app-release.json`; `UpdateService` (signed-manifest update source, host allowlist, downgrade guard, signature check hook); bar, forced screen, Settings → Updates; tests; screenshots | AlUmmahNowTools |
| APPUPD-8 | Desktop: the same for the Windows viewer and Studio; `StoreContext` path for Store builds; `managed` bar for MSI/Linux; Admin for Windows `managed` link; `app-release.json` in both release workflows | AlUmmahNowDesktop |
| APPUPD-9 | Android: notice bar + forced screen (phone and TV); Play In-App Updates; Amazon and sideload links; `app-release.json` in `release.yml` | AlUmmahNowAndroid |
| APPUPD-10 | Apple: notice bar + forced screen (iOS, iPadOS, tvOS, Mac); App Store sheet / TestFlight links; Sparkle 2 in StudioMac with appcast in `release.yml`, compiled out of Mac App Store targets; `app-release.json` | AlUmmahNowApple |
| APPUPD-11 | Wiki: per-app "How updates work" in each repo's release doc and the product rules; registry status | AlUmmahNowWiki + repos |

## 12. The notice

**Bar** (all apps): one line under the app header, the app's surface color, an info icon, never covering content, never animated. Text, then **What's new** (opens a small in-app sheet with the notes), then the action button, then a close (×) button with an accessible name. Closing hides it **for that version**; the next version shows it again. It is announced once to screen readers (polite live region). Right-to-left in Arabic. On TV it is a focusable row.

| State | English | Arabic |
|---|---|---|
| Available (store, download) | A new version, 2026.11.23, is available. · **Update** / **Download** | يتوفّر إصدار جديد، ٢٠٢٦.١١.٢٣. · **تحديث** / **تنزيل** |
| Downloading (desktop) | Downloading the update… 45% | جارٍ تنزيل التحديث… ٤٥٪ |
| Ready (desktop, Android flexible) | Update ready. It installs when you close the app. · **Restart now** | التحديث جاهز، ويُثبَّت عند إغلاق التطبيق. · **إعادة التشغيل الآن** |
| Busy (Studio, Tools) | Finish or pause your uploads first. | أكمِل عمليات الرفع أو أوقِفها مؤقتًا أولًا. |
| Failed check (Check now only) | Couldn't check for updates. Try again later. | تعذّر البحث عن تحديثات. حاول مرة أخرى لاحقًا. |
| Failed verification | The update couldn't be verified, so it wasn't installed. · **Download** | تعذّر التحقق من التحديث، لذلك لم يُثبَّت. · **تنزيل** |

**Forced screen** (below the minimum only): full window, app icon, "This version is no longer supported" / «لم يعد هذا الإصدار مدعومًا», the admin's optional message, the running and required versions, **Update** (or **Download**), and on desktop **Quit**. No close button. Version numbers use the app's digit formatter: Arabic shows ٠–٩ with the dots kept as `.` (a version is not a decimal number, so no «٫»).

**Settings → Updates** (desktop `direct` builds): "Version 2026.11.22", "Last checked: today at 3:04 PM", **Install updates automatically** switch, **Check now**.

## 13. Tests

- **Version comparison** (shared-types, Core, each app's thin wrapper): 3 vs 4 parts, pre-release precedence, `-qa` stripping, invalid strings. One shared table of cases (`spec/app-updates/versions.json` in Core) run by TypeScript, Rust, C#, Kotlin and Swift tests, so every platform agrees.
- **Minimum-version gate**: server unit tests per source and channel (switch off → `ok`; below minimum → `required`; equal → `ok`/`recommended`; beta channel sees the newer of beta and stable); editor refuses minimum > latest; client tests: last-known `required` blocks offline, never-seen does not.
- **Manifest signature** (server, Tools, Desktop, Apple Sparkle setup): valid signature; one flipped byte in the manifest (**tampered file**) → refused; one flipped byte in the downloaded package → SHA-256 mismatch, file deleted, nothing installed; wrong key; wrong repo; older version (replay) → refused; non-allowlisted host → refused; HTTP URL → refused. Test keys are generated per test run; no real key in any repo.
- **Indexer**: fixtures for the Atom feed, manifests, signatures and App Store lookup; no network in tests.
- **Notice UI**: unit tests for the state machine (available → downloading → ready, dismissed per version, busy, failed); Android Compose tests with `FakeAppUpdateManager`; Apple view tests; desktop view-model tests.
- **Store builds**: a test per platform that the updater is unreachable in App Store, Mac App Store, Play and MSIX builds.
- **Screenshots** (visual stories): the bar in each state and the forced screen, English and Arabic, light and dark, desktop and phone (and TV where it applies), into `review-shots/AUN-APP-UPDATES/<date>/head-<sha>/` with NOTES.md for the screenshot audit before merging.
- Release workflows: a dry-run PR job builds and verifies an `app-release.json` with a throwaway key.

## Owner decisions

1. **APPUPD-D1: turn `appUpdates` on when the first app ships the check?** Options: (a) on in QA and production as soon as APPUPD-3 and one client are released; (b) keep off until every platform has shipped. **Recommend (a)**: the minimum-version gate is the only way to stop a broken build already installed, and with no minimum set it only shows "new version" bars.
2. **APPUPD-D2: primary Windows (and Tools macOS) download.** Options: (a) Velopack `Setup.exe` / `.pkg` as the main download (per-user, updates itself), MSI and `.dmg` kept for managed installs; (b) keep MSI as the main download and only show a link. **Recommend (a)**: only (a) gives in-app updating without admin rights.
3. **APPUPD-D3: where update files live.** (a) GitHub Releases (free, already used); (b) R2 behind `updates.alummahnow.net` (under $1/month, our own domain, independent of GitHub). **Recommend (a)** now; the manifest format allows moving later without an app change because URLs come from the signed manifest.
4. **APPUPD-D4: signing keys.** (a) one ed25519 key per repo (K1–K4); (b) one key for the organization. **Recommend (a)**: a leaked key affects one repo's apps only.
5. **APPUPD-D5: "Install updates automatically" default.** (a) on (download in the background, install when the app closes, never restart on its own); (b) off. **Recommend (a)**; the admin can change the default with `updates.autoInstallDefault`, and the user's own choice always wins.
6. **APPUPD-D6: check interval.** Default 6 hours, admin-adjustable 1–48. **Recommend 6.**
7. **APPUPD-D7: beta channel.** (a) TestFlight, Play testing and preview-tag builds are told about the newest beta or stable version; (b) beta builds only about beta. **Recommend (a)**.
8. **APPUPD-D8: sideloaded Android APK.** (a) bar with a download link to the release page; (b) download and open the installer in the app (needs `REQUEST_INSTALL_PACKAGES`). **Recommend (a)**: smaller attack surface and no policy risk; it is a tester build.
9. **APPUPD-D9: Linux.** (a) notice and download link for `.deb`, Flatpak and `.tar.gz`; (b) also ship a Velopack AppImage for Tools and Desktop that updates itself. **Recommend (a)** now, (b) later if Linux users ask.
10. **APPUPD-D10: release notes.** (a) CI requires English and Arabic notes from the store notes files for every release, and admins can override per version; (b) admins write them on the App config page after each release. **Recommend (a)**.
11. **APPUPD-D11: K1–K8.** Provide the keys and certificates in [§9](#9-owner-items-keys-and-certificates) when ready. Nothing blocks the build; self-install switches on per repo when its key arrives.

## Build status

| Story | PR | State |
|---|---|---|
| Spec | this PR | open |
