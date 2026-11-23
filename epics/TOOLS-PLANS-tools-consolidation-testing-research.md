[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Tools: FileScan consolidation, testing plan, encoding and Bunny research roadmaps

| | |
|---|---|
| **ID** | `TOOLS-PLANS` |
| **Owning repos** | [AlUmmahNowTools](../repos/AlUmmahNowTools.md) |
| **Status** | **in progress** (spec refreshed 2026-11-23; first Tools release `v2026.11.22`, unsigned) |
| **Last updated** | 2026-11-23 |
| **Related epics** | [TOOLS-ADMIN](TOOLS-ADMIN-admin-import-tool.md), [AUN-R2-MIGRATION](AUN-R2-MIGRATION-r2-video-migration.md), [AUN-COST](AUN-COST-cost-monitoring.md), [AUN-FEATURES](AUN-FEATURES-feature-switches.md), [Epic 11](E11-aun-core.md), [Epic 30](E30-aun-media.md) |

> **Summary (2026-11-23):** Four 2025 plans in [AlUmmahNowTools](../repos/AlUmmahNowTools.md) had stale status: FileScan consolidation is implemented in code but left stale config/doc remnants and lacks a live SignalR hub-to-client integration test; the 7-week testing plan targeted Windows-only WinAppDriver (now archived) and predates `AlUmmahNow.ToolsCore` and the cross-platform `net9.0-desktop` release; the encoding and Bunny roadmaps have been largely superseded by `TOOLS-ADMIN` (TA-11/TA-12/TA-14/TA-19), `AUN-R2-MIGRATION` (D2), and `AUN-COST`, so they produce written wiki findings with cost numbers rather than redundant code.

## 1. Goal

Close out the four standalone plans in `AlUmmahNowTools` cleanly without rebuilding work that already shipped under `TOOLS-ADMIN`, `AUN-R2-MIGRATION`, `AUN-COST`, or `AlUmmahNowCore`:

1. **FileScan consolidation:** verify and finish removing leftover `FileScanApi` references, fix minor host configuration bugs, mark the plan complete, and add an automated in-process SignalR integration test covering the consolidated hub and client.
2. **Testing plan:** replace the obsolete Windows-only WinAppDriver plan with a cross-platform testing architecture for the shipped `net9.0-desktop` staff app (Windows, macOS, Linux): ViewModel and UI-helper unit tests, `ToolsCore` code coverage in CI, SHA-pinned workflow actions, and headless desktop UI smoke launches on pull requests.
3. **Encoding research roadmap:** publish verified findings and cost comparisons in the wiki covering local-first pre-encoding (D11 / TA-12) versus server-side Cloudflare Containers, codec choices (H.264 vs. HEVC/VP9/AV1), storage levers under the $500/month cap, and TA-19 LGPL FFmpeg alignment, plus any clear small-win encoder fix.
4. **Bunny research roadmap:** publish verified findings and cost comparisons in the wiki comparing Bunny Stream against Cloudflare R2 + Cloudflare CDN, audit P1–P4 against what already exists, and document a clear freeze-and-retire recommendation aligned with D2 and `TOOLS-ADMIN` TA-14.

## 2. What exists today (inventory, 2026-11-23)

First desktop release: **`v2026.11.22`** (Windows `.msi`/`.zip`, macOS arm64/x64 `.dmg`, Linux `.deb`/`.tar.gz`, currently unsigned).

### 2.1 FileScan consolidation (`CONSOLIDATION_PLAN.md`, P1–P5)

| Piece | File path in `AlUmmahNowTools` | Current state |
|---|---|---|
| Consolidated SignalR host | `AlUmmahNow.FileScanService/Program.cs` | **Done in code.** Hosts Kestrel + SignalR (`/scanHub`), `/health`, `/singleton`, localhost-only CORS, `SingletonManager`, `FileScanWorker`, `ImportWorker`, `FileWatchService`, `ApprovalService`, and `ImportDbSchema.EnsureUpToDateAsync`. Minor bug: line 120 reads `Kestrel:Endpoints:Http:Url` as `int?` instead of parsing the URI port. |
| SignalR hub | `AlUmmahNow.FileScanService/Hubs/FileScanHub.cs` | **Done.** Implements scan lifecycle (`StartScan`, `GetScanStatus`, `GetAllSessions`, `CancelScan`), watch lifecycle (`StartWatch`, `StopWatch`, `ResumeWatch`, `GetActiveWatches`, `GetWatchStatus`, `UpdateWatch`, `DeleteWatch`), approvals, and group broadcasts. |
| Background workers | `AlUmmahNow.FileScanService/Services/FileScanWorker.cs`, `FileWatchService.cs`, `ImportWorker.cs` | **Done and hardened.** Concurrency fixes TOOLS-5 to TOOLS-9 merged (#32, #35–#38). |
| CLI SignalR client | `AlUmmahNow.DataImporter/Services/FileScanSignalRClient.cs`, `AlUmmahNow.DataImporter/Program.cs`, `AlUmmahNow.DataImporter/appsettings.json` | **Done.** Uses `FileScanService:Url` and SignalR with auto-reconnect. |
| GUI SignalR client | `AlUmmahNow.VisualImporterUno/AlUmmahNow.VisualImporterUno/Services/FileScanSignalRClient.cs`, `ViewModels/ServiceStatusViewModel.cs`, `ViewModels/WatchViewModel.cs`, `ViewModels/ApprovalViewModel.cs` | **Done.** Connects to `/scanHub` and manages the local daemon via `FileScanServiceManager`. |
| `FileScanApi` removal | Solution (`AlUmmahNow.sln`) and repo root | **Mostly done.** Project directory and `.sln` entry are deleted. **Leftover stale references** remain in `AlUmmahNow.Tests/coverage.runsettings` (`../AlUmmahNow.FileScanApi/`), `AlUmmahNow.Tests/appsettings.json` (`FileScanApi:BaseUrl`), `AlUmmahNow.VisualImporterUno/AlUmmahNow.VisualImporterUno/appsettings.json` (`FileScanApi:BaseUrl` and `Host:Urls`), `AlUmmahNow.Tests/COVERAGE.md`, and `CONSOLIDATION_PLAN.md` (still marked "Proposed"). |
| SignalR tests | `AlUmmahNow.Tests/FileScanService/Hubs/FileScanHubTests.cs`, `FileScanHubWatchApprovalTests.cs`, `AlUmmahNow.Tests/DataImporter/Services/FileScanSignalRClientTests.cs` | **Unit tests only.** Hub methods are tested with mocked `IHubCallerClients`; client tests check disconnected/error states. No live in-process hub-to-client SignalR transport test exists yet. |

### 2.2 Testing plan (`TESTING_IMPLEMENTATION_PLAN.md`, Wk 1–7)

| Piece | File path in `AlUmmahNowTools` | Current state |
|---|---|---|
| Legacy library & service tests | `AlUmmahNow.Tests/AlUmmahNow.Tests.csproj` (`net8.0`, xUnit + Moq + FluentAssertions) | **Shipped (~470+ tests).** Covers Data, Importer, FileScanService, DataImporter, Bunny/R2 storage clients. Excludes `VisualImporterUno\**\*.cs` (`ApprovalViewModelTests.cs`, `WatchViewModelTests.cs`) from compilation. |
| ToolsCore tests | `AlUmmahNow.ToolsCore.Tests/AlUmmahNow.ToolsCore.Tests.csproj` (`net9.0`, xUnit) | **Shipped.** Covers `ToolsSession`, `AdminApiClient`, `FolderScanner`, `ImportQueue`, `TusClient`, `Renditions`, `QuranMatcher`, `Transcriber` (PR #54 adds `SocialSourcesTests` and `TakeoutAndCancelTests`). **Gap:** not included in CI code coverage reports. |
| Desktop ViewModel & UI-logic tests | `AlUmmahNow.VisualImporterUno/AlUmmahNow.VisualImporterUno/ViewModels/` (`BulkImportViewModel`, `ShellState`, `SettingsViewModel`, `ServiceStatusViewModel`, `FFmpegSettingsViewModel`, `WatchViewModel`, `ApprovalViewModel`, `Models/VideoFileInfo`, `Shell/Loc`, `Shell/PathText`, `Shell/RightToLeftText`, `Helpers/AutoSuggest`) | **Gap:** zero active ViewModel/UI-helper tests compile or run in CI. The two legacy files in `AlUmmahNow.Tests/VisualImporterUno/ViewModels/` are excluded from build and test stale constructors. |
| UI / E2E tests | `AlUmmahNow.VisualImporterUno.UITests/BaseTest.cs` | **Non-functional stub.** Not in `AlUmmahNow.sln`, references `Uno.UITest` 1.1.0-dev + Selenium, project reference to the app is commented out, and every `AppInitializer.Configure*` throws `NotImplementedException`. |
| Packaged-app launch smoke | `.github/workflows/release.yml`, `scripts/smoke-launch.sh`, `AlUmmahNow.VisualImporterUno/.../Shell/ScreenshotRunner.cs` | **Shipped on releases only.** Launches installed packages in demo mode (`TOOLS_DEMO=1`, `TOOLS_SCREENSHOT`) on Windows, macOS arm64, and Linux (under Xvfb) and verifies a non-empty PNG is written. **Gap:** does not run on PR CI (`dotnet-test.yml`). |
| CI test workflow | `.github/workflows/dotnet-test.yml` | **Partial.** Runs `AlUmmahNow.Tests` (`net8.0`) and `AlUmmahNow.ToolsCore.Tests` + `VisualImporterUno` build (`net9.0`). **Gaps:** `actions/checkout@v4`, `actions/setup-dotnet@v4`, and `actions/upload-artifact@v4` are not SHA-pinned; `codecov` and `quality-gate` jobs rebuild and re-run `AlUmmahNow.Tests` redundantly; `ToolsCore` coverage is missing; no PR desktop smoke launch. |

### 2.3 Encoding roadmap (`VIDEO_ENCODING_RESEARCH.md`, P1–P4)

| Phase in 2025 doc | What exists today (2026-11) |
|---|---|
| P1: FFMpegCore metadata & validation | **Built.** `FFMpegCore` 5.2.0 added to `AlUmmahNow.Data` and `AlUmmahNow.FileScanService` (Tools #21): `AlUmmahNow.Data/Video/MediaProbe.cs`, `AlUmmahNow.Data/Video/VideoThumbnailService.cs`, `AlUmmahNow.Data/Services/FFmpegManagerService.cs`, and `AlUmmahNow.FileScanService/Services/MetadataExtractor.cs`. In the new `TOOLS-ADMIN` flow, `AlUmmahNow.ToolsCore/Import/Renditions.cs` (`FfmpegMediaTools.ProbeAsync`) probes directly via `ffprobe` JSON with no FFMpegCore dependency. |
| P2: Automatic thumbnails | **Built.** `AlUmmahNow.Data/Video/VideoThumbnailService.cs`, `ThumbnailShape.cs` (Tools #40), `FileScanService/Services/ThumbnailService.cs`. On the server, `AlUmmahNow/apps/media` generates `thumb.jpg`, `thumb_640.jpg`, and `preview.webp` for every R2 video; Tools attaches custom sidecar thumbnails via `AttachStep`. |
| P3: Throttled parallel uploads & queue | **Built.** `AlUmmahNow.ToolsCore/Import/WorkQueue.cs` (Tools #50): persistent disk queue, configurable per-step concurrency (Hash 1–8, Encode 1–4, Upload 1–5, Attach 1–8), pause/resume, automatic retry with backoff, and resumable TUS via `TusClient`. |
| P4: Transcoding & hardware acceleration | **Built.** `AlUmmahNow.ToolsCore/Import/Renditions.cs` (TA-12, Tools #52) + `AlUmmahNowCore` `HlsPackageMp4` + `AlUmmahNow/apps/media/container/ladder.mjs` (Cloudflare Containers `standard-4`). Single-decode H.264/AAC fMP4 HLS ladder (`360p`/`480p`/`720p`/`1080p`, 6 s segments, 2 s GOP, CRF 23, 30 fps cap), server verification, and automatic server fallback. **Small-win gap:** `H264Encoders.Preferred` omits Linux `h264_vaapi` (named in TA-19) and lacks a 1-frame hardware probe / runtime fallback across GPU candidates; `BulkImportViewModel.EncoderName` has no friendly English/Arabic labels for `h264_vaapi`, `h264_mf`, or `libopenh264`. |

### 2.4 Bunny roadmap (`BUNNY_NET_API_ANALYSIS.md`, P1–P4)

| Phase in 2025 doc | What exists today (2026-11) |
|---|---|
| P1: Retry, rate limiting, `GetAsync` fix | **Built.** `AlUmmahNow.Data/Storage/BunnyStorageClient.cs` and `BunnyRetry.cs` (retry/backoff in Tools #19, #24, #39; unique storage keys and no silent overwrites in Tools #30): `SemaphoreSlim(10)`, `BunnyTransientResponseHandler`, `BunnyBackoff` with jittered exponential backoff and `Retry-After` on 429/408/5xx; `BunnyStreamClient.EnsureSuccess` (Tools #48). |
| P2: Refactor `BunnyStreamClient`, progress, checksum | **Superseded by `TOOLS-ADMIN`.** Tools uploads through `admin-api` TUS, not `BunnyStreamClient`. SHA-256 hashing and upload progress live in `AlUmmahNow.ToolsCore/Import/ImportSteps.cs` and `TusClient.cs`. TA-14 removes `AlUmmahNow.BunnyBulkUploader` and direct Bunny/R2 access. |
| P3: Resumable uploads, status polling, fetch from URL | **Built on the new path / superseded.** Resumable TUS uploads live in `ToolsCore/Import/TusClient.cs` and `AlUmmahNowCore` (`UploadEngine`); transcode polling lives in `CheckStep` (`GET /api/admin/import/items/:id/delivery`) and the monorepo processing loop. |
| P4: Large-file chunking, cost monitoring | **Built in monorepo / superseded.** Bunny billing, R2 storage/ops, Cloudflare Containers, and budget alerts are built in `AlUmmahNow/apps/cost-monitor` and the videos admin **Costs** and **Delivery** pages (`AUN-COST`, `AUN-R2-MIGRATION`). |

## 3. Stories (one PR each)

Note: Tools PR #54 (`feat/ta13-social`) and main-repo PRs #1741/#1752 are being landed separately; any Tools PR that touches shared app files will rebase on top of PR #54 once merged.

| ID | Story | Repo | Acceptance criteria | Blocked by decision? |
|---|---|---|---|---|
| **TP-1** | FileScan consolidation closeout and live SignalR integration tests | `AlUmmahNowTools` | Remove stale `FileScanApi` entries from `AlUmmahNow.Tests/coverage.runsettings`, `AlUmmahNow.Tests/appsettings.json`, `AlUmmahNow.VisualImporterUno/.../appsettings.json`, and `AlUmmahNow.Tests/COVERAGE.md`; mark `CONSOLIDATION_PLAN.md` completed; fix `FileScanService/Program.cs` port extraction from `Kestrel:Endpoints:Http:Url`; add an in-process Kestrel loopback SignalR integration test suite (`FileScanHub` ↔ `FileScanSignalRClient`) verifying connect, `StartScan`, `GetScanStatus`, `GetAllSessions`, `CancelScan`, real-time `ScanStarted`/`ScanCancelled` broadcasts, and invalid-path error propagation without SQL Server. | No |
| **TP-2** | Cross-platform desktop ViewModel and UI-helper test suite | `AlUmmahNowTools` | Add `AlUmmahNow.VisualImporterUno/AlUmmahNow.VisualImporterUno.Tests` (`Uno.Sdk`, `<TargetFramework>net9.0-desktop</TargetFramework>`, `<UnoSingleProject>true</UnoSingleProject>`) directly referencing `AlUmmahNow.VisualImporterUno.csproj` (fallback: linked source files or extracting pure logic into `ToolsCore` if any Uno API blocks headless runs on a platform), registered in `AlUmmahNow.sln` and CI. Cover active desktop ViewModels, models, converters, shell state, and localization (`Loc` English/Arabic digits and CLDR plurals, `VideoFileInfo`/`FileStatistics`, `FFmpegSettingsViewModel`, `SettingsViewModel`, `BoolNegationConverter`, `ShellState`/`ShellDemo`) running headlessly on Linux, macOS, and Windows; update `TESTING_IMPLEMENTATION_PLAN.md` and `TESTING_GUIDE.md` to document the 2026-11 strategy (xUnit + `TOOLS_DEMO` headless smoke replacing WinAppDriver). Deleting `AlUmmahNow.VisualImporterUno.UITests` waits for TP-D1. | Partial (deletion of `UITests` stub waits on TP-D1) |
| **TP-3** | CI test pipeline hardening: `ToolsCore` coverage, PR desktop smoke launch, deduplication, SHA-pinned actions | `AlUmmahNowTools` | Update `.github/workflows/dotnet-test.yml`: pin all actions to full commit SHAs; collect Cobertura coverage across `AlUmmahNow.Tests`, `AlUmmahNow.ToolsCore.Tests`, and the new ViewModel tests in one pass (remove redundant rebuilds in `quality-gate`); add an Ubuntu `xvfb-run` PR smoke job launching the built `net9.0-desktop` app in demo mode (`signed-out`, `not-staff`, `staff` Import page in `en` and `ar`, checking clean exit and non-empty PNGs). | No |
| **TP-4** | Encoding research findings (wiki) and Linux `h264_vaapi` small win | `AlUmmahNowWiki`, `AlUmmahNowTools` | Publish `guides/tools-encoding-research.md` with verified local-vs-server encoding cost numbers (labeled as month-12 snapshots with steady-state storage growth and Tools-share sensitivity), codec analysis, 720p cap and lifecycle levers, TA-19 LGPL FFmpeg notes, and resolution of `aun-upload`/`aun-media` overlap; update `repos/AlUmmahNowTools.md`. Small win in `AlUmmahNowTools`: add `h264_vaapi` support and options to `AlUmmahNow.ToolsCore/Import/Renditions.cs`, probe hardware candidates with a 1-frame null encode across `/dev/dri/renderD*` nodes, and fall back at runtime down the candidate list when a hardware encoder fails (with unit tests in `RenditionTests.cs`). If friendly encoder labels for `h264_vaapi`, `h264_mf`, and `libopenh264` are added to `BulkImportViewModel` after PR #54 merges, both English and Arabic `Resources.resw` entries are required. | No (encoder priority change waits on TP-D2; 720p cap waits on TP-D3) |
| **TP-5** | Bunny research findings and freeze/retirement recommendation (wiki) | `AlUmmahNowWiki` | Publish `guides/tools-bunny-research.md` with P1–P4 audit, side-by-side Bunny vs. R2 cost tables (Small, Medium, Large, and 2M viewer-hours), recommendation to freeze legacy Bunny clients in Tools until TA-14 removes them, and maintenance notes on `BunnyStreamClient`; update `repos/AlUmmahNowTools.md` and this epic page. | No (retiring legacy Bunny code executes in `TOOLS-ADMIN` TA-14 per TP-D4) |

## 4. Data model and API

`TOOLS-PLANS` adds **no new D1 tables, no new server API routes, and no schema migrations** in `AlUmmahNow` or `AlUmmahNowAuth`.

It operates on three existing contracts in `AlUmmahNowTools`:

- **Local FileScan SignalR hub (`/scanHub`):** hosted by `AlUmmahNow.FileScanService` on loopback (`http://localhost:5000` by default; configurable via `ASPNETCORE_URLS` or `Kestrel:Endpoints:Http:Url`), backed by local EF Core `ImportDbContext` (SQL Server LocalDB on Windows; SQLite in tests). Hub RPC methods: `StartScan`, `GetScanStatus`, `GetAllSessions`, `CancelScan`, `StartWatch`, `StopWatch`, `ResumeWatch`, `GetActiveWatches`, `GetWatchStatus`, `UpdateWatch`, `DeleteWatch`, `GetPendingApprovals`, `GetPendingApprovalsByChannel`, `ProcessApprovalDecision`, `ProcessBulkApproval`, `GetApprovalStatistics`. Push events: `ScanStarted`, `ScanProgress`, `ScanCompleted`, `ScanCancelled`, `ScanFailed`, `FileDetected`, `NewFileForApproval`, `WatchStatusChanged`, `WatchStopped`, `WatchResumed`, `WatchUpdated`, `WatchDeleted`, `ApprovalStatusChanged`, `ApprovalDecisionProcessed`, `BulkApprovalProcessed`.
- **Local work queue (`queue.json`):** per-environment JSON state managed by `AlUmmahNow.ToolsCore.Import.ImportQueue`, storing `QueueItem`, `StepState`, `RenditionSet`, `RenditionVerdict`, and `LogLine` entries.
- **Videos admin API (existing, read-only for this epic):** `GET /api/admin/import/encoding`, `GET /api/admin/import/items/:id/delivery`, and the pre-encoded rendition staging routes built in `TOOLS-ADMIN` TA-12.

## 5. Platforms

| Platform | What it needs in `TOOLS-PLANS` |
|---|---|
| **Web (`videos`, `www`)** | Nothing. All viewer encoding and delivery behavior is governed by `D2`, `AUN-R2-MIGRATION`, and `AlUmmahNow/apps/media`. |
| **Videos admin (`admin-web`, `admin-api`)** | Nothing. Costs, Delivery comparison, R2 backfill, and Imports views already live under `AUN-COST`, `AUN-R2-MIGRATION`, and `TOOLS-ADMIN` TA-8. |
| **Apple (iOS, iPadOS, macOS, tvOS)** | Nothing. Native Studio pre-encoding shares `AlUmmahNowCore` (`aun-media`, Epic 19.3/30). |
| **Android (phone, tablet, TV)** | Nothing. |
| **Desktop Studio (`AlUmmahNowDesktop`)** | Nothing directly; shares `AlUmmahNowCore` (`aun-media`, `UploadEngine`) with Tools, so the encoding research findings apply equally to Desktop Studio pre-encoding (D11). |
| **Desktop Tools (`AlUmmahNowTools`: Windows, macOS, Linux)** | TP-1 (FileScan consolidation cleanup + live SignalR tests), TP-2 (cross-platform ViewModel/UI-helper tests), TP-3 (CI coverage, SHA pinning, and Linux Xvfb desktop smoke tests), and TP-4's small win (`h264_vaapi` Linux hardware encoding in `ToolsCore`). |

## 6. Feature switches and tier rules

- `TOOLS-PLANS` introduces **no new user-facing features** and therefore requires no new entry on the admin Features page ([AUN-FEATURES](AUN-FEATURES-feature-switches.md)). (If friendly encoder names for `h264_vaapi`, `h264_mf`, and `libopenh264` are added to `BulkImportViewModel` in a follow-up after PR #54 merges, both English and Arabic `Resources.resw` strings must ship together.)
- The existing Tools desktop app is staff-only (`imports:manage` permission in `admin-api`), audited on every write, and bypasses creator-tier upload quotas per [TOOLS-ADMIN](TOOLS-ADMIN-admin-import-tool.md) and [O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers).
- Server-enforced feature switches (`upload`, `createChannel`, `captionsTranslate`) are wired into Tools separately under `AUN-FEATURES` (FEAT-15); none of the tests or research work in `TOOLS-PLANS` bypasses them.

## 7. Tests

- **FileScan SignalR integration (TP-1):** spins up `FileScanHub` in-process on loopback using `Program.ConfigureLoopbackEndpoint`, `Program.ConfigureSignalRCors`, and `Program.MapFileScanEndpoints` with a temp SQLite database, connects a real `FileScanSignalRClient`, runs scan creation/status/listing/cancellation, verifies SignalR push notifications arrive, and deletes temp folders and DB files in `DisposeAsync` even on failure.
- **ViewModel and UI-helper unit tests (TP-2):** deterministic xUnit tests running headlessly on `net9.0-desktop` (`Uno.Sdk`) with fake/in-memory collaborators — no network calls, no SQL Server, no paid AI, no hardcoded machine paths. Covers English and Arabic formatting (Arabic-Indic digits, CLDR plurals, separators, zones), model notifications, ViewModel validation/state transitions, and `ShellDemo` auth states.
- **Cross-platform desktop smoke tests (TP-3):** runs the compiled `net9.0-desktop` binary on Ubuntu CI under `xvfb-run` with `TOOLS_DEMO=1` and `TOOLS_SCREENSHOT` (no network, no credentials) across `signed-out`, `not-staff`, and `staff` Import views in both English and Arabic, verifying exit code `0` and non-empty PNG artifacts.
- **Encoding unit tests (TP-4 small win):** extends `AlUmmahNow.ToolsCore.Tests/RenditionTests.cs` to verify `h264_vaapi` detection, 1-frame hardware encoder probing across `/dev/dri/renderD*`, runtime fallback when a hardware encoder fails, encoder options, and pixel-format selection (`nv12` / `hwupload`).
- **Coverage:** `dotnet-test.yml` collects Cobertura coverage for `AlUmmahNow.Tests`, `AlUmmahNow.ToolsCore.Tests`, and `AlUmmahNow.VisualImporterUno.Tests` in CI.

## 8. Costs (within the $500/month cap)

- **CI and testing cost:** **$0/month.** `AlUmmahNowTools` is a public GitHub repository; GitHub-hosted Linux/Windows/macOS runners are free for public repos, and all tests use local/in-memory mocks with zero cloud calls and zero paid AI.
- **Encoding and delivery cost summary — month-12 accumulated library snapshot** (detailed breakdown, public pricing URLs, and sensitivity in TP-4 and TP-5 wiki guides; unit prices from `AlUmmahNow/docs/media-delivery/R2-DELIVERY-PLAN.md`, `apps/cost-monitor/src/pricing.ts`, Cloudflare R2/Containers pricing, and Bunny pricing retrieved 2026-11-23):

| Scale (monthly uploads / viewer-hours) | R2 + Server encode | R2 + Tools local pre-encode (100% Tools share, best case) | Bunny Stream (2 regions, Volume–NA/EU Std) | Relation to $500/mo whole-platform cap (O1) |
|---|---|---|---|---|
| **Small** (20 h / 2k viewer-h) | ~$16/mo | ~$11/mo | ~$21–$30/mo | Both well under cap (dual-write ~$40/mo) |
| **Medium** (200 h / 50k viewer-h) | ~$147/mo | ~$93/mo | ~$340–$565/mo | R2 fits comfortably; top end of Bunny Standard ($565) and dual-write breach $500 |
| **Large** (1,000 h / 500k viewer-h, month 12) | ~$740/mo | ~$470/mo *(~$275/mo with universal 720p cap)* | ~$2,800–$5,100/mo | **Tight at month 12:** ~$470 leaves only ~$30 for all other platform services and crosses $500 around month 13 as storage grows (~$36/mo); steady state requires R2 lifecycle/retention rules and/or a 720p cap |
| **2M viewer-h/mo** (1,000 h/mo uploads, month 12) | ~$778/mo *(~$48 Class B reads)* | ~$508/mo *(~$475–$508 depending on cache hit rate)* | **~$6,700–$18,600+/mo** *(Volume tiers to NA/EU Std; MENA/Asia Std higher)* | **R2 is orders of magnitude cheaper than Bunny, but sits at the $500 cap at month 12** without lifecycle rules or a 720p cap |

> **Important cap caveat:** O1 ($500/month) covers the **entire platform** (Workers, D1, KV, captions, live, and storage). At 1,000 h/month, R2 storage grows by ~$36/month past month 12 (`1,000 h × 2.4 GB × $0.015`). Staying under $500/month past year 1 at Large scale therefore requires storage levers — **R2 lifecycle / retention rules** (dropping or tiering unused 1080p rungs on cold videos) and/or a **720p cap** (`TP-D3`) — alongside pre-encoding on staff/Studio uploads.

## 9. Legal and safety concerns

- **FFmpeg and codec licensing (TA-19):** distributing GPL `libx264` inside signed installers would trigger GPL obligations. `TOOLS-ADMIN` TA-19 specifies bundling an **LGPL** FFmpeg build plus hardware encoders (VideoToolbox, NVENC, QSV, AMF, Media Foundation, VAAPI) and Cisco's BSD-licensed OpenH264 (binary downloaded on first use per Cisco's patent license). HEVC is avoided because of overlapping commercial patent pools (MPEG LA, Access Advance).
- **Quran Foundation compliance ([QF1](decisions.md#qf1-quran-foundation-content-use)):** `TOOLS-PLANS` does not store or copy Quran text; all test fixtures use synthetic strings only.
- **Credentials and supply chain:** retiring direct Bunny/R2 keys in Tools (TA-14) removes long-lived storage secrets from staff laptops. Pinning all GitHub Actions in `dotnet-test.yml` to full commit SHAs closes supply-chain exposure.
- **Local daemon security:** `FileScanService` binds SignalR CORS strictly to `localhost` and `127.0.0.1` and never exposes unauthenticated remote endpoints.
- **Payments:** none (no Stripe, per [O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans)).

## 10. Owner decisions

1. **`TP-D1` — Retire the stub `AlUmmahNow.VisualImporterUno.UITests` project (WinAppDriver / Uno.UITest):** **decided (2026-11-23)** — delete the WinAppDriver `AlUmmahNow.VisualImporterUno.UITests` stub and standardize on cross-platform xUnit ViewModel tests (`AlUmmahNow.VisualImporterUno.Tests`) plus `TOOLS_DEMO`/`TOOLS_SCREENSHOT` headless smoke tests across Windows, macOS, and Linux ([decisions.md](decisions.md#tp-d1-delete-the-winappdriver-uitests-stub); implemented in [AlUmmahNowTools#63](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/63)).
2. **`TP-D2` — Local pre-encoding encoder policy (`Renditions.cs`):** **decided (2026-11-23)** — follow **Maktaba's encoder policy**: OS-scoped hardware-first ordering (macOS `h264_videotoolbox`, Linux `h264_nvenc` → `h264_qsv` → `h264_vaapi`, Windows `h264_nvenc` → `h264_qsv` → `h264_amf` → `h264_mf`, then `libx264` → `libopenh264`), header-safe `-encoders` parsing, 0.2 s black-frame null test-encode probe (`-allow_sw 0` for VideoToolbox, `/dev/dri/renderD*` discovery for VAAPI), `TOOLS_ENCODER` override, transient `refusedSession` vs. permanent hardware failure handling, runtime fallback down to `libx264`/`libopenh264`, and local `ffprobe` output verification before staging ([decisions.md](decisions.md#tp-d2-follow-maktaba-encoder-policy); implemented in [AlUmmahNowTools#60](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/60)).
3. **`TP-D3` — 720p lecture cap for storage control:** **decided (2026-11-23)** — keep **1080p** default now; add an **admin setting to cap lectures at 720p, off by default**, for use only when R2 rendition storage passes ~10 TB (~$150/month) or total monthly costs near the $500/month cap ([decisions.md](decisions.md#tp-d3-keep-1080p-default-with-off-by-default-720p-lecture-cap-setting)).
4. **`TP-D4` — Legacy Bunny clients in `AlUmmahNowTools`:** **decided (2026-11-23)** — **remove the old Bunny client code from `AlUmmahNowTools` now** (do not wait for `TOOLS-ADMIN` TA-14), after auditing callers across Tools and open PRs (`#54`, `#59`–`#62`), moving or removing dead callers cleanly in a separate PR while keeping the app building and all tests passing ([decisions.md](decisions.md#tp-d4-remove-legacy-bunny-client-code-from-tools-now); implemented in [AlUmmahNowTools#64](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/64)).
5. **`TP-D5` — Cross-platform folder watcher (drop SQL Server LocalDB):** **decided (2026-11-23)** — the folder watcher must work identically on Windows, macOS, and Linux with nothing extra to install and must **drop SQL Server LocalDB** ([decisions.md](decisions.md#tp-d5-cross-platform-folder-watcher-without-localdb)). Full research and recommendation in [Tools cross-platform folder watcher research](../guides/tools-folder-watcher-research.md): in-process watcher in `AlUmmahNow.ToolsCore` using .NET `FileSystemWatcher` + periodic polling fallback for network drives, Maktaba-style debounce + size/mtime settling, SQLite (WAL) for state, and catch-up scan on app start (with optional launch-at-login / per-user agent in Phase 2 once builds are code-signed).

## Status evidence

- FileScan service concurrency fixes (TOOLS-5 to TOOLS-9): [AlUmmahNowTools#32](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/32), [AlUmmahNowTools#35](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/35), [AlUmmahNowTools#36](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/36), [AlUmmahNowTools#37](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/37), [AlUmmahNowTools#38](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/38) (merged 2026-11-10).
- Bunny storage retry/backoff and Stream error handling: [AlUmmahNowTools#19](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/19), [AlUmmahNowTools#24](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/24), [AlUmmahNowTools#30](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/30), [AlUmmahNowTools#39](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/39), [AlUmmahNowTools#48](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/48).
- Encoding and desktop release pipeline: [AlUmmahNowTools#21](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/21) (FFMpegCore), [AlUmmahNowTools#40](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/40) (thumbnail aspect), [AlUmmahNowTools#50](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/50) (work queue + TUS), [AlUmmahNowTools#52](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/52) (TA-12 local encode), [AlUmmahNowTools#56](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/56) (TA-15 release pipeline, `v2026.11.22`).
- Platform video delivery and cost monitoring: [AlUmmahNow#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686) (D2), [AlUmmahNow#893](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/893)–[#897](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/897) (R2 transcoder + Delivery page), [AlUmmahNow#1395](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1395) (R2 backfill), [AlUmmahNow#1400](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1400) (Costs page).

## Conflicts resolved

- `CONSOLIDATION_PLAN.md` said "Proposed - Awaiting Approval" even though P1–P4 were merged; TP-1 cleans up the remaining `FileScanApi` config/doc remnants and marks the plan completed.
- Resumable uploads and encoding queues in the 2025 Tools docs overlapped `aun-upload` ([Epic 11](E11-aun-core.md)) and `aun-media` ([Epic 30](E30-aun-media.md)); resolved by `TOOLS-ADMIN` TA-11/TA-12 (Tools uses `aun-core` `HlsPackageMp4`, reads the server's ladder from `admin-api`, and uploads through `admin-api` TUS rather than maintaining a separate pipeline).
- `TESTING_IMPLEMENTATION_PLAN.md` targeted Windows-only WinAppDriver; superseded by cross-platform xUnit ViewModel tests + `TOOLS_DEMO` headless smoke tests across Windows, macOS, and Linux.

## Sources

- [AlUmmahNowTools/CONSOLIDATION_PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/CONSOLIDATION_PLAN.md)
- [AlUmmahNowTools/TESTING_IMPLEMENTATION_PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/TESTING_IMPLEMENTATION_PLAN.md)
- [AlUmmahNowTools/VIDEO_ENCODING_RESEARCH.md](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/VIDEO_ENCODING_RESEARCH.md)
- [AlUmmahNowTools/BUNNY_NET_API_ANALYSIS.md](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/BUNNY_NET_API_ANALYSIS.md)
- [AlUmmahNow/docs/media-delivery/R2-DELIVERY-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/media-delivery/R2-DELIVERY-PLAN.md)
- [TOOLS-ADMIN](TOOLS-ADMIN-admin-import-tool.md) · [D2](D2-video-delivery.md) · [AUN-R2-MIGRATION](AUN-R2-MIGRATION-r2-video-migration.md) · [AUN-COST](AUN-COST-cost-monitoring.md)
