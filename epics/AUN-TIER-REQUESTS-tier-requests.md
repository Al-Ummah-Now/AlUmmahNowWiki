[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Tier requests: the beta "upgrade" page

| | |
|---|---|
| **ID** | `AUN-TIER-REQUESTS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (web `/upgrade`, api-videos, admin-api, admin-web, processor) |
| **Status** | **in progress**: built in [AlUmmahNow#1415](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1415), held for the owner's screenshots |
| **Last updated** | 2026-11-15 |
| **Origin** | Owner request 2026-11-14 |

## Goal

The owner asked for an upgrade page "like other sites", except that during the beta users
**request** a tier instead of paying. Every available tier is shown and any of them can be
requested. The request is a short form: a name and "tell us about yourself". The page says that
during the beta launch tiers are granted on an acceptance basis and that paid subscriptions will
open in the future. The normal user tier is listed too, so the owner can later decide whether
normal users may create pages.

## Decisions and constraints

- [O33](decisions.md#o33-tiers-by-request-during-the-beta): tiers by request during the beta (decided).
- Builds on [CHAT-CREATOR-TIERS](CHAT-CREATOR-TIERS-creator-tiers.md) ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)): tiers stay admin-assigned; a request only asks an admin to assign one.
- Lines up with [AUN-SUBS](AUN-SUBS-subscriptions-plan.md): its default plan is **Member** and its recommended launch option is "B: invite / admin grant only". This epic is that option, with a request form in front of it. When payments open, the same page gains a price and checkout per tier. Requests can stay for tiers that are not for sale.
- Prices are never shown. A card offers **Request**, not Buy.
- All background work runs through queues with retries and a dead-letter queue. A delivery that gives up flags the admin on the Errors page, with Retry ([O26](decisions.md#o26-always-async-with-admin-visible-errors)).
- No new store: the requests live in the search D1, next to the tier assignments.
- Copy follows the [copy tone guide](../guides/copy-tone.md): "subscribe", never "follow"; the Arabic word for video is «مرئي».

## The Member tier

The normal user tier becomes a real tier, **Member** (`member`, Arabic «عضو»), the default for
everyone.

- **Capability flags on every tier:** `uploads`, `channels`, `pages`, `requestable`. A tier also has a display order and optional Arabic name, description and Arabic description, shown on `/upgrade`.
- **Member** allows no uploads, channels or pages, so nothing changes for users. The owner can turn `pages` on later, in the tier editor.
- **Creator** allows uploads and channels and is requestable. **Unlimited** allows everything and is not requestable: it stays the super admins' tier.
- **No backfill.** A user with no assignment row holds the default tier, which ships as Member, so every user without a tier is already on Member and prod (one real user) needs no data change. Since [AlUmmahNow#1443](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1443), assigning Member writes an explicit row (see [Default tier](#default-tier)).
- **Enforcement** reads the flags: `tierAllowsUploads` and `tierAllowsChannels` in the upload limits, the channel-create gate and `/api/me/creator`, which also reports `canCreatePages` for when pages open. Channel editors still upload under the owner's tier; the upload page's channel picker and the channel settings notice read the flags too.
- The admin's tier control offers "Use default tier" first, then every tier (Member included). The Tiers page counts users with no assignment on the default tier.

## Default tier

[O34](decisions.md#o34-admins-pick-the-default-tier): admins mark **one** tier as the default, or **None**. Built in [AlUmmahNow#1443](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1443), stacked on #1415 and held for the owner's screenshots.

- **What it is.** Every account without an assigned tier holds the default. It is read on every request (`creator_tier_settings.default_tier_id`, migration `0051`, seeded with `member`) and never copied into assignment rows, so changing it changes everyone on it at once. **None** means no tier at all: no uploads, no channels, no pages.
- **Assignments are explicit.** Any assigned tier, Member included, is its own row and stays when the default changes. "Use default tier", the tier picker's first option, removes the row.
- **Admin › Tiers.** A Default tier card names the current default and how many users hold it. Each tier has **Set as default**, and the card has **Make None the default**. The change applies at once with Undo (no confirm), and the audit shows it as "Default tier: default set to X" (`creator-tier:default`, previous value kept).
- **Guards.** The default tier's Delete is disabled with the reason ("set another default first"; API 409 `tier_is_default`). A deleted tier cannot become the default (409 `default_tier_deleted`, "restore it first").
- **Where it shows** (owner correction 2026-11-15: no "Default (Tier X)" next to users).
  - Users show their tier's **name only**, the default's name when none is assigned.
  - The **Default** marker appears only on the Tiers list, on the default tier.
  - On the admin user page and the Users list, the picker's first option is "Use default tier". The Users filter separates assigned users from users on the default tier.
  - The tier is shown on the user's admin page, not in the channel view.
  - `/upload` says "Your tier: Creator".
  - `/upgrade` lights the default's card as "Your current tier". When the default is None, it says "You don't hold a tier yet".
  - `/api/me/creator`: `via: 'default'`, or `'none'` when the default is None.
  - Native apps show `tier.name` from `/api/me/creator` as before, so they need no change.
- **Needs a tier.** When the default allows uploads, nobody is flagged "needs a tier".

## User flow (`/{en,ar}/upgrade`)

1. **Hero and beta notice.** "During the beta launch, each tier is granted on an acceptance basis: send a request and our team reviews it. Paid subscriptions will open in the future."
2. **Tier cards**, one per requestable tier plus the user's own tier, in display order. Every card lists the same five rows (watch, uploads, channels, caption minutes, pages), so tiers compare line by line. The user's current tier is the lit card and shows "Your current tier".
3. **Request** opens a dialog with:
   - name, 2–100 characters, prefilled from the profile;
   - "Tell us about yourself", 20–1000 characters, with a counter.

   The human check (Turnstile) always runs. The server enforces one open request per user, at most 5 requests in 30 days, and refuses a tier the user already holds or one that cannot be requested.
4. **Status** above the cards:
   - **Pending:** the date sent, and Withdraw (an in-app confirmation).
   - **Approved:** a link to Upload when the tier allows uploads.
   - **Declined:** the admin's reason, if given; the user may ask again.
5. **Signed out:** every card says "Sign in to request".
6. **Links in:**
   - every "Uploading is by invitation" notice has a **Request access** link: the upload page, channel creation and the VideosNotices inline and page variants;
   - the header shows a Request access pill when the user cannot upload;
   - the account menu has an Upgrade item;
   - the home page's signed-out banner ([AlUmmahNow#1359](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1359)) has a "Request creator access" chip. It signs the visitor in and returns them to `/upgrade`. `login` accepts one allowlist of return paths, `safeSignInReturn` (apps/web `lib/auth/sign-in-return.ts`): Studio paths, `/{locale}` (the banner's Sign in) and `/{locale}/upgrade`, for the sign-in's own language only. Whichever PR merges second wires the chip.
7. `/upgrade` is `noindex`.

## Admin flow (videos admin → People → **Tier requests**)

- **Nav and filters.** The nav item has a pending-count badge. Tabs: Pending (oldest first), Approved, Declined and All (newest first). "Show more" pages with a keyset cursor.
- **Each card shows:**
  - the person, linked to their user page;
  - Holds → Asks for;
  - the name they gave (when it differs from the profile);
  - "About them";
  - dates, the status, and the decision email's state (queued, sent, failed, and so on).
- **Approve** (creators:manage): one D1 batch marks the request approved and assigns the tier. Concurrent decisions are race-safe. It is audited like any tier change (`creator-tier` on the user, so the user page's history shows it), plus a `tier-request` row.
- **Decline:** an optional reason, up to 500 characters, shown to the user. Audited.
- **Moderators** see the queue read-only.
- **Tier editor:** the flags, requestable, display order, and the Arabic name and descriptions. Member can never be unlimited, and shipped tiers cannot be deleted.

## Delivery

A decision queues **one idempotent job** on admin-api's contact mail queue (`kind: tier_request`).
The job:

1. re-reads the request, and stops if it changed;
2. queues the **in-app notification** (`tierRequestApproved` or `tierRequestDeclined`, category `account`, always on; deduped per decision);
3. sends the **email** through the existing account email path (Resend, the user's language, idempotency key per decision; sink addresses are "sunk" outside production);
4. records the email state on the request.

It retries with backoff, up to 6 attempts, then goes to the dead-letter queue. A final failure
raises a needs-action item on the Errors page whose Retry (`tier-request-delivery`) runs the job
again.

## Data and privacy

- **The table.** `tier_requests` (search D1, migration `0040`) holds: id, user, tier (and its name at the time), the tier held when asking, name, about, status, decline reason, decided at/by and the email state. A unique partial index enforces one pending request per user.
- **Erasure.** Erasing an account deletes its requests. Requests that user decided as staff keep the decision, with the decider replaced by the erased placeholder.
- **What the user sees.** Their own requests never include who decided them.

## Design

- **Research.** I compared the pricing pages of the large video and creator platforms. YouTube Premium shows one plan. Vimeo, Patreon and Twitch use tier ladders. Notion, GitHub and Linear use three-column comparisons. They share:
  - three or four columns at most, in a fixed order;
  - identical feature rows, so the eye reads across;
  - the user's current plan marked in place, not hidden;
  - one primary action per card;
  - a short reassurance line about billing.

  The page keeps that structure and replaces price and billing with **Request** and the beta notice.
- **Fanous depth, not a recolour** ([AUN-THEMES](AUN-THEMES-themes.md)):
  - cards use the theme's materials (`--m-card`, `--m-border`, `--m-card-edge`, `--m-raised`);
  - the current tier is the **lit lantern**: a gradient rim, the theme's glow and a flame line along the top edge;
  - the beta notice carries a small lantern mark;
  - the request form is a modal dialog with the same materials;
  - "How requests work" is a real ordered list (Arabic-Indic numerals in Arabic).

  The page works in light and dark, LTR and RTL, from 320 px up, with reduced motion respected (the loading shimmer stops).
- **Accessibility:**
  - the cards are a list, and the current card has `aria-current`;
  - errors are tied to their fields (`aria-invalid`, `aria-describedby`), and focus moves to the first bad field;
  - notices are live regions;
  - axe scans of the page (signed in and out) and of the dialog run on the local stack in en, ar, light and dark.

## Tests

- **Unit (shared logic):**
  - api-videos: Member semantics, the request rules, the atomic decision and its race, the queue order and cursor, the own view without the decider;
  - admin-api: approve and decline, audit, delivery job states, retry builtin;
  - web: card rows in en and ar with Arabic digits, card states, form checks, error copy, and the page component (states, dialog, Turnstile retry, withdraw, decline in Arabic);
  - admin-web: queue helpers, labels in both languages, nav item, actions, the tier editor's flags and Member;
  - processor: erasure.
- **E2E (local stack):** `release/tier-requests.spec.ts`.
  - A Member requests Creator; an admin approves in admin-web; the user can upload and create a channel at once and sees "approved"; the notification arrives; the email is sunk.
  - An Arabic request is declined with a reason; the user sees it and may ask again.
  - Signed out, "Sign in to request" signs the visitor in and lands back on `/upgrade`.
  - `creator-tiers.spec.ts` now expects Member for a new account.

## Status evidence

- [AlUmmahNow#1415](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1415): the whole feature, held for the owner's screenshots.

## Open questions

- None. The owner decides later, in the tier editor, whether Member may create pages.

## Sources

- Owner request, 2026-11-14 (chat).
- [AUN-SUBS](AUN-SUBS-subscriptions-plan.md), [CHAT-CREATOR-TIERS](CHAT-CREATOR-TIERS-creator-tiers.md).
