[← Home](../README.md)

# Deletion, erasure and cleanup

How data is deleted across the platform: soft deletes, the 30-day purge, account erasure and the cleanup jobs. Read from each repo's default branch on 2026-11-12. The privacy reference is the monorepo's [GDPR notes](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/compliance/GDPR.md).

## Admin deletes are soft deletes

Owner rule (2026-11-10): every delete an admin makes is restorable for **30 days**. An hourly cleanup then removes it for good. An admin can promote an item to permanent deletion, which queues it for the same cleanup rather than deleting inline.

| Where | What it covers | Source |
|---|---|---|
| Videos admin | Videos, channels, users' videos data, posts; **Recently deleted** with restore | [#698](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/698) |
| Videos admin | Contact messages, themes and creator tiers | [#704](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/704) |
| Auth admin | User accounts | [Auth#293](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/293) |
| CMS | Pages and posts (with their covers), into a `trash` table; Recently deleted for admins | [CMS#63](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/63) |
| Tools | The desktop tools can no longer hard-delete platform content | [Tools#41](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/41) |

- A soft-deleted item is hidden at once from public reads, admin lists, search and the ownership index. Nothing is removed from R2, Bunny or the indexes until the purge.
- While an admin "Delete videos data" is pending for a user, that user can still sign in and read, but every write answers 403 `videos_account_pending_deletion` ([#836](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/836)).
- Destructive actions are confirmed in an in-app, accessible dialog in English and Arabic, never a browser prompt. Where an undo is offered instead, it really undoes ([#697](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/697), [#1048](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1048)).

## Creator trash

Creators delete their own videos to a trash in Studio (web and the native Studio apps). They can restore or permanently delete them. **Admin removals stay the admin's**: a creator can't restore or purge a video an admin removed, and those don't appear in the creator's trash ([#764](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/764)). An owner's permanent delete also removes the Bunny video ([#680](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/680)).

## Account erasure

A user's own `DELETE /api/privacy/data`, the admin erasure job and the E2E run-account erase all go through the same erasure steps. Between 2026-11-10 and 2026-11-12 they were extended to remove:

- **Contact us** messages ([#626](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/626)).
- **Creator invites**, **error identity**, **category suggestions** and **upload traces** ([#1077](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1077)). Error events are kept for trends, but the user id becomes an erased marker and identifying keys are removed.
- The channel's **Bunny collections**, whenever a channel record is deleted ([#1086](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1086)), and the user's own collection.
- **Channel subscriptions** an account made as itself (no channel), as well as those its channels made. The export marks each one `subscribedAs` member or channel ([#1152](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1152)).
- On the Auth side, purging an account also removes its **email → subject** record and its **invite rows** ([Auth#326](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/326), [Auth#335](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/335)).
- On 2026-11-13, found by the web and release suites' leftover checks ([#1251](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1251)): the user's **upload rate counters**, **creator tier**, **bot-check pass** (`HUMAN_VERIFIED`, 180 days), **TUS upload sessions** and **bulk edit undo records**; for run accounts also their **Watch later and personal playlists** and privacy footprints. A video deleted for good (purge, cleanup or erasure) now also takes its **subtitles**, **upload marker**, **scheduler entry**, **playlist adds** and **file claim**. A deleted channel's hidden search row keeps only its id, and the admin list-count cache no longer stores the admin's search (an email) in its key.
- Still open: purged rows of the admin deletion registry and finished admin jobs keep an erased user's titles and id ([#1253](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1253)); dead-letter bodies keep raw ids, and data that reaches the processor after the erasure step keeps the user id ([#1255](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1255)).

### The event archive

The processor keeps a copy of queue messages (`al-ummah-now-messages`) for statistics and abuse investigation. Every message is scrubbed before it's written ([#1180](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1180), issue [#1177](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1177)):

- **User ids become pseudonyms** (`ps_…`). Each one is a keyed hash under a random secret kept for that person. The secrets table is itself keyed by a hash of the id, so it holds no raw id either.
- **Free text, contact and device details are dropped**: report descriptions, comment and message text, search queries, names, emails, IP addresses and user agents. Referrers keep only their host, and links lose their query string.
- **Erasure cuts the archive off.** The erase deletes the person's secret, and from then on nothing can tie their archived events back to them. Later messages about the account, and the erase messages themselves, are archived as `deleted-user`.
- **Older entries were rewritten once.** Entries from before this change were rewritten with a key that existed only for that run and was then deleted.

The archive itself still expires after 13 months. The local E2E leftover check stays strict on it: a test run's ids turning up there would mean the scrubbing broke. A run's own entries still match through its video and channel titles (the scrubber keeps titles; whether it should is [#1254](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1254)), so the local teardown deletes them as test data. See the [GDPR notes, section 3](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/compliance/GDPR.md#3-event-archive-analytics-and-logs).

The local E2E stack's leftover check is what finds gaps like these: an admin spec erases an account and the check lists anything still keyed by it.

## Account actions across services

The videos admin doesn't change sign-in accounts directly. It **requests** an account action (suspend, delete) from Auth. Auth admins approve or refuse it, and approved actions run from a queue with retries; a failure flags the request ([#574](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/574), [Auth#275](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/275), [Auth#278](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/278)). Suspended and deleted accounts get no tokens by any route. See [Authentication and SSO](authentication.md).

Admins can also **warn** a user: the warning is recorded and audited, and the user gets an in-app notice and an email ([#824](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/824)).

## Scheduled cleanup

| Job | Where | Schedule |
|---|---|---|
| 30-day purge of soft-deleted items | Videos admin, Auth, CMS | Hourly |
| Watch history older than 18 months; event archive older than 13 months | api-videos cron | Daily |
| Abandoned and orphan Bunny uploads (reaper; only removes what an upload made) | api-videos | Scheduled ([#613](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/613), [#634](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/634)) |
| E2E leftovers on QA, stale run accounts, test-library sweeps, orphan collections | GitHub Actions | See [Testing and E2E](testing.md#cleanup-jobs-for-shared-environments) |
| Production test data check | GitHub Actions | Daily and after every production test run |
