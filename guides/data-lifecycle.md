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

Every client that offers **Delete account** follows this contract: the web page `/delete-account` ([Auth#533](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/533)), Apple Studio ([Apple#97](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/97)) and Android Studio ([Android#68](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/68)). All three are in review; none is released, and the web page's address isn't in Google Play's Data safety form yet. The two calls they make, and the reworked erase behind the first one ([#1937](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1937), [#1933](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1933)), are on AlUmmahNow `main` and in release `v2026.11.24.2`.

### Order of the calls

1. **Erase the Videos data:** `DELETE /api/privacy/data` with `{"confirm":"DELETE"}`, one bounded pass at a time, until `complete: true`.
2. **Delete the sign-in account:** `DELETE /account` on Auth. Never before step 1 is complete: without the account, nobody can sign in to erase the rest.

**Every attempt starts at step 1.** That includes a retry after step 2 failed, and coming back from a second sign-in. The account was live in between and may hold something new; the erase is safe to repeat and quick when there is nothing left. No client remembers "step 1 is done" as a reason to skip it.

### A recent sign-in and one account

- Before anything is erased, the sign-in must be recent. Auth accepts 600 seconds (`auth_time`); start with a margin (the web page asks for at most 300 seconds), so the erase fits.
- Read `properties.id` from the access token before **every** call, also after a token refresh. Stop if it is missing or isn't the account the person confirmed; never fall back to `sub`. Both calls use that account's own token.
- Bind a sign-in started for this to its OAuth `state` and a short expiry, and drop it when the person cancels. If they sign in as someone else, stop, leave both accounts alone (an app with several accounts makes the first one active again) and say so.
- Step 2 can answer `401 insufficient_user_authentication` after a long erase. Say that the content is gone and the account isn't, ask to sign in again once, and start at step 1.

### The dialog

- In the app or page, never an OS or browser alert. Focus starts on **Cancel**.
- It names the account, and says **before** the word is typed that channels the person owns are deleted whole, with what their other admins and members added. A client that knows how many channels that is says the number; the web page doesn't know it.
- The word is `DELETE` in English and «حذف» in Arabic, each only in its own language. Case, spaces around it, and Arabic vowel marks, tatweel and direction marks anywhere in it don't count.
- Where a client says what is deleted, it also says that stored copies of video and image files can remain for a time (see [What goes and what stays](#what-goes-and-what-stays)).

### Passes and errors of step 1

| Answer | What the client does |
|---|---|
| `complete: false` with a `resumeToken` | Sends the token back unread in the next pass. It is opaque, belongs to the account and lasts 24 hours. |
| `restarted: true` | The token couldn't be used and the server began again. Goes on with the new token. |
| `complete: false` without a token | Stops: not finished. |
| `503` (`resume_unavailable` or other) | Waits for `Retry-After`, then can try again with the token it has. Says that some content may be gone and the account still exists. Never goes on to step 2. |
| `400`, `401`, `403`, `404`, `429` | This pass removed nothing. A `401 insufficient_user_authentication` asks to sign in; `429` waits. |
| Another error, or no answer | Unknown: some content may be gone. Never "nothing happened", never "done". |
| `complete: true` with `errors` | Says in plain words what stayed, without ids or raw strings, **before** step 2. The person deletes the account anyway, or stops and comes back. `channel_unreadable:<id>` is a channel the server couldn't read: it and what's on it stay up, and the team is told through the Errors page. Other entries are server gaps nobody is told about automatically, so the text doesn't say so. |

After **50 passes** in one go the client stops and asks the person to confirm again. The server has no limit; 50 is what the web app's privacy page uses. The progress stays.

### Progress and cleanup

- **Before step 1, record that a deletion started**, per account: the pinned id and the latest token. If that can't be written, nothing is called. Update it after each pass and before step 2; remove it when the account is gone. It doesn't expire: a record from last week still means that content may be gone. The web page keeps it in the Auth database and the token never reaches the browser; the apps keep it on the device. A lost record is safe, because an attempt without one starts step 1 from the beginning.
- **An open record shows.** Coming back to the page or opening the app says that a deletion started, that some content may be gone, and that anything added before it's finished is deleted too. The person confirms again to finish; nothing goes on by itself.
- **Nothing local is removed before both steps succeeded.** Then queued and staged uploads, the local session and the record go, in that order, with a saved marker so an upload that was still running can't write back for the deleted account. If the app is killed in between, the next start finishes the cleanup, although the session no longer works.
- **A deletion that worked is never shown as failed.** After a lost answer from step 2, ask again: Auth answers `deleted: true` for an account that's already deleted. `404` with `error: "not_found"` also means deleted, but only right after step 1 succeeded for the same account; any other `404` is an error. The web page reads Auth's own record instead. Cleanup that fails after step 2 doesn't turn success into an error.
- The "deleted" message is shown on proof only (the answer itself, or Auth's record), never from an address or a saved flag that could be faked.

### What goes and what stays

What is true on `main` today. The media part changes when the [planned media cleanup](#media-files) ships.

- **At once, for good:** the Videos profile, owned channels with everything on them, the person's playlists, posts, watch history, subscriptions, likes and votes. There is no 30-day restore for these.
- **Kept without the person:** their comments elsewhere (the text is emptied), reports they filed, and what they added to someone else's channel.
- **The sign-in account** is deleted at once and its record is purged after **30 days**. Until then an Auth admin can restore it, without the Videos data. Refresh tokens stop at once; access tokens already issued are refused within the [revocation time](authentication.md).
- The follow-up messages of an erase (search rows, moderation copies) are queued after it. If queueing fails it's only logged today.

#### Media files

Stored files can outlast the records. Bunny's copy of a video is deleted during the erase, once: a failure is logged and not repeated. Video files, originals and thumbnails on R2 and images in Bunny Storage aren't removed by the erase. The server change that removes them is in progress; until it ships, no client says that every file is gone.

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
