[← Home](../README.md)

# Deletion, erasure and cleanup

How data is deleted across the platform: soft deletes, the 30-day purge, account erasure and the cleanup jobs. Read from each repo's default branch on 2026-11-12, updated 2026-11-13. The privacy reference is the monorepo's [GDPR notes](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/compliance/GDPR.md).

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
- Also from those checks (owner decisions 2026-11-13, [#1288](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1288)), the three cases below: admin history, archive titles, dead letters and late writes.

### Admin history

The admin deletion registry (`admin_deletions`) and the admin jobs (`admin_jobs`) are the record of what admins did. They're kept for **2 years**: the processor's daily cron deletes purged deletions and finished jobs older than that. Pending deletions and running jobs are never touched ([#1253](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1253)).

Erasing an account keeps every action record but removes the person from it:

- Its videos, channels and other content in the registry get the title **"erased video"**, **"erased channel"** (and so on), and the owner `deleted-user`.
- Its own account row gets the title **"erased user"**. The row keeps its key (the account id) because the purge and the E2E run sweep look it up by id.
- Wherever it deleted something or asked for a permanent delete, and wherever it was a job's actor, target or a user in its parameters or result, the id becomes `deleted-user`. Each job records the accounts it names, so the erasure finds them by index, never by scanning. A job still running when the erasure happens (usually the erasure job itself) keeps its target until it succeeds, and then drops it.

### Archive titles

The event archive keeps public titles and channel names for statistics ([#1254](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1254)). When a creator is erased they become placeholders:

- Every archived message that carries a title or channel name is indexed under its owners: the content's owner, creator, author or actor, or whoever was notified about it. Viewers aren't owners. The index holds only a hash of the owner and the archive key.
- The erasure queues its own step, which rewrites the creator's archived messages 50 at a time with **"erased video"**, **"erased channel"** or **"erased playlist"**, then drops the index rows. A message about a creator who was already erased gets the placeholders when it's written.
- Older entries, from before the index, are handled by a one-off pass (`archive-privacy-rewrite.ts start --titles`, a dry run by default). It links each titled entry to the current owner of the content it names, and writes placeholders at once when that content no longer exists.

### Dead letters and late writes

- **Dead letters keep hashed ids.** A message that fails for good is stored for diagnosis with every user id replaced by a hash (`uh_…`), in the body and the failure reason, and expires after **30 days**. Hashed rows can't be replayed. Erasure steps are the exception: they keep the real id so a failed erasure can still be finished ([#1255](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1255)).
- **Erase tombstone.** The erasure records a hash of the erased id for **30 days**. An error report that arrives later, for example from a page that was still open, is stored as `deleted-user` with no identifying details and doesn't count the person as an affected user.

### The event archive

The processor keeps a copy of queue messages (`al-ummah-now-messages`) for statistics and abuse investigation. Every message is scrubbed before it's written ([#1180](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1180), issue [#1177](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1177)):

- **User ids become pseudonyms** (`ps_…`). Each one is a keyed hash under a random secret kept for that person. The secrets table is itself keyed by a hash of the id, so it holds no raw id either.
- **Free text, contact and device details are dropped**: report descriptions, comment and message text, search queries, names, emails, IP addresses and user agents. Referrers keep only their host, and links lose their query string.
- **Erasure cuts the archive off.** The erase deletes the person's secret, and from then on nothing can tie their archived events back to them. Later messages about the account, and the erase messages themselves, are archived as `deleted-user`.
- **Older entries were rewritten once.** Entries from before this change were rewritten with a key that existed only for that run and was then deleted.

The archive itself still expires after 13 months. The local E2E leftover check stays strict on it: a test run's ids turning up there would mean the scrubbing broke. A run's own entries still match through its video and channel titles until its accounts are erased (see [Archive titles](#archive-titles)), so the local teardown deletes them as test data. See the [GDPR notes, section 3](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/compliance/GDPR.md#3-event-archive-analytics-and-logs).

The local E2E stack's leftover check is what finds gaps like these: an admin spec erases an account and the check lists anything still keyed by it.

## Self-service account deletion (shared client rules)

Every client that offers **Delete account** — the public web page ([Auth#533](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/533), `/delete-account`, in review; planned as Google Play's Data safety deletion URL, not yet submitted to Play), Apple Studio ([Apple#97](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/97), in review) and Android Studio ([Android#68](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/68), in review) — follows the same contract so no client leaves orphan data, deletes the wrong account, or traps a user in a half-deleted state:

1. **Two-step server order (never reversed):**
   - **Step 1 — Erase Videos data first:** call `DELETE /api/privacy/data` (accepting Auth-issued tokens per [#1933](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1933), merged on `main`, not yet released to production; enforcement depends on `AUD_MODE`) in bounded resumable passes, sending each returned opaque, account-bound `resumeToken` (valid 24 hours) until `complete: true`. Guard the loop with a client pass cap (50 passes, to prevent infinite loops against a stuck server).
     - If the server cannot open a resume token, it restarts the run (`restarted: true`) with a fresh token; accept the new token and count the pass toward the cap.
     - If the server answers `503 resume_unavailable` with `Retry-After`, wait and retry with the same token within bounds rather than hard-failing the whole deletion.
     - Fail closed if `complete: false` arrives without a `resumeToken`, if the pass cap is hit, on unrecoverable non-2xx responses, or if `errors` contains `channel_unreadable:*`. On `channel_unreadable:*`, tell the user that some Videos data may already have been erased, ask them to try again later (re-entering via the persisted in-progress record below), and note that support has been notified.
     - On `main` today, non-blocking `errors` can report server-side gaps (for example `ADMIN_BACKUPS is not bound: legacy-restore backups were not erased`). When `complete: true` returns with non-blocking `errors`, show a plain-language summary (no raw error strings or internal ids) and let the user choose whether to continue or stop **before** Step 2.
   - **Step 2 — Delete the Auth account second:** only after Step 1 completes (and the user confirms past any Step 1 warning), call `DELETE /account`. Treat `200` as deleted; treat `404` with `error: "not_found"` as already deleted **only** because Step 1 just succeeded under the same pinned id (never treat a bare `404` elsewhere as success, and treat any other `404` body as an error). Videos data must be erased first because deleting the Auth account ends sign-in.
2. **Recent sign-in (step-up) and fail-closed account pinning:**
   - Require a recent interactive sign-in (`auth_time` within `max_age`, default 10 minutes / 600 s; `DELETE /account` enforces `401 insufficient_user_authentication` with `max_age`).
   - Read the canonical Auth user id (`properties.id`) from the access token on **every** call — pre-check, step-up callback, Step 1, Step 2, and after any token refresh. Fail closed if `properties.id` is missing or differs from the pinned id (never fall back to `sub`), and send the pinned account's token for both Step 1 and Step 2 (matching Auth's own `properties.id` check).
   - Bind pending step-up intent to the OAuth `state` and a short expiry, and clear it on cancel or dismissal. If the user completes step-up as a different account, cancel deletion, keep the other account untouched (restoring the original active account in multi-account apps), and show an explicit wrong-account notice.
   - Because a multi-pass Step 1 erase can exceed the 600 s `auth_time` window, `DELETE /account` may answer `401 insufficient_user_authentication` after Step 1 succeeded. In that case, allow one fresh step-up immediately before Step 2 and resume directly at Step 2 using the persisted in-progress record (completed Step 1 remains valid for that uninterrupted flow; never loop step-up more than once per step).
3. **Explicit in-app confirmation:**
   - Confirm in an accessible in-app dialog (never an OS or browser alert), focus **Cancel** first, name the account being deleted, state the number of owned channels where known, and explicitly warn that owned channels are deleted whole — including videos uploaded to those channels by other admins or editors — **before** enabling confirmation.
   - Require typing the localized confirmation word only (`DELETE` in English, «حذف» in Arabic — English `DELETE` is not accepted in the Arabic UI), ignoring case, surrounding whitespace, and stripping Arabic harakat, tatweel and bidi marks anywhere in the input.
4. **Persisted progress, retries, and local cleanup:**
   - Write a persisted per-account **"deletion in progress"** record *before* Step 1, storing the pinned `properties.id`, the opaque `resumeToken` (valid 24 hours), and the current phase (`erasing`, `deleting_auth`, `cleaning_local`). **Nothing local is removed before both Step 1 and Step 2 succeed.**
   - **Retries always re-run Step 1:** if Step 1 fails, abort before `DELETE /account` and keep local uploads intact. If Step 2 fails (other than an immediate mid-flow step-up retry above), report the partial state clearly; every subsequent retry starts again at Step 1 with a fresh token before calling Step 2, so any Videos data created in the interim (such as an in-flight upload) is never left behind.
   - **Process-death recovery:** on next app launch, an open in-progress record in `erasing` or `deleting_auth` resumes from Step 1; a record in `cleaning_local` (Step 2 already succeeded before the process died) finishes local cleanup (queued/staged uploads and session teardown) even though the session is already revoked.
   - After both Step 1 and Step 2 succeed, transition to `cleaning_local`, purge that account's queued and staged local uploads, persist a purge tombstone so no in-flight background worker or resumed staging can write back under the deleted user id, forget the client session, clear the in-progress record, and complete single sign-out.
5. **Scope, retention, and current server limits:**
   - Channels owned by the deleted account are deleted whole (including videos uploaded to those channels by other admins or editors). Videos the user uploaded to someone else's channel remain with that channel.
   - **Videos records are hard-deleted at once** by `DELETE /api/privacy/data` (profile, channels and video records are not recoverable). **Only the Auth account** is soft-deleted (`selfDeletion` row) and purged permanently after **30 days** by Auth's scheduled purge job.
   - Auth revokes refresh tokens immediately; already-issued access tokens are rejected within the server's revocation bound.
   - **Media files today vs. planned:** on `main` today, `onVideoDeleted` (`privacy.ts`) deletes Bunny media in-request on a best-effort basis (failures are logged), while the queued `VideoDelete` message handles search/index sync rather than media removal. R2 media erasure and retried server media-cleanup jobs are planned (not yet merged on `main`), so stored media files can outlast deleted records until that server work lands; user-facing copy must not claim otherwise.

## Account actions across services

The videos admin doesn't change sign-in accounts directly. It **requests** an account action (suspend, delete) from Auth. Auth admins approve or refuse it, and approved actions run from a queue with retries; a failure flags the request ([#574](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/574), [Auth#275](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/275), [Auth#278](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/278)). Suspended and deleted accounts get no tokens by any route. See [Authentication and SSO](authentication.md).

Admins can also **warn** a user: the warning is recorded and audited, and the user gets an in-app notice and an email ([#824](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/824)).

## Scheduled cleanup

| Job | Where | Schedule |
|---|---|---|
| 30-day purge of soft-deleted items | Videos admin, Auth, CMS | Hourly |
| Watch history older than 18 months; event archive older than 13 months | api-videos cron | Daily |
| Profile email reports older than 30 days (an erased account's go at erasure) | api-videos cron | Daily ([#1871](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1871)) |
| Admin history older than 2 years; dead letters, erase tombstones older than 30 days; archive title index past the archive's retention | processor cron | Daily |
| Abandoned and orphan Bunny uploads (reaper; only removes what an upload made) | api-videos | Scheduled ([#613](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/613), [#634](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/634)) |
| E2E leftovers on QA, stale run accounts, test-library sweeps, orphan collections | GitHub Actions | See [Testing and E2E](testing.md#cleanup-jobs-for-shared-environments) |
| Production test data check | GitHub Actions | Daily and after every production test run |
