[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 21: Islamic experience layer

| | |
|---|---|
| **ID** | `E21` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **building**: owner decisions E21-D1 to E21-D9 are final (2026-11-23). Learning paths, ayah repeat, A–B loop, content filters and the verification application flow are out of scope. |
| **Last updated** | 2026-11-23 |

## Goal

Make viewing fit Islamic practice without turning worship into an engagement mechanic: accurate prayer times and Qibla, an optional Hijri date and seasons, an admin-granted scholar label, recitation references with deep links, calmer autoplay and finite viewing, and private time-stamped notes.

The epic builds on Epic 12's viewer shell, Epic 13's player, Epic 11's native sync, AUN-FEATURES and AUN-CAPTIONS. It reuses those systems rather than creating a separate Islamic content service.

**Decision ids.** This epic's owner decisions are **E21-D1 to E21-D9** (§12). They are different from the wiki-wide [D7](decisions.md#d7-prayer-time-data) (prayer-time data), which E21-D1 resolves.

**Out of scope (owner, 2026-11-23):** learning paths (playlists cover them, E21-D5); ayah repeat and A–B loop (E21-D6); instrument-free and madhab filters and a new instruction-language preference (E21-D8; search and Explore already filter by language); a verification application, evidence or review flow (E21-D4); highlights, colors and caption or Quran highlights in notes (E21-D9).

## 1. What exists today

Inventory against AlUmmahNow `main` at `6f2bb3304` (2026-11-23).

| Area | Existing code | What it does | Gap |
|---|---|---|---|
| Official Quran text | `packages/shared-types/src/quran.ts`; `apps/api-videos/src/endpoints/quran/quranPassageGet.ts`; `apps/api-videos/src/lib/quran/copy.ts` | Serves verbatim Uthmani text from the fresh Quran Foundation Content Sync copy; hides text when the copy is stale | No recitation references per video or surah/ayah deep link |
| Quran translations and credit | `apps/api-videos/src/endpoints/quran/quranTranslations.ts`; `apps/web/src/components/credits/CreditsPage.tsx`; `apps/api-videos/src/endpoints/quran/quranCredits.ts`; [#1767](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1767) | Quran Foundation editions by id; short linked credit beside Quran text; full attribution on `/credits` | Native recitation surfaces need the same credit |
| Quran matching | `packages/shared-types/src/quran.ts`; `apps/processor/src/__tests__/quran-matcher.test.ts` | ASR only proposes a reference; a creator confirms it before official text is shown | Must never become a source of Quran display text |
| Prayer and Qibla | None | — | Everything |
| Hijri | `apps/web/src/utils/hijriConverter.ts`; `apps/web/src/components/calendar/utils/hijriConverter.ts` | Two local converters used by the scheduling calendar | Not a viewer setting. E21 does not add a third converter; viewer Hijri dates come from the prayer API (E21-D2) |
| Scholar label | `apps/admin-api/src/lib/channelVerification.ts`; `apps/admin-api/src/endpoints/channels/ChannelVerification.ts`; `channel_verification_log` (admin D1); `apps/web/src/components/VerifiedBadge/index.tsx`; search `verified=true` in `apps/api-videos/src/endpoints/search/searchGet.ts` | Admins set or clear a channel's verified flag with an optional note; audit log; badge; verified-only search filter | Reason is optional; no scholar/institution kind; no badge detail |
| Autoplay | `apps/api-videos/src/lib/playback-settings.ts`; `apps/web/src/hooks/useAutoplaySetting.ts`; `apps/web/src/lib/video/autoplay-intent.ts` | Account-synced `autoplayNext`, default **on** | E21-D7 makes the default off without overwriting explicit choices |
| Finite viewing | None | — | Daily-time reminder, session-complete card, finite Lamahat |
| Notes | Watch progress only (`apps/api-videos/src/endpoints/watch-state/watchState.ts`) | — | Private time-stamped notes, export, GDPR coverage |
| Feature control | `packages/shared-types/src/feature-registry.ts`; `feature-routes.ts`; `apps/api-videos/src/lib/features/index.ts` | One registry, server `feature_off`, `/api/me/features` | E21 keys land in story 21.0 ([#1807](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1807)) |

## 2. Quran and attribution rules

1. **Display text comes only from Quran Foundation's official Uthmani text** through the existing `GET /api/v1/quran/passage`. Never render ASR words, a corrected guess, a typed verse or model output as Quran.
2. **Translations are recognized human editions returned by Quran Foundation.** Never machine-translate Quran, including in captions, notes, exports or native caches.
3. **Identification and display stay separate.** ASR may propose a reference for creator review; it never supplies display text.
4. **Credit every surface** with the existing short linked credit and the full `/credits` page; native apps add a Credits screen reading `GET /api/quran/credits`.
5. **Honor QF1 and freshness.** No new Quran store, no stale-text fallback, no alternate Quran provider. A stale source hides text; the reference and quran.com link may remain.
6. **Recitation references store and return no Quran text** (story 21.4a): only surah/ayah ranges, cue times and human-supplied reciter metadata.

## 3. Prayer times and Hijri: the city proxy

**E21-D1 and E21-D2 are decided.** Prayer times and the Hijri date come from an online provider through **our anonymous, cached city proxy**. No prayer time or Hijri date is computed on any client.

### What the device sends

Only `city` (catalogue id), `month` (a fixed window, below), `method` and `asr`. No user id, no cookies, no `Authorization` header, no exact coordinates. The route never reads auth state.

### What the Worker does

1. Validates the query against the city catalogue and the admin-enabled method list. `method=auto` resolves to the city's country default (an admin-editable table seeded from the research's regional defaults).
2. Looks up the edge cache, then the last-good copy in R2, keyed by `(provider, hijriSource, cityId, month, resolvedMethod, asr)`.
3. On a miss, calls the provider **with the city's published coordinates**, never the user's. The first adapter is AlAdhan: `GET https://api.aladhan.com/v1/calendar/{year}/{month}?latitude=…&longitude=…&method=…&school=…&calendarMethod=HJCoSA`. One call returns every day of the month: the timings, plus each day's Hijri day, month number and year.
4. Normalizes the result to UTC instants and numeric Hijri parts, stores it in R2 and the edge cache, and returns it.

**Fixed windows.** The only window is a Gregorian calendar month, `month=YYYY-MM`, from the previous month to 12 months ahead. Any other shape, such as a free date range, is rejected with `400`, so callers can't mint new cache keys to bypass the cache. The device picks the day locally from the month, and fetches the neighboring month near a month edge or when a Hijri shift crosses one.

**Key fan-out.** Keys are cities × 14 months × enabled methods × 2 Asr choices. In practice almost every request uses the city's default method and standard Asr, so the live key count is close to cities in use × 2 months.

### Protecting the provider

AlAdhan publishes no rate limit or SLA; community reports put it near 12 requests per second per source IP. The Worker protects it and itself:

- **Outbound cap.** Every provider call takes a slot from a gate in the search D1 (`prayer_provider_gate`): at most 4 calls in flight and 5 starts per second (admin-editable), using the same lease-and-window pattern as the upload rate limits. Over the cap, a request waits up to 2 s, then gets the stale copy or `503`. The gate is touched only on a cache miss. (A new Durable Object was considered; it needs a Durable Object migration, which the release's versions-upload promote cannot apply.)
- **Request coalescing.** Within one Worker isolate, concurrent misses for the same key share one in-flight promise. Across isolates, the first miss takes a per-key lease row (`INSERT … ON CONFLICT DO NOTHING`); the others wait for the cache to fill, so one cold key makes one upstream call.
- **Backoff.** A `429` or `5xx` honors `Retry-After`, else backs off exponentially from 2 s up to 5 minutes; the next allowed time is stored on the gate row.
- **Circuit breaker.** Five consecutive failures open the circuit for 60 s (state on the gate row). While open, the Worker serves the last-good copy or the error below and makes no upstream call. One probe call half-opens it.
- **Inbound limit.** A per-IP rate limit using the existing rate-limit binding, with no raw IP stored.

### Outages

If no known answer exists, the route returns a bilingual `503 prayer_provider_unavailable` (server-written message, O40). It never invents, interpolates or computes times as a fallback. A stale cached month is served with `stale: true`.

### Pluggable provider

Adapters implement one interface (`fetchMonth(city, month, method, asr) → normalized month`). Admins choose the active adapter on the Islamic experience settings page. A later adapter may be a self-hosted AlAdhan container or another API; each needs conformance tests against the same golden months before it can be selected. The adapter is part of the cache key, so answers from two providers never mix.

### Hijri date (E21-D2)

- The Hijri day, month number and year come from the same provider response and cache, from AlAdhan's `HJCoSA` calendar (High Judicial Council of Saudi Arabia). Admins can switch the source to AlAdhan's `UAQ` (Umm al-Qura); the source is part of the cache key.
- Viewers who show Hijri dates without choosing a city use `GET /api/v1/hijri?month=YYYY-MM`: the same proxy, gate and cache, backed by AlAdhan's `gToHCalendar` endpoint.
- The device only applies the viewer's personal shift of −2, −1, 0, +1 or +2 days. There is no Hijri computation on any platform, and the scheduling-calendar converters are not reused for viewer dates.
- Dates are formatted from the numeric parts, never from the provider's text: month names come from our own en/ar strings, and the shared formatter writes the digits (٠–٩ in Arabic, followed by «هـ»).
- `/credits` and native Credits credit AlAdhan / Islamic Network for prayer times and the High Judicial Council of Saudi Arabia (or Umm al-Qura, when selected) for the Hijri calendar.

### Terms (pre-launch step)

AlAdhan's [terms](https://aladhan.com/credits-and-terms) (updated 13 November 2026) say the service is free and offered without any warranty. They say nothing about server-side caching, commercial use, rate limits or redistribution, so **caching is not explicitly covered**. Before `prayerTimes` or `hijriCalendar` is turned on in production, we ask Islamic Network in writing (through their contact page) for permission to cache server-side and to use the API in a commercial-capable service, and record the answer and date here. If they refuse, the adapter switches to a self-hosted instance of their open-source stack before launch.

### City selection (E21-D3)

- The viewer picks a city with a **live autocomplete** over a bundled city catalogue (GeoNames, CC BY 4.0, credited in Credits). The search runs on the device and sends nothing.
- An optional **Use my location** button asks for location permission only when pressed, finds the nearest catalogue city on the device, and discards the coordinates. The button says so: "Your location stays on this device. We only save the city."
- Only the city id leaves the device. For signed-in viewers it syncs through `profile.islamic.cityId`. No coordinates, IP-based guess or location history is stored.

### Qibla

Qibla is a great-circle bearing from the chosen city's coordinates, clockwise from true north, computed on the device (MIT Adhan-family libraries). It is neither a prayer time nor a Hijri date, so E21-D2's "no local computation" rule does not apply to it. A numeric bearing works everywhere; a live needle needs a separate compass action.

### Religious boundary

Prayer and Hijri results are provider calculations, not a mosque announcement or a ruling. A calculated Ramadan or Eid date never claims a confirmed moon sighting. Admins can publish a season override with a bilingual source label.

## 4. Product behavior

### 21.1 Prayer times, reminders, auto-pause and Qibla

- Settings: city (autocomplete and **Use my location**), method (automatic per country or explicit), **Asr method** (standard or Hanafi), per-prayer minute adjustments, per-prayer reminders (off; 10 minutes before when first enabled) and per-prayer auto-pause (off).
- A prayer card shows the five prayers and sunrise, the next prayer and a countdown. The detail view names the method, the provider credit and the adjustments.
- Adjustments are applied on the device, so they never fragment the shared cache.
- A downloaded month stays available offline on that device. With no known answer, the card shows a clear error, never invented times.
- Auto-pause works on video, background audio and Picture in Picture only on a device where it is on. It pauses once per prayer and shows a **Time for salah** card with **Resume later** and **Dismiss**. It never plays adhan audio and never resumes by itself.
- Web reminders need a notification permission the viewer grants by a button. Native reminders are local notifications. Time-zone and daylight-saving changes reschedule them.
- Qibla has its own switch. Sensor problems use inline UI, never browser `alert` or `confirm`.

### 21.2 Hijri date and seasons

- Any viewer can show a secondary Hijri date wherever a full date appears. Gregorian stays the stored value and sort key.
- Ramadan mode is opt-in and appears only during the active season (provider Hijri month 9, or an admin override). It shows Maghrib/ifṭar and Fajr/suhoor markers from 21.1 and admin-curated rails (videos, playlists, live channels). An empty rail disappears.
- Dhul-Hijjah's first ten days and an opt-in Jumu'ah reminder use the same season and reminder plumbing.
- Admins curate bilingual season titles, descriptions, rails, start/end overrides and a source label. Overrides are audited. Outside a season, nothing seasonal shows.

### 21.3 Scholar label (E21-D4)

- Only admins grant or remove the label, on the existing channel page in admin. Both actions need a **reason** (required, up to 500 characters) and record actor, time and reason in `channel_verification_log`.
- When granting, the admin picks the kind: **Scholar** or **Institution**.
- The public badge opens a small detail: "Verified scholar" or "Verified institution", "by Al Ummah Now", and the date. It is not an endorsement of every video or opinion. The reason is never public.
- The existing `verified=true` search filter stays. Removing the label updates the badge and the search index through the existing repair path.
- There is no application, evidence upload, review queue or channel-side request. The label is an existing feature, so it gets no new feature switch.

### 21.4 Recitation references

- A creator can add human-supplied reciter names in English and Arabic and an optional riwayah to a video. They are never inferred from ASR.
- `GET /api/v1/videos/:videoId/recitation` returns the reciter metadata and the confirmed recitation spans from the video's published caption tracks: references and cue times only. No Quran or ASR text is stored or returned.
- The player shows the reference, links to the official text through the existing Quran APIs with the short credit, and supports a deep link such as `?quran=67:1-5` that seeks to the confirmed start. An invalid or unavailable reference opens the video normally.

### 21.6 Intentional viewing (E21-D7)

- **Autoplay is off by default for new and signed-out viewers.** A signed-in viewer's existing explicit choice is preserved (§5.1). This applies on every platform and is not behind a switch.
- An optional daily viewing-time reminder is off until the viewer picks a limit. It counts foreground watch time and shows one neutral card per day. It never locks playback.
- A finite session from a playlist or a rail ends with a **Session complete** card (**Finish**, **Choose another video**); it never starts Up next.
- Lamahat can be a finite daily stack ending in **You're all caught up** after the admin-set count.
- No streaks, loss aversion, watch-time badges or "don't break your streak" copy, in any language or app.

### 21.8 Private notes (E21-D9)

- A signed-in viewer adds a note at the **exact current time** of a video, with an optional end time and plain text (up to 2,000 characters).
- Each video shows its notes as a list ordered by time. Tapping a note seeks to its start.
- Library → Notes lists the viewer's notes by most recent; notes never appear in public search, recommendations or creator analytics.
- **Export is Markdown only**: video title, link, timestamps (with `?t=` links) and note text, generated on demand and not stored.
- Notes are kept until the viewer deletes them (one or all) or deletes the account. They are included in the GDPR account export and erased with the account; [Deletion, erasure and cleanup](../guides/data-lifecycle.md) gains a Notes row when 21.8a ships.
- Sync is simple **last write wins** per note by `updatedAt`. A delete is a tombstone that syncs.

## 5. Data model and API

New relational data lives in the existing search D1 with explicit indexes and keyset cursors. No full-table scan, no per-viewer cron, no unindexed `LIKE`. Timestamps are ISO UTC.

### 5.1 Preferences

```text
profile.islamic (private profile record, synced for signed-in viewers):
  version, cityId | null, calculationMethod ('auto' | method id),
  asrMethod ('standard' | 'hanafi'), adjustmentsMinutes {fajr..isha},
  hijriEnabled, hijriShiftDays (-2..2), ramadanMode, jumuahReminder
profile.intentional:
  dailyLimitMinutes | null, finiteLamahat
profile.playback:
  autoplayNext, autoplayNextSetByUser
device-local only:
  reminder and auto-pause choices per prayer, notification and compass
  permission state, lastTriggeredPrayerDate, downloaded months
```

- `GET` / `PUT /api/profile/islamic` (optimistic `version`; reachable while any of `prayerTimes`, `qibla`, `hijriCalendar` or `ramadanMode` is on); `GET` / `PUT /api/profile/intentional` (`intentionalViewing`).
- **Autoplay migration (E21-D7), no bucket scan:** a stored boolean `playback.autoplayNext` without the flag counts as an explicit choice and is kept; the flag is written on the next save. A profile with no stored value reads `autoplayNext: false, autoplayNextSetByUser: false`. Every `PUT` sets the flag. Signed-out local keys follow the same rule: a stored value is kept, no value means off.

### 5.2 Prayer and Hijri

- `GET /api/v1/prayer-times?city=<id>&month=YYYY-MM&method=<auto|id>&asr=<standard|hanafi>`: anonymous, `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`. Returns the city's public name, coordinates and time zone, the resolved method and Asr, the provider and Hijri source with credits, `stale`, and one row per day: UTC instants for fajr, sunrise, dhuhr, asr, maghrib and isha, plus `hijri: {day, month, year}`.
- `GET /api/v1/hijri?month=YYYY-MM`: same caching; one row per day with `hijri: {day, month, year}`.
- `GET /api/v1/prayer-cities?ids=…`: public names for synced city ids. The catalogue itself ships in the apps and as a static, versioned file.
- R2 last-good keys: `prayer/<provider>/<hijriSource>/<method>/<asr>/<cityId>/<YYYY-MM>.json`; per-key reads only.
- Provider gate tables (search D1; written only on a cache miss):
  - `prayer_provider_gate(provider PRIMARY KEY, window_start_ms, window_count, failures, open_until_ms, probe_until_ms, next_allowed_ms, updated_at)`: one row per adapter. The per-second window and the breaker are single-row conditional `UPDATE … RETURNING` statements. The half-open probe is claimed atomically: `UPDATE … SET probe_until_ms = now + 10 s WHERE open_until_ms <= now AND probe_until_ms <= now AND failures >= 5 RETURNING`, so exactly one isolate probes.
  - `prayer_fetch_leases(cache_key PRIMARY KEY, lease_id, expires_at_ms)` with index `(expires_at_ms)`. A lease lasts 15 s. `INSERT … ON CONFLICT (cache_key) DO UPDATE SET lease_id = excluded.lease_id, expires_at_ms = excluded.expires_at_ms WHERE prayer_fetch_leases.expires_at_ms <= now` takes over an expired lease, so a dead isolate never wedges a key. In-flight calls are counted on the `expires_at_ms` index, never the whole table. A takeover overwrites the expired row for that key in place; releasing a lease also deletes every expired row through the `expires_at_ms` index.

### 5.3 Seasons

`islamic_seasons(id, kind, title_en, title_ar, description_en, description_ar, source_en, source_ar, starts_on, ends_on, state, version, created_at, updated_at, deleted_at, purge_after)` with index `(state, starts_on, id)`, and `islamic_season_items(season_id, position, item_type, item_id)` with primary key `(season_id, position)`. Public `GET /api/islamic/season?date=YYYY-MM-DD` returns the active published season and its ordered item ids. Admin CRUD lives under admin-api; deletes are soft with a 30-day purge.

### 5.4 Scholar label

`channel_verification_log` gains `kind`, and `note` becomes the required reason. Channel responses gain `verification: { kind, verifiedAt }` only while verified.

### 5.5 Recitation

Optional `recitation.reciter: { name: string, nameLocalized?: { en?, ar? }, riwayah? }` on the video record, as built in [#1815](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1815). `PUT /api/v1/videos/:videoId/recitation-metadata` needs `video.edit` and the channel owner's tier entitlement `recitationMetadata`.

### 5.6 Notes

`video_notes(id, user_id, video_id, start_ms, end_ms, body, created_at, updated_at, deleted_at)` with indexes `(user_id, video_id, start_ms, id)` and `(user_id, updated_at, id)`.

- `GET /api/library/notes?videoId=&cursor=` (ordered by `start_ms`); `GET /api/library/notes?since=&cursor=` or `?sync=true` (sync, ordered by `updated_at`, tombstones included); `GET /api/library/notes` (Library, most recent first).
- `POST /api/library/notes` (a client-chosen id makes offline retries safe); `PUT /api/library/notes/:id` (last write wins on `updatedAt`); `DELETE /api/library/notes/:id`; `DELETE /api/library/notes?videoId=` (all, or one video's).
- `GET /api/library/notes/export.md?videoId=&lang=` returns Markdown.
- The per-user note limit is `notesMax` on the creator tiers (new sign-ups get the admin-chosen default tier; an account with no assignment resolves to the Free tier), checked with an indexed count bounded by the limit.
- Account export includes notes; account erasure deletes every row for the user.

## 6. Feature switches and tiers

Each key below is in `FEATURE_REGISTRY`, mapped in `FEATURE_ROUTES`, computed in `/api/me/features`, and **off by default** in an **Islamic experience** group on the Features page. Off means no route, nav item, player control, help entry or empty state, and `404 feature_off` from the server.

| Switch | Ready when | Who |
|---|---|---|
| `prayerTimes` | City catalogue, provider adapter, gate and cache configured; AlAdhan's written answer recorded | All viewers; reminders and pause are per device. No creator-tier gate. |
| `qibla` | City catalogue | All viewers |
| `hijriCalendar` | Provider adapter configured; AlAdhan's written answer recorded | All viewers |
| `ramadanMode` | Needs `hijriCalendar` and `prayerTimes`; a published season | All viewers opt in; curation is staff-only |
| `recitationTools` | Fresh Quran Foundation copy | Reading for all; metadata editing needs the per-tier `recitationMetadata` entitlement and `video.edit`. Super-admin switch because it carries QF terms. |
| `intentionalViewing` | Nothing to set up | All viewers |
| `studyNotes` (Private notes) | D1 migration | Signed-in viewers; the note limit is the tier's `notesMax` (creator tiers apply to every account). After a downgrade, existing notes stay readable, editable, exportable and deletable. |

The autoplay default (E21-D7) and the scholar label (E21-D4) change existing features and have no switch.

One **Islamic experience** settings page in videos admin holds the provider adapter and Hijri source, gate limits, per-country method defaults, per-key cache purge, season curation, and links to tier settings. Every localized field has English and Arabic. Code never checks a tier by name.

## 7. Stories

Server first, then admin, web and native. One PR each. Visual stories need the screenshot audit; every PR needs a cross-provider review PASS.

| Story | Scope | Repo | Type / depends on |
|---|---|---|---|
| 21.0 | Feature keys, routes map, `/api/me/features`, off-state tests ([#1807](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1807)) | AlUmmahNow | Non-visual |
| 21.1a | City catalogue, AlAdhan adapter, D1 provider gate (cap, coalescing leases, backoff, breaker), month cache with R2 last-good, prayer and Hijri routes; mocked provider tests | AlUmmahNow | Non-visual; 21.0 |
| 21.1b | `profile.islamic` preferences API with synced `cityId` | AlUmmahNow | Non-visual; 21.0 |
| 21.1c | Admin Islamic experience settings: adapter, Hijri source, gate limits, country defaults, cache purge, credits | AlUmmahNow | Visual; 21.1a |
| 21.1d | Web settings (city autocomplete, Use my location), prayer card, reminders, player pause, Qibla, Credits | AlUmmahNow | Visual; 21.1b, 21.1c |
| 21.1e | Core: city catalogue lookup, nearest city, Qibla, API models | AlUmmahNowCore | Non-visual; 21.1a |
| 21.1f / g / h | Apple / Android / Desktop prayer settings, card, local notifications, player pause, Qibla, Credits | Apple, Android, Desktop | Visual; 21.1e |
| 21.2a | Seasons data, public season API, audited admin API | AlUmmahNow | Non-visual; 21.1a |
| 21.2b | Admin season editor | AlUmmahNow | Visual; 21.2a |
| 21.2c | Web Hijri labels, Ramadan and Dhul-Hijjah rails, Jumu'ah reminder | AlUmmahNow | Visual; 21.2b, 21.1d |
| 21.2d / e / f | Apple / Android / Desktop Hijri and seasons | Apple, Android, Desktop | Visual; 21.2a, 21.1f–h |
| 21.3a | Required reason and scholar/institution kind on grant and removal; public `verification` field | AlUmmahNow | Non-visual |
| 21.3b | Admin grant/remove dialog with reason and kind; web badge detail | AlUmmahNow | Visual; 21.3a |
| 21.3c | Native badge detail | Apple, Android, Desktop | Visual; 21.3a |
| 21.4a | Reciter metadata and recitation references API ([#1815](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1815)) | AlUmmahNow | Non-visual; 21.0 |
| 21.4b | Studio reciter fields; web recitation line and `?quran=` deep links | AlUmmahNow | Visual; 21.4a |
| 21.4c | Native recitation line and deep links | Apple, Android, Desktop | Visual; 21.4b |
| 21.6a | Autoplay off by default with explicit-choice migration (`/api/profile/playback`) | AlUmmahNow | Non-visual |
| 21.6b | `profile.intentional` API (daily limit, finite Lamahat) | AlUmmahNow | Non-visual; 21.0 |
| 21.6c | Web autoplay default, daily reminder, session-complete card, finite Lamahat | AlUmmahNow | Visual; 21.6a, 21.6b |
| 21.6d | Native autoplay default and finite viewing | Apple, Android, Desktop | Visual; 21.6a, 21.6b |
| 21.8a | Notes table, API, Markdown export, GDPR export and erasure, data-lifecycle guide | AlUmmahNow | Non-visual; 21.0 |
| 21.8b | Web notes in the player and Library | AlUmmahNow | Visual; 21.8a |
| 21.8c | Native notes | Apple, Android, Desktop | Visual; 21.8a |
| 21.9 | Wiki status evidence and registry with merge SHAs | AlUmmahNowWiki | Non-visual |

## 8. Platforms

- **Web:** server pages read features; prayer months come from the city proxy and are cached on the device; the city autocomplete, Qibla, Hijri shift, adjustments and reminders run in the browser.
- **Videos admin:** Features rows from the shared registry; the Islamic experience settings page; season editor; scholar label dialog.
- **Apple:** SwiftUI on iPhone, iPad, Apple TV and Mac. AVKit pause. TV shows prayer times and a numeric Qibla, no compass.
- **Android:** Compose on phone, tablet and TV. Media3 pause. Local notifications.
- **Desktop:** Windows WinUI 3 and Linux GTK 4 through Core; macOS uses the Apple app.
- **Core:** city catalogue, nearest-city lookup, Qibla, API models and error envelopes. No prayer or Hijri calculation.

## 9. Tests

1. **Prayer proxy:** mocked provider only. Golden months for Makkah, Cairo, London, New York, Kuala Lumpur, Karachi, Tromsø and Sydney; DST and month edges; `auto` method resolution; rejected non-month windows; coalescing (N parallel cold requests make 1 upstream call); cap; `429` with `Retry-After`; breaker open and half-open; stale serve; `503` with no cache; no cookies, user id or client IP in upstream calls or logs.
2. **Hijri:** numeric parts only; shift −2…+2 across month edges; Arabic digits and month names from our strings.
3. **Quran:** no Quran or ASR text in recitation responses; a stale QF copy hides text; credits present.
4. **Off-state:** every key returns `404 feature_off` in en/ar; no entry point or hollow page.
5. **Prayer pause:** fake clock and time zones; one trigger per prayer per day; no auto-resume.
6. **Scholar label:** reason required; kind required on grant; audit row; badge detail; search index repair.
7. **Autoplay:** legacy explicit true and false kept; a missing value reads off; signed-out default off.
8. **Notes:** owner-only access, order by time, last write wins, tombstones, tier limit, Markdown escaping, account export and erasure.
9. **Localization and accessibility:** en/ar, RTL, «،», ٠–٩ through shared formatters, keyboard and screen reader.
10. **Visual evidence:** production-build screenshots in en/ar × light/dark × desktop/phone in `review-shots/E21/<date>/head-<sha>/`, audited before merge.

## 10. Costs

Prices are Cloudflare's published prices beyond the included amounts.

- **Provider:** AlAdhan charges $0 and needs no key.
- **Per view:** prayer and Hijri reads are edge-cache hits after the first request per key. A miss costs one Worker request ($0.30 per million), about four D1 row writes for the gate and lease ($1.00 per million rows) and one R2 write ($4.50 per million).
- **At scale:** 10,000 cities in use × 2 months × 1.2 method mix ≈ 24,000 upstream calls a month: R2 writes ≈ $0.11 and gate writes (about 96,000 rows) ≈ $0.10, so ≈ **$0.21/month**. R2 storage at about 4 KB per month-file ≈ 0.1 GB ≈ **$0.0015/month**. One million viewer requests a month that miss the edge cache add about **$0.30**.
- **Per video:** recitation references add one optional search-D1 column; no new per-video processing.
- **Notes:** about 300 bytes per note in D1; 1 million notes ≈ 0.3 GB ≈ **$0.23/month** at $0.75/GB-month; reads use indexes.
- Qibla, adjustments, the Hijri shift and reminders run on the device: $0.
- No paid AI and no new paid service. The Costs page tracks Worker, R2 and D1 usage; a regression is stopped with the feature switch.

## 11. Legal, privacy and religious care

- Exact coordinates never leave the device. Only the city id syncs. The provider sees only our Worker and a public city coordinate. Raw IPs are not stored.
- AlAdhan's terms don't cover caching or commercial use; the written permission in §3 is a launch gate for `prayerTimes` and `hijriCalendar`. Credit AlAdhan and the Hijri source on `/credits`. Plan for no SLA.
- GeoNames city data is CC BY 4.0, credited in Credits.
- Prayer and Hijri methods differ. Show the method and adjustments, allow overrides, and never shame a viewer for dismissing a reminder.
- Compass sensors can be wrong. Say whether the needle uses true or magnetic north and give calibration help.
- The scholar label states who granted it and when, not an endorsement of every opinion. The reason stays internal.
- Notes are private personal data: never used for recommendations, analytics or public pages; covered by GDPR export and erasure.
- QF developer terms, freshness and attribution apply to every client.

## 12. Owner decisions (all final, 2026-11-23)

### E21-D1 — Prayer times

**Decided:** an online API through our anonymous, cached city proxy (§3). The device sends only city, month, method and Asr. The Worker calls AlAdhan first with the city's coordinates and caches per city and fixed month window. The provider is pluggable. An outage serves the cache or a clear error, never invented times. Includes the outbound cap, coalescing, backoff, circuit breaker, fixed windows, and the pre-launch written OK from AlAdhan. Resolves wiki [D7](decisions.md#d7-prayer-time-data).

### E21-D2 — Hijri date

**Decided:** from the same API and cache. The device only applies the viewer's ±1–2-day shift; no local Hijri computation on any platform. Credit the upstream Hijri source. Format from the numeric parts, with ٠–٩ in Arabic.

### E21-D3 — City

**Decided:** a live autocomplete over a bundled city list, plus an optional **Use my location** button that finds the nearest city on the device. Only the city id leaves the device, and it syncs for signed-in viewers.

### E21-D4 — Scholar label

**Decided:** granted and removed by admins only, with an audit and a reason. No application, evidence or review flow.

### E21-D5 — Learning paths

**Dropped.** Playlists cover them.

### E21-D6 — Ayah repeat and A–B loop

**Dropped.**

### E21-D7 — Autoplay default

**Decided:** off by default for new and signed-out viewers; existing explicit choices are preserved.

### E21-D8 — Content filters

**Dropped:** the instrument-free and madhab filters, and a new instruction-language preference. The existing search and Explore language filters stay as they are.

### E21-D9 — Private notes

**Decided:** exact-time bookmarks with an optional end time, a list per video ordered by time, and tap to seek. Markdown export only. Kept until the viewer deletes them or the account; covered by GDPR export and erasure. No highlights, colors, caption or Quran highlights, or per-field merge; simple last write wins.

## Decisions and constraints

- [D7](decisions.md#d7-prayer-time-data): prayer-time data, resolved by E21-D1.
- [QF1](decisions.md#qf1-quran-foundation-content-use): Quran Foundation content use.
- [O39](decisions.md#o39-one-features-page-server-enforced) and [O40](decisions.md#o40-server-written-error-messages): one Features page, server enforcement, localized errors.
- [T1](decisions.md#t1-plans-are-admin-managed): admin-managed tiers; no tier names in code.
- [O35](decisions.md#o35-arabic-uses-eastern-arabic-hindi-numerals) and [O38](decisions.md#o38-numbers-never-grouped-in-arabic-counts-compact-from-1000): Arabic number and date formatting.
- Payments are not part of this epic; never Stripe.

## Status evidence

- 2026-11-08: source epics imported in AlUmmahNow [#309](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/309).
- 2026-11-21: the admin verification endpoint and badge exist from [#367](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/367) and [#382](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/382).
- 2026-11-23: QF short credit and `/credits` merged in [#1767](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1767) (`c6bb9e66ea6e17668cbc3b8cc87060237bde7f44`).
- 2026-11-23: owner decisions E21-D1 to E21-D9 made final; scope cut as listed under Goal.
- 2026-11-23: back-end PRs open: 21.0 [#1807](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1807), 21.4a [#1815](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1815), 21.6a [#1835](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1835), 21.8a [#1836](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1836), 21.1b [#1837](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1837), 21.1a [#1838](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1838), 21.2a [#1839](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1839), 21.6b [#1840](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1840).

## Sources

- [Original native-apps epic](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md), 21.1–21.8.
- [AUN-CAPTIONS](AUN-CAPTIONS-transcription-translation.md), [AUN-FEATURES](AUN-FEATURES-feature-switches.md), [Hidden when off](../guides/product-rules.md), [Numbers and dates](../guides/numbers-and-dates.md).
- [AlAdhan prayer-time API](https://aladhan.com/prayer-times-api), [Hijri calendar API](https://aladhan.com/islamic-calendar-api) and [terms](https://aladhan.com/credits-and-terms); [GeoNames](https://www.geonames.org/) (CC BY 4.0); [Adhan JS](https://github.com/batoulapps/adhan-js) (MIT, Qibla only). Local research: `research/prayer-times-2026-11-23.md`.
- [Quran Foundation attribution guidance](https://api-docs.quran.foundation/docs/tutorials/faq#what-attribution-or-copyright-information-should-i-show).
