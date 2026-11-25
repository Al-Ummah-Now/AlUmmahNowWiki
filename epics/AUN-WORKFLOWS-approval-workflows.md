[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Approval workflows: one system for sensitive admin changes

| | |
|---|---|
| **ID** | `AUN-WORKFLOWS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (shared-types, admin-api, admin-web, api-videos search D1 migrations), later [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md) and [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) through [AUN-ADMIN-NATIVE](AUN-ADMIN-NATIVE-native-admin-app.md) |
| **Status** | **building** (revision 2: owner decisions WF-D1 to WF-D10 recorded 2026-11-23; no effective dates) |
| **Last updated** | 2026-11-25 |
| **Origin** | Owner, 2026-11-23, asked whether a change to a creator-support fee rate should need a second approver: "build a workflow system." Recorded as [O44](decisions.md#o44-one-approval-workflow-system-for-sensitive-admin-changes). |

## Goal

One generic approval system for sensitive admin changes, used everywhere instead of one-off "a second person approves" code. A change to a governed setting, or a governed action, becomes a **change request**: someone proposes it, the right people review it and approve or reject it, and only then does it take effect, at once or on a chosen date. Requests can be withdrawn and they expire. Admins configure the rules per action type on one admin page: how many approvers, who may approve, who is excluded, whether a passkey step-up is needed, when requests expire and who is told. Every step goes into an append-only log, and every request shows a before/after diff.

The first consumers are creator support's fee changes and payout batch approvals ([AUN-MEMBERS](AUN-MEMBERS-creator-support.md)).

## Decisions and constraints

- [O44](decisions.md#o44-one-approval-workflow-system-for-sensitive-admin-changes): one workflow system, admin-configurable, for sensitive admin changes (this epic).
- [O42](decisions.md#o42-paygood-collects-only-creators-paid-through-a-separate-payout-rail) and AUN-MEMBERS §9.6: **the owner never approves money**. Money permissions belong to the organization's finance list; tech staff (the owner is marked tech staff) never qualify. This epic keeps those rules as hard floors that no rule on the admin page can lower ([§4.3](#43-floors-rules-the-admin-page-cant-lower)).
- [O16](decisions.md#o16-channel-roles-separate-from-site-roles-only-super-admins-transfer-ownership): permissions live in admin-api, never in Auth RBAC. This epic adds admin-api permissions, no Auth roles.
- [O26](decisions.md#o26-always-async-with-admin-visible-errors): applying a change that calls another service is a queued job with retry and a DLQ; anything that gives up shows on the Errors page with **Retry**.
- [O39](decisions.md#o39-one-features-page-server-enforced) and [O40](decisions.md#o40-server-written-error-messages): server-enforced, with server-written error messages in the reader's language.
- [O35](decisions.md#o35-arabic-uses-eastern-arabic-hindi-numerals), [O36](decisions.md#o36-one-frosted-glass-surface-primitive-flat-material-elsewhere), [O38](decisions.md#o38-numbers-never-grouped-in-arabic-counts-compact-from-1000): ٠–٩ through the shared formatter, frosted-glass surfaces, the shared time and number formatters.
- Standing rules: no browser prompts (in-app dialogs only), live-autocomplete pickers for people, both English and Arabic for every admin text, each email in one language with the shared branded layout, no full or unindexed D1 scans.

## 1. What exists today (inventory, 2026-11-23)

Six places already ask for a second person or a step-up, each in its own way.

| Area | Code | What it does today | Gaps |
|---|---|---|---|
| Finance list (AUN-MEMBERS MEM-8) | `apps/admin-api/src/lib/support-finance.ts`, `routers/support.router.ts` (`POST /api/support/finance`, `/finance/:userId/approve`, `DELETE /finance/:userId`, `POST/DELETE /tech-staff`), tables `support_finance_members`, `support_tech_staff` (search migrations 0076, 0078) | A super admin proposes a person and their money permissions; a different super admin approves (`approved_by`). Removal takes effect at once. Marking tech staff takes one super admin and removes the person from the list; unmarking needs a second one. Step-up on every route. | The proposal lives in the member row itself, so a re-proposal overwrites the last one; no expiry, no reject, no notification, no diff. |
| Payout batches (MEM-D24) | `apps/api-videos/src/lib/support/payouts.ts` `approveBatch`, admin-api `POST /api/support/batches/:id/approve` | Batch `awaiting_approval` collects approvals in a JSON column until `policy.batchApprovers` (1 or 2 people in all, the preparer counting when on the finance list) is met, then `approved` and the funding job runs. Finance list only, step-up. | Count lives in the support policy, not a rule; no expiry, reject or notification. With `batchApprovers = 1` the preparer approves alone. |
| Ledger adjustments (MEM-D24) | `support_adjustments` table (0076, `approvals` JSON, `proposed`/`posted`/`rejected`), `policy.adjustmentApprovers` | Table and policy field only; no route or code uses them yet. | Built on the workflow from the start (WF-6) instead of its own approvals column. |
| Fee schedules (new, [AlUmmahNow#1810](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1810), open) | search migration 0081 `support_fee_schedules`, admin-api `POST /api/support/fees` | Append-only fee rows with an effective date; finance list (`support:providers`), step-up, audited. One person. | The owner's question that started this epic: should a second person approve? |
| Feature switches (AUN-FEATURES) | `apps/admin-api/src/routers/features.router.ts` (`PUT /api/features/:key` with `expectedVersion`), `lib/feature-preconditions.ts`, search migration 0077 (`feature_switches`, `feature_switch_changes`) | `features:manage`; `toggle: 'superAdmin'` entries need a super admin; preconditions (only `creatorSupport` today) refuse a switch-on with `409 feature_precondition`; `confirm` only tells the page when to show a dialog. No step-up. | No second person for switches that move money or take something from every creator. |
| Creator tiers, tier changes | `routers/content.router.ts`: `PUT /users/:id/creator-tier`, bulk `POST /creators/tier`, `PUT /creator-tiers/default`, tier request approve/decline; `lib/tier-change-mail.ts` | One admin with `creators:manage`; audited; the creator is emailed. No step-up. (Complimentary paid tiers in `billing.router.ts` need a step-up.) | None needed today; listed so a rule can govern them later. |
| Channel transfer (AUN-CHANNEL-CLAIM, spec rev 2 in [Wiki#213](https://github.com/Al-Ummah-Now/AlUmmahNowWiki/pull/213)) | `POST /api/content/channels/:id/transfer` (`content.router.ts`, `channels:transfer` = super admins) → api-videos `routers/admin.router.ts`; admin-web `channels/[id]/ChannelTransfer.tsx` | One super admin moves a channel; audited with the previous owner; no step-up. Phase A adds a reason, a lock and notices; claims (not built) are approved by one admin. | No second person. |
| Platform credentials ([AlUmmahNow#1547](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1547), open) | `lib/platform-credentials.ts`, `/api/platform-credentials`, `credentials:manage` (super admins); on main, cost credentials in `routers/costs.router.ts` (`ops:manage`) | One super admin creates or rotates a token; audited (`platform-credential:<id>`); no step-up yet. | No second person. |
| Admin audit log | `site_settings_log` and `admin_audit_log` in `REPORTS_DB` (admin-api migrations 0006, 0011, indexes 0029), `lib/content/audit.ts`, `lib/audit/feed.ts` (the Audit page merges both) | One row per admin action with old and new values. | **Not append-only:** routes write the row first and `DELETE` it if the action fails (`dropAudit` and about nine raw deletes), and `setAuditPrevious` updates `old_value`. Fine for the general log; not enough for approvals, so this epic adds its own append-only table in the search D1 and mirrors one summary row per step into `site_settings_log`. |
| Step-up | `apps/admin-api/src/middleware/step-up-routes.ts`, `middleware/passkeys.ts` | A route list; a matching request needs a token whose `auth_time` is under 900 seconds old (`401 step_up_required`, admin-web signs in again with `max_age=900`), with a passkey when the staff rule applies (`403 passkey_required`). Entries can carry a `when` check. | Reused as is: the approve and propose routes get a `when` check that reads the request's rule. |
| Admin notices | `apps/processor/src/review/consumer.ts` (review alerts: `NotificationCreate` per subscriber), `publishAdminLive` (`packages/shared-types/src/admin-live.ts`), mail through `CONTACT_MAIL_QUEUE` (`lib/contact-mail-queue.ts`, retries, DLQ, Errors Retry), `lib/email/layout.ts` | Review alerts are the one admin-notice flow today. | Reused for approval notices. |
| Admin web parts | `components/search/Autocomplete.tsx` (pick mode, as in `contact/AssigneePicker.tsx`), `components/content/actions.tsx` (`ConfirmDialog`, `useConfirm`), `i18n/translate.ts` `formatNumber` | — | Reused; no new primitives. |

## 2. Words

| Word | Meaning |
|---|---|
| **Action type** | Something that can be governed, defined in code: `support.fees.set`, `support.payoutBatch.approve`, `features.set`, … ([§3](#3-action-types-and-what-becomes-governed)). |
| **Rule** | The admin-set configuration for one action type (or one scope of it, such as one feature switch): approvers, exclusions, step-up, expiry, notices. Rules are versioned. |
| **Change request** | One proposed change: the action type, the target, the new value, the before/after diff and the reason. An approved change takes effect at approval; there are no effective dates (WF-D6). |
| **Step** | One thing a person (or the system) did to a request: propose, approve, reject, withdraw, comment, apply, expire. |
| **Approver set** | Who may approve: roles (super admin, admin), lists (the finance list, or the finance list holding a given money permission), or named people. |
| **Executor** | The code, owned by the consuming feature, that validates the change, builds the diff and applies it once approved. |

## 3. Action types and what becomes governed

Each consuming feature registers its action types in `packages/shared-types/src/workflows.ts` (types and defaults) and its executor in admin-api. The table is the recommendation for version 1 ([WF-D2](#11-owner-decisions)).

| Action type | Domain | Proposer may be | Default rule (seeded) | Today |
|---|---|---|---|---|
| `support.fees.set` (a new fee row) | money | finance list with `support:providers` | 1 approver from the finance list with `support:providers`; step-up; expires in 7 days | one person (#1810) |
| `support.payoutBatch.approve` | money | the preparer (finance list, `support:payouts`) | MEM-D24 value: 1 approver from the finance list with `support:payouts` if MEM-D24 = 2, none if 1; step-up; expires in 5 days | MEM-D24 |
| `support.ledger.adjust` | money | finance list with `support:ledger` | MEM-D24 value, approvers with `support:ledger`; step-up; 7 days | MEM-D24 |
| `support.financeList.add` (add or change someone's money permissions) | people | super admin | 1 approver, super admin; step-up; 7 days | two super admins |
| `support.techStaff.unmark` | people | super admin | 1 approver, super admin who didn't mark them; step-up; 7 days | two super admins |
| `support.policy.set` (owner decisions, holds, payout day, limits) | money | finance list with `support:providers` | 1 approver, finance list; step-up; 7 days | one person |
| `support.emergencyStop.lift` | money | finance list | 1 approver, finance list; step-up; 1 day | one person |
| `workflows.rule.set` (changing a rule on the rules page) | governance | super admin; for a money rule, finance list | 1 approver: super admin, or the finance list for money rules; step-up; 7 days | new |
| `features.set` scoped per switch | platform | `features:manage` (super admin for `toggle: 'superAdmin'`) | **direct** for every switch, `creatorSupport` included (owner 2026-11-24, WF-D9 superseded); its readiness checks stay a 409 precondition. An admin can give any switch approvers on the rules page | one admin |
| `tiers.change`, three scopes: `assign` (a creator's tier, one or many, or a tier request approved), `default` (the default tier), `tiers` (add, edit, delete, reorder tiers) | platform | `creators:manage` | direct in every scope ([§4.5](#45-tier-changes-wf-10)) | one admin |
| `channels.transfer`, `channels.claim.approve` | people | super admin | direct (rule ready for 1 approver) | one super admin |
| `credentials.create`, `credentials.rotate` | platform | super admin | direct with step-up (rule ready for 1 approver) | one super admin |

The finance list and tech-staff marks are **people** actions, not money actions: they decide who holds money permissions, and super admins decide them (AUN-MEMBERS §9.6), so they can't need the finance list to approve. They have their own floor ([§4.3](#43-floors-rules-the-admin-page-cant-lower)).

**Direct** means the rule asks for no approver: the change takes effect in the same call, and the person sees no difference from today. Feature switches and tier changes keep their own direct write and their own audit rows, and no request is created; an action that always goes through the engine (`proposeChange`) still gets a request, a diff and the append-only log. A direct rule can still ask for a step-up to propose. Either way an admin can raise the count later on the rules page without code.

Removing someone from the finance list, holding payouts, stopping a batch and the emergency stop are **never** governed: they only take access or money movement away, and they must work in an emergency ([§4.3](#43-floors-rules-the-admin-page-cant-lower)).

## 4. Rules

### 4.1 Fields

| Field | Values | Default |
|---|---|---|
| Approvals needed | 0–3 different people besides the proposer | per §3 |
| Approver sets | any of: role `super_admin`, role `admin`, `finance` (optionally with one money permission), named people (picked with the live autocomplete) | per §3 |
| Exclusions | proposer can't approve (always on); the person the change is about can't approve it; tech staff excluded; the owner excluded; **one step per person** on a request (on by default; off lets one person approve after commenting, never propose and approve) | proposer, subject and one-step on; tech staff and owner on for money |
| Step-up | none, to approve, to propose and approve | to approve (money: to propose and approve) |
| Expiry | 1 hour – 30 days | 7 days |
| Notify | approvers (always), proposer (always); also super admins, admins, the finance list or up to 20 named people. A person added to the list must be an active admin or on the finance list | — |
| Notify by email | yes / no (in-app is always on) | yes |

A rule can also be scoped (for example one rule per feature switch). The rule used is the most specific one; each action type always has a default.

### 4.2 Who counts as the owner and as tech staff

The owner is already marked as tech staff (`support_tech_staff`, AUN-MEMBERS §9.6). This epic reuses that mark instead of adding a new one: "tech staff excluded" covers the owner. A separate "owner" exclusion is kept in the rule format for clarity, and resolves to the account ids in the `PLATFORM_OWNER_USER_IDS` setting ([WF-D4](#11-owner-decisions)).

### 4.3 Floors: rules the admin page can't lower

Hard-coded per domain in shared-types, checked by the server when a rule is saved and again when a request is approved:

- **Every domain:** the proposer never approves their own request; the person a change is about never approves it; a rule change is itself a request (`workflows.rule.set`) and needs at least one approver.
- **Money** (every money action, plus one scope of another action: changes to money rules, rule-change scope `money`; the `creatorSupport` switch left the money floor on 2026-11-24, WF-D9 superseded): tech staff and the owner are always excluded, as proposers and as approvers; approvers come only from the finance list; step-up to approve is always on. `support.fees.set` and money rule changes need at least one approver; payout batches and ledger adjustments follow MEM-D24 (0 or 1 approver) and can be raised, never lowered below it. Whether a rule is a money rule follows its floor, not only its action's domain, and a request's stored domain follows the floor too, so a super admin can't see, lower or approve any of them without being on the finance list.
- **People:** `support.financeList.add` and `support.techStaff.unmark` need at least one approver and a step-up to approve; super admins approve; the person the change is about never approves it, and whoever marked someone as tech staff never approves removing the mark.
- **Never governed:** actions that only take access or money movement away (§3) stay one-person and immediate.

### 4.4 When nobody can approve

If no account matches the approver sets after exclusions, the request page and the proposer see "Nobody can approve this yet" with the reason (for example "The finance list has no one with Payouts"). The request still expires on time. Super admins see a warning on the rules page for every rule in that state. `creatorSupport`'s existing precondition (a finance approver exists) keeps it from being switched on in that state.

### 4.5 Tier changes (WF-10)

Every tier route in `routers/content.router.ts` builds one operation (`lib/workflows/tier-actions.ts`) and
asks the rule of its scope:

| Scope | Routes (`/api/content`) |
|---|---|
| `assign` | `PUT /users/:id/creator-tier`, `POST /creators/tier` (bulk), `POST /tier-requests/:id/approve` |
| `default` | `PUT /creator-tiers/default` |
| `tiers` | `POST /creator-tiers`, `PUT /creator-tiers/:id`, `PUT /creator-tiers/order`, `DELETE /creator-tiers/:id` |

- **Direct** (the default, WF-D1): the route runs the change at once, exactly as before (same checks,
  audit rows, emails and answers). No request is created.
- **With approvers** (set on the rules page; the three scopes are always listed there, named in both
  languages): the route answers **202** with the request and nothing changes. On approval the same
  operation runs under the proposer's name; its audit rows carry `workflowRequest`. The route's own
  refusals (a super admin's automatic Unlimited without the explicit confirmation, a tier request already
  decided, a tier still carried by pending invites) are checked before anyone is asked, and again when it
  runs. The request's reason is kept on the request and never sent to api-videos (a deleted tier's reason
  also shows in Recently deleted).
- **Who may not approve:** the person the change is about. A bulk change is about everyone selected: none
  of them can approve it, and none of them gets it in their inbox. A bulk change that would move nobody is
  answered at once and asks nobody.
- **The diff** names the people and the tiers (in both languages). A bulk change lists everyone who would
  move, under the tier they hold now. The email names the first five people of a list and counts the rest.
- **Retry.** A change is made once. If an attempt failed after api-videos made the change, Retry finds it
  (made by the proposer, since the request: the assignment, the decided tier request, the tier's edit stamp,
  the deleted tier; for the default and the order, the same value), finishes what was left (the audit row,
  the tier request's notice and email) and marks the request applied instead of out of date. Each audit row
  of a request has one id, so a retry never writes a second one. A lost answer is checked at once the same
  way. A target someone else changed meanwhile is out of date.
- **Step-up:** whenever the scope's rule asks for one to propose, direct or with approvers.
- **Staleness:** a creator's current tier, the tier request's status, or the tiers list and default (for
  `default` and `tiers`); bulk changes are planned again when they run, so they never go stale.
- **Admin pages:** the Users, user, Tiers and Tier requests pages show "Sent for approval" with the
  request's link instead of "Saved" and Undo, and "Waiting for approval" in place of the control while the
  request is open (`GET /api/workflows/pending?type=&target=`, up to 100 targets in one read of the
  open-request index). In production since `v2026.11.24.3`, so a tier scope can be given approvers.
- Declining a tier request stays a direct action: it only takes the request away.

## 5. Lifecycle

```
            propose (step-up if the rule says)
                 │
                 ▼
  ┌──────────► pending ──── withdraw (proposer) ──► withdrawn
  │              │ ├────── reject (any eligible approver, reason required) ──► rejected
  │              │ ├────── expires_at passes ──► expired
  │              │ └────── target changed since proposal ──► stale
  │      approvals reach the rule's count
  │              ▼
  │          approved (takes effect at once; no scheduled dates, WF-D6)
  │              ▼
  │          applying
  │      ┌───────┴────────┐
  │      ▼                ▼
  │   applied           failed ── Retry (request page, Errors page)
  └── (direct rule: propose, approve and apply in one call)
```

- **Propose.** The consuming route (for example `POST /api/support/fees`) calls the engine instead of writing. The executor validates the payload and builds `before` and `after`. The engine picks the rule, checks the floors and the proposer's permission, records the request and the `propose` step, and notifies. The route answers `202` with `{ status: 'pending_approval', request }`, or `200` with the applied result when the rule is direct.
- **One open request per target.** A second proposal for the same target while one is open is refused with `409 change_pending` and a link to the open one (a partial unique index, §7).
- **Approve.** Each approval is a step by a different eligible person. The last needed approval moves the request to `applying` and the change takes effect at once.
- **Reject.** Any eligible approver can reject, with a reason (required, shown to the proposer). One rejection ends the request.
- **Withdraw.** The proposer can withdraw while it is pending, or after a failed apply.
- **Expire.** A pending request expires at `expires_at`. The cron's only job is expiry.
- **Stale.** Each request stores a fingerprint of the target's current value (`base_version`). Before an approval counts and again before applying, the executor checks it. If the target changed in the meantime (for example a direct change or another request applied first), the request becomes `stale`, nobody can approve it, and the proposer is told to propose again with the new "before".
- **Apply.** Changes that live in the search D1 apply in one `db.batch` with the request's `applied` status and step, so they happen exactly once. Changes that call another service (api-videos batch funding, the channel move job, the credentials API) run as a queued apply job keyed by the request id, with retry, backoff and the DLQ; the executor must be idempotent on that key. A job that gives up marks the request `failed`, shows on the Errors page with **Retry**, and tells the proposer and approvers.
- **No effective dates** (owner, WF-D6). Fees are charged live from the collector's or rail's quote, and the fee setting is only a display label or a fallback, so nothing is ever re-priced and no change needs a future date. An approved change takes effect at approval; there is no scheduler path and no backdating.
- **Any error while applying** (including the stale check) ends in `failed` with **Retry**; a request never stays in `applying` holding its target's lock. Applied and failed notices go to the proposer and the approvers.

## 6. The diff

The executor returns `before` and `after` as typed field lists, not free JSON, so every client renders them the same way:

```ts
type WorkflowField = {
  key: string;                         // "fixedMinor"
  label: { en: string; ar: string };   // "Fixed fee" / «الرسم الثابت»
  kind: 'text' | 'money' | 'percent' | 'bps' | 'count' | 'bool' | 'date' | 'person' | 'list' | 'enum';
  before: unknown;                     // null when the field is new
  after: unknown;                      // null when the field is removed
  currency?: string;                   // money
  enumLabels?: Record<string, { en: string; ar: string }>;
};
```

The admin page shows only fields that change by default, with "Show all fields". Money shows in the currency with the shared formatter; people show as name and avatar (never email); dates show local time with the zone and UTC on hover. Secrets never appear in a diff: a credential change shows "Value replaced" and the last four characters only when the provider already shows them. A rule change names its groups ("Finance list (Providers and fees)") and its people, approvers and recipients alike; someone whose account is gone shows as "Deleted account" / «حساب محذوف».

## 7. Data model (search D1)

Search migration `0085_approval_workflows.sql`. The search D1 holds the support, finance-list and feature-switch tables, so most changes apply in the same `db.batch` as their request. The tables hold account ids only (no emails or names), so they are not Auth-sensitive; names come from the existing batched name lookup (`lib/audit/names.ts`), never a scan of the Auth D1.

| Table | One row per | Key columns |
|---|---|---|
| `workflow_rules` | rule version (append-only) | `id`, `action_type`, `scope` (`''` for the default), `version`, `config` (JSON, validated against §4.1 and the floors), `request_id` (the approved `workflows.rule.set` request, null for the seed), `created_at`. **Index** `(action_type, scope, version DESC)`. |
| `workflow_requests` | change request | `id`, `action_type`, `scope`, `rule_id`, `target_kind`, `target_id`, `open_key` (`action_type:target_kind:target_id` while open, else null), `payload` (JSON), `diff` (JSON, §6), `base_version`, `reason`, `proposed_by`, `proposed_at`, `expires_at`, `status` (`pending`, `approved`, `applying`, `applied`, `failed`, `rejected`, `withdrawn`, `expired`, `stale`), `approvals_needed`, `approvals_count`, `version` (optimistic lock), `applied_at?`, `result?` (JSON, for example the new fee row id), `updated_at`. **Indexes:** unique `(open_key) WHERE open_key IS NOT NULL`; `(status, expires_at)`; `(action_type, status, proposed_at DESC)`; `(proposed_by, proposed_at DESC)`; `(target_kind, target_id, proposed_at DESC)`. |
| `workflow_steps` | step on a request (append-only) | `id`, `request_id`, `seq`, `actor` (account id or `system`), `kind` (`propose`, `approve`, `reject`, `withdraw`, `comment`, `apply`, `fail`, `expire`, `stale`, `retry`), `note?`, `step_up` (0/1), `origin` (JSON, the existing request-origin record), `at`. **Indexes:** unique `(request_id, seq)`; unique `(request_id, actor) WHERE kind = 'approve'`; `(actor, at DESC)`. |
| `workflow_inbox` | open request × eligible approver | `user_id`, `request_id`, `created_at`. Filled when a request opens (from the resolved approver sets), cleared when it closes. Primary key `(user_id, request_id)`, index `(request_id)`. This makes "Waiting for me" and the badge an index lookup instead of a scan. |

- **Append-only:** `workflow_rules` and `workflow_steps` get `BEFORE UPDATE` and `BEFORE DELETE` triggers that `RAISE(ABORT)`, like `support_ledger_entries` (0076). `workflow_requests` changes only through compare-and-set updates on `version`; its full history is the steps.
- **General audit log:** after each step commits, one row is also written to `site_settings_log` (in `REPORTS_DB`, so not in the same batch; a failed mirror write is retried by the step's job and never undoes the step) under the key `content:workflow:<request id>` (audit kind `workflow` in `lib/content/audit.ts`, with the action type in the row's details), so the Audit page shows it next to everything else. The steps table stays the record of truth. The mirror has a row for every request, money included, for everyone who reads the audit log (decided 2026-11-24): the log is for accountability, and leaving rows out of it would be worse. A row names the request's id, its action type, the step and who took it, never the amount, the person it is about, the reason or the diff.
- **Retention:** requests and steps are kept for 7 years for money domains, 2 years otherwise ([WF-D7](#11-owner-decisions)). On account erasure, ids stay (legal basis: financial and security records) and the name shows as "Deleted account"; free-text reasons and notes by the erased person are replaced with "Removed".
- **Every query** in the engine and the pages uses one of the indexes above; the PR for each story lists its queries with `EXPLAIN QUERY PLAN` output in the test.

## 8. API (admin-api)

Permissions (admin-api, not Auth): `workflows:read` (every admin role, sees requests they can see), `workflows:rules` (super admins and, for money rules, the finance list). Seeing a money request needs `support:read` or finance-list membership, as on the Support pages.

| Method and path | Does |
|---|---|
| `GET /api/workflows/actions` | Action types with labels, domains, floors, the rule in force per scope and its "nobody can approve" warning |
| `GET /api/workflows/rules/:actionType/history?scope=` | Rule versions, newest first, 50 per page (`before=<version>` for the next page); the scope is a query value because the default scope is empty |
| `GET /api/workflows/recipients?q=` | Who a rule can name for its emails: active admins and the finance list, by name, never an email. For whoever may change a rule |
| `POST /api/workflows/rules/:actionType` | Proposes a rule change (`workflows.rule.set`); body `{ scope, config, reason }` |
| `GET /api/workflows/requests` | Filters: `view=waiting\|mine\|open\|history`, `action`, `status`, `target`, `q`; cursor paged (50); each view uses one index |
| `GET /api/workflows/requests/suggest?q=` | Live autocomplete over open and recent requests (title, target name, proposer name) |
| `GET /api/workflows/requests/:id` | The request, diff, steps, the rule snapshot, and `can: { approve, reject, withdraw }` with the reason when not (for example `excluded_tech_staff`) |
| `POST /api/workflows/requests/:id/approve` | `{ version, note? }`; step-up when the rule says |
| `POST /api/workflows/requests/:id/reject` | `{ version, reason }` |
| `POST /api/workflows/requests/:id/withdraw` | `{ version }` |
| `POST /api/workflows/requests/:id/comment` | `{ note }` |
| `POST /api/workflows/requests/:id/retry` | Retries a `failed` apply (super admin, or finance list for money) |
| `GET /api/workflows/pending?type=&target=` | `{ items: { "<kind>:<id>": requestId } }`: the open request of each target (repeat `target`, up to 100), so a page shows "Waiting for approval" in place of its control; each row is shown by its stored domain, as in the lists |
| `GET /api/workflows/counts` | `{ waitingForMe }` for the sidebar badge (from `workflow_inbox`) |

Errors use the server envelope (FEAT-3) with server-written en/ar messages: `change_pending`, `approval_not_allowed` (with `reason`: `own_request`, `subject`, `excluded_tech_staff`, `excluded_owner`, `not_in_approver_set`, `one_step_per_person`, `already_approved`), `request_closed`, `request_stale`, `version_conflict`, `rule_below_floor`, `rule_invalid`, `propose_not_allowed`, `nobody_can_approve`.

**Engine library** (`apps/admin-api/src/lib/workflows/`), the only way consumers talk to it:

```ts
// Registered once per action type by the consuming feature.
interface WorkflowExecutor<P> {
  type: WorkflowActionType;                         // 'support.fees.set'
  scope?(payload: P): string;                       // e.g. the feature id; '' by default
  target(payload: P): { kind: string; id: string };
  canPropose(ctx: WorkflowCtx): Promise<boolean>;   // the feature's own permission check
  validate(ctx: WorkflowCtx, payload: unknown): Promise<P>;          // throws the feature's own errors
  describe(ctx: WorkflowCtx, payload: P): Promise<{ title: Localized; fields: WorkflowField[]; baseVersion: string; subjectUserId?: string }>;
  currentVersion(ctx: WorkflowCtx, payload: P): Promise<string>;     // for the stale check
  // Search-D1 changes: return statements; the engine batches them with the request update.
  applyStatements?(ctx: WorkflowCtx, payload: P, request: WorkflowRequest): Promise<D1PreparedStatement[]>;
  // Anything else: runs in the apply job; must be idempotent on request.id.
  applyJob?(ctx: WorkflowCtx, payload: P, request: WorkflowRequest): Promise<unknown>;
}

proposeChange(ctx, { type, payload, reason }): Promise<{ status: 'applied', result } | { status: 'pending_approval' | 'failed', request }>
```

## 9. Notifications

- **In-app:** a "Waiting for your approval" count on the sidebar's new **Approvals** item, and a toast for the signed-in approver when a request arrives. The count comes from `GET /api/workflows/counts`; a `workflow.changed` event on the existing admin live channel (`publishAdminLive`) tells open pages to refresh, with a 60-second fallback poll. Each approver also gets a bell notice through the same path review alerts use (`NotificationCreate`, `dedupeKey` `workflow:<request id>:<event>`).
- **Email:** to each eligible approver when a request opens, to the proposer and approvers when it is approved, rejected, applied, failed, withdrawn or expired, and to approvers one day before expiry. One language per email (the recipient's saved preference, else English, as the other admin emails do), the shared branded layout (`lib/email/layout.ts`), sent through the existing mail queue (`CONTACT_MAIL_QUEUE`, a new `kind`). The email names the action, the proposer, the reason and a short diff, and has one button, **Review request**, that opens the request in the admin. It never approves from the email ([WF-D5](#11-owner-decisions)).
- **Who** follows the rule's notify field; approvers and the proposer always. Each recipient is checked again when the email goes out, with the rule the pages use: someone who may no longer read the request gets no email. Without the staff list the job retries.
- **Arabic wording:** a person's name is never the subject of a gendered verb («هذا التغيير بطلب من …»، «… بواسطة …»).
- **Text people typed** keeps no direction controls in any email: the shared layout (and its twin in AlUmmahNowAuth) drops them, and names and addresses in a row have their own direction.
- **Native admin app:** later, through [AUN-ADMIN-NATIVE](AUN-ADMIN-NATIVE-native-admin-app.md): a push category `approval` with the same text, opening the request; approve with a passkey on the device. The API above is all it needs.

## 10. Admin pages (videos admin)

Sidebar group **Site**: **Approvals** / «الموافقات», with the waiting count.

- **Approvals list.** Tabs: Waiting for me, My requests, All open, History. A live-autocomplete search over requests. Each row: the action ("Change the PayGood fee for USD cards"), proposer (name and avatar), when, approvals ("١ من ٢" in Arabic), status chip, and the expiry ("Expires in 3 days").
- **Request page.** Title, status, reason, the diff (§6), the steps timeline, the rule that applies (with "Why can't I approve?" when the reason is known), and the actions **Approve**, **Reject**, **Withdraw**, **Comment**. Approve and Reject open an in-app dialog (frosted glass) that repeats the change in one line; Reject needs a reason; Approve runs the step-up when needed. No browser prompts.
- **Approval rules page** (`workflows:rules`): one frosted-glass card per domain (Money, Platform, People, Governance), one row per action type and scope with its summary ("1 approver from the finance list with Payouts · passkey · expires in 7 days"). **Edit** opens a dialog with the fields of §4.1; approver people and the people told by email are picked with the shared live autocomplete (the second opens with everyone who can be added); values below a floor are disabled with the floor's reason. Saving creates a `workflows.rule.set` request, shown as "Waiting for approval" on the row. **History** opens the rule's versions.
- **Consumer pages** keep their own buttons. "Save" on a governed setting becomes "Send for approval" when the rule needs approvers, then shows "Waiting for approval · View request" in place of the form until the request closes.
- English and Arabic, ٠–٩, «،», the shared time formatter, light and dark, phone and desktop. Screenshots go through the audit before merge.

## 11. Owner decisions

All decided on 2026-11-23 (owner, relayed by the orchestrator; WF-D7, WF-D8 and WF-D10 delegated to the orchestrator as routine details).

1. **WF-D1. Scope of version 1: decided.** "Anything related to money" needs approval: fee rates, payout batches, ledger adjustments, the finance list, the tech-staff mark, support policy, lifting the emergency stop, and turning `creatorSupport` on (that part superseded on 2026-11-24, see WF-D9; the rest of WF-D1 is being confirmed with the owner). Everything else (feature switches, tiers, channel moves, credentials) is registered **direct**: it takes effect at once until an admin adds approvers on the rules page. Actions that only take money access away are immediate: marking someone as tech staff and removing someone from the finance list. Removing a tech-staff mark needs approval. (This reading was confirmed by the orchestrator on 2026-11-23 as a routine safety rule.)
2. **WF-D2. Fee changes need a second person: decided, yes.** One approver from the finance list with `support:providers`.
3. **WF-D3. MEM-D24 counts move into the workflow rules: decided, yes.** MEM-D24's answer becomes the seeded rule and the floor for payout batches and ledger adjustments.
4. **WF-D4. How the owner is excluded: decided.** Through the existing tech-staff mark (the owner is marked); `PLATFORM_OWNER_USER_IDS` can name more accounts.
5. **WF-D5. Approve from email: decided, never.** The email has only a **Review request** link to the admin, where the step-up runs.
6. **WF-D6. Effective dates: decided, none.** An approved change takes effect at approval. Fees are charged live from the collector's or rail's quote and the fee setting is only a display label or fallback, so nothing is re-priced. No effective-date field, no scheduler path, no backdating; the cron only expires requests.
7. **WF-D7. Retention: decided.** 7 years for money requests and steps, 2 years for others.
8. **WF-D8. Feature switch: decided, none.** The workflow system is admin-only safety infrastructure with no Features-page switch; consumers adopt it one at a time and every rule starts as today's behavior.
9. ~~**WF-D9. `creatorSupport` switch-on needs a finance approver: decided, yes.** Its rule carries the money floor.~~ **Superseded by the owner on 2026-11-24:** "money means handling the money itself"; switching a feature on is not. The `creatorSupport` switch is **direct** like every switch, with no money floor and no seeded rule. Its readiness checks (the organization formed, a finance approver exists) stay a 409 precondition on the Features page, not an approval. Admins can still give it approvers on the rules page, like any switch (AlUmmahNow#1897 for picking one switch). Rule versions approved through a money rule change for this scope no longer apply, and open requests opened under the money floor were closed by the system with the reason (`WORKFLOW_FLOOR_SUPERSEDED`, the expiry cron).
10. **WF-D10. Expiry: decided.** 7 days by default, 5 for payout batches, 1 day to lift the emergency stop; admin-configurable within the floors.

## 12. Stories

Each story is one PR. Back end first.

| Story | What | Blocked by |
|---|---|---|
| **WF-1** | shared-types `workflows.ts`: action types, rule schema and validation, floors, diff field types, error codes, en/ar labels; tests | — |
| **WF-2** | Search migration (rules, requests, steps, inbox, triggers, indexes) and the engine library: propose, approve, reject, withdraw, comment, expire, stale check, apply (batch and job), approver resolution with exclusions; unit tests per rule and floor, including the race of two approvers and a direct change racing a request | WF-1 |
| **WF-3** | admin-api routes (§8), permissions, step-up `when` for approve, the cron for expiry and expiry reminders, the apply job with retry and DLQ, Errors page entries, `site_settings_log` mirror | WF-2 |
| **WF-4** | Notifications: in-app count and toast data, email templates en/ar in the shared layout, through the mail queue | WF-3 |
| **WF-5** | Fold in the finance list and tech-staff unmark: executors, routes answer `202`, pending rows in `support_finance_members` (approved_by null) are moved into requests by the migration, `financeAllows` unchanged | WF-3 |
| **WF-6** | Creator support consumers: `support.fees.set` (after #1810), `support.payoutBatch.approve`, `support.ledger.adjust`, `support.policy.set`, `support.emergencyStop.lift`; MEM-D24 read from the rules. Done with the MEMBERS agent ([§14](#14-what-aun-members-needs-to-change)) | WF-3, WF-D2, WF-D3 |
| **WF-7** | admin-web Approvals list and request page (visual, screenshots) | WF-3 |
| **WF-8** | admin-web Approval rules page (visual, screenshots) | WF-3 |
| **WF-9** | Feature switches as `features.set` per switch, all direct (`creatorSupport` too since 2026-11-24) | WF-3 |
| **WF-10** | Direct rules for tiers, channel transfer and claims, credentials | WF-3; channel moves after AUN-CHANNEL-CLAIM Phase A |
| **WF-11** | Native admin (AUN-ADMIN-NATIVE): approvals list, request, approve with passkey, push | AUN-ADMIN-NATIVE |

## 13. Platforms

- **Videos admin (web):** everything in §10.
- **admin-api:** engine, routes, executors, cron, jobs.
- **api-videos:** only its existing internal support routes (batch funding) are called from apply jobs; its own approval checks stay as a second line until WF-6 makes the workflow the single source.
- **Apple, Android, Desktop:** nothing in version 1. The native admin app adds approvals later (WF-11).
- **Public web, www, Auth, CMS:** nothing.

## 14. What AUN-MEMBERS needs to change

For the MEMBERS agent, through the orchestrator (no edits to its open PRs from this epic):

1. **#1810 (fee schedules):** keep validation in a pure function (`validateFeeEntry`) and the insert in a function that returns the D1 statement (`feeScheduleInsert(db, entry, { createdBy, requestId })`), so WF-6's executor calls both. Add a nullable `workflow_request_id` column to `support_fee_schedules` in 0081 now, before it merges, to avoid a second migration. (Its `0079_support_indexes.sql` also clashes with main's `0079_offline_downloads.sql` and needs renumbering.) `POST /api/support/fees` will answer `202 pending_approval` after WF-6; the admin form must handle both `200` and `202`.
2. **Payout batches:** keep `approveBatch` working; WF-6 moves the count to the rule and records each approval as a workflow step, then calls `approveBatch` from the apply step. Add a nullable `workflow_request_id` to `support_payout_batches` and `support_adjustments` in the next support migration.
3. **Any new money action** (refund over a limit, provider credentials) registers a workflow action type instead of writing its own approvals column.

## 15. Tests

- Engine unit tests (Vitest, in-memory D1 via Miniflare): every floor, every exclusion, one-step-per-person, the stale check, two approvers racing for the last approval (exactly one applies), withdraw racing approve, expiry by cron, an error while applying ending in failed, the append-only triggers, the unique open request, direct rules.
- Route tests: permissions per role, finance list, tech staff and owner refused for money, step-up required, error codes and en/ar messages.
- Executors: each consumer's apply is idempotent (applied twice → one change).
- Admin E2E on the local stack (no deployed QA): propose a fee change as one finance-list account, approve as another, see the fee in force; reject; withdraw. Each test seeds its own accounts and rows and deletes them, even on failure.
- No paid AI; nothing here calls AI.

## 16. Costs

A few rows per request in the search D1, one email per recipient per event through the existing mail provider, and the existing admin-api cron. Well under $1 a month; nothing new to buy.

## 17. Legal and safety

- Separation of duties for money (the owner never approves; tech staff excluded) is enforced by floors the admin page can't lower.
- The log is append-only at the database level; corrections are new steps.
- Step-up with a passkey on every money approval.
- Personal data: account ids, reasons and notes only; erasure as in §7.

## Build status

| Story | PR | State |
|---|---|---|
| Spec | [AlUmmahNowWiki#222](https://github.com/Al-Ummah-Now/AlUmmahNowWiki/pull/222) | merged 2026-11-23 (`4be6e6c`) |
| WF-1 shared-types: registry, rules, floors | [AlUmmahNow#1821](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1821) | merged (`b6d40e7`) |
| WF-2 engine, search migration 0085 | [AlUmmahNow#1825](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1825) | merged (`dbeb64c`) |
| WF-3 `/api/workflows`, step-up, expiry cron, audit mirror | [AlUmmahNow#1827](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1827) | merged (`a111485`) |
| WF-5 finance list and tech-staff unmark on the workflow | [AlUmmahNow#1829](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1829) | merged (`ea5ea0f`) |
| WF-4 emails (one language, Review request link) | [AlUmmahNow#1832](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1832) | merged (`4c08136`) |
| Spec update: back end merged | [AlUmmahNowWiki#233](https://github.com/Al-Ummah-Now/AlUmmahNowWiki/pull/233) | merged (`23f9421`) |
| WF-7, WF-8 admin Approvals and Approval rules pages | [AlUmmahNow#1862](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1862) | merged (`70662a1`) |
| WF-9 feature switches on the workflow (admin-api) | [AlUmmahNow#1865](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1865) | merged (`423e5df`) |
| WF-9 Features page: read admin-api's real answers, shared readers and contract tests (AUN-FEATURES FEAT-8, taken over) | [AlUmmahNow#1759](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1759) | merged (`6356143`) |
| WF-9 Features page: a change sent for approval | [AlUmmahNow#1874](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1874) | merged (`f04b81b`) |
| `creatorSupport` direct (WF-D9 superseded) | [AlUmmahNow#1913](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1913) | merged (`bbf2120`) |
| WF-10 tier changes on the workflow ([§4.5](#45-tier-changes-wf-10)) | [AlUmmahNow#1914](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1914) | merged (`921a555`) |
| WF-10 tiers: the admin pages | [AlUmmahNow#1936](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1936) | merged (`367a249`) |
| WF-10 follow-up: people lists in emails, the minimum's wording | [AlUmmahNow#1939](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1939) | merged (`ee88a3d`) |
| WF-10 follow-up: tests of the tier controls in a DOM | [AlUmmahNow#1951](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1951) | merged (`556555a`), tests only |
| Lists, counts, suggestions and waiting marks follow each request's stored domain | [AlUmmahNow#1961](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1961) | merged (`41e768c`) |
| Values in emails keep their direction | [AlUmmahNow#1968](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1968) | merged (`99a43c5`) |
| Who a rule tells by email: field, diff by name, checks; emails check their recipients when they go out; a request's changes fit a phone | [AlUmmahNow#1978](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1978) | merged (`ce2f929`) |
| Direction controls dropped in every email | [AlUmmahNow#1981](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1981), [AlUmmahNowAuth#536](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/536) | merged (`02964f4`; Auth `3246235`) |
| WF-10 channel moves and claims | — | after AUN-CHANNEL-CLAIM Phase A |
| WF-10 credentials | — | after AlUmmahNow#1547 |
| WF-6 creator-support consumers (fees, payout batches, ledger, policy, emergency stop) | — | next (AlUmmahNow#1810 merged, `1699f9f`) |
| WF-11 native admin apps | — | with AUN-ADMIN-NATIVE |

"Merged" means on `main`: it reaches QA with the next deploy of `main` and production with the next release. Production has everything up to AlUmmahNow#1968 (`v2026.11.24.8`); AlUmmahNow#1978 and AlUmmahNow#1981 are not in a release yet (2026-11-25). Every merged code PR has a cross-provider PASS (Gemini 4 Hydrogen or Gemini 4 Neon), as a comment on the PR. The search migration is `0085_approval_workflows.sql` (in production since `v2026.11.24`).
