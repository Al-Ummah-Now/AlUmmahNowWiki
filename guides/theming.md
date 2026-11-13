[← Home](../README.md)

# Theming

Al Ummah Now's design system is called **Fanous**. A theme is a full skin. It changes look and assets, but not layout, features or content structure. Light and dark mode are separate and stay per viewer (Light, Dark or System).

There are two sources of theme data in the monorepo:

- **Theme packages** in [`packages/theme-packages`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/packages/theme-packages), in the format described in [`docs/themes/README.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/themes/README.md) (format version 1, with a [JSON Schema](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/themes/theme-package.v1.schema.json)). The web apps compile these to CSS.
- **Fanous tokens** in [`packages/fanous-tokens`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/packages/fanous-tokens), with generators for each native platform. A test keeps the two sources equal.

## The four themes

| Theme | Arabic | Notes |
|---|---|---|
| **Lantern** | الفانوس | The first theme. Standalone. |
| **Zujaj** | زجاج | Standalone. Glass look. |
| **Nahas** | نحاس | Standalone. Copper. |
| **Fawanees** | فوانيس | Based on Lantern with a gold override. **The default.** Version 1.2.0 (owner-approved 2026-11-13, [#1071](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1071)): light mode is a warm off-white page with ivory cards and gold only as accents, and both modes show the [lantern street](#the-lantern-street-fawanees). |

All four are on `main` and ship in every web app. The header is dark in every theme and in both modes. The theme builder refuses a package whose header isn't dark enough for white text.

## How a theme is chosen

An admin picks the site theme in the videos admin, on the **Site theme** page (`site.theme`, [#492](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/492)). The default is Fawanees. Every change is audited and listed under "Recent changes" ([#530](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/530)). There is no per-user theme and no picker for viewers.

Each app reads the setting from the admin API's public site-theme endpoint at runtime, so a change shows within about a minute, with no redeploy:

| App | Follows the site theme | Source |
|---|---|---|
| Videos site and videos admin | Yes, built-in themes and published theme packages | [#525](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/525), [#575](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/575), [#820](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/820) |
| www | Yes, the four built-in themes only. A builder package renders the default ([UI#55](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/55)). | [UI#54](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/54) |
| CMS admin | Yes, the four built-in themes | [CMS#22](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/22), [CMS#95](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/95) |
| Sign-in and profile | Yes. Auth also keeps its own theme packages in the same format, managed in the Auth admin. | [Auth#257](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/257), [Auth#279](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/279) |
| Apple apps | Yes (foundation and first screens) | [Apple#13](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/13), [Apple#14](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/14) |
| Android and Desktop | Not yet. The native theme registry is an open PR. | [#500](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/500) |

If the read fails, the app renders Fawanees. On www and the CMS, `?theme=<id>` previews a built-in theme on QA, stage and local; production ignores it.

www and the CMS don't import the monorepo. Each vendors the compiled theme CSS with `npm run sync:fanous`, pinned to a monorepo commit in its `fanous.lock.json`, and `npm run check:fanous` fails on drift. After a theme change on the monorepo's `main`, both repos need a sync PR.

## The lantern street (Fawanees)

Fawanees hangs garlands of lanterns in the page's free gaps and lets soft distant lights drift behind the content as you scroll. It shows in light and dark, on every site. Design record: [`docs/design/FAWANEES-STREET.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/design/FAWANEES-STREET.md).

- **Theme data.** A theme package switches it on with the optional `street` section (colours and the lights art). The package holds data and art only. Light-only flat styles use the optional `lightStyle` on a component ([`docs/themes/README.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/themes/README.md)). A theme without a street compiles `--fanous-street-on: 0`.
- **One shared module.** [`packages/fanous-tokens/street`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/packages/fanous-tokens/street) draws it. It measures the page and hangs whole lanterns only in real gaps, so no element edge ever cuts one. The far lights move at 0.2× the scroll, and with reduced motion everything stands still. The videos site and the videos admin import it. www ([UI#65](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/65)) and the CMS ([CMS#101](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/101)) vendor it with `sync:fanous`, and Auth vendors it for sign-in, profile and the accounts admin.
- **Each app keeps controls opaque and leaves room.** Nothing may show through a control or text block, and rows and sections get gaps wide enough for a garland while the street is on (`html.fanous-street`). Studio's work area stays plain.
- **Checks.** The "Theme visibility" suite's `street.spec.ts` checks for see-through controls, checks that every lantern on screen is drawn whole (a pixel check), checks that other themes draw no street, and checks reduced motion. www and the CMS have the same checks.

## Theme builder

The theme builder is on the videos admin's Site theme page ([#587](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/587)). Admins can duplicate a theme, edit it with a live preview, publish versions, make one the site theme, and import or export a package as a `.zip`. Moderators can look and export. Packages are stored in R2, with their list and versions in D1 ([#575](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/575)). The preview shows the real colours, and the brand swatches drive the theme ([#963](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/963)). A package that fails the contrast rules can't be published.

## Rules for page code

- Use semantic tokens and named component parts, never a theme's own files or literal colours. `pnpm check:theme-colors` fails on hex values, colour functions and raw Tailwind palette classes in the web apps ([#456](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/456)).
- Theme colour pairs must meet WCAG 2.1 AA. `pnpm check:tokens` checks the tokens, and the "Theme visibility" check measures rendered pages in every theme ([#1018](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1018)).
- Visual screenshot tests pin Lantern. Other themes are covered by the contrast check, not screenshots ([#949](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/949)).
- Generated files aren't edited by hand. Change the source and run `pnpm tokens:generate` or `pnpm themes:build`.

## Known gaps

- [`docs/design/THEMES.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/design/THEMES.md) still says a theme changes "with a deploy" through `ACTIVE_THEME`. A note at its top says the web apps now switch at runtime. The decision table hasn't been updated.
- The Fanous tokens registry still names Lantern as its default, while the site default is Fawanees.
- The theme builder edits colours and styles but has no fields yet for `lightStyle` or `street`.
