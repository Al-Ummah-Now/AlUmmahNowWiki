[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Al Ummah Now Tools: the admin import app

| | |
|---|---|
| **ID** | `TOOLS-ADMIN` |
| **Owning repos** | [AlUmmahNowTools](../repos/AlUmmahNowTools.md) (the desktop app), [AlUmmahNow](../repos/AlUmmahNow.md) (admin-api import surface, api-videos, processor, admin-web Imports page), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) (the app's OAuth client) |
| **Status** | **building**: spec merged 2026-11-21 |
| **Last updated** | 2026-11-21 |
| **Origin** | Owner, 2026-11-21: AlUmmahNowTools is an **admin** tool, not Studio |
| **Replaces** | [TOOLS-IMPORTER](TOOLS-IMPORTER-tools-visual-importer-roadmap.md) (superseded) and the "AlUmmahNowTools retirement plan" in [Epic 19.2](E19-studio-desktop.md) (withdrawn) |

## What the owner asked for (2026-11-21)

AlUmmahNowTools is an admin tool, not Studio. It must:

- be an app like all our apps: sign in through Auth, with access to the videos admin API, gated by admin permissions in admin-api;
- create channels and upload content;
- import content from public social media and post it to scholar pages, on demand and as scheduled sync jobs;
- **main part:** bulk import of videos into channels, through the normal APIs but with **no limits for this admin client** (no tier quotas, no upload rate limits; still signed in, permission-checked and audited). The server applies all its normal settings (processing, transcode ladder, review and moderation, captions, categories, tier rules other than limits) exactly as for any upload;
- run on Windows, macOS and Linux, desktop only;
- translation: start server transcription and translation, or transcode locally with ffmpeg before upload, and pick up sidecar files next to each video (`.srt`/`.vtt` captions, chapters, thumbnails, metadata JSON/CSV) and attach them.

Studio batch upload ([Epic 19.2](E19-studio-desktop.md)) is for creators. Admin bulk import is this app. Neither replaces the other.

## Architecture decision

**Keep the Uno app in AlUmmahNowTools. Replace its direct Bunny and database access with Auth sign-in and the videos admin API.**

| Choice | Decision | Why |
|---|---|---|
| UI stack | **Uno Platform (C#, the `net9.0-desktop` Skia head: Win32 on Windows, AppKit on macOS, X11 on Linux; today `Program.cs` only enables X11)**, the existing `AlUmmahNow.VisualImporterUno` app, renamed in the UI to **Al Ummah Now Tools** | One codebase for all three desktops, already built and tested (~258 tests). Desktop Studio uses WinUI 3 on Windows and GTK 4 on Linux, two heads per feature; an internal admin tool does not need native chrome. |
| Sign-in | **Auth, public native client "Admin Tools (Desktop)"** (PKCE S256, no secret), one id for QA and one for stage/prod, added by an Auth migration like Admin (Windows) ([AlUmmahNowAuth#365](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/365)). System browser; the redirect is `http://127.0.0.1/auth/callback` on a port the OS picks (RFC 8252 §7.3; Auth's registry already lets loopback ports vary, as for Desktop Studio), so it works the same on all three systems with no URL scheme to register. Staff only: the client joins Auth's `ADMIN_NATIVE_CLIENT_IDS`, so a refresh is refused once the user holds no staff role. admin-api accepts it as a new first-party audience `adminTools` (`shared-types/token-audience.ts`). | Same SSO as every app. No operator keys on the computer. |
| API | **admin-api only** (`/api/admin/import/*` plus the existing admin routes). admin-api checks the permission on every call, writes the audit row, and calls api-videos through its service binding with the acting admin. The app never calls Bunny, R2 or D1. | Permissions live in admin-api ([videos users ≠ Auth users](../guides/roles.md)); one place to audit. |
| Core | **aun-core through its .NET bindings** (NuGet `AlUmmahNow.Core`, net8.0, native libraries for win-x64/arm64, linux-x64/arm64 and universal macOS), pinned and fetched by checksum like Desktop (`scripts/fetch-core.sh`): `AuthManager` (PKCE, loopback redirect, refresh rotation, RFC 7009 sign-out), `UploadEngine` (TUS, persistent parallel queue, restart recovery, SHA-256 before upload, folder watch) and `aun-media` (the server's HLS ladder and packaging for local encoding). Token storage is the app's `SecureStorage`: DPAPI on Windows and libsecret on Linux (both as in Desktop), and a new Keychain store on macOS. | The same sign-in, upload and encoding code as Desktop Studio, tested once in Core. |
| Admin API client | A small C# client in the app (`AlUmmahNow.Tools.AdminApi`) for `/api/admin/import/*`, like Desktop Admin's `AdminApiReviewService`. | Core has no admin-api client, and one internal tool doesn't justify adding one. |
| Limits | admin-api calls new api-videos routes under `/internal/admin/import/*` (service binding, internal key, `X-Admin-Actor`). They initiate an upload **for the channel** (not as a channel member) and skip only the creator-tier gate (`uploads_by_invitation`), the per-tier hourly/daily/concurrent counters (`upload-limits.ts`), the edge initiate limiter and the max-channels check. The initiate is the same `initiateOnce` claim, so a retried item reuses its video, and the bytes go through the same Bunny or R2 ingest. After completion the video takes the normal path: processing loop, transcode ladder, review gate and scan, category rules, moderation text scan, captions. | "No limits for this admin client", while processing, review, captions and categories stay exactly as for any upload. |
| Background work | Sidecar attachment, caption and translation requests and social syncs are **admin jobs** (`SEARCH_DB.admin_jobs`, queue `al-ummah-now-admin-jobs`, backoff 10 s × 2ⁿ up to 300 s, 5 retries, then `failed` and the DLQ), with new kinds `import.attach`, `import.captions` and `import.source-sync`. They are idempotent and step-based like `playlist.add-videos`. A failure shows on the item as *Failed — Retry*, on the **Errors** page with Retry (`reportNeedsAction`, allowlisted retry path), and on the admin **Jobs** page. New: per-job log lines (`admin_job_logs`), shown on the job's page with attempts n/max and the next retry, and an **Imports** view of batches and their items. | [Always async, failures flag admin](decisions.md#o26-always-async-with-admin-visible-errors); troubleshooting from admin, never from Cloudflare. |
| Header controls | The app uses the shared header (logo lockup, language button, sun/moon button, account control, environment badge) in the same order and sizes as every app; en and ar with RTL; light and dark (no System option). | [Unify shared controls](../guides/theming.md). |

### What is removed

`AlUmmahNow.BunnyBulkUploader` (direct Bunny Stream writes), the DataImporter's database writes and the app's Bunny/R2 settings. The FileScanService keeps the folder watch and approvals, but an approved file is uploaded through admin-api like any other. Once the owner has run the first import through the new path, the operator Bunny and R2 keys the old tools used are revoked.

## Permissions

| Permission (admin-api `lib/roles.ts`) | Roles | Allows |
|---|---|---|
| `imports:manage` (new) | super admin, admin | Use the app; create import batches; upload into any channel; attach sidecars; request captions and translations; see and retry import jobs |
| `channels:manage` (exists) | super admin, admin | Create a channel for a videos user from the app (the existing `createChannelFor`, no tier or max-channel check) |
| `import_sources:manage` (new) | super admin | Add, change and remove social import sources and their schedules, and record an owner's permission |

Moderators can sign in to Auth but the app shows "This app is for Al Ummah Now admins" and admin-api refuses every import call. Every write is audited (`site_settings_log`, new content kind `import`) with the acting admin and the app's client id.

## Stories

| # | Story | Repo | Acceptance notes |
|---|---|---|---|
| TA-1 | Spec, wiki, registry, Linear | Wiki | This page; E19.2 and TOOLS-IMPORTER corrected; registry entry; Linear epic and stories. |
| TA-2 | Auth client "Admin Tools (Desktop)" | AlUmmahNowAuth | Public PKCE client per environment (QA and prod/stage ids), loopback redirect, staff-only refresh (admin-native set), tests. |
| TA-3 | admin-api import surface: permissions, me, batches | AlUmmahNow | `imports:manage`, `import_sources:manage` in the role map; accepts the app's client id; `GET /api/admin/import/me`; import batches and items tables; audit on every write. Unit tests. |
| TA-4 | Admin channel creation | AlUmmahNow | `POST /api/admin/import/channels` (`channels:manage`): creates a channel owned by a chosen videos user (or the acting admin) through the existing `createChannelFor`; no tier or max-channels check; same validation as today (duplicate name 409, handle claim); audited. |
| TA-5 | Unlimited admin uploads | AlUmmahNow | `POST /api/admin/import/batches/:id/items` returns a resumable upload for a channel; api-videos initiate with the admin-import grant skips the tier gate and upload counters only; idempotent per batch item (same file hash → same video); processing, transcode, review, captions and categories exactly as any upload. Unit + local E2E. |
| TA-6 | Sidecars | AlUmmahNow | Captions (`.vtt`, `.srt` converted to WebVTT, language from `name.<lang>.srt`), chapters (`.chapters.txt`/JSON), custom thumbnail (shape check as uploads), metadata (`.json` per video, or one CSV per folder: title/description en and ar, tags, category, visibility, publish date, playlist). Attached by a queued job once the video exists; failures retry and flag admin. |
| TA-7 | Captions and translation requests | AlUmmahNow | Per item or per batch: transcribe on the server, then translate to chosen languages, through the AUN-CAPTIONS caption jobs. The channel owner's caption minutes are not charged or checked (admin import, audited per request); the platform's caption budget still applies, so a job may wait in `waiting_budget` as any job does. |
| TA-8 | Imports in videos admin | AlUmmahNow | An Imports view (batches → items: file, channel, video, state, sidecars, captions) and, on the existing Jobs page, each job's attempts n/max, next retry, last error in plain words and log lines; Retry and Cancel; Errors page items link here. en/ar, light/dark, desktop/phone. Visual: held for owner screenshots. |
| TA-9 | Social import sources and scheduled sync | AlUmmahNow | Sources per channel, only for a channel whose owner authorized them (below); on-demand "Sync now" and a schedule (hourly, daily, weekly); queued idempotent sync jobs (dedupe on source + item id); every item becomes a community post on the channel through the normal post code and moderation, videos through the TA-5 upload path and a `video` post; source link and original time kept. |
| TA-10 | App: sign-in and shell | AlUmmahNowTools | Auth sign-in (PKCE, loopback), token store per OS, environment picker (QA, stage, production), "This app is for Al Ummah Now staff" for non-staff, shared header controls, en/ar with RTL (#43), owner's staff icon (#44). |
| TA-11 | App: bulk import | AlUmmahNowTools | Pick or create a channel; scan a folder; sidecar pickup per video; metadata CSV/JSON; review table; SHA-256 dedupe; resumable parallel TUS uploads with progress, pause and resume across restarts; per-item retry; every client error reported to the server; confirm destructive actions in an in-app dialog (#46). |
| TA-12 | App: local transcode | AlUmmahNowTools | Optional ffmpeg pass before upload: the server's own ladder through the local-encoding contract (Epic 19.3: the server checks every rung and encodes itself when anything is off), or a single high-quality mezzanine for huge sources. ffmpeg found on PATH or chosen in settings. |
| TA-13 | App: captions, translation, social sources | AlUmmahNowTools | Request transcription/translation per item or batch; list, add and run social sources (super admin); show sync jobs and their errors. |
| TA-14 | App: folder watch and approvals on the API | AlUmmahNowTools | FileScanService watch + approvals upload through admin-api; Bunny uploader and DB writes removed; old keys revoked after the first import. |
| TA-15 | Release flow | AlUmmahNowTools | Proposed, like Desktop's `release.yml`: a tag `vX.Y.Z` on master builds production defaults, `vX.Y.Z-preview.N` builds QA defaults as a pre-release. Windows MSIX + portable zip (Authenticode-signed when `WINDOWS_CERT_*` are set, as Desktop Admin's `ADMIN_WINDOWS_CERT_*`), macOS `.dmg` (Developer ID signed and notarized when the Apple secrets are set), Linux `.deb` and `.tar.gz`; each smoke-launched in CI; a draft GitHub release with `SHA256SUMS.txt`. Internal distribution only. |
| TA-16 | Security and repo hygiene | AlUmmahNowTools | SECURITY.md and SHA-pinned actions ([#29](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/29)); CI on .NET 9 with all projects. |
| TA-17 | Transcript suggestions for tags and classification | AlUmmahNow, AlUmmahNowTools | For each imported video, a queued job reads its transcript (the sidecar `.srt`/`.vtt` when there is one, otherwise the server transcript once the AUN-CAPTIONS job is done) and suggests tags, category, topics, language, speaker (the scholar) and, optionally, a better title and description in en and ar. Suggestions only: the app's review step shows them per field with Accept, Edit and Reject, plus Accept for the whole batch; nothing is applied until the admin confirms. Stored with the video so Studio and admin can reuse them. Details below. |

## Transcript suggestions (owner, 2026-11-21)

The importer uses each video's transcript to suggest how to tag and classify it. **Nothing is applied without the admin confirming.**

| Step | How | Cost |
|---|---|---|
| Transcript | The sidecar caption file, if any; otherwise the server transcript when its caption job finishes (the job waits for it, it never starts transcription by itself) | none |
| 1. Vocabulary match | Keyword and phrase matching against **our own** vocabulary: the admin-managed categories ([AUN-VIDEO-CATEGORIES](AUN-VIDEO-CATEGORIES-admin-managed-categories.md)) with their en/ar names and keywords, the channel's and platform's existing tags, the scholar names of linked channels, and Quran references the caption pipeline already finds. Scored by frequency and position. Language from the caption track. | none (Worker CPU) |
| 2. Workers AI, only when it helps | Only when step 1 is unsure (no category above its threshold) or the admin asked for title/description suggestions. One call to the open-weight model already used for translation (`@cf/google/gemma-4-26b-a4b-it`, $0.10 / $0.30 per million input/output tokens), with an excerpt of at most about 4,000 tokens and the vocabulary as the allowed answers. | about $0.0005 a video; 1,000 imported videos a month ≈ **$0.50** |

- **A queued job** `import.suggest` (admin jobs: retry/backoff, DLQ, Errors page with Retry, per-job log lines).
- **Stored with the video** (`video_suggestions`: field, value, source `vocabulary` or `ai`, score, state `pending`/`accepted`/`edited`/`rejected`, who and when), so Studio and admin read the same suggestions later. The category suggestion uses the existing "AI suggests, uploader confirms" record ([CHAT-AI-CATEGORIES](CHAT-AI-CATEGORIES-ai-categories.md)), not a second one.
- **In the app**: the review step shows each suggestion beside the current value with Accept, Edit and Reject, and "Accept all suggestions" for the batch, with a count of what will change. Accepting writes through the normal video update, audited.
- **Tests** use a mocked model; no paid AI in tests.

## Social import: what we import, and how we stay within each platform's terms

Imports only go **into a channel whose owner authorized the source**: the owner connected the account themselves (Studio → Social connections or the YouTube import's Google consent), or a super admin recorded the owner's written permission (who, when, and a note), which is audited. Nothing is scraped from web pages.

| Platform | Path | Notes |
|---|---|---|
| YouTube | YouTube Data API with the channel owner's consent (reuses [AUN-YT-IMPORT](AUN-YT-IMPORT-move-from-youtube.md)) for metadata, thumbnails, captions and new-video detection; the **files** come from the owner's Google Takeout export, which the app picks up from a watched folder and matches by video id | YouTube's terms forbid downloading from youtube.com, and the API has no file endpoint. No yt-dlp, ever. |
| Telegram public channel | Bot API: our bot added to the channel by a channel admin (the SOC-1 one-time code); new posts arrive by webhook or `getUpdates` | Videos over the Bot API's 20 MB download limit are listed as "too large for Telegram's bot API" and need the file dropped into the app. |
| Bluesky | Public AT Protocol API (`app.bsky.feed.getAuthorFeed`, video blobs) | Open protocol; the account owner's authorization still required. |
| Mastodon | The server's public API (`/api/v1/accounts/:id/statuses`, media attachments) | Per-instance terms apply; owner authorization required. |
| RSS, Atom and podcast feeds | The feed and its enclosures | Feeds are published for syndication. |
| X | Not imported | Reading posts through the X API is paid per request; not worth it within the [$500/month cap](decisions.md#o1-whole-platform-cost-cap). |
| Facebook, Instagram, Threads | Not imported | No Meta integration ([SM-6](decisions.md#sm-6-register-a-business-for-meta)). |
| TikTok | Not imported | No API returns the video file. |

### How imported items reach the scholar page (owner, 2026-11-21)

A scholar page has no store of its own: it shows the **community posts of the scholar's channel** (CMS `/scholars/:slug` reads them through api-videos). So every imported social item becomes a **community post on that channel**, created through the same post code as Studio (`endpoints/community/create-post.ts`, PostV2 kinds), with the server's normal post rules and moderation: the text scan (`scanInBackground`), the image gate and image scan (`imageGate`, `queueImageScan`) and, in production, review.

| Source item | What is created |
|---|---|
| Text | A `text` post |
| Image(s) | An `image` post; the images are copied to the platform media host first, as any post image |
| Link | A `link` post |
| Video | The file goes through the channel's normal video upload (the TA-5 path: processing, transcode, review, categories), then a `video` post points at the new video |

- **Source link and time.** Every post keeps the original's URL and its original publish time ("First posted on Telegram, 12 Nov 2026"); an imported video keeps them on the video too.
- **No duplicates on re-sync.** Each source item is recorded once (unique on source + item id) with the post and video it produced. A re-sync skips it, and a retried job reuses the same post and the same video (`initiateOnce`).
- **Author.** The post is the channel's, as if the owner had posted it; the audit row names the admin and the source.
- An item the moderation scan holds stays held, exactly as a post written in Studio.

## Running cost

None when idle: no messages in the queues; one hourly cron tick in the processor finds due sources (a single D1 query). Per import: the uploads' normal cost (originals and transcodes, as any upload), a few queue messages per item, caption minutes when asked for, and transcript suggestions at about $0.0005 a video when Workers AI is needed. Within the [$500/month cap](decisions.md#o1-whole-platform-cost-cap).

## Decisions and constraints

- [O1](decisions.md#o1-whole-platform-cost-cap): Whole-platform cost cap (decided)
- [O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers): Uploads are invite-only for users; this admin path is for staff and audited
- [O26](decisions.md#o26-always-async-with-admin-visible-errors): Always async, failures on the admin Errors page
- [SM-6](decisions.md#sm-6-register-a-business-for-meta): No Meta
- UI is bilingual en/ar with RTL, light and dark.

## Status evidence

- Spec: this page.
- Linear: epic [HLB-947](https://linear.app/hamzalabs/issue/HLB-947), stories TA-1…TA-16 = HLB-948…HLB-963, TA-17 = HLB-964.

## Sources

- Owner's requirements, 2026-11-21 (relayed by the orchestrator).
- [AlUmmahNowTools](https://github.com/Al-Ummah-Now/AlUmmahNowTools) master; [TOOLS-IMPORTER](TOOLS-IMPORTER-tools-visual-importer-roadmap.md); [AUN-ADMIN-NATIVE](AUN-ADMIN-NATIVE-native-admin-app.md); [AUN-YT-IMPORT](AUN-YT-IMPORT-move-from-youtube.md); [AUN-SOCIAL](AUN-SOCIAL-social-media-management.md); [AUN-CAPTIONS](AUN-CAPTIONS-transcription-translation.md).
