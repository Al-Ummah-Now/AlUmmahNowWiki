[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Channel claim, transfer and self-service account move

| | |
|---|---|
| **ID** | `AUN-CHANNEL-CLAIM` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (shared-types, api-videos, admin-api, admin-web, web, processor), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **in progress**. The admin transfer exists ([§2](#2-what-exists-today-inventory-2026-11-23)). Phase A (complete the admin transfer, handle tools) is built and in review as a PR stack ([§14](#14-stories)). The owner answered CC-D1 to CC-D12 on 2026-11-23 ([§13](#13-owner-decisions)); Phase B's approval step and Phase C's review run on the approval workflow system ([AUN-WORKFLOWS](README.md)), which is being built |
| **Last updated** | 2026-11-23 |
| **Replaces** | The draft spec in [AlUmmahNow#460](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/460) (2026-11-08). Most of its design is kept here; the parts that were built differently follow the code |

## Goal

Three ways a channel changes hands, all ending in the same safe, audited move:

1. **Admin transfer.** A super admin moves a channel to another account. This exists, but it leaves records behind and tells nobody. Phase A makes it complete.
2. **Self-service move.** A channel owner hands their channel to one of the channel's own admins (channel roles), who accepts. The move runs at once, unless the channel accepts creator support, when an admin must approve it first. Owner decisions CC-D1 to CC-D4 and the 2026-11-23 rules relax [O16](decisions.md#o16-channel-roles-separate-from-site-roles-only-super-admins-transfer-ownership) for this case only.
3. **Claim.** A creator whose channel was imported by the team (Admin Tools import) asks for it, explains and attaches any proof, and an admin decides through the approval workflow. This is new. Moving a channel to someone who isn't one of its admins is only possible this way or by an admin move.

Admins also get **handle tools**: set, release, or take back an official @handle on any channel ([O17](decisions.md#o17-super-admins-claim-and-assign-official-channels)).

Non-goals: co-owners (a channel has one owner); moving comments, likes or watch history (they record what a person did); merging two accounts.

## Decisions and constraints

- [O16](decisions.md#o16-channel-roles-separate-from-site-roles-only-super-admins-transfer-ownership): channel roles are separate from site roles; only super admins transfer ownership (decided 2026-11-09). Relaxed on 2026-11-23 ([CC-D1](#13-owner-decisions)): an owner may hand the channel to one of its own channel admins.
- [O17](decisions.md#o17-super-admins-claim-and-assign-official-channels): super admins claim and assign official channels (decided).
- Platform rules: cost kept small ([O1](decisions.md#o1-cost-conscious-design)); never Stripe ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans)); every feature tiered and admin-managed ([T1](decisions.md#t1-plans-are-admin-managed)); new user features sit behind a switch on the [Features page](AUN-FEATURES-feature-switches.md), off by default and [hidden when off](../guides/product-rules.md#hidden-when-off); bilingual en/ar with Eastern Arabic digits.

## 1. Words

| Word | Meaning |
|---|---|
| Owner | `channel.userId`. Exactly one. Never a grantable role ([channel roles](AUN-CHANNEL-ROLES-channel-roles.md)) |
| Move | The job that changes the owner and every record that carries the owner's id. All three paths use it |
| Offer | A pending self-service move, waiting for the receiving channel admin to accept (and, for a channel with creator support, for an admin's approval) |
| Claim | A creator's request for an imported channel, an approval workflow request waiting for an admin |
| Claimable channel | A channel an admin has marked as held for its real creator |

## 2. What exists today (inventory, 2026-11-23)

Paths are in AlUmmahNow at `origin/main` unless noted.

| Area | Today |
|---|---|
| Admin route | `POST /api/content/channels/:id/transfer` in `apps/admin-api/src/routers/content.router.ts`. Needs `channels:transfer`, which only `super_admin` holds (`packages/shared-types/src/admin-content.ts`). Writes the audit row first (`site_settings_log`, kind `channel`, action `transfer`) |
| Internal route | `POST /internal/admin/channels/:id/transfer` in `apps/api-videos/src/routers/admin.router.ts`, `INTERNAL_API_KEY` plus `X-Admin-Actor` |
| Checks | Channel exists and isn't deleted, target isn't the owner (`already_owner`), target has a profile (`new_owner_not_found`), target isn't banned (`new_owner_banned`) — `transferChannel` in `apps/api-videos/src/lib/admin/service.ts` |
| Job | `channel.transfer` in `SEARCH_DB.admin_jobs`, run from `ADMIN_JOBS_QUEUE` with retries, DLQ and a Retry button on the admin Errors page. `runTransfer` changes the channel (`userId`, `isMain`, drops the new owner's member entry), both profiles' `channels[]`, the old owner's main channel (`pickNewMainChannel`), each video's `userId` and each playlist's `userId`. Sends `ChannelUpdate {action:'transferred'}`, which the processor only logs |
| Search index | `content_ownership` and `channel_access` follow the R2 writes (`apps/api-videos/src/lib/search/ownership.ts`) |
| Admin screen | `/channels/[id]` → `ChannelTransfer.tsx`: the shared Autocomplete (team members first, banned people can't be picked; [ADM-1, AlUmmahNow#1405](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1405)), a confirm dialog where the admin types the @handle or the new owner's user id ([#1868](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1868)), live job progress |
| Invites | An admin invite can hand over up to 10 existing channels (`channels.transfer`), and a revoked, never-accepted invite gives them back before the invitee's data is erased (`apps/admin-api/src/lib/invite-erase.ts`) |
| Handles | Owners change their own handle in channel settings. `canClaimOfficialHandles` lets a super admin use an official handle only on a channel they own or administer (`apps/api-videos/src/lib/channelHandles.ts`). Handle history and 301s exist ([AUN-SEO](AUN-SEO-search-visibility.md)) |
| Team | Members can leave; the owner can't leave or be removed (`channelMembers.ts`). `transfer_kept_old_owner` is defined in `channel-roles.ts` but never written |
| Import | Admin Tools import creates a channel owned by a chosen user or the acting admin. YouTube import marks videos with `importedFrom {platform:'youtube', videoId}` but stores no proof of who owns the YouTube channel |
| Tests | Unit: `apps/api-videos/test/admin-content.spec.ts`, `admin-invites.spec.ts`; `apps/admin-api/test/content-endpoints.test.ts`, `invites.test.ts`, `invite-erase.test.ts`; `apps/admin-web/test/channel-transfer.test.ts`. E2E: `apps/admin-web/e2e/14-channel-transfer.spec.ts` TRANSFER-01..05 |
| Native | Studio shows the caller's role per channel. No transfer, claim or move anywhere. Core's OpenAPI has members and leave only |
| Auth | Nothing. The account hub plan sends lost-mailbox recovery to a super admin transfer |

### 2.1 Gaps in the existing move

The move leaves these on the old owner or unchanged:

1. **Soft-deleted videos.** `contentIds` filters `is_deleted = 0`, so a video restored after the move still belongs to the old owner.
2. **Handle index.** `channel-handles/{handle}.userId` keeps the old owner.
3. **Live streams** (`livestream:*`): `userId` unchanged and **stream keys not rotated**, so the old owner can still broadcast to the channel.
4. **Scheduled-publish records** (`scheduled-videos`): publish notices go to the old owner.
5. **Community posts** (`posts/{channelId}/*.json`): `userId` unchanged.
6. **`channel.email` and `contactEmail`**: the old owner's addresses stay on the channel and `contactEmail` stays public.
7. **Subscriptions the channel made** to other channels.
8. **Nobody is told.** No notification to either owner, no realtime nudge, so the old owner's channel switcher shows the channel until they sign in again.
9. **No reason** is asked for, **no lock** stops two moves of one channel, no check for a **live broadcast**, and nothing **verifies** the result.
10. **Verification badge** stays, whoever receives the channel.

## 3. The move (shared by all three paths)

### 3.1 What moves

| Record | Change | How it's found |
|---|---|---|
| Channel | `userId`, `email` removed (channels carry no copy of the account email; [#1866](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1866)), `isMain` ([§3.2](#32-main-channel)), `contactEmail` cleared unless kept, `transferredAt`, `dateModified` | By id |
| Handle index | `userId` | By handle |
| Profiles | Old loses, new gains the id in `channels[]` | By id |
| Videos and shorts, **including private, draft, hidden and soft-deleted** | `userId` | `content_ownership` by `channel_id` **with no `is_deleted` filter** (indexed column; new `contentIdsAll`) |
| Live streams | `userId`, new stream key and ingest URL on every stream that hasn't ended | Live store by channel |
| Scheduled-publish records | `userId` | From each scheduled video |
| Playlists in `channel.playlists` | `userId` | By id (exists) |
| Community posts | `userId` | `posts/{channelId}/` prefix |
| Subscriptions the channel made | `userId` on the entry, `channel_subscribers` row, both profiles' `subscribedTo` | `channel_subscribers` by channel id (indexed) |
| Team | New owner's member entry removed (exists); old owner added as admin only when chosen ([§3.4](#34-old-owner)) | Channel |
| Pending channel invites addressed to the new owner | Cancelled | `SEARCH_DB` invites by channel |
| Verification badge | Stays with the channel ([CC-D8](#13-owner-decisions)) | — |

Only records whose `userId` is the old owner are rewritten. Anything else is counted as an anomaly and shown in the result. Subscribers, bells, sections, analytics, reports, comments and reactions stay with the channel as they are.

### 3.2 Main channel

New owner: the channel arrives as main only if they have no channel. Old owner: `pickNewMainChannel` picks their next main (exists); with no channel left they can browse and create one.

### 3.3 Job, lock, verify

- The existing `channel.transfer` admin job stays the engine. It gains the steps in §3.1, each idempotent, run in order: `channel → links → videos → live → schedules → playlists → posts → subscriptions → team → notify → verify`.
- **Lock:** one unfinished move per channel, taken atomically: a row in `channel_transfer_locks` (primary key `channel_id`) is inserted before the job is created and deleted when the job succeeds. A lock whose worker died before it created the job is stale after 10 minutes; if it did create one, that job decides ([#1958](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1958), [#1935](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1935)). A second request gets `409 transfer_in_progress`; Go live and handle edits on that channel do too.
- **Recovery after a failed move:** a move job can't be cancelled (`ADMIN_JOB_UNCANCELLABLE_KINDS`). When it fails for good it keeps its lock, so the channel can't go to a third account (`409 transfer_unfinished`) while some records still sit on the first owner; the admin finishes it with **Retry** on the Errors page, which runs every idempotent step again and releases the lock on success. A failed move whose offer an erasure stopped holds no lock ([5.1](#51-state-machine-offers-the-move-job-the-lock-and-an-account-erasure)).
- **Live check:** refused with `409 channel_is_live` while a broadcast is on air. The request check is not enough on its own, because a broadcast can start between the request and the job: the job checks again just before it flips the owner and, if the channel is live, waits for a later retry; and Go live is refused (`409 transfer_in_progress`) while a move of the channel is open. A test covers the race.
- **Creator support:** support never moves with a channel unless an admin decides ([CC-D10](#13-owner-decisions)). A move of a channel that accepts payments (an active or pending payee, an active pledge, or a balance above zero) is refused with `409 channel_has_support` until the admin approval step exists on the approval workflow system; then it waits for that approval ([AlUmmahNow#1812](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1812)). The check fails closed.
- **Receiver's channel limit:** a move to an account whose creator tier has no room for another channel is refused, admin moves included (`409 new_owner_channel_limit`, [CC-D12](#13-owner-decisions)).
- **Verify** re-reads R2: channel owner, handle entry, both profiles, and no `content_ownership` row for the channel with another owner. A mismatch re-runs the step, up to three times, then the job fails into the Errors page with **Retry** (existing). The daily api-videos cron re-verifies moves finished in the last 48 hours, to catch an old-owner edit that raced the flip. It checks each channel's latest move only, and moves only records still on that move's previous owner: the new owner's own changes since are left alone, so are subscriptions made as the channel by a previous owner kept on the team, and nobody gets a second notice. A channel with another move open is left to that move. A repair holds the channel's move lock while it writes (a lock older than 20 minutes is stale), and before every write it checks that the channel is still on that move's owner; a channel that moved on is left alone, with nothing reported. A session the new owner started is never ended.
- Large channels: today `runTransfer` is one handler that either finishes or throws, and a retry runs every step again from the start (each step skips records already moved). That is correct but repeats reads on a very large channel. Per-step cursors in the job params are not built; they are added only if a real channel needs them.

### 3.4 Old owner

The old owner loses all access unless the mover ticks **Keep the previous owner as channel admin**. That adds a member entry `role: 'admin'` and writes `transfer_kept_old_owner` to the team activity log.

### 3.5 Badge and official handles

- **Verification badge**: a property of the channel (`channel.isVerified`), so it stays with the channel on every move ([CC-D8](#13-owner-decisions)).
- **Official handle** going to a non-staff account (no site admin role): the admin must tick a second box. A self-service move of a channel with an official handle is refused (`official_handle`); only an admin can move it.
- Handle stays with the channel by default. Admin option: release it ([§4](#4-admin-handle-tools)).

### 3.6 Notifications and live refresh

The notices use the existing always-on `account` category (`packages/shared-types/src/notifications.ts`, already used by warnings, reviews, team and tier notices, and queued through `notifyTeam` in `channelTeam.ts`): new keys only, rendered in the reader's language, `dedupeKey` `move:{jobId}:{side}`.

| Key | To | English | Arabic |
|---|---|---|---|
| `channelMovedOut` | Old owner | Your channel {channel} was moved to another account. | نُقلت قناتك {channel} إلى حساب آخر. |
| `channelMovedOutByTeam` | Old owner (admin move with no reason, for example an invite hand-over) | The Al Ummah Now team moved your channel {channel} to another account. | نقل فريق الأمة الآن قناتك {channel} إلى حساب آخر. |
| `channelMovedOutByTeamWithReason` | Old owner (admin move) | The Al Ummah Now team moved your channel {channel} to another account. Reason: {reason} | نقل فريق الأمة الآن قناتك {channel} إلى حساب آخر. السبب: {reason} |
| `channelMovedIn` | New owner | You are now the owner of {channel}. | أصبحت الآن مالك القناة {channel}. |
| `channelHandleChangedByTeam` | Owner | The Al Ummah Now team changed the handle of {channel} to @{handle}. | غيّر فريق الأمة الآن معرّف القناة {channel} إلى @{handle}. |

The acting admin's name is never shown; the admin's reason is ([CC-D11](#13-owner-decisions)): there are no silent moves. A move also sends an email to both owners, with the reason to the old owner (one language, chosen per [email rules](../guides/email-templates.md)), because the old owner may not open the app. No separate realtime event: the notice itself arrives on the owner's `user:{id}` socket, and web reloads the live channel list when a move, role-change or removal notice arrives; native apps refetch the list at launch.

### 3.7 Audit

Every admin move request is a row in `site_settings_log` written **before** the change; a request api-videos refuses keeps its row as `transfer-refused` with the refusal code. The move's progress and final result are in the job's own log (`admin_job_log`, the admin job History). Self-service offers and claims are recorded by the approval workflow and the team activity log. Reasons are stored; email addresses are not.

## 4. Admin handle tools

On the admin channel page, super admins only (`channels:transfer`):

- **Set handle** on any channel, official names allowed; route and system words stay blocked. The claim is an exclusive R2 write (`onlyIf: etagDoesNotMatch '*'`), so two claims can't both win.
- **Take back an official handle** from any channel that holds it, with a reason ([CC-D9](#13-owner-decisions)): the holder gets a new default handle and a notice. The official name itself now points to the receiving channel, so it can't redirect to the holder; the holder's channel-id links and short links keep working.
- **Release**: the channel gets a default handle at once.

Each needs a reason and is audited.

## 5. Self-service move (Phase B)

Behind the switch `channelMove` (off). Owner only. Every tier may use it, Free included; it is not a tier capability ([CC-D2](#13-owner-decisions)).

1. **Offer.** Channel settings → **Move channel**. The owner picks the receiving account from a live autocomplete limited to the channel's **current admins** (channel roles); the server refuses anyone else (`409 receiver_not_channel_admin`). A channel can only go to someone who isn't one of its admins through an admin move or a claim. The owner confirms with a fresh sign-in or passkey (within 10 minutes) and types the channel's @handle. Option: keep the public contact email. The page asks for the fresh sign-in **when the owner opens Move channel**, before anything is typed (**Sign in again**, `prompt=login`); someone who comes back signed in as another account sees "This isn't your channel" and nothing has changed (orchestrator, 2026-11-24).
2. **Accept.** The receiving admin gets a notice and an email, and accepts on `/channel-moves/{offerId}` within 7 days. They must be active, not banned, and have room for another channel in their creator tier ([CC-D12](#13-owner-decisions)).
3. **Move.** On acceptance the shared job (§3) runs at once, with actor `user:{ownerId}` ([CC-D3](#13-owner-decisions)); both sides are told. The old owner keeps no access unless the new owner adds them back through channel roles ([CC-D4](#13-owner-decisions)). An admin can stop an open offer.
4. **Channels that accept payments.** If the channel has creator support set up (an active or pending payee, an active pledge, or a balance above zero), acceptance does not run the move: it opens an approval request for admins on the approval workflow system (AUN-WORKFLOWS), and the move runs only when an admin approves; support never moves unless the admin decides how. Until that system can take the request, such offers are refused with a clear message (`409 move_channel_has_support`).

Limits: one open offer per channel; a channel can be moved by its owner at most once every 30 days; refused while the channel is live, under a moderation hold, has an open report under review, or holds an official handle. "Under review" means a moderator has marked a report about the channel as reviewing; a report nobody has picked up yet does not block a move. api-videos asks admin-api (`GET /internal/channel-reports/:id`) and refuses the move when it can't get an answer, a missing `ADMIN_API_URL` included (`503 move_check_unavailable`). The sign-in check reads the token's `auth_time` only, which a refresh and a silent sign-in keep, so the page's **Sign in again** sends `prompt=login` (CC-7). Accepting claims the offer first, so a cancel, decline or stop at the same moment either wins before the claim or is refused; the job is created only while the channel is still the offering owner's, checked again under the move lock. Offers are part of account exports, and erasing an account closes its open offers and removes its id from the rest. Erasing the sender or the receiver stops a move that hasn't changed hands yet: the channel stays the sender's, and is erased with the sender. A move that has changed hands is done: the channel is the receiver's, and is erased with the receiver but not with the sender. The state machine is in [5.1](#51-state-machine-offers-the-move-job-the-lock-and-an-account-erasure).

### 5.1 State machine: offers, the move job, the lock and an account erasure

Four records change at their own pace: the offer row, the move job, the move lock and the channel record. **The channel record decides**: the owner changes in one conditional write on it, and everything else follows.

**Invariants**

1. A move that hasn't changed hands when either person is erased never does. One that has is the receiver's channel.
2. An offer row keeps both ids while it can still begin or finish a move. Only a closed row, or one whose move is settled, loses an erased account's id; the receiver's leaves only once the channel is no longer theirs.
3. A lock is held only by work that can still write. A move that can't change hands holds nothing.
4. No erased account owns a channel when its erasure is complete.

**Offer statuses**

| From | To | By | Condition |
|---|---|---|---|
| (none) | `offered` | owner's offer | one `offered` or `accepting` row per channel (unique index) |
| `offered` | `accepting` | the receiver's accept (claim) | unexpired, `to_user_id` is the caller |
| `offered` | `declined`, `cancelled`, `stopped`, `expired` | receiver, owner, admin, time | still `offered` |
| `offered` | `cancelled` | erasure of either person | in one transaction with its read of the running offers |
| `accepting` | `moved` | the accept, after its job is made | still `accepting` |
| `accepting` | `offered` or `refused` | the accept, when the move is refused | still `accepting`; no job was queued |
| `accepting` | `moved` or `refused` | the next offer, when the accept's worker died over 10 minutes ago | a matching move job exists, or not |
| `accepting`, `moved` | `cancelled` | erasure of either person | the channel was still the sender's when it was marked |
| `accepting` | `moved` | erasure of either person | the channel was already the receiver's |

`declined`, `cancelled`, `expired`, `stopped` and `refused` are final. An offer **stands** while it is `accepting` or `moved`.

**Move job** (`channel.transfer`, with the offer's id in its params; an admin can't cancel it)

| Status | What it does for an owner's move |
|---|---|
| `queued`, `retrying`, `running` | Reads the offer, then the channel. Stops when the offer doesn't stand, the channel carries its stop mark, or the channel isn't the offering owner's. Checked before anything that can fail, and again in the write that changes the owner. A stop ends as `succeeded` with `skipped: stopped` and releases the lock |
| `failed` before the owner changed | Keeps the lock for Retry, unless the offer stopped standing: then it holds nothing. Retry stops |
| `failed` after the owner changed | Keeps the lock: its records are half moved. Retry finishes them |
| `succeeded` | Lock released. A skipped one doesn't hide an earlier move from the daily re-verify |

**Lock holders** (`channel_transfer_locks.job_id`)

| Holder | Released by | Dead when |
|---|---|---|
| empty (starting) | the request that took it, matched by when it was taken; or the job it made | older than 10 minutes, and the job it made (if any) is over or stopped. Never sooner: a job found may be an earlier move's, from a worker with a faster clock ([#1958](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1958)) |
| a move job | that job, when done or stopped; the erasure that stopped its move (this job's lock only) | the job succeeded or is gone; its offer no longer stands |
| `reverify:…` | that repair only | older than 20 minutes |

Nobody releases another holder's lock. A dead one blocks nothing and the next move takes it over.

**The erasure's steps**

1. **First look**, before anything else. In rounds, until no row names the account: close `offered` and read the running offers (one transaction); for each, write the stop mark on the channel record if it is still the sender's, set the row, release the move's own lock; then take the id out of closed and settled rows (one transaction). A `moved` row to the account stays while its channel is still the account's, so a run that stops half-way knows it again. The run's beginning counts from here, or from the latest `transferredAt` on those channels if that is later (another worker's clock), so a channel a move already brought is part of it.
2. Channels (those of the received rows included, if the ownership index is behind), videos and the rest, each judged by the channel's owner at that moment.
3. The profile goes. An accept reads the receiver's profile after its claim, so one that starts now is refused, and one that got past it has a row the last look finds.
4. **Last look**, the same rounds. A received row that stays means a channel came meanwhile, and the run starts over from 1; otherwise no row names the account. Subscriptions are cleared once more.

**Every point of a move, crossed with an erasure**

| The move is at | Receiver erased | Sender erased |
|---|---|---|
| `offered` | closes | closes |
| claimed, not confirmed | row cancelled; the accept's check under the lock (status and both ids) answers 404 | same; the channel is erased with the sender |
| confirmed, job not made | mark and row first; the job stops, the accept answers 404 | same, or the job finds no channel |
| job made, accept not finished | the job stops; the accept finds its row closed and answers 404 without a notice | same |
| job made but not queued | it is `failed` with a closed offer: its lock is dead | same |
| accepted, job waiting or retrying | stops at its next delivery, even when Auth is down | same |
| running, owner not changed | one conditional write wins: the mark (it stops) or the new owner (it moved) | same |
| `failed`, owner not changed | stopped; lock released; a later move works; Retry stops | channel erased; lock released |
| owner changed, records moving | the channel is erased with the receiver, and no subscription the job moved stays; the job ends at its next delivery | the channel stays with the receiver; records left on the sender follow it |
| `failed`, owner changed | erased with the receiver | stays; the lock stays for Retry (records are half moved) |
| done | erased with the receiver | left alone |
| offered, claimed or accepted between two of the erasure's own writes | the next round, or the last look, finds it | same |
| moved between the first and last look | the run starts over and erases it | stays with the receiver |
| after the last look | no profile: the accept is refused | no channel: the accept is refused |

Not covered here: an **admin's** move to an account that is being erased is not an offer and isn't stopped. A channel that arrives that way after the run began is left alone, as before this epic, and can be left without an owner.

## 6. Claim an imported channel (Phase C)

Behind the switch `channelClaim` (off). Claims are requests on the approval workflow system (AUN-WORKFLOWS, [CC-D5](#13-owner-decisions)); this epic adds the claim type, not its own queue.

1. **Mark claimable.** An admin marks an imported channel as claimable (admin channel page, and a tick box in Admin Tools import).
2. **Request.** On a claimable channel's page a signed-in creator sees **Is this your channel?**. They explain in their own words and attach any proof, files or links ([CC-D6](#13-owner-decisions)). Files go to the existing upload storage with private access only, within size and type limits, and are scanned like other uploads; they are kept for the workflow's retention period and then deleted. A YouTube connection (the existing YouTube import connection) can be attached as one kind of proof; when its channel matches the imported channel's source it is shown to the admin as a match, but the admin still judges.
3. **Review.** Admins see the claim in admin through the approval workflow, review the proof and approve or reject with a reason. Approval runs the move (§3) to the claimer, within their tier's channel limit; both sides are told in their language. One open claim per channel per person; at most 3 open claims per person.
4. **After.** The channel stops being claimable. Other open claims on it are closed with a notice.

## 7. Data model and API

### 7.1 Storage (`SEARCH_DB`, migrations numbered at build time)

```sql
-- One unfinished move per channel (built: migration 0090, with idx_live_sessions_channel; offers are search migration 0121)
CREATE TABLE IF NOT EXISTS channel_transfer_locks (
  channel_id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  created_at TEXT NOT NULL
) WITHOUT ROWID;

-- Phase B, as built (search migration 0121). Moves of channels that accept payments will add the
-- workflow request link when AUN-WORKFLOWS exists; until then they are refused.
CREATE TABLE IF NOT EXISTS channel_move_offers (
  id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL,
  from_user_id TEXT NOT NULL,
  to_user_id TEXT NOT NULL,
  options_json TEXT NOT NULL DEFAULT '{}',
  -- offered | accepting (claimed by its receiver while the move starts) | moved | declined | cancelled | expired | stopped | refused
  status TEXT NOT NULL,
  job_id TEXT,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  responded_at TEXT,
  updated_at TEXT NOT NULL
);
-- One open offer per channel (one being accepted counts as open)
CREATE UNIQUE INDEX IF NOT EXISTS idx_channel_move_offers_open ON channel_move_offers (channel_id) WHERE status IN ('offered', 'accepting');
-- Offers to me, offers I made
CREATE INDEX IF NOT EXISTS idx_channel_move_offers_to ON channel_move_offers (to_user_id, status);
CREATE INDEX IF NOT EXISTS idx_channel_move_offers_from ON channel_move_offers (from_user_id, status);
-- The 30-day limit: the channel's last completed move
CREATE INDEX IF NOT EXISTS idx_channel_move_offers_channel ON channel_move_offers (channel_id, status, responded_at);

-- Phase C: a claim is an approval workflow request (AUN-WORKFLOWS); its proof files live in the
-- existing private upload storage. This epic stores only the link from the request to the channel
-- if the workflow system doesn't carry a subject reference.
```

Channel R2 record gains optional `transferredAt`, `claimable` and `moveStopped` (the offer an account erasure stopped, [5.1](#51-state-machine-offers-the-move-job-the-lock-and-an-account-erasure); in no view or export). No backfill.

### 7.2 API

| App | Method and path | Who | Purpose |
|---|---|---|---|
| admin-api | `POST /api/content/channels/:id/transfer/preview` | `channels:transfer` | Counts and warnings (official handle, live, old owner left with no channel); not built yet |
| admin-api | `POST /api/content/channels/:id/transfer` (exists) | `channels:transfer` | Gains required `reason` (sent to the old owner), `keepPreviousOwnerAsAdmin`, `keepContactEmail` (built) |
| admin-api | `POST /api/content/channels/:id/handle/take`, `/handle/release` | `channels:transfer` | Take an official handle back, release (built; setting any handle is the existing channel edit) |
| admin-api | `POST /api/content/channels/:id/move-offers/:offerId/stop` | `channels:transfer` | Stop an open offer, with a reason; audited on the channel |
| admin-api | `GET /internal/channel-reports/:id` | Internal key (api-videos) | Whether a report about the channel is under review: `{ underReview }` only, no reporter or reason |
| admin-api | `PUT /api/content/channels/:id/claimable` | `channels:manage` | Mark or unmark claimable |
| api-videos | `GET /api/channels/:id/move-receivers?q=`; `POST /api/channels/:id/move-offers`; `DELETE /api/move-offers/:id` | Owner, `channelMove` | The channel's admins (live autocomplete), offer, cancel |
| api-videos | `GET /api/channels/:id/move-offers` | Owner, `channelMove`; 404 for anyone else | The open offer, and from when the owner may move the channel again |
| api-videos | `GET /api/move-offers/:id` | The offer's two people and the channel's owner, `channelMove`; 404 for anyone else | One offer, open or closed, with the channel and people by name |
| api-videos | `GET /api/move-offers` | Senders and receivers, their own, `channelMove` | Their open offers (`offered` and not expired, and `accepting`), newest first, 10 of each side, then `?side=` with that side's cursor |
| api-videos | `POST /api/move-offers/:id/accept` and `/decline` | Receiver, `channelMove` | Answer |
| api-videos | `POST /api/channels/:id/claims` (opens the workflow request, with proof uploads); `GET /api/me/claims` | Signed in, `channelClaim` | Claim |
| api-videos | `POST /internal/admin/channels/:id/handle/take`, `/handle/release`, `/claimable`, `/move-offers/:offerId/stop`; the workflow's approve/reject hooks for offers and claims | Internal key + `X-Admin-Actor` | Logic for the admin routes |

The offer reads answer `403 videos_banned` to a banned account and `403 videos_account_pending_deletion` to one whose videos data is being deleted, and nothing to one without a live profile; their notifications still say that a move concerns them. They carry people by the display-name rule and avatar: no account id (the receiver picker's ids excepted), user handle or email, and no name for someone who is gone or being deleted. Reads and answers are rate-limited per account. A channel hidden with its owner's account (a ban, or that deletion) is refused like a suspended one.

User routes return `404 feature_off` when their switch is off (`requireFeature`), and are added to `feature-routes.ts`. Errors are codes, translated by each client. Where another route has its own use of a code (Go live, handle edits, scholar posts, admin transfers, invites), the offer routes answer a `move_*` code, so those routes keep their texts: `move_not_owner`, `move_already_owner`, `move_confirm_mismatch`, `move_in_progress`, `move_channel_live`, `move_channel_has_support`, `move_channel_suspended`, `move_receiver_not_allowed`, `move_receiver_channel_limit`. `move_check_unavailable` (503) means the report check couldn't be made. Core's OpenAPI gets the user routes.

## 8. Platforms

| Platform | Phase A | Phase B (move) | Phase C (claim) |
|---|---|---|---|
| Admin web | Reason, options, handle tools, result | Stop an offer; approve a move of a channel with support (workflow) | Claimable toggle; claims in the workflow |
| Web | New `account` notices; channel list reloads on them | Move channel (settings), offer page, pending offers | Claim button and form, my claims |
| Apple / Android / Desktop | Render `account` notifications; refetch channels | Show offers with Accept/Decline (Studio), owner offer opens the web page in v1 | Claim opens the web page in v1 |
| Native admin | — | — | Through the workflow screens when AUN-ADMIN-NATIVE has them |

## 9. Feature switches and tiers

| Switch | Group | Toggle | Default | Turns off |
|---|---|---|---|---|
| `channelMove` | creators | admin | off | Move channel, offers (every tier once on, CC-D2) |
| `channelClaim` | creators | admin | off | Claim button, claim routes (the admin queue stays for admins) |

Phase A changes an admin tool that already exists; it gets no switch.

Tiers: moving one's own channel is not a tier capability; every tier may do it once the switch is on ([CC-D2](#13-owner-decisions)). The receiver of any move or claim, admin moves included, needs room for another channel in their tier (`maxChannels`, the same rule as creating a channel, [CC-D12](#13-owner-decisions)).

## 10. Tests

- **Unit (api-videos):** each §3.1 record moves, including soft-deleted videos and posts; foreign `userId` left and counted; stream key rotated; lock returns `transfer_in_progress`; live refusal; verify re-runs then fails; old owner kept as admin; badge stays; channel-limit refusal; atomic lock and failed-move recovery; every live session ended and the provider stop confirmed; offer lifecycle (receiver must be a channel admin, accept runs at once, payment channels wait for approval or are refused, cancel, stop, expiry, 30-day limit); claim with proof uploads (limits, private, scanned); switch off → `404 feature_off`.
- **admin-api:** permission matrix (no token 401; Moderator/Admin 403; super admin passes; `channels:claims`), reason required, audit row written first and a failed audit write means no change.
- **admin-web / web:** component tests, en/ar.
- **E2E on the local stack** (never deployed QA on PRs): extend `14-channel-transfer.spec.ts`: after the move the new owner edits the channel and the old owner gets 403; both see the notification; web specs for offer to a channel admin → accept → moved, and claim → approve. Each spec creates its own accounts and channel and deletes them even on failure.
- No paid AI; YouTube API mocked.

## 11. Costs

A move is one R2 write per moved object plus a few D1 rows, on a rare action: fractions of a cent. The 48-hour re-verify reads one channel's index rows. The YouTube check is free API quota (a few units per claim). Two small tables. Claim proof files are a few MB per claim, kept for the workflow's retention period.

## 12. Legal and safety

- **Account takeover:** a stolen session could give a channel away, but only to someone the owner already made a channel admin. Fresh sign-in, typed handle, emails to both sides, and admin undo (move back) limit the damage.
- **Selling channels:** limited by the admins-only receiver rule, the 30-day limit and the official-handle block; abuse reports can lead to an admin move back.
- **Impersonation claims:** only admins approve, proof is shown, and an approved claim can be reversed by an admin move. Proof files may hold personal data: private storage, scanned, deleted after the retention period.
- **Personal data:** `email` (older records only) and `contactEmail` belong to the old owner and are removed or cleared. Audit rows and offers store user ids, not addresses. Erasure of either account works by `userId` and runs after any open offer is cancelled and any accepted move that hasn't changed hands is stopped.
- **Creator support money:** support never follows a channel unless an admin decides ([CC-D10](#13-owner-decisions)).
- **Copyright:** a claim by the real creator of imported content is the fix the import process needs; the claim form says that approving it does not decide copyright disputes.

## 13. Owner decisions

All answered by the owner on 2026-11-23.

| # | Decision | Answer |
|---|---|---|
| CC-D1 | Allow self-service moves (relaxes O16) | **Yes.** The receiver must accept; an admin can stop a move. Owner rule, same day: **only to one of the channel's current admins** (channel roles), checked on the server; anyone else only through an admin move or a claim |
| CC-D2 | Which tiers may move their own channel | **Every tier, Free included.** Not a tier capability |
| CC-D3 | Wait after acceptance | **None.** The move runs at once; both sides are told |
| CC-D4 | Old owner after a self-service move | **No access**, unless the new owner adds them back through channel roles |
| CC-D5 | Who reviews claims | **Admins, through the approval workflow (AUN-WORKFLOWS).** Approve or reject with a reason; both sides told |
| CC-D6 | Claim proof | **Free-form, the admin judges.** Explanation plus any files or links; private upload storage, size and type limits, scanned, kept for the workflow's retention period |
| CC-D7 | Private, draft and deleted videos move | **Yes, everything moves** (built) |
| CC-D8 | Verification badge on a move | **Stays with the channel**: it is a channel property (built) |
| CC-D9 | Take an official handle back | **Yes**, from any channel, with a reason; the holder gets a new handle and a notice (built) |
| CC-D10 | A channel that accepts payments | **A move needs admin approval** through the approval workflow ("the channel move for a creator accepting payment needs admin approval"); support never moves unless the admin decides. Until the workflow exists such moves are refused (built for admin moves) |
| CC-D11 | Old owner told | **Always**: in-app notice and email, with the admin's reason. No silent moves (notice with reason built; email follows) |
| CC-D12 | Receiver over their channel limit | **Refused**, admin moves included (built) |

## 14. Stories

| Story | Phase | Repo | What |
|---|---|---|---|
| CC-1 | A | AlUmmahNow | **Merged** (19196f3). Move covers every record in §3.1 (soft-deleted videos, handle index, live + key rotation, schedules, posts, subscriptions, emails, invites), lock, live check at request and job time, Go live refused during a move, support guard (`channel_has_support`), verify step — [#1784](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1784); subscriptions, invites, verify [#1789](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1789). The 48-hour re-verify (CC-1c) is [#1808](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1808) |
| CC-2 | A | AlUmmahNow | New `account` notification keys for both owners, move emails, live channel-list reload on web — [#1792](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1792) (emails follow) |
| CC-3 | A | AlUmmahNow | Required reason (sent to the old owner), options (keep old owner as channel admin, keep contact email), channel-limit refusal; admin-web form and result — [#1795](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1795) |
| CC-4 | A | AlUmmahNow | Admin handle tools: set, take back official, release (api-videos, admin-api, admin-web) — API [#1805](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1805), admin card [#1809](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1809) |
| CC-5 | A | Apple, Android, Desktop, Core | Render the new `account` keys once the apps have a notification center; refetch channels at launch — nothing to build yet: the native viewer apps have no notification center (2026-11-23) |
| CC-6 | B | AlUmmahNow | **Merged**, switch off. `channelMove` switch, offers table, receiver autocomplete limited to channel admins, offer/accept/decline/cancel/stop API; payment channels refused until the workflow approval step lands, then routed to it — server side [#1833](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1833); payment channels are refused until the workflow approval exists |
| CC-7 | B | AlUmmahNow | Two PRs. API ([#1960](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1960)): offers by name, one offer, the channel's open offer, notices open `/channel-moves/{offerId}`. Web: Move channel in settings, offer page (Accept, Decline), pending offers (Withdraw), every `move_*` text, 404 while the switch is off, local E2E |
| CC-7b | B | AlUmmahNow | Admin: the channel's open offers on its admin page, with the Stop button (the stop route exists) |
| CC-7c | B | AlUmmahNow | Move emails: the receiver when an offer is made, and both owners when a channel moved (admin moves too, the part of CC-2 that isn't built). One language each |
| CC-8 | B | Apple, Android, Desktop, Core | Offers in Studio with Accept/Decline |
| CC-9 | C | AlUmmahNow, Tools | `channelClaim` switch, `claimable` on channels, import tick box |
| CC-10 | C | AlUmmahNow | Claim type on the approval workflow, proof uploads (private, limited, scanned), approve → move |
| CC-11 | C | AlUmmahNow | Claim review screen inside the workflow admin (proof viewer) |
| CC-12 | C | AlUmmahNow | Web: Is this your channel?, claim form, my claims |

## Sources

- Draft spec and plan: `docs/specs/CHANNEL-CLAIM-AND-TRANSFER.md` and `-PLAN.md` in [AlUmmahNow#460](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/460)
- [AlUmmahNow#1405](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1405) (ADM-1 transfer picker), [AlUmmahNow#378](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/378) (Epic 29.18 transfer)
- Code inventory at AlUmmahNow `origin/main`, 2026-11-23
