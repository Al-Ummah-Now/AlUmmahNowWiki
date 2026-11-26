[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Move from YouTube: a creator brings their own channel

| | |
|---|---|
| **ID** | `AUN-YT-IMPORT` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (api-videos, web Studio, admin-web, admin-api, shared-types) |
| **Status** | **in progress** (reconciled 2026-11-21; see Status evidence) |
| **Last updated** | 2026-11-21 |
| **Origin** | Owner, 2026-11-14: "if creator want to switch from youtube to us they should be able, spec, design, build" |

## Goal

A creator who owns a YouTube channel moves it to their Al Ummah Now channel: the videos, their titles, descriptions, tags, chapters, thumbnails, captions, visibility and original publish dates, and the playlists. The creator does it themselves from Studio, in a few steps, with progress they can leave and come back to.

**Stay within YouTube's and Google's terms.** Nothing is scraped or downloaded from youtube.com. No yt-dlp or anything like it, no YouTube page fetches, no stream URLs. Only Google's own exports and APIs, used by the owner of the channel with their consent.

## The paths we use, and why

| What | Path | Why this one |
|---|---|---|
| Channel, video and playlist **metadata** | **Google OAuth 2.0 + YouTube Data API v3**, scope `youtube.readonly` | The documented, consented way for a channel owner to let an app read their own channel. Read only: we never change anything on YouTube. |
| **Captions** | YouTube Data API `captions.list` + `captions.download`, **optional**, extra scope `youtube.force-ssl` asked only when the creator ticks "Import captions" | `captions.download` accepts only `youtube.force-ssl` (or `youtubepartner`); no read-only scope can download a track. So captions are opt-in and asked separately (Google's incremental authorization). We still only call read methods. |
| The video **files** | **Google Takeout** ("YouTube and YouTube Music" → videos), downloaded by the creator. In the wizard the creator picks the Takeout zip file(s) (or the extracted files); **their browser** reads each zip's index, takes out only the chosen videos and uploads each one through our normal resumable upload | Takeout is Google's own export of the creator's originals, at the quality they uploaded. Reading the zip in the browser means only the chosen videos travel, nothing is unzipped on our servers, and every byte goes through the upload path we already run (resumable TUS, our R2 originals, the same transcode). |
| **Thumbnails** | The `snippet.thumbnails` image URLs the Data API returns for the creator's own videos (largest size), fetched by our server once per video | The API's own resource for the owner's thumbnail. Takeout has no thumbnails. |
| **Mapping** files to videos | Takeout's `video metadata/videos.csv` (video id + title), then title and duration, then the creator's own choice | Takeout names video files by **title**, not by id. The CSV ties each id to its title, so most files map by id with no guessing. |

### Considered and not used

| Path | Why not |
|---|---|
| Downloading from youtube.com (yt-dlp, page or stream fetches) | Against YouTube's Terms of Service. Never. |
| Google Drive (Takeout can deliver there) | `drive.readonly` is a **restricted** scope (a yearly paid third-party security assessment). `drive.file` needs the Google Picker (Google's script and a browser API key inside Studio). Either way our servers would have to unzip multi-GB entries, which a Worker cannot do within its CPU limit: a container per import, a running cost for every import. Takeout's default download link goes to the creator's computer anyway. |
| Uploading the whole Takeout zip and unzipping on our side | Moves every byte of every zip (up to 50 GB a part), chosen or not, then the same unzip cost as Drive. |
| YouTube Data API for the files | The API has no endpoint that returns a video's file. |

## How it works

### The Studio wizard: Studio → Content → **Move from YouTube**

1. **Connect.** "Connect YouTube" opens Google's consent screen (read-only). An "Import captions" checkbox, off by default, adds the captions scope and says why Google asks for it. Back in Studio the wizard shows the YouTube channel (name, avatar, video and playlist counts) and starts reading its videos and playlists in the background.
2. **Pick.** Every video (thumbnail, title, YouTube visibility, date, length) and every playlist, with search, Select all and "Select a playlist's videos". Options: **Visibility**: "Keep each video's YouTube visibility" (default) or "Import everything as private". Already imported videos are marked and cannot be picked twice.
3. **Add Takeout files.** Steps to request the export (takeout.google.com → only "YouTube and YouTube Music" → "All YouTube data included" → only "videos" and "video metadata"), then "Choose Takeout files": one or more `.zip` parts, or the extracted video files. The browser reads only the zip indexes (seconds, even for 50 GB parts).
4. **Review the matches.** Each picked video with its file: "Matched by video id", "Matched by title" (check it), or "No file" with a file picker of the unmatched files. The creator can change or remove any match. Videos with no file are left out of this import and stay pickable later.
5. **Import.** Two videos upload at a time. Per-video progress: Waiting → Uploading n% → Processing → Ready, or Failed with the reason and **Try again**. The import keeps going on our side (thumbnails, captions, playlists) after the uploads; the uploads themselves need the tab open, like any upload. Leaving and coming back resumes: the wizard opens on the import, asks for the same Takeout files, and every unfinished upload continues from where its bytes stopped.

When everything is done: a summary (imported, left out, failed), links to the channel and Content, and the **link-back** kit (below). The creator is notified when an import finishes with failures.

### What is imported

| YouTube | Al Ummah Now |
|---|---|
| Title, description (and their `en`/`ar` localizations) | Title, description (`titleLocalized`, `descriptionLocalized`) |
| Tags | Tags |
| Category | Not mapped. YouTube's categories (Education, Entertainment, People & Blogs…) do not correspond to ours (Quran recitation, Fiqh, Khutbah…), so the creator picks one in Studio |
| Default audio language | Language |
| Chapters (timestamps in the description) | Chapters, by our own chapter parser on the imported description |
| Custom or auto thumbnail | Custom thumbnail (same shape check as an upload; a thumbnail of the wrong shape is left out and our own frame is used) |
| Caption tracks (opt-in) | Subtitle tracks, one per language, as uploaded tracks (not drafts). Auto-generated (ASR) YouTube tracks are left out |
| Publish date | `publishedAt` = the YouTube publish date, so channel order and dates stay true; the watch page shows "Originally published on YouTube on {date}" |
| Playlists (title, description, visibility, order) | Channel playlists with the same title, description, visibility and order, holding the imported videos |

**Visibility:** public → public, unlisted → unlisted, private → private. A private video with a future `publishAt` (scheduled on YouTube) becomes a scheduled video here at the same time. "Import everything as private" overrides all of these.

**Made for kids:** recorded on the video (`importedFrom.madeForKids`). As on YouTube, comments start **off** on those videos; the creator can turn them on in Studio. (Once [E20-B1](E20-system-parental-controls.md) ships they stay off, as on YouTube: E20-D8.)

### What is not imported, and why

| Not imported | Why |
|---|---|
| **Comments** | They are other people's posts, made on YouTube under their YouTube names. Their authors have no account here and did not agree to have their words republished on another platform. The Data API can read public comments, but that is not consent; Takeout's comments file holds only the creator's own comments. Comments start fresh. |
| Views, likes, subscribers | YouTube's metrics, not the creator's content. Counters here start at zero. |
| Members-only, end screens, cards, monetization, licence, location | No equivalent here. |
| Auto-generated captions | Machine text from YouTube. The creator can use our own Transcribe instead (AUN-CAPTIONS). |

### Canonical, SEO and the link back

- An imported video's watch page stays **self-canonical** (its own URL). We never point canonical at YouTube: that would tell search engines to drop our page. The same video on two platforms is normal and not a duplicate-content problem.
- The `VideoObject` structured data uses the YouTube publish date as `uploadDate`, so search engines see the true age.
- Imported videos do **not** notify subscribers (they are not new); they appear in the channel in their original date order.
- **Link back (optional, done by the creator).** We only read from YouTube, so we never edit YouTube descriptions. The summary step offers a line per video to paste into its YouTube description ("Also on Al Ummah Now: {short link}") and a CSV of every YouTube video id with its Al Ummah Now link, for the creator's own bulk editing.

### Limits and tiers

- Only creators who can upload (a creator tier; uploads stay invitation-only, [O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)) can import, into channels they can upload to.
- Each tier has a new admin setting, **"YouTube imports count against upload limits"** (Creators → tier). On (the default): every imported video counts as one upload session against the tier's hourly and daily limits, like an upload. Off: imported videos skip those counters. A tier is still needed, and Unlimited stays unlimited either way.

### Google's rules we follow

- **Read only.** Only `youtube.readonly`, plus `youtube.force-ssl` when the creator opts into captions; only read methods are called.
- **Tokens.** Offline access, so a captions import that waits for the next day's quota can continue. The refresh token is encrypted (AES-GCM) in D1, used only by the import's queue jobs, and **revoked at Google and deleted** when the import finishes or is cancelled, or when the creator disconnects. The wizard tells the creator they can also revoke access at myaccount.google.com/permissions.
- **API data.** The fetched snapshot of each YouTube video is kept only while the import needs it and deleted 30 days after the import finishes. What the creator imports becomes their own content here (they can edit or delete it like any upload).
- **Quota.** The Data API's default is 10,000 units a day per project. Metadata is cheap (one unit per 50 videos). Captions are not: `captions.list` costs 50 units and each `captions.download` 200, so about 35 videos' captions a day on the default quota. When the quota runs out the captions step shows "Waiting for YouTube's daily quota" and continues after it resets (midnight Pacific time). The owner can ask Google for a higher quota (free audit form).
- **Verification.** `youtube.readonly` and `youtube.force-ssl` are sensitive scopes: Google's OAuth verification is needed before the consent screen works for everyone (until then, up to 100 test users added in Google Cloud).

## Design

- Studio → Content gets a **Move from YouTube** tab (`/studio/{channelId}/content/youtube`), visible to people who can upload to the channel.
- A five-step wizard with a step indicator; one primary action per step; the same Fanous components as the upload page (cards, list rows, progress bars, status pills). Tables become stacked cards on phones. en and ar (RTL, Arabic glossary: «مرئي / مرئيات»), light and dark, desktop and phone.
- Progress is live (polled every 5 s while the tab is open) and every failure has its reason in plain words and a **Try again**; nothing shows a raw error.
- Arabic name: «الانتقال من يوتيوب».

## Connecting safely

Google returns to our API (`/api/youtube-import/oauth/callback`), which never finishes the connection itself: it keeps Google's code against a fresh one-time **connect token** (only its SHA-256 is stored) and sends the browser back to Studio with `?connect=<token>`. Studio then calls `POST /api/youtube-import/oauth/finish` signed in; the connection is made only when the signed-in user is the one who started it and can still import into the channel. A different account gets a refusal and the consent is deleted. So a consent link sent to someone else can never attach their YouTube channel to the sender's import. Every import action re-checks the caller's channel access, and each video claims its upload once (a second attempt answers "already taken").

## Hidden while off

Creators never see that the feature exists until it works (owner, 2026-11-15). While the admin switch is off, or the client ID or client secret is missing:

- Studio shows no **Move from YouTube** tab, and `/studio/{channel}/content/youtube` is a plain 404. On the server, the Studio layout uses `getStudioFeatures` (`apps/web/src/lib/studio/server.ts`) to read `youtubeImport` from `GET /api/me/features` for the channel. The tab appears when that flag is on for the account and channel.
- Every `/api/youtube-import/*` route, and an upload initiate that names an import, answers **404 `feature_off`**, with no message about it. Google's callback sends the browser to the Studio dashboard, and a wizard left open when the switch goes off leaves for the dashboard silently.
- Readiness messages ("client secret missing", setup steps) appear only on the admin page.

## Admin

- **Videos admin → Platform settings → YouTube import** (`media:manage`): on/off, the Google OAuth **client ID**, the **client secret** (write only: "Add client secret" / "Replace" takes it once, it is never shown again; the page says Present or Missing, set here by whom and when, or read from the Secrets Store fallback; replacing it disconnects imports connected at that moment, whose refresh tokens are sealed under it), the **redirect URI** to register in Google Cloud, the scopes, and the setup steps (Google Cloud project, YouTube Data API v3 enabled, OAuth consent screen, verification, quota). Every change is audited (`site_settings_log`, keys `youtube-import:settings` and `youtube-import:client-secret`; the second records only present/missing and the source, never the value).
- **Creators → tier:** "YouTube imports count against upload limits".
- **Errors page:** a video whose import step failed after its retries (thumbnail, captions, playlist, metadata read) is a needs-action item (`youtube-import:item:{id}` / `youtube-import:{id}`) with **Retry**. Upload and transcode failures are flagged by the upload pipeline as for any upload.

## Architecture

```
Studio wizard ──OAuth──▶ api-videos /api/youtube-import/oauth/* ──▶ Google OAuth (code + PKCE)
      │                         │ refresh token (AES-GCM) ─▶ SEARCH_DB yt_imports
      │                         └─▶ queue al-ummah-now-yt-import: list (pages) ─▶ yt_import_items, yt_import_playlists
      │                                                             captions (per video, quota-aware)
      │ zip index read in the browser (shared-types takeout.ts)
      │ match ids (videos.csv) ─▶ PUT /items/:id/match
      └─ per video: POST /api/videos/upload/initiate { youtubeImport } ─▶ the normal upload (TUS → R2 originals / Bunny)
                                         │ server takes title, description, tags, dates, visibility from the snapshot
                                         └─▶ queue: finalize (thumbnail, captions, chapters) ─▶ playlists once all are done
```

- **Queue** `al-ummah-now-yt-import[-qa|-stage]`, consumer in api-videos (batch 1, 5 retries with backoff, the shared DLQ `al-ummah-now-dlq[-env]`, whose dead letters the processor stores). Every step is idempotent (upserts keyed by import and YouTube id; a playlist is created once and remembered; a thumbnail or caption already applied is skipped), and resumable (listing walks one page per message and queues the next).
- **Tables** (SEARCH_DB, migration `0041_youtube_import.sql`): imports, items, OAuth consent states and staged captions; `creator_tiers.import_counts_limits`.
- **Settings** in `global_settings` `youtube-import/settings.json`. The client secret set on the admin page is sealed like the cost dashboard's keys (COST-1): AES-256-GCM under a key derived (HKDF-SHA256) from `INTERNAL_API_KEY`, in `global_settings` `youtube-import/client-secret.json`, opened only by api-videos. Without one, the Secrets Store binding `GOOGLE_OAUTH_CLIENT_SECRET` is read (the placeholder `unset` counts as none).
- **Running cost:** none when idle (a queue with no messages, no cron). Per import: a few hundred queue messages and the uploads' normal cost (originals and transcodes, as any upload).

## Tests

- Unit (shared-types): zip index reader (zip and zip64, stored and deflated), `videos.csv` parser, matcher, visibility/category mapping.
- Unit (api-videos): OAuth state and token encryption, the Google client against a fake Google, every queue step (paging, quota wait, retry, last-attempt flag), initiate with `youtubeImport`, the tier setting.
- E2E on the local stack (`scripts/local-stack/fake-google.ts`): a fake Google (OAuth, Data API, thumbnail host) and a fixture Takeout zip built by the test: connect → pick → choose the zip → review → import → the videos exist with their YouTube metadata, dates and playlist. No real Google in any test.

## Status evidence

### Reconciled 2026-11-21

- **AUN-YT-IMPORT (AUN-59): Done** — both audits agree: AlUmmahNow#1390 (merged): import API, jobs and settings; AlUmmahNow#1391 (merged): Studio import wizard; AlUmmahNow#1417 (merged): made-for-kids imports disable comments; AlUmmahNow#1390; AlUmmahNow#1391; AlUmmahNow#1381
## Decisions and constraints

- [O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers): uploads are invitation-only through creator tiers; imports follow the same gate.
- [O26](decisions.md#o26-always-async-with-admin-visible-errors): every background step is queued with retry and a DLQ, failures reach the Errors page.
- [O1](decisions.md#o1-cost-conscious-design): no idle cost.

## Needs from the owner (outside the code)

- A Google Cloud project with the YouTube Data API v3 enabled, an OAuth consent screen (sensitive scopes `youtube.readonly`, `youtube.force-ssl`) and a Web OAuth client whose redirect URIs are the ones the admin page lists per environment.
- The client ID and client secret entered on the admin page (per environment), then the switch on. Nothing to paste in Cloudflare: the Secrets Store entries `google-oauth-client-secret[-qa|-stage]` exist only as a fallback, created by the release with the placeholder `unset`.
- Google's OAuth verification of the consent screen before creators outside the test-user list can connect.

## Sources

- Owner request, 2026-11-14 (chat).
- YouTube Data API reference: [captions.download](https://developers.google.com/youtube/v3/docs/captions/download) (scope `youtube.force-ssl`, 200 units), [quota costs](https://developers.google.com/youtube/v3/determine_quota_cost).
- [YouTube API Services Developer Policies](https://developers.google.com/youtube/terms/developer-policies) and the [compliance guide](https://developers.google.com/youtube/terms/developer-policies-guide).
- [Data Portability schema reference for YouTube](https://developers.google.com/data-portability/schema-reference/youtube) (Takeout's `videos` CSV).
