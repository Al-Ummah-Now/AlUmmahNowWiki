[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Admin-managed video categories

| | |
|---|---|
| **ID** | `AUN-VIDEO-CATEGORIES` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (api-videos, admin-api, admin-web, web, processor, shared-types) |
| **Status** | **in progress**: built in [AlUmmahNow#1423](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1423), held for the owner's screenshots |
| **Last updated** | 2026-11-15 |
| **Origin** | Owner request 2026-11-15: "can you add categories in admin? if not make a pr" |

## Goal

Video categories were a fixed list in code (`VIDEO_CATEGORIES`, the 15 categories of
[CHAT-AI-CATEGORIES](CHAT-AI-CATEGORIES-ai-categories.md)). Admins now manage them in
**Videos admin › Categories**: add, rename (English and Arabic), reorder, retire and restore.

## Rules

- **Day one changes nothing.** The list is seeded from the built-in categories in their order.
- **A value never changes.** Each category has a value (slug) stored on videos and channels. It is
  set when the category is added and cannot be edited afterwards, so existing videos keep working.
  Renaming changes only the English and Arabic names.
- **Retire, don't delete.** A retired category is hidden from the upload, Studio and bulk-edit
  pickers, Explore, search filters and suggestions, and AI category suggestions. Videos that
  already have it keep it and still show its name, and editing such a video keeps it. Restore
  makes it available again. At least one category always stays available.
- **Who.** Every admin role can see the page; admins and super admins change it (admin-api
  permission `videos:categories`). Every change is audited, and the page lists the latest
  changes by name.
- **AI.** Each category can have a short hint of what belongs in it. The AI category prompt lists
  only available categories with their hints.
- **Search after a rename.** A queued job (retry, dead-letter queue) updates the search index text
  so viewers find the videos by the new name.
- **Freshness.** Pickers, Explore and search see a change within a minute (cached list,
  invalidated on change). No new services; running cost is negligible.

## Status evidence

- Built: [AlUmmahNow#1423](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1423) (migration 0050 in the search D1,
  `GET /api/categories`, admin-api `/api/video-categories`, admin-web `/categories`, web pickers on the live list,
  processor `CategoryRelabel`). Held for the owner's screenshots; needs release after merge.

## Open questions

- None recorded.

## Sources

- Owner request in chat, 2026-11-15.
- Developer notes: `docs/features/07-video-categories.md` in AlUmmahNow.
