[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# CMS page builder: pages from typed blocks

| | |
|---|---|
| **ID** | `AUN-CMS-PAGE-BUILDER` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (canonical module, videos About page), [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md) (editor, storage, public API), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) (www, scholar sites) |
| **Status** | **in progress** (PRs open, held for the owner's screenshot review) |
| **Last updated** | 2026-11-14 |
| **Origin** | Owner in chat, 2026-11-14: "there should be a way to add elements like squarespace, not pure html, spec, design, implement" |

> Builds on [CMS-PAGE-BLOCKS](CMS-PAGE-BLOCKS-cms-page-blocks.md) (the first 11 block types, CMS #48). The About page that started it is AlUmmahNowCMS#130, AlUmmahNowUI#109 and AlUmmahNow#1360.

## Goal

Staff build pages the way they would in Squarespace. They add sections from a picker, fill in typed fields, choose from a few style options and see the result live. There is no raw HTML or CSS anywhere. The page looks the same in the editor preview, on www, on a scholar site and on the videos site, in every Fanous theme, light and dark, English and Arabic.

## 1. Research

We compared the editors staff already know with what our sites can safely render:

- **Squarespace** (sections and blocks, a section picker with thumbnails, per-section background and width);
- **Wix Studio**;
- **Webflow** (class-based styling, too free-form for us);
- **WordPress Gutenberg** (block list beside the canvas, block toolbar with move, duplicate and remove);
- **Notion** (slash menu, folded blocks);
- **YouTube Studio's channel layout** (ordered shelves of videos and playlists).

What we took:

- **Sections, not free placement.** A page is an ordered list of full-width sections. Each section has a small set of style choices: alignment, width, tone and spacing. Free x/y placement breaks on phones and in RTL, and it can't follow theme tokens.
- **A picker with schematic thumbnails**, grouped and searchable. Enter adds the first match.
- **Inline structure, typed fields.** Headings, lists, buttons and cards are fields, never markup. Prose fields accept a small markdown subset (bold, italic, links, lists).
- **A live preview drawn by the same renderer as the sites**, with device, language, light/dark and theme toggles.
- **No custom CSS, no embeds of arbitrary HTML.** Every style is a theme token, so a new theme restyles every page by itself.

## 2. Block catalogue

Seventeen types, stored schema version 2. Version 1 was the 11 types from CMS #48. Version 2 adds per-block styles and six new types.

| Group | Blocks |
|---|---|
| Layout | hero (gradient, image or plain; title, eyebrow, subtitle, up to 2 buttons; height S/M/L), layout (2–3 columns of image + heading + text + link), columns (text beside an image), divider and spacer |
| Basics | text (markdown), image (content, wide or full width; caption), gallery (2–4 columns), quote or callout |
| Sections | cards (2–4 columns; image, title, text, link), feature list and stats (icons from a fixed set of 16), FAQ (opens without JS), call to action, and a full-width band preset of it, contact (contact page or an email address) |
| Videos and posts | video (a facade that links to the watch page), video shelf (videos, playlists, channels, snapshotted server-side), latest posts or posts by tag or picked posts, card posts (www's paged grid) |

Limits are in the module: up to 80 blocks per page, 24 gallery images, 24 shelf items, 30 FAQ entries and 12 stats. Text lengths are capped per field.

## 3. Typed fields, theme-safe styles

- **Fields only.** Every value goes through `normalizePageBlocks`, which checks types, lengths, URLs (site paths, https, mailto) and emails. A bad block is refused with a message on that block. An incomplete block is kept but marked "Hidden on the site until it is complete".
- **Styles.** Each block offers only the style options its type allows (`STYLE_OPTIONS`):
  - align: start or center;
  - width: text 46rem, wide 76rem, full;
  - tone: none, soft, card, accent or night;
  - spacing: S/M/L.
- **CSS** (`page-blocks.css`):
  - Fanous `--fanous-*` tokens only, so every theme is right by construction;
  - logical properties only, so RTL mirrors itself;
  - container queries, not media queries, so a block lays out by the width it has and the CMS phone preview is faithful;
  - no `style` attributes, because www's CSP is `style-src 'self'`.
- **Frosted glass** (owner, 2026-11-15). Toned panels (soft, card, accent, night) and the hero card are frosted glass with a golden glow:
  - the theme's surface at 62% over `backdrop-filter: blur(16px) saturate(1.2)` (with `-webkit-`), so the lantern street shows through softly;
  - a thin line and an outer glow (`0 0 32px`) in the theme's primary: Fawanees gold, other themes their own. No ornaments;
  - 94% surface without `backdrop-filter` or with `prefers-reduced-transparency`; print drops the blur and the glow;
  - the blur sits on static boxes only, never on a scrolling or animated layer (the street is off on the watch page, AlUmmahNow #1233).
- **One glass for every info page.** Any host box reuses the same style with `class="pb-glass"` (`pb-glass-stack` and `pb-glass-box` give text pages their spacing and shape); hosts never copy it. Every static text or info page shows its sections in these boxes:
  - **videos site:** About (one box per `##` section), Community Guidelines (one per section), Privacy & data, Help (the tour card and each topic section), Contact (the form and the side box);
  - **www:** every CMS page that is only text (markdown blocks), such as Privacy, Terms, the Cookie policy and About as migrated: one box per `##` section (`packages/render/src/glass-sections.ts`). Pages built from blocks get the glass on their toned panels;
  - **scholar sites:** About (its text, and the channel's links in a box of their own) and every site page that is only text.
- **Contrast.** Text on the glass is measured against the darkest and the lightest pixel behind it, with the street showing through, at three scroll positions, in every theme, light and dark. The checks are AlUmmahNowUI `apps/www/e2e/page-blocks-glass.spec.ts` and AlUmmahNow `apps/web/e2e/release/static-pages-glass.spec.ts`.
- **Escaping.** The renderer escapes every editor value, checks every URL and writes image dimensions only as whole numbers. Hosts insert its HTML as is (Astro `set:html`, React `dangerouslySetInnerHTML`, the preview iframe's `srcdoc`).

## 4. Editor (AlUmmahNowCMS)

Full description: [AlUmmahNowCMS/docs/ADMIN_UI_SPEC.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/ADMIN_UI_SPEC.md), "Blocks".

- **Block picker.** Presets in four groups, each with a schematic thumbnail, a name and what it is for. A filter box narrows them, and Enter adds the first match. It opens from the end of the list or from *Add below* on any block.
- **Block cards.** Each card shows the block's icon, name and first words. On a page with more than two blocks, every block starts folded to that line. Buttons: Move up, Move down, Duplicate and Remove (with Undo). Alt+↑/↓ reorders from any field, and so does the grip. Nested items (buttons, columns, cards, questions, features) reorder, duplicate and remove the same way. Every change is announced in an `aria-live` region.
- **The builder workspace** (*Open the page builder*). A full-screen view with the block list beside a live preview in a sandboxed frame, drawn by the sites' own renderer and stylesheet.
  - Toolbar: Desktop (scaled to fit) or Phone (390 px), this language or the other one, Light or Dark, and a preview-only theme. The site's active theme never changes here.
  - Clicking a section in the preview opens its block.
  - On a phone-sized screen the preview sits under the block list and opens on Phone. Whenever the list is narrow, a block's buttons go on a row under its name, so the name stays readable.
- **Media and content.** Images come from the media library chooser or a new upload; generated names mean an upload never replaces a file. Posts are picked from a search in the page's language. Videos use the existing picker and are snapshotted server-side.
- **Drafts, publish, revisions.** These are the CMS's existing page workflow. A page stays a draft until it is published. Every save is a revision, and History shows each block's words plus its style changes.
- **English and Arabic.** Each language is its own page, linked by translation key. *Copy from {other language}* replaces the blocks with the other page's (images and layout included) as a starting point for translation, with Undo in the toast. Prose fields are spell-checked in the page's language.
- **Roles.** The same staff roles that edit pages today. No new role.

## 5. Storage and migration

- `pages.blocks` holds the stored JSON. Older readers keep working because `body` stays in step: it is the blocks' text as markdown (`blocksToMarkdown`).
- **Versioning.** Stored blocks carry no per-block version. `normalizePageBlocks` reads version 1 shapes (no `appearance`; divider `style`) and upgrades them on read, so no data rewrite is needed. `PAGE_BLOCKS_VERSION` is bumped only when stored data needs an upgrade step.
- Changes are additive: a new type, field or option, never a rename. A host skips a served type it doesn't know.

## 6. Public API and renderer

- The public API serves the **served** shape (`servePageBlocks`):
  - media resolved to `{url, alt, width, height, variants}`;
  - videos with snapshots;
  - posts as summaries.

  Contract: [AlUmmahNowCMS/docs/PUBLIC_API.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/PUBLIC_API.md), "Blocks". A page saved before blocks existed is served as one markdown block.
- **One renderer, one stylesheet** (`renderPageBlocks`, `page-blocks.css`):
  - The canonical copy is in AlUmmahNow `packages/shared-types/src/` (`page-blocks.ts`, `page-blocks.sample.ts`, `page-blocks.css`). It has no imports and only erasable TypeScript.
  - AlUmmahNowCMS and AlUmmahNowUI vendor it byte for byte, pinned to a monorepo commit (`npm run sync:page-blocks -- --ref <sha>`). CI runs `check:page-blocks`, which fails when a vendored file differs from the pinned commit.
  - The videos site imports it from `@al-ummah/shared-types` (CSS: `@al-ummah/shared-types/page-blocks.css`).
- **Hooks.** Each host plugs in its own parts:
  - `href`: link rules;
  - `image`: www's responsive `<picture>`;
  - `markdown`: www's body renderer with video facades;
  - `video`, `watchHref`, `postHref`;
  - `slot`: a host component takes the block's place, behind the marker `<!--pb-slot:{id}-->`.
- **Hosts:**
  - www fills slots for the paged card-post grid, video shelves (fresh from the videos API) and post lists.
  - The scholar sites map their Studio blocks to the served shapes.
  - The videos About page sends site paths to www, opens videos, playlists and channels on the videos site, and turns a card-post grid into a call to action to the www page.
- A page whose first block is a hero has no separate header: the hero's title is the page's h1. If the hero has no title, it shows the page title.

## 7. The About page

Migration `0022_about_blocks` lays out the seeded About page (0021) with blocks:

- a hero with the page title and the owner's first line;
- "What you'll find here" as a feature list with icons;
- "Get started" in a soft panel.

The words are the owner's, verbatim. It changes only a page that is still exactly as 0021 seeded it. A page an editor already changed is left alone. Every changed row is copied to `pages_backup_0022` first.

The videos site's About page (`/[locale]/about`) renders the blocks the same way. A page that is only text keeps the existing prose card.

## 8. The sample page

`page-blocks.sample.ts` defines one page with every block type, in English and Arabic. It is the one fixture for:

- the unit tests in every repo;
- the E2E stubs (www, scholar sites);
- the screenshots.

The CMS E2E builds pages through the editor itself.

## 9. Background work

None. Validation, serving and rendering run synchronously in the request; video snapshots use the CMS's existing snapshot refresh. If a block later needs background work, it goes through a queue with retry and DLQ, and failures show on the admin Errors page ([O26](decisions.md#o26-always-async-with-admin-visible-errors)).

## 10. Tests

- **AlUmmahNowCMS:**
  - unit and worker tests: validation, upgrade, serving, contract fixture, migration 0022;
  - `e2e/local/page-builder.local.spec.ts`, en and ar admin on desktop and phone. It builds a page from the picker (hero, features, FAQ, call-to-action band), checks the live preview and the phone frame, publishes, and reads it back from the public API. The Arabic page is made with *Copy from English*, edited and published. axe runs on the editor and on the preview frame.
- **AlUmmahNowUI:**
  - www `tests/blocks.test.ts`;
  - www `e2e/page-builder.spec.ts`: the sample page, every type, en/ar × dark/light, desktop and phones, axe, no sideways overflow;
  - sites `e2e/sites.spec.ts`: a Studio page with every Studio type, en and ar.
- **AlUmmahNow:**
  - `apps/web` jest covers the About blocks, the route and `toCmsPage`. A local Next run against a stub CMS serving the sample page checks dark mode on desktop and Pixel 7 in en and ar, plus light mode, with axe.
  - Cross-app, `apps/web/e2e/79-page-builder-cross-app.spec.ts` on the local stack: a staff user signed in through the local Auth builds the About page in the CMS editor and publishes it in English, then in Arabic (*Copy from English*, translated). The page then shows on www and on the videos About page in both languages. It skips until the released CMS and www carry the page builder.
  - `scripts/local-stack/sibling-build.ts` runs the CMS or www on the local stack from a branch or a local checkout, so cross-app changes are tested before the sibling repo releases them.

## Decisions and constraints

- Pages are typed blocks, never HTML ([O34](decisions.md#o34-pages-are-built-from-typed-blocks-never-html)): "add elements like squarespace, not pure html" (owner, 2026-11-14).
- Themes are real per-component design, not a recolour: blocks read Fanous tokens and materials, and a site's active theme is never changed by the editor's preview ([O20](decisions.md#o20-buildable-theme-packages-in-admin)).
- Platform-wide: cost cap ≤ $500/month ([O1](decisions.md#o1-whole-platform-cost-cap)); bilingual en/ar with RTL; always async with admin-visible errors ([O26](decisions.md#o26-always-async-with-admin-visible-errors)).

## Status evidence

- AlUmmahNow [#1368](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1368): canonical module, videos About page
- AlUmmahNowCMS [#136](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/136): editor, migration 0022, public API
- AlUmmahNowUI [#112](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/112): www and scholar sites
- Frosted glass on panels and every info page: AlUmmahNow [#1481](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1481), AlUmmahNowCMS [#138](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/138), AlUmmahNowUI [#122](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/122)

## Sources

- Owner request in chat, 2026-11-14.
- The PRs above and the module header of `packages/shared-types/src/page-blocks.ts`.
