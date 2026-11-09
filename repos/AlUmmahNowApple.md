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
| [`Packages/AUNDesign`](https://github.com/Al-Ummah-Now/AlUmmahNowApple/tree/main/Packages/AUNDesign) | Fanous tokens, strings, components |
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

**There is no release workflow yet.** The plan is Fastlane, run only by GitHub Actions from a `vYYYY.MM.DD` tag on `main`, with TestFlight first. It waits on the Apple Developer inputs listed in [OWNER_INPUTS.md](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/docs/OWNER_INPUTS.md) and is tracked in [#5](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/5).

Debug and QA builds use the QA API. Release builds use production.

## Key docs

[PLAN](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/docs/PLAN.md) · [OWNER_INPUTS](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/docs/OWNER_INPUTS.md) · [CLAUDE.md](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/CLAUDE.md) · [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/SECURITY.md)

`CLAUDE.md` here says to squash merge. The organisation's rule is rebase merges, never squash. See [Contributing](../guides/contributing.md).

## Owners and contacts

No individual owners are named. Security reports go through private vulnerability reporting.

## Current state (2026-11-09)

6 open issues, all `queue`, and no open PRs. The queue covers later viewer and Studio stories ([#9](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/9), [#10](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/10)), real-device checks ([#8](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/8)), swapping in the Rust core ([#7](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/7)), sign-in and real uploads ([#6](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/6)) and the release pipeline ([#5](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/5)).

Recently merged: Studio upload and encode queues ([#12](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/12)), tvOS and macOS viewers ([#11](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/11)), iOS and iPadOS viewer ([#4](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/4)).
