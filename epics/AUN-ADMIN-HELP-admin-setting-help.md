[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Admin setting help: a "?" on every setting and an admin help guide

| | |
|---|---|
| **ID** | `AUN-ADMIN-HELP` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (videos admin, shared component and content format), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) (Auth admin), [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md) (CMS admin) |
| **Status** | **in progress**: spec, then the component and the Platform settings area first |
| **Last updated** | 2026-11-24 (revision 1) |
| **Related** | [AUN-FEATURES](AUN-FEATURES-feature-switches.md), [AUN-WORKFLOWS](AUN-WORKFLOWS-approval-workflows.md), [AUN-ADMIN-NATIVE](AUN-ADMIN-NATIVE-native-admin-app.md), [E10 surfaces](E10-fanous-design-system.md) |

> Owner (chat, 2026-11-24): "for every admin setting a ? mark with tooltip and a link to help guide on admin to explain the setting and its option, not default tooltip, nope a custom full one, and the link for more is within the tooltip, every single setting, what it is, what changes, what laws or cautions or whatever its about".
>
> Owner, same day: "the tooltip should still be brief and full info on the full guide, each admin has its full guide within it".

## Goal

Every setting an admin can change, in every admin app, has:

1. a **"?" button** next to its label. It opens a custom popover (never the browser's `title` tooltip) that is **brief**: one or two short sentences on what the setting does, a one-line caution only when there is a real risk, and a **Learn more** link to the guide, inside the popover;
2. a section in **that admin app's own full help guide**, hosted inside the app: one page per settings area, one anchor per setting, searchable with the standard live autocomplete. The guide holds everything: what the setting is, what changes (who, how fast), every option and the default, the cautions, and the laws, store and provider rules it touches.

Each admin app has its own guide inside it: the videos admin's in admin-web, the Auth admin's in the Auth admin, the CMS admin's in the CMS. A popover always links to its own app's guide.

Both read **one content entry per setting**, in English and Arabic, so the popover and the guide can never say different things. A CI check fails when a setting has no entry.

"Every single setting" is literal: the [inventory](#inventory) lists each one.

## What exists today

- **No setting help.** Settings carry a one-line hint under some inputs (for example `platformSettings.downloadRateLimitPerDayHint`). There is no "?" and no admin help guide. The only popover-like help is the failed-rung tooltip on a video's Processing card ([`components/content/processing.tsx`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/52b235a78/apps/admin-web/src/components/content/processing.tsx)), which opens on hover and focus only.
- **The user help guide** is on the videos site at `/help` (`apps/web`, [#1154](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1154), [#1157](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1157)). It is for viewers and creators, not admins.
- **Shared pieces we reuse, never rebuild:**
  - `packages/fanous-tokens/surfaces/aun-surfaces.css`: the frosted-glass card, panel and menu, flat Material buttons, `.aun-actions` footer row;
  - `packages/fanous-tokens/nav/menu-fit.js`: `fitToViewport`, which keeps a popup on screen (shifts sideways, narrows, flips up, caps height to the visual viewport). Auth and the CMS carry the same function in their own scripts;
  - `apps/admin-web/src/components/search/Autocomplete.tsx`: the one admin autocomplete, which takes its own `source`;
  - `fillTemplate` in `packages/shared-types/src/locale-format.ts`: `{#123}` numbers come out in ٠–٩ in Arabic.
- **No shared UI package across repos.** Shared CSS and small scripts live in the monorepo's `packages/fanous-tokens` and are vendored byte for byte into AlUmmahNowUI, Auth and the CMS. This epic follows the same model.

## Inventory

The full list, with each setting's file, key, options and default, is in [AUN-ADMIN-HELP-inventory.md](AUN-ADMIN-HELP-inventory.md). It is regenerated from the code with each area PR. Summary:

| App | Settings | Page settings | Form fields | Action choices |
|---|---|---|---|---|
| Videos admin (apps/admin-web) | 677 | 311 | 279 | 87 |
| Auth admin (apps/admin) | 407 | 3 | 395 | 9 |
| CMS admin (src/admin) | 168 | 15 | 145 | 8 |
| **All** | **1252** | **329** | **819** | **104** |

The biggest areas are the Auth theme builder (364 fields: every color role in light and dark, every component and page-section slot), the videos admin's moderation (122, of which 92 are the 23 AI moderation categories' on, mode, threshold and action) and site theme (116), and the CMS page blocks (77).

Found while collecting, and filed as issues:

- the videos admin has no Features page yet (admin-api routes only); its 39 switches are listed from `packages/shared-types/src/feature-registry.ts`, and AH-2 waits for that page;
- the backfill "One channel" field takes a raw channel id instead of a search picker;
- Auth admin: the create-user dialog says an email is sent but the action passes `sendInvite: false`; three client scopes can only be set by migrations; the edit-user role select replaces only the first role.

What counts as a setting:

- persistent configuration an admin edits (switches, choices, numbers, text, colors, lists, schedules) on a settings page or inside a form that defines behavior (a tier, a workflow rule, a category, a media provider, a theme, an Auth client, a role);
- every row of a list rendered from data (each feature switch, each workflow rule) is its own setting;
- the choices inside an admin action dialog that change the outcome (a moderation action, a strike, a ban length, the email language).

List filters, sort controls, search boxes and pagination are not settings.

## Content model

One JSON file per settings area, per app, in the repo that owns the setting:

| App | Content folder |
|---|---|
| Videos admin | `AlUmmahNow/packages/admin-help/content/videos-admin/<area>.json` |
| Auth admin | `AlUmmahNowAuth/apps/admin/help/<area>.json` |
| CMS admin | `AlUmmahNowCMS/src/admin/help/<area>.json` |

The format is the same everywhere and is defined by `packages/admin-help/schema.json` (vendored into Auth and the CMS with the component):

```jsonc
{
  "area": "platform-settings",             // the help page slug: /help/platform-settings
  "title":   { "en": "Platform settings", "ar": "إعدادات المنصة" },
  "intro":   { "en": "…", "ar": "…" },
  "settings": [{
    "id": "platform.downloads.perDay",     // stable, used by the "?" button and the coverage check
    "anchor": "downloads-per-day",         // /help/platform-settings#downloads-per-day
    "label":   { "en": "Downloads per day", "ar": "…" },
    "summary": { "en": "One or two short sentences.", "ar": "…" },  // the popover's text
    "tipCaution": { "en": "One line.", "ar": "…" },          // optional: in the popover only when there is a real risk
    "what":    { "en": "What it is.", "ar": "…" },
    "changes": { "en": "What happens, to whom, how fast.", "ar": "…" },
    "options": [{ "value": "seen", "label": {…}, "text": {…}, "default": true }],
    "default": { "en": "{#100} a day", "ar": "…" },          // free inputs; options mark their own
    "range":   { "en": "{#1}–{#10000}", "ar": "…" },
    "cautions": [{ "en": "…", "ar": "…" }],
    "rules":    [{ "en": "…", "ar": "…", "source": "https://…" }],  // laws, store and provider rules
    "approval": false,                     // true when an AUN-WORKFLOWS rule can hold the change
    "sources": ["apps/admin-web/src/app/(protected)/platform-settings/DownloadRateLimitSetting.tsx"]
  }]
}
```

Rules for the text:

- **Plain, factual, short.** The popover shows only `summary` (at most two short sentences, about 200 characters), `tipCaution` when there is one (one line, about 120 characters), and Learn more; the check enforces the lengths. The guide shows every field, including `summary`, so the popover never says anything the guide does not.
- **Numbers as `{#n}`** so Arabic shows ٠–٩ through the shared formatter. Arabic uses «مرئي/مرئيات» and «،».
- **Costs in unit terms only**: "each caption track is one Workers AI call, about $0.01 per hour of audio", never a budget or cap.
- **Laws and policies** are stated as facts with a `source` link to the official text, never as legal advice. The guide footer says "This guide describes how the setting works. It is not legal advice." in both languages.
- **No secret values** (keys, tokens) and no internal hostnames beyond what the admin already sees.

**One source, two views.** The popover and the guide render the same entry, so they cannot drift. Native admin apps ([AUN-ADMIN-NATIVE](AUN-ADMIN-NATIVE-native-admin-app.md)) read the same files: each admin serves its content as static JSON at `/help/content/<locale>.json` (built from the files above, no database, cached by the CDN), and the native apps bundle the same JSON at build time with the server copy as the update path.

## The "?" component

Built once per framework, from one framework-free core:

| Piece | Where | Used by |
|---|---|---|
| `aun-help.css`: the button and the popover on `.aun-glass-panel` | `packages/fanous-tokens/help/` (vendored) | all three admins |
| `aun-help.js`: open, close, hover preview, Esc, focus, `fitToViewport` | `packages/fanous-tokens/help/` (vendored) | CMS admin (vanilla client) |
| `<HelpTip id=…/>` React component | `apps/admin-web/src/components/help/` and `AlUmmahNowAuth/apps/admin/app/components/help/` | videos admin, Auth admin |

Behavior:

- **A button** (`role="button"`, focusable, Enter and Space), 22 px visible and 44 px hit area on touch, labeled "Help: <setting>" / «مساعدة: <الإعداد>». It is not a `<button>` element because settings forms disable their fieldset for admins who may only read, which disables every `<button>` inside it, and those admins still need the help. It sits next to the label, **outside** the `<label>` element, so it never takes the label from the input or toggles it.
- **Opens on click, tap, Enter or Space.** On a desktop with a fine pointer, hovering for 400 ms opens a preview; moving away closes the preview unless it was opened by click.
- **The popover** is a non-modal `role="dialog"` named by the setting's label. Opening by click or keyboard moves focus to it, so screen readers read the title and summary; Tab moves through its content and the Learn more link; **Esc** closes it and returns focus to the "?"; clicking outside closes it. `aria-expanded` and `aria-controls` on the button.
- **Brief**: the setting's label as the title, the summary, the optional one-line caution with a warning icon, then Learn more. No option lists, no legal detail.
- **Frosted glass**: `.aun-glass-panel` with the golden edge and glow, in light and dark, from the theme tokens. About 20 rem wide; it still scrolls inside if a large text size makes it taller than the screen.
- **Never off-screen**: `fitToViewport` places it after it opens and re-fits on resize, on the on-screen keyboard and when content changes. On a phone it is the full width minus the 8 px gutters.
- **RTL**: logical properties only; it opens toward the inline end of the label and mirrors in Arabic.
- **Learn more** is the last line inside the popover: "Learn more in the admin guide" → `/help/<area>#<anchor>` in the same app, same tab.

## The admin help guide

- **Each admin hosts its own guide**, rendered from its own content files:
  - videos admin: `/help` (index) and `/help/<area>` in `apps/admin-web`, in the admin nav and the command palette;
  - Auth admin: `/help` and `/help/<area>` in `apps/admin`;
  - CMS admin: a Help screen with the same layout.
- **Index**: every area as a frosted-glass card with its intro and setting count; at the top a live autocomplete (the shared `Autocomplete` with a local `source`) over every setting's label, summary and area, in the current language. Choosing a result opens `/help/<area>#<anchor>`.
- **Area page**: one frosted-glass card per setting at its anchor, with the full entry: what it is, what changes, each option (the default marked), the range and default for free inputs, cautions, and the laws and policies with their source links; a "Go to the setting" button in the card footer at the end edge (owner rule: info-page cards in frosted glass with a golden glow, buttons in the footer, aligned to the end).
- **Every admin role** can read the guide; nothing in it is secret.

## Coverage check (CI)

`pnpm check:admin-help` (videos admin; same script vendored into Auth and the CMS), run by the existing lint job:

1. **Schema**: every content file is valid, every entry has `en` and `ar` for every text field, ids and anchors are unique, Arabic text has no 0–9 outside `{#…}` and URLs.
2. **Every control is covered**: in the covered folders, every JSX form control (`input` other than `hidden`, `select`, `textarea`, `NumberField`, `Select`, switches) carries `data-help="<id>"` naming an existing entry, or `data-help-exempt="<reason>"` (a search box, a filter, a file picker). A control with neither fails the build with its file and line.
3. **Every entry is used**: each id is rendered by a `<HelpTip id=…>` somewhere, so stale entries fail too.
4. **The covered folders** start with Platform settings and grow with each area PR; the last PR covers all of `apps/admin-web/src`, and the list is removed.

## Stories

One PR per area per repo. Each area PR adds the content, the "?" on every setting in that area, its guide page and its folder to the coverage check, with viewport frames.

| # | Story | Repo |
|---|---|---|
| AH-0 | This spec and the inventory | Wiki |
| AH-1 | Content format, loader and coverage check; `HelpTip`, `aun-help.css`; help guide index and area page; **Platform settings** area (design review) | AlUmmahNow |
| AH-2 | Features page (every switch) | AlUmmahNow |
| AH-3 | Tiers and tier requests | AlUmmahNow |
| AH-4 | Moderation, abuse, review alerts, comments, community | AlUmmahNow |
| AH-5 | Approval workflows and approvals | AlUmmahNow |
| AH-6 | Costs and operations | AlUmmahNow |
| AH-7 | Media providers, delivery, video formats, processing, live | AlUmmahNow |
| AH-8 | Captions and translations | AlUmmahNow |
| AH-9 | Email settings, newsletter, contact | AlUmmahNow |
| AH-10 | Site theme, sites, social, mobile apps, app config | AlUmmahNow |
| AH-11 | Users, creators, channels, videos, playlists, categories (entity settings and action options) | AlUmmahNow |
| AH-12 | Everything left; coverage over all of admin-web | AlUmmahNow |
| AH-13 | Auth admin: vendored component, guide, all areas | AlUmmahNowAuth |
| AH-14 | CMS admin: vendored component, guide, all areas | AlUmmahNowCMS |
| AH-15 | Native admin apps show the same "?" from the bundled JSON when their settings screens ship | Apple, Android, Desktop |

## Platforms

- **Videos admin (web)**: everything above.
- **Auth admin, CMS admin**: the vendored CSS and script, their own content and guide.
- **Native admin apps** ([AUN-ADMIN-NATIVE](AUN-ADMIN-NATIVE-native-admin-app.md)): no settings screens yet; when they ship, each setting row gets the same "?" as a sheet (iOS), bottom sheet (Android) or flyout (Windows), reading the bundled JSON. Nothing to build now.
- **Videos site, apps for viewers**: none; this is admin only.

## Feature switch and tiers

None. This is admin-only help text with no user-facing behavior, so it ships on, without a switch (the switch rule is for user-facing features). It is not tier-dependent; where a setting is per tier, its entry says so.

## Tests

- Unit: the content loader, the coverage check (a fixture with an uncovered control fails), the Arabic digit rule.
- Component: `HelpTip` opens on click, Enter and Space; Esc closes and returns focus; hover preview on a fine pointer only; `aria-expanded`; axe clean in en and ar, light and dark.
- E2E on the local stack: open a "?" on a phone viewport and check the popover's box is inside the viewport; follow Learn more to the anchor; search the guide.

## Costs

Static text bundled with each admin: no database reads, no AI calls, no new services. Per area page about 10–40 KB of JSON per language, served from the CDN cache. No per-video or per-view cost.

## Legal and safety

- Help text states what laws and store rules say, with a link to the official source; it never tells an admin what is legal for them. A fixed footer says it is not legal advice.
- Each `rules` entry is checked by the cross-provider reviewer against its source; the entry records the source URL.
- No personal data, no secrets in content.

## Owner decisions

1. **AH-D1: Legal and policy notes in the help.** (a) State the rule as a fact, link the official source, and show a "not legal advice" footer; (b) leave laws out and only describe behavior; (c) have counsel review each note before it ships. **Recommendation: (a)**, because the owner asked for "what laws or cautions", (b) drops that, and (c) blocks every area PR on an outside review. The reviewer on each PR checks every note against its source, and counsel can review the whole set later without changing the design.
2. **AH-D2: Who edits the help text.** (a) In code, through PRs (reviewed, translated, CI-checked, one source with the setting it describes); (b) editable in the admin like CMS content. **Recommendation: (a)**: the text describes code behavior and must change in the same PR as the code; the coverage check only works when both live together.

Routine choices decided by the orchestrator: every admin role reads the guide; hover preview on desktop; no feature switch; the content format above.
