[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Scalability audit and index-backed lists

| | |
|---|---|
| **ID** | `AUN-SCALABILITY` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress**: index-backed public lists are live (`v2026.11.21.7`); the admin lists (keyset cursors, trigram search, `channel_totals` and processing health lists, audit items 6 and 11) are open in [AlUmmahNow#688](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/688), which needs a rebase onto main |
| **Last updated** | 2026-11-22 |

> Audit doc merged (#506); the audit's AV, PR and WS items are marked fixed with their PRs ([#671](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/671), [#672](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/672), [#678](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/678)). Later: public lists fill their page ([#800](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/800)), search index converges under writes ([#860](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/860), [#873](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/873), [#879](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/879)), admin lists and user search read indexes ([#841](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/841), [#869](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/869), [#902](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/902)). Revived 2026-11-21 (owner approved): per-object index repair ([#683](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/683)) and index-backed channel playlists, live lists and processing sweep ([#685](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/685)) are live in production since release `v2026.11.21.7`. See [Index-backed lists and per-object repair](#index-backed-lists-and-per-object-repair).

## Index-backed lists and per-object repair

Revived 2026-11-21 (owner approved). [#683](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/683) and [#685](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/685) merged 2026-11-21 and shipped in videos release `v2026.11.21.7` (stage E2E passed, promoted to production).

**Per-object index repair ([#683](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/683), search migration 0069)**
- When a write to the search index fails, one row per object is recorded in `index_repairs`. It replaces the older dirty marks, and the rebuild drains any marks that are left.
- The `search.repair-objects` admin job retries each row with backoff of 1, 2, 4, 8, 16, then 30 minutes.
- After 6 attempts the row is failed and appears on the admin Errors page with Retry.
- If D1 refuses the repair row itself, the write falls back to the processor queue and then to the DLQ.
- A heal only queues a rebuild job. Nothing rebuilds inside or after a request.
- The full R2 ↔ index reconcile runs **weekly** (Sundays UTC). A daily run would be about 1M row writes per pass at 100k videos. The repair kick runs daily.

**Index-backed lists ([#685](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/685), search migration 0070)**
- New ownership kinds `playlist` and `stream`, plus a `status` column.
- These read the index: the channel Playlists tab, the Home playlist and live shelves, `GET /api/playlists?channelId=`, and the live list.
- Channel tabs, playlists and live lists use keyset cursors (`ks:`), so each page is one index seek however deep it goes. Legacy `idx:` cursors are accepted, capped at 10,000.
- The processing sweep handles at most 400 objects per run. It resumes by id, with one covering-index seek per status.
- After each flush, the view counter raises the index's view counts (they only go up).
- Every list query plan is checked: none needs a temp b-tree.

**Dropped from #685, and why**
- The home feed (`GET /api/videos` without a channel) and trending belong to discovery ranking ([E07](E07-content-discovery.md#discovery-ranking), #1718). Keeping them here would make a second path competing with it.
- `activity_at`, `video_category`, a columns-version bump and section counts are dropped. Main already has a `category` column, nothing reads the rest, and the bump would have forced a full admin rebuild.
- `scan:` cursors are dropped: main's `scanFill` (`sa:`, #694) already resumes R2 scans.

**D1 reads at 100k videos**
- List pages read about 24 index rows each, at any depth.
- The processing sweep reads about 0.1M rows a month normally, and at most 5.2M. The old query read about 430M a month.
- The weekly reconcile reads and writes about 1M rows per pass, about 4.5M a month each.

## Goal

Owner (chat 2026-11-09 20:38 UTC): "is the apps all scalable?" Remove in-memory state, lost updates and unbounded scans.

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PRs [AlUmmahNow#506](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/506), [AlUmmahNow#514](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/514), [AlUmmahNow#517](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/517), [AlUmmahNow#520](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/520), [AlUmmahNow#522](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/522), [AlUmmahNow#554](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/554); [AlUmmahNow#683](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/683), [AlUmmahNow#685](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/685)

## Open questions

- None recorded in the sources.

## Sources

- [docs/architecture/SCALABILITY-AUDIT.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/architecture/SCALABILITY-AUDIT.md)
- [AlUmmahNow#506](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/506)
