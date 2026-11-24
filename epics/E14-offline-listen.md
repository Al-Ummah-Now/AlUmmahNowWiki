[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 14: Offline & Listen mode (incl. CarPlay / Android Auto)

| | |
|---|---|
| **ID** | `E14` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (shared-types, api-videos, media, admin-api, admin-web, web), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **in progress** (spec updated 2026-11-23 for owner decisions **E14-D1**–**E14-D8**: plain R2 `video.mp4` downloads with no encryption/DRM/licenses/expiry, same rights for everyone under an admin-configurable per-user rate limit, sign-in required for both Listen mode and downloads with both hidden and refused in Kids Mode, reuse existing HLS audio streams with no `audio.m4a` or `audio_extract`, Web gets Listen mode + plain Download button with `Content-Disposition: attachment` and no in-browser offline library, and next-sync cleanup plus cacheable `videoId`-only revocations feed for CSAM/urgent legal takedowns; behind `offlineDownloads` and `listenMode` switches, both off by default) |
| **Last updated** | 2026-11-23 |

> D2 was decided on 2026-11-10 (Cloudflare R2 + Cloudflare CDN, $0 egress). Native players (Epic 13) already cover AVPlayer + Now Playing + background audio on Apple, Media3 `MediaLibraryService` + basic browse tree on Android, Media Foundation / GStreamer + SMTC / MPRIS on Desktop, and a shared player state machine + CRDT sync engine in `AlUmmahNowCore`. Epic 14 builds directly on those foundations without rebuilding them.

## 1. Goal

Let signed-in viewers listen to lectures, Quran recitations, and talks audio-first — with the screen off, while browsing, or in the car (CarPlay and Android Auto) — and download videos for offline playback on native apps or save plain files to their computer from the website.

- **Listen mode** gives signed-in viewers on every platform (Web, Apple, Android, Desktop) an audio-first experience playing the existing HLS audio stream (`a/<track>/index.m3u8` when multi-audio exists, or the existing HLS `master.m3u8` / audio variant — no separate `audio.m4a` file per **E14-D5**): switch from video to audio without losing position, keep listening in the background with lock-screen / OS media controls, manage a listening queue, adjust playback speed, and set a sleep timer. Signed-out visitors do not get Listen mode and all Listen controls are hidden (**E14-D3**).
- **Offline downloads** let signed-in viewers save the existing progressive `video.mp4` file from R2 (whole video file, zero new R2 objects per **E14-D5**) for direct offline playback on native apps (Apple, Android, Desktop), restrict downloads to Wi-Fi, manage local storage, optionally auto-download new episodes from chosen channels/playlists, respect creator opt-outs, and clean up local copies when a video goes private or is deleted on the next app sync (plus periodic polling of a tiny `videoId`-only revocations feed for CSAM or urgent legal takedowns per **E14-D8**). On the website (**E14-D6**), signed-in viewers get a plain **Download** button (`Content-Disposition: attachment`) that saves `video.mp4` to their computer under the same per-user rate limit, with no in-browser offline library. Per **E14-D1** and **E14-D2**, there is **no encryption, no DRM, no key vault, no license/expiry system, no stored download counts/quotas, and no tier limits on download count or quality**; download requests are protected instead by an admin-configurable per-user server-side **rate limit** (per-day + burst limit returning `429` in English and Arabic). Signed-out visitors and **Kids Mode** sessions get neither Listen mode nor downloads, and all controls are hidden (**E14-D3**).
- **CarPlay & Android Auto** let drivers safely browse Continue listening, Downloads, Subscriptions, and Recitation and start audio playback by voice.
- **Offline-first library sync** queues likes, watch progress, saved items, and study notes while offline and merges them cleanly when connectivity returns.

Everything launches behind two admin feature switches on the Features page (`listenMode` and `offlineDownloads`, both **off by default**), enforced server-side with `404 feature_off` and completely hidden in every client while off.

## 2. What exists today

Before adding new code, here is what already exists across the repositories (verified against `origin/main` on 2026-11-23):

### 2.1 Backend, media pipeline, and admin (`AlUmmahNow`)

- **R2 HLS delivery & signing:**
  - `apps/media/container/ladder.mjs` and `apps/media/container/server.mjs` encode muxed fMP4 HLS rungs (`360p` 800 kb/s video + 96 kb/s AAC audio; `480p` 1.4 Mb/s + 128 kb/s AAC; `720p` 2.8 Mb/s + 128 kb/s AAC; `1080p` 5.0 Mb/s + 128 kb/s AAC) plus one progressive stream-copied `video.mp4` (`480p`, or `360p` for smaller sources).
  - `apps/media/container/audio.mjs` and `apps/media/src/audio.ts` (from [AUN-MULTI-AUDIO](AUN-MULTI-AUDIO-multiple-audio-tracks.md)) already create demuxed audio-only HLS renditions (`a/orig/index.m3u8` and `a/<trackId>/index.m3u8`, 128 kb/s AAC-LC stereo, 6 s fMP4 segments) and normalized `track.m4a` files for videos with extra audio tracks. Single-track videos do **not** yet emit a standalone audio-only file.
  - `packages/shared-types/src/media-delivery.ts` and `apps/media/src/edge.ts` serve public renditions from `pub/<videoId>/<rev>/` on the R2 custom domain (cached by Cloudflare Cache Rule, $0 egress, 512 MB max cacheable file on Pro) and private/unlisted renditions from `priv/<token>/<videoId>/<rev>/` via HMAC path tokens (`mediaToken`, 6 h TTL) and single-file tokens (`mediaFileToken`).
  - `apps/api-videos/src/lib/media/playback.ts` and `apps/api-videos/src/endpoints/video/videoPlayback.ts` resolve ordered playback sources (R2 and Bunny fallback). Note: Epic 9.6 (`POST /api/v1/videos/:id/playback`, open PR [AlUmmahNow#434](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/434)) was never merged; R2 token signing already shipped via `mediaPlayUrl` and `mediaToken`/`mediaFileToken`.
- **Feature switches & tiers:**
  - `packages/shared-types/src/feature-registry.ts`, `packages/shared-types/src/feature-routes.ts`, `packages/shared-types/src/features.ts`, `apps/api-videos/src/lib/features/`, and `apps/admin-api/src/routers/features.router.ts` implement [AUN-FEATURES](AUN-FEATURES-feature-switches.md): admin master switches, `requireFeature(key)` returning `404 feature_off`, and `GET /api/me/features` with weak ETags.
  - `packages/shared-types/src/creator-tiers.ts`, `apps/api-videos/src/lib/creatorTiers.ts`, and `apps/admin-web/src/components/creators/TierEditor.tsx` implement admin-managed tiers (`member` = Free default, plus Creator/Pro/Unlimited).
- **Watch-state sync:**
  - `apps/api-videos/src/endpoints/watch-state/watchState.ts` already implements `PUT /api/v1/watch-state/:videoId` (LWW position write), `GET /api/v1/watch-state?since=`, and `GET /api/v1/continue-watching`.
  - `apps/api-videos/src/endpoints/profile/playbackSettings.ts` stores `autoplayNext`.
- **Web player (`apps/web`):**
  - `apps/web/src/components/VideoPlayer/CustomVideoPlayer.tsx`, `SettingsMenu.tsx`, and `apps/web/src/components/VideoPagePlayer/` already provide video.js/VHS HLS playback, speed (0.5–2×), quality selection, multi-audio track switching, subtitles with Quran credit, chapters, resume, and playlist autoplay.
  - Missing: Listen mode UI, persistent mini audio bar across route changes, sleep timer, `navigator.mediaSession` lock-screen/background audio controls, and Studio download toggles.

### 2.2 Shared Rust core (`AlUmmahNowCore`)

- `crates/aun-player/` (`model.rs`, `machine.rs`, `quality.rs`, `conformance/`): already implements the player behavior state machine — queue, repeat modes, resume rules (30 s min, 95% completed), sleep timer, `DeviceClass::Car`, quality caps, study loops, and 38 conformance scenarios. Not yet exported over UniFFI.
- `crates/aun-sync/` (`model.rs`, `engine.rs`, `lww.rs`, `store.rs`, `transport.rs`): already implements conflict-free LWW CRDT state for watch positions, history clear tombstones, notes/bookmarks, saved (Watch Later), likes, and cached video metadata. Not yet exported over UniFFI.
- `crates/aun-api/src/queue.rs`: already implements a persistent FIFO offline write queue for likes, comments, and notes.
- Missing: plain-file download manifest/policy crate (`aun-downloads`) and UniFFI exports in `crates/aun-ffi/` for `aun-player`, `aun-sync`, the offline write queue, and `aun-downloads`.

### 2.3 Apple (`AlUmmahNowApple`)

- `Packages/AUNPlayer/Sources/AUNPlayer/PlayerController.swift`: AVPlayer wrapper with HLS playback, `preferredMaximumResolution` quality cap, speed 0.5–2× (`.timeDomain` pitch correction), ±10 s skip, WebVTT sidecar subtitles, and chapters.
- `Packages/AUNPlayer/Sources/AUNPlayer/NowPlayingCoordinator.swift`: `MPNowPlayingInfoCenter` + `MPRemoteCommandCenter` (play, pause, toggle, skip ±10 s).
- `Apps/ViewerIOS/Info.plist`: already declares `UIBackgroundModes: [audio]`.
- `Packages/AUNFeatures/Sources/AUNFeatures/WatchView.swift` and `ViewModels.swift`: watch screen and player wiring.
- Missing: Listen mode UI + persistent mini-player + queue + sleep timer, plain-file offline download manager (background `URLSession` saving existing R2 `video.mp4` + direct `AVPlayer` playback + Wi-Fi-only + storage UI + background availability sync), CarPlay (`CPTemplateApplicationSceneDelegate`, gated behind `listenMode` and store approval E14-D7), and viewer offline sync integration.

### 2.4 Android (`AlUmmahNowAndroid`)

- `player/src/main/kotlin/net/alummahnow/player/AunPlaybackService.kt`: Media3 `MediaLibraryService` with ExoPlayer (`AUDIO_CONTENT_TYPE_SPEECH`, `WAKE_MODE_NETWORK`, `handleAudioBecomingNoisy`, `CastPlayer` fallback).
- `player/src/main/kotlin/net/alummahnow/player/LibraryCallback.kt` and `MediaItems.kt`: `BrowseTree` exposing home rails (`CONTINUE_WATCHING`, `TRENDING`, `RECOMMENDED`, `POPULAR`, `RECENT`, `CATEGORY`) and `onAddMediaItems` package security check.
- `viewer-mobile/src/main/AndroidManifest.xml`: already exports `AunPlaybackService` with `MediaLibraryService` and `MediaBrowserService` intent filters and `FOREGROUND_SERVICE_MEDIA_PLAYBACK`.
- Missing: Android Auto manifest metadata (gated behind build flag until E14-D7), dedicated Car browse roots (Continue listening, Downloads, Subscriptions, Recitation — hidden while `listenMode` is off), voice search (`onSearch` / `onGetSearchResult`), playback resumption (`onPlaybackResumption`), Listen mode UI + queue + sleep timer, plain-file progressive download manager (direct Media3 `file://` playback + Wi-Fi-only + WorkManager availability sync + storage UI), and offline-first library sync.

### 2.5 Desktop (`AlUmmahNowDesktop`)

- `src/AlUmmahNow.App/Media/IMediaPlayer.cs`, `HlsPlaylist.cs`, `WebVtt.cs`, and `src/AlUmmahNow.App/ViewModels/WatchViewModel.cs`: shared playback abstraction, HLS playlist parser, WebVTT parser, speed, skip, chapters.
- `src/AlUmmahNow.Windows/WindowsMediaPlayer.cs` (Media Foundation + SMTC) and `src/AlUmmahNow.Linux/GstMediaPlayer.cs` + `MprisSession.cs` (GStreamer + MPRIS).
- Missing: Listen mode UI (audio-only mode, queue, sleep timer, mini-player), plain-file offline download manager (direct local file playback + storage management + availability sync), and offline-first sync.

## 3. Feature switches and tier rules

### 3.1 Admin feature switches (`AUN-FEATURES`)

Two new keys are added to `FEATURE_REGISTRY` (`packages/shared-types/src/feature-registry.ts`), both **off by default** (`default: false`) and exposed on `GET /api/me/features` (`USER_FEATURE_KEYS`):

| Key | Group | Default | Toggle | Confirm | `GET /api/me/features` key | What is gated while off |
|---|---|---|---|---|---|---|
| `listenMode` | `site` | `false` | `admin` | `off` | `listenMode` | `GET /api/v1/videos/:id/audio` (requires sign-in per [E14-D3](#11-owner-decisions)), Web/Native Listen mode toggle, mini audio bar, sleep timer, and all CarPlay/Android Auto surfaces (hidden when signed out or while `listenMode` is off; CarPlay entitlement/scene and Android Auto manifest metadata do not ship in production store builds until [E14-D7](#11-owner-decisions) completes). |
| `offlineDownloads` | `site` | `false` | `admin` | `off` | `offlineDownloads` | `POST /api/v1/videos/:id/downloads` (requires sign-in per [E14-D3](#11-owner-decisions)), Download buttons (native apps and website plain Download per [E14-D6](#11-owner-decisions)), Studio "Allow downloads" controls; Admin Platform Settings download rate-limit controls remain editable for preparation. |

Server enforcement & Kids Mode:
- `POST /api/v1/videos/:id/downloads`, `POST /api/v1/downloads/sync`, `GET /api/v1/downloads/revocations`, and `GET /api/v1/videos/:id/audio` all require an authenticated user (**E14-D3**).
- `POST /api/v1/videos/:id/downloads` and `GET /api/v1/videos/:id/audio` are registered in `FEATURE_ROUTES` and guarded by `requireFeature(...)`, returning `404 feature_off` when off.
- **Kids Mode (enforced via E20's `kids:viewer` scope read strictly from the verified access token — never an `X-Kids-Session` header):** Both Listen mode and downloads are **hidden and refused** whenever the verified access token carries `kids:viewer`. `GET /api/me/features` returns `200` with `listenMode: false` and `offlineDownloads: false` (rather than `403`, so clients keep receiving other feature flags while hiding Listen and Download controls); `GET /api/v1/videos/:id/audio`, `POST /api/v1/videos/:id/downloads`, `POST /api/v1/downloads/sync`, and `GET /api/v1/downloads/revocations` all refuse `kids:viewer` tokens with **`403 kids_mode_restricted`** (all four routes are covered as `block_403` in E20 `#209` §4.3); every web, native, CarPlay, and Android Auto surface hides Listen and Download controls while in Kids Mode.
- `GET /api/me/features` returns `listenMode: false` and `offlineDownloads: false` for signed-out visitors (**E14-D3**).
- `POST /api/v1/downloads/sync` and `GET /api/v1/downloads/revocations` remain reachable for signed-in non-Kids accounts even if `offlineDownloads` is turned off so apps can still run cleanup hygiene for videos that became private, deleted, or subject to urgent takedown. Native apps (Apple, Android, Desktop) poll both whenever the device holds **≥ 1 local download**, independent of the `offlineDownloads` switch.
- Clients follow [Product rules → Hidden when off](../guides/product-rules.md#hidden-when-off): when a switch is off, the viewer is signed out, or Kids Mode is active, every entry point (button, tab, menu row, Studio toggle, CarPlay/Android Auto browse tree, search, and playback resumption) is completely hidden (no "sign in to…" teasers per **E14-D3**).
- Store builds must NOT ship `com.google.android.gms.car.application` manifest metadata or the CarPlay scene/entitlement until [E14-D7](#11-owner-decisions) portal opt-in/approval completes; keep them behind a build flag/placeholder that defaults to off in release builds.

### 3.2 Creator settings

- **Channel default:** `defaultAllowDownloads: boolean` on channel settings (default: `true` per decided [E14-D1](#11-owner-decisions)). New videos inherit this default unless overridden.
- **Per-video toggle:** `allowDownloads: boolean` on `Video` (`VideoUpdateInput` / `VideoView`). Editable by anyone with `video.edit` on the channel.
- **Availability hygiene:** Turning `allowDownloads` off on a video, changing visibility to `private`, deleting/hiding the video, or moderation removal immediately blocks new downloads and causes native apps to remove their local copy on the next app sync (`POST /api/v1/downloads/sync`). This is normal hygiene, not DRM or content protection.

### 3.3 Download rate limit (admin-configurable, E14-D2)

Per owner decision **E14-D2** (2026-11-23), downloads are **the same for every viewer** — there are **no tier download fields** (`offlineDownloads`, `offlineMaxQuality`, `offlineMaxVideos`, and `offlineLicenseDays` are removed from `CreatorTier` and `TierEditor.tsx`) and **no stored download counts or quotas**. Instead, `POST /api/v1/videos/:id/downloads` is protected by an admin-configurable per-user **rate limit** using the existing atomic D1 rate-limit mechanism (`apps/api-videos/src/middleware/rate-limit.ts`, operation `'offline_download'`):

| Setting (`global_settings/ops/download-rate-limit.json`) | Default | Admin bounds | Meaning |
|---|---|---|---|
| `perDay` | `100` | `1–10,000` | Maximum download requests per signed-in user per UTC day window. |
| `burstPerMinute` | `10` | `1–100` (`≤ perDay`) | Short-window burst limit per signed-in user per minute. |

- Editable on **Admin → Platform settings** (`apps/admin-web/src/app/(protected)/platform-settings/`, backed by `GET`/`PUT /api/download-rate-limit` in `admin-api` with `settings:manage` RBAC and `site_settings_log` audit history under `downloads:rate-limit`; cached 30 s in `api-videos`).
- Exceeding either limit returns `429` (`code: 'download_rate_limited'`, `Retry-After` and `X-RateLimit-*` headers) with a clear localized English and Arabic message from the shared error envelope (`API_ERROR_CATALOGUE`).
- Ephemeral rate-limit window rows (`upload_rate_windows` / `upload_rate_leases`) are pruned daily by `pruneRateLimits`; no per-user download inventory or quota is stored.

## 4. Reusing existing streaming & progressive media (E14-D5)

Per owner decision **E14-D5** (2026-11-23), Epic 14 **does NOT create any separate `audio.m4a` file**: no stream copy at transcode time, no lazy `audio_extract` backfill or container job, and **no new R2 objects** (the earlier E14-S2 PR `#1790` was closed). Downloads also **never** serve from Bunny (which bills $0.01/GB egress):

1. **Listen mode & car audio (streaming-only):**
   - **Multi-audio videos (`AUN-MULTI-AUDIO`):** Already have demuxed 128 kb/s AAC fMP4 HLS renditions at `pub/<videoId>/<rev>/a/orig/index.m3u8` and `a/<trackId>/index.m3u8`. Listen mode and car audio stream these existing audio-only HLS renditions directly — **zero extra storage, zero extra encode**.
   - **Single-track videos:** Listen mode and car audio stream the existing HLS `master.m3u8` with video tracks deselected on native players (ExoPlayer `setTrackTypeDisabled(TRACK_TYPE_VIDEO, true)`, AVPlayer audio-only playback, Web audio-first UI). Zero extra transcode time and zero new R2 objects.
2. **Downloads (plain progressive R2 `video.mp4` only):** Downloads serve the existing progressive R2 `video.mp4` (`480p`, or `360p` for smaller sources) — a single plain `.mp4` file with **zero additional R2 storage** and direct playback on every native media player and desktop/browser save-to-disk. Audio-only downloads are not offered (an HLS playlist such as `a/orig/index.m3u8` is not a plain single file, and per E14-D5 no standalone `.m4a` file is created; Listen mode handles audio-only streaming).
3. **Bunny-only videos (not yet on R2):** Not eligible for downloads until their R2 rendition is ready (API answers `409 rendition_not_ready`, and download UI only offers R2-ready videos). Listen mode still works on Bunny-only videos for signed-in viewers by streaming HLS in audio-first UI.

## 5. Data model and API

### 5.1 Data model

No `download_licenses` D1 table is needed (the unused table from `#1781` is dropped in the next free search migration `<next>_drop_download_licenses.sql` per [E14-D1](#11-owner-decisions); `main` is already at `0082_import_takeout.sql`; no server-side device/slot tracking, license expiry, or stored download counts). Both `<next>_drop_download_licenses.sql` (E14-S4a) and `<next>_download_revocations.sql` (E14-S11a) must regenerate `apps/api-videos/migrations/search.schema.snapshot.sql` (`pnpm schema:snapshot`, verified by `pnpm check:schema`).

- **Expand-then-contract deploy order for `0079`'s four tier columns:** Migration `0079` added four columns to `creator_tiers` (`offline_downloads`, `offline_max_quality`, `offline_max_videos`, and `offline_license_days`), which the previous Worker reads during a rolling deploy. **Release 1** (`#1822`) drops the unused `download_licenses` table and stops reading/writing all four `creator_tiers` offline columns (`offline_downloads`, `offline_max_quality`, `offline_max_videos`, `offline_license_days`) in `shared-types`, `api-videos`, `admin-api`, and `admin-web` while leaving those columns in D1 with their existing defaults. **Release 2** (a follow-up contract migration once Release 1 is live in production) drops all four unused columns cleanly.
- `videos` record (R2 JSON + search D1 mirror): adds `allowDownloads?: boolean` (default `true` when omitted, per [E14-D1](#11-owner-decisions)). No `r2.result.audio` field or new R2 object is added (per [E14-D5](#11-owner-decisions)).
- `channels` record: adds `defaultAllowDownloads?: boolean` (default `true` when omitted).
- `global_settings/ops/download-rate-limit.json`: stores admin-configured `{ perDay, burstPerMinute, updatedAt, updatedBy }` (per [E14-D2](#11-owner-decisions); no tier download fields on `creator_tiers`).
- `download_revocations` D1 table (added in `<next>_download_revocations.sql` in **E14-S11a** for [E14-D8](#11-owner-decisions)): append-only event log `(seq INTEGER PRIMARY KEY AUTOINCREMENT, event_id TEXT NOT NULL UNIQUE, video_id TEXT NOT NULL, created_at INTEGER NOT NULL)` populated idempotently (`INSERT OR IGNORE` keyed on `event_id`, not `video_id`, so a restored video that is later taken down a second time receives a new `event_id` and a new higher `seq`).

### 5.2 API endpoints (`apps/api-videos` & `apps/media`)

| Route | Auth & Gate | Purpose |
|---|---|---|
| `GET /api/v1/videos/:id/audio` | Required auth ([E14-D3](#11-owner-decisions)) · refused on `kids:viewer` (`403 kids_mode_restricted`) · `requireFeature('listenMode')` | Visibility rule: applies the exact same `videoReadAccess(env, video, userId)` check as normal playback — missing, deleted, hidden, or private videos the caller cannot view return `404 not_found`. Optional query `?trackId=` for multi-audio videos. Returns audio-first streaming playback info from existing streaming assets ([E14-D5](#11-owner-decisions)): `{ videoId, format: 'hls', url, contentType: 'application/vnd.apple.mpegurl', trackId?, tracks }`. Prefers existing multi-audio `a/<trackId>/index.m3u8`, otherwise returns the existing HLS `master.m3u8` stream. For non-public media the caller is allowed to view (e.g. a creator's own private or unlisted video), `url` is a short-lived signed `priv/` token URL and **must never be persisted** on disk. Never enqueues `audio_extract` or creates R2 objects. |
| `POST /api/v1/videos/:id/downloads` | Required auth ([E14-D3](#11-owner-decisions)) · refused on `kids:viewer` (`403 kids_mode_restricted`) · `requireFeature('offlineDownloads')` · per-user rate limit (`offline_download`) | JSON body `{}` for native apps or `{ disposition: 'attachment' }` for the Web Download button (every R2 video has one progressive `video.mp4` file; no quality ladder). Visibility rule: checks `videoReadAccess` first; missing, deleted, hidden, and private videos the caller cannot view all return `404 not_found` so this endpoint **never reveals whether a private video exists**. Only ready, non-live **public** videos are downloadable (`403 download_not_allowed` for draft/live/unlisted/private videos the caller already has read access to; `403 download_disabled_by_creator` when creator opted out; `409 rendition_not_ready` when R2 `video.mp4` is not ready — never Bunny!). Returns `{ videoId, r2Rev, media: { format: 'mp4', url, contentType: 'video/mp4', bytes?, rung } }`. For native apps, `url` is the zero-Worker R2 custom-domain URL `https://<media-host>/pub/<videoId>/<rev>/video.mp4`. For Web `{ disposition: 'attachment' }`, `api-videos` derives a sanitized UTF-8 filename stem from the loaded video's `title` (falling back to `<videoId>`, ≤ 80 chars, `.mp4`) and returns `https://<media-host>/dl/<videoId>/<rev>/<encoded-slug>.mp4` (below). Per [E14-D1](#11-owner-decisions), public files under `/pub/` and `/dl/` are public and not URL-signed; sign-in, Kids Mode refusal, and the rate limit gate the app's Download action (`POST /downloads`) only. **Never persist signed URLs**; resume an interrupted download by calling `POST` again for a fresh URL, and store artwork as a local file. |
| `GET` / `HEAD /dl/:videoId/:rev/:filename` (`apps/media/src/edge.ts`) | Public R2 `pub/` objects only (Web Download attachment helper; no URL signing per [E14-D1](#11-owner-decisions); **no Cloudflare edge cache**) | Dedicated Worker route used **only** by the Web Download button ([E14-D6](#11-owner-decisions)); native downloads remain on zero-Worker `/pub/`. The Worker sees only the URL path (it does not query video metadata): it validates `:videoId` / `:rev`, **URL-decodes `:filename` exactly once** (falling back to `<videoId>.mp4` on invalid percent-encoding), and **then** defensively re-sanitizes the decoded string (strips control chars `0x00–0x1F`/`0x7F`, quotes `"`, `\`, `/`, `;`, rejects `..` or non-`.mp4` extensions, clamps stem to ≤ 80 chars, falls back to `<videoId>.mp4`). For the header `Content-Disposition: attachment; filename="<ascii-safe>.mp4"; filename*=UTF-8''<rfc5987-encoded>.mp4`, the ASCII `filename="..."` parameter strips non-ASCII characters and falls back to **`<videoId>.mp4`** whenever fewer than 3 ASCII alphanumeric characters remain (such as pure Arabic titles), while `filename*=UTF-8''...` carries the full sanitized UTF-8 title. Reads `pub/<videoId>/<rev>/video.mp4` from the R2 binding (never serves `priv/`). **No edge cache:** because `:filename` is unbounded, `/dl/` sends **`Cache-Control: private, no-store`** so deleting the R2 object is the single control point across all `:filename` variants (costing only ~$0.04/mo extra in R2 Class B reads). **Range & HEAD behavior:** reuses/extends `objectResponse` in `apps/media/src/edge.ts` to support `GET` and `HEAD`, always sending `Accept-Ranges: bytes`, `ETag` (R2 `httpEtag`), `Content-Type: video/mp4`, and `Content-Length`; honors `Range: bytes=...` with `206 Partial Content` + `Content-Range: bytes <start>-<end>/<total>`, answers `416 Range Not Satisfiable` (`Content-Range: bytes */<total>`) for unsatisfiable ranges, and honors `If-Range` against `ETag` (serving `206` on match and full `200` on mismatch). Returns `404` if `pub/<videoId>/<rev>/video.mp4` does not exist. |
| `POST /api/v1/downloads/sync` | **Required auth** · refused on `kids:viewer` (`403 kids_mode_restricted`) · exempt from `offlineDownloads` gate so cleanup always works | Request body: `{ videoIds: string[] }` (max 50). Checks each video's current public downloadability and creator `allowDownloads` and returns `{ results: [{ videoId, available: boolean, reason?: 'unavailable' \| 'disabled_by_creator' }] }`. Missing, deleted, hidden, private, unlisted, draft, live, and not-ready videos all return the same uniform `available: false, reason: 'unavailable'` so `sync` never reveals whether a video is private vs missing. Apps delete local copies where `available === false`. |
| `GET /api/v1/downloads/revocations?since=<cursor>` | **Required auth** · refused on `kids:viewer` (`403 kids_mode_restricted`) · exempt from `offlineDownloads` gate | Cursor-ordered feed of CSAM and urgent legal takedowns ([E14-D8](#11-owner-decisions)). Auth and `kids:viewer` checks run in the `api-videos` Worker on **every** request (`401` signed out, `403 kids_mode_restricted` for Kids Mode). After auth passes, the Worker validates `since` (non-negative integer) and reads/writes an **internal** Cloudflare Workers Cache API (`caches.default`) entry keyed strictly on the validated `since` value using internal cache headers (`Cache-Control: public, max-age=120`) so Cloudflare's Cache API actually stores the entry and shields D1 from polling load. The Worker then builds a **fresh client `Response`** from the cached JSON body carrying **`Cache-Control: private, max-age=60`** and `Vary: Authorization` (never sending `public` to clients or shared proxies). Strict monotonic ordering by `seq ASC` (`WHERE seq > ? ORDER BY seq ASC LIMIT 100`). Payload carries **only `seq` and `videoId`** (`{ items: [{ seq, videoId }], nextCursor, hasMore }`) — never title, channel, takedown reason, or PII. |

### 5.3 Urgent & CSAM takedown hygiene (E14-D8)

Because the server stores **no per-user download inventory** ([E14-D1](#11-owner-decisions), [E14-D2](#11-owner-decisions)), and Apple APNs has no server-side topic broadcast (fanning out to every registered device would scan the device table, and Desktop has no APNs/FCM push channel), urgent takedown purging uses a single, cheap, uniform mechanism across **Apple, Android, and Desktop**:

- **Writers & mandatory 4-step order ("block metadata, preserve evidence, delete & purge by prefix, then append"):** Two server paths write to `download_revocations`: (1) the **CSAM intake / takedown handler** (`apps/api-videos/src/routers/csam.ts` / `apps/api-videos/src/lib/csam/`), assigning `event_id = "csam:<caseId>"`, and (2) the **manual admin / urgent legal-takedown moderation handler** (`apps/admin-api` moderation action handler, generating one `actionId` per takedown action and passing `event_id = "admin:<actionId>"` to `api-videos` so retries reuse the exact same `event_id`). Mandatory sequence:
  1. **Block metadata first:** mark the video deleted/hidden/takedown in D1 & R2 metadata so `POST /api/v1/videos/:id/downloads` immediately returns `404 not_found`, `POST /api/v1/downloads/sync` returns `available: false`, and new `/pub/` playback references stop being handed out.
  2. **Preserve CSAM evidence (CSAM path):** complete encrypted evidence preservation into the legal-hold store per [E28-ai-moderation.md](E28-ai-moderation.md) (note: [M4](decisions.md#m4-csam-coverage-for-r2-served-media) on R2-served CSAM coverage is still open). **If preservation fails, stop before deleting `pub/` and raise an Admin Errors alert (`O26`).**
  3. **Delete/tombstone `pub/<videoId>/` and purge by prefix:** only after preservation succeeds, delete or tombstone all R2 objects under `pub/<videoId>/` (immediately stopping `/dl/`, which sends `Cache-Control: private, no-store` so the R2 delete is the single control point) and purge the entire `/pub/<videoId>/` prefix from Cloudflare edge cache by **prefix** (covering all HLS segments, manifests, `video.mp4`, and query-string variants).
  4. **Append to `download_revocations` last:** only after the delete and prefix purge complete, append `(event_id, video_id, created_at)` to `download_revocations`. This ordering prevents any race where a device purges the video, advances `seq`, and immediately re-downloads it before the block takes effect.
- **Append-only event log, idempotency & retry (`O26`):** `download_revocations` is an append-only event log with `UNIQUE(event_id)` (not `UNIQUE(video_id)`). Each takedown supplies its deterministic `event_id` (`csam:<caseId>` or `admin:<actionId>`) and writes via `INSERT OR IGNORE INTO download_revocations (event_id, video_id, created_at) VALUES (?, ?, ?)`, receiving a strictly monotonic `seq` cursor. Retries of the same takedown are idempotent on `event_id`, while a **second** takedown of a previously restored video receives a new `event_id` and a new higher `seq` so devices past the earlier cursor still purge it. If the D1 insert fails, the handler enqueues a retry message on the existing Cloudflare Queue with automatic retries, dead-letter queue (DLQ), and an Admin Errors page alert (`O26`) so an urgent purge is never silently dropped.
- **Polling & internal Cache API:** Native apps (Apple, Android, Desktop) persist their last processed `seq` cursor and call `GET /api/v1/downloads/revocations?since=<seq>` on app launch and every **12 hours** while online (~3 polls/day/device), **only when the device holds ≥ 1 local download** (independent of whether `offlineDownloads` is currently on or off). Each page returns up to 100 `{ seq, videoId }` entries in ascending `seq` order, carrying **only `seq` and `videoId` — nothing else**. Every poll hits the `api-videos` Worker so auth and `kids:viewer` are enforced on every request; the Worker caches the JSON payload in an internal `caches.default` entry (`Cache-Control: public, max-age=120`, keyed strictly on validated `since`) and sends the client a separate `Response` with `Cache-Control: private, max-age=60` and `Vary: Authorization` (shielding D1 with ≤ 1 query per PoP per TTL and zero per-device push fan-out).
- **Crash-safe 2-phase local purge:** For every returned `videoId`, the app checks its local download store across all accounts on the device; any matching records are marked `Removed` and persisted immediately (so they stop being playable at once), the app deletes the local media and thumbnail files from disk, calls `confirm_removed` for each deleted file, and **advances `seq` only after all deletions succeed** (so a crash mid-purge retries on next launch). Devices that do not hold `videoId` simply advance `seq` with no further calls. Standard removals (creator opt-out, video set to private, normal delete) continue to purge on the next `POST /api/v1/downloads/sync`.

Error codes (using the [AUN-FEATURES](AUN-FEATURES-feature-switches.md) localized error envelope):
- `404 feature_off` — feature switch is off.
- `404 not_found` — missing, deleted, hidden, or unreadable private video (never reveals private video existence).
- `403 kids_mode_restricted` — Kids Mode token scope (E20; Listen mode and all download/sync/revocations endpoints are hidden and refused in Kids Mode).
- `403 download_not_allowed` — non-public, unlisted, draft, or live video that the caller can otherwise view.
- `403 download_disabled_by_creator` — creator disabled downloads on this video or channel.
- `409 rendition_not_ready` — video does not yet have a ready R2 progressive `video.mp4` rendition.
- `429 download_rate_limited` — per-user daily or burst download request limit exceeded (`Retry-After` header + clear English and Arabic message).

## 6. Platform breakdown

### 6.1 Web (`AlUmmahNow/apps/web`)

- **Listen mode (`listenMode` switch, signed-in only per [E14-D3](#11-owner-decisions), hidden in Kids Mode):**
  - "Listen" toggle button in the watch page controls / action bar (hidden when signed out, in Kids Mode, or when `listenMode` is off). Switching to Listen mode swaps the video viewport for an audio-first card (cover art, title, channel, "Switch to video") playing the existing HLS audio stream without interrupting playback or losing position.
  - Persistent mini audio bar docked at the bottom of the app shell (above the phone tab bar and clear of the desktop side rail, solid theme surface) while navigating other pages, with play/pause, ±15/30 s skip, track title, progress bar, speed, sleep timer, queue drawer, and close.
  - Full `navigator.mediaSession` integration (`MediaMetadata` with title, channel, validated artwork; action handlers for `play`, `pause`, `seekbackward`, `seekforward`, `seekto`, `previoustrack`, `nexttrack`) for lock-screen controls and mobile browser background audio.
  - Sleep timer: Off, 15 min, 30 min, 45 min, 60 min, End of episode (localized with Eastern Arabic digits `٠–٩` in Arabic).
- **Plain Download button (`offlineDownloads` switch, signed-in only per [E14-D3](#11-owner-decisions) & [E14-D6](#11-owner-decisions), hidden in Kids Mode):**
  - A plain **Download** button on the watch page (completely hidden when signed out, in Kids Mode, when `offlineDownloads` is off, when the creator disabled downloads, or when R2 progressive media is not ready) that calls `POST /api/v1/videos/:id/downloads` with `{ disposition: 'attachment' }` under the same per-user rate limit and downloads the plain `video.mp4` file from the `apps/media` Worker `/dl/<videoId>/<rev>/<filename>.mp4` route with **`Content-Disposition: attachment; filename="<ascii-slug>.mp4"; filename*=UTF-8''<encoded-filename>.mp4`** so browsers save the file to the user's computer instead of opening/playing it in a tab. Shows the localized server error (including `429 download_rate_limited`) if rate-limited. **No encryption and no in-browser offline library.**
- **Studio (`offlineDownloads` switch):**
  - Per-video "Allow offline downloads" toggle in `apps/web/src/app/[locale]/studio/[channelId]/content/videos/[videoId]/edit/page.tsx`.
  - Channel default "Allow offline downloads on new videos" toggle in channel settings.

### 6.2 Admin (`AlUmmahNow/apps/admin-web`, `apps/admin-api`)

- **Features page:** `listenMode` and `offlineDownloads` appear automatically from `FEATURE_REGISTRY` with en/ar names and help text explaining what users lose when off.
- **Platform settings page (`/platform-settings`):** "Offline download rate limit" card (`DownloadRateLimitSetting.tsx`): per-day limit and per-minute burst limit per user, validated and saved via `/api/download-rate-limit` (`settings:manage` RBAC), audited in `site_settings_log` with change history (en/ar, Eastern Arabic numerals). Per [E14-D2](#11-owner-decisions), `TierEditor.tsx` has no download fields.

### 6.3 Shared Rust Core (`AlUmmahNowCore`)

Per **E14-D1** and **E14-D2**, downloads are plain media files with no encryption, no crypto keys, no licenses, no expiry clock, and no tier video-count cap.

- **Signed-URL prohibition:** Never persist any signed URL (`media.url`, private `thumbnailUrl`, etc.) in the manifest or disk cache. Resume an interrupted download by calling `POST /api/v1/videos/:id/downloads` again for a fresh URL, and save downloaded artwork as a local file (`thumbnail_path`).
- **`aun-downloads` crate:**
  - Plain-file manifest store keyed by `(user_id, video_id)` (never `video_id` alone, so multi-account devices never clobber or orphan files).
  - User-controlled storage budget lifecycle: never silently evict user-chosen completed or in-progress downloads (refuse new downloads with `StorageBudgetExceeded` until the user deletes items or raises their local storage cap).
  - Availability sync reconciliation (`apply_availability_sync`): removes records whose video became private, deleted, or disabled by the creator so the app deletes those local media and thumbnail files.
  - Policy engine: Wi-Fi-only check, local storage budget check, auto-download rule evaluator (subscribed channels / playlists, max episodes per channel, Wi-Fi + charging guard).
- **UniFFI exports (`aun-ffi`):**
  - Export `aun-player` (queue, sleep timer, resume, study tools), `aun-sync` (CRDT watch state, likes, saved, notes), `aun-api` offline write queue, and `aun-downloads` (`OfflineDownloadStore`, transfer policy, auto-download planner).

### 6.4 Apple (`AlUmmahNowApple`: iOS, iPadOS, macOS)

- **Feature switches:** Wired from `/api/me/features` (`listenMode`, `offlineDownloads`), defaulting off and keeping every Listen/Downloads/CarPlay surface hidden while off.
- **Listen mode (`listenMode`):**
  - Audio-first mode in `AUNPlayer` (`PlayerController` plays the existing HLS audio rendition from `GET /api/v1/videos/:id/audio` — `a/<track>/index.m3u8` for multi-audio or existing HLS `master.m3u8` with audio-first playback, keeping position & speed).
  - Persistent mini-player bar in `ViewerRootIOS` and `ViewerRootMac`, queue sheet, sleep timer menu, and enhanced `NowPlayingCoordinator` (artwork, next/previous track, scrubber position).
- **Offline downloads (`offlineDownloads`):**
  - Background `URLSession` saving plain progressive R2 `video.mp4` files directly to local storage (`URLResourceValues.isExcludedFromBackup = true` so iCloud backups stay lean).
  - Direct playback via `AVPlayer` / `AVURLAsset(url: localFileURL)` — no custom resource loader, no Keychain download keys, no decryption overhead.
  - Wi-Fi-only toggle, Downloads library screen with local storage cap & Delete / Delete all, auto-download toggle per channel/playlist, and launch + 12 h `BGAppRefreshTask` polling `GET /api/v1/downloads/revocations` ([E14-D8](#11-owner-decisions)) + `POST /api/v1/downloads/sync` whenever the device holds ≥ 1 local download (independent of the `offlineDownloads` switch) to remove local copies of revoked/private/deleted/disabled videos.
- **CarPlay (`Apps/ViewerIOS`):**
  - Hidden while signed out, in Kids Mode, or while `listenMode` is off; CarPlay scene manifest entry and `com.apple.developer.carplay-audio` entitlement stay behind a build flag (off in store builds) until [E14-D7](#11-owner-decisions) approval arrives.
  - `CPTabBarTemplate` with four tabs (localized via the in-app language setting, capped to `CPListTemplate.maximumItemCount` / `maximumSectionCount`, with local artwork): **Continue listening**, **Downloads** (plays local files offline directly), **Subscriptions**, and **Recitation**.
  - `CPNowPlayingTemplate` wired to `PlayerController` + `NowPlayingCoordinator`; Siri voice play via `INPlayMediaIntent`.
- **Offline-first sync:** Wire `aun-sync` and offline write queue from `AunCore` into viewer likes, watch progress, watch later, and study notes.

### 6.5 Android (`AlUmmahNowAndroid`)

- **Feature switches:** Wired from `/api/me/features` (`listenMode`, `offlineDownloads`, cached last-known, default `false`), hiding Listen mode, Downloads, and all Android Auto surfaces when signed out or while off.
- **Android Auto (`viewer-mobile`, `player`):**
  - `com.google.android.gms.car.application` manifest metadata and `res/xml/automotive_app_desc.xml` are gated behind `-Paun.enableAndroidAuto=true` (default **off** in release builds) until Google Play Console Android Auto opt-in ([E14-D7](#11-owner-decisions)) completes.
  - `LibraryCallback.kt` (`BrowseTree`), `onSearch` / `onGetSearchResult`, and `onPlaybackResumption` return empty/hidden whenever signed out or `listenMode` is off.
  - When `listenMode` is on, expose four Car categories: **Continue listening**, **Downloads** (only when `offlineDownloads` is on; plays plain local copies offline directly via `file://` without network calls), **Subscriptions**, and **Recitation**. Car playback uses the existing HLS audio rendition (`a/<track>/index.m3u8` or HLS `master.m3u8` with `C.TRACK_TYPE_VIDEO` disabled).
- **Listen mode (`listenMode`):**
  - Audio-first watch toggle playing the existing HLS audio rendition (with video track disabled in ExoPlayer), persistent mini-player bar in `viewer-mobile`, queue bottom sheet, sleep timer picker (backed by `AunPlaybackService`), playback speed controls.
- **Offline downloads (`offlineDownloads`):**
  - Plain progressive R2 `video.mp4` files saved per `(userId, videoId)` and played directly by Media3 ExoPlayer via `file://` URI (no Keystore download keys, no custom decrypt `DataSource`).
  - Never persist signed URLs (thumbnails saved as local files).
  - Wi-Fi-only policy, Downloads library screen with local storage limit and explicit user delete (no silent eviction), and launch + 12 h `WorkManager` job polling `GET /api/v1/downloads/revocations` ([E14-D8](#11-owner-decisions)) + `POST /api/v1/downloads/sync` whenever the device holds ≥ 1 local download (independent of the `offlineDownloads` switch) to delete local copies of revoked/private/deleted/disabled videos.
- **Offline-first sync:** Wire `aun-sync` + offline write queue into watch progress, likes, saved items, and notes.

### 6.6 Desktop (`AlUmmahNowDesktop`: Windows WinUI 3, Linux GTK 4)

- **Feature switches:** Wired from `/api/me/features` (`listenMode`, `offlineDownloads`), defaulting off and hiding Listen/Downloads UI when signed out or while off.
- **Listen mode (`listenMode`):**
  - Audio-first toggle in `WatchViewModel` (playing the existing HLS audio rendition), persistent mini audio bar in Windows and Linux shells, queue panel, sleep timer (formatting numerals through the shared Arabic number formatter), and full SMTC (Windows) / MPRIS (Linux) next/previous/seek/artwork metadata.
- **Offline downloads (`offlineDownloads`):**
  - Background `HttpClient` streaming downloader saving plain progressive R2 `video.mp4` files per `(UserId, VideoId)` and playing them directly via local `file://` URI (no DPAPI/libsecret download keys, no decrypt `Stream`).
  - Downloads library view with local disk limit and explicit delete controls (no silent eviction), and launch + 12 h periodic timer while online polling `GET /api/v1/downloads/revocations` ([E14-D8](#11-owner-decisions)) + `POST /api/v1/downloads/sync` whenever the device holds ≥ 1 local download (independent of the `offlineDownloads` switch) to delete local copies of revoked/private/deleted/disabled videos.
- **Offline-first sync:** Wire `aun-sync` + offline write queue through `AlUmmahNow.CoreBridge.Native`.

## 7. Stories (one PR each)

Build order follows backend → admin → web → core → native:

| Story | Repo | What (one PR per story) | Blocked by owner decision? |
|---|---|---|---|
| **E14-S0** | `AlUmmahNowWiki` | Refresh Epic 14 spec, decision log, and feature registry (this page) | No |
| **E14-S1** | `AlUmmahNow` | Shared types (`listenMode` & `offlineDownloads` in `FEATURE_REGISTRY`, `USER_FEATURE_KEYS`, `FEATURE_ROUTES`, `Video`/`Channel` download fields) (merged `#1781`; `download_licenses` and tier download fields removed per E14-D1 & E14-D2) | No (switches default OFF) |
| **E14-S2** | `AlUmmahNow` | ~~Stream-copied `audio.m4a` + `audio_extract` job~~ — **DROPPED & PR `#1790` closed** per owner decision [E14-D5](#11-owner-decisions) | Dropped ([E14-D5](#11-owner-decisions)) |
| **E14-S3a** | `AlUmmahNow` | Download resolve (`POST /api/v1/videos/:id/downloads`, signed-in only, refused on `kids:viewer`, per-user daily + burst rate limit returning `429 download_rate_limited` in en/ar, public R2 `video.mp4` only), `apps/media` `/dl/` attachment route (`Content-Disposition: attachment` for Web), & availability sync (`POST /api/v1/downloads/sync`, signed-in only, uniform `unavailable` reason) + OpenAPI + unit tests | No (switches default OFF) |
| **E14-S3b** | `AlUmmahNow` | Listen mode audio endpoint (`GET /api/v1/videos/:id/audio`, signed-in only, refused on `kids:viewer`, existing HLS audio stream) & `VideoUpdate`/`ChannelUpdate` `allowDownloads` / `defaultAllowDownloads` + OpenAPI + unit tests | No (switches default OFF) |
| **E14-S4a** | `AlUmmahNow` | E14-D1/D2/D3 cleanup (next free search migration `<next>_drop_download_licenses.sql` + regenerated `search.schema.snapshot.sql`, stop reading/writing all four `0079` tier download columns per expand-then-contract, signed-in & `kids:viewer` `/api/me/features` gating) + download rate-limit settings API (`api-videos` `/internal/downloads/rate-limit` & `admin-api` `/api/download-rate-limit` with `settings:manage` + audit log) | No |
| **E14-S4b** | `AlUmmahNow` | Admin Platform Settings UI: configurable per-day + burst download rate-limit card (`DownloadRateLimitSetting.tsx`, en/ar with Eastern Arabic digits, unit tests + screenshot audit) | No |
| **E14-S5** | `AlUmmahNow` | Studio UI: per-video "Allow offline downloads" toggle and channel default setting (hidden when `offlineDownloads` is off) | No |
| **E14-S6a** | `AlUmmahNow` | Web Listen mode: audio-first toggle, persistent mini audio bar, queue drawer, sleep timer, `navigator.mediaSession` background audio (hidden when signed out, in Kids Mode, or `listenMode` off) + screenshot audit | No |
| **E14-S6b** | `AlUmmahNow` | Web plain **Download** button on watch page calling `POST /api/v1/videos/:id/downloads` with `{ disposition: 'attachment' }` and saving `video.mp4` via `apps/media` `/dl/` (`Content-Disposition: attachment`) to computer (signed-in only, hidden in Kids Mode or when `offlineDownloads` off, same per-user rate limit, no browser offline library per [E14-D6](#11-owner-decisions)) + screenshot audit | No |
| **E14-S7** | `AlUmmahNowCore` | `aun-downloads` crate (plain-file manifest keyed by `(user_id, video_id)`, crash-safe 2-phase removal, revocations cursor + `apply_revocations`, Wi-Fi/charging & local storage policy, availability sync reconciliation, auto-download planner) + UniFFI exports for `aun-player`, `aun-sync`, `aun-api` offline write queue, and `aun-downloads` | No |
| **E14-S8a** | `AlUmmahNowAndroid` | Android Listen mode UI + sleep timer + queue (existing HLS audio with video track disabled; hidden in Kids Mode, signed-out, or `listenMode` off) | No |
| **E14-S8b** | `AlUmmahNowAndroid` | Android Auto (opt-in build flag, 4 browse tabs, voice search, resumption; hidden in Kids Mode, signed-out, or `listenMode` off) | Play Store Auto track opt-in ([E14-D7](#11-owner-decisions)) for store release only |
| **E14-S8c** | `AlUmmahNowAndroid` | Android plain-file progressive `video.mp4` offline download store + direct Media3 `file://` playback + storage UI + WorkManager availability sync | No |
| **E14-S8d** | `AlUmmahNowAndroid` | Android offline-first library sync (wire `aun-sync` + offline write queue for watch progress, likes, saved, notes) | No |
| **E14-S9a** | `AlUmmahNowApple` | Apple Listen mode + mini-player + queue + sleep timer (existing HLS audio; hidden in Kids Mode, signed-out, or `listenMode` off) | No |
| **E14-S9b** | `AlUmmahNowApple` | Apple CarPlay `CPTemplateApplicationSceneDelegate` + Siri voice play (hidden in Kids Mode, signed-out, or `listenMode` off; entitlement behind release flag) | Apple CarPlay entitlement approval ([E14-D7](#11-owner-decisions)) for store release only |
| **E14-S9c** | `AlUmmahNowApple` | Apple plain-file progressive `video.mp4` offline download manager + direct AVPlayer playback + storage UI + `BGAppRefreshTask` availability sync | No |
| **E14-S9d** | `AlUmmahNowApple` | Apple offline-first library sync (wire `aun-sync` + offline write queue into viewer likes, progress, saved, notes) | No |
| **E14-S10a** | `AlUmmahNowDesktop` | Desktop Listen mode + mini-player + queue + sleep timer + SMTC/MPRIS (existing HLS audio; hidden in Kids Mode, signed-out, or `listenMode` off) | No |
| **E14-S10b** | `AlUmmahNowDesktop` | Desktop plain-file progressive `video.mp4` offline downloads + direct playback + storage UI + availability sync | No |
| **E14-S10c** | `AlUmmahNowDesktop` | Desktop offline-first library sync (wire `aun-sync` + offline write queue through `CoreBridge.Native`) | No |
| **E14-S11a** | `AlUmmahNow` | Urgent & CSAM takedown revocations feed ([E14-D8](#11-owner-decisions)): next free search migration `<next>_download_revocations.sql` + regenerated `search.schema.snapshot.sql` (`UNIQUE(event_id)` so re-takedowns get a new `seq`), `GET /api/v1/downloads/revocations?since=<seq>` (`videoId` + `seq` only, internal Cache API + `Cache-Control: private`, refused on `kids:viewer` per E20 `#209` §4.3), and 4-step block-metadata → preserve-evidence (abort + `O26` alert on failure) → delete `pub/<videoId>/` + prefix purge → append CSAM (`csam:<caseId>`) & manual admin (`admin:<actionId>`) takedown hooks | No |
| **E14-S11b** | `AlUmmahNowApple` | Apple revocations feed poll (launch + `BGAppRefreshTask`) purging local media + thumbnail files for revoked `videoId`s | No |
| **E14-S11c** | `AlUmmahNowAndroid` | Android revocations feed poll (launch + `WorkManager`) purging local media + thumbnail files for revoked `videoId`s | No |
| **E14-S11d** | `AlUmmahNowDesktop` | Desktop revocations feed poll (launch + 12 h periodic timer) purging local media + thumbnail files for revoked `videoId`s | No |

**PR mapping (current work in flight):**
- `AlUmmahNow#1781` (merged): E14-S1.
- `AlUmmahNow#1790` (closed): dropped E14-S2 per [E14-D5](#11-owner-decisions).
- `AlUmmahNow#1822` (open): implements E14-S4a + E14-S4b together (rate-limit API, Admin Platform Settings UI, and `download_licenses` / tier field cleanup).
- `AlUmmahNowCore#53` (open): implements E14-S7 (`aun-downloads` with revocations cursor & 2-phase removal, plus UniFFI exports for `aun-player`, `aun-sync`, `aun-api` offline write queue, and `aun-downloads`).
- Earlier bundled native prototype PRs (`AlUmmahNowApple#81`, `AlUmmahNowAndroid#55`, `AlUmmahNowDesktop#74`) do not follow the one-PR-per-story split above and are superseded by clean per-story PRs (`E14-S8a`–`d`, `E14-S9a`–`d`, `E14-S10a`–`c`, `E14-S11b`–`d`) once this spec and `AlUmmahNowCore#53` pass review.

## 8. Costs

Using the platform's list prices in `apps/api-videos/src/lib/media/costs.ts` (R2 storage $0.015/GB-month, R2 Class A $4.50/M, R2 Class B $0.36/M, R2 egress **$0.00/GB**, Cloudflare Workers Paid $0.30/M requests above 10M included/month) and a consistent monthly workload (**10,000 video-hours in catalog; 1,000,000 public progressive `video.mp4` downloads/month — 800k native via zero-Worker R2 custom domain + 200k Web via the `apps/media` `/dl/` attachment Worker route — and 100,000 native devices holding ≥ 1 local download polling `revocations` on launch + every 12 h ≈ 3×/day = 90/month; private and unlisted videos are not downloadable**):

| Cost driver | Unit size / rate | Workload (10k hr catalog, 1M public downloads/mo, 100k devices with local files) | Monthly USD |
|---|---|---|---|
| **R2 storage for downloads & Listen mode (E14-D5)** | Reuses existing `video.mp4` and existing HLS audio streams (zero new R2 objects) | 0 extra GiB | **$0.00** |
| **Container / transcode time (E14-D5)** | No stream copy, no `audio_extract` job | 0 extra seconds | **$0.00** |
| **R2 egress (public CDN)** | $0.00/GB on R2 (Cloudflare CDN Cache Rule) | ~450 TB progressive `video.mp4` downloads | **$0.00** |
| **R2 Class B reads (public progressive: 800k native at 50% CDN hit + 200k Web `/dl/` uncached)** | 1 object per R2 read (~1.2 range reqs avg on resume) | (800k × 50% + 200k × 100%) × 1.2 = 720k reads | **$0.26** |
| **Media Worker (`GET`/`HEAD /dl/` for Web attachment downloads, uncached at edge)** | $0.30/M Worker reqs (Web downloads only; native stays zero-Worker) | 200k Web downloads/mo = 0.2M Worker reqs | *(counted in Workers total below)* |
| **API Workers (`downloads` resolve + `sync` + `revocations` poll)** | 1M resolves + 2M batch syncs + 9M revocations polls (100k devices × 90/mo) + 0.2M `/dl/` = **12.2M total Worker reqs** (D1 revocations reads absorbed by Workers Cache API: < 500k rows/mo = $0.00) | 2.2M above 10M/mo included = **$0.66**; or **$3.66** if the 10M included allowance is used by other routes | **$0.66–$3.66** |
| **Total incremental Epic 14 cost** | | | **$0.92–$3.92 / month** |

*Comparison with Bunny egress:* Serving 1M public progressive `video.mp4` downloads (~450 TB) from Bunny at $0.01/GB egress would cost **~$4,500/month** vs **$0.00/month** egress on R2.

## 9. Legal and safety concerns

- **Creator opt-out:** Creators retain control over offline availability via channel default and per-video `allowDownloads`. Turning downloads off stops new downloads immediately and causes native apps to remove saved copies on the next sync.
- **Moderation & CSAM takedown hygiene ([E14-D8](#11-owner-decisions)):** Removing, hiding, or making a video private immediately causes `POST /api/v1/downloads/sync` to answer `available: false`, so native apps delete their local files on the next app sync. For CSAM (`csam:<caseId>`) or urgent manual admin (`admin:<actionId>`) takedowns, the server runs the mandatory 4-step order: (1) block metadata first so `POST /downloads` and `sync` refuse the video, (2) preserve CSAM evidence per [E28-ai-moderation.md](E28-ai-moderation.md) (note: [M4](decisions.md#m4-csam-coverage-for-r2-served-media) is still open; abort the delete and raise an `O26` Admin Errors alert if preservation fails), (3) delete/tombstone R2 `pub/<videoId>/` objects (stopping `/dl/`, which sends `Cache-Control: private, no-store`) and purge the entire `/pub/<videoId>/` prefix from Cloudflare edge cache, and (4) append an event row (`UNIQUE(event_id)`, so a second takedown of a restored video gets a new higher `seq`; retried via queue + DLQ + `O26` Admin Errors alert on failure) to `download_revocations`, exposed via `GET /api/v1/downloads/revocations?since=<seq>` (carrying **only `seq` and `videoId` and nothing else**, internal Cache API storage with client `Cache-Control: private`). Apple, Android, and Desktop apps poll on launch and every 12 h whenever they hold ≥ 1 local download to purge matching local copies right away without scanning a device table.
- **Kids Mode & revoked files trade-off:** Because `POST /api/v1/downloads/sync` and `GET /api/v1/downloads/revocations` are refused with `403 kids_mode_restricted` under `kids:viewer`, a device that remains continuously in Kids Mode retains any previously downloaded adult files on disk until an adult exits Kids Mode. Those files are completely hidden and unplayable in Kids Mode, and are purged automatically on the first launch/sync after exiting Kids Mode; this is an accepted trade-off.
- **No DRM / encryption & public CDN files (E14-D1):** Per owner decision **E14-D1**, downloaded files are plain media files with no encryption, DRM, URL signing, or license expiry; public `/pub/` and `/dl/` files are public CDN objects (direct URL access bypasses sign-in and the rate limit, which gate the app's Download action `POST /downloads` only). Local downloads remain excluded from cloud backups (iCloud / Auto Backup for Apps) to avoid bloating user backup storage.
- **Driver safety (CarPlay & Android Auto):** Car templates are strictly audio-only (never render video), keep browse hierarchies shallow, obey Apple CarPlay Audio HIG and Google Play "Media apps for cars" safety review rules, stay hidden while `listenMode` is off, and ship store metadata/entitlements only after [E14-D7](#11-owner-decisions).
- **Privacy & account lifecycle:** Offline sync respects the viewer's "Pause watch history" preference. Signing out wipes that account's local downloads and pending write queue.

## 10. Tests

- **API, media Worker & shared-types unit/integration tests:**
  - Feature switch, auth & Kids Mode gates (`404 feature_off` when `listenMode` or `offlineDownloads` is off; `401` when signed out on `GET /api/v1/videos/:id/audio`, `POST /api/v1/videos/:id/downloads`, `POST /api/v1/downloads/sync`, or `GET /api/v1/downloads/revocations`; `403 kids_mode_restricted` on all four routes when E20's verified `kids:viewer` token scope is present; `GET /api/me/features` returns `200` with `false` for both when signed out or under `kids:viewer`; `sync` and `revocations` stay reachable for signed-in non-Kids accounts when `offlineDownloads` is off).
  - Visibility & download rights matrix: missing, deleted, hidden, and unreadable private videos return `404 not_found` on both `GET /audio` and `POST /downloads` (never leaking private video existence); creator `allowDownloads = false`; channel `defaultAllowDownloads = false`; Bunny-only video (`409 rendition_not_ready`); per-user daily and burst rate limit returning `429 download_rate_limited` in both English and Arabic (no tier checks or stored download counts); existing R2 `video.mp4` and existing HLS audio reuse (no `audio.m4a` creation).
  - Web `/dl/:videoId/:rev/:filename` filename sanitization & injection tests: decode-once-then-sanitize (double-encoded payloads stay safe, malformed `%` falls back to `<videoId>.mp4`), header/CRLF injection (`\r\n`, `"`, `;`, `/`, `\`, `..`), non-`.mp4` rejection, over-length filenames (> 80 chars clamped while keeping `.mp4`), and Arabic/non-Latin titles (ASCII fallback `filename="<videoId>.mp4"` + RFC 5987 `filename*=UTF-8''<encoded>.mp4`).
  - Web `/dl/` HTTP `GET`/`HEAD` & `Range` tests (reusing/extending `objectResponse` in `apps/media/src/edge.ts`): `Accept-Ranges: bytes`, `ETag`, `Content-Length`, `Cache-Control: private, no-store`, `HEAD` returning headers with empty body, `206 Partial Content` + `Content-Range` for valid ranges, `416 Range Not Satisfiable` (`bytes */<total>`) for invalid/out-of-bounds ranges, and `If-Range` returning `206` on `ETag` match and `200` full object on mismatch.
  - Batch availability sync (`POST /api/v1/downloads/sync`: `available: true` for public downloadable videos; uniform `available: false, reason: 'unavailable'` for missing, deleted, hidden, private, unlisted, draft, live, and not-ready videos so private vs missing is never leaked).
  - Urgent/CSAM takedown revocations feed (**E14-D8**):
    - Mandatory 4-step order: metadata refusals (`404` on `POST /downloads`, `available: false` on `sync`) and `/pub/` + `/dl/` `404` (after `pub/<videoId>/` delete + `/pub/<videoId>/` prefix purge) occur **before** the revocation row exists; on the CSAM path, evidence preservation runs after metadata block and before `pub/` delete, and a preservation failure aborts the delete and raises an `O26` Admin Errors alert.
    - Append-only event log: idempotent retry on the same `event_id` (`csam:<caseId>`, `admin:<actionId>`) produces no duplicate row, while a **second takedown** of a previously restored video with a new `event_id` produces a new higher `seq` visible to devices past the old cursor.
    - Internal vs client cache headers & auth boundary: unauthenticated (`401`) and `kids:viewer` (`403`) requests **never** read `caches.default`; authenticated non-Kids requests store the serialized JSON body in `caches.default` with internal `Cache-Control: public, max-age=120` keyed strictly on validated `since`, while the client `Response` always sends `Cache-Control: private, max-age=60` and `Vary: Authorization`.
    - Monotonic `seq` ordering, cursor pagination (`since`), payload contains only `seq` and `videoId` (assert no title/reason/PII), `403 kids_mode_restricted` under `kids:viewer`; native pollers (Apple, Android, Desktop) delete local media & thumbnail files when `videoId` is stored locally, advance `seq` only after deletion succeeds, and skip network/disk work when `videoId` is not held locally.
  - Four-column expand-then-contract deploy & schema snapshot tests: verify both the old Worker (during a rolling deploy) and Release 1 work cleanly while all four `0079` columns (`offline_downloads`, `offline_max_quality`, `offline_max_videos`, `offline_license_days`) remain in D1 with defaults (Release 1 stops reading/writing them; Release 2 drops them), verify `<next>_drop_download_licenses.sql` and `<next>_download_revocations.sql` apply cleanly, and verify `pnpm check:schema` passes against the regenerated `apps/api-videos/migrations/search.schema.snapshot.sql`.
- **Web & Admin tests:**
  - Admin Platform Settings `DownloadRateLimitSetting` unit tests (validation, en/ar labels, Eastern Arabic numerals, save + audit history; zero tier download fields in `TierEditor`).
  - Web Listen mode + plain Download button & Admin Platform Settings real-browser production-build screenshot audits (en & ar, light & dark, desktop & phone) in `review-shots/e14/`.
- **Core & Native tests:**
  - Rust unit tests in `aun-downloads` (`(user_id, video_id)` multi-account isolation, local-only `thumbnail_path` rejecting signed URLs, no silent eviction of active user downloads, Wi-Fi & local storage budget policy, availability sync reconciliation, auto-download selection) and `aun-player` / `aun-sync` FFI smoke tests.
  - Android JVM unit tests (`BrowseTree` car categories gated on `listenMode`, no persisted signed URLs, audio rendition playback, direct offline `file://` Downloads playback, availability sync deletion, `SleepTimer`).
  - Apple Swift Package tests (`PlayerController` audio mode, sleep timer, queue, plain-file offline download store + availability sync deletion, CarPlay template builder gated on `listenMode` + localization + item caps).
  - Desktop xUnit tests (`ListenModeController`, plain-file `OfflineDownloadStore` + availability sync deletion, storage budget refusal, Arabic digit formatting on sleep timer, SMTC/MPRIS commands).

## 11. Owner decisions

| # | Decision | Status / Options | Resolution / Recommendation |
|---|---|---|---|
| **E14-D1** | **Default creator download setting & content protection** | **DECIDED (2026-11-23):** Download enabled by default on public videos; **no encryption, no DRM, no license/expiry system, no device/slot counting**. | Plain progressive R2 `video.mp4` files stored and played directly; keep creator opt-out per channel/video, hygiene cleanup on private/deleted video sync, and never persist signed URLs. |
| **E14-D2** | **Download rights across tiers & rate limiting** | **DECIDED (2026-11-23):** Downloads are **the same for everyone**, with **no tier limits on count or quality**, protected by a server-side **rate limit** (admin-configurable per-day count + burst limit, returning `429` with clear English and Arabic messages; no stored download counts/quotas). | Removed all tier download fields from `CreatorTier` and `TierEditor.tsx`. Added `ops/download-rate-limit.json` on Admin → Platform settings using the existing D1 rate-limit mechanism (`rate-limit.ts`). |
| **E14-D3** | **Signed-out viewers: Listen mode vs Downloads** | **DECIDED (2026-11-23):** **Both Listen mode AND downloads require sign-in.** Signed-out visitors get neither, and all controls are completely hidden (no "sign in to…" teasers). | `GET /api/me/features` returns `listenMode: false` and `offlineDownloads: false` when signed out; `GET /api/v1/videos/:id/audio` and `POST /api/v1/videos/:id/downloads` both require authentication. |
| **E14-D4** | ~~Default offline license expiry window~~ | **DROPPED** | Dropped per E14-D1 & E14-D2 — no license or expiry system exists. |
| **E14-D5** | **Audio-only rendition strategy** | **DECIDED (2026-11-23):** **Use the existing streaming audio track — NO separate `audio.m4a` file**, no copy at transcode time, no lazy `audio_extract` backfill or container job, and no new R2 objects. | Listen mode & car audio are streaming-only using the existing HLS audio rendition (`a/<trackId>/index.m3u8` for multi-audio or existing HLS `master.m3u8` with video track disabled). Downloads serve the existing progressive R2 `video.mp4` whole video file only. Closed E14-S2 PR `#1790`. |
| **E14-D6** | **Website Listen mode & downloads** | **DECIDED (2026-11-23):** Website gets **Listen mode** (background audio, queue, sleep timer) **plus a plain "Download" button** that saves the file to the user's computer — no encryption, signed-in users only, under the same per-user rate limit, **no in-browser offline library**. | Added plain Download button on web watch page (hidden when signed out or `offlineDownloads` off), calling `POST /api/v1/videos/:id/downloads`. |
| **E14-D7** | **Store portal approvals for CarPlay & Android Auto** *(owner portal action, does not block code)* | Request `com.apple.developer.carplay-audio` in Apple Developer Portal for the Viewer iOS bundle ID, and opt into the **Android Auto** form factor in Google Play Console | **Action needed before store release:** Both Apple and Google require explicit portal opt-in/approval before CarPlay and Android Auto binaries can ship to users. Car manifest metadata and CarPlay scene/entitlement stay gated off in store builds until approval arrives. |
| **E14-D8** | **Urgent moderation / CSAM takedown offline hygiene** | **DECIDED (2026-11-23):** Delete local copies of removed content on the app's next sync (`POST /api/v1/downloads/sync`); for **CSAM or urgent legal takedowns**, expose a small, cacheable, monotonic cursor feed (`GET /api/v1/downloads/revocations?since=<seq>`) carrying **only `seq` and `videoId` and nothing else**, polled by Apple, Android, and Desktop apps on launch and periodically to purge matching local copies right away without scanning a device table. | Standard removals purge on next sync; CSAM/urgent legal takedowns append `(seq, video_id)` to `download_revocations` (no title/reason/PII), and all native apps poll and purge locally. |

## 12. Status evidence

- D2 decision: [AlUmmahNow#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686) (merged 2026-11-10 as `f4cca7db`)
- Source epic definitions: [AlUmmahNow#309](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/309) (merged 2026-11-08)
- Apple viewer backlog: [AlUmmahNowApple#9](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/9) (open)

## 13. Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [D2: Video delivery](D2-video-delivery.md)
- [Multiple audio tracks](AUN-MULTI-AUDIO-multiple-audio-tracks.md)
- [Feature switches](AUN-FEATURES-feature-switches.md)
