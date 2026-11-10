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

## Current state (2026-11-09)

No open issues. One open PR: SECURITY.md and pinned actions ([#29](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/29)).

Apart from a maintenance change in November 2026, the last merges were in October 2025, such as Linux support ([#27](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/27)).

## Epics for this repo

5 epics name this repo. The full list, including epics owned by other repos, is in [Epics](../epics/README.md).

| Epic | Status |
|---|---|
| [Epic 19: Studio desktop (Windows, macOS, Linux)](../epics/E19-studio-desktop.md) | in progress |
| [Visual Importer roadmap: 6 sprints / milestones](../epics/TOOLS-IMPORTER-tools-visual-importer-roadmap.md) | deferred |
| [Tools: FileScan consolidation, testing plan, encoding and Bunny research roadmaps](../epics/TOOLS-PLANS-tools-consolidation-testing-research.md) | planned |
| [Move video delivery to R2 + Cloudflare CDN](../epics/AUN-R2-MIGRATION-r2-video-migration.md) | planned |
| [Security audit of the public repos](../epics/CHAT-SECURITY-public-repo-security.md) | shipped |
