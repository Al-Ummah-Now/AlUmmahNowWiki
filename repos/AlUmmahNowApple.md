[← Home](../README.md)

# AlUmmahNowApple

[Repository](https://github.com/Al-Ummah-Now/AlUmmahNowApple) · default branch `main`

## Purpose

Native viewer and Studio apps for iOS, iPadOS, tvOS and macOS. The product spec is the [native apps epics](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/native-apps/EPICS.md).

## Tech stack

Swift and SwiftUI, AppKit on macOS where needed, XcodeGen, SwiftLint, XCTest and XCUITest.

## Layout

| Path | What it is |
|---|---|
| [`Apps`](https://github.com/Al-Ummah-Now/AlUmmahNowApple/tree/main/Apps) | Thin app targets: ViewerIOS, ViewerMac, ViewerTV, StudioIOS, StudioMac |
| [`Packages/AUNCoreBridge`](https://github.com/Al-Ummah-Now/AlUmmahNowApple/tree/main/Packages/AUNCoreBridge) | Models, protocols, temporary native services |
| [`Packages/AUNCoreKit`](https://github.com/Al-Ummah-Now/AlUmmahNowApple/tree/main/Packages/AUNCoreKit) | Adapters to the Rust core (sign-in, search); only the Studio apps link it so far |
| [`Packages/AUNDesign`](https://github.com/Al-Ummah-Now/AlUmmahNowApple/tree/main/Packages/AUNDesign) | Fanous tokens that follow the admin-set site theme, strings, components |
| [`Packages/AUNPlayer`](https://github.com/Al-Ummah-Now/AlUmmahNowApple/tree/main/Packages/AUNPlayer) | AVKit wrapper |
| [`Packages/AUNFeatures`](https://github.com/Al-Ummah-Now/AlUmmahNowApple/tree/main/Packages/AUNFeatures) | Viewer screens |
| [`Packages/AUNStudio`](https://github.com/Al-Ummah-Now/AlUmmahNowApple/tree/main/Packages/AUNStudio) | Studio engines and screens |
| [`UITests`](https://github.com/Al-Ummah-Now/AlUmmahNowApple/tree/main/UITests) | XCUITest |

## Run and test locally

```sh
brew install xcodegen
make generate
open AlUmmahNow.xcworkspace
make lint
make test-ios        # or test-ipad, test-tvos, test-mac
make build-all
```

## Deployment

[`ci.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/.github/workflows/ci.yml) runs on PRs and pushes to `main` and builds unsigned.

[`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/.github/workflows/release.yml) runs on a `vX.Y.Z` tag on a commit on `main`. It builds Studio for Mac and for iPhone and iPad, each in a production and a QA configuration:

- Mac: `.dmg` and `.zip` downloads on the GitHub release, signed and notarized when the Apple signing inputs are set.
- iPhone and iPad: uploaded to App Store Connect for TestFlight.

Without the Apple inputs it builds unsigned artifacts only, so the pipeline is still proven. A manual run builds the same matrix from any branch and never releases. Only Studio is released so far; the viewers are not. See [RELEASING](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/docs/RELEASING.md) and [OWNER_INPUTS](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/docs/OWNER_INPUTS.md).

Debug and QA builds use the QA API. Release builds use production.

## Key docs

[PLAN](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/docs/PLAN.md) · [RELEASING](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/docs/RELEASING.md) · [Site themes](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/docs/design/SITE-THEMES.md) · [OWNER_INPUTS](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/docs/OWNER_INPUTS.md) · [CLAUDE.md](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/CLAUDE.md) · [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/SECURITY.md)

## Owners and contacts

No individual owners are named. Security reports go through private vulnerability reporting.

## Current state (2026-11-12)

The Studio MVP shipped for iPhone, iPad and Mac, and the apps now follow the admin-set site theme. No GitHub release has been cut yet.

Shipped since 2026-11-09:

- Site theme: the apps draw in the theme an admin sets for the whole site, Fawanees by default; light and dark stay each person's choice ([#13](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/13), [#14](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/14)).
- Studio sign-in through `aun-auth`, several accounts and a channel picker ([#16](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/16)).
- Single and batch upload, resumable and in the background, with set-for-all values ([#17](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/17)).
- Manage videos, bulk edit, soft delete and restore, analytics ([#18](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/18)).
- Release pipeline: notarized Mac downloads and TestFlight on a tag ([#19](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/19)).
- Parity with web, Android and Desktop: analytics chart value-axis rules, plan refusals, account states, playlist names, pickers ([#25](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/25)).

Open issues (9), no open PRs. They include the Arabic plural for videos ([#26](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/26)), playlist playback in the viewer ([#24](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/24)), live search in the viewers ([#15](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/15)), later viewer and Studio stories ([#9](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/9), [#10](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/10)), real-device checks ([#8](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/8)), the remaining interim seams ([#7](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/7)), sign-in and upload follow-ups such as the tvOS device flow ([#6](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/6)) and the release pipeline ([#5](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/5), still open although Studio's pipeline merged).

## Epics for this repo

17 epics name this repo. The full list, including epics owned by other repos, is in [Epics](../epics/README.md).

| Epic | Status |
|---|---|
| [Epic 10: Fanous design system](../epics/E10-fanous-design-system.md) | in progress |
| [Epic 11: Shared core in Rust (`aun-core`) + per-platform app layers](../epics/E11-aun-core.md) | in progress |
| [Epic 12: Viewer mobile apps (iOS / iPadOS / Android)](../epics/E12-viewer-mobile.md) | in progress |
| [Epic 13: Native players](../epics/E13-native-players.md) | in progress |
| [Epic 14: Offline & Listen mode (incl. CarPlay / Android Auto)](../epics/E14-offline-listen.md) | planned |
| [Epic 15: TV apps](../epics/E15-tv-apps.md) | in progress |
| [Epic 16: Desktop viewer (Windows, macOS, Linux)](../epics/E16-desktop-viewer.md) | in progress |
| [Epic 17: Live in apps (watch, chat, premieres, reminders)](../epics/E17-live-in-apps.md) | planned |
| [Epic 18: Studio mobile (iOS / iPadOS / Android)](../epics/E18-studio-mobile.md) | in progress |
| [Epic 19: Studio desktop (Windows, macOS, Linux)](../epics/E19-studio-desktop.md) | in progress |
| [Epic 20: Ummah Kids profiles & parental controls](../epics/E20-ummah-kids.md) | planned |
| [Epic 21: Islamic experience layer](../epics/E21-islamic-experience.md) | planned |
| [Epic 22: Notifications, sharing, study circles](../epics/E22-notifications-sharing-circles.md) | planned |
| [Epic 23: Release engineering & store compliance](../epics/E23-release-engineering.md) | in progress |
| [Epic 24: Creator support & premium](../epics/E24-creator-support-premium.md) | deferred |
| [Epic 30: Studio media engine (`aun-media`, Rust)](../epics/E30-aun-media.md) | in progress |
| [Themes: Lantern, Zujaj, Nahas, Fawanees, and the theme builder](../epics/AUN-THEMES-themes.md) | in progress |
