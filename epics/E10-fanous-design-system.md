[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 10: Fanous design system

| | |
|---|---|
| **ID** | `E10` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-21 |

> 10.1 tokens done, and since 2026-11-09 extended with four themes and theme packages (see [Themes](AUN-THEMES-themes.md)); 10.2 done except the font choice (D6); 10.3/10.4/10.7 components not started; 10.5 needs a designer; 10.6 web favicons now use the owner's art, while store art and native app icons still need a designer.

## Goal

One design language implemented natively per platform plus web.

## Scope

- Depends on: —

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 10.1 | Tokens as one JSON source generating SwiftUI, Compose, WinUI 3, GTK 4, Tizen NUI, web CSS | Done (`packages/fanous-tokens`). Four themes in a registry (#455) and a CI gate on colours outside the tokens (#456). The web apps now compile theme packages (`packages/theme-packages`, #571); a test keeps them equal to the tokens. |
| 10.2 | Typography licensing & pairing (D6), Eastern Arabic numerals | Done except the choice (D6). |
| 10.3 | Component library | In Progress — both cross-checks agree: Apple#3/Android#3 and web theme packages provide platform components, while #387 leaves the shared component/catalogue scope open.; #387 explicitly lists 10.3 as remaining, but per-platform components exist (Apple#3/Android#3 Fanous components, #571 web theme packages) — partial. |
| 10.4 | 10-foot components | Tokens done, components not started. |
| 10.5 | Iconography & illustration | In Progress — both cross-checks agree: Owner icon art and #335 shipped, but #364 still requires the vector lantern, full icon set and store art.; Iconography brief (#335) and the owner's app icons shipped everywhere; the vector set/store art wait on a designer (#364/#365 open). |
| 10.6 | App icons, splash, store art | Web favicons for every app are the owner's art, cropped and downscaled with no edits (#729), as exact-size PNGs with no SVG in production (#845). Generator: `packages/app-icons`. Splash and store art still need a designer. |
| 10.7 | Component catalogues | Not started. |
| 10.9 | Error-page family (404, 410, 500, crash) on every app | In Review — held for the owner's screenshots: AlUmmahNow#1641, AlUmmahNowAuth#443, AlUmmahNowCMS#148, AlUmmahNowUI#133; spec in wiki PR 144. See [Error-page family](#error-page-family). |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Header (every app)

The one header spec. Change it here and in the code together, never in one app.

One header in every app: videos web, videos admin, www, the developer site (alummahnow.dev),
scholar sites, status, CMS admin, auth
admin, profile and the sign-in pages (owner, 2026-11-14: "UNIFY"; every difference between apps is
a bug). Based on www and the videos web, which the owner reviewed. The repo copy is AlUmmahNow
`docs/design/NAV.md` ("Header"); the two say the same thing.

**Shared code.** AlUmmahNow `packages/fanous-tokens/nav/aun-nav.css` styles it and `nav/header.js` builds the markup (brand,
environment badge, menu button, language, light/dark, Sign in). Worker, Hono and Astro apps render
the builders, or a byte-identical copy checked by the repo's Fanous sync check. React apps render
the same elements as JSX and their tests compare the result with the builders.

**Bar** (`.aun-header`; `.aun-header-row` inside it only when an app's markup wraps the groups):
- 4rem (64px) tall; 3.5rem (56px) below 640px, the 1px bottom border included, with or without a
  `.aun-header-row` inside (the row is the height less the border). Sticky at the top.
- Background `--aun-header-bg` (an app's header material) else `--fanous-c-nav-bg`; 1px bottom
  border `--fanous-c-nav-border`; text `--fanous-c-nav-text`.
- **Full width in every app.** The bar's groups are never centred in a max width: the brand is
  16px from the screen's edge (12px on phones) in www, scholar sites, status and profile exactly as
  in videos web and the admins, so every header lines up.
- **One typeface** in every header, set by the contract whatever the page uses: system-ui
  (`--aun-header-font`), Arabic 'Noto Naskh Arabic' then Geeza Pro, then system-ui so Latin inside an Arabic header matches English (`--aun-header-font-ar`).
- **One line on every screen.** The bar never wraps to a second row (`flex-wrap: nowrap`); when
  room runs out the brand is the one group that shrinks, and its wordmark (a long scholar site
  name too) ends in an ellipsis; below 400px it is hidden and the logo stays. Sites whose own links sit in
  the bar (www, scholar sites, the dev site) mark that group `.aun-header-primary.aun-collapse`:
  below 1024px it leaves the bar and the menu button (`menuButtonHtml`, slot 1) opens an
  `.aun-header-panel` popover right under the bar with those links and the search. It opens
  without script (`popovertarget`), Escape and a tap outside close it.
- Padding-inline 16px (12px below 640px). Gap between groups 16px, 12px below 1024px, 8px below
  640px, 4px below 400px. Inside the tools group 8px (4px below 640px).

**Order** (reading order; it mirrors in Arabic; `HEADER_ORDER` in `nav/header.js`: menu, brand, env,
primary, actions, lang, mode, account):

**No links to other sites in the header or side rail** (owner, 2026-11-15): no Website / Videos
pills, and no "Website" item in the videos side rail or drawer, at any width. The logo leads to the
app's own home; the other apps are in the account menu's "Al Ummah Now apps" (and, on status, which
has no account menu, the page footer). Pages with no account menu and no footer link (the sign-in
pages, a scholar site whose platform mark is "none") have no route to www; that is accepted
(owner, 2026-11-15).

**Scholar sites keep their own theme colours** (owner, 2026-11-15). The header's layout, sizes and
controls are the same as every app's; its colours come from the site's admin-chosen theme through the
nav tokens (`--fanous-c-nav-*`, `--aun-header-bg`), so a Nahas site has Nahas's dark header. No app
CSS overrides the header colours.

| # | Slot | Class | Notes |
|---|---|---|---|
| 1 | Menu | `.aun-icon-btn.aun-menu-btn` | Lucide `menu`, named "Menu" / "القائمة", 40×40 (never `.aun-menu`: that is the account menu's surface). Apps with a side rail or drawer (always shown), and sites with a panel (`.aun-menu-collapse`, below 1024px only). |
| 2 | Brand | `.aun-brand` | Logo, wordmark, app name (below). Links to the app's own home. |
| 3 | Environment badge | `.aun-env` | "QA" / "STAGE" right after the brand; never in production. |
| 4 | The app's own links or search | `.aun-header-primary` | www links, the videos/CMS search, the admin ⌘K search. Takes only the room the other groups leave (`flex: 1 1 0%`), so a long primary area never pushes the tools to a second line. Present (empty) when an app has none. |
| 5 | App actions | in `.aun-header-tools` | Upload, notifications, Create/New. 2.5rem tall pills. |
| 6 | Language | `.aun-lang` | The other language's own name. |
| 7 | Light/dark | `.aun-icon-btn.aun-mode` | Sun in dark mode, moon in light. |
| 8 | Account | `.aun-acct-btn`, or `.aun-signin` | Signed out: a solid "Sign in", never hidden in a menu. |

**Language first, then sun/moon** in every app (settled 2026-11-14; www and the dev site change to
match). Language and light/dark sit in the header in every app, next to each other in this order. They are
no longer at the foot of a side rail. There is no language dropdown or select anywhere: two
languages, one button.

**Controls.** Every control is 2.5rem (40px) tall, fully round, 1px `--fanous-c-nav-search-border`,
transparent, text 15px/500 `--fanous-c-nav-text`, hover `--fanous-c-nav-hover`. Icons are 18px.
Focus everywhere is a 2px outline in `--fanous-c-nav-active-text`, offset 2px.
- **Brand.** The owner's logo (`/brand/logo-64.webp`), round, 36px (32px below 640px); 10px to the
  text. Wordmark "Al Ummah Now" / "الأمة الآن", 16px/700 (Arabic 18px); a white-label scholar site
  passes its own site name instead (`brandHtml({ name })`, escaped; never by patching the output).
  Every app but www adds a second line with its name, 12px/500 `--fanous-c-nav-icon`: Videos /
  المرئيات, Admin / الإدارة, Status / الحالة, Developers / «المطوّرون» (alummahnow.dev), Content,
  Accounts admin, Account. Hover `--fanous-c-nav-hover`, radius 10px. Below 400px the text is hidden
  and the logo stays (the text stays the link's name).
- **Environment badge.** 20px tall pill, 11px/700, letter-spacing 0.06em, `--fanous-c-nav-active-text`
  background with `--fanous-c-nav-bg` text. Its name is "QA environment" / "بيئة الاختبار QA".
  Below 400px it sits on the logo's lower inline-end corner (ringed in `--fanous-c-nav-bg`), so it
  takes no room of its own.
- **Language** (`.aun-lang`). Shows the other language's own name in its own `lang`
  (`<span lang="ar">العربية</span>`), `hreflang` on the link. Its name starts with the action in the
  page's language and contains the visible label: "Switch to Arabic: العربية" /
  "التبديل إلى الإنجليزية: English". No aria-label on the language button; the visible label must be
  inside the accessible name (WCAG 2.5.3, axe `label-content-name-mismatch`, which every header axe
  check switches on, in English and Arabic). It keeps the current page and query, each app's way of storing
  the choice (URL prefix, `?lang=`, cookie) and the RTL flip; hreflang alternates are not touched.
  A link built from the request path goes through `samePath()` (`nav/header.js`): leading slashes
  and backslashes collapse to one "/", so `//evil.example` can never become a protocol-relative link
  to another host. A link that starts with a locale prefix (`/ar` + path) is already safe.
- **Light/dark** (`.aun-icon-btn.aun-mode`). One button, no menu and no "System" option (owner
  decision 2026-11-13): Lucide 0.487's sun and moon from `nav/mode-toggle.js`, the moon in light mode
  and the sun in dark. The name is the action ("Switch to light mode" / "التبديل إلى الوضع الفاتح"),
  repeated in `title`, no aria-pressed.
- **Account** (`.aun-acct-btn`). See "Account button". The name is hidden below 768px; below 400px
  the caret is hidden too and the button is the avatar alone. Apps with no sign-in (status) have no
  account control.
- **Sign in** (`.aun-signin`). Solid pill, `--fanous-c-nav-active-text` background, `--fanous-c-nav-bg`
  text, 15px/600, padding-inline 16px.

**Phone** (below 640px): 56px bar, the account name is hidden (from
768px), the brand logo shrinks to 32px; below 400px only the logo shows. Apps with a long primary
area (www links, search) move it to its own row or an icon that opens a sheet; the tools group never
wraps or hides the language, light/dark or account controls.

**Per-app fit.** Where an app's bar holds more than the base, these keep it on one line at every
width from 320px (the language, light/dark and account controls never move):
- *Videos web.* Below 1024px the brand is the logo alone, the search is an icon that opens a sheet,
  and Upload is a 40px icon (its label stays its name). Below 640px the drawer toggle and Upload
  leave the bar for the bottom tab bar (Home, Explore, Upload, Subscriptions, You, More; More opens
  the drawer).
- *Videos admin.* Full width over the sidebar: the ⌘K search is an icon below 1280px and the
  breadcrumbs show from 1024px; below 640px, beside the drawer button, the brand is the logo alone. Public pages (sign-in, access denied) have the same bar, with Sign in when signed out.
- *Status.* No drawer and no account: the page footer links Website and Videos.

There is one sign-out entry, inside the account menu. The header has no separate "Log out" button.

**Drift checks.** Every repo outside AlUmmahNow vendors the shared files (`aun-nav.css`, `header.js`,
`mode-toggle.js` and their types) byte for byte at a pinned commit, with a hash per file in a lock,
and CI fails when a copy differs: www, the dev site and scholar sites `npm run check:fanous`
(AlUmmahNowUI), the CMS `npm run check:fanous`, Auth `pnpm nav:check`. React headers (videos web,
videos admin, Auth admin) have unit tests that render the header pieces and compare them with
`nav/header.js`. Every app's header axe check runs in English and Arabic.

## Surfaces: frosted-glass cards, flat Material everything else

Owner, 2026-11-16 ([O36](decisions.md#o36-one-frosted-glass-surface-primitive-flat-material-elsewhere)). One primitive in every app (videos site and Studio, admin, www, scholar sites, the page builder): AlUmmahNow `packages/fanous-tokens/surfaces/aun-surfaces.css`, vendored by AlUmmahNowUI (`scripts/sync-fanous.ts`).

- **Cards and boxes are frosted glass with a golden edge and glow:**
  - the theme's raised surface at 62% over `blur(16px) saturate(1.2)`;
  - a 1px edge and a soft outer glow in the theme's primary (Fawanees gold, other themes their own).
- **Three glasses:**
  - `aun-glass`: cards, sections and empty states.
  - `aun-glass-lite`: the same without the blur, for rows of long lists, post cards and video cards. A blur per row costs a compositor layer each.
  - `aun-glass-panel`: about 88% opaque with a soft float shadow, for dialogs, menus, listboxes and popovers.
- **Fallbacks:** near-opaque without `backdrop-filter` or with reduced transparency; print drops the glass. No blur on a scrolling or animated layer.
- **Everything else is flat Material:**
  - solid fills, with no gradients, inner sheen or heavy shadows;
  - one radius scale (card 16, panel 20, menu 12, item 8, buttons full) and one spacing scale.
  - Gradients that do work stay: scrims over media, skeleton shimmer, fade edges, the street, and the hero's own gradient option.
- **Buttons:**
  - filled (the theme's primary, gold in Fawanees) for the main action only;
  - tonal or outlined for the rest, text buttons for low emphasis, danger filled;
  - Material state layers on hover and press.
  - Card buttons sit in a footer row at the end edge (`aun-actions`).
- **Menus** (⋮ row menus, account and header menus, sort and filter menus, listboxes) are a flat list on the panel glass:
  - each item has its icon at the start edge, so in Arabic it sits on the right before the label;
  - dividers between groups, and destructive items in the theme's danger **text** colour;
  - they stay on-screen, take the page's direction (never a stamped `dir="ltr"`) and are keyboard accessible (the shared `MenuButton` on the videos site).
- **The frame stays attached** (owner, 2026-11-16, "why is nav floating"):
  - the header stays at the top edge while a page scrolls;
  - the side rail is a full-height column on the inline-start edge (right in Arabic), from the top bar to the bottom of the screen, never a box that ends mid-page;
  - the phone tab bar is attached to the bottom edge with safe-area padding.
  - No glass, transform, filter, perspective, will-change, containment or container type goes on any ancestor of the header, rail, tab bar, menus, dialogs or toasts: any of these makes a fixed child position against that box instead of the screen.
  - Release regression: AlUmmahNow `apps/web/e2e/release/page-frame.spec.ts`.
- **Review shots show what a user sees:** viewport-sized frames at the top, middle and end of each page, in a real browser, never full-page captures. A full-page capture draws a fixed bar once, at the first screen's bottom.
- **RTL:** components never add `flex-row-reverse` for Arabic on top of `dir="rtl"`; the double flip puts avatars, icons and actions on the wrong side.

## Error-page family

Every error screen in every app is one design: a frosted-glass card with a gold edge on the theme's page, inside the app's own header, in Light and Dark, Arabic and English (RTL).

- **404 and 410:** Search, Go back (only with history), Go to home. 410 is for content that was removed for good.
- **500 and crash:** Try again, Go to home, and the error reference with Copy.
- "Still stuck? Contact us" on every page. Arabic uses ٠–٩ («خطأ ٤٠٤»).

| Part | PR | Status |
|---|---|---|
| Videos site and admin | AlUmmahNow#1641 | Held for the owner's screenshots |
| Auth | AlUmmahNowAuth#443 | Held for the owner's screenshots |
| CMS | AlUmmahNowCMS#148 | Held for the owner's screenshots |
| www, sites, dev (shared UI) | AlUmmahNowUI#133 | Held for the owner's screenshots |
| Spec (`guides/error-pages.md`) | wiki PR 144 | Held with its PRs |

## Decisions and constraints

- [D6](decisions.md#d6-fonts): Fonts (open)
- [D8](decisions.md#d8-brand-naming): Brand naming (open)

Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence


GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#309](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/309) | PR | docs: native apps epics (9–24), embeds/discussions/tiers (25–27), AI moderation (28) — onto main | MERGED | 2026-11-08 |
| AlUmmahNow | [#334](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/334) | PR | feat(fanous): design tokens package with per-platform generators (Epic 10) | MERGED | 2026-11-08 |
| AlUmmahNow | [#335](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/335) | PR | docs(fanous): iconography brief and app-icon size matrix (Epic 10.5, 10.6) | MERGED | 2026-11-08 |
| AlUmmahNow | [#364](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/364) | issue | Fanous: commission vector lantern, icon set and store art (owner, designer) | OPEN | 2026-11-08 |
| AlUmmahNow | [#365](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/365) | issue | Fanous: owner decisions D6 fonts, D8 naming, light-theme accent | OPEN | 2026-11-08 |
| AlUmmahNow | [#387](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/387) | issue | Fanous: remaining Epic 10 stories 10.3, 10.4 and 10.7 (components and catalogues) | OPEN | 2026-11-08 |
| AlUmmahNowApple | [#7](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/7) | issue | Swap interim seams: aun-core XCFramework and generated Fanous tokens | OPEN | 2026-11-08 |

Since that sweep (2026-11-12): the theme registry [AlUmmahNow#455](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/455), colour gate [AlUmmahNow#456](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/456), theme packages [AlUmmahNow#564](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/564), [AlUmmahNow#571](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/571), [AlUmmahNow#575](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/575), and app icons [AlUmmahNow#691](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/691), [AlUmmahNow#729](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/729), [AlUmmahNow#845](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/845) merged, with matching favicon PRs in [AlUmmahNowUI#49](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/49) and [AlUmmahNowCMS#86](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/86). Issues #364, #365 and #387 are still open.

### Reconciled 2026-11-21

- **E10 / Component library (AUN-271): In Progress** — both cross-checks agree: Apple#3/Android#3 and web theme packages provide platform components, while #387 leaves the shared component/catalogue scope open.; #387 explicitly lists 10.3 as remaining, but per-platform components exist (Apple#3/Android#3 Fanous components, #571 web theme packages) — partial.
- **E10 / Iconography & illustration (AUN-273): In Progress** — both cross-checks agree: Owner icon art and #335 shipped, but #364 still requires the vector lantern, full icon set and store art.; Iconography brief (#335) and the owner's app icons shipped everywhere; the vector set/store art wait on a designer (#364/#365 open).
## Open questions

- None recorded in the sources.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [docs/native-apps/EPIC-10-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPIC-10-PLAN.md)
