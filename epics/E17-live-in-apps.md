[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 17: Live in apps (watch, chat, premieres, reminders)

| | |
|---|---|
| **ID** | `E17` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **in progress** (spec rewritten 2026-11-23 against AlUmmahNow main `4bd5e9180`; the web live page and recordings exist; the server for chat, premieres, reminders and event tags is on main behind switches that default off, no client uses it yet) |
| **Last updated** | 2026-11-24 |
| **Linear** | [AUN-337](https://linear.app/hamzalabs/issue/AUN-337) (stories AUN-338 to AUN-342) |

How to read this page: **on main** means the code is merged in `AlUmmahNow`. Anything that is only in an open PR is named with its number, and §9 says which story waits for it. Each rule is written once; other sections link to it.

## 1. Goal

Viewers on the web, Apple, Android and Desktop can:

1. **17.1** watch a live stream with a live viewer count, and seek back while it is on air;
2. **17.2** take part in moderated live chat;
3. **17.3** watch a video premiere together at a set time, and ask to be reminded of any upcoming stream or premiere;
4. **17.4** find event streams (Jumu'ah, Taraweeh, conferences, halqas);
5. **17.5** watch the recording afterwards, with the chat beside it.

**No separate circles product (owner, 2026-11-23).** A circle is a live video with chat. `halqa` is only an event tag (**Halqa** / **حلقة علم**). It is never a product, a page, a group or a data model.

## 2. What exists on main

| Area | Files (AlUmmahNow unless named) | What it does |
|---|---|---|
| Providers and sessions ([D3](D3-live-provider.md)) | `packages/shared-types/src/live-providers.ts`, `apps/api-videos/src/lib/live/*` | Two providers (`bunny`, `selfhosted` HLS push to R2), round-robin, ingest, idle timeout, recording, QoE. |
| Stream record | R2 `livestream:<id>` in the `videos` bucket; `lib/live/streams.ts` | The one stored copy of a stream. Written by `liveStreamCreate.ts`, `liveStreamUpdate.ts`, `lib/live/streams.ts`, `lib/review/live.ts`, `routers/admin.router.ts`, the suspension cascade in `lib/admin/service.ts` and account erasure in `lib/privacy/user-data.ts`. |
| Stream index | `SEARCH_DB.content_ownership`, `kind = 'stream'`; `syncStreamInline` in `lib/search/sync.ts`; `backfillOwnershipPage` in `lib/search/ownership.ts`; `lib/search/repairs.ts` | One row per stream, guarded by `source_version` and tombstones. Written only when the bucket is wrapped by `withSearchSync`. |
| Routes | `routers/live.router.ts` | `GET/POST /api/live-streams`, `GET/PATCH/DELETE /:id`, `/:id/state`, `/:id/ingest`, `/:id/start`, `/:id/end`, `/:id/viewers`, `/:id/qoe`. |
| Viewer count | `apps/websocket-server/src/live-viewers.ts` | 20 s heartbeat, 75 s expiry, memory only. |
| Web | `apps/web/src/components/live/*`, `components/studio/live/*` | Browse, watch, recording, Studio Go live. |
| Recording review (VR9) | `lib/review/live.ts`, `lib/live/vod-ready.ts` | The recording is withheld until review clears it. |
| Comment moderation | `lib/comments.ts`, `lib/channelComments/blocks.ts`, `packages/shared-types/src/channel-roles.ts`, `lib/moderation-scan.ts`, `apps/processor/src/moderation/*` | Roles (`live.manage`, `live.moderate`, `comment.moderate`), silent channel blocks, AI scan that writes a signal. **The AI never hides anything today** (`decide(..., { autoHideAvailable: false })`). |
| Notifications | `lib/notification-events.ts`, `apps/processor/src/lib/notifications-store.ts`, `apps/processor/src/push/dispatch.ts` | `announceLiveStarted` fans out to channel subscribers, dedupe key `live:<streamId>`, category `live`. |
| Crons in api-videos | `scheduled()` in `apps/api-videos/src/index.ts` | `* * * * *` in production, every 5 minutes on QA and stage. |
| Native apps | Apple, Android, Desktop | No live code. |

Faults found on main that this epic fixes, because it builds on them:

| Fault | Where | Fixed in |
|---|---|---|
| The minute cron passes the unwrapped env to `sweepLiveSessions`, so a stream ended by the idle or tier sweep keeps `status = 'live'` in `content_ownership`. | `index.ts` `scheduled()` | E17-1 |
| A confirmed report on a live stream looks up the bare id, without `livestream:`, in an unwrapped bucket, so nothing is hidden. | `apps/admin-api/src/lib/moderation/reportDecision.ts` | E17-2b |
| `GET /api/videos/:id/chapters` has no visibility check, so a private video's chapter titles are readable. | `endpoints/video/chapters.ts` | E17-3 |

## 3. Switches and tiers

### 3.1 Switches

Four new entries in `packages/shared-types/src/feature-registry.ts`, each **default off**, `toggle: 'superAdmin'`. When one is off, its routes answer `404 feature_off` ([O40](decisions.md#o40-server-written-error-messages)) and no client shows anything about it ([Product rules](../guides/product-rules.md)).

| Key | Group | Server gate |
|---|---|---|
| `liveChat` | `people` | every `/api/live-streams/:id/chat*` route; WebSocket `live:<id>` subscribe |
| `livePremieres` | `create` | `POST /api/videos/:id/premiere`, `PATCH /api/live-streams/:id/premiere`; starting a premiere |
| `liveReminders` | `people` | `/api/live-streams/:id/reminders`; sending reminders |
| `liveEvents` | `create` | setting `eventType`; the `eventType` filter |

None of the four `requires` the existing `live` switch. `live` stops **new streams**; streams on air and recordings continue (`feature-routes.ts`), and a premiere needs no live provider. `POST /api/live-streams/:id/start` serves both kinds, so E17-3 moves it from the middleware to its handler (`enforced: 'handler'`): `livePremieres` for a premiere, `live` for a stream.

The chat routes fail closed: while the switches cannot be read they answer `feature_off`, and so does the socket. `/start` refuses too, and a scheduled premiere is not shown to others while `livePremieres` is off or unreadable. Other routes keep today's rule.

`livePremieres` off while a premiere is scheduled: it does not start and is shown to its owner only. Turning the switch on again within 60 minutes of the start time starts it; after that the cron cancels it (§5.4).

In `GET /api/me/features`:

- Without `channelId`, the four keys are viewer flags and follow only the effective switch. They need no tier and no live provider.
- With `channelId` (Studio), `liveChat`, `livePremieres` and `liveEvents` also need the channel owner's tier and the caller's role.
- `liveConfigured(env)` is read only where it is read today (signed-in tier holders), so a D1 error there cannot break the answer for other viewers.
- Native apps treat a missing key as off.

### 3.2 Tiers

`creator_tiers` gains nullable `live_chat`, `live_premieres`, `live_events`. `NULL` means "same as this tier's `live`", so turning `live` on later brings them along; an admin can set each to on or off. Shipped tiers are `member` (no live), `creator` and `unlimited` (live). A tier without the capability answers `404 feature_off`, as `liveTierGate` does today.

## 4. Data

Every query below uses an index. Each story has a query-plan test that fails on `SCAN`.

### 4.1 `SEARCH_DB.live_stream_metadata`: the one upcoming model, shared with Epic 22

[E22](E22-notifications-sharing-circles.md) ([wiki #217](https://github.com/Al-Ummah-Now/AlUmmahNowWiki/pull/217), decision E22-D7; [AlUmmahNow#1819](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1819)) reads this table for the online events calendar. There is no second table, and no second list of event types: `LIVE_EVENT_TYPES` in `packages/shared-types/src/live-apps.ts` is the only one, and #1819 imports it.

```sql
CREATE TABLE IF NOT EXISTS live_stream_metadata (
  stream_id TEXT PRIMARY KEY,
  channel_id TEXT,
  owner_id TEXT,
  kind TEXT NOT NULL DEFAULT 'live' CHECK (kind IN ('live', 'premiere')),
  premiere_video_id TEXT,
  event_type TEXT CHECK (event_type IS NULL OR event_type IN ('jumuah', 'taraweeh', 'conference', 'halqa')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'hidden', 'deleted')),
  made_for_kids INTEGER NOT NULL DEFAULT 0,
  recording_withheld INTEGER NOT NULL DEFAULT 0,
  allow_chat INTEGER NOT NULL DEFAULT 1,
  chat_replay INTEGER NOT NULL DEFAULT 1,
  slow_mode_seconds INTEGER NOT NULL DEFAULT 0,
  subscribers_only INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER,
  scheduled_start_at INTEGER,
  started_at INTEGER,
  ended_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL DEFAULT 0,
  source_version INTEGER NOT NULL DEFAULT 0,
  -- kept by D1, never projected from R2:
  reminder_count INTEGER NOT NULL DEFAULT 0,
  heads_up_for INTEGER,
  purge_pending INTEGER NOT NULL DEFAULT 0
) WITHOUT ROWID;
```

Indexes: `(status, scheduled_start_at)`, `(event_type, status, scheduled_start_at)`, `(channel_id, status, scheduled_start_at)`, and partial `(premiere_video_id) WHERE premiere_video_id IS NOT NULL` and `(stream_id) WHERE purge_pending = 1`.

**Source of truth.** R2 `livestream:<id>` is. The table is a projection of it, except `reminder_count`, `heads_up_for` and `purge_pending`.

**Who writes it.** Only these, all beside the `content_ownership` write they already make:

1. `syncStreamInline` (every put and delete through `withSearchSync`);
2. `backfillOwnershipPage` for kind `stream`;
3. the stream branch of `lib/search/repairs.ts`.

**Order guard.** The upsert carries R2's version and has the same two guards as `ownershipUpsertStatement`: it is refused when `NOT_TOMBSTONED` fails for `own:stream`, and it applies only when `excluded.source_version >= live_stream_metadata.source_version`. A late page that read a stream before it was made private, or before it was deleted, changes nothing. An unchanged row at the same version is not rewritten.

**Never blocks the index.** `owner_id` and `channel_id` are nullable, dates fall back to 0, unknown enum values fall back to their default, so no stored stream can fail the batch that also writes its ownership row. A failed metadata write is recorded with `repairLater`, as ownership is.

**Wrapped everywhere.** E17-1 passes `withSearchSync(rawEnv, ctx)` to `sweepLiveSessions`. admin-api's one write of a stream record is the report fault in §2: E17-2b sends its hide and restore to api-videos (§5.2).

**Existing streams.**

- The migration seeds one row per `content_ownership` stream row, mapping `is_deleted`, `is_hidden` and `is_public` to `visibility` (`deleted`, `hidden`, `private`, else `public`), with `source_version = 0` so the first real write wins.
- `scheduled_start_at` is only in R2. The hourly cron checks `search_meta` key `live_meta:hydrated:v1`; when it is missing it calls `startOwnershipRebuild(env, 'stream', 'system')` and sets the key. That job is on main, is resumable and shows on the Errors page. No completeness marker is deleted, so lists keep using the index meanwhile.
- Until hydrated, a seeded row has `scheduled_start_at` NULL. #1819 includes NULL rows and reads the date from R2, so its calendar shows them. It skips streams with no channel, so those are never in the calendar.

### 4.2 `SEARCH_DB.live_chat_messages`

```sql
CREATE TABLE IF NOT EXISTS live_chat_messages (
  id TEXT PRIMARY KEY,
  stream_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  author_channel_id TEXT,
  author_name TEXT NOT NULL,
  author_handle TEXT,
  author_avatar TEXT,
  author_role TEXT CHECK (author_role IS NULL OR author_role IN ('owner', 'moderator')),
  text TEXT NOT NULL,
  offset_ms INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'held', 'removed')),
  held_by TEXT CHECK (held_by IS NULL OR held_by IN ('channel_block', 'moderation')),
  removed_by TEXT CHECK (removed_by IS NULL OR removed_by IN ('author', 'moderator', 'admin')),
  is_pinned INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) WITHOUT ROWID;
```

| Index | Serves |
|---|---|
| `(stream_id, status, created_at, id)` | latest page, `afterId`, `before` |
| `(stream_id, status, offset_ms, id)` | replay |
| `(stream_id, user_id, created_at)` | cooldown, duplicate check, the caller's own held messages |
| `(user_id, created_at, id)` | Takeout, erasure |
| `(status, updated_at) WHERE status IN ('held', 'removed')` | 30-day purge |
| `(stream_id) WHERE is_pinned = 1` | pinned message |

`offset_ms` is computed by the server: `now - actualStartTime`, or 0 before the start.

### 4.3 `NOTIFICATIONS_DB.live_reminders`

```sql
CREATE TABLE IF NOT EXISTS live_reminders (
  stream_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (stream_id, user_id)
) WITHOUT ROWID;
CREATE INDEX IF NOT EXISTS idx_live_reminders_user ON live_reminders (user_id, created_at);
```

No "sent" columns: the unique `(user_id, dedupe_key)` index on `notifications` is what makes sending idempotent (§5.5).

### 4.4 Deletion, erasure, export

- **A stream record is deleted** (owner delete, create rollback, account or channel erasure: every delete of a `livestream:` key in api-videos goes through `syncStreamInline`). Its row turns `visibility = 'deleted'`, `purge_pending = 1` at once, so nothing can be read, and the admin job `live.purge-streams` is kicked. The job deletes that stream's chat and reminders 500 rows at a time, clears the source video's `premiereHold` if it still names the stream (added in E17-3), then deletes the row. The row goes last, and the hourly cron kicks the job when any row waits, so a lost message or a failed step loses nothing. Failures show on the Errors page like every admin job.
- **Account erasure** deletes all of the person's chat rows and reminders, in bounded batches, and recounts nothing. Their streams go through the delete path above.
- **Takeout** exports both, paged by key until done (no row limit that truncates).
- **Retention:** a daily job deletes `held` and `removed` rows older than 30 days, 500 at a time, at most 20 batches a run.

Erasure and Takeout ship in E17-1, before anything can write a row.

## 5. Behavior and API

Success is `{ success: true, result }`. Errors use `apiError` (`apps/api-videos/src/lib/api-error.ts`, [O40](decisions.md#o40-server-written-error-messages)); each new code below is added to its catalogue in English and Arabic. New routes are added to the OpenAPI file and `feature-routes.ts`.

### 5.1 Streams

`POST` and `PATCH /api/live-streams/:id` accept these new optional fields: `eventType`, `madeForKids`, `allowChat`, `chatReplay`, `slowModeSeconds` (0, 5, 10, 30, 60), `subscribersOnly`. `kind` and `premiereVideoId` are never accepted here; a premiere is created with its own route (§5.4).

`GET /api/live-streams` keeps its present rules (owner and `live.manage` members see private and hidden streams; VR9 recordings are withheld) and gains `kind` and `eventType`. With either filter it reads ids from `live_stream_metadata` and then re-checks every loaded record with the same `isListed` function.

`premiereVideoId` is given to others only while the premiere is `live` or `ended` (a cancelled one's video is private again). `PublicLiveStream` gains: `kind`, `premiereVideoId`, `eventType`, `madeForKids`, `chatReplay`, `slowModeSeconds`, `subscribersOnly`, `durationSeconds`, `reminderCount`. `premiereHold` and all review fields stay private.

`GET /api/live-streams/:id/state` keeps every field it returns today (`streamId`, `sessionId`, `status`, `sessionStatus`, `receiving`, `playbackUrl`, `vodUrl`, `startedAt`, `endedAt`, `bitrateKbps`, `provider`, `qoe`, `viewers`, `serverNow` in milliseconds) and adds:

```json
{
  "kind": "live",
  "eventType": "jumuah",
  "premiereVideoId": null,
  "durationSeconds": null,
  "scheduledStartTime": "2026-11-27T12:00:00.000Z",
  "canModerate": false,
  "chat": { "enabled": true, "replay": false, "slowModeSeconds": 10, "subscribersOnly": false, "canPost": true },
  "reminder": { "enabled": true, "count": 34, "set": false }
}
```

`chat.enabled` is false when the switch is off, the stream is `madeForKids`, `allowChat` is false, or the owner's tier has no chat. `eventType` is null when `liveEvents` is off.

### 5.2 Live chat

**Who may read.** Anyone who may see the stream (`visibility = 'public'` and its recording not withheld by VR9, or its owner, or a member with `live.manage`, `live.moderate` or `comment.moderate`), when `allow_chat = 1` (scheduled, live) or `chat_replay = 1` (ended) and `made_for_kids = 0`. Signed-out viewers may read public streams. A banned member reads like a visitor. Reading fails closed when the stream row is missing.

**`GET /api/live-streams/:id/chat`**

- **Latest** (no cursor, or `afterId`). One snapshot per stream is cached with `lib/edge-cache.ts` for 2 seconds: the last 100 published messages in `(created_at, id)` order, the pinned message, and the stream's `visibility`, `status`, `madeForKids`, `allowChat`, `chatReplay`. It is used only when that stored state says anyone may read, and any write that closes the stream drops it (here; elsewhere it lives 2 seconds at most). The key has no `afterId`, so everyone shares it. `afterId` is sliced from the snapshot; when it is older than the snapshot the server looks up that row's `created_at` and reads forward by `(created_at, id)`; when the row is gone it answers the latest page with `resync: true`.
- **Older** (`before=<id>`, limit 50): the row's `(created_at, id)` is the anchor, so two messages in the same millisecond are never skipped.
- **Replay** (`fromMs`, `toMs`, at most 60 s apart, limit 200), only when `ended`. The answer has `truncated: true` when the limit cut it.
- A signed-in caller who is blocked on the channel also gets their own `held` messages: a second query on `(stream_id, user_id, created_at)` from the oldest message in the page, merged in code.
- Response header `Cache-Control: private, no-store`.

```json
{ "success": true, "result": { "messages": [ {
  "id": "lcm_1", "streamId": "ls_123", "userId": "u_2", "authorName": "Ahmad", "authorHandle": "ahmad",
  "authorAvatar": null, "authorRole": null, "text": "السلام عليكم", "offsetMs": 45200, "isPinned": false,
  "createdAt": "2026-11-27T12:00:50.200Z" } ],
  "pinned": null, "resync": false, "hasMore": false } }
```

**`POST /api/live-streams/:id/chat`** `{ "text": "…" }`, checks in this order:

1. switch, sign-in, `videosBanMiddleware`, the per-person limit (4), `requireHuman('videos.live_chat', 'first')`;
2. the stream can be read by this caller, is `live`, or `scheduled` with the start at most 30 minutes away; the owner's tier has chat;
3. `subscribersOnly`: the owner, moderators, and people in `channel_subscriptions` (`403 live_chat_subscribers_only`);
4. rate limits: two new bindings in every environment, `LIVE_CHAT_LIMITER` (30 per 60 s, per user, through `edgeRateLimit`) and `LIVE_CHAT_IP_LIMITER` (120 per 60 s, key `live-chat:<ip>`, called separately because `edgeRateLimit` keys a signed-in caller by user). They are separate from comments, and the second is loose so a mosque on one address can chat;
5. the fast filter (below);
6. **one** `INSERT … SELECT … WHERE NOT EXISTS (message by this user on this stream newer than now − cooldown) AND NOT EXISTS (same text within 30 s)`. Cooldown: 2 s, or slow mode when longer; 1 s for the owner and moderators. Nothing inserted: `429 live_chat_slow_mode` with `retryAfter`, or `429 live_chat_duplicate`;
7. a blocked author's message is stored `held` / `channel_block`, answered `201` as usual, and goes nowhere else;
8. otherwise the snapshot is dropped, `live_chat_message` is broadcast, and a scan is queued.

Success is `201` with `result.message` in the shape above.

**Fast filter** (`checkLiveChatText` in shared-types). Text is normalized with the processor's `normalizeText`, which E17-1 moves to shared-types (`normalizeModerationText`) so there is one normalizer. Then:

- links, including bare domains, are refused unless the author is the owner or a moderator (`400 live_chat_link`);
- a short list of slurs is matched against **whole tokens only**: Latin with word boundaries; Arabic by splitting on every non-letter and comparing the token after removing one allowed prefix or suffix from a fixed list. Never a substring (`400 live_chat_blocked_word`).

Must-pass test strings, among others: «وَلَا تَمُدَّنَّ عَيْنَيْكَ», «من حسن إسلام المرء تركه ما لا يعنيك», «قرة عينيك», «هذا يعكس إمكانيات الأمة», «ميكانيكي», «تكنيك», «يونيكود», and a fixed list of verses and hadith in which the letters of a listed word occur inside a longer word.

**AI scan.** `surface: 'live_chat'`, `subjectId` the message, `parentId` the stream, `event: 'create'`, through the existing `MODERATION_QUEUE`.

- The consumer writes a `moderation_signals` row, as for comments. It does **not** hide the message: main has no AI auto-hide, and E17 does not add one. A person hides it from the AI queue, the Reports queue, or the chat.
- `live_chat` takes at most a share of the daily neuron cap (admin setting, default 25 %, no share limit when there is no cap). The scan reserves `feature = 'live_chat'` first, then `moderation`; when the second fails the first is released with `settleBudget(estimate, 0)`. Past either limit: signal `skipped` / `budget`, message stays.
- Consequence, stated plainly: at 22–62 neurons a message (§8) and the default cap of 10,000 neurons a day (`DEFAULT_DAILY_NEURON_CAP`), the share scans about 40 to 110 messages a day for the whole site. An admin can raise the cap or the share. Beyond that, chat relies on the fast filter, slow mode, blocks, reports and people. A creator with no moderator should use subscribers-only or slow mode.
- `SURFACES` in `consumer.ts`, `ModerationSurface`, `ModerationSubjectType` and the admin-api and admin-web lists all gain the value in E17-2, with a test that every `ModerationSurface` is accepted.

**Moderation.** `POST /:id/chat/:messageId/moderate` `{ "action": "remove" | "restore" | "pin" | "unpin" | "block_author" }` for the owner, `live.manage`, `live.moderate` or `comment.moderate`. An author may `remove` their own message, and nobody else can bring that back. `block_author` uses `channel_blocks` and removes that person's messages on the stream; the team cannot be blocked. Site moderators act from the admin queues (below). `PATCH /:id/chat/settings` is `allowChat`, `chatReplay`, `slowModeSeconds` and `subscribersOnly` for the owner, `live.manage` and `live.moderate`.

**Reports.** `POST /api/moderation/reports` with `entityType: 'live_chat'` and the existing reasons (`inappropriate`, `spam`, `harassment`, `copyright`, `misinformation`, `other`). It answers `404 feature_off` while `liveChat` is off or unreadable, and `404` unless the message is published and the reporter may read that chat now. The text, stream, channel and author go with the report when it is filed, because deleting a stream deletes its messages; the queue archive drops the text and pseudonymizes the author. Account erasure ([#1875](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1875)) takes the reported person out of every report: their id and name, the title or text of what was reported, their own channel's name, and their id on a ban decision. Nothing puts them back: admin-api's lookup drops people listed in `erased_users`, for rows not filled yet, for refreshes and for the queue page, and reads nothing back while that list cannot be read. A comment or chat message never takes another author, even after that list is purged at 30 days. admin-api migration `0051_reports_live_chat.sql` adds the type to `reports`.

**Decisions.** On `live_chat` and `livestream`, admin-api calls an internal api-videos route over the existing `VIDEOS` service binding, which fixes the report fault in §2. A removed or restored message drops the shared 2-second page. A stream an admin hides or deletes ends whatever its status, with any session still open, and a premiere is cancelled or ended. While it is hidden or deleted, `/ingest`, `/start` and `PATCH` to `live` answer `403 live_stream_removed`; the encoder's uploads get `410`, because the session has ended, and the stream never turns live.

**AI queue** (E17-4, [#1869](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1869)). A `live_chat` row shows the message and leads to its channel. Message text is not searchable there: the table grows without bound, a `LIKE` over it would be a full scan, and a text index would cost extra writes on every message. Search by message, author or channel id, author name and channel name works.

### 5.3 WebSocket `live:<streamId>`

In `apps/websocket-server`:

- `CHANNEL_FEATURES` gains `{ prefix: 'live:', key: 'liveChat', failClosed: true }`. Today an unreadable switch allows the channel; for `live:` it refuses.
- `canPublish` returns false for `live:`. Only `/broadcast` (internal key) feeds it. Today any signed-in client can publish into it.
- Subscribe is allowed only after one indexed read of `live_stream_metadata`, with the read rule of §5.2; a non-public stream also needs a `channel_access` role. A missing row refuses. Signed-out sockets may subscribe to public streams.
- `live_chat_closed` evicts everyone on the channel after it is delivered. `syncStreamInline` sends it on every write that leaves the stream private, hidden, cancelled or deleted, or its chat off, so a suspension or an erasure closes it too. Clients that may still read subscribe again.
- The row is read again after the socket has joined, so a close that came in between is not missed.
- A ban, or a channel role taken away or lowered, sends `access_changed` on `user:<id>`: that person's sockets leave every live chat, and join again those they may read. A banned member cannot join a chat that is not public.
- `expireAuthIfNeeded` keeps `live:` only for public streams; others are dropped when the token expires.
- Authentication is whatever the socket uses: the access token today, the single-use ticket once [#1803](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1803) merges. E17 needs nothing from either.

Frames use the standard envelope `{ type, channel, timestamp, data: { type, streamId, … } }`: `live_chat_message` (`message`), `live_chat_removed` (`messageId`, and `userId` when everything that person wrote is removed), `live_chat_pinned` (`message` or null), `live_chat_settings` (`settings`), `live_chat_closed`.

Clients use the socket. They poll `GET /chat?afterId=` only while it is disconnected: every 10 s ± 2 s while live, 30 s while scheduled, never in the background, backing off to 60 s on errors.

### 5.4 Premieres

A premiere plays a video that is already uploaded, at a set time, to everyone at the same position. It has no live provider session and no new transcode.

**The video is held by one field.** `POST /api/videos/:id/premiere` sets on the video record:

```ts
premiereHold?: { streamId: string; heldAt: string; heldBy: string }
```

and `isVideoReleased()` (shared-types `video-visibility.ts`) returns false while it is set. That one function is behind `isVideoOpenToAnyone`, `isVideoPubliclyVisible` and `isVideoMediaPublic`, so the hold applies to lists, search, sitemap, playback, embeds, captions, public play, notifications, and the R2 prefix (media stays under `priv/`). Scheduled publishing (`scheduledPublishStatus`, `scheduledPublishDate`, the `SCHEDULED_VIDEOS` bucket and the `scheduler` Worker) is **not used**. Nothing else on the video changes: it stays private, a draft stays a draft, and the start time lives only on the stream.

Surfaces that do not go through those functions get an explicit test. Known today: `GET /api/videos/:id/chapters`, fixed in E17-3. Epic 14's `/audio` and `/downloads` routes are not on main; whoever adds them must use `videoReadAccess`.

**Scheduling** `POST /api/videos/:id/premiere` `{ scheduledStartTime, title?, description?, eventType?, allowChat?, chatReplay?, slowModeSeconds?, subscribersOnly? }`. Needs `livePremieres`, `video.schedule` on the video and `live.manage` on its channel, and the tier. Refused when:

| Condition | Code |
|---|---|
| no channel, a Short, `duration` missing or 0 | `400 premiere_video_unsuitable` |
| `!isVideoReady(video)` or `isVideoRemoved(video)` | `409 premiere_video_not_ready` |
| the video is public or unlisted (`isOpenByLink`) | `409 premiere_video_already_open` |
| `scheduledPublishStatus` is `scheduled` or `publishing` (it has a `scheduledPublishDate` and an entry in `SCHEDULED_VIDEOS`): cancel that schedule first | `409 premiere_video_scheduled` |
| it already has a hold | `409 premiere_exists` |
| `scheduleDateProblem()` (5 minutes to 365 days) | `400 premiere_bad_time` |

Order: the hold is written first (conditional write, all checks repeated inside it), then the stream record (`kind: 'premiere'`, `premiereVideoId`, `durationSeconds`, `status: 'scheduled'`). If the second write fails the hold is cleared. A draft is allowed; so is a private video.

**While held**, these answer `409 premiere_scheduled`: schedule create and update, publish-now, and any visibility change by `PUT /api/videos/:id`, bulk edit (reported per video), the upload and import schedulers (`scheduleRefusal` gains the case) and the admin video edit. The check runs inside each conditional write. Even if one were missed, the hold still keeps the video closed, and `publishVideo` in the `scheduler` Worker returns `'cancelled'` for a held video. Title, description, thumbnail and captions stay editable.

A hold whose stream no longer exists, or is cancelled or ended, is **stale**: the same checks clear it and go on, so a lost stream record can never lock a video.

**Where it runs.** In **api-videos**, in the every-minute cron, with `withSearchSync(rawEnv, ctx)`. That Worker has `SEARCH_DB`, `NOTIFICATIONS_DB`, `videos` and the media bindings, and its wrapped bucket is the only one that calls `syncStreamInline` and `onVideoWritten`. The `scheduler` Worker has none of these and takes no part.

**Start** (cron: `status = 'scheduled' AND scheduled_start_at <= now`, premieres only; or the owner's `POST /api/live-streams/:id/start`):

1. Load the video. Not the same channel, removed or rejected, or no longer held for this premiere: cancel (below), and the owner is notified (E17-3a). Not ready yet (processing, `checking`, `in_review`, `appealed`), or the switch is off: leave it scheduled and try again next minute; after 60 minutes cancel.
2. **Claim:** one conditional write on the stream, `scheduled → live` with `actualStartTime`, refused unless the fresh copy is still `scheduled` and due. Only the writer that wins goes on, so it happens once.
3. **Release:** one conditional write on the video, only if `premiereHold.streamId` is this stream: delete `premiereHold`, `isPublic = true`, `isDraft = false`, and `publishedAt` through `markPublished`. The wrapped bucket then updates search and queues the media move (`onVideoWritten`). Until the move finishes, playback is signed from the private prefix, as for any video just made public.
4. **Announce:** `announceLiveStarted`, then reminders (§5.5). `announceNewVideo` is not sent: one notification per premiere.

A crash after step 2 is repaired on the next minute: a live premiere whose video still has this hold, or whose `announcedAt` is not on the stream yet, repeats steps 3 and 4. Both are idempotent (notifications and social posts de-duplicate per stream), and `announcedAt` is written last.

**During.** `state.playbackUrl` is null for a premiere. Clients play `premiereVideoId` with the normal `GET /api/videos/:id/playback`, so signing, provider failover and QoE are the same as for any video. Position is `(serverNow - startedAt)`; the player seeks there, offers no seeking ahead, and re-syncs when it drifts more than 3 seconds.

**End.** The cron ends it when `startedAt + durationSeconds` has passed, or the owner ends it, or the video is no longer open to anyone. The stream becomes `ended`; there is no `vodUrl` and no second review, because the recording is the video itself. The page stays at `/live/<streamId>` with the normal player and chat replay.

**Cancel, reschedule, swap.**

- *Cancel* (`PATCH` with `status: 'cancelled'`): the stream is cancelled by a conditional write that only succeeds from `scheduled`, then the hold is cleared. The video is exactly as it was before: private, draft or not. Taking the hold off writes that state (not public, a draft if it was one), so a write that slipped past a guard cannot open it. Undoing an older bulk edit leaves a held video's visibility alone. If the start claimed first, cancel answers `409 premiere_started`.
- *Delete* (`DELETE`): a scheduled premiere is cancelled first, in the same way; a running one answers `409 premiere_started` (end it first); an ended or cancelled one is deleted, and its video is not touched.
- *Reschedule* (`PATCH` with `scheduledStartTime`): only the stream changes; same date rules; only while `scheduled`. The heads-up re-arms by itself (§5.5).
- *Swap* (`PATCH /api/live-streams/:id/premiere` `{ videoId }`): only while `scheduled`. All scheduling checks run on the new video, then: hold the new video, conditional write on the stream (`premiereVideoId`, `durationSeconds`), clear the old hold. A failed stream write clears the new hold.
- `PATCH` with `status: 'live'` or `'ended'` on a premiere is refused; `kind` never changes.

**No live session.** `attachSession` is not called for a premiere. `GET /:id/ingest` answers `409 premiere_no_ingest`. `POST /:id/start` and `/:id/end` branch before any session code. Premieres use no live hours and no concurrency.

**Deleting the video** while held cancels the premiere, whoever does it: every write in api-videos that removes a held video passes the search-sync wrapper, which cancels. Any other path is caught at the start check. Video deletion is a 30-day soft delete, and restoring the video does not bring its premiere back. A video deleted while its premiere runs ends the premiere at the next minute.

**The premiere page is `/live/<streamId>`**, before, during and after. #1819 currently links to `/video/<premiereVideoId>`, which is a 404 before the start; it must use `/live/<streamId>`.

### 5.5 Reminders

- `POST` and `DELETE /api/live-streams/:id/reminders` (signed in; public, scheduled streams of a channel, not `madeForKids`; a premiere only while premieres are on). `INSERT OR IGNORE` / `DELETE`; `reminder_count` changes only when a row did. Answer `{ "set": true, "count": 35 }`. The count is corrected from `live_reminders` when the heads-up is sent.
- **Heads-up, 15 minutes before.** The api-videos minute cron finds public scheduled streams starting in the next 15 minutes and claims each with `UPDATE … SET heads_up_for = scheduled_start_at WHERE stream_id = ? AND scheduled_start_at = ? AND heads_up_for IS NOT scheduled_start_at`. Everything is read before the claim, the winner queues the fan-out, and if queueing fails it puts the old value back. A new time makes the two differ again, so a reschedule needs no extra code. Streams set up less than 15 minutes ahead get it at once. For a premiere the start checks run first, so a dead premiere never reminds.
- **Live now.** `markStreamLive` and the premiere start already call `announceLiveStarted`. When its last page is done, the processor queues the same event for reminders. They run one after the other, never together, because they share the dedupe key `live:<streamId>` and two fan-outs in flight could push the same row twice. Reminders exist only for streams of a channel.
- The processor's `NotificationFanoutPayload` gains `audience: 'subscribers' | 'reminders'` and kind `live_soon` (key `liveSoon`, dedupe `live-soon:<streamId>:<scheduledAtMs>`). Reminder pages read `live_reminders` by primary key, 1,000 a page. Social announcements are sent for subscribers only.
- **Settings and quiet hours.** Category `live`: a person who turned it off gets nothing. Push goes through `enqueuePush` and `dispatchPush` only, so E22 quiet hours and prayer windows ([#1816](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1816)) apply the moment that PR merges, with no E17 code: inside a quiet window the notification is in the inbox and makes no sound.
- **Checked on every page.** Each fan-out page for reminders checks again, before it sends: `liveReminders` is on, `livePremieres` is on when the stream is a premiere, and the stream still qualifies: `visibility` is `public`, `made_for_kids` is 0, and `status` is `scheduled` with the same `scheduled_start_at` for the heads-up, or `live` for the start. So cancelled, moved, private, hidden and deleted streams send nothing, and neither does a switch turned off half way. It fails closed: when a switch or the row cannot be read, the page sends nothing and the queue tries it again.
- **Calendar file:** `GET /api/live-streams/:id/calendar.ics`, using `buildEventsIcsFeed` from #1819. Story E17-3b, after #1819. There is no second iCalendar builder; the one in the first version of #1787 is removed.

### 5.6 Kids

There is no Kids Mode and no kids app ([O45](decisions.md#o45-no-in-app-kids-mode-support-the-systems-parental-controls)), so there is no Kids session or client for live chat to refuse. What remains:

- **Content made for kids:** `made_for_kids` is stored on the stream when it is written: the creator's `madeForKids`, or the premiere video's `importedFrom.madeForKids`. Chat, replay and reminders are off for it, for everyone, over HTTP and the socket, from that one stored flag.

## 6. Platforms

English and Arabic with right-to-left layout everywhere; `٠–٩` through the shared formatter; «مرئي/مرئيات» for video; «،» for commas; no browser dialogs; nothing about a feature that is off.

Labels: **Jumu'ah** / **الجمعة**, **Taraweeh** / **التراويح**, **Conference** / **مؤتمر**, **Halqa** / **حلقة علم**.

| Platform | What it needs |
|---|---|
| **Web viewer** | Chat panel, pinned message, slow-mode timer, sign-in prompt, report, moderator menu, replay chat; premiere countdown and synced playback; reminder button; event badges and filter; return-to-live. |
| **Web Studio** | Schedule a premiere from a video (search box opens with eligible videos), reschedule, swap, cancel; event type; chat settings. A held video shows "Premiere, date" and its visibility controls are replaced by a link to the premiere. |
| **Admin** | Four switches, three tier fields, live-chat share of the AI cap, `live_chat` in AI moderation and Reports, live and its choices named in the tier change log. |
| **Apple, Android, Desktop** | Live list, watch, chat, premiere, reminder, replay, against the merged server. TV: watch, premiere and reading chat only. |

Native starts after E17-2 and E17-3 are merged. The first native PRs (Apple #82, Android #56, Desktop #75) were written against routes that do not exist and are closed; their replacements are E17-6 to E17-8.

## 7. Roadmap stories

| Story | Status |
|---|---|
| **17.1** Live watch, viewer count, DVR | Web watch and viewer count on main. Seek-back is not: the self-hosted playlist lists only 4 to 6 segments (`lib/live/providers.ts`, `hls_list_size`), though every segment is kept in R2 and indexed in `live_segments`. E17-9 serves a longer playlist from that index. |
| **17.2** Moderated chat | Server done (E17-2, E17-2b), then clients. |
| **17.3** Premieres, scheduled streams, reminders | Server done (E17-3, E17-3a) except `calendar.ics` (E17-3b, waits for [#1819](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1819)), then clients. Shares `live_stream_metadata` with E22. |
| **17.4** Event streams | Server done (E17-1, E17-3c), then clients. |
| **17.5** Recordings | Server recording and review on main. Chat replay is E17-2. |

## 8. Cost

Prices: D1 $1.00 per million rows written, $0.001 per million read; Workers $0.30 per million requests; Queues $0.40 per million operations; Durable Objects $0.15 per million requests; Workers AI $0.011 per 1,000 neurons. No fixed monthly cost is added.

| Work | Unit | Operations | Cost |
|---|---|---|---|
| Chat message posted | per million | 5 rows written (row + 4 full indexes; a published message is in neither partial index), about 10 rows read, 1 Worker request, 3 or more Durable Object requests, 3 queue operations | about $7 |
| …AI scan of each | per million | 22–62 neurons each (guard 22, +2 Arabic translation, +22 when mixed script, +15 with platform categories) | $240–$680, held down by the daily share: 2,500 neurons at the default cap is $0.03 a day |
| Polling, signed out | 1,000 viewers for an hour | 360,000 requests, no D1 on a cache hit; per location 1,800 refreshes × about 102 rows = 184,000 rows read | $0.11 |
| Polling, signed in | same | + 1 row read per poll (channel block) and the existing per-request account checks | $0.11 |
| WebSocket subscribe | per million | 1–2 rows read | under $0.01 |
| Reminder set | per million | 3 rows written | $3 |
| Reminder sent (both) | per million people | about 8 rows written each: notification with its indexes and the pushed mark; queue work is per 1,000-person page | about $16 |
| Minute cron | per month | 4 indexed queries a minute, a handful of rows each | under $0.01 |
| Premiere | each | no transcode, no live session; delivery as a normal video | delivery only |
| DVR playlist (E17-9) | per stream-hour per location | one read every 2 s of up to 900 segment rows = 1.6 million rows | $0.002 |

## 9. Stories and dependencies

| Story | Repo | Scope | Waits for |
|---|---|---|---|
| **E17-1** ([#1787](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1787)) | AlUmmahNow | Switches, tier fields, shared types, filter and normalizer, three tables, projection with order guard, hydration, wrapped live sweep, erasure, Takeout | nothing |
| **E17-2** ([#1841](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1841), landed through #1842) | AlUmmahNow | Chat routes, limits, socket rules, moderation, replay, AI scan with its share | E17-1 |
| **E17-2b** ([#1858](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1858)) | AlUmmahNow | Reports (`live_chat`) and admin decisions, the report fault on live streams, 30-day purge | E17-2 |
| **E17-3** ([#1842](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1842)) | AlUmmahNow | Premieres, chapters fix | E17-2 |
| **E17-3a** ([#1845](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1845)) | AlUmmahNow | Reminders, and the owner's notice when a premiere is cancelled by the system | E17-3 |
| **E17-3b** | AlUmmahNow | `calendar.ics` | E17-3a and #1819 |
| **E17-3c** ([#1863](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1863)) | AlUmmahNow | Event tags and the `kind` / `eventType` filters | E17-3 |
| **E17-4** ([#1869](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1869)) | AlUmmahNow | Admin | E17-2b, E17-3 |
| **E17-5** | AlUmmahNow | Web viewer and Studio | E17-2, E17-3 |
| **E17-6/7/8** | Apple / Android / Desktop | Native | E17-2, E17-3 |
| **E17-9** | AlUmmahNow | Longer playlist for seek-back on the self-hosted edge | E17-1 |

Open PRs that touch the same ground, none of which E17 needs first: #1803 (tickets), #1819 (E22 calendar), #1816 (quiet hours). Changes #1819 must make: `/live/<streamId>` for premieres, import `LIVE_EVENT_TYPES`, and expect `visibility` in SQL.

## 10. Tests

- **Plans:** no `SCAN` for any query on the three tables, including erasure, purge and the cron queries.
- **Projection:** an older version never overwrites; a deleted stream is never restored; a record with no owner, channel or dates still indexes; the seed keeps private private; an idle-ended stream turns `ended` in both tables.
- **Filter:** the must-pass strings; zero-width and tatweel tricks; bare domains.
- **Chat:** parallel posts against one cooldown give one message; same-millisecond paging; deleted anchor; blocked author sees only their own; `subscribersOnly`; 120 posts from one address by many users pass and the next does not; switch off is 404 and private is 404.
- **Socket:** client publish refused; private, cancelled, kids and missing streams refused; eviction; unreadable switch refuses; a ban or a lost role removes open sockets; a close during a subscribe is not missed.
- **Premiere:** each refusal; draft and private sources; every write listed under "While held" refused; a held video is 404 for others on video, playback, public play, embed, captions and chapters, absent from search and sitemap, and under `priv/`; two crons start it once; crash after the claim is repaired; cancel against start; reschedule; swap; stale hold; deleted or rejected video; old schedule entry; no session rows created.
- **Reminders:** one heads-up per time; reschedule sends again; bell and reminder together give one notification and one push; category off; quiet hours (once #1816 is on main).
- Every test seeds and deletes its own rows. AI is mocked.
- **Screens:** production build, English and Arabic, light and dark, desktop and phone, in `review-shots/E17/`.

## 11. Legal and safety

Signed-in posting only. Bans, blocks, reports with reasons, removal by moderators, 30-day purge of held and removed messages, export and erasure (§4.4). No chat on content made for kids. Links only from the owner and moderators. Chat text is never sent to a third party; the scan runs on Workers AI.

## 12. Owner decisions

Built to the recommendation; the owner can change any of them.

| ID | Question | Options | Recommendation and why |
|---|---|---|---|
| **E17-D1** | How long is chat kept? | A: with the recording, held and removed purged after 30 days. B: all purged 30 days after the stream. C: moved to a file after 7 days. | **A.** Replay and later moderation work; same 30-day rule as elsewhere. |
| **E17-D2** | Pace limits | A: 2 s per person, optional slow mode, 30 a minute per person, 120 a minute per address. B: 10 s slow mode always. C: none. | **A.** Stops floods; a mosque on one address can still chat. |
| **E17-D3** | Who may post | A: any signed-in person in good standing, with a subscribers-only option. B: accounts over 24 hours old. C: guests too. | **A.** Guests cannot be moderated; B blocks someone who joins for tonight's class. |
| **E17-D4** | AI in chat | A: fast filter before, AI signal after, up to 25 % of the daily AI cap, people hide. B: hold every message for the AI (1–4 s). C: no AI. | **A.** Immediate, and cannot use up the site's AI allowance. It does not replace a moderator: see §5.2. If Epic 28 gains auto-hide, chat follows its policies. |
| **E17-D5** | Links | A: owner and moderators only. B: everyone. C: no one. | **A.** Links are the usual way chat is abused. |
| **E17-D6** | Reminder times | A: 15 minutes before and at the start. B: start only. C: each person picks. | **A.** One tap, honors settings and quiet hours. |
| **E17-D7** | Event tags | A: four fixed tags. B: free text. C: admins only. | **A.** Translated and filterable; shared with E22. |
| **E17-D8** | Seek-back window while live | A: 2 hours. B: 30 minutes. C: whole stream. | **A.** Covers a lecture; the playlist stays small. |

## 13. Sources

[D2](D2-video-delivery.md), [D3](D3-live-provider.md), [LIVE-PHASES](LIVE-PHASES-live-streaming-phases.md), [AUN-FEATURES](AUN-FEATURES-feature-switches.md), [CHAT-CREATOR-TIERS](CHAT-CREATOR-TIERS-creator-tiers.md), [AUN-VIDEO-REVIEW](AUN-VIDEO-REVIEW-pre-publication-review.md), [E13](E13-native-players.md), [E14](E14-offline-listen.md), [E20](E20-system-parental-controls.md), [E22](E22-notifications-sharing-circles.md), [E28](E28-ai-moderation.md)
