[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Tier requests: the beta "upgrade" page

| | |
|---|---|
| **ID** | `AUN-TIER-REQUESTS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (web `/upgrade`, api-videos, admin-api, admin-web, processor) |
| **Status** | **shipped**: tier requests and admin-managed default tiers (see [Status evidence](#status-evidence)) |
| **Last updated** | 2026-11-21 |
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
- [O37](decisions.md#o37-with-tier-requests-off-and-no-payment-provider-upgrade-is-an-off-feature): with requests off and no payment provider, /upgrade is an off feature: `404 feature_off`, the site's 404 page, no header pill, account-menu item or Settings link; Settings › Tier keeps the user's tier (`GET /api/me/tier`).
- Builds on [CHAT-CREATOR-TIERS](CHAT-CREATOR-TIERS-creator-tiers.md) ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)): tiers stay admin-assigned; a request only asks an admin to assign one.
- Lines up with [AUN-SUBS](AUN-SUBS-subscriptions-plan.md): its out-of-the-box default is **Free** and its recommended launch option is "B: invite / admin grant only". This epic is that option, with a request form in front of it. When payments open, the same page gains a price and checkout per tier. Requests can stay for tiers that are not for sale.
- Prices are never shown. A card offers **Request**, not Buy.
- All background work runs through queues with retries and a dead-letter queue. A delivery that gives up flags the admin on the Errors page, with Retry ([O26](decisions.md#o26-always-async-with-admin-visible-errors)).
- No new store: the requests live in the search D1, next to the tier assignments.
- **Wording** (owner, 2026-11-15): request mode says **"Request tier"** / «اطلب فئة» (header pill, notices, dialog heading). A tier card's button says "Request" / «اطلب», because the card names the tier, and its accessible name is "Request tier: …". Pay mode says "Upgrade" / «ترقية». The Arabic word for tier is «فئة» everywhere: on `/upgrade`, in the emails, in Billing and in the admin.
- Copy follows the [copy tone guide](../guides/copy-tone.md): "subscribe", never "follow"; the Arabic word for video is «مرئي».

## Creator tiers

[Free](#default-tier) is the minimum tier. Admins can change the tier assigned to new sign-ups.

- **Capability flags on every tier:** `uploads`, `channels`, `requestable` (the `pages` flag was removed on 2026-11-16: it controlled nothing). A tier also has a rank, and a name and a description in English **and** Arabic, all four required (localized fields, owner 2026-11-16: no "leave empty to use the one above"; the admin routes answer 400 `tier_text_missing`). A tier saved before that, without its Arabic name or description, shows an "Arabic missing" / «العربية ناقصة» badge on the Tiers list until it is filled in. A Translate action (en↔ar) comes with the site-wide localized-fields work.
- **Features a tier lacks are hidden** (owner 2026-11-16): no entry point, no upsell; the header's "Request tier" / "Upgrade" button and `/upgrade` are the only ways in. The tier editor's Live help says "Off: Live doesn't appear in Studio for them".
- **Creator** allows uploads and channels and is requestable. **Unlimited** allows everything and is not requestable: it stays the super admins' tier.
- **Enforcement** reads the flags: `tierAllowsUploads` and `tierAllowsChannels` in the upload limits, the channel-create gate and `/api/me/creator`. Channel editors still upload under the owner's tier; the upload page's channel picker and the channel settings notice read the flags too.
- The admin's tier control lists the tiers in rank order (no "remove"). The Tiers page counts stored rows per tier.

## Default tier

[TIER-O34](decisions.md#tier-o34-admins-pick-the-default-tier) (owner decisions 2026-11-15). Merged in [AlUmmahNow#1443](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1443) and shipped in `v2026.11.19.6`.

- **Every account has a stored tier.** Nobody is ever tierless.
  - An invite stores the tier picked on the invite form. The picker starts on the current default; picking another tier needs creators:manage.
  - An invite gives a tier only: there is no Creator/Viewer role (owner, 2026-11-16, AlUmmahNow#1443). The tier decides what the account may do, and auth roles are untouched apart from the optional Scholar. The picker lists tiers lowest rank first, with names in the admin's language. The invites list shows each invite's tier by name. Older viewer invites map to the default tier (admin-api migration `0044`; the `role` column stays, unread).
  - **Video in the invite email** (owner, 2026-11-16; AlUmmahNow#1443, AlUmmahNowAuth#432):
    - The invite form has two live-search pickers, Video (English) and Video (العربية). Both start on the per-language defaults set under Admin › Settings › Emails › Creator invite (not seeded). A default only prefills the form.
    - The email, sent in one language, shows that language's video as a static 16:9 picture card: play button, title and channel. It links through the short link (`alummahnow.link/v/<id>`, `?lang=ar`).
    - It never falls back to the other language's video. A resend in the other language switches video.
    - The video is read at every send. One that is no longer public leaves the card out.
  - Otherwise sign-up writes the current default to the account (`POST /api/profiles`, `writeSignupTier`).
  - An account somehow without a row works as Free until the backfill writes it.
- **The default is only what new sign-ups get.** Admins pick it on Tiers ("Set as default": acts at once, with Undo, audited as `creator-tier:default`). Changing it affects only people who sign up afterwards; existing users keep their stored tier. It is stored in `default_tier_id` in `creator_tier_settings` (search migration `0065`).
- **Free («مجاني») is the one minimum tier.** Member (#1415) was renamed Free (search migration `0065`), keeping the id `member` so existing assignments carry over.
  - Free is shipped, cannot be deleted, is not requestable (nobody requests the bottom tier) and is the default out of the box.
  - It is seeded with today's no-tier rights: no uploads, no channels, no pages, 0 caption minutes. Every limit stays editable.
  - The old "None" is gone (400 `invalid_default`); a stored `none` reads as Free.
- **No "remove".** The tier picker only lists tiers; there is no "Use default tier" option and no assigned-vs-default filter. A request to remove a tier is refused (400 `tier_required`). A subscription that ends puts the user back on the current default.
- **Delete is blocked** while a tier is in use. The server answers 409 with the count, and admin-web disables Delete, says why and links to the people or invites:
  - users are on it: `tier_in_use` with `users`, an indexed count;
  - pending invites carry it: `tier_has_invites` with `invites`, counted by admin-api on `idx_creator_invites_tier` (migration `0043`);
  - it is the default: `tier_is_default`.
  The purge checks all three again.
- **Rank.** Admins reorder the tiers on the Tiers page's Rank list (drag, or Move up / Move down from the keyboard). Each move saves at once, is audited (`creator-tier:order`) and has Undo. Free ships lowest, Creator in between and Unlimited on top; a new tier goes just below the top one. The rank orders the Upgrade page and every tier picker (admin, invites). An upgrade is a tier ranked above the user's current one: `/upgrade` shows the current tier and the requestable tiers above it, and a request for a tier at or below it is refused.
- **Where it shows.** Users show their tier's name only. "Default" marks only the default tier on the Tiers list.
- **Arabic wording** (owner, 2026-11-16): the default tier is «الفئة الأساسية», never «الفئة الافتراضية»: the Tiers list marker «أساسية», «اجعلها الأساسية», the help text, emails and this wiki. The Arabic admin names every tier by its Arabic name (Free is «مجاني»). The tier shows on the user's admin page, not in the channel view.
- **Backfill.** After the release, `scripts/data/backfill-free-tier.ts --env qa|stage|production` writes Free to every account without a stored tier: dry run with counts first, then `--apply`. It walks the search D1 only, in keyset batches on indexed columns, never the Auth D1. It is idempotent.

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
6. **Links in** (owner rule: upgrading is never marketed, [AlUmmahNow#1651](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1651)):
   - the header's Upload place: a signed-in user whose tier allows no uploads gets a pill to `/upgrade` instead, "Request tier" while it takes requests and "Upgrade" while it sells (owner 2026-11-15); none while it is closed or the mode is unknown;
   - Settings › Tier: "See all tiers" (owner 2026-11-16);
   - the tier-request and tier-change notices and emails link to it as before.
   - **Not linked:** the account menu has no Upgrade item, and there is no "Uploading is by invitation" notice (the upload page and channel creation are hidden for an account that cannot use them; the unused `UploadsByInvitationNotice` was deleted, AlUmmahNow#1525).
   - `/upgrade` is a sign-in return path: `login` accepts one allowlist, `safeSignInReturn` (apps/web `lib/auth/sign-in-return.ts`): Studio paths, `/{locale}` and `/{locale}/upgrade`, for the sign-in's own language only.
7. `/upgrade` is `noindex`.
8. **Requests off, no payment provider ('closed'):** there is no Upgrade page ([O37](decisions.md#o37-with-tier-requests-off-and-no-payment-provider-upgrade-is-an-off-feature)). The links in item 6 disappear and `/upgrade` is the site's 404.

## Admin flow (videos admin → People → **Tier requests**)

- **Allow tier requests** ([TIER-O35](decisions.md#tier-o35-the-upgrade-page-mode-has-two-inputs)) sits at the top of the page. With no payment provider enabled it controls whether the request form is available. With a provider enabled, the page shows paid upgrades. [O37](decisions.md#o37-with-tier-requests-off-and-no-payment-provider-upgrade-is-an-off-feature) governs the closed mode. The switch acts at once, is audited and has Undo.

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
- **Tier editor:** the flags, requestable, display order, and the Arabic name and descriptions. Free can never be unlimited or deleted.

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

- **The table.** `tier_requests` (search D1, migration `0063`) holds: id, user, tier (and its name at the time), the tier held when asking, name, about, status, decline reason, decided at/by and the email state. A unique partial index enforces one pending request per user.
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
  - "How requests work" is a real ordered list (Eastern Arabic (Hindi) numerals in Arabic).

  The page works in light and dark, LTR and RTL, from 320 px up, with reduced motion respected (the loading shimmer stops).
- **Accessibility:**
  - the cards are a list, and the current card has `aria-current`;
  - errors are tied to their fields (`aria-invalid`, `aria-describedby`), and focus moves to the first bad field;
  - notices are live regions;
  - axe scans of the page (signed in and out) and of the dialog run on the local stack in en, ar, light and dark.

## Tests

- **Unit (shared logic):**
  - api-videos: Free tier semantics, the request rules, the atomic decision and its race, the queue order and cursor, the own view without the decider;
  - admin-api: approve and decline, audit, delivery job states, retry builtin;
  - web: card rows in en and ar with Arabic digits, card states, form checks, error copy, and the page component (states, dialog, Turnstile retry, withdraw, decline in Arabic);
  - admin-web: queue helpers, labels in both languages, nav item, actions, the tier editor's flags and the Free tier;
  - processor: erasure.
- **E2E (local stack):** `release/tier-requests.spec.ts`.
  - A person on Free requests Creator; an admin approves in admin-web; the user can upload and create a channel at once and sees "approved"; the notification arrives; the email is sunk.
  - An Arabic request is declined with a reason; the user sees it and may ask again.
  - Signed out, "Sign in to request" signs the visitor in and lands back on `/upgrade`.
  - `creator-tiers.spec.ts` checks the tier assigned to a new account.

## Status evidence

- [AlUmmahNow#1415](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1415): the tier request flow and admin queue, merged 2026-11-19.

- [AlUmmahNow#1443](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1443): shipped default-tier selection, explicit tier assignments, and the Free tier.

## Sources

- Owner request, 2026-11-14 (chat).
- [AUN-SUBS](AUN-SUBS-subscriptions-plan.md), [CHAT-CREATOR-TIERS](CHAT-CREATOR-TIERS-creator-tiers.md).
