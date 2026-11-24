[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# D1 capacity: growth model, monitoring and scaling plan

| | |
|---|---|
| **ID** | `AUN-D1-SCALING` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **planned**: spec only, no code yet |
| **Last updated** | 2026-11-24 (revision 6) |
| **Parent** | [AUN-SCALABILITY](AUN-SCALABILITY-scalability-audit.md) (in-memory state, lost updates, unbounded scans) |

> Owner (chat, 2026-11-24): "need to estimate the growth of all dbs and spec epics for scaling". This page:
> - lists every D1 database and table;
> - gives each database's current size;
> - projects size and peak load at 10k, 100k, 1M and 10M monthly active users (MAU);
> - says when each database reaches 70% and 100% of a Cloudflare limit;
> - lists the stories, in order of urgency, that keep every database inside its limits.
>
> [AUN-SCALABILITY](AUN-SCALABILITY-scalability-audit.md) made queries index-backed. This epic is about **how big** the databases get and **how fast** they are written.

## Summary

- **The notifications database runs out of room first.** One database holds three things:
  - the notification inbox;
  - the analytics counters, which are never purged;
  - the Popular viewer rows, kept 91 days.

  It reaches 70% of D1's 10 GB limit at about **28k MAU** and 100% at about **40k MAU**. Across every assumption we varied, 100% stays between 37k and 55k MAU.
- **Auth is second.** `audit_events` is never purged, and `token_usage` keeps 90 days. Auth reaches 70% at about **90k MAU** and 100% at about **129k MAU**. Auth is the sign-in database, so it must never get close.
- **Search is third.** It reaches 70% at about **122k MAU** and 100% at about **167k MAU**. This depends on caption search being on for most videos; without transcripts it reaches 100% at about 330k MAU.
  - Search is also the first database to hit D1's single-threaded **query** limit: 70% busy at about 1.6M MAU.
- **The other databases are fine.**
  - Reports reaches 100% at about 690k MAU.
  - CMS, costs and status never reach the limit, because they do not grow with users.
- **The plan.** Stories D1-1 to D1-6 cover monitoring, the inbox retention, the Popular viewer counts, the analytics hot window, the Auth audit retention and split, and the inbox shards. They are about one PR each.
  - Together they move the first limit from about 40k MAU to about 320k MAU, where the Auth audit database reaches 70%.
  - The notifications shards reach 70% at about 480k MAU with 4 shards.
  - Caption search reaches 70% at about 194k MAU, but only once caption search is on for most videos. D1-7 fixes that.

  Stories D1-7 to D1-10 cover 1M to 10M MAU.
- **Revision 4** (2026-11-24) applies the third review:
  - D1-3b deletes `analytics_active` rows only when they are folded, and re-archives days dirtied by late reports. Moves go through a transactional outbox (`analytics_moves`, AUTOINCREMENT ids, drained first on every run; revision 5);
  - D1-4 tombstones by upsert before redacting, gives erased D1 rows a random pseudonym, strips late events, and keys tombstones by `SHA-256(user_id)`;
  - audit retention is 395 days in total (90 in D1 + 305 in R2).
- **Revision 6** (2026-11-24) applies the fifth review. D1-3b now writes down invariants I1 to I5 as acceptance criteria:
  - the fold deletes an active row only if it is still clean (`dirty = 0`), and sums the monthly totals in SQL;
  - readers deduplicate parts by `move_id` and include rows not yet moved;
  - the outbox is fully drained before any new move, and backfills are capped.
- **Revision 3** (2026-11-24) applies the second review:
  - D1-3b finds each day's entities in a new `analytics_active` table instead of sweeping `analytics_daily` by day;
  - D1-4 redacts the D1 rows at erase, tombstones keys, adds wrap-key ids and HKDF-separated keys, and encrypts all personal metadata;
  - D1-1 stores the account total in its own table, leaving the `ops_*` CHECKs alone.
- **Revision 2** (2026-11-24) applies the cross-provider review of [wiki #243](https://github.com/Al-Ummah-Now/AlUmmahNowWiki/pull/243):
  - `discovery_viewers` is kept 91 days, not 8;
  - notifications and analytics row sizes now use the schema estimator (1.47 KB and 155 B);
  - D1-3 is split into D1-3a (Popular viewer counts) and D1-3b (analytics hot window, exact). D1-3b keeps every counter exact and leaves post and site counters untouched;
  - the D1-2 cap works with the set-based fan-out;
  - D1-4 now covers the Auth count scans, its own archive job and erase without scanning R2;
  - D1-1 now covers the CHECK constraints and the account-wide database list.

## Cloudflare limits used

Read on 2026-11-24. The page dates are Cloudflare's "last modified" dates.

| Limit (Workers Paid) | Value | Source |
|---|---|---|
| Database size | **10 GB** per database (cannot be raised) | [D1 limits](https://developers.cloudflare.com/d1/platform/limits/) (2026-11-20) |
| Storage per account | **1 TB** (can be raised on request) | same |
| Databases per account | 1,000,000; the first 100,000 included | same |
| Throughput | "Each individual D1 database is inherently single-threaded, and processes queries one at a time." At 1 ms per query that is at most about 1,000 queries per second. When the queue is full, D1 returns "overloaded". | same |
| Query duration / result size | 30 s / 50 MB | same |
| Queries per Worker invocation | 1,000; a `batch()` counts as one | same |
| Rows read / rows written | No hard cap; they are billing metrics. Rows written: 50M a month included, then $1.00 per million. Every index on a written column adds a written row. Rows read: 25 billion a month included, then $0.001 per million. | [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) (2026-10-30) |
| Storage price | 5 GB included, then $0.75 per GB-month | same |
| Read replication | Read-only replicas in every region at no extra cost. Writes still go to the primary. It needs the Sessions API (bookmarks give read-your-writes). It works through the Worker binding only, not the REST API. | [Read replication](https://developers.cloudflare.com/d1/best-practices/read-replication/) (2026-08-10) |
| Analytics Engine | 250 data points per invocation; 20 blobs and 20 doubles per point; **data kept 3 months**. 10M points a month included, then $0.25 per million; billing has not started yet. | [AE limits](https://developers.cloudflare.com/analytics/analytics-engine/limits/), [AE pricing](https://developers.cloudflare.com/analytics/analytics-engine/pricing/) (2026-04-23) |
| Durable Objects (SQLite) | 10 GB per object; unlimited per account; soft limit of 1,000 requests per second per object | [DO limits](https://developers.cloudflare.com/durable-objects/platform/limits/) (2026-11-13) |
| Queues | 5,000 messages per second per queue; batches of up to 100; messages up to 128 KB | [Queues limits](https://developers.cloudflare.com/queues/platform/limits/) (2026-10-30) |

Because D1 is single-threaded, each database has only one second of query time per second. In this page, **busy share** is peak queries per second × average query time ÷ 1 second. Above 70% busy, tail latency climbs and "overloaded" errors start.

## Databases today

Measured on 2026-11-24, read-only:
- sizes from `wrangler d1 info` metadata;
- 12 days of history from the cost-monitor's `ops_daily`.

No query touched a production data table. `sqlite_stat1` is absent, so per-table row counts are **not** measured. They come from the model below. Raw data and scripts are kept outside the wiki (`research/d1-growth-2026-11-24`).

| Database | Bound by | Tables | Prod | Stage | QA | Prod growth, Nov 12–24 |
|---|---|---|---|---|---|---|
| `al-ummah-now-search` | api-videos, admin-api, processor | 127 (161 in QA) | 3.1 MB | 14.0 MB | 167.5 MB | +1.7 MB |
| `al-ummah-now-notifications` | api-videos, processor | 23 | 0.56 MB | 1.1 MB | 18.5 MB | +0.2 MB |
| `al-ummah-now-d1` (Auth) | Auth auth, admin, profile, audit-consumer; api-videos | 40 | 6.25 MB | 32.4 MB | **343.9 MB** | flat (purges) |
| `al-ummah-now-reports` | admin-api, processor | 51 | 1.8 MB | 8.8 MB | 79.1 MB | +1.1 MB |
| `al-ummah-now-costs` | cost-monitor, admin-api | 14 | 4.8 MB | 1.5 MB | 1.5 MB | +4.5 MB (levels off at about 150 MB: 396-day retention) |
| `al-ummah-now-cms` | CMS | 41 | 0.53 MB | 4.4 MB | 5.6 MB | flat |
| `al-ummah-now-status` | status, admin-api | 9 | 0.16 MB | 0.16 MB | 0.16 MB | flat |

Notes:
- Production is still small: about 460 video objects in R2. Every number at scale below comes from the model.
- **QA Auth is the largest and busiest database in the account.** Over 24 hours it served 357k read queries and read 513M rows, and its 7-day p99 latency was 274 ms. E2E sign-ins drive this. [QA tests only on releases](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1190) and the QA account cleanup ([AlUmmahNowAuth#504](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/504)) already address it. D1-1 makes such growth visible on its own.
- `al-ummah-now-videos` is empty (0 tables) and bound nowhere, so it is a cleanup candidate. The two `*-preview` databases have no traffic.
- A few databases of other projects share the account, about 80 MB in total. They count only toward the 1 TB account limit (see D1-1).
- p50 query time is 0.15 to 0.5 ms on every production database.
- Where the large data lives:
  - **R2:** videos, comments (`comments/<id>/…`) and watch history (548 days), so they never reach D1.
  - **Durable Object (`VIEW_COUNTER`):** live view counts, flushed to the index.

## Table inventory

**Bytes per row** includes every index entry, including the primary-key index, and page overhead. It is estimated from the schema (column names, types, typical lengths) by the same estimator for every table. It is roughly ±50%, and was checked against production search: about 7 KB per video. The model uses these same figures.

**Writes per event** counts rows written, including one extra row for each index on a written column, which is how D1 bills.

The full per-table list (all 307 tables) is in [Appendix: every table](#appendix-every-table). The tables below drive growth. Config and catalog tables (settings, tiers, rules, themes, templates, staff) stay below a few MB at any scale.

### Notifications database (`al-ummah-now-notifications`)

| Table | Purpose | Bytes/row | Growth driver | Writes per event | Retention today |
|---|---|---|---|---|---|
| `notifications` | per-user inbox | ~1,470 (primary key + 7 secondary indexes, 3 of them partial) | per subscriber × upload or live (bell `all`, or `highlights` for highlighted uploads) | ~9 per notification | 90 days |
| `analytics_daily` | daily counters per video, channel, post and site (views, watch time, traffic, source, surface, device, country, retention buckets; post likes, poll votes and options, post views; site visits and clicks) | ~155 (WITHOUT ROWID) | per active video-day: ~25 rows; per active channel-day: ~40 | ~12 upserts per view after batching (CounterBatch sums repeats) | **none** |
| `discovery_viewers` | salted viewer hash per day and video; the Popular rail counts distinct viewers per video and day | ~112 | per distinct viewer-video-day | 1 per view | **91 days** (`POPULAR_PARAMS.days` + 1) |
| `liked_videos` | user likes | ~370 (3 indexes) | per like | 4 | none (user data) |
| `channel_subscribers`, `channel_subscriptions`, `channel_subscriber_counts` | subscriptions and counts | ~290 + 240 + 60 | per subscription | ~5 per subscribe | none (user data) |
| `post_likes`, `poll_votes`, `saved_posts` | community post state | ~200–330 | per action | 2–3 | none (user data) |
| `push_devices`, `notification_settings`, `notification_email_prefs`, `notification_seen` | devices and preferences | ~60–570 | per device or user | 2–3 | until removed |
| `live_reminders`, `review_alerts`, `dead_letters` | reminders, alerts, DLQ copies | ~200–1,000 | per reminder or failure | 2–3 | dead letters and review alerts by age |

### Search database (`al-ummah-now-search`, 127 tables in prod)

| Table | Purpose | Bytes/row | Growth driver | Writes per event | Retention today |
|---|---|---|---|---|---|
| `search_videos` + `search_videos_fts` (prefix 2,3) + `content_ownership` (18 indexes) + `media_*` rows | the index behind every list, search and Studio | **~7 KB per video**, measured | per video | ~60 rows per video write | while the video exists |
| `search_transcripts` + `search_transcripts_fts` | caption search, one row per cue | ~320 B + FTS; **80 KB per caption track** in the model (~300 cues; the estimate is 80–150 KB) | per captioned video × languages | ~3 per cue | **none** |
| `live_chat_messages` | live chat | ~1.1 KB (3 indexes) | per chat message | ~4 | removed or held: 30 days; published: **none** |
| `channel_comments` | the channel owner's comment inbox (mirror of R2 comments) | ~900 (5 indexes) | per comment | ~7 | none (deleted with the video) |
| `live_sessions`, `live_segments`, `live_events`, `live_qoe` | live operations | ~240–1,400 | per stream, segment or viewer sample | 2–4 | events and QoE by age; segments of ended sessions |
| `channel_audit`, `translation_audit`, `social_deliveries`, `workflow_*`, `admin_job_log` | logs | ~250–2,100 | per admin or creator action | 2–8 | channel_audit 365 days; job log trimmed; others none |
| `billing_*`, `support_*` (32 tables) | payments and the creator-support ledger | ~300–1,200 | per payment or event | 3–7 | kept (financial records) |
| `yt_import_*`, `import_*` | YouTube and Takeout imports | ~1–2.2 KB | per imported item | 5 | per import |
| `index_repairs`, `search_meta`, `search_tombstones`, `indexnow_pending` | index upkeep | ~90–460 | per failed write or change | 2 | drained |

### Auth database (`al-ummah-now-d1`)

| Table | Purpose | Bytes/row | Growth driver | Writes per event | Retention today |
|---|---|---|---|---|---|
| `users` | accounts (9 indexes) | ~1,060 | per account | ~10 per create; a sign-in updates `last_login_at` | until erased |
| `user_identities`, `webauthn_credentials`, `rbac_user_roles` | sign-in methods and roles | ~520–770 | per account, passkey or staff role | 4–5 | until removed |
| `audit_events` | security audit (sign-ins, admin actions, invites, revocations) | ~1,100 (5 single-column indexes: tenant, user, type, timestamp, severity; the insert runs a NOT EXISTS check) | per audited event (assumed 0.3 per DAU per day) | ~7 | **none** |
| `token_usage` | token analytics from the openauth audit queue | ~640 (5 indexes) | per issued or refreshed token (assumed 3 per DAU per day) | ~6 | 90 days (hourly cleanup, 1,000-row batches) |
| `browser_sessions`, `account_sessions`, `app_sessions`, `openauth_atomic`, `authorization_codes`, `password_codes` | sessions and short-lived state | ~230–850 | per session or code | 3–9 | by expiry or 7 days idle |
| `user_invites`, `moderation_requests`, `admin_deletions` | admin workflows | ~900–2,100 | per admin action | 5–7 | 30-day purge after soft delete |

### Reports database (`al-ummah-now-reports`)

| Table | Purpose | Bytes/row | Growth driver | Writes per event | Retention today |
|---|---|---|---|---|---|
| `error_events`, `error_groups`, `error_hourly`, `error_refs` | the admin Errors page | ~200–2,400 | per error report | ~7 | events 30 days; hourly and refs purged |
| `moderation_signals`, `moderation_actions` | AI and staff moderation | ~1,000–1,840 (10 indexes) | per upload or comment checked | ~11 | 365 days (AI rows) |
| `reports`, `content_reviews`, `content_review_findings` | user reports and pre-publication review | ~600–2,000 | per report or upload | 6–13 | findings by age |
| `newsletter_deliveries` | one row per subscriber per issue | ~420 | subscribers × issues | 3 | **none** |
| `admin_audit_log`, `site_settings_log`, `plan_audit_log` | admin audit | ~800–1,100 | per admin change | 4–5 | none (low volume) |
| `contact_messages`, `csam_*`, `user_warnings`, `creator_invites` | support and safety | ~600–2,100 | per case | 3–10 | soft delete, 30-day purge; CSAM per legal hold |

### CMS, costs and status

| Database | Largest tables | Driver | Retention |
|---|---|---|---|
| CMS | `posts`, `pages`, `feed_*`, `timeline_entries`, `translation_flags`, `ai_jobs` | editorial content, not users | ai_jobs and tokens by age; trash 30 days |
| costs | `ops_hourly` and `ops_daily` (~460 B) | resources × hours; resources grow with workers, not users | 396 days |
| status | `daily`, `incidents`, `subscribers`, `deliveries` | incidents and status subscribers | 90 days uptime, 14 days history |

## Growth model

### Assumptions

These are the inputs. Each one is a stated guess to be replaced by measured values from D1-1.

| # | Assumption | Value |
|---|---|---|
| G1 | Daily active users (DAU) ÷ MAU | 0.25 |
| G2 | Registered accounts ÷ MAU (counts inactive accounts) | 2.0 |
| G3 | Video views per DAU per day | 5 (sensitivity: 2.5 to 10) |
| G4 | Uncached page views per DAU per day (each about 1 search-DB query) | 20 |
| G5 | Creators (channels) ÷ MAU | 0.5% |
| G6 | Catalog per creator, including YouTube imports | 120 videos (sensitivity: 60) |
| G7 | New uploads per creator per month / live streams per creator per month | 8 / 2 |
| G8 | Videos with at least one view on a given day | the smaller of 15% of the catalog and 30% of the day's views |
| G9 | Captioned videos / caption tracks per captioned video | 50% / 1.5 |
| G10 | Accounts that subscribe / subscriptions each | 50% / 6 |
| G11 | Share of uploads and lives that reach a subscriber's inbox (bell `all`, or `highlights` for highlighted uploads) | 0.37 (sensitivity: 0.15) |
| G12 | Chat messages per stream (average): 10k / 100k / 1M / 10M MAU | 30 / 100 / 300 / 1,000 |
| G13 | Peak chat rate of the largest stream: 10k / 100k / 1M / 10M MAU | 2 / 10 / 60 / 400 messages per second |
| G14 | Comments per view / likes per view | 0.5% / 3% |
| G15 | Auth audit events per DAU per day / token_usage rows per DAU per day | 0.3 / 3 |
| G16 | Client error reports per DAU per day / reports per DAU per day | 0.02 / 0.0005 |
| G17 | Newsletter subscribers ÷ accounts / issues per month | 20% / 4 |
| G18 | Peak second ÷ average second (evening peak, Jumu'ah, Ramadan nights) | 4× |
| G19 | Average query time at scale: search / notifications / Auth / reports | 1.5 / 1.0 / 0.8 / 0.5 ms (today: 0.15–0.5 ms p50) |
| G20 | Horizon for tables that are never purged | 12 months at the milestone's scale. Tables with a retention window are at steady state. |
| G21 | `discovery_viewers` rows per day | one per view (distinct viewer, video and day), kept 91 days |

The derived volumes:

| MAU | DAU | Accounts | Creators | Catalog | Views per day | Inbox rows per day | Chat messages per day |
|---|---|---|---|---|---|---|---|
| 10k | 2.5k | 20k | 50 | 6k | 12.5k | 7.4k | 100 |
| 100k | 25k | 200k | 500 | 60k | 125k | 74k | 3.3k |
| 1M | 250k | 2M | 5k | 600k | 1.25M | 740k | 100k |
| 10M | 2.5M | 20M | 50k | 6M | 12.5M | 7.4M | 3.3M |

### Projected size per database

In GB. The share of the 10 GB limit is in brackets.

| Database | 10k MAU | 100k MAU | 1M MAU | 10M MAU | Largest part (at 100k) |
|---|---|---|---|---|---|
| notifications | 2.5 (25%) | **25.2 (252%)** | 252 | 2,520 | analytics_daily 52%, inbox 39%, discovery_viewers 5% |
| Auth | 0.8 (8%) | 7.7 (77%) | 77 | 774 | token_usage 56%, audit_events 38% |
| search | 0.5 (5%) | 5.6 (56%) | 82 | 1,746 | transcripts 64%, live chat 23% |
| reports | 0.2 | 1.5 | 14.5 | 145 | newsletter_deliveries 56%, moderation_signals 35% (at 1M) |
| cms / costs / status | < 0.2 | < 0.2 | < 0.2 | < 0.2 | does not grow with users |
| **Account total** (prod only) | 4 | 40 | 426 | 5,200 | Account storage passes 70% of 1 TB at about 1.6M MAU and 1 TB at about 2.2M MAU; the account limit can be raised on request |

### Peak load per database

| Database | 100k MAU: queries/s, busy | 1M MAU: queries/s, busy | 10M MAU: queries/s, busy | Peak rows written/s at 1M |
|---|---|---|---|---|
| search | 34, 5% | 300, **45%** | 2,900, **436%** | 264 |
| notifications | 12, 1% | 121, 12% | 1,210, **121%** | 1,068 |
| Auth | 7, 1% | 70, 6% | 700, 56% | 233 |
| reports | 2, 0% | 4, 0% | 12, 1% | 6 |

### Runway: when each database reaches a limit

MAU at which each database reaches the limit, with today's code. Each figure assumes 12 months at that scale for tables that are never purged.

| Database | 70% of 10 GB | 100% of 10 GB | 70% busy | 100% busy | First limit |
|---|---|---|---|---|---|
| **notifications** | **~28k** | **~40k** | ~5.8M | ~8.3M | size |
| **Auth** | ~90k | ~129k | ~12.5M | ~17.9M | size |
| **search** | ~122k | ~167k (~330k without caption search) | ~1.6M | ~2.3M | size, then query time |
| reports | ~483k | ~690k | — | — | size |
| cms, costs, status | never | never | — | — | — |

Sensitivity of the first limit (notifications, 100%):
- 37k MAU at 10 views per DAU;
- 41k MAU at 2.5 views per DAU;
- 52k MAU if only 15% of uploads reach the inbox;
- 53k MAU with 60 videos per creator;
- 55k MAU on a 6-month horizon.

None of these changes the order.

### Hot spots

| Hot spot | Where | Why it matters |
|---|---|---|
| Analytics counters | notifications `analytics_daily` | Never purged. About 25 rows per active video-day, plus channels, posts and the site. About 12 rows written per view. This is the largest single table by 100k MAU. At 1M MAU it is also about 450M rows written a month (about $400 a month at $1.00 per million). |
| Notifications inbox | notifications `notifications` | It fans out to every subscriber. The primary key plus 7 indexes make about 9 rows written per notification. It holds 9.8 GB at 100k MAU. |
| Popular viewer rows | notifications `discovery_viewers` | One row per view for 91 days: 1.3 GB at 100k MAU and 12.7 GB at 1M. The ranking job reads every row of the 91-day window on each run to count viewers per video and day. |
| Account events | Auth `audit_events`, `token_usage` | Never purged or kept 90 days, in the **sign-in** database. Two admin queries already scan it: `COUNT(*) FROM audit_events` in `getAuditStats` reads the whole table, and `getUserAuditTrail` counts and sorts every row of one user. Growth slows every sign-in query and makes purges risky (the 2026-11-13 sign-in stall). |
| Search index | search `search_*`, `content_ownership` | About 7 KB per video. It is fine to about 1.4M videos on its own. Its query time is the first throughput limit (~1.6M MAU). |
| Caption search | search `search_transcripts*` | About 80 KB per caption track. It is 64% of search by 100k MAU when captions are common. |
| Live chat | search `live_chat_messages` | Published messages are never purged. One large stream at 60–400 messages per second competes with search reads in a single-threaded database. |
| Watch history | R2 `watch-history` | Not in D1. No action. |
| Audit logs (admin) | reports `admin_audit_log`, search `channel_audit` | Low volume. channel_audit has a 365-day purge. No action beyond monitoring. |
| Newsletter deliveries | reports `newsletter_deliveries` | One row per subscriber per issue, never purged. Reports' largest table by 1M MAU. |

## Scaling options

The simplest change that keeps us safe comes first in each row.

| Option | Use for | Trade-offs | Migration cost |
|---|---|---|---|
| **TTL and purge** (batched `DELETE … WHERE id IN (SELECT … LIMIT n)` on an indexed time column) | notifications, audit_events, token_usage, chat, newsletter deliveries | Cheapest. It loses old detail unless archived first. Purges must be small batches on an index; never a scan on Auth. | Small: one cron, one index check |
| **Index trim** | notifications (two overlapping user/unread indexes) | Fewer rows written and less space. Each query plan must be re-checked. | Small |
| **Roll up raw rows into counts** | `discovery_viewers` (only per-video daily counts are read) | Exact for what is read. The raw rows only need to live until their day is closed. | Small: one job, one table |
| **Archive to R2** (JSON per entity and month, or NDJSON per hour, then delete from D1) | analytics days older than the hot window, audit_events after 90 days, ended streams' chat | R2 storage is cheap and objects are read by key. There is no SQL over the archive. Personal data in an archive needs an erase path that does not scan R2 (crypto-shredding, D1-4). | Medium: writer, reader and erase hook |
| **Analytics Engine** | not used for counters in this plan | Cheaper per write (1 data point per view, against about 12 D1 rows). But high-volume writes may be sampled (`_sample_interval`), data is kept only 3 months, and it is queried by the SQL API, not a binding. Our analytics promise exact counts ("Nothing is estimated", `apps/api-videos/src/lib/analytics.ts`), so AE would only suit rough dashboards. | Medium |
| **Split by feature** (a new database per table group) | audit out of Auth; transcripts out of search | Each database gets its own 10 GB and its own query time. There are no cross-database joins, so the readers must be split too. One more binding per worker. | Medium: dual-write, backfill in batches, read cutover, drop |
| **Shard by key** (N databases, `hash(user_id)` → slot → database) | notifications inbox, likes, subscriptions per user | Scales linearly. Cross-user queries (purge by age, delete by entity) fan out to N databases. A slot map, not plain modulo, makes resharding a slot move. | Large: router, fan-out, backfill |
| **Read replication + Sessions API** | search lists and search, CMS, read-heavy notifications | No extra cost, and reads scale across regions. Replicas lag, so writers pass a bookmark for read-your-writes. Binding only, not REST. | Small to medium: wrap the `SEARCH_DB` reads |
| **Queues for write batching** | already used for analytics (CounterBatch), audit (audit-consumer) and fan-out (pages of 1,000) | Turns many small writes into one transaction. It adds delay, so it is wrong for chat. | Small where a queue already exists |
| **Durable Objects for hot write paths** (SQLite in the object) | live chat per stream; the view counter already uses one | One object per stream absorbs about 1,000 requests a second, and its storage is per object (10 GB). Cross-stream queries need an index elsewhere. | Medium |
| **Dedicated search engine** | search, once D1 FTS no longer fits | Better relevance, typo tolerance and sharding. But it is a separate service with its own cost, and the index must be synced. | Large. See D1-10 for when. |

## Stories

These are ordered by urgency: the MAU at which the problem bites without the story. Each story is one PR unless it says otherwise. None of them changes what users see, so there are no user-facing feature switches.

- Cutovers (dual-write, then read switch) sit behind **admin ops settings**, so a rollback is a setting, not a deploy.
- Every story ships with tests on the local stack. Each test seeds its own data and cleans it up.
- No test or probe touches production.
- Purges and backfills run in small, indexed batches.
- Nothing scans the Auth database.

| Story | Repo | Fixes | Bites at (MAU) | After the story (70% / 100%) |
|---|---|---|---|---|
| D1-1 | AlUmmahNow (cost-monitor, admin) | visibility | now | alerts 60 days ahead |
| D1-2 | AlUmmahNow | notifications inbox size | ~28k | with D1-3a and D1-3b: notifications ~101k / ~145k |
| D1-3a | AlUmmahNow | `discovery_viewers` | ~28k | 1.3 GB → 0.1 GB at 100k MAU |
| D1-3b | AlUmmahNow | `analytics_daily` | ~28k | 13.2 GB → 0.7 GB at 100k MAU |
| D1-4 | AlUmmahNowAuth | Auth count scans, audit_events and token_usage retention | scans: now; size: ~90k | Auth ~265k / ~378k |
| D1-5 | AlUmmahNowAuth | the sign-in database holds only sign-in data | ~265k | Auth ~1.6M / ~2.2M; audit database ~319k / ~455k |
| D1-6 | AlUmmahNow | inbox, likes and subscriptions per user | ~101k | 4 shards: each ~480k / ~686k; main notifications ~657k / ~939k |
| D1-7 | AlUmmahNow | caption search | ~194k (once caption search is on) | own database, sharded by video when one fills |
| D1-8 | AlUmmahNow | live chat size and peak rate | 60 messages per second at ~1M | search ~734k / ~1.0M by size; chat off the search database |
| D1-9 | AlUmmahNow | search query time | ~1.6M (70% busy) | reads spread over replicas |
| D1-10 | AlUmmahNow | when to leave D1 search | ~1.4M videos | written triggers and a bench |

### D1-1 Capacity monitoring and alerts (first)

The goal is that admins hear about a database well before any limit. The work builds on the existing cost-monitor thresholds (`apps/cost-monitor/src/thresholds.ts`), which already turn a crossed rule into an Errors page needs-action item (`ops:<rule>:<resource>`) and resolve it on recovery.

- **Collector.** `graphql.ts` already reads `d1AnalyticsAdaptiveGroups` (queries, rows read and written, latency) and `d1StorageAdaptiveGroups` (`databaseSizeBytes`) into `ops_hourly` and `ops_daily`. Add:
  - **query time per hour:** the sum of query batch time if the dataset exposes it, otherwise requests × p50;
  - the **busy share:** query time ÷ 3,600 s.
- **Account-wide size.** Discovery (`discover.ts`) keeps only `isAlUmmahName` resources of the collected environments, which is right for per-resource metrics. The account total also counts other projects' databases, so it comes from a separate step:
  - one `GET /accounts/:id/d1/database` listing per hourly run (paged; `file_size` per database);
  - summed into a new table `d1_account_storage (hour TEXT PRIMARY KEY, bytes REAL, databases INTEGER)`, with no `env`, `kind` or resource columns, so the `ops_*` tables and their CHECKs stay as they are;
  - the listing never adds other projects' databases as resources and never stores their names;
  - kept 396 days, like `ops_hourly`.
- **Limits as settings.** Add these to `cost_settings`, so a Cloudflare change is a setting, not a deploy:
  - `d1.max_db_bytes` = 10 GB;
  - `d1.account_bytes` = 1 TB;
  - `d1.busy_warn` = 0.7.
- **New threshold metrics** in `ThresholdRule.metric`:
  - `storage_pct`: the latest stored bytes ÷ the limit;
  - `storage_days_to_70`: a linear fit of 14 days of daily maximum size, giving the days until 70%;
  - `busy_pct`: the hourly busy share;
  - `account_storage_pct`: the account total ÷ `d1.account_bytes`.
- **Migration.** The CHECK constraints must allow the new values:
  - `ops_thresholds.metric` (cost-monitor migration 0001) gains the four metrics above;
  - `cost_alert_subscriptions.kind` (migration 0003) gains `capacity`;
  - `ops_resources`, `ops_hourly` and `ops_daily` are **not** changed. Their `kind` and `env` CHECKs (`env` allows only production, stage and qa) never see the account total, which lives in `d1_account_storage`.

  SQLite cannot alter a CHECK, so the migration rebuilds the two tables (`ops_thresholds` and `cost_alert_subscriptions`): it creates the new table, copies the rows, drops the old one and renames, in one migration file. This is the same pattern migration 0002 used for `ops_hourly`. The previous collector and admin-api keep working during the release, because the new values are only written by the new code.
  - **`account_storage_pct`** is evaluated against `d1_account_storage`. Its Errors page key is `ops:<rule>:account`.
- **Default rules**, seeded by the same migration and editable on the existing thresholds UI:
  - storage ≥ 70% (warning) and ≥ 90% (critical);
  - days to 70% ≤ 60;
  - busy ≥ 70% for 3 hours in a row;
  - account storage ≥ 70%.

  They apply to every environment, with the environment shown in the item.
- **Admin Costs page.** Add a "Databases" section. For each D1 database and environment it shows:
  - size against 10 GB, as a bar;
  - growth per day over 14 days;
  - days to 70%;
  - rows written per day;
  - peak busy share.

  It also shows the account total against 1 TB. It is sorted by days to 70%.
- **Admin Operations and Status pages.** Show the same gauges in a compact row. The admin Status page lists "Database capacity" as an internal component. It never appears on the public status page.
- **Errors page.** Crossings appear as needs-action items with the database, the environment, the value, the forecast date and a link to this page's options.
- **Cost-alert email.** Opted-in admins get these crossings through the existing cost-alert mail, as the new `capacity` kind, in one language per email.
- **Calibration.** A documented admin job compares the model's per-table estimates with a **stage** export analyzed locally with `dbstat`. It never runs against prod or Auth prod.
- **Localization.** Strings in English and Arabic; Arabic digits through the shared formatter.
- **Tests:**
  - metric math and the forecast (flat, growing and shrinking);
  - the migration on a copy holding old rows (rows kept, new values accepted, old CHECK values still accepted);
  - rule seeding is idempotent;
  - the account listing (paged, other names summed but not stored);
  - a GraphQL fixture with storage and query time;
  - opening and resolving Errors page items;
  - a Costs page render test with no token (a clear message, nothing fails).

### D1-2 Notifications inbox: retention, cap and index trim

- **Retention.** Read notifications are purged after 30 days and unread ones after 90 days (today all are kept 90 days). The purge runs in the processor's existing cron, in batches of 1,000, by `idx_notifications_created`, which this story keeps.
- **Cap.** The cap is enforced by a later job, never on insert. `fanoutNotificationPage` stays one set-based `INSERT OR IGNORE … SELECT` over 1,000 subscribers.
  - **Which users.** The nightly trim job walks only the users who got a notification since its last run: a range on `idx_notifications_created`, read in pages of 1,000 distinct `user_id`s.
  - **What it keeps.** For each user it keeps the newest **500 read** rows and deletes the older read ones (`idx_notifications_user_unread_created`, `is_read = 1`, `ORDER BY created_at DESC LIMIT -1 OFFSET 500`).
  - **When everything is unread.** Unread rows are never trimmed by the cap until a user has more than **1,000 unread**. Then the oldest unread rows beyond 1,000 go, so one inbox is bounded at about 1,500 rows. The unread badge already shows "99+". This follows YouTube, whose inbox shows only recent notifications.
- **Index trim:**
  - drop `idx_notifications_user_unread (user_id, is_read)`, which is covered by `idx_notifications_user_unread_created (user_id, is_read, created_at)`;
  - keep `idx_notifications_created`, which the purge and the trim walk need.

  Plans for the inbox list, the unread count, push dedupe, the purge and the trim are asserted in tests, with no temp b-tree and no scan.
- **Result:**
  - about 8 rows written per notification instead of about 9;
  - bytes per row fall from ~1,470 to ~1,420;
  - stored inbox rows fall about 45%, because read rows go at 30 days. The model uses the 90-day stock × 0.55.
- **Tests:**
  - a fan-out page over the cap stays one statement;
  - trim with all-read, mixed and all-unread inboxes;
  - purge of read rows at 30 days and unread rows at 90 days;
  - the trim walk resumes from its cursor.

### D1-3a Popular viewer counts: daily rollup

The ranking job (`apps/api-videos/src/lib/ranking/job.ts`) reads only `COUNT(*) … GROUP BY video_id, day` from `discovery_viewers`. The raw rows are needed only while their day can still receive views.

- **New table** `discovery_viewer_days (day, video_id, viewers)`, WITHOUT ROWID, about 86 B a row.
- **Nightly rollup.** For each closed day (two days back, because yesterday's salt is still live for views that straddle midnight), the job counts the viewers per video and day. It reads the day's own primary-key range, so it is not a scan. It then inserts the counts and deletes that day's raw rows in batches, in that order.
  - **Idempotent.** A `discovery_rollup_days (day)` marker is written in the same batch as the last insert. A re-run skips days already marked.
- **Ranking job.** It reads `discovery_viewer_days` for the 90-day window, plus the raw rows for the open days, as it does now. The Popular scores do not change: the counts are the same distinct-viewer counts.
- **Purge.** Rows in `discovery_viewer_days` older than `POPULAR_PARAMS.days + 1` are deleted, like today's purge.
- **Result:**
  - at 100k MAU: 1.27 GB → about 0.1 GB;
  - at 1M MAU: 12.7 GB → about 1.0 GB;
  - each ranking run reads about 9k rows a day instead of about 125k.
- **Tests:**
  - Popular rails are identical before and after the rollup on a seeded 90-day fixture;
  - the rollup is idempotent;
  - views that straddle midnight are counted once.

### D1-3b Analytics counters: 90-day hot window in D1, exact archive in R2

Every counter stays exact. Nothing moves to Analytics Engine (see [Scaling options](#scaling-options)), and the API response does not change.

- **Scope.** Only `entity_type` `video` and `channel` change.
  - `post` rows stay in `analytics_daily` untouched: `likes`, `poll_votes`, `poll_option` with the option id as `dim`, and `views` with `counter:<shard>` dims. They are permanent counters, read as a lifetime `SUM(value)` (`apps/api-videos/src/lib/post-counters.ts`, `post-views.ts`), and their volume is small: per post per day.
  - `site` rows also stay untouched: visits, landing, source and referrer host, about 200 rows a day for the whole site, read for the last N days.
- **Totals vs dimensions.** For video and channel rows, the **totals** are `views`, `watch_time` and `retention_start`, each with `dim = ''`. Every other metric is a **dimension row**: `traffic`, `playback`, `source`, `embed_origin`, `external_host`, `retention` buckets, `surface`, `device`, `country` and `campaign`.
- **Active-entity list.** `analytics_daily`'s primary key starts with `entity_type, entity_id`, so a sweep by `day` would scan the table, and no index on `day` is added (it would cost about 95 B on every row).
  - **New table.** `analytics_active (day, entity_type, entity_id, dirty)` is WITHOUT ROWID, about 80 B a row.
  - **Who writes it.** `CounterBatch.flush` upserts `dirty = 1` for every distinct `video` or `channel` entity and day in the batch (`site` and `post` are left out). It covers **every** metric: views, watch time, retention buckets and reports that arrive late. It is in the same transaction as the counters.
  - **Retention.** A row is deleted only by the fold that consumed it, never by age. A delayed or failed fold leaves it in place, so nothing is stranded.
- **Moves go through an outbox.** Rows leave D1 through `analytics_moves (move_id INTEGER PRIMARY KEY AUTOINCREMENT, entity_type, entity_id, day, kind, payload)`, with an index on `(entity_type, entity_id, day)`. A move is **one D1 batch**, which is one transaction, so nothing can happen between its statements:
  1. `INSERT INTO analytics_moves … SELECT json_group_array(metric, dim, value) FROM analytics_daily WHERE <entity-day key> AND <kind's metrics>`: one primary-key range;
  2. `DELETE FROM analytics_daily WHERE` the same predicate;
  3. the state change in `analytics_active` (below).

  Steps 1 and 2 read and delete exactly the same rows in the same transaction, so a flush either lands before the batch (and is moved) or after it (and stays in D1, with `dirty = 1`). No generation guard is needed.
- **Drain.** Every run of the job **starts** by draining the outbox, oldest first, whatever the entity or kind:
  - it writes each payload into the R2 document `analytics/daily/<entity_type>/<entity_id>/<YYYY-MM>.json` (the existing `analytics_rollups` bucket) as `day → parts[move_id] → metric → dim → value`;
  - it then deletes the outbox row.

  `move_id` is AUTOINCREMENT, so it is never reused, even after an `analytics_active` row is deleted and recreated. Rewriting `parts[move_id]` after a crash is a plain overwrite, so a retry never counts twice, and an undrained move is never lost.
- **Nightly archive job.** For every `analytics_active` row with `day <= today − 3` and `dirty = 1` (walked by primary key, `day` first), one move of kind `dims` takes the **dimension rows** and sets `dirty = 0` in the same batch.
  - That covers the newly closed day, plus any older day dirtied again by a late report or a DLQ replay.
- **Totals in D1.** Totals stay in `analytics_daily` for 90 days. Then a nightly fold handles every `analytics_active` row with `day <= today − 91` and `dirty = 0`. It finds them by primary key and never sweeps by `day`.
  - Each fold is one move of kind `totals` (so R2 holds the daily totals for older ranges). In the same batch it upserts the same sums into `analytics_monthly (entity_type, entity_id, month, metric, dim, value)` and deletes the `analytics_active` row.
  - A total that arrives after the fold recreates the daily row and the active row (`dirty = 1`). The next archive and fold move it as one more part.
- **Invariants.** The implementation PR must test each one as an acceptance criterion.
  - **I1. Fold batch order.** One batch, in this order:
    1. `INSERT INTO analytics_moves … SELECT` from `analytics_daily`;
    2. `INSERT INTO analytics_monthly … SELECT … FROM analytics_daily … ON CONFLICT DO UPDATE SET value = value + excluded.value`, summing in SQL. The values are never passed in from the Worker;
    3. `DELETE FROM analytics_daily` with the same predicate;
    4. `DELETE FROM analytics_active WHERE <key> AND dirty = 0`.

    **Acceptance:** if a flush dirties the row before the batch, the row survives (`dirty = 1`), and the totals the flush added are moved by the next fold, not lost.
  - **I2. Archive batch order.** One batch: `INSERT INTO analytics_moves … SELECT`, then `DELETE FROM analytics_daily`, then `UPDATE analytics_active SET dirty = 0 WHERE <key>`.

    **Acceptance:** every statement uses the same entity-day predicate; a flush either lands before the batch (and is in the part) or after it (and the row is dirty again).
  - **I3. Readers deduplicate by `move_id`.** A part can exist in R2 and in `analytics_moves` at the same time: after the drain's R2 write, before its outbox delete. Readers take the union by `move_id`, so each id counts once.

    **Acceptance:** a read during that window returns the same totals as before and after it.
  - **I4. Readers include rows not yet moved.** For **any** day in the range, readers also add `analytics_daily` rows that have not been moved yet, such as a late report on a day older than 3 days, or totals not yet folded.

    **Acceptance:** a late report shows up in reads before the next archive runs.
  - **I5. Outbox bound.** A run starts new moves only after the outbox is fully drained.
    - If the drain fails or leaves any row, the run stops without moving anything and raises an Errors page item.
    - The `analytics_moves` row count and the database size are covered by D1-1, through the 70% storage alert on the notifications database.
    - A backfill run is capped at 5,000 moves, with the cap as a setting.

    **Acceptance:** with R2 failing, repeated runs never grow the outbox past one run's moves.
  - **Lifetime totals** are `SUM(analytics_daily) + SUM(analytics_monthly)`, exact.
- **Readers** (Studio and admin analytics in `apps/api-videos/src/lib/analytics.ts`, up to 366 days). Every day older than 3 days reads R2 parts **plus** any undrained `analytics_moves` rows for that entity and day (an index seek). A move that is not drained yet is never missing from a read.
  - the last 3 days come from D1 (totals and dimensions);
  - days 4 to 90 come from D1 totals plus R2 dimensions;
  - older days come from the R2 documents, at most 13 GETs for a 366-day range per entity;
  - lifetime comes from D1 daily + monthly.
- **Rollout:**
  - archive-only (no deletes) behind an ops setting;
  - a comparison job checks that R2 plus D1 equals the old D1 sums for every entity on QA and stage for 14 days;
  - switch the reads;
  - enable deletes;
  - backfill the existing rows older than 3 days in batches.
- **Result:**
  - analytics at 100k MAU: 13.2 GB → about 0.7 GB, including about 0.07 GB of `analytics_active`;
  - at 1M MAU: 132 GB → about 7.2 GB.
  - Rows written per view stay about 12, plus about one delete per dimension row per day, plus one R2 GET and PUT per active entity-day.
- **Tests:**
  - archive then delete (an R2 failure means no delete);
  - re-running a day changes nothing;
  - post likes, poll options and post views are unchanged after a full run;
  - site rows are untouched;
  - an entity with only `watch_time` or `retention` rows on a day (no views, for example after midnight) is archived;
  - a report 10 days late, and another after the fold, both reach R2 and the lifetime totals exactly once;
  - a crash after the move batch but before the drain, and a crash after the R2 write but before the outbox delete, each count exactly once;
  - a flush that runs at the same time as a move lands either in the moved part or in D1, never in both and never in neither;
  - one test for each of the acceptance criteria of I1 to I5;
  - from the final review (Gemini, revision 6):
    - **Partial index.** A partial index `idx_analytics_active_dirty ON analytics_active (day) WHERE dirty = 1` serves the nightly archive query. A test asserts its plan.
    - **Outbox payload.** It is built with `json_group_array(json_array(metric, dim, value))`, which takes one argument, and guarded with `HAVING COUNT(*) > 0`, so an empty entity-day writes no `'[]'` move.
    - **Concurrent drains.** Drain writes are grouped per monthly R2 key and use a conditional PUT (`etagMatches`, retried), so overlapping drain runs can't overwrite each other's parts. A test runs two drains at once.
    - **Prose.** When a flush runs just before a fold, the totals it added are moved by that same fold batch, and the active row stays `dirty = 1`. That way any dimensions and later totals are not stranded. The reader rules always include I4 (unmoved daily rows). "An R2 failure means no delete" means no delete from `analytics_moves`. I1 to I5 govern if the prose differs.
  - a failed fold leaves `analytics_active` and the daily rows in place;
  - the archive and the fold plans use primary-key ranges, never a scan of `analytics_daily`;
  - the reader returns the same series as today for a seeded 400-day fixture;
  - the monthly fold keeps lifetime totals exact.

### D1-4 Auth: remove count scans, audit retention (AlUmmahNowAuth)

- **Count scans first.** These scans exist today ([AlUmmahNowAuth#514](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/514)):
  - `getAuditStats` (`apps/auth/src/admin-enterprise-routes.ts`) runs `SELECT COUNT(*) FROM audit_events`, which reads every row, plus 1-hour, 24-hour and 7-day counts and two GROUP BYs over the timestamp range.
    - **Fix:** the stats come from a new `audit_daily_counts (day, event_type, severity, n)`. audit-consumer upserts `n + 1` in the same batch as the event. "Total" becomes the sum of the 90 days kept.
  - `getUserAuditTrail` runs `COUNT(*) … WHERE user_id = ?`, then `ORDER BY timestamp LIMIT ? OFFSET ?`. With an index on `user_id` alone, that reads and sorts every row of the user.
    - **Fix:** a new index `(user_id, timestamp)` replaces `idx_audit_events_user_id`; the trail uses keyset pages (`timestamp < ?`) and returns `hasMore` instead of a total.
- **`audit_events` retention.** 90 days stay in D1. Older rows go to R2 through a **separate job**: the `token-cleanup` cron keeps its 10-second time box and is not used for this.
  - **Schedule.** A new cron (every 10 minutes) archives one hour bucket per run, at most 5,000 rows. It reads by `idx_audit_events_timestamp`, in `timestamp` order.
  - **Archive.** It writes `audit/<YYYY-MM-DD>/<HH>-<n>.ndjson`, then deletes those rows by id in batches of 500.
  - **Progress and safety.** A cursor in `auth_settings` makes the job resumable. It has its own 25-second time box. An R2 failure means no delete.
  - **Archive retention.** Events are kept **395 days in total**, the same as the existing event-archive retention: 90 days in D1, then 305 days in R2. An R2 lifecycle rule removes archive objects 305 days after upload; upload happens when the event is 90 days old.
- **Erase without scanning R2 (crypto-shredding).**
  - **Per-user key.**
    - Each user with archived events gets a 256-bit root key in `audit_subject_keys (subject_hash, key_wrapped, wrap_key_id, created_at, shredded_at)`.
    - The table is keyed by `subject_hash = SHA-256(user_id)`, as in the processor's erasure archive subjects. No raw user id is kept, not even in tombstones.
    - The key is wrapped (AES-KW) with the key named by `wrap_key_id`. That is a version of `KEY_ENCRYPTION_MASTER_KEY` kept in the Secrets Store.
    - This table moves to the audit database in D1-5.
  - **Rotation.** A new wrap key gets a new `wrap_key_id`. A batched job re-wraps rows by primary key, only rows `WHERE key_wrapped IS NOT NULL AND wrap_key_id <> ?`, so tombstones are skipped. Both versions stay readable until the job finishes, then the old version is removed from the Secrets Store.
  - **Separate derived keys.** HKDF-SHA256 derives two keys from the root key:
    - the **subject key** (`info = "aun-audit-subject-v1"`) computes the HMAC subject;
    - the **data key** (`info = "aun-audit-data-v1"`) encrypts with AES-GCM.

    The same key is never used for both.
  - **Archive lines.**
    - `user_id` is replaced by `HMAC(subject key, user_id)`.
    - The personal part of the event is encrypted as **one** AES-GCM blob with the data key. That part is the IP address, the user agent, the `error_message` column and all of `metadata`.
      - **Allow-list.** These `metadata` fields stay in plaintext: `method`, `clientId`, `tokenType`, `grantType`, `expiresIn`, `scopes`, `role` and `changedFields`, the field names in `apps/auth/src/audit-events.ts`. The columns `event_type`, `severity`, `success`, `timestamp` and `tenant_id` also stay in plaintext.
      - **Always encrypted.** `email`, `failureReason` (it can quote input) and `initiatedBy` (a user id) are never on the allow-list.
    - Unknown fields are encrypted by default, so a new metadata field can never leak in plaintext.
    - Events with no user (failed sign-ins for unknown emails) use a monthly key in the same table (`subject_hash = 'month:<YYYY-MM>'`), shredded 395 days after the month ends, together with that month's last archive.
  - **Erase**, inside the existing account purge, in this order:
    1. **Tombstone first.** The purge upserts the key row: `INSERT … ON CONFLICT (subject_hash) DO UPDATE SET key_wrapped = NULL, wrap_key_id = NULL, shredded_at = now`.
       - This works whether or not the user had a key. A user whose events are all still in D1 has none yet, and still gets a tombstone, so nothing can create a key for them later.
    2. **Redact the D1 rows.** The user's rows still in D1 (the 0–90-day window) are redacted in batches of 500 by the `(user_id, timestamp)` index:
       - `user_id` is set to `erased:<random 128-bit id>`, one id per erase. It is generated at erase, never derived from the user id and never stored with it, so the rows of one erased account still group together but cannot be linked back;
       - `ip_address`, `user_agent` and `error_message` become NULL;
       - `metadata` keeps only the allow-listed fields.

       Today account erase leaves these rows in plaintext indefinitely ([AlUmmahNowAuth#515](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/515)).
    3. **What the tombstone means afterwards.**
       - **Old archive lines.** Lines archived before the erase keep their `HMAC(subject key, user_id)` subject. With the root key destroyed, nobody can recompute or test that HMAC, so the subject becomes an unlinkable pseudonym, and the encrypted blob can never be decrypted.
       - **Late events.** An event for this user that arrives after the erase (a queue retry or a DLQ replay) is handled in two places:
         - **audit-consumer:** it checks `audit_subject_keys` by `subject_hash` (one primary-key read) and stores the event already redacted, under the literal subject `erased`;
         - **archive job:** as a second line of defense, it strips the personal fields of any unredacted row whose user is tombstoned and writes it as `erased`. It never creates a key for that user.
       - **Removing tombstones.** A tombstone holds no personal data. It is removed 395 days after `shredded_at`, when the last redacted row (in D1 up to 90 days, then 305 days in R2) has expired.
  - **Admin lookups.** While the account exists, an admin can look up a user's archived events by recomputing the HMAC with the subject key.
  - **Erase checks.** The bucket stays in the erase leftover check as "shredded", not allow-listed ([AlUmmahNow#1177](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1177) shows the trap).
- **`token_usage`:** 90 → 30 days in the existing cleanup.
- **Safety.** Every statement is checked for an index plan before merge. No unbounded count queries. The batch size is tuned so one statement stays under 50 ms on stage.
- **Tests:**
  - the stats and trail plans use indexes, never a scan;
  - archive then delete (an archive failure means no delete);
  - the archive job resumes from its cursor;
  - erase tombstones the key, including for a user with no key yet, and an archived line no longer decrypts;
  - a late event after erase is stored redacted, and the archive job never re-keys a tombstoned user;
  - the R2 lifecycle (305 days) plus the D1 window (90 days) equals 395 days;
  - erase redacts the user's D1 rows, and a later archive run writes them without personal data and without a new key;
  - key rotation re-wraps every key, and old and new lines both decrypt mid-rotation;
  - the subject and data keys differ (HKDF info strings), and an unknown metadata field is encrypted;
  - the purge plan uses the timestamp index.

### D1-5 Auth audit database split (AlUmmahNowAuth)

- **New database** `al-ummah-now-auth-audit` (prod, stage, QA):
  - `audit-consumer` writes `audit_events`, `audit_daily_counts`, `token_usage` and `audit_subject_keys` there;
  - the admin audit and session views read from it.
- **Rollout:** dual-write for one release, then a batched backfill of the 90-day window, then a read switch, then drop the old tables in the sign-in database.
- **Result:**
  - The sign-in database then holds only accounts, identities, roles, sessions and short-lived state. It reaches 70% at about 1.6M MAU.
  - The audit database reaches 70% at about 319k MAU; most of it is `token_usage`. When D1-1 shows it at 70%, `token_usage` gets the same hot-window-and-R2 treatment as D1-3b.
- **Tests:** the dual-write order (the sign-in database is never the second write in a request); the admin audit list on the new binding.

### D1-6 Notifications per-user shards

- **Shard map.** `notifications`, `notification_seen`, `liked_videos`, `post_likes`, `poll_votes`, `saved_posts` and `channel_subscriptions` (by subscriber) move to N databases (`al-ummah-now-notify-<n>`). The shard comes from a shard map:
  - `hash(user_id)` → one of 256 slots → a database;
  - the map is kept in `site_settings`, so a split later moves slots, not every user.
- **Fan-out.** Each page of 1,000 subscribers is split by shard into up to N set-based inserts, one per shard. The D1-2 trim runs per shard.
- **Global data.** Some tables stay global, in the main notifications database:
  - counts by video or channel (`channel_subscribers`, `channel_subscriber_counts`, post totals in `analytics_daily`);
  - `discovery_viewer_days`;
  - `push_devices`.

  Deletes by entity fan out to N.
- **Rollout:** start with N = 4; dual-write, backfill by slot, then read switch per slot.
- **Result:**
  - each of 4 shards reaches 70% at about 480k MAU, and the main notifications database at about 657k MAU;
  - move to 8 shards before 1M MAU.

### D1-7 Caption search in its own database

- **Split.** `search_transcripts` and its FTS move to `al-ummah-now-search-transcripts`. A transcript search is a separate query whose video ids are then filtered through the main index. The same slot map as D1-6 (by video id) applies once one transcripts database passes 70%.
- **Prune.** Only the published track per language is indexed, never drafts.
- **When.** This is needed once caption search is on for most videos. With 50% captioned, one transcripts database reaches 70% at about 194k MAU.

### D1-8 Live chat on the stream's Durable Object

- **While live.** Chat is stored in SQLite inside the stream's Durable Object (the websocket server already runs one per stream). It absorbs the peak: 60 messages per second at 1M MAU and 400 at 10M, under the object's 1,000 per second.
- **D1's role.** D1 keeps only moderation state (held and removed rows, pins, blocks).
- **At stream end.** The object writes the chat replay to R2 (`live/chat/<stream>.ndjson`), and replay reads from R2.
  - **Erase.** Account erase covers this archive by the user's message ids, which the moderation state keeps per stream.
- Published chat rows older than 30 days are archived to R2 and deleted.
- **Result:** search no longer carries chat. Size: search reaches 70% at about 734k MAU after D1-7 and D1-8.

### D1-9 Read replication and the Sessions API for search

- **Enable replication** on `al-ummah-now-search` (`read_replication.mode: auto`) on QA, then stage, then prod.
- **Sessions.**
  - Wrap the `SEARCH_DB` reads in `withSession()`.
  - Writers return the bookmark, and the web client sends it back for the next request, which gives read-your-writes after an edit.
  - Admin and Studio use `first-primary`.
- **Then the other databases.** CMS and notifications reads follow when D1-1 shows them above 40% busy.
- **Result:** no extra cost. Read capacity grows with regions; the write path does not change. It is needed by about 1.6M MAU (70% busy) and can come earlier at no cost.

### D1-10 Search engine graduation criteria (doc and bench, no build)

- **Write down the triggers.** Leave D1 FTS when **any** of these holds for 7 days:
  - the main index is above 7 GB after D1-7;
  - search p95 is above 300 ms;
  - search busy share is above 50% with replicas on;
  - Arabic relevance complaints need features FTS5 lacks (typo tolerance, synonyms beyond the glossary).
- **Bench.** Add a local bench harness of synthetic catalogs (100k, 1M and 5M videos) for FTS query time and size.
- **Next steps.** List the candidate next steps with their trade-offs:
  - FTS shards by language;
  - Vectorize for semantic search;
  - a dedicated engine.

## Costs

These are plain unit prices for Workers Paid, from the pages above, plus R2 Standard at $4.50 per million Class A writes.

| Item | Today's design | After the plan |
|---|---|---|
| Analytics per view | ~12 D1 rows written ≈ $0.000012 | the same; counters stay exact in D1 |
| Analytics archive at 1M MAU | — | ~2.1M dimension-row deletes a day ≈ $63 a month, plus ~93k R2 GET and PUT pairs a day ≈ $13 a month |
| Popular viewer rows at 1M MAU | 1.25M rows written a day, kept 91 days | the same writes, plus about 1 delete per row once its day closes ≈ $38 a month; reads per ranking run fall about 10× |
| Notification per inbox row | ~9 rows written ≈ $0.000009 | ~8 rows ≈ $0.000008 |
| Storage | $0.75 per GB-month above 5 GB in total | the same, with less data: about 426 GB → about 156 GB at 1M MAU |
| Read replicas | — | $0 extra |
| Extra databases (D1-5, D1-6, D1-7) | — | $0 (included up to 100,000 databases) |

At 1M MAU, storage falls by about 270 GB, about $200 a month. That is more than the new delete and R2 costs above.

## Platforms

These are server-only changes:
- **Web:** no change, except D1-9's bookmark round trip, which is handled in the API client.
- **Admin:** D1-1 (the Costs, Operations, Status and Errors pages). The Auth admin audit trail moves from page numbers to "load more" (D1-4).
- **Apple, Android and Desktop:** no change. API responses keep their shape.

## Legal and safety

- **Archives and erase.**
  - **Audit archive (D1-4):** it holds personal data. Account erase redacts the user's rows still in D1 and tombstones the user's key, so the archived lines can't be read. No scan of R2 is needed.
  - **Analytics archive (D1-3b):** it holds per-video counts only, no user data.
  - **Chat archive (D1-8):** account erase covers it by message id.
  - **Erase checks:** the R2 buckets are listed in the erase leftover check, never allow-listed without a PII check.
  - **Privacy page:** the existing privacy-retention text states retention.
- **Sign-in safety.** No story runs an unindexed query on the Auth database. D1-4 removes the existing `COUNT(*)` scans first. Purges are batched by an indexed time column (the sign-in stall of 2026-11-13, [AlUmmahNowAuth#341](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/341)).

## Owner decisions

None are needed now. Retention windows follow common practice (YouTube and Google) and the existing 395-day event archive. Every unit cost above is small.

One money choice is noted for later. D1-10 will ask it only when a trigger fires: whether to pay for a dedicated search engine, or keep sharding D1 FTS.

## Appendix: every table

Estimated bytes per row, including index entries and page overhead. The estimate comes from the schema rebuilt from every migration on `main` (2026-11-24), is roughly ±50%, and does not measure row counts. Growth drivers and retention for the tables that grow are in [Table inventory](#table-inventory). The tables not listed there are config, catalog or workflow tables that stay small.

#### al-ummah-now-search (135 tables)

| Table | Est. bytes/row incl. indexes | Indexes |
|---|---|---|
| `admin_comment_sigs` | 83 | 1 |
| `admin_comments` | 666 | 3 |
| `admin_deletions` | 1156 | 8 |
| `admin_job_log` | 333 | 1 |
| `admin_job_users` | 143 | 2 |
| `admin_jobs` | 1209 | 4 |
| `billing_checkouts` | 407 | 3 |
| `billing_customers` | 203 | 2 |
| `billing_events` | 927 | 5 |
| `billing_payments` | 607 | 4 |
| `billing_price_links` | 359 | 2 |
| `billing_prices` | 337 | 2 |
| `billing_providers` | 459 | 1 |
| `billing_settings` | 140 | 1 |
| `billing_subscriptions` | 1227 | 7 |
| `caption_jobs` | 845 | 3 |
| `caption_minute_grants` | 677 | 2 |
| `caption_minute_holds` | 592 | 2 |
| `caption_minute_ledger` | 297 | 2 |
| `caption_minute_overdraft` | 86 | 1 |
| `caption_minute_usage` | 114 | 1 |
| `category_suggestions` | 1505 | 6 |
| `channel_access` | 257 | 2 |
| `channel_audit` | 564 | 5 |
| `channel_blocks` | 205 | 2 |
| `channel_comment_sigs` | 98 | 1 |
| `channel_comments` | 903 | 6 |
| `channel_comments_index_state` | 121 | 1 |
| `channel_invites` | 915 | 8 |
| `channel_quran_translations` | 275 | 2 |
| `channel_transfer_locks` | 117 | 1 |
| `channel_translation_settings` | 114 | 1 |
| `content_ownership` | 1796 | 18 |
| `creator_tier_assignments` | 220 | 2 |
| `creator_tier_changes` | 580 | 2 |
| `creator_tier_settings` | 399 | 1 |
| `creator_tiers` | 1111 | 2 |
| `delivery_cost_daily` | 175 | 1 |
| `discovery_exclusions` | 271 | 1 |
| `discovery_home_rails` | 95 | 1 |
| `discovery_pins` | 618 | 3 |
| `discovery_rail_items` | 278 | 1 |
| `discovery_rails` | 243 | 1 |
| `feature_switch_changes` | 245 | 2 |
| `feature_switches` | 114 | 1 |
| `image_owners` | 220 | 2 |
| `import_source_items` | 1085 | 4 |
| `import_sources` | 1113 | 5 |
| `import_takeout_files` | 1061 | 5 |
| `index_repairs` | 460 | 2 |
| `indexnow_pending` | 89 | 2 |
| `inline_translation_usage` | 86 | 1 |
| `live_channel_overrides` | 284 | 1 |
| `live_chat_messages` | 1121 | 7 |
| `live_counters` | 74 | 1 |
| `live_events` | 530 | 3 |
| `live_qoe` | 527 | 3 |
| `live_segments` | 240 | 1 |
| `live_sessions` | 1385 | 6 |
| `live_settings` | 399 | 1 |
| `live_stream_metadata` | 692 | 7 |
| `media_backfill_items` | 872 | 2 |
| `media_backfill_runs` | 869 | 2 |
| `media_bunny_removals` | 396 | 3 |
| `media_jobs` | 785 | 3 |
| `media_originals` | 319 | 2 |
| `media_provider_health` | 184 | 1 |
| `media_provider_refs` | 243 | 2 |
| `media_r2_verified` | 292 | 2 |
| `metadata_translations` | 429 | 1 |
| `playback_fallback_daily` | 556 | 1 |
| `playback_qoe_daily` | 294 | 1 |
| `privacy_footprint_sigs` | 98 | 1 |
| `privacy_footprints` | 171 | 2 |
| `quran_translation_defaults` | 145 | 1 |
| `search_channels` | 734 | 4 |
| `search_channels_fts` | FTS5 index (see search model) | 0 |
| `search_meta` | 400 | 1 |
| `search_playlists` | 814 | 5 |
| `search_playlists_fts` | FTS5 index (see search model) | 0 |
| `search_posts` | 720 | 3 |
| `search_posts_fts` | FTS5 index (see search model) | 0 |
| `search_tombstones` | 120 | 2 |
| `search_transcripts` | 319 | 1 |
| `search_transcripts_fts` | FTS5 index (see search model) | 0 |
| `search_videos` | 911 | 8 |
| `search_videos_fts` | FTS5 index (see search model) | 0 |
| `social_accounts` | 965 | 3 |
| `social_audit` | 600 | 2 |
| `social_deliveries` | 932 | 5 |
| `social_instance_apps` | 305 | 1 |
| `social_pending` | 442 | 2 |
| `social_rules` | 226 | 1 |
| `social_settings` | 429 | 1 |
| `social_spend` | 164 | 1 |
| `social_templates` | 534 | 1 |
| `social_webhook_deliveries` | 773 | 3 |
| `social_webhooks` | 607 | 2 |
| `support_adjustments` | 463 | 2 |
| `support_bank_statements` | 324 | 2 |
| `support_checkouts` | 893 | 3 |
| `support_config` | 310 | 1 |
| `support_country_rules` | 318 | 1 |
| `support_disputes` | 575 | 3 |
| `support_events` | 845 | 4 |
| `support_finance_members` | 276 | 2 |
| `support_ledger` | 888 | 6 |
| `support_ledger_entries` | 307 | 2 |
| `support_payees` | 788 | 5 |
| `support_payments` | 969 | 5 |
| `support_payout_batches` | 584 | 3 |
| `support_payouts` | 743 | 4 |
| `support_pledges` | 846 | 4 |
| `support_reconciliations` | 357 | 2 |
| `support_refunds` | 569 | 3 |
| `support_reports` | 460 | 3 |
| `support_settings` | 540 | 1 |
| `support_tech_staff` | 112 | 1 |
| `support_test_state` | 371 | 1 |
| `tier_requests` | 911 | 4 |
| `translation_audit` | 413 | 3 |
| `upload_limit_hits` | 252 | 3 |
| `upload_rate_leases` | 137 | 2 |
| `upload_rate_windows` | 132 | 2 |
| `video_categories` | 801 | 1 |
| `video_notes` | 837 | 3 |
| `videos_bans` | 275 | 1 |
| `workflow_inbox` | 252 | 3 |
| `workflow_requests` | 2127 | 8 |
| `workflow_rules` | 537 | 2 |
| `workflow_steps` | 502 | 3 |
| `yt_import_items` | 2188 | 5 |
| `yt_import_playlists` | 801 | 1 |
| `yt_imports` | 1151 | 4 |
| `yt_oauth_states` | 506 | 3 |

#### al-ummah-now-reports (50 tables)

| Table | Est. bytes/row incl. indexes | Indexes |
|---|---|---|
| `admin_audit_log` | 827 | 4 |
| `admin_staff` | 615 | 3 |
| `ai_budget_daily` | 156 | 1 |
| `ai_usage_daily` | 217 | 1 |
| `auth_moderation_requests` | 1804 | 6 |
| `channel_verification_log` | 477 | 2 |
| `contact_messages` | 2100 | 9 |
| `contact_notes` | 1077 | 2 |
| `content_review_findings` | 619 | 2 |
| `content_reviews` | 1769 | 7 |
| `creator_invites` | 1637 | 6 |
| `csam_access_log` | 604 | 2 |
| `csam_cases` | 1161 | 4 |
| `csam_settings` | 448 | 1 |
| `email_template_versions` | 491 | 1 |
| `email_templates` | 456 | 1 |
| `entitlement_overrides` | 1005 | 3 |
| `erased_users` | 132 | 2 |
| `error_actions` | 1953 | 4 |
| `error_events` | 2385 | 6 |
| `error_group_activity` | 670 | 2 |
| `error_group_releases` | 245 | 1 |
| `error_group_users` | 380 | 2 |
| `error_groups` | 1449 | 7 |
| `error_hourly` | 210 | 2 |
| `error_rate` | 172 | 2 |
| `error_refs` | 297 | 3 |
| `error_releases` | 221 | 1 |
| `import_batches` | 413 | 3 |
| `import_items` | 664 | 3 |
| `moderation_actions` | 1040 | 4 |
| `moderation_appeals` | 684 | 3 |
| `moderation_config` | 448 | 1 |
| `moderation_signals` | 1838 | 10 |
| `newsletter_deliveries` | 418 | 3 |
| `newsletter_issues` | 776 | 2 |
| `newsletter_subscribers` | 1105 | 6 |
| `plan_audit_log` | 1143 | 2 |
| `plan_entitlements` | 483 | 1 |
| `plans` | 853 | 3 |
| `reports` | 2004 | 12 |
| `review_alert_subscribers` | 168 | 1 |
| `site_domain_checks` | 233 | 2 |
| `site_settings` | 448 | 1 |
| `site_settings_log` | 1073 | 4 |
| `subscriptions` | 737 | 3 |
| `theme_package_versions` | 240 | 1 |
| `theme_packages` | 760 | 2 |
| `usage_counters` | 338 | 1 |
| `user_warnings` | 947 | 2 |

#### al-ummah-now-notifications (23 tables)

| Table | Est. bytes/row incl. indexes | Indexes |
|---|---|---|
| `analytics_daily` | 155 | 1 |
| `analytics_rollup_imports` | 126 | 1 |
| `archive_subjects` | 210 | 1 |
| `archive_title_refs` | 171 | 2 |
| `channel_subscriber_counts` | 58 | 1 |
| `channel_subscribers` | 287 | 2 |
| `channel_subscription_import_state` | 79 | 0 |
| `channel_subscription_imports` | 67 | 1 |
| `channel_subscriptions` | 238 | 2 |
| `dead_letters` | 984 | 3 |
| `discovery_viewers` | 112 | 1 |
| `liked_videos` | 368 | 4 |
| `live_reminders` | 198 | 2 |
| `notification_email_prefs` | 157 | 1 |
| `notification_seen` | 59 | 1 |
| `notification_settings` | 147 | 1 |
| `notifications` | 1474 | 8 |
| `poll_votes` | 238 | 2 |
| `post_counter_imports` | 176 | 1 |
| `post_likes` | 205 | 2 |
| `push_devices` | 573 | 3 |
| `review_alerts` | 496 | 2 |
| `saved_posts` | 329 | 2 |

#### al-ummah-now-status (8 tables)

| Table | Est. bytes/row incl. indexes | Indexes |
|---|---|---|
| `component_state` | 526 | 1 |
| `daily` | 256 | 2 |
| `deliveries` | 384 | 3 |
| `incident_updates` | 627 | 2 |
| `incidents` | 718 | 3 |
| `notifications` | 284 | 2 |
| `subscribe_limits` | 172 | 2 |
| `subscribers` | 739 | 4 |

#### al-ummah-now-costs (13 tables)

| Table | Est. bytes/row incl. indexes | Indexes |
|---|---|---|
| `collector_runs` | 548 | 2 |
| `cost_alert_deliveries` | 696 | 1 |
| `cost_alert_subscriptions` | 211 | 1 |
| `cost_credentials` | 957 | 1 |
| `cost_job_runs` | 556 | 2 |
| `cost_product_daily` | 345 | 2 |
| `cost_settings` | 448 | 1 |
| `ops_alerts` | 251 | 1 |
| `ops_cost_alerts` | 157 | 1 |
| `ops_daily` | 464 | 2 |
| `ops_hourly` | 456 | 2 |
| `ops_resources` | 256 | 1 |
| `ops_thresholds` | 226 | 1 |

#### al-ummah-now-d1 (Auth) (38 tables)

| Table | Est. bytes/row incl. indexes | Indexes |
|---|---|---|
| `_openauth_migrations` | 203 | 2 |
| `account_sessions` | 772 | 8 |
| `admin_deletions` | 899 | 3 |
| `app_sessions` | 731 | 3 |
| `audit_events` | 1094 | 6 |
| `auth_settings` | 429 | 1 |
| `auth_theme_client_defaults` | 180 | 1 |
| `auth_theme_settings` | 429 | 1 |
| `auth_themes` | 548 | 1 |
| `authorization_codes` | 847 | 6 |
| `browser_sessions` | 500 | 5 |
| `identity_providers` | 1178 | 6 |
| `jwt_keys` | 533 | 4 |
| `moderation_request_events` | 800 | 2 |
| `moderation_requests` | 2066 | 6 |
| `oauth_clients` | 1074 | 5 |
| `openauth_atomic` | 441 | 3 |
| `passkey_setup_tickets` | 356 | 2 |
| `password_codes` | 226 | 1 |
| `password_login_attempts` | 114 | 1 |
| `rbac_permissions` | 635 | 5 |
| `rbac_role_permissions` | 332 | 3 |
| `rbac_roles` | 568 | 4 |
| `rbac_user_roles` | 534 | 5 |
| `refresh_tokens` | 912 | 7 |
| `scoped_revocations` | 382 | 1 |
| `tenant_admins` | 449 | 4 |
| `tenant_invitations` | 727 | 7 |
| `tenants` | 974 | 5 |
| `token_usage` | 642 | 5 |
| `user_identities` | 770 | 4 |
| `user_invite_superseded_tokens` | 599 | 3 |
| `user_invites` | 1753 | 6 |
| `user_revocations` | 284 | 1 |
| `users` | 1057 | 9 |
| `webauthn_credentials` | 521 | 3 |
| `webauthn_prompts` | 113 | 1 |
| `webhook_dlq` | 909 | 4 |

#### al-ummah-now-cms (40 tables)

| Table | Est. bytes/row incl. indexes | Indexes |
|---|---|---|
| `ai_jobs` | 927 | 4 |
| `ai_settings` | 363 | 0 |
| `ai_settings_audit` | 832 | 2 |
| `ai_usage` | 429 | 3 |
| `cms_videos` | 351 | 2 |
| `community_links` | 332 | 1 |
| `content_revisions` | 569 | 1 |
| `curated_videos` | 730 | 2 |
| `curated_videos_dupes_0002` | 588 | 0 |
| `feed_dirty` | 81 | 0 |
| `feed_garbage` | 175 | 2 |
| `feed_heads` | 184 | 1 |
| `feed_items` | 206 | 2 |
| `feed_state` | 340 | 0 |
| `feed_weeks` | 383 | 1 |
| `feed_years` | 174 | 1 |
| `media` | 683 | 3 |
| `media_variants` | 344 | 2 |
| `nav_items` | 387 | 1 |
| `page_entries` | 449 | 3 |
| `pages` | 1479 | 1 |
| `pages_backup_0006` | 1074 | 0 |
| `pages_backup_0022` | 1421 | 0 |
| `pages_backup_0023` | 1421 | 0 |
| `posts` | 2018 | 6 |
| `scholars` | 889 | 3 |
| `site_settings` | 461 | 1 |
| `slug_history` | 265 | 2 |
| `sso_session_revocations` | 102 | 1 |
| `sso_sign_outs` | 28 | 0 |
| `system_tokens` | 291 | 1 |
| `timeline_changes` | 511 | 1 |
| `timeline_entries` | 456 | 3 |
| `translation_flag_events` | 569 | 2 |
| `translation_flags` | 1186 | 2 |
| `translation_glossary` | 545 | 2 |
| `trash` | 1012 | 5 |
| `trash_events` | 526 | 1 |
| `users` | 897 | 4 |
| `video_snapshots` | 626 | 2 |
