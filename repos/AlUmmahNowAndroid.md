[← Home](../README.md)

# AlUmmahNowAndroid

[Repository](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid) · default branch `main`

## Purpose

Native viewer and Studio apps for Android phones, tablets and foldables, Android TV and Google TV, Fire TV and Android Auto. The product spec is the [native apps epics](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/native-apps/EPICS.md).

## Tech stack

Kotlin, Jetpack Compose, Media3, Gradle convention plugins, JDK 21. ktlint, detekt, Robolectric and Roborazzi screenshot tests.

## Layout

| Path | What it is |
|---|---|
| [`viewer-mobile`](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/tree/main/viewer-mobile) | Viewer for phones, tablets and Android Auto |
| [`viewer-tv`](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/tree/main/viewer-tv) | TV viewer, with Google and Amazon flavours |
| [`studio-mobile`](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/tree/main/studio-mobile) | Studio |
| [`core-bridge`](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/tree/main/core-bridge) | Interfaces in front of the Rust core |
| [`design`](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/tree/main/design) | Fanous theme and components |
| [`player`](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/tree/main/player) | Media3 player |
| [`feature-studio`](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/tree/main/feature-studio) | Studio sign-in, accounts, channel picker, upload, manage and analytics |
| `feature-*` | Home, watch, upload, editor, live and TV features |
| [`build-logic`](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/tree/main/build-logic) | Convention plugins |

## Run and test locally

```sh
./gradlew assembleDebug
./gradlew :viewer-mobile:installQaDebug
./gradlew ktlintCheck detekt lint
./gradlew testDebugUnitTest testQaDebugUnitTest testQaGoogleDebugUnitTest
```

Golden screenshots are recorded on Linux through the "Record screenshots" workflow.

## Deployment

| Workflow | Runs on | Does |
|---|---|---|
| [`ci.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/blob/main/.github/workflows/ci.yml) | PRs and pushes | Build, static checks, tests |
| [`record-screenshots.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/blob/main/.github/workflows/record-screenshots.yml) | Manual | Re-records goldens |
| [`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/blob/main/.github/workflows/release.yml) | `vYYYY.MM.DD[.N]` tag on `main` | Studio APKs and AAB on a GitHub release; Play internal track when configured |

A release tag attaches the Studio production APK, QA APK and production AAB to a GitHub release. Until the owner supplies the Play upload key, they are signed with a CI pre-release key and the release is marked as a pre-release: testers can install it, but Play won't accept it. The Play internal upload (viewer, TV, Studio) is skipped with a warning until the upload key and Play access exist. See [RELEASE.md](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/blob/main/docs/RELEASE.md).

Each app has `qa` and `prod` flavours pointing at the matching API.

## Key docs

[README](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/blob/main/README.md) · [PLAN](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/blob/main/docs/PLAN.md) · [RELEASE](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/blob/main/docs/RELEASE.md) · [CLAUDE.md](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/blob/main/CLAUDE.md) · [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/blob/main/SECURITY.md)

`CLAUDE.md` here says to squash merge. The organisation's rule is rebase merges, never squash. See [Contributing](../guides/contributing.md).

## Owners and contacts

No individual owners are named. Security reports go through private vulnerability reporting.

## Current state (2026-11-12)

The Studio MVP shipped for phone and tablet on aun-core `0.3.0-rc.1`. The first pre-release, `v2026.11.11`, is on GitHub Releases.

Shipped since 2026-11-09:

- Studio sign-in through aun-core in a Custom Tab, several accounts and a channel picker ([#7](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/7)).
- Resumable single and batch upload with set-for-all values ([#8](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/8)).
- Manage videos, live search, bulk edit, soft delete and analytics ([#9](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/9)).
- Release pipeline: Studio APK and AAB on GitHub Releases, Play internal when configured ([#10](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/10)).

One open PR: analytics chart value axis, date labels and readout ([#12](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/12)). Open issues (6) include the Studio QA flow test failing on `main` against QA ([#15](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/15)), pickers that open with content ([#13](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/13)), bilingual playlist names ([#11](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/11)), viewer playlist playback ([#14](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/14)), viewer live search ([#6](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/6)) and sign-in follow-ups such as silent re-authorize ([#5](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/5)).

## Epics for this repo

15 epics name this repo. The full list, including epics owned by other repos, is in [Epics](../epics/README.md).

| Epic | Status |
|---|---|
| [Epic 10: Fanous design system](../epics/E10-fanous-design-system.md) | in progress |
| [Epic 11: Shared core in Rust (`aun-core`) + per-platform app layers](../epics/E11-aun-core.md) | in progress |
| [Epic 12: Viewer mobile apps (iOS / iPadOS / Android)](../epics/E12-viewer-mobile.md) | in progress |
| [Epic 13: Native players](../epics/E13-native-players.md) | in progress |
| [Epic 14: Offline & Listen mode (incl. CarPlay / Android Auto)](../epics/E14-offline-listen.md) | planned |
| [Epic 15: TV apps](../epics/E15-tv-apps.md) | in progress |
| [Epic 17: Live in apps (watch, chat, premieres, reminders)](../epics/E17-live-in-apps.md) | planned |
| [Epic 18: Studio mobile (iOS / iPadOS / Android)](../epics/E18-studio-mobile.md) | in progress |
| [Epic 20: Ummah Kids profiles & parental controls](../epics/E20-ummah-kids.md) | planned |
| [Epic 21: Islamic experience layer](../epics/E21-islamic-experience.md) | planned |
| [Epic 22: Notifications, sharing, study circles](../epics/E22-notifications-sharing-circles.md) | planned |
| [Epic 23: Release engineering & store compliance](../epics/E23-release-engineering.md) | in progress |
| [Epic 24: Creator support & premium](../epics/E24-creator-support-premium.md) | deferred |
| [Epic 30: Studio media engine (`aun-media`, Rust)](../epics/E30-aun-media.md) | in progress |
| [Themes: Lantern, Zujaj, Nahas, Fawanees, and the theme builder](../epics/AUN-THEMES-themes.md) | in progress |
