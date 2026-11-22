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
- translation: start server transcription and translation, or transcode locally with ffmpeg before upload, and pick up sidecar files next to each video (`.srt`/`.vtt` captions, chapters, thumbnails, metadata JSON/CSV) and attach them;
- use transcripts to suggest tags and classification, confirmed by the admin;
- **local first** (later the same day): the heavy work (transcoding, transcription, suggestions) runs on the admin's computer, not the server, to save platform cost; the server verifies instead of re-encoding;
- the site's edit pages (Studio and videos admin) offer the same suggestions, made on the server.

Studio batch upload ([Epic 19.2](E19-studio-desktop.md)) is for creators. Admin bulk import is this app. Neither replaces the other.

## Architecture decision

**Keep the Uno app in AlUmmahNowTools. Replace its direct Bunny and database access with Auth sign-in and the videos admin API.**

| Choice | Decision | Why |
|---|---|---|
| UI stack | **Uno Platform (C#, the `net9.0-desktop` Skia head: Win32 on Windows, AppKit on macOS, X11 on Linux; today `Program.cs` only enables X11)**, the existing `AlUmmahNow.VisualImporterUno` app, renamed in the UI to **Al Ummah Now Tools** | One codebase for all three desktops, already built and tested (~258 tests). Desktop Studio uses WinUI 3 on Windows and GTK 4 on Linux, two heads per feature; an internal admin tool does not need native chrome. |
| Sign-in | **Auth, public native client "Admin Tools (Desktop)"** (PKCE S256, no secret), one id for QA and one for stage/prod, added by an Auth migration like Admin (Windows) ([AlUmmahNowAuth#365](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/365)). System browser; the redirect is `http://127.0.0.1/auth/callback` on a port the OS picks (RFC 8252 §7.3; Auth's registry already lets loopback ports vary, as for Desktop Studio), so it works the same on all three systems with no URL scheme to register. Staff only: the client joins Auth's `ADMIN_NATIVE_CLIENT_IDS`, so a refresh is refused once the user holds no staff role. admin-api accepts it as a new first-party audience `adminTools` (`shared-types/token-audience.ts`). | Same SSO as every app. No operator keys on the computer. |
| API | **admin-api only** (`/api/admin/import/*` plus the existing admin routes). admin-api checks the permission on every call, writes the audit row, and calls api-videos through its service binding with the acting admin. The app never calls Bunny, R2 or D1. | Permissions live in admin-api ([videos users ≠ Auth users](../guides/roles.md)); one place to audit. |
| Core | **aun-core through its .NET bindings** (NuGet `AlUmmahNow.Core`, net8.0, native libraries for win-x64/arm64, linux-x64/arm64 and universal macOS), pinned and fetched by checksum like Desktop (`scripts/fetch-core.sh`): `AuthManager` (PKCE, loopback redirect, refresh rotation, RFC 7009 sign-out), `UploadEngine` (TUS, persistent parallel queue, restart recovery, SHA-256 before upload, folder watch) and `aun-media` (the server's HLS ladder and packaging for local encoding). Token storage is the app's `SecureStorage`: DPAPI on Windows and libsecret on Linux (both as in Desktop), and a new Keychain store on macOS. | The same sign-in, upload and encoding code as Desktop Studio, tested once in Core. |
| Where the work runs | **Local first.** Transcoding, transcription and suggestions run on the admin's computer; the server receives finished renditions, caption drafts and suggestions and **checks** them. It encodes or transcribes itself only when the admin picks "Let the server do it" or the local step fails. | Owner, 2026-11-21: save platform cost ($500/month cap). |
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
| TA-7 | Captions: local transcripts, server translation | AlUmmahNow | Local transcripts arrive through the existing on-device transcript route (`POST /api/videos/:videoId/captions/drafts/:language/transcript`, D10), called by admin-api for the channel: the same Quran layer, no caption minutes. Sidecar captions win when present. Translation is a server caption job (`captions/translations`); server transcription only when the admin asks for it or the local run failed. The channel owner's caption minutes are not charged or checked (admin import, audited per request); the platform caption budget still applies, so a job may wait in `waiting_budget`. Quran: verse keys only, per [Quran Foundation terms](#quran-foundation-terms-binding-2026-11-21). |
| TA-8 | Imports in videos admin | AlUmmahNow | An Imports view (batches → items: file, channel, video, state, sidecars, captions) and, on the existing Jobs page, each job's attempts n/max, next retry, last error in plain words and log lines; Retry and Cancel; Errors page items link here. en/ar, light/dark, desktop/phone. Visual: held for owner screenshots. |
| TA-9 | Social import sources and scheduled sync | AlUmmahNow | Sources per channel, only for a channel whose owner authorized them (below); on-demand "Sync now" and a schedule (hourly, daily, weekly); queued idempotent sync jobs (dedupe on source + item id); every item becomes a community post on the channel through the normal post code and moderation, videos through the TA-5 upload path and a `video` post; source link and original time kept. |
| TA-10 | App: sign-in and shell | AlUmmahNowTools | Auth sign-in (PKCE, loopback), token store per OS, environment picker (QA, stage, production), "This app is for Al Ummah Now staff" for non-staff, shared header controls, en/ar with RTL (#43), owner's staff icon (#44). |
| TA-11 | App: bulk import and the work queue | AlUmmahNowTools | Pick or create a channel; scan a folder; sidecar pickup per video; metadata CSV/JSON; review table; SHA-256 dedupe. **One local work queue** for every step (hash, transcode, transcribe, suggest, upload, attach): per-file and per-step state saved to disk, survives restarts, a parallelism setting (per step: encodes, transcriptions, uploads), pause and resume per item and for all, automatic retry with backoff then *Failed — Retry*, a log per item the admin can open and copy. Resumable TUS uploads through aun-core's `UploadEngine`. Every client error is reported to the server (Errors page). Destructive actions confirm in an in-app dialog (#46). |
| TA-12 | App: local transcode | AlUmmahNow, AlUmmahNowTools | **Default on.** The app reads the server's ladder and encode settings from admin-api (`GET /api/admin/import/encoding`: rungs, max rates, audio rates, segment and GOP lengths, codecs, the same values the media container uses in `ladder.mjs`), encodes the rungs with ffmpeg and packages HLS with aun-core's `hls_ladder`/`hls_package_mp4`, uploads the original and the finished rungs through the local-encoding contract (`POST /api/videos/:videoId/renditions` … `complete`, Epic 19.3). The server checks them (ladder, codecs, segments, every segment decoded, picture and sound matched against the source at random points) and serves them; on any mismatch it encodes itself and the item shows why. Applies when the channel's delivery target is R2; for a Bunny target, Bunny encodes as today. "Let the server encode" per batch. |
| TA-13 | App: local transcription, translation requests, social sources | AlUmmahNowTools | Speech to text **on the computer** with whisper.cpp through aun-core (already in the desktop builds, D10): Arabic and English, the model downloaded once on first use with a checksum (default `large-v3-turbo`, smaller models selectable), GPU when present (Metal on macOS; CUDA or Vulkan on Windows and Linux), CPU otherwise. The transcript goes up as a caption draft (TA-7). Translation is requested from the server: no local model is good enough for Arabic↔English with a licence we can ship (NLLB is non-commercial). Social sources: list, add and run them (super admin), with sync jobs and their errors. Quran: verse keys only, per [Quran Foundation terms](#quran-foundation-terms-binding-2026-11-21). |
| TA-14 | App: folder watch and approvals on the API | AlUmmahNowTools | FileScanService watch + approvals upload through admin-api; Bunny uploader and DB writes removed; old keys revoked after the first import. |
| TA-15 | Release flow | AlUmmahNowTools | Proposed, like Desktop's `release.yml`: a tag `vX.Y.Z` on master builds production defaults, `vX.Y.Z-preview.N` builds QA defaults as a pre-release. Windows MSIX + portable zip (Authenticode-signed when `WINDOWS_CERT_*` are set, as Desktop Admin's `ADMIN_WINDOWS_CERT_*`), macOS `.dmg` (Developer ID signed and notarized when the Apple secrets are set), Linux `.deb` and `.tar.gz`; each smoke-launched in CI; a draft GitHub release with `SHA256SUMS.txt`. Internal distribution only. |
| TA-16 | Security and repo hygiene | AlUmmahNowTools | SECURITY.md and SHA-pinned actions ([#29](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/29)); CI on .NET 9 with all projects. |
| TA-17 | Suggestions in the importer (local) and one stored format | AlUmmahNow, AlUmmahNowTools | The app makes suggestions **on the computer** from each transcript (sidecar first, else its local transcript): keyword and phrase matching against the server's vocabulary, fetched from admin-api (categories with en/ar names and keywords, tags, scholar names). No local AI model. Where the local match is unsure the admin can ask the server's Suggest (TA-18) for that item, within its cap. The review step shows each suggestion with Accept, Edit and Reject, plus Accept for the batch; nothing is applied until the admin confirms. Suggestions are uploaded and stored with the video in the **shared format** (below), so Studio and admin show them too. Quran: verse keys only, per [Quran Foundation terms](#quran-foundation-terms-binding-2026-11-21). |
| TA-18 | Suggest on the site (Studio and videos admin) | AlUmmahNow | A **Suggest** action on Studio's video edit page (web) and the videos admin's video edit page. Server side: the transcript from the captions pipeline (or uploaded captions), the free vocabulary match first, then Cloudflare Workers AI for what the match can't settle and for title/description in en and ar. A queued job (`video.suggest`, retry/backoff, DLQ, Errors page with Retry, state shown on the page). Results in the shared format; Accept, Edit and Reject per field, never applied by itself. Limits: per user per day by tier (an admin setting), and a **monthly cost cap** (admin setting, default $10) with a usage meter on the admin cost page; at the cap Suggest says it's paused until next month. AI mocked in tests. Visual (Studio and admin UI): held for owner screenshots. Quran: verse keys only, per [Quran Foundation terms](#quran-foundation-terms-binding-2026-11-21). |
| TA-19 | Packaging ffmpeg and speech to text | AlUmmahNowTools | The installers carry an **LGPL** ffmpeg build (no GPL parts, no libx264/x265): H.264 through the system's hardware encoders (VideoToolbox on macOS; Media Foundation, NVENC, QSV or AMF on Windows; VAAPI or NVENC on Linux) and Cisco's OpenH264 (BSD; its binary downloaded on first use, as Cisco's patent licence requires) as the software fallback. whisper.cpp comes inside aun-core (MIT); Whisper models are MIT and downloaded on first use. A licences page in the app lists each with its source. |
| TA-20 | Transcript translation into caption tracks | AlUmmahNow, AlUmmahNowTools | Every transcript is translated into the other site language (ar↔en), and later into any language in the captions pipeline's language list, and stored as a **caption track per language** the viewer picks in the player. Importer: the server's translation caption job (no shippable local model, see TA-13); site edit: the same job from Studio or admin. Each translated track is a **draft until a person publishes it** (review and edit in the caption editor), and published tracks are labelled "Machine translated" / «ترجمة آلية» in the player's caption menu until someone edits them. Quran verses follow AUN-CAPTIONS: verse text is never machine-translated; the verse-synced translation from the channel's Quran Foundation edition is used. Quran: verse keys only, per [Quran Foundation terms](#quran-foundation-terms-binding-2026-11-21). |
| TA-21 | SEO keywords in both languages and search that finds them | AlUmmahNow, AlUmmahNowTools | **Every video gets keywords in Arabic and in English, whatever the spoken language** (owner). From the transcript in its language and from its translation (TA-20), plus title and description, plus the proper English renderings of Islamic terms and names from a shared glossary (below). Suggested with the tags (TA-17/TA-18), stored per language once accepted, then used on that language's page: `<meta name="keywords">`, the watch page's `VideoObject` (`keywords`, `inLanguage`, `transcript`/caption references), the en and ar watch URLs that AUN-SEO already pairs with hreflang, and the search index, so a search in either language finds the video. Search matching uses the existing Arabic normalization (`normalizeArabic`: harakat, alef and hamza forms, taa marbuta, yaa/alef maqsura) plus the glossary's transliteration variants. Quran: verse keys only, per [Quran Foundation terms](#quran-foundation-terms-binding-2026-11-21). |

## Suggestions from transcripts (owner, 2026-11-21)

Two paths, **one stored format**, nothing applied without a person confirming.

| | Importer (desktop, TA-17) | Site edit: Studio and videos admin (TA-18) |
|---|---|---|
| Transcript | Sidecar `.srt`/`.vtt`, else the app's local whisper.cpp transcript | Uploaded captions, else the captions pipeline's transcript (Suggest waits for it; it never starts a transcription by itself) |
| Step 1 (free) | Vocabulary match **on the computer** | Vocabulary match in the Worker |
| Step 2 | None locally; the admin may ask the server's Suggest for an item | Workers AI, only for what step 1 can't settle and for title/description |
| Where it runs | The app's work queue | Admin job `video.suggest` (retry, DLQ, Errors page with Retry) |
| Limits | None (the computer pays) | Per user per day by tier; monthly cost cap with a usage meter |

**The vocabulary match**: keywords and phrases against our own vocabulary (the admin-managed categories with their en/ar names and keywords, [AUN-VIDEO-CATEGORIES](AUN-VIDEO-CATEGORIES-admin-managed-categories.md); the channel's and the platform's tags; the scholar names of linked channels; Quran references the caption pipeline finds), scored by frequency and position, language from the caption track. Both paths run the **same matcher**: a pure function in `packages/shared-types` (`suggestFromTranscript`), mirrored in C# for the app and kept identical by shared test fixtures that both test suites run.

**Workers AI** (site path only): one call to Workers AI through the same model chain the caption translation uses (AlUmmahNow [#1398](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1398): DeepSeek V4.1 Flash, falling back to Gemma 4 26B at $0.10 / $0.30 per million input/output tokens; DeepL stays off) with an excerpt of at most about 4,000 tokens and the vocabulary as the allowed answers: about **$0.0005 a video**, so 1,000 Suggest runs a month ≈ $0.50. The monthly cap (default $10) stops runaway use. It is separate from the existing captions budget ($100/month) and inline translation budget ($20/month); like those, a job over the cap waits (`waiting_budget`) and alerts admins instead of failing.

**Stored format** (`video_suggestions` in SEARCH_DB, one row per field): video, field (`tags`, `category`, `topics`, `language`, `speaker`, `title.en`, `title.ar`, `description.en`, `description.ar`), value, source (`vocabulary`, `ai`, `local`), score, state (`pending`, `accepted`, `edited`, `rejected`), who decided and when. The category suggestion also fills the existing "AI suggests, uploader confirms" record ([CHAT-AI-CATEGORIES](CHAT-AI-CATEGORIES-ai-categories.md)), so there is one category suggestion, not two. Accepting writes through the normal video update and is audited.

## Translated caption tracks and bilingual keywords (owner, 2026-11-21)

**Caption tracks.** A video's transcript (sidecar, local or server) is translated into the other site language by the server's translation caption job, and the result is a caption draft for that language. A person publishes it from the caption editor (Studio, admin, or the importer's review step). Until a published translated track is edited by a person, the player lists it as "English (machine translated)" / «العربية (ترجمة آلية)». More languages later come from the captions pipeline's language list; nothing here is hard-coded to two. Quran verses are never machine-translated: AUN-CAPTIONS puts the verse-synced translation from the channel's Quran Foundation edition in their place, as verse keys rendered at play time (see [Quran Foundation terms](#quran-foundation-terms-binding-2026-11-21)).

**Keywords in both languages.** For every video:

- **Arabic keywords** come from the Arabic transcript (or the Arabic translation of an English one) and the Arabic title and description.
- **English keywords** come from the English transcript (or the translation of an Arabic one), the English title and description, and the glossary's English renderings of the Islamic terms and names the Arabic side found (e.g. «صلاة» → *salah, salat, prayer*; «ابن تيمية» → *Ibn Taymiyyah, Ibn Taymiya*).
- Extraction is the same vocabulary matcher (keyphrases scored by frequency and position, stop words removed per language); on the site path Workers AI may add keyphrases the matcher missed, within the Suggest cap.
- Both sets are **suggestions** next to the tags, accepted per keyword or all at once, and stored per language (`video_keywords`: video, language, keyword, source, state).

**Where accepted keywords go** (following [AUN-SEO](AUN-SEO-search-visibility.md)'s rules: each language self-canonical at `/{l}/video/{id}`, reciprocal hreflang with x-default English, JSON-LD values in the page's language, no transliteration inside JSON-LD text fields):

| Place | English page `/en/video/{id}` | Arabic page `/ar/video/{id}` |
|---|---|---|
| `<meta name="keywords">` | English set | Arabic set |
| `VideoObject.keywords` | English set | Arabic set |
| `VideoObject.inLanguage` | the spoken language | the spoken language |
| `VideoObject` caption references | `subjectOf` each published caption track's WebVTT URL with its language | same |
| Search index | both sets on the video's search row, so either language finds it | |

**Shared glossary** (`packages/shared-types/src/search/glossary.ts`): Islamic terms and names with the Arabic form, the preferred English rendering and common transliteration variants (*Qur'an, Quran, Koran*; *hadith, hadeeth*; *Ramadan, Ramadhan*). Search expands a query through it in both directions after `normalizeArabic` and lower-casing, so «رمضان», *Ramadhan* and *ramadan* find the same videos. The glossary is reviewed data in the repo (a PR changes it), seeded from the terms the Quran index and the category vocabulary already hold.

## Quran Foundation terms (binding, 2026-11-21)

Quran Foundation's reply binds every story here (importer and site): captions, transcripts, transcript translations, suggestions, keywords, the search index, SEO meta and JSON-LD, and exports.

- **Never store Quran text or its translation with a video.** Persistent stores hold only **verse keys** (e.g. `2:255`) and our own timestamps. Text and translation are rendered at play or view time by our backend, from the Content API or a Content Sync copy re-synced at least every 7 days. Any other copy of Quran Foundation text expires within 7 days.
- **Importer, local transcription (TA-13):** Quran spans in a local transcript become verse-key references in the app **before anything is saved to disk or uploaded**. The app matches against the verse index the server serves to it (built from Content Sync, served through admin-api); it holds no Quran Foundation credentials and calls no Quran Foundation API itself.
- **Translation (TA-7, TA-20):** never touches Quran spans. The translated track carries the same verse keys; the edition is chosen per channel and rendered at play time.
- **Suggestions and keywords (TA-17, TA-18, TA-21):** may name the surah or topic in our own words (*Ayat al-Kursi*, «آية الكرسي», *Surah al-Kahf*), never reproduce verse text. The matcher drops Quran spans before scoring; Workers AI never receives them.
- **Attribution** wherever Quran text shows (player captions, transcript view): "Quran data provided by Quran Foundation (https://quran.foundation/)" and the edition's name.
- Rate limits: on 429, back off and honour `Retry-After` (server side only).
- The QF-COMPLY work audits and fixes the existing stores; these stories build on its results (its verse-key caption format and render path), not a second copy.

## Local work in the app

| Step | Runs on | Server's part |
|---|---|---|
| Hash (SHA-256) and dedupe | Computer | Answers "already imported?" for the channel |
| Transcode to our ladder | Computer (ffmpeg, LGPL build; aun-core HLS packaging), settings read from the server | Verifies every rung against the source; encodes only on mismatch or when asked |
| Transcribe (ar, en) | Computer (whisper.cpp in aun-core, GPU when present); Quran spans become verse keys before saving | Quran layer checks the keys on the uploaded transcript (no caption minutes); text rendered at play time |
| Translate | Server (caption job) | Workers AI within the caption budget |
| Suggest | Computer (vocabulary match) | Stores them; Suggest on request (TA-18) |
| Upload | Computer (aun-core TUS, resumable) | Normal ingest |

The app's work queue keeps every item's state on disk, so quitting, a crash or a reboot loses nothing: on the next start each item continues from its last finished step and each upload from its last byte.

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

None when idle: no messages in the queues; one hourly cron tick in the processor finds due sources (a single D1 query). Per import, with local-first processing: storage of the original and the uploaded renditions, one verification run in the media container per video instead of a full encode, no caption minutes for local transcripts, translation within the caption budget, and no AI for importer suggestions. Site Suggest: about $0.0005 a run, capped monthly (default $10). Within the [$500/month cap](decisions.md#o1-whole-platform-cost-cap).

## Decisions and constraints

- [O1](decisions.md#o1-whole-platform-cost-cap): Whole-platform cost cap (decided)
- [O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers): Uploads are invite-only for users; this admin path is for staff and audited
- [O26](decisions.md#o26-always-async-with-admin-visible-errors): Always async, failures on the admin Errors page
- [SM-6](decisions.md#sm-6-register-a-business-for-meta): No Meta
- UI is bilingual en/ar with RTL, light and dark.
- Quran Foundation terms (2026-11-21): verse keys only in every store, text rendered live, no Quran Foundation access from the app ([above](#quran-foundation-terms-binding-2026-11-21)).

## Status evidence

- Spec: this page.
- Linear: epic [AUN-571](https://linear.app/hamzalabs/issue/AUN-571), stories TA-1…TA-16 = AUN-572…AUN-587, TA-17 = AUN-588, TA-18 = AUN-589, TA-19 = AUN-590, TA-20 = AUN-591, TA-21 = AUN-592.

## Sources

- Owner's requirements, 2026-11-21 (relayed by the orchestrator).
- [AlUmmahNowTools](https://github.com/Al-Ummah-Now/AlUmmahNowTools) master; [TOOLS-IMPORTER](TOOLS-IMPORTER-tools-visual-importer-roadmap.md); [AUN-ADMIN-NATIVE](AUN-ADMIN-NATIVE-native-admin-app.md); [AUN-YT-IMPORT](AUN-YT-IMPORT-move-from-youtube.md); [AUN-SOCIAL](AUN-SOCIAL-social-media-management.md); [AUN-CAPTIONS](AUN-CAPTIONS-transcription-translation.md); AlUmmahNow `docs/specs/TRANSCRIPTION-TRANSLATION.md`; reused contracts AlUmmahNow [#1386](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1386) (on-device captions, pre-encoded renditions), [#1398](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1398) (translation, budgets), [#1401](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1401) (transcript search).
- Quran Foundation's reply on content terms, 2026-11-21 (relayed by the orchestrator).
