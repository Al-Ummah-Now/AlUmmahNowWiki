[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 10: Fanous design system

| | |
|---|---|
| **ID** | `E10` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-14 |

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
| 10.3 | Component library | Not started (built per platform in Epics 12, 15, 16). |
| 10.4 | 10-foot components | Tokens done, components not started. |
| 10.5 | Iconography & illustration | Requirements doc; needs a designer. |
| 10.6 | App icons, splash, store art | Web favicons for every app are the owner's art, cropped and downscaled with no edits (#729), as exact-size PNGs with no SVG in production (#845). Generator: `packages/app-icons`. Splash and store art still need a designer. |
| 10.7 | Component catalogues | Not started. |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Header (every app)

The one header spec. Change it here and in the code together, never in one app.

One header in every app: videos web, videos admin, www, the developer site (alummahnow.dev),
scholar sites, status, CMS admin, auth
admin, profile and the sign-in pages (owner, 2026-11-14: "UNIFY"; every difference between apps is
a bug). Based on www and the videos web, which the owner reviewed. The repo copy is AlUmmahNow
`docs/design/NAV.md` ("Header"); the two say the same thing.

**Shared code.** AlUmmahNow `packages/fanous-tokens/nav/aun-nav.css` styles it and `nav/header.js` builds the markup (brand,
environment badge, app links, language, light/dark, Sign in). Worker, Hono and Astro apps render
the builders, or a byte-identical copy checked by the repo's Fanous sync check. React apps render
the same elements as JSX and their tests compare the result with the builders.

**Bar** (`.aun-header`; `.aun-header-row` inside it only when an app's markup wraps the groups):
- 4rem (64px) tall; 3.5rem (56px) below 640px. Sticky at the top.
- Background `--aun-header-bg` (an app's header material) else `--fanous-c-nav-bg`; 1px bottom
  border `--fanous-c-nav-border`; text `--fanous-c-nav-text`.
- **Full width in every app.** The bar's groups are never centred in a max width: the brand is
  16px from the screen's edge (12px on phones) in www, scholar sites, status and profile exactly as
  in videos web and the admins, so every header lines up.
- **One typeface** in every header, set by the contract whatever the page uses: system-ui
  (`--aun-header-font`), Arabic 'Noto Naskh Arabic' then Geeza Pro / Tahoma (`--aun-header-font-ar`).
- **One line on every screen.** The bar never wraps to a second row. Sites whose own links sit in
  the bar (www, scholar sites, the dev site) mark that group `.aun-header-primary.aun-collapse`:
  below 1024px it leaves the bar and the menu button (`menuButtonHtml`, slot 1) opens an
  `.aun-header-panel` popover right under the bar with those links and the search. It opens
  without script (`popovertarget`), Escape and a tap outside close it.
- Padding-inline 16px (12px below 640px). Gap between groups 16px, 12px below 1024px, 8px below
  640px. Inside the tools group 8px (4px below 640px).

**Order** (reading order; it mirrors in Arabic):

| # | Slot | Class | Notes |
|---|---|---|---|
| 1 | Menu | `.aun-icon-btn.aun-menu` | Lucide `menu`, named "Menu" / "القائمة", 40×40. Apps with a side rail or drawer (always shown), and sites with a panel (`.aun-menu-collapse`, below 1024px only). |
| 2 | Brand | `.aun-brand` | Logo, wordmark, app name (below). Links to the app's own home. |
| 3 | Environment badge | `.aun-env` | "QA" / "STAGE" right after the brand; never in production. |
| 4 | The app's own links or search | `.aun-header-primary` | www links, the videos/CMS search, the admin ⌘K search. Takes the free space. |
| 5 | App actions | in `.aun-header-tools` | Upload, notifications, Create/New. 2.5rem tall pills. |
| 6 | App links | `.aun-apps` › `.aun-app` | Website and Videos: the public sites other than this one. |
| 7 | Language | `.aun-lang` | The other language's own name. |
| 8 | Light/dark | `.aun-icon-btn.aun-mode` | Sun in dark mode, moon in light. |
| 9 | Account | `.aun-acct-btn`, or `.aun-signin` | Signed out: a solid "Sign in", never hidden in a menu. |

**Order of language and light/dark (settled 2026-11-14):** language first, then sun/moon, in every app (www, the dev site and every other header). This matches the owner's ask, a language button "next to the sun/moon button", and NAV.md; www and the dev site, which had sun/moon first, change to match.

Language and light/dark sit in the header in every app, next to each other in this order. They are
no longer at the foot of a side rail. There is no language dropdown or select anywhere: two
languages, one button.

**Controls.** Every control is 2.5rem (40px) tall, fully round, 1px `--fanous-c-nav-search-border`,
transparent, text 15px/500 `--fanous-c-nav-text`, hover `--fanous-c-nav-hover`. Icons are 18px.
Focus everywhere is a 2px outline in `--fanous-c-nav-active-text`, offset 2px.
- **Brand.** The owner's logo (`/brand/logo-64.webp`), round, 36px (32px below 640px); 10px to the
  text. Wordmark "Al Ummah Now" / "الأمة الآن", 16px/700 (Arabic 18px). Every app but www adds a
  second line with its name, 12px/500 `--fanous-c-nav-icon`: Videos, Admin, Status, Content, Accounts
  admin, Account. Hover `--fanous-c-nav-hover`, radius 10px. Below 400px the text is hidden and the
  logo stays (the text stays the link's name).
- **Environment badge.** 20px tall pill, 11px/700, letter-spacing 0.06em, `--fanous-c-nav-active-text`
  background with `--fanous-c-nav-bg` text. Its name is "QA environment" / "بيئة الاختبار QA".
- **App links.** The app icon (`/aun-nav/icons/<id>.webp`, 22px round) and the name ("Website" /
  "الموقع", "Videos" / "المرئيات"). Below 1280px the icon alone, at 40×40; the name stays the
  accessible name. Below 640px they leave the bar; on phones they are in the account menu's "Al Ummah
  Now apps", the drawer, or (apps with neither) the page footer.
- **Language** (`.aun-lang`). Shows the other language's own name in its own `lang`
  (`<span lang="ar">العربية</span>`), `hreflang` on the link. Its name starts with the action in the
  page's language and contains the visible label: "Switch to Arabic: العربية" /
  "التبديل إلى الإنجليزية: English". No aria-label on the language button: an aria-label without the visible
  label fails WCAG 2.5.3 (axe `label-content-name-mismatch`, the status page's Arabic bug). Every
  app's header axe check runs in English and Arabic with that rule turned on (it is off by default). It keeps the current page and query, each app's way of storing
  the choice (URL prefix, `?lang=`, cookie) and the RTL flip; hreflang alternates are not touched.
- **Light/dark** (`.aun-icon-btn.aun-mode`). One button, no menu and no "System" option (owner
  decision 2026-11-13): Lucide 0.487's sun and moon from `nav/mode-toggle.js`, the moon in light mode
  and the sun in dark. The name is the action ("Switch to light mode" / "التبديل إلى الوضع الفاتح"),
  repeated in `title`, no aria-pressed.
- **Account** (`.aun-acct-btn`). See "Account button". The name is hidden below 768px.
- **Sign in** (`.aun-signin`). Solid pill, `--fanous-c-nav-active-text` background, `--fanous-c-nav-bg`
  text, 15px/600, padding-inline 16px.

**Phone** (below 640px): 56px bar, the app links leave the bar, the account name is hidden (from
768px), the brand logo shrinks to 32px; below 400px only the logo shows. Apps with a long primary
area (www links, search) move it to its own row or an icon that opens a sheet; the tools group never
wraps or hides the language, light/dark or account controls.

There is one sign-out entry, inside the account menu. The header has no separate "Log out" button.


**Drift checks.** Every repo outside AlUmmahNow vendors the shared files (`aun-nav.css`, `header.js`,
`mode-toggle.js` and their types) byte for byte at a pinned commit, with a hash per file in a lock,
and CI fails when a copy differs: www, the dev site and scholar sites `npm run check:fanous`
(AlUmmahNowUI), the CMS `npm run check:fanous`, Auth `pnpm nav:check`. React headers (videos web,
videos admin, Auth admin) have unit tests that render the header pieces and compare them with
`nav/header.js`. Every app's header axe check runs in English and Arabic.

## Decisions and constraints

- [D6](decisions.md#d6-fonts): Fonts (open)
- [D8](decisions.md#d8-brand-naming): Brand naming (open)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
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

## Open questions

- None recorded in the sources.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [docs/native-apps/EPIC-10-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPIC-10-PLAN.md)
