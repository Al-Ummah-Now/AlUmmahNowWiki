[← Home](../README.md)

# Theming

Al Ummah Now's design system is called **Fanous**. Its tokens live in [`packages/fanous-tokens`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/packages/fanous-tokens), with generators for web and each native platform.

A theme is a full skin. It changes look and assets, but not layout, features or content structure. Light and dark mode are separate and stay per viewer.

## The four themes

| Theme | Arabic | Type | Status (2026-11-09) |
|---|---|---|---|
| **Lantern** | الفانوس | Standalone | On `main` and deployed |
| **Zujaj** | زجاج | Standalone | In open PR |
| **Nahas** | نحاس | Standalone | In open PR |
| **Fawanees** | فوانيس | Extends Lantern, with a gold override | In open PR, **planned default** |

The theme registry and the three new themes are in [PR #455](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/455).

## How a theme is chosen

**Today on `main`:** Lantern is the deployed theme. [THEMES.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/design/THEMES.md) specifies that the theme changes with a deploy, through `ACTIVE_THEME`.

**Planned:** [PR #492](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/492) makes the theme an **admin site setting**, `site.theme`, with Fawanees as the default. The PR is on hold for the owner.

Under that PR:

- An admin picks the theme on a "Site theme" page. The change is audited.
- The web app ships all four themes and reads the setting on the server, so a change appears within about a minute, with no redeploy.
- There is no per-user theme and no picker in viewer settings.
- Sign-in and profile follow the same setting ([AlUmmahNowAuth #257](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/257)).

When #492 merges, the "changes with a deploy" decision in `THEMES.md` will need updating for the web app.

## Rules for page code

- Use semantic tokens and named slots, never a theme's own files or literal colours.
- Theme colour pairs must meet WCAG 2.1 AA. `pnpm check:tokens` enforces this.
- Generated token files aren't edited by hand. Change the source and run `pnpm tokens:generate`.

**Unverified:** native apps. Their plans use Fanous tokens, but some of those tokens are still placeholders. Android's and Apple's plans track moving to the generated tokens.
