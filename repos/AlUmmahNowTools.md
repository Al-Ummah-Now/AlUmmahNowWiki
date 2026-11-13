[← Home](../README.md)

# AlUmmahNowTools

[Repository](https://github.com/Al-Ummah-Now/AlUmmahNowTools) · default branch `master`

## Purpose

.NET tools for managing video content in bulk: scanning files, importing them, and uploading to Bunny.net and Cloudflare R2. It has a command-line client, a cross-platform GUI and a background scanning service.

## Tech stack

.NET 8 for libraries and services, .NET 9 for the Uno Platform GUI. SignalR for realtime updates. Bunny.net, Cloudflare R2 and DeepL integrations.

## Layout

| Path | What it is |
|---|---|
| [`AlUmmahNow.Data`](https://github.com/Al-Ummah-Now/AlUmmahNowTools/tree/master/AlUmmahNow.Data) | Shared models and storage |
| [`AlUmmahNow.Importer`](https://github.com/Al-Ummah-Now/AlUmmahNowTools/tree/master/AlUmmahNow.Importer) | Core import logic |
| [`AlUmmahNow.DataImporter`](https://github.com/Al-Ummah-Now/AlUmmahNowTools/tree/master/AlUmmahNow.DataImporter) | Command-line client |
| [`AlUmmahNow.BunnyBulkUploader`](https://github.com/Al-Ummah-Now/AlUmmahNowTools/tree/master/AlUmmahNow.BunnyBulkUploader) | Command-line bulk uploader |
| [`AlUmmahNow.FileScanService`](https://github.com/Al-Ummah-Now/AlUmmahNowTools/tree/master/AlUmmahNow.FileScanService) | Background scanner with a SignalR hub |
| [`AlUmmahNow.VisualImporterUno`](https://github.com/Al-Ummah-Now/AlUmmahNowTools/tree/master/AlUmmahNow.VisualImporterUno) | Cross-platform GUI |
| [`AlUmmahNow.VisualImporterUno.UITests`](https://github.com/Al-Ummah-Now/AlUmmahNowTools/tree/master/AlUmmahNow.VisualImporterUno.UITests) | GUI tests |
| [`AlUmmahNow.Tests`](https://github.com/Al-Ummah-Now/AlUmmahNowTools/tree/master/AlUmmahNow.Tests) | Tests |

## Run and test locally

```sh
dotnet build
cd AlUmmahNow.FileScanService && dotnet run     # required for scanning
cd AlUmmahNow.DataImporter && dotnet run -- --help
```

Credentials are configured per developer through .NET User Secrets. See the [README](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/README.md#-configuration).

## Deployment

[`dotnet-test.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/.github/workflows/dotnet-test.yml) runs tests on PRs and pushes. There is no release or deployment workflow: these tools are built and run by operators.

## Key docs

[README](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/README.md) · [ARCHITECTURE.md](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/ARCHITECTURE.md) · [USE_CASES.md](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/USE_CASES.md) · [FEATURE_MATRIX.md](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/FEATURE_MATRIX.md) · [TESTING_GUIDE.md](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/TESTING_GUIDE.md)

The many other Markdown files at the repo root are point-in-time reports from 2025 and earlier. **Unverified:** whether they still match the code.

## Owners and contacts

No individual owners are named.

## Current state (2026-11-12)

Still no release workflow; operators build and run the tools. Most work since 2026-11-09 fixed the TOOLS findings from the monorepo's [scalability audit](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/architecture/SCALABILITY-AUDIT.md):

- Imports are idempotent: one run per folder, claimed rows, one record per file (TOOLS-1, [#34](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/34)); lookups scoped to the session (TOOLS-2, [#31](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/31)); one upload routine for import and Resume (TOOLS-3, [#33](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/33)).
- Unique storage keys and no silent overwrites (TOOLS-4, [#30](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/30)).
- FileScan service concurrency fixes (TOOLS-5 to TOOLS-8, [#32](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/32), [#35](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/35), [#36](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/36), [#37](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/37)) and a filter-preset deadlock (TOOLS-9, [#38](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/38)).
- Bunny uploads retry 429 and 5xx with jittered backoff and honour `Retry-After` (TOOLS-10, [#39](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/39)).
- Thumbnails keep the video's shape ([#40](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/40)); the tools can't hard-delete platform content, which only the platform's soft delete and purge remove ([#41](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/41)).
- Channel boxes suggest as you type ([#42](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/42)); app icons use the owner's art ([#45](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/45)).

Open: SECURITY.md and pinned actions ([#29](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/29)); issues for confirmation dialogs on destructive actions ([#46](https://github.com/Al-Ummah-Now/AlUmmahNowTools/issues/46)), the Uno app icon ([#44](https://github.com/Al-Ummah-Now/AlUmmahNowTools/issues/44)) and hardcoded English strings ([#43](https://github.com/Al-Ummah-Now/AlUmmahNowTools/issues/43)).

## Epics for this repo

5 epics name this repo. The full list, including epics owned by other repos, is in [Epics](../epics/README.md).

| Epic | Status |
|---|---|
| [Epic 19: Studio desktop (Windows, macOS, Linux)](../epics/E19-studio-desktop.md) | in progress |
| [Visual Importer roadmap: 6 sprints / milestones](../epics/TOOLS-IMPORTER-tools-visual-importer-roadmap.md) | deferred |
| [Tools: FileScan consolidation, testing plan, encoding and Bunny research roadmaps](../epics/TOOLS-PLANS-tools-consolidation-testing-research.md) | planned |
| [Move video delivery to R2 + Cloudflare CDN](../epics/AUN-R2-MIGRATION-r2-video-migration.md) | in progress |
| [Security audit of the public repos](../epics/CHAT-SECURITY-public-repo-security.md) | shipped |
