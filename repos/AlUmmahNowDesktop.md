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
| [`src/AlUmmahNow.Windows`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/src/AlUmmahNow.Windows) | Windows viewer |
| [`src/AlUmmahNow.Linux`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/src/AlUmmahNow.Linux) | Linux viewer |
| [`src/AlUmmahNow.Tizen`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/src/AlUmmahNow.Tizen) | Tizen viewer |
| [`src/AlUmmahNow.Studio`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/src/AlUmmahNow.Studio) | Shared Studio layer, with `.Windows` and `.Linux` surfaces |
| [`tests`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/tests) | xUnit tests |
| [`packaging`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/packaging) | Flatpak packaging |

## Run and test locally

```sh
./scripts/fetch-core.sh     # once, before restoring
dotnet test tests/AlUmmahNow.App.Tests
```

WinUI builds need Windows and the Tizen workload needs its CLI, so CI covers those. Set `AUN_ENV=qa` or `AUN_ENV=prod` to override the API environment.

## Deployment

Each platform has its own workflow under [`.github/workflows`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/tree/main/.github/workflows).

[`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/main/.github/workflows/release.yml) runs on a `vX.Y.Z` tag on `main`. It builds production-configured packages and creates a **draft** GitHub release, which a person publishes. A manual run is a dry run. Packages are unsigned and store submission isn't automated yet.

## Key docs

[PLAN](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/main/docs/PLAN.md) · [OWNER_INPUTS](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/main/docs/OWNER_INPUTS.md) · [D9 finding](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/main/docs/D9-FINDING.md) · [CLAUDE.md](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/main/CLAUDE.md) · [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/main/SECURITY.md)

## Owners and contacts

No individual owners are named. Security reports go through private vulnerability reporting.

## Current state (2026-11-09)

8 open issues, all `queue`, and no open PRs. Examples: sign-in improvements ([#21](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/21)), replacing temporary bridges ([#17](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/17)), hardware encoder checks ([#16](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/16)), running on a real Tizen TV ([#13](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/13)).

Recently merged: release pipeline ([#20](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/20)), real TUS uploads and sign-in in Studio ([#19](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/19)), Rust core wired into the viewers ([#18](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/18)).
