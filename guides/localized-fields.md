[← Home](../README.md)

# Localized fields: English and Arabic, both set

Owner rule, 2026-11-16:

> Everywhere, if there is a field that is localizable, then either the admin has to set it, or you provide a translation service from one to the other; only exception is users' content.

It came up on the videos admin **Add tier** form, which said "Arabic name: Leave empty to use the name above". That pattern is gone everywhere.

## What counts

**In scope:** every text that staff or the system set and that is shown in both languages. That includes:

- tier names and descriptions, plans and price display names
- video categories
- CMS pages, lists, featured and page-builder blocks
- site settings labels and menus, including scholar site menus set by staff
- themes
- email and notification templates
- status page components, incidents and maintenance
- help content
- the newsletter
- app-config strings
- Auth admin settings

**Out of scope (user content):** text people write themselves:

- videos, Shorts, live streams, posts, comments and playlists
- channel and profile text
- a scholar's own bio and posts

That content stays in the language it was written in. Viewers can still use the viewer-side title translation ([AUN-CAPTIONS](specs-index.md)).

**User content needs one language only.** Where a user form has English and Arabic tabs (profile names and bio, channel name and description, upload templates, upload title), it saves when **either** language is filled, in the app and in the API. Nothing on those forms may require English (or Arabic) on its own. Both tabs stay mounted, so text typed in one tab survives a switch. The plain field (`name`, `firstName`, `title`…) carries the filled language, English first, so display falls back to the other language. The web helper is `apps/web/src/lib/localized-input.ts` (`hasAnyLanguage`, `primaryText`, `englishOf`). Background: 2026-11-19 prod report, profile create required the English first name (AlUmmahNow #1606).

### When staff work on user content

Decided 2026-11-24, with the bilingual admin forms ([AlUmmahNow#1814](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1814)):

- **Creating:** when staff create something (a channel, an invite with a channel, a category, a status incident, a theme), the form needs English and Arabic. System content always needs both.
- **Editing:** when staff edit a user's existing channel or video that has one language only, the missing language is offered, with Translate, but it isn't required. A small fix is never blocked, and nothing the user wrote is rewritten unless staff change it. Text that has both languages keeps both. An optional description can be cleared.

## Rules

1. **Both languages are first-class fields.** The form has an English and an Arabic field side by side. No field says "leave empty to use the other one".
2. **Saving needs both.** A missing language is a validation error, both in the API and inline in the form.
3. **No silent fallback.** A page shown in Arabic never shows the English text of a staff-set field, and the reverse is true too. Older rows that are missing one language show an **Arabic missing** (or **English missing**) badge in admin, and list pages can filter by it. Each feature's page says how a public surface handles such a row until it is fixed.
4. **Translate.** Each pair has a **Translate** button in each direction: English → Arabic and Arabic → English. It fills the other field. The result stays editable and is saved only when the admin saves. It never overwrites text that is already there without an undo. List pages have **Translate missing**, which fills the gaps for review. Machine output is never published unseen.
5. **The in-house service only.** Translation runs on Cloudflare Workers AI through the existing pipelines: the videos API inline translator (the processor) and the CMS translate route. No third-party AI. Every request is audited and capped.
6. **Wording.**
   - Translations use the CMS glossary.
   - Translations follow the [Arabic wording for video](glossary.md#arabic-wording-for-video): «مرئي / مرئيات».
   - Translations follow the [Copy Tone Guide](copy-tone.md).
   - Qur'an text is never machine-translated. The service refuses it and points to the official text.
7. **Tests** use a mocked translation provider. No paid AI in CI or E2E.

## For builders

- Videos admin: use the shared `LocalizedFieldPair` component and the staff translate endpoint (see the AlUmmahNow repo page).
- CMS: use the CMS translate route with the glossary.
- Auth admin: call the videos staff translate endpoint. Auth runs no AI of its own.
- A new localizable field gets en + ar columns (or an `{en, ar}` object), required validation, the pair component, and a test that saving with one language fails.

Changes by repo are listed in the [changelog](changelog.md).
