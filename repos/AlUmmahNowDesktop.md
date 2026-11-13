[← Home](../README.md)

# AlUmmahNowDesktop

[Repository](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop) · default branch `main`

## Purpose

Native viewer and Studio apps for Windows and Linux, and a viewer for Samsung Tizen TVs. Viewer and Studio share one application layer.

## Tech stack

C# and .NET. WinUI 3 on Windows, GTK 4 and libadwaita through Gir.Core on Linux, NUI on Tizen. xUnit. The shared layer stays `netstandard2.0`-compatible for Tizen.

## Layout

| Path | What it is |
|---|---|
| [`src/AlUmmahNow.App`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/src/AlUmmahNow.App) | Shared application layer and translations |
| [`src/AlUmmahNow.CoreBridge`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/src/AlUmmahNow.CoreBridge) | Interfaces in front of the Rust core |
| [`src/AlUmmahNow.CoreBridge.Native`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/src/AlUmmahNow.CoreBridge.Native) | Implementations over the Rust core package |
| [`src/AlUmmahNow.Windows`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/src/AlUmmahNow.Windows) | Windows viewer |
| [`src/AlUmmahNow.Linux`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/src/AlUmmahNow.Linux) | Linux viewer |
| [`src/AlUmmahNow.Tizen`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/src/AlUmmahNow.Tizen) | Tizen viewer |
| [`src/AlUmmahNow.Studio`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/src/AlUmmahNow.Studio) | Shared Studio layer |
| [`src/AlUmmahNow.Studio.Windows`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/src/AlUmmahNow.Studio.Windows), [`src/AlUmmahNow.Studio.Linux`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/src/AlUmmahNow.Studio.Linux) | Studio for Windows (WinUI 3) and Linux (GTK 4) |
| [`tests`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/tests) | xUnit tests |
| [`packaging`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/packaging) | Flatpak and Windows (MSI) packaging |

## Run and test locally

```sh
./scripts/fetch-core.sh     # once, before restoring
dotnet test tests/AlUmmahNow.App.Tests
```

WinUI builds need Windows and the Tizen workload needs its CLI, so CI covers those. Set `AUN_ENV=qa` or `AUN_ENV=prod` to override the API environment.

## Deployment

Each platform has its own workflow under [`.github/workflows`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/.github/workflows).

[`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/main/.github/workflows/release.yml) runs on a version tag on `main`:

- `vX.Y.Z` builds production-configured packages into a **draft** GitHub release, which a person publishes.
- `vX.Y.Z-<suffix>` (for example `-preview.1`) builds QA-configured packages and publishes a GitHub **pre-release** at once, for testers.

Packages: a portable zip and an MSI on Windows, a `.deb` and a Flatpak bundle on Linux, and a Tizen TPK. The workflow installs, launches and uninstalls the MSI and the `.deb` as a check. A manual run, or a PR that changes packaging, is a dry run with no release. Packages are unsigned and store submission isn't automated yet.

## Key docs

[PLAN](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/main/docs/PLAN.md) · [OWNER_INPUTS](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/main/docs/OWNER_INPUTS.md) · [D9 finding](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/main/docs/D9-FINDING.md) · [CLAUDE.md](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/main/CLAUDE.md) · [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/main/SECURITY.md)

## Owners and contacts

No individual owners are named. Security reports go through private vulnerability reporting.

## Current state (2026-11-12)

The Studio MVP shipped for Windows and Linux on aun-core `0.3.0-rc.1`. The first pre-release, `v0.1.0-preview.1`, is on GitHub Releases.

Shipped since 2026-11-09:

- Studio sign-in through aun-core with a loopback redirect, several accounts, a channel picker and a central logger ([#24](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/24)).
- Upload one file, many or a folder with set-for-all values, on Core's resumable upload engine ([#25](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/25)).
- Manage videos, live search, single and bulk edit, analytics ([#26](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/26)).
- Release pipeline: pre-release tags, MSI and portable zip, `.deb`, install checks ([#27](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/27)).
- Analytics chart value axis, date labels and tooltips ([#32](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/32)); CI retries `apt-get` ([#29](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/29)).

14 open issues and no open PRs. New ones cover the Arabic plural for videos ([#35](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/35)), viewer playlist playback ([#34](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/34)), pickers that open with content ([#33](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/33)), bilingual playlist names ([#31](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/31)), upload plan limits and `402 upgrade_required` ([#30](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/30)) and the GTK page switcher ([#28](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/28)). Older ones include sign-in follow-ups such as silent re-authorize ([#21](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/21)), hardware encoder checks ([#16](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/16)), a Flathub source build ([#15](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/15)) and a real Tizen TV ([#13](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/13)).

## Epics for this repo

9 epics name this repo. The full list, including epics owned by other repos, is in [Epics](../epics/README.md).

| Epic | Status |
|---|---|
| [Epic 10: Fanous design system](../epics/E10-fanous-design-system.md) | in progress |
| [Epic 11: Shared core in Rust (`aun-core`) + per-platform app layers](../epics/E11-aun-core.md) | in progress |
| [Epic 13: Native players](../epics/E13-native-players.md) | in progress |
| [Epic 15: TV apps](../epics/E15-tv-apps.md) | in progress |
| [Epic 16: Desktop viewer (Windows, macOS, Linux)](../epics/E16-desktop-viewer.md) | in progress |
| [Epic 19: Studio desktop (Windows, macOS, Linux)](../epics/E19-studio-desktop.md) | in progress |
| [Epic 23: Release engineering & store compliance](../epics/E23-release-engineering.md) | in progress |
| [Epic 30: Studio media engine (`aun-media`, Rust)](../epics/E30-aun-media.md) | in progress |
| [Themes: Lantern, Zujaj, Nahas, Fawanees, and the theme builder](../epics/AUN-THEMES-themes.md) | in progress |
