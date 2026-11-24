[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# App updates: every app checks for a new version, tells the user, and desktop apps update themselves

| | |
|---|---|
| **ID** | `AUN-APP-UPDATES` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (shared-types, api-videos, admin-api, admin-web), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md), [AlUmmahNowTools](../repos/AlUmmahNowTools.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowWiki](https://github.com/Al-Ummah-Now/AlUmmahNowWiki) |
| **Status** | **building**: server and Core merged behind the `appUpdates` switch (default **off**); admin page and app clients next |
| **Last updated** | 2026-11-24 (routine decisions recorded; server and Core merged) |
| **Origin** | Owner requirement 2026-11-23, relayed by the orchestrator: "every desktop and native app checks for updates and tells the user when a new version is out. Desktop apps also let the user update from inside the app, either automatically or manually." |
| **Related** | [Epic 9](E09-native-platform-foundations.md) story 9.3/9.5 (`GET /api/v1/app-config`, built), issue [AlUmmahNow#413](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/413) (App config admin page, built), issue [AlUmmahNow#1434](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1434) (App config native client: this epic takes its forced-update part), [AUN-FEATURES](AUN-FEATURES-feature-switches.md), [AUN-ADMIN-NATIVE](AUN-ADMIN-NATIVE-native-admin-app.md), [Epic 23](E23-release-engineering.md) |

## Goal

Every native and desktop app knows, without a store release of its own, when a newer version is out and whether the running build is too old to keep working:

- **All apps** show a small, dismissible notice in English or Arabic when a new version is out, with an **Update** button that does the right thing for where the app came from (App Store, TestFlight, Play, Microsoft Store, a direct download).
- **Builds below the minimum version** that an admin sets show a full-screen "Please update" screen instead of the app. This is the only forced update, and it is the escape hatch for a broken or unsafe build already in users' hands.
- **Desktop apps installed from our own downloads** (the Desktop viewer and Studio on Windows, the Tools app on Windows, macOS and Linux, Studio for Mac) download, verify and install the update themselves, automatically or when the user clicks **Update**, then restart.
- **Nothing unverified is ever installed or offered.** Every self-installed update is checked against an ed25519 signature made in CI, and against the platform code signature once the owner's certificates exist. HTTPS only. A release whose signature is missing or wrong is never advertised, never installed and never linked; it goes to the admin **Errors** page ([§3.2](#32-the-index-in-api-videos), [§5.3](#53-the-flow)).
- **One source of truth** for the latest version per app, platform and channel: the signed release manifest each repo's release workflow publishes, indexed by api-videos and served through `GET /api/v1/app-config`. Admins see the current versions and set the minimum version on the existing **App config** page.

## Decisions and constraints

- **Feature switch** `appUpdates` on the Features page ([O39](decisions.md#o39-one-features-page-server-enforced), [AUN-FEATURES](AUN-FEATURES-feature-switches.md)), **default off**. The server enforces it: while it is off, `GET /api/v1/app-config` answers `update.status: "ok"` with no notice data, so no app shows anything. Because the minimum-version gate is the escape hatch for a bad build, it goes on in QA and production as soon as the first app release with the check is out (owner, 2026-11-24, [APPUPD-D1](#owner-decisions)).
- **Not tier-gated.** Updates are not a creator capability; every user of every app gets them. The admin settings (minimum version, forced-screen message, check interval, release-note overrides) are site-wide operational values with an audit row ([#1434](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1434) "operational values are admin-managed"). **Only super admins edit them**, as #1434 lists; admins with `settings:manage` see them read-only ([§4.2](#42-admin)).
- **Store rules come first** ([§8](#8-store-rules-and-safety)). App Store, Mac App Store, TestFlight, Play and Microsoft Store builds never download or install code themselves; they only open their store. Self-updating is only for builds we distribute ourselves.
- **No browser-style prompts** ([No browser prompts](../guides/product-rules.md)): the notice is an in-app bar; the forced screen and "Restart now?" are in-app views, never `confirm`/`alert` or a system dialog we raise ourselves (store sheets the OS shows are fine).
- **Hidden when off** ([Product rules](../guides/product-rules.md)): no "updates are disabled" text anywhere for users. The Settings **Updates** section on desktop shows only while the switch is on and the build can self-update.
- **Arabic** uses ٠–٩ through each app's shared digit formatter ([Numbers and dates](../guides/numbers-and-dates.md)), Arabic commas «،», and «مرئي/مرئيات» where videos are named.
- **Never store or ask for secrets in agents.** Every key and certificate below is an owner item; the orchestrator collects it. Every release workflow already builds unsigned when a secret is missing, with a `::notice::`; the update path follows the same rule, failing closed: until a repo has its signing keys, its downloaded builds get **no** update notice at all; store builds still get theirs, because the store is the channel ([§5.5](#55-before-a-repo-has-its-signing-keys)).
- **Costs**: about $0 a month ([§10](#10-costs)).

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

**Issue #1434.** Its "App config admin page" part is already built (#413). Its "Minimum supported version / forced update" part is this epic ([APPUPD-3](#11-stories), [APPUPD-6](#11-stories) and the client stories), with its super-admin-only editing; its "remote config + feature flags channel" part is covered by the Core client in [APPUPD-5](#11-stories) (the same fetch returns `flags` and `config`). When those stories merge, #1434 is narrowed to its remaining rows (telemetry sampling and sync intervals, which read `config` keys through the same client).

**AUN-FEATURES.** [AUN-FEATURES](AUN-FEATURES-feature-switches.md) §6.1 and §8 gave the Core app-config path fix to FEAT-11 and "forced update" to the client stories FEAT-12 (Apple), FEAT-13 (Android) and FEAT-14 (Desktop). To build one update screen once, the **forced-update screen moves to this epic** (APPUPD-8, -9, -10); FEAT-12 to FEAT-14 keep everything else, and the AUN-FEATURES page says so. Core's generated client still calls `/api/app-config` (AlUmmahNowCore `crates/aun-api/src/generated.rs`, `get_AppConfigGet`), not `/api/v1/app-config`: **APPUPD-5 depends on FEAT-11's path fix** (regenerate from `spec/openapi/api-videos.json`). If FEAT-11 has not merged when APPUPD-5 starts, APPUPD-5 makes only the path fix and FEAT-11 keeps the rest.

## 2. Versions, channels and install sources

### 2.1 Version formats

| Repo | Tag | Version the app reports | Example |
|---|---|---|---|
| Desktop | `vX.Y.Z`, `vX.Y.Z-preview.N`; Admin for Windows `admin-windows-vX.Y.Z` | `X.Y.Z[-preview.N]` | `1.4.2`, `1.5.0-preview.3` |
| Apple | `vX.Y.Z[-N]`; staff Admin app `admin-vX.Y.Z[-N]` | `X.Y.Z.N`: `CFBundleShortVersionString` plus the rebuild number `N` (the last two digits of `CFBundleVersion`, `scripts/release-version.sh`; 0 when absent) | `1.2.3.0`, `1.2.3.2` (tag `v1.2.3-2`) |
| Tools | `vYYYY.MM.DD[.N]` | `YYYY.MM.DD[.N]` | `2026.11.22`, `2026.11.22.2` |
| Android | `vYYYY.MM.DD[.N]` | `versionName` without the `-qa` suffix | `2026.11.14.2` |

**Release tags** have one of three prefixes, read by one shared parser (shared-types `parseAppReleaseTag`, aun-core `parse_release_tag`, the release tool; shared cases in AlUmmahNowCore `spec/app-updates/tags.json`): `v` (any app), `admin-v` (AlUmmahNowApple's staff Admin app) and `admin-windows-v` (AlUmmahNowDesktop's Admin for Windows). A manifest whose tag has an `admin-` prefix may list only `admin` builds (Android's Admin app ships in the normal `v` release, so a `v` tag may list it), and a manifest's `version` must be its tag's. The version is the tag without its prefix, with a trailing `-N` of one or two digits read as the 4th part (`admin-v1.2.3-2` → `1.2.3.2`).

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
| `admin` | windows | managed: **Download** opens the videos admin's staff-only Apps page, which mints a short-lived signed link to the private R2 file ([§3.6](#36-staff-only-admin-releases)) |

## 3. Single source of truth

### 3.1 The release manifest

Every public release workflow (Desktop `release.yml`, Tools, Apple `release.yml`, Android) publishes, as assets of the GitHub release for the tag (the staff-only admin workflows publish the same files privately, [§3.6](#36-staff-only-admin-releases)):

- `app-release.json`: what this tag released;
- `app-release.json.sig`: `{ "signatures": [ { "keyId": "<8 hex>", "sig": "<base64 ed25519 over the exact bytes of app-release.json>" } ] }`. One signature normally; two while a key is being replaced ([§3.5](#35-keys-rotation-and-revocation)). A verifier accepts the manifest when **any** signature is valid under a key it trusts and that is not revoked.

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
  "stores": [ { "app": "viewer", "platform": "ios", "source": "appstore" } ],
  "yanked": []
}
```

- `yanked` lists earlier versions of this repo that must never be offered again (a release found broken or unsafe). An app remembers every `yanked` list it has verified ([§5.3](#53-the-flow)).

- `notes` come from the store release-notes files the repos already keep (§1). CI fails the release if either language is missing or over 1,500 characters.
- `artifacts` lists every downloadable file with its SHA-256 (the same values as `SHA256SUMS.txt`). `kind` is one of `velopack-full`, `velopack-delta`, `sparkle-zip`, `msi`, `msix`, `zip`, `dmg`, `deb`, `flatpak`, `tar`, `apk`.
- `stores` lists the store builds the tag uploaded (TestFlight, Play internal, Microsoft Store draft). They are **not** "available" until the store says so ([§3.3](#33-store-availability)).
- Signing runs in a final CI step with the repo's `UPDATE_SIGNING_KEY` secret (an ed25519 private key, [§9](#9-owner-items-keys-and-certificates)). Without it, the manifest is still published, unsigned, with no `.sig`; it is only listed on the admin page ([§5.5](#55-before-a-repo-has-its-signing-keys)).
- Draft GitHub releases (Desktop) are invisible until a person publishes them, so "published on GitHub" is what "released" means.

### 3.2 The index in api-videos

The hourly cron (`47 * * * *`) and the admin's **Refresh now** button run the indexer ([APPUPD-2](#11-stories)):

1. For each repo in a fixed list, read `https://github.com/Al-Ummah-Now/<repo>/releases.atom` (the public Atom feed; it lists pre-releases and costs no REST API quota, so it never competes with the shared GitHub token).
2. For each tag not yet indexed, fetch `…/releases/download/<tag>/app-release.json` and `.sig`, check the signatures against the repo's current trusted keys ([§3.5](#35-keys-rotation-and-revocation)), and check `repo` and `tag` match where it was fetched from.
3. Store the result in the `APP_CONFIG` KV document `releases`: per `<app>/<platform>/<channel>`, the newest release (version, tag, notes, publishedAt, artifacts for that pair, `signed`), plus the previous five for the admin page. A version listed as `yanked` by a later verified manifest leaves the index.

**Fail closed.** Each repo is in one of two states:

| Repo state | Manifest | What happens |
|---|---|---|
| **No keys yet** (no trusted key for the repo: K1–K4 not provided) | no `.sig` | Listed on the admin page as "Unsigned: signing key not set up". **No app is told about it**: downloaded builds get no notice; store builds are told only through their store ([§5.5](#55-before-a-repo-has-its-signing-keys)). |
| **Keys set up** | valid signature | Indexed and served. |
| **Keys set up** | `.sig` missing, signature wrong, unknown or revoked key, `repo`/`tag` mismatch, bad schema | **Quarantined**: never indexed, never advertised, no download link anywhere; one admin **Errors** item per tag ([O26](decisions.md#o26-always-async-with-admin-visible-errors)) with what failed. |

A repo moves from "no keys yet" to "keys set up" once, when its key list is first published ([§3.5](#35-keys-rotation-and-revocation)); it never goes back, so stripping a signature can't downgrade a repo to the unsigned path. Reads are a few small HTTPS requests per hour.

Why pull instead of CI pushing to an endpoint: pulling needs **no write credential in four repos**, and the signature means the server, not GitHub, decides what to trust. Apps that self-install also verify the manifest **themselves** with the public key compiled into the app, so a compromised API can point at a release but cannot make an app install anything that was not signed in CI.

### 3.3 Store availability

A store build is uploaded long before users can get it (review, phased release). The index marks it available only when the store says so:

- **App Store, Mac App Store**: the indexer calls the public `https://itunes.apple.com/lookup?bundleId=<id>` for each production bundle id each hour; `version` there is what users can install. tvOS is not in that lookup; ViewerTV uses the `stores` entry and the notice is still correct because the App Store app shows the update when it exists.
- **Play, Microsoft Store**: no public lookup. The notice's *text and notes* come from our index; *availability* comes from the device API (Play In-App Updates, `StoreContext`), so a Play or Store user is told only when their store has the update, including staged rollouts.
- **TestFlight, Amazon**: no lookup and no device API. A store upload counts as available only when a super admin marks it **Available** on the Releases tab for that source (one click, audited). Until then those builds get no notice.

### 3.4 Admin-set policy

The existing `versions` document keeps the **policy**, set by super admins: per `<app>/<platform>` (or `<app>/*`), optionally per channel (`<app>/<platform>#beta`):

| Field | Meaning | Validation |
|---|---|---|
| `minimumVersion` | Builds below it must update ([§3.7](#37-the-minimum-version-gate)) | version format; **must not be above the newest version available to every install source of that pair** (signed manifest for `direct`/`managed`, App Store lookup for `appstore`, the admin's **Available** mark for `testflight`/`amazon`; Play and Microsoft Store are confirmed on the device); checked by the server and the editor |
| `latestVersion` | Kept for old documents; now read-only, filled from the index | — |
| `storeUrl` | Store page when the index has none | `https://` |
| `notesOverrides` | `{ "<version>": { en, ar } }`: replaces CI notes **for that version only**; ignored for any other version, and entries older than the latest release are dropped on the next save (at most 5) | version format; both languages required ([Localized fields](../guides/product-rules.md)), each ≤ 1,500 |
| `message` | `{ en, ar }`, optional text on the forced screen ("This version can no longer sign in.") | both or neither |

### 3.5 Keys, rotation and revocation

A key that is replaced must not strand users who skip releases, and a stolen key must be revocable. So each repo has two kinds of ed25519 key:

- **Root key** (one per repo, K-R in [§9](#9-owner-items-keys-and-certificates)): **offline**, held by the owner, never in CI. It signs only the repo's **key list**. Its public key is compiled into every build.
- **Release keys** (K1–K4): in CI as `UPDATE_SIGNING_KEY`; they sign manifests.

The **key list** `update-keys.json` (+ `update-keys.json.sig` by the root key) is a rolling asset of a fixed GitHub release named `update-keys` in each repo (and a copy in the private admin bucket):

```json
{ "schema": 1, "repo": "AlUmmahNowTools", "serial": 3,
  "keys": [ { "keyId": "1a2b3c4d", "publicKey": "<base64>" }, { "keyId": "5e6f7a8b", "publicKey": "<base64>" } ],
  "revoked": [ "0badc0de" ],
  "yanked": [ "2026.11.22" ] }
```

- Every build ships the root public key and the key list current at build time. On each update check it fetches the key list (the API also returns it inline, `update.keys`, so one request is enough), verifies the root signature, and accepts it only if `serial` is **higher** than the one it has stored; it then stores it. A key in `revoked` is never trusted again, even if a later list omits it.
- **Rotation without a bridge release**: add the new release key to the key list (serial +1, signed with the root key), start signing manifests with both keys, then drop the old one from CI. A user who skipped every release in between still has the root key, so their app accepts the new list, then the new key. Tested: a build from before the rotation updates straight to a build signed only with the new key.
- **Revocation**: the owner signs a list with the stolen key in `revoked` (and any versions it signed in `yanked`), and publishes it. Every app that checks for updates stops trusting that key within one check interval. A stolen release key can't revoke or add keys, because only the root key signs the list. Root-key loss is out of scope (offline, owner-held); losing it means shipping a new build with a new root key through each store or download page.
- **Sparkle** (Studio for Mac) has one `SUPublicEDKey` per build. Sparkle allows changing it when the update is also signed with the same Apple Developer ID, which our releases are once K6 exists; until then Studio for Mac doesn't self-update ([§7](#7-apple)). On top of Sparkle's own EdDSA check, our `SPUUpdaterDelegate` (`updater(_:shouldProceedWithUpdate:updateCheck:)`) refuses an item unless its `app-release.json` verifies under the key list, so revocation and `yanked` apply to Sparkle too.

### 3.6 Staff-only admin releases

The admin apps never get a public GitHub release (AlUmmahNowApple `admin-release.yml`: TestFlight internal only; AlUmmahNowDesktop `release-admin-windows.yml`: private R2 bucket `ADMIN_RELEASE_BUCKET`), so the Atom feed can't see them, and they must stay private. Their workflows sign the same `app-release.json` (and copy the key list) into the **private** bucket under `app-releases/<repo>/<tag>/`, and write `app-releases/<repo>/index.json` listing the tags. api-videos binds that bucket read-only (`ADMIN_RELEASES`) and the indexer reads it the same way as the feed, with the same signature rules. The public `GET /api/v1/app-config` answers `app=admin` with versions and the minimum only: no notes and no file links; **Download** opens the videos admin's staff-only Apps page, which signs a short-lived link for a signed-in staff member. The Apple admin workflow needs write access to that bucket (K10).

### 3.7 The minimum-version gate

`required` never strands a user without an update they can get:

- The editor and the server refuse a minimum above what every install source can obtain ([§3.4](#34-admin-set-policy)).
- When `required` arrives, the app shows the **forced screen** only if its own source confirms an update: Play `UPDATE_AVAILABLE`, `StoreContext` finds one, a signed manifest verifies (`direct`), or the server says the store has it (App Store lookup, admin's Available mark). Otherwise it shows a bar that can't be closed, "This version will stop working soon. Update when your store offers it.", and the app keeps working.
- Offline, an app uses its last known answer: a minimum it has already seen shows the bar that can't be closed (never the forced screen, since it can't confirm an update), and it never acts on a minimum it has not seen.

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
    "tag": "v2026.11.23",
    "signed": true,
    "available": true,
    "checkHours": 6,
    "keys": { "list": "<update-keys.json text>", "sig": "<update-keys.json.sig text>" }
  }
}
```

- `enabled: false` (switch off) → `status: "ok"`, every new field null. Nothing is shown.
- `action`: `store` (open the store), `install` (self-update from `manifestUrl`; only for `source=direct` and a signed release), `download` (open `url`; only for `managed` and a signed release, or the staff Apps page for `admin`), `none`. An unsigned or quarantined release always gives `none`.
- `available`: whether the server knows the client's source can get `latestVersion` now ([§3.3](#33-store-availability)); clients with a device API check for themselves.
- `keys`: the repo's root-signed key list, verified by the app, never trusted because the API sent it.
- New `POST /api/v1/app-config/update-failure` (public, rate-limited per IP, no user data): an app reports a failed verification (`repo`, `tag`, `reason`); the server turns it into one admin **Errors** item per repo, tag and reason.
- `notes` returns **both** languages; the app shows the one matching its own UI language ([English default](../guides/product-rules.md)).
- Still public, cacheable 300 s, no user data. `installId` stays optional and random per install.

### 4.2 Admin

admin-api (audited in `site_settings_log`):

- `GET /api/app-config/releases` (`settings:manage`) → the `releases` index: per app, platform and channel, latest version, published time, signed / unsigned / quarantined, notes, store availability, and the minimum version in force.
- `POST /api/app-config/releases/refresh` (`settings:manage`) → runs the indexer now (one at a time; 429 while one runs).
- `PUT /api/app-config/releases/available` (**super admin**) → marks a TestFlight or Amazon upload available.
- `PUT /api/app-config/versions` (now **super admin** only; was `settings:manage`): minimum version, notes overrides and message. `flags` and `config` keep `settings:manage` until #1434's remaining rows decide otherwise.

The admin page **App config** gains a **Releases** tab (default tab): a table per app (viewer, studio, tools, admin, kids hidden until it exists) with rows per platform and channel: *Latest*, *Released*, *Signature* (signed, unsigned: key not set up, quarantined), *Available* per source, *Minimum*, and for super admins an **Edit** action that opens the existing version editor for that row, prefilled, and **Mark available** for TestFlight and Amazon uploads. A minimum above what every source can get is refused under the field, naming the source. **Refresh now** at the top. English and Arabic, ٠–٩ in Arabic.

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
2. **Update the key list**: verify `update.keys` with the compiled-in root key; keep it only if its `serial` is higher than the stored one ([§3.5](#35-keys-rotation-and-revocation)).
3. **Verify the manifest** (`action: install` only): fetch `manifestUrl` and `.sig` over HTTPS; accept it only if a signature is valid under a trusted, non-revoked key, and:
   - `repo` is this app's repo, `tag` equals the API's `tag`, and `channel` is this build's channel (or `stable` for a beta build);
   - `version` equals `latestVersion` and is **higher** than the running version (no downgrade);
   - `version` is not below the highest version this app has ever verified in a manifest (stored), and not in any `yanked` list it has verified (key list or manifests).

   **What this does and doesn't stop.** Only releases CI actually signed can be installed; a stolen GitHub account or API can't make one. Someone who controls both the API and the GitHub releases could still offer an *older signed* release that is newer than the installed one and that this app has never seen superseded, or withhold newer ones. `yanked` (signed by CI in later manifests, or by the root key in the key list) closes that for any release we know is bad: yank it, and no app installs it once it has seen the yank.
4. **Download** the `velopack-full` (or `velopack-delta`) artifact for this app, platform and arch. Redirects are followed by hand (at most 5), and **every hop** must be HTTPS on an allowed host: `github.com` (path `/Al-Ummah-Now/<repo>/releases/download/`), `objects.githubusercontent.com` or `release-assets.githubusercontent.com` (GitHub's current asset host). The list is compiled into the app; moving files elsewhere (APPUPD-D3) needs one release that adds the host first. A custom Velopack `IUpdateSource` builds Velopack's feed **from the verified manifest**, so Velopack's own SHA-256 check uses the signed hash. Any mismatch deletes the file; nothing is installed.
5. **Check the code signature** when the build carries signing config: Windows `WinVerifyTrust` on `Setup.exe`/the new main executable with the publisher subject pinned at build time; macOS `SecStaticCodeCheckValidity` with the Team ID pinned. Unsigned builds skip this step (the ed25519 check still applies).
6. **Any failure in steps 2–5** stops the update: nothing is installed, the bar disappears, **no download link is offered**, and the app reports it to `POST /api/v1/app-config/update-failure` (an admin **Errors** item). The next check tries again.
7. **Install**:
   - *Install updates automatically* **on**: steps 2–6 run in the background; the bar says "Update ready. It installs when you close the app." with **Restart now**. Velopack applies it on exit (`WaitExitThenApplyUpdates`).
   - **off**: the bar says "Version ٢٠٢٦.١١.٢٣ is available." with **What's new** and **Update**. **Update** runs steps 2–5 with a progress line in the bar, then **Restart now**.
   - Studio and Tools never restart on their own while an upload, encode or import runs; **Restart now** is disabled with "Finish or pause your uploads first."
8. **Settings → Updates** (shown only when the switch is on and `source=direct`): current version, last checked time, **Install updates automatically** (on/off), **Check now** with its result line.

### 5.4 Microsoft Store and managed installs

`msstore` builds use `StoreContext`: on launch and every `checkHours`, `GetAppAndOptionalStorePackageUpdatesAsync`; when it finds one, the same bar with **Update** → `RequestDownloadAndInstallStorePackageUpdatesAsync` (the Store's own UI). `managed` builds show the bar with **Download**, which opens `url` in the browser, only for a signed release of a repo whose keys are set up.

### 5.5 Before a repo has its signing keys

Until the owner provides a repo's root key and `UPDATE_SIGNING_KEY` (K-R, K1–K4), its manifests are unsigned and the API answers `action: none` for its `direct` and `managed` builds: **those builds show no update notice**, and the Settings **Updates** section shows only the current version. Store builds of the same repo are unaffected: their store is the trusted channel. Unsigned releases are listed on the admin page so staff can see what shipped. The first signed release turns notices and self-install on with no app change, because each build already carries the root public key from APPUPD-7/8/10 onward. (Builds released before the root key existed can't verify anything; they keep the notice off and are moved on by the minimum-version gate through their store or by a manual download.)

## 6. Android

- **Play builds** (viewer, studio, viewer-tv Google flavor, admin-mobile on internal testing): `com.google.android.play:app-update` (`AppUpdateManager`).
  - On launch and on resume (at most every `checkHours`): `appUpdateInfo`. If `updateAvailability == UPDATE_AVAILABLE`:
    - our API says `required` and `IMMEDIATE` is allowed → start an **immediate** update (Play's full-screen flow). If the user backs out, the forced screen stays.
    - otherwise → our bar with **Update**, which starts a **flexible** update; on `DOWNLOADED`, the bar becomes "Update ready" with **Restart** (`completeUpdate()`).
  - If our API says `required` but Play has no update for this device yet (review, processing, staged rollout), **no forced screen**: the bar that can't be closed ([§3.7](#37-the-minimum-version-gate)), and the app keeps working.
  - Tests use `FakeAppUpdateManager`.
- **Fire TV (Amazon)**: no in-app update API. The bar (TV focusable) with **Update** opening `amzn://apps/android?p=net.alummahnow.tv`.
- **Sideloaded pre-release APK** (`managed`): once the Android repo's keys are set up, the bar with **Download**, opening the GitHub release page of a **signed** release in the browser; before that, no notice ([§5.5](#55-before-a-repo-has-its-signing-keys)). No in-app APK install ([APPUPD-D8](#owner-decisions)), so no `REQUEST_INSTALL_PACKAGES` permission, which Play forbids in Play builds anyway.
- **TV** (viewer-tv): the bar is a focusable row at the top of Home, reachable with the D-pad; Back dismisses it.

## 7. Apple

- **iOS, iPadOS, tvOS, Mac App Store builds and TestFlight** cannot install updates themselves. On launch and on return to the foreground (at most every `checkHours`), call the API; on `recommended`, the bar with **Update**:
  - `appstore`: `SKStoreProductViewController` with the app's App Store id (stays in the app; iOS/iPadOS), `macappstore://apps.apple.com/app/id<id>` on macOS, the App Store app on tvOS;
  - `testflight`: `itms-beta://` (opens TestFlight).
- On `required`: the forced screen with **Update** (same targets) when the server says the store has the update (`available`); otherwise the bar that can't be closed ([§3.7](#37-the-minimum-version-gate)). Apple allows a "this version is no longer supported" screen; the app downloads no code ([§8](#8-store-rules-and-safety)).
- The App Store lookup confirms availability server-side (§3.3), so iOS users are never told about a version still in review.
- **Studio for Mac** (Developer ID): Sparkle 2 with a custom `SPUUserDriver` that drives our bar and Settings → Updates (same flow as §5.3; Sparkle verifies the EdDSA signature and the Developer ID Team ID before installing). Before installing, our `SPUUpdaterDelegate` checks the item's `app-release.json` against the key list ([§3.5](#35-keys-rotation-and-revocation)). Until the Developer ID and notarization secrets exist (K6), Studio for Mac is ad hoc signed and Sparkle can't update it safely, so it shows no update notice ([§9](#9-owner-items-keys-and-certificates)).
- **Admin (iOS, iPadOS, Mac)**: TestFlight internal → the TestFlight path above.

## 8. Store rules and safety

- **Apple App Review 2.5.2**: apps may not download or install executable code; we only open the store. **Guideline 2.4.5(vii)**: Mac App Store apps are updated only through the Mac App Store, so Sparkle is compiled out of ViewerMac (and any future Mac App Store target) by a build setting checked in CI.
- **Google Play Device and Network Abuse policy**: a Play app may not update itself by any means other than Google Play. Play builds use only the In-App Updates API; the APK download link exists only in the non-Play flavor/source and the `REQUEST_INSTALL_PACKAGES` permission is never declared.
- **Microsoft Store 10.2.x**: Store builds are updated by the Store; the Velopack updater is not in the MSIX (the MSIX build defines `AUN_STORE`, and a test fails if the updater is reachable).
- **Integrity**: ed25519 over the manifest, SHA-256 per file, HTTPS only, host allowlist on every redirect hop, no downgrades, `yanked` versions refused, code-signature check when configured. Release keys live only in GitHub Actions secrets; root keys stay offline with the owner; public keys are in the builds and the API's variables. Rotation and revocation go through the root-signed key list ([§3.5](#35-keys-rotation-and-revocation)).
- **Privacy**: the check sends app, platform, version, channel, source, arch, locale and the existing random `installId`; no account data. Desktop `store/microsoft/privacy.md`, Android `store/play/data-safety.md` and Apple privacy answers are updated in the same PRs.
- **A user is never locked out by mistake** ([§3.7](#37-the-minimum-version-gate)): the minimum can't be set above what every install source can obtain, the forced screen needs the app's own source to confirm an update, and otherwise the app stays usable behind a bar. Offline, an app uses its last known answer (AUN-FEATURES `lastKnownElseHidden`): it never blocks on a minimum it has not seen.
- **Fail closed**: a missing or wrong signature, a revoked key, a yanked version, a foreign host on any redirect hop or a hash mismatch means no install and no link; the admin sees it on the Errors page ([§3.2](#32-the-index-in-api-videos), [§5.3](#53-the-flow)).

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
| K-R | **Root key** per repo (Desktop, Tools, Apple, Android): generated with `scripts/update-keygen --root` on the owner's own machine, kept **offline** (never a GitHub secret). The owner signs each key list with `scripts/update-keys sign` and gives the orchestrator only the signed `update-keys.json` + `.sig` to publish | none (offline); public key committed | each app repo | key lists: rotation and revocation ([§3.5](#35-keys-rotation-and-revocation)); without it no repo leaves "no keys yet" |
| K10 | Write access for AlUmmahNowApple's `admin-release.yml` to the private admin release bucket (an R2 API token limited to `app-releases/` in that bucket) | `ADMIN_RELEASES_R2_ACCESS_KEY_ID`, `ADMIN_RELEASES_R2_SECRET_ACCESS_KEY` | Apple | Admin for iPhone, iPad and Mac versions in the index ([§3.6](#36-staff-only-admin-releases)) |

The root public keys (K-R) go in api-videos' `UPDATE_ROOT_KEYS` variable (not secret) and into each repo's build, in the same PR that commits them; release keys (K1–K4) reach the server and the apps only through the root-signed key list. api-videos also binds the private admin bucket read-only as `ADMIN_RELEASES` (a binding in its wrangler config, no secret).

## 10. Costs

- `GET /api/v1/app-config`: one request per app launch and per `checkHours` per running install, cached 300 s at the edge; within the Workers requests already paid for at today's scale. One KV read per uncached request.
- Indexer: about 4 repos × (1 Atom read + new-tag fetches) + up to 6 App Store lookups per hour, on the existing hourly cron. One KV write per run that finds something new.
- Hosting: GitHub Releases for every file and manifest (free for public repos; GitHub does not meter release downloads). Delta packages keep downloads small. If the owner prefers our own domain ([APPUPD-D3](#owner-decisions)), R2 storage for a few GB is under $1/month with free egress.
- **Total: about $0/month.**

## 11. Stories

One PR each, in this order (server, then admin, then clients). Each is behind `appUpdates`.

| # | Story | Repo |
|---|---|---|
| APPUPD-1 | Shared types: `tools`, `admin` apps; 3- and 4-part versions (Apple `X.Y.Z.N` rebuilds); pre-release precedence in `compareAppVersions` (flag rules keep `compareAppVersionCores`); channel and source enums; manifest schema and ed25519 verify helper (WebCrypto `Ed25519`) with tests (tampered byte, wrong key, wrong repo, downgrade) | AlUmmahNow |
| APPUPD-2 | api-videos: the `appUpdates` switch (feature registry, default off); release indexer on the hourly cron (Atom feed, private admin bucket, App Store lookup) into KV `releases`; root-signed key lists; fail-closed states (no keys yet / signed / quarantined) with admin Errors; internal read and refresh routes | AlUmmahNow |
| APPUPD-3 | api-videos: extend `GET /api/v1/app-config` (channel, source, arch, notes, action, url, manifestUrl, tag, signed, available, keys, checkHours, message); per-source minimum validation; version-keyed notes overrides; `POST /api/v1/app-config/update-failure`; OpenAPI; tests for the gate per source | AlUmmahNow |
| APPUPD-4 | Manifest tooling: `scripts/app-release/` (build `app-release.json` from release files and notes, sign with one or two keys, verify, keygen, key-list sign) as a small Node script copied into each app repo with a shared test vector, so all repos sign the same way | AlUmmahNow (source), each app repo |
| APPUPD-5 | Core: `aun-updates` crate: fetch app-config with the existing transport (**after FEAT-11's `/api/v1/app-config` path fix**, or with only that fix if FEAT-11 hasn't merged), compare versions, key list verify and store, last-known answer, dismissed-per-version store, next-check scheduling; exposed through the bridges to Apple, Android and Desktop; also exposes `flags`/`config` (closes #1434's client row) | AlUmmahNowCore |
| APPUPD-6 | admin-api + admin-web: Releases tab, Refresh now, Mark available, super-admin-only versions editing (minimum, version-keyed notes overrides, message, en+ar), per-source minimum check; screenshots | AlUmmahNow |
| APPUPD-7 | Tools: Velopack packaging in `release.yml` + signed `app-release.json`; `UpdateService` (signed-manifest update source, key list, redirect-hop host allowlist, downgrade/yank guards, code-signature hook, failure report); bar, forced screen, Settings → Updates; tests; screenshots | AlUmmahNowTools |
| APPUPD-8 | Desktop: the same for the Windows viewer and Studio; `StoreContext` path for Store builds; `managed` bar for MSI/Linux; forced-update screen (moved here from AUN-FEATURES FEAT-14); Admin for Windows staff link; manifests in both release workflows (the admin one to the private bucket) | AlUmmahNowDesktop |
| APPUPD-9 | Android: notice bar + forced screen (phone and TV; moved here from FEAT-13); Play In-App Updates; Amazon and signed sideload links; `app-release.json` in `release.yml` | AlUmmahNowAndroid |
| APPUPD-10 | Apple: notice bar + forced screen (iOS, iPadOS, tvOS, Mac; moved here from FEAT-12); App Store sheet / TestFlight links; Sparkle 2 in StudioMac with appcast and the key-list delegate, compiled out of Mac App Store targets; manifests in `release.yml` and (private) `admin-release.yml` | AlUmmahNowApple |
| APPUPD-11 | Wiki: per-app "How updates work" in each repo's release doc and the product rules; registry status; AUN-FEATURES FEAT-12–14 pointing here | AlUmmahNowWiki + repos |

## 12. The notice

**Bar** (all apps): one line under the app header, the app's surface color, an info icon, never covering content, never animated. Text, then **What's new** (opens a small in-app sheet with the notes), then the action button, then a close (×) button with an accessible name. Closing hides it **for that version**; the next version shows it again. It is announced once to screen readers (polite live region). Right-to-left in Arabic. On TV it is a focusable row.

| State | English | Arabic |
|---|---|---|
| Available (store, download) | A new version, 2026.11.23, is available. · **Update** / **Download** | يتوفّر إصدار جديد، ٢٠٢٦.١١.٢٣. · **تحديث** / **تنزيل** |
| Downloading (desktop) | Downloading the update… 45% | جارٍ تنزيل التحديث… ٤٥٪ |
| Ready (desktop, Android flexible) | Update ready. It installs when you close the app. · **Restart now** | التحديث جاهز، ويُثبَّت عند إغلاق التطبيق. · **إعادة التشغيل الآن** |
| Busy (Studio, Tools) | Finish or pause your uploads first. | أكمِل عمليات الرفع أو أوقِفها مؤقتًا أولًا. |
| Failed check (Check now only) | Couldn't check for updates. Try again later. | تعذّر البحث عن تحديثات. حاول مرة أخرى لاحقًا. |
| Required, store doesn't have it yet (can't be closed) | This version will stop working soon. Update when your store offers it. | سيتوقف هذا الإصدار عن العمل قريبًا. حدِّثه عندما يتوفر في متجرك. |

**Forced screen** (below the minimum only): full window, app icon, "This version is no longer supported" / «لم يعد هذا الإصدار مدعومًا», the admin's optional message, the running and required versions, **Update** (or **Download**), and on desktop **Quit**. No close button. Version numbers use the app's digit formatter: Arabic shows ٠–٩ with the dots kept as `.` (a version is not a decimal number, so no «٫»).

**Settings → Updates** (desktop `direct` builds): "Version 2026.11.22", "Last checked: today at 3:04 PM", **Install updates automatically** switch, **Check now**.

## 13. Tests

- **Version comparison** (shared-types, Core, each app's thin wrapper): 3 vs 4 parts, pre-release precedence, an Apple rebuild (`1.2.3.2` > `1.2.3.0`, same marketing version), `-qa` stripping, invalid strings. One shared table of cases (`spec/app-updates/versions.json` in Core) run by TypeScript, Rust, C#, Kotlin and Swift tests, so every platform agrees.
- **Minimum-version gate**: server unit tests per source and channel (switch off → `ok`; below minimum → `required`; equal → `ok`/`recommended`; beta channel sees the newer of beta and stable; `available` per source); editor and server refuse a minimum above what any source can get (TestFlight not marked available, App Store lookup older); client tests: `required` without a confirmed update shows the bar, not the forced screen; offline, a last-known `required` shows the bar that can't be closed, a never-seen one shows nothing.
- **Notes overrides**: an override for 1.4.0 shows on 1.4.0, not after the index moves to 1.4.1; old entries are dropped on save.
- **Manifest signature** (server, Tools, Desktop, Apple Sparkle setup): valid signature; one flipped byte in the manifest (**tampered file**) → refused; one flipped byte in the downloaded package → SHA-256 mismatch, file deleted, nothing installed; wrong key; wrong repo, tag or channel; a missing `.sig` for a repo with keys → quarantined, no notice and no link; an older signed release that is still newer than the installed build but below the highest version the app has verified, or yanked → refused; a redirect hop to a non-allowlisted host or to HTTP → refused (`release-assets.githubusercontent.com` allowed). Test keys are generated per test run; no real key in any repo.
- **Keys**: a key list with a lower or equal serial is ignored; a list not signed by the root key is ignored; a revoked key's manifest is refused even if a later list omits the revocation; an app built before a rotation updates straight to a release signed only with the new key (skip-safe rotation); after revoking key A, a manifest signed by A is refused and one dual-signed by A and B is accepted only through B.
- **Indexer**: fixtures for the Atom feed, manifests, signatures and App Store lookup; no network in tests.
- **Notice UI**: unit tests for the state machine (available → downloading → ready, dismissed per version, busy, failed); Android Compose tests with `FakeAppUpdateManager`; Apple view tests; desktop view-model tests.
- **Store builds**: a test per platform that the updater is unreachable in App Store, Mac App Store, Play and MSIX builds.
- **Screenshots** (visual stories): the bar in each state and the forced screen, English and Arabic, light and dark, desktop and phone (and TV where it applies), into `review-shots/AUN-APP-UPDATES/<date>/head-<sha>/` with NOTES.md for the screenshot audit before merging.
- Release workflows: a dry-run PR job builds and verifies an `app-release.json` with a throwaway key.

## Owner decisions

Owner items (not decisions):

- **APPUPD-D11: K1–K10 and K-R.** Provide the keys and certificates in [§9](#9-owner-items-keys-and-certificates) when ready. Nothing blocks the build; notices for downloaded builds and self-install switch on per repo when its keys arrive.

Decided (all settled 2026-11-24):

- **APPUPD-D1: turn `appUpdates` on when the first app ships the check?** **Decided (a) by the owner (2026-11-24): yes.** The switch goes on in QA and production as soon as the first app release with the update check is out; until then it stays off.
- **APPUPD-D5: "Install updates automatically" default.** **Decided (a) by the owner (2026-11-24): on.** Desktop apps download updates in the background and install them when the app closes, never restarting on their own; the user's own choice in Settings → Updates always wins; admins change the default with `updates.autoInstallDefault`.
- **APPUPD-D2: primary Windows (and Tools macOS) download.** **Decided (a)**, routine (2026-11-23): Velopack `Setup.exe` (Windows) and `.pkg` (Tools on macOS) are the main downloads, and the MSI and `.dmg` stay for managed installs. All four are direct downloads on GitHub Releases, as the owner set on 2026-11-10; only the Velopack installers let the app update itself without admin rights.
- **APPUPD-D3: where update files live.** **Decided (a)** by the owner's earlier answer (2026-11-10, native apps distribution): direct downloads live on GitHub Releases. Moving later takes one release that adds the new host to the apps' host list first.
- **APPUPD-D4: signing keys.** **Decided (a)**, routine security design (2026-11-23): per repo, an offline root key (K-R) and a CI release key (K1–K4). Generating and holding the root keys is an owner item (K-R).
- **APPUPD-D6: check interval.** **Decided: 6 hours**, routine (2026-11-23); admins change it with `updates.checkHours` (1–48).
- **APPUPD-D7: beta channel.** **Decided (a)**, routine (2026-11-23): beta builds are told about the newest of beta and stable.
- **APPUPD-D8: sideloaded Android APK.** **Decided (a)**, routine (2026-11-23): the sideloaded APK gets a bar with a link to a signed release page; no in-app installer and no `REQUEST_INSTALL_PACKAGES`.
- **APPUPD-D9: Linux.** **Decided (a)**, routine (2026-11-23): Linux builds get the notice and a download link; a self-updating AppImage only if Linux users ask.
- **APPUPD-D10: release notes.** **Decided (a)**, routine (2026-11-23): CI takes English and Arabic notes from each repo's store notes files and fails the release without them; admins can override per version.
- **APPUPD-D12: super-admin-only editing of the minimum version** **Decided (a)** by issue AlUmmahNow#1434, which lists super admins as the editors (2026-11-23).

## Build status

| Story | PR | State |
|---|---|---|
| Spec | AlUmmahNowWiki#212 | merged `331892d` |
| APPUPD-1 versions, tags, signed manifests | AlUmmahNow#1783 | merged `59e88af` |
| APPUPD-2 `appUpdates` switch, release index | AlUmmahNow#1797 | merged `e7396a1` |
| APPUPD-3 update answer in `GET /api/v1/app-config` | AlUmmahNow#1806 | merged `78c0f80` |
| APPUPD-4 release tool `scripts/app-release/app-release.mjs` | AlUmmahNow#1811 | merged `192d89f` |
| APPUPD-5 Core `aun-updates` + `UpdateChecker` | AlUmmahNowCore#54 | merged `d37b920`, released in Core `v0.4.0-rc.5` |
| APPUPD-6 admin Releases tab, super-admin editing | — | next |
| APPUPD-7 Tools (Velopack, bar, forced screen, Settings → Updates) | — | in progress (on Core `v0.4.0-rc.5`) |
| APPUPD-8 to -10 Desktop, Android, Apple | — | planned |
| APPUPD-11 per-app docs | — | planned |
