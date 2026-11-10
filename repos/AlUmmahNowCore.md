[← Home](../README.md)

# AlUmmahNowCore

[Repository](https://github.com/Al-Ummah-Now/AlUmmahNowCore) · default branch `main`

## Purpose

The shared Rust library behind the native apps. UI, players, capture and hardware encoders stay native. Logic that must behave the same on every platform lives here: API client, auth, sync, uploads, the Studio media engine, i18n and telemetry.

## Tech stack

Rust workspace, UniFFI bindings for Swift, Kotlin and C#. `cargo-deny` for licence policy.

## Layout

| Path | What it is |
|---|---|
| [`crates/aun-api`](https://github.com/Al-Ummah-Now/AlUmmahNowCore/tree/main/crates/aun-api) | Client generated from the api-videos OpenAPI document |
| [`crates/aun-auth`](https://github.com/Al-Ummah-Now/AlUmmahNowCore/tree/main/crates/aun-auth) | Sign-in |
| [`crates/aun-sync`](https://github.com/Al-Ummah-Now/AlUmmahNowCore/tree/main/crates/aun-sync) | Cross-device sync |
| [`crates/aun-upload`](https://github.com/Al-Ummah-Now/AlUmmahNowCore/tree/main/crates/aun-upload) | Upload engine |
| [`crates/aun-media`](https://github.com/Al-Ummah-Now/AlUmmahNowCore/tree/main/crates/aun-media) | Studio media engine |
| [`crates/aun-player`](https://github.com/Al-Ummah-Now/AlUmmahNowCore/tree/main/crates/aun-player) | Shared player behaviour |
| [`crates/aun-i18n`](https://github.com/Al-Ummah-Now/AlUmmahNowCore/tree/main/crates/aun-i18n) | Translations, plurals, bidi |
| [`crates/aun-telemetry`](https://github.com/Al-Ummah-Now/AlUmmahNowCore/tree/main/crates/aun-telemetry) | Consent-gated telemetry |
| [`crates/aun-common`](https://github.com/Al-Ummah-Now/AlUmmahNowCore/tree/main/crates/aun-common) | Shared types |
| [`crates/aun-ffi`](https://github.com/Al-Ummah-Now/AlUmmahNowCore/tree/main/crates/aun-ffi) | The only crate that uses UniFFI |
| [`bindings`](https://github.com/Al-Ummah-Now/AlUmmahNowCore/tree/main/bindings) | Kotlin and C# packaging |

## Run and test locally

```sh
cargo fmt --all
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
cargo deny check licenses
scripts/gen-bindings.sh
scripts/build-xcframework.sh   # macOS only
```

## Deployment

A library, so it has no environments. Releases happen only by pushing a `vX.Y.Z` tag on `main`. [`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/main/.github/workflows/release.yml) checks the tag and changelog, builds every target, publishes the AAR and NuGet package to GitHub Packages, and creates a GitHub release with the XCFramework. The workflow never pushes to a branch.

## Key docs

[README](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/main/README.md) · [PLAN](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/main/docs/PLAN.md) · [RELEASING](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/main/docs/RELEASING.md) · [SYNC](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/main/docs/SYNC.md) · [MEDIA](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/main/docs/MEDIA.md) · [MODELS](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/main/docs/MODELS.md) · [Player behaviour](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/main/docs/PLAYER_BEHAVIOUR.md) · [CHANGELOG](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/main/CHANGELOG.md) · [CLAUDE.md](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/main/CLAUDE.md) · [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/main/SECURITY.md)

## Owners and contacts

No individual owners are named. Security reports go through private vulnerability reporting.

## Current state (2026-11-09)

Latest release: `v0.2.0`. 3 open issues, all `queue`: server sync support ([#13](https://github.com/Al-Ummah-Now/AlUmmahNowCore/issues/13)), telemetry ingest ([#8](https://github.com/Al-Ummah-Now/AlUmmahNowCore/issues/8)), ETag and 304 handling ([#6](https://github.com/Al-Ummah-Now/AlUmmahNowCore/issues/6)).

One open PR: `LoginPrompt` for browser sign-in ([#22](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/22)).

Recently merged: release v0.2.0 ([#21](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/21)), sync engine ([#19](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/19)), telemetry ([#18](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/18)).

## Epics for this repo

8 epics name this repo. The full list, including epics owned by other repos, is in [Epics](../epics/README.md).

| Epic | Status |
|---|---|
| [Epic 9: Platform foundations for native clients (backend)](../epics/E09-native-platform-foundations.md) | in progress |
| [Epic 11: Shared core in Rust (`aun-core`) + per-platform app layers](../epics/E11-aun-core.md) | in progress |
| [Epic 13: Native players](../epics/E13-native-players.md) | in progress |
| [Epic 14: Offline & Listen mode (incl. CarPlay / Android Auto)](../epics/E14-offline-listen.md) | planned |
| [Epic 18: Studio mobile (iOS / iPadOS / Android)](../epics/E18-studio-mobile.md) | in progress |
| [Epic 19: Studio desktop (Windows, macOS, Linux)](../epics/E19-studio-desktop.md) | in progress |
| [Epic 23: Release engineering & store compliance](../epics/E23-release-engineering.md) | in progress |
| [Epic 30: Studio media engine (`aun-media`, Rust)](../epics/E30-aun-media.md) | in progress |
