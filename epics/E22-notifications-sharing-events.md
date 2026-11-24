[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 22: Notifications, sharing, App Clips / Instant Apps, and event calendar

| | |
|---|---|
| **ID** | `E22` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (`shared-types`, `api-videos`, `admin-api`, `admin-web`, `web`, `processor`, `short-links`), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **in progress** (spec refreshed & all owner decisions resolved 2026-11-23; partial foundation from Epics 9, 25, and 29 is live — see [§2](#2-what-exists-today-and-what-is-in-flight-in-epic-17--epic-21)) |
| **Last updated** | 2026-11-23 |
| **Depends on** | [Epic 9](E09-native-platform-foundations.md), [Epic 17](E17-live-in-apps.md) ([AlUmmahNow#1787](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1787) & [AlUmmahNow#1842](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1842) — merged, plus [AlUmmahNow#1845](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1845) in review for `/api/live-streams/:id/reminders`), [Epic 21](E21-islamic-experience.md) (`21.1` on-device prayer-time calculation for prayer quiet windows), [AUN-FEATURES](AUN-FEATURES-feature-switches.md), [CHAT-CREATOR-TIERS](CHAT-CREATOR-TIERS-creator-tiers.md) |
| **Linear** | AUN-380 (Linear tracks 3 high-level capability issues — AUN-381, AUN-382, AUN-384, with AUN-383 folded into [Epic 17](E17-live-in-apps.md) — split here into 10 one-PR stories `E22-S1`–`E22-S10`) |

> **Owner decisions (2026-11-23 — all decided):**
> 1. **No separate group-watch subsystem (formerly 22.3):** Asked who hosts group watch sessions, the owner ruled: *"it's a live video with chat, why make it special."* Separate synchronized VOD rooms (`WEBSOCKET_DO` rooms, dedicated room tables, `user_blocks`, `/g/<id>` short links, and decisions `E22-D1`–`E22-D5` / `E22-D9`) are **dropped**. Watching and discussing together is a **live stream or premiere with moderated live chat** in **[Epic 17](E17-live-in-apps.md)** (`17.1`–`17.4`, optionally carrying the plain `event_type = 'halqa'` label).
> 2. **[`E22-D6`](#10-owner-decisions) — Quiet hours (22.1):** Keep it simple behind the `quietHours` feature switch (default off): **one daily quiet window** per user (`22:00`–`06:00` default) plus **one optional "quiet during prayer times" toggle** computed on-device using [Epic 21](E21-islamic-experience.md)'s local prayer-time library once `21.1` lands (hidden until `21.1` supplies windows, re-synced daily or on timezone change, and ignored server-side if older than 7 days). During quiet hours, optional notifications are not pushed and wait in the inbox; `account` and security notices always come through; no summary push afterwards.
> 3. **[`E22-D7`](#10-owner-decisions) — Event calendar (22.4):** **Online events only** (scheduled live streams, premieres, and halqas with reminders; **no in-person venues**). **One "upcoming" model shared with [Epic 17](E17-live-in-apps.md), not two** — Epic 22 introduces zero duplicate `channel_events` or `event_reminders` tables.
> 4. **[`E22-D8`](#10-owner-decisions) — App Clips & Google Play Instant Apps (22.2):** **Yes, build them once the store accounts are set up.** Spec scope, size limits, signing, and store requirements now ([§4.3](#43-app-clips-ios-and-google-play-instant-apps-android)), build everything that does not require store accounts now, and list the exact owner setup checklist ([§4.4](#44-owner-setup-checklist-for-store-accounts-and-associated-domains)).

---

## 1. Goal

Close the remaining gaps in **notifications** and **sharing** without rebuilding anything already live or duplicating [Epic 17](E17-live-in-apps.md), prepare **App Clips & Google Play Instant Apps** up to the store-account boundary, and deliver the **Event Calendar** across web, admin, and native apps:

1. **Notifications & quiet hours (22.1 gaps only):** Keep the live notification center, category toggles, Web Push, and native push senders (`APNs`, `FCM`, `WNS`). Add **quiet hours and prayer-time quiet windows** (`notification_quiet_hours`, behind the `quietHours` switch, storing zero GPS coordinates or city names on the server), enforce them in `dispatchPush`, localize inbox `notificationKey` rows across native clients, and wire native push registration where account auth exists (`AlUmmahNowCore#40`).
2. **Sharing, short links, & App Clips / Instant Apps (22.2 gaps only):** Keep `alummahnow.link`, web share dialogs, Open Graph cards, and dynamic `apple-app-site-association` / `assetlinks.json` on the videos host. Add `/e/<streamId>` live/event short links, serve `/.well-known/apple-app-site-association` (including `"appclips"`) and `/.well-known/assetlinks.json` on `alummahnow.link` (`apps/short-links`), parse `alummahnow.link` + `?t=` + `?list=` + `/e/` in native `AppLink`, add shared Rust `short_link_for` (`AlUmmahNowApple#31`, `AlUmmahNowAndroid#20`, `AlUmmahNowDesktop#39`), and build the store-ready App Clip (`AUNViewerClip`) and Play Instant (`:viewer-instant`) playback modules with real CI binary size assertions.
3. **Live watch & live chat (formerly 22.3 → [Epic 17](E17-live-in-apps.md)):** Handled entirely by [Epic 17](E17-live-in-apps.md) (`17.1`–`17.5`). Epic 22 builds zero circle tables or realtime rooms; `halqa` survives strictly as a plain `event_type` label/filter chip on live streams.
4. **Event calendar (22.4, unified with [Epic 17](E17-live-in-apps.md)):** A viewer-facing **Event Calendar** (`/events`, Channel upcoming strip, native Events screens, and bilingual English/Arabic multi-event RFC 5545 `.ics` feeds) over the **single upcoming online-events model**, with Gregorian + Hijri dates.

Both new user-facing capabilities — **`quietHours`** and **`eventCalendar`** — sit behind independent feature switches on the Videos Admin **Features** page ([AUN-FEATURES](AUN-FEATURES-feature-switches.md)), default **OFF**, answer `404 {"success": false, "code": "feature_off"}` when off, and are completely invisible while off ([Product rules → Hidden when off](../guides/product-rules.md#hidden-when-off)). Creating scheduled live streams, premieres, and event tags (`jumuah`, `taraweeh`, `conference`, `halqa`) uses the admin-managed creator tier flags (`live`, `livePremieres`, and `liveEvents`, shipped in [AlUmmahNow#1787](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1787) and [AlUmmahNow#1842](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1842) on `member` / `creator` / `unlimited` and custom tiers) from [Epic 17](E17-live-in-apps.md).

---

## 2. What exists today (and what is in-flight in Epic 17 / Epic 21)

Nothing listed as **Live** below is rebuilt; in-flight Epic 17 and Epic 21 pieces are explicitly marked so Epic 22 degrades cleanly before they land on `main`.

| Area | Status today | File paths | Gap Epic 22 builds |
|---|---|---|---|
| In-app notification center, bell badge (`unseenCount` vs `unreadCount`), `menuOpen` mode, per-category toggles (`new_videos`, `live`, `replies`, `comments`, `subscribers`, `uploads`, plus always-on `account`), email preferences, per-channel bell (`all` / `highlights` / `none`) | **Live** (`notifications` in `features/registry.json`) | `AlUmmahNow`: `packages/shared-types/src/notifications.ts`, `apps/api-videos/src/routers/notifications.router.ts`, `apps/api-videos/src/endpoints/notifications/notifications.ts`, `apps/api-videos/src/lib/notifications.ts`, `apps/processor/migrations-notifications/*.sql`, `apps/web/src/components/notifications/{NotificationBell,NotificationCenter,NotificationRow,NotificationSettingsPanel,NotificationsPage,ChannelBellMenu}.tsx` | Add `quietHours` switch + `notification_quiet_hours` table + quiet-window suppression in push dispatch; add quiet-hours UI on web & native (hiding the prayer toggle until `E21.1` supplies on-device prayer windows); localize all `NOTIFICATION_KEYS` in native inboxes (`AlUmmahNowCore#40`). |
| Push device registry & APNs / FCM / WNS / Web Push senders | **Live / Building** (`browser-notifications`, [AUN-ADMIN-NATIVE](AUN-ADMIN-NATIVE-native-admin-app.md)) | `AlUmmahNow`: `apps/api-videos/src/lib/push-devices.ts`, `apps/processor/src/push/dispatch.ts`, `apps/processor/src/push/senders/{apns,fcm,webpush,wns}.ts`, `apps/web/src/components/notifications/BrowserNotificationsSetting.tsx`, `apps/web/src/app/push-sw.js/route.ts`<br>`AlUmmahNowApple`: `Packages/AUNAdmin/Sources/AUNAdmin/AdminPush.swift`<br>`AlUmmahNowAndroid`: `admin-mobile/src/main/kotlin/net/alummahnow/admin/push/{AdminPush,AdminMessagingService,AdminNotifications}.kt`<br>`AlUmmahNowDesktop`: `src/AlUmmahNow.Admin.Windows/WindowsPush.cs`, `src/AlUmmahNow.Admin/Push/AdminPush.cs` | Enforce daily quiet hours & fresh prayer-time quiet windows in `dispatchPush` when `quietHours` is on; wire APNs/FCM push registration on Studio (and Viewer once viewer sign-in is active) reusing the `AdminPush` pattern. |
| Short share links (`alummahnow.link`), web Share dialog, Open Graph / Twitter / oEmbed previews, Universal Links & App Links | **Live / Building** (`short-links`, `embeds`, `app-links-and-attestation`) | `AlUmmahNow`: `apps/short-links/src/{index,resolve,pages}.ts`, `packages/shared-types/{short-links,mobile-apps}.ts`, `apps/web/src/lib/well-known/app-association.ts`, `apps/admin-web/src/app/(protected)/mobile-apps/MobileAppsForm.tsx`, `apps/web/src/components/video/ShareDialog.tsx`<br>`AlUmmahNowApple`: `Packages/AUNCoreBridge/Sources/AUNCoreBridge/AppLink.swift`<br>`AlUmmahNowAndroid`: `core-bridge/src/main/kotlin/net/alummahnow/core/bridge/links/AppLink.kt` | Add `/e/<streamId>` short-link route (`→ /live/<streamId>`, since `/l/<id>` is playlists); add `appClipBundleId` + AASA `"appclips"` in `mobile-apps.ts`; serve AASA & `assetlinks.json` on `alummahnow.link` (`apps/short-links`); parse `alummahnow.link`, `?t=`, `?list=`, and `/e/` in native `AppLink`; add shared Rust `short_link_for` and wire native share buttons (`Apple#31`, `Android#20`, `Desktop#39`); add App Clip & Play Instant playback modules + CI size checks. |
| Live streams, Hijri date helpers, `live_stream_metadata`, premieres, & `live_reminders` table (**Live on `main`**) vs reminders API (**In review in [Epic 17](E17-live-in-apps.md)**) | **Live:** `streams.ts`, `content_ownership`, `hijriConverter.ts`, `live_stream_metadata`, `event_type`, `livePremieres`, `liveEvents`, `liveReminders` switch, and `0019_live_reminders.sql` ([AlUmmahNow#1787](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1787), [AlUmmahNow#1842](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1842) — `#1841` landed through `#1842`)<br>**In review:** `POST\|DELETE /api/live-streams/:id/reminders` in [AlUmmahNow#1845](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1845) | `AlUmmahNow` (`main`): `apps/api-videos/src/lib/live/streams.ts`, `apps/api-videos/migrations/search/0092_live_in_apps.sql`, `apps/processor/migrations-notifications/0019_live_reminders.sql`, `packages/shared-types/src/live-apps.ts`, `apps/web/src/components/calendar/utils/{dateFormatters,hijriConverter}.ts`<br>In review: [AlUmmahNow#1845](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1845) | Build `GET /api/events` and bilingual `GET /api/events.ics` + `GET /api/channels/:channelId/events.ics` reading `live_stream_metadata` and `live_reminders`, with an indexed `content_ownership (kind, status, is_public, is_deleted, is_hidden, created_at DESC)` fallback (`0106`). **While `liveReminders` is off (until `#1845` merges and is enabled), Epic 22 ships the event list + `.ics` feeds and hides the "Notify me" reminder button.** |
| On-device prayer-time calculation ([Epic 21](E21-islamic-experience.md) `21.1`) | **Planned / not yet on `main`** | [Epic 21](E21-islamic-experience.md) (`21.1`) | Until `21.1` lands and computes local prayer windows on the device, every client hides the "Pause during prayer times" toggle (never rendering a dead toggle or "not set up" text). |
| Feature switches & creator tiers | **Live** ([AUN-FEATURES](AUN-FEATURES-feature-switches.md), [CHAT-CREATOR-TIERS](CHAT-CREATOR-TIERS-creator-tiers.md)) | `AlUmmahNow`: `packages/shared-types/src/{features,feature-registry,feature-routes,feature-switch-store,creator-tiers}.ts`, `apps/api-videos/src/lib/features/{index,switches,off}.ts`, `apps/api-videos/src/middleware/require-feature.ts`, `apps/admin-api/src/routers/features.router.ts` | Add `eventCalendar` and `quietHours` switches (both default `false`), `USER_FEATURE_KEYS`, and `FEATURE_ROUTES` entries. |
| Reporting, Epic 28 AI moderation, and GDPR erasure/export | **Live** (`reporting`, `ai-moderation`, `purge-completeness`) | `AlUmmahNow`: `packages/shared-types/src/{moderation,ai-moderation,erasure-privacy}.ts`, `apps/api-videos/src/endpoints/moderation/reportCreate.ts`, `apps/api-videos/src/endpoints/privacy/footprintsInternal.ts` | Reuse `livestream` / `video` reporting & AI moderation directly on upcoming items; wire Takeout (`collectUserData`) and account erasure (`eraseUserData`) for `notification_quiet_hours`. |

---

## 3. Stories

Ordered strictly **back end → admin → web → native**, one PR per story. Migration filenames always take the **next free sequential number on `origin/main` at merge time**.

| ID | Story (one PR each) | Repo / apps | Visual audit |
|---|---|---|---|
| **E22-S1** | **Event calendar switch, App Clip association config, and `/e/<streamId>` short-link contract:** `eventCalendar` in `FEATURE_KEYS` / `FEATURE_REGISTRY` (default `false`), `USER_FEATURE_KEYS` (`eventCalendar`), `apple.appClipBundleId` + AASA `"appclips"` + short-links AASA/`assetlinks` helpers in `packages/shared-types/src/mobile-apps.ts`, and `/e/<streamId>` (`kind: 'live'`) in `packages/shared-types/src/short-links.ts`. ([AlUmmahNow#1813](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1813) — merged) | `AlUmmahNow` (`shared-types`, `api-videos`, `admin-api`, `short-links`) | No |
| **E22-S2** | **`quietHours` switch, notification quiet hours & prayer-time quiet windows:** `quietHours` feature switch (`default: false`, `404 feature_off` on `/api/notifications/quiet-hours`), next-free `NOTIFICATIONS_DB` migration (`notification_quiet_hours` with `end_minute DEFAULT 360` and `prayer_windows_updated_at`), `GET` / `PUT /api/notifications/quiet-hours` (plus settings envelope integration when on), push suppression for optional categories in `apps/processor/src/push/dispatch.ts` (ignoring prayer windows older than 7 days, preserving inbox writes and `account` notices, zero summary push), and Takeout + erasure cleanup. ([AlUmmahNow#1816](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1816)) | `AlUmmahNow` (`shared-types`, `api-videos`, `processor`) | No |
| **E22-S3** | **Unified Event Calendar API, bilingual `.ics` feeds, and `alummahnow.link/.well-known/*`:** `GET /api/events` over `live_stream_metadata` + `live_reminders` (default `now - 6h` lower bound for unstarted scheduled streams, raw-consumed cursor pagination, plus indexed `content_ownership` fallback in `0106`), bilingual `GET /api/events.ics` & `GET /api/channels/:channelId/events.ics` (`?lang=en\|ar`, `FEATURE_ROUTES` gated on `eventCalendar`), and `apps/short-links` `/.well-known/apple-app-site-association` + `/.well-known/assetlinks.json`. ([AlUmmahNow#1819](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1819)) | `AlUmmahNow` (`shared-types`, `api-videos`, `short-links`) | No |
| **E22-S4** | **Videos Admin — Mobile apps App Clip & short-link domain preview:** Expose `apple.appClipBundleId` on **Videos Admin → Settings → Mobile apps** (`MobileAppsForm.tsx`, bilingual en/ar, previewing `alummahnow.link` AASA with `"appclips"` and `assetlinks.json`). ([AlUmmahNow#1823](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1823) — merged) | `AlUmmahNow` (`admin-web`) | **Yes** |
| **E22-S5** | **Web UI — Notification quiet hours (`quietHours`-gated):** Daily quiet-hours window (`enabled`, `startMinute`, `endMinute`, `timezone`) gated on `features.quietHours` in `NotificationSettingsPanel` (`/notifications` & Settings); prayer-time quiet toggle stays hidden until [Epic 21](E21-islamic-experience.md) `21.1` provides local prayer windows on the device (and re-syncs daily / on timezone change once active, with zero "not set up" text). ([AlUmmahNow#1828](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1828)) | `AlUmmahNow` (`web`) | **Yes** |
| **E22-S6** | **Web UI — Event Calendar, Channel upcoming strip, and E2E:** *(Reminder toggle sits behind `features.liveReminders` and [AlUmmahNow#1845](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1845)'s `/api/live-streams/:id/reminders`; hidden while off.)* `/events` calendar and Channel upcoming strip (Gregorian + Hijri dates, frosted-glass cards per [O36](decisions.md#o36-one-frosted-glass-surface-primitive-flat-material-elsewhere), filter by All / Subscribed / Event type, bilingual `.ics` download, `alummahnow.link/e/<id>` share, Help entries tagged `feature: 'eventCalendar'`, and seeded local-stack Playwright E2E). ([AlUmmahNow#1831](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1831)) | `AlUmmahNow` (`web`) | **Yes** |
| **E22-S7** | **Shared Rust core (`AlUmmahNowCore`):** `short_link_for` builder in `aun-common` / `aun-ffi` matching `packages/shared-types/src/short-links.ts`; `aun-api` + `aun-ffi` methods for notification inbox (`unseenCount`, `markSeen`, `menuOpen` per `Core#40`), quiet hours (`end_minute: 360`), device push registration, and `/api/events`. ([AlUmmahNowCore#55](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/55) — merged) | `AlUmmahNowCore` | No |
| **E22-S8** | **Apple apps & App Clip (`AlUmmahNowApple`):** Studio (`StudioIOS`, `StudioMac`) & Viewer (`ViewerIOS`) APNs registration (`aps-environment`, wired via `AppPushController` on active session and unregistered on sign-out, with `notification.<key>` APNs `loc-key` strings; Viewer bell/push hidden until native viewer sign-in supplies an access token), localized `NOTIFICATION_KEYS` inbox & `quietHours`-gated settings (hiding prayer toggle until local windows exist on the device), `AppLink.swift` (`alummahnow.link`, `?t=`, `?list=`, `/e/`) + `ShareLink` (`Apple#31`), `eventCalendar`-gated Events sheet, and `AUNViewerClip` / `ViewerClip` (Apple system frameworks only — `SwiftUI`, `AVKit`, `StoreKit`, `Foundation` — `≤ 15 MB` verified in `scripts/ci.sh`). ([AlUmmahNowApple#84](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/84)) | `AlUmmahNowApple` | Snapshot tests |
| **E22-S9** | **Android apps & Google Play Instant (`AlUmmahNowAndroid`):** Studio FCM registration (`StudioPush.register` / `unregister` wired on sign-in / sign-out with `POST_NOTIFICATIONS` request; clean no-op until owner supplies `google-services.json`; Viewer bell/push hidden while signed out under `GuestOnlyAuthBridge`), notification channels, localized `NOTIFICATION_KEYS` inbox & `quietHours`-gated settings, `AppLink.kt` + share-to-short-link (`Android#20`), `eventCalendar`-gated Events sheet, and `:viewer-instant` module (`≤ 15 MB` verified by `:viewer-instant:checkInstantSize` Gradle task in CI). ([AlUmmahNowAndroid#57](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/57)) | `AlUmmahNowAndroid` | Screenshot / unit tests |
| **E22-S10** | **Desktop shared bridge & view models (`AlUmmahNowDesktop`):** Shared `netstandard2.0` / `net9.0` `ShortLinks` builder & parser (`Desktop#39`), `WatchViewModel` short-link sharing, localized `NOTIFICATION_KEYS` formatting, `INotificationsClient` / `IEventsClient` / `IAppPushRegistrar` HTTP implementations, shared `PushConfig`, and `quietHours`- / `eventCalendar`-gated `NotificationsViewModel` & `EventsCalendarViewModel` (shell XAML/GTK/Tizen views attach in the platform viewer/studio stories). ([AlUmmahNowDesktop#76](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/76) — merged) | `AlUmmahNowDesktop` | Unit tests |

---

## 4. Data model, API, and App Clips / Instant Apps

### 4.1 D1 schema (`NOTIFICATIONS_DB` + fallback index on `SEARCH_DB` — zero duplicate event tables)

Every query uses a primary key or explicit composite index with bounded pagination (`LIMIT <= 50`). **Zero full-table scans** and **zero queries against the Auth D1**.

#### `NOTIFICATIONS_DB` — Notification quiet hours (next free migration in `apps/processor/migrations-notifications/`)

```sql
CREATE TABLE IF NOT EXISTS notification_quiet_hours (
  user_id TEXT PRIMARY KEY,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0, 1)),
  timezone TEXT NOT NULL DEFAULT 'UTC',
  start_minute INTEGER NOT NULL DEFAULT 1320 CHECK (start_minute BETWEEN 0 AND 1439),
  end_minute INTEGER NOT NULL DEFAULT 360 CHECK (end_minute BETWEEN 0 AND 1439),
  prayer_quiet_enabled INTEGER NOT NULL DEFAULT 0 CHECK (prayer_quiet_enabled IN (0, 1)),
  prayer_windows_json TEXT NOT NULL DEFAULT '[]',
  prayer_windows_updated_at INTEGER,
  updated_at INTEGER NOT NULL
) WITHOUT ROWID;
```

- `start_minute` / `end_minute` represent one daily local quiet window (`0..1439`, defaulting across every layer — SQL, API, Rust Core, Apple, Android, and Desktop — to `1320` → `22:00` and `360` → `06:00`, supporting wrap-around across midnight).
- **On-device prayer-window calculation & freshness contract (`E22-D6` + [Epic 21](E21-islamic-experience.md) `21.1`):**
  - `prayer_windows_json` stores up to 5 local-day `{ "startMinute": 0..1439, "endMinute": 0..1439 }` intervals computed locally on the user's device using Epic 21.1's prayer-time library once `21.1` ships. **No GPS coordinates, city names, or IP-geolocation locations are ever stored on the server.**
  - Because prayer times shift ~1–2 minutes per day (and jump on DST or travel), each client with `prayerQuietEnabled = true` and Epic 21.1 configured **re-PUTs today's windows at most once per local calendar day when opened, and immediately whenever the device's IANA timezone changes**, updating `prayer_windows_updated_at` on the server.
  - If `prayer_windows_updated_at` is null or older than **7 days** (`now - prayer_windows_updated_at > 7 * 86_400_000`), `isInQuietWindow` / `dispatchPush` **ignores `prayer_windows_json`** so stale windows never silence pushes at the wrong hour.
  - Until Epic 21.1 is built and supplies windows on the device, every client hides the prayer-quiet toggle completely.

#### Shared upcoming events model (shipped in [Epic 17](E17-live-in-apps.md), read by Epic 22)
Per [`E22-D7`](#10-owner-decisions), online events (scheduled live streams, premieres, Jumu'ah, Taraweeh, conferences, and halqas) use **one** model:
- **Primary store (`0092_live_in_apps.sql` & `0019_live_reminders.sql` in merged [AlUmmahNow#1787](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1787) and [AlUmmahNow#1842](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1842), where `#1841` landed through `#1842`):** `SEARCH_DB.live_stream_metadata` (`visibility = 'public'`, `recording_withheld = 0`, `purge_pending = 0`, covered by `idx_live_stream_meta_status_sched`, `idx_live_stream_meta_event_status`, `idx_live_stream_meta_channel_status`) + R2 `livestream:<id>` and `NOTIFICATIONS_DB.live_reminders` (`PRIMARY KEY (stream_id, user_id)`, `idx_live_reminders_user`), sharing `LIVE_EVENT_TYPES` (`live-apps.ts`), with reminder mutations (`POST|DELETE /api/live-streams/:id/reminders`) in review in [AlUmmahNow#1845](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1845). Both live streams and premieres link to `/live/<streamId>` (the video watch page answers 404 before a premiere starts).
- **Pre-migration fallback (`0106_content_ownership_stream_status_idx.sql`):** If an environment has not yet applied `0092_live_in_apps.sql`, `GET /api/events` falls back to `SEARCH_DB.content_ownership` covered by composite index `idx_content_ownership_kind_status_created ON content_ownership (kind, status, is_public, is_deleted, is_hidden, created_at DESC)` so ended streams are never scanned; `eventType` and `kind` are read from `livestream:<id>` JSON, and the UI reminder button stays hidden while `liveReminders` is off.
- Shipped creator tier IDs in `creator-tiers.ts` are `member` (Free), `creator` (Creator), and `unlimited` (Unlimited); scheduling online events uses `CreatorTier.live`, `livePremieres`, and `liveEvents` — no separate `channel_events` table or `channelEvents` tier column is added.

### 4.2 HTTP API (`api-videos`, `admin-api`, `short-links`)

All `/api/events*` and `/api/channels/:channelId/events.ics` routes are gated by `requireFeature('eventCalendar')` via `FEATURE_ROUTES` (`404 feature_off` with localized server message per [O40](decisions.md#o40-server-written-error-messages)). Quiet-hours routes (`/api/notifications/quiet-hours`) are gated by `requireFeature('quietHours')` via `FEATURE_ROUTES` (`404 feature_off` when off).

#### Notification quiet hours (`api-videos` & `processor`)
- `GET /api/notifications/quiet-hours` & `PUT /api/notifications/quiet-hours` — Dedicated `quietHours`-gated routes (`404 feature_off` while `quietHours` switch is off) reading and updating `{ enabled, timezone, startMinute, endMinute, prayerQuietEnabled, prayerWindows, prayerWindowsUpdatedAt }`. When `quietHours` is on, `GET` / `PUT /api/notifications/settings` also includes/accepts `quietHours` for single-round-trip loads; when `quietHours` is off, `GET /api/notifications/settings` omits `quietHours` and `PUT /api/notifications/settings` **ignores** any `quietHours` field so category and email preferences still save cleanly.
- `apps/processor/src/push/dispatch.ts` — Checks the cached `quietHours` feature switch; when enabled, before sending APNs / FCM / WNS / Web Push for any notification in `OPTIONAL_NOTIFICATION_CATEGORIES`, batch-reads `notification_quiet_hours` by `user_id IN (...)` (primary-key lookup). Recipients currently inside their daily `[start_minute, end_minute)` window or a fresh (`<= 7 days`) `prayer_windows_json` interval in `timezone` are skipped for push delivery (the in-app `notifications` row is already persisted, and no summary push is queued). Notifications in `ALWAYS_ON_NOTIFICATION_CATEGORIES` (`account`) always push through.

#### Event calendar & short links (`api-videos`, `admin-api`, `short-links`)
- `GET /api/events` — Cursor-paginated upcoming online events (`from?`, `to?`, `channelId?`, `eventType?` from `LIVE_EVENT_TYPES` in `live-apps.ts`, `kind?: 'live' | 'premiere'`, `subscribedOnly?` over up to 90 subscribed channels, `cursor?`, `limit` 1–50), filtering `live_stream_metadata.visibility = 'public'` and ordered live-first then `scheduledStartTime ASC`, with `watchPath: '/live/<streamId>'` for both live streams and premieres. When `from` is omitted, unstarted `scheduled` streams default to `scheduledStartAt >= now - 6h` so abandoned past schedules never crowd the calendar. Anonymous unfiltered responses carry `Cache-Control: public, max-age=60`. Cursor advances by exact raw rows consumed so filtered private/hidden items never duplicate rows across pages.
- `GET /api/events.ics` & `GET /api/channels/:channelId/events.ics` — Bilingual (`?lang=en|ar` or `Accept-Language`) multi-event RFC 5545 `text/calendar; charset=utf-8` feeds (`PRODID:-//Al Ummah Now//Event Calendar//EN` or `AR`, localized `X-WR-CALNAME`, channel display name, and `"Watch online:"` / `"شاهد عبر الإنترنت:"` description, control-character & bare-`\r` stripping before escaping, unescaped URI `URL:`, UTC `DTSTART`/`DTEND`, UTF-8 octet CRLF folding, and 15-minute `VALARM`).
- `apps/short-links` + `admin-api`:
  - `alummahnow.link/e/<streamId>` → `301` to `/<lang>/live/<streamId>` when the stream is public and not hidden/deleted (else bilingual 404). (`e` is used because `/l/<id>` already serves playlists.)
  - `alummahnow.link/.well-known/apple-app-site-association` (and `/apple-app-site-association`) + `alummahnow.link/.well-known/assetlinks.json` — Served directly by `apps/short-links` from `admin-api` `/public/mobile-apps/short-links/<file>` (cached 60 s fresh / 10 min stale-on-error), advertising short-link paths (`/v/*`, `/s/*`, `/@*`, `/c/*`, `/p/*`, `/l/*`, `/e/*`) plus `"appclips"`.

### 4.3 App Clips (iOS) and Google Play Instant Apps (Android)

Per [`E22-D8`](#10-owner-decisions), App Clips and Google Play Instant Apps are specified now and built up to the store-account boundary:

1. **Invocation & product scope:**
   - Triggered when a user without the full app installed opens a shared video link (`videos.alummahnow.com/{en,ar}/video/<id>`, `/shorts/<id>`, or `alummahnow.link/v/<id>`, `/s/<id>`) from Messages, WhatsApp, Safari Smart App Banner, QR/NFC tag, or Android link tap.
   - **Strictly playback-only:** Resolves the video (respecting `?t=<seconds>` and `?lang=en|ar`), streams the public HLS manifest via `AVPlayer` (iOS) / Media3 `ExoPlayer` (Android) with captions, and displays a non-intrusive **"Get the full app"** prompt (`SKOverlay` on iOS; Play Store intent on Android).
   - **Out of scope inside the clip/instant experience:** Sign-in/passkeys, commenting, live chat, uploads, Studio, offline downloads, push notification prompts, and background data collection.
2. **Binary size limits (enforced by CI):**
   - **iOS App Clip (`AlUmmahNowApple`):** Apple enforces **≤ 15 MB** uncompressed payload for iOS 16 and earlier and for physical invocations (NFC tags, App Clip Codes, and QR codes), **≤ 100 MB** from iOS 17 for clips with digital invocations only (Safari Smart App Banner, Messages, and Maps), and **≤ 25 MB** for iOS 27.3 and later; CI enforces the strict **≤ 15 MB** (`15 * 1024 * 1024` bytes) ceiling so every invocation surface and iOS version works. `AUNViewerClip` and `ViewerClip` depend solely on Apple system frameworks (`SwiftUI`, `AVKit`, `StoreKit`, and `Foundation`) with self-contained bilingual `ClipCopy` strings and `URLSession` video fetching—linking zero `AUNCoreBridge`, `AunCore` Rust FFI, `AUNDesign`, `AUNPlayer`, `AUNFeatures`, `AUNMedia`, or `AUNStudio`—and `scripts/ci.sh ios` builds the release `ViewerClip.app` bundle for `generic/platform=iOS` and fails above `15 * 1024 * 1024` bytes.
   - **Google Play Instant (`AlUmmahNowAndroid`):** Google Play enforces **≤ 15 MB** downloadable size per device configuration (single ABI + density split from the R8-minified release App Bundle). `:viewer-instant` depends only on `:design`, `OkHttp`, and Media3 (`media3-exoplayer`, `media3-exoplayer-hls`, `media3-ui`)—without `:core-bridge`, `:player`, UniFFI/JNA native libraries (`libaun_core.so`, `libjnidispatch.so`), WorkManager, FCM, Cast, MediaRouter, TUS, or Studio dependencies—and Gradle verification task `:viewer-instant:checkInstantSize` measures the shrunk single-ABI release artifact in CI and fails above `15_000_000` bytes.
3. **Signing, entitlements, and domain association requirements:**
   - **Apple (`net.alummahnow.viewer` + `net.alummahnow.viewer.clip`):**
     - App Clip entitlements:
       - `com.apple.developer.parent-application-identifiers`: `["$(AppIdentifierPrefix)net.alummahnow.viewer"]`
       - `com.apple.developer.associated-domains`: `["appclips:videos.alummahnow.com", "appclips:alummahnow.link"]` (`.qa` equivalents on QA).
     - `/.well-known/apple-app-site-association` on **both** `videos.alummahnow.com` and `alummahnow.link` includes `"appclips": { "apps": ["<TEAM_ID>.net.alummahnow.viewer.clip"] }` automatically once `apple.teamId` and `apple.appClipBundleId` are populated in **Videos Admin → Settings → Mobile apps**.
   - **Android (`net.alummahnow.app`):**
     - `AndroidManifest.xml` declares `<dist:module dist:instant="true" />`, `android:targetSandboxVersion="2"`, and `android:autoVerify="true"` `https` `VIEW`/`BROWSABLE` intent filters for `${webHost}` (`/en/video/*`, `/ar/video/*`, `/video/*`, `/en/shorts/*`, `/ar/shorts/*`, `/shorts/*`) and `${shortLinkHost}` (`/v/*`, `/s/*`).
     - `/.well-known/assetlinks.json` on **both** `videos.alummahnow.com` and `alummahnow.link` publishes `delegate_permission/common.handle_all_urls` with the Play App Signing SHA-256 certificate fingerprint.

### 4.4 Owner setup checklist for store accounts and associated domains

Once the organization's developer accounts open, the owner performs only these configuration steps:

1. **Apple Developer Program & App Store Connect:**
   - Enroll the organization and copy the 10-character **Apple Team ID** into **Videos Admin → Settings → Mobile apps** (`apple.teamId`, with `apple.appClipBundleId` at `net.alummahnow.viewer.clip`).
   - Register App IDs `net.alummahnow.viewer` (Associated Domains + Push Notifications) and `net.alummahnow.viewer.clip` (Parent Application ID `net.alummahnow.viewer` + Associated Domains).
   - In App Store Connect under the Viewer app version → **App Clip**, upload a `1800 × 1200` PNG card header, set English & Arabic titles/subtitles, choose action `Play`, and register Default App Clip Experience URLs (`https://videos.alummahnow.com` and `https://alummahnow.link`).
2. **Google Play Console:**
   - Enroll the organization, create app `net.alummahnow.app`, enable **Play App Signing**, and copy the **App signing key certificate SHA-256 fingerprint** into **Videos Admin → Settings → Mobile apps** (`android.apps[viewer].sha256Fingerprints`).
   - In **Release → Setup → Advanced settings → Form factors**, add **Google Play Instant**, then upload the signed instant-enabled `.aab` to the Instant track.
3. **Verify domain association live:**
   - Confirm `https://videos.alummahnow.com/.well-known/apple-app-site-association`, `https://alummahnow.link/.well-known/apple-app-site-association`, `https://videos.alummahnow.com/.well-known/assetlinks.json`, and `https://alummahnow.link/.well-known/assetlinks.json` all answer `200 application/json`.

---

## 5. Every platform and what each needs

Following the [Copy Tone Guide](../guides/copy-tone.md) and [Glossary](../guides/glossary.md): Arabic uses «مرئي / مرئيات» (never «فيديو»), Eastern Arabic numerals `٠–٩` via the shared `ar-u-nu-arab` formatter ([O35](decisions.md#o35-arabic-uses-eastern-arabic-hindi-numerals)), ungrouped numbers and «،» separators ([O38](decisions.md#o38-numbers-never-grouped-in-arabic-counts-compact-from-1000)), frosted-glass cards and dialogs with flat buttons ([O36](decisions.md#o36-one-frosted-glass-surface-primitive-flat-material-elsewhere)), in-app confirmation dialogs (never `window.confirm` / `alert`), live autocomplete search boxes, and the display-name rule (never `@handle` or email on user rows).

| Platform | What Epic 22 builds |
|---|---|
| **Web (`AlUmmahNow/apps/web`)** | • `/notifications` & Settings: `quietHours`-gated daily quiet-hours schedule + prayer-time quiet toggle (rendered only when [Epic 21](E21-islamic-experience.md) `21.1` provides local prayer windows, re-syncing daily / on timezone change).<br>• `/events` & Channel upcoming strip: upcoming online events calendar (Gregorian + Hijri dates), filter by All / Subscribed / Event type (`jumuah`, `taraweeh`, `conference`, `halqa`), bilingual `.ics` download, `alummahnow.link/e/<id>` share, and `liveReminders`-gated Notify me button.<br>• Help blocks tagged with `feature: 'eventCalendar'` so they vanish when off. |
| **Videos Admin (`AlUmmahNow/apps/admin-web`)** | • **Features page:** `quietHours` and `eventCalendar` rows under `people` with bilingual help text and `off` defaults.<br>• **Settings → Mobile apps:** `apple.appClipBundleId` field and preview of `alummahnow.link` AASA (including `"appclips"`) & `assetlinks.json`. |
| **Shared Rust Core (`AlUmmahNowCore`)** | • `short_link_for` in `aun-common` / `aun-ffi` matching `packages/shared-types/src/short-links.ts` (`alummahnow.link`, `stage.`, `qa.`, `?lang=ar`, `?t=`, `?list=`, `/e/<id>`).<br>• `aun-api` + `aun-ffi` bindings for notification inbox (`unseenCount`, `markSeen`, `menuOpen` per `Core#40`), quiet hours, device push registration, and `/api/events`. |
| **Apple (`AlUmmahNowApple` — iOS, iPadOS, macOS, tvOS, App Clip)** | • Studio & Viewer APNs registration (`aps-environment`, wired on active session and unregistered on sign-out), localized `NOTIFICATION_KEYS` inbox, and `quietHours`-gated quiet-hours settings.<br>• `AppLink.swift` parsing for `alummahnow.link`, `?t=`, `?list=`, `/e/<id>`, and native `ShareLink` (`Apple#31`).<br>• SwiftUI Events calendar sheet gated on `features.eventCalendar`.<br>• Pure-Swift `AUNViewerClip` / `ViewerClip` (`≤ 15 MB` verified in CI) with `SKOverlay` full-app install banner. |
| **Android (`AlUmmahNowAndroid` — Phone, Tablet, TV, Instant)** | • Studio FCM registration (and Viewer push/bell gated on signed-in auth state), notification channels, localized `NOTIFICATION_KEYS` inbox, and `quietHours`-gated quiet-hours settings.<br>• `AppLink.kt` parsing for `alummahnow.link`, `?t=`, `?list=`, `/e/<id>`, and share-sheet builder (`Android#20`).<br>• Compose Events calendar sheet gated on `features.eventCalendar`.<br>• `:viewer-instant` module (`≤ 15 MB` verified by Gradle task in CI) with full-app install prompt. |
| **Desktop (`AlUmmahNowDesktop` — Shared `CoreBridge` & `App` layer)** | • `ShortLinks` builder & parser (`Desktop#39`) and `WatchViewModel.ShareUrl` integration.<br>• Shared `PushConfig`, `INotificationsClient`, `IEventsClient`, and `IAppPushRegistrar` HTTP implementations.<br>• Localized `NOTIFICATION_KEYS` formatting and `quietHours`- / `eventCalendar`-gated `NotificationsViewModel` & `EventsCalendarViewModel` for the Windows, Linux, and Tizen shells. |

---

## 6. Feature switch and tier rules

| Switch key (`FEATURE_KEYS`) | Group | Default | `GET /api/me/features` keys | Tier & readiness rules |
|---|---|---|---|---|
| `quietHours` | `people` | **`false` (OFF)** | `quietHours` | • While `quietHours` switch is OFF: `features.quietHours` is `false`; `GET / PUT /api/notifications/quiet-hours` answer `404 feature_off` (while `PUT /api/notifications/settings` ignores `quietHours` completely so other settings still save); `dispatchPush` defaults fail-closed and does not suppress pushes; zero quiet-hours UI renders.<br>• While ON: `features.quietHours` is `true` for signed-in users. The prayer-time quiet row remains hidden until Epic 21.1 provides local prayer windows on the device. |
| `eventCalendar` | `people` | **`false` (OFF)** | `eventCalendar` | • While `eventCalendar` switch is OFF: `features.eventCalendar` is `false`; `GET /api/events*` and `GET /api/channels/:id/events.ics` answer `404 feature_off`; `/events*` renders 404; zero nav, channel, or Help entry points.<br>• While ON: `features.eventCalendar` is `true` for viewers. Scheduling new live streams, premieres, or tagged event streams continues to follow `features.live` and the channel owner's tier (`member`, `creator`, `unlimited`, or custom tiers) from [Epic 17](E17-live-in-apps.md). |

- **No upsell or "not set up" text:** When `quietHours`, `eventCalendar`, `liveReminders`, or Epic 21.1 prayer windows are off/absent, those controls simply do not render ([Product rules → Hidden when off](../guides/product-rules.md#hidden-when-off)).

---

## 7. Tests

Every test seeds its own isolated records and deletes them in `finally` / `afterEach`, even on failure. Zero paid AI calls in tests and zero E2E runs against deployed QA on PRs.

1. **Unit & contract tests (`packages/shared-types`, `apps/short-links`):**
   - `feature-registry` / `feature-routes` completeness tests verifying `/api/notifications/quiet-hours`, `/api/events`, `/api/events.ics`, and `/api/channels/:channelId/events.ics` are gated by `quietHours` and `eventCalendar`.
   - Quiet-hours local-minute wrap-around (`22:00`–`06:00` across midnight, DST transitions, 5 daily prayer windows, and 7-day staleness expiry).
   - `appleAppSiteAssociation` `"appclips"` output, short-links AASA / `assetlinks.json` pass-through & stale-on-error cache, and `/e/<streamId>` resolution + bilingual 404 when private/hidden/deleted.
   - Bilingual RFC 5545 `.ics` escaping (including bare `\r` and control-character stripping, unescaped URI `URL:`, and UTF-8 octet CRLF folding).
2. **API & processor integration tests (`apps/api-videos/test/`, `apps/processor/src/__tests__/`):**
   - Real router `404 feature_off` assertions when `quietHours` or `eventCalendar` is off, and atomic validation on `PUT /api/notifications/settings` (ignoring `quietHours` completely while `quietHours` is off).
   - Cursor pagination across private/filtered streams (`limit=2`) and default `now - 6h` filtering of unstarted past scheduled streams.
   - `dispatchPush` suppressing optional pushes during daily quiet hours and fresh prayer windows (including multi-device users and batches above `PUSH_DISPATCH_BATCH`) while delivering `account` notices and leaving in-app `notifications` untouched.
   - Complete Takeout export (`collectUserData`) & account erasure (`eraseUserData`) for `notification_quiet_hours`.
3. **Local-stack E2E (`apps/web/e2e/`):**
   - Seeds a public scheduled stream in `SEARCH_DB` + R2 (deleting it in `finally`), toggles `eventCalendar` on, verifies `/en/events` and `/ar/events` render the seeded event with Gregorian + Hijri dates, Eastern Arabic digits `٠–٩` (zero ASCII digits in Arabic schedule cells), and «،», checks `/api/events.ics?lang=ar`, verifies 404 when off, and passes the leftover check.
4. **Native & Core tests (`AlUmmahNowCore`, `AlUmmahNowApple`, `AlUmmahNowAndroid`, `AlUmmahNowDesktop`):**
   - Rust unit tests for `short_link_for` and `aun-api` clients; Swift/Kotlin/C# `AppLink` parser tests, localized `NOTIFICATION_KEYS` rendering tests, real CI App Clip & Play Instant binary size assertions (`≤ 15 MB`), and UI snapshot tests.

---

## 8. Infrastructure costs

Epic 22 introduces **zero new paid vendors**, **zero new Durable Objects**, and **zero background polling**. Per [D2](D2-video-delivery.md), App Clip and Instant App video playback streams the same Cloudflare CDN-cached HLS segments from R2 as web and native playback (`$0.00/GB` egress):

| Component | Unit cost (per video / per view) | Projected monthly cost (launch → 100k MAU / 1M views) |
|---|---|---|
| Quiet-hours & prayer-window filtering | `$0.00` per video · `$0.00` per view (single primary-key D1 batch lookup inside `dispatchPush` on `NOTIFICATIONS_DB`, within Workers Paid included D1 reads) | **$0.00/mo** |
| Event calendar & `.ics` feeds | `$0.00` per scheduled stream · `< $0.0000003` per calendar view (indexed D1 reads + 60 s public edge cache on anonymous `/api/events` + stateless `.ics` responses) | **$0.00 at launch; < $0.25/mo** at 100k MAU |
| Native push, `/e/<id>` short links, & App Clip / Instant playback | `$0.00` per video · `< $0.000004` per uncached HLS view on R2 Class B reads (`$0.00` egress via Cloudflare CDN; direct APNs, FCM HTTP v1, WNS, VAPID Web Push, and cached `/.well-known/*` responses on `apps/short-links`) | **$0.00/mo** incremental (Apple Developer $99/yr & Google Play $25 one-time are shared store-release accounts in [Epic 23](E23-release-engineering.md)) |
| **Total Epic 22 incremental cost** | **`$0.00` per video · `< $0.000005` per view** | **$0.00/mo at launch; < $0.25/mo at 100k MAU** |

---

## 9. Legal, safety, moderation, privacy, and minors

With group watch folded into [Epic 17](E17-live-in-apps.md) and in-person venues ruled out under [`E22-D7`](#10-owner-decisions), Epic 22 introduces **no new user-to-user text surfaces and no physical meetup listings**:

1. **Moderation and reporting (reusing existing paths):** Upcoming calendar items are scheduled live streams and premieres, moderated and reportable through the existing `livestream` / `video` paths (`POST /api/moderation/reports` → R2 `reports` claim + `MessageType.ReportCreate` → `REPORTS_DB`, Epic 28 `video_metadata` / `live_chat` AI moderation, and `channelComments/blocks.ts`).
2. **Privacy — zero location storage & complete erasure:** Prayer-time quiet windows store at most five `[startMinute, endMinute)` local-day numbers, an IANA timezone string, and `prayer_windows_updated_at` — **never GPS coordinates, city names, or IP-geolocation history**. `notification_quiet_hours` is exported in self-service Takeout (`collectUserData`) and deleted by primary key (`user_id`) on account erasure (`footprintsInternal.ts`), while `live_reminders` erasure is handled by [Epic 17](E17-live-in-apps.md). App Clips and Instant Apps run strictly unauthenticated with zero tracking or persistent identifiers.
3. **Minors and parental controls ([Epic 20](E20-system-parental-controls.md), [O45](decisions.md#o45-no-in-app-kids-mode-support-the-systems-parental-controls)):** Per owner decision `O45` (2026-11-24), there is no in-app Kids Mode — [Epic 20](E20-system-parental-controls.md) uses OS-level system parental controls only, so Epic 22 includes zero in-app Kids client checks or `kids_mode_restricted` gates.

---

## 10. Owner decisions

All Epic 22 decisions were resolved by the owner on 2026-11-23 (recorded in the [Decision log](decisions.md)):

- **Retired (`E22-D1`–`E22-D5`, `E22-D9`):** Dropped on 2026-11-23 when the owner ruled *"it's a live video with chat, why make it special"* — watching and chatting together is a live stream or premiere with live chat in [Epic 17](E17-live-in-apps.md).
- **`E22-D6` — Quiet hours and prayer-time quiet windows (22.1): DECIDED (2026-11-23)**
  - **Decision:** Keep it simple behind the `quietHours` switch: one user setting for a daily quiet window (`22:00`–`06:00` default), plus an optional "quiet during prayer times" toggle computed on-device using [Epic 21](E21-islamic-experience.md)'s local prayer-time library once `21.1` exists (hidden until `21.1` supplies windows, re-synced daily or on timezone change, and ignored server-side after 7 days). During quiet hours, optional notifications are not pushed and wait in the inbox; `account` and security notices always come through; no summary push afterwards.
- **`E22-D7` — Event Calendar scope & unified upcoming model (22.4): DECIDED (2026-11-23)**
  - **Decision:** **Online events only.** Channels post upcoming online events (scheduled live streams, premieres, and halqas) with reminders; **no in-person venues**. Unified with [Epic 17](E17-live-in-apps.md) as **one "upcoming" model, not two** (no duplicate `channel_events` or `event_reminders` tables).
- **`E22-D8` — App Clips (iOS) and Google Play Instant Apps (22.2): DECIDED (2026-11-23)**
  - **Decision:** **Yes, build them once the store accounts are set up.** Scope (open a shared video or `alummahnow.link` short link and play it), size limits (`≤ 15 MB`), signing, and store/domain requirements are specified in [§4.3](#43-app-clips-ios-and-google-play-instant-apps-android)–[§4.4](#44-owner-setup-checklist-for-store-accounts-and-associated-domains); everything not requiring store accounts is built in `E22-S1`, `E22-S3`, `E22-S4`, `E22-S8`, and `E22-S9`.

---

## Status evidence

- 2026-11-08: Initial epic outline imported in [AlUmmahNow#309](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/309) and [AlUmmahNowApple#9](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/9).
- 2026-11-21: Cross-check reconciled partial delivery of 22.1 (push senders, categories, web notification center, `AlUmmahNowCore#40`) and 22.2 (`alummahnow.link` short links, Open Graph cards, AASA / `assetlinks.json`, `AlUmmahNowApple#31`, `AlUmmahNowAndroid#20`, `AlUmmahNowDesktop#39`).
- 2026-11-23: Owner resolved all Epic 22 decisions (`E22-D6`, `E22-D7`, `E22-D8`) and folded separate group watch into [Epic 17](E17-live-in-apps.md). Merged in [AlUmmahNowCore#55](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/55), [AlUmmahNow#1813](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1813), [AlUmmahNow#1823](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1823), and [AlUmmahNowDesktop#76](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/76); implementation PRs open in [AlUmmahNow#1816](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1816), [AlUmmahNow#1819](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1819), [AlUmmahNow#1828](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1828), [AlUmmahNow#1831](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1831), [AlUmmahNowApple#84](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/84), and [AlUmmahNowAndroid#57](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/57).
