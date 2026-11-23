[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Channel claim, transfer and self-service account move

| | |
|---|---|
| **ID** | `AUN-CHANNEL-CLAIM` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (shared-types, api-videos, admin-api, admin-web, web, processor), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **in progress**. The admin transfer exists ([§2](#2-what-exists-today-inventory-2026-11-23)). Phase A (complete the admin transfer) is being built to the recommendations below. Phases B and C wait for the owner's answers in [§13](#13-owner-decisions) |
| **Last updated** | 2026-11-23 |
| **Replaces** | The draft spec in [AlUmmahNow#460](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/460) (2026-11-08). Most of its design is kept here; the parts that were built differently follow the code |

## Goal

Three ways a channel changes hands, all ending in the same safe, audited move:

1. **Admin transfer.** A super admin moves a channel to another account. This exists, but it leaves records behind and tells nobody. Phase A makes it complete.
2. **Self-service move.** A channel owner moves their channel to another account (for example from a personal account to an organization account), and the other account accepts. This is new, and it needs an owner decision because [O16](decisions.md#o16-channel-roles-separate-from-site-roles-only-super-admins-transfer-ownership) says only super admins transfer ownership.
3. **Claim.** A creator whose channel was imported by the team (Admin Tools import) asks for it, proves it is theirs, and an admin approves. This is new.

Admins also get **handle tools**: set, release, or take back an official @handle on any channel ([O17](decisions.md#o17-super-admins-claim-and-assign-official-channels)).

Non-goals: co-owners (a channel has one owner); moving comments, likes or watch history (they record what a person did); merging two accounts.

## Decisions and constraints

- [O16](decisions.md#o16-channel-roles-separate-from-site-roles-only-super-admins-transfer-ownership): channel roles are separate from site roles; only super admins transfer ownership (decided 2026-11-09; self-service move asks to relax it, [CC-D1](#13-owner-decisions)).
- [O17](decisions.md#o17-super-admins-claim-and-assign-official-channels): super admins claim and assign official channels (decided).
- Platform rules: ≤ $500/month infrastructure ([O1](decisions.md#o1-whole-platform-cost-cap)); never Stripe ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans)); every feature tiered and admin-managed ([T1](decisions.md#t1-plans-are-admin-managed)); new user features sit behind a switch on the [Features page](AUN-FEATURES-feature-switches.md), off by default and [hidden when off](../guides/product-rules.md#hidden-when-off); bilingual en/ar with Eastern Arabic digits.

## 1. Words

| Word | Meaning |
|---|---|
| Owner | `channel.userId`. Exactly one. Never a grantable role ([channel roles](AUN-CHANNEL-ROLES-channel-roles.md)) |
| Move | The job that changes the owner and every record that carries the owner's id. All three paths use it |
| Offer | A pending self-service move, waiting for the receiving account to accept |
| Claim | A creator's request for an imported channel, waiting for an admin |
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
| Admin screen | `/channels/[id]` → `ChannelTransfer.tsx`: the shared Autocomplete (team members first, banned people can't be picked; [ADM-1, AlUmmahNow#1405](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1405)), a confirm dialog where the admin types the @handle or the new owner's email, live job progress |
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
| Channel | `userId`, `email` (new owner's), `isMain` ([§3.2](#32-main-channel)), `contactEmail` cleared unless kept, `transferredAt`, `dateModified` | By id |
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
| Verification badge | Removed unless kept ([§3.5](#35-badges-and-official-handles)) | Channel |

Only records whose `userId` is the old owner are rewritten. Anything else is counted as an anomaly and shown in the result. Subscribers, bells, sections, analytics, reports, comments and reactions stay with the channel as they are.

### 3.2 Main channel

New owner: the channel arrives as main only if they have no channel. Old owner: `pickNewMainChannel` picks their next main (exists); with no channel left they can browse and create one.

### 3.3 Job, lock, verify

- The existing `channel.transfer` admin job stays the engine. It gains the steps in §3.1, each idempotent, run in order: `channel → links → videos → live → schedules → playlists → posts → subscriptions → team → notify → verify`.
- **Lock:** one unfinished move per channel. `admin_jobs` gets a partial unique index on `(target_kind, target_id) WHERE kind = 'channel.transfer' AND status IN ('queued','running','retrying')`. A second request gets `409 transfer_in_progress`; handle edits on that channel do too.
- **Live check:** refused with `409 channel_is_live` while a broadcast is on air.
- **Verify** re-reads R2: channel owner, handle entry, both profiles, and no `content_ownership` row for the channel with another owner. A mismatch re-runs the step, up to three times, then the job fails into the Errors page with **Retry** (existing). The daily api-videos cron re-verifies moves finished in the last 48 hours, to catch an old-owner edit that raced the flip.
- Large channels: the job already resumes across queue deliveries; each step keeps a cursor in the job params.

### 3.4 Old owner

The old owner loses all access unless the mover ticks **Keep the previous owner as channel admin**. That adds a member entry `role: 'admin'` and writes `transfer_kept_old_owner` to the team activity log.

### 3.5 Badges and official handles

- **Verification badge** (scholar/official): removed on every move unless an admin ticks **Keep the badge**. A self-service move or claim always removes it; the new owner can ask for it again.
- **Official handle** going to a non-staff account (no site admin role): the admin must tick a second box. A self-service move of a channel with an official handle is refused (`official_handle`); only an admin can move it.
- Handle stays with the channel by default. Admin option: release it ([§4](#4-admin-handle-tools)).

### 3.6 Notifications and live refresh

New notification category `account`: always delivered, no settings toggle, rendered in the reader's language, `dedupeKey` `move:{jobId}:{side}`.

| Key | To | English | Arabic |
|---|---|---|---|
| `channelMovedOut` | Old owner | Your channel {channel} was moved to another account. | نُقلت قناتك {channel} إلى حساب آخر. |
| `channelMovedOutByTeam` | Old owner (admin move) | The Al Ummah Now team moved your channel {channel} to another account. | نقل فريق الأمة الآن قناتك {channel} إلى حساب آخر. |
| `channelMovedIn` | New owner | You are now the owner of {channel}. | أصبحت الآن مالك القناة {channel}. |
| `channelHandleChangedByTeam` | Owner | The Al Ummah Now team changed the handle of {channel} to @{handle}. | غيّر فريق الأمة الآن معرّف القناة {channel} إلى @{handle}. |

The acting admin's name is never shown. A move also sends an email to both owners (one language, chosen per [email rules](../guides/email-templates.md)), because the old owner may not open the app. Realtime event `channels_changed` on `user:{id}` for both owners makes web reload the channel list; native apps refetch `GET /api/me/channels` on the event or on next launch.

### 3.7 Audit

Every request, approval, refusal and result is a row in `site_settings_log` (admin moves, existing) or the team activity log (self-service and claim, existing table in `SEARCH_DB`), written **before** the change. Reasons are stored; email addresses are not.

## 4. Admin handle tools

On the admin channel page, super admins only (`channels:transfer`):

- **Set handle** on any channel, official names allowed; route and system words stay blocked. The claim is an exclusive R2 write (`onlyIf: etagDoesNotMatch '*'`), so two claims can't both win.
- **Take back an official handle** from the channel that holds it: the holder gets a default handle and a notice; handle history keeps the 301 for the old name only if the holder had it before it became official (the existing one-held-handle rule).
- **Release**: the channel gets a default handle at once.

Each needs a reason and is audited.

## 5. Self-service move (Phase B)

Behind the switch `channelMove` (off). Owner only; channel admins can't.

1. **Offer.** Channel settings → **Move channel**. The owner picks the receiving account: an account they are signed into on this device (from the account switcher), or by exact email. They confirm with a fresh sign-in or passkey (within 10 minutes) and type the channel's @handle. Options: keep me as channel admin; keep the public contact email.
2. **Accept.** The receiving account gets a notification and email, and accepts on `/channel-moves/{offerId}` within 7 days. It must be active, not banned, and have a free channel slot in its creator tier.
3. **Hold.** After acceptance the move waits 72 hours ([CC-D3](#13-owner-decisions)). Either side can cancel; both get an email when it starts and when it runs.
4. **Move.** The shared job (§3) runs with actor `user:{ownerId}`.

Limits: one open offer per channel; a channel can be moved by its owner at most once every 30 days; refused while the channel is live, under a moderation hold, has an open report under review, holds an official handle, or receives creator support ([AUN-MEMBERS](AUN-MEMBERS-creator-support.md); [CC-D10](#13-owner-decisions)).

## 6. Claim an imported channel (Phase C)

Behind the switch `channelClaim` (off).

1. **Mark claimable.** An admin marks an imported channel as claimable (admin channel page, and a tick box in Admin Tools import). Import records the source: `channel.source = {platform:'youtube', channelId}`; existing imported channels get it from one YouTube Data API call per channel (`videos.list` on one imported video id), run once by a script.
2. **Request.** On a claimable channel's page a signed-in creator sees **Is this your channel?**. They give a short note and proof:
   - **YouTube proof**: they connect Google with `youtube.readonly` (the existing YouTube import connection), and the server checks `channels.list mine=true` against `channel.source.channelId`. A match is shown to the admin as *Proven*.
   - **Other proof**: a link or text (official site, social account). Shown to the admin as *Not proven*.
3. **Review.** Admins with the new permission `channels:claims` see claims on an **Action needed** list. Approve runs the move (§3) to the claimer; reject sends a reason in their language. One open claim per channel per person; at most 3 open claims per person.
4. **After.** The channel stops being claimable. Other open claims on it are closed with a notice.

## 7. Data model and API

### 7.1 Storage (`SEARCH_DB`, migrations numbered at build time)

```sql
-- One unfinished move per channel
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_jobs_one_transfer
  ON admin_jobs (target_kind, target_id)
  WHERE kind = 'channel.transfer' AND status IN ('queued','running','retrying');

CREATE TABLE IF NOT EXISTS channel_move_offers (     -- Phase B
  id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL,
  from_user_id TEXT NOT NULL,
  to_user_id TEXT NOT NULL,
  options_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL,          -- offered | accepted | cancelled | expired | moved | refused
  job_id TEXT,
  created_at INTEGER NOT NULL,
  accepted_at INTEGER,
  runs_at INTEGER,               -- accepted_at + hold
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_channel_move_offers_open
  ON channel_move_offers (channel_id) WHERE status IN ('offered','accepted');
CREATE INDEX IF NOT EXISTS idx_channel_move_offers_to ON channel_move_offers (to_user_id, status);
CREATE INDEX IF NOT EXISTS idx_channel_move_offers_due ON channel_move_offers (status, runs_at);

CREATE TABLE IF NOT EXISTS channel_claims (          -- Phase C
  id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  note TEXT,
  proof_kind TEXT NOT NULL,      -- youtube | other
  proof_ok INTEGER NOT NULL DEFAULT 0,
  proof_detail TEXT,             -- link or text; never tokens
  status TEXT NOT NULL,          -- open | approved | rejected | withdrawn | closed
  decided_by TEXT,
  decision_reason TEXT,
  created_at INTEGER NOT NULL,
  decided_at INTEGER
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_channel_claims_open
  ON channel_claims (channel_id, user_id) WHERE status = 'open';
CREATE INDEX IF NOT EXISTS idx_channel_claims_status ON channel_claims (status, created_at);
CREATE INDEX IF NOT EXISTS idx_channel_claims_user ON channel_claims (user_id, status);
```

Channel R2 record gains optional `transferredAt`, `claimable`, `source`. No backfill except `source` for imported channels (Phase C).

### 7.2 API

| App | Method and path | Who | Purpose |
|---|---|---|---|
| admin-api | `POST /api/content/channels/:id/transfer/preview` | `channels:transfer` | Counts, warnings (official handle, badge, over `maxChannels`, live, old owner left with no channel) |
| admin-api | `POST /api/content/channels/:id/transfer` (exists) | `channels:transfer` | Gains required `reason`, `keepPreviousOwnerAsAdmin`, `keepContactEmail`, `keepBadge`, `releaseHandle`, `allowOfficialToNonStaff` |
| admin-api | `PUT` / `DELETE /api/content/channels/:id/handle` | `channels:transfer` | Set or take back (`takeFromHolder`), release |
| admin-api | `PUT /api/content/channels/:id/claimable` | `channels:manage` | Mark or unmark claimable |
| admin-api | `GET /api/content/channel-claims`, `POST /api/content/channel-claims/:id/approve` and `/reject` | `channels:claims` | Claims queue |
| api-videos | `POST /api/channels/:id/move-offers`; `DELETE /api/move-offers/:id` | Owner, `channelMove` | Offer, cancel |
| api-videos | `GET /api/me/move-offers`; `POST /api/move-offers/:id/accept` and `/decline` | Receiver, `channelMove` | Receive |
| api-videos | `POST /api/channels/:id/claims`; `DELETE /api/claims/:id`; `GET /api/me/claims` | Signed in, `channelClaim` | Claim |
| api-videos | `POST /internal/admin/channels/:id/handle`, `/claimable`, `/claims/:id/decide` | Internal key + `X-Admin-Actor` | Logic for the admin routes |

User routes return `404 feature_off` when their switch is off (`requireFeature`), and are added to `feature-routes.ts`. Errors are codes, translated by each client. Core's OpenAPI gets the user routes.

## 8. Platforms

| Platform | Phase A | Phase B (move) | Phase C (claim) |
|---|---|---|---|
| Admin web | Preview, reason, options, handle tools, verify result | — | Claimable toggle, claims queue |
| Web | `account` notifications, `channels_changed` reload | Move channel (settings), offer page, pending offers | Claim button and form, my claims |
| Apple / Android / Desktop | Render `account` notifications; refetch channels | Show offers with Accept/Decline (Studio), owner offer opens the web page in v1 | Claim opens the web page in v1 |
| Native admin | — | — | Claims queue after AUN-ADMIN-NATIVE ships its queue screens |

## 9. Feature switches and tiers

| Switch | Group | Toggle | Default | Turns off |
|---|---|---|---|---|
| `channelMove` | creators | admin | off | Move channel, offers |
| `channelClaim` | creators | admin | off | Claim button, claim routes (the admin queue stays for admins) |

Phase A changes an admin tool that already exists; it gets no switch.

Tier rules (admin-managed, per creator tier, on the existing tier editor): `channelMove` allowed (default **off** on every tier); the receiving account of a move or claim needs a free channel slot (`maxChannels`, via `reserveChannelSlot`). An admin transfer may exceed `maxChannels`; the preview says so.

## 10. Tests

- **Unit (api-videos):** each §3.1 record moves, including soft-deleted videos and posts; foreign `userId` left and counted; stream key rotated; lock returns `transfer_in_progress`; live refusal; verify re-runs then fails; old owner kept as admin; badge rule; offer lifecycle (offer, accept, hold, cancel by either side, expiry, 30-day limit, tier slot); claim proof match and mismatch with a mocked YouTube API; switch off → `404 feature_off`.
- **admin-api:** permission matrix (no token 401; Moderator/Admin 403; super admin passes; `channels:claims`), reason required, audit row written first and a failed audit write means no change.
- **admin-web / web:** component tests, en/ar.
- **E2E on the local stack** (never deployed QA on PRs): extend `14-channel-transfer.spec.ts`: after the move the new owner edits the channel and the old owner gets 403; both see the notification; web specs for offer → accept → hold (clock-controlled) → moved, and claim → approve. Each spec creates its own accounts and channel and deletes them even on failure.
- No paid AI; YouTube API mocked.

## 11. Costs

A move is one R2 write per moved object plus a few D1 rows, on a rare action: fractions of a cent. The 48-hour re-verify reads one channel's index rows. The YouTube check is free API quota (a few units per claim). Two small tables. Well inside the $500/month cap.

## 12. Legal and safety

- **Account takeover:** a stolen session could give a channel away. Fresh sign-in, typed handle, 72-hour hold with emails to both sides, and admin undo (move back) limit the damage.
- **Selling channels:** self-service moves can enable trading audiences. The 30-day limit, the badge removal and the official-handle block reduce the value; abuse reports can lead to an admin move back.
- **Impersonation claims:** only admins approve, proof is shown, and an approved claim can be reversed by an admin move.
- **Personal data:** `email` and `contactEmail` belong to the old owner and are replaced or cleared. Audit rows and offers store user ids, not addresses. Erasure of either account works by `userId` and runs after any open offer is cancelled.
- **Creator support money:** support given to a channel's owner must not follow the channel to someone else silently ([CC-D10](#13-owner-decisions)).
- **Copyright:** a claim by the real creator of imported content is the fix the import process needs; the claim form says that approving it does not decide copyright disputes.

## 13. Owner decisions

The old spec's questions 1–3 were answered in chat but the answers were not written down, so they are asked again as CC-D7 to CC-D9. Phase A is built to the recommendations; any change is a follow-up PR.

| # | Decision | Options | Recommendation and why |
|---|---|---|---|
| CC-D1 | **Allow self-service moves at all?** (relaxes O16) | (a) No, admins only; (b) only to an account signed in on the same device; (c) to any account that accepts | **(c)**, behind `channelMove`, off. (b) can't be proven on the server (the switcher list lives in the browser). Acceptance, fresh sign-in and the hold give the safety O16 wanted |
| CC-D2 | Which tiers may move channels? | Per-tier setting; all tiers; none until asked | **Per-tier setting, off on every tier.** Admins turn it on per tier |
| CC-D3 | Hold after acceptance | None, 24 h, 72 h | **72 h**, either side can cancel. Gives a hijacked owner time to notice the email |
| CC-D4 | Old owner after a self-service move | Loses access; owner chooses at offer time | **Owner chooses**, default "loses access" |
| CC-D5 | Who reviews claims | Super admins only; new permission `channels:claims` | **New permission**, given to super admins by default and assignable to admins |
| CC-D6 | Claim proof | YouTube connection only; YouTube or other proof, admin decides | **Either, admin decides.** Many scholars' channels aren't on YouTube. A YouTube match is labeled *Proven* |
| CC-D7 | Private, draft and deleted videos move with the channel (old Q1) | Yes; no | **Yes**, all content; otherwise it's orphaned on an account that doesn't own the channel |
| CC-D8 | Verification badge on a move (old Q2) | Keep; remove unless admin keeps it | **Remove unless an admin keeps it**; always removed on self-service moves and claims |
| CC-D9 | Take an official handle back from its holder (old Q3) | Yes for official handles; never | **Yes, official handles only**, with a default handle and a notice to the holder |
| CC-D10 | A channel receiving creator support | Block self-moves; move and stop support; move support too | **Block self-moves while support is on; an admin move ends the channel's support and tells supporters.** Money must not follow a channel to a new person silently |
| CC-D11 | Old owner always told? (old Q4) | Always; admin may skip in abuse cases | **Always.** The team's name is shown, never the admin's |
| CC-D12 | Admin move over the receiver's `maxChannels` (old Q5) | Allow with a note; refuse | **Allow with a note.** Admin action |

## 14. Stories

| Story | Phase | Repo | What |
|---|---|---|---|
| CC-1 | A | AlUmmahNow | Move covers every record in §3.1 (soft-deleted videos, handle index, live + key rotation, schedules, posts, subscriptions, emails, invites), lock, live check, verify step and 48-hour re-verify |
| CC-2 | A | AlUmmahNow | `account` notifications, move emails, `channels_changed` realtime, web reload |
| CC-3 | A | AlUmmahNow | Admin transfer preview, required reason, options (keep old owner, contact email, badge, release handle, official to non-staff); admin-web form and result |
| CC-4 | A | AlUmmahNow | Admin handle tools: set, take back official, release (api-videos, admin-api, admin-web) |
| CC-5 | A | Apple, Android, Desktop, Core | Render `account` notifications; refetch channels on `channels_changed` |
| CC-6 | B | AlUmmahNow | `channelMove` switch, tier setting, offers table, offer/accept/decline/cancel API, hold and due-runner cron |
| CC-7 | B | AlUmmahNow | Web: Move channel in settings, offer page, pending offers |
| CC-8 | B | Apple, Android, Desktop, Core | Offers in Studio with Accept/Decline |
| CC-9 | C | AlUmmahNow, Tools | `channelClaim` switch, `claimable` + `source` on channels, import tick box, source backfill script |
| CC-10 | C | AlUmmahNow | Claims API, YouTube proof check, `channels:claims` permission |
| CC-11 | C | AlUmmahNow | Admin claims queue (Action needed) |
| CC-12 | C | AlUmmahNow | Web: Is this your channel?, claim form, my claims |

## Sources

- Draft spec and plan: `docs/specs/CHANNEL-CLAIM-AND-TRANSFER.md` and `-PLAN.md` in [AlUmmahNow#460](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/460)
- [AlUmmahNow#1405](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1405) (ADM-1 transfer picker), [AlUmmahNow#378](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/378) (Epic 29.18 transfer)
- Code inventory at AlUmmahNow `origin/main`, 2026-11-23
