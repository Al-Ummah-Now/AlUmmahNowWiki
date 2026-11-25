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
- On 2026-11-13, found by the web and release suites' leftover checks ([#1251](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1251)): the user's **upload rate counters**, **creator tier**, **bot-check pass** (`HUMAN_VERIFIED`, 180 days), **TUS upload sessions** and **bulk edit undo records**; for run accounts also their **Watch later and personal playlists** and privacy footprints. A video deleted for good (purge, cleanup or erasure) now also takes its **subtitles**, **upload marker**, **scheduler entry**, **playlist adds** and **file claim**; in an account erasure they go with the [media files](#media-files). A deleted channel's hidden search row keeps only its id, and the admin list-count cache no longer stores the admin's search (an email) in its key.
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

The rules for every client that offers **Delete account**. They're the target, and each client is reviewed against them. The web page's address isn't in Google Play's Data safety form yet.

### Status

| Client | State |
|---|---|
| Web page `https://profile.auth.alummahnow.net/delete-account` (add `?lang=ar` for Arabic; `account.alummahnow.net/delete-account` leads there) | Live ([Auth#533](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/533)) |
| Apple Studio | In review ([Apple#97](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/97)) |
| Android Studio | In review ([Android#68](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/68)) |
| Server ([#1937](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1937), [#1933](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1933)) | Live on production since 2026-11-24 (`v2026.11.24.2`) |

"In review" doesn't mean a client already meets every rule below; its PR lists what is open.

### Order of the calls

1. **Erase the Videos data:** `DELETE /api/privacy/data` with `{"confirm":"DELETE"}`, one bounded pass at a time, until `complete: true`.
2. **Delete the sign-in account:** `DELETE /account` on Auth. Never before step 1 is complete: without the account, nobody can sign in to erase the rest.

**Every attempt must start at step 1**, also a retry after step 2 failed and an attempt after a sign-in in the middle. The account was live in between and may hold something new; the erase is safe to repeat and quick when there is nothing left. No client may remember "step 1 is done" as a reason to skip it.

### A recent sign-in and one account

- Before anything is erased, the sign-in must be recent. Auth accepts 600 seconds (`auth_time`). A client must start with a margin, so the erase fits; the web page asks for at most 300 seconds.
- A client must read `properties.id` from the access token before **every** call, also after a token refresh, and stop if it is missing or isn't the account the person confirmed. It must never fall back to `sub`. Both calls must use that account's own token.
- A sign-in started for a deletion must be bound to its OAuth `state` and a short expiry, and dropped when the person cancels. If they come back as someone else, the client must stop, erase nothing of either account and say that this is a different account. An app with several accounts must make the first one active again; the web page can't, because the new sign-in replaces the old one.
- Step 2 can answer `401 insufficient_user_authentication` after a long erase. The client must say that the content is gone and the account isn't, ask to sign in again once, and start at step 1.

### The dialog

- It must be in the app or page, never an OS or browser alert, with focus on **Cancel** first.
- It must always have a way out: an enabled button and Escape or back, also after an answer that never comes and after the deletion is done. Only a request that is out may hold it, for a limited time.
- It must name the account and say, **before** the word is typed, that channels the person owns are deleted whole, with what their other admins and members added. A client that knows how many channels that is must say the number. The web page doesn't know it.
- **The typed word:** either `DELETE` or «حذف» must be accepted in either language, because a keyboard may have only one of them. The dialog shows the one in the person's language. Letter case, spaces around the word, and Arabic vowel marks, tatweel and direction marks anywhere in it must not count.
- A client that says what is deleted must not promise that stored video and image files are gone (see [Media files](#media-files)).

### Passes and errors of step 1

| Answer | What the client must do |
|---|---|
| `complete: false` with a `resumeToken` | Send the token back unread in the next pass. It is opaque, belongs to the account and lasts 24 hours. |
| `restarted: true` | The token couldn't be used and the server began again: go on with the new token. |
| `complete: false` without a token | Stop: not finished. |
| `503` (`resume_unavailable` or other) | Wait at least `Retry-After`, then try again, by itself or when the person asks. Say that some content may be gone and the account still exists. Never go on to step 2. |
| `400`, `401`, `403`, `404`, `429` | This pass removed nothing. Ask to sign in for `401 insufficient_user_authentication`; wait for `429`. |
| Another error, or no answer | Unknown: some content may be gone. Never say "nothing happened" or "done". |
| `complete: true` with `channel_unreadable:<id>` in `errors` | The server couldn't read that channel, so it and what's on it stay until an admin removes them. The team is told through the Errors page. Before step 2 the client must tell the person that the channel stays until then, and let them choose: delete the account anyway, or stop and come back. It must not go on by itself, and must not refuse for good: that would lock the person out of deleting. |
| `complete: true` with other `errors` | The same choice, in plain words without ids or raw strings. Nobody is told about these automatically, so the text must not say so. |

After **50 passes** in one go the client must stop and ask the person to confirm again, keeping the progress. The server has no limit; 50 is what the web app's privacy page uses.

### Progress and cleanup

- **Before step 1 the client must save that a deletion started**, per account: the pinned id and the latest token. If it can't, it must call nothing. It updates the record after each pass and before step 2. The record has no expiry while the account exists: one from last week still means that content may be gone. The web page keeps it in the Auth database, and the token never reaches the browser; the apps keep it on the device. A lost record is safe, because an attempt without one starts step 1 from the beginning.
- **An open record must show.** Coming back to the page or opening the app must say that a deletion started and that some content may be gone and, where the person can finish it, that anything added before then is deleted too. Nothing is erased until the person confirms again.
- **Nothing local may be removed before both steps succeeded.** Then queued and staged uploads, the local session and the record must go, in that order, with a saved marker so an upload that was still running can't write back for the deleted account. If the app is killed in between, its next start must finish the cleanup, although the session no longer works.
- **A deletion that worked must never be shown as failed.** After a lost answer from step 2, ask again: Auth answers `deleted: true` for an account that's already deleted. `404` with `error: "not_found"` also means deleted, but only right after step 1 succeeded for the same account; any other `404` is an error. The web page reads Auth's own record instead, and keeps its own for a day to settle a lost answer. Cleanup that fails after step 2 must not turn success into an error.
- The "deleted" message must be shown on proof only (the answer itself, or Auth's record), never from an address or a saved flag that could be faked.

### What goes and what stays

What is true on `main` today.

- **At once, for good:** the Videos profile, owned channels with everything on them, the person's playlists, posts, watch history, subscriptions, likes and votes. There is no 30-day restore for these.
- **Kept for a legal obligation:** the sealed records of items reported for child safety, for at least a year after the last report about the item is decided and while a case about it is open. They are exempt from account erasure for that time (in review: [#1934](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1934)).
- **Kept without the person:** their comments elsewhere (the text is emptied), reports they filed, and what they added to someone else's channel.
- **The sign-in account** is deleted at once and its record is purged after **30 days**: from then on the hourly cleanup removes it, and sooner only if an Auth admin asks for it. Text for people must say "after 30 days" / «بعد ٣٠ يومًا», never "within" / «خلال». Until then an Auth admin can restore it, without the Videos data. Refresh tokens stop at once; access tokens already issued are refused within the [revocation time](authentication.md).
- The follow-up messages of an erase (search rows, moderation copies) are queued after it. If queueing fails they aren't sent again today.

#### Media files

Stored files are removed by their own job, `user.erase-media` (videos admin → Jobs: state, reason, Retry), not by the request that erases the records ([#2001](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/2001)).

- **Written down first.** Before a record is deleted, the job gets what its media is: ids and file paths, no text and no account. If that can't be stored, the record stays and the erase answers `503`; the client tries again later.
- **From 24 hours on.** The first file goes 24 hours after the last record was deleted. What fails is tried again for about a day; then the job fails and shows on the Errors page with Retry. Six hours after the files are gone it looks once more, for an encode that was still running.
- **What goes:** R2 renditions, downloads, thumbnails, kept originals and audio tracks of the person's videos, and their CDN copies; subtitles, review frames, audio and transcripts; Bunny's copy of each video; live recordings; caption work files; the post images, avatars and covers of their channels; their profile images.
- **What stays:** what they uploaded to someone else's channel (the channel's, without their name); an image another person uploaded to a deleted channel while that person still shows it; images whose uploader can't be proven, until an admin has looked at them (listed in the job and on the Errors page); media under an open safety case, until the case is done; Bunny's edge copies of images until they expire, where no account key is set.
- **A row for each deleted video, stream and channel** (its id, and when its media went) stays as long as the job's own record, 2 years. Rows that name the account go when its images are gone.
- **E2E run accounts** (non-production, test library only) are cleaned at once and leave no rows.

Text for people must not say that files are gone at once. Copies can remain for a short time after the content is deleted.

## Account actions across services

The videos admin doesn't change sign-in accounts directly. It **requests** an account action (suspend, delete) from Auth. Auth admins approve or refuse it, and approved actions run from a queue with retries; a failure flags the request ([#574](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/574), [Auth#275](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/275), [Auth#278](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/278)). Suspended and deleted accounts get no tokens by any route. See [Authentication and SSO](authentication.md).

Admins can also **warn** a user: the warning is recorded and audited, and the user gets an in-app notice and an email ([#824](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/824)).

## Scheduled cleanup

| Job | Where | Schedule |
|---|---|---|
| 30-day purge of soft-deleted items | Videos admin, Auth, CMS | Hourly |
| Watch history older than 18 months; event archive older than 13 months | api-videos cron | Daily |
| Profile email reports older than 30 days (an erased account's go at erasure) | api-videos cron | Daily ([#1871](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1871)) |
| Reports sent without an account, a year after their decision; kept child safety records past their time | admin-api cron | Daily ([#1934](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1934), in review) |
| Admin history older than 2 years; dead letters, erase tombstones older than 30 days; archive title index past the archive's retention | processor cron | Daily |
| Abandoned and orphan Bunny uploads (reaper; only removes what an upload made) | api-videos | Scheduled ([#613](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/613), [#634](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/634)) |
| E2E leftovers on QA, stale run accounts, test-library sweeps, orphan collections | GitHub Actions | See [Testing and E2E](testing.md#cleanup-jobs-for-shared-environments) |
| Production test data check | GitHub Actions | Daily and after every production test run |
